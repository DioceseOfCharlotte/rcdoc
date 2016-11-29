<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */


//add_filter( 'cleaner_gallery_defaults', 'meh_gallery_default_args' );
add_action( 'login_footer', 'doc_login_footer' );

// function meh_gallery_default_args( $defaults ) {
// 	$defaults = array(
// 		'size' => 'abe-hd',
// 		'columns' => 1,
// 	);
// 	return $defaults;
// }

function doc_login_footer() {
	 echo '<div class=login-links><a href="/registration/">Create an account</a></div>';
}
