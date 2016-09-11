<?php
/**
 * School Template.
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

		<?php if ( has_term( 'macs', 'school_system' ) ) : ?>

			<div class="u-bg-frost-2 u-1of3 u-1of4-md u-p1 school-system-logo u-flex u-flex-center u-flexed-s0"><a class="btn u-p0" href="<?php the_permalink( '10073' ); ?>"><?php abe_do_svg( 'macs', 'md' ); ?></a></div>
			<?php endif; ?>
	</header>

		<?php
			get_the_image(array(
				'size'        => 'thumbnail',
				'image_class' => 'u-1of1',
				'before'      => '<div class="media-img u-p2 u-inline-block u-align-top u-1of3 u-overflow-hidden">',
				'after'       => '</div>',
			));
		?>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part( 'components/contact-meta' ); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

</article>
