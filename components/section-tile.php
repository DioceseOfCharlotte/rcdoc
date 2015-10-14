<?php
/**
 * List of related articles.
 *
 * @package abraham
 */
 global $mehsc_atts;
?>
            <div id="post-<?php the_ID(); ?>" class="tile <?php the_field('accent_color'); ?> mdl-cell mdl-card mdl-shadow--2dp">
                <a href="<?php the_permalink(); ?>" class="mdl-card__title mdl-card--expand u-flex-column u-flex-justify-center u-text-center">
                    <?php get_template_part('images/icon', get_the_slug() ); ?>
                    <div class="mdl-card__actions">
                        <h4><?php the_title(); ?></h4>
                    </div>
                </a>
            </div>
