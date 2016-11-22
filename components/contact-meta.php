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
	$width = 'u-3of4';
}
?>

<div class="contact-info u-inline-block <?php echo $width ?> u-align-middle u-p1 u-h6">

<?php ob_start(); ?>
	<div class="contact-wrapper u-mb1 u-flex u-flex-wrap u-flex-jb">

<div class="contact-numbers">
		<div class="phone contact-numbers__item">
			<?php if ( $doc_phone ) : ?>
				<a class="contact-phone u-inline-block" href="tel:<?php echo $doc_phone ?>" itemprop="telephone"><?php echo $doc_phone ?></a>
			<?php endif; ?>
		</div>
		<div class="fax contact-numbers__item">
			<?php if ( $doc_fax ) : ?>
				<span class="contact-fax u-inline-block" itemprop="faxNumber"><i class="u-opacity fa fa-fax" aria-hidden="true"></i> <?php echo $doc_fax ?></span>
			<?php endif; ?>
		</div>
</div>
	<div class="contact-address-wrap">
		<?php if ( $doc_city ) : ?>
			<a class="contact-address u-inline-block" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" href="<?php echo esc_url( $map_link ) ?>" target="_blank">
					<span itemprop="streetAddress">
						<?php echo $doc_street ?><br>
						<?php if ( $doc_street_2 ) { ?>
							<?php echo $doc_street_2 ?><br>
							<?php } ?>
						</span>
						<span class="u-ml1" itemprop="addressLocality"><?php echo $doc_city ?>, <?php echo $doc_state ?></span>
						<span itemprop="postalCode"><?php echo $doc_zip ?></span>
				</a>
			<?php endif; ?>
		</div>
		</div>
		<?php echo ob_get_clean(); ?>


<?php ob_start(); ?>
		<p class="email u-truncate">
			<?php if ( $doc_email ) : ?>
				<a class="contact-mail" itemprop="email" href="mailto:<?php echo $doc_email ?>"><?php echo $doc_email ?></a>
			<?php endif; ?>
		</p>
<?php echo ob_get_clean(); ?>
<?php ob_start(); ?>
		<?php if ( 'parish' === get_post_type( get_the_ID() ) ) : ?>
			<?php $obj = get_post_type_object( get_post_type() );
			$single_name = $obj->labels->singular_name; ?>
			<p class="website">
				<a class="contact-link u-inline-block" itemprop="url" href="<?php echo $doc_website ?>" target="_blank"><?php echo $doc_website ?></a>
			</p>
		<?php endif; ?>
<?php echo ob_get_clean(); ?>
	</div>
