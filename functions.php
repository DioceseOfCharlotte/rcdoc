<?php
/**
 * Functions and definitions.
 *
 * @package rcdoc
 */

/**
 * Load required theme files.
 */
// require get_stylesheet_directory() . '/inc/html-classes.php';
require get_stylesheet_directory() . '/inc/config.php';
require get_stylesheet_directory() . '/inc/post-types.php';
require get_stylesheet_directory() . '/inc/tax.php';
require get_stylesheet_directory() . '/inc/compatibility.php';
require get_stylesheet_directory() . '/inc/hooks.php';
require get_stylesheet_directory() . '/inc/ext/cpt-archive.php';
require get_stylesheet_directory() . '/inc/ext/wpdr.php';
require get_stylesheet_directory() . '/inc/custom-header.php';
require get_stylesheet_directory() . '/inc/custom-background.php';
require get_stylesheet_directory() . '/inc/ext/gravity.php';
require get_stylesheet_directory() . '/inc/ext/facetwp.php';
require get_stylesheet_directory() . '/inc/shortcodes.php';
require get_stylesheet_directory() . '/inc/shorts-ui.php';
require get_stylesheet_directory() . '/inc/metaboxes.php';
require get_stylesheet_directory() . '/inc/meta/bb-contact.php';
add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );
add_filter( 'script_loader_tag', 'abe_defer_scripts', 10, 3 );
add_filter( 'cleaner_gallery_defaults', 'meh_gallery_default_args' );
add_action( 'init', 'doc_arch_posts' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function rcdoc_setup() {

	add_theme_support( 'cleaner-gallery' );

	add_theme_support( 'custom-background',	array( 'default-color' => 'e3e3db' ) );

	register_nav_menus( array( 'logged-in' => esc_html__( 'Logged In', 'rcdoc' ) ) );

	add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
	add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );
	add_filter( 'abe_add_hierarchy_cpts', 'rcdoc_hierarchy_cpts' );
	add_filter( 'abe_add_non_hierarchy_cpts', 'rcdoc_non_hierarchy_cpts' );
	add_filter( 'arch_add_post_types', 'rcdoc_non_hierarchy_cpts' );
}

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

/**
 * Theme Colors.
 */
function rcdoc_primary_color( $hex ) {
	return $hex ? $hex : '#2980b9';
}
function rcdoc_secondary_color( $hex ) {
	return $hex ? $hex : '#16a085';
}

/**
 * Post Groups.
 */
function rcdoc_non_hierarchy_cpts() {
	$cpts = array( 'archive_post','bishop', 'chancery', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'macs', 'multicultural', 'planning', 'property', 'tribunal', 'vocation' );
	return $cpts;
}
function rcdoc_hierarchy_cpts() {
	$cpts = array(
		'page',
		'cpt_archive',
		'department',
		'parish',
		'school',
		);
	return $cpts;
}

/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {
	$suffix = hybrid_get_min_suffix();
	wp_enqueue_style( 'oldie_child', trailingslashit( get_stylesheet_directory_uri() )."css/oldie{$suffix}.css", array( 'hybrid-parent', 'hybrid-style', 'oldie' ) );
	wp_style_add_data( 'oldie_child', 'conditional', 'IE' );

	wp_register_script(
		'arch-tabs',
		trailingslashit( get_stylesheet_directory_uri() ).'js/vendors/arch-tabs.js',
		false, false, true
	);

	wp_register_script(
		'flickity',
		trailingslashit( get_stylesheet_directory_uri() ).'js/vendors/flickity.pkgd.min.js',
		false, false, true
	);

	wp_enqueue_script(
		'main_scripts',
		trailingslashit( get_stylesheet_directory_uri() ).'js/main.min.js',
		false, false, true
	);
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
		'lory',
		'arch-tabs',
		'object_fit_js',
		'devicepx',
		'jquery-migrate',
		'gform_gravityforms',
		'gform_placeholder',
		'gravityview-fe-view',
	);

	if ( in_array( $handle, $defer_scripts ) ) {
		return '<script src="' . $src . '" async defer></script>' . "\n";
	}

	return $tag;
}
