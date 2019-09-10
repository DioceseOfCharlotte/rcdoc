<?php
/**
 * School Template.
 *
 * @package  RCDOC
 */
// $doc_website = get_post_meta( get_the_ID(), 'doc_website', true );
//
// $title_link = $doc_website ? $doc_website : get_permalink();
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php get_template_part( 'components/entry', 'header' ); ?>

		<?php
			get_the_image(array(
				'size'        => 'thumbnail',
				'image_class' => 'u-1of1',
				'before'      => '<div class="media-img u-p05 u-inline-block u-align-top u-1of4 u-overflow-hidden">',
				'after'       => '</div>',
			));
		?>

		<?php get_template_part( 'components/contact', 'meta' ); ?>

		<?php get_template_part( 'components/contact', 'footer' ); ?>
		<?php abe_edit_link(); ?>

</article>
