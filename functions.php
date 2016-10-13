<?php
/**
 * Functions and definitions.
 *
 * @package rcdoc
 */
use Mexitek\PHPColors\Color;
/**
 * Load required theme files.
 */
require get_stylesheet_directory() . '/inc/config.php';
require get_stylesheet_directory() . '/inc/compatibility.php';
require get_stylesheet_directory() . '/inc/hooks.php';
require get_stylesheet_directory() . '/inc/ext/cpt-archive.php';
require get_stylesheet_directory() . '/inc/custom-header.php';
require get_stylesheet_directory() . '/inc/custom-background.php';
require get_stylesheet_directory() . '/inc/ext/gravity-forms.php';
require get_stylesheet_directory() . '/inc/ext/gravity-view.php';
require get_stylesheet_directory() . '/inc/ext/gf-email-domain.php';
require get_stylesheet_directory() . '/inc/ext/facetwp.php';
require get_stylesheet_directory() . '/inc/shortcodes.php';
require get_stylesheet_directory() . '/inc/shorts-ui.php';
require get_stylesheet_directory() . '/inc/metaboxes.php';
add_action( 'after_setup_theme', 'rcdoc_setup' );
add_action( 'widgets_init', 'doc_widgets_init' );
add_action( 'wp_enqueue_scripts', 'rcdoc_scripts' );
add_action( 'wp_head', 'abe_display_font' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function rcdoc_setup() {

	//add_theme_support( 'arch-builder' );

	add_theme_support( 'cleaner-gallery' );

	add_theme_support( 'custom-background',	array( 'default-color' => 'e3e3db' ) );

	add_filter( 'theme_mod_primary_color', 'rcdoc_primary_color' );
	add_filter( 'theme_mod_secondary_color', 'rcdoc_secondary_color' );
}

/**
 * Register widget area.
 */
function doc_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Employee Sidebar', 'doc' ),
		'id'            => 'employee-sidebar',
		'description'   => esc_html__( 'Add widgets here.', 'doc' ),
		'before_widget' => '<section id="%1$s" class="widget u-p2 u-mb2 u-bg-frost-1 u-br %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title u-px1 u-text-display u-border-b u-opacity u-bg-white u-b-grey">',
		'after_title'   => '</h3>',
	) );
}

/**
 * Enqueue scripts and styles.
 */
function rcdoc_scripts() {

	$suffix = hybrid_get_min_suffix();

	wp_enqueue_style( 'oldie_child', trailingslashit( get_stylesheet_directory_uri() ) . "css/oldie{$suffix}.css", array( 'hybrid-parent', 'hybrid-style', 'oldie' ) );
	wp_style_add_data( 'oldie_child', 'conditional', 'IE' );

	wp_enqueue_style( 'rcdoc_google_font', 'https://fonts.googleapis.com/css?family=Cormorant+Upright:400,500,600,700|Roboto:300,400,500,700' );

	wp_register_script(
		'arch-tabs',
		trailingslashit( get_stylesheet_directory_uri() ) . 'js/vendors/arch-tabs.js',
		false, false, true
	);

	wp_register_script(
		'flickity',
		trailingslashit( get_stylesheet_directory_uri() ) . 'js/vendors/flickity.pkgd.min.js',
		false, false, true
	);

	wp_enqueue_script(
		'font_face',
		trailingslashit( get_stylesheet_directory_uri() ) . 'js/vendors/fontfaceobserver.js',
		false, false, true
	);
	wp_add_inline_script( 'font_face', 'var fontA = new FontFaceObserver("Cormorant Upright", {weight: 500});var fontB = new FontFaceObserver("Roboto");fontA.load().then(function () {document.documentElement.className += " fontA";});fontB.load().then(function () {document.documentElement.className += " fontB";});' );

	wp_enqueue_script(
		'main_scripts',
		trailingslashit( get_stylesheet_directory_uri() ) . 'js/main.min.js',
		false, false, true
	);
}

function abe_display_font() {
	$font_dir = trailingslashit( get_stylesheet_directory_uri() ) . 'fonts/'; ?>

	<link rel="preload" href="<?php echo $font_dir ?>cormorantupright-medium-webfont.woff2" as="font" type="font/woff2" crossorigin>
	<link rel="preload" href="<?php echo $font_dir ?>roboto-regular-webfont.woff2" as="font" type="font/woff2" crossorigin>

	<style type="text/css">
		@font-face {
			font-family: 'CormorantFB';
			font-style: normal;
			font-weight: 500;
			src:url('<?php echo $font_dir ?>cormorantupright-medium-webfont.woff2') format('woff2'),
				url('<?php echo $font_dir ?>cormorantupright-medium-webfont.woff') format('woff');
		}
		@font-face {
		    font-family: 'RobotoFB';
		    src: url('<?php echo $font_dir ?>roboto-regular-webfont.woff2') format('woff2'),
		         url('<?php echo $font_dir ?>roboto-regular-webfont.woff') format('woff');
		    font-weight: 400;
		    font-style: normal;

		}
		body, .u-text-read {
			font-family: RobotoFB, sans-serif;
			font-weight: 400;
		}
		.u-text-display,.u-text-display>a,.u-dropcap::first-letter {
			font-family: CormorantFB, serif;
			font-weight: 500;
		}
		.fontB body, .fontB .u-text-read {
			font-family: Roboto, sans-serif;
		}
		.fontA .u-text-display,.fontA .u-text-display>a,.fontA .u-dropcap::first-letter {
			font-family: "Cormorant Upright", serif;
		}
	</style>
<?php }

/**
 * Theme Colors.
 */
function rcdoc_primary_color( $hex ) {
	return $hex ? $hex : '#2980b9';
}
function rcdoc_secondary_color( $hex ) {
	return $hex ? $hex : '#16a085';
}


/**
 * Return style for using in html.
 *
 * @param  [type] $post_id [description]
 * @param  string $alpha   [description]
 * @return [type]          [description]
 */
function doc_post_color_style( $post_id, $alpha = '1' ) {
	$style = '';
	$style .= 'background-color:';
	$style .= doc_post_color_rgb( $post_id, $alpha );
	$style .= ';color:';
	$style .= doc_post_color_text( $post_id );
	$style .= ';';
	return $style;
}

/**
 * [doc_post_color_hex description]
 *
 * @param  [type] $post_id [description]
 * @return [type]          [description]
 */
function doc_post_color_hex( $post_id ) {
	$post_id = get_the_ID();
	$post_accent = get_post_meta( $post_id, 'arch_primary_color', true );
	$hex_color = $post_accent ? trim( $post_accent, '#' ) : get_theme_mod( 'primary_color', '' );
	return "#{$hex_color}";
}

/**
 * [doc_post_color_rgb description]
 *
 * @param  [type] $post_id [description]
 * @param  [type] $alpha   [description]
 * @return [type]          [description]
 */
function doc_post_color_rgb( $post_id, $alpha ) {
	$doc_hex = doc_post_color_hex( $post_id );
	$doc_rgb = implode( ',', hybrid_hex_to_rgb( $doc_hex ) );
	return 'rgba(' . $doc_rgb . ',' . $alpha . ')';
}

/**
 * [doc_post_color_text description]
 *
 * @param  [type] $post_id [description]
 * @return [type]          [description]
 */
function doc_post_color_text( $post_id ) {
	$post_accent = new Color( doc_post_color_hex( $post_id ) );
	$text_color = $post_accent->isDark() ? 'fff':'333';
	return "#{$text_color}";
}

function doc_post_color_comp( $post_id, $alpha ) {
	$post_accent = new Color( doc_post_color_hex( $post_id ) );
	$comp_color = $post_accent->isDark() ? $post_accent->darken( 15 ) :$post_accent->lighten( 20 );

	$comp_rgb = implode( ',', hybrid_hex_to_rgb( $comp_color ) );
	return 'rgba(' . $comp_rgb . ',' . $alpha . ')';
}
