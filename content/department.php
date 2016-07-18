<?php
/**
 * Department Template.
 *
 * @package  RCDOC
 */

?>
<article <?php hybrid_attr( 'post' ); ?>>

	<?php get_template_part( 'components/img', 'thumb' ); ?>

	<div class="flag-body u-flex u-flex-wrap u-flexed-auto">
		<?php tha_entry_top(); ?>

		<?php get_template_part( 'components/entry', 'header' ); ?>

		<?php if ( has_excerpt() ) { ?>
		<div <?php hybrid_attr( 'entry-summary' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php tha_entry_content_after(); ?>
		</div>
		<?php } ?>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

		<?php tha_entry_bottom(); ?>
	</div>

</article>
