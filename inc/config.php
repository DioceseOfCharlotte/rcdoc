<?php
/**
 * Settings and constants.
 *
 * @package  RCDOC
 */

 /**
  * Post Groups.
  */
 function doc_department_cpts() {
 	$cpts = array( 'archive_post','bishop', 'deacon', 'development', 'education', 'finance', 'human_resources', 'hispanic_ministry', 'housing', 'info_tech', 'liturgy', 'macs', 'multicultural', 'planning', 'property', 'tribunal', 'vocation' );
 	return $cpts;
 }

function doc_place_cpts() {
	$cpts = array(
		'department',
		'parish',
		'school',
	);
	return $cpts;
}


function doc_home_tiles() {
	$cpts = array(
		'department',
		'cpt_archive',
	);
	return array_merge( $cpts, doc_department_cpts() );
}
