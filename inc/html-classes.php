<?php

add_filter( 'hybrid_attr_post',   'cpt_post' );
add_filter( 'hybrid_attr_entry-header',   'cpt_header', 20 );
add_filter( 'hybrid_attr_post',   'document_post' );

function cpt_post( $attr ) {

	$directory_posts = array( 'school','parish','department' );

	if ( is_post_type_archive( $directory_posts ) ) :
		$attr['class']   .= ' u-1of2-md';
	endif;
	if ( has_post_format( 'aside' ) && ! is_search() ) :
		$attr['class']   .= ' u-bg-1-light u-f-plus';
	endif;
	if ( has_post_format( 'quote' ) ) :
		$attr['class']   .= ' u-bg-2-light u-shadow--8dp';
	endif;
	return $attr;
}

function cpt_header( $attr ) {

	$directory_posts = array( 'school','parish','department' );

	if ( is_post_type_archive( $directory_posts ) ) :
		$attr['class']   .= ' u-bg-1-dark u-flex u-flex-row u-flex-nowrap u-flex-jb';
	endif;
	return $attr;
}


function document_post( $attr ) {

	if ( is_post_type_archive( 'document' ) ) :
		$attr['class']   .= ' u-1of3 u-p0';
	endif;
	return $attr;
}
