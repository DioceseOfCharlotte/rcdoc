/*
 * steer - v2.1.1
 * https://github.com/jeremenichelli/steer
 * 2014 (c) Jeremias Menichelli - MIT License
*/

(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.steer = factory();
    }
})(this, function() {
    'use strict';

    var y = 0,
        root = window,
        config = {
            events: true,
            up: function() {},
            down: function() {}
        },
        direction = null,
        oldDirection = null;

    /*
     * Replaces configuration values with custom ones
     * @method _setConfigObject
     * @param {Object} obj - object containing custom options
     */
    var _setConfigObject = function(obj) {
        // override with custom attributes
        if (typeof obj === 'object') {
            for (var key in config) {
                if (typeof obj[key] !== 'undefined') {
                    config[key] = obj[key];
                }
            }
        }
    };

    /*
     * Main function which sets all variables and bind events if needed
     * @method _set
     * @param {Object} configObj object containing custom options
     */
    var _set = function(configObj) {
        _setConfigObject(configObj);

        if (config.events) {
            root.addEventListener('scroll', _compareDirection);
        }
    };

    /*
     * Cross browser way to get how much is scrolled
     * @method _getYPosition
     */
    var _getYPosition = function() {
        return root.scrollY || root.pageYOffset;
    };

    /*
     * Returns direction and updates position variable
     * @method _getDirection
     */
    var _getDirection = function() {
        var actualPosition = _getYPosition(),
            direction;

        direction = actualPosition < y ? 'up' : 'down';

        // updates general position variable
        y = actualPosition;

        return direction;
    };

    /*
     * Compares old and new directions and call specific function
     * @method _compareDirection
     */
    var _compareDirection = function() {
        direction = _getDirection();

        // when direction changes update and call method
        if (direction !== oldDirection) {
            oldDirection = direction;
            config[direction].call(root, y);
        }
    };

    return {
        set: _set,
        trigger: _compareDirection
    };
});

"use strict";

var domReady = function domReady(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

// Off-canvas sidebar
(function () {
	'use strict';

	var querySelector = document.querySelector.bind(document);

	var sideNav = querySelector('#menu-primary');
	var body = document.body;
	var siteHeader = querySelector('#header');
	var menuBtn = querySelector('#side-menu-toggle');
	var contentMask = querySelector('#content-mask');

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

// Header Right Dropdown Sidebar
(function () {
	'use strict';

	var querySelector = document.querySelector.bind(document);

	var dropBtn = querySelector('#js-dropbtn');
	var dropDown = querySelector('#js-dropdown');

	function closeMenu() {
		dropDown.classList.remove('is-active');
		dropBtn.classList.remove('is-active');
	}

	function toggleMenu() {
		dropDown.classList.toggle('is-active');
		dropBtn.classList.toggle('is-active');
	}

	dropBtn.addEventListener('click', toggleMenu);
	dropDown.addEventListener('click', function (event) {
		if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
			closeMenu();
		}
	});
})();

// Steer fix header
window.onload = function () {
	// getting the element where the message goes
	var header = document.getElementById('header');
	// calling steer
	steer.set({
		events: false,
		up: function up(position) {
			header.classList.add('fadeInDown');
			header.classList.remove('fadeOutUp');
			header.classList.add('u-fix');
		},
		down: function down(position) {
			header.classList.add('fadeOutUp');
			header.classList.remove('fadeInDown');
			header.classList.remove('u-fix');
		}
	});
	window.onscroll = function () {
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
};