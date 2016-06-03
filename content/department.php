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

	<div class="u-1of1">
		<?php get_template_part( 'components/entry', 'header' ); ?>

		<?php if ( has_excerpt() ) { ?>
		<div <?php hybrid_attr( 'entry-summary' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php tha_entry_content_after(); ?>
		</div>
		<?php } ?>
	</div>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

</article>
