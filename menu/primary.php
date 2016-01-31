<?php
if (has_nav_menu('primary')) : ?>
<div class="site-header-row u-flex u-1of1-sm u-px2-md">
  <!-- Navigation -->

        <nav <?php hybrid_attr('menu', 'primary'); ?>>
            <button class="menu-toggle btn u-ml-auto" data-active-toggle="#nav-toggle" aria-controls="menu-primary-items"><i class="material-icons">&#xE5D2;</i></button>
            <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => '',
                    'depth'          => 2,
                    'menu_id'        => 'menu-primary__list',
                    'menu_class'     => 'nav-menu menu-primary__list u-bg-1-glass-dark',
                    'fallback_cb'    => '',
                    //'items_wrap'     => '%3$s',
					'items_wrap'      => '<div id="nav-toggle" class="nav-wrap">' . get_search_form( false ) . '<ul id="%s" class="%s">%s</ul></div>'
                ));
            ?>
        </nav>
</div>
<?php
endif;
