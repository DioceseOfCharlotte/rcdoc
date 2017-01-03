<?php
/**
 * Cards.
 *
 * @package  RCDOC
 */

$gv_select = '';
if ( 'parish' === get_post_type( get_the_ID() ) ) {
	$gv_select = '24';
} elseif ( 'school' === get_post_type( get_the_ID() ) ) {
	$gv_select = '25';
} elseif ( 'department' === get_post_type( get_the_ID() ) ) {
	$gv_select = '21';
}
?>

<div class="u-1of1 u-p u-bg-1-light u-br employee-list">
		<?php echo do_shortcode( '[gravityview id="10028" search_field="' . $gv_select . '" search_value="' . get_the_ID() . '"]' ); ?>
</div>
