<?php
/**
 * Single Department Template.
 *
 * @package  RCDOC
 */
	?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<?php if ( hybrid_post_has_content() ) : ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_content(); ?>
			<?php tha_entry_content_after(); ?>
		</div>

<?php endif; ?>

<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
