<?php

//add_filter('pre_get_posts', 'query_post_type');
//add_action( 'wp_footer', 'mdl_facet_refresh' );
//add_filter( 'facetwp_index_row', 'index_acf_google_map_address', 10, 2 );
add_action('init', 'meh_post_type_archive_supports', 5);



// Let custom post types use the categories

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





// function index_acf_google_map_address( $params, $class ) {
//     if ( 'parish_proximity' == $params['facet_name'] ) {
//         $location = $params['facet_value'];
//         $params['facet_value'] = $location['lat'];
//         $params['facet_display_value'] = $location['lng'];
//     }
//     return $params;
// }



function meh_post_type_archive_supports() {
	add_post_type_support( 'parish', 'archive' );
	add_post_type_support( 'school', 'archive' );
	add_post_type_support( 'department', 'archive' );

	add_post_type_support( 'archive_post', 'archive' );
	add_post_type_support( 'bishop', 'archive' );
	add_post_type_support( 'chancery', 'archive' );
	add_post_type_support( 'deacon', 'archive' );
	add_post_type_support( 'development', 'archive' );

	add_post_type_support( 'finance', 'archive' );
	add_post_type_support( 'hispanic_ministry', 'archive' );
	add_post_type_support( 'housing', 'archive' );
	add_post_type_support( 'info_tech', 'archive' );

	add_post_type_support( 'liturgy', 'archive' );
	add_post_type_support( 'multicultural', 'archive' );
	add_post_type_support( 'planning', 'archive' );
	add_post_type_support( 'property', 'archive' );

	add_post_type_support( 'tribunal', 'archive' );
	add_post_type_support( 'vocation', 'archive' );
}
