# Design

A quiet university-lab site. Inter (self-hosted), ink `#2f3437`, action blue `#2b5c8a`, the Netstim mark in
its own blue and teal. The tokens live in `assets/css/base.css`; `check-design.py` guards the palette.

## Rules

- **No template look.** No black hero cards, giant tightly tracked headlines, pill-button pairs, walls of
  big words, logos floating on large coloured plates, or 3D effects. Real photos and real figures instead.
  The one exception is the book: its cover is shown as a real object (`.book3d`: front, page edges, back,
  a slight turn, a soft shadow), on Home and on /book/.
- **Say it once.** A sentence lives on one page. Other pages link to it.
- **Few words.** Plain sentences, American spelling, no hype. A section on Home is a title, a picture and
  one line.
- **Calm type and shape.** Page titles 34–46px with light tracking (no tight, giant headlines); corners 6, 8
  and 12px (`--r-sm/md/lg`): soft, never fully square, never bubbly. On Home, white and soft-gray sections
  alternate (the covers and the community sit on the gray band).
- **The Home opening** says what the lab does before it says what it is called. The name and the place are
  one small line (the page's heading); the field (`hero.tagline`) is the large line, 34–44px on a phone and
  up to 62px on a desktop, the one place where the site sets type this large (weight 540, never tracked
  out); then one or two sentences in ink (`hero.text`) and two links. The pictures are real photos and the
  lab's own renders in one frame, where the people and the work take turns by a slow crossfade every few
  seconds (`assets/js/main/banner.js`). `hero.layout: picture` puts the frame first: on a phone a square
  from edge to edge right under the header, the words after it; from 768px the right half of the window,
  out to the window's edge (12px corners at its left), with the words beside it at mid-height. A small
  pause button sits in the frame's lower right corner; nothing changes under reduced motion or without
  scripts, where the first picture stands. No words on the pictures, no zoom, no arrows or dots. Photos
  must belong together (the same people and light, the lab's own renders on their light ground); stage-lit
  congress photos do not go beside them.
  Until the owner has chosen, `hero.layout` also offers `statement` (the words first, then a 3:2 frame with
  every photo in turn: edge to edge on a phone, at the left with the sentences at its right on a desktop)
  and `duet` (the team photos in a 3:2 frame with the silent Lead-DBS loop as a smaller frame over its
  lower right corner).
- **Home on a phone** keeps each section short: Research is three compact rows (the words at the left, the
  figure as a small square at the right) and not three full-width pictures; the news rows have their
  pictures at the left.
- **Reading pages** (`article: true` in front matter, and every news post) are one centered column of 672px.
  Section headings are modest (22–26px).
  - **Figures stand out of the column.** A picture, slideshow or video is up to 840px wide (84px beyond
    the text on each side), centered on the text. With less room it takes what the page has; on a phone
    it is the column, inside the page margin. An audio player stays in the column.
  - **A picture is never scaled up.** It is shown at its `width` and no larger, so a small one stays
    small and centered. An upright picture gets a smaller `width` so that it is not taller than about
    680px (Markdown images do this themselves). The size is known before the file loads; the text does
    not jump.
  - **A picture keeps its own ground.** No plate, frame or white backing is added. Corners are rounded
    (12px). In the dark theme pictures are dimmed a little, so a figure drawn on white reads as a quiet
    light plate.
  - **Captions** are centered under the picture, 14px, muted, no wider than the text. In Markdown the
    caption is the image title: `![What it shows](media/file.jpg "Caption")`.
  - **Small pictures stay small.** A picture the old site set beside the text (portrait, cover, logo) is
    part of the column up to 1199px (at most 300px wide) and stands in the right margin from 1200px.
    Where the right margin is taken by small pictures, the figures beside it keep to the column.
  - A click on a picture opens the image viewer whenever the viewer has more to show than the page.
- **Research pages** lead with figures (`assets/css/research.css`).
  - **The overview** is the title, two sentences and a few research areas in two groups (the areas; the
    methods and software), each group under a rule and a small heading in ink. Every area is the same row
    and has the same four parts: at the left the title (24–30px), one short paragraph (for an area the
    open question is its first sentence) and one line of links (the subject page, or a topic of the
    Publications page); at the right one real figure (3:2, 7 of 12 columns) with a one-line caption.
    Nothing else: no labels above titles, no paper or people lists (those are on the subject pages and on
    People), no mirrored rows, no video stills. Every figure sits in the same soft-gray frame; a figure
    drawn on white is blended into it (`drawing: true`, which the dark theme turns around;
    `drawing: light` blends in the light theme only). Under 1024px a row is one column, the figure on
    top. It does not repeat Home's three card pictures.
  - **A subject page** opens with the title, one sentence and one wide picture (16:7; a flat drawing on
    white is shown whole in the same soft-gray frame, and the dark theme turns its lightness around). The
    picture may be a silent loop instead (Lead-DBS): a self-hosted MP4 with a still, muted, playing only
    while it is on screen, with a round pause button in its corner; a visitor who asks for reduced motion
    gets the still and the button. One loop on a page at most. Below, each
    section's heading stands in the left third under a hairline that crosses the page, and its text (at
    the reading measure), pictures, lists and tables in the right two thirds; under 1024px it is one
    column. The page ends with its key papers, its people and the other subject pages as ruled links.
  - Short sections, lists and a table instead of long paragraphs. Every picture is the lab's own figure
    with a caption; nothing is drawn to stand in for one. Prefer the lab's large Lead-DBS renders (sharp,
    1600px or wider, a calm background) to screenshots and slides; a caption says what the picture shows
    and names a paper only when that is certain.
- **Metadata has its own look.** Dates, places, times and roles get an icon (`layouts/_partials/icon.html`)
  and a muted label, not a sentence.
- **Navigation:** a solid 72px header (60px on a phone) that lines up with the page: the logo (46px) over
  the content's left edge, five items in 16px ink at the right. An item with pages under it (`children:` in data/nav.yaml) opens a sheet: the header's
  surface drawn down across the window, the pages in 24px under the menu, the page dimmed below. No
  arrows for a mouse (they show on touch screens and on keyboard focus); the current section is
  underlined in the Netstim teal; on a phone the items are groups that unfold. No tab bars, no floating menu cards.
  The header has no line under it, also when the page scrolls. A section page links its own pages in
  the page (the Research themes; one quiet line under the Publications title, front matter `also:`).
  Deeper pages show a small breadcrumb. The footer is dark and short: address and email, three social
  icons, and the lab-members, imprint and privacy links. It does not repeat the header menu.
- **Links stay in the text.** No stacks of "Learn more about X" under a paragraph that already links X.
- **Community** is one row per series under a hairline: the picture in the left third (a flyer as the sheet it is, opening in the image viewer; a logo as it is, with no plate except the light one the dark theme needs), and in the right two thirds a small kicker, the title, one line, the facts as property rows and, for the journal club, its three newest sessions. No cards.
- **Jobs** is built like a subject page: the title, one sentence (no open positions) and the wide group photo with its credit; then sections with the heading in the left third under a hairline and the content in the right two thirds (one column under 1024px). Like the Hsu lab's page it is practical and short: one paragraph on the lab (linking Research rather than repeating it), then how to apply with a short list of what to send. Open positions are ruled rows that run to the page's right edge (title, a gray line, an arrow). The address to write to is shown as the address itself, underlined. No status chip, no button, no cards.
- **Publications** is one list in two parts on one grid: a narrow column at the left (240px: the picture, the year, the journal) and the paper at the right, so every title on the page starts on the same line. Type leads, pictures accompany. Selected papers: a row each, the paper's own picture at the left (3:2, 8px corners; a journal cover is shown whole on the soft-gray frame), then the title (20–24px), the authors and the journal and year; a plain link at the heading's right jumps to the full list. All papers: one row per year (the year in 22px, how many papers, a plus) that opens and closes; the newest year is open. A paper is the journal in gray italics at the left, the title in ink and the authors as "Horn A" in gray, under a hairline; the lab's own people stand in ink at the same weight, nothing is bold. Above the years one row of two plain fields: the filter box and the topics as a native select; both search every year, and a year then says "2 of 32". "Open all years" is a text link under the list. On a phone it is one column: the selected papers keep a small picture at the left, the journal moves under the authors. No cards, no chips or tab bar, no grid of pictures, no paper without a picture among the selected, no icons, no arrow after each title.
- **A person's own page** (Andreas Horn) is not a CV dump: the name and one role line; the portrait at the left with the email address and the profile links under it as two icon rows, the biography beside it at reading size. Then sections with the heading in the portrait's column under a hairline that crosses the page: the awards first, as large ruled rows; positions and education along a rail (a filled dot for a position still held); publications and press as plain ruled rows. Every list keeps its years in one narrow column; a row that links ends in an arrow (↗ to another site), nothing in the lists is underlined. No cards, no icons for profile sites.
- **Logos** (funders) sit centered without boxes: a small line and the current funders, then a second small line and the past funders smaller and lighter. They are gray at rest and take their color on hover and focus; each links to the funder.

## Mechanics

- Hover styles only inside `@media (hover: hover)`. Transitions only on `transform`, `opacity` or `filter`.
  No gradients, no remote CSS. Reduced motion has its own branch.
- Every page works at 320px without sideways scrolling, and in the dark theme (`[data-theme="dark"]`,
  set by the button in the header, following the system until changed).
- Images come from `assets/media/` through `layouts/_partials/picture.html` (WebP sizes); decorative images
  get `alt=""`, figures get a real alt text and a caption.
- Hugo concatenates the CSS of the page's family (`layouts/_partials/page-family.html`), minifies and
  fingerprints it; scripts are ES modules from `assets/js/bundles/`. All page-load files use SRI.
- Menus, search, the image viewer and the person dialog are native dialogs with visible focus, focus
  wrapping and scroll locking. Controls are at least 44px tall on touch screens.
- Third-party players (YouTube, Vimeo, Spotify, Libsyn) load only after a click; the CSP in the
  `.htaccess` allows only those frame hosts.
