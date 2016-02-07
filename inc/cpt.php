<?php

add_action( 'init', 'doc_register_post_types' );

function doc_register_post_types() {

	$doc_page_supports = array(
		'title',
		'editor',
		'author',
		'thumbnail',
		'excerpt',
		'page-attributes',
		'theme-layouts',
		'archive',
	);

	$doc_post_supports = array(
		'title',
		'editor',
		'author',
		'thumbnail',
		'excerpt',
		'post-formats',
		'page-attributes',
		'theme-layouts',
		'archive',
	);

	register_extended_post_type( 'school',
		array(
			'admin_cols' => array(
				'featured_image' => array(
				    'title'          => 'Logo',
				    'featured_image' => 'abe-icon',
				),
				'school_system' => array(
				    'taxonomy' => 'school_system',
				),
			),

			'supports'            => $doc_page_supports,
			'capability_type'     => 'school',
			'map_meta_cap'        => true,

			/* Capabilities. */
			'capabilities' => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_school',
				'read_post'              => 'read_school',
				'delete_post'            => 'delete_school',

				# primitive/meta caps
				'create_posts'           => 'create_schools',

				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_schools',
				'edit_others_posts'      => 'manage_schools',
				'publish_posts'          => 'manage_schools',
				'read_private_posts'     => 'read',

				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_schools',
				'delete_private_posts'   => 'manage_schools',
				'delete_published_posts' => 'manage_schools',
				'delete_others_posts'    => 'manage_schools',
				'edit_private_posts'     => 'edit_schools',
				'edit_published_posts'   => 'edit_schools',
			),
	    )
	);

	register_extended_post_type( 'parish',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-book-alt',
			'supports' 			        => $doc_page_supports,
			'capability_type'     => 'parish',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_parish',
				'read_post'              => 'read_parish',
				'delete_post'            => 'delete_parish',
				# primitive/meta caps
				'create_posts'           => 'create_parishes',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_parishes',
				'edit_others_posts'      => 'manage_parishes',
				'publish_posts'          => 'manage_parishes',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_parishes',
				'delete_private_posts'   => 'manage_parishes',
				'delete_published_posts' => 'manage_parishes',
				'delete_others_posts'    => 'manage_parishes',
				'edit_private_posts'     => 'edit_parishes',
				'edit_published_posts'   => 'edit_parishes',
			),
		),
		array(
	        'singular' => 'Parish',
	        'plural'   => 'Parishes',
	        'slug'     => 'parishes',
	    )
	);

	register_extended_post_type( 'department',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Logo',
					'featured_image' => 'abe-icon',
				),
				'agency' => array(
					'taxonomy' => 'agency',
				),
			),
			'supports'            => $doc_page_supports,
			'capability_type'     => 'department',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_department',
				'read_post'              => 'read_department',
				'delete_post'            => 'delete_department',
				# primitive/meta caps
				'create_posts'           => 'create_departments',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_departments',
				'edit_others_posts'      => 'manage_departments',
				'publish_posts'          => 'manage_departments',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_departments',
				'delete_private_posts'   => 'manage_departments',
				'delete_published_posts' => 'manage_departments',
				'delete_others_posts'    => 'manage_departments',
				'edit_private_posts'     => 'edit_departments',
				'edit_published_posts'   => 'edit_departments',
			),
		)
	);

	register_extended_post_type( 'archive_post',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'supports'            => $doc_post_supports,
			'capability_type'     => 'archive_post',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_archive_post',
				'read_post'              => 'read_archive_post',
				'delete_post'            => 'delete_archive_post',
				# primitive/meta caps
				'create_posts'           => 'create_archive_posts',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_archive_posts',
				'edit_others_posts'      => 'manage_archive_posts',
				'publish_posts'          => 'manage_archive_posts',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_archive_posts',
				'delete_private_posts'   => 'manage_archive_posts',
				'delete_published_posts' => 'manage_archive_posts',
				'delete_others_posts'    => 'manage_archive_posts',
				'edit_private_posts'     => 'edit_archive_posts',
				'edit_published_posts'   => 'edit_archive_posts',
			),
		)
	);

	register_extended_post_type( 'bishop',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'supports'            => $doc_post_supports,
			'capability_type'     => 'bishop',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_bishop',
				'read_post'              => 'read_bishop',
				'delete_post'            => 'delete_bishop',
				# primitive/meta caps
				'create_posts'           => 'create_bishop_posts',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_bishop_posts',
				'edit_others_posts'      => 'manage_bishop_posts',
				'publish_posts'          => 'manage_bishop_posts',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_bishop_posts',
				'delete_private_posts'   => 'manage_bishop_posts',
				'delete_published_posts' => 'manage_bishop_posts',
				'delete_others_posts'    => 'manage_bishop_posts',
				'edit_private_posts'     => 'edit_bishop_posts',
				'edit_published_posts'   => 'edit_bishop_posts',
			),
		),
		array(
	        'singular' => 'Bishop',
	        'plural'   => 'Bishop',
	        'slug'     => 'bishop',
	    )
	);

	register_extended_post_type( 'chancery',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'supports'            => $doc_post_supports,
			'capability_type'     => 'chancery',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_chancery',
				'read_post'              => 'read_chancery',
				'delete_post'            => 'delete_chancery',
				# primitive/meta caps
				'create_posts'           => 'create_chancery_posts',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_chancery_posts',
				'edit_others_posts'      => 'manage_chancery_posts',
				'publish_posts'          => 'manage_chancery_posts',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_chancery_posts',
				'delete_private_posts'   => 'manage_chancery_posts',
				'delete_published_posts' => 'manage_chancery_posts',
				'delete_others_posts'    => 'manage_chancery_posts',
				'edit_private_posts'     => 'edit_chancery_posts',
				'edit_published_posts'   => 'edit_chancery_posts',
			),
		),
		array(
			'singular' => 'Chancery',
			'plural'   => 'Chancery',
			'slug'     => 'chancery',
		)
	);

	register_extended_post_type( 'deacon',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'supports'            => $doc_post_supports,
			'capability_type'     => 'deacon',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_deacon',
				'read_post'              => 'read_deacon',
				'delete_post'            => 'delete_deacon',
				# primitive/meta caps
				'create_posts'           => 'create_deacon_posts',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_deacon_posts',
				'edit_others_posts'      => 'manage_deacon_posts',
				'publish_posts'          => 'manage_deacon_posts',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_deacon_posts',
				'delete_private_posts'   => 'manage_deacon_posts',
				'delete_published_posts' => 'manage_deacon_posts',
				'delete_others_posts'    => 'manage_deacon_posts',
				'edit_private_posts'     => 'edit_deacon_posts',
				'edit_published_posts'   => 'edit_deacon_posts',
			),
		),
		array(
			'singular' => 'Deacon',
			'plural'   => 'Deacon',
			'slug'     => 'deacon',
		)
	);

	register_extended_post_type( 'development',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'supports'            => $doc_post_supports,
			'capability_type'     => 'development',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				# meta caps (don't assign these to roles)
				'edit_post'              => 'edit_development',
				'read_post'              => 'read_development',
				'delete_post'            => 'delete_development',
				# primitive/meta caps
				'create_posts'           => 'create_development_posts',
				# primitive caps used outside of map_meta_cap()
				'edit_posts'             => 'edit_development_posts',
				'edit_others_posts'      => 'manage_development_posts',
				'publish_posts'          => 'manage_development_posts',
				'read_private_posts'     => 'read',
				# primitive caps used inside of map_meta_cap()
				'read'                   => 'read',
				'delete_posts'           => 'manage_development_posts',
				'delete_private_posts'   => 'manage_development_posts',
				'delete_published_posts' => 'manage_development_posts',
				'delete_others_posts'    => 'manage_development_posts',
				'edit_private_posts'     => 'edit_development_posts',
				'edit_published_posts'   => 'edit_development_posts',
			),
		),
		array(
			'singular' => 'Development post',
			'plural'   => 'Development',
			'slug'     => 'development',
		)
	);


	# Add required capabilities to the administrator role.
    $role = get_role( 'administrator' );

    if ( ! empty( $role ) ) {

		# Create new posts.
        $role->add_cap( 'create_parishes' );
		$role->add_cap( 'create_schools' );
		$role->add_cap( 'create_departments' );
		$role->add_cap( 'create_archive_posts' );
		$role->add_cap( 'create_bishop_posts' );
		$role->add_cap( 'create_chancery_posts' );
		$role->add_cap( 'create_deacon_posts' );
		$role->add_cap( 'create_development_posts' );

		# Delete/publish existing posts.
        $role->add_cap( 'manage_parishes' );
        $role->add_cap( 'manage_schools' );
		$role->add_cap( 'manage_departments' );
		$role->add_cap( 'manage_archive_posts' );
		$role->add_cap( 'manage_bishop_posts' );
		$role->add_cap( 'manage_chancery_posts' );
		$role->add_cap( 'manage_deacon_posts' );
		$role->add_cap( 'manage_development_posts' );

		# Edit existing posts.
        $role->add_cap( 'edit_parishes' );
        $role->add_cap( 'edit_schools' );
        $role->add_cap( 'edit_departments' );
		$role->add_cap( 'edit_archive_posts' );
		$role->add_cap( 'edit_bishop_posts' );
		$role->add_cap( 'edit_chancery_posts' );
		$role->add_cap( 'edit_deacon_posts' );
		$role->add_cap( 'edit_development_posts' );
    }

}
