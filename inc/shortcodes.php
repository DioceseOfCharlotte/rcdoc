<?php
add_action('init', 'meh_add_shortcodes');

function meh_add_shortcodes() {
    add_shortcode('meh_block', 'meh_block_shortcode');
    add_shortcode('meh_tile', 'meh_tile_shortcode');
    add_shortcode('meh_cards', 'meh_cards_shortcode');
    add_shortcode('meh_toggles', 'meh_toggles_shortcode');
    add_shortcode('meh_slides', 'meh_slides_shortcode');
    add_shortcode('meh_tabs', 'meh_tabs_shortcode');
}

/**
 * TILES
 */
function meh_tile_shortcode($atts, $content = null) {
    $mehsc_atts = shortcode_atts(array(
        'row_color'    => '',
        'row_intro'    => '',
        'width'        => '',
        'page'         => '',
   ), $atts, 'meh_tile');

    $output = '
    <section class="' . $mehsc_atts['row_color'] . ' section-row u-py3 u-py4@md">
        <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center">' . $mehsc_atts['row_intro'] . '</div>
        <div class="card-row mdl-grid u-flex-justify-around">
    ';

// Get pages set (if any)
$pages = $mehsc_atts['page'];

    $args = array(
        'post_type' => array( 'page', 'cpt_archive', 'department' ),
        'post__in'  => explode(',', $pages),
        'orderby'   => 'post__in',
    );

    $queryTile = new WP_Query($args);
    while ($queryTile->have_posts()) : $queryTile->the_post();

    ob_start();
    include locate_template('/components/section-tile.php');
    $output .= ob_get_clean();

    endwhile;

    $output .= '</div></section>';

    return $output;

    wp_reset_postdata();
}



/**
 * CARDS.
 */
function meh_cards_shortcode($atts, $content = null) {
    global $mehsc_atts;
    $mehsc_atts = shortcode_atts(array(
        'page'         => '',
        'show_content' => '',
        'width'        => '',
        'row_color'    => '',
        'row_intro'    => '',
        'show_image'   => '',
   ), $atts, 'meh_cards');

   $output = '
   <section class="' . $mehsc_atts['row_color'] . ' section-row u-p3 u-py4@md">
       <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center">' . $mehsc_atts['row_intro'] . '</div>
       <div class="mdl-grid">';

// Get pages set (if any)
$pages = $mehsc_atts['page'];

    $args = array(
    'post_type' => array( 'page', 'cpt_archive', 'department' ),
    'post__in'  => explode(',', $pages),
    'orderby'   => 'post__in',
);

$queryCards = new WP_Query($args);
while ($queryCards->have_posts()) : $queryCards->the_post();

    ob_start();
    get_template_part('components/section', 'cards');
    $output .= ob_get_clean();

endwhile;

    $output .= '</div></section>';

    return $output;

    wp_reset_postdata();
}




/**
 * SLIDES
 */
function meh_slides_shortcode($attr, $content = null) {

    $attr = shortcode_atts(array(
        'row_color'    => '',
        'row_intro'    => '',
        'page'         => '',
   ), $attr, 'meh_slides');

ob_start(); ?>
<section class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-py3 u-py4@md">
<?php if ($attr['row_intro']) : ?>
    <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center"><?php echo wp_kses_post( $attr[ 'row_intro' ] ); ?></div>
<?php endif; ?>
    <div class="card-row gallery js-flickity" data-flickity-options='{ "wrapAround": true, "pageDots": false, "freeScroll": true }'>

        <?php
        // Get pages set (if any)
        $pages = $attr['page'];

            $args = array(
                'post_type' => array( 'page', 'cpt_archive', 'department' ),
                'post__in'  => explode(',', $pages),
                'orderby'   => 'post__in',
            );

            $query = new WP_Query($args);
            while ($query->have_posts()) : $query->the_post();

            include locate_template('/components/section-slides.php');

            endwhile;
        ?>
    </div>
</section>
<?php

return ob_get_clean();

wp_reset_postdata();
}




/**
 * BLOCK.
 */
function meh_block_shortcode($attr, $content = null) {

    $attr = shortcode_atts(array(
        'row_color'    => '',
        'row_intro'    => '',
        'feed_url'     => '',
        'icon_file'    => '',
   ), $attr, 'meh_block');

   ob_start(); ?>
   <section class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-1/1 u-py3 u-py4@md">
   <?php if ($attr['row_intro']) : ?>
       <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center"><?php echo wp_kses_post( $attr[ 'row_intro' ] ); ?></div>
   <?php endif; ?>
       <div class="section-row__content mdl-grid u-max-width">
               <?php include locate_template('/components/row-feed.php'); ?>
       </div>
   </section>
   <?php

   return ob_get_clean();

   wp_reset_postdata();
   }




   /**
    * TOGGLES.
    */
   function meh_toggles_shortcode($attr, $content = null) {

       $attr = shortcode_atts(array(
           'row_color'    => '',
           'row_intro'    => '',
           'page'         => '',
           'icon_file'    => '',
           'direction'    => '',
           'js_id'    => '',
      ), $attr, 'meh_toggles');

      ob_start(); ?>
      <?php if ($attr['direction']) :
          $direction = esc_attr( $attr['direction'] );
          endif; ?>
      <section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-1/1 u-py3 u-py4@md">
      <?php if ($attr['row_intro']) : ?>
          <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center"><?php echo wp_kses_post( $attr[ 'row_intro' ] ); ?></div>
      <?php endif; ?>
          <div class="section-row__content mdl-grid u-max-width <?php echo $direction; ?>">
              <?php include locate_template('/components/row-links.php'); ?>
          </div>
      </section>
          <?php

          return ob_get_clean();

          wp_reset_postdata();
          }




/**
* TABS
*/
function meh_tabs_shortcode($attr, $content = null) {
    $attr = shortcode_atts(array(
        'row_color'     => '',
        'row_intro'     => '',
        'page'          => '',
        'icon_file'     => '',
        'direction'     => '',
        'js_id'         => '',
    ), $attr, 'meh_tabs');
  
    ob_start(); ?>
    
    <?php if ($attr['direction']) :
        $direction = esc_attr( $attr['direction'] );
    endif; ?>
    
    <section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-1/1 u-py3 u-py4@md">
        
    <?php if ($attr['row_intro']) : ?>
    
        <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center">
            <?php echo wp_kses_post( $attr[ 'row_intro' ] ); ?>
        </div>
        
    <?php endif; ?>
    
        <div class="section-row__content mdl-grid u-max-width <?php echo $direction; ?>">
            <?php include locate_template('/components/row-tabs.php'); ?>
        </div>
    </section>
    
<?php
return ob_get_clean();
wp_reset_postdata();
}
