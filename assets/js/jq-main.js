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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcS1tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuKGZ1bmN0aW9uKCQpIHtcblx0JChkb2N1bWVudCkub24oJ2ZhY2V0d3AtbG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZCgpO1xuXHR9KTtcbn0pKGpRdWVyeSk7XG5cblxuVHdlZW5NYXguc3RhZ2dlckZyb20oXCIudGlsZVwiLCAxLCB7XG5cdHk6IC05MDAsXG5cdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG59LCAwLjMpO1xuXG5Ud2Vlbk1heC5zdGFnZ2VyRnJvbShcIi50aWxlXCIsIDAuNSwge1xuXHRvcGFjaXR5OiAwLjVcbn0sIDAuMik7XG5cblxuXG4kKFwiLnRpbGVcIikuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFR3ZWVuTWF4LnN0YWdnZXJUbyhcIi50aWxlXCIsIDAuOCwge1xuXHRcdHk6IC05MDAsXG5cdFx0b3BhY2l0eTogMCxcblx0XHRlYXNlOiBCYWNrLmVhc2VJbi5jb25maWcoMC43KSxcblx0fSwgMC4xKTtcbn0pO1xuIl0sImZpbGUiOiJqcS1tYWluLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
