<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */

add_action( 'login_footer', 'doc_login_footer' );

function doc_login_footer() {
	echo '<div class=login-links><a href="/registration/">Create an account</a></div>';
}



/**
 * Featured Posts
 */


add_theme_support(
	'featured-content', array(
		'filter'     => 'rcdoc_get_featured_posts',
		'max_posts'  => 4,
		'post_types' => array( 'post', 'page', 'arch' ),
	)
);

function rcdoc_has_multiple_featured_posts() {
	$featured_posts = apply_filters( 'rcdoc_get_featured_posts', array() );
	if ( is_array( $featured_posts ) && 0 < count( $featured_posts ) ) {
		return true;
	}
	return false;
}

function rcdoc_get_featured_posts() {
	return apply_filters( 'rcdoc_get_featured_posts', false );
}
