<?php
/**
 * Contact fields for parishes
 */
?>

<?php


$address = get_field('doc_street') . "+" . get_field('doc_city') . "+" . get_field('doc_state') . "+" . get_field('doc_zip');



$map_link = "http://maps.google.com/maps?z=16&q=" . $address;

?>

<div class="u-flex contact-info u-flex-wrap u-flex-justify-between u-mxn1">
<?php

ob_start();
?>
<div class="contact-numbers u-overflow-hidden u-px2 u-inline-block">
<?php if( get_field('doc_phone_number') ): ?>
    <div class="phone u-mb1" itemprop="telephone"><a class="contact-link" href="tel:<?php the_field('doc_phone_number'); ?>"><i class="material-icons u-mr1">&#xE0CD;</i><?php the_field('doc_phone_number'); ?></a></div>
<?php endif; ?>
<?php if( get_field('doc_fax') ): ?>
    <div class="fax u-mb1" itemprop="faxNumber"><i class="u-bold u-mr1">FAX</i><?php the_field('doc_fax'); ?></div>
<?php endif; ?>
</div>

<?php
echo ob_get_clean();
if( get_field('doc_city') ):
ob_start(); ?>
<div class="contact-address u-px2 u-inline-block u-mb1" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
    <a class="contact-link" href="<?php echo esc_url( $map_link ) ?>" target="_blank"><i class="material-icons u-align-top map-marker u-mr1">&#xE55F;</i>
    <span class="u-inline-block">
        <span itemprop="streetAddress">
            <?php the_field('doc_street'); ?><br>
            <?php if( get_field('doc_street_2') ) { ?>
            <?php the_field('doc_street_2'); ?><br>
            <?php } ?>
        </span>
        <span itemprop="addressLocality"><?php the_field('doc_city'); ?>, <?php the_field('doc_state'); ?></span>
        <span itemprop="postalCode"><?php the_field('doc_zip'); ?></span>
    </span>
</a>
</div>
<?php echo ob_get_clean(); ?>
<?php endif; ?>

<?php if( get_field('doc_email') ): ?>
    <div class="email u-1of1 u-mb1 u-px2" itemprop="email"><a class="contact-link" href="mailto:<?php the_field('doc_email'); ?>"><i class="material-icons u-mr1">&#xE0BE;</i><?php the_field('doc_email'); ?></a></div>
<?php endif; ?>
<?php if( get_field('doc_website') ): ?>
    <div class="website-address u-bg-2-glass u-1of1 u-text-center" itemprop="url"><a class="contact-link u-1of1 btn u-h6" href="<?php the_field('doc_website'); ?>" target="_blank"><?php the_field('doc_website'); ?><i class="u-px1 u-h6 material-icons">&#xE89E;</i></a></div>
<?php endif; ?>
</div>
