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

		<?php get_template_part( 'components/entry', 'header' ); ?>

		<?php if ( has_excerpt() ) { ?>
		<div <?php hybrid_attr( 'entry-summary' ); ?>>
			<?php the_excerpt(); ?>
		</div>
		<?php } ?>

		<?php get_template_part( 'components/entry', 'footer' ); ?>
	</div>

</article>
