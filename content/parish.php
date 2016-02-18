

<article <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<header <?php hybrid_attr('entry-header'); ?>>
			<h2 <?php hybrid_attr('entry-title'); ?>>
				<a class="u-bg-1-dark u-py1 u-1of1 u-inline-block" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>
		</header>

		<?php
			get_the_image(array(
				'size' => 'abe-card-square',
				'image_class' => 'u-1of1',
				'before'             => '<div class="media-img u-inline-block u-align-middle u-1of1 u-1of3-md u-overflow-hidden">',
				'after'              => '</div>',
			));
		?>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part('components/acf-contact'); ?>
		<?php the_excerpt(); ?>
		<?php tha_entry_content_after(); ?>

		<?php get_template_part('components/entry', 'footer'); ?>

<?php tha_entry_bottom(); ?>

</article>
