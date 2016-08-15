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
	* Alias metabox.
	*/
	// $doc_dept_alias = new_cmb2_box( array(
	// 	'id'            => $prefix . 'alias_metabox',
	// 	'title'         => __( 'Dept Alias', 'cmb2' ),
	// 	'object_types'  => array( 'department' ),
	// 	'context'       => 'side',
	// 	'priority'      => 'low',
	// ) );
	//
	// $doc_dept_alias->add_field( array(
	// 	'name' => __( 'Department has a seperate landing page?', 'cmb2' ),
	// 	'desc' => __( 'Yes. (this page will not be accessed directly.)', 'cmb2' ),
	// 	'id'   => $prefix . 'alias_checkbox',
	// 	'type' => 'checkbox',
	// ) );
	//
	// $doc_dept_alias->add_field( array(
	//     'name'        => __( 'Alias of' ),
	// 	'desc'             => __( 'The landing page for this dept:', 'cmb2' ),
	//     'id'          => $prefix . 'alias_landing',
	// 	'type'    => 'select',
	// 	'show_option_none' => true,
	//     'options' => cmb2_get_post_list( $post_type = array( 'cpt_archive' ) ),
	// ) );

	/**
	* Parent select Metaboxes.
	*/
	$doc_landing_parent = new_cmb2_box( array(
		'id'            => $prefix . 'parent_metabox',
		'title'         => __( 'Attributes', 'cmb2' ),
		'object_types'  => array( 'cpt_archive' ),
		'context'       => 'side',
		'priority'      => 'low',
	) );

	$doc_landing_parent->add_field( array(
	    'name'        => __( 'Parent' ),
	    'id'          => $prefix . 'parent_select',
		'type'    => 'select',
		'show_option_none' => true,
	    'options' => cmb2_get_post_list( $post_type = array( 'cpt_archive' ) ),
	) );

	/**
	* Term Page Colors metabox.
	*/
	$doc_term_meta = new_cmb2_box( array(
		'id'            => $prefix . 'icon_metabox',
		'title'         => __( 'Agency Accents', 'cmb2' ),
		'object_types'     => array( 'term' ),
		'taxonomies'       => array( 'category', 'agency' ),
		'context'       => 'side',
		'priority'      => 'high',
	) );

	$doc_term_meta->add_field( array(
		'name'       => __( 'Accent Color', 'cmb2' ),
		'id'         => $prefix . 'term_color',
		'type'       => 'colorpicker',
		'default'    => apply_filters( 'theme_mod_primary_color', '' ),
		'attributes' => array(
			'data-colorpicker' => wp_json_encode( array(
				'palettes' => array( '#34495E', '#2980b9', '#39CCCC', '#16a085', '#FFC107', '#F44336' ),
			) ),
		),
	) );

	$doc_term_meta->add_field( array(
		'name'       => __( 'Agency Icon', 'cmb2' ),
		'id'         => $prefix . 'tax_icon',
		'type'             => 'select',
		'show_option_none' => true,
		'options'          => get_tax_icons(),
	) );

	$doc_term_meta->add_field( array(
	    'name'        => __( 'Page Links To' ),
		'desc'             => __( 'Point this content to:', 'cmb2' ),
	    'id'          => $prefix . 'linked_post',
		'type'    => 'select',
		'show_option_none' => true,
	    'options' => cmb2_get_post_list( $post_type = array( 'cpt_archive', 'department' ) ),
	) );

/**
 * Register Stats metaboxes.
 */

	$doc_stat = new_cmb2_box( array(
		'id'            => $prefix . 'stats_metabox',
		'title'         => __( 'Statistics Report', 'cmb2' ),
		'object_types'  => array( 'statistics_report' ),
	) );

	$doc_stat->add_field( array(
		'name'    => __( 'Report Year', 'cmb2' ),
		'desc'    => __( 'Enter the year for this Report.', 'cmb2' ),
		'default' => '201_',
		'id'      => $prefix . 'stats_report_date',
		'type'    => 'text_small',
	) );

	$doc_stat->add_field( array(
		'name' => __( 'Report', 'cmb2' ),
		'desc' => __( 'Upload the document or enter a URL.', 'cmb2' ),
		'id'   => $prefix . 'stats_report',
		'type' => 'file',
	) );

	$doc_stat->add_field( array(
		'name'             => __( 'County', 'cmb2' ),
		'desc'             => __( 'Select the relevant county or counties. (optional)', 'cmb2' ),
		'id'               => $prefix . 'stats_county',
		'type'             => 'select',
		'show_option_none' => true,
		'repeatable'       => true,
		'options'          => array(
		'alamance' => 'Alamance',
		'alexander' => 'Alexander',
		'alleghany' => 'Alleghany',
		'anson' => 'Anson',
		'ashe' => 'Ashe',
		'avery' => 'Avery',
		'beaufort' => 'Beaufort',
		'bertie' => 'Bertie',
		'bladen' => 'Bladen',
		'brunswick' => 'Brunswick',
		'buncombe' => 'Buncombe',
		'burke' => 'Burke',
		'cabarrus' => 'Cabarrus',
		'caldwell' => 'Caldwell',
		'camden' => 'Camden',
		'cartere' => 'Cartere',
		'caswell' => 'Caswell',
		'catawba' => 'Catawba',
		'chatham' => 'Chatham',
		'cherokee' => 'Cherokee',
		'chowan' => 'Chowan',
		'clay' => 'Clay',
		'cleveland' => 'Cleveland',
		'columbus' => 'Columbus',
		'craven' => 'Craven',
		'cumberland' => 'Cumberland',
		'currituck' => 'Currituck',
		'dare' => 'Dare',
		'davidson' => 'Davidson',
		'davie' => 'Davie',
		'duplin' => 'Duplin',
		'durham' => 'Durham',
		'edgecombe' => 'Edgecombe',
		'forsyth' => 'Forsyth',
		'franklin' => 'Franklin',
		'gaston' => 'Gaston',
		'gates' => 'Gates',
		'graham' => 'Graham',
		'granville' => 'Granville',
		'greene' => 'Greene',
		'guilford' => 'Guilford',
		'halifax' => 'Halifax',
		'harnett' => 'Harnett',
		'haywood' => 'Haywood',
		'henderson' => 'Henderson',
		'hertford' => 'Hertford',
		'hoke' => 'Hoke',
		'hyde' => 'Hyde',
		'iredell' => 'Iredell',
		'jackson' => 'Jackson',
		'johnston' => 'Johnston',
		'jones' => 'Jones',
		'lee' => 'Lee',
		'lenoir' => 'Lenoir',
		'lincoln' => 'Lincoln',
		'macon' => 'Macon',
		'madison' => 'Madison',
		'martin' => 'Martin',
		'mcdowell' => 'McDowell',
		'mecklenburg' => 'Mecklenburg',
		'mitchell' => 'Mitchell',
		'montgomery' => 'Montgomery',
		'moore' => 'Moore',
		'nash' => 'Nash',
		'new-hanover' => 'New Hanover',
		'northampton' => 'Northampton',
		'onslow' => 'Onslow',
		'orange' => 'Orange',
		'pamlico' => 'Pamlico',
		'pasquotank' => 'Pasquotank',
		'pender' => 'Pender',
		'perquimans' => 'Perquimans',
		'person' => 'Person',
		'pitt' => 'Pitt',
		'polk' => 'Polk',
		'randolph' => 'Randolph',
		'richmond' => 'Richmond',
		'robeson' => 'Robeson',
		'rockingham' => 'Rockingham',
		'rowan' => 'Rowan',
		'rutherford' => 'Rutherford',
		'sampson' => 'Sampson',
		'scotland' => 'Scotland',
		'stanly' => 'Stanly',
		'stokes' => 'Stokes',
		'surry' => 'Surry',
		'swain' => 'Swain',
		'transylvania' => 'Transylvania',
		'tyrrell' => 'Tyrrell',
		'union' => 'Union',
		'vance' => 'Vance',
		'wake' => 'Wake',
		'warren' => 'Warren',
		'washington' => 'Washington',
		'watauga' => 'Watauga',
		'wayne' => 'Wayne',
		'wilkes' => 'Wilkes',
		'wilson' => 'Wilson',
		'yadkin' => 'Yadkin',
		'yancey' => 'Yancey',
		),
	) );

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
		'post_type' => $post_type,
		'posts_per_page' => -1,
		'meta_query' => array(
			array(
			'key'       => 'doc_alias_checkbox',
			'value'     => 'on',
			'compare'   => 'NOT EXISTS',
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
	$style = '';
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
	$hex_color = $term_accent ? trim( $term_accent, '#' ) : get_theme_mod( 'primary_color', '' );
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
	return 'rgba('. $doc_rgb .','. $alpha .')';
}

/**
 * [doc_term_color_text description]
 *
 * @param  [type] $term_id [description]
 * @return [type]          [description]
 */
function doc_term_color_text( $term_id ) {
	$term_accent = new Color( doc_term_color_hex( $term_id ) );
	$text_color = $term_accent->isDark() ? 'fff':'333';
	return "#{$text_color}";
}

function doc_term_color_comp( $term_id, $alpha ) {
	$term_accent = new Color( doc_term_color_hex( $term_id ) );
	$comp_color = $term_accent->isDark() ? $term_accent->darken( 15 ) :$term_accent->lighten( 20 );

	$comp_rgb = implode( ',', hybrid_hex_to_rgb( $comp_color ) );
	return 'rgba('. $comp_rgb .','. $alpha .')';
}
