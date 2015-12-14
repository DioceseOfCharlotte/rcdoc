<?php
if (has_nav_menu('logged-in') && is_user_logged_in()) : ?>

<nav <?php hybrid_attr('menu', 'logged-in'); ?>>

    <?php
        wp_nav_menu(array(
            'theme_location' => 'logged-in',
            'container'      => '',
            'depth'          => 2,
            'menu_id'        => 'menu-logged-in__list',
            'menu_class'     => 'menu__list menu-logged-in__list',
            'fallback_cb'    => '',
            'items_wrap'     => '%3$s',
        ));
    ?>
</nav>
<?php
endif;
