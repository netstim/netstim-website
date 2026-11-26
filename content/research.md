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
#   layout   `rows` (the default): a row per area, the text at the left and the figure at the right;
#            `pair`: a soft-gray band with the group's title and its areas two abreast, each under its figure
#   heading  `false` hides the group's title (screen readers still get it)
# An area:
#   title     the area, or the name of the method
#   question  the open question of a research area, in medium weight over the text (optional)
#   text      one short paragraph
#   links     one line of links to read on (label, url): the subject page, or a topic of the Publications page
#   image, alt, caption   one real figure from assets/media/. Every figure is shown in the same 4:3 plate:
#            a picture fills it (cut to its shape); an upright figure and a `drawing: true` one are shown
#            whole inside it.
#   drawing  true for a figure drawn on a white ground: it is blended into the plate, and the dark theme
#            turns its lightness around. `light` is a white-ground picture with a tissue section or
#            a 3D render in it, or a figure whose colors carry values, which stays a light plate in the
#            dark theme.
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
    alt: Symptom-specific white-matter tracts converging on the subthalamic nucleus on a BigBrain histological slice
    caption: Symptom-specific white-matter tracts converging on the subthalamic nucleus in Parkinson’s disease ([Rajamani et al., 2024](https://doi.org/10.1038/s41467-024-48731-1)).
    links:
    - {label: More on deep brain stimulation, url: '@root@research/deep-brain-stimulation/'}
  - id: lesions-and-tms
    title: Linking lesions and noninvasive stimulation
    question: Can focal brain lesions show where to aim noninvasive stimulation?
    text: Using normative connectomes, we estimate the networks that strokes disrupt and map the networks reached by transcranial magnetic stimulation (TMS). Comparing the two has shown that lesions and stimulation converge on common causal circuits, helping localize parkinsonism and identify candidate targets for TMS.
    # Panel A of Fig. 1 in Goede et al., 2025 (Nature Communications, CC BY 4.0), cut from
    # https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-025-60089-6/MediaObjects/41467_2025_60089_Fig1_HTML.png
    # (the panel's heading left off, nothing else changed).
    image: media/research-lesion-network-goede2025.png
    drawing: light
    alt: Eleven axial brain slices showing tremor-relieving stroke lesions in red above cortical and cerebellar maps of their convergent network
    caption: Tremor-relieving stroke lesions (n = 11) and their convergent cortical and cerebellar network ([Goede et al., 2025](https://doi.org/10.1038/s41467-025-60089-6), CC BY 4.0).
    links:
    - {label: Papers on lesion mapping, url: '@root@publications/?topic=lesion-mapping'}
    - {label: Papers on TMS, url: '@root@publications/?topic=tms'}
  # Lead-DBS, the normative connectomes and the atlases as the third area: building tools is part of the
  # research. The downloads themselves are on Resources (content/resources.md).
  - id: open-tools-and-data
    layout: right
    title: Developing methods and open tools
    question: How can we make circuit mapping more accurate and open?
    text: We develop and refine the methods behind circuit mapping, from image registration and electrode localization to biophysical electric-field and pathway-activation modeling with tools such as OSS-DBS. We bring these methods together in Lead-DBS, a free open-source platform used by research groups worldwide, and share subcortical atlases and normative connectomes built from large MRI cohorts so other labs can run network studies even without patient-specific connectivity scans.
    image: media/research-leaddbs-electrodes-tracts.jpg
    alt: Bilateral DBS electrodes localized in the subthalamic nucleus with surrounding basal ganglia nuclei and white-matter tracts on a coronal BigBrain slice
    caption: Bilateral subthalamic DBS electrodes with surrounding basal ganglia nuclei and white-matter pathways, rendered in Lead-DBS.
    links:
    - {label: Lead-DBS, url: '@root@research/lead-dbs/'}
    - {label: OSS-DBS, url: 'https://github.com/SFB-ELAINE/OSS-DBSv2'}
    - {label: Normative connectomes, url: '@root@research/normative-connectomes/'}
    - {label: Resources, url: '@root@resources/'}
---
