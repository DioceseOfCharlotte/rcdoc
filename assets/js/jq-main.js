var $ = jQuery.noConflict();

(function($) {
	$(document).on('facetwp-loaded', function() {
		componentHandler.upgradeAllRegistered();
	});
})(jQuery);


// TweenMax.staggerFrom(".tile", 1, {
// 	y: -900,
// 	ease: Power3.easeOut
// }, 0.3);
//
// TweenMax.staggerFrom(".tile", 0.5, {
// 	opacity: 0.5
// }, 0.2);



$(".tile").click(function() {
	TweenMax.staggerTo(".tile", 0.8, {
		y: -900,
		opacity: 0,
		ease: Back.easeIn.config(0.7),
	}, 0.1);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcS1tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuKGZ1bmN0aW9uKCQpIHtcblx0JChkb2N1bWVudCkub24oJ2ZhY2V0d3AtbG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZCgpO1xuXHR9KTtcbn0pKGpRdWVyeSk7XG5cblxuLy8gVHdlZW5NYXguc3RhZ2dlckZyb20oXCIudGlsZVwiLCAxLCB7XG4vLyBcdHk6IC05MDAsXG4vLyBcdGVhc2U6IFBvd2VyMy5lYXNlT3V0XG4vLyB9LCAwLjMpO1xuLy9cbi8vIFR3ZWVuTWF4LnN0YWdnZXJGcm9tKFwiLnRpbGVcIiwgMC41LCB7XG4vLyBcdG9wYWNpdHk6IDAuNVxuLy8gfSwgMC4yKTtcblxuXG5cbiQoXCIudGlsZVwiKS5jbGljayhmdW5jdGlvbigpIHtcblx0VHdlZW5NYXguc3RhZ2dlclRvKFwiLnRpbGVcIiwgMC44LCB7XG5cdFx0eTogLTkwMCxcblx0XHRvcGFjaXR5OiAwLFxuXHRcdGVhc2U6IEJhY2suZWFzZUluLmNvbmZpZygwLjcpLFxuXHR9LCAwLjEpO1xufSk7XG4iXSwiZmlsZSI6ImpxLW1haW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
