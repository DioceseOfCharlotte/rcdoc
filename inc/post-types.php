<?php

//add_action( 'init', 'doc_departments_register_post_types' );
//add_action( 'init', 'doc_parishs_register_post_types' );
// add_action( 'init', 'doc_schools_register_post_types' );
//add_action( 'init', 'doc_archive_posts_register_post_types' );
//add_action( 'init', 'doc_bishop_register_post_types' );
//add_action( 'init', 'doc_chancerys_register_post_types' );
//add_action( 'init', 'doc_developments_register_post_types' );
//add_action( 'init', 'doc_deacons_register_post_types' );
add_action( 'init', 'doc_finances_register_post_types' );
add_action( 'init', 'doc_hispanic_ministries_register_post_types' );
add_action( 'init', 'doc_housings_register_post_types' );
add_action( 'init', 'doc_info_techs_register_post_types' );
add_action( 'init', 'doc_liturgys_register_post_types' );
add_action( 'init', 'doc_multiculturals_register_post_types' );
add_action( 'init', 'doc_plannings_register_post_types' );
add_action( 'init', 'doc_properties_register_post_types' );
add_action( 'init', 'doc_tribunals_register_post_types' );
add_action( 'init', 'doc_vocations_register_post_types' );





function doc_vocations_register_post_types() {

    register_post_type(
        'vocation',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-businessman',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'vocations',
            'query_var'           => 'vocation',
            'capability_type'     => 'vocation',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_vocation',
                'read_post'              => 'read_vocation',
                'delete_post'            => 'delete_vocation',

                // primitive/meta caps
                'create_posts'           => 'create_vocations',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_vocations',
                'edit_others_posts'      => 'manage_vocations',
                'publish_posts'          => 'manage_vocations',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_vocations',
                'delete_private_posts'   => 'manage_vocations',
                'delete_published_posts' => 'manage_vocations',
                'delete_others_posts'    => 'manage_vocations',
                'edit_private_posts'     => 'edit_vocations',
                'edit_published_posts'   => 'edit_vocations',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'vocations',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Vocations',                           'rcdoc' ),
                'singular_name'      => __( 'Vocations Post',                    'rcdoc' ),
                'menu_name'          => __( 'Vocations',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Vocations',                        'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Vocations Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Vocations Post',               'rcdoc' ),
                'new_item'           => __( 'New Vocations Post',                'rcdoc' ),
                'view_item'          => __( 'View Vocations Post',               'rcdoc' ),
                'search_items'       => __( 'Search Vocations Posts',            'rcdoc' ),
                'not_found'          => __( 'No Vocations Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Vocations Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Vocations',                        'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_vocations'     ); // Create new posts.
        $role->add_cap( 'manage_vocations'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_vocations'       ); // Edit existing posts.
    }
}



function doc_tribunals_register_post_types() {

    register_post_type(
        'tribunal',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-analytics',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'tribunals',
            'query_var'           => 'tribunal',
            'capability_type'     => 'tribunal',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_tribunal',
                'read_post'              => 'read_tribunal',
                'delete_post'            => 'delete_tribunal',

                // primitive/meta caps
                'create_posts'           => 'create_tribunals',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_tribunals',
                'edit_others_posts'      => 'manage_tribunals',
                'publish_posts'          => 'manage_tribunals',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_tribunals',
                'delete_private_posts'   => 'manage_tribunals',
                'delete_published_posts' => 'manage_tribunals',
                'delete_others_posts'    => 'manage_tribunals',
                'edit_private_posts'     => 'edit_tribunals',
                'edit_published_posts'   => 'edit_tribunals',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'tribunals',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Tribunal Posts',                   'rcdoc' ),
                'singular_name'      => __( 'Tribunal Post',                    'rcdoc' ),
                'menu_name'          => __( 'Tribunal',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Tribunal',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Tribunal Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Tribunal Post',               'rcdoc' ),
                'new_item'           => __( 'New Tribunal Post',                'rcdoc' ),
                'view_item'          => __( 'View Tribunal Post',               'rcdoc' ),
                'search_items'       => __( 'Search Tribunal Posts',            'rcdoc' ),
                'not_found'          => __( 'No Tribunal Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Tribunal Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Tribunal Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_tribunals'     ); // Create new posts.
        $role->add_cap( 'manage_tribunals'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_tribunals'       ); // Edit existing posts.
    }
}



function doc_properties_register_post_types() {

    register_post_type(
        'property',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-building',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'properties',
            'query_var'           => 'property',
            'capability_type'     => 'property',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_property',
                'read_post'              => 'read_property',
                'delete_post'            => 'delete_property',

                // primitive/meta caps
                'create_posts'           => 'create_properties',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_properties',
                'edit_others_posts'      => 'manage_properties',
                'publish_posts'          => 'manage_properties',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_properties',
                'delete_private_posts'   => 'manage_properties',
                'delete_published_posts' => 'manage_properties',
                'delete_others_posts'    => 'manage_properties',
                'edit_private_posts'     => 'edit_properties',
                'edit_published_posts'   => 'edit_properties',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'properties',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Properties Posts',                   'rcdoc' ),
                'singular_name'      => __( 'Properties Post',                    'rcdoc' ),
                'menu_name'          => __( 'Properties',                   'rcdoc' ),
                'name_admin_bar'     => __( 'Properties',                    'rcdoc' ),
                'add_new'            => __( 'Add New',                        'rcdoc' ),
                'add_new_item'       => __( 'Add New Properties Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Properties Post',               'rcdoc' ),
                'new_item'           => __( 'New Properties Post',                'rcdoc' ),
                'view_item'          => __( 'View Properties Post',               'rcdoc' ),
                'search_items'       => __( 'Search Properties Posts',            'rcdoc' ),
                'not_found'          => __( 'No Properties Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Properties Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Properties Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_properties'     ); // Create new posts.
        $role->add_cap( 'manage_properties'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_properties'       ); // Edit existing posts.
    }
}



function doc_plannings_register_post_types() {

    register_post_type(
        'planning',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-networking',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'plannings',
            'query_var'           => 'planning',
            'capability_type'     => 'planning',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_planning',
                'read_post'              => 'read_planning',
                'delete_post'            => 'delete_planning',

                // primitive/meta caps
                'create_posts'           => 'create_plannings',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_plannings',
                'edit_others_posts'      => 'manage_plannings',
                'publish_posts'          => 'manage_plannings',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_plannings',
                'delete_private_posts'   => 'manage_plannings',
                'delete_published_posts' => 'manage_plannings',
                'delete_others_posts'    => 'manage_plannings',
                'edit_private_posts'     => 'edit_plannings',
                'edit_published_posts'   => 'edit_plannings',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'plannings',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Planning & Research Posts',                       'rcdoc' ),
                'singular_name'      => __( 'Planning & Research',                            'rcdoc' ),
                'menu_name'          => __( 'Planning',                                       'rcdoc' ),
                'name_admin_bar'     => __( 'Planning Posts',                                'rcdoc' ),
                'add_new'            => __( 'Add New',                                        'rcdoc' ),
                'add_new_item'       => __( 'Add New Planning & Research Post',                'rcdoc' ),
                'edit_item'          => __( 'Edit Planning & Research Post',                   'rcdoc' ),
                'new_item'           => __( 'New Planning & Research Post',                    'rcdoc' ),
                'view_item'          => __( 'View Planning & Research Post',                   'rcdoc' ),
                'search_items'       => __( 'Search Planning & Research Posts',                'rcdoc' ),
                'not_found'          => __( 'No Planning & Research Posts found',              'rcdoc' ),
                'not_found_in_trash' => __( 'No Planning & Research Posts found in trash',    'rcdoc' ),
                'all_items'          => __( 'Planning Posts',                               'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_plannings'     ); // Create new posts.
        $role->add_cap( 'manage_plannings'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_plannings'       ); // Edit existing posts.
    }
}



function doc_multiculturals_register_post_types() {

    register_post_type(
        'multicultural',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-translation',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'multiculturals',
            'query_var'           => 'multicultural',
            'capability_type'     => 'multicultural',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_multicultural',
                'read_post'              => 'read_multicultural',
                'delete_post'            => 'delete_multicultural',

                // primitive/meta caps
                'create_posts'           => 'create_multiculturals',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_multiculturals',
                'edit_others_posts'      => 'manage_multiculturals',
                'publish_posts'          => 'manage_multiculturals',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_multiculturals',
                'delete_private_posts'   => 'manage_multiculturals',
                'delete_published_posts' => 'manage_multiculturals',
                'delete_others_posts'    => 'manage_multiculturals',
                'edit_private_posts'     => 'edit_multiculturals',
                'edit_published_posts'   => 'edit_multiculturals',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'multicultural-ministries',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Multicultural Ministries',             'rcdoc' ),
                'singular_name'      => __( 'Multicultural Ministry',                 'rcdoc' ),
                'menu_name'          => __( 'Multicultural',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Multicultural',                         'rcdoc' ),
                'add_new'            => __( 'Add New',                                'rcdoc' ),
                'add_new_item'       => __( 'Add New Multicultural Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Multicultural Post',               'rcdoc' ),
                'new_item'           => __( 'New Multicultural Post',                'rcdoc' ),
                'view_item'          => __( 'View Multicultural Post',               'rcdoc' ),
                'search_items'       => __( 'Search Multicultural Posts',            'rcdoc' ),
                'not_found'          => __( 'No Multicultural posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Multicultural Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Multicultural Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_multiculturals'     ); // Create new posts.
        $role->add_cap( 'manage_multiculturals'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_multiculturals'       ); // Edit existing posts.
    }
}



function doc_liturgys_register_post_types() {

    register_post_type(
        'liturgy',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-book',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'liturgys',
            'query_var'           => 'liturgy',
            'capability_type'     => 'liturgy',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_liturgy',
                'read_post'              => 'read_liturgy',
                'delete_post'            => 'delete_liturgy',

                // primitive/meta caps
                'create_posts'           => 'create_liturgys',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_liturgys',
                'edit_others_posts'      => 'manage_liturgys',
                'publish_posts'          => 'manage_liturgys',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_liturgys',
                'delete_private_posts'   => 'manage_liturgys',
                'delete_published_posts' => 'manage_liturgys',
                'delete_others_posts'    => 'manage_liturgys',
                'edit_private_posts'     => 'edit_liturgys',
                'edit_published_posts'   => 'edit_liturgys',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'liturgys',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Liturgy & Worship Posts',                       'rcdoc' ),
                'singular_name'      => __( 'Liturgy & Worship Post',                        'rcdoc' ),
                'menu_name'          => __( 'Liturgy & Worship',                               'rcdoc' ),
                'name_admin_bar'     => __( 'Liturgy & Worship',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                                        'rcdoc' ),
                'add_new_item'       => __( 'Add New Liturgy & Worship Post',                'rcdoc' ),
                'edit_item'          => __( 'Edit Liturgy & Worship Post',                   'rcdoc' ),
                'new_item'           => __( 'New Liturgy & Worship Post',                    'rcdoc' ),
                'view_item'          => __( 'View Liturgy & Worship Post',                   'rcdoc' ),
                'search_items'       => __( 'Search Liturgy & Worship Posts',                'rcdoc' ),
                'not_found'          => __( 'No Liturgy & Worship posts found',              'rcdoc' ),
                'not_found_in_trash' => __( 'No Liturgy & Worship posts found in trash',    'rcdoc' ),
                'all_items'          => __( 'L & W Posts',                                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_liturgys'     ); // Create new posts.
        $role->add_cap( 'manage_liturgys'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_liturgys'       ); // Edit existing posts.
    }
}



function doc_info_techs_register_post_types() {

    register_post_type(
        'info_tech',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-desktop',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'info_techs',
            'query_var'           => 'info_tech',
            'capability_type'     => 'info_tech',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_info_tech',
                'read_post'              => 'read_info_tech',
                'delete_post'            => 'delete_info_tech',

                // primitive/meta caps
                'create_posts'           => 'create_info_techs',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_info_techs',
                'edit_others_posts'      => 'manage_info_techs',
                'publish_posts'          => 'manage_info_techs',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_info_techs',
                'delete_private_posts'   => 'manage_info_techs',
                'delete_published_posts' => 'manage_info_techs',
                'delete_others_posts'    => 'manage_info_techs',
                'edit_private_posts'     => 'edit_info_techs',
                'edit_published_posts'   => 'edit_info_techs',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'info_techs',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'IT Posts',                   'rcdoc' ),
                'singular_name'      => __( 'IT Post',                    'rcdoc' ),
                'menu_name'          => __( 'IT',                           'rcdoc' ),
                'name_admin_bar'     => __( 'IT',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                    'rcdoc' ),
                'add_new_item'       => __( 'Add New IT Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit IT Post',               'rcdoc' ),
                'new_item'           => __( 'New IT Post',                'rcdoc' ),
                'view_item'          => __( 'View IT Post',               'rcdoc' ),
                'search_items'       => __( 'Search IT Posts',            'rcdoc' ),
                'not_found'          => __( 'No IT posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No IT posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'IT Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_info_techs'     ); // Create new posts.
        $role->add_cap( 'manage_info_techs'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_info_techs'       ); // Edit existing posts.
    }
}



function doc_housings_register_post_types() {

    register_post_type(
        'housing',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-admin-multisite',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'housings',
            'query_var'           => 'housing',
            'capability_type'     => 'housing',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_housing',
                'read_post'              => 'read_housing',
                'delete_post'            => 'delete_housing',

                // primitive/meta caps
                'create_posts'           => 'create_housings',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_housings',
                'edit_others_posts'      => 'manage_housings',
                'publish_posts'          => 'manage_housings',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_housings',
                'delete_private_posts'   => 'manage_housings',
                'delete_published_posts' => 'manage_housings',
                'delete_others_posts'    => 'manage_housings',
                'edit_private_posts'     => 'edit_housings',
                'edit_published_posts'   => 'edit_housings',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'housings',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Housing Posts',                       'rcdoc' ),
                'singular_name'      => __( 'Housing Post',                        'rcdoc' ),
                'menu_name'          => __( 'Housing',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Housing',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Housing Post',                'rcdoc' ),
                'edit_item'          => __( 'Edit Housing Post',                   'rcdoc' ),
                'new_item'           => __( 'New Housing Post',                    'rcdoc' ),
                'view_item'          => __( 'View Housing Post',                   'rcdoc' ),
                'search_items'       => __( 'Search Housing Posts',                'rcdoc' ),
                'not_found'          => __( 'No housing posts found',              'rcdoc' ),
                'not_found_in_trash' => __( 'No housing posts found in trash',    'rcdoc' ),
                'all_items'          => __( 'Housing Posts',                       'rcdoc' ),
            ),
        )
    );
    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_housings'     ); // Create new posts.
        $role->add_cap( 'manage_housings'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_housings'       ); // Edit existing posts.
    }
}



function doc_hispanic_ministries_register_post_types() {

    register_post_type(
        'hispanic_ministry',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-share-alt',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'hispanic_ministries',
            'query_var'           => 'hispanic_ministry',
            'capability_type'     => 'hispanic_ministry',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_hispanic_ministry',
                'read_post'              => 'read_hispanic_ministry',
                'delete_post'            => 'delete_hispanic_ministry',

                // primitive/meta caps
                'create_posts'           => 'create_hispanic_ministries',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_hispanic_ministries',
                'edit_others_posts'      => 'manage_hispanic_ministries',
                'publish_posts'          => 'manage_hispanic_ministries',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_hispanic_ministries',
                'delete_private_posts'   => 'manage_hispanic_ministries',
                'delete_published_posts' => 'manage_hispanic_ministries',
                'delete_others_posts'    => 'manage_hispanic_ministries',
                'edit_private_posts'     => 'edit_hispanic_ministries',
                'edit_published_posts'   => 'edit_hispanic_ministries',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'hispanic_ministries',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Hispanic Ministries Posts',                   'rcdoc' ),
                'singular_name'      => __( 'Hispanic Ministries Post',                    'rcdoc' ),
                'menu_name'          => __( 'Hispanic Ministry',                   'rcdoc' ),
                'name_admin_bar'     => __( 'Hispanic Ministry',                    'rcdoc' ),
                'add_new'            => __( 'Add New',                        'rcdoc' ),
                'add_new_item'       => __( 'Add New Hispanic Ministries Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Hispanic Ministries Post',               'rcdoc' ),
                'new_item'           => __( 'New Hispanic Ministries Post',                'rcdoc' ),
                'view_item'          => __( 'View Hispanic Ministries Post',               'rcdoc' ),
                'search_items'       => __( 'Search Hispanic Ministries Posts',            'rcdoc' ),
                'not_found'          => __( 'No Hispanic Ministries Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Hispanic Ministries Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Hispanic Ministries Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_hispanic_ministries'     ); // Create new posts.
        $role->add_cap( 'manage_hispanic_ministries'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_hispanic_ministries'       ); // Edit existing posts.
    }
}



function doc_finances_register_post_types() {

    register_post_type(
        'finance',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-portfolio',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'finances',
            'query_var'           => 'finance',
            'capability_type'     => 'finance',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_finance',
                'read_post'              => 'read_finance',
                'delete_post'            => 'delete_finance',

                // primitive/meta caps
                'create_posts'           => 'create_finances',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_finances',
                'edit_others_posts'      => 'manage_finances',
                'publish_posts'          => 'manage_finances',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_finances',
                'delete_private_posts'   => 'manage_finances',
                'delete_published_posts' => 'manage_finances',
                'delete_others_posts'    => 'manage_finances',
                'edit_private_posts'     => 'edit_finances',
                'edit_published_posts'   => 'edit_finances',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'finances',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Finance Posts',                       'rcdoc' ),
                'singular_name'      => __( 'Finance Post',                        'rcdoc' ),
                'menu_name'          => __( 'Finance',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Finance',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Finance Post',                'rcdoc' ),
                'edit_item'          => __( 'Edit Finance Post',                   'rcdoc' ),
                'new_item'           => __( 'New Finance Post',                    'rcdoc' ),
                'view_item'          => __( 'View Finance Post',                   'rcdoc' ),
                'search_items'       => __( 'Search Finance Posts',                'rcdoc' ),
                'not_found'          => __( 'No finance posts found',              'rcdoc' ),
                'not_found_in_trash' => __( 'No finance posts found in trash',    'rcdoc' ),
                'all_items'          => __( 'Finance Posts',                       'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_finances'     ); // Create new posts.
        $role->add_cap( 'manage_finances'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_finances'       ); // Edit existing posts.
    }
}



function doc_developments_register_post_types() {

    register_post_type(
        'development',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-chart-bar',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'developments',
            'query_var'           => 'development',
            'capability_type'     => 'development',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_development',
                'read_post'              => 'read_development',
                'delete_post'            => 'delete_development',

                // primitive/meta caps
                'create_posts'           => 'create_developments',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_developments',
                'edit_others_posts'      => 'manage_developments',
                'publish_posts'          => 'manage_developments',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_developments',
                'delete_private_posts'   => 'manage_developments',
                'delete_published_posts' => 'manage_developments',
                'delete_others_posts'    => 'manage_developments',
                'edit_private_posts'     => 'edit_developments',
                'edit_published_posts'   => 'edit_developments',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'developments',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Development Posts',                   'rcdoc' ),
                'singular_name'      => __( 'Development Post',                    'rcdoc' ),
                'menu_name'          => __( 'Development',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Development',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                                'rcdoc' ),
                'add_new_item'       => __( 'Add New Development Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Development Post',               'rcdoc' ),
                'new_item'           => __( 'New Development Post',                'rcdoc' ),
                'view_item'          => __( 'View Development Post',               'rcdoc' ),
                'search_items'       => __( 'Search Development Posts',            'rcdoc' ),
                'not_found'          => __( 'No Development Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Development Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Development Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_developments'     ); // Create new posts.
        $role->add_cap( 'manage_developments'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_developments'       ); // Edit existing posts.
    }
}



function doc_deacons_register_post_types() {

    register_post_type(
        'deacon',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-shield-alt',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'deacons',
            'query_var'           => 'deacon',
            'capability_type'     => 'deacon',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_deacon',
                'read_post'              => 'read_deacon',
                'delete_post'            => 'delete_deacon',

                // primitive/meta caps
                'create_posts'           => 'create_deacons',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_deacons',
                'edit_others_posts'      => 'manage_deacons',
                'publish_posts'          => 'manage_deacons',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_deacons',
                'delete_private_posts'   => 'manage_deacons',
                'delete_published_posts' => 'manage_deacons',
                'delete_others_posts'    => 'manage_deacons',
                'edit_private_posts'     => 'edit_deacons',
                'edit_published_posts'   => 'edit_deacons',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'deacons',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Deacon',                   'rcdoc' ),
                'singular_name'      => __( 'Deacon',                    'rcdoc' ),
                'menu_name'          => __( 'Deacon',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Deacon',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Deacon Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Deacon Post',               'rcdoc' ),
                'new_item'           => __( 'New Deacon Post',                'rcdoc' ),
                'view_item'          => __( 'View Deacon Post',               'rcdoc' ),
                'search_items'       => __( 'Search Deacon Posts',            'rcdoc' ),
                'not_found'          => __( 'No Deacon posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Deacon Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Deacon Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_deacons'     ); // Create new posts.
        $role->add_cap( 'manage_deacons'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_deacons'       ); // Edit existing posts.
    }
}


function doc_chancerys_register_post_types() {

    register_post_type(
        'chancery',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-shield-alt',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'chancerys',
            'query_var'           => 'chancery',
            'capability_type'     => 'chancery',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_chancery',
                'read_post'              => 'read_chancery',
                'delete_post'            => 'delete_chancery',

                // primitive/meta caps
                'create_posts'           => 'create_chancerys',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_chancerys',
                'edit_others_posts'      => 'manage_chancerys',
                'publish_posts'          => 'manage_chancerys',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_chancerys',
                'delete_private_posts'   => 'manage_chancerys',
                'delete_published_posts' => 'manage_chancerys',
                'delete_others_posts'    => 'manage_chancerys',
                'edit_private_posts'     => 'edit_chancerys',
                'edit_published_posts'   => 'edit_chancerys',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'chancerys',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Chancery',                   'rcdoc' ),
                'singular_name'      => __( 'Chancery',                    'rcdoc' ),
                'menu_name'          => __( 'Chancery',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Chancery',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Chancery Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Chancery Post',               'rcdoc' ),
                'new_item'           => __( 'New Chancery Post',                'rcdoc' ),
                'view_item'          => __( 'View Chancery Post',               'rcdoc' ),
                'search_items'       => __( 'Search Chancery Posts',            'rcdoc' ),
                'not_found'          => __( 'No Chancery posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Chancery Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Chancery Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_chancerys'     ); // Create new posts.
        $role->add_cap( 'manage_chancerys'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_chancerys'       ); // Edit existing posts.
    }
}



function doc_bishop_register_post_types() {

    register_post_type(
        'bishop',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-shield-alt',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'bishop_posts',
            'query_var'           => 'bishop',
            'capability_type'     => 'bishop',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_bishop',
                'read_post'              => 'read_bishop',
                'delete_post'            => 'delete_bishop',

                // primitive/meta caps
                'create_posts'           => 'create_bishop_posts',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_bishop_posts',
                'edit_others_posts'      => 'manage_bishop_posts',
                'publish_posts'          => 'manage_bishop_posts',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_bishop_posts',
                'delete_private_posts'   => 'manage_bishop_posts',
                'delete_published_posts' => 'manage_bishop_posts',
                'delete_others_posts'    => 'manage_bishop_posts',
                'edit_private_posts'     => 'edit_bishop_posts',
                'edit_published_posts'   => 'edit_bishop_posts',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'bishop',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
                'custom-header'
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Bishop',                   'rcdoc' ),
                'singular_name'      => __( 'Bishop',                    'rcdoc' ),
                'menu_name'          => __( 'Bishop',                           'rcdoc' ),
                'name_admin_bar'     => __( 'Bishop',                            'rcdoc' ),
                'add_new'            => __( 'Add New',                            'rcdoc' ),
                'add_new_item'       => __( 'Add New Bishop Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Bishop Post',               'rcdoc' ),
                'new_item'           => __( 'New Bishop Post',                'rcdoc' ),
                'view_item'          => __( 'View Bishop Post',               'rcdoc' ),
                'search_items'       => __( 'Search Bishop Posts',            'rcdoc' ),
                'not_found'          => __( 'No Bishop posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Bishop Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Bishop Posts',                   'rcdoc' ),
            ),
        )
    );

    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_bishop_posts'     ); // Create new posts.
        $role->add_cap( 'manage_bishop_posts'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_bishop_posts'       ); // Edit existing posts.
    }
}




function doc_archive_posts_register_post_types() {

    register_post_type(
        'archive_post',
        array(
            'description'         => '',
            'public'              => true,
            'publicly_queryable'  => true,
            'show_in_nav_menus'   => false,
            'show_in_admin_bar'   => true,
            'exclude_from_search' => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 100,
            'menu_icon'           => 'dashicons-archive',
            'can_export'          => true,
            'delete_with_user'    => false,
            'hierarchical'        => true,
            'taxonomies'          => array( 'category', 'post_tag' ),
            'has_archive'         => 'archive_posts',
            'query_var'           => 'archive_post',
            'capability_type'     => 'archive_post',
            'map_meta_cap'        => true,

            /* Capabilities. */
            'capabilities' => array(

                // meta caps (don't assign these to roles)
                'edit_post'              => 'edit_archive_post',
                'read_post'              => 'read_archive_post',
                'delete_post'            => 'delete_archive_post',

                // primitive/meta caps
                'create_posts'           => 'create_archive_posts',

                // primitive caps used outside of map_meta_cap()
                'edit_posts'             => 'edit_archive_posts',
                'edit_others_posts'      => 'manage_archive_posts',
                'publish_posts'          => 'manage_archive_posts',
                'read_private_posts'     => 'read',

                // primitive caps used inside of map_meta_cap()
                'read'                   => 'read',
                'delete_posts'           => 'manage_archive_posts',
                'delete_private_posts'   => 'manage_archive_posts',
                'delete_published_posts' => 'manage_archive_posts',
                'delete_others_posts'    => 'manage_archive_posts',
                'edit_private_posts'     => 'edit_archive_posts',
                'edit_published_posts'   => 'edit_archive_posts',
            ),

            /* The rewrite handles the URL structure. */
            'rewrite' => array(
                'slug'       => 'archive-posts',
                'with_front' => false,
                'pages'      => true,
                'feeds'      => true,
                'ep_mask'    => EP_PERMALINK,
            ),

            /* What features the post type supports. */
            'supports' => array(
                'title',
                'editor',
                'author',
                'thumbnail',
                'page-attributes',
                'post-formats',
                'theme-layouts',
                'archive',
            ),

            /* Labels used when displaying the posts. */
            'labels' => array(
                'name'               => __( 'Archive Posts',                   'rcdoc' ),
                'singular_name'      => __( 'Archive Post',                    'rcdoc' ),
                'menu_name'          => __( 'Archive Posts',                   'rcdoc' ),
                'name_admin_bar'     => __( 'Archive Posts',                    'rcdoc' ),
                'add_new'            => __( 'Add New',                    'rcdoc' ),
                'add_new_item'       => __( 'Add New Archive Post',            'rcdoc' ),
                'edit_item'          => __( 'Edit Archive Post',               'rcdoc' ),
                'new_item'           => __( 'New Archive Post',                'rcdoc' ),
                'view_item'          => __( 'View Archive Post',               'rcdoc' ),
                'search_items'       => __( 'Search Archive Posts',            'rcdoc' ),
                'not_found'          => __( 'No Archive Posts found',          'rcdoc' ),
                'not_found_in_trash' => __( 'No Archive Posts found in trash', 'rcdoc' ),
                'all_items'          => __( 'Archive Posts',                   'rcdoc' ),
            ),
        )
    );
    // Get the administrator role.
    $role = get_role( 'administrator' );
    // If the administrator role exists, add required capabilities for the plugin.
    if ( ! empty( $role ) ) {
        $role->add_cap( 'create_archive_posts'     ); // Create new posts.
        $role->add_cap( 'manage_archive_posts'     ); // delete/publish existing posts.
        $role->add_cap( 'edit_archive_posts'       ); // Edit existing posts.
    }
}
