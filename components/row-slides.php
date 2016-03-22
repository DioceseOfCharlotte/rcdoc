<?php
/**
 * This is the template for the different block-type shortcodes.
 */

 while ($query->have_posts()) : $query->the_post();
?>

<div class ="gallery-cell">
<div id="post-<?php the_ID(); ?>" class="o-cell u-bg-white u-br u-shadow--3dp">

    <header <?php hybrid_attr('entry-header'); ?>>
        <?php
            get_the_image(array(
                'size'         => 'abe-hd',
                //'image_class'  => 'o-crop__content',
                'link_to_post' => false,
                //'before'       => '<div class="o-crop o-crop--16x9">',
                //'after'        => '</div>',
            ));
        ?>
        <h3 class="card-title u-text-center u-m0">
            <a class="btn btn-hollow u-border0 u-1of1 u-bold" href="<?php the_permalink(); ?>">HHHEEEY<?php the_title(); ?></a>
        </h2>
    </header>

</div>
</div>
<?php
endwhile;
