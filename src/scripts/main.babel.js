var domReady = function(callback) {
	document.readyState === "interactive" ||
		document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


// Off-canvas sidebar
(function() {
	'use strict';

	let querySelector = document.querySelector.bind(document);

	let sideNav = querySelector('#menu-primary');
	let body = document.body;
	let siteHeader = querySelector('#header');
	let menuBtn = querySelector('#side-menu-toggle');
	let contentMask = querySelector('#content-mask');

	function closeMenu() {
		body.classList.remove('u-overflow-hidden');
		siteHeader.classList.remove('sidebar-open');
		sideNav.classList.remove('is-active');
		contentMask.classList.remove('is-active');
	}

	function toggleMenu() {
		body.classList.toggle('u-overflow-hidden');
		siteHeader.classList.toggle('sidebar-open');
		sideNav.classList.toggle('is-active');
		contentMask.classList.toggle('is-active');
		sideNav.classList.add('has-opened');
	}

	contentMask.addEventListener('click', closeMenu);
	menuBtn.addEventListener('click', toggleMenu);
	sideNav.addEventListener('click', function(event) {
		if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
			closeMenu();
		}
	});
})();

// Header Right Dropdown Sidebar
(function() {
	'use strict';

	let querySelector = document.querySelector.bind(document);

	let dropBtn = querySelector('#js-dropbtn');
	let dropDown = querySelector('#js-dropdown');


	function closeMenu() {
		dropDown.classList.remove('is-active');
		dropBtn.classList.remove('is-active');
	}

	function toggleMenu() {
		dropDown.classList.toggle('is-active');
		dropBtn.classList.toggle('is-active');
	}

	dropBtn.addEventListener('click', toggleMenu);
	dropDown.addEventListener('click', function(event) {
		if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
			closeMenu();
		}
	});
})();


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
		if (y < 1) {
			header.classList.remove('u-fix');
			header.classList.add('is-top');
		}
	};
}
