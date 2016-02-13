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
			initial: 'animating',
			pinned: 'fadeInDown',
			unpinned: 'fadeOutUp',
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
