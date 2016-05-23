<?php

if ( has_nav_menu( 'primary' ) ) : ?>
<?php hybrid_get_sidebar( 'header-right' ); ?>
<!-- Navigation -->

<nav <?php hybrid_attr( 'menu', 'primary' ); ?>>

	<?php
	wp_nav_menu(array(
		'theme_location' => 'primary',
		'container'      => '',
		'depth'          => 2,
		'menu_id'        => 'menu-primary__list',
		'menu_class'     => 'nav-menu menu-primary__list u-text-left u-inline-block',
		'fallback_cb'    => '',
	));
	?>


</nav>

<?php
endif;
