<?php

if ( ! is_active_sidebar( 'header-right' ) ) {
	return;
}
?>

<div class="u-inline-block sidebar-header u-mr2 u-rel">
	<div href="#" id="js-dropbtn" class="dropdown-btn btn btn-round u-rel u-z4"><?php abe_do_svg( 'account_circle', 'sm' ) ?></div>
	<div id="js-dropdown" class="dropdown-right u-br u-right0 u-bg-white u-shadow3 u-text-color">
		<?php dynamic_sidebar( 'header-right' ); ?>
		<?php hybrid_get_menu( 'logged-in' ); ?>
	</div>
</div>
