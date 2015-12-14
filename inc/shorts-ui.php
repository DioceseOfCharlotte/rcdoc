<?php
/**
 * SHORTCAKE
 * https://github.com/fusioneng/Shortcake.
 */
add_action('init', 'meh_add_shortcake');
add_action( 'enqueue_shortcode_ui', 'shorts_scripts' );

function meh_add_shortcake() {

    /* Make sure the Shortcake plugin is active. */
if (!function_exists('shortcode_ui_register_for_shortcode')) {
    return;
}
    $abraham_dir = trailingslashit(get_template_directory_uri());

/*
 * TILES
 */
shortcode_ui_register_for_shortcode(
    'meh_row',
    array(
        'label'         => 'Row',
        'listItemImage' => 'dashicons-align-center',
        'attrs'         => array(
            array(
                'label'   => 'Row Type',
                'attr'    => 'row_type',
                'type'    => 'select',
                'options'     => array(
                    'cards'    => esc_html__( 'Cards', 'abraham' ),
                    'tabs'    => esc_html__( 'Tabs', 'abraham' ),
                    'links'   => esc_html__( 'Page Links', 'abraham' ),
                    'feed'   => esc_html__( 'RSS Feed', 'abraham' ),
                    'slides'  => esc_html__( 'Slides', 'abraham' ),
                    'tiles'  => esc_html__( 'Tiles', 'abraham' ),
                ),
            ),

            array(
                'label'   => 'Row Background Color',
                'attr'    => 'row_color',
                'type'    => 'select',
                'options'     => array(
                    'u-bg-transparent'      => esc_html__( 'Transparent', 'abraham' ),
                    'u-bg-white u-text-black'   => esc_html__( 'White', 'abraham' ),
                    'u-bg-1 u-text-white'       => esc_html__( 'Primary color', 'abraham' ),
                    'u-bg-2 u-text-black'       => esc_html__( 'Secondary color', 'abraham' ),
                    'u-bg-1-glass u-text-white'       => esc_html__( 'Glass 1', 'abraham' ),
                    'u-bg-2-glass u-text-black'       => esc_html__( 'Glass 2', 'abraham' ),
                    'u-bg-1-glass-light u-text-white' => esc_html__( 'Glass 1 light', 'abraham' ),
                    'u-bg-2-glass-light u-text-black' => esc_html__( 'Glass 2 light', 'abraham' ),
                    'u-bg-1-glass-dark u-text-white'  => esc_html__( 'Glass 1 dark', 'abraham' ),
                    'u-bg-2-glass-dark u-text-black'  => esc_html__( 'Glass 2 dark', 'abraham' ),
                    'u-bg-frost-4 u-text-black'       => esc_html__( 'Frosted', 'abraham' ),
                    'u-bg-tint-4 u-text-white'        => esc_html__( 'Tinted', 'abraham' ),
                    'u-bg-silver u-text-black'        => esc_html__( 'Neutral Gray', 'abraham' ),
                    'has-image'        => esc_html__( 'Use an Image', 'abraham' ),
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
                'query'    => array('post_type' => array( 'department', 'development' )),
                'multiple' => true,
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
                       'u-flex-row-rev'  => esc_html__( 'Content First', 'abraham' ),
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
        trailingslashit(get_stylesheet_directory_uri())."assets/js/mehShorts.js"
    );
}
