<?php
/**
 * Taxonomies.
 *
 * @package  RCDOC
 */

add_action( 'init', 'rcdoc_attachment_taxonomies' );


	// Register Custom Taxonomy
function rcdoc_attachment_taxonomies() {

	$cat_labels = array(
		'name'                       => _x( 'Categories', 'General Name', 'rcdoc' ),
		'singular_name'              => _x( 'Category', 'Singular Name', 'rcdoc' ),
		'menu_name'                  => __( 'Categories', 'rcdoc' ),
		'all_items'                  => __( 'All Categories', 'rcdoc' ),
		'parent_item'                => __( 'Parent Category', 'rcdoc' ),
		'parent_item_colon'          => __( 'Parent Category:', 'rcdoc' ),
		'new_item_name'              => __( 'New Category Name', 'rcdoc' ),
		'add_new_item'               => __( 'Add New Category', 'rcdoc' ),
		'edit_item'                  => __( 'Edit Category', 'rcdoc' ),
		'update_item'                => __( 'Update Category', 'rcdoc' ),
		'view_item'                  => __( 'View Category', 'rcdoc' ),
		'separate_items_with_commas' => __( 'Separate categories with commas', 'rcdoc' ),
		'add_or_remove_items'        => __( 'Add or remove categories', 'rcdoc' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'rcdoc' ),
		'popular_items'              => __( 'Popular Categories', 'rcdoc' ),
		'search_items'               => __( 'Search Categories', 'rcdoc' ),
		'not_found'                  => __( 'Not Found', 'rcdoc' ),
		'no_terms'                   => __( 'No Categories', 'rcdoc' ),
		'items_list'                 => __( 'Categories list', 'rcdoc' ),
		'items_list_navigation'      => __( 'Categories list navigation', 'rcdoc' ),
	);

	$tag_labels = array(
		'name'                       => _x( 'Tags', 'General Name', 'rcdoc' ),
		'singular_name'              => _x( 'Tag', 'Singular Name', 'rcdoc' ),
		'menu_name'                  => __( 'Tags', 'rcdoc' ),
		'all_items'                  => __( 'All Tags', 'rcdoc' ),
		'parent_item'                => __( 'Parent Tag', 'rcdoc' ),
		'parent_item_colon'          => __( 'Parent Tag:', 'rcdoc' ),
		'new_item_name'              => __( 'New Tag Name', 'rcdoc' ),
		'add_new_item'               => __( 'Add New Tag', 'rcdoc' ),
		'edit_item'                  => __( 'Edit Tag', 'rcdoc' ),
		'update_item'                => __( 'Update Tag', 'rcdoc' ),
		'view_item'                  => __( 'View Tag', 'rcdoc' ),
		'separate_items_with_commas' => __( 'Separate tags with commas', 'rcdoc' ),
		'add_or_remove_items'        => __( 'Add or remove tags', 'rcdoc' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'rcdoc' ),
		'popular_items'              => __( 'Popular Tags', 'rcdoc' ),
		'search_items'               => __( 'Search Tags', 'rcdoc' ),
		'not_found'                  => __( 'Not Found', 'rcdoc' ),
		'no_terms'                   => __( 'No Tags', 'rcdoc' ),
		'items_list'                 => __( 'Tags list', 'rcdoc' ),
		'items_list_navigation'      => __( 'Tags list navigation', 'rcdoc' ),
	);

	$capabilities = array(
		'manage_terms'               => 'upload_files',
		'edit_terms'                 => 'upload_files',
		'delete_terms'               => 'upload_files',
		'assign_terms'               => 'upload_files',
	);

	$cat_args = array(
		'labels'                     => $cat_labels,
		'hierarchical'               => true,
		'public'                     => false,
		'show_ui'                    => true,
		'show_in_menu'				 => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => false,
		'show_tagcloud'              => false,
		'query_var'                  => 'attachment_category',
		'capabilities'               => $capabilities,
	);

	$tag_args = array(
		'labels'                     => $tag_labels,
		'hierarchical'               => false,
		'public'                     => false,
		'show_ui'                    => true,
		'show_in_menu'				 => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => false,
		'show_tagcloud'              => false,
		'query_var'                  => 'attachment_tag',
		'capabilities'               => $capabilities,
	);

	register_taxonomy( 'attachment_category', 'attachment', $cat_args );
	register_taxonomy( 'attachment_tag', 'attachment', $tag_args );

}
