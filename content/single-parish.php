<?php
/**
 * Single Parish Template.
 *
 * @package  RCDOC
 */
$doc_mass = get_post_meta( get_the_ID(), 'doc_mass_schedule', true );
$doc_pid = get_the_ID();
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<div <?php hybrid_attr( 'entry-content' ); ?>>
		<?php tha_entry_content_before(); ?>
		<?php get_template_part( 'components/contact-meta' ); ?>
		<?php if ( $doc_mass ) : ?>
			<div class="u-1of1 u-mb3 u-bg-silver u-br u-pb2 u-px2">
				<h3><?php esc_html_e( 'Mass Schedule', 'abraham' ); ?></h3>
				<?php echo wpautop( $doc_mass ); ?>
			</div>
		<?php endif; ?>

		<?php if ( current_user_can( 'edit_parishs' ) ) { ?>
		<a class="btn" href="<?php echo esc_url( site_url( '/' ) ); ?>parish-info/?page=gravityflow-submit&id=18&doc_pid=<?php echo $doc_pid; ?>" target="blank" rel="noopener">Update Parish info</a>
		<?php } ?>

		<?php the_content(); ?>
		<?php tha_entry_content_after(); ?>
	</div>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

	<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
