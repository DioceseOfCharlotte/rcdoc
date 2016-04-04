<?php
/**
 * Taxonomies.
 *
 * @package  RCDOC
 */

add_action( 'init', 'doc_register_taxonomies' );

/**
 * Register taxonomies.
 *
 * @since  0.1.0
 * @access public
 */
function doc_register_taxonomies() {
	register_extended_taxonomy('school_system', 'school',
		array(
			'meta_box' => 'radio',
			'dashboard_glance' => true,
		)
	);

	register_extended_taxonomy( 'agency', 'department',
		array(
			'meta_box' => 'radio',
			'dashboard_glance' => true,
		),
		array(
			'singular' => 'Agency',
			'plural'   => 'Agencies',
			'slug'     => 'agencies',
		)
	);

	register_extended_taxonomy( 'statistics_type', 'statistics_report', array(

		'meta_box' => 'radio',
		'dashboard_glance' => true,

		'capabilities' => array(
			'manage_terms' => 'manage_options',
			'edit_terms'   => 'manage_options',
			'delete_terms' => 'manage_options',
			'assign_terms' => 'edit_statistics_reports',
		),
	) );

	register_extended_taxonomy( 'filetype', 'document', array(

		'meta_box' => 'radio',
		'dashboard_glance' => true,

		'capabilities' => array(
			'manage_terms' => 'manage_options',
			'edit_terms'   => 'manage_options',
			'delete_terms' => 'manage_options',
			'assign_terms' => 'edit_documents',
		),
	) );

	register_extended_taxonomy( 'document_category', 'document', array(

		'meta_box' => 'radio',
		'dashboard_glance' => true,

		'capabilities' => array(
			'manage_terms' => 'manage_options',
			'edit_terms'   => 'manage_options',
			'delete_terms' => 'manage_options',
			'assign_terms' => 'edit_documents',
		),
	) );

	register_extended_taxonomy( 'document_type', 'document', array(

		'meta_box' => 'radio',
		'dashboard_glance' => true,

		'capabilities' => array(
			'manage_terms' => 'manage_options',
			'edit_terms'   => 'manage_options',
			'delete_terms' => 'manage_options',
			'assign_terms' => 'edit_documents',
		),
	) );
}
