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
  alt: Two DBS electrodes reaching the subthalamic nucleus, shown in orange among neighboring structures and fiber tracts
  caption: Two DBS electrodes in the subthalamic nucleus (orange) of a patient with Parkinson’s disease, reconstructed in Lead-DBS.
papers: [HQ2AQ43J, SYFUNAC6, IWKLRKGE, B6AUQJ5A, 3YCUAHU5]
people: [Ilkem Aysu Sahin, Patricia Zvarova, Ellen Younger, Adriana Arrais, Jan Philipp Payonk]
---

In deep brain stimulation (DBS), implanted electrodes deliver continuous electrical stimulation to deep brain nuclei via a pulse generator. Most of our clinical work focuses on movement disorders, including Parkinson’s disease, essential tremor, and dystonia. We also study DBS in obsessive-compulsive disorder, Tourette’s syndrome, depression, and Alzheimer’s disease.

## Stimulated networks

Electrical stimulation spreads beyond the target nucleus along passing white-matter fibers to distant cortical and subcortical regions. From pre- and postoperative scans, we reconstruct each electrode in [Lead-DBS](@root@research/lead-dbs/) and model the surrounding electric field. Because diffusion and functional MRI are difficult to acquire in patients with implanted hardware, we often combine these reconstructions with [normative connectomes](@root@research/normative-connectomes/).

Comparing stimulated connections across patients links specific tracts to clinical benefit. Connectivity profiles predicted motor outcomes of subthalamic DBS in Parkinson’s disease ([Horn et al., 2017](https://doi.org/10.1002/ana.24974)), and in obsessive-compulsive disorder this approach identified a single fiber tract associated with symptom relief across surgical targets and centers ([Li et al., 2020](https://doi.org/10.1038/s41467-020-16734-3)).

<!-- TODO(netstim): complete this caption. The picture is the lab's render Li_et_al_light.png; if it shows the tract of Li et al., 2020, say so, and say what red, blue and the dots stand for. -->
![Bundles of red and blue fiber tracts with scattered dots, over a high-resolution scan of the human brain](media/research-dbs-tracts.jpg "Fiber tracts rendered in Lead-DBS over a high-resolution scan of the human brain.")

## Symptom-specific circuits

Different symptoms respond to different networks. In Parkinson’s disease, tremor, rigidity, slowness of movement, and gait each improve with stimulation of distinct circuits ([Rajamani et al., 2024](https://doi.org/10.1038/s41467-024-48731-1)). Across Parkinson’s disease, dystonia, Tourette’s syndrome, and obsessive-compulsive disorder, stimulation sites map onto separate frontal circuits, a framework we call the dysfunctome ([Hollunder et al., 2024](https://doi.org/10.1038/s41593-024-01570-1)).

<!-- TODO(netstim): confirm this caption. The picture comes from the news post on the Falling Walls award "for the lab's work on mapping the human dysfunctome"; the cohort it shows is not named there. -->
![Many DBS electrodes drawn as colored rods on both sides of a horizontal section of the human brain](media/dca20e656347-fw24-science-summit-ls-andreashorn-electrode-placements.png "DBS electrode placements from multiple patients projected onto a single brain slice.")

A current direction is pairing these circuit maps with adaptive DBS, which adjusts stimulation to a patient’s current symptoms ([Horn & Neumann, 2025](https://doi.org/10.1038/s41582-025-01131-5)).
