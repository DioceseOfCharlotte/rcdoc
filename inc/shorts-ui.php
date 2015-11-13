<?php
/**
 * SHORTCAKE
 * https://github.com/fusioneng/Shortcake.
 */
add_action('init', 'meh_add_shortcake');

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
        'meh_tile',
        array(
            'label'         => 'Tile',
            'listItemImage' => 'dashicons-screenoptions',
            'attrs' => array(

                array(
                    'label'   => 'Row Color',
                    'attr'    => 'row_color',
                    'type'    => 'select',
                    'options'     => array(
        					                ''      => esc_html__( 'None', 'abraham' ),
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
                    'label'    => 'Select Page',
                    'attr'     => 'page',
                    'type'     => 'post_select',
                    'query'    => array('post_type' => array( 'page', 'cpt_archive', 'department' )),
                    'multiple' => true,
               ),
           ),
       )
   );

   /*
    * CARDS
    */
   shortcode_ui_register_for_shortcode(
       'meh_cards',
       array(
           'label'         => 'Cards',
           'listItemImage' => 'dashicons-schedule',
           'attrs' => array(

               array(
                   'label'   => 'Row Color',
                   'attr'    => 'row_color',
                   'type'    => 'select',
                   'options'     => array(
       					                ''      => esc_html__( 'None', 'abraham' ),
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
                   'label'   => 'Content to Show',
                   'attr'    => 'show_content',
                   'type'    => 'select',
                   'value'   => 'excerpt',
                   'options' => array(
                       'excerpt' => 'Excerpt',
                       'content' => 'Content',
                       'none'    => 'None',
                  ),
               ),

               array(
                   'label'   => 'Show Featured Image',
                   'attr'    => 'show_image',
                   'type'    => 'select',
                   'value'   => 'show_img',
                   'options' => array(
                       'show_img' => 'Show Image',
                       'hide_img' => 'Hide Image',
                  ),
              ),

               array(
                   'label'    => 'Select Page',
                   'attr'     => 'page',
                   'type'     => 'post_select',
                   'query'    => array('post_type' => array( 'page', 'cpt_archive', 'department' )),
                   'multiple' => true,
              ),
          ),
      )
  );




    /*
     * PANEL
     */
    shortcode_ui_register_for_shortcode(
        'meh_block',
        array(
            'label'         => 'Row RSS Feed',
            'listItemImage' => 'dashicons-rss',
            'attrs' => array(

                array(
                    'label'   => 'Row Color',
                    'attr'    => 'row_color',
                    'type'    => 'select',
                    'options'     => array(
        					                ''      => esc_html__( 'None', 'abraham' ),
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
                    'label'    => esc_html__( 'Feed URL' ),
                    'attr'     => 'feed_url',
                    'type'     => 'url',
               ),
           ),
       )
   );

    /*
     * Toggles
     */
    shortcode_ui_register_for_shortcode(
        'meh_toggles',
        array(
            'label'         => 'Toggles',
            'listItemImage' => 'dashicons-list-view',
            'attrs'         => array(

                array(
                    'label'   => 'Row Color',
                    'attr'    => 'row_color',
                    'type'    => 'select',
                    'options'     => array(
        					                ''      => esc_html__( 'None', 'abraham' ),
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
                    'label'    => 'Select Pages to link',
                    'attr'     => 'page',
                    'type'     => 'post_select',
                    'query'    => array('post_type' => array( 'department', 'development' )),
                    'multiple' => true,
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




   /*
    * SLIDES
    */
   shortcode_ui_register_for_shortcode(
       'meh_slides',
       array(
           'label'         => 'Slides',
           'listItemImage' => 'dashicons-editor-insertmore',
           'attrs' => array(

               array(
                   'label'   => 'Row Color',
                   'attr'    => 'row_color',
                   'type'    => 'select',
                   'options'     => array(
                                           ''      => esc_html__( 'None', 'abraham' ),
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
                   'label'    => 'Select Page',
                   'attr'     => 'page',
                   'type'     => 'post_select',
                   'query'    => array('post_type' => array( 'page', 'department' )),
                   'multiple' => true,
              ),
          ),
      )
   );
   
   
   
   
shortcode_ui_register_for_shortcode(
    'meh_tabs',
    array(
        'label'         => 'Tabs',
        'listItemImage' => 'dashicons-images-alt2',
        'attrs'         => array(
            array(
                'label'   => 'Row Color',
                'attr'    => 'row_color',
                'type'    => 'select',
                'options'     => array(
    					                ''      => esc_html__( 'None', 'abraham' ),
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
                'label'    => 'Select Each Tabs Content',
                'attr'     => 'page',
                'type'     => 'post_select',
                'query'    => array('post_type' => array( 'department', 'development' )),
                'multiple' => true,
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
