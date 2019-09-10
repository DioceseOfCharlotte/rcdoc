<?php
/**
 * Single Parish Template.
 *
 * @package  RCDOC
 */
$doc_mass = get_post_meta( get_the_ID(), 'doc_mass_schedule', true );
$post_id = get_the_ID();
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<div <?php hybrid_attr( 'entry-content' ); ?>>
		<?php get_template_part( 'components/contact-meta' ); ?>
		<?php get_template_part( 'components/contact', 'footer' ); ?>
		<?php if ( $doc_mass ) : ?>
			<div class="u-1of1 u-mb3 u-bg-silver u-br u-pb2 u-px2">
				<h3><?php esc_html_e( 'Mass Schedule', 'abraham' ); ?></h3>
				<?php echo wpautop( $doc_mass ); ?>
			</div>
		<?php endif; ?>

		<?php the_content(); ?>

		<?php if ( is_active_sidebar( 'parish' ) ) { ?>
			<aside <?php hybrid_attr( 'sidebar', 'parish' ); ?>>
				<?php dynamic_sidebar( 'parish' ); ?>
			</aside>
		<?php } ?>


	</div>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
