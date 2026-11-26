# Structure, addresses and redirects

The site was rebuilt from the WordPress site in November 2026 and then reorganised (review of
23 Nov 2026, see `docs/audit-2026-11-23.md`). Pages now live at short addresses. Every old WordPress
address still answers: Apache sends a 301 to the new address, and a small forwarding page does the same on
hosts without `.htaccess` (the GitHub Pages preview).

## Site map

| Menu | Page | Address | File |
| --- | --- | --- | --- |
| (logo) | Home | `/` | `content/_index.md`, `layouts/home.html` |
| Research | Overview (themes: a figure, the question, key papers, people) | `/research/` | `content/research.md`, `layouts/_partials/research-overview.html` |
| | Deep Brain Stimulation | `/research/deep-brain-stimulation/` | `content/research--deep-brain-stimulation.md`, `layouts/_partials/research-topic.html` |
| | Normative Connectomes | `/research/normative-connectomes/` | `content/research--normative-connectomes.md` |
| | Lead-DBS (the method; downloads are on Resources) | `/research/lead-dbs/` | `content/research--lead-dbs.md` |
| Publications | Papers | `/publications/` | `content/publications.md`, `data/publications.yaml` (journal covers: `data/covers.yaml`, shown on Home) |
| | Posters | `/publications/posters/` | `content/publications--posters.md`, `data/poster_list.yaml` |
| | Talks | `/publications/talks/` | `content/publications--talks.md`, `data/videos.yaml` |
| | Book | `/book/` | `content/book.md`, `data/book.yaml` |
| People | People and alumni | `/people/` | `content/people.md`, `data/people.yaml` |
| | Andreas Horn | `/people/andreas-horn/` | `content/people--andreas-horn.md` |
| | Jobs | `/jobs/` | `content/jobs.md` (front matter; `layouts/_partials/jobs-page.html`, `assets/css/jobs.css`) |
| News | News | `/news/` | `content/news.md`; posts in `content/posts/` at `/<slug>/` |
| Community | Stimu-Latte journal club | `/stimu-latte/` | `content/stimu-latte.md` |
| | Stimulating Brains podcast | stimulatingbrains.org | |
| (footer) | Imprint, Privacy | `/imprint/`, `/privacy/` | `content/imprint.md`, `content/privacy.md` |

The header menu has five items (`data/nav.yaml`, drawn by `layouts/_partials/nav.html`). Each title
is a link to its page. An item with `children` also opens a sheet under the header, as wide as the
window, that lists the pages under it, each with a large title and one muted line (`text`); the table
above follows that list. The sheet opens on hover with a mouse, and from the item's arrow button by tap
or keyboard (Enter, Space, Down arrow); the arrow is always shown on touch screens and appears on
keyboard focus otherwise. It closes with Escape, a press outside, when the mouse leaves, or when focus
moves on (`assets/js/main/header.js`). On a phone
the menu is a full-screen sheet in which the same items unfold as groups. News has no children and
stays a plain link. An item is marked as current on its own page and on its children's pages.

There are no tab bars: the Research overview leads to its pages from its themes (each subject page
ends with links to the other two), and Publications,
Posters and Talks link each other in one line under the title (front matter `also:`). A page deeper
down shows a breadcrumb of its parents (`crumbs:`).

The footer (`layouts/_partials/footer.html`) shows the postal address and email from `data/contact.yaml`,
the social links and the small links from `data/nav.yaml`.

## Redirects

There are two kinds of old address:

1. **A page that moved.** List the old address under `aliases:` in the page's front matter:

   ```yaml
   url: /book/
   aliases:
   - /research-interests/the-book/
   - /the-book/
   ```

2. **An address with no page here** (old feeds, Lead-DBS posts that now live on lead-dbs.org): add a row
   to `data/redirects.yaml`, e.g. `- {from: /feed/, to: /index.xml}`.

Hugo writes the production `.htaccess` from `layouts/home.htaccess`, with a `RewriteRule … [R=301,END]` for
every alias and every row of `data/redirects.yaml`. It also writes a forwarding page at every alias
(`layouts/alias.html`) and for every row of `data/redirects.yaml` that points to another site
(`content/_content.gotmpl`).

`tests/old-routes.json` lists the 86 addresses of the old WordPress site. `check-site.py` fails if any of
them answers nothing, or if a forwarding page has no 301 in the `.htaccess`.

## What was retired (Nov 2026)

- Archive pages `/blog/page/2–5/`, `/category/uncategorized/…`, `/author/…` → `/news/`.
- The retired "For lab members" pages (`/internal/`, `/internal/onboarding/`, `/internal/links/`), empty Events Manager pages `/internal/events/…` and the imaging-meeting page → `/`.
- Eight Lead-DBS release notes → lead-dbs.org (see `docs/for-lead-dbs/`).
- The two book news posts → `/book/`.
- The "About the lab" page (`/about/`, `/about-us/`) → Home, which now says who we are and lists past
  funders.
- The 60 per-post comment feeds and the 69 `?p=` / `?page_id=` redirects. (The main feed addresses
  `/feed/`, `/feed/rss2/`, `/blog/feed/` … still redirect to `/index.xml`.)
- Two WordPress auto-addresses got real ones: `/928-2/` → `/coverart-for-biological-psychiatry/`,
  `/928-2-2/` → `/coverart-for-brain/`.
