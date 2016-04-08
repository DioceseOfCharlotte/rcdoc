<?php
/**
 * Metaboxes.
 *
 * @package  RCDOC
 */

add_action( 'cmb2_admin_init', 'doc_register_stats_upload' );

add_action( 'cmb2_admin_init', 'yourprefix_register_taxonomy_metabox' );
/**
 * Hook in and add a metabox to add fields to taxonomy terms
 */
function yourprefix_register_taxonomy_metabox() {
	$prefix = 'yourprefix_term_';
	/**
	 * Metabox to add fields to categories and tags
	 */
	$cmb_term = new_cmb2_box( array(
		'id'               => $prefix . 'edit',
		'title'            => __( 'Category Metabox', 'cmb2' ), // Doesn't output for term boxes
		'object_types'     => array( 'term' ), // Tells CMB2 to use term_meta vs post_meta
		'taxonomies'       => array( 'category', 'post_tag' ), // Tells CMB2 which taxonomies should have these fields
		// 'new_term_section' => true, // Will display in the "Add New Category" section
	) );
	$cmb_term->add_field( array(
		'name' => __( 'Arbitrary Term Field', 'cmb2' ),
		'desc' => __( 'field description (optional)', 'cmb2' ),
		'id'   => $prefix . 'term_text_field',
		'type' => 'text',
	) );


}


function cmb2_get_icon_options() {

    $icons = (array) get_image_icons();

    // Initate an empty array
    $icon_options = array();
    if ( ! empty( $icons ) ) {
        foreach ( $icons as $icon ) {
            $icon_options[ $icon ] = $icon;
        }
    }

    return $icon_options;
}

function get_image_icons() {
	$files = wp_get_theme( get_template() )->get_files( 'svg', 2 )
	foreach ( $files as $file ) {
	return ( basename( $file, '.svg' ) );
}
}

/**
 * Register metaboxes.
 *
 * @since  0.1.0
 * @access public
 */
function doc_register_stats_upload() {
	$prefix = 'doc_stats_';
	/**
	 * Sample metabox to demonstrate each field type included
	 */
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


/**
 * Hook in and add a metabox to demonstrate repeatable grouped fields
 */
function doc_register_time_schedule_metabox() {
	$prefix = 'doc_group_';
	/**
	 * Repeatable Field Groups
	 */
	$doc_times = new_cmb2_box( array(
		'id'           => $prefix . 'times_metabox',
		'title'        => __( 'Repeating Field Group', 'cmb2' ),
		'object_types' => array( 'parish' ),
	) );
	// $doc_times_group is the field id string, so in this case: $prefix . 'demo'
	$doc_times_group = $doc_times->add_field( array(
		'id'          => $prefix . 'times',
		'type'        => 'group',
		'options'     => array(
			'group_title'   => __( 'Entry {#}', 'cmb2' ),
			'add_button'    => __( 'Add Another Entry', 'cmb2' ),
			'remove_button' => __( 'Remove Entry', 'cmb2' ),
			'sortable'      => true,
		),
	) );

	/**
	 * Group fields works the same, except ids only need
	 * to be unique to the group. Prefix is not needed.
	 *
	 * The parent field's id needs to be passed as the first argument.
	 */
	 $doc_times->add_group_field( $doc_times_group, array(
			'name'             => __( 'Title', 'cmb2' ),
		 'id'                => 'mass_title',
		 'type'              => 'select',
		 'options'           => array(
			'mass'           => __( 'Mass', 'cmb2' ),
			'adoration'      => __( 'Adoration of the Blessed Sacrament', 'cmb2' ),
			'reconciliation' => __( 'Reconciliation', 'cmb2' ),
			'holy_days'      => __( 'Holy Days', 'cmb2' ),
		 ),
	 ) );
	 $doc_times->add_group_field( $doc_times_group, array(
		 'name'             => __( 'Day(s)', 'cmb2' ),
		 'id'               => 'day',
		 'type'             => 'select',
		 'options'          => array(
			'monday'     => __( 'Monday', 'cmb2' ),
			'tuesday'    => __( 'Tuesday', 'cmb2' ),
			'wednesday'  => __( 'Wednesday', 'cmb2' ),
			'thursday'   => __( 'Thursday', 'cmb2' ),
			'friday'     => __( 'Friday', 'cmb2' ),
			'saturday'   => __( 'Saturday', 'cmb2' ),
			'sunday'     => __( 'Sunday', 'cmb2' ),
		 ),
		 'repeatable' => true,
	 ) );
	 $doc_times->add_group_field( $doc_times_group, array(
		 'name' => __( 'Test Time', 'cmb2' ),
		 'desc' => __( 'field description (optional)', 'cmb2' ),
		 'id'   => $prefix . 'time',
		 'type' => 'text_time',
	 ) );
	 $doc_times->add_group_field( $doc_times_group, array(
		 'name'        => __( '**', 'cmb2' ),
		 'description' => __( 'Additional Information  (optional)', 'cmb2' ),
		 'id'          => 'additional',
		 'type'        => 'text',
	 ) );
}
