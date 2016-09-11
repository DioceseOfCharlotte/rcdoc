<?php
/**
 * Gravity Forms.
 *
 * @package  RCDOC
 */

add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );
add_filter( 'gform_predefined_choices', 'doc_update_us_states' );

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

add_filter( 'gform_pre_render_12', 'populate_parish' );
add_filter( 'gform_pre_validation_12', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_12', 'populate_parish' );
add_filter( 'gform_admin_pre_render_12', 'populate_parish' );

add_filter( 'gform_pre_render_12', 'populate_dept' );
add_filter( 'gform_pre_validation_12', 'populate_dept' );
add_filter( 'gform_pre_submission_filter_12', 'populate_dept' );
add_filter( 'gform_admin_pre_render_12', 'populate_dept' );

add_filter( 'gform_pre_render_12', 'populate_school' );
add_filter( 'gform_pre_validation_12', 'populate_school' );
add_filter( 'gform_pre_submission_filter_12', 'populate_school' );
add_filter( 'gform_admin_pre_render_12', 'populate_school' );

add_filter( 'gform_pre_render_2', 'populate_parish' );
add_filter( 'gform_pre_validation_2', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_2', 'populate_parish' );
add_filter( 'gform_admin_pre_render_2', 'populate_parish' );

add_filter( 'gform_pre_render_2', 'populate_dept' );
add_filter( 'gform_pre_validation_2', 'populate_dept' );
add_filter( 'gform_pre_submission_filter_2', 'populate_dept' );
add_filter( 'gform_admin_pre_render_2', 'populate_dept' );

add_filter( 'gform_pre_render_2', 'populate_school' );
add_filter( 'gform_pre_validation_2', 'populate_school' );
add_filter( 'gform_pre_submission_filter_2', 'populate_school' );
add_filter( 'gform_admin_pre_render_2', 'populate_school' );

// IT Request

add_filter( 'gform_pre_render_11', 'populate_parish' );
add_filter( 'gform_pre_validation_11', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_11', 'populate_parish' );
add_filter( 'gform_admin_pre_render_11', 'populate_parish' );

add_filter( 'gform_pre_render_11', 'populate_school' );
add_filter( 'gform_pre_validation_11', 'populate_school' );
add_filter( 'gform_pre_submission_filter_11', 'populate_school' );
add_filter( 'gform_admin_pre_render_11', 'populate_school' );

// Status Anim

add_filter( 'gform_pre_render_14', 'populate_parish' );
add_filter( 'gform_pre_validation_14', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_14', 'populate_parish' );
add_filter( 'gform_admin_pre_render_14', 'populate_parish' );

// Confirmation Planner

add_filter( 'gform_pre_render_15', 'populate_parish' );
add_filter( 'gform_pre_validation_15', 'populate_parish' );
add_filter( 'gform_pre_submission_filter_15', 'populate_parish' );
add_filter( 'gform_admin_pre_render_15', 'populate_parish' );


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

function doc_update_us_states( $choices ) {
	foreach ( $choices['U.S. States'] as &$state ) {
		$state .= '|' . GF_Fields::get( 'address' )->get_us_state_code( $state );
	}

	return $choices;
}
