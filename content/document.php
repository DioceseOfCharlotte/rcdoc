

<div <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<a class="btn btn-hollow u-1of1" href="<?php the_permalink(); ?>"><i class="material-icons">&#xE24D;</i> <?php the_title(); ?></a>

		<div class="doc-excerpt">
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php tha_entry_content_after(); ?>
		</div>

	<?php tha_entry_bottom(); ?>

</div>
