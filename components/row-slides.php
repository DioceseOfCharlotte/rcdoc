<?php
/**
 * This is the template for the different block-type shortcodes.
 */

 while ($query->have_posts()) : $query->the_post();
?>

<div class ="gallery-cell">
<div id="post-<?php the_ID(); ?>" class="mdl-card mdl-shadow--3dp">

    <header <?php hybrid_attr('entry-header'); ?>>
        <?php
            get_the_image(array(
                'size' => 'abraham-lg',
                'image_class' => 'o-crop__content',
                'link_to_post' => false,
                'before' => '<div class="o-crop o-crop--16x9">',
                'after' =>    '</div>',
            ));
        ?>
        <h2 <?php hybrid_attr('entry-title'); ?>>
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>
    </header>

    <div class="u-px2 u-pb2">
        <?php the_excerpt(); ?>
    </div>

</div>
</div>
<?php
endwhile;
