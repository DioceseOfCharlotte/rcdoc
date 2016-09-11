<?php
/**
 * Single School Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_content(); ?>
			<?php get_template_part( 'components/contact-meta' ); ?>
			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

</article>

<div class="u-1of1 u-mb3 u-bg-tint-1 u-px1 u-br">
		<?php echo do_shortcode( '[gravityview id="10028" search_field="25" search_value="' . get_the_ID() . '"]' ); ?>
</div>
