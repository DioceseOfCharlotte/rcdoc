<?php
/**
 * CMB2 Attached Posts.
 *
 * @package  RCDOC
 */

$attached = get_post_meta( get_the_ID(), 'doc_posts_attached_posts', true );

foreach ( $attached as $attached_post ) {
	$post = get_post( $attached_post ); ?>

	<h2 <?php hybrid_attr( 'entry-title' ); ?>>
		<a class="u-bg-1-dark u-py1 u-1of1 u-inline-block" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
	</h2>
	<?php	}
