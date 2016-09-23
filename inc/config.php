<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */


add_filter( 'script_loader_tag', 'abe_defer_scripts', 10, 3 );
add_filter( 'cleaner_gallery_defaults', 'meh_gallery_default_args' );

function meh_gallery_default_args( $defaults ) {
	$defaults['size']    = 'abe-hd';
	return $defaults;
}

function abe_defer_scripts( $tag, $handle, $src ) {

	// The handles of the enqueued scripts we want to defer
	$defer_scripts = array(
		'admin-bar',
		// 'flickity',
		'main_scripts',
		'abraham_js',
		// 'arch-toggle',
		// 'arch-tabs',
		// 'object_fit_js',
		'devicepx',
		'jquery-migrate',
		'gform_gravityforms',
		'gform_placeholder',
		'gravityview-fe-view',
		// 'lory',
	);

	if ( in_array( $handle, $defer_scripts ) ) {
		return '<script src="' . $src . '" async defer></script>' . "\n";
	}

	return $tag;
}
