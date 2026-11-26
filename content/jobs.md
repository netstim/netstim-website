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
modified: '2026-11-26T19:22:00+00:00'
# The page is drawn by layouts/_partials/jobs-page.html from the fields below (there is no body text).
#
# intro       Warm opening line beside the team photo.
# positions   Open positions. Leave the list empty (`positions: []`) and the page shows `opening` as a calm
#             note under `intro`. Add entries and an "Open positions" section appears automatically:
#               - title: Postdoc in DBS imaging         # the row's title
#                 url: https://…                        # optional: the advert; the whole row becomes the link
#                 text: Full time · apply by 31 January # optional: one gray line under the title
# opening     Short status note while there are no open positions.
# photo       Crisp team photo shown beside the intro (`src` in assets/media/, `alt`, optional `credit`).
# sections    Two sections shown side by side below: `title`, `text` (Markdown links work), optional `list`,
#             and `email: true` (renders inside the soft contact card with the address from data/contact.yaml).
intro: We’re always glad to hear from researchers, clinicians, and engineers curious about brain networks, stimulation, and open-source tools.
positions: []
opening: No funded openings are posted right now, though unsolicited applications — especially if you bring your own grant or fellowship — are always welcome.
photo:
  src: media/team-2026-arch.jpg
  alt: Eleven members of the Netstim team smiling outdoors under a mirrored arch sculpture on the University Hospital Cologne campus
sections:
- title: Working in the lab
  text: We study how the brain’s networks respond to invasive and noninvasive stimulation (see [Research](@root@research/)). Projects use structural MRI, resting-state fMRI, diffusion MRI tractography, and biophysical stimulation modeling. Nearly all of them involve [Lead-DBS](@root@research/lead-dbs/), our open-source toolbox, and every lab member contributes through code, documentation, testing, or teaching at [workshops](@root@community/#workshops).
- title: How to get in touch
  # TODO(netstim): confirm what applicants should send (e.g., subject line, references, earliest start date)
  # and whether to list Cologne PhD programs or fellowships.
  text: 'Send us a short email with:'
  list:
  - your CV
  - a brief note on your research interests
  - whether you have your own funding (a grant or fellowship)
  email: true
---
