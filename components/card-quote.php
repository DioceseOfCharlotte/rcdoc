<?php
/**
 * Quote post format template part.
 *
 * @package abraham
 */
?>
<section class="u-bg-1-glass-dark u-text-white u-color-inherit u-1/1 mdl-cell mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title blockquote mdl-card--expand">
          <?php tha_entry_content_before(); ?>
          <?php the_content(); ?>
          <?php tha_entry_content_after(); ?>
  </div>
</section>
