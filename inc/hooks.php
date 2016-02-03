<?php

// add_action( 'tha_entry_bottom',  'rcdoc_contact_footer' );
add_action( 'tha_header_after', 'logged_in_drawer' );
add_action( 'tha_header_bottom', 'doc_search_form' );
add_action( 'tha_header_bottom', 'header_right_widget' );
add_action( 'tha_header_bottom', 'doc_nav_toggle' );
add_action( 'tha_header_after', 'headspace' );
add_action( 'tha_header_after', 'doc_primary_menu' );
add_action( 'tha_footer_after', 'doc_content_mask' );


function rcdoc_contact_footer() {
    if ( is_front_page() || is_singular() || 'parish' !== get_post_type() && 'school' !== get_post_type() && 'department' !== get_post_type() ) {
        return;
    }
    get_template_part('components/acf-parish-contact');
}

function logged_in_drawer() {
	if (is_user_logged_in() && is_active_sidebar('drawer')) {
    	hybrid_get_sidebar('drawer');
	}
}

function doc_search_form() {
    get_search_form();
}

function header_right_widget() {
    return hybrid_get_sidebar('header-right');
}

function headspace() {
    // if ( ! is_front_page() )
    //     return;

    echo '<div id="head-space" class="head-space"></div>';
}

function doc_primary_menu() {
    hybrid_get_menu('primary');
}

function doc_nav_toggle() {
    echo '<button class="menu-toggle btn btn-round u-mx1 u-z4 u-rel" data-active-toggle="#menu-primary" aria-controls="menu-primary-items"><i class="material-icons">&#xE5D2;</i></button>';
}

function doc_content_mask() {
    echo '<div id="content-mask" class="u-bg-mask u-fix u-1of1 u-top0 u-left0 u-invisible u-height100 u-z1"></div>';
}
