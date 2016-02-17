<?php
/**
 * Contact fields for parishes
 */
?>

<?php


$address = get_field('doc_street') . "+" . get_field('doc_city') . "+" . get_field('doc_state') . "+" . get_field('doc_zip');



$map_link = "http://maps.google.com/maps?z=16&q=" . $address;

?>

<div class="contact-info u-inline-block u-1of1 u-2of3-md u-align-middle u-p1 u-h6">
<?php

ob_start();
?>
<div class="contact-numbers u-1of1 u-p1 u-mb1 u-flex u-flex-justify-between">

    <div class="phone contact-numbers__item u-1of2-md u-inline-block u-spacer16">
<?php if( get_field('doc_phone_number') ): ?>
        <a class="contact-link u-inline-block" href="tel:<?php the_field('doc_phone_number'); ?>" itemprop="telephone"><i class="material-icons u-mr1">&#xE0CD;</i><?php the_field('doc_phone_number'); ?></a>
<?php endif; ?>
    </div>


    <div class="fax contact-numbers__item u-1of2-md u-inline-block u-spacer16">
<?php if( get_field('doc_fax') ): ?>
        <span class="contact-fax u-inline-block" itemprop="faxNumber"><i class="u-bold u-mr1">FAX</i><?php the_field('doc_fax'); ?></span>
<?php endif; ?>
    </div>

</div>

<?php
echo ob_get_clean();

ob_start(); ?>
<div class="contact-address u-1of1 u-inline-block u-mb1">
<?php if( get_field('doc_city') ): ?>
    <a class="contact-link u-flex u-p1" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" href="<?php echo esc_url( $map_link ) ?>" target="_blank"><i class="material-icons u-align-top map-marker u-mr1">&#xE55F;</i>
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



<div class="email u-spacer16 u-1of1 u-truncate">
<?php if( get_field('doc_email') ): ?>
    <a class="contact-link u-p1" itemprop="email" href="mailto:<?php the_field('doc_email'); ?>"><i class="material-icons u-mr1">&#xE0BE;</i><?php the_field('doc_email'); ?></a>
<?php endif; ?>
</div>


<?php if( get_field('doc_website') ): ?>
    <a class="contact-link u-abs u-top0 u-bg-2 u-right0 mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect u-mtn1 u-mrn1" itemprop="url" href="<?php the_field('doc_website'); ?>" target="_blank"><i class="material-icons">&#xE89E;</i></a>
<?php endif; ?>

</div>
