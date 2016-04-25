<?php
/**
 * Metaboxes.
 *
 * @package  RCDOC
 */

use Mexitek\PHPColors\Color;
add_action( 'cmb2_admin_init', 'doc_register_stats_upload' );



/**
 * Register metaboxes.
 *
 * @since  0.1.0
 * @access public
 */
function doc_register_stats_upload() {
	$prefix = 'doc_stats_';

	$doc_stat = new_cmb2_box( array(
		'id'            => $prefix . 'metabox',
		'title'         => __( 'Statistics Report', 'cmb2' ),
		'object_types'  => array( 'statistics_report' ),
	) );

	$doc_stat->add_field( array(
		'name'    => __( 'Report Year', 'cmb2' ),
		'desc'    => __( 'Enter the year for this Report.', 'cmb2' ),
		'default' => '201_',
		'id'      => $prefix . 'report_date',
		'type'    => 'text_small',
	) );

	$doc_stat->add_field( array(
		'name' => __( 'Report', 'cmb2' ),
		'desc' => __( 'Upload the document or enter a URL.', 'cmb2' ),
		'id'   => $prefix . 'report',
		'type' => 'file',
	) );

	$doc_stat->add_field( array(
		'name'             => __( 'County', 'cmb2' ),
		'desc'             => __( 'Select the relevant county or counties. (optional)', 'cmb2' ),
		'id'               => $prefix . 'county',
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


// /**
// * Hook in and add a metabox to demonstrate repeatable grouped fields
// */
// function doc_register_time_schedule_metabox() {
// $prefix = 'doc_group_';
// **
// * Repeatable Field Groups
// */
// $doc_times = new_cmb2_box( array(
// 'id'           => $prefix . 'times_metabox',
// 'title'        => __( 'Repeating Field Group', 'cmb2' ),
// 'object_types' => array( 'parish' ),
// ) );
// $doc_times_group is the field id string, so in this case: $prefix . 'demo'
// $doc_times_group = $doc_times->add_field( array(
// 'id'          => $prefix . 'times',
// 'type'        => 'group',
// 'options'     => array(
// 'group_title'   => __( 'Entry {#}', 'cmb2' ),
// 'add_button'    => __( 'Add Another Entry', 'cmb2' ),
// 'remove_button' => __( 'Remove Entry', 'cmb2' ),
// 'sortable'      => true,
// ),
// ) );
//
// **
// * Group fields works the same, except ids only need
// * to be unique to the group. Prefix is not needed.
// *
// * The parent field's id needs to be passed as the first argument.
// */
// $doc_times->add_group_field( $doc_times_group, array(
// 'name'             => __( 'Title', 'cmb2' ),
// 'id'                => 'mass_title',
// 'type'              => 'select',
// 'options'           => array(
// 'mass'           => __( 'Mass', 'cmb2' ),
// 'adoration'      => __( 'Adoration of the Blessed Sacrament', 'cmb2' ),
// 'reconciliation' => __( 'Reconciliation', 'cmb2' ),
// 'holy_days'      => __( 'Holy Days', 'cmb2' ),
// ),
// ) );
// $doc_times->add_group_field( $doc_times_group, array(
// 'name'             => __( 'Day(s)', 'cmb2' ),
// 'id'               => 'day',
// 'type'             => 'select',
// 'options'          => array(
// 'monday'     => __( 'Monday', 'cmb2' ),
// 'tuesday'    => __( 'Tuesday', 'cmb2' ),
// 'wednesday'  => __( 'Wednesday', 'cmb2' ),
// 'thursday'   => __( 'Thursday', 'cmb2' ),
// 'friday'     => __( 'Friday', 'cmb2' ),
// 'saturday'   => __( 'Saturday', 'cmb2' ),
// 'sunday'     => __( 'Sunday', 'cmb2' ),
// ),
// 'repeatable' => true,
// ) );
// $doc_times->add_group_field( $doc_times_group, array(
// 'name' => __( 'Test Time', 'cmb2' ),
// 'desc' => __( 'field description (optional)', 'cmb2' ),
// 'id'   => $prefix . 'time',
// 'type' => 'text_time',
// ) );
// $doc_times->add_group_field( $doc_times_group, array(
// 'name'        => __( '**', 'cmb2' ),
// 'description' => __( 'Additional Information  (optional)', 'cmb2' ),
// 'id'          => 'additional',
// 'type'        => 'text',
// ) );
// }
//
add_action( 'cmb2_admin_init', 'doc_register_term_metaboxes' );

/**
 * Register CMB2 Metaboxes.
 */
function doc_register_term_metaboxes() {
	$prefix = 'doc_';

	/**
	* Page Colors metabox.
	*/
	$doc_term_meta = new_cmb2_box( array(
		'id'            => $prefix . 'icon_metabox',
		'title'         => __( 'Icons', 'cmb2' ),
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
}

/**
 * List available svgs from the /icons folder.
 *
 * @return [type] [description]
 */
function get_tax_icons( $icon_options = array() ) {

	$icons = wp_get_theme( get_template() )->get_files( 'svg', 2 );

	foreach ( $icons as &$icon ) {
		$is_icon = basename( $icon );
		$icon_name = basename( $icon, '.svg' );
		if ( locate_template( 'images/icons/' . $is_icon ) ) {
			$icon_options[ $icon_name ] = $icon_name;
		}
	}
	unset( $icon );

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
	$comp_color = $term_accent->isDark() ? $term_accent->darken(15) :$term_accent->lighten(20);

	$comp_rgb = implode( ',', hybrid_hex_to_rgb( $comp_color ) );
	return 'rgba('. $comp_rgb .','. $alpha .')';
}
