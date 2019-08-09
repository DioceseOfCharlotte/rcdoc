<?php
/**
 * Post Children.
 *
 * https://wordpress.stackexchange.com/questions/120407/how-to-fix-pagination-for-custom-loops
 * http://web-profile.net/wordpress/themes/wordpress-custom-loop/
 * @package  RCDOC
 */

if ( get_query_var( 'paged' ) ) {
	$paged = get_query_var( 'paged' );
} elseif ( get_query_var( 'page' ) ) { // 'page' is used instead of 'paged' on Static Front Page
	$paged = get_query_var( 'page' );
} else {
	$paged = 1;
}

$custom_query_args = array(
	'post_parent'    => get_the_ID(),
	'post_type'      => 'any',
	'posts_per_page' => get_option( 'posts_per_page' ),
	'paged'          => $paged,
	'order'          => 'ASC',
	'orderby'        => 'menu_order',
);

$custom_query = new WP_Query( $custom_query_args );

if ( $custom_query->have_posts() ) : ?>

	<!-- <div class="o-cell o-grid u-m0 u-p0 u-1of1"> -->

		<?php
		while ( $custom_query->have_posts() ) :
			$custom_query->the_post();

			hybrid_get_content_template();

		endwhile;
		?>

	<!-- </div> -->

	<?php if ( $custom_query->max_num_pages > 1 ) : // custom pagination ?>
		<?php
		$orig_query = $wp_query; // fix for pagination to work
		$wp_query   = null;
		$wp_query   = $custom_query;
		?>

		<nav class="prev-next-posts">
			<div class="prev-posts-link">
				<?php echo get_next_posts_link( 'Next >', $custom_query->max_num_pages ); ?>
			</div>
			<div class="next-posts-link">
				<?php echo get_previous_posts_link( '< Previous' ); ?>
			</div>
		</nav>
		<?php
		$wp_query = null;
		$wp_query = $orig_query; // fix for pagination to work
		?>
	<?php endif; ?>

	<?php
	wp_reset_postdata(); // reset the query

endif;

