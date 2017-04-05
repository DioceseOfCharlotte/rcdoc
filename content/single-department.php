<?php
/**
 * Single Department Template.
 *
 * @package  RCDOC
 */
	?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php if ( hybrid_post_has_content() ) : ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php the_content(); ?>
		</div>

<?php endif; ?>

<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
