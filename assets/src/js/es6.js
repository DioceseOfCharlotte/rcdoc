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


(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var sideNav = querySelector('#menu-primary');
  var body = document.body;
  var siteHeader = querySelector('#header');
  var menuBtn = querySelector('.menu-toggle');
  var contentMask = querySelector('#content-mask');

  function closeMenu() {
    body.classList.remove('u-overflow-hidden');
    siteHeader.classList.remove('sidebar-open');
    sideNav.classList.remove('is-active');
	contentMask.classList.remove('u-visible');
  }

  function toggleMenu() {
    body.classList.toggle('u-overflow-hidden');
    siteHeader.classList.toggle('sidebar-open');
    sideNav.classList.toggle('is-active');
    contentMask.classList.toggle('u-visible');
    sideNav.classList.add('has-opened');
  }

  contentMask.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  sideNav.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
})();
