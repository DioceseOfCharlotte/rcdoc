<?php


add_filter( 'facetwp_facets', 'doc_register_doc_category_facets' );

function doc_register_doc_category_facets( $facets ) {
    $facets[] = array(
        'label' => 'Document Categories',
        'name' => 'document_categories',
        'type' => 'checkboxes',
        'source' => 'tax/document_category',
		'ghosts' => 'yes',
	    'preserve_ghosts' => 'yes',
        'operator' => 'or',
    );

    $facets[] = array(
        'label' => 'Document Types',
        'name' => 'document_types',
        'type' => 'checkboxes',
        'source' => 'tax/document_type',
		'ghosts' => 'yes',
	    'preserve_ghosts' => 'yes',
        'operator' => 'or',
    );

    $facets[] = array(
        'label' => 'Department Agency',
        'name' => 'department_agency',
        'type' => 'dropdown',
        'source' => 'tax/agency',
		'label_any' => 'All',
	    'orderby' => 'display_value',
        'hierarchical' => 'no',
    );

    $facets[] = array(
        'label' => 'School System',
        'name' => 'school_system',
        'type' => 'checkboxes',
        'source' => 'tax/school_system',
		'label_any' => 'All',
	    'orderby' => 'display_value',
        'hierarchical' => 'no',
        'ghosts' => 'yes',
	    'preserve_ghosts' => 'yes',
        'operator' => 'or',
    );

    $facets[] = array(
        'label' => 'Department Search',
        'name' => 'department_search',
        'type' => 'search',
        'search_engine' => '',
    );

    $facets[] = array(
        'label' => 'Title Alpha',
        'name' => 'title_alpha',
        'type' => 'alpha',
    );

    // $facets[] = array(
    //     'label' => 'Parish Proximity',
    //     'name' => 'parish_proximity',
    //     'type' => 'proximity',
    //     'source' => 'acf/doc_map',
	// 	'unit' => 'mi',
    // );

    return $facets;
}


// Display the facets
add_action( 'tha_content_before', 'doc_display_facets' );

function doc_display_facets() {
    if ( is_post_type_archive('document') ) {
		echo '<div class="u-1of3-md u-px3 u-pb0 u-br u-pt3 u-mb1 u-mx1 u-flex u-flex-wrap u-flex-justify-around u-bg-frost-4 mdl-shadow--3dp">';
        echo facetwp_display( 'facet', 'document_categories' );
        echo facetwp_display( 'facet', 'document_types' );
        echo '<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect u-m0" onclick="FWP.reset()"><i class="material-icons">&#xE5D5;</i></button>';
        echo '</div>';
    } elseif ( is_post_type_archive('parish') ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb1 u-mx1 u-flex u-flex-wrap u-flex-justify-around u-bg-frost-4 mdl-shadow--3dp">';
        echo facetwp_display( 'facet', 'parish_proximity' );
        echo '<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect u-m0" onclick="FWP.reset()"><i class="material-icons">&#xE5D5;</i></button>';
        echo '<div class="u-1of1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
        echo '</div>';
    } elseif ( is_post_type_archive('department') ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb1 u-mx1 u-flex u-flex-wrap u-flex-justify-around u-bg-frost-4 mdl-shadow--3dp">';
        echo facetwp_display( 'facet', 'department_agency' );
	    echo facetwp_display( 'facet', 'department_search' );
        echo '<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect u-m0" onclick="FWP.reset()"><i class="material-icons">&#xE5D5;</i></button>';
        echo '<div class="u-1of1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
    } elseif ( is_post_type_archive('school') ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb1 u-mx1 u-flex u-flex-wrap u-flex-justify-around u-bg-frost-4 mdl-shadow--3dp">';
		echo facetwp_display( 'facet', 'parish_proximity' );
	    echo facetwp_display( 'facet', 'school_system' );
        echo '<button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect u-m0" onclick="FWP.reset()"><i class="material-icons">&#xE5D5;</i></button>';
		echo '<div class="u-1of1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
    }

}






// Index attachments (post_status)
function wpdr_facetwp_indexer_query_args( $args ) {
        $args['post_status'] = array( 'publish', 'private' );
        return $args;
}

add_filter( 'facetwp_indexer_query_args', 'wpdr_facetwp_indexer_query_args' );
