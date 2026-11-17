# Design

Netstim uses the Lead-DBS Blend palette and typography within the WordPress site's spatial structure. Inter is self-hosted. Light surfaces use ink `#2f3437` and action blue `#2b5c8a`. Dark surfaces use a lighter action blue. The Netstim mark keeps its blue and teal identity. Coral is reserved for the existing mark.

- Keep the compact logo and right-aligned nav. The shared title and breadcrumb band keeps the original ordering.
- At desktop widths the max-width container is 1,210 pixels and the main/rail split is 73/27. At phone widths the original 7.5% gutter, stacked columns, and hidden sidebar behavior carry over. People sections retain their wide layouts, followed by the original sidebar placement.
- Use restrained type in the title band and wider, tightly tracked section headings. The uppercase greeting and the generic Publications headings receive a CSS case treatment. Scientific acronyms and names retain their spelling.
- Primary actions are ink pills. Consecutive secondary actions are plain links. External action links use a single diagonal arrow. Metadata, updates, and archive entries use thin rules and open white space.
- Lab photos, illustrations, and gallery items retain their order and aspect ratios. The cover-art gallery keeps five columns. The three slideshows offer manual controls. Linked gallery images open in a native dialog with the original image URL as the link fallback.
- The mobile menu, search and image viewer use native dialogs, visible focus, scroll locking and keyboard focus wrapping. Nav and action controls have a 44-pixel minimum. In-flow links retain normal text behavior. Hover has a pointer-capability guard. Reduced motion has an explicit CSS branch.
- The legal footer follows the original sparse arrangement. The mirror contains no separate socket element on its 86 routes.

`assets/css/` has six shell files plus content, search, and page-family files. `layouts/_partials/page-family.html` chooses the family. Hugo concatenates, minifies and fingerprints the styles, and builds ES modules from `assets/js/bundles/`. All page-load scripts and styles use SRI. The two icon fonts carry glyphs used by the source site. Inter is the text face.

A theme setting lives on the device and follows system preference until overridden. Third-party media contacts its provider after activation. The local CSP allows only the corresponding frame hosts. Ordinary browsing needs no consent prompt.
