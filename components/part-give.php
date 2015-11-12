<section id="row-give" class="u-1/1 u-bg-2-glass section-row u-p3 u-py4@md">
    <div class="mdl-typography--display-2-color-contrast u-mb3 u-mb4@md u-text-center">Opportunities for Giving</div>
    <div class="u-max-width mdl-grid">
        <div class="mdl-cell u-1/2@md u-text-white u-flex u-flex-justify-center u-flex-center">
<?php
 
$args = array(
    'cat' => '64',
    'post_type' => 'development'
);
 
$query = new WP_Query( $args );
 
if ( $query->have_posts() ) { ?>
 <div class="give-links">
    <?php while ( $query->have_posts() ) { ?>
 
        <?php $query->the_post(); ?>
 
            <a href="<?php the_permalink(); ?>" class="list u-block u-text-white u-p1">
                <?php the_title(); ?>
            </a>
 
<?php    } ?>
</div>
<?php }
 
// Restore original post data.
wp_reset_postdata();
 
?>
        </div>
        <div class="mdl-cell u-1/2@md u-text-white u-flex u-flex-justify-center u-flex-center">
            <?php get_template_part('assets/images/icon', 'give' ); ?>
        </div>
    </div>
</section>
