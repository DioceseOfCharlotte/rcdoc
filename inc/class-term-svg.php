<?php
/**
 * Term Svg Class
 *
 * @since 0.1.0
 *
 * @package TermSvg/Includes/Class
 */



if ( ! class_exists( 'WP_Term_Svg' ) ) :
	/**
 * Main WP Term Svg class
 *
 * @since 0.1.0
 */
	final class WP_Term_Svg extends WP_Term_Meta_UI {

		/**
		 * @var string Plugin version
		 */
		public $version = '0.2.0';

		/**
		 * @var string Database version
		 */
		public $db_version = 201601070001;

		/**
		 * @var string Metadata key
		 */
		public $meta_key = 'svg';

		/**
		 * Hook into queries, admin screens, and more!
		 *
		 * @since 0.1.0
		 */
		public function __construct( $file = '' ) {

			// Setup the labels.
			$this->labels = array(
			'singular'    => esc_html__( 'Svg',   'wp-term-svgs' ),
			'plural'      => esc_html__( 'Svgs', 'wp-term-svgs' ),
			'description' => esc_html__( 'The svg is your icon.', 'wp-term-svgs' ),
			);

			// Call the parent and pass the file.
			parent::__construct( $file );
		}

		/** Assets ****************************************************************/

		/**
		 * Enqueue quick-edit JS
		 *
		 * @since 0.1.0
		 */
		// public function enqueue_scripts() {
		//
		// 	// Quick-edit support.
		// 	wp_enqueue_script( 'wp-term-svgs', $this->url . 'assets/js/term-svgs.js', array( 'jquery' ), $this->db_version, true );
		//
		// 	// Styles.
		// 	wp_enqueue_style( 'wp-term-svgs', $this->url . 'assets/css/term-svgs.css', array(), $this->db_version );
		// }

		/**
		 * Add help tabs for `svg` column
		 *
		 * @since 0.1.0
		 */
		public function help_tabs() {
			get_current_screen()->add_help_tab(array(
				'id'      => 'wp_term_svgs_help_tab',
				'title'   => __( 'Term Svg', 'wp-term-svg' ),
				'content' => '<p>' . __( 'Set term svg to group terms by another taxonomy.', 'wp-term-svg' ) . '</p>',
			) );
		}

		/**
		 * Return svg options for use in a dropdown
		 *
		 * @since 0.1.0
		 */
		protected function get_term_svg_options( $term = '' ) {

			// Start an output buffer.
			ob_start();

			// Get the meta value.
			$value = isset( $term->term_id )
			?  $this->get_meta( $term->term_id )
			: '';

			$taxonomy = isset( $term->taxonomy )
			? $term->taxonomy
			: $GLOBALS['taxnow'];

			// Get term taxonomy svgs.
			$options = get_tax_icons();

			// Loop through svgs and make them into option tags.
			foreach ( $options as $option ) : ?>

				<option value="<?php echo esc_attr( $option ); ?>" <?php selected( $option, $value ); ?>>
					<?php echo esc_html( $option ); ?>
				</option>

			<?php endforeach;

			// Return the output buffer.
			return ob_get_clean();
		}

		/** Markup ****************************************************************/

		/**
		 * Output the "term-svg" form field when adding a new term
		 *
		 * @since 0.1.0
		 */
		public function form_field( $term = '' ) {
			?>

			<select name="term-svg" id="term-svg">
			<?php echo $this->get_term_svg_options( $term ); ?>
		</select>

		<?php
		}

		/**
		 * Output the "term-svg" quick-edit field
		 *
		 * @since 0.1.0
		 */
		public function quick_edit_form_field() {
			?>

			<select name="term-svg">
			<?php echo $this->get_term_svg_options(); ?>
		</select>

		<?php
		}

		/**
		 * Return the formatted output for the column row
		 *
		 * @since 0.1.0
		 *
		 * @param string $meta
		 */
		protected function format_output( $meta = '' ) {

			// Get current taxonomy.
			$taxonomy = isset( $_REQUEST['taxonomy'] )
			? $_REQUEST['taxonomy']
			: $GLOBALS['taxnow'];

			$tax = get_taxonomy( $taxonomy );

			// Bail if no taxonomy svg.
			if ( empty( $tax->svg ) ) {
				return $this->no_value;
			}

			// Look for svg.
			if ( ! empty( $meta ) ) {
				$svg = get_term( $meta, $tax->svg );
			}

			// Value?
			$retval = isset( $svg )
			? $svg->name
			: $this->no_value;

			// ID?
			$id = isset( $svg )
			? $svg->term_id
			: 0;

			// Return.
			return '<span class="term-svg" data-svg="' . esc_html( $id ) . '">' . esc_html( $retval ) . '</span>';
		}
	}
endif;



/**
 * Initialize the main WordPress Term Color class
 *
 * @since 0.2.0
 */
function _wp_term_svg_init() {
	new WP_Term_Svg( __FILE__ );
}
add_action( 'init', '_wp_term_svg_init', 99 );
