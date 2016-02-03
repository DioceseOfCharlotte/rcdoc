<?php
if (has_nav_menu('primary')) : ?>

  <!-- Navigation -->

        <nav <?php hybrid_attr('menu', 'primary'); ?>>

            <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => '',
                    'depth'          => 2,
                    'menu_id'        => 'menu-primary__list',
                    'menu_class'     => 'nav-menu menu-primary__list u-bg-1-glass-dark u-text-center',
                    'fallback_cb'    => '',
                    //'items_wrap'     => '%3$s',
					//'items_wrap'      => '<div class="nav-wrap">' . get_search_form( false ) . '<ul id="%s" class="%s">%s</ul></div>'
                ));
            ?>
        </nav>

<?php
endif;
