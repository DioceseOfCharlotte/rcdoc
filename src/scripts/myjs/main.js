
// Steer fix header
window.onload = function() {
	// getting the element where the message goes
	var header = document.getElementById('header');
	// calling steer
	steer.set({
		events: false,
		up: function(position) {
			header.classList.add('fadeInDown');
			header.classList.remove('fadeOutUp');
			header.classList.add('u-fix');
		},
		down: function(position) {
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
