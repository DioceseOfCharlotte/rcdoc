<?php

add_action( 'init', 'doc_register_taxonomies' );

function doc_register_taxonomies() {
	register_extended_taxonomy( 'school_system', 'school',
		array(

		    'meta_box' => 'radio',

		    'dashboard_glance' => true,

		    'admin_cols' => array(
		        'updated' => array(
		            'title'       => 'Updated',
		            'meta_key'    => 'updated_date',
		            'date_format' => 'd/m/Y'
		        ),
		    ),

		)
	);

	register_extended_taxonomy( 'agency', 'department',
		array(

		    'meta_box' => 'radio',

		    'dashboard_glance' => true,

		    'admin_cols' => array(
		        'updated' => array(
		            'title'       => 'Updated',
		            'meta_key'    => 'updated_date',
		            'date_format' => 'd/m/Y'
		        ),
		    ),

		),
		array(

		    # Override the base names used for labels:
		    'singular' => 'Agency',
		    'plural'   => 'Agencies',
		    'slug'     => 'agencies'

		)
	);

	register_extended_taxonomy( 'statistics_type', 'statistics_report', array(

        # Use radio buttons in the meta box for this taxonomy on the post editing screen:
        'meta_box' => 'radio',

        # Show this taxonomy in the 'At a Glance' dashboard widget:
        'dashboard_glance' => true,

    	'capabilities' => array(
    		'manage_terms' => 'manage_options',
    		'edit_terms'   => 'manage_options',
    		'delete_terms' => 'manage_options',
    		'assign_terms' => 'edit_statistics_reports',
    	),
    ) );
}
