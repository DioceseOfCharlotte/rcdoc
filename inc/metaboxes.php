<?php
/**
 * Metaboxes.
 *
 * @package  RCDOC
 */

use Mexitek\PHPColors\Color;
add_action( 'cmb2_admin_init', 'doc_register_metaboxes' );

/**
 * Register CMB2 Alias Metaboxes.
 */
function doc_register_metaboxes() {
	$prefix = 'doc_';

	/**
	* Parent select Metaboxes.
	*/
	$doc_landing_parent = new_cmb2_box(
		array(
			'id'           => $prefix . 'parent_metabox',
			'title'        => __( 'Attributes', 'cmb2' ),
			'object_types' => array( 'cpt_archive' ),
			'context'      => 'side',
			'priority'     => 'low',
		)
	);

	$doc_landing_parent->add_field(
		array(
			'name'             => __( 'Parent' ),
			'id'               => $prefix . 'parent_select',
			'type'             => 'select',
			'show_option_none' => true,
			'options'          => cmb2_get_post_list( $post_type = array( 'cpt_archive' ) ),
		)
	);

	/**
	* Term Page Colors metabox.
	*/
	$doc_term_meta = new_cmb2_box(
		array(
			'id'           => $prefix . 'icon_metabox',
			'title'        => __( 'Agency Accents', 'cmb2' ),
			'object_types' => array( 'term' ),
			'taxonomies'   => array( 'category', 'agency' ),
			'context'      => 'side',
			'priority'     => 'high',
		)
	);

	$doc_term_meta->add_field(
		array(
			'name'       => __( 'Accent Color', 'cmb2' ),
			'id'         => $prefix . 'term_color',
			'type'       => 'colorpicker',
			'default'    => apply_filters( 'theme_mod_primary_color', '' ),
			'attributes' => array(
				'data-colorpicker' => wp_json_encode(
					array(
						'palettes' => array( '#34495E', '#2980b9', '#39CCCC', '#16a085', '#FFC107', '#F44336' ),
					)
				),
			),
		)
	);

	$doc_term_meta->add_field(
		array(
			'name'             => __( 'Agency Icon', 'cmb2' ),
			'id'               => $prefix . 'tax_icon',
			'type'             => 'select',
			'show_option_none' => true,
			'options'          => get_tax_icons(),
		)
	);

	$doc_term_meta->add_field(
		array(
			'name'             => __( 'Page Links To' ),
			'desc'             => __( 'Point this content to:', 'cmb2' ),
			'id'               => $prefix . 'linked_post',
			'type'             => 'select',
			'show_option_none' => true,
			'options'          => cmb2_get_post_list( $post_type = array( 'cpt_archive', 'department' ) ),
		)
	);

}


/**
 * Gets a list of posts and displays them as options
 *
 * @param  string       $post_type Default is post.
 * @param  string|array $args     Optional. get_posts optional arguments
 * @return array                  An array of options that matches the CMB2 options array
 */
function cmb2_get_post_list( $post_type = 'post', $args = array() ) {

	$args['post_type'] = $post_type;

	// $defaults = array( 'post_type' => 'post' );
	$args = wp_parse_args( $args, array( 'post_type' => 'post' ) );

	$post_type = $args['post_type'];

	$args = array(
		'post_type'      => $post_type,
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'     => 'doc_alias_checkbox',
				'value'   => 'on',
				'compare' => 'NOT EXISTS',
			),
		),
	);

	$posts = get_posts( $args );

	$post_list = array();
	if ( ! empty( $posts ) ) {
		foreach ( $posts as $post ) {
			$post_list[ $post->ID ] = $post->post_title;
		}
	}

	return $post_list;
}

/**
 * List available svgs from the /icons folder.
 *
 * @return [type] [description]
 */
function get_tax_icons( $icon_options = array() ) {

	$icon_options = array(
		'book',
		'book-closed',
		'c-charities',
		'globe',
		'graph',
		'pulpit',
		'script',
		'shield',
	);

	// $icons = wp_get_theme( get_template() )->get_files( 'svg', 2 );
	//
	// foreach ( $icons as &$icon ) {
	// 	$is_icon = basename( $icon );
	// 	$icon_name = basename( $icon, '.svg' );
	// 	if ( locate_template( 'images/tax-icons/' . $is_icon ) ) {
	// 		$icon_options[ $icon_name ] = $icon_name;
	// 	}
	// }
	// unset( $icon );

	return $icon_options;

}

/**
 * Return style for using in html.
 *
 * @param  [type] $term_id [description]
 * @param  string $alpha   [description]
 * @return [type]          [description]
 */
function doc_term_color_style( $term_id, $alpha = '1' ) {
	$style  = '';
	$style .= 'background-color:';
	$style .= doc_term_color_rgb( $term_id, $alpha );
	$style .= ';color:';
	$style .= doc_term_color_text( $term_id );
	$style .= ';';
	return $style;
}

/**
 * [doc_term_color_hex description]
 *
 * @param  [type] $term_id [description]
 * @return [type]          [description]
 */
function doc_term_color_hex( $term_id ) {
	$term_accent = get_term_meta( $term_id, 'doc_term_color', true );
	$hex_color   = $term_accent ? trim( $term_accent, '#' ) : get_theme_mod( 'primary_color', '' );
	return "#{$hex_color}";
}

/**
 * [doc_term_color_rgb description]
 *
 * @param  [type] $term_id [description]
 * @param  [type] $alpha   [description]
 * @return [type]          [description]
 */
function doc_term_color_rgb( $term_id, $alpha ) {
	$doc_hex = doc_term_color_hex( $term_id );
	$doc_rgb = implode( ',', hybrid_hex_to_rgb( $doc_hex ) );
	return 'rgba(' . $doc_rgb . ',' . $alpha . ')';
}

/**
 * [doc_term_color_text description]
 *
 * @param  [type] $term_id [description]
 * @return [type]          [description]
 */
function doc_term_color_text( $term_id ) {
	$term_accent = new Color( doc_term_color_hex( $term_id ) );
	$text_color  = $term_accent->isDark() ? 'fff' : '333';
	return "#{$text_color}";
}

function doc_term_color_comp( $term_id, $alpha ) {
	$term_accent = new Color( doc_term_color_hex( $term_id ) );
	$comp_color  = $term_accent->isDark() ? $term_accent->darken( 15 ) : $term_accent->lighten( 20 );

	$comp_rgb = implode( ',', hybrid_hex_to_rgb( $comp_color ) );
	return 'rgba(' . $comp_rgb . ',' . $alpha . ')';
}
