---
title: Home
url: /
aliases:
- /about/
- /about-us/
- /internal/
- /internal/onboarding/
- /internal/links/
- /internal/events/
- /internal/events/categories/
- /internal/events/categories/imaging-meeting/
- /internal/events/categories/workshops/
- /internal/events/locations/
- /internal/events/locations/bonhoefferraum/
- /internal/events/locations/charite/
- /internal/events/locations/multifunktionsraum/
- /events/categories/imaging-meeting/
family: home
wordpress_id: 11
date: '2017-12-27T10:18:06+00:00'
modified: '2025-10-14T21:15:43+00:00'
# The home page (layouts/home.html), top to bottom: the opening (who we are, with photos that change), research,
# the publications as journal covers (data/covers.yaml), news (the newest posts, automatic) beside the book, community,
# and the funders. Keep every text to one line or two; `lede` is the short line under a section heading.
# The opening (`hero`): `title` and `place` are the page's heading: the name as the large line, the place
# under it in gray (a `tagline`, a short line in ink above the sentences, is possible but left out on purpose);
# `text` is one or two sentences, 30 to 40 words; `links` are two at most. `photos` are the pictures of the
# one frame, shown in turn in the order written here and changing every few seconds: write them as team,
# render, team, render, so the people and the work alternate. Without scripts the first one is shown.
# Use real, sharp photos and the lab's own renders (2000px wide or more; no slides, posters or logos; nobody
# who is a patient); every one needs an `alt`. The frame shows the middle of a photo; `focus: upper` keeps
# the upper part in view instead, `focus: right` the part right of the middle (another position needs its
# `.home-frame__slide--…` rule in assets/css/home.css).
hero:
  # TEMPORARY, until one is chosen. statement: the words first, then every photo in turn in a 3:2 frame.
  # picture: the picture first, in a tall frame (about square); a photo marked `tall: false` is left out of
  # it, because that frame would cut people off. duet: only the photos marked `people: true`, in a 3:2
  # frame, with the silent video `loop` as a smaller frame over its lower right corner.
  layout: picture
  title: Institute for Network Stimulation
  place: University Hospital Cologne
  text: We map the circuits that deep brain stimulation acts on to relieve neurological and psychiatric symptoms, and build the open-source Lead-DBS toolbox so other labs can do the same.
  links:
  - {label: Meet the team, url: '@root@people/'}
  - {label: Join the lab, url: '@root@jobs/'}
  photos:
  # TODO(netstim): which study these two Lead-DBS scenes come from (LEAD_Scene3 and LEAD_Scene6c in the
  # lab's render folder), so the alt texts can name the structures and a credit can be given.
  - image: media/opening-leaddbs-tracts.jpg
    alt: Lead-DBS render of two electrodes among colored fiber tracts and deep brain nuclei, over a section of the brain
    focus: right
  - image: media/research-dbs-tracts.jpg
    alt: Lead-DBS fiber tract reconstruction over intersecting BigBrain slices showing red and blue pathways associated with deep brain stimulation response
  - image: media/opening-leaddbs-coronal.jpg
    alt: Coronal Lead-DBS render of bilateral electrodes among colored fiber tracts and deep brain nuclei over a histological brain section
  - image: media/research-leaddbs-step-connectivity.jpg
    alt: Bilateral DBS electrodes with modeled stimulation fields and surrounding white-matter tracts in Lead-DBS
  # duet only: a silent MP4 in assets/media/ (H.264, no sound track, about 4 MB at most), its still, and
  # `start`, the second of the video that the still shows (playing begins there, so nothing jumps).
  loop:
    video: media/research-leaddbs-electrode.mp4
    image: media/research-leaddbs-electrode-poster.jpg
    start: 12
    alt: Animation of a directional DBS lead positioned in the subthalamic nucleus with one active stimulation contact
research:
  title: Research
  lede: The questions we work on and the software we build.
  link: {label: Research overview, url: '@root@research/'}
  cards:
  - title: Deep Brain Stimulation
    text: Mapping which brain circuits DBS electrodes reach and how they relieve symptoms.
    image: media/home-card-dbs.jpg
    url: '@root@research/deep-brain-stimulation/'
  - title: Normative Connectomes
    text: Average human brain wiring diagrams built from large MRI cohorts.
    image: media/home-card-connectome.jpg
    url: '@root@research/normative-connectomes/'
  - title: Lead-DBS
    text: Open-source toolbox developed since 2012 for electrode reconstruction and network modeling.
    image: media/home-card-leaddbs.jpg
    url: '@root@research/lead-dbs/'
people:
  title: People
  subtitle: Get in touch
  text: Whether you’re interested in joining the lab, starting a collaboration, or talking brain stimulation and open tools, we’re always glad to hear from you.
  links:
  - {label: Meet the team, url: '@root@people/'}
  - {label: Join the lab, url: '@root@jobs/'}
  photos:
  - image: media/team-2026-arch.jpg
    alt: The Netstim team outdoors under a mirrored arch sculpture on the hospital campus
  - image: media/team-2026-stack.jpg
    alt: The Netstim team in three stacked rows outdoors, each with their hands on the head of the person below
    focus: upper
# the journal covers themselves are the rows of data/covers.yaml
covers:
  title: Publications
  lede: A few things that we've figured out along the way.
  link: {label: All publications, url: '@root@publications/'}
news:
  title: News
  lede: What the group has been up to lately.
  count: 4
  link: {label: All news, url: '@root@news/'}
book:
  label: The book
  title: Connectomic Deep Brain Stimulation
  lede: Andy wrote a book!
  image: media/4cb5be70722a-Connectomic-Deep-Brain-Stimulation-1249x1536.png
  url: '@root@book/'
  link: About the book
community:
  title: Community
  lede: Where we talk brain stimulation out loud.
  link: {label: Community overview, url: '@root@community/'}
  # the cards themselves are in content/community.md
# Funders. `src` is the funder's own logo file in assets/media/ (never a drawn one). `width` is the logo's
# width on the page in px: raise it for a thin logo, lower it for a heavy one, until the row looks even.
# `name` is set beside a current funder's logo; leave it out where the logo spells the name out. `alt` is
# read aloud where no name is shown. Logos are drawn in one tone, so the file needs a clear background;
# `shaded: true` is for a filled seal, which keeps its own shades of gray. An entry without `src` shows
# `name` as text.
funding:
  title: Funded by
  past_title: Previously
  current:
  # The foundation's logo as it stands in its 2026 call for applications (the image in that PDF, which has a
  # clear background). The same logo as a JPEG on white:
  # https://www.deutsches-stiftungszentrum.de/sites/dsz/files/2025-09/schilling-stiftung_logo.jpg
  - src: media/schilling-stiftung-logo.png
    original: https://www.deutsches-stiftungszentrum.de/sites/dsz/files/2025-11/schilling-stiftung_ausschreibung_2026.pdf
    name: Hermann and Lilly Schilling Foundation
    alt: Hermann and Lilly Schilling Foundation for Medical Research
    url: https://www.deutsches-stiftungszentrum.de/stiftungen/schilling-stiftung
    width: 56
    shaded: true
  # The institute's own logo, the file in the header of nimh.nih.gov, unchanged.
  - src: media/nimh-logo.svg
    original: https://www.nimh.nih.gov/themes/nimhtheme/nimh-logo.svg
    alt: National Institute of Mental Health (NIMH), National Institutes of Health
    url: https://www.nimh.nih.gov/
    width: 176
  past:
  - src: media/57c49ab4b6d9-DFG_Logo.png
    original: https://www.netstim.org/wp-content/uploads/2019/04/DFG_Logo-300x107.png
    alt: German Research Foundation (DFG)
    url: https://www.dfg.de/
    width: 62
  - src: media/faa4a95d93b4-Dystonia-Medical-Research-Foundation.png
    original: https://www.netstim.org/wp-content/uploads/2019/04/Dystonia-Medical-Research-Foundation-300x98.png
    alt: Dystonia Medical Research Foundation
    url: https://dystonia-foundation.org/
    width: 118
  - src: media/95e381583581-logo_bihealth_en.png
    original: https://www.netstim.org/wp-content/uploads/2019/04/logo_bihealth_en-300x146.png
    alt: Berlin Institute of Health
    url: https://www.bihealth.org/
    width: 82
  - src: media/35c4f19ac7b0-stiftungcharite-1500x275.png
    original: https://www.netstim.org/wp-content/uploads/2019/04/stiftungcharite-300x55.png
    alt: Stiftung Charité
    url: https://www.stiftung-charite.de/
    width: 148
  - src: media/c069f491051a-Logo-Thiemann-Stiftung-web.png
    original: https://www.netstim.org/wp-content/uploads/2019/04/Logo-Thiemann-Stiftung-web-300x161.png
    alt: Thiemann Foundation for Parkinson’s Disease Research
    url: https://thiemannstiftung.de/
    width: 78
  # The logo file from ffor.org with its white background made clear; nothing else changed.
  - src: media/ffor-logo.png
    original: https://images.squarespace-cdn.com/content/v1/5f17cc921d92df1a46dad36c/1600811005112-S3K5WLVVN3D65BR17X95/FFOR_Logo_Website.jpg
    alt: Foundation for OCD Research (FFOR)
    url: https://www.ffor.org/
    width: 122
  # The logo file from the header of neurodegenerationresearch.eu, cropped to the mark: its empty margin and
  # the small line of white text under it are cut off.
  - src: media/jpnd-logo.png
    original: https://neurodegenerationresearch.eu/wp-content/uploads/2025/11/JPND-Logo-Colour2.png
    alt: EU Joint Programme – Neurodegenerative Disease Research (JPND)
    url: https://neurodegenerationresearch.eu/
    width: 86
---
