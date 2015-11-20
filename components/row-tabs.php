<div class="mdl-cell u-1/2@md u-text-1-dark u-flex u-flex-justify-center u-flex-center">
  <?php get_template_part('assets/images/icon', esc_attr( $attr['icon_file'] ) ); ?>
</div>

<?php if ( $query->have_posts() ) { ?>

<div class="mdl-cell u-bg-white mdl-shadow--2dp u-br row__tabs mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar u-bg-tint-1">

    <?php while ($query->have_posts()) : $query->the_post(); ?>

      <a href="#tab<?php the_ID(); ?>" class="mdl-tabs__tab"><?php the_title(); ?></a>

    <?php endwhile; ?>

  </div>

  <?php while ($query->have_posts()) : $query->the_post(); ?>

  <div class="mdl-tabs__panel u-p2 tab<?php the_ID(); ?>" id="tab<?php the_ID(); ?>">
    <?php the_content(); ?>
  </div>

  <?php endwhile; ?>

</div>
<?php }
