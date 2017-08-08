<?php

function doc_hide_related_posts( $options ) {
	$show_related = get_post_meta( get_the_ID(), 'doc_show_related', true );
    if ( ! $show_related ) {
        $options['enabled'] = false;
    }
    return $options;
}
add_filter( 'jetpack_relatedposts_filter_options', 'doc_hide_related_posts' );
