<?php
/**
 * Parish Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<?php $distance = facetwp_get_distance();
	if ( false !== $distance ) { ?>
	    <div class="u-abs u-bottom0 u-left0 u-p2"><em><?php echo round( $distance, 2 ); ?> miles</em></div>
	<?php }	?>

	<header class="u-flex u-flex-row u-flex-nowrap u-border-b u-b-silver u-flex-jb u-br-t">
		<h2 <?php hybrid_attr( 'entry-title' ); ?>>
			<a href="<?php the_permalink(); ?>" class="u-text-color"><?php the_title(); ?><?php abe_do_svg( 'arrow-right', 'sm' ) ?></a>
		</h2>
	</header>

	<?php
	get_the_image(array(
		'size'               => 'thumbnail',
		'image_class'        => 'u-1of1',
		'before'             => '<div class="media-img u-inline-block u-align-middle u-1of3 u-overflow-hidden">',
		'after'              => '</div>',
	));
	?>

	<?php tha_entry_content_before(); ?>
	<?php get_template_part( 'components/contact-meta' ); ?>
	<?php tha_entry_content_after(); ?>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

</article>
