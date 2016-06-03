<?php
/**
* Document Template.
*
* @package  RCDOC
*/

?>

<div <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<?php get_template_part( 'components/entry', 'header' ); ?>

	<?php if ( has_excerpt() ) { ?>
		<div class="entry-summary u-p2">
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php tha_entry_content_after(); ?>
		</div>
	<?php } ?>

		<?php tha_entry_bottom(); ?>

	</div>
