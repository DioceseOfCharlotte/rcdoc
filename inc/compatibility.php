<?php
/**
* For ompatiblity with third party code.
*
* @package  RCDOC
*/

add_filter( 'login_redirect', create_function( '$url,$query,$user', 'return home_url();' ), 10, 3 );
add_action( 'login_enqueue_scripts', 'doc_login_logo' );
add_filter( 'login_headerurl', 'doc_login_logo_url' );
add_filter( 'login_headertitle', 'doc_login_logo_url_title' );
add_action( 'wp', 'custom_maybe_activate_user', 0 );


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

	/**
	* Gravity Forms Custom Activation Template
	* http://gravitywiz.com/customizing-gravity-forms-user-registration-activation-page
	*/
function custom_maybe_activate_user() {

	$template_path = STYLESHEETPATH . '/content/activate.php';
	$is_activate_page = isset( $_GET['page'] ) && $_GET['page'] == 'gf_activation';

	if ( ! file_exists( $template_path ) || ! $is_activate_page  ) {
		return; }

	require_once( $template_path );

	exit();
}
