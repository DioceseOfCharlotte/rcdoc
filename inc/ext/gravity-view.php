<?php
/**
 * Gravity View.
 *
 * @package  RCDOC
 */

add_post_type_support( 'gravityview', 'theme-layouts' );
add_action( 'hybrid_register_layouts', 'doc_gv_layouts' );
add_filter( 'gravityview/widget/enable_custom_class', '__return_true' );
add_filter( 'gravityview/extension/search/links_sep', '__return_false' );
add_filter( 'gravityview/extension/search/links_label', '__return_false' );
add_filter( 'gravityview/fields/select/output_label', '__return_true' );
add_filter( 'gravitview_no_entries_text', 'modify_gravitview_no_entries_text', 10, 2 );

add_filter( 'gravityview/edit_entry/success', 'doc_gv_update_message', 10, 4 );
add_filter( 'gravityview/edit_entry/cancel_link', 'doc_gv_edit_cancel', 10, 4 );

function doc_gv_layouts() {

	hybrid_register_layout('1-card-row', array(
		'label'            => _x( '1-card-row', 'theme layout', 'abraham' ),
		'is_global_layout' => false,
		'post_types'       => array( 'gravityview' ),
		'image'            => hybrid_locate_theme_file( 'images/list.svg' ),
	));
	hybrid_register_layout('2-card-row', array(
		'label'            => _x( '2-card-row', 'theme layout', 'abraham' ),
		'is_global_layout' => false,
		'post_types'       => array( 'gravityview' ),
		'image'            => hybrid_locate_theme_file( 'images/2-card-row.svg' ),
	));
	hybrid_register_layout('3-card-row', array(
		'label'            => _x( '3-card-row', 'theme layout', 'abraham' ),
		'is_global_layout' => false,
		'post_types'       => array( 'gravityview' ),
		'image'            => hybrid_locate_theme_file( 'images/3-card-row.svg' ),
	));

}
/**
 * Modify the text displayed when there are no entries.
 *
 * @param array $existing_text The existing "No Entries" text.
 * @param bool  $is_search  Is the current page a search result, or just a multiple entries screen.
 */
function modify_gravitview_no_entries_text( $existing_text, $is_search ) {

	$return = $existing_text;

	if ( $is_search ) {
		$return = 'Sorry, but nothing matched your search. Perhaps try again with some different keywords.';
	} else {
		$return = '';
	}

	return $return;
}

/**
 * Change the update entry success message, including the link
 *
 * @param $message string The message itself
 * @param $view_id int View ID
 * @param $entry array The Gravity Forms entry object
 * @param $back_link string Url to return to the original entry
 */
function doc_gv_update_message( $message, $view_id, $entry, $back_link ) {
	$link = str_replace( 'entry/' . $entry['id'] . '/', '', $back_link );
	return 'Entry Updated. <a href="' . esc_url( $link ) . '">Return to the list</a>';
}

/**
 * Customise the cancel button link
 *
 * @param $back_link string
 *
 * since 1.11.1
 */
function doc_gv_edit_cancel( $back_link, $form, $entry, $view_id ) {
	return str_replace( 'entry/' . $entry['id'] . '/', '', $back_link );
}
