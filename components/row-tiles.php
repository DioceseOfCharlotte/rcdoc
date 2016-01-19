<?php
/**
 * List of related articles.
 *
 * @package abraham
 */

 while ($query->have_posts()) : $query->the_post();

$doc_hex = get_post_meta( get_the_ID(), 'doc_page_primary_color', true );
$doc_rgb = join( ',', hybrid_hex_to_rgb( $doc_hex ) );
?>

    <div id="post-<?php the_ID(); ?>" class="tile o-cell mdl-card mdl-shadow--2dp shadow-hover" style="background-color:rgba(<?= $doc_rgb ?>,0.75)">
        <a href="<?php the_permalink(); ?>" class="mdl-card__title mdl-card--expand u-flex-column u-flex-justify-center u-text-center">
            <?php get_template_part('assets/images/icon', get_the_slug() ); ?>
            <div class="mdl-card__actions">
                <h4><?php the_title(); ?></h4>
            </div>
        </a>
    </div>
<?php endwhile; ?>
