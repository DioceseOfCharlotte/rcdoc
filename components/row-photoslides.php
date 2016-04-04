<?php
/**
 * This is the template for the different block-type shortcodes.
 *
 * @package  RCDOC
 */

foreach ( explode( ',', $attr['gallery'] ) as $id ) { ?>
	<div class="gallery-cell u-1of1 u-1of3-md">
		<?php echo wp_get_attachment_image( $id, 'large' ); ?>
	</div>
	<?php }
