---
title: Updates
url: /crucial-methodological-updates-for-lead-dbs/
family: post
crumbs:
- title: Home
  url: '@root@'
- title: Updates
  url: '@root@blog/'
- title: Uncategorized
  url: '@root@category/uncategorized/'
- title: Important methodological updates for Lead-DBS
sidebar: true
wordpress_id: 275
date: '2018-11-04T18:05:24+00:00'
modified: '2018-12-02T11:38:53+00:00'
author: andreashorn
canonical: /crucial-methodological-updates-for-lead-dbs/
---

<article class="post-item"><div class="post-image"><a aria-label="1-s2.0-S221315821830305X-gr1-1" href="@root@wp-content/uploads/2018/11/1-s2.0-S221315821830305X-gr1-1.jpg" title="1-s2.0-S221315821830305X-gr1-1"><netstim-image data='{"src":"media/7b45b0b6633f-1-s2.0-S221315821830305X-gr1-1.jpg","original":"https://www.netstim.org/wp-content/uploads/2018/11/1-s2.0-S221315821830305X-gr1-1.jpg","alt":"","width":625}'/></a></div><div class="standard-content"><header aria-label="Post: Important methodological updates for Lead-DBS"><h2>Important methodological updates for Lead-DBS</h2><span class="post-meta"><time datetime="2018-11-04T18:05:24+00:00">November 4, 2018</time>/<a href="@root@crucial-methodological-updates-for-lead-dbs/#respond">0 Comments</a>/in <a href="@root@category/uncategorized/">Uncategorized</a>/by <a href="@root@author/andreashorn/">andreashorn</a></span></header>We are thrilled that the <a href="https://www.researchgate.net/publication/327380509_Lead-DBS_v2_Towards_a_comprehensive_pipeline_for_deep_brain_stimulation_imaging">Lead-DBS v2 methodological paper</a> is out in NeuroImage.
[An unpaywalled preprint can be found <a href="https://www.biorxiv.org/content/early/2018/08/28/322008">here</a>].

Lead-DBS was developed since 2012 and the first methods paper published in 2014. Since then, nearly everything has changed – and this led us to writing up the aforementioned updated methods paper. In the manuscript, we describe tools for multispectral nonlinear registration, structural/functional connectivity analyses, brain shift correction, reconstruction of microelectrode recordings and orientation detection of segmented DBS leads. The long author list reflects how many people have contributed to Lead-DBS development since then.

One particularly important processing step is nonlinear registration (patient brains to an atlas or the other way around). Currently, ten approaches to do so are readily built into Lead-DBS and each comes with adjustable settings. Thus, it became very important to investigate and quantify results that may originate from those different approaches. In a marathon effort spearheaded by <a href="https://www.researchgate.net/profile/Siobhan_Ewert">Siobhan Ewert</a> and led by <a href="https://www.researchgate.net/profile/Todd_Herrington">Todd M Herrington</a> that involved &gt;11,000 nonlinear warps, the two most promising normalization approaches were identified – ANTs based multispectral SyN registration as well as multispectram SPM-based segmentation – which are now the default choices in Lead-DBS. In fact, automatic segmentations of the STN/GPi performed using those approaches were marginally if not at all significantly worse than manual expert segmentations.
Their article <a href="https://www.researchgate.net/publication/327908494_Optimization_and_comparative_evaluation_of_nonlinear_deformation_algorithms_for_atlas-based_segmentation_of_DBS_target_nuclei">can be found here</a>.


Finally, a new study out of Bern/Oxford validated the default STN atlas defined in Lead-DBS (<a href="https://www.researchgate.net/publication/317032527_Toward_defining_deep_brain_stimulation_targets_in_MNI_space_A_subcortical_atlas_based_on_multimodal_MRI_histology_and_structural_connectivity">Siobhan Ewert’s DISTAL atlas</a>) using microelectrode recordings. This important work showed that anatomical and electrophysiological accuracy was highest for the DISTAL atlas when comparing it to two different atlases of the STN. <a href="https://www.researchgate.net/publication/327921854_Accuracy_of_different_three-dimensional_subcortical_human_brain_atlases_for_DBS_-lead_localisation">The article can be found here</a>.

<netstim-image data='{"src":"media/e4a01e0d8008-1-s2.0-S1053811918318664-gr1.jpg","original":"http://andreas-horn.de/wp-content/uploads/2018/11/1-s2.0-S1053811918318664-gr1-300x101.jpg","alt":"","width":300}'/> <netstim-image data='{"src":"media/7b45b0b6633f-1-s2.0-S221315821830305X-gr1-1.jpg","original":"http://andreas-horn.de/wp-content/uploads/2018/11/1-s2.0-S221315821830305X-gr1-1-300x149.jpg","alt":"","width":300}'/>
<h5>Share this entry</h5></div></article>

<div class="comments">
<div class="comment-summary">


0
replies




</div>
<h3>Leave a Reply</h3>Want to join the discussion?<br/>Feel free to contribute! <!-- #respond -->

</div>

end content
