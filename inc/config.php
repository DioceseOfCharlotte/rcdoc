<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */

	add_action( 'init', 'doc_arch_posts' );
	add_filter( 'script_loader_tag', 'abe_defer_scripts', 10, 3 );
	add_filter( 'cleaner_gallery_defaults', 'meh_gallery_default_args' );

	/**
	* Enables Arch support.
	*/
function doc_arch_posts() {
	add_post_type_support( 'vocation', 'arch-post' );
	add_post_type_support( 'finance', 'arch-post' );
	add_post_type_support( 'archive_post', 'arch-post' );
	add_post_type_support( 'bishop', 'arch-post' );
	add_post_type_support( 'chancery', 'arch-post' );
	add_post_type_support( 'deacon', 'arch-post' );
	add_post_type_support( 'development', 'arch-post' );
	add_post_type_support( 'education', 'arch-post' );
	add_post_type_support( 'human_resources', 'arch-post' );
	add_post_type_support( 'hispanic_ministry', 'arch-post' );
	add_post_type_support( 'housing', 'arch-post' );
	add_post_type_support( 'info_tech', 'arch-post' );
	add_post_type_support( 'liturgy', 'arch-post' );
	add_post_type_support( 'macs', 'arch-post' );
	add_post_type_support( 'multicultural', 'arch-post' );
	add_post_type_support( 'planning', 'arch-post' );
	add_post_type_support( 'tribunal', 'arch-post' );
	add_post_type_support( 'property', 'arch-post' );
}

function meh_gallery_default_args( $defaults ) {
	$defaults['size']    = 'abe-hd';
	return $defaults;
}

function abe_defer_scripts( $tag, $handle, $src ) {

	// The handles of the enqueued scripts we want to defer
	$defer_scripts = array(
		'admin-bar',
		'flickity',
		'main_scripts',
		'abraham_js',
		'arch-toggle',
		'arch-tabs',
		'object_fit_js',
		'devicepx',
		'jquery-migrate',
		'gform_gravityforms',
		'gform_placeholder',
		'gravityview-fe-view',
		// 'lory',
	);

	if ( in_array( $handle, $defer_scripts ) ) {
		return '<script src="' . $src . '" async defer></script>' . "\n";
	}

	return $tag;
}
