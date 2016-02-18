

<article <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<header <?php hybrid_attr('entry-header'); ?>>
			<h2 <?php hybrid_attr('entry-title'); ?>>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>
		</header>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part('components/acf-contact'); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part('components/entry', 'footer'); ?>

<?php tha_entry_bottom(); ?>

</article>
