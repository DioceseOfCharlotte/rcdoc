<?php
/**
 * List of related articles.
 *
 * @package abraham
 */

 while ($query->have_posts()) : $query->the_post();
?>

    <div id="post-<?php the_ID(); ?>" class="tile mui-enter js-tile u-flex-wrap o-cell u-m0 mdl-card mdl-shadow--2dp shadow-hover" style="background-color:<?= doc_rgb_prime('0.75') ?>">
        <a href="<?php the_permalink(); ?>" class="mdl-card__title mdl-card--expand u-flex-column u-flex-justify-center u-text-center" style="color:<?= doc_hex_prime($doc_hex) ?>">
            <?php include( locate_template( 'assets/images/svg/'.get_the_slug().'.svg' ) ); ?>
            <div class="mdl-card__actions">
                <h4><?php the_title(); ?></h4>
            </div>
        </a>
    </div>
<?php endwhile; ?>
