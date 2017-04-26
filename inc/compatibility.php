<?php
/**
 * For compatiblity with third party code.
 *
 * @package  RCDOC
 */

add_action( 'admin_menu', 'meh_remove_menu_pages' );
add_action( 'wp', 'custom_maybe_activate_user', 0 );

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
