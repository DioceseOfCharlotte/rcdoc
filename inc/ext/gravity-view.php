<?php
/**
 * Gravity View.
 *
 * @package  RCDOC
 */

add_action( 'init', 'rcdoc_register_gv_shortcodes' );
add_action( 'hybrid_register_layouts', 'doc_gv_layouts' );
add_action( 'gravityview/edit_entry/after_update', 'doc_update_vicariate', 10, 3 );
add_action( 'gravityview/edit_entry/after_update', 'doc_update_parish_staff', 10, 3 );
add_action( 'gravityview/edit_entry/after_update', 'doc_update_member_contact', 10, 3 );
add_post_type_support( 'gravityview', 'theme-layouts' );

// add_filter( 'gravityview/widget/enable_custom_class', '__return_true' );
// add_filter( 'gravityview/extension/search/links_sep', '__return_false' );
// add_filter( 'gravityview/extension/search/links_label', '__return_false' );
// add_filter( 'gravityview/fields/select/output_label', '__return_true' );

// add_filter( 'gravitview_no_entries_text', 'modify_gravitview_no_entries_text', 10, 2 );
// add_filter( 'gravityview/edit_entry/success', 'doc_gv_update_message', 10, 4 );
// add_filter( 'gravityview/edit_entry/cancel_link', 'doc_gv_edit_cancel', 10, 4 );

function rcdoc_register_gv_shortcodes() {
	add_shortcode( 'get_parish_meta', 'doc_get_parish_meta_shortcode' );
	add_shortcode( 'get_parish_address', 'doc_get_parish_address_shortcode' );
	add_shortcode( 'get_parish_mailing', 'doc_get_parish_mailing_shortcode' );
	add_shortcode( 'doc_get_parish_staff', 'doc_get_parish_staff_shortcode' );
	add_shortcode( 'get_primary_staff', 'doc_get_primary_staff_shortcode' );
	add_shortcode( 'get_advocates', 'doc_get_advocates_shortcode' );
	add_shortcode( 'doc_get_mission', 'doc_get_mission_shortcode' );
}

// Update the the term meta for the Vicariate Taxonomy
function doc_update_vicariate( $form, $entry_id, $gv_entry ) {

	if ( '3' != $form['id'] ) {
		return;
	}

	if ( ! $gv_entry->entry['28'] ) {
		return;
	}

	$term_id = $gv_entry->entry['28'];

	$meta_key   = 'doc_vicar_forane';
	$meta_value = "{$gv_entry->entry['1.2']} {$gv_entry->entry['1.3']} {$gv_entry->entry['1.6']} {$gv_entry->entry['1.8']}";

	update_term_meta( $term_id, $meta_key, $meta_value );
}

// Update the Parish main staff
function doc_update_parish_staff( $form, $entry_id, $gv_entry ) {

	if ( '14' != $form['id'] ) {
		return;
	}

	$post_id  = $gv_entry->entry['89'];
	$pcc_name = "{$gv_entry->entry['15.2']} {$gv_entry->entry['15.3']} {$gv_entry->entry['15.4']} {$gv_entry->entry['15.6']} {$gv_entry->entry['15.8']}";
	$fcc_name = "{$gv_entry->entry['25.2']} {$gv_entry->entry['25.3']} {$gv_entry->entry['25.4']} {$gv_entry->entry['25.6']} {$gv_entry->entry['25.8']}";
	$dre_name = "{$gv_entry->entry['29.2']} {$gv_entry->entry['29.3']} {$gv_entry->entry['29.4']} {$gv_entry->entry['29.6']} {$gv_entry->entry['29.8']}";
	$ym_name  = "{$gv_entry->entry['32.2']} {$gv_entry->entry['32.3']} {$gv_entry->entry['32.4']} {$gv_entry->entry['32.6']} {$gv_entry->entry['32.8']}";

	update_post_meta( $post_id, 'doc_pcc', $pcc_name );
	update_post_meta( $post_id, 'doc_fcc', $fcc_name );
	update_post_meta( $post_id, 'doc_dre', $dre_name );
	update_post_meta( $post_id, 'doc_ym', $ym_name );
}

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
			'id'        => '0',
			'parish_id' => '',
			'fallback'  => false,
		),
		$atts,
		'get_parish_mailing'
	);

	$post_id = $atts['id'];

	if ( ! empty( $atts['parish_id'] ) ) {
		$post_id = get_parish_post( $atts['parish_id'] );
	}

	return doc_get_parish_mailing( $post_id );
}

// Add Shortcode [get_parish_staff id="1234"]
function doc_get_parish_staff_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'        => '0',
			'parish_id' => '',
		),
		$atts,
		'doc_get_parish_staff'
	);

	$post_id = $atts['id'];

	if ( ! empty( $atts['parish_id'] ) ) {
		$post_id = get_parish_post( $atts['parish_id'] );
	}

	return get_post_meta( $post_id, 'staff_member', true );
}

// Add Shortcode [get_parish_meta id="1234" meta="doc_street"]
function doc_get_parish_meta_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'    => '0',
			'meta'  => '',
			'label' => false,
		),
		$atts,
		'get_parish_meta'
	);

	return doc_get_parish_meta( $atts['id'], $atts['meta'], $atts['label'] );
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

function doc_get_parish_mailing( $post_id = 0, $fallback = false ) {

	$post_id     = $post_id ?: get_the_ID();
	$doc_address = doc_get_parish_address( $post_id );

	$doc_mailing = '';

	$doc_street = get_post_meta( $post_id, 'doc_mail_street', true );
	$doc_city   = get_post_meta( $post_id, 'doc_mail_city', true );
	$doc_state  = get_post_meta( $post_id, 'doc_mail_state', true );
	$doc_zip    = get_post_meta( $post_id, 'doc_mail_zip', true );

	if ( $doc_street ) {
		$doc_mailing = "{$doc_street}<br>{$doc_city}, {$doc_state} {$doc_zip}";
	} elseif ( $fallback && $doc_address ) {
		$doc_mailing = $doc_address;
	} elseif ( $doc_address && ! $fallback ) {
		$doc_mailing = '<span class="address-reference">Same as physical address</span>';
	} else {
		return;
	}

	return $doc_mailing;
}

function doc_get_parish_meta( $post_id = '0', $parish_meta, $label = false ) {

	$doc_get_meta = get_post_meta( $post_id, $parish_meta, true );

	if ( '' == trim( $doc_get_meta ) ) {
		return;
	}

	$doc_meta  = "<div class='p-meta_wrap {$parish_meta}-wrap'>";
	$doc_meta .= $label ? "<span class='p-meta__label {$parish_meta}__label'>{$label}</span>" : '';
	$doc_meta .= $doc_get_meta;
	$doc_meta .= '</div>';

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

function doc_get_primary_staff( $post_id = 0 ) {

	$post_id = $post_id ?: get_the_ID();

	$staff_members = get_post_meta( $post_id, 'doc_primary_staff', true );

	if ( empty( $staff_members ) ) {
		return;
	}

	$staff_list = '';

	if ( is_array( $staff_members ) ) {

		usort(
			$staff_members, function( $a, $b ) {
				return $a['order'] <=> $b['order'];
			}
		);

		$staff_list = '<div class="staff-list">';

		foreach ( $staff_members as $member ) {
			$staff_list .= "<div class='type-{$member['type']} list-order-{$member['order']}'>";
			$staff_list .= "<span class='staff-title'>{$member['title']}: </span>";
			$staff_list .= "<span class='staff-name'>{$member['name']}</span>";
			$staff_list .= '</div>';
		}

		$staff_list .= '</div>';

	}

	return $staff_list;
}

function doc_get_advocates( $post_id = 0 ) {

	$post_id = $post_id ?: get_the_ID();

	$staff_members = get_post_meta( $post_id, 'doc_advocates', true );

	if ( empty( $staff_members ) ) {
		return false;
	}

	$staff_list = '';

	if ( is_array( $staff_members ) ) {

		// usort(
		// 	$staff_members, function( $a, $b ) {
		// 		return $a['order'] <=> $b['order'];
		// 	}
		// );

		$staff_list = '<div class="staff-list">';

		foreach ( $staff_members as $staff_member ) {
			$staff_list .= "<div class='type-{$staff_member['type']} list-order-{$staff_member['order']}'>";
			$staff_list .= "<span class='staff-title'>{$staff_member['title']}: </span>";
			$staff_list .= "<span class='staff-name'>{$staff_member['name']}</span>";
			$staff_list .= '</div>';
		}

		$staff_list .= '</div>';

	}

	return $staff_list;
}

// Add Shortcode [get_advocates id="1234"]
function doc_get_advocates_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'        => get_the_ID(),
			'parish_id' => '',
		),
		$atts,
		'get_advocates'
	);

	$post_id = $atts['id'];

	if ( ! empty( $atts['parish_id'] ) ) {
		$post_id = get_parish_post( $atts['parish_id'] );
	}

	return doc_get_advocates( $post_id );
}

// Add Shortcode [get_primary_staff id="1234"]
function doc_get_primary_staff_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'        => get_the_ID(),
			'parish_id' => '',
		),
		$atts,
		'get_primary_staff'
	);

	$post_id = $atts['id'];

	if ( ! empty( $atts['parish_id'] ) ) {
		$post_id = get_parish_post( $atts['parish_id'] );
	}

	return doc_get_primary_staff( $post_id );
}


// Add Shortcode [doc_get_mission id="1234"]
function doc_get_mission_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'id'        => get_the_ID(),
			'parish_id' => '',
		),
		$atts,
		'doc_get_mission'
	);

	$post_id = $atts['id'];

	if ( ! empty( $atts['parish_id'] ) ) {
		$post_id = get_parish_post( $atts['parish_id'] );
	}

	$parent_id = wp_get_post_parent_id( $post_id );

	if ( ! $parent_id ) {
		return;
	}

	$parent_title = get_the_title( $parent_id );

	return "<div class='parish-mission u-text-center u-mb1'>A Mission of <strong>{$parent_title}</strong></div>";
}

/**
 * Add clergy to post meta
 */
function doc_update_member_contact( $form, $entry_id, $gv_entry ) {

	if ( '3' != $form['id'] ) {
		return;
	}

	$agency_id  = $gv_entry->entry['21'];
	$parish_id  = $gv_entry->entry['24'];
	$mission_id = $gv_entry->entry['29'];
	$school_id  = $gv_entry->entry['25'];

	$adv_string = $gv_entry->entry['30'];

	// Remove brackets.
	$adv_string = trim( $adv_string, '[]' );

	$post_ids = array_map(
		function( $adv_string_id ) {
			// Remove quotes around IDs.
			return trim( $adv_string_id, '"' );
		},
		explode( ',', $adv_string )
	);

	$agency_title = $gv_entry->entry['23'];
	$parish_title = $gv_entry->entry['19'];
	$school_title = $gv_entry->entry['27'];

	$display_order = $gv_entry->entry['26'] ?: '100';
	$c_approved    = $gv_entry->entry['7.1'];
	$c_type        = $gv_entry->entry['8'];
	$c_status      = $gv_entry->entry['13'];
	$c_prefix      = $gv_entry->entry['1.2'];
	$c_first       = $gv_entry->entry['1.3'];
	$c_middle      = $gv_entry->entry['1.4'];
	$c_last        = $gv_entry->entry['1.6'];
	$c_suffix      = $gv_entry->entry['1.8'];
	$comma_suffix  = $c_suffix ? ", {$c_suffix}" : '';
	$c_full        = "{$c_prefix} {$c_first} {$c_middle} {$c_last}{$comma_suffix}";

	if ( 'Priest' == $c_type || 'Deacon' == $c_type ) {
		$post_id = $parish_id;
		$c_title = $parish_title;
	} elseif ( 'Principal' == $c_type ) {
		$post_id = $school_id;
		$c_title = $school_title;
	} else {
		$post_id = $agency_id;
		$c_title = $agency_title;
	}

	$c_title = $c_title ?: $c_type;

	$meta_key = 'doc_primary_staff';

	$new_values = [
		'order'  => $display_order,
		'type'   => $c_type,
		'title'  => $c_title,
		'status' => $c_status,
		'prefix' => $c_prefix,
		'last'   => $c_last,
		'name'   => $c_full,
	];

	$args          = [
		'post_meta_key' => 'doc_primary_staff',
		'gf_meta_key'   => 'prev_post_id',
		'new_values'    => $new_values,
	];
	$mission_args  = [
		'post_meta_key' => 'doc_primary_staff',
		'gf_meta_key'   => 'prev_mission_id',
		'new_values'    => $new_values,
	];
	$advocate_args = [
		'post_meta_key' => 'doc_advocates',
		'gf_meta_key'   => 'prev_advocate_id',
		'new_values'    => $new_values,
	];

	$prev_post_id = gform_get_meta( $entry_id, $args['gf_meta_key'] );

	if ( ! $c_approved && ! $prev_post_id ) {
		return;
	}

	if ( $post_id && ! is_array( $post_id ) ) {
		form_update_post_meta( $post_id, $entry_id, $args );
	}

	if ( $mission_id ) {
		form_update_post_meta( $mission_id, $entry_id, $mission_args );
	}

	if ( 'Advocate' == $c_type ) {

		if ( $post_ids ) {
			form_update_post_meta_array( $post_ids, $entry_id, $advocate_args );
		}
	}
}

function form_update_post_meta( $post_id = 0, $entry_id = 0, $args = [] ) {

	if ( ! $entry_id ) {
		return false;
	}

	$defaults = [
		'post_meta_key' => '',
		'gf_meta_key'   => '',
		'new_values'    => [],
	];

	$args = $args ?: $defaults;

	$meta_value = get_post_meta( $post_id, $args['post_meta_key'], true );

	$prev_post_id = gform_get_meta( $entry_id, $args['gf_meta_key'] );

	if ( ! isset( $meta_value[ $entry_id ] ) ) {

		$meta_value[ $entry_id ] = [];
	}

	$meta_value[ $entry_id ] = $args['new_values'];

	update_post_meta( $post_id, $args['post_meta_key'], $meta_value );

	if ( $prev_post_id != $post_id ) {
		$meta_value = get_post_meta( $prev_post_id, $args['post_meta_key'], true );

		if ( isset( $meta_value[ $entry_id ] ) ) {
			unset( $meta_value[ $entry_id ] );
		}

		update_post_meta( $prev_post_id, $args['post_meta_key'], $meta_value );
		gform_update_meta( $entry_id, $args['gf_meta_key'], $post_id );
	}
}

function form_update_post_meta_array( $post_ids = 0, $entry_id = 0, $args = [] ) {

	if ( ! $entry_id ) {
		return false;
	}

	$defaults = [
		'post_meta_key' => '',
		'gf_meta_key'   => '',
		'new_values'    => [],
	];

	$args = $args ?: $defaults;

	if ( is_array( $post_ids ) ) {

		foreach ( $post_ids as $a_post ) {

			$meta_value = get_post_meta( $a_post, $args['post_meta_key'], true );

			if ( ! isset( $meta_value[ $entry_id ] ) ) {
				$meta_value[ $entry_id ] = [];
			}

			$meta_value[ $entry_id ] = $args['new_values'];

			update_post_meta( $a_post, $args['post_meta_key'], $meta_value );

		}

		$prev_post_id = gform_get_meta( $entry_id, $args['gf_meta_key'] );
		$removed_ids  = $prev_post_id ? array_diff( $prev_post_id, $post_ids ) : '';

		if ( is_array( $removed_ids ) ) {

			foreach ( $removed_ids as $removed_id ) {

				$meta_value = get_post_meta( $removed_id, $args['post_meta_key'], true );
				if ( isset( $meta_value[ $entry_id ] ) ) {
					unset( $meta_value[ $entry_id ] );
				}

				update_post_meta( $removed_id, $args['post_meta_key'], $meta_value );
			}
		} elseif ( $removed_ids ) {

			$meta_value = get_post_meta( $removed_ids, $args['post_meta_key'], true );

			if ( isset( $meta_value[ $entry_id ] ) ) {
				unset( $meta_value[ $entry_id ] );
			}

			update_post_meta( $removed_ids, $args['post_meta_key'], $meta_value );

		}

		gform_update_meta( $entry_id, $args['gf_meta_key'], $post_ids );

	}
}
