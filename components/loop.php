<?php

$slug = get_the_slug();
// WP_Query arguments
$args = array (
    'post_type'              => array( 'post', 'chancery', 'vocation', 'tribunal', 'property', 'planning', 'multicultural', 'liturgy', 'liturgy', 'housing', 'hispanic_ministry', 'finance', 'info_tech', 'development', 'deacon', 'archive'),
    'category_name'          => $slug,
    'posts_per_page'         => 6,
    'order'                  => 'ASC',
    'orderby'                => 'menu_order',
);

// The Query
$bishop_query = new WP_Query( $args );

// The Loop
if ( $bishop_query->have_posts() ) { ?>

<div class="mdl-grid">

    <?php while ( $bishop_query->have_posts() ) {
        $bishop_query->the_post();
        get_template_part('components/card', get_post_format() );
    } ?>

</div>

<?php
} else {
    // no posts found
}

// Restore original Post Data
wp_reset_postdata();
