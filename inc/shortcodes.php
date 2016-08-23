<?php
/**
 * Register the Shorcake UI
 *
 * @package  RCDOC
 */

add_action( 'init', 'meh_add_shortcodes' );

/**
 * Add the shortcodes.
 *
 * @since  0.1.0
 * @access public
 */
function meh_add_shortcodes() {
	add_shortcode( 'meh_row', 'meh_row_shortcode' );
}

/**
 * TABS
 *
 * @param  array $attr Shortcode Attributes.
 * @param  array $content = null.
 */
function meh_row_shortcode( $attr, $content = null ) {
	$attr = shortcode_atts(array(
		'row_type'        => '',
		'slide_type'      => '',
		'cta'             => '',
		'btn_text'        => '',
		'row_color'       => '',
		'text_color'      => '',
		'bg_image'        => '',
		'blur_image'      => '',
		'glass_color'     => '',
		'overlay'         => '',
		'row_intro'       => '',
		'page'            => '',
		'icon_file'       => '',
		'feed_url'        => '',
		'direction'       => '',
		'js_id'           => '',
	), $attr, 'meh_row');

	$pages = $attr['page'];

	$args = array(
		'post_type' => array( 'page', 'cpt_archive', 'department', 'archive_post', 'bishop', 'chancery', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'multicultural', 'planning', 'property', 'schools_office', 'tribunal', 'vocation' ),
		'post__in'  => explode( ',', $pages ),
		'orderby'   => 'post__in',
	);
	$query = new WP_Query( $args );
	ob_start(); ?>

	<?php if ( $attr['direction'] ) :
		$direction = esc_attr( $attr['direction'] );
	else :
		$direction = '';
	endif; ?>

	<?php if ( $attr['bg_image'] ) : ?>
		<section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-relative <?php echo esc_attr( $attr['text_color'] ); ?> u-1of1 u-py3 u-py4-md u-bg-cover u-bg-fixed <?php echo esc_attr( $attr['overlay'] ); ?>" style="background-image: url(<?php echo wp_kses_post( wp_get_attachment_url( $attr['bg_image'] ) ); ?>)">
		<?php else : ?>
			<section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-relative <?php echo esc_attr( $attr['text_color'] ); ?> u-1of1 u-py3 u-py4-md">
			<?php endif; ?>

			<?php if ( $attr['row_intro'] ) : ?>

				<h2 class="u-h1 u-mb3 u-mb4-md u-rel u-text-display u-text-center">
					<?php echo wp_kses_post( $attr['row_intro'] ); ?>
				</h2>

			<?php endif; ?>

			<?php if ( 'tabs' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ) ?>">
					<?php include locate_template( '/components/row-tabs.php' ); ?>
				</div>

			<?php elseif ( 'links' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ) ?>">
					<?php include locate_template( '/components/row-links.php' ); ?>
				</div>

			<?php elseif ( 'feed' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ) ?>">
					<?php include locate_template( '/components/row-feed.php' ); ?>
				</div>

			<?php elseif ( 'tiles' === $attr['row_type'] ) : ?>

				<div id="tile-row" class="section-row__content tile-row is-animating o-grid u-flex-ja">
					<?php include locate_template( '/components/row-tiles.php' ); ?>
				</div>

			<?php elseif ( 'cta' === $attr['row_type'] ) : ?>
				<div class="section-row__content <?php echo esc_html( $direction ) ?> o-grid u-max-width <?php echo esc_attr( $attr['text_color'] ); ?>">
					<?php include locate_template( '/components/row-callout.php' ); ?>
				</div>
			<?php elseif ( 'cards' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width">
					<?php include locate_template( '/components/row-cards.php' ); ?>
				</div>

			<?php elseif ( 'slides' === $attr['row_type'] ) : ?>

				<?php if ( 'photo' === $attr['slide_type'] ) { ?>

					<div class="section-row__content gallery js-flickity" data-flickity-options='{ "wrapAround": true }'>
						<?php include locate_template( '/components/row-photoslides.php' ); ?>
					</div>

					<?php } elseif ( 'card' === $attr['slide_type'] ) { ?>

						<div class="section-row__content gallery js-flickity" data-flickity-options='{ "wrapAround": true }'>
							<?php include locate_template( '/components/row-slides.php' ); ?>
						</div>
						<?php }
					endif; ?>

				</section>

				<?php
				return ob_get_clean();
				wp_reset_postdata();
}
