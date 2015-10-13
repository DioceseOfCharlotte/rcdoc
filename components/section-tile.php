<?php
/**
 * List of related articles.
 *
 * @package abraham
 */
 global $mehsc_atts;
?>
<section id="post-<?php the_ID(); ?>" class="tile mdl-cell mdl-card mdl-shadow--2dp">
            <a href="<?php the_permalink(); ?>" class="mdl-card__title mdl-card--expand u-flex-column">
            <?php get_template_part('images/icon', get_the_slug() ); ?>
            <div class="mdl-card__actions">
                <h4><?php the_title(); ?></h4>
            </div>
            </a>
</section>
