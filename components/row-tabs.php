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

<div class="mdl-cell row__tabs mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar">
    
    <?php while ($query->have_posts()) : $query->the_post(); ?>

      <a href="#tab<?php the_ID(); ?>" class="mdl-tabs__tab"><?php the_title(); ?></a>

    <?php endwhile; ?>
    
  </div>
    
  <?php while ($query->have_posts()) : $query->the_post(); ?>
  
  <div class="mdl-tabs__panel" id="tab<?php the_ID(); ?>">
    <?php the_content(); ?>
  </div>

  <?php endwhile; ?>
    
</div>
<?php }
