<?php
if (!is_active_sidebar('header-right')) {
    return;
} ?>
<div class="u-ml2 sidebar-header">
    <button href="#" class="js-dropdown dropdown-btn btn-round material-icons u-z4">account_circle</button>
    <div class="dropdown-menu-basic dropdown-right u-br u-px1 u-bg-white u-mr3 mdl-shadow--3dp u-text-color">
        <?php dynamic_sidebar('header-right'); ?>
    </div>
</div>
