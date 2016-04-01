
<div class="o-cell u-1of2-md u-flex u-flex-justify-center u-flex-center">
    <?php include( locate_template( 'images/svg/'.esc_attr( $attr['icon_file'] ).'.svg' ) ); ?>
</div>

<div class="o-cell u-1of2-md u-flex u-flex-justify-center u-flex-center">
<?php
the_widget( 'WP_Widget_RSS',
    array(
        'title'  => __( '', 'abraham' ),
        'url'   => esc_url( $attr['feed_url'] ),
        'items' => 7,
        //'show_summary' => true,
    ),
    array(
        'before_widget' => '<section class="rss-widget o-cell u-1of1 mdl-mega-footer__drop-down-section u-p2 u-flexed-grow"><div>',
        'after_widget'  => '</div></section>',
        'before_title'  => '</div><input class="mdl-mega-footer__heading-checkbox u-1of1" type="checkbox" checked><h2 class="widget-title u-h2 u-mt0 mdl-mega-footer--heading rss-title">',
        'after_title'   => '</h2><div class="mdl-mega-footer--link-list u-f-plus u-list-reset">',
    )
);
?>
</div>
