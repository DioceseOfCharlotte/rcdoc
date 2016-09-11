window.onload = function() {

	var header = document.getElementById('header'),
		y = window.scrollY,
		previousDirection = null,
		direction = null;

	var actions = {
		up: function() {
			header.classList.add('fadeInDown');
			header.classList.remove('fadeOutUp');
			header.classList.add('u-fixed');
		},
		down: function() {
			header.classList.add('fadeOutUp');
			header.classList.remove('fadeInDown');
			header.classList.remove('u-fixed');
		}
	};

	window.addEventListener('scroll', function() {
		direction = window.scrollY > y ? 'down' : 'up';

		// update scroll position
		y = window.scrollY;

		if (y > 131) {
			// execute only when more than 150 pixels have been scrolled
			header.classList.remove('is-top');

			if (direction !== previousDirection) {
				// update direction value
				previousDirection = direction;

				actions[direction]();
			}
		}
		if (y < 1) {
			header.classList.remove('u-fixed');
			header.classList.add('is-top');
		}
	});
}
