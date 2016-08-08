<?php
/**
 * Single Document Template.
 *
 * @package  doc-post-types
 */
?>

<article <?php hybrid_attr( 'post' ); ?>>

	<?php tha_entry_top(); ?>

		<div <?php hybrid_attr( 'entry-content' ); ?>>
			<?php tha_entry_content_before(); ?>
			<?php the_excerpt(); ?>
			<?php $doc = get_post_meta( get_the_ID(), 'dpt_document_id', true ); ?>
			<?php $doc_link = wp_get_attachment_url( $doc ); ?>

			<?php if ( members_can_current_user_view_post( get_the_ID() ) ) : ?>

				<?php if ( $doc ) : ?>

				<div class="u-text-right new-tab-link u-1of1 u-mb2"><a class="u-link" href="<?php echo $doc_link ?>" target="_blank" rel="noopener">View this document in a new tab <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class=" u-ml1 v-icon u-f-plus"><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6v2H5v12h12v-6h2zM13 3v2h4.586l-7.793 7.793 1.414 1.414L19 6.414V11h2V3h-8z"/></svg></a></div>

				<object data='<?php echo $doc_link ?>#pagemode=bookmarks'
				        type='application/pdf'
				        width='100%'
				        height='600px'>
				</object>

				<div class="u-1of1 u-text-center u-p2">
					<a class="btn btn-hollow" href="<?php echo $doc_link ?>" download><svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path fill="none" d="M0 0h24v24H0z"/></svg> Download <?php the_title(); ?></a>
				</div>

				<?php else : ?>

					<h3 class="u-1of1 u-text-center">This document wasn't found.</h3>
					<h4 class="u-1of1 u-text-center">Perhaps searching can help.</h4>
					<div class="u-1of1 u-text-center u-p2"><?php get_search_form(); ?></div>

				<?php endif; ?>

			<?php endif; ?>

			<?php tha_entry_content_after(); ?>
		</div>

		<?php get_template_part( 'components/entry', 'footer' ); ?>

		<?php comments_template( '', true ); ?>

	<?php tha_entry_bottom(); ?>

</article>
