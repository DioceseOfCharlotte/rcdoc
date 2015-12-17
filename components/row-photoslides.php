<?php
/**
 * This is the template for the different block-type shortcodes.
 */

 while ($query->have_posts()) : $query->the_post();
?>
<div class="gallery-cell u-1/1 u-relative">
        <?php
            get_the_image(array(
                'size' => 'abraham-lg',
                // 'image_class' => 'o-crop__content',
                'link_to_post' => false,
                // 'before' => '<div class="gallery-cell u-1/1">',
                // 'after' =>    '</div>',
            ));
        ?>
        <a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect u-bg-2 u-absolute u-top0" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    </div>
<?php
endwhile;
