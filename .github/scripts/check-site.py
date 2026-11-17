#!/usr/bin/env python3
"""Check the static build, original URL coverage, redirects, internal assets and anchors."""
import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

LIVE = "https://www.netstim.org"
PROJECT = Path(__file__).resolve().parents[2]


class Document(HTMLParser):
    def __init__(self, file):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.h1 = 0
        self.metadata = {}
        self.broken = []
        self.feed(file.read_text())
        self.close()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "meta":
            key = a.get("name") or a.get("property") or a.get("http-equiv")
            if key:
                self.metadata[key] = a.get("content", "")
            if key == "refresh":
                self.links.append(("redirect", a["content"].split("url=", 1)[-1]))
        if tag == "link" and a.get("rel") == "canonical":
            self.metadata["canonical"] = a.get("href", "")
            return
        if tag == "img" and "alt" not in a:
            self.broken.append("Image has no alt attribute")
        if tag == "iframe" or tag.startswith("netstim-"):
            self.broken.append(f"Unexpected <{tag}> on first load")
        if (tag == "script" and a.get("src") or tag == "link" and a.get("rel") == "stylesheet") and "integrity" not in a:
            self.broken.append("Missing SRI for " + (a.get("src") or a.get("href", "")))
        for key in ("href", "src", "poster"):
            if a.get(key) and not a[key].startswith("data:"):
                self.links.append((tag, a[key]))
        if a.get("srcset"):
            self.links.extend((tag, s.strip().split()[0]) for s in a["srcset"].split(",") if s.strip())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("base", default=LIVE + "/", nargs="?")
    args = parser.parse_args()
    base = urlsplit(args.base)
    prefix = base.path.rstrip("/") + "/"
    root = args.directory
    manifest = json.loads((PROJECT / "tests/migration.json").read_text())
    errors = []

    def path_for(path):
        local = root / unquote(path).lstrip("/")
        return local / "index.html" if local.is_dir() or path.endswith("/") else local

    def check(route, tag, link):
        if link.startswith("mailto:") or link.startswith("tel:"):
            return
        if "ZgotmplZ" in link or "@root@" in link:
            errors.append(f"{route}: unresolved template link {link}")
            return
        parts = urlsplit(urljoin(args.base.rstrip("/") + route, link))
        if parts.hostname not in {base.hostname, "www.netstim.org", "netstim.org"}:
            if tag in ("img", "script", "link"):
                errors.append(f"{route}: external page-load asset {link}")
            return
        path = parts.path or "/"
        if path.startswith("/published_manuscripts/"):
            return
        if parts.hostname == base.hostname and not path.startswith(prefix):
            errors.append(f"{route}: link escaped {prefix}: {link}")
            return
        if path.startswith(prefix):
            path = "/" + path[len(prefix):]
        target = path_for(path)
        if not target.is_file():
            errors.append(f"{route}: missing {tag} target {link}")
        elif parts.fragment and target.suffix == ".html":
            dest = documents.get(target)
            if dest and unquote(parts.fragment) not in dest.ids:
                errors.append(f"{route}: missing fragment {link}")

    for route in set(manifest["crawl"]) | set(manifest["rest"]):
        if not path_for(route).is_file():
            errors.append(f"Missing original route {route}")
    if manifest["missing_images"]:
        errors.append(f"Unresolved original images: {manifest['missing_images']}")
    htaccess = (root / ".htaccess").read_text()
    for old, target in manifest["redirects"].items():
        match = re.escape(old.strip("/")) + ("/?" if old.endswith("/") else "")
        if f"RewriteRule ^{match}$ {target} [R=301,END]" not in htaccess:
            errors.append(f"Missing Apache 301 {old} → {target}")
        if not path_for(target).exists():
            errors.append(f"Missing redirect destination {target}")
        if old.endswith("/") and not path_for(old).is_file():
            errors.append(f"Missing project-preview fallback {old}")
    for ident, target in manifest["ids"].items():
        if f"^(?:p|page_id)={ident}$\n  RewriteRule ^(?:index\\.php)?$ {target} [R=301,END,QSD]" not in htaccess:
            errors.append(f"Missing WordPress numeric redirect {ident}")

    documents = {file: Document(file) for file in root.rglob("*.html")}
    for file, doc in documents.items():
        route = "/" + file.relative_to(root).as_posix().removesuffix("index.html")
        for tag, link in doc.links:
            check(route, tag, link)
        if "refresh" in doc.metadata:
            continue
        errors.extend(f"{route}: {problem}" for problem in doc.broken)
        if doc.h1 != 1:
            errors.append(f"{route}: expected one h1, found {doc.h1}")
        duplicates = [i for i, count in Counter(doc.ids).items() if count > 1]
        if duplicates:
            errors.append(f"{route}: duplicate ids {duplicates}")
        canonical = doc.metadata.get("canonical", "")
        if not canonical.startswith(LIVE + "/") or doc.metadata.get("og:url") != canonical:
            errors.append(f"{route}: invalid canonical/og:url")
        if ("noindex" in doc.metadata.get("robots", "")) != (args.base.rstrip("/") != LIVE):
            errors.append(f"{route}: incorrect preview indexing policy")
    for file in (root / "css").glob("*.css"):
        for link in re.findall(r"url\(([^)]*)\)", file.read_text()):
            check("/css/" + file.name, "css", link.strip("'\""))
    for file in root.rglob("*.xml"):
        try:
            ET.parse(file)
        except ET.ParseError as error:
            errors.append(f"{file}: {error}")
    search = json.loads((root / "search-index.json").read_text())
    for row in search:
        check("/", "search", row["url"])
    print(f"{len(manifest['crawl'])} original pages, {len(manifest['rest'])} REST links, "
          f"{len(manifest['redirects'])} path redirects, {len(manifest['ids'])} ID redirects, {len(documents)} HTML files.")
    print("\n".join(errors) if errors else "All local URLs, assets, feeds, canonicals and anchors resolve.")
    return bool(errors)


if __name__ == "__main__":
    raise SystemExit(main())
