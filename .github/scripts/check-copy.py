#!/usr/bin/env python3
"""Compare authored text, links and image identities on each migrated route."""
import argparse
from collections import Counter
import difflib
import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import parse_qs, unquote, urljoin, urlsplit

from bs4 import BeautifulSoup, Comment


ROOT = Path(__file__).resolve().parents[2]
LIVE = "https://www.netstim.org"
EQUIVALENT_HOSTS = {"www.netstim.org", "netstim.org", "www.netstim.berlin", "netstim.berlin"}
# Navigation controls and machine metadata. The copy check audits authored elements including off-slide text.
OLD_CHROME = (
    ".hidden,.avia_hidden_link_text,.ZP_ATTR,.comment-reply-link,.avia-slideshow-arrows,.av-click-to-play-overlay,"
    ".avia-slideshow-controls,.avia-content-slider-navigation,.post_author_timeline,"
    ".previous_page,.next_page,.big-prev-fake,.comment-respond,.hr-invisible,svg,script,style,input"
)
# The redesign's own additions: the People portrait index (a second view of the profiles), a post's date in
# its head and the home updates' "All updates" link.
NEW_CHROME = ".citation-list,.bibliography-controls,.video-embed,.page-step,.people-index,.page-head__meta,.section-head .text-action,script,style"
TOKEN = re.compile(r"\w+|[^\w\s]")
MARKUP_NOISE = re.compile(r"</?(?:li|i)>")


def soup(file):
    return BeautifulSoup(file.read_text(), "html.parser")


def text_of(root):
    text = MARKUP_NOISE.sub("", root.get_text(" ", strip=True))
    return TOKEN.findall(unicodedata.normalize("NFC", text).replace("−", "-").casefold())


def url_of(route, url, prefix):
    parsed = urlsplit(urljoin(LIVE + prefix.rstrip("/") + route, url))
    path = unquote(parsed.path)
    if parsed.hostname == "www.netstim.org" and path.startswith(prefix):
        path = "/" + path[len(prefix):]
    if parsed.hostname in EQUIVALENT_HOSTS or (parsed.hostname in {"www.andreas-horn.de", "andreas-horn.de"} and path.startswith("/wp-content/uploads/")):
        path = path or "/"
        if path == "/the-book/":
            path = "/research-interests/the-book/"
        if parsed.fragment in ("respond", "comments"):
            fragment = "#respond"
        else:
            fragment = "#" + unquote(parsed.fragment) if parsed.fragment else ""
        return path + ("?" + parsed.query if parsed.query else "") + fragment
    return unquote(parsed.geturl())


def embed_of(url):
    parts = urlsplit(url)
    host = "www.youtube.com" if parts.hostname == "www.youtube-nocookie.com" else parts.hostname
    return host + parts.path + ("?" + parts.query if parts.query else "")


def strip_old(root):
    for c in root.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for comment in root.select(".comment_container"):
        heading = comment.select_one(".comment-reply-title") or comment.find("h3")
        if heading and heading.get_text(" ", strip=True) == "Leave a Reply":
            for item in list(heading.next_siblings):
                item.extract()
            heading.decompose()
    for element in reversed(root.select(OLD_CHROME)):
        if element.parent:
            element.decompose()


def record(file, route, prefix, original):
    page = soup(file)
    container = page.select_one("#main")
    if container is None and not original:
        # a page that moved is a redirect stub: record where it goes
        refresh = page.select_one('meta[http-equiv="refresh"]')
        target = url_of(route, refresh["content"].split("url=", 1)[-1], prefix) if refresh else ""
        return {"text": ["moved", "to", target], "links": {target: 1}, "images": {}, "embeds": {}}
    if original:
        blocks = container.select(".container_wrap .content")
        sidebar = container.select_one(".inner_sidebar")
        if sidebar and route != "/":
            # The redesign keeps Latest Updates on the home page only (and on Updates itself).
            for widget in sidebar.select(".newsbox"):
                widget.decompose()
        blocks += [sidebar] if sidebar else []
    else:
        # Body first, then what stood in the old sidebar: the home updates, the section's sibling pages.
        blocks = container.select(".page-body, .home-section:not(.home-updates)")
        blocks += container.select(".home-updates, .page-head .section-nav")
    text = []
    links = Counter()
    images = Counter()
    embeds = Counter()
    for block in blocks:
        if original:
            for item in block.select("iframe[src]"):
                embeds[embed_of(item["src"])] += 1
            for script in block.select("script.av-video-tmpl"):
                for item in BeautifulSoup(script.string or "", "html.parser").select("iframe[src]"):
                    embeds[embed_of(item["src"])] += 1
            strip_old(block)
            for thumb in block.select(".news-thumb"):
                if thumb.get("href"):
                    # WordPress linked each sidebar story twice. Hugo combines adjacent links.
                    thumb.unwrap()
        else:
            for item in block.select("[data-embed]"):
                embeds[embed_of(item["data-embed"])] += 1
            for node in reversed(block.select(NEW_CHROME)):
                if node.parent:
                    node.decompose()
        if original:
            for node in block.select(".zpSearchResultsContainer,.zpSearchResultsPagingContainer"):
                node.decompose()
        text.extend(text_of(block))
        for a in block.select("a[href]"):
            value = a["href"]
            if value == "#" or parse_qs(urlsplit(value).query, keep_blank_values=True).get("s") == [""]:
                continue
            links[url_of(route, value, prefix)] += 1
        for image in block.select("img[src]" if original else "[data-original]"):
            value = image.get("src" if original else "data-original")
            if value and not value.startswith("data:"):
                images[url_of(route, value, prefix)] += 1
    band = page.select_one(".title_container .main-title" if original else ".page-head h1")
    return {"text": (text_of(band) if band else []) + text, "links": dict(links), "images": dict(images), "embeds": dict(embeds)}


def diff(a, b):
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return [{"before": " ".join(a[i:j]), "after": " ".join(b[k:l]), "context": " ".join(a[max(0,i-4):j+4])}
            for op, i, j, k, l in matcher.get_opcodes() if op != "equal"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("build", type=Path)
    parser.add_argument("--prefix", default="/")
    parser.add_argument("--source", type=Path, help="Path to the original mirror's site directory.")
    parser.add_argument("--report", type=Path)
    parser.add_argument("--record-source", action="store_true", help="Write the source fixture from --source.")
    args = parser.parse_args()
    data = json.loads((ROOT / "tests/migration.json").read_text())
    baseline = ROOT / "tests/copy-baseline.json"
    if args.source:
        source = {route: record(args.source / route.strip("/") / "index.html", route, "/", True) for route in data["crawl"]}
    else:
        source = json.loads(baseline.read_text())
    if args.record_source:
        if not args.source:
            parser.error("--record-source requires --source")
        baseline.write_text(json.dumps(source, ensure_ascii=False, separators=(",", ":")) + "\n")
    expected_file = ROOT / "tests/copy-exceptions.json"
    expected = json.loads(expected_file.read_text()) if expected_file.exists() else {}
    report = {}
    unexpected = []
    for route in data["crawl"]:
        new = record(args.build / route.strip("/") / "index.html", route, args.prefix, False)
        old = source[route]
        row = {}
        if old["text"] != new["text"]:
            row["text"] = diff(old["text"], new["text"])
        for key in ("links", "images", "embeds"):
            missing = Counter(old[key]) - Counter(new[key])
            added = Counter(new[key]) - Counter(old[key])
            if missing or added:
                row[key] = {"missing": dict(missing), "added": dict(added)}
        if row:
            report[route] = row
        if row != expected.get(route, {}):
            unexpected.append(route)
    if args.report:
        args.report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(source)} routes compared. "
          f"{sum(sum(x['images'].values()) for x in source.values())} image references, "
          f"{sum(sum(x['links'].values()) for x in source.values())} links, "
          f"{sum(sum(x['embeds'].values()) for x in source.values())} embed occurrences. "
          f"Deltas on {len(report)} routes. Unexplained routes: {len(unexpected)}.")
    for route in unexpected:
        print(route, json.dumps(report.get(route, {}), ensure_ascii=False)[:350])
    return bool(unexpected)


if __name__ == "__main__":
    raise SystemExit(main())
