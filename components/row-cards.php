<?php
/**
 * Cards.
 *
 * @package  RCDOC
 */

while ( $query->have_posts() ) : $query->the_post(); ?>
<div class="card-wrap u-fit o-cell u-flexed-start u-br">
	<?php
	$posted_format = get_post_format() ? get_post_format() : 'content';

	tha_entry_before();

	get_template_part( "content/{$posted_format}" );

	tha_entry_after();
	?>
</div>
<?php
endwhile;
