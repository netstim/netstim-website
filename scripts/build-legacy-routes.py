#!/usr/bin/env python3
"""Write the static legacy-feed payloads and Apache/Pages compatibility routes."""
from datetime import datetime, timezone
from email.utils import format_datetime
from html import escape
import json
from pathlib import Path
import posixpath
import re
import sys
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"
LIVE = "https://www.netstim.org"
TITLE = "Network Stimulation Laboratory"
POLICY = (
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
    "font-src 'self'; media-src 'self'; connect-src 'self'; "
    "frame-src https://www.youtube-nocookie.com https://player.vimeo.com "
    "https://open.spotify.com https://html5-player.libsyn.com; "
    "object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'"
)


def feed(target, title, parent, rows):
    root = ET.Element("rss", version="2.0")
    channel = ET.SubElement(root, "channel")
    for key, value in (("title", title), ("link", LIVE + parent), ("description", title)):
        ET.SubElement(channel, key).text = value
    for row in rows:
        item = ET.SubElement(channel, "item")
        for key, value in row.items():
            ET.SubElement(item, key).text = value
    output = STATIC / target.lstrip("/")
    output.parent.mkdir(parents=True, exist_ok=True)
    ET.indent(root, space="  ")
    ET.ElementTree(root).write(output, encoding="utf-8", xml_declaration=True)


def fallback(old, target):
    if not old.endswith("/"):
        return
    output = STATIC / old.strip("/") / "index.html"
    output.parent.mkdir(parents=True, exist_ok=True)
    relative = posixpath.relpath(target, old)
    if target.endswith("/"):
        relative += "/"
    link = escape(relative, quote=True)
    output.write_text('<!doctype html>\n<html lang="en"><meta charset="utf-8">\n'
                      '<title>Page moved</title><meta name="robots" content="noindex">\n'
                      f'<meta http-equiv="refresh" content="0; url={link}">\n'
                      f'<p><a href="{link}">Continue to the new address</a>.</p></html>\n')


def original_page(source, route):
    return BeautifulSoup((source / route.strip("/") / "index.html").read_text(), "html.parser")


def comments(page, route):
    rows = []
    for comment in page.select(".commentlist li[id] > div[id]"):
        author = comment.select_one("cite")
        when = comment.select_one("time")
        body = comment.select_one(".comment-content") or comment.select_one("p")
        if not (author and when and body):
            continue
        name = author.get_text(" ", strip=True)
        text = body.get_text(" ", strip=True)
        address = LIVE + route + "#" + comment["id"]
        date = datetime.strptime(when.get_text(" ", strip=True), "%B %d, %Y at %I:%M %p").replace(tzinfo=timezone.utc)
        rows.append({"title": name, "link": address, "guid": address, "pubDate": format_datetime(date), "description": text})
    return rows


def main(source):
    manifest_path = ROOT / "tests/migration.json"
    manifest = json.loads(manifest_path.read_text())
    redirects = manifest["redirects"]
    all_comments = []
    for route in manifest["feeds"]:
        parent = route.removesuffix("/feed/") + "/"
        if route in ("/feed/", "/blog/feed/") or route.startswith("/feed/"):
            target = "/index.xml"
        elif parent.startswith(("/author/", "/category/")):
            target = parent + "index.xml"
        elif parent == "/comments/":
            target = "/feeds/comments.xml"
        else:
            target = "/feeds/comments/" + parent.strip("/").replace("/", "--") + ".xml"
            page = original_page(source, parent)
            heading = page.select_one(".content .post-title") or page.select_one(".title_container .main-title")
            name = heading.get_text(" ", strip=True) if heading else TITLE
            rows = comments(page, parent)
            all_comments.extend(rows)
            feed(target, f"Comments on: {name}", parent, rows)
        redirects[route] = target
    feed("/feeds/comments.xml", f"Comments for {TITLE}", "/", all_comments)
    for old, to in redirects.items():
        fallback(old, to)
    rules = [
        "# Apache 2.4. Ship this file alongside index.html on the production host.",
        "DirectoryIndex index.html",
        "ErrorDocument 404 /404.html",
        "<IfModule mod_headers.c>",
        f'  Header always set Content-Security-Policy "{POLICY}"',
        '  Header always set X-Content-Type-Options "nosniff"',
        '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
        "</IfModule>",
        "<IfModule mod_rewrite.c>",
        "  RewriteEngine On",
        "  # Pre-permalink WordPress links in posts, shares and citations.",
    ]
    for ident, route in manifest["ids"].items():
        rules.extend([f"  RewriteCond %{{QUERY_STRING}} ^(?:p|page_id)={ident}$",
                      f"  RewriteRule ^(?:index\\.php)?$ {route} [R=301,END,QSD]"])
    rules.append("  # Site and feed compatibility redirects.")
    for old, to in sorted(redirects.items()):
        match = re.escape(old.strip("/")) + ("/?" if old.endswith("/") else "")
        rules.append(f"  RewriteRule ^{match}$ {to} [R=301,END]")
    rules.append("</IfModule>")
    (STATIC / ".htaccess").write_text("\n".join(rules) + "\n")
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(redirects)} path rules, {len(manifest['ids'])} WordPress ID rules and {len(all_comments)} published comment entries.")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
