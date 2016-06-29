<?php
/**
 * For ompatiblity with third party code.
 *
 * @package  RCDOC
 */

add_post_type_support( 'sc_event', 'theme-layouts' );
add_action( 'login_enqueue_scripts', 'doc_login_logo' );
add_filter( 'login_headerurl', 'doc_login_logo_url' );
add_filter( 'login_headertitle', 'doc_login_logo_url_title' );
add_action( 'pre_get_posts', 'doc_custom_queries', 1 );


/**
 * Register taxonomies.
 *
 * @since  0.1.0
 * @access public
 * @param array $query Main Query.
 */
function doc_custom_queries( $query ) {
	if ( ! $query->is_main_query() || is_admin() )
		return;

	if ( is_tax( 'agency' ) ) {
		$post_type = $query->get( 'post_type' );
		$meta_query = $query->get( 'meta_query' );
		$post_type = doc_home_tiles();
		$meta_query[] = array(
			'key'       => 'doc_alias_checkbox',
			'value'     => 'on',
			'compare'   => 'NOT EXISTS',
		);
		$query->set( 'meta_query', $meta_query );
		$query->set( 'post_type', $post_type );
		$query->set( 'order', 'ASC' );
	  	$query->set( 'orderby', 'title' );

	} elseif ( is_post_type_archive( doc_place_cpts() ) ) {
			$query->set( 'order', 'ASC' );
			$query->set( 'post_parent', 0 );
			$query->set( 'orderby', 'name' );
	}
}



function doc_login_logo() {
	?>
	<style type="text/css">
		.login h1 a {
			background-image: url(<?php echo get_stylesheet_directory_uri(); ?>/images/login-shield.png);
			padding-bottom: 30px;
		}
	</style>
<?php }

function doc_login_logo_url() {
	return home_url();
}


function doc_login_logo_url_title() {
	return 'Diocese of Charlotte';
}
