<?php
/**
 * Entry Footer.
 *
 * @package  RCDOC
 */

 if ( is_front_page() || ! is_singular( 'parish' ) ) {
	 return;
 }
 $id = get_the_ID();
?>

<div class="u-1of1 u-bg-silver u-px1 u-pt3">
 		<?php echo do_shortcode( '[gravityview id="10028" search_field="24" search_value="' . $id .'"]' ); ?>
</div>
