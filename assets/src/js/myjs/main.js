// Open the first Tab by default.
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


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

astro.init({
    selector: '[data-active-toggle]', // Navigation toggle selector
	selected: 'data-active-toggle',
    toggleActiveClass: 'is-active', // Class added to active dropdown toggles on small screens
    navActiveClass: 'is-active', // Class added to active dropdown content areas on small screens
    initClass: 'js-cl', // Class added to `<html>` element when initiated
});
