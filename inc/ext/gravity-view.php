<?php
/**
 * Gravity View.
 *
 * @package  RCDOC
 */

add_action( 'init', 'rcdoc_register_gv_shortcodes' );
add_action( 'hybrid_register_layouts', 'doc_gv_layouts' );
add_action( 'gravityview/edit_entry/after_update', 'doc_update_vicariate', 10, 3 );

add_filter( 'gravityview/widget/enable_custom_class', '__return_true' );
add_filter( 'gravityview/extension/search/links_sep', '__return_false' );
add_filter( 'gravityview/extension/search/links_label', '__return_false' );
add_filter( 'gravityview/fields/select/output_label', '__return_true' );

// add_filter( 'gravitview_no_entries_text', 'modify_gravitview_no_entries_text', 10, 2 );
// add_filter( 'gravityview/edit_entry/success', 'doc_gv_update_message', 10, 4 );
// add_filter( 'gravityview/edit_entry/cancel_link', 'doc_gv_edit_cancel', 10, 4 );

function rcdoc_register_gv_shortcodes() {
	add_shortcode( 'get_parish_meta', 'doc_get_parish_meta_shortcode' );
	add_shortcode( 'get_parish_address', 'doc_get_parish_address_shortcode' );
	add_shortcode( 'get_parish_mailing', 'doc_get_parish_mailing_shortcode' );
	add_shortcode( 'doc_get_parish_staff', 'doc_get_parish_staff_shortcode' );
}

// Update the the term meta for the Vicariate Taxonomy
function doc_update_vicariate( $form, $entry_id, $gv_entry ) {

	if ( '3' != $form['id'] ) {
		return;
	}

	$term_id    = $gv_entry->entry['28'];
	$meta_key   = 'doc_vicar_forane';
	$meta_value = "{$gv_entry->entry['1.2']} {$gv_entry->entry['1.3']} {$gv_entry->entry['1.6']} {$gv_entry->entry['1.8']}";

	update_term_meta( $term_id, $meta_key, $meta_value );
}

add_post_type_support( 'gravityview', 'theme-layouts' );
function doc_gv_layouts() {

	hybrid_register_layout(
		'1-card-row', array(
			'label'            => _x( '1-card-row', 'theme layout', 'abraham' ),
			'is_global_layout' => false,
			'post_types'       => array( 'gravityview' ),
			'image'            => hybrid_locate_theme_file( 'images/list.svg' ),
		)
	);
	hybrid_register_layout(
		'2-card-row', array(
			'label'            => _x( '2-card-row', 'theme layout', 'abraham' ),
			'is_global_layout' => false,
			'post_types'       => array( 'gravityview' ),
			'image'            => hybrid_locate_theme_file( 'images/2-card-row.svg' ),
		)
	);
	hybrid_register_layout(
		'3-card-row', array(
			'label'            => _x( '3-card-row', 'theme layout', 'abraham' ),
			'is_global_layout' => false,
			'post_types'       => array( 'gravityview' ),
			'image'            => hybrid_locate_theme_file( 'images/3-card-row.svg' ),
		)
	);

}

// Add Shortcode [get_parish_address id="1234"]
function doc_get_parish_address_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id' => '0',
		),
		$atts,
		'get_parish_address'
	);

	return doc_get_parish_address( $atts['id'] );
}

// Add Shortcode [get_parish_mailing id="1234"]
function doc_get_parish_mailing_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id' => '0',
		),
		$atts,
		'get_parish_mailing'
	);

	return doc_get_parish_mailing( $atts['id'] );
}

// Add Shortcode [get_parish_staff id="1234"]
function doc_get_parish_staff_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id' => '0',
		),
		$atts,
		'doc_get_parish_staff'
	);

	return get_post_meta( $atts['id'], 'staff_member', true );
}

// Add Shortcode [get_parish_meta id="1234" meta="doc_street"]
function doc_get_parish_meta_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'   => '0',
			'meta' => '',
		),
		$atts,
		'get_parish_meta'
	);

	return doc_get_parish_meta( $atts['id'], $atts['meta'] );
}

function doc_get_parish_address( $post_id = 0 ) {

	$post_id = $post_id ?: get_the_ID();

	$doc_address = '';

	$doc_street = get_post_meta( $post_id, 'doc_street', true );
	$doc_city   = get_post_meta( $post_id, 'doc_city', true );
	$doc_state  = get_post_meta( $post_id, 'doc_state', true );
	$doc_zip    = get_post_meta( $post_id, 'doc_zip', true );

	if ( $doc_street ) {
		$doc_address = $doc_street . '<br>' . $doc_city . ', ' . $doc_state . ' ' . $doc_zip;
	}

	return $doc_address;
}

function doc_get_parish_mailing( $post_id = 0 ) {

	$post_id = $post_id ?: get_the_ID();

	$doc_mailing = '';

	$doc_street = get_post_meta( $post_id, 'doc_mail_street', true );
	$doc_city   = get_post_meta( $post_id, 'doc_mail_city', true );
	$doc_state  = get_post_meta( $post_id, 'doc_mail_state', true );
	$doc_zip    = get_post_meta( $post_id, 'doc_mail_zip', true );

	if ( $doc_street ) {
		$doc_mailing = $doc_street . '<br>' . $doc_city . ', ' . $doc_state . ' ' . $doc_zip;
	} else {
		$doc_mailing = doc_get_parish_address( $post_id );
	}

	return $doc_mailing;
}

function doc_get_parish_meta( $post_id = '0', $parish_meta ) {

	$doc_meta = get_post_meta( $post_id, $parish_meta, true );

	return $doc_meta;
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
