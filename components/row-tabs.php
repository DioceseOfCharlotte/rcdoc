<?php
/**
 * Tabs.
 *
 * @package abraham
 */

wp_enqueue_script( 'arch-tabs' ); ?>

<div class="o-cell u-1of2-md u-flex u-flex-jc u-flex-center">
<?php if ( locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' ) ) {
	include locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' );
} ?>
</div>


<div class="o-cell u-1of2-md u-br row__tabs mdl-tabs mdl-js-tabs">
	<div class="tabs tab-bar">

		<?php $counter = -1; ?>

		<?php while ( $query->have_posts() ) : $query->the_post(); ?>

			<?php $counter++; ?>

			<div data-index="<?php echo $counter ?>" class="tab-header u-p2 u-text-center u-flexed-auto u-f-plus"><?php the_title(); ?></div>

		<?php endwhile; ?>

		<?php $query->rewind_posts(); ?>
	</div>

	<?php $counter = -1; ?>

	<?php while ( $query->have_posts() ) : $query->the_post(); ?>

		<?php $counter++; ?>

		<div class="tab-content u-p2 tab<?php the_ID(); ?>" data-index="<?php echo $counter ?>">

			<?php the_content(); ?>

		</div>

	<?php endwhile; ?>

</div>
