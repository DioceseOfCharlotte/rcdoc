<?php
/**
 * Single Parish Template.
 *
 * @package  RCDOC
 */
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_content(); ?>
			<?php $doc = get_post_meta( get_the_ID(), 'dpt_document_id', true ); ?>
			<?php $doc_link = get_attachment_link( $doc ); ?>

<iframe src="https://docs.google.com/viewer?url=<?php urlencode( $doc_link ); ?>"style="height:900px;width:600px;"></iframe>

			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

		<?php comments_template( '', true ); ?>

	<?php tha_entry_bottom(); ?>

</article>
