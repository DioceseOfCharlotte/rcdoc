<?php

// add_action( 'tha_entry_bottom',  'rcdoc_contact_footer' );
add_action( 'tha_header_after', 'logged_in_drawer' );
add_action( 'tha_header_bottom', 'header_right_widget' );
add_action( 'tha_header_after', 'headspace' );


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

function header_right_widget() {
    return hybrid_get_sidebar('header-right');
}

function headspace() {
    echo '<div id="head-space" class="u-mb3"></div>';
}
