// Open the first Tab by default.
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


/**
 * A simple forEach() implementation for Arrays, Objects and NodeLists
 * @private
 * @param {Array|Object|NodeList} collection Collection of items to iterate
 * @param {Function} callback Callback function for each iteration
 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
 */
var forEach = function (collection, callback, scope) {
	if (Object.prototype.toString.call(collection) === '[object Object]') {
		for (var prop in collection) {
			if (Object.prototype.hasOwnProperty.call(collection, prop)) {
				callback.call(scope, collection[prop], prop, collection);
			}
		}
	} else {
		for (var i = 0, len = collection.length; i < len; i++) {
			callback.call(scope, collection[i], i, collection);
		}
	}
};


ready(function () {
	var firstTab = document.getElementsByClassName('mdl-tabs__tab')[0];
	var firstPanel = document.getElementsByClassName('mdl-tabs__panel')[0];
	firstTab.classList.toggle('is-active');
	firstPanel.classList.toggle('is-active');
});

ready(function (myTile) {
	var myTile = document.querySelectorAll('.js-tile');
	var drop = {};

		forEach(myTile, function (drop) {
		myTile.classList.add('mui-enter-active');
	});

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
