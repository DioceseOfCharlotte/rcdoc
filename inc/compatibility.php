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

	$template_path    = STYLESHEETPATH . '/content/activate.php';
	$is_activate_page = isset( $_GET['page'] ) && $_GET['page'] == 'gf_activation';

	if ( ! file_exists( $template_path ) || ! $is_activate_page ) {
		return; }

	require_once( $template_path );

	exit();
}
add_filter( 'gform_column_input_23_2_2', 'doc_track_column', 10, 5 );
function doc_track_column( $input_info, $field, $column, $value, $form_id ) {
	return array(
		'type'    => 'select',
		'choices' => array(
			[
				'text'  => 'First Track',
				'value' => 'First',
			],
			[
				'text'  => 'Second Track',
				'value' => 'Second',
			],
			[
				'text'  => 'Third Track',
				'value' => 'Third',
			],
			[
				'text'  => 'Fourth Track',
				'value' => 'Fourth',
			],
		),
	);
}


add_filter( 'relevanssi_do_not_index', 'doc_no_image_attachments', 10, 2 );

function doc_no_image_attachments( $block, $post_id ) {
	$mime = get_post_mime_type( $post_id );
	if ( substr( $mime, 0, 5 ) == 'image' ) {
		$block = true;
	}
	return $block;
}
