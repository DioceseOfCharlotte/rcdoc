<?php
/**
 * This is the template for the different block-type shortcodes.
 */
global $mehsc_atts;
?>

<?php if ('u-1/1@md' === $mehsc_atts['width']) : ?>

        <header class="block-header">
            <h2 class="block-title">
                <a class="block-title__link" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h2>
        
        
            <?php
                get_the_image(array(
                    'size' => 'abraham-lg',
                ));
            ?>
        </header>

        <div class="block-content">
        <?php the_excerpt(); ?>
        </div>



<?php else: ?>



<div id="post-<?php the_ID(); ?>" class="<?php echo esc_attr($mehsc_atts['width']); ?> mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp">

    <?php if ('show_img' === $mehsc_atts['show_image']) : ?>
    <?php
    if ('card-block' === $mehsc_atts['block_type']) {
        get_the_image(array(
            'size'   => 'abraham-sm',
            'before' => '<div class="mdl-card__media">',
            'after'  => '</div>',
        ));
    }
    ?>
    <?php endif; ?>
    <div class="mdl-card__title">
       <a class="mdl-card__title-text" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    </div>
    <div class="mdl-card__supporting-text">
      <span class="mdl-typography--font-light mdl-typography--subhead">
        <?php
        if ('excerpt' === $mehsc_atts['show_content']) {
          the_excerpt();
        } elseif ('content' === $mehsc_atts['show_content']) {
          the_content();
        }
        ?>

      </span>
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a href="<?php the_permalink(); ?>" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
      Go to section
      </a>
      <?php
        $children = wp_list_pages('title_li=&child_of='.$post->ID.'&echo=0&link_after=</span>&link_before=<span class="mdl-menu__item mdl-js-ripple-effect">');
        if ($children) { ?>
       <button id="menu-<?php the_ID(); ?>" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
         <i class="material-icons" role="presentation">more_vert</i>
         <span class="visuallyhidden">show menu</span>
       </button>
       <ul class="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect" for="menu-<?php the_ID(); ?>">
         <?php echo $children; ?>
       </ul>
       <?php } ?>

    </div>
</div><!-- .block -->

<?php endif;
