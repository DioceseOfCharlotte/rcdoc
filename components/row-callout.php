<?php
/**
 * Callouts.
 *
 * @package abraham
 */

?>

<div class="o-cell u-1of2-md u-flex u-flex-col u-flex-jc u-flex-center">

	<?php while ( $query->have_posts() ) : $query->the_post(); ?>
		<h2 class="u-h1 u-mb2 u-mb4-md u-text-display u-text-shadow"><?php the_title(); ?></h2>
		<?php if ( $attr['btn_text'] ) : ?>
			<a href="<?php the_permalink(); ?>" class="btn btn-big btn-hollow u-bg-white">
				<?php echo wp_kses_post( $attr['btn_text'] ); ?>
			</a>
		<?php endif; ?>
	<?php endwhile; ?>
	<?php $query->rewind_posts(); ?>
</div>


<div class="o-cell u-shadow--8dp u-br u-1of2-md blur-img u-p3 u-rel u-p4-md u-bg-cover u-bg-fixed <?php echo esc_attr( $attr['glass_color'] ); ?>" style="background-image: url(<?php echo wp_kses_post( wp_get_attachment_url( $attr['blur_image'] ) ); ?>)">

	<div class="cta_message u-f-plus">
		<?php while ( $query->have_posts() ) : $query->the_post(); ?>
			<?php abe_excerpt(); ?>
		<?php endwhile; ?>
	</div>
</div>
