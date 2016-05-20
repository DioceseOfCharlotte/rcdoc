<?php

if ( ! is_active_sidebar( 'header-right' ) ) {
	return;
}
?>

<div class="u-inline-block sidebar-header u-mr2 u-rel">
	<div href="#" class="js-dropdown dropdown-btn btn btn-round u-rel u-z4"><?php abe_do_svg( 'account_circle', 'sm' ) ?></div>
	<div class="dropdown-right u-br u-right0 u-bg-white u-shadow--3dp u-text-color">
		<?php dynamic_sidebar( 'header-right' ); ?>
		<?php hybrid_get_menu( 'logged-in' ); ?>
	</div>
</div>
