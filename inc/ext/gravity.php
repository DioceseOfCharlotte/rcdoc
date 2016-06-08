<?php
/**
 * Gravity Forms and Gravity View.
 *
 * @package  RCDOC
 */

add_post_type_support( 'gravityview', 'theme-layouts' );
add_filter( 'gravityview/widget/enable_custom_class', '__return_true' );
add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );
add_filter( 'gravityview/extension/search/links_sep', '__return_false' );
add_filter( 'gravityview/extension/search/links_label', '__return_false' );
add_filter( 'gravitview_no_entries_text', 'modify_gravitview_no_entries_text', 10, 2 );
add_filter( 'gravityview/fields/select/output_label', '__return_true' );

add_filter( 'gform_pre_render_3', 'populate_dept' );
add_filter( 'gform_pre_validation_3', 'populate_dept' );
add_filter( 'gform_pre_submission_filter_3', 'populate_dept' );
add_filter( 'gform_admin_pre_render_3', 'populate_dept' );

add_filter( 'gform_pre_render_3', 'populate_parish' );
add_filter( 'gform_pre_validation_3', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_3', 'populate_parish' );
add_filter( 'gform_admin_pre_render_3', 'populate_parish' );

add_filter( 'gform_pre_render_3', 'populate_school' );
add_filter( 'gform_pre_validation_3', 'populate_school' );
add_filter( 'gform_pre_submission_filter_3', 'populate_school' );
add_filter( 'gform_admin_pre_render_3', 'populate_school' );
//add_filter( 'gform_column_input_3_26_2', 'set_parish_column', 10, 5 );

function populate_dept( $form ) {

	foreach ( $form['fields'] as &$field ) {

		if ( 'select' !== $field->type || strpos( $field->cssClass, 'populate-dept' ) === false ) {
			continue;
		}

		$posts = get_posts( 'numberposts=-1&post_status=publish&post_type=department&orderby=title&order=ASC' );

		$choices = array();

		foreach ( $posts as $post ) {
			$choices[] = array( 'text' => $post->post_title, 'value' => $post->ID );
		}

		$field->placeholder = 'Select a Department';
		$field->choices     = $choices;

	}

	return $form;
}

function populate_parish( $form ) {

	foreach ( $form['fields'] as &$field ) {

		if ( 'select' !== $field->type || strpos( $field->cssClass, 'populate-parish' ) === false ) {
			continue;
		}

		$posts = get_posts( 'numberposts=-1&post_status=publish&post_type=parish&orderby=title&order=ASC' );

		$choices = array();

		foreach ( $posts as $post ) {
			$choices[] = array( 'text' => $post->post_title, 'value' => $post->ID );
		}

		$field->placeholder = 'Select a Parish';
		$field->choices     = $choices;

	}

	return $form;
}

function populate_school( $form ) {

	foreach ( $form['fields'] as &$field ) {

		if ( 'select' !== $field->type || strpos( $field->cssClass, 'populate-school' ) === false ) {
			continue;
		}

		$posts = get_posts( 'numberposts=-1&post_status=publish&post_type=school&orderby=title&order=ASC' );

		$choices = array();

		foreach ( $posts as $post ) {
			$choices[] = array( 'text' => $post->post_title, 'value' => $post->ID );
		}

		$field->placeholder = 'Select a School';
		$field->choices     = $choices;

	}

	return $form;
}


/**
 * Modify the text displayed when there are no entries.
 *
 * @param array $existing_text The existing "No Entries" text.
 * @param bool  $is_search  Is the current page a search result, or just a multiple entries screen.
 */
function modify_gravitview_no_entries_text( $existing_text, $is_search ) {

	$return = $existing_text;

	if ( $is_search ) {
		$return = 'Sorry, but nothing matched your search. Perhaps try again with some different keywords.';
	} else {
		$return = '';
	}

	return $return;
}

function set_parish_column( $input_info, $field, $column, $value, $form_id ) {

	$posts = get_posts( 'numberposts=-1&post_status=publish&post_type=parish&orderby=title&order=ASC' );

	$choices = array();

	foreach ( $posts as $post ) {
		$choices[] = array( 'text' => $post->post_title, 'value' => $post->ID );
	}

	return array(
		'type' => 'select',
		'choices' => $choices,
	);
}
