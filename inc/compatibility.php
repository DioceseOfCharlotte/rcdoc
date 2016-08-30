<?php
/**
* For ompatiblity with third party code.
*
* @package  RCDOC
*/

add_action( 'admin_menu', 'meh_remove_menu_pages' );
add_action( 'admin_init', 'meh_remove_plugins_menu' );
add_filter( 'login_redirect', 'doc_login_redirect', 10, 3 );
add_action( 'login_enqueue_scripts', 'doc_login_logo' );
add_filter( 'login_headerurl', 'doc_login_logo_url' );
add_filter( 'login_headertitle', 'doc_login_logo_url_title' );
add_action( 'wp', 'custom_maybe_activate_user', 0 );

add_filter( 'wpseo_metabox_prio', function() { return 'low'; } );

function doc_login_redirect( $url, $request, $user ) {
	return $request;
}

function meh_remove_menu_pages() {

	if ( ! current_user_can( 'manage_options' ) ) {
		remove_menu_page( 'profile.php' );
		remove_menu_page( 'tools.php' );
	}
}

function meh_remove_plugins_menu() {
	if ( class_exists( 'Jetpack' ) && ! current_user_can( 'manage_options' ) ) {
		remove_menu_page( 'jetpack' );
	}
}

function doc_login_logo() {
	if ( ! has_custom_logo() ) { return; }

	$image = wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ) ); ?>

		<style id="login-custom-logo">
			#login h1 a {
				background-image: url(<?php echo $image ?>);
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
