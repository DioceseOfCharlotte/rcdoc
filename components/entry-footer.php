<?php // if ( !is_archive() ) {
    return
//}
?>
<footer <?php hybrid_attr('entry-footer'); ?>>
    <a href="<?php the_permalink(); ?>" class="mdl-button mdl-js-button mdl-js-ripple-effect"><?php esc_html_e( 'More', 'abraham' ); ?></a>
    <?php get_template_part('components/child', 'links'); ?>
</footer>
