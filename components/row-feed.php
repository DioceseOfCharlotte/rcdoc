<?php
/**
 * Displays an rss feed.
 *
 * @package  RCDOC
 */

?>

<div class="o-cell u-1of2-md u-flex u-flex-jc u-flex-center">
	<?php if ( locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' ) ) {
		include locate_template( 'images/icons/' . esc_attr( $attr['icon_file'] ) . '.svg' );
} else {
	include locate_template( 'images/icons/shield.svg' );
} ?>
</div>

<div class="o-cell u-1of2-md u-flex u-flex-jc u-flex-center">
<?php
the_widget( 'WP_Widget_RSS',
	array(
		'title'  => __( '', 'abraham' ),
		'url'    => esc_url( $attr['feed_url'] ),
		'items'  => 7,
		// 'show_summary' => true,
	),
	array(
		'before_widget' => '<section class="rss-widget o-cell u-1of1 mobile-widget__drop-down-section u-p2 u-flexed-grow"><div>',
		'after_widget'  => '</div></section>',
		'before_title'  => '</div><input class="mobile-widget__heading-checkbox u-1of1" type="checkbox" checked><h2 class="widget-title u-h2 u-mt0 mobile-widget__heading rss-title">',
		'after_title'   => '</h2><div class="mobile-widget__link-list u-f-plus u-list-reset">',
	)
);
?>
</div>
