<?php
/**
 * Gravity View.
 *
 * @package  RCDOC
 */

add_filter( 'gravityview/fields/select/output_label', '__return_true' );
add_filter( 'gravityview/widget/enable_custom_class', '__return_true' );
// add_filter( 'gravityview/extension/search/links_sep', '__return_false' );
// add_filter( 'gravityview/extension/search/links_label', '__return_false' );

add_action( 'init', 'doc_register_gv_shortcodes' );
add_action( 'hybrid_register_layouts', 'doc_gv_layouts' );

add_post_type_support( 'gravityview', 'theme-layouts' );

function doc_register_gv_shortcodes() {
	add_shortcode( 'get_parish_meta', 'doc_get_parish_meta_shortcode' );
	add_shortcode( 'get_parish_address', 'doc_get_parish_address_shortcode' );
	add_shortcode( 'get_parish_mailing', 'doc_get_parish_mailing_shortcode' );
	add_shortcode( 'doc_get_parish_staff', 'doc_get_parish_staff_shortcode' );
	add_shortcode( 'get_primary_staff', 'doc_get_primary_staff_shortcode' );
	add_shortcode( 'get_advocates', 'doc_get_advocates_shortcode' );
	add_shortcode( 'doc_get_mission', 'doc_get_mission_shortcode' );
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
			$staff_list .= '<span class="staff-title">Advocate: </span>';
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
