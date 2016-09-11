<?php
/**
 * Register the Shorcake UI
 *
 * @package  RCDOC
 * https://github.com/fusioneng/Shortcake.
 */

add_action( 'init', 'meh_add_shortcake' );
add_action( 'enqueue_shortcode_ui', 'shorts_scripts' );

function meh_add_shortcake() {

	/* Make sure the Shortcake plugin is active. */
	if ( ! function_exists( 'shortcode_ui_register_for_shortcode' ) ) {
		return;
	}
	$abraham_dir = trailingslashit( get_template_directory_uri() );

	/**
	 * TILES
	 */
	shortcode_ui_register_for_shortcode(
		'meh_row',
		array(
		'label'         => 'Row',
		'listItemImage' => 'dashicons-align-center',
		'attrs'         => array(
			array(
				'label'       => 'Row Type',
				'attr'        => 'row_type',
				'type'        => 'select',
				'options'     => array(
					'cards'    => esc_html__( 'Cards', 'abraham' ),
					'tabs'     => esc_html__( 'Tabs', 'abraham' ),
					'links'    => esc_html__( 'Page Links', 'abraham' ),
					'feed'     => esc_html__( 'RSS Feed', 'abraham' ),
					'cta'      => esc_html__( 'Call to Action', 'abraham' ),
					'slides'   => esc_html__( 'Slides', 'abraham' ),
					'tiles'    => esc_html__( 'Tiles', 'abraham' ),
				),
			),

			array(
				'label'       => 'Slide Type',
				'attr'        => 'slide_type',
				'type'        => 'select',
				'options'     => array(
					'card'     => esc_html__( 'Content Cards', 'abraham' ),
					'photo'    => esc_html__( 'Photo Slides', 'abraham' ),
				),
			),

			array(
				'label'       => 'Row Background Color',
				'attr'        => 'row_color',
				'type'        => 'select',
				'value'       => 'u-bg-transparent',
				'options'     => array(
					'u-bg-transparent'      => esc_html__( 'Transparent', 'abraham' ),
					'u-bg-white'            => esc_html__( 'White', 'abraham' ),
					'u-bg-1'                => esc_html__( 'Primary color', 'abraham' ),
					'u-bg-2'                => esc_html__( 'Secondary color', 'abraham' ),
					'u-bg-1-glass'          => esc_html__( 'Glass 1', 'abraham' ),
					'u-bg-2-glass'          => esc_html__( 'Glass 2', 'abraham' ),
					'u-bg-1-glass-light'    => esc_html__( 'Glass 1 light', 'abraham' ),
					'u-bg-2-glass-light'    => esc_html__( 'Glass 2 light', 'abraham' ),
					'u-bg-1-glass-dark'     => esc_html__( 'Glass 1 dark', 'abraham' ),
					'u-bg-2-glass-dark'     => esc_html__( 'Glass 2 dark', 'abraham' ),
					'u-bg-frost-4'          => esc_html__( 'Frosted', 'abraham' ),
					'u-bg-tint-4'           => esc_html__( 'Tinted', 'abraham' ),
					'u-bg-silver'           => esc_html__( 'Neutral Gray', 'abraham' ),
					'has-image'             => esc_html__( 'Use an Image', 'abraham' ),
				),
			),

			array(
				'label'       => 'Text Color',
				'attr'        => 'text_color',
				'type'        => 'select',
				'value'       => 'u-text-black',
				'options'     => array(
					'u-text-white'         => esc_html__( 'White', 'abraham' ),
					'u-text-black'         => esc_html__( 'Black', 'abraham' ),
					'u-text-grey'          => esc_html__( 'Grey', 'abraham' ),
					'u-text-1'             => esc_html__( 'Primary color', 'abraham' ),
					'u-text-2'             => esc_html__( 'Secondary color', 'abraham' ),
					'u-text-1-dark'        => esc_html__( 'Primary Dark', 'abraham' ),
					'u-text-2-dark'        => esc_html__( 'Secondary Dark', 'abraham' ),
					'u-text-1-light'       => esc_html__( 'Primary Light', 'abraham' ),
					'u-text-2-light'       => esc_html__( 'Secondary Light', 'abraham' ),
				),
			),

			array(
				'label'       => esc_html__( 'Background Image', 'abraham' ),
				'attr'        => 'bg_image',
				'type'        => 'attachment',
				'libraryType' => array( 'image' ),
				'addButton'   => esc_html__( 'Select Image', 'abraham' ),
				'frameTitle'  => esc_html__( 'Select Image', 'abraham' ),
			),
			array(
				'label'       => esc_html__( 'Blur Image', 'abraham' ),
				'attr'        => 'blur_image',
				'type'        => 'attachment',
				'libraryType' => array( 'image' ),
				'addButton'   => esc_html__( 'Select Image', 'abraham' ),
				'frameTitle'  => esc_html__( 'Select Image', 'abraham' ),
			),

			array(
				'label'       => 'Glass Color',
				'attr'        => 'glass_color',
				'type'        => 'select',
				'value'       => 'u-bg-1-glass-dark',
				'options'     => array(
					'u-bg-transparent-over'      => esc_html__( 'Transparent', 'abraham' ),
					'u-bg-1-glass-over'          => esc_html__( 'Glass 1', 'abraham' ),
					'u-bg-2-glass-over'          => esc_html__( 'Glass 2', 'abraham' ),
					'u-bg-1-glass-light-over'    => esc_html__( 'Glass 1 light', 'abraham' ),
					'u-bg-2-glass-light-over'    => esc_html__( 'Glass 2 light', 'abraham' ),
					'u-bg-1-glass-dark-over'     => esc_html__( 'Glass 1 dark', 'abraham' ),
					'u-bg-2-glass-dark-over'     => esc_html__( 'Glass 2 dark', 'abraham' ),
					'u-bg-frost-4'               => esc_html__( 'Frosted', 'abraham' ),
					'u-bg-tint-4'                => esc_html__( 'Tinted', 'abraham' ),
				),
			),

			array(
				'label'       => esc_html__( 'Image Overlay', 'abraham' ),
				'attr'        => 'overlay',
				'type'        => 'select',
				'value'       => 'u-bg-transparent',
				'options'     => array(
					'no-overlay'       => esc_html__( 'None', 'abraham' ),
					'u-tinted-image'   => esc_html__( 'Tinted', 'abraham' ),
					'u-frosted-image'  => esc_html__( 'Frosted', 'abraham' ),
				),
			),
			array(
				'label'  => esc_html__( 'Intro Text', 'abraham' ),
				'attr'   => 'row_intro',
				'type'   => 'text',
				'encode' => true,
				'meta'   => array(
					'placeholder' => esc_html__( 'Introduce your row with a heading!', 'abraham' ),
					'data-test'   => 1,
				),
			),
			array(
				'label'  => esc_html__( 'Icon File Name', 'abraham' ),
				'attr'   => 'icon_file',
				'type'   => 'text',
				'encode' => true,
				'meta'   => array(
					'placeholder' => esc_html__( 'name of your file', 'abraham' ),
					'data-test'   => 1,
				),
			),
			array(
				'label'    => 'Select Pages to Display',
				'attr'     => 'page',
				'type'     => 'post_select',
				'query'    => array( 'post_type' => array( 'page', 'cpt_archive', 'department', 'archive_post', 'bishop', 'chancery', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'multicultural', 'planning', 'property', 'schools_office', 'tribunal', 'vocation' ) ),
				'multiple' => true,
			),
			array(
				'label'  => esc_html__( 'Button Text', 'abraham' ),
				'attr'   => 'btn_text',
				'type'   => 'text',
				'encode' => true,
				'meta'   => array(
					'placeholder' => esc_html__( 'Make it actionable!', 'abraham' ),
					'data-test'   => 1,
				),
			),
			array(
				'label'    => esc_html__( 'Feed URL' ),
				'attr'     => 'feed_url',
				'type'     => 'url',
			),
			array(
				'label'       => esc_html__( 'Order', 'shortcode-ui-example' ),
				'description' => esc_html__( 'Choose the order of the blocks.', 'abraham' ),
				'attr'        => 'direction',
				'type'        => 'radio',
				'options'     => array(
					''                   => esc_html__( 'Icon First', 'abraham' ),
					'u-flex-row-rev'     => esc_html__( 'Content First', 'abraham' ),
				),
			),
			array(
				'label'  => esc_html__( 'Unique Row ID', 'abraham' ),
				'attr'   => 'js_id',
				'type'   => 'text',
				'encode' => true,
				'meta'   => array(
					'placeholder' => esc_html__( 'You should leave this blank', 'abraham' ),
					'data-test'   => 1,
				),
			),
		),
		)
	);

}




function shorts_scripts() {
	wp_enqueue_script(
		'shorts_scripts',
		trailingslashit( get_stylesheet_directory_uri() ) . 'js/mehShorts.js'
	);
}
