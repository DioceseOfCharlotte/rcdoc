<?php
/**
 * Address Metabox
 */

if ( ! class_exists( 'Doc_Post_Options' ) ) {

	/**
	* Main ButterBean class.
	*/
	final class Doc_Post_Options {

		/**
		 * Sets up initial actions.
		 */
		private function setup_actions() {
			add_action( 'butterbean_register', array( $this, 'register' ), 10, 2 );
		}

		/**
		 * Registers managers, sections, controls, and settings.
		 */
		public function register( $butterbean, $post_type ) {
			$doc_po = array(
			   'department',
			   'parish',
			   'school',
			   'cpt_archive',
		   	);

			if ( ! in_array( $post_type, $doc_po, true ) ) {
				return; }

			$butterbean->register_manager(
				'doc_accents',
				array(
				'label'     => 'Section Styles',
				'post_type' => array(
			 	   'department',
			 	   'parish',
			 	   'school',
				   'cpt_archive',
			   	),
				'context'   => 'normal',
				'priority'  => 'high',
				)
			);

			$manager = $butterbean->get_manager( 'doc_accents' );

			$manager->register_section(
				'doc_post_colors',
				array(
					'label' => 'Colors',
					'icon'  => 'dashicons-art',
				)
			);

			$manager->register_control(
				'doc_page_primary_color',
				array(
					'type'        => 'color',
					'section'     => 'doc_post_colors',
					'label'       => 'Primary color',
				)
			);

			$manager->register_control(
				'doc_page_secondary_color',
				array(
					'type'        => 'color',
					'section'     => 'doc_post_colors',
					'label'       => 'Secondary color',
				)
			);

			$manager->register_setting(
				'doc_page_primary_color',
				array( 'sanitize_callback' => 'sanitize_hex_color_no_hash' )
			);

			$manager->register_setting(
				'doc_page_secondary_color',
				array( 'sanitize_callback' => 'sanitize_hex_color_no_hash' )
			);
		}
		/**
		 * Returns the instance.
		 *
		 * @since  1.0.0
		 * @access public
		 * @return object
		 */
		public static function get_instance() {

			static $instance = null;

			if ( is_null( $instance ) ) {
				$instance = new self;
				$instance->setup_actions();
			}

			return $instance;
		}

		/**
		 * Constructor method.
		 *
		 * @since  1.0.0
		 * @access private
		 * @return void
		 */
		private function __construct() {}
	}

	Doc_Post_Options::get_instance();
}
