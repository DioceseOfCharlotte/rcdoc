<?php
/**
 * The main template file.
 *
 * @package Abraham
 */

get_header(); ?>

<?php get_template_part( 'components/page', 'header' ); ?>

<div <?php hybrid_attr( 'grid' ); ?>>

	<?php if ( ! is_paged() && $desc = get_the_archive_description() ) : ?>
		<article <?php hybrid_attr( 'archive-description' ); ?>>
			<?php echo $desc; ?>
		</article><!-- .archive-description -->
	<?php endif; ?>

	<?php tha_content_before(); ?>

	<main <?php hybrid_attr( 'content' ); ?>>

		<?php if ( have_posts() ) : ?>

			<?php while ( have_posts() ) : the_post(); ?>

				<?php hybrid_get_content_template(); ?>

			<?php endwhile; ?>

			<?php get_template_part( 'components/posts', 'pagination' ); ?>

		<?php else : // If no posts were found. ?>

			<?php get_template_part( 'content/none' ); ?>

		<?php endif; ?>

		<?php if ( is_singular() ) {
			get_template_part( 'components/post', 'children' );
		} ?>

	</main><!-- /.content -->

	<?php hybrid_get_sidebar( 'primary' ); ?>

</div><!-- /.grid -->

<?php
get_footer();
