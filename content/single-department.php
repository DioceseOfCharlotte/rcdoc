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

</article>


<div class="u-1of1 u-mb3 u-bg-tint-1 u-px1 u-br">
		<?php echo do_shortcode( '[gravityview id="10028" search_field="21" search_value="' . get_the_ID() . '"]' ); ?>
</div>
