<div class="mdl-cell u-1/2@md u-text-1-dark u-flex u-flex-justify-center u-flex-center">
    <?php get_template_part('assets/images/icon', esc_attr( $attr['icon_file'] ) ); ?>
</div>

<div class="mdl-cell u-1/2@md u-text-white u-flex u-flex-justify-center u-flex-center">
<?php
the_widget( 'WP_Widget_RSS',
    array(
        //'title'  => __( 'Widget', 'abraham' ),
        'url'   => esc_url( $attr['feed_url'] ),
        'items' => 7,
        //'show_summary' => true,
    ),
    array(
        'before_widget' => '<section class="rss-widget u-currentcolor_a mdl-cell u-1/1 mdl-mega-footer__drop-down-section u-p2 u-flexed-grow"><div>',
        'after_widget'  => '</div></section>',
        'before_title'  => '</div><input class="mdl-mega-footer__heading-checkbox u-1/1" type="checkbox" checked><h2 class="widget-title u-h1 u-mt0 mdl-mega-footer--heading rss-title">',
        'after_title'   => '</h2><div class="mdl-mega-footer--link-list u-list-reset">',
    )
);
?>
</div>
