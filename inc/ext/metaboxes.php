<?php
// silence

add_action( 'cmb2_admin_init', 'doc_register_time_schedule_metabox' );
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
		'name'             => __( 'Day(s)', 'cmb2' ),
		//'desc'             => __( 'field description (optional)', 'cmb2' ),
		'id'               => 'day',
		'type'             => 'select',
		'options'          => array(
			'monday' => __( 'Monday', 'cmb2' ),
			'tuesday'   => __( 'Tuesday', 'cmb2' ),
			'wednesday'     => __( 'Wednesday', 'cmb2' ),
		),
		'repeatable' => true, // Repeatable fields are supported w/in repeatable groups (for most types)
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name'             => __( 'Time(s)', 'cmb2' ),
		//'desc'             => __( 'field description (optional)', 'cmb2' ),
		'id'               => 'time',
		'type'             => 'select',
		'options'          => array(
			'01' => __( '01', 'cmb2' ),
			'02'   => __( '02', 'cmb2' ),
			'03'     => __( '03', 'cmb2' ),
		),
		'repeatable' => true, // Repeatable fields are supported w/in repeatable groups (for most types)
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name'        => __( 'Description', 'cmb2' ),
		'description' => __( 'Write a short description for this entry', 'cmb2' ),
		'id'          => 'description',
		'type'        => 'textarea_small',
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name' => __( 'Entry Image', 'cmb2' ),
		'id'   => 'image',
		'type' => 'file',
	) );
	$doc_times->add_group_field( $doc_times_group, array(
		'name' => __( 'Image Caption', 'cmb2' ),
		'id'   => 'image_caption',
		'type' => 'text',
	) );
}
