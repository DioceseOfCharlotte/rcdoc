<?php
/**
 * rcdoc functions and definitions.
 *
 * @package rcdoc
 */

/**
 * Load required theme files.
 */
//require get_stylesheet_directory() . '/inc/html-classes.php';
//require get_stylesheet_directory() . '/inc/ext/tgmpa.php';
require get_stylesheet_directory() . '/inc/post-types.php';
require get_stylesheet_directory() . '/inc/tax.php';
require get_stylesheet_directory() . '/inc/compatibility.php';
require get_stylesheet_directory() . '/inc/hooks.php';
require get_stylesheet_directory() . '/inc/ext/cpt-archive.php';
require get_stylesheet_directory() . '/inc/ext/wpdr.php';
require get_stylesheet_directory() . '/inc/custom-header.php';
require get_stylesheet_directory() . '/inc/ext/gravity.php';
require get_stylesheet_directory() . '/inc/ext/facetwp.php';
require get_stylesheet_directory() . '/inc/shortcodes.php';
require get_stylesheet_directory() . '/inc/shorts-ui.php';
//require get_stylesheet_directory() . '/inc/metaboxes.php';

add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );
add_action( 'widgets_init', 'abraham_widgets' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function rcdoc_setup() {
    add_theme_support('soil-jquery-cdn');
    add_theme_support('soil-clean-up');
    // add_theme_support('soil-disable-asset-versioning');
    add_theme_support('soil-disable-trackbacks');
    // add_theme_support('soil-nice-search');
    add_theme_support('soil-google-analytics', 'UA-40566077-9');
    // add_theme_support('soil-js-to-footer');
	add_theme_support( 'cleaner-gallery' );
    add_theme_support(
		'custom-background',
		array(
			'default-color' => 'e3e3db',
		)
	);

    add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
    add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );
    add_filter( 'abe_add_hierarchy_cpts', 'rcdoc_hierarchy_cpts' );
    add_filter( 'abe_add_non_hierarchy_cpts', 'rcdoc_non_hierarchy_cpts' );
	add_filter( 'arch_add_post_types', 'rcdoc_non_hierarchy_cpts' );
}

/**
 * Theme Colors.
 */
function rcdoc_primary_color($hex) {
    return $hex ? $hex : '2980b9';
}
function rcdoc_secondary_color($hex) {
    return $hex ? $hex : '16a085';
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

/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {
    wp_enqueue_style( 'oldie_child', trailingslashit(get_stylesheet_directory_uri()).'css/oldie.css', array( 'oldie' ) );
	wp_style_add_data( 'oldie_child', 'conditional', 'IE' );

    wp_register_script(
        'arch-tabs',
        trailingslashit(get_stylesheet_directory_uri())."js/vendors/arch-tabs.js",
        false, false, true
    );

	wp_register_script(
        'flickity',
        trailingslashit(get_stylesheet_directory_uri())."js/vendors/flickity.pkgd.min.js",
        false, false, true
    );

    wp_register_script(
        'gsap_scripts',
        trailingslashit(get_stylesheet_directory_uri())."js/vendors/TweenMax.min.js",
        false, false, true
    );

    wp_register_script(
        'jq_scripts',
        trailingslashit(get_stylesheet_directory_uri())."js/jq-main.min.js",
        array( 'jquery' ), null, true
    );

    wp_enqueue_script(
        'main_scripts',
        trailingslashit(get_stylesheet_directory_uri())."js/main.min.js",
        false, false, true
    );
}

/**
 * Register sidebars.
 */
function abraham_widgets() {
    register_sidebar(array(
        'id'            => 'primary',
        'name'          => __( 'Primary', 'abraham' ),
        'before_title'  => '<div class="u-mtn2 u-mxn2"><h2 class="widget-title">',
        'after_title'   => '</h2></div>',
        'before_widget' => '<section class="widget o-cell u-shadow--2dp u-p2 u-list-reset">',
        'after_widget'  => '</section>',
    ));
    register_sidebar(array(
        'id'            => 'header-right',
        'name'          => __( 'Header Right', 'abraham' ),
        'before_title'  => '<h3 class="h2 widget-title mt0">',
        'after_title'   => '</h3>',
        'before_widget' => '<section ' .hybrid_get_attr('widgets', 'header-right').'>',
        'after_widget'  => '</section>',
    ));
    register_sidebar(array(
        'id'            => 'footer',
        'name'          => __( 'Footer', 'abraham' ),
        'before_widget' => '<section class="widget mdl-mega-footer__drop-down-section u-p2 u-flexed-grow u-list-reset"><div>',
        'before_title'  => '</div><input class="mdl-mega-footer__heading-checkbox u-1/1" type="checkbox" checked><h2 class="widget-title u-mt0 mdl-mega-footer--heading">',
        'after_title'   => '</h2><div class="mdl-mega-footer--link-list">',
        'after_widget'  => '</div></section>',
    ));
    register_sidebar(array(
        'id'            => 'drawer',
        'name'          => __( 'Drawer Widgets', 'abraham' ),
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
        'before_widget' => '<section class="widget u-p2 u-list-reset %2$s">',
        'after_widget'  => '</section>',
        'class'         => '',
    ));
}


add_filter( 'cleaner_gallery_defaults', 'meh_gallery_default_args' );
function meh_gallery_default_args($defaults) {
    $defaults['size']    = 'abe-hd';
    return $defaults;
}
