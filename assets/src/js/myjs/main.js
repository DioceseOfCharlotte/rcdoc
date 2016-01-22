// Open the first Tab by default.
var ready = function (fn) {
	// Sanity check
	if (typeof fn !== 'function') return;

	// If document is already loaded, run method
	if (document.readyState === 'complete') {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener('DOMContentLoaded', fn, false);
};

ready(function () {
	var firstTab = document.getElementsByClassName('mdl-tabs__tab')[0];
	var firstPanel = document.getElementsByClassName('mdl-tabs__panel')[0];
	firstTab.classList.toggle('is-active');
	firstPanel.classList.toggle('is-active');
});

// HEADROOM JS
(function () {
	var header = document.querySelector('#header');

	new Headroom(header, {
		tolerance: {
			down: 40,
			// up : 20
		},
		// offset : 200,
		classes: {
			initial: 'animated',
			pinned: 'mui-enter-active',
			unpinned: 'mui-leave-active',
			top: 'is-top',
			notTop: 'not-top'
		}
	}).init();
}());

ready(function() {
	var elmnt = document.getElementById("header");
	var fakeHeight = elmnt.offsetHeight;

	document.getElementById('head-space').style.height = fakeHeight + 'px';
});
