<?php

//add_action( 'cmb2_admin_init', 'doc_attached_posts_field' );
add_action( 'cmb2_admin_init', 'doc_register_stats_upload' );
//add_action( 'cmb2_admin_init', 'doc_register_time_schedule_metabox' );


// add_action( 'cmb2_admin_init', 'yourprefix_register_demo_metabox' );
/**
 * Hook in and add a demo metabox. Can only happen on the 'cmb2_admin_init' or 'cmb2_init' hook.
 */
// function yourprefix_register_demo_metabox() {
// 	$prefix = 'doc_alias_';
//
// 	$doc_alias = new_cmb2_box( array(
// 		'id'            => $prefix . 'metabox',
// 		'title'         => __( 'Test Metabox', 'cmb2' ),
// 		'object_types'  => array( 'cpt_archive', ), // Post type
// 		'show_on_cb' => 'abe_top_level_posts_only', // function should return a bool value
// 		// 'context'    => 'normal',
// 		// 'priority'   => 'high',
// 		// 'show_names' => true, // Show field names on the left
// 		// 'cmb_styles' => false, // false to disable the CMB stylesheet
// 		// 'closed'     => true, // true to keep the metabox closed by default
// 	) );
//
//
// 	$doc_alias->add_field( array(
// 		'name'             => __( 'Test Select', 'cmb2' ),
// 		'desc'             => __( 'field description (optional)', 'cmb2' ),
// 		'id'               => $prefix . 'select',
// 		'type'             => 'select',
// 		'show_option_none' => true,
// 		'options_cb' => 'cmb2_get_your_post_type_post_options',
// 	) );
// }


// function cmb2_get_post_options( $query_args ) {
//
// 	$args = wp_parse_args( $query_args, array(
//         'post_type'   => 'post',
//         'numberposts' => 10,
//     ) );
//
//     $posts = get_posts( $args );
//
//     $post_options = array();
//     if ( $posts ) {
//         foreach ( $posts as $post ) {
//           $post_options[ $post->ID ] = $post->post_title;
//         }
//     }
//
//     return $post_options;
// }

/**
 * Gets 5 posts for your_post_type and displays them as options
 * @return array An array of options that matches the CMB2 options array
 */
// function cmb2_get_your_post_type_post_options() {
//     return cmb2_get_post_options( array( 'post_type' => 'department', 'numberposts' => 200 ) );
// }

/**
 * Exclude metabox on non top level posts
 * @author Travis Northcutt
 * @param  object $cmb CMB2 object
 * @return bool        True/false whether to show the metabox
 */
// function abe_top_level_posts_only( $cmb ) {
// 	$has_parent = $cmb->object_id() && get_post_ancestors( $cmb->object_id() );
// 	if (current_user_can( manage_options ))
// 	return ! $has_parent;
// }


// function doc_attached_posts_field() {
// $prefix = 'doc_posts_';
// //global $current_screen;
// // $current_screen = get_current_screen();
// //$post_type = $current_screen->post_type;
// //$screen = get_current_screen();
// //$post_type = $screen->post_type;
//
// 	$cmb_doc_posts = new_cmb2_box( array(
// 	    'id'           => $prefix . 'metabox',
// 	    'title'        => __( 'Post Info' ),
// 	    'object_types' => rcdoc_non_hierarchy_cpts(),
// 	) );
//
// 	$cmb_doc_posts->add_field( array(
// 		'name'    => __( 'Attached Posts', 'cmb2' ),
// 		'desc'    => __( 'Drag posts from the left column to the right column to attach them to this page.<br />You may rearrange the order of the posts in the right column by dragging and dropping.', 'cmb2' ),
// 		'id'      => $prefix . 'attached_posts',
// 		'type'    => 'custom_attached_posts',
// 		'options' => array(
// 			'show_thumbnails' => true, // Show thumbnails on the left
// 			'filter_boxes'    => true, // Show a text box for filtering the results
// 			//'query_args'      => array( 'post_type'	=> abe_get_cpt_admin() ), // override the get_posts args
// 		)
// 	) );
// }



function doc_register_stats_upload() {
	$prefix = 'doc_stats_';
	/**
	 * Sample metabox to demonstrate each field type included
	 */
	$doc_stat = new_cmb2_box( array(
		'id'            => $prefix . 'metabox',
		'title'         => __( 'Statistics Report', 'cmb2' ),
		'object_types'  => array( 'statistics_report', ), // Post type
		// 'show_on_cb' => 'yourprefix_show_if_front_page', // function should return a bool value
		// 'context'    => 'normal',
		// 'priority'   => 'high',
		// 'show_names' => true, // Show field names on the left
	) );

	$doc_stat->add_field( array(
		'name' => __( 'Report Year', 'cmb2' ),
		'desc' => __( 'Enter the year for this Report.', 'cmb2' ),
		'default' => '201_',
		'id'   => $prefix . 'report_date',
		'type' => 'text_small',
	) );

	$doc_stat->add_field( array(
		'name' => __( 'Report', 'cmb2' ),
		'desc' => __( 'Upload the document or enter a URL.', 'cmb2' ),
		'id'   => $prefix . 'report',
		'type' => 'file',
	) );

	$doc_stat->add_field( array(
		'name' => __( 'County', 'cmb2' ),
		'desc' => __( 'Select the relevant county or counties. (optional)', 'cmb2' ),
		'id'   => $prefix . 'county',
		'type' => 'select',
		'show_option_none' => true,
		'repeatable'      => true,
		'options'          => array(
'alamance' => 'Alamance', 'alexander' => 'Alexander', 'alleghany' => 'Alleghany', 'anson' => 'Anson', 'ashe' => 'Ashe', 'avery' => 'Avery', 'beaufort' => 'Beaufort', 'bertie' => 'Bertie', 'bladen' => 'Bladen', 'brunswick' => 'Brunswick', 'buncombe' => 'Buncombe', 'burke' => 'Burke', 'cabarrus' => 'Cabarrus', 'caldwell' => 'Caldwell', 'camden' => 'Camden', 'cartere' => 'Cartere', 'caswell' => 'Caswell', 'catawba' => 'Catawba', 'chatham' => 'Chatham', 'cherokee' => 'Cherokee', 'chowan' => 'Chowan', 'clay' => 'Clay', 'cleveland' => 'Cleveland', 'columbus' => 'Columbus', 'craven' => 'Craven', 'cumberland' => 'Cumberland', 'currituck' => 'Currituck', 'dare' => 'Dare', 'davidson' => 'Davidson', 'davie' => 'Davie', 'duplin' => 'Duplin', 'durham' => 'Durham', 'edgecombe' => 'Edgecombe', 'forsyth' => 'Forsyth', 'franklin' => 'Franklin', 'gaston' => 'Gaston', 'gates' => 'Gates', 'graham' => 'Graham', 'granville' => 'Granville', 'greene' => 'Greene', 'guilford' => 'Guilford', 'halifax' => 'Halifax', 'harnett' => 'Harnett', 'haywood' => 'Haywood', 'henderson' => 'Henderson', 'hertford' => 'Hertford', 'hoke' => 'Hoke', 'hyde' => 'Hyde', 'iredell' => 'Iredell', 'jackson' => 'Jackson', 'johnston' => 'Johnston', 'jones' => 'Jones', 'lee' => 'Lee', 'lenoir' => 'Lenoir', 'lincoln' => 'Lincoln', 'macon' => 'Macon', 'madison' => 'Madison', 'martin' => 'Martin', 'mcdowell' => 'McDowell', 'mecklenburg' => 'Mecklenburg', 'mitchell' => 'Mitchell', 'montgomery' => 'Montgomery', 'moore' => 'Moore', 'nash' => 'Nash', 'new-hanover' => 'New Hanover', 'northampton' => 'Northampton', 'onslow' => 'Onslow', 'orange' => 'Orange', 'pamlico' => 'Pamlico', 'pasquotank' => 'Pasquotank', 'pender' => 'Pender', 'perquimans' => 'Perquimans', 'person' => 'Person', 'pitt' => 'Pitt', 'polk' => 'Polk', 'randolph' => 'Randolph', 'richmond' => 'Richmond', 'robeson' => 'Robeson', 'rockingham' => 'Rockingham', 'rowan' => 'Rowan', 'rutherford' => 'Rutherford', 'sampson' => 'Sampson', 'scotland' => 'Scotland', 'stanly' => 'Stanly', 'stokes' => 'Stokes', 'surry' => 'Surry', 'swain' => 'Swain', 'transylvania' => 'Transylvania', 'tyrrell' => 'Tyrrell', 'union' => 'Union', 'vance' => 'Vance', 'wake' => 'Wake', 'warren' => 'Warren', 'washington' => 'Washington', 'watauga' => 'Watauga', 'wayne' => 'Wayne', 'wilkes' => 'Wilkes', 'wilson' => 'Wilson', 'yadkin' => 'Yadkin', 'yancey' => 'Yancey',
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
		'object_types' => array( 'parish', ),
	) );
	// $doc_times_group is the field id string, so in this case: $prefix . 'demo'
	$doc_times_group = $doc_times->add_field( array(
		'id'          => $prefix . 'times',
		'type'        => 'group',
		//'description' => __( 'Generates reusable form entries', 'cmb2' ),
		'options'     => array(
			'group_title'   => __( 'Entry {#}', 'cmb2' ), // {#} gets replaced by row number
			'add_button'    => __( 'Add Another Entry', 'cmb2' ),
			'remove_button' => __( 'Remove Entry', 'cmb2' ),
			'sortable'      => true, // beta
			// 'closed'     => true, // true to have the groups closed by default
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
		'id'               => 'mass_title',
		'type'             => 'select',
		'options'          => array(
			'mass' => __( 'Mass', 'cmb2' ),
			'adoration' => __( 'Adoration of the Blessed Sacrament', 'cmb2' ),
			'reconciliation' => __( 'Reconciliation', 'cmb2' ),
			'holy_days' => __( 'Holy Days', 'cmb2' ),
		),
 	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name'             => __( 'Day(s)', 'cmb2' ),
		//'desc'             => __( 'field description (optional)', 'cmb2' ),
		'id'               => 'day',
		'type'             => 'select',
		'options'          => array(
			'monday' => __( 'Monday', 'cmb2' ),
			'tuesday' => __( 'Tuesday', 'cmb2' ),
			'wednesday'  => __( 'Wednesday', 'cmb2' ),
			'thursday' => __( 'Thursday', 'cmb2' ),
			'friday' => __( 'Friday', 'cmb2' ),
			'saturday'  => __( 'Saturday', 'cmb2' ),
			'sunday'  => __( 'Sunday', 'cmb2' ),
		),
		'repeatable' => true,
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name' => __( 'Test Time', 'cmb2' ),
		'desc' => __( 'field description (optional)', 'cmb2' ),
		'id'   => $prefix . 'time',
		'type' => 'text_time',
		// 'time_format' => 'H:i', // Set to 24hr format
		'repeatable' => true, // Repeatable fields are supported w/in repeatable groups (for most types)
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name'        => __( '**', 'cmb2' ),
		'description' => __( 'Additional Information  (optional)', 'cmb2' ),
		'id'          => 'additional',
		'type'        => 'text',
	) );
}
