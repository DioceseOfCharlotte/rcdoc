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
}
