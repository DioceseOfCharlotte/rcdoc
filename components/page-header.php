<?php if (is_home() || is_front_page()) {
	return;
}
?>

<div <?php hybrid_attr('archive-header'); ?>>

	<div class="page-head-text u-flex u-rel u-p2 u-flex-column u-flex-justify-center">
		<?php hybrid_get_menu('breadcrumbs'); ?>

		<h1 <?php hybrid_attr('archive-title'); ?>>
			<?php
			if (is_archive()) {
				echo get_the_archive_title();
			} elseif (is_search()) {
				echo sprintf(esc_html__('Search Results for %s', 'abraham'), get_search_query());
			} elseif (is_404()) {
				echo esc_html__('Not Found', 'abraham');
			} elseif (!hybrid_is_plural()) {
				echo get_the_title();
			}
			?>
		</h1>
	<?php if ( ! is_paged() && $desc = get_the_archive_description() ) : // Check if we're on page/1. ?>

		<div <?php hybrid_attr( 'archive-description' ); ?>>
			<?php echo $desc; ?>
		</div><!-- .archive-description -->

	<?php endif; // End paged check. ?>

	</div>
</div>