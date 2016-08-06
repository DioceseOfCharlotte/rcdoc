<?php
/**
 * Sidebar Secondary Template.
 *
 * @package Abraham
 */

if ( ! is_active_sidebar( 'secondary' ) ) {
	return;
}
?>
<aside class="js-off-canvas off-canvas u-fix u-left0 u-top0 u-1of1 u-height100 if-admin-bar u-overflow-hidden">
	<nav class="js-off-canvas-container off-canvas__container u-rel u-bg-white u-height100 u-flex u-flex-col u-shadow3">



		<header class="off-canvas__header u-flex u-flex-wrap u-bg-2-light u-shadow1">
			<div class="off-canvas__title u-1of1 u-flex u-bg-2 u-flex-center u-p1 u-mb1">
				<button class="js-menu-hide off-canvas__hide u-z1 btn-round u-h3 u-inline-flex">
					<?php abe_do_svg( 'arrow-left', 'sm' ); ?>
				</button>
				<h2 class="u-h4 u-m0 u-text-display u-inline-block u-flexed-auto u-text-center"><a class="opacity-hover" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h2>
			</div>
			<?php get_search_form(); ?>
		</header>

    <div class="off-canvas__content u-py2 u-flexed-1 ">

		<?php dynamic_sidebar( 'secondary' ); ?>

		<?php if ( is_user_logged_in() ) : ?>

		<?php $current_user = wp_get_current_user(); ?>

			<div class="employee-section u-bg-silver u-border u-m1 u-mb2 u-br">
				<div class="u-border-b u-rel u-h4 u-text-1-dark u-text-display u-text-center u-mb1 u-p1">
					<em class="u-f-plus u-opacity">Logged in as: </em><?php echo $current_user->display_name ?>
					<a class="btn u-opacity u-abs u-p1 u-mtn1 u-left0" href="<?php echo wp_logout_url( home_url() ); ?>" title="Logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em"><path d="M16 17v2c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h9c1.105 0 2 .895 2 2v2h-2V5H5v14h9v-2h2zm2.5-10.5l-1.414 1.414L20.172 11H10v2h10.172l-3.086 3.086L18.5 17.5 24 12l-5.5-5.5z"/></svg></a>
				</div>
				<?php dynamic_sidebar( 'employee-sidebar' ); ?>
			</div>

		<?php else : ?>

			<?php
			$args = array(
				'form_id' => 'sidebar-loginform',
			);
			?>
			<div class="u-p2">
				<h3 class="u-px1 u-pt0 u-opacity u-text-display u-inline-flex u-flex-center"><svg xmlns="http://www.w3.org/2000/svg" width="0.8em" class="u-mr1 u-text-grey" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v1H6c-1.105 0-2 .895-2 2v10c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V10c0-1.105-.895-2-2-2zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v1H9V7zm4 8.723V18h-2v-2.277c-.595-.346-1-.984-1-1.723 0-1.105.895-2 2-2s2 .895 2 2c0 .738-.405 1.376-1 1.723z"/></svg><span> Employee Portal</span></h3>
			<?php wp_login_form( $args ); ?>
			<p><a href="/register-user/">Create an account</a></p>
			<a href="<?php echo wp_lostpassword_url(); ?>" title="Lost Password">Lost Password</a>
			</div>
		<?php endif; ?>

  </div>

	</nav>
</aside>
