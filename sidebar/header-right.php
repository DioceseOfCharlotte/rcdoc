<?php
if (!is_active_sidebar('header-right')) {
    return;
} ?>

<button href="#" class="js-dropdown dropdown-btn material-icons u-absolute u-p1/2 u-text-white u-round u-top0 u-z4 u-m2 u-right0">account_circle</button>
<div class="dropdown-menu-basic dropdown-right u-br u-px1 u-bg-white u-mr3 mdl-shadow--3dp u-text-black">
    <?php dynamic_sidebar('header-right'); ?>
</div>
