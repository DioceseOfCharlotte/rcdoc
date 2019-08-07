<?php
/**
 * Contact Footer.
 *
 * @package  RCDOC
 */

$doc_street   = get_post_meta( get_the_ID(), 'doc_street', true );
$doc_street_2 = get_post_meta( get_the_ID(), 'doc_street_2', true );
$doc_city     = get_post_meta( get_the_ID(), 'doc_city', true );
$doc_state    = get_post_meta( get_the_ID(), 'doc_state', true );
$doc_zip      = get_post_meta( get_the_ID(), 'doc_zip', true );
$doc_email    = get_post_meta( get_the_ID(), 'doc_email', true );
$doc_website  = get_post_meta( get_the_ID(), 'doc_website', true );
$address      = $doc_street . '+' . $doc_city . '+' . $doc_state . '+' . $doc_zip;
$map_link     = 'https://maps.google.com/maps/place/' . $address;
$dir_link     = 'https://maps.google.com/maps/dir/' . $address;
$distance     = facetwp_get_distance();
$doc_grades   = get_post_meta( get_the_ID(), 'doc_grade_level', true );

?>

<footer <?php hybrid_attr( 'entry-footer' ); ?>>
<?php
	// .grade-levels span:last-of-type {
	// 	display: none;
	// }
// if ( $doc_grades ) {

// 	$grade_level = '';

// 	foreach ( $doc_grades as $doc_grade ) {
// 		$grade_level .= "{$doc_grade}<span>, </span>";
// 	}

// 	echo "<p class='grade-levels u-text-right'>Serving grades: {$grade_level}</p>";
// }
?>
<div class="u-1of1 u-flex u-flex-js u-flex-end u-flex-wrap">
<?php if ( $doc_email ) : ?>
	<a href="mailto:<?php echo antispambot( $doc_email, 1 ); ?>" target="_blank" rel="noopener noreferrer" class="no-pseudo btn btn-sm btn-hollow u-mr05"><?php abe_do_svg( 'mail', '1em' ); ?> Email</a>
<?php endif; ?>
<?php if ( $doc_website ) : ?>
	<a href="<?php echo $doc_website; ?>" target="_blank" rel="noopener noreferrer" class="no-pseudo btn btn-sm btn-hollow u-mr05"><?php abe_do_svg( 'globe', '1em' ); ?> Website</a>
<?php endif; ?>
<?php if ( $doc_city ) : ?>
	<a href="<?php echo esc_url( $dir_link ); ?>" target="_blank" rel="noopener noreferrer" class="no-pseudo btn btn-sm btn-hollow u-mr05">
		<?php abe_do_svg( 'car', '1em' ); ?> Directions
		<?php if ( false !== $distance ) { ?>
			<span class="u-text-link">&nbsp;<?php echo round( $distance, 2 ); ?> miles</span>
		<?php } ?>
	</a>
<?php endif; ?>
<?php if ( has_term( 'macs', 'school_system' ) ) : ?>

	<a class="btn btn-sm macs-logo u-py0 u-ml-auto" href="<?php the_permalink( '10073' ); ?>"><?php abe_do_svg( 'macs', '2.5em', '5em' ); ?><span class="screen-reader-text">Mecklenburg Area Catholic Schools</span></a>

<?php endif; ?>

<?php if ( has_term( 'yes', 'special_needs' ) ) : ?>

	<a class="btn btn-sm uni-access u-py0 u-ml-auto" href="<?php the_permalink( '10073' ); ?>"><?php abe_do_svg( 'universal-access', '2.5em', '5em' ); ?><span class="screen-reader-text">accessible</span></a>

<?php endif; ?>
</div>

	<?php abe_edit_link(); ?>
</footer><!-- .entry-footer -->
