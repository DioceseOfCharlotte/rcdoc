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
                'size'         => 'abe-card',
                'image_class'  => 'o-crop__content',
                'link_to_post' => false,
                'before'       => '<div class="o-crop o-crop--16x9">',
                'after'        => '</div>',
            ));
        ?>
        <h3 class="card-title u-text-center u-mb0 u-py2">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>
    </header>

</div>
</div>
<?php
endwhile;
