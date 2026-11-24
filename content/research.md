---
title: Research
url: /research/
aliases:
- /research-interests/
- /about-us-2/research-interests/
family: research
crumbs:
- title: Home
  url: '@root@'
- title: Research
wordpress_id: 204
date: '2017-12-29T17:29:25+00:00'
modified: '2026-11-24T00:00:00+00:00'
lead: We map the brain circuits behind neurological and psychiatric disorders to guide where to stimulate. By pairing stimulation and lesion studies with human connectomics, we identify the pathways that account for clinical benefit.
# The overview (layouts/_partials/research-overview.html): groups (`title`) of research areas (`themes`).
# A group:
#   layout   `rows` (the default): large rows, the figure and the text side by side, swapping sides;
#            `pair`: a soft-gray band with the group's title and its areas two abreast, each under its figure
#   heading  `false` hides the group's title (screen readers still get it)
# An area:
#   title     the area, or the name of the method
#   question  the open question of a research area, set larger over the text (optional)
#   text      one short paragraph
#   links     one line of links to read on (label, url): the subject page, or a topic of the Publications page
#   image, alt, caption   one real figure from assets/media/. In a row it is shown whole in its own shape
#            (an upright figure stays narrow); in a pair it is cut to 3:2.
#   drawing  true for a figure drawn on a white ground: it stands free on the page without a frame, and the
#            dark theme turns its lightness around. `light` is a white-ground picture with a tissue section or
#            a 3D render in it, or a figure whose colors carry values, which stays a light plate in the
#            dark theme.
#   image_dark  the same picture on a dark ground, shown instead in the dark theme (optional)
# `id` is the anchor (/research/#id); `first: true` marks the first figure, which loads at once.
# Key papers and people are on the subject pages and on People, not here.
# Keep it short, and state only what a paper supports.
groups:
- title: Research areas
  heading: false
  themes:
  - id: deep-brain-stimulation
    first: true
    title: Tailoring deep brain stimulation
    question: Can we target the brain circuits behind each symptom?
    text: We reconstruct implanted electrodes from MRI and CT scans and model how electrical stimulation spreads along passing white-matter fibers. Comparing stimulated networks across patients has linked distinct circuits to individual symptoms in Parkinson’s disease and identified a single fiber tract tied to relief in obsessive-compulsive disorder.
    image: media/a287d71c4320-allTracts_bigbrain_zoomin-1536x867.png
    drawing: light
    alt: Fiber tracts in yellow, orange and green converging on the subthalamic nucleus, drawn over a section of the human brain
    # TODO(netstim): confirm the caption (the picture comes from the news post on Rajamani et al., 2024).
    caption: Fiber tracts at the subthalamic nucleus, from [Rajamani et al., 2024](https://doi.org/10.1038/s41467-024-48731-1).
    links:
    - {label: More on deep brain stimulation, url: '@root@research/deep-brain-stimulation/'}
  - id: lesions-and-tms
    title: Linking lesions and noninvasive stimulation
    question: Can focal brain lesions show where to aim noninvasive stimulation?
    text: Using normative connectomes, we estimate the networks that strokes disrupt and map the networks reached by transcranial magnetic stimulation (TMS). Comparing the two has shown that lesions and stimulation converge on common causal circuits, helping localize parkinsonism and identify candidate targets for TMS.
    # Panel A of Fig. 1 in Goede et al., 2025 (Nature Communications, CC BY 4.0), cut from
    # https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-025-60089-6/MediaObjects/41467_2025_60089_Fig1_HTML.png
    # (the panel's heading left off, nothing else changed). The paper's legend: 11 published cases of tremor
    # relief after a stroke, and the tremor-relief network found from them by lesion network mapping.
    # TODO(netstim): confirm this figure for the area, or send a lesion network mapping figure you prefer.
    image: media/research-lesion-network-goede2025.png
    drawing: light
    alt: Eleven brain slices, each with a stroke lesion marked in red, above two views of the brain surface and a flat map of the cerebellum colored where the lesions' network lies
    caption: Eleven stroke lesions that relieved tremor (top) and the network they share, found by lesion network mapping. From [Goede et al., 2025](https://doi.org/10.1038/s41467-025-60089-6), CC BY 4.0.
    links:
    - {label: Papers on lesion mapping, url: '@root@publications/?topic=lesion-mapping'}
    - {label: Papers on TMS, url: '@root@publications/?topic=tms'}
- title: Methods and software
  layout: pair
  themes:
  - id: normative-connectomes
    title: Normative connectomes
    question: How do we map brain circuits when a patient’s own connectivity cannot be scanned?
    text: We average diffusion and resting-state functional MRI from large cohorts to build group wiring diagrams of the human brain. We released the first normative structural connectome in MNI space in 2014 and share our connectomes openly for network studies of stimulation and stroke.
    # the same render twice: on white (cut close), and on black for the dark theme
    image: media/full-The_Human_Connectome.png
    image_dark: media/home-card-connectome.jpg
    drawing: true
    alt: Whole-brain fiber tracts seen from above, colored by direction
    caption: The first normative structural connectome in MNI space, from [Horn et al., 2014](https://doi.org/10.1016/j.neuroimage.2013.09.069).
    links:
    - {label: More on normative connectomes, url: '@root@research/normative-connectomes/'}
  - id: lead-dbs
    title: Lead-DBS
    question: Which brain pathways does an implanted electrode reach?
    text: Our open-source toolbox Lead-DBS locates electrodes on postoperative MRI or CT scans and models their electric fields to map the stimulated networks. We have built it since 2012 with collaborating groups, and it is used in our own studies and by labs around the world.
    image: media/research-leaddbs-electrodes-tracts.jpg
    alt: Two DBS electrodes ending in orange nuclei, with neighboring nuclei in green and blue and bundles of fiber tracts, over a section of the human brain
    caption: Electrodes at the subthalamic nucleus (orange) with passing fiber tracts, rendered in Lead-DBS.
    links:
    - {label: More on Lead-DBS, url: '@root@research/lead-dbs/'}
    - {label: Software and data, url: '@root@resources/'}
---
