# Editing the site

## Updates

Run `hugo new content posts/new-update.md` and fill out title, date, author, and linked breadcrumbs. Use a sentence-case title, keep the root slug stable after publication, and write the post in Markdown. Set `draft: true` when needed. The first Updates, author and category pages show new matching posts above the historical entries. The older archive pages are snapshots because the WordPress archive types exposed different excerpts and some included non-post pages.

Hugo includes new posts in RSS and search. The sidebar list comes from `data/updates.yaml`. Update it using the published title, URL, displayed timestamp and thumbnail from `assets/media/`.

## People and portraits

Edit `data/people.yaml`. Each ordered block has a layout mode and a Markdown body, with semantic HTML for aligned columns. Copy the adjacent person section, update its heading, biography and links, and put the portrait in `assets/media/`. A simple Markdown image can use `![Portrait of Name](media/name.jpg)`. For a column or a linked image, copy the existing `netstim-image` marker and edit its `src`, `alt`, and `width`.

The wide person blocks precede the alumni and sidebar.

## Publications

Add or edit rows in `data/publications.yaml`. Keep newest-first order using the source date, retain the citation text and DOI URL, and give the row a stable key. Existing rows use Zotero keys. The page renders the data and shows 20 entries at a time.

```yaml
- key: STABLE-ITEM-KEY
  title: Paper title
  date: '2026-11-17'
  citation: Author, A. (2026). Paper title. <i>Journal</i>. <a href="https://doi.org/example">https://doi.org/example</a>
```

The one-time importer uses saved public Zotpress responses in the supplemental capture. It overwrites imported files when reproducing the snapshot. Routine updates go into Markdown or YAML.

## Other content

- Edit standard pages in `content/` and posts in `content/posts/`.
- Keep event categories and locations on their existing routes. Edit their ordered blocks in `data/events.yaml`.
- Update poster and talk sections in `data/posters.yaml` and `data/videos.yaml`. Existing media markers show the player fields. The player URL belongs to a host in the static policy.
- Edit the nav and footer in `data/nav.yaml`. Use `@root@` in imported HTML and data for links that must stay under the Pages base path.
- Put downloadable originals at their paths under `static/`. Use resources in `assets/media/` for inline images so Hugo can select WebP variants.
- Treat the baseline content check as an editorial review gate. It records the import snapshot and flags deliberate edits in its per-route report.
