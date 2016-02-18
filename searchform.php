
<form role="search" method="get" class="search-form u-mb0 u-ml-auto" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="search-label u-mb0 u-p0">
		<span class="screen-reader-text"><?php echo _x( 'Search for:', 'label', 'twentysixteen' ); ?></span>
		<input type="search" class="search-field u-1of1 u-bg-frost-2 u-pr4 u-mb0" placeholder="<?php echo esc_attr_x( 'Search &hellip;', 'placeholder', 'twentysixteen' ); ?>" value="<?php echo get_search_query(); ?>" name="s" /><i class="material-icons u-trans-time u-trans-color u-trans-curve u-mln4 u-rel">&#xE8B6;</i>
	</label>
	<input type="submit" class="search-submit screen-reader-text" value="<?php echo _x( 'Search', 'submit button', 'abraham' ); ?>" />
</form>
