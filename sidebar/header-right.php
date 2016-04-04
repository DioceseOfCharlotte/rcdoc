<?php
if (!is_active_sidebar('header-right')) {
    return;
}
//wp_enqueue_script( 'gsap_scripts' );
//wp_enqueue_script( 'jq_scripts' );
?>

<div class="u-inline-block sidebar-header u-rel">
    <button href="#" class="js-dropdown dropdown-btn btn-round material-icons u-z4">account_circle</button>
    <div class="dropdown-menu-basic dropdown-right u-br u-px1 u-right0 u-bg-white u-shadow--3dp u-text-color">
        <?php dynamic_sidebar('header-right'); ?>
    </div>
</div>
