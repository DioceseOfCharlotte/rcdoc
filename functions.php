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
require get_stylesheet_directory() . '/inc/compatibility.php';
require get_stylesheet_directory() . '/inc/hooks.php';
require get_stylesheet_directory() . '/inc/tax.php';
require get_stylesheet_directory() . '/inc/ext/cpt-archive.php';
//require get_stylesheet_directory() . '/inc/ext/wpdr.php';
require get_stylesheet_directory() . '/inc/custom-header.php';
require get_stylesheet_directory() . '/inc/custom-background.php';
require get_stylesheet_directory() . '/inc/ext/gravity-forms.php';
require get_stylesheet_directory() . '/inc/ext/gravity-view.php';
require get_stylesheet_directory() . '/inc/ext/gf-email-domain.php';
require get_stylesheet_directory() . '/inc/ext/facetwp.php';
require get_stylesheet_directory() . '/inc/shortcodes.php';
require get_stylesheet_directory() . '/inc/shorts-ui.php';
require get_stylesheet_directory() . '/inc/metaboxes.php';
add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );
add_action( 'wp_head', 'abe_display_font' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function rcdoc_setup() {

	add_theme_support( 'arch-builder' );

	add_theme_support( 'cleaner-gallery' );

	add_theme_support( 'custom-background',	array( 'default-color' => 'e3e3db' ) );

	add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
	add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );

	add_filter( 'abe_add_hierarchy_cpts', 'rcdoc_hierarchy_cpts' );
	add_filter( 'abe_add_non_hierarchy_cpts', 'rcdoc_non_hierarchy_cpts' );
	add_filter( 'arch_add_post_types', 'rcdoc_non_hierarchy_cpts' );
}

/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {

	$suffix = hybrid_get_min_suffix();

	//wp_enqueue_style( 'rcdoc_fonts', 'https://fonts.googleapis.com/css?family=Cormorant:500' );

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

	wp_enqueue_script(
		'font_loader',
		'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.24/webfontloader.js',
		false, false, true
	);
	wp_add_inline_script( 'font_loader', 'WebFont.load({google:{families: ["Cormorant:400,500,500i,600,600i,700","Roboto:400,400i,500,700"]}});' );
}

function abe_display_font() {
	$font_dir = trailingslashit( get_stylesheet_directory_uri() ) . 'fonts/';

	echo '<link rel="preload" href="' . $font_dir . 'cormorant-regular-webfont.woff2" as="font" type="font/woff2" crossorigin>'; ?>

	<style type="text/css">
		@font-face {
			font-family: 'Cormorant';
			font-style: normal;
			font-weight: 400;
			src: url('<?= $font_dir ?>cormorant-regular-webfont.woff2') format('woff2'),
			url('<?= $font_dir ?>cormorant-regular-webfont.woff') format('woff');
		}
		.u-text-display,.u-text-display>a,.u-dropcap::first-letter {
			font-family: Cormorant, serif;
			font-weight: normal;
		}
		.wf-active body {
			font-family: Roboto, sans-serif;
			font-weight: 400;
		}
		.wf-active .u-text-display,.wf-active .u-text-display>a {
			font-family: Cormorant, serif;
			font-weight: 600;
		}
		.wf-active .u-dropcap::first-letter {
			font-family: Cormorant, serif;
			font-weight: 700;
		}
	</style>
<?php }

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
	$cpts = array( 'arch','archive_post','bishop', 'chancery', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'macs', 'multicultural', 'planning', 'property', 'tribunal', 'vocation' );
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
