<?php
add_filter('gravityview/widget/enable_custom_class', '__return_true' );

add_post_type_support( 'gravityview', 'custom-header' );
