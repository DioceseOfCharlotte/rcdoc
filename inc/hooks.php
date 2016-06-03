<?php
/**
 * Hooks.
 *
 * @package  RCDOC
 */

add_action( 'tha_header_after', 'headspace' );
add_action( 'tha_header_after', 'doc_article_hero' );
//add_action( 'tha_footer_after', 'doc_content_mask' );
add_action( 'tha_content_bottom', 'doc_dept_child_posts' );
add_action( 'tha_content_before', 'doc_archive_desc' );

function doc_dept_child_posts() {

	if ( ! is_singular( abe_non_hierarchy_cpts() ) && ! is_singular( abe_hierarchy_cpts() ) ) {
		return; }

	$postid = get_the_ID();

	$args = array(
	'post_parent'            => $postid,
	'post_type'              => 'any',
	'order'                  => 'ASC',
	'orderby'                => 'menu_order',
	);

	$query = new WP_Query( $args );

	if ( $query->have_posts() ) { ?>
			<div class="o-cell o-grid u-m0 u-p0 u-1of1"> <?php
			while ( $query->have_posts() ) {
				$query->the_post();

				$posted_format = get_post_format() ? get_post_format() : 'content';

				tha_entry_before();

				hybrid_get_content_template();

				tha_entry_after();

			} ?>
		</div> <?php
	}

	wp_reset_postdata();

}

function doc_archive_desc() {
	if ( ! is_paged() && $desc = get_the_archive_description() ) :
	?>
		<article <?php hybrid_attr( 'archive-description' ); ?>>
			<?php echo $desc; ?>
		</article><!-- .archive-description -->
	<?php
	endif;
}

function headspace() {
	// if ( ! is_front_page() )
	// return;
	echo '<div id="head-space" class="head-space u-bg-1-glass u-text-1"></div>';
}

function doc_article_hero() {
	if ( is_front_page() ) {
		return; }

	echo '<div id="article-hero" class="article-hero u-1of1 u-bg-center u-bg-no-repeat u-bg-cover u-tinted-image u-bg-fixed u-abs u-left0 u-right0"></div>';
}

function doc_content_mask() {
	echo '<div id="content-mask" class="u-bg-mask u-fix u-top0 u-left0 u-height100"></div>';
}









// function doc_alias_view_staff() {
// global $cptarchives;
// if ( $GLOBALS['cptarchives'] ) {
// $id = $cptarchives->get_archive_meta( 'doc_alias_select', true );
// echo do_shortcode( '[gravityview id="10028" search_field="21" search_value="' . $id .'"]' );
// }
// }

function doc_view_staff() {
	if ( is_front_page() || ! is_singular( 'department' ) ) {
		return;
	}
	$id = get_the_ID();
	if ( is_single( $id ) ) {
		echo do_shortcode( '[gravityview id="10028" search_field="21" search_value="' . $id .'"]' );
	}
}


// add_action( 'tha_entry_bottom', 'doc_view_staff' );
// add_action( 'tha_content_bottom', 'doc_alias_view_staff' );
