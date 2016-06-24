<?php
/**
 * List of Tiles.
 *
 * @package abraham
 */

?>

<?php while ( $query->have_posts() ) : $query->the_post(); ?>

	<div id="post-<?php the_ID(); ?>" class="tile u-flex-wrap o-cell u-m0 u-shadow2 u-1of2-sm shadow-hover" style="<?php echo doc_prime_style( '0.8' ); ?>">
		<a href="<?php the_permalink(); ?>" class="u-flex-col u-flex-jc u-text-center">
			<?php if ( locate_template( 'images/icons/' . get_the_slug() . '.svg' ) ) {
				include locate_template( 'images/icons/' . get_the_slug() . '.svg' );
			} else {
				include locate_template( 'images/icons/shield.svg' );
			} ?>
			<div class="mdl-card__actions">
				<h4><?php the_title(); ?></h4>
			</div>
		</a>
	</div>
<?php endwhile; ?>
