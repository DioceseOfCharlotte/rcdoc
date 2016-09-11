<?php
/**
 * Link List.
 *
 * @package  RCDOC
 */

?>
<div class="o-cell u-1of2-md u-text-1-dark u-flex u-flex-jc u-flex-center">
<?php if ( locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' ) ) {
	include locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' );
} else {
	include locate_template( 'images/icons/shield.svg' );
} ?>
</div>

<div class="row-links o-cell u-f-plus u-flex u-flex-col u-flex-ja">
	<?php while ( $query->have_posts() ) : $query->the_post(); ?>

		<a href="<?php the_permalink(); ?>" class="list u-block u-text-white u-p1">
			<?php the_title(); ?>
		</a>

	<?php endwhile; ?>
</div>
