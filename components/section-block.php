<?php
/**
 * This is the template for the different block-type shortcodes.
 *
 * @package  RCDOC
 */

global $mehsc_atts; ?>

<header class="block-header">
	<h2 class="block-title">
		<a class="block-title__link" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
	</h2>


	<?php
	get_the_image( array(
		'size' => 'abraham-lg',
	) );
	?>
</header>

<div class="block-content">
	<?php the_excerpt(); ?>
</div>
