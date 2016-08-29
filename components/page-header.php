<?php
/**
 * Page Header.
 *
 * @package  RCDOC
 */

if ( ! is_home() && is_front_page() ) {
	$terms = get_terms( 'agency' );
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
	    echo '<div class="section-row__content tile-row u-container is-animating o-grid u-flex-ja u-pt4 u-mb4">';
	    foreach ( $terms as $term ) {
			$term_id = $term->term_id;
			$term_post_link = get_term_meta( $term_id, 'doc_linked_post', true );
			$term_redirect = get_permalink( $term_post_link );
			$term_link = $term_post_link ? $term_redirect : get_term_link( $term );
			$term_icon = get_term_meta( $term_id, 'doc_tax_icon', true );
	        echo '<div class="tile u-flex-wrap o-cell u-br u-flex u-flex-col u-shadow1 shadow-hover" style="background-color:' . doc_term_color_rgb( $term_id, '0.8' ) . ';color:' . doc_term_color_rgb( $term_id, '0.2' ) . '">';
			echo '<a href="' . esc_url( $term_link ) . '" class="tile-link u-z1 u-br u-flex-col u-flex-jc u-text-center" style="color:' . doc_term_color_text( $term_id ) . ';"><div class="tiled-icon" style="color:' . doc_term_color_comp( $term_id, '0.8' ) . ';">';
			if ( locate_template( 'images/icons/' . $term_icon . '.svg' ) ) {
				include locate_template( 'images/icons/' . $term_icon . '.svg' );
			} else {
				include locate_template( 'images/icons/shield.svg' );
			}
			echo '</div>';
			echo '<div class="u-abs tile-title u-left0 u-top0 u-bottom0 u-flex-center u-1of1 u-text-shadow u-text-center u-flex"><h2 class="u-h2 u-text-display u-1of1">' . $term->name . '</h2></div>';
			echo '</div></a>';
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
