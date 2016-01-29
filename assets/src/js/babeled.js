var arrayMethods = Object.getOwnPropertyNames(Array.prototype);

arrayMethods.forEach(attachArrayMethodsToNodeList);

function attachArrayMethodsToNodeList(methodName) {
	if (methodName !== 'length') {
		NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
	}
}

ready(function () {
	let glassTiles = document.querySelectorAll('.js-tile');

	for (let tile of glassTiles) {
		tile.classList.add('is-animating');
	}
});
