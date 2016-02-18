<?php

add_action( 'init', 'register_filetype_taxonomy' );
add_action( 'init', 'register_file_category_taxonomy' );
add_action( 'init', 'register_document_type_taxonomy' );


// Register Filetype Taxonomy
function register_filetype_taxonomy() {

	$labels = array(
		'name'                       => _x( 'Filetypes', 'Taxonomy General Name', 'rcdoc' ),
		'singular_name'              => _x( 'Filetype', 'Taxonomy Singular Name', 'rcdoc' ),
		'menu_name'                  => __( 'Filetype', 'rcdoc' ),
		'all_items'                  => __( 'All Filetypes', 'rcdoc' ),
		'parent_item'                => __( 'Parent Item', 'rcdoc' ),
		'parent_item_colon'          => __( 'Parent Item:', 'rcdoc' ),
		'new_item_name'              => __( 'New Item Name', 'rcdoc' ),
		'add_new_item'               => __( 'Add New Item', 'rcdoc' ),
		'edit_item'                  => __( 'Edit Item', 'rcdoc' ),
		'update_item'                => __( 'Update Item', 'rcdoc' ),
		'view_item'                  => __( 'View Item', 'rcdoc' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'rcdoc' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'rcdoc' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'rcdoc' ),
		'popular_items'              => __( 'Popular Items', 'rcdoc' ),
		'search_items'               => __( 'Search Items', 'rcdoc' ),
		'not_found'                  => __( 'Not Found', 'rcdoc' ),
		'no_terms'                   => __( 'No items', 'rcdoc' ),
		'items_list'                 => __( 'Items list', 'rcdoc' ),
		'items_list_navigation'      => __( 'Items list navigation', 'rcdoc' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => false,
		'public'                     => true,
		'show_ui'                    => false,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => false,
		'show_tagcloud'              => false,
	);
	register_taxonomy( 'filetype', array( 'document' ), $args );

}



// Register Custom Taxonomy
function register_file_category_taxonomy() {

	$labels = array(
		'name'                       => _x( 'Document Categories', 'Taxonomy General Name', 'rcdoc' ),
		'singular_name'              => _x( 'Doc Category', 'Taxonomy Singular Name', 'rcdoc' ),
		'menu_name'                  => __( 'Categories', 'rcdoc' ),
		'all_items'                  => __( 'All Categories', 'rcdoc' ),
		'parent_item'                => __( 'Parent Item', 'rcdoc' ),
		'parent_item_colon'          => __( 'Parent Item:', 'rcdoc' ),
		'new_item_name'              => __( 'New Item Name', 'rcdoc' ),
		'add_new_item'               => __( 'Add New Item', 'rcdoc' ),
		'edit_item'                  => __( 'Edit Item', 'rcdoc' ),
		'update_item'                => __( 'Update Item', 'rcdoc' ),
		'view_item'                  => __( 'View Item', 'rcdoc' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'rcdoc' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'rcdoc' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'rcdoc' ),
		'popular_items'              => __( 'Popular Items', 'rcdoc' ),
		'search_items'               => __( 'Search Items', 'rcdoc' ),
		'not_found'                  => __( 'Not Found', 'rcdoc' ),
		'no_terms'                   => __( 'No items', 'rcdoc' ),
		'items_list'                 => __( 'Items list', 'rcdoc' ),
		'items_list_navigation'      => __( 'Items list navigation', 'rcdoc' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => false,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => true,
		'show_tagcloud'              => true,
	);
	register_taxonomy( 'document_category', array( 'document' ), $args );

}


// Register Custom Taxonomy
function register_document_type_taxonomy() {

	$labels = array(
		'name'                       => _x( 'Document Types', 'Taxonomy General Name', 'rcdoc' ),
		'singular_name'              => _x( 'Document Type', 'Taxonomy Singular Name', 'rcdoc' ),
		'menu_name'                  => __( 'Types', 'rcdoc' ),
		'all_items'                  => __( 'All Document Types', 'rcdoc' ),
		'parent_item'                => __( 'Parent Item', 'rcdoc' ),
		'parent_item_colon'          => __( 'Parent Item:', 'rcdoc' ),
		'new_item_name'              => __( 'New Item Name', 'rcdoc' ),
		'add_new_item'               => __( 'Add New Item', 'rcdoc' ),
		'edit_item'                  => __( 'Edit Item', 'rcdoc' ),
		'update_item'                => __( 'Update Item', 'rcdoc' ),
		'view_item'                  => __( 'View Item', 'rcdoc' ),
		'separate_items_with_commas' => __( 'Separate items with commas', 'rcdoc' ),
		'add_or_remove_items'        => __( 'Add or remove items', 'rcdoc' ),
		'choose_from_most_used'      => __( 'Choose from the most used', 'rcdoc' ),
		'popular_items'              => __( 'Popular Items', 'rcdoc' ),
		'search_items'               => __( 'Search Items', 'rcdoc' ),
		'not_found'                  => __( 'Not Found', 'rcdoc' ),
		'no_terms'                   => __( 'No items', 'rcdoc' ),
		'items_list'                 => __( 'Items list', 'rcdoc' ),
		'items_list_navigation'      => __( 'Items list navigation', 'rcdoc' ),
	);
	$args = array(
		'labels'                     => $labels,
		'hierarchical'               => false,
		'public'                     => true,
		'show_ui'                    => true,
		'show_admin_column'          => true,
		'show_in_nav_menus'          => true,
		'show_tagcloud'              => true,
	);
	register_taxonomy( 'document_type', array( 'document' ), $args );

}
