<?php
add_post_type_support('gravityview', 'theme-layouts');
add_filter('gravityview/widget/enable_custom_class', '__return_true' );
add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );


add_filter( 'gform_pre_render_3', 'populate_dept' );
add_filter( 'gform_pre_validation_3', 'populate_dept' );
add_filter( 'gform_pre_submission_filter_3', 'populate_dept' );
add_filter( 'gform_admin_pre_render_3', 'populate_dept' );
function populate_dept( $form ) {

    foreach ( $form['fields'] as &$field ) {

        if ( $field->type != 'select' || strpos( $field->cssClass, 'populate-dept' ) === false ) {
            continue;
        }

        // you can add additional parameters here to alter the posts that are retrieved
        // more info: [http://codex.wordpress.org/Template_Tags/get_posts](http://codex.wordpress.org/Template_Tags/get_posts)
        $posts = get_posts( 'numberposts=-1&post_status=publish&post_type=department' );

        $choices = array();

        foreach ( $posts as $post ) {
            $choices[] = array( 'text' => $post->post_title, 'value' => $post->ID );
        }

        // update 'Select a Post' to whatever you'd like the instructive option to be
        $field->placeholder = 'Select a Post';
        $field->choices = $choices;

    }

    return $form;
}
