<?php
/**
 * Department Template.
 *
 * @package  RCDOC
 */

?>
<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<?php get_template_part( 'components/img', 'thumb' ); ?>

	<div>
		<header <?php hybrid_attr( 'entry-header' ); ?>>
			<h2 <?php hybrid_attr( 'entry-title' ); ?>>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>
		</header>

		<div <?php hybrid_attr( 'entry-summary' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php tha_entry_content_after(); ?>
		</div>
	</div>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

</article>