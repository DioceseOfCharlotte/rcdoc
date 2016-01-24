

<article <?php hybrid_attr('post'); ?> class="u-flexed-start">

	<?php tha_entry_top(); ?>

		<header <?php hybrid_attr('entry-header'); ?>>
			<div <?php hybrid_attr('entry-title'); ?>>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</div>
		</header>

		<?php tha_entry_content_before(); ?>
		<?php the_excerpt(); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part('components/entry', 'footer'); ?>

<?php tha_entry_bottom(); ?>

</article>
