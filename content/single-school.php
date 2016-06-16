<?php
/**
 * Single School Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_content(); ?>
			<?php get_template_part( 'components/contact-meta' ); ?>
			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part( 'components/school', 'footer' ); ?>

	<?php tha_entry_bottom(); ?>

</article>
