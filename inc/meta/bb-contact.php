<?php
/**
 * Metaboxes for parish cpt
 */

if ( ! class_exists( 'Doc_Meta' ) ) {
	/**
	 * Main ButterBean class.  Runs the show.
	 *
	 * @since  1.0.0
	 * @access public
	 */
	final class Doc_Meta {
		/**
		 * Sets up initial actions.
		 *
		 * @since  1.0.0
		 * @access private
		 * @return void
		 */
		private function setup_actions() {
			// Call the register function.
			add_action( 'butterbean_register', array( $this, 'register' ), 10, 2 );
		}
		/**
		 * Registers managers, sections, controls, and settings.
		 *
		 * @since  1.0.0
		 * @access public
		 * @param  object  $butterbean  Instance of the `ButterBean` object.
		 * @param  string  $post_type
		 * @return void
		 */
		public function register( $butterbean, $post_type ) {
			if ( 'parish' !== $post_type && 'school' !== $post_type && 'department' !== $post_type )
				return;
			/* === Register Managers === */
			$butterbean->register_manager(
				'doc_contact_info',
				array(
					'label'     => 'Doc Info',
					'post_type' => array( 'parish', 'school', 'department' ),
					'context'   => 'normal',
					'priority'  => 'high'
				)
			);
			$manager  = $butterbean->get_manager( 'doc_contact_info' );
			/* === Register Sections === */
			$manager->register_section(
				'doc_contact_fields',
				array(
					'label' => 'Contact',
					'icon'  => 'dashicons-edit'
				)
			);
			$manager->register_section(
				'doc_location_fields',
				array(
					'label' => 'Location',
					'icon'  => 'dashicons-admin-generic'
				)
			);

			if ( 'parish' === $post_type) {
				$manager->register_section(
					'doc_mass_fields',
					array(
						'label' => 'Mass',
						'icon'  => 'dashicons-star-filled'
					)
				);
			}

			/* === Register Controls === */
			$manager->register_control(
					'doc_phone_number',
					array(
						'type'        => 'text',
						'section'     => 'doc_contact_fields',
						'label'       => 'Phone',
					)
			);
			$manager->register_control(
					'doc_phone_b',
					array(
						'type'        => 'text',
						'section'     => 'doc_contact_fields',
						'label'       => 'Phone 2',
					)
			);
			$manager->register_control(
					'doc_fax',
					array(
						'type'        => 'text',
						'section'     => 'doc_contact_fields',
						'label'       => 'Fax',
					)
			);
			$manager->register_control(
					'doc_email',
					array(
						'type'        => 'text',
						'section'     => 'doc_contact_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'Email',
					)
			);
			$manager->register_control(
					'doc_website',
					array(
						'type'        => 'text',
						'section'     => 'doc_contact_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'Website',
					)
			);

			$manager->register_control(
					'doc_street',
					array(
						'type'        => 'text',
						'section'     => 'doc_location_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'Street',
					)
			);
			$manager->register_control(
					'doc_street_2',
					array(
						'type'        => 'text',
						'section'     => 'doc_location_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'Street 2',
					)
			);
			$manager->register_control(
					'doc_city',
					array(
						'type'        => 'text',
						'section'     => 'doc_location_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'City',
					)
			);
			$manager->register_control(
					'doc_state',
					array(
						'type'        => 'select',
						'section'     => 'doc_location_fields',
						'label'       => 'State',
						'choices'     => array(
							''=>'','AL'=>'Alabama','AK'=>'Alaska','AZ'=>'Arizona','AR'=>'Arkansas','CA'=>'California','CO'=>'Colorado','CT'=>'Connecticut','DE'=>'Delaware','FL'=>'Florida','GA'=>'Georgia','HI'=>'Hawaii','ID'=>'Idaho','IL'=>'Illinois','IN'=>'Indiana','IA'=>'Iowa','KS'=>'Kansas','KY'=>'Kentucky','LA'=>'Louisiana','ME'=>'Maine','MD'=>'Maryland','MA'=>'Massachusetts','MI'=>'Michigan','MN'=>'Minnesota','MS'=>'Mississippi','MO'=>'Missouri','MT'=>'Montana','NE'=>'Nebraska','NV'=>'Nevada','NH'=>'New Hampshire','NJ'=>'New Jersey','NM'=>'New Mexico','NY'=>'New York','NC'=>'North Carolina','ND'=>'North Dakota','OH'=>'Ohio','OK'=>'Oklahoma','OR'=>'Oregon','PA'=>'Pennsylvania','RI'=>'Rhode Island','SC'=>'South Carolina','SD'=>'South Dakota','TN'=>'Tennessee','TX'=>'Texas','UT'=>'Utah','VT'=>'Vermont','VA'=>'Virginia','WA'=>'Washington','WV'=>'West Virginia','WI'=>'Wisconsin','WY'=>'Wyoming'
						)
					)
			);
			$manager->register_control(
					'doc_zip',
					array(
						'type'        => 'text',
						'section'     => 'doc_location_fields',
						'label'       => 'Zip',
					)
			);

			if ( 'parish' === $post_type) {
				$manager->register_control(
					'doc_mass_schedule',
					array(
						'type'        => 'textarea',
						'section'     => 'doc_mass_fields',
						'attr'        => array( 'class' => 'widefat' ),
						'label'       => 'Mass Schedule',
						'description' => 'Example description.'
					)
				);
			}

			/* === Register Settings === */
			$manager->register_setting(
				'doc_phone_number',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_phone_b',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_fax',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_email',
				array( 'sanitize_callback' => 'sanitize_email' )
			);
			$manager->register_setting(
				'doc_website',
				array( 'sanitize_callback' => 'esc_url' )
			);

			$manager->register_setting(
				'doc_street',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_street_2',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_city',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_state',
				array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
			);
			$manager->register_setting(
				'doc_zip',
				array( 'sanitize_callback' => 'absint' )
			);

if ( 'parish' === $post_type) {
			$manager->register_setting(
				'doc_mass_schedule',
				array( 'sanitize_callback' => 'wp_kses_post' )
			);
		}
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
	Doc_Meta::get_instance();
}
