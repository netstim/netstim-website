# Editing the site

Most changes are a few lines in one file under `data/` or `content/`. Run `hugo server` and open
http://localhost:1313 to see a change before you push it. A push to `main` rebuilds the preview.

## Common tasks

| I want to… | Edit |
| --- | --- |
| post news | `hugo new content posts/my-news.md`, write Markdown, set `date`; the address is `/<slug>/` |
| add a paper | a row at the top of `data/publications.yaml` |
| choose the selected papers at the top of Publications | `data/selected_papers.yaml`: the paper's `key` and an `image` from that paper, in the order shown (a row each; six to nine read well); `whole: true` shows a journal cover uncropped, and an entry without an `image` is not shown |
| give a paper its topics (the topic select on Publications) | a line `KEY: [dbs, connectomes]` in `data/publication_topics.yaml`, with the paper's `key` from `data/publications.yaml`; the topics are listed at the top of that file, and a paper without a line shows only under “All topics” |
| add a journal cover | an entry at the top of `data/covers.yaml` (image in `assets/media/`); Home shows them in the scrolling strip |
| add a Stimu-Latte session | four lines at the top of `sessions` in `data/stimu_latte.yaml` (instructions at the top of the file) |
| change the journal club's time, room or sign-up link | the top of `data/stimu_latte.yaml` |
| add or update a person | `data/people.yaml` (see below) |
| change the address or email in the footer | `data/contact.yaml` |
| change the menu or its sheets, footer links | `data/nav.yaml` (see “The menu” below) |
| change the book's facts or chapters | `data/book.yaml` |
| change Home (opening, research cards, community, funders, past funders) | the front matter of `content/_index.md` |
| change the words or photos of the Home opening | `hero:` in `content/_index.md`: `title` and `place` (the small line), `tagline` (the large line, a few words), `text` (one or two sentences), `links`, and `photos` (image in `assets/media/`, `alt`), which are shown in turn in the order written: team, render, team, render. `tall: false` keeps a wide photo out of the tall frame, which would cut people off |
| add a funder | an entry under `funding:` in `content/_index.md` (`current` or `past`): the funder's own logo file in `assets/media/` as `src` (with a clear background, since every logo is drawn in one tone), its `url`, `alt`, and `width` (the logo's width on the page in px; adjust until the row looks even). A current funder also takes `name`, set beside the logo, unless the logo spells the name out. `shaded: true` is for a filled seal, which keeps its shades of gray. Never draw a logo; without `src` the `name` is shown as text |
| change a research area on the overview (title, text, figure, links) | the `groups:` list in the front matter of `content/research.md` (see “Research pages” below) |
| change a research subject page | `content/research--*.md`: the text is Markdown, the picture, papers and people are front matter |
| open or close a position, change the Jobs page | the front matter of `content/jobs.md`: add entries to `positions:` (`title`, optional `url` and `text`) and they replace the “no open positions” sentence; empty the list (`positions: []`) to bring it back. What to send is the `list` under “How to apply”; the address comes from `data/contact.yaml` |
| move or rename a page | change its `url:` and add the old address under `aliases:` (see `docs/structure.md`) |
| retire a page | delete it and add its address to `data/redirects.yaml`, or to another page's `aliases:` |

## The menu

The header menu is the `main:` list in `data/nav.yaml`. An item needs a `title` and a `url`
(`@root@` stands for the site's address). Pages listed under `children:` appear in the sheet that opens
under the header from the item, and as a group in the phone menu:

```yaml
- title: People
  url: '@root@people/'
  children:
  - title: Team
    url: '@root@people/'
    text: Current members and alumni
  - title: Jobs
    url: '@root@jobs/'
    text: Open positions
```

- `text` is optional: a few plain words under the title (desktop sheet only). Leave it out rather than
  pad it.
- List the item's own page first if it should be in the sheet too (Overview, Papers, Team); on a phone
  the group's title only unfolds the list, so this is how its own page is reached there.
- An address that starts with `http` gets the outside-link arrow.
- Without `children:` the item is a plain link (News).
- Only list pages that exist; `check-site.py` fails on a dead link.

## News posts

```yaml
---
title: Short, plain title
date: 2026-12-01
family: post
crumbs:
- {title: Home, url: '@root@'}
- {title: News, url: '@root@news/'}
- {title: Short, plain title}
---
The first paragraph says what happened. Link the paper inline.
```

Old posts stay as they were written. Lead with the news, not with "We are excited". Put images in
`assets/media/` and use `![What the image shows](media/file.jpg)`.

## Research pages

The overview (`content/research.md`) has no text of its own: `lead` is the two sentences under the title,
and its front matter lists `groups` (each a `title` and its `themes`, the research areas). A group is shown
one of two ways:

- `layout: rows` (the default): large rows on white, the figure and the text side by side, swapping sides
  from row to row (the first row has its figure at the left). Use it for the research areas.
- `layout: pair`: a soft-gray band with the group's title and its areas two abreast, each under its figure.
  Use it for two (or four) short entries, such as the methods.
- `heading: false` hides a group's title (screen readers still get it).

An area:

```yaml
- id: deep-brain-stimulation           # the anchor: /research/#deep-brain-stimulation
  title: Tailoring deep brain stimulation
  question: The open question, in one sentence.   # optional; set larger over the text
  text: Two or three sentences on what we do.
  image: media/research-figure.png     # a real figure in assets/media/
  alt: What the figure shows
  caption: One line; Markdown links work.
  links:                               # one line: the subject page, or a topic of the Publications page
  - {label: More on deep brain stimulation, url: '@root@research/deep-brain-stimulation/'}
```

- Figures have no frame. In a row a figure is shown whole in its own shape (an upright one stays narrow); in
  a pair it is cut to 3:2. A render with its own ground needs nothing more.
- `drawing: true` is for a figure drawn on white: it stands free on the page (in a pair it is shown whole
  and blended into the band), and the dark theme turns its lightness around. `drawing: light` is for a
  white-ground picture that must keep its colors (a tissue section, a 3D render, a map whose colors carry
  values): it stays a light plate in the dark theme.
- `image_dark` (optional) is the same picture on a dark ground; the dark theme shows it instead.
- `first: true` marks the first figure of the page, which loads at once.
- A link to the papers on a subject is `'@root@publications/?topic=lesion-mapping'` (the topics are listed
  in `data/publication_topics.yaml`).
- Key papers and people are not shown here: they are on the subject pages (below) and on People.
- State only what a paper supports, and keep an area to one short paragraph, one figure and one line of links.
- A figure taken from a paper needs a license that allows it (CC BY) and the paper named in the caption.

A subject page (`content/research--*.md`, front matter `family: research` and `topic: true`):

- `lead` is the one sentence under the title; `figure` (`image`, `alt`, `caption`) the wide picture
  below it. Add `drawing: true` for a flat drawing on white.
- For a silent loop instead of a picture (Lead-DBS), add `video: media/file.mp4` to `figure`; `image` is
  then the still shown before it plays, and `alt` says what the video shows. Make the file small first:
  H.264, no sound, 1600px wide, under 4 MB, for example
  `ffmpeg -i in.mp4 -vf scale=1600:-2 -an -c:v libx264 -crf 27 -movflags +faststart assets/media/research-name.mp4`.
  Videos stay on this site; the page does not load them from other hosts.
- New research pictures go to `assets/media/` as `research-<what-it-shows>.jpg` (JPEG or PNG, at most
  2400px wide).
- The text is Markdown. Each `## Heading` starts a section. A picture is
  `![What it shows](media/file.png "Caption")`; a list or a small table often reads better than a paragraph.
- `papers` (a few `key`s from `data/publications.yaml`; the title, first author, journal, year and
  link come from there) and `people` (names exactly as in `data/people.yaml`) end the page. A key or a
  name that does not exist stops the build with a message. `steps` (Lead-DBS) is a row of pictures, each with a
  `title` and a line of `text`, shown where the text says `{{< research-steps >}}`.
- The links to the other subject pages at the end come from the Research children in `data/nav.yaml`.

Downloads and data belong on Resources (`content/resources.md`), not on these pages.

## People

Each person is one entry in `data/people.yaml`: current members first, in the order shown on the page, then
the alumni. Copy a neighbouring entry and change it.

```yaml
- name: Ada Example
  role: PhD student            # the line under the name
  status: current              # or: alumni
  photo: ada-example.jpg       # a file in assets/media/; leave the line out until there is a photo
  photo_credit: Photographer   # only if one must be named
  links:                       # any of: website, email, scholar, orcid, researchgate, github, linkedin,
    orcid: https://orcid.org/0000-0000-0000-0000   # bluesky, x, publons, researcherid, cv
    linkedin: https://www.linkedin.com/in/ada-example/
  bio: |
    Ada joined Netstim in 2026. Plain Markdown; links are written [like this](https://example.org).

    A blank line starts a new paragraph.
```

- A current member appears as a portrait card; the card opens the photo, role, biography and links.
- An alumnus needs only `name`, `status: alumni`, `photo` and `links`. Add `now_at: Place` to show
  "Now at Place" (only confirmed facts).
- When someone leaves, change `status` to `alumni` and move the entry down to the alumni.
- Portraits are shown black and white in a 4:5 frame, so any reasonably sized head-and-shoulders photo works.

Andreas Horn also has a page of his own, `content/people--andreas-horn.md` (his entry names it with
`page:`). Top to bottom: his name and one role line (`lead`); the portrait with its credit, his email address
and his profile links (all from his entry in `data/people.yaml`) beside the biography, which is the text of
the page: two short paragraphs, about 110–160 words. Under it stand the sections of `profile.sections` in the
front matter. A section is a `title`, a `look` and `items`, one line per row: `years`, `title`, `place` (a
second line in gray), `url` (makes the row a link; write `lang: de` beside a `place` in German). The looks:
`honors` for the awards (large rows), `timeline` for positions and education (`years: 2025–` means "still
held" and reads "Since 2025"), none for plain rows (publications, press: the outlet as `title`, the headline
as `place`, the year). List only press that can be linked, newest first.

## Links and images

- Inside content and data, write site links as `@root@path/` (for example `@root@book/`), so they also
  work on the GitHub Pages preview under `/netstim-website/`.
- Inline images come from `assets/media/` (Hugo makes WebP sizes). Large originals for download go under
  `static/`.
- Third-party video or audio players need their host in the CSP in `layouts/home.htaccess`.

## Before you push

```sh
hugo --gc --minify
python3 .github/scripts/check-site.py public
python3 .github/scripts/check-design.py
python3 .github/scripts/check-css-used.py public
```

`check-site.py` fails on a broken link, a missing image alt text, or an old address that no longer
answers. The browser checks (`README.md`) run on every pull request.
