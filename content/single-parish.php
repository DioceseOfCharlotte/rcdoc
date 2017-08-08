<?php
/**
 * Single Parish Template.
 *
 * @package  RCDOC
 */
$doc_mass = get_post_meta( get_the_ID(), 'doc_mass_schedule', true );
$doc_pid = get_the_ID();

if ( ! function_exists( 'user_can_update_parish' ) ) {
	function user_can_update_parish() {
		return false;
	}
}
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<div <?php hybrid_attr( 'entry-content' ); ?>>
		<?php get_template_part( 'components/contact-meta' ); ?>
		<?php if ( $doc_mass ) : ?>
			<div class="u-1of1 u-mb3 u-bg-silver u-br u-pb2 u-px2">
				<h3><?php esc_html_e( 'Mass Schedule', 'abraham' ); ?></h3>
				<?php echo wpautop( $doc_mass ); ?>
			</div>
		<?php endif; ?>

		<?php if ( user_can_update_parish() ) { ?>
		<a class="btn btn-hollow" href="<?php echo esc_url( site_url( '/' ) ); ?>parish-info/?page=gravityflow-submit&id=19&doc_pid=<?php echo $doc_pid; ?>" target="blank" rel="noopener"><?php abe_do_svg( 'edit', 'sm' ); ?> Edit Parish info</a>
		<?php } ?>

		<?php the_content(); ?>
	</div>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
