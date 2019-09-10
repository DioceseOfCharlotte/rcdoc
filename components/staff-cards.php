<?php
/**
 * Cards.
 *
 * @package  RCDOC
 */

$gv_select = '';

if ( is_singular( 'parish' ) ) {
	$gv_select = '24';
global $post;
	if ( $post->post_parent > 0 ) {
		$gv_select = '29';
	}
}
if ( is_singular( 'school' ) ) {
	$gv_select = '25';
}
if ( is_singular( 'department' ) ) {
	$gv_select = '21';
}
$post_id = get_the_ID();
?>

<div class="u-1of1 u-px1 u-pb u-rel employee-list">
	<?php
	echo do_shortcode( "[gravityview id='10028' search_field='{$gv_select}' search_value='{$post_id}']" );
	// echo doc_get_primary_staff();
	?>
</div>
