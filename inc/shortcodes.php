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
	add_shortcode( 'meh_field', 'meh_shortcode_field' );
	add_shortcode( 'doc_login_form', 'doc_login_shortcode' );
	add_shortcode( 'doc-personal-link', 'doc_personal_link_shortcode' );
	add_shortcode( 'doc_logged_in_header', 'doc_logged_in_header_shortcode' );
	add_shortcode( 'meh_row', 'meh_row_shortcode' );
	add_shortcode( 'email-front', 'email_front_shortcode' );
}

// Add Shortcode
function email_front_shortcode( $atts, $content = null ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'email' => '',
			'back'  => 'charlottediocese.org',
		),
		$atts,
		'email-front'
	);

	return basename( strtolower( do_shortcode( $content ) ), "@{$atts['back']}" );

}

// Shortcode to get post_meta.
function meh_shortcode_field( $atts ) {
	extract(
		shortcode_atts(
			array(
				'post_id' => null,
			),
			$atts
		)
	);

	if ( ! isset( $atts[0] ) ) {
		return;
	}

	$field = esc_attr( $atts[0] );
	global $post;
	$post_id = ( null === $post_id ) ? $post->ID : $post_id;
	return get_post_meta( $post_id, $field, true );
}

function doc_login_shortcode() {

	$args = array(
		'form_id' => 'abe-loginform',
		'echo'    => false,
	);

	$form  = wp_login_form( $args );
	$form .= '<p><a href="' . wp_lostpassword_url() . '" title="Lost Password">Lost your password?</a></p><a href="/registration/">Create an account</a>';

	return $form;

}

function doc_logged_in_header_shortcode() {

	if ( ! is_user_logged_in() ) {
		return;
	}

	$current_user = wp_get_current_user();

	$header_content = '<div class="side-head-top u-flex u-flex-wrap u-flex-center"><div class="u-mx1 u-round u-text-center">' . get_avatar( $current_user->ID, 38 ) . '</div><p class="u-m0 u-h5 u-text-display">' . $current_user->display_name . '</p><div class="u-f-plus u-ml-auto"><a class="btn u-block u-opacity u-p1" href="' . wp_logout_url( home_url() ) . '" title="Logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em"><path d="M16 17v2c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h9c1.105 0 2 .895 2 2v2h-2V5H5v14h9v-2h2zm2.5-10.5l-1.414 1.414L20.172 11H10v2h10.172l-3.086 3.086L18.5 17.5 24 12l-5.5-5.5z"/></svg></a></div></div>';

	return $header_content;
}

function doc_personal_link_shortcode( $atts ) {

	// Attributes
	$atts = shortcode_atts(
		array(
			'type'  => '',
			'class' => '',
		),
		$atts,
		'doc-personal-link'
	);

	if ( ! isset( $atts['type'] ) ) {
		return;
	}

	$post_id = '';

	if ( 'parish' === $atts['type'] ) {
		$post_id = get_users_parish_post();

	} elseif ( 'mission' === $atts['type'] ) {
		$post_id = get_users_mission_post();

	} elseif ( 'school' === $atts['type'] ) {
		$post_id = get_users_school_post();

	} elseif ( 'department' === $atts['type'] ) {
		$post_id = get_users_department_post();
	}

	if ( empty( $post_id ) ) {
		return;
	}

	return '<a class="btn doc-place-link ' . $atts['class'] . '" href="' . get_permalink( $post_id ) . '">' . abe_get_svg( $atts['type'], '1em' ) . '&nbsp' . get_the_title( $post_id ) . '</a>';
}
add_shortcode( 'doc-personal-link', 'doc_personal_link_shortcode' );


/**
 * TABS
 *
 * @param  array $attr Shortcode Attributes.
 * @param  array $content = null.
 */
function meh_row_shortcode( $attr, $content = null ) {
	$attr = shortcode_atts(
		array(
			'row_type'    => '',
			'slide_type'  => '',
			'cta'         => '',
			'btn_text'    => '',
			'row_color'   => '',
			'text_color'  => '',
			'bg_image'    => '',
			'blur_image'  => '',
			'glass_color' => '',
			'overlay'     => '',
			'row_intro'   => '',
			'page'        => '',
			'icon_file'   => '',
			'feed_url'    => '',
			'direction'   => '',
			'js_id'       => '',
		),
		$attr,
		'meh_row'
	);

	$pages = $attr['page'];

	$args  = array(
		'post_type' => array( 'page', 'cpt_archive', 'department', 'archive_post', 'bishop', 'chancery', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'multicultural', 'planning', 'property', 'schools_office', 'tribunal', 'vocation' ),
		'post__in'  => explode( ',', $pages ),
		'orderby'   => 'post__in',
	);
	$query = new WP_Query( $args );
	ob_start(); ?>

	<?php
	if ( $attr['direction'] ) :
		$direction = esc_attr( $attr['direction'] );
	else :
		$direction = '';
	endif;
	?>

	<?php if ( $attr['bg_image'] ) : ?>
		<section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-relative <?php echo esc_attr( $attr['text_color'] ); ?> u-1of1 u-py3 u-py4-md u-bg-cover u-bg-fixed <?php echo esc_attr( $attr['overlay'] ); ?>" style="background-image: url(<?php echo wp_kses_post( wp_get_attachment_url( $attr['bg_image'] ) ); ?>)">
		<?php else : ?>
			<section id="<?php echo esc_attr( $attr['js_id'] ); ?>" class="<?php echo esc_attr( $attr['row_color'] ); ?> section-row u-relative <?php echo esc_attr( $attr['text_color'] ); ?> u-1of1 u-py3 u-py4-md">
			<?php endif; ?>

			<?php if ( $attr['row_intro'] ) : ?>

				<h2 class="u-h1 u-mb u-rel u-text-display u-text-center">
					<?php echo wp_kses_post( $attr['row_intro'] ); ?>
				</h2>

			<?php endif; ?>

			<?php if ( 'tabs' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ); ?>">
					<?php include locate_template( '/components/row-tabs.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>

			<?php elseif ( 'links' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ); ?>">
					<?php include locate_template( '/components/row-links.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>

			<?php elseif ( 'feed' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width <?php echo esc_html( $direction ); ?>">
					<?php include locate_template( '/components/row-feed.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>

			<?php elseif ( 'tiles' === $attr['row_type'] ) : ?>

				<div id="tile-row" class="section-row__content tile-row is-animating o-grid u-flex-ja">
					<?php include locate_template( '/components/row-tiles.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>

			<?php elseif ( 'cta' === $attr['row_type'] ) : ?>
				<div class="section-row__content <?php echo esc_html( $direction ); ?> o-grid u-max-width <?php echo esc_attr( $attr['text_color'] ); ?>">
					<?php include locate_template( '/components/row-callout.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>
			<?php elseif ( 'cards' === $attr['row_type'] ) : ?>

				<div class="section-row__content o-grid u-max-width">
					<?php include locate_template( '/components/row-cards.php' ); ?>
					<?php wp_reset_postdata(); ?>
				</div>

			<?php elseif ( 'slides' === $attr['row_type'] ) : ?>

				<?php if ( 'photo' === $attr['slide_type'] ) { ?>

					<div class="section-row__content flickity-slides js-flickity" data-flickity-options='{ "wrapAround": true }'>
						<?php include locate_template( '/components/row-photoslides.php' ); ?>
						<?php wp_reset_postdata(); ?>
					</div>

					<?php } elseif ( 'card' === $attr['slide_type'] ) { ?>

						<div class="section-row__content flickity-slides js-flickity" data-flickity-options='{ "wrapAround": true }'>
							<?php include locate_template( '/components/row-slides.php' ); ?>
							<?php wp_reset_postdata(); ?>
						</div>
						<?php
}
					endif;
?>

				</section>

				<?php
				return ob_get_clean();
				wp_reset_postdata();
}
