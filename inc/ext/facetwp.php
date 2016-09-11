<?php
/**
 * FacetWP.
 *
 * @package  RCDOC
 */

add_filter( 'facetwp_index_row', 'index_serialized_data', 10, 2 );
add_filter( 'facetwp_facets', 'doc_register_doc_category_facets' );
add_action( 'tha_content_before', 'doc_display_facets' );
//add_filter( 'facetwp_indexer_query_args', 'wpdr_facetwp_indexer_query_args' );
add_action( 'wp_head', 'fwp_load_more', 99 );
add_filter( 'facetwp_proximity_store_distance', '__return_true' );
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

function doc_has_facet() {
	return is_post_type_archive( doc_get_facet_cpts() );
}

function index_serialized_data( $params, $class ) {
	if ( 'grade_level' == $params['facet_name'] ) {
		$values = (array) $params['facet_value'];
		foreach ( $values as $val ) {
			$params['facet_value'] = $val;
			$params['facet_display_value'] = $val;
			$class->insert( $params );
		}
		return false; // skip default indexing
	}
	return $params;
}



function doc_register_doc_category_facets( $facets ) {

	$facets[] = array(
		'label'        => 'Department Agency',
		'name'         => 'department_agency',
		'type'         => 'dropdown',
		'source'       => 'tax/agency',
		'label_any'    => 'All Agencies',
		'orderby'      => 'display_value',
		'hierarchical' => 'no',
	);

	$facets[] = array(
		'label'        		=> 'School System',
		'name'         		=> 'school_system',
		'type'         		=> 'checkboxes',
		'source'       		=> 'tax/school_system',
		'label_any'    		=> 'All School Systems',
		'orderby'      		=> 'display_value',
		'hierarchical' 		=> 'no',
		'ghosts'       		=> 'yes',
		'preserve_ghosts' 	=> 'yes',
		'operator'     		=> 'or',
	);

	$facets[] = array(
		'label'        		=> 'School Grade Levels',
		'name'         		=> 'grade_level',
		'type'         		=> 'fselect',
		'source'       		=> 'cf/doc_grade_level',
		'label_any'    		=> 'All Grades',
		'orderby'      		=> 'display_value',
		'multiple' 			=> 'yes',
		'hierarchical' 		=> 'no',
		'operator'     		=> 'and',
		'count' 			=> '20',
	);

	$facets[] = array(
		'label'         => 'Department Search',
		'name'          => 'department_search',
		'type'          => 'search',
	);

	$facets[] = array(
		'label'		=> 'Title Alpha',
		'name'		=> 'title_alpha',
		'type' 		=> 'alpha',
		'source' 	=> 'post_title',
	);

	$facets[] = array(
		'label' 	=> 'Proximity Search',
	    'name' 		=> 'proximity_search',
	    'type' 		=> 'proximity',
	    'source' 	=> 'cf/geo_coordinates',
	    'unit' 		=> 'mi',
	);

	// $facets[] = array(
	// 	'label'        => 'Statistics Type',
	// 	'name'         => 'statistics_type',
	// 	'type'         => 'checkboxes',
	// 	'source'       => 'tax/statistics_type',
	// 	'label_any'          => 'All Reports',
	// 	'orderby'         => 'display_value',
	// 	'hierarchical' => 'no',
	// 	'ghosts'       => 'yes',
	// 	'preserve_ghosts' => 'yes',
	// 	'operator'     => 'or',
	// );
	//
	// $facets[] = array(
	// 	'label'        => 'Statistics Date',
	// 	'name'         => 'statistics_year',
	// 	'type'         => 'dropdown',
	// 	'source'       => 'cf/doc_stats_report_date',
	// 	'label_any'          => 'All Dates',
	// 	'orderby'         => 'display_value',
	// 	'hierarchical' => 'no',
	// );

	return $facets;
}

/**
 * Display the facets.
 *
 * @since  0.1.0
 * @access public
 */
function doc_display_facets() {

	if ( is_post_type_archive( 'parish' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'proximity_search' );
		echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '<div class="u-1of1 u-text-center">' . facetwp_display( 'facet', 'title_alpha' ) . '</div>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'department' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'department_agency' );
		echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
		echo '<div class="u-1of1 u-text-center">' . facetwp_display( 'facet', 'title_alpha' ) . '</div>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'school' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-text-color u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'proximity_search' );
		echo facetwp_display( 'facet', 'grade_level' );
		// echo facetwp_display( 'facet', 'school_system' );
		// echo facetwp_display( 'facet', 'department_search' );
		echo '<button class="btn btn-round u-bg-frost-4 u-m0 u-m0" onclick="FWP.reset()"><span class="icon-refresh"></span></button>';
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
// function wpdr_facetwp_indexer_query_args( $args ) {
// 	$args['post_status'] = array( 'publish', 'private' );
// 	return $args;
// }


function fwp_load_more() {
	if ( ! doc_has_facet() ) {
		return;
	}
?>
<script>
(function($) {
	$(function() {
		if ('object' != typeof FWP) {
			return;
		}

		wp.hooks.addFilter('facetwp/template_html', function(resp, params) {
			if (FWP.is_load_more) {
				FWP.is_load_more = false;
				$('.facetwp-template').append(params.html);
				return true;
			}
			return resp;
		});

		$(document).on('click', '.fwp-load-more', function() {
			$('.fwp-load-more').html('Loading...');
			FWP.is_load_more = true;
			FWP.paged = parseInt(FWP.settings.pager.page) + 1;
			FWP.soft_refresh = true;
			FWP.refresh();
		});

		$(document).on('facetwp-loaded', function() {
			if (FWP.settings.pager.page < FWP.settings.pager.total_pages) {
				if (! FWP.loaded && 1 > $('.fwp-load-more').length) {
					$('.facetwp-template').after('<button class="btn-hollow u-mb3 fwp-load-more">More results</button>');
				}
				else {
					$('.fwp-load-more').html('Load more').show();
				}
			}
			else {
				$('.fwp-load-more').hide();
			}
		});
	});
})(jQuery);
</script>
<?php
}
