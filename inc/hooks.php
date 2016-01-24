<?php

add_action( 'tha_entry_bottom',  'rcdoc_contact_footer' );
add_action( 'tha_header_after', 'logged_in_drawer' );
//add_action( 'tha_header_bottom', 'mdl_search_form' );
add_action( 'tha_header_before', 'header_right_widget' );
add_action( 'tha_header_after', 'headspace' );
//add_action( 'tha_entry_content_after',  'rcdoc_news_widget' );
//add_action( 'tha_header_after',  'rcdoc_page_hero' );
//add_action( 'tha_content_before', 'rcdoc_page_before' );
//add_action( 'tha_entry_bottom',  'rcdoc_news_row' );
//add_action( 'tha_entry_bottom',  'rcdoc_give_row' );


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

function headspace() {
    echo '<div id="head-space" class="u-mb3"></div>';
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
