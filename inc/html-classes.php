<?php

add_action( 'after_setup_theme', 'rcdoc_html_classes' );

function rcdoc_html_classes() {

	attr_trumps( array(
		'body'                    	=> 'u-bg-cover',
		'site_container'          	=> 'mdl-layout mdl-js-layout mdl-layout--fixed-header u-bg-frost-2',
		'site_container_loggedin' 	=> 'mdl-layout mdl-js-layout mdl-layout--fixed-header u-bg-frost-2',
		'layout'       		        => 'mdl-layout__content',
		'layout_wide'   	        => 'mdl-layout__content',
		'grid'              		=> 'u-p0 mdl-grid u-max-width',
		'grid_1-wide'              	=> 'u-p0 mdl-grid',
		'grid_2c-r'    				=> 'u-p0 mdl-grid u-max-width u-flex-rev',
		'grid_2c-l'    				=> 'u-p0 mdl-grid u-max-width',

		// SITE HEADER
		'header'                  	=> 'u-bg-1-glass u-static u-border-b mdl-layout__header mdl-layout__header--waterfall',
		'branding'                	=> 'mdl-layout__header-row',
		'site_title'              	=> 'mdl-layout-title color-inherit u-m0 u-h1 u-z4',
		'site_description'        	=> 'site-description u-h1 u-m0 u-text-3 hidden@sm',

		// CONTENT
		'content'                 	=> 'mdl-cell mdl-grid u-m0 u-p0 u-1/1',
		'content_with_sidebar'    	=> 'mdl-cell mdl-grid u-m0 u-p0 u-1/1 u-2/3@md',
		'content_archive'         	=> 'facetwp-template',
		// ENTRY
		'post'                    	=> 'mdl-cell u-mb2 u-1/1 mdl-card u-py4 u-px3 u-text-gray u-overflow-visible',
		'post_archive'            	=> 'mdl-cell mdl-cell--6-col-desktop mdl-card mdl-shadow--2dp u-overflow-visible',
        'post_featured'           	=> 'u-flexed-first u-1/1',
		'post_wide'					=> 'u-bg-transparent u-m0 u-p0',

		'page_header'             	=> 'page-header u-1/1 u-text-center',

		'entry_title'             	=> 'mdl-card__title-text',
		'page_title'    		  	=> 'u-display-2 u-m0 u-py3',
		'archive_description'     	=> 'u-1/1 u-px3 u-pb0 u-pt3 u-mb1 u-mx1 u-br u-flex u-flex-justify u-bg-frost-4 mdl-shadow--3dp',

		'entry_header'            	=> 'mdl-card__title u-pt0 u-px0',
		'entry_content'           	=> 'u-px2 u-pb2',
		'entry_content_wide'      	=> '',
		'entry_summary'           	=> 'u-px2 u-pb2',
		'entry_footer'            	=> 'u-mt-auto mdl-card__actions mdl-card--border',

		'nav_single'              	=> '',
		'nav_archive'             	=> '',

		// ENTRY META
		'entry_author'            	=> '',
		'entry_published'         	=> '',
		'entry_terms'             	=> '',

		// NAVIGATION
		'menu_all'                	=> 'mdl-navigation',
		'menu_primary'            	=> 'u-ml-auto',

		// SIDEBAR
		'sidebar_primary'         	=> 'mdl-cell mdl-grid u-m0 u-p0',
		'sidebar_footer'          	=> 'mdl-mega-footer--middle-section u-flex@md',
		'sidebar_horizontal'      	=> 'mdl-grid mdl-cell u-1/1',
		'sidebar_right'           	=> 'u-1/1 u-1/3@md',
		'sidebar_left'            	=> 'u-1/1 u-1/3@md',

		// COMMENTS
		'comments_area'           	=> '',

		// FOOTER
		'footer'                  	=> 'u-bg-1-glass-light u-border-t u-text-white u-color-inherit mdl-mega-footer',

		'menu_item'                 => 'u-list-reset u-p0 u-color-inherit',
		'menu_link'                 => 'u-hover-frost-2 u-opacity1 mdl-navigation__link',
		'current_page_item'         => 'is-active',
		'current_page_parent'       => 'is-active',
		'current_page_ancestor'     => 'is-active',
		'current-menu-item'         => 'is-active',
		'menu-item-has-children'    => 'has-dropdown js-dropdown',
		'sub-menu'                  => 'dropdown animated slideInUp',

		'gv_container'              => 'mdl-grid u-mx4@lg',
		'gv_entry'                  => 'mdl-cell mdl-card mdl-shadow--2dp',

	));
}
