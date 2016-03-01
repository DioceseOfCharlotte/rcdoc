<?php
add_post_type_support('gravityview', 'theme-layouts');
add_filter('gravityview/widget/enable_custom_class', '__return_true' );
add_filter( 'gform_enable_field_label_visibility_settings', '__return_true' );