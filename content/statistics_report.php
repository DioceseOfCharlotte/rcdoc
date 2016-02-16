<?php
/**
 * Template for statistics.
 *
 * @package abraham
 */
?>
<?php $url = get_post_meta( get_the_ID(), 'doc_stats_report', true ); ?>
<div <?php hybrid_attr('post'); ?>>

	<?php tha_entry_top(); ?>

		<a class="btn btn-hollow u-1of1" href="<?= esc_url($url); ?>"><i class="material-icons">&#xE24D;</i> <?php the_title(); ?><i class="material-icons u-text-white u-right">&#xE895;</i></a>

	<?php tha_entry_bottom(); ?>

</div>
