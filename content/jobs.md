---
title: Jobs
url: /jobs/
aliases:
- /about-us/jobs/
family: jobs
crumbs:
- title: Home
  url: '@root@'
- title: People
  url: '@root@people/'
- title: Jobs
sidebar: true
wordpress_id: 659
date: '2019-02-23T14:21:23+00:00'
modified: '2026-11-24T12:00:00+00:00'
# The page is drawn by layouts/_partials/jobs-page.html from the fields below (there is no body text).
#
# positions   Open positions. Leave the list empty (`positions: []`) and the page shows `opening` under the
#             title. Add entries and they replace that sentence: the page then starts with a section
#             "Open positions", one ruled row per entry:
#               - title: Postdoc in DBS imaging         # the row's title
#                 url: https://…                        # optional: the advert; the whole row becomes the link
#                 text: Full time · apply by 31 January # optional: one gray line under the title
# opening     The sentence under the title while there are no open positions.
# photo       The wide picture under it (`src` in assets/media/, `alt`, `credit`).
# sections    The page's sections, top to bottom: `title` and `text` (one paragraph; Markdown links work).
#             `list` is a short bulleted list under the text (each item one line; Markdown links work).
#             `email: true` shows the address to write to under the text. It is the `email:` in
#             data/contact.yaml.
positions: []
opening: We have no open positions right now. Unsolicited applications are still welcome, especially if you have your own grant or fellowship.
photo:
  src: media/12be6d1b284a-group_cut-1536x604.png
  alt: Seven members of the lab standing together in a hospital atrium
  credit: Michael Wodak / MedizinFotoKöln
sections:
- title: The lab
  text: We study how the brain’s networks respond to invasive and noninvasive stimulation (see [Research](@root@research/)). Projects use structural MRI, resting-state fMRI, diffusion MRI tractography and simulations of stimulation. Nearly all of them involve [Lead-DBS](@root@research/lead-dbs/), our open-source toolbox, and every lab member contributes to it through code, documentation, testing or teaching at [workshops](@root@community/). Our [lab manual](@root@internal/onboarding/) is public if you want to see how we work.
- title: How to apply
  # TODO(netstim): confirm what applicants should send. Proposed, not yet confirmed: a subject line such as
  # "POSTDOC - LEAD-DBS - Jane Smith", a statement of one or two paragraphs, two or three references,
  # the earliest start date.
  # TODO(netstim): name current PhD programs or fellowships in Cologne, if any (the old page named Berlin programs)
  text: 'Write to us by email with:'
  list:
  - your CV
  - a short note on your research interests
  - whether you have your own funding (a grant or fellowship)
  email: true
---
