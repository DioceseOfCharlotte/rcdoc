<?php

add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );
add_action( 'widgets_init', 'abraham_widgets' );

require get_stylesheet_directory() . '/inc/html-classes.php';
require get_stylesheet_directory() . '/inc/ext/tgmpa.php';
require get_stylesheet_directory() . '/inc/post-types.php';
require get_stylesheet_directory() . '/inc/taxonomies.php';
require get_stylesheet_directory() . '/inc/compatibility.php';
require get_stylesheet_directory() . '/inc/hooks.php';
require get_stylesheet_directory() . '/inc/ext/cpt-archive.php';
require get_stylesheet_directory() . '/inc/ext/wpdr.php';
require get_stylesheet_directory() . '/inc/ext/facetwp.php';
require get_stylesheet_directory() . '/inc/shortcodes.php'; // Shortcodes
require get_stylesheet_directory() . '/inc/shorts-ui.php';  // Shortcake interface


function rcdoc_setup() {

    add_theme_support('soil-jquery-cdn');
    add_theme_support('soil-clean-up');
    //add_theme_support('soil-disable-asset-versioning');
    add_theme_support('soil-disable-trackbacks');
    //add_theme_support('soil-nice-search');
    add_theme_support('soil-google-analytics', 'UA-40566077-9');
    add_theme_support('soil-js-to-footer');


    add_theme_support(
        'custom-background',
        array(
            'default-color' => 'E9EBE7',
            'default-image' => '',
        )
    );

    add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
    add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );
    add_filter( 'theme_mod_accent_color', 'rcdoc_accent_color' );
    add_filter( 'abe_add_hierarchy_cpts', 'rcdoc_hierarchy_cpts' );
    add_filter( 'abe_add_non_hierarchy_cpts', 'rcdoc_non_hierarchy_cpts' );

}



/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {

    wp_enqueue_script(
        'main_scripts',
        trailingslashit(get_stylesheet_directory_uri())."assets/js/main.min.js",
        false, false, true
    );

    wp_enqueue_script(
        'jq_scripts',
        trailingslashit(get_stylesheet_directory_uri())."assets/js/jq-main.min.js",
        array( 'jquery' ), null, true
    );
}



//add_action( 'wp_enqueue_scripts', 'meh_remove_scripts', 20 );
function meh_remove_scripts() {
    wp_dequeue_style( 'parent' );
}

function abraham_widgets() {
    register_sidebar(array(
        'id'            => 'primary',
        'name'          => __( 'Primary', 'abraham' ),
        'before_title'  => '<div class="mdl-card__title u-mtn2 u-mxn2"><h2 class="mdl-card__title-text widget-title">',
        'after_title'   => '</h2></div>',
        'before_widget' => '<section class="mdl-card o-cell mdl-shadow--2dp u-p2 u-list-reset">',
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
        'before_widget' => '<section class="mdl-mega-footer__drop-down-section u-p2 u-flexed-grow"><div>',
        'before_title'  => '</div><input class="mdl-mega-footer__heading-checkbox u-1/1" type="checkbox" checked><h2 class="widget-title u-mt0 mdl-mega-footer--heading">',
        'after_title'   => '</h2><div class="mdl-mega-footer--link-list">',
        'after_widget'  => '</div></section>',
    ));

    register_sidebar(array(
        'id'            => 'drawer',
        'name'          => __( 'Drawer Widgets', 'abraham' ),
        'before_title'  => '<h3 class="mdl-card__title-text widget-title">',
        'after_title'   => '</h3>',
        'before_widget' => '<section class="u-p2 u-list-reset %2$s">',
        'after_widget'  => '</section>',
        'class'         => '',
    ));
}



function rcdoc_primary_color($hex) {
    return $hex ? $hex : '3F51B5';
}
function rcdoc_secondary_color($hex) {
    return $hex ? $hex : '009688';
}
function rcdoc_accent_color($hex) {
    return $hex ? $hex : 'C62828';
}


function rcdoc_non_hierarchy_cpts($cpts) {
	$cpts = array( 'post', 'bishop', 'chancery', 'deacon', 'development', 'finance', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'multicultural', 'planning', 'property', 'tribunal', 'vocation' );
    return $cpts;
}


function rcdoc_hierarchy_cpts($cpts) {
	$cpts = array(
        'page',
        'cpt_archive',
        'department',
        'parish',
        'school'
        );
    return $cpts;
}
