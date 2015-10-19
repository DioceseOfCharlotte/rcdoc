<div class="u-1/1 u-text-center u-mb2 u-mt1 u-mx1 u-bg-frost-4 u-color-inherit mdl-shadow--2dp u-br">

    <?php
    the_posts_pagination( array(
        'next_text' =>  '<span class="meta-nav mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button" aria-hidden="true"><i class="material-icons">&#xE409;</i></span> ',
        'prev_text' => '<span class="meta-nav mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button" aria-hidden="true"><i class="material-icons">&#xE408;</i></span> ',
        'before_page_number' => '<span class="meta-nav screen-reader-text">' . __( 'Page', 'abraham' ) . ' </span>',
    ) );
    ?>

</div>
