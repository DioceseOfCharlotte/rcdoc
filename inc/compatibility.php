<?php
/**
 * For ompatiblity with third party code.
 *
 * @package  RCDOC
 */

add_post_type_support( 'sc_event', 'theme-layouts' );
add_action( 'login_enqueue_scripts', 'doc_login_logo' );
add_filter( 'login_headerurl', 'doc_login_logo_url' );
add_filter( 'login_headertitle', 'doc_login_logo_url_title' );


function doc_login_logo() {
	?>
	<style type="text/css">
		.login h1 a {
			background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/images/login-shield.png);
			padding-bottom: 30px;
		}
	</style>
<?php }

function doc_login_logo_url() {
	return home_url();
}


function doc_login_logo_url_title() {
	return 'Diocese of Charlotte';
}
