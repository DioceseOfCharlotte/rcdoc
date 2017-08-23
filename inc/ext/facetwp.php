<?php
/**
 * FacetWP.
 *
 * @package  RCDOC
 */

add_filter( 'facetwp_index_row', 'doc_index_serialized_data', 10, 2 );
add_action( 'wp_head', 'fwp_load_more', 99 );
add_filter( 'facetwp_proximity_store_distance', '__return_true' );
add_shortcode( 'facet_refresh', 'doc_facet_refresh' );


// Refresh Button Shortcode
function doc_facet_refresh() {
	return '<button class="btn btn-round facet-reset u-bg-frost-4 u-h3 u-m0 u-m0" onclick="FWP.reset()"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>';
}


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

function doc_index_serialized_data( $params, $class ) {
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

/**
 * Display the facets.
 *
 * @since  0.1.0
 * @access public
 */
function doc_display_facets() {

	if ( is_post_type_archive( 'department' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'department_agency' );
		echo facetwp_display( 'facet', 'department_search' );
		echo doc_facet_refresh();
		echo '<div class="u-1of1 u-text-center">' . facetwp_display( 'facet', 'title_alpha' ) . '</div>';
		echo '</div>';
	} elseif ( is_post_type_archive( 'school' ) ) {
		echo '<div class="u-1of1 u-px3 u-pb0 u-br u-pt3 u-mb3 u-flex u-flex-wrap u-flex-ja u-bg-2 u-shadow3 u-max-center">';
		echo facetwp_display( 'facet', 'proximity_search' );
		echo facetwp_display( 'facet', 'grade_level' );
		// echo facetwp_display( 'facet', 'school_system' );
		// echo facetwp_display( 'facet', 'department_search' );
		echo doc_facet_refresh();
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
					$('.facetwp-template').after('<button class="btn u-bg-2 u-mb3 fwp-load-more">More results</button>');
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
