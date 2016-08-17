<?php
/**
 * Handles the setup and usage of the WordPress custom headers feature.
 *
 * @package  RCDOC
 */

// Call late so child themes can override.
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
			'wp-head-callback'       => 'abraham_custom_header_wp_head',
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
		if ( ! $hex ) {
			return; }

		$style .= ".site-header,.archive-header{color:#{$hex};}";
	}

	global $cptarchives;
	$queried_object_id = get_queried_object_id();
	$term_image = get_term_meta( $queried_object_id, 'image', true );
	$post_image = get_post_meta( $queried_object_id, 'header_image', true );
	$archive_image = $cptarchives->get_archive_meta( 'header_image', true );
	$bg_image = "";

	if ( $GLOBALS['cptarchives'] && $archive_image ) {
		$bg_image = wp_get_attachment_image_url( $archive_image, 'abe-hd-lg' );

	} elseif ( $post_image ) {
		$bg_image = wp_get_attachment_image_url( $post_image, 'abe-hd-lg' );

	} elseif ( $term_image ) {
		$bg_image = wp_get_attachment_image_url( $term_image, 'abe-hd-lg' );

	} elseif ( $GLOBALS['cptarchives'] && has_post_thumbnail( $cptarchives->get_archive_id() ) ) {
		$bg_image = wp_get_attachment_image_url( get_post_thumbnail_id( $cptarchives->get_archive_id() ), 'abe-hd-lg' );

	} elseif ( has_post_thumbnail() ) {
		$bg_image = wp_get_attachment_image_url( get_post_thumbnail_id(), 'abe-hd-lg' );

	} elseif ( get_header_image() ) {
		$bg_image = get_header_image();
	}
	if ( $bg_image ) {
		$style .= ".article-hero{background-image:url({$bg_image});}";
	}
		echo "\n" . '<style id="custom-header-css">' . trim( $style ) . '</style>' . "\n";
}
