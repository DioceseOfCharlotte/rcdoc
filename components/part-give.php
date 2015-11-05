<section id="row-give" class="u-1/1 u-bg-2-glass section-row u-p3 u-py4@md">
    <div class="u-max-width mdl-grid">
        <div class="mdl-cell u-1/2@md u-text-white u-flex u-flex-justify-center u-flex-center">
        <?php
        the_widget( 'WP_Widget_RSS',
            array(
                //'title'  => __( 'Widget', 'abraham' ),
                'url'   => esc_url('http://catholicnewsherald.com/component/ninjarsssyndicator/?feed_id=1&format=raw'),
                'items' => 7,
                //'show_summary' => true,
            ),
            array(
                'before_widget' => '<section class="rss-widget u-currentcolor_a mdl-cell u-1/2@md mdl-mega-footer__drop-down-section u-p2 u-flexed-auto"><div>',
                'after_widget'  => '</div></section>',
                'before_title'  => '</div><input class="mdl-mega-footer__heading-checkbox u-1/1" type="checkbox" checked><h2 class="widget-title u-h1 u-mt0 mdl-mega-footer--heading rss-title">',
                'after_title'   => '</h2><div class="mdl-mega-footer--link-list u-list-reset">',
            )
        );
        ?>
        </div>
        <div class="mdl-cell u-1/2@md u-text-white u-flex u-flex-justify-center u-flex-center">
            <?php get_template_part('assets/images/icon', 'give' ); ?>
        </div>
    </div>
</section>
