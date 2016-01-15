<?php

add_filter( 'map_meta_cap', 'wpdr_map_meta_cap', 16, 4 );
add_action('pre_get_posts','doc_doc_archive');
add_action( 'save_post_document', 'wpdr_update_filetype' );
add_filter( 'document_permalink', 'wpdr_remove_dates_from_permalink_filter', 10, 2 );
add_filter( 'document_rewrite_rules', 'wpdr_remove_date_from_rewrite_rules' );


function wpdr_map_meta_cap( $caps, $cap, $user_id, $args ) {

    if ( 'read_post' === $cap ) {
        $post = get_post( $args[0] );

        if ( 'document' === $post->post_type && 'private' === $post->post_status && members_can_user_view_post( $user_id, $post->ID ) ) {
            $caps = array();
        }
    }

    return $caps;
}


function doc_doc_archive($query) {
  if ( !is_admin() && $query->is_main_query() ) {
    if ( is_post_type_archive( 'document' )) {
      $query->set('post_status', array( 'publish', 'inherit', 'private' ) );
    }
  }
}


// auto-add filetype term to wp-document-revisions docs
function wpdr_update_filetype($post_id) {

	$wpdr = Document_Revisions::$instance;

	$post       = get_post( $post_id );
	$attachment = get_post( $post->post_content );
	$extensions = array( $wpdr->get_extension( get_attached_file( $attachment->ID ) ) ) ;

	wp_set_object_terms( $post_id, $extensions, 'filetype', false );
}



/**
 * Strip date from permalink
 */
function wpdr_remove_dates_from_permalink_filter($link, $post) {
	$timestamp = strtotime( $post->post_date );
	return str_replace( '/' . date( 'Y', $timestamp ) . '/' . date( 'm', $timestamp ) . '/', '/', $link );
}

/**
 * Strip date from rewrite rules
 */
function wpdr_remove_date_from_rewrite_rules($rules) {
	global $wpdr;
	$slug     = $wpdr->document_slug();
    $rules = array();
    //documents/foo-revision-1.bar
    $rules[ $slug . '/([^.]+)-' . __( 'revision', 'wp-document-revisions' ) . '-([0-9]+)\.[A-Za-z0-9]{3,4}/?$'] = 'index.php?&document=$matches[1]&revision=$matches[2]';
    //documents/foo.bar/feed/
    $rules[ $slug . '/([^.]+)(\.[A-Za-z0-9]{3,4})?/feed/?$'] = 'index.php?document=$matches[1]&feed=feed';
    //documents/foo.bar
    $rules[ $slug . '/([^.]+)\.[A-Za-z0-9]{3,4}/?$'] = 'index.php?document=$matches[1]';
    // site.com/documents/ should list all documents that user has access to (private, public)
    $rules[ $slug . '/?$']                   = 'index.php?post_type=document';
    $rules[ $slug . '/page/?([0-9]{1,})/?$'] = 'index.php?post_type=document&paged=$matches[1]';

    return $rules;
}
