<?php
/**
 * Custom template tags.
 *
 * @package Abraham
 */

$current_user = wp_get_current_user();
$parish_id = get_parish_post( get_users_parish_id() );
if ( is_user_logged_in() ) : ?>

<div class="side-head-top u-flex u-flex-center u-flex-jb">
<h5 class="u-h5 u-text-display"><em class="u-opacity">Logged in as: </em><?php echo $current_user->display_name ?></h5>

<div class="u-f-plus">
	<a class="btn u-block u-opacity u-p1" href="<?php echo wp_logout_url( home_url() ); ?>" title="Logout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em"><path d="M16 17v2c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h9c1.105 0 2 .895 2 2v2h-2V5H5v14h9v-2h2zm2.5-10.5l-1.414 1.414L20.172 11H10v2h10.172l-3.086 3.086L18.5 17.5 24 12l-5.5-5.5z"/></svg></a>
</div>
</div>

<div class="side-head-bottom u-1of1">
	<a class="btn btn-sm" href="<?php the_permalink($parish_id); ?>" rel="bookmark"><?php abe_do_svg( 'parishes', '1em' ) ?><?= get_the_title($parish_id); ?></a>
</div>
<?php else : ?>

<h2 class="u-h4 u-m0 u-text-display u-inline-block u-flexed-auto u-text-center">
	<a class="opacity-hover" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
</h2>

<?php endif; ?>
