<?php
/**
 * Handles the setup and usage of the WordPress custom headers feature.
 *
 * @package    Stargazer
 * @author     Justin Tadlock <justin@justintadlock.com>
 * @copyright  Copyright (c) 2013 - 2016, Justin Tadlock
 * @link       http://themehybrid.com/themes/abraham
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

# Call late so child themes can override.
add_action( 'after_setup_theme', 'abraham_custom_header_setup', 15 );

/**
 * Adds support for the WordPress 'custom-header' theme feature and registers custom headers.
 *
 * @since  1.0.0
 * @access public
 * @return void
 */
function abraham_custom_header_setup() {

	// Adds support for WordPress' "custom-header" feature.
	add_theme_support(
		'custom-header',
		array(
			'width'                  => 1920,
			'height'                 => 560,
			'flex-width'             => true,
			'flex-height'            => true,
			'default-text-color'     => 'ffffff',
			'header-text'            => true,
			'uploads'                => true,
			'wp-head-callback'       => 'abraham_custom_header_wp_head'
		)
	);
}

/**
 * Callback function for outputting the custom header CSS to `wp_head`.
 *
 * @since  1.0.0
 * @access public
 * @return void
 */
function abraham_custom_header_wp_head() {
$style = '';
if ( display_header_text() ) {
	$hex = get_header_textcolor();
	if ( ! $hex )
		return;

	$style .= ".site-header,.archive-header{color:#{$hex};}";
}

global $cptarchives;
if (has_post_thumbnail($cptarchives->get_archive_id())) {
	$bg_image = wp_get_attachment_url( get_post_thumbnail_id($cptarchives->get_archive_id()), 'abe-hd' );
//$url = $bg_image['0'];
} elseif (has_post_thumbnail()) {
	$bg_image = wp_get_attachment_url( get_post_thumbnail_id($post->ID), 'abe-hd' );
//$url = $bg_image['0'];
} elseif (get_header_image()) {
	$bg_image = get_header_image();
 }
	$style .= ".article-hero{background-image:url({$bg_image});}";
	echo "\n" . '<style type="text/css" id="custom-header-css">' . trim( $style ) . '</style>' . "\n";
}
