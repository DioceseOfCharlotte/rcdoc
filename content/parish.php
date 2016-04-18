<?php
/**
 * Parish Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<header class="u-bg-1-light u-flex u-flex-row u-flex-nowrap u-flex-jb u-br-t">
		<h2 <?php hybrid_attr( 'entry-title' ); ?>>
			<a class="u-inline-block" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
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
	<?php get_template_part( 'components/acf-contact' ); ?>
	<?php tha_entry_content_after(); ?>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

</article>
