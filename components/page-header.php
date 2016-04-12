<?php
/**
 * Page Header.
 *
 * @package  RCDOC
 */

if ( is_home() || is_front_page() ) {
	$terms = get_terms( 'agency' );
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
	    echo '<div class="section-row__content tile-row is-animating o-grid u-flex-justify-around">';
	    foreach ( $terms as $term ) {
			$term_id = $term->term_id;
			$term_link = get_term_link( $term );
	        echo '<div class="tile u-flex-wrap o-cell u-m0 mdl-card u-shadow--2dp u-1of2-sm shadow-hover" style="' . doc_term_color_style( $term_id, '0.8' ) . '">';
			echo '<a href="' . esc_url( $term_link ) . '" class="mdl-card__title mdl-card--expand u-flex-column u-flex-justify-center u-text-center">';
			echo '<h4>' . $term->name . '</h4></div>';
			echo '</a>';
	    }
	    echo '</div>';
	}
} else {
?>

<div <?php hybrid_attr( 'archive-header' ); ?>>

	<?php hybrid_get_menu( 'breadcrumbs' ); ?>

	<h1 <?php hybrid_attr( 'archive-title' ); ?>>
		<?php
		if ( is_archive() ) {
			echo get_the_archive_title();
		} elseif ( is_search() ) {
			echo sprintf( esc_html__( 'Search Results for %s', 'abraham' ), get_search_query() );
		} elseif ( is_404() ) {
			echo esc_html__( 'Not Found', 'abraham' );
		} elseif ( ! hybrid_is_plural() ) {
			echo get_the_title();
		}
		?>
	</h1>
</div>
<?php }
