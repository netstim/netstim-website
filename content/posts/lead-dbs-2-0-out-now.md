---
title: Lead-DBS 2.0 out now
url: /lead-dbs-2-0-out-now/
family: post
crumbs:
- title: Home
  url: '@root@'
- title: News
  url: '@root@blog/'
- title: Lead-DBS 2.0 out now
sidebar: true
wordpress_id: 189
date: '2017-09-10T14:17:25+00:00'
modified: '2017-12-29T17:06:21+00:00'
author: andreashorn
canonical: /lead-dbs-2-0-out-now/
---

<div class="image-block post-lead-image"><a aria-label="two_oh_in_a_nutshell" href="@root@wp-content/uploads/2017/12/two_oh_in_a_nutshell-1030x624.png" title="two_oh_in_a_nutshell"><netstim-image data='{"src":"media/cf6a8180be3e-two_oh_in_a_nutshell-845x321.png","original":"https://www.netstim.org/wp-content/uploads/2017/12/two_oh_in_a_nutshell-845x321.png","alt":"","width":845}'/></a></div><p>We are proud to release Lead-DBS 2.0 to the community – an open source tool to localize Deep Brain Stimulation (DBS) electrodes in the human brain.</p>

<p>A detailed description of all major new features is available here [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org%2F%3Fp%3D3174" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org/?p=3174</a>], but in a nutshell they are:</p>

<ul>
<li>DISTAL atlas: A detailed brain atlas of the human subcortex based on histology (graciously provided by <a href="https://www.researchgate.net/profile/M_Chakravarty">M. Mallar Chakravarty</a> and <a href="https://www.researchgate.net/profile/Louis_Collins">Louis Collins</a>), MRI and structural connectivity. It is available in three different nomenclatures, thus serving as a rosetta stone for thalamic nomenclatures (See <a href="https://www.researchgate.net/profile/Siobhan_Ewert">Siobhan Ewert</a>‘s
<span class="publication-type">Article</span> <a href="https://www.researchgate.net/publication/317032527_Toward_defining_deep_brain_stimulation_targets_in_MNI_space_A_subcortical_atlas_based_on_multimodal_MRI_histology_and_structural_connectivity">Toward defining deep brain stimulation targets in MNI space:…</a>
<p>; for a summary see here [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org%2F%3Fpage_id%3D2911" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org/?page_id=2911</a>]).</p></li>
<li>FEM-based VTA model (beta): To model the physical effects of DBS in the brain, we teamed up with <a href="https://www.researchgate.net/profile/Johannes_Vorwerk">Johannes Vorwerk</a> (SimBio/FieldTrip toolboxes) and Qianqian Fang (Iso2Mesh toolbox). Further help was provided by <a href="https://www.researchgate.net/profile/Ningfei_Li">Ningfei Li</a> (integration inside Lead-DBS), <a href="https://www.researchgate.net/profile/Robert_Oostenveld">Robert Oostenveld</a> (Initial counseling and help with FieldTrip-related code). This is the first open-source pipeline to model volumes of tissue activated (VTA) as a one-step solution (see <a href="https://www.researchgate.net/publication/317381045_Connectivity_Predicts_deep_brain_stimulation_outcome_in_Parkinson_disease">Connectivity Predicts deep brain stimulation outcome in Park…</a>and this page [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org%2F%3Fpage_id%3D3291" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org/?page_id=3291</a>] for details).</li>
<li>Human Motor Thalamus Atlas: Graciously provided by Igor &amp; Kristy Ilinsky, the human motor thalamus settles controversies about motor projections in the human thalamus. It is based on specialized histological stains and was precisely co-registered to ICBM 2009b space. For more information about the dataset, see [http://<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.humanmotorthalamus.com" rel="noopener noreferrer" target="_blank">www.humanmotorthalamus.com</a>].</li>
<li>PaCER: A fully automated method to precisely reconstruct DBS electrode localizations based on postoperative CT data will soon be published by <a href="https://www.researchgate.net/profile/Andreas_Husch">Andreas Husch</a> (Hertel group, Luxembourg) and was graciously provided to Lead-DBS. For more information about PaCER, see [<a href="https://www.researchgate.net/deref/https%3A%2F%2Fadhusch.github.io%2FPaCER%2F" rel="noopener noreferrer" target="_blank">https://adhusch.github.io/PaCER/</a>].</li>
<li>MER-Mapping: Ari Kappel (Richardson lab, Pittsburgh) and <a href="https://www.researchgate.net/profile/Chadwick_Boulay">Chadwick Boulay</a> (Sachs lab, Ottawa) created an intuitive and precise tool to combine DBS reconstructions with microelectrode recordings within Lead-DBS.</li>
<li>Multiple novel atlases: In total, Lead-DBS now comes with 23 subcortical atlases [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org%2F%3Fpage_id%3D45" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org/?page_id=45</a>] and 14 whole-brain parcellations [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org%2F%3Fpage_id%3D1004" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org/?page_id=1004</a>] suited for connectomics.</li>
<li>Enhanced workflows: We re-designed large parts of the registration pipeline. For normalization strategies, all SPM routines, ANTs, FSL’s FNIRT and a MaGET-brain like procedure are available directly in Matlab (and without the need to install anything else).</li>
</ul>

<p>We hope you like our new release – and please don’t hesitate to spread the word to colleagues in the DBS field. To download Lead-DBS now, see [<a href="https://www.researchgate.net/deref/http%3A%2F%2Fwww.lead-dbs.org" rel="noopener noreferrer" target="_blank">http://www.lead-dbs.org</a>].</p>

<netstim-image data='{"src":"media/74e945972f19-two_oh_in_a_nutshell-1500x909.png","original":"http://andreas-horn.de/wp-content/uploads/2017/12/two_oh_in_a_nutshell-300x182.png","alt":"","width":300}'/>


