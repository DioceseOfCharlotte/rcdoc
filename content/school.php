<?php
/**
 * School Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<header class="u-bg-1-light u-flex u-flex-row u-flex-nowrap u-flex-justify-between u-br-t">
		<h2 <?php hybrid_attr( 'entry-title' ); ?>>
			<a class="u-inline-block" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>
		<?php if ( get_field( 'doc_website' ) ) : ?>
			<a class="contact-link u-bg-frost-1 btn u-inline-block" itemprop="url" href="<?php the_field( 'doc_website' ); ?>" target="_blank"><?php abe_do_svg( 'external', 'sm' ); ?></a>
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
