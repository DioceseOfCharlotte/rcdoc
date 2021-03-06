<?php
/**
 * For compatiblity with third party code.
 *
 * @package  RCDOC
 */

add_action( 'admin_menu', 'meh_remove_menu_pages' );

function meh_remove_menu_pages() {

	if ( ! current_user_can( 'manage_options' ) ) {
		remove_menu_page( 'profile.php' );
		remove_menu_page( 'tools.php' );
	}
}

add_filter( 'redirect_canonical', 'abe_disable_redirect_canonical' );

function abe_disable_redirect_canonical( $redirect_url ) {
	if ( is_paged() ) {
		$redirect_url = false;
	}
	return $redirect_url;
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
