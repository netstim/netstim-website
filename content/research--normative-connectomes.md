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
  alt: Whole-brain fiber tracts seen from above, colored by direction
  caption: The first normative structural connectome in MNI space ([Horn et al., 2014](https://doi.org/10.1016/j.neuroimage.2013.09.069)).
  drawing: true
papers: [9SW4TFQH, KC8GHLXM, 6DJZZTVP, WKDSI5KR]
---

A normative connectome is a group-average map of human brain connectivity built from MRI scans of a large cohort. Structural connectomes are derived from diffusion MRI and tractography, and functional connectomes from resting-state fMRI. Individual scans are normalized to standard (MNI) space and averaged across the cohort.

## When we use them

Normative connectomes do not replace patient-specific connectivity data, but they allow network analysis when individual connectivity scans are missing or cannot be acquired:

- **Deep brain stimulation.** Postoperative scanning restrictions make high-quality connectivity data difficult to acquire after surgery. Our [DBS studies](@root@research/deep-brain-stimulation/) rely on normative connectomes (e.g., Horn [2017a](http://onlinelibrary.wiley.com/doi/10.1002/ana.24974/abstract), [b](https://www.ncbi.nlm.nih.gov/pubmed/28163141), [c](http://onlinelibrary.wiley.com/doi/10.1002/hbm.23594/abstract)).
- **Noninvasive stimulation.** Normative connectomes similarly estimate the networks targeted by transcranial magnetic stimulation (TMS) (e.g., [Weigand 2017](http://doi.org/10.1016/j.biopsych.2017.10.028)).
- **Stroke.** Because a lesion disrupts local tissue and connectivity, normative connectomes estimate the pre-lesion connectivity of the damaged region (e.g., [Boes 2015](http://doi.org/10.1093/brain/awv228), [Laganiere 2016](http://doi.org/10.1212/WNL.0000000000002741), [Fischer 2016](http://doi.org/10.1212/WNL.0000000000003404), [Darby 2016](http://doi.org/10.1093/brain/aww288) and [2017](http://doi.org/10.1073/pnas.1706587115), [Fasano 2017](http://doi.org/10.1002/ana.24845)).
- **Retrospective cohorts.** Retrospective clinical datasets rarely include connectivity scans, and combining them with normative connectomes adds network information (e.g., [Horn 2017a](http://onlinelibrary.wiley.com/doi/10.1002/ana.24974/abstract)).

## Available connectomes

| Subjects | Cohort | Type |
| --- | --- | --- |
| 985 | Human Connectome Project (dTOR-985) | Structural |
| 169 | NKI Rockland Sample | Structural |
| 85 | Patients with Parkinson’s disease (PPMI) | Structural |
| 32 | MGH-USC Human Connectome Project | Structural |
| 19 | The first group connectome (2014) | Structural |
| 1,000 | Brain Genomics Superstruct Project | Functional |
| 100 | Children and adolescents, 6 to 18 years | Functional |
| 89 | Patients with Parkinson’s disease and controls (PPMI) | Functional |
| 75 | Patients with Parkinson’s disease (Toronto) | Functional |

All of these connectomes load directly in [Lead-DBS](@root@research/lead-dbs/). Download links and citation details are listed in the [connectome catalog on lead-dbs.org](https://www.lead-dbs.org/helpsupport/knowledge-base/atlasesresources/normative-connectomes/).

## History

- **2014.** Under the lead of [Felix Blankenburg](https://www.researchgate.net/profile/Felix_Blankenburg), we published the [first article](https://www.ncbi.nlm.nih.gov/pubmed/24099851) describing a structural-functional MNI connectome, accompanied by a [data-release article](https://www.sciencedirect.com/science/article/pii/S2352340915001912).
- **2016.** We [replicated these results](https://www.ncbi.nlm.nih.gov/pubmed/26327244) in a much larger cohort of healthy subjects (169 NKI-RS subjects) and validated normative connectomes by replicating multiple connectomic studies directly in template space using the group connectome alone.
- **2017.** Under the lead of [Andrea A Kühn](https://www.researchgate.net/profile/Andrea_Kuehn2), a [first article](http://onlinelibrary.wiley.com/doi/10.1002/hbm.23594/abstract) combined normative connectomes with subcortical electrophysiological recordings, using multishell diffusion data from the [Human Connectome Project](https://www.humanconnectome.org/study/hcp-young-adult/document/mgh-adult-diffusion-data-acquisition-details) ([Setsompop 2013](https://www.ncbi.nlm.nih.gov/pubmed/23707579)).
- **2017.** Under the lead of [Michael D Fox](https://www.researchgate.net/profile/Michael_Fox11), a [second article](https://www.ncbi.nlm.nih.gov/pubmed/28163141) explored connectivity profiles of literature-based DBS targets using a 1,000-subject functional connectome from the Harvard [Genomic Superstruct Project](http://neuroinformatics.harvard.edu/gsp/), preprocessed and provided by [Thomas Yeo](https://www.researchgate.net/profile/BT_Thomas_Yeo) ([Yeo 2011](https://www.researchgate.net/publication/51201884_The_organization_of_the_human_cerebral_cortex_estimated_by_functional_correlation)).
- **2017.** A [third article](https://www.ncbi.nlm.nih.gov/pubmed/28586141) built both functional and structural average connectomes from patients with Parkinson’s disease using data from the [PPMI project](http://www.ppmi-info.org/).
