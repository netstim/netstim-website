# Network Stimulation Laboratory

Static Hugo source for Netstim. The repository and its preview configuration are local. The live WordPress site is independent of this checkout.

## Build and preview

Use Hugo 0.169.0 extended with the Git history available.

```sh
hugo --gc --minify
hugo server --disableFastRender
```

Build the project preview with a trailing-slash base URL, a preview banner, and noindex.

```sh
HUGO_PARAMS_PREVIEW=true hugo --gc --minify \
  --baseURL https://netstim.github.io/netstim-website/ --destination /tmp/netstim-preview
node .github/scripts/serve.mjs 8795 /tmp/netstim-preview /netstim-website/
```

Open [the local project preview](http://127.0.0.1:8795/netstim-website/).

## Verify

```sh
python3 .github/scripts/check-site.py public
python3 .github/scripts/check-site.py /tmp/netstim-preview https://netstim.github.io/netstim-website/
python3 .github/scripts/check-design.py
python3 .github/scripts/check-css-used.py public /tmp/netstim-preview
python3 .github/scripts/check-copy.py public
```

The copy check requires Beautiful Soup 4. Browser tests use Node 22, Playwright 1.48.2, and axe-core 4.10.3. Install the locked dependencies with `npm ci` and `npx playwright install --with-deps chromium webkit` on CI. With the existing audit tools installed locally, set `NODE_PATH=/tmp/ldbs-audit/scripts/node_modules` and point `AXE_SCRIPT` at the local axe bundle.

```sh
node .github/scripts/check-browser.mjs public https://www.netstim.org/ /tmp/netstim-browser
node .github/scripts/check-interactions.mjs public
node .github/scripts/check-interactions.mjs /tmp/netstim-preview https://netstim.github.io/netstim-website/
node tests/test_csp_browser.mjs public
```

## Deployment package

Build with the production defaults and package every file in `public/` including `.htaccess`. Production Apache 2.4 uses `mod_rewrite`, `mod_headers`, and directory indexes. The build keeps manuscript URLs absolute, so their separately hosted files need to stay reachable. The GitHub Pages workflow builds under the project subpath and supplies HTML fallbacks for old paths.

See [design](docs/design.md), [structure and URL map](docs/structure.md), and [editing](docs/editing.md).
