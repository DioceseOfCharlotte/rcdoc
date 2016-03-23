// Open the first Tab by default.
function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}


ready(function() {
	var firstTab = document.getElementsByClassName('mdl-tabs__tab')[0];
	var firstPanel = document.getElementsByClassName('mdl-tabs__panel')[0];
	firstTab.classList.toggle('is-active');
	firstPanel.classList.toggle('is-active');
});


	window.onload = function() {
		// getting the element where the message goes
		var header = document.getElementById('header');
		// calling steer
		steer.set({
			events: false,
			up: function(position){
				header.classList.add('fadeInDown');
				header.classList.remove('fadeOutUp');
				header.classList.add('u-fix');
			},
			down: function(position){
				header.classList.add('fadeOutUp');
				header.classList.remove('fadeInDown');
				header.classList.remove('u-fix');
			}
		});
		window.onscroll = function() {
			var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
			if (y > 131) {
				header.classList.remove('is-top');
				steer.trigger();
			}
			if (y == 0) {
                header.classList.remove('u-fix');
				header.classList.add('is-top');
            }
		};
	}

//
// ;(function() {
//     var throttle = function(type, name, obj) {
//         var obj = obj || window;
//         var running = false;
//         var func = function() {
//             if (running) { return; }
//             running = true;
//             requestAnimationFrame(function() {
//                 obj.dispatchEvent(new CustomEvent(name));
//                 running = false;
//             });
//         };
//         obj.addEventListener(type, func);
//     };
//     throttle ("scroll", "optimizedScroll");
// })();
//
// // to use the script *without* anti-jank, set the event to "scroll" and remove the anonymous function.
//
// window.addEventListener("optimizedScroll", function() {
//     if (window.pageYOffset > 0) {
//         document.getElementById("article-hero").style.transform = "translateY(" + window.pageYOffset*(-.9) + "px)";
//     }
// });
