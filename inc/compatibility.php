<?php
// Let custom post types use the categories
add_filter('pre_get_posts', 'query_post_type');
function query_post_type($query) {
	if ( ! is_admin() && $query->is_main_query() ) :
		if(is_category() || is_tag()) {
		    $post_type = get_query_var('post_type');
		    if($post_type)
		        $post_type = $post_type;
		    else
		        $post_type = array('post','multicultural','chancery','vocation'); // replace cpt to your custom post type
		    $query->set('post_type',$post_type);
		    return $query;
		}
endif;
}


// Reload MDL after facet refresh
function mdl_facet_refresh() {

?>
<script type="text/javascript">
(function($) {
    $(document).on('facetwp-loaded', function() {
        componentHandler.upgradeAllRegistered();
     });
})(jQuery);
</script>
<?php
}
add_action( 'wp_footer', 'mdl_facet_refresh' );


function rcdoc_facet_parish_prox() {

    if ( is_post_type_archive('parish') ) {
		echo '<div class="u-1/1 u-px3 u-pb0 u-pt3 u-flex u-flex-wrap u-flex-justify u-bg-frost-4 mdl-shadow--2dp">';
		echo facetwp_display( 'facet', 'parish_proximity' );
		echo '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="FWP.reset()">Reset</button>';
		echo '<div class="u-1/1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
    }

}
add_action( 'tha_content_before', 'rcdoc_facet_parish_prox' );

function index_acf_google_map_address( $params, $class ) {
    if ( 'parish_proximity' == $params['facet_name'] ) {
        $location = $params['facet_value'];
        $params['facet_value'] = $location['lat'];
        $params['facet_display_value'] = $location['lng'];
    }
    return $params;
}
add_filter( 'facetwp_index_row', 'index_acf_google_map_address', 10, 2 );
