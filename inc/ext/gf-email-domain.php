<?php
/**
* Gravity Wiz // Gravity Forms // Email Domain Validator
*
* This snippets allows you to exclude a list of invalid domains or include a list of valid domains for your Gravity Form Email fields.
*
* @version   1.2
* @author    David Smith <david@gravitywiz.com>
* @license   GPL-2.0+
* @link      https://gravitywiz.com/banlimit-email-domains-for-gravity-form-email-fields/
*/

class GW_Email_Domain_Validator {
	private $_args;

	function __construct( $args ) {
		$this->_args = wp_parse_args( $args, array(
			'form_id' => false,
			'field_id' => false,
			'domains' => false,
			'validation_message' => __( 'Sorry, <strong>%s</strong> email accounts are not eligible for this form.' ),
			'mode' => 'ban',// also accepts "limit"
		) );
			// convert field ID to an array for consistency, it can be passed as an array or a single ID
		if ( $this->_args['field_id'] && ! is_array( $this->_args['field_id'] ) ) {
			$this->_args['field_id'] = array( $this->_args['field_id'] ); }
				$form_filter = $this->_args['form_id'] ? "_{$this->_args['form_id']}" : '';
				add_filter( "gform_validation{$form_filter}", array( $this, 'validate' ) );
	}

	function validate( $validation_result ) {
		$form = $validation_result['form'];
		foreach ( $form['fields'] as &$field ) {
			// if this is not an email field, skip
			if ( RGFormsModel::get_input_type( $field ) != 'email' ) {
				continue; }
				// if field ID was passed and current field is not in that array, skip
			if ( $this->_args['field_id'] && ! in_array( $field['id'], $this->_args['field_id'] ) ) {
				continue; }
					$page_number = GFFormDisplay::get_source_page( $form['id'] );
			if ( $page_number > 0 && $field->pageNumber != $page_number ) {
				continue;
			}
					$domain = $this->get_email_domain( $field );
					// if domain is valid OR if the email field is empty, skip
			if ( $this->is_domain_valid( $domain ) || empty( $domain ) ) {
				continue; }
						$validation_result['is_valid'] = false;
						$field['failed_validation'] = true;
						$field['validation_message'] = sprintf( $this->_args['validation_message'], $domain );
		}
					$validation_result['form'] = $form;
					return $validation_result;
	}

	function get_email_domain( $field ) {
		$email = explode( '@', rgpost( "input_{$field['id']}" ) );
		return rgar( $email, 1 );
	}

	function is_domain_valid( $domain ) {
		$mode   = $this->_args['mode'];
		$domain = strtolower( $domain );
		foreach ( $this->_args['domains'] as $_domain ) {
			$_domain = strtolower( $_domain );
			$full_match   = $domain == $_domain;
			$suffix_match = strpos( $domain, '.' ) === 0 && $this->str_ends_with( $domain, $_domain );
			$has_match    = $full_match || $suffix_match;
			if ( $mode == 'ban' && $has_match ) {
				return false;
			} elseif ( $mode == 'limit' && $has_match ) {
				return true;
			}
		}
		return $mode == 'limit' ? false : true;
	}

	function str_ends_with( $string, $text ) {
		$length      = strlen( $string );
		$text_length = strlen( $text );
		if ( $text_length > $length ) {
			return false;
		}
		return substr_compare( $string, $text, $length - $text_length, $text_length ) === 0;
	}
}

class GWEmailDomainControl extends GW_Email_Domain_Validator { }

					# Configuration
					new GW_Email_Domain_Validator( array(
						'form_id' => 2,
						'field_id' => 2,
						'domains' => array(
						'charlottediocese.org',
						// Parishes
						'saintlawrencebasilica.org',
						'saintmaryshelby.org',
						'christthekinghp.org',
						'stehc.org',
						'holycrossnc.com',
						'holyfamilyclemmons.com',
						'holyinfantreidsville.org',
						'holyspiritnc.org',
						'immaculateconceptionchurch.com',
						'stjohnwaynesville.org',
						'ihmchurch.org',
						'ihmhayesville.com',
						'ourladyofconsolation.org',
						'ourladyofmercync.org',
						'olgchurch.org',
						'stjosephbryson.org',
						'parroquiansguadalupe.com',
						'ourladyofmercync.org',
						'ourladycandor.org',
						'olr-nc.org',
						'queenoftheapostles.org',
						'salisburycatholic.org',
						'sacredheartcatholicchurchbrevardnc.org',
						'standrew-sacredheart.org',
						'staloysiushickory.org',
						'standrew-sacredheart.org',
						'stanncharlotte.org',
						'saintbarnabasarden.org',
						'stbenedictgreensboro.net',
						'stbernadettelinville.org',
						'saintcharlesborromeo.org',
						'stdorothys.org',
						'stehc.org',
						'steugene.org',
						'stfrancisofassisi-jefferson.org',
						'stfrancislenoir.com',
						'stfrancisassisifranklin.org',
						'stfrancismocksville.com',
						'stgabrielchurch.org',
						'saintjamescatholic.org',
						'stjoanofarccandler.org',
						'charlottekoreancatholic.com',
						'4sjnc.org',
						'stjohntryon.com',
						'stjohnwaynesville.org',
						'giaoxuthanhgiuse.net',
						'stjoenc.org',
						'stjosephrcc.org',
						'stjosephbryson.org',
						'saintjosephcatholic.org',
						'stleocatholic.org',
						'stlukechurch.net',
						'saintmargaretmarycatholic.org',
						'stmargaretofscotlandmv.org',
						'stmarknc.org',
						'saintmaryshelby.org',
						'stmarysgreensboro.org',
						'stmarysylva.org',
						'stmatthewcatholic.org',
						'stmichaelsgastonia.org',
						'stpatricks.org',
						'stpaulcc.org',
						'stpeterscatholic.org',
						'stphilipapostle.com',
						'stpiusxnc.com',
						'sainttherese.net',
						'stacharlotte.com',
						'stvincentdepaulchurch.com',
						'st-william.net',
						// Schools
						'ashevillecatholic.org',
						'bmhs.us',
						'immac.org',
						'ihm-school.com',
						'olgsch.org',
						'ourladyofmercyschool.org',
						'salisburycatholic.org',
						'stleocatholic.com',
						'stmichaelsgastonia.org',
						'spxschool.com',
						//MACS
						'stmarkcatholic.net',
						'ctkchs.org',
						'stgabrielschool.net',
						'stannschool.net',
						'charlottecatholic.com',
						'htcms.net',
						'stmatthewschool.net',
						'olaschool.net',
						'stpatrickschool.net',
						),
						'validation_message' => __( '<p class="u-regular">Please use your <strong>@charlottediocese.org</strong>, your official parish or school email account. <strong>%s</strong> domains are not eligible for registration.</p><p class="u-italic u-regular">If you have a special circumstance please submit an <a href="/it/">IT Service Request</a>.</p>' ),
						'mode' => 'limit',
					) );
