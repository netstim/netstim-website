---
title: Normative Connectomes
url: /research/normative-connectomes/
aliases:
- /research-interests/normative-connectomes/
family: research
topic: true
crumbs:
- title: Home
  url: '@root@'
- title: Research
  url: '@root@research/'
- title: Normative Connectomes
wordpress_id: 110
date: '2017-12-29T11:56:26+00:00'
modified: '2026-11-24T00:00:00+00:00'
lead: Group-average human brain connectomes used when patient-specific connectivity scans are unavailable.
# A subject page (layouts/_partials/research-topic.html), see content/research--deep-brain-stimulation.md.
# `drawing: true` is for a flat drawing on white: it is shown whole and blended into the gray frame, and the
# dark theme turns its lightness around.
figure:
  image: media/research-connectome-horn2014.png
  alt: Whole-brain structural tractogram in MNI space from an axial view, color-coded by fiber orientation
  caption: Structural group connectome in MNI space ([Horn et al., 2014](https://doi.org/10.1016/j.neuroimage.2013.09.069)).
  drawing: true
papers: [9SW4TFQH, KC8GHLXM, 6DJZZTVP, WKDSI5KR]
---

A normative connectome is a group-average map of human brain connectivity built from MRI scans of a large cohort. Structural connectomes are derived from diffusion MRI and tractography, and functional connectomes from resting-state fMRI. Individual scans are normalized to standard (MNI) space and averaged across the cohort.

## When we use them

Normative connectomes do not replace patient-specific connectivity data, but they enable network analysis when individual connectivity scans are missing or impractical to acquire:

- **Deep brain stimulation.** Postoperative MRI safety constraints and hardware artifacts make high-resolution diffusion or functional MRI difficult to acquire after surgery. Normative connectomes yield outcome-predictive connectivity profiles comparable to patient-specific scans ([Horn et al., 2017](https://doi.org/10.1002/ana.24974); [Wang et al., 2021](https://doi.org/10.1016/j.neuroimage.2020.117307)).
- **Noninvasive stimulation.** Normative connectomes estimate the distributed networks engaged by transcranial magnetic stimulation (TMS) targets ([Weigand et al., 2018](https://doi.org/10.1016/j.biopsych.2017.10.028)).
- **Lesion network mapping.** Because a stroke or focal lesion damages local tissue and disrupts passing fibers, normative connectomes estimate the pre-lesion network connected to the injury site ([Boes et al., 2015](https://doi.org/10.1093/brain/awv228); [Goede et al., 2025](https://doi.org/10.1038/s41467-025-60089-6)).
- **Retrospective cohorts.** Clinical DBS and lesion datasets collected across centers rarely include uniform research-grade diffusion or fMRI sequences; normative connectomes allow multi-center cohorts to be analyzed in a common space.

## Available connectomes

| Subjects | Cohort | Type |
| --- | --- | --- |
| 985 | Human Connectome Project (dTOR-985) | Structural |
| 169 | NKI Rockland Sample | Structural |
| 85 | Patients with Parkinson’s disease (PPMI) | Structural |
| 32 | MGH-USC Human Connectome Project | Structural |
| 19 | Healthy adults (Horn et al., 2014) | Structural |
| 1,000 | Brain Genomics Superstruct Project (GSP-1000) | Functional |
| 100 | Children and adolescents, 6 to 18 years | Functional |
| 89 | Patients with Parkinson’s disease and controls (PPMI) | Functional |
| 75 | Patients with Parkinson’s disease (Toronto) | Functional |

All of these connectomes load directly in [Lead-DBS](@root@research/lead-dbs/). Download links and citation details are listed in the [connectome catalog on lead-dbs.org](https://www.lead-dbs.org/helpsupport/knowledge-base/atlasesresources/normative-connectomes/).

## Development

- **2014.** With [Felix Blankenburg](https://www.researchgate.net/profile/Felix_Blankenburg), we introduced the first structural–functional group connectome in MNI space ([Horn et al., 2014](https://doi.org/10.1016/j.neuroimage.2013.09.069)) alongside an open [data-release paper](https://doi.org/10.1016/j.dib.2015.08.035).
- **2016.** We replicated the approach in a 169-subject NKI Rockland Sample cohort and showed that template-space group connectomes reproduce individual connectomic findings ([Horn & Blankenburg, 2016](https://doi.org/10.1016/j.neuroimage.2015.08.048)).
- **2017.** We released multi-shell structural connectomes from the [Human Connectome Project](https://www.humanconnectome.org/study/hcp-young-adult/document/mgh-adult-diffusion-data-acquisition-details), integrated the 1,000-subject [GSP functional connectome](https://doi.org/10.1016/j.neuroimage.2017.02.004) with Michael Fox and Thomas Yeo, and built Parkinson’s disease–specific structural and functional connectomes from [PPMI](https://www.ppmi-info.org/).
- **2021.** Comparing normative and patient-specific connectivity directly in DBS cohorts showed that normative connectomes capture similar variance in clinical outcomes ([Wang et al., 2021](https://doi.org/10.1016/j.neuroimage.2020.117307)).
- **2024.** Together with collaborators in Toronto, we released dTOR-985, a high-resolution normative tractogram built from 985 Human Connectome Project subjects ([Elias et al., 2024](https://doi.org/10.1038/s41597-024-03197-0)).
