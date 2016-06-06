<?php
/**
 * Post Types.
 *
 * @package  RCDOC
 */

add_action( 'init', 'doc_register_post_types' );

/**
 * Register post_types.
 *
 * @since  0.1.0
 * @access public
 */
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
		'arch-home',
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
			'menu_icon'           => 'dashicons-welcome-learn-more',
			'supports'            => $doc_page_supports,
			'capability_type'     => 'school',
			'map_meta_cap'        => true,

			/* Capabilities. */
			'capabilities' => array(
				// Meta caps (don't assign these to roles)..
				'edit_post'              => 'edit_school',
				'read_post'              => 'read_school',
				'delete_post'            => 'delete_school',

				// Primitive/meta caps..
				'create_posts'           => 'create_schools',

				// Primitive caps used outside of map_meta_cap()..
				'edit_posts'             => 'edit_schools',
				'edit_others_posts'      => 'manage_schools',
				'publish_posts'          => 'manage_schools',
				'read_private_posts'     => 'read',

				// Primitive caps used inside of map_meta_cap()..
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
				// Meta caps (don't assign these to roles)..
				'edit_post'              => 'edit_parish',
				'read_post'              => 'read_parish',
				'delete_post'            => 'delete_parish',
				// Primitive/meta caps.
				'create_posts'           => 'create_parishes',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_parishes',
				'edit_others_posts'      => 'manage_parishes',
				'publish_posts'          => 'manage_parishes',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap()..
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
			'menu_icon'           => 'dashicons-groups',
			'supports'            => $doc_page_supports,
			'capability_type'     => 'department',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_department',
				'read_post'              => 'read_department',
				'delete_post'            => 'delete_department',
				// Primitive/meta caps.
				'create_posts'           => 'create_departments',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_departments',
				'edit_others_posts'      => 'manage_departments',
				'publish_posts'          => 'manage_departments',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
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
			'menu_icon'           => 'dashicons-archive',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'archive_post',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_archive_post',
				'read_post'              => 'read_archive_post',
				'delete_post'            => 'delete_archive_post',
				// Primitive/meta caps.
				'create_posts'           => 'create_archive_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_archive_posts',
				'edit_others_posts'      => 'manage_archive_posts',
				'publish_posts'          => 'manage_archive_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
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
			'menu_icon'           => 'dashicons-shield',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'bishop',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_bishop',
				'read_post'              => 'read_bishop',
				'delete_post'            => 'delete_bishop',
				// Primitive/meta caps.
				'create_posts'           => 'create_bishop_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_bishop_posts',
				'edit_others_posts'      => 'manage_bishop_posts',
				'publish_posts'          => 'manage_bishop_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
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

	register_extended_post_type( 'deacon',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-shield-alt',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'deacon',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_deacon',
				'read_post'              => 'read_deacon',
				'delete_post'            => 'delete_deacon',
				// Primitive/meta caps.
				'create_posts'           => 'create_deacon_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_deacon_posts',
				'edit_others_posts'      => 'manage_deacon_posts',
				'publish_posts'          => 'manage_deacon_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
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
			'menu_icon'           => 'dashicons-chart-bar',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'development',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_development',
				'read_post'              => 'read_development',
				'delete_post'            => 'delete_development',
				// Primitive/meta caps.
				'create_posts'           => 'create_development_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_development_posts',
				'edit_others_posts'      => 'manage_development_posts',
				'publish_posts'          => 'manage_development_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
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

	register_extended_post_type( 'education',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-image-filter',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'education',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_education',
				'read_post'              => 'read_education',
				'delete_post'            => 'delete_education',
				// Primitive/meta caps.
				'create_posts'           => 'create_education_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_education_posts',
				'edit_others_posts'      => 'manage_education_posts',
				'publish_posts'          => 'manage_education_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_education_posts',
				'delete_private_posts'   => 'manage_education_posts',
				'delete_published_posts' => 'manage_education_posts',
				'delete_others_posts'    => 'manage_education_posts',
				'edit_private_posts'     => 'edit_education_posts',
				'edit_published_posts'   => 'edit_education_posts',
			),
		),
		array(
			'singular' => 'Education post',
			'plural'   => 'Education Vicariate',
			'slug'     => 'education-vicariate',
		)
	);

	register_extended_post_type( 'finance',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-portfolio',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'finance',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_finance',
				'read_post'              => 'read_finance',
				'delete_post'            => 'delete_finance',
				// Primitive/meta caps.
				'create_posts'           => 'create_finance_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_finance_posts',
				'edit_others_posts'      => 'manage_finance_posts',
				'publish_posts'          => 'manage_finance_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_finance_posts',
				'delete_private_posts'   => 'manage_finance_posts',
				'delete_published_posts' => 'manage_finance_posts',
				'delete_others_posts'    => 'manage_finance_posts',
				'edit_private_posts'     => 'edit_finance_posts',
				'edit_published_posts'   => 'edit_finance_posts',
			),
		),
		array(
			'singular' => 'Finance post',
			'plural'   => 'Finance',
			'slug'     => 'finance',
		)
	);

	register_extended_post_type( 'hispanic_ministry',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-share-alt',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'hispanic_ministry',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_hispanic_ministry',
				'read_post'              => 'read_hispanic_ministry',
				'delete_post'            => 'delete_hispanic_ministry',
				// Primitive/meta caps.
				'create_posts'           => 'create_hisp_min_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_hisp_min_posts',
				'edit_others_posts'      => 'manage_hisp_min_posts',
				'publish_posts'          => 'manage_hisp_min_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_hisp_min_posts',
				'delete_private_posts'   => 'manage_hisp_min_posts',
				'delete_published_posts' => 'manage_hisp_min_posts',
				'delete_others_posts'    => 'manage_hisp_min_posts',
				'edit_private_posts'     => 'edit_hisp_min_posts',
				'edit_published_posts'   => 'edit_hisp_min_posts',
			),
		),
		array(
			'singular' => 'Hispanic Ministry post',
			'plural'   => 'Hispanic Ministry',
			'slug'     => 'hispanic-ministry',
		)
	);

	register_extended_post_type( 'housing',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-admin-multisite',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'housing',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_housing',
				'read_post'              => 'read_housing',
				'delete_post'            => 'delete_housing',
				// Primitive/meta caps.
				'create_posts'           => 'create_housing_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_housing_posts',
				'edit_others_posts'      => 'manage_housing_posts',
				'publish_posts'          => 'manage_housing_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_housing_posts',
				'delete_private_posts'   => 'manage_housing_posts',
				'delete_published_posts' => 'manage_housing_posts',
				'delete_others_posts'    => 'manage_housing_posts',
				'edit_private_posts'     => 'edit_housing_posts',
				'edit_published_posts'   => 'edit_housing_posts',
			),
		),
		array(
			'singular' => 'Housing post',
			'plural'   => 'Housing',
			'slug'     => 'housing',
		)
	);

	register_extended_post_type( 'human_resources',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-universal-access-alt',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'human_resources',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_human_resources',
				'read_post'              => 'read_human_resources',
				'delete_post'            => 'delete_human_resources',
				// Primitive/meta caps.
				'create_posts'           => 'create_hr_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_hr_posts',
				'edit_others_posts'      => 'manage_hr_posts',
				'publish_posts'          => 'manage_hr_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_hr_posts',
				'delete_private_posts'   => 'manage_hr_posts',
				'delete_published_posts' => 'manage_hr_posts',
				'delete_others_posts'    => 'manage_hr_posts',
				'edit_private_posts'     => 'edit_hr_posts',
				'edit_published_posts'   => 'edit_hr_posts',
			),
		),
		array(
			'singular' => 'HR post',
			'plural'   => 'Human Resources',
			'slug'     => 'human-resources',
		)
	);

	register_extended_post_type( 'info_tech',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-desktop',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'info_tech',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_info_tech',
				'read_post'              => 'read_info_tech',
				'delete_post'            => 'delete_info_tech',
				// Primitive/meta caps.
				'create_posts'           => 'create_it_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_it_posts',
				'edit_others_posts'      => 'manage_it_posts',
				'publish_posts'          => 'manage_it_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_it_posts',
				'delete_private_posts'   => 'manage_it_posts',
				'delete_published_posts' => 'manage_it_posts',
				'delete_others_posts'    => 'manage_it_posts',
				'edit_private_posts'     => 'edit_it_posts',
				'edit_published_posts'   => 'edit_it_posts',
			),
		),
		array(
			'singular' => 'IT post',
			'plural'   => 'IT',
			'slug'     => 'information-tech',
		)
	);

	register_extended_post_type( 'liturgy',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-book',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'liturgy',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_liturgy',
				'read_post'              => 'read_liturgy',
				'delete_post'            => 'delete_liturgy',
				// Primitive/meta caps.
				'create_posts'           => 'create_liturgy_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_liturgy_posts',
				'edit_others_posts'      => 'manage_liturgy_posts',
				'publish_posts'          => 'manage_liturgy_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_liturgy_posts',
				'delete_private_posts'   => 'manage_liturgy_posts',
				'delete_published_posts' => 'manage_liturgy_posts',
				'delete_others_posts'    => 'manage_liturgy_posts',
				'edit_private_posts'     => 'edit_liturgy_posts',
				'edit_published_posts'   => 'edit_liturgy_posts',
			),
		),
		array(
			'singular' => 'Liturgy & Worship post',
			'plural'   => 'Liturgy & Worship',
			'slug'     => 'liturgy-worship',
		)
	);

	register_extended_post_type( 'macs',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-awards',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'macs',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_macs',
				'read_post'              => 'read_macs',
				'delete_post'            => 'delete_macs',
				// Primitive/meta caps.
				'create_posts'           => 'create_macs_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_macs_posts',
				'edit_others_posts'      => 'manage_macs_posts',
				'publish_posts'          => 'manage_macs_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_macs_posts',
				'delete_private_posts'   => 'manage_macs_posts',
				'delete_published_posts' => 'manage_macs_posts',
				'delete_others_posts'    => 'manage_macs_posts',
				'edit_private_posts'     => 'edit_macs_posts',
				'edit_published_posts'   => 'edit_macs_posts',
			),
		),
		array(
			'singular' => 'MACS post',
			'plural'   => 'MACS',
			'slug'     => 'macs',
		)
	);

	register_extended_post_type( 'multicultural',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-translation',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'multicultural',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_multicultural',
				'read_post'              => 'read_multicultural',
				'delete_post'            => 'delete_multicultural',
				// Primitive/meta caps.
				'create_posts'           => 'create_multicultural_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_multicultural_posts',
				'edit_others_posts'      => 'manage_multicultural_posts',
				'publish_posts'          => 'manage_multicultural_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_multicultural_posts',
				'delete_private_posts'   => 'manage_multicultural_posts',
				'delete_published_posts' => 'manage_multicultural_posts',
				'delete_others_posts'    => 'manage_multicultural_posts',
				'edit_private_posts'     => 'edit_multicultural_posts',
				'edit_published_posts'   => 'edit_multicultural_posts',
			),
		),
		array(
			'singular' => 'Multicultural post',
			'plural'   => 'Multicultural',
			'slug'     => 'multicultural',
		)
	);

	register_extended_post_type( 'planning',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-networking',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'planning',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_planning',
				'read_post'              => 'read_planning',
				'delete_post'            => 'delete_planning',
				// Primitive/meta caps.
				'create_posts'           => 'create_planning_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_planning_posts',
				'edit_others_posts'      => 'manage_planning_posts',
				'publish_posts'          => 'manage_planning_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_planning_posts',
				'delete_private_posts'   => 'manage_planning_posts',
				'delete_published_posts' => 'manage_planning_posts',
				'delete_others_posts'    => 'manage_planning_posts',
				'edit_private_posts'     => 'edit_planning_posts',
				'edit_published_posts'   => 'edit_planning_posts',
			),
		),
		array(
			'singular' => 'Planning post',
			'plural'   => 'Planning',
			'slug'     => 'planning',
		)
	);

	register_extended_post_type( 'property',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-building',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'properties',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_properties',
				'read_post'              => 'read_properties',
				'delete_post'            => 'delete_properties',
				// Primitive/meta caps.
				'create_posts'           => 'create_properties_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_properties_posts',
				'edit_others_posts'      => 'manage_properties_posts',
				'publish_posts'          => 'manage_properties_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_properties_posts',
				'delete_private_posts'   => 'manage_properties_posts',
				'delete_published_posts' => 'manage_properties_posts',
				'delete_others_posts'    => 'manage_properties_posts',
				'edit_private_posts'     => 'edit_properties_posts',
				'edit_published_posts'   => 'edit_properties_posts',
			),
		),
		array(
			'singular' => 'Properties post',
			'plural'   => 'Properties',
			'slug'     => 'properties',
		)
	);

	register_extended_post_type( 'tribunal',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-analytics',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'tribunal',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_tribunal',
				'read_post'              => 'read_tribunal',
				'delete_post'            => 'delete_tribunal',
				// Primitive/meta caps.
				'create_posts'           => 'create_tribunal_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_tribunal_posts',
				'edit_others_posts'      => 'manage_tribunal_posts',
				'publish_posts'          => 'manage_tribunal_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_tribunal_posts',
				'delete_private_posts'   => 'manage_tribunal_posts',
				'delete_published_posts' => 'manage_tribunal_posts',
				'delete_others_posts'    => 'manage_tribunal_posts',
				'edit_private_posts'     => 'edit_tribunal_posts',
				'edit_published_posts'   => 'edit_tribunal_posts',
			),
		),
		array(
			'singular' => 'Tribunal post',
			'plural'   => 'Tribunal',
			'slug'     => 'tribunal',
		)
	);

	register_extended_post_type( 'vocation',
		array(
			'admin_cols' => array(
				'featured_image' => array(
					'title'          => 'Image',
					'featured_image' => 'abe-icon',
				),
			),
			'menu_icon'           => 'dashicons-businessman',
			'supports'            => $doc_post_supports,
			'capability_type'     => 'vocations',
			'map_meta_cap'        => true,
			'capabilities'        => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_vocations',
				'read_post'              => 'read_vocations',
				'delete_post'            => 'delete_vocations',
				// Primitive/meta caps.
				'create_posts'           => 'create_vocations_posts',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_vocations_posts',
				'edit_others_posts'      => 'manage_vocations_posts',
				'publish_posts'          => 'manage_vocations_posts',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_vocations_posts',
				'delete_private_posts'   => 'manage_vocations_posts',
				'delete_published_posts' => 'manage_vocations_posts',
				'delete_others_posts'    => 'manage_vocations_posts',
				'edit_private_posts'     => 'edit_vocations_posts',
				'edit_published_posts'   => 'edit_vocations_posts',
			),
		),
		array(
			'singular' => 'Vocations post',
			'plural'   => 'Vocations',
			'slug'     => 'vocations',
		)
	);

	register_extended_post_type( 'statistics_report',
		array(
			'admin_cols' => array(
				'statistics_type' => array(
					'taxonomy' => 'statistics_type',
				),
			),
			'enter_title_here'     => 'Enter report title here',
			'menu_icon'            => 'dashicons-chart-pie',
			'supports'             => array( 'title', 'author', 'archive' ),
			'capability_type'      => 'statistics_report',
			'map_meta_cap'         => true,
			'capabilities'         => array(
				// Meta caps (don't assign these to roles).
				'edit_post'              => 'edit_statistics_report',
				'read_post'              => 'read_statistics_report',
				'delete_post'            => 'delete_statistics_report',
				// Primitive/meta caps.
				'create_posts'           => 'create_statistics_reports',
				// Primitive caps used outside of map_meta_cap().
				'edit_posts'             => 'edit_statistics_reports',
				'edit_others_posts'      => 'manage_statistics_reports',
				'publish_posts'          => 'manage_statistics_reports',
				'read_private_posts'     => 'read',
				// Primitive caps used inside of map_meta_cap().
				'read'                   => 'read',
				'delete_posts'           => 'manage_statistics_reports',
				'delete_private_posts'   => 'manage_statistics_reports',
				'delete_published_posts' => 'manage_statistics_reports',
				'delete_others_posts'    => 'manage_statistics_reports',
				'edit_private_posts'     => 'edit_statistics_reports',
				'edit_published_posts'   => 'edit_statistics_reports',
			),
		)
	);
	// Add required capabilities to the administrator role.
	$role = get_role( 'administrator' );

	if ( ! is_null( $role ) ) {

		// Create new posts.
		$role->add_cap( 'create_parishes' );
		$role->add_cap( 'create_schools' );
		$role->add_cap( 'create_departments' );
		$role->add_cap( 'create_archive_posts' );
		$role->add_cap( 'create_bishop_posts' );
		$role->add_cap( 'create_deacon_posts' );
		$role->add_cap( 'create_development_posts' );
		$role->add_cap( 'create_education_posts' );
		$role->add_cap( 'create_finance_posts' );
		$role->add_cap( 'create_hisp_min_posts' );
		$role->add_cap( 'create_housing_posts' );
		$role->add_cap( 'create_hr_posts' );
		$role->add_cap( 'create_it_posts' );
		$role->add_cap( 'create_liturgy_posts' );
		$role->add_cap( 'create_macs_posts' );
		$role->add_cap( 'create_multicultural_posts' );
		$role->add_cap( 'create_planning_posts' );
		$role->add_cap( 'create_properties_posts' );
		$role->add_cap( 'create_tribunal_posts' );
		$role->add_cap( 'create_vocations_posts' );
		$role->add_cap( 'create_statistics_reports' );

		// Delete/publish existing posts.
		$role->add_cap( 'manage_parishes' );
		$role->add_cap( 'manage_schools' );
		$role->add_cap( 'manage_departments' );
		$role->add_cap( 'manage_archive_posts' );
		$role->add_cap( 'manage_bishop_posts' );
		$role->add_cap( 'manage_deacon_posts' );
		$role->add_cap( 'manage_development_posts' );
		$role->add_cap( 'manage_education_posts' );
		$role->add_cap( 'manage_finance_posts' );
		$role->add_cap( 'manage_hisp_min_posts' );
		$role->add_cap( 'manage_housing_posts' );
		$role->add_cap( 'manage_hr_posts' );
		$role->add_cap( 'manage_it_posts' );
		$role->add_cap( 'manage_liturgy_posts' );
		$role->add_cap( 'manage_macs_posts' );
		$role->add_cap( 'manage_multicultural_posts' );
		$role->add_cap( 'manage_planning_posts' );
		$role->add_cap( 'manage_properties_posts' );
		$role->add_cap( 'manage_tribunal_posts' );
		$role->add_cap( 'manage_vocations_posts' );
		$role->add_cap( 'manage_statistics_reports' );

		// Edit existing posts.
		$role->add_cap( 'edit_parishes' );
		$role->add_cap( 'edit_schools' );
		$role->add_cap( 'edit_departments' );
		$role->add_cap( 'edit_archive_posts' );
		$role->add_cap( 'edit_bishop_posts' );
		$role->add_cap( 'edit_deacon_posts' );
		$role->add_cap( 'edit_development_posts' );
		$role->add_cap( 'edit_education_posts' );
		$role->add_cap( 'edit_finance_posts' );
		$role->add_cap( 'edit_hisp_min_posts' );
		$role->add_cap( 'edit_housing_posts' );
		$role->add_cap( 'edit_hr_posts' );
		$role->add_cap( 'edit_it_posts' );
		$role->add_cap( 'edit_liturgy_posts' );
		$role->add_cap( 'edit_macs_posts' );
		$role->add_cap( 'edit_multicultural_posts' );
		$role->add_cap( 'edit_planning_posts' );
		$role->add_cap( 'edit_properties_posts' );
		$role->add_cap( 'edit_tribunal_posts' );
		$role->add_cap( 'edit_vocations_posts' );
		$role->add_cap( 'edit_statistics_reports' );
	}

}
