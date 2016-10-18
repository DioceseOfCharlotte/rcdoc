<?php
/**
* For ompatiblity with third party code.
*
* @package  RCDOC
*/

add_action( 'admin_menu', 'meh_remove_menu_pages' );
add_action( 'admin_init', 'meh_remove_plugins_menu' );
add_action( 'wp', 'custom_maybe_activate_user', 0 );
add_filter( 'wpseo_metabox_prio', function() { return 'low'; } );



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
