<?php
/**
 * This is the template for the different block-type shortcodes.
 *
 * @package  RCDOC
 */

wp_enqueue_script( 'flickity' ); ?>

<?php while ( $query->have_posts() ) : $query->the_post(); ?>

	<div id="post-<?php the_ID(); ?>" class="gallery-cell o-cell u-bg-white u-br u-shadow--3dp">
		
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
			<h3 class="card-title u-h4 u-text-center u-1of1 u-m0">
				<a class="btn btn-hollow u-border0 u-1of1" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>
		</header>

	</div>
	<?php
endwhile;
