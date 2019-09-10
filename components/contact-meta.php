<?php
/**
 * Contact Fields.
 *
 * @package  RCDOC
 */

$doc_street   = get_post_meta( get_the_ID(), 'doc_street', true );
$doc_street_2 = get_post_meta( get_the_ID(), 'doc_street_2', true );
$doc_city     = get_post_meta( get_the_ID(), 'doc_city', true );
$doc_state    = get_post_meta( get_the_ID(), 'doc_state', true );
$doc_zip      = get_post_meta( get_the_ID(), 'doc_zip', true );
$doc_website  = get_post_meta( get_the_ID(), 'doc_website', true );
$doc_phone    = get_post_meta( get_the_ID(), 'doc_phone_number', true );
$doc_phone_b  = get_post_meta( get_the_ID(), 'doc_phone_b', true );
$doc_fax      = get_post_meta( get_the_ID(), 'doc_fax', true );
$doc_email    = get_post_meta( get_the_ID(), 'doc_email', true );
$address      = "{$doc_street}+{$doc_city}+{$doc_state}+{$doc_zip}";
$map_link     = 'https://maps.google.com/maps/place/' . $address;
$dir_link     = 'https://maps.google.com/maps/dir//' . $address;
$width        = 'u-1of1';

if ( has_post_thumbnail() && ! is_single() ) {
	$width = 'u-3of4';
}
?>

<div class="contact-info u-inline-block <?php echo $width; ?> u-align-middle u-p1 u-h6">
	<div class="contact-wrapper u-flex u-flex-wrap u-flex-jb">

		<?php if ( $doc_website && is_single() ) : ?>
			<div class="u-1of1 u-text-center u-mb u-italic">
				<a href="<?php echo $doc_website; ?>" target="_blank" rel="noopener noreferrer" class="website-link"><?php echo $doc_website; ?></a>
			</div>
		<?php endif; ?>

		<div class="contact-numbers u-mb u-flex u-flex-col u-flex-start">
			<div class="phone contact-numbers__item">
				<?php if ( $doc_phone ) : ?>
					<a class="u-text-color contact-phone u-inline-block" href="tel:<?php echo $doc_phone; ?>" itemprop="telephone"><?php echo $doc_phone; ?></a>
				<?php endif; ?>
			</div>
			<div class="fax contact-numbers__item">
				<?php if ( $doc_fax ) : ?>
					<span class="contact-fax u-inline-block" itemprop="faxNumber"><?php abe_do_svg( 'fax', '1em' ); ?> <?php echo $doc_fax; ?></span>
				<?php endif; ?>
			</div>
			<?php if ( $doc_email && is_single() ) : ?>
				<a href="mailto:<?php echo antispambot( $doc_email, 1 ); ?>" target="_blank" rel="noopener noreferrer" class="no-pseudo btn btn-sm btn-hollow u-mt05"><?php abe_do_svg( 'mail', '1em' ); ?> Email</a>
			<?php endif; ?>
		</div>

		<div class="contact-address-wrap u-flex u-flex-col u-flex-end u-mb">
			<?php if ( $doc_city ) : ?>
				<a class="u-text-color contact-address u-inline-block" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" href="<?php echo esc_url( $map_link ); ?>" target="_blank" rel="noopener noreferrer">
					<span itemprop="streetAddress">
						<?php echo $doc_street; ?><br>
						<?php if ( $doc_street_2 ) { ?>
							<?php echo $doc_street_2; ?><br>
						<?php } ?>
					</span>
					<span class="u-ml1" itemprop="addressLocality"><?php echo $doc_city; ?>, <?php echo $doc_state; ?></span>
					<span itemprop="postalCode"><?php echo $doc_zip; ?></span>
				</a>
				<?php if ( is_single() ) { ?>
					<a href="<?php echo esc_url( $dir_link ); ?>" target="_blank" rel="noopener noreferrer" class="no-pseudo btn btn-sm btn-hollow u-mt05">
						<?php abe_do_svg( 'car', '1em' ); ?> Directions
					</a>
				<?php } ?>
			<?php endif; ?>
		</div>

	</div>
</div>
