<?php
if ( ! is_user_logged_in() ) {
	return;
} ?>

<div class="logged-in-drawer u-bg-1-glass-dark u-border-r u-text-white u-color-inherit">
	<header class="drawer-header u-text-right u-bg-2 u-p2 u-border-b u-text-white u-flex">
		<div class="account-dropdown u-flex u-flex-center u-px1 u-overflow-hidden u-nowrap">
			<?php
			$current_user = wp_get_current_user();

			echo '<div class="u-text-center">' . $current_user->user_email . '</div>';
			?>
		</div>

	</header>
	<aside class="drawer-navigation u-bg-1-dark">
		<?php dynamic_sidebar( 'drawer' ); ?>
		<div class="layout-spacer"></div>
	</aside>
</div>
