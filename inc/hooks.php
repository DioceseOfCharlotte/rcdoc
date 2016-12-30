<?php
/**
 * Hooks.
 *
 * @package  RCDOC
 */

add_action( 'tha_header_after', 'doc_article_hero' );

function doc_article_hero() {
	if ( is_front_page() ) {
		return; }

	echo '<div id="article-hero" class="article-hero u-1of1 u-bg-center u-bg-no-repeat u-bg-cover u-tinted-image u-bg-fixed u-abs u-left0 u-right0"></div>';
}
