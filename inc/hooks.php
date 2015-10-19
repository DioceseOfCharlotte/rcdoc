<?php

add_action( 'tha_entry_content_after',  'rcdoc_parish_footer' );

function rcdoc_parish_footer() {
    if ( 'parish' !== get_post_type() ) {
		return;
	}
	get_template_part('components/acf-parish-contact');
}
