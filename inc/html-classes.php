<?php

add_filter( 'post_class',   'doc_post_class' );

function doc_post_class( $classes ) {

	$directory_posts = array( 'school','parish','department' );

	if ( is_post_type_archive( $directory_posts ) ) {
				$classes[] = 'u-1of2-md';
	}
		return $classes;
}
