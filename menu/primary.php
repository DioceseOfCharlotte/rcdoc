<?php
if (has_nav_menu('primary')) : ?>
<div class="site-header-row u-flex u-px2@md">
  <!-- Navigation -->

        <nav <?php hybrid_attr('menu', 'primary'); ?>>
            <button class="menu-toggle u-ml-auto" aria-controls="menu-primary-items" aria-expanded="false"><i class="material-icons">&#xE5D2;</i></button>
            <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => '',
                    'depth'          => 2,
                    'menu_id'        => 'menu-primary__list',
                    'menu_class'     => 'nav-menu menu-primary__list',
                    'fallback_cb'    => '',
                    //'items_wrap'     => '%3$s',
                ));
            ?>
        </nav>
</div>
<?php
endif;
