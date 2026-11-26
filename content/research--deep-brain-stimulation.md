---
title: Deep Brain Stimulation
url: /research/deep-brain-stimulation/
aliases:
- /research-interests/deep-brain-stimulation/
family: research
topic: true
crumbs:
- title: Home
  url: '@root@'
- title: Research
  url: '@root@research/'
- title: Deep Brain Stimulation
wordpress_id: 151
date: '2017-12-29T13:15:30+00:00'
modified: '2026-11-24T00:00:00+00:00'
lead: We map the brain networks modulated by deep brain stimulation in movement and psychiatric disorders.
# A subject page (layouts/_partials/research-topic.html): the wide picture under the title (`figure`), the
# text below (each `## heading` starts a section), then the key papers (`papers`: Zotero keys from
# data/publications.yaml) and the people (`people`: names from data/people.yaml).
figure:
  image: media/full-abb_1.jpg
  alt: Bilateral DBS electrodes localized in the subthalamic nucleus alongside the red nucleus, pallidum, and surrounding fiber tracts on BigBrain slices
  caption: Bilateral subthalamic DBS electrode reconstruction with surrounding nuclei and white-matter pathways in Lead-DBS.
papers: [HQ2AQ43J, SYFUNAC6, IWKLRKGE, B6AUQJ5A, 3YCUAHU5]
people: [Ilkem Aysu Sahin, Patricia Zvarova, Ellen Younger, Adriana Arrais, Jan Philipp Payonk]
---

Deep brain stimulation (DBS) delivers continuous electrical stimulation to deep brain nuclei via implanted electrodes. Most of our work focuses on movement disorders — Parkinson’s disease, essential tremor, and dystonia — alongside obsessive-compulsive disorder, Tourette’s syndrome, depression, and Alzheimer’s disease.

## Stimulated networks

By reconstructing each patient’s electrodes in [Lead-DBS](@root@research/lead-dbs/) and pairing modeled electric fields with [normative connectomes](@root@research/normative-connectomes/), we link stimulated white-matter tracts directly to clinical benefit — predicting motor outcomes in Parkinson’s disease ([Horn et al., 2017](https://doi.org/10.1002/ana.24974)) and identifying a single response tract across OCD cohorts and surgical targets ([Li et al., 2020](https://doi.org/10.1038/s41467-020-16734-3)).

![Obsessive-compulsive disorder DBS response tract showing positively (red) and negatively (blue) associated white-matter fibers and active stimulation sites on BigBrain slices](media/research-dbs-tracts.jpg "Obsessive-compulsive disorder DBS response tract across cohorts (Li et al., 2020), rendered in Lead-DBS.")

## Symptom-specific circuits

Individual symptoms respond to distinct circuits ([Rajamani et al., 2024](https://doi.org/10.1038/s41467-024-48731-1)). Across Parkinson’s disease, dystonia, Tourette’s syndrome, and OCD, stimulation sites map onto separable frontal networks — a framework we call the dysfunctome ([Hollunder et al., 2024](https://doi.org/10.1038/s41593-024-01570-1)) — which we are now pairing with adaptive DBS ([Horn & Neumann, 2025](https://doi.org/10.1038/s41582-025-01131-5)).

![Multi-cohort DBS electrodes color-coded by disorder reconstructed in MNI space over an axial BigBrain slice](media/dca20e656347-fw24-science-summit-ls-andreashorn-electrode-placements.png "Multi-cohort DBS electrode reconstructions across four disorders normalized to MNI space for dysfunctome mapping (Hollunder et al., 2024).")
