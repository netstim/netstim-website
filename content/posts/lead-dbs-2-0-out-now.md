---
title: Updates
url: /lead-dbs-2-0-out-now/
family: post
crumbs:
- title: Home
  url: '@root@'
- title: Updates
  url: '@root@blog/'
- title: Uncategorized
  url: '@root@category/uncategorized/'
- title: Lead-DBS 2.0 out now
sidebar: true
wordpress_id: 189
date: '2017-09-10T14:17:25+00:00'
modified: '2017-12-29T17:06:21+00:00'
author: andreashorn
comment_anchor: false
canonical: /lead-dbs-2-0-out-now/
---

<article class="post-item"><div class="post-image"><a aria-label="two_oh_in_a_nutshell" href="@root@wp-content/uploads/2017/12/two_oh_in_a_nutshell-1030x624.png" title="two_oh_in_a_nutshell"><netstim-image data='{"src":"media/cf6a8180be3e-two_oh_in_a_nutshell-845x321.png","original":"https://www.netstim.org/wp-content/uploads/2017/12/two_oh_in_a_nutshell-845x321.png","alt":"","width":845}'/></a></div><div class="standard-content"><header aria-label="Post: Lead-DBS 2.0 out now"><h2>Lead-DBS 2.0 out now</h2><span class="post-meta"><time datetime="2017-09-10T14:17:25+00:00">September 10, 2017</time>/<a href="@root@lead-dbs-2-0-out-now/#respond">0 Comments</a>/in <a href="@root@category/uncategorized/">Uncategorized</a>/by <a href="@root@author/andreashorn/">andreashorn</a></span></header><p>We are proud to release Lead-DBS 2.0 to the community – an open source tool to localize Deep Brain Stimulation (DBS) electrodes in the human brain.</p>

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
<div class="share"><h3 class="share-title">Share this entry</h3><ul class="share-links"><li><a aria-label="Share on Facebook" class="icon-link" data-icon="" href="https://www.facebook.com/sharer.php?u=https://www.netstim.org/lead-dbs-2-0-out-now/&amp;t=Lead-DBS%202.0%20out%20now" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on X" class="icon-link" data-icon="" href="https://twitter.com/share?text=Lead-DBS%202.0%20out%20now&amp;url=https://www.netstim.org/?p=189" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on Pinterest" class="icon-link" data-icon="" href="https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.netstim.org%2Flead-dbs-2-0-out-now%2F&amp;description=Lead-DBS%202.0%20out%20now&amp;media=https%3A%2F%2Fwww.netstim.org%2Fwp-content%2Fuploads%2F2017%2F12%2Ftwo_oh_in_a_nutshell-705x427.png" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on LinkedIn" class="icon-link" data-icon="" href="https://linkedin.com/shareArticle?mini=true&amp;title=Lead-DBS%202.0%20out%20now&amp;url=./" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on Tumblr" class="icon-link" data-icon="" href="https://www.tumblr.com/share/link?url=https%3A%2F%2Fwww.netstim.org%2Flead-dbs-2-0-out-now%2F&amp;name=Lead-DBS%202.0%20out%20now&amp;description=We%20are%20proud%20to%20release%C2%A0Lead-DBS%202.0%C2%A0to%20the%20community%20%E2%80%93%20an%20open%20source%20tool%20to%20localize%20Deep%20Brain%20Stimulation%20%28DBS%29%20electrodes%20in%20the%20human%20brain.%20A%20detailed%20description%20of%20all%20major%20new%20features%20is%20available%20here%20%5Bhttp%3A%2F%2Fwww.lead-dbs.org%2F%3Fp%3D3174%5D%2C%20but%20in%20a%20nutshell%20they%20are%3A%20DISTAL%20atlas%3A%20A%20detailed%20brain%20atlas%20of%20the%20human%20subcortex%20based%20on%20histology%20%5B%E2%80%A6%5D" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on Vk" class="icon-link" data-icon="" href="https://vk.com/share.php?url=./" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share on Reddit" class="icon-link" data-icon="" href="https://reddit.com/submit?url=https://www.netstim.org/lead-dbs-2-0-out-now/&amp;title=Lead-DBS%202.0%20out%20now" rel="noopener noreferrer" target="_blank" title=""></a></li><li><a aria-label="Share by Mail" class="icon-link" data-icon="" href="mailto:?subject=Lead-DBS%202.0%20out%20now&amp;body=./" title=""></a></li></ul></div></div></article>

<div class="comments">
<div class="comment-summary" id="respond">


0
replies




</div>
<h3>Leave a Reply</h3>Want to join the discussion?<br/>Feel free to contribute! 

</div>
