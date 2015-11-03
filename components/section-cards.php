<?php
/**
 * This is the template for the different block-type shortcodes.
 */
global $mehsc_atts;
?>

<div id="post-<?php the_ID(); ?>" class="mdl-cell mdl-card mdl-shadow--2dp u-overflow-visible">

    <header <?php hybrid_attr('entry-header'); ?>>
        <?php
            get_the_image(array(
                'size' => 'abraham-lg',
            ));
        ?>
        <h2 <?php hybrid_attr('entry-title'); ?>>
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>
    </header>

    <div class="u-px2 u-pb2">
        <?php
        if ('excerpt' === $mehsc_atts['show_content']) {
          the_excerpt();
        } elseif ('content' === $mehsc_atts['show_content']) {
          the_content();
        }
        ?>
    </div>


</div>
        <?php
