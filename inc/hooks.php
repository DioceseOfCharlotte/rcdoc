<?php

// add_action( 'tha_entry_bottom',  'rcdoc_contact_footer' );
add_action( 'tha_header_after', 'logged_in_drawer' );
//add_action( 'tha_header_bottom', 'doc_search_form' );
//add_action( 'tha_header_bottom', 'header_right_widget' );
add_action( 'tha_header_bottom', 'doc_nav_toggle' );
add_action( 'tha_header_after', 'headspace' );
add_action( 'tha_header_after', 'doc_primary_menu' );
add_action( 'tha_header_after', 'doc_article_hero' );
add_action( 'tha_footer_after', 'doc_content_mask' );
add_action( 'tha_content_bottom', 'doc_dept_child_posts' );
add_action( 'tha_content_before', 'doc_archive_desc' );


function doc_dept_child_posts() {

	if ( ! is_singular(abe_non_hierarchy_cpts()) )
		return;

$postid = get_the_ID();

$args = array (
	'post_parent'            => $postid,
	'post_type'              => abe_non_hierarchy_cpts(),
	'order'                  => 'ASC',
	'orderby'                => 'menu_order',
);

$query1 = new WP_Query( $args );

if ( $query1->have_posts() ) { ?>
	<div class="o-cell o-grid u-m0 u-p0 u-1of1"> <?php
	while ( $query1->have_posts() ) {
		$query1->the_post();

		$posted_format = get_post_format() ? get_post_format() : 'content';

		tha_entry_before();

		get_template_part( "content/{$posted_format}" );

		tha_entry_after();

	} ?>
	</div> <?php
} else {
	// no child posts
}

// Restore original Post Data
wp_reset_postdata();

}


function doc_archive_desc() {
	if ( ! is_paged() && $desc = get_the_archive_description() ) : // Check if we're on page/1. ?>

		<div <?php hybrid_attr( 'archive-description' ); ?>>
			<?php echo $desc; ?>
		</div>

	<?php endif;
}


function rcdoc_contact_footer() {
    if ( is_front_page() || is_singular() || 'parish' !== get_post_type() && 'school' !== get_post_type() && 'department' !== get_post_type() ) {
        return;
    }
    get_template_part('components/acf-parish-contact');
}

function logged_in_drawer() {
	if (is_user_logged_in() && is_active_sidebar('drawer')) {
    	hybrid_get_sidebar('drawer');
	}
}

function doc_search_form() {
    get_search_form();
}

function header_right_widget() {
    return hybrid_get_sidebar('header-right');
}

function headspace() {
    // if ( ! is_front_page() )
    //     return;

    echo '<div id="head-space" class="head-space u-bg-1-glass-dark u-text-1-dark"></div>';
}

function doc_primary_menu() {
    hybrid_get_menu('primary');
}

function doc_article_hero() {
	if (is_front_page())
		return;

    echo '<div id="article-hero" class="article-hero u-1of1 u-bg-center u-bg-no-repeat u-bg-cover u-tinted-image u-bg-fixed u-abs u-left0 u-right0"></div>';
}

function doc_nav_toggle() {
    echo '<button id="side-menu-toggle" class="menu-toggle btn btn-round u-ml-auto u-mr1 u-z4 u-rel" aria-controls="menu-primary-items"><i class="material-icons">&#xE5D2;</i></button>';
}

function doc_content_mask() {
    echo '<div id="content-mask" class="u-bg-mask u-fix u-top0 u-left0 u-height100"></div>';
}
