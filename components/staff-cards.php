<?php
/**
 * Cards.
 *
 * @package  RCDOC
 */

// $gv_select = '';

// if ( is_singular( 'parish' ) ) {
// 	$gv_select = '24';
// }
// if ( is_singular( 'school' ) ) {
// 	$gv_select = '25';
// }
// if ( is_singular( 'department' ) ) {
// 	$gv_select = '21';
// }
$post_id = get_the_ID();
?>

<div class="u-1of1 u-p u-h5 u-br employee-list">
	<?php //echo do_shortcode( "[gravityview id='10028' search_field='{$gv_select}' search_value='{$post_id}']" ); ?>
	<?= doc_get_primary_staff(); ?>
</div>
