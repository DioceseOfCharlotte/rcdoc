<?php
/**
 * School Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<header class="u-bg-1-light u-flex u-flex-row u-flex-nowrap u-flex-jb u-br-t">
		<h2 <?php hybrid_attr( 'entry-title' ); ?>>
			<a class="entry-title-link u-1of1 u-inline-flex u-flex-center" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>

		<?php if ( has_term( 'macs', 'school_system' ) ) : ?>

			<div class="u-bg-frost-2 u-p1 school-system-logo u-flex u-flex-center u-flexed-s0"><a class="btn btn-sm" href="<?php the_permalink('10073'); ?>"><?php abe_do_svg( 'macs', 'md' ); ?></a></div>
			<?php endif; ?>
	</header>

		<?php
			get_the_image(array(
				'size'        => 'thumbnail',
				'image_class' => 'u-1of1',
				'before'      => '<div class="media-img u-p2 u-inline-block u-align-middle u-1of3 u-overflow-hidden">',
				'after'       => '</div>',
			));
		?>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part( 'components/acf-contact' ); ?>
		<?php the_excerpt(); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

</article>
