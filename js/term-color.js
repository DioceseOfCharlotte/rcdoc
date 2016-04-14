jQuery( document ).ready( function( $ ) {
    'use strict';

    $( '.editinline' ).on( 'click', function() {
        var tag_id = $( this ).parents( 'tr' ).attr( 'id' ),
			svg = $( 'td.svg span', '#' + tag_id ).data( 'svg' );

		if ( typeof( svg ) !== 'undefined' ) {
			setTimeout( function() {
				$( 'select[name="term-svg"]', '.inline-edit-row' ).val( svg );
			}, 100 );
		}
    } );
} );
