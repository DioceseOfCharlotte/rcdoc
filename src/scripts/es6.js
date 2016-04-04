

// Off-canvas sidebar
(function () {
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
  sideNav.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
})();


var domReady = function (callback) {
  document.readyState === "interactive" ||
  document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
