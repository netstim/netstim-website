#!/usr/bin/env python3
"""Check the project's visual tokens, asset pipeline and intentional motion."""
from pathlib import Path
import re

styles = Path("assets/css")
base = (styles / "base.css").read_text()
errors = []
for token, color in {"ink":"#2f3437", "action":"#2b5c8a", "coral":"#e0645a"}.items():
    if f"--{token}: {color};" not in base:
        errors.append(f"Changed Blend token: {token}")
for selector in ('[data-theme="dark"]', ":focus-visible", "prefers-reduced-motion", "dialog:modal"):
    if selector not in base:
        errors.append(f"Missing {selector}")
for file in styles.glob("*.css"):
    css = file.read_text()
    if re.search(r'https?://|linear-gradient\(|radial-gradient\(', css):
        errors.append(f"{file}: remote CSS resource or decorative gradient")
    if ":hover" in css and "(hover: hover)" not in css:
        errors.append(f"{file}: hover is ungated")
    for transition in re.findall(r"\btransition\s*:\s*([^;}]+)", css):
        if not re.match(r"(?:transform|opacity|filter)\b", transition):
            errors.append(f"{file}: non-compositor transition")
if not (Path("static/fonts") / "OFL-inter.txt").is_file():
    errors.append("Inter's license is missing")
for filename in ("head.html", "../baseof.html"):
    if "fingerprint" not in (Path("layouts/_partials") / filename).read_text():
        errors.append(f"{filename}: resource fingerprint step missing")
if errors:
    print("\n".join(errors))
    raise SystemExit(1)
print("Blend palette, Inter, focus, themes, motion and asset fingerprint rules pass.")
