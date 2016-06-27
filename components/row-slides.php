<?php
/**
 * This is the template for the different block-type shortcodes.
 *
 * @package  RCDOC
 */

wp_enqueue_script( 'flickity' ); ?>

<?php while ( $query->have_posts() ) : $query->the_post(); ?>

	<div id="post-<?php the_ID(); ?>" class="gallery-cell o-cell u-bg-white u-overflow-hidden u-br u-shadow2">

		<header <?php hybrid_attr( 'entry-header' ); ?>>
			<?php
			get_the_image(array(
				'size'         => 'abe-hd',
				'image_class'  => 'o-crop__content',
				'link_to_post' => false,
				'before'       => '<div class="o-crop o-crop--16x9">',
				'after'        => '</div>',
			));
			?>
				<a class="btn u-1of1 u-bg-1 u-br0 u-text-center u-h4" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</header>

	</div>
	<?php
endwhile;
