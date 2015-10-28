<?php
/**
 * Contact fields for parishes
 */
?>

<?php


$address = get_field('doc_street') . "+" . get_field('doc_city') . "+" . get_field('doc_state') . "+" . get_field('doc_zip');



$map_link = "http://maps.google.com/maps?z=16&q=" . $address;




$output = '<div class="u-text-gray card-body" itemscope itemtype="http://schema.org/Organization">';
$output .= '<p class="card-address" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress"><a href="' . esc_url( $map_link ) . '" target="_blank"><i class="material-icons map-marker">&#xE55F;</i>';
ob_start();
?>
        <span itemprop="streetAddress">
            <?php the_field('doc_street'); ?><br>
            <?php the_field('doc_street_2'); ?>
        </span>
        <span itemprop="addressLocality"><?php the_field('doc_city'); ?>, <?php the_field('doc_state'); ?></span>
        <span itemprop="postalCode"><?php the_field('doc_zip'); ?></span>

<?php
$output .= ob_get_clean();
$output .= '</a></p>';
ob_start(); ?>
<p class="contact-numbers">
<?php if( get_field('doc_phone_number') ): ?>
    <p class="phone" itemprop="telephone"><a href="tel:<?php the_field('doc_phone_number'); ?>"><i class="u-align-middle material-icons">&#xE0CD;</i> <?php the_field('doc_phone_number'); ?></a></p>
<?php endif; ?>
<?php if( get_field('doc_fax') ): ?>
    <p class="fax" itemprop="faxNumber"><i class="u-bold u-align-middle">FAX</i> <?php the_field('doc_fax'); ?></p>
<?php endif; ?>
</p>
<?php if( get_field('doc_email') ): ?>
    <p class="email" itemprop="email"><a href="mailto:<?php the_field('doc_email'); ?>"><i class="u-align-middle material-icons">&#xE0BE;</i> <?php the_field('doc_email'); ?></a></p>
<?php endif; ?>
<?php if( get_field('doc_website') ): ?>
    <p class="website" itemprop="url"><a href="<?php the_field('doc_website'); ?>"><i class="u-align-middle material-icons">&#xE80B;</i> <?php the_field('doc_website'); ?></a></p>
<?php endif; ?>
<?php
$output .= ob_get_clean();
$output .= '</div>';




echo $output;
