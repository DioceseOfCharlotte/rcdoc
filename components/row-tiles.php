<?php
/**
 * List of related articles.
 *
 * @package abraham
 */
wp_enqueue_script( 'gsap_scripts' );
wp_enqueue_script( 'jq_scripts' ); ?>

 <?php while ($query->have_posts()) : $query->the_post(); ?>

    <div id="post-<?php the_ID(); ?>" class="tile mui-enter js-tile u-flex-wrap o-cell u-m0 mdl-card u-shadow--2dp u-1of2-sm shadow-hover" style="<?= doc_prime_style('0.8'); ?>">
        <a href="<?php the_permalink(); ?>" class="mdl-card__title mdl-card--expand u-flex-column u-flex-justify-center u-text-center">
            <?php include( locate_template( 'images/svg/'.get_the_slug().'.svg' ) ); ?>
            <div class="mdl-card__actions">
                <h4><?php the_title(); ?></h4>
            </div>
        </a>
    </div>
<?php endwhile; ?>
