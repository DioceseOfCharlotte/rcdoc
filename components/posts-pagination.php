<?php
if ( ! is_paged() || is_post_type_archive( doc_get_facet_cpts() ) ) {
	return; } ?>



<?php if ( hybrid_is_plural() ) : // If viewing the blog, an archive, or search results. ?>

<div class="u-1of1 u-text-1 u-lh-1 u-mb3">
	<?php the_posts_pagination(
		array(
			'prev_text' => __( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="v-icon"><path d="M15.717 2L18 4.35 10.583 12 18 19.65 15.717 22 6 12z"/></svg>', 'abraham' ),
			'next_text' => __( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="v-icon"><path d="M8.283 2L6 4.35 13.417 12 6 19.65 8.283 22 18 12z"/></svg>', 'abraham' ),
		)
	); ?>
</div>
<?php endif;
