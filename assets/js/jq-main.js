
var $ = jQuery.noConflict();

(function($) {
		$(document).on('facetwp-loaded', function() {
				componentHandler.upgradeAllRegistered();
		 });
})(jQuery);


TweenMax.staggerFrom(".tile", 1, {
	y:-900,
	ease: Power3.easeOut
}, 0.3);

TweenMax.staggerFrom(".tile", 0.5, {
	opacity:0.5
}, 0.2);



$(".tile").click(function(){
	TweenMax.staggerTo(".tile", 0.8, {
		y:-900,
		opacity:0,
		ease:Back.easeIn.config(0.7),
	}, 0.1);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcS1tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxudmFyICQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuXG4oZnVuY3Rpb24oJCkge1xuXHRcdCQoZG9jdW1lbnQpLm9uKCdmYWNldHdwLWxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkKCk7XG5cdFx0IH0pO1xufSkoalF1ZXJ5KTtcblxuXG5Ud2Vlbk1heC5zdGFnZ2VyRnJvbShcIi50aWxlXCIsIDEsIHtcblx0eTotOTAwLFxuXHRlYXNlOiBQb3dlcjMuZWFzZU91dFxufSwgMC4zKTtcblxuVHdlZW5NYXguc3RhZ2dlckZyb20oXCIudGlsZVwiLCAwLjUsIHtcblx0b3BhY2l0eTowLjVcbn0sIDAuMik7XG5cblxuXG4kKFwiLnRpbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcblx0VHdlZW5NYXguc3RhZ2dlclRvKFwiLnRpbGVcIiwgMC44LCB7XG5cdFx0eTotOTAwLFxuXHRcdG9wYWNpdHk6MCxcblx0XHRlYXNlOkJhY2suZWFzZUluLmNvbmZpZygwLjcpLFxuXHR9LCAwLjEpO1xufSk7XG4iXSwiZmlsZSI6ImpxLW1haW4uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
