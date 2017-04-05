<?php
/**
 * Single School Template.
 *
 * @package  RCDOC
 */

?>

<article <?php hybrid_attr( 'post' ); ?>>

	<div <?php hybrid_attr( 'entry-content' ); ?>>
		<?php the_content(); ?>
		<?php get_template_part( 'components/contact-meta' ); ?>
	</div>

	<?php get_template_part( 'components/entry', 'footer' ); ?>

	<?php get_template_part( 'components/staff', 'cards' ); ?>

</article>
