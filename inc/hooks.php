<?php
/**
 * Hooks.
 *
 * @package  RCDOC
 */

add_action( 'tha_header_after', 'doc_article_hero' );
//add_action( 'tha_content_after', 'doc_alias_view_staff' );

function doc_article_hero() {
	if ( is_front_page() ) {
		return; }

	echo '<div id="article-hero" class="article-hero u-1of1 u-bg-center u-bg-no-repeat u-bg-cover u-tinted-image u-bg-fixed u-abs u-left0 u-right0"></div>';
}

function doc_alias_view_staff() {
	global $cptarchives;

	if ( $GLOBALS['cptarchives'] ) {
		$id = $cptarchives->get_archive_meta( 'doc_alias_select', true );
		if ( $id ) { ?>
		<div class="u-1of1 u-mb3 u-bg-tint-1 u-px1 u-br">
			<?php echo do_shortcode( '[gravityview id="10028" search_field="21" search_value="' . $id . '"]' ); ?>
		</div><?php
		}
	}
}
