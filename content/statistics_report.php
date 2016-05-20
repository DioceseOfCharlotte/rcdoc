<?php
/**
 * Template for statistics.
 *
 * @package RCDOC
 */

?>

<?php $url = get_post_meta( get_the_ID(), 'doc_stats_report', true ); ?>
<div <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<a class="btn btn-hollow u-1of1" href="<?php echo esc_url( $url ); ?>"><?php the_title(); ?></a>

	<?php tha_entry_bottom(); ?>

</div>
