<?php

// add_action( 'after_setup_theme', 'rcdoc_html_classes' );
function rcdoc_html_classes() {

	attr_trumps( array(
		// 'body'                         => '',
		// 'site_container'               => 'u-flex u-flex-column',
		// 'layout'                    => '',
		// 'layout_wide'               => '',
		// 'grid'                      => '',
		// 'grid_1-wide'               => '',
		// 'grid_2c-r'                 => '',
		// 'grid_2c-l'                 => '',
		// SITE HEADER
		// 'header'                      => 'u-bg-1 u-flex u-flex-wrap u-flex-justify-around',
		// 'branding'                    => 'mdl-layout__header-row',
		// 'site_title'                  => 'mdl-layout-title color-inherit u-m0 u-h1 u-z4',
		// 'site_description'            => 'site-description u-h1 u-m0 u-text-3 hidden-sm',
		//
		// // CONTENT
		// 'content'                     => 'mdl-cell mdl-grid u-m0 u-p0 u-1of1',
		// 'content_with_sidebar'        => 'mdl-cell mdl-grid u-m0 u-p0 u-1of1 u-2of3-md',
		// 'content_archive'             => 'u-flex-justify-around u-flex-wrap facetwp-template u-flex',
		// // ENTRY
		// 'post'                        => 'mdl-cell u-mb2 u-1of1 mdl-card u-py4 u-px3 u-text-gray u-overflow-visible',
		// 'post_archive'                => 'mdl-cell mdl-card mdl-shadow--2dp',
		// 'post_featured'               => 'u-1of1',
		// 'post_wide'                   => 'u-bg-transparent u-m0 u-p0',
		//
		// 'page_header'                 => 'page-header u-1of1 u-text-center',
		//
		// 'entry_title'                 => 'mdl-card__title-text u-px2',
		// 'page_title'                  => 'u-display-2 u-m0 u-py3',
		// 'archive_description'         => 'archive-description u-max-width u-1of1 u-p3 u-mb1 u-mx-auto u-br u-bg-frost-4 mdl-shadow--3dp',
		//
		// 'entry_header'                => 'entry_header mdl-card__title u-pt0 u-px0',
		// 'entry_content'               => 'entry_content u-px2 u-pb2',
		// 'entry_content_wide'          => '',
		// 'entry_summary'               => 'entry_summary u-px2 u-pb2',
		// 'entry_footer'                => 'u-mt-auto mdl-card__actions mdl-card--border',
		// 'nav_single'                  => '',
		// 'nav_archive'                 => '',
		//
		// // ENTRY META
		// 'entry_author'                => '',
		// 'entry_published'             => '',
		// 'entry_terms'                 => '',
		// // NAVIGATION
		// 'menu_all'                    => 'mdl-navigation',
		// 'menu_primary'                => 'u-ml-auto',
		//
		// // SIDEBAR
		// 'sidebar_primary'             => 'mdl-cell mdl-grid u-m0 u-p0',
		// 'sidebar_footer'              => 'mdl-mega-footer--middle-section u-flex-md',
		// 'sidebar_horizontal'          => 'mdl-grid mdl-cell u-1of1',
		// 'sidebar_right'               => 'u-1of1 u-1of3-md',
		// 'sidebar_left'                => 'u-1of1 u-1of3-md',
		//
		// // COMMENTS
		// 'comments_area'               => '',
		//
		// // FOOTER
		// 'footer'                      => '',
		//
		// 'menu_item'                 => 'u-list-reset u-p0 u-color-inherit',
		// 'menu_link'                 => 'u-hover-frost-2 u-opacity1 mdl-navigation__link',
		// 'current_page_item'         => 'is-active',
		// 'current_page_parent'       => 'is-active',
		// 'current_page_ancestor'     => 'is-active',
		// 'current-menu-item'         => 'is-active',
		// 'menu-item-has-children'    => 'has-dropdown js-dropdown',
		// 'sub-menu'                  => 'dropdown animated slideInUp',
		//
		// 'gv_container'              => 'o-grid u-mx4-lg',
		// 'gv_entry'                  => 'o-cell mdl-card mdl-shadow--2dp',
	));

}


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
		$attr['class']   .= ' u-bg-1-dark u-flex u-flex-row u-flex-nowrap u-flex-justify-between';
	endif;
	return $attr;
}


function document_post( $attr ) {

	if ( is_post_type_archive( 'document' ) ) :
		$attr['class']   .= ' u-1of3 u-p0';
	endif;
	return $attr;
}
