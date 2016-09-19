<?php
/**
 * Contact Fields.
 *
 * @package  RCDOC
 */

$doc_street = get_post_meta( get_the_ID(), 'doc_street', true );
$doc_street_2 = get_post_meta( get_the_ID(), 'doc_street_2', true );
$doc_city = get_post_meta( get_the_ID(), 'doc_city', true );
$doc_state = get_post_meta( get_the_ID(), 'doc_state', true );
$doc_zip = get_post_meta( get_the_ID(), 'doc_zip', true );
$doc_website = get_post_meta( get_the_ID(), 'doc_website', true );
$doc_phone = get_post_meta( get_the_ID(), 'doc_phone_number', true );
$doc_phone_b = get_post_meta( get_the_ID(), 'doc_phone_b', true );
$doc_fax = get_post_meta( get_the_ID(), 'doc_fax', true );
$doc_email = get_post_meta( get_the_ID(), 'doc_email', true );
$address = $doc_street . '+' . $doc_city . '+' . $doc_state . '+' . $doc_zip;
$map_link = 'http://maps.google.com/maps?z=16&q=' . $address;

$width = 'u-1of1';
if ( has_post_thumbnail() ) {
	$width = 'u-2of3';
}
?>

<div class="contact-info u-inline-block <?php echo $width ?> u-align-middle u-p1 u-h6">
	<?php

	ob_start();
	?>
	<div class="contact-numbers u-mb1 u-flex u-flex-wrap u-flex-jb">

		<div class="phone contact-numbers__item u-1of2-md u-inline-block u-spacer16">
			<?php if ( $doc_phone ) : ?>
				<a href="tel:<?= $doc_phone ?>" itemprop="telephone"><?= $doc_phone ?></a>
			<?php endif; ?>
		</div>


		<div class="fax contact-numbers__item u-1of2-md u-inline-block u-spacer16">
			<?php if ( $doc_fax ) : ?>
				<span class="contact-fax u-inline-block u-opacity" itemprop="faxNumber"><span class="u-bold u-mr1">FAX</span><?= $doc_fax ?></span>
			<?php endif; ?>
		</div>

	</div>

	<?php
	echo ob_get_clean();

	ob_start(); ?>
	<div class="contact-address u-inline-block u-mb1">
		<?php if ( $doc_city ) : ?>
			<a itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" href="<?php echo esc_url( $map_link ) ?>" target="_blank">
				<span class="u-inline-block">
					<span itemprop="streetAddress">
						<?= $doc_street ?><br>
						<?php if ( $doc_street_2 ) { ?>
							<?= $doc_street_2 ?><br>
							<?php } ?>
						</span>
						<span itemprop="addressLocality"><?= $doc_city ?>, <?= $doc_state ?></span>
						<span itemprop="postalCode"><?= $doc_zip ?></span>
					</span>
				</a>
			<?php endif; ?>
		</div>
		<?php echo ob_get_clean(); ?>



		<div class="email u-spacer16 u-mb1 u-truncate">
			<?php if ( $doc_email ) : ?>
				<a itemprop="email" href="mailto:<?= $doc_email ?>"><?= $doc_email ?></a>
			<?php endif; ?>
		</div>

		<?php if ( $doc_website ) : ?>
			<?php $obj = get_post_type_object( get_post_type() );
			$single_name = $obj->labels->singular_name; ?>
			<div class="website u-text-center u-1of1 u-mb1">
				<a class="contact-link u-bg-2 btn" itemprop="url" href="<?= $doc_website ?>" target="_blank"><?= $single_name ?> Website <?php abe_do_svg( 'external-link', 'sm' ); ?></a>
			</div>
		<?php endif; ?>

	</div>
