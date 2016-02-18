<?php

add_post_type_support('sc_event', 'theme-layouts');
add_action( 'login_enqueue_scripts', 'doc_login_logo' );
add_filter( 'login_headerurl', 'doc_login_logo_url' );
add_filter( 'login_headertitle', 'doc_login_logo_url_title' );
add_action( 'pre_get_posts', 'doc_post_order', 1 );


function doc_post_order( $query ) {
    if ( is_admin() || ! $query->is_main_query() )
        return;
    if ( is_post_type_archive( 'department' ) || is_post_type_archive( 'parish' ) || is_post_type_archive( 'school' ) ) {
        $query->set( 'order', 'ASC' );
	  	$query->set('orderby', 'name');
	  	$query->set('post_parent', 0);
        return;
    } elseif ( is_post_type_archive() ) {
	  	$query->set( 'order', 'ASC' );
	  	$query->set('orderby', 'menu_order');
		$query->set('post_parent', 0);
	}
}



function doc_login_logo() { ?>
    <style type="text/css">
        .login h1 a {
            background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/images/login-shield.png);
            padding-bottom: 30px;
        }
    </style>
<?php }

function doc_login_logo_url() {
    return home_url();
}


function doc_login_logo_url_title() {
    return 'Diocese of Charlotte';
}
