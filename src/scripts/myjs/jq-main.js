var $ = jQuery.noConflict();

(function($) {
	$(document).on('facetwp-loaded', function() {
		componentHandler.upgradeAllRegistered();
	});
})(jQuery);
