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
			'wp-head-callback'       => 'abraham_custom_header_style',
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
function abraham_custom_header_style() {
	$style = '';
	if ( display_header_text() ) {
		$hex = get_header_textcolor();
		if ( ! $hex ) {
			return; }
	$bg_color = get_background_color();

		$style .= ".site-header,.archive-header{color:#{$hex};}
		.custom-header-media > source, .custom-header-media > img {
    height: 100%;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
    top: 0;
    -ms-transform: none;
    -moz-transform: none;
    -webkit-transform: none;
    transform: none;
    width: 100%;
    position: fixed;
}
.site-wrap {
    padding-top: 3rem;
    background-color: #{$bg_color};
    background: linear-gradient(to bottom, rgba(247, 237, 231, 0.0) 0, rgba(247, 237, 231, 0.2) 20vh, rgba(247, 237, 231, 0.4) 40vh, rgba(247, 237, 231, 0.6) 60vh, rgba(247, 237, 231, 0.8) 80vh, rgba(247, 237, 231, 0.95) 99vh);
}
.custom-header {
    position: relative;
    z-index: -1;
}
.archive-header {
    margin-top: 3.5rem;
}
.custom-header-media::before {
    height: 110vh;
    top: -4rem;
	position: fixed;
    z-index: 1;
}
";
	}

		echo "\n" . '<style id="custom-header-css">' . trim( $style ) . '</style>' . "\n";
}

function abe_custom_header_image( $size = 'large' ) {

	global $cptarchives;
	$queried_object_id = get_queried_object_id();
	$post_image = get_post_meta( $queried_object_id, 'header_image', true );

	if ( $GLOBALS['cptarchives'] ) {
		$archive_image = $cptarchives->get_archive_meta( 'header_image', true );
	}

	$term_image = get_term_meta( $queried_object_id, 'image', true );
	$bg_image = '';

	if ( $post_image ) {
		$bg_image = wp_get_attachment_image_url( $post_image, $size );

	} elseif ( $GLOBALS['cptarchives'] && $archive_image ) {
		$bg_image = wp_get_attachment_image_url( $archive_image, $size );

	} elseif ( $term_image ) {
		$bg_image = wp_get_attachment_image_url( $term_image, $size );

	} elseif ( $GLOBALS['cptarchives'] && has_post_thumbnail( $cptarchives->get_archive_id() ) ) {
		$bg_image = wp_get_attachment_image_url( get_post_thumbnail_id( $cptarchives->get_archive_id() ), $size );

	} elseif ( has_post_thumbnail() ) {
		$bg_image = wp_get_attachment_image_url( get_post_thumbnail_id(), $size );

	} elseif ( get_header_image() ) {
		$bg_image = get_header_image();
	}
	if ( $bg_image ) {
		return $bg_image;
	}
}
