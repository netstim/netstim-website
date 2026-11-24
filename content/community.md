---
title: Community
url: /community/
family: community
crumbs:
- title: Home
  url: '@root@'
- title: Community
date: '2026-11-24T00:00:00+00:00'
modified: '2026-11-24T00:00:00+00:00'
lead: Journal clubs, podcasts, and workshops hosted by the lab.
# The Community page (layouts/_partials/community-page.html): one row per thing the lab runs or hosts, the
# picture on the left, the text and the facts on the right. Each entry:
#   kicker   a small line above the title (what it is)
#   title, url
#   text     one line (also the line on Home); `brief: true` leaves it out on this page, where the kicker
#            and the facts already say it
#   poster   the picture on this page (a flyer, upright; a click opens it large), with its `alt`; without
#            one the logo (`image`) stands there
#   facts    property rows: `icon` (layouts/_partials/icon.html), `label`, and `text` (with `url`, a link)
#            or `person` (a name from data/people.yaml: the portrait and a link to the person)
#   from     `stimu-latte` takes the flyer, the facts and the three newest sessions from
#            data/stimu_latte.yaml; nothing to keep up to date here
#   start, end, place   a dated entry (YYYY-MM-DD): adds "Add to calendar", a calendar file with these days
#   until    optional last day (YYYY-MM-DD): after it the entry is left out at the next build
#   home     false keeps an entry off Home
# Home shows the entries too (layouts/home.html), as logos on colored panels (`image`, `ground`).
cards:
- title: Stimu-Latte
  kicker: Monthly journal club
  text: One paper followed by coffee and open discussion, run by our postdocs in Cologne as part of the Forschungsschwerpunkt Neuromodulation. All career levels are welcome.
  image: media/5d84ece1bc6e-Stimulate_logo-2-1500x430.png
  ground: latte
  from: stimu-latte
  url: '@root@stimu-latte/'
- title: Stimulating Brains
  kicker: Podcast and talk series on neuromodulation
  text: A podcast and talk series hosted by Andreas Horn, with interviews about the past, present, and future of neuromodulation and talks by senior colleagues and rising stars in the field.
  brief: false
  image: media/a473d51a1584-StimBrains_Logo_Vertical_Portfolio_transparentBG-1536x676.png
  ground: plate
  facts:
  - {icon: user, label: Host, person: Andreas Horn}
  - {icon: link, label: Website, text: stimulatingbrains.org, url: 'https://www.stimulatingbrains.org'}
  # TODO(netstim): the newest episodes (number, guest, date, link) and where to listen (Spotify, Apple
  # Podcasts, YouTube). The page can list them like the Stimu-Latte sessions once they are entered here.
  url: https://www.stimulatingbrains.org
- title: Hands-on Lead-DBS workshop
  kicker: Save the date
  text: A two-day practical workshop with an early preview of Lead-DBS 4.0, rebuilt in Python.
  poster: media/lead-dbs-workshop-2027-flyer.png
  alt: 'Flyer: save the date, hands-on Lead-DBS workshop, 11–12 February 2027'
  facts:
  - {icon: calendar, label: When, text: 11–12 February 2027}
  - {icon: pin, label: Where, text: Cologne}
  # TODO(netstim): the venue, and how to register, once they are announced
  # TODO(netstim): link the workshop's own page on lead-dbs.org (/events/hands-on-workshop-2027/) once it is live
  url: https://www.lead-dbs.org/
  start: '2027-02-11'
  end: '2027-02-12'
  place: Cologne
  until: '2027-02-12'
  home: false
---
