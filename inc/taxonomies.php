<?php

add_action( 'init', 'doc_schools_register_taxonomies' );
add_action( 'init', 'doc_agencies_register_taxonomies' );
add_action( 'init', 'doc_department_home_register_taxonomies' );




function doc_department_home_register_taxonomies() {

	/* Register the Department Home taxonomy. */

	register_taxonomy(
		'department_home',
		array( 'vocation','tribunal','property','planning','multicultural','liturgy','info_tech','housing','hispanic_ministry','finance','development','deacon','chancery','archive', ),
		array(
			'public'            => true,
			'show_ui'           => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => true,
			'show_admin_column' => true,
			'hierarchical'      => true,
			'query_var'         => 'department_home',

			/* Capabilities. */
			'capabilities' => array(
				'manage_terms' => 'manage_departments',
				'edit_terms'   => 'manage_departments',
				'delete_terms' => 'manage_departments',
				'assign_terms' => 'edit_departments',
			),

			/* The rewrite handles the URL structure. */
			'rewrite' => array(
				'slug'         => 'agencies',
				'with_front'   => false,
				'hierarchical' => true,
				'ep_mask'      => EP_NONE
			),

			/* Labels used when displaying taxonomy and terms. */
			'labels' => array(
				'name'                       => __( 'Department Home Pages',           'rcdoc' ),
				'singular_name'              => __( 'Department Home',                'rcdoc' ),
				'menu_name'                  => __( 'Department Home Pages',             'rcdoc' ),
				'name_admin_bar'             => __( 'Department Home',               'rcdoc' ),
				'search_items'               => __( 'Search Department Home Pages',      'rcdoc' ),
				'popular_items'              => __( 'Popular Department Home Pages',     'rcdoc' ),
				'all_items'                  => __( 'All Department Home Pages',         'rcdoc' ),
				'edit_item'                  => __( 'Edit Department Home',          'rcdoc' ),
				'view_item'                  => __( 'View Department Home',          'rcdoc' ),
				'update_item'                => __( 'Update Department Home',        'rcdoc' ),
				'add_new_item'               => __( 'Add New Department Home',       'rcdoc' ),
				'new_item_name'              => __( 'New Department Home Name',      'rcdoc' ),
				'parent_item'                => __( 'Parent Department Home',        'rcdoc' ),
				'parent_item_colon'          => __( 'Parent Department Home:',       'rcdoc' ),
				'separate_items_with_commas' => null,
				'add_or_remove_items'        => null,
				'choose_from_most_used'      => null,
				'not_found'                  => null,
			)
		)
	);
}




function doc_agencies_register_taxonomies() {

	/* Register the Department Agency taxonomy. */

	register_taxonomy(
		'agency',
		array( 'department' ),
		array(
			'public'            => true,
			'show_ui'           => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => true,
			'show_admin_column' => true,
			'hierarchical'      => true,
			'query_var'         => 'agency',

			/* Capabilities. */
			'capabilities' => array(
				'manage_terms' => 'manage_departments',
				'edit_terms'   => 'manage_departments',
				'delete_terms' => 'manage_departments',
				'assign_terms' => 'edit_departments',
			),

			/* The rewrite handles the URL structure. */
			'rewrite' => array(
				'slug'         => 'agencies',
				'with_front'   => false,
				'hierarchical' => true,
				'ep_mask'      => EP_NONE
			),

			/* Labels used when displaying taxonomy and terms. */
			'labels' => array(
				'name'                       => __( 'Department Agencies',           'rcdoc' ),
				'singular_name'              => __( 'Department Agency',                'rcdoc' ),
				'menu_name'                  => __( 'Department Agencies',             'rcdoc' ),
				'name_admin_bar'             => __( 'Department Agency',               'rcdoc' ),
				'search_items'               => __( 'Search Department Agencies',      'rcdoc' ),
				'popular_items'              => __( 'Popular Department Agencies',     'rcdoc' ),
				'all_items'                  => __( 'All Department Agencies',         'rcdoc' ),
				'edit_item'                  => __( 'Edit Department Agency',          'rcdoc' ),
				'view_item'                  => __( 'View Department Agency',          'rcdoc' ),
				'update_item'                => __( 'Update Department Agency',        'rcdoc' ),
				'add_new_item'               => __( 'Add New Department Agency',       'rcdoc' ),
				'new_item_name'              => __( 'New Department Agency Name',      'rcdoc' ),
				'parent_item'                => __( 'Parent Department Agency',        'rcdoc' ),
				'parent_item_colon'          => __( 'Parent Department Agency:',       'rcdoc' ),
				'separate_items_with_commas' => null,
				'add_or_remove_items'        => null,
				'choose_from_most_used'      => null,
				'not_found'                  => null,
			)
		)
	);
}



function doc_schools_register_taxonomies() {

	/* Register the School System taxonomy. */

	register_taxonomy(
		'school_system',
		array( 'school' ),
		array(
			'public'            => true,
			'show_ui'           => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => true,
			'show_admin_column' => true,
			'hierarchical'      => true,
			'query_var'         => 'school_system',

			/* Capabilities. */
			'capabilities' => array(
				'manage_terms' => 'manage_schools',
				'edit_terms'   => 'manage_schools',
				'delete_terms' => 'manage_schools',
				'assign_terms' => 'edit_schools',
			),

			/* The rewrite handles the URL structure. */
			'rewrite' => array(
				'slug'         => 'schools/system',
				'with_front'   => false,
				'hierarchical' => true,
				'ep_mask'      => EP_NONE
			),

			/* Labels used when displaying taxonomy and terms. */
			'labels' => array(
				'name'                       => __( 'School Systems',           'rcdoc' ),
				'singular_name'              => __( 'School System',            'rcdoc' ),
				'menu_name'                  => __( 'School Systems',             'rcdoc' ),
				'name_admin_bar'             => __( 'School System',               'rcdoc' ),
				'search_items'               => __( 'Search School Systems',      'rcdoc' ),
				'popular_items'              => __( 'Popular School Systems',     'rcdoc' ),
				'all_items'                  => __( 'All School Systems',         'rcdoc' ),
				'edit_item'                  => __( 'Edit School System',          'rcdoc' ),
				'view_item'                  => __( 'View School System',          'rcdoc' ),
				'update_item'                => __( 'Update School System',        'rcdoc' ),
				'add_new_item'               => __( 'Add New School System',       'rcdoc' ),
				'new_item_name'              => __( 'New School System Name',      'rcdoc' ),
				'parent_item'                => __( 'Parent School System',        'rcdoc' ),
				'parent_item_colon'          => __( 'Parent School System:',       'rcdoc' ),
				'separate_items_with_commas' => null,
				'add_or_remove_items'        => null,
				'choose_from_most_used'      => null,
				'not_found'                  => null,
			)
		)
	);
}



// Auto-assigned custom taxonomies
function doc_vocation_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, vocation, 'department_home', true );
    }
}
add_action( 'save_post_vocation', 'doc_vocation_post' );


function doc_tribunal_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, tribunal, 'department_home', true );
    }
}
add_action( 'save_post_tribunal', 'doc_tribunal_post' );


function doc_property_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, property, 'department_home', true );
    }
}
add_action( 'save_post_property', 'doc_property_post' );


function doc_planning_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, planning, 'department_home', true );
    }
}
add_action( 'save_post_planning', 'doc_planning_post' );


function doc_multicultural_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, multicultural, 'department_home', true );
    }
}
add_action( 'save_post_multicultural', 'doc_multicultural_post' );


function doc_liturgy_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, liturgy, 'department_home', true );
    }
}
add_action( 'save_post_liturgy', 'doc_liturgy_post' );


function doc_info_tech_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, info_tech, 'department_home', true );
    }
}
add_action( 'save_post_info_tech', 'doc_info_tech_post' );


function doc_housing_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, housing, 'department_home', true );
    }
}
add_action( 'save_post_housing', 'doc_housing_post' );


function doc_hispanic_ministry_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, hispanic_ministry, 'department_home', true );
    }
}
add_action( 'save_post_hispanic_ministry', 'doc_hispanic_ministry_post' );


function doc_finance_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, finance, 'department_home', true );
    }
}
add_action( 'save_post_finance', 'doc_finance_post' );


function doc_development_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, development, 'department_home', true );
    }
}
add_action( 'save_post_development', 'doc_development_post' );


function doc_deacon_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, deacon, 'department_home', true );
    }
}
add_action( 'save_post_deacon', 'doc_deacon_post' );


function doc_chancery_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, chancery, 'department_home', true );
    }
}
add_action( 'save_post_chancery', 'doc_chancery_post' );


function doc_archive_post( $post_id ) {
    $current_post = get_post( $post_id );

    if ( $current_post->post_date == $current_post->post_modified ) {
        wp_set_object_terms( $post_id, archive, 'department_home', true );
    }
}
add_action( 'save_post_archive', 'doc_archive_post' );
