<?php
/**
 * School Template.
 *
 * @package  RCDOC
 */
$doc_website = get_post_meta( get_the_ID(), 'doc_website', true );

$title_link = $doc_website ? $doc_website : get_permalink();
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

	<?php $distance = facetwp_get_distance();
	if ( false !== $distance ) { ?>
	    <div class="u-abs u-bottom0 u-left0 u-p2"><em><?php echo round( $distance, 2 ); ?> miles</em></div>
	<?php }	?>

	<header class="u-flex u-flex-row u-flex-nowrap u-border-b u-b-silver u-flex-jb u-br-t">
		<h2 <?php hybrid_attr( 'entry-title' ); ?>>
			<a href="<?php echo $title_link; ?>" class="u-text-color"><?php the_title(); ?><?php abe_do_svg( 'external-link', 'sm' ) ?></a>
		</h2>
	</header>

		<?php
			get_the_image(array(
				'size'        => 'thumbnail',
				'image_class' => 'u-1of1',
				'before'      => '<div class="media-img u-p2 u-inline-block u-align-top u-1of3 u-overflow-hidden">',
				'after'       => '</div>',
			));
		?>

		<?php tha_entry_content_before(); ?>
		<?php get_template_part( 'components/contact-meta' ); ?>
		<?php tha_entry_content_after(); ?>

		<?php if ( has_term( 'macs', 'school_system' ) ) : ?>

			<a class="btn macs-logo u-abs u-bottom0 u-right0" href="<?php the_permalink( '10073' ); ?>"><?php abe_do_svg( 'macs', '3em', '5em' ); ?></a>
		<?php endif; ?>

<?php get_template_part( 'components/entry', 'footer' ); ?>

<?php tha_entry_bottom(); ?>

</article>
