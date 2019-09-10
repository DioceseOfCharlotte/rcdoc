<?php
/**
 * Parish Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php get_template_part( 'components/entry', 'header' ); ?>

	<?php $parent_id = wp_get_post_parent_id( get_the_ID() ); ?>

	<?php if ( $parent_id ) : ?>

		<div class="u-1of1 u-h6 u-mt05 u-text-center"><span class="u-text-grey-sub mission-of u-normal u-italic">A Mission of <a class="u-text-grey-sub u-bold" href="<?php the_permalink( $parent_id ); ?>"> <?php echo get_the_title( $parent_id ); ?></a></span></div>

	<?php endif; ?>

	<?php
	get_the_image(
		array(
			'size'        => 'thumbnail',
			'image_class' => 'u-1of1',
			'before'      => '<div class="media-img u-inline-block u-align-middle u-1of3 u-overflow-hidden">',
			'after'       => '</div>',
		)
	);
	?>

	<?php get_template_part( 'components/contact-meta' ); ?>

	<?php get_template_part( 'components/contact', 'footer' ); ?>
	<?php abe_edit_link(); ?>
</article>
