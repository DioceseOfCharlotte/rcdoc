NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

ready(function () {
	var glassTiles = document.querySelectorAll('.tile');

	for (var tile of glassTiles) {
		tile.classList.add('is-animating');
		tile.classList.add('mui-enter-active');
	}
});
