<?php
/**
 * FacetWP.
 *
 * @package  RCDOC
 */

add_filter( 'facetwp_facets', 'doc_register_doc_category_facets' );
add_action( 'tha_content_before', 'doc_display_facets' );
add_filter( 'facetwp_indexer_query_args', 'wpdr_facetwp_indexer_query_args' );
add_filter( 'facetwp_pager_html', 'doc_facetwp_pager_html', 10, 2 );

/**
 * Get the facet archive posts for adding the class to hybrid_attr_content.
 */
function doc_get_facet_cpts() {
	return array(
		'document',
		'parish',
		'department',
		'school',
		'statistics_report',
	);
}

function doc_register_doc_category_facets( $facets ) {
	$facets[] = array(
		'label'        => 'Document Categories',
		'name'         => 'document_categories',
		'type'         => 'dropdown',
		'source'       => 'tax/document_category',
		'label_any'          => 'All Categories',
		'orderby'         => 'display_value',
		'hierarchical' => 'no',
	);

	$facets[] = array(
		'label'        => 'Document Types',
		'name'         => 'document_types',
		'type'         => 'checkboxes',
		'source'       => 'tax/document_type',
		'ghosts'             => 'yes',
		'preserve_ghosts' => 'yes',
		'operator'     => 'or',
	);

	$facets[] = array(
		'label'        => 'Department Agency',
		'name'         => 'department_agency',
		'type'         => 'dropdown',
		'source'       => 'tax/agency',
		'label_any'          => 'All Agencies',
		'orderby'         => 'display_value',
		'hierarchical' => 'no',
	);

	$facets[] = array(
		'label'        => 'School System',
		'name'         => 'school_system',
		'type'         => 'checkboxes',
		'source'       => 'tax/school_system',
		'label_any'          => 'All School Systems',
		'orderby'         => 'display_value',
		'hierarchical' => 'no',
		'ghosts'       => 'yes',
		'preserve_ghosts' => 'yes',
		'operator'     => 'or',
	);

	$facets[] = array(
		'label'         => 'Department Search',
		'name'          => 'department_search',
		'type'          => 'search',
		'search_engine' => '',
	);

	$facets[] = array(
		'label' => 'Title Alpha',
		'name'  => 'title_alpha',
		'type'  => 'alpha',
	);

	$facets[] = array(
		'label'        => 'Statistics Type',
		'name'         => 'statistics_type',
		'type'         => 'checkboxes',
		'source'       => 'tax/statistics_type',
		'label_any'          => 'All Reports',
		'orderby'         => 'display_value',
		'hierarchical' => 'no',
		'ghosts'       => 'yes',
		'preserve_ghosts' => 'yes',
		'operator'     => 'or',
	);

	$facets[] = array(
		'label'        => 'Statistics Date',
		'name'         => 'statistics_year',
		'type'         => 'dropdown',
		'source'       => 'cf/doc_stats_report_date',
		'label_any'          => 'All Dates',
		'orderby'         => 'display_value',
		'hierarchical' => 'no',
	);

	return $facets;
}

/**
 * Display the facets.
 *
 * @since  0.1.0
 * @access public
 */
function doc_display_facets() {
	if ( is_post_type_archive( 'document' ) ) {
		echo '<div class="u-1of3-md u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'department_search' );
		echo facetwp_display( 'facet', 'document_categories' );
		echo facetwp_display( 'facet', 'document_types' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'parish' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'parish_proximity' );
		echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '<div class="u-1of1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'department' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'department_agency' );
		echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '<div class="u-1of1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'school' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'parish_proximity' );
		echo facetwp_display( 'facet', 'school_system' );
		echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'statistics_report' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'statistics_year' );
		echo facetwp_display( 'facet', 'statistics_type' );
		echo '</div>';
	}
}

/**
 * Index WP Document Revisions.
 *
 * @since  0.1.0
 * @access public
 * @param array $args Post status Private.
 */
function wpdr_facetwp_indexer_query_args( $args ) {
	$args['post_status'] = array( 'publish', 'private' );
	return $args;
}

/**
 * Pager HTML for facets.
 *
 * @since  0.1.0
 * @access public
 * @param array $output The html.
 * @param array $params The params.
 */
function doc_facetwp_pager_html( $output, $params ) {
	$output   = '';
	$page     = $params['page'];
	$total_pages = $params['total_pages'];

	if ( 1 < $total_pages ) {

		$text_page      = __( 'Page', 'fwp' );
		$text_of        = __( 'of', 'fwp' );

		// "Page 5 of 150"
		// $output .= '<span class="facetwp-page u-br u-h5 u-p1r-label">' . "$text_page $page $text_of $total_pages</span>";
		// if ( 3 < $page ) {
		// $output .= '<a class="facetwp-page u-br u-h5 u-p1 btn first-page" data-page="1"><i class="material-icons">&#xE408;</i> Previous</a>';
		// }
		if ( $page > 1 ) {
			$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page - 1) . '"><i class="material-icons">&#xE408;</i>Previous</a>';
		}
		if ( 1 < ( $page - 10 ) ) {
			$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page - 10) . '">' . ($page - 10) . '</a>';
		}
		for ( $i = 2; $i > 0; $i-- ) {
			if ( 0 < ( $page - $i ) ) {
				$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page - $i) . '">' . ($page - $i) . '</a>';
			}
		}

		// Current page.
		$output .= '<a class="facetwp-page u-br u-h5 u-p1 u-bold btn btn1 active" data-page="' . $page . '">' . $page . '</a>';

		for ( $i = 1; $i <= 2; $i++ ) {
			if ( $total_pages >= ( $page + $i ) ) {
				$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page + $i) . '">' . ($page + $i) . '</a>';
			}
		}
		if ( $total_pages > ( $page + 10 ) ) {
			$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page + 10) . '">' . ($page + 10) . '</a>';
		}
		if ( $page < $total_pages && $total_pages > 1 ) {
			$output .= '<a class="facetwp-page u-br u-h5 u-p1 btn" data-page="' . ($page + 1) . '">Next<i class="material-icons">&#xE409;</i></a>';
		}
		// if ( $total_pages > ( $page + 2 ) ) {
		// $output .= '<a class="facetwp-page u-br u-h5 u-p1 last-page btn" data-page="' . $total_pages . '">Next <i class="material-icons">&#xE409;</i></a>';
		// }
	}

	return $output;
}
