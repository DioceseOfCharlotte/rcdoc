<?php
/**
 * List of related articles.
 *
 * @package abraham
 */
?>
<section class="<?php the_field('accent_color'); ?> u-text-white u-color-inherit u-flexed-start mdl-cell mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title mdl-card--expand">
      <div <?php hybrid_attr('entry-content'); ?>>
          <?php tha_entry_content_before(); ?>
          <?php the_content(); ?>
          <?php tha_entry_content_after(); ?>
      </div>
  </div>
</section>
