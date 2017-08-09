<?php
/**
 * Sidebar Secondary Template.
 *
 * @package Abraham
 */
if ( is_user_logged_in() ) : ?>

			<div class="employee-section u-overflow-hidden u-bg-silver u-m05 u-mb2 u-br">
				<?php dynamic_sidebar( 'employee-sidebar' ); ?>
			</div>

		<?php else : ?>

			<?php
			$args = array(
				'form_id' => 'sidebar-loginform',
			);
			?>
			<div class="u-p2">
				<span class="u-inline-flex u-flex-center u-opacity u-h4"><svg id="i-lock" xmlns="http://www.w3.org/2000/svg" class="icon-line" viewBox="0 0 32 32"><path d="M5 15 L5 30 27 30 27 15 Z M9 15 C9 9 9 5 16 5 23 5 23 9 23 15 M16 20 L16 23" /><circle cx="16" cy="24" r="1" /></svg><h3 class="u-h3 u-py0 u-px1 u-text-display"> Employee Portal</h3></span>
			<?php wp_login_form( $args ); ?>
			<p><a href="/registration/">Create an account</a></p>
			<a href="<?php echo wp_lostpassword_url(); ?>" title="Lost Password">Lost Password</a>
			</div>
		<?php endif; ?>
