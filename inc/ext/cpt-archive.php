<?php
/**
 * CPT Archives.
 *
 * @package  RCDOC
 */

add_filter( 'hybrid_get_theme_layout', 'abe_landing_layout' );
add_filter( 'register_post_type_args', 'cpt_archive_labels', 10, 2 );

function abe_landing_layout( $layout ) {

	$archive_layout = '';
	if ( is_post_type_archive() ) {
		global $cptarchives;

		$archive_layout = hybrid_get_post_layout( $cptarchives->get_archive_id() );
	}
	return $archive_layout && 'default' !== $archive_layout ? $archive_layout : $layout;
}



function cpt_archive_labels( $args, $type ) {

	$cpt_archive_labels = array(
		'name'               => _x( 'Landing Pages', 'post type general name', 'cpt-archives' ),
		'singular_name'      => _x( 'Landing Page', 'post type singular name', 'cpt-archives' ),
		'menu_name'          => _x( 'Landing Pages', 'admin menu', 'cpt-archives' ),
		'name_admin_bar'     => _x( 'Landing Page', 'add new on admin bar', 'cpt-archives' ),
		'add_new'            => _x( 'Add New', 'cpt_archive', 'cpt-archives' ),
		'add_new_item'       => __( 'Add New Landing Page', 'cpt-archives' ),
		'new_item'           => __( 'New Landing Page', 'cpt-archives' ),
		'edit_item'          => __( 'Edit Landing Page', 'cpt-archives' ),
		'view_item'          => __( 'View Landing Page', 'cpt-archives' ),
		'all_items'          => __( 'All Landing Pages', 'cpt-archives' ),
		'search_items'       => __( 'Search Landing Pages', 'cpt-archives' ),
		'parent_item_colon'  => __( 'Parent Landing Pages:', 'cpt-archives' ),
		'not_found'          => __( 'No landing pages found.', 'cpt-archives' ),
		'not_found_in_trash' => __( 'No landing pages found in Trash.', 'cpt-archives' ),
	);

	if ( 'cpt_archive' === $type ) {
		$args['labels']   = $cpt_archive_labels;
		$args['supports'] = array(
			'author',
			'thumbnail',
			'theme-layouts',
			'custom-header',
		);
		$args['taxonomies']   = array( 'agency' );
	}

	return $args;
}
