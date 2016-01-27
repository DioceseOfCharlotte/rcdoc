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

    <div class="phone u-mb1 u-spacer16">
<?php if( get_field('doc_phone_number') ): ?>
        <a class="contact-link" href="tel:<?php the_field('doc_phone_number'); ?>" itemprop="telephone"><i class="material-icons u-mr1">&#xE0CD;</i><?php the_field('doc_phone_number'); ?></a>
<?php endif; ?>
    </div>


    <div class="fax u-mb1 u-spacer16">
<?php if( get_field('doc_fax') ): ?>
        <span itemprop="faxNumber"><i class="u-bold u-mr1">FAX</i><?php the_field('doc_fax'); ?></span>
<?php endif; ?>
    </div>

</div>

<?php
echo ob_get_clean();

ob_start(); ?>
<div class="contact-address u-px2 u-inline-block u-mb1">
<?php if( get_field('doc_city') ): ?>
    <a class="contact-link" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" href="<?php echo esc_url( $map_link ) ?>" target="_blank"><i class="material-icons u-align-top map-marker u-mr1">&#xE55F;</i>
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
<?php endif; ?>
</div>
<?php echo ob_get_clean(); ?>



    <div class="email u-spacer16 u-1of1 u-mb1 u-px2">
<?php if( get_field('doc_email') ): ?>
        <a class="contact-link" itemprop="email" href="mailto:<?php the_field('doc_email'); ?>"><i class="material-icons u-mr1">&#xE0BE;</i><?php the_field('doc_email'); ?></a>
<?php endif; ?>
    </div>


<?php if( get_field('doc_website') ): ?>
    <div class="website-address u-bg-tint-1 u-spacer1 u-1of1 u-text-center">
        <a class="contact-link u-link u-1of1 btn u-h6" itemprop="url" href="<?php the_field('doc_website'); ?>" target="_blank"><?php the_field('doc_website'); ?><i class="u-px1 u-h6 material-icons">&#xE89E;</i></a>
    </div>
<?php endif; ?>

</div>
