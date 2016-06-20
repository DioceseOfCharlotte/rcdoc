<?php
/**
 * Single Parish Template.
 *
 * @package  RCDOC
 */
$doc_mass = get_post_meta( get_the_ID(), 'doc_mass_schedule', true );
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php get_template_part( 'components/contact-meta' ); ?>
			<?php if ( $doc_mass ) : ?>
				<div class="u-1of1"> <?php
			 		echo wpautop( $doc_mass ); ?>
				</div>
			<?php endif; ?>

			<?php the_content(); ?>
			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part( 'components/parish', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

</article>

<?php
if ( is_front_page() || ! is_singular( 'parish' ) ) {
	return;
}
$id = get_the_ID();
?>

<div class="u-1of1 u-bg-silver u-mb3 u-bg-tint-1 u-px1 u-br u-pt3">
	   <?php echo do_shortcode( '[gravityview id="10028" search_field="24" search_value="' . $id .'"]' ); ?>
</div>
