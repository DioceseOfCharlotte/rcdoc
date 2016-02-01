<?php
if (!is_active_sidebar('header-right')) {
    return;
} ?>

<button href="#" class="js-dropdown dropdown-btn btn-round material-icons u-absolute u-z4 u-mt1 u-top0 u-right0">account_circle</button>
<div class="dropdown-menu-basic dropdown-right u-br u-px1 u-bg-white u-mr3 mdl-shadow--3dp u-text-color">
    <?php dynamic_sidebar('header-right'); ?>
</div>
