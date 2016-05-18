<?php
if ( is_post_type_archive( 'department' ) || is_post_type_archive( 'parish' ) || is_post_type_archive( 'school' ) ) : ?>
	<div class="u-1of1 u-p2 u-mb2 u-content-wrap u-text-center">
	 	<?php echo facetwp_display( 'pager' ); ?>
	</div>

<?php elseif ( is_singular( 'post' ) ) : // If viewing a single post page. ?>

	<div class="loop-nav u-1of1 u-text-center u-mb2">
		<?php previous_post_link( '<div class="prev btn btn-hollow">' . esc_html__( 'Previous Post: %link', 'abraham' ) . '</div>', '%title' ); ?>
		<?php next_post_link(     '<div class="next btn btn-hollow">' . esc_html__( 'Next Post: %link',     'abraham' ) . '</div>', '%title' ); ?>
	</div><!-- .loop-nav -->



<?php elseif ( is_home() || is_archive() || is_search() ) : ?>

	<?php the_posts_pagination(
		array(
			'prev_text' => esc_html_x( '&larr; Previous', 'posts navigation', 'abraham' ),
			'next_text' => esc_html_x( 'Next &rarr;',     'posts navigation', 'abraham' ),
		)
	); ?>

<?php endif; // End check for type of page being viewed. ?>
