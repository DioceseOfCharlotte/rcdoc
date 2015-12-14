var $ = jQuery.noConflict();

(function($) {
	$(document).on('facetwp-loaded', function() {
		componentHandler.upgradeAllRegistered();
	});
})(jQuery);


TweenMax.staggerFrom(".tile", 1, {
	y: -900,
	ease: Power3.easeOut
}, 0.3);

TweenMax.staggerFrom(".tile", 0.5, {
	opacity: 0.5
}, 0.2);



$(".tile").click(function() {
	TweenMax.staggerTo(".tile", 0.8, {
		y: -900,
		opacity: 0,
		ease: Back.easeIn.config(0.7),
	}, 0.1);
});
