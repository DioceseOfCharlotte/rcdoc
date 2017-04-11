<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */

add_action( 'login_footer', 'doc_login_footer' );

function doc_login_footer() {
	 echo '<div class=login-links><a href="/registration/">Create an account</a></div>';
}
