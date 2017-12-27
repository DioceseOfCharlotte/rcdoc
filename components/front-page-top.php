<?php
/**
 * For the top of the site front-page.
 */

$featured_posts = rcdoc_get_featured_posts();
if ( empty( $featured_posts ) ) {
	return;
}

foreach ( $featured_posts as $post ) {
	setup_postdata( $post );
	?>
	<div class="tile u-1of1 u-flex-wrap o-cell u-br u-p1 u-shadow1 u-bg-1-glass
	">
	<?php the_content(); ?>
	</div>
	<?php
}
wp_reset_postdata();
