
<div class="mdl-cell u-1/2@md u-text-1-dark u-flex u-flex-justify-center u-flex-center">
    <?php get_template_part('assets/images/icon', esc_attr( $attr['icon_file'] ) ); ?>
</div>

 <div class="row-links mdl-cell u-flex u-flex-column u-flex-justify-around">
     <?php while ($query->have_posts()) : $query->the_post(); ?>

            <a href="<?php the_permalink(); ?>" class="list u-block u-text-white u-p1">
                <?php the_title(); ?>
            </a>

<?php endwhile; ?>
</div>
