<?php
/**
 * Functions and definitions.
 *
 * @package rcdoc
 */
use Mexitek\PHPColors\Color;
/**
 * Load required theme files.
 */
require_once get_theme_file_path( 'inc/config.php' );
require_once get_theme_file_path( 'inc/compatibility.php' );
require_once get_theme_file_path( 'inc/hooks.php' );
require_once get_theme_file_path( 'inc/ext/cpt-archive.php' );
require_once get_theme_file_path( 'inc/ext/gravity-forms.php' );
require_once get_theme_file_path( 'inc/ext/gravity-view.php' );
require_once get_theme_file_path( 'inc/ext/gf-email-domain.php' );
require_once get_theme_file_path( 'inc/ext/facetwp.php' );
require_once get_theme_file_path( 'inc/shortcodes.php' );
require_once get_theme_file_path( 'inc/shorts-ui.php' );
require_once get_theme_file_path( 'inc/metaboxes.php' );
add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'widgets_init', 'doc_widgets_init' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function rcdoc_setup() {

	//add_theme_support( 'arch-builder' );

	add_theme_support( 'cleaner-gallery' );

	add_theme_support( 'custom-background',	array( 'default-color' => 'e3e3db' ) );

	add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
	add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );
}

/**
 * Register widget area.
 */
function doc_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Employee Sidebar', 'doc' ),
		'id'            => 'employee-sidebar',
		'description'   => esc_html__( 'Add widgets here.', 'doc' ),
		'before_widget' => '<section id="%1$s" class="widget u-mb2 u-bg-frost-1 u-br %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title u-p05 u-m05 u-br u-shadow1 u-text-display u-bg-white">',
		'after_title'   => '</h3>',
	) );
}

/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {
	// Scripts.
	wp_enqueue_script( 'main-script', get_theme_file_uri( 'js/' . get_child_asset_rev( 'main.js' ) ), false, false, true );
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
 * Return style for using in html.
 *
 * @param  [type] $post_id [description]
 * @param  string $alpha   [description]
 * @return [type]          [description]
 */
function doc_post_color_style( $post_id, $alpha = '1' ) {
	$style = '';
	$style .= 'background-color:';
	$style .= doc_post_color_rgb( $post_id, $alpha );
	$style .= ';color:';
	$style .= doc_post_color_text( $post_id );
	$style .= ';';
	return $style;
}

/**
 * [doc_post_color_hex description]
 *
 * @param  [type] $post_id [description]
 * @return [type]          [description]
 */
function doc_post_color_hex( $post_id ) {
	$post_id = get_the_ID();
	$post_accent = get_post_meta( $post_id, 'arch_primary_color', true );
	$hex_color = $post_accent ? trim( $post_accent, '#' ) : get_theme_mod( 'primary_color', '' );
	return "#{$hex_color}";
}

/**
 * [doc_post_color_rgb description]
 *
 * @param  [type] $post_id [description]
 * @param  [type] $alpha   [description]
 * @return [type]          [description]
 */
function doc_post_color_rgb( $post_id, $alpha ) {
	$doc_hex = doc_post_color_hex( $post_id );
	$doc_rgb = implode( ',', hybrid_hex_to_rgb( $doc_hex ) );
	return 'rgba(' . $doc_rgb . ',' . $alpha . ')';
}

/**
 * [doc_post_color_text description]
 *
 * @param  [type] $post_id [description]
 * @return [type]          [description]
 */
function doc_post_color_text( $post_id ) {
	$post_accent = new Color( doc_post_color_hex( $post_id ) );
	$text_color = $post_accent->isDark() ? 'fff':'333';
	return "#{$text_color}";
}

function doc_post_color_comp( $post_id, $alpha ) {
	$post_accent = new Color( doc_post_color_hex( $post_id ) );
	$comp_color = $post_accent->isDark() ? $post_accent->darken( 15 ) :$post_accent->lighten( 20 );

	$comp_rgb = implode( ',', hybrid_hex_to_rgb( $comp_color ) );
	return 'rgba(' . $comp_rgb . ',' . $alpha . ')';
}
