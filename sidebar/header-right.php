<?php
if (!is_active_sidebar('header-right')) {
    return;
} ?>

<form action="/" method="get" class="mdl-textfield mdl-js-textfield u-absolute u-right0 u-mr4 u-z4 u-text-white mdl-textfield--expandable u-ml-auto" action="<?php echo home_url( '/' ); ?>">
	<label class="mdl-button mdl-js-button mdl-button--icon u-m0" for="search"><i class="material-icons">search</i></label>
    <div class="mdl-textfield__expandable-holder">
    	<input class="mdl-textfield__input u-lh-2 search-field u-p0 u-border0 u-text-white u-bg-frost-2" type="text" name="s" id="search" value="<?php the_search_query(); ?>" />
    </div>
</form>

<button href="#" class="js-dropdown dropdown-btn material-icons u-absolute u-p1/2 u-text-white u-round u-top0 u-z4 u-m2 u-right0">account_circle</button>
<div class="dropdown-menu-basic dropdown-right u-br u-px1 u-bg-white u-mr3 mdl-shadow--3dp u-text-black">
    <?php dynamic_sidebar('header-right'); ?>
</div>
