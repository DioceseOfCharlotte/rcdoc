<div class="mdl-cell u-1/2@md u-text-1-dark u-flex u-flex-justify-center u-flex-center">
    <?php get_template_part('assets/images/icon', esc_attr( $attr['icon_file'] ) ); ?>
</div>
<?php
// Get pages set (if any)
$pages = $attr['page'];
    $args = array(
        'post_type' => 'any',
        'post__in'  => explode(',', $pages),
        'orderby'   => 'post__in',
    );
$query = new WP_Query( $args );
if ( $query->have_posts() ) { ?>
 <div class="row-links mdl-cell u-flex u-flex-column u-flex-justify-around">
     <?php $query = new WP_Query($args);
     while ($query->have_posts()) : $query->the_post(); ?>

            <a href="<?php the_permalink(); ?>" class="list u-block u-text-white u-p1">
                <?php the_title(); ?>
            </a>

<?php endwhile; ?>
</div>
<?php } ?>
