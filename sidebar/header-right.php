<?php

if ( ! is_active_sidebar( 'header-right' ) ) {
	return;
}
?>

<div class="u-inline-block sidebar-header u-mr2 u-rel">
	<button href="#" class="js-dropdown dropdown-btn btn-round u-z4">O</button>
	<div class="dropdown-right u-br u-right0 u-bg-white u-shadow--3dp u-text-color">
		<?php dynamic_sidebar( 'header-right' ); ?>
		<?php hybrid_get_menu( 'logged-in' ); ?>
	</div>
</div>
