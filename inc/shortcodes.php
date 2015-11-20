<?php
add_action('init', 'meh_add_shortcodes');

function meh_add_shortcodes() {
    add_shortcode('meh_row', 'meh_row_shortcode');
}

/**
* TABS
*/
function meh_row_shortcode($attr, $content = null) {
    $attr = shortcode_atts(array(
        'row_type'      => '',
        'row_color'     => '',
        'bg_image'      => '',
        'row_intro'     => '',
        'page'          => '',
        'icon_file'     => '',
        'feed_url'      => '',
        'direction'     => '',
        'js_id'         => '',
    ), $attr, 'meh_row');


    $pages = $attr['page'];

        $args = array(
            'post_type' => array( 'page', 'cpt_archive', 'department' ),
            'post__in'  => explode(',', $pages),
            'orderby'   => 'post__in',
        );
        $query = new WP_Query($args);
    ob_start(); ?>

    <?php if ($attr['direction']) :
        $direction = esc_attr( $attr['direction'] );
    endif; ?>

 <section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row js-morph u-overflow-hidden u-1/1 u-py3 u-py4@md u-bg-cover u-bg-fixed"
     <?php if ($attr['bg_image']) : ?>
         style="background-image: url(<?php echo wp_kses_post( wp_get_attachment_url( $attr[ 'bg_image' ] ) ); ?>)"
         <?php endif; ?> >

    <?php if ($attr['row_intro']) : ?>

        <div class="mdl-typography--display-2-color-contrast u-text-white u-z1 u-mb3 u-mb4@md u-text-center">
            <?php echo wp_kses_post( $attr[ 'row_intro' ] ); ?>
        </div>

    <?php endif; ?>

    <?php if ('tabs' === $attr['row_type']) : ?>

        <div class="section-row__content mdl-grid u-max-width <?php echo $direction; ?>">
            <?php include locate_template('/components/row-tabs.php'); ?>
        </div>

    <?php elseif ('links' === $attr['row_type']) : ?>

        <div class="section-row__content mdl-grid u-max-width <?php echo $direction; ?>">
            <?php include locate_template('/components/row-links.php'); ?>
        </div>

    <?php elseif ('feed' === $attr['row_type']) : ?>

        <div class="section-row__content mdl-grid u-max-width <?php echo $direction; ?>">
            <?php include locate_template('/components/row-feed.php'); ?>
        </div>

    <?php elseif ('tiles' === $attr['row_type']) : ?>

        <div class="section-row__content mdl-grid u-flex-justify-around">
            <?php include locate_template('/components/row-tiles.php'); ?>
        </div>

    <?php elseif ('cards' === $attr['row_type']) : ?>

        <div class="section-row__content mdl-grid u-max-width">
            <?php include locate_template('/components/row-cards.php'); ?>
        </div>

    <?php elseif ('slides' === $attr['row_type']) : ?>

        <div class="section-row__content gallery js-flickity" data-flickity-options='{ "wrapAround": true, "pageDots": false, "freeScroll": true }'>
            <?php include locate_template('/components/row-slides.php'); ?>
        </div>

    <?php endif; ?>

</section>

<?php
return ob_get_clean();
wp_reset_postdata();
}
