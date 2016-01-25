

<article <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<header <?php hybrid_attr('entry-header'); ?>>
			<h3 <?php hybrid_attr('entry-title'); ?>>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h3>
		</header>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part('components/acf-parish-contact'); ?>
		<?php the_excerpt(); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part('components/entry', 'footer'); ?>

<?php tha_entry_bottom(); ?>

</article>
