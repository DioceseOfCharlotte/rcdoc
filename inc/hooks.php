<?php

add_action( 'tha_entry_bottom',  'rcdoc_parish_footer' );
add_action( 'tha_header_after', 'logged_in_drawer' );
//add_action( 'tha_header_bottom', 'mdl_search_form' );
add_action( 'tha_header_before', 'header_right_widget' );
add_action( 'tha_content_before', 'rcdoc_facet_parish_prox' );
//add_action( 'tha_entry_content_after',  'rcdoc_news_widget' );
// add_action( 'tha_header_after',  'rcdoc_page_hero' );
// add_action( 'tha_content_before', 'rcdoc_page_before' );
add_action( 'tha_entry_bottom',  'rcdoc_news_row' );
add_action( 'tha_entry_bottom',  'rcdoc_give_row' );


function rcdoc_parish_footer() {
    if ( is_front_page() || 'parish' !== get_post_type() && 'school' !== get_post_type() && 'department' !== get_post_type() ) {
		return;
	}
	get_template_part('components/acf-parish-contact');
}




function logged_in_drawer() {
	hybrid_get_sidebar('drawer');
}




function mdl_search_form() {
?>
<form action="/" method="get" class="mdl-textfield mdl-js-textfield mdl-textfield--expandable u-ml-auto" action="<?php echo home_url( '/' ); ?>">
	<label class="mdl-button mdl-js-button mdl-button--icon u-m0" for="search"><i class="material-icons">search</i></label>
<div class="mdl-textfield__expandable-holder">
	<input class="mdl-textfield__input u-lh-2 search-field u-p0 u-border0 u-text-white u-bg-frost-2" type="text" name="s" id="search" value="<?php the_search_query(); ?>" />
</div>
</form>
<?php
}




function header_right_widget() {
	return hybrid_get_sidebar('header-right');
}




function rcdoc_facet_parish_prox() {
    if ( is_post_type_archive('parish') ) {
		echo '<div class="u-1/1 u-br u-px3 u-pb0 u-mb1 u-mx1 u-pt3 u-flex u-flex-wrap u-flex-justify u-bg-frost-4 mdl-shadow--2dp">';
		echo facetwp_display( 'facet', 'parish_proximity' );
		echo '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="FWP.reset()">Reset</button>';
		echo '<div class="u-1/1 u-text-center">' .facetwp_display( 'facet', 'title_alpha' ). '</div>';
		echo '</div>';
    }

}


function rcdoc_give_row() {
    if ( is_front_page() ) {
		get_template_part('components/part', 'give');
    }
}

function rcdoc_news_row() {
    if ( is_front_page() ) {
		get_template_part('components/part', 'news');
    }
}

function rcdoc_page_hero() {
    wds_page_builder_area( 'hero' );
}

function rcdoc_page_before() {
    wds_page_builder_area( 'before_content' );
}

function rcdoc_page_after() {
    wds_page_builder_area( 'after_content' );
}
