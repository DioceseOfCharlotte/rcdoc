

<article <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr('entry-content'); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_content(); ?>
			<?php get_template_part('components/acf-contact'); ?>
			<?php get_template_part('components/acf-map'); ?>
			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part('components/entry', 'footer'); ?>

	<?php tha_entry_bottom(); ?>

</article>