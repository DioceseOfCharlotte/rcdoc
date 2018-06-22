<?php
/**
 * Gravity View.
 *
 * @package  RCDOC
 */

add_action( 'gravityview/edit_entry/after_update', 'doc_update_vicariate', 10, 3 );

add_action( 'gravityview/edit_entry/after_update', 'doc_update_parish_staff', 10, 3 );

add_action( 'gravityview/edit_entry/after_update', 'doc_update_post_contact', 10, 3 );

function doc_clean_gf_array( $string = 0 ) {

	// Remove brackets.
	$string = trim( $string, '[]' );

	$cleaned_array = array_map(
		function( $string_id ) {

			// Remove quotes around IDs.
			return trim( $string_id, '"' );
		},
		explode( ',', $string )
	);
	return $cleaned_array;
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

/**
 * Add contact data to post meta
 */
function doc_update_post_contact( $form, $entry_id, $gv_entry ) {

	if ( '3' != $form['id'] ) {
		return;
	}

	$agency_id  = $gv_entry->entry['21'];
	$parish_id  = $gv_entry->entry['24'];
	$mission_id = $gv_entry->entry['29'];
	$school_id  = $gv_entry->entry['25'];

	$adv_string   = $gv_entry->entry['30'];
	$adv_post_ids = doc_clean_gf_array( $adv_string );
	$is_advocate  = $gv_entry->entry['32.1'];

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

	if ( 'Advocate' == $c_type || 'Advocate' == $is_advocate ) {

		if ( $adv_post_ids ) {
			form_update_post_meta( $adv_post_ids, $entry_id, $advocate_args );
		}
	}
}


/**
 * Update Post Meta from Gravity Forms.
 *
 * @since 1.1.0
 */
function form_update_post_meta( $post_id = 0, $entry_id = 0, $args = [] ) {

	if ( ! $entry_id || ! $post_id ) {
		return false;
	}

	$defaults = [
		'post_meta_key' => '',
		'gf_meta_key'   => '',
		'new_values'    => [],
	];

	$args = $args ?: $defaults;

	if ( is_array( $post_id ) ) {

		foreach ( $post_id as $a_post_id ) {
			form_add_post_meta( $a_post_id, $entry_id, $args );
		}
	} else {
		form_add_post_meta( $post_id, $entry_id, $args );
	}

	// Check the form meta to see what's changed.
	$old_post_id = gform_get_meta( $entry_id, $args['gf_meta_key'] );

	// If this is the first submission, create the meta. Done.
	if ( ! $old_post_id ) {
		return gform_update_meta( $entry_id, $args['gf_meta_key'], $post_id );;
	}

	if ( is_array( $old_post_id ) && is_array( $post_id ) ) {

		$removed_ids = array_diff( $old_post_id, $post_id );

		foreach ( $removed_ids as $removed_id ) {
			form_remove_post_meta( $removed_id, $entry_id, $args );
		}
	} elseif ( $old_post_id != $post_id ) {
		form_remove_post_meta( $old_post_id, $entry_id, $args );
	}

	gform_update_meta( $entry_id, $args['gf_meta_key'], $post_id );
}

/**
 * Add New Post Meta.
 *
 * Adds post-meta to posts selected in a Gravity Form.
 *
 * @since 1.1.0
 */
function form_add_post_meta( $post_id = 0, $entry_id = 0, $args = [] ) {

	$meta_value = get_post_meta( $post_id, $args['post_meta_key'], true );

	if ( ! $meta_value ) {
		$meta_value = [];
	}

	if ( ! isset( $meta_value[ $entry_id ] ) ) {
		$meta_value[ $entry_id ] = [];
	}

	$meta_value[ $entry_id ] = $args['new_values'];

	update_post_meta( $post_id, $args['post_meta_key'], $meta_value );

}

/**
 * Remove Old Post Meta.
 *
 * Deletes post-meta from posts un-selected in a Gravity Form.
 *
 * @since 1.1.0
 */
function form_remove_post_meta( $old_post_id = 0, $entry_id = 0, $args = [] ) {

	$meta_value = get_post_meta( $old_post_id, $args['post_meta_key'], true );

	if ( $meta_value && isset( $meta_value[ $entry_id ] ) ) {
		unset( $meta_value[ $entry_id ] );
	}

	update_post_meta( $old_post_id, $args['post_meta_key'], $meta_value );

}
