#!/usr/bin/env python3
"""Convert the offline rendered WordPress snapshot. No network or source writes."""
import argparse
from collections import Counter
import hashlib
import html
import json
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urljoin, urlsplit

from bs4 import BeautifulSoup, Comment, NavigableString
from markdownify import markdownify
from PIL import Image
import yaml


ROOT = Path(__file__).resolve().parents[1]
LIVE = "https://www.netstim.org"
LOCAL_HOSTS = {"netstim.org", "www.netstim.org", "andreas-horn.de", "www.andreas-horn.de", "netstim.berlin", "www.netstim.berlin"}
IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".tif", ".tiff", ".bmp"}
FRACTIONS = {
    "one_full": (1, 1), "one_half": (1, 2), "one_third": (1, 3), "two_third": (2, 3),
    "one_fourth": (1, 4), "three_fourth": (3, 4), "one_fifth": (1, 5),
    "two_fifth": (2, 5), "three_fifth": (3, 5), "four_fifth": (4, 5),
    "one_sixth": (1, 6), "five_sixth": (5, 6),
}
LEGACY_REDIRECTS = {
    "/the-book/": "/research-interests/the-book/",
    "/about-us/publications/": "/research-interests/publications/",
    "/about-us-2/publications/": "/research-interests/publications/",
    "/about-us-2/research-interests/": "/research-interests/",
    "/events/categories/imaging-meeting/": "/internal/events/categories/imaging-meeting/",
    "/index.php": "/",
}

BODY_COLLECTIONS = {
    "/about-us/about-us/": "people", "/research-interests/posters/": "posters",
    "/research-interests/videos-talks/": "videos",
}
REMOVE = (
    "script,style,meta,input,.hidden,.avia_hidden_link_text,.av-click-to-play-overlay,"
    ".hr-inner,.avia_button_icon,.iconfont,.av_font_icon,.av-icon-char,.avia-svg-icon:not(a),svg,"
    ".post_author_timeline,.post_delimiter,.big-prev-fake,.post-format-icon,"
    ".avia-slideshow-arrows,.avia-slideshow-controls,.image-overlay,"
    ".avia-content-slider-navigation,.comment-reply-link,.comment-respond,.pingback-edit"
)
BLOCK_TAGS = {"p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "blockquote", "pre", "hr"}
INLINE_TAGS = {"a", "b", "strong", "i", "em", "code", "s", "del"}


class BlockYaml(yaml.SafeDumper):
    """Use YAML block scalars for snippets edited by the lab."""


def block_string(dumper, value):
    return dumper.represent_scalar("tag:yaml.org,2002:str", value, style="|" if "\n" in value else None)


BlockYaml.add_representer(str, block_string)


def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(yaml.dump(value, Dumper=BlockYaml, allow_unicode=True, sort_keys=False, width=110))


def marker(node, name, values):
    node.name = name
    node.attrs = {"data": json.dumps(values, ensure_ascii=False, separators=(",", ":"))}
    node.clear()


def get_class(node, name):
    return name in node.get("class", [])


def content_markdown(node):
    """Emit readable Markdown around structured blocks that need semantic HTML."""
    blocks = []
    for child in node.children:
        if isinstance(child, NavigableString):
            if child.strip():
                blocks.append(str(child).strip())
            continue
        markup = str(child)
        descendants = child.find_all()
        if (child.name in BLOCK_TAGS and not child.attrs and
                not re.match(r"^\d+\.", child.get_text(strip=True)) and
                not any(n.name in {"a", "b", "strong", "em", "i"} for n in descendants) and
                all(n.name in INLINE_TAGS or n.name in {"p", "li", "ul", "ol", "br", "code"}
                    for n in descendants) and
                not any(n.get("id") or n.get("class") or n.get("aria-label") or n.get("target") for n in descendants)
                and not any(n.get("href", "").startswith("@root@") for n in descendants)
                and "\n" not in child.get_text(strip=True)):
            markup = markdownify(markup, heading_style="ATX", bullets="-", strip_document="strip").strip()
        # Paragraph breaks keep the Markdown parser from modifying imported layout blocks.
        if markup:
            blocks.append(markup)
    return "\n\n".join(blocks)


def raw_has_comment(soup):
    return bool(soup.select_one(".content .comment_meta_container"))


class Migration:
    def __init__(self, audit, wp, supplemental):
        self.audit = audit
        self.copy = audit / "copy/site"
        self.wp = wp
        self.supplemental = supplemental
        self.scaffold = audit / "sol-scaffold-cancelled/assets/media"
        self.crawl = json.loads((audit / "verify/pages.json").read_text())
        self.records = {}
        self.routes = {}
        for group in ("posts", "pages"):
            for record in json.loads((audit / f"rest/{group}.json").read_text()):
                route = urlsplit(record["link"]).path
                self.records[route] = (group, record)
                self.routes[record["id"]] = route
        self.readers = {u["id"]: u["slug"] for u in json.loads((audit / "rest/users.json").read_text())}
        self.sizes = {}
        for path in sorted((audit / "rest").glob("media-*.json")):
            for item in json.loads(path.read_text()):
                sizes = [{"source_url": item["source_url"], **item.get("media_details", {})}]
                sizes.extend(item.get("media_details", {}).get("sizes", {}).values())
                for size in sizes:
                    if "source_url" in size:
                        self.sizes[unquote(urlsplit(size["source_url"]).path)] = sizes
        self.manifest = {"crawl": self.crawl, "rest": sorted(self.records), "ids": self.routes, "media": {}, "missing_images": {}, "route_families": {}}
        self.feeds = set()

    def soup(self, route):
        return BeautifulSoup((self.copy / route.strip("/") / "index.html").read_text(), "html.parser")

    def source_file(self, path):
        for base in (self.wp, self.copy):
            file = base / path.lstrip("/")
            if file.is_file():
                return file
        return None

    def image_size(self, path):
        try:
            with Image.open(path) as img:
                return img.size
        except (OSError, ValueError):
            return 0, 0

    def asset(self, route, src, kind, exact=False):
        url = urlsplit(urljoin(LIVE + route, src))
        path = unquote(url.path)
        if kind == "image" and src.startswith("data:"):
            return "", ""
        key = (path if url.hostname in LOCAL_HOSTS else url.geturl(), exact, kind)
        origin = self.source_file(path) if url.hostname in LOCAL_HOSTS else None
        if origin is None and kind == "image":
            variants = sorted(self.scaffold.glob("*-" + Path(path).name))
            if variants and len(Path(path).name) > 8:
                origin = variants[0]
            raw = self.supplemental / "external" / hashlib.sha256(url.geturl().encode()).hexdigest()
            if raw.is_file():
                origin = raw
        if not origin:
            if kind == "image":
                self.manifest["missing_images"][url.geturl()] = route
            return "", url.geturl()
        if kind == "image" and not exact:
            width, height = self.image_size(origin)
            candidates = []
            for choice in self.sizes.get(path, []):
                w, h = choice.get("width", 0), choice.get("height", 0)
                if not (height and h and width < w <= 1600 and abs(w / h - width / height) < .025):
                    continue
                file = self.source_file(unquote(urlsplit(choice["source_url"]).path))
                if file:
                    candidates.append((w, file))
            # Prefer the largest aspect-matched source. Never substitute a differently cropped social thumbnail.
            if candidates:
                origin = max(candidates)[1]
        if kind == "image":
            name = re.sub(r"[^\w.-]+", "-", Path(path).name if origin.parent.name == "external" else origin.name)
            if origin.parent.name == "external" or Path(name).suffix.lower() not in IMAGE_TYPES:
                name += ".png"
            storage = "media/" + hashlib.sha256(origin.read_bytes()).hexdigest()[:12] + "-" + name
            dest = ROOT / "assets" / storage
            ship = path if url.hostname in LOCAL_HOSTS else None
            if ship:
                self.manifest["media"][ship] = storage
        else:
            storage = path
            dest = ROOT / "static" / storage.lstrip("/")
        if not dest.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            if kind == "image" and origin.parent.name == "external":
                with Image.open(origin) as img:
                    img.save(dest, format="PNG")
            elif kind == "image" and origin.stat().st_size > 5_000_000 and origin.suffix.lower() in {".png", ".jpg", ".jpeg"}:
                with Image.open(origin) as img:
                    img.thumbnail((1920, 2200), Image.Resampling.LANCZOS)
                    img.save(dest)
            else:
                shutil.copyfile(origin, dest)
        return storage, url.geturl()

    def link(self, route, src):
        if not src or src.startswith(("mailto:", "tel:")):
            return src
        if src in {"#respond", "#comments"}:
            return "#respond"
        if src.startswith("#"):
            return src
        url = urlsplit(urljoin(LIVE + route, src))
        if url.hostname not in LOCAL_HOSTS:
            return url.geturl()
        path = unquote(url.path)
        fragment = "#" + url.fragment if url.fragment else ""
        if fragment == "#comments":
            fragment = "#respond"
        if path.startswith("/published_manuscripts/"):
            return LIVE + url.path + fragment
        if path == "/Horn_CV.pdf":
            return url.geturl()
        if url.hostname in {"andreas-horn.de", "www.andreas-horn.de"} and not path.startswith("/wp-content/uploads/"):
            return url.geturl()
        to = path.rstrip("/") + "/"
        if to in self.crawl or to in LEGACY_REDIRECTS:
            query = ("?" + url.query) if url.query else ""
            return "@root@" + to.lstrip("/") + query + fragment
        if self.source_file(path):
            storage, _ = self.asset(route, src, "download", exact=True)
            return "@root@" + storage.lstrip("/") + fragment
        return LIVE + url.path + ("?" + url.query if url.query else "") + fragment

    def groups(self, soup, parent):
        """Translate Enfold's first/last markers to bounded grid rows."""
        row = None
        for child in list(parent.find_all(recursive=False)):
            if not get_class(child, "flex_column"):
                row = None
                continue
            fraction = next((FRACTIONS[c[3:]] for c in child.get("class", []) if c.startswith("av_") and c[3:] in FRACTIONS), (1, 1))
            if row is None or get_class(child, "first"):
                row = soup.new_tag("div", attrs={"class": "columns"})
                child.insert_before(row)
            child["_fraction"] = "%s-%s" % fraction
            row.append(child.extract())

    def clean(self, soup, parent, route):
        for comment in parent.find_all(string=lambda text: isinstance(text, Comment)):
            comment.extract()
        for tag in parent.select(".comment_container"):
            heading = tag.select_one(".comment-reply-title") or tag.find("h3")
            if heading and heading.get_text(" ", strip=True) == "Leave a Reply":
                for item in list(heading.next_siblings):
                    item.extract()
                heading.decompose()
        for gallery in parent.select(".avia-gallery"):
            for link in gallery.select("a[href]"):
                img = link.find("img")
                if img and img.get("data-avia-tooltip"):
                    link["title"] = img["data-avia-tooltip"]
                    link["aria-label"] = img["data-avia-tooltip"]
        # External video script templates contain the original embed URL and title.
        for tag in parent.select("script.av-video-tmpl"):
            tag.replace_with(BeautifulSoup(tag.string or "", "html.parser"))
        for video in parent.select(".avia-video"):
            frame = video.find("iframe")
            if frame:
                frame["_watch"] = video.get("data-original_url", frame.get("src"))
        for tag in parent.select(".zp-Library"):
            marker(tag, "netstim-bibliography", {})
        for link in parent.select("a[href]"):
            svg = link.find("svg")
            if not svg:
                continue
            name = svg.find("title")
            if name and not link.get("aria-label"):
                link["aria-label"] = name.get_text(" ", strip=True)
        for tag in reversed(parent.select(REMOVE)):
            if tag.parent:
                tag.decompose()
        for container in [parent, *parent.select("div,section,article")]:
            if container.parent or container is parent:
                self.groups(soup, container)
        for tag in list(parent.find_all()):
            if not tag.parent:
                continue
            classes = set(tag.get("class", []))
            if "redraft-text" in classes and tag.name == "div":
                tag.name = "p"
            if tag.name == "iframe":
                src = tag.get("src", "")
                watch = tag.get("_watch", src)
                title = tag.get("title", "")
                url = urlsplit(src)
                if url.hostname in {"www.youtube.com","www.youtube-nocookie.com","player.vimeo.com"}:
                    if "youtu" in url.hostname:
                        src = "https://www.youtube-nocookie.com" + url.path + "?" + url.query
                    marker(tag, "netstim-video", {"src": src, "href": watch, "title": title})
                else:
                    marker(tag, "netstim-embed", {"src": src, "href": self.link(route, src),
                                                     "title": title or "Podcast player", "audio": True})
                continue
            if tag.name == "img":
                src = tag.get("src", "")
                storage, original = self.asset(route, src, "image")
                alt = tag.get("alt") or ""
                title = tag.get("title") or ""
                if "avatar" in classes and not alt:
                    alt = ""
                if tag.parent.name == "a" and not tag.parent.get_text(strip=True) and not alt:
                    tag.parent["aria-label"] = tag.parent.get("aria-label") or tag.parent.get("title") or title or Path(urlsplit(original).path).stem.replace("-", " ")
                width = tag.get("width")
                if not width or not str(width).isdigit():
                    width = 0
                marker(tag, "netstim-image", {"src": storage, "original": original, "alt": alt, "width": int(width), **({"class": "avatar"} if "avatar" in classes else {})})
                continue
            if tag.name.startswith("netstim-"):
                continue
            attrs = {k: tag[k] for k in ("id", "lang", "datetime", "alt", "title", "colspan", "rowspan", "scope", "start", "value", "cite", "aria-label", "aria-current", "download") if tag.has_attr(k)}
            if attrs.get("id", "").startswith(("av-", "av_", "after_section_", "em-location-")):
                attrs.pop("id")
            if tag.has_attr("name") and tag.name == "a" and not attrs.get("id"):
                attrs["id"] = tag["name"]
            if tag.name == "a" and tag.get("href"):
                attrs["href"] = self.link(route, tag["href"])
                if (classes & {"lightbox"} or tag.find_parent(class_="avia-gallery")) and attrs["href"].startswith("@root@"):
                    attrs["data-lightbox"] = ""
                if tag.get("target") == "_blank":
                    attrs.update(target="_blank", rel="noopener noreferrer")
            elif tag.name == "source" and tag.get("src"):
                attrs["src"] = self.link(route, tag["src"])
            new = []
            for old, name in {
                "columns": "columns", "avia-button-wrap": "action-row", "avia-button": "action",
                "avia-image-container": "image-block", "avia-caption": "caption",
                "avia-gallery": "gallery", "avia-slideshow": "slideshow",
                "avia-slideshow-inner": "slides", "avia-slideshow-slide": "slide",
                "avia-logo-element-container": "partner-logos", "avia-content-slider": "partner-logos",
                "iconbox": "icon-box", "iconbox_content_title": "icon-heading",
                "post-meta-infos": "post-meta", "read-more-link": "read-more",
                "small-preview": "archive-image", "blog-meta": "archive-media",
                "big-preview": "post-image", "post-entry": "post-item", "'post-entry": "post-item",
                "standard-content": "standard-content", "comment-entry": "comments",
                "comment_meta_container": "comment-summary", "commentlist": "comment-list",
                "comment-body": "comment-body", "comment-content": "comment-content", "avatar": "avatar",
                "author-box": "author-box", "rounded-container": "author-avatar",
                "extra-mini-title": "archive-subtitle", "pagination": "pagination",
                "pagination-meta": "pagination-meta", "current": "current",
                "more-link": "read-link", "next_page": "page-step", "previous_page": "page-step",
                "em-location": "event-location", "em-list": "event-list", "avia-copyright": "attribution",
                "publication-type-badge": "publication-type", "aligncenter": "centered",
                "wp-caption": "captioned", "wp-caption-text": "caption",
                "pullquote": "pullquote", "av-share-box": "share", "av-share-box-list": "share-links",
                "av-share-link-description": "share-title", "avia-button-center": "centered-action",
            }.items():
                if old in classes and (name != "post-item" or tag.name == "article"):
                    new.append(name)
            if tag.name == "article" and tag.find_parent(id=re.compile(r"^comment-\d+$")):
                new.append("comment-body")
            if tag.has_attr("_fraction"):
                new.extend(("column", "column-" + tag["_fraction"]))
            if any(c.startswith("av-special-heading") for c in classes):
                new.append("heading-group")
            if classes & {"hr", "hr-invisible"}:
                # Spacers and ornamental lines become layout spacing or one semantic division.
                if "hr-invisible" in classes:
                    tag.decompose()
                    continue
                tag.name = "hr"
                tag.can_be_empty_element = True
                tag.clear()
            if tag.name == "h1":
                tag.name = "h2"
            if tag.name == "h5" and "publication-type-badge" in classes:
                tag.name = "p"
            if tag.name in {"h2", "h3", "h4", "h5", "h6"} and not tag.get_text(strip=True):
                tag.name = "span"
            if tag.name in {"header", "footer"} and not tag.find_parent("article"):
                tag.name = "div"
            if tag.name in {"h4","h5","h6"} and "icon-heading" in new:
                tag.name = "h3"
            if tag.name == "a" and not tag.get_text(strip=True) and (tag.has_attr("data-av_icon") or attrs.get("aria-label")):
                if tag.get("data-av_icon"):
                    attrs["data-icon"] = tag["data-av_icon"]
                attrs["aria-label"] = attrs.get("aria-label") or attrs.get("title") or tag.get("desc") or "External link"
                new.append("icon-link")
                if tag.get("data-av_iconfont") == "academicons":
                    new.append("icon-academic")
            if tag.name == "nav":
                attrs["aria-label"] = attrs.get("aria-label", "Pagination" if "pagination" in new else "Related pages")
            if tag.name == "a" and not attrs.get("href") and not attrs.get("id"):
                tag.unwrap()
                continue
            if tag.name == "a" and "page-step" in new and not tag.get_text(strip=True):
                label = "Next page" if "next_page" in classes else "Previous page"
                attrs["aria-label"] = label
                tag.string = "›" if "next_page" in classes else "‹"
            if tag.name in {"p","div","span"} and "event-location" in new:
                for br in tag.select('br[style*="clear"]'):
                    br.decompose()
            if "_blank" == attrs.get("target") and attrs.get("href", "").startswith("//"):
                attrs["href"] = "https:" + attrs["href"]
            if tag.name == "a" and ("archive-image" in new) and tag.parent.parent.get("aria-label"):
                attrs["aria-label"] = tag.parent.parent["aria-label"]
            if tag.name == "a" and "action" in new and attrs.get("href", "").startswith(("https:", "http:")):
                new.append("external")
            if tag.name == "span" and "current" in new:
                attrs["aria-current"] = "page"
            if tag.name == "ul" and "slides" in new:
                attrs["aria-label"] = "Images"
            if tag.name == "div" and tag.get("style", "").startswith("float:right") and "Map Unavailable" in tag.get_text():
                new.append("map-status")
            if new:
                attrs["class"] = " ".join(new)
            tag.attrs = attrs

        for tag in list(reversed(parent.find_all(["div", "span", "section", "p", "h2", "h3", "h4", "h5", "h6", "a", "header", "footer", "ul", "ol"]))):
            if not tag.parent:
                continue
            if not tag.get_text(strip=True) and not tag.find(["netstim-image", "netstim-video", "netstim-embed", "netstim-bibliography", "hr", "br", "a"]) and not tag.get("id") and not (tag.name == "a" and tag.get("href") and tag.get("aria-label")):
                tag.decompose()
            elif tag.name in {"div", "span", "section", "header", "footer"} and not tag.attrs:
                tag.unwrap()
        for text in list(parent.find_all(string=re.compile(r"^\s*</?[il]+>"))):
            cleaned = re.sub(r"</?(?:i|li)>", "", str(text))
            text.replace_with(cleaned)
        level = 1
        seen = Counter()
        for node in parent.find_all(True):
            if node.get("id"):
                ident = node["id"]
                seen[ident] += 1
                if seen[ident] > 1:
                    node["id"] = f"{ident}-{seen[ident]}"
            if re.fullmatch(r"h[2-6]", node.name):
                level = min(level + 1, int(node.name[1]))
                node.name = f"h{level}"
        return content_markdown(parent)

    def structure(self, route):
        soup = self.soup(route)
        record = self.records.get(route)
        band = soup.select_one(".title_container")
        title = band.select_one(".main-title").get_text(" ", strip=True) if band else ""
        crumbs = []
        if band:
            trail = band.select_one(".breadcrumb-trail")
            if trail:
                for a in trail.select("a[href]"):
                    crumbs.append({"title": a.get_text(" ", strip=True), "url": self.link(route, a["href"])})
                end = trail.select_one(".trail-end")
                if end:
                    crumbs.append({"title": end.get_text(" ", strip=True)})
        family = BODY_COLLECTIONS.get(route, "home" if route == "/" else "page")
        if route.startswith("/internal/events/"):
            family = "events"
        if route.startswith(("/blog/", "/author/", "/category/")):
            family = "archive"
        if record and record[0] == "posts":
            family = "post"
        if route == "/research-interests/publications/":
            family = "publications"
        self.manifest["route_families"][route] = family
        raw = soup.select_one("#main")
        main = raw.select(":scope > .main_color > .container, :scope > .main_color > .container-fluid")
        if not main:
            raise ValueError(f"No main container: {route}")
        sidebar = raw.select_one(".inner_sidebar")
        related = []
        if sidebar:
            related = [{"title": a.get_text(" ", strip=True), "url": self.link(route, a["href"])}
                       for a in sidebar.select(".nested_nav a[href]")]
        front = {"title": title, "url": route, "family": family, "crumbs": crumbs}
        if related:
            front["related"] = related
        if sidebar:
            front["sidebar"] = True
        if record:
            data = record[1]
            front.update(wordpress_id=data["id"], date=data["date"] + "+00:00", modified=data["modified"] + "+00:00")
            if family == "post":
                front["author"] = self.readers[data["author"]]
        if family == "events" and "/locations/" in route and route != "/internal/events/locations/":
            label = soup.select_one(".blog-author a")
            posted = soup.select_one(".post-meta-infos time")
            ident = re.search(r"post-entry-(\d+)", str(soup.select_one("article").get("class", [])))
            if label and posted and ident:
                front["author"] = label.get_text(strip=True)
                front["date"] = posted["datetime"]
                self.routes[int(ident[1])] = route
        if route in {"/author/andreashorn/", "/author/janroediger/", "/category/uncategorized/"}:
            front.update(layout="archive", outputs=["html", "rss"])
            if route.startswith("/author/"):
                front["feed_author"] = route.split("/")[2]
        if family in {"post", "archive"} or route == "/research-interests/the-book/":
            front["comment_anchor"] = not raw_has_comment(soup)
        if route in ("/blog/", "/author/andreashorn/", "/author/janroediger/", "/category/uncategorized/"):
            front["include_new_posts"] = True
        canonical = soup.select_one('link[rel="canonical"]')
        if canonical and urlsplit(canonical["href"]).hostname in LOCAL_HOSTS:
            front["canonical"] = urlsplit(canonical["href"]).path or route
        for feed in soup.select('link[type="application/rss+xml"]'):
            self.feeds.add(urlsplit(feed["href"]).path)
        sections = []
        for container in main:
            col = container.select_one(":scope > .content")
            if not col:
                continue
            section_id = container.parent.get("id", "")
            mode = "wide" if section_id.startswith("av_section_") else "main"
            if container.select_one(":scope > .sidebar"):
                mode = "sidebar"
            for c in col.select(".comment_meta_container"):
                c["id"] = "respond"
            if family == "archive":
                for article in col.find_all("article", recursive=False):
                    if article.select_one(".post-title a[href]"):
                        article["aria-label"] = article.select_one(".post-title a[href]").get_text(" ", strip=True)
            body = self.clean(soup, col, route)
            sections.append({"mode": mode, "body": body})
        return front, sections

    def nav(self):
        soup = self.soup("/")
        def items(ul):
            rows = []
            for li in ul.find_all("li", recursive=False):
                a = li.find("a", recursive=False)
                if a and li.get("id") != "menu-item-search" and not get_class(li, "av-burger-menu-main"):
                    title = a.select_one(".avia-menu-text") or a
                    row = {"title": title.get_text(" ", strip=True), "url": self.link("/", a["href"])}
                    sub = li.find("ul", recursive=False)
                    if sub:
                        row["children"] = items(sub)
                    rows.append(row)
            return rows
        logo = soup.select_one(".logo img")
        image, _ = self.asset("/", logo["src"], "image")
        footer = soup.select_one("#footer .textwidget")
        nav = {"main": items(soup.select_one("#avia-menu")), "logo": image, "logo_alt": logo["alt"],
               "footer": [{"title": a.get_text(" ", strip=True), "url": self.link("/", a["href"])}
                          for a in footer.select("a[href]")]}
        updates = []
        for row in soup.select(".newsbox .news-content"):
            title = row.select_one(".news-title")
            img = row.select_one("img")
            src, original = self.asset("/", img["src"], "image")
            updates.append({"title": title.get_text(" ", strip=True), "url": self.link("/", title["href"]),
                            "time": row.select_one(".news-time").get_text(" ", strip=True),
                            "image": {"src": src, "original": original, "alt": "", "width": 36}})
        dump(ROOT / "data/updates.yaml", updates)
        for a in soup.select('link[rel="icon"],link[rel="apple-touch-icon"]'):
            self.asset("/", a["href"], "download")
        return nav

    def publications(self):
        paths = sorted(self.supplemental.glob("publications-*.json"), key=lambda p: int(p.stem.split("-")[-1]))
        if not paths:
            raise SystemExit("The supplemental capture needs the public Zotpress responses.")
        entries = []
        for path in paths:
            response = json.loads(path.read_text())
            for item in response["data"]:
                soup = BeautifulSoup(html.unescape(item["bib"]), "html.parser")
                body = soup.select_one(".csl-right-inline") or soup.select_one(".csl-entry")
                for tag in body.find_all(True):
                    if tag.name == "a":
                        url = tag.get("href") or ""
                        tag.attrs = {"href": url} if url.startswith(("https://", "http://")) else {}
                    elif tag.name in {"i", "em", "b", "strong", "sup", "sub", "span", "br"}:
                        tag.attrs = {}
                    else:
                        tag.unwrap()
                entries.append({
                    "key": item["key"], "title": item["data"]["title"], "date": item["meta"].get("parsedDate", ""),
                    "citation": body.decode_contents().strip(),
                })
        if not entries or len(entries) != len({e["key"] for e in entries}) or response["meta"]["request_next"]:
            raise SystemExit("The Zotpress capture is empty, incomplete or contains duplicates.")
        dump(ROOT / "data/publications.yaml", entries)

    def run(self):
        dump(ROOT / "data/nav.yaml", self.nav())
        events = {}
        for route in self.crawl:
            front, sections = self.structure(route)
            family = front["family"]
            body = ""
            if family in BODY_COLLECTIONS.values():
                dump(ROOT / f"data/{family}.yaml", sections)
            elif family == "events":
                events[route] = sections
            elif len(sections) == 1 and sections[0]["mode"] in {"main", "sidebar"}:
                body = sections[0]["body"]
            else:
                front["sections"] = sections
            name = route.strip("/").replace("/", "--")
            if not name:
                dest = ROOT / "content/_index.md"
            elif family == "post":
                dest = ROOT / f"content/posts/{name}.md"
            else:
                dest = ROOT / f"content/{name}.md"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text("---\n" + yaml.safe_dump(front, allow_unicode=True, sort_keys=False, width=110) + "---\n\n" + body + "\n")
        dump(ROOT / "data/events.yaml", events)
        self.publications()
        self.manifest["feeds"] = sorted(self.feeds | {"/blog/feed/", "/feed/rss2/", "/feed/rss/", "/feed/atom/", "/feed/rdf/"})
        self.manifest["redirects"] = LEGACY_REDIRECTS
        (ROOT / "tests/migration.json").write_text(json.dumps(self.manifest, indent=2, ensure_ascii=False) + "\n")
        print(Counter(self.manifest["route_families"].values()))
        print("Feed URLs:", *self.manifest["feeds"], sep="\n")
        print("Unresolved images:", *self.manifest["missing_images"], sep="\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audit", type=Path)
    parser.add_argument("wordpress", type=Path)
    parser.add_argument("supplemental", type=Path)
    args = parser.parse_args()
    Migration(args.audit, args.wordpress, args.supplemental).run()
