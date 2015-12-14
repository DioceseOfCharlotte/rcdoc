<?php
/**
 * This is the template for the different block-type shortcodes.
 */
 while ($query->have_posts()) : $query->the_post();
?>

<div id="post-<?php the_ID(); ?>" class="mdl-cell card mdl-shadow--2dp u-text-gray">
        <?php
            get_the_image(array(
                'size' => 'abraham-lg',
                'image_class' => 'card-img-top',
                'link_to_post' => false,
            ));
        ?>
    <div class="card-block">
        <h3 class="card-title u-text-black">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h3>

        <?php the_excerpt(); ?>
    </div>


</div>
<?php
endwhile;
