<?php
/**
 * This file represents an example of the code that themes would use to register
 * the required plugins.
 *
 * It is expected that theme authors would copy and paste this code into their
 * functions.php file, and amend to suit.
 *
 * @see http://tgmpluginactivation.com/configuration/ for detailed documentation.
 *
 * @package    TGM-Plugin-Activation
 * @subpackage Example
 * @version    2.5.2
 * @author     Thomas Griffin, Gary Jones, Juliette Reinders Folmer
 * @copyright  Copyright (c) 2011, Thomas Griffin
 * @license    http://opensource.org/licenses/gpl-2.0.php GPL v2 or later
 * @link       https://github.com/TGMPA/TGM-Plugin-Activation
 */

/**
 * Include the TGM_Plugin_Activation class.
 */
require_once get_stylesheet_directory() . '/inc/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'my_theme_register_required_plugins' );

/**
 * Register the required plugins for this theme.
 * This function is hooked into `tgmpa_register`, which is fired on the WP `init` action on priority 10.
 */
function my_theme_register_required_plugins() {
	/**
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(

		// GitHub repositories.
		array(
			'name'      => 'CPT Archives',
			'slug'      => 'cpt-archives',
			'source'    => 'https://github.com/cedaro/cpt-archives/archive/master.zip',
		),

		array(
			'name'      => 'WP Document Revisions',
			'slug'      => 'wp-document-revisions',
			'source'    => 'https://github.com/benbalter/wp-document-revisions/archive/master.zip',
		),

		array(
			'name'      => 'FacetWP - Alpha',
			'slug'      => 'facetwp-alpha',
			'source'    => 'https://github.com/FacetWP/facetwp-alpha/archive/master.zip',
		),

		array(
			'name'      => 'GitHub Updater',
			'slug'      => 'github-updater',
			'source'    => 'https://github.com/afragen/github-updater/archive/master.zip',
		),

		// WordPress Plugin Repository.
		array(
			'name'      => 'Members',
			'slug'      => 'members',
			'required'  => false,
		),

		array(
			'name'      => 'Nav Menu Roles',
			'slug'      => 'nav-menu-roles',
			'required'  => false,
		),

		array(
			'name'      => 'Page Links To',
			'slug'      => 'page-links-to',
			'required'  => false,
		),

		array(
			'name'      => 'Shortcake (Shortcode UI)',
			'slug'      => 'shortcode-ui',
			'required'  => false,
		),

		array(
			'name'      => 'Radio Buttons for Taxonomies',
			'slug'      => 'radio-buttons-for-taxonomies',
			'required'  => false,
		),

		array(
			'name'      => 'Simple Page Ordering',
			'slug'      => 'simple-page-ordering',
			'required'  => false,
		),
	);

	/*
	 * Array of configuration settings. Amend each line as needed.
	 *
	 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
	 * strings available, please help us make TGMPA even better by giving us access to these translations or by
	 * sending in a pull-request with .po file(s) with the translations.
	 *
	 * Only uncomment the strings in the config array if you want to customize the strings.
	 */
	$config = array(
		'id'           => 'tgmpa',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'  => 'themes.php',            // Parent menu slug.
		'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.

	);

	tgmpa( $plugins, $config );
}
