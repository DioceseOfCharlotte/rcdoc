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
include_once( ABSPATH . WPINC . '/feed.php' );

// Get a SimplePie feed object from the specified feed source.
$rss = fetch_feed( esc_url( $attr['feed_url'] ) );

$maxitems = 0;

if ( ! is_wp_error( $rss ) ) :

	// Set Limit on number of items to display.
	$maxitems = $rss->get_item_quantity( 7 );

	// Build an array of all the items, starting with element 0 (first element).
	$rss_items = $rss->get_items( 0, $maxitems );

endif;
?>

<ul class="o-list-group-links">
    <?php if ( 0 == $maxitems ) : ?>
        <li><?php _e( 'No items', 'my-text-domain' ); ?></li>
    <?php else : ?>

        <?php foreach ( $rss_items as $item ) : ?>
            <li>
                <a href="<?php echo esc_url( $item->get_permalink() ); ?>">
                    <?php echo esc_html( $item->get_title() ); ?>
                </a>
            </li>
        <?php endforeach; ?>
    <?php endif; ?>
</ul>

</div>
