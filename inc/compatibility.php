<?php
/**
 * For compatiblity with third party code.
 *
 * @package  RCDOC
 */

add_filter( 'body_class', 'doc_ip_body_classes' );
add_action( 'admin_menu', 'meh_remove_menu_pages' );
add_action( 'wp', 'custom_maybe_activate_user', 0 );

/**
 * Use jetpack protect IP whitelist to add bodyclass.
 */
function doc_ip_body_classes( $classes ) {
	if ( is_admin() || ! function_exists( 'jetpack_protect_get_ip' ) ) {
		return $classes; }

	$ip = jetpack_protect_get_ip();
	if ( false !== Jetpack_Protect_Module::ip_is_whitelisted( $ip ) ) {
		$classes[] = 'doc-ip';
	}
	return $classes;
}

function meh_remove_menu_pages() {

	if ( ! current_user_can( 'manage_options' ) ) {
		remove_menu_page( 'profile.php' );
		remove_menu_page( 'tools.php' );
	}
}



	/**
	 * Gravity Forms Custom Activation Template
	 * http://gravitywiz.com/customizing-gravity-forms-user-registration-activation-page
	 */
function custom_maybe_activate_user() {

	$template_path = STYLESHEETPATH . '/content/activate.php';
	$is_activate_page = isset( $_GET['page'] ) && $_GET['page'] == 'gf_activation';

	if ( ! file_exists( $template_path ) || ! $is_activate_page ) {
		return; }

	require_once( $template_path );

	exit();
}
