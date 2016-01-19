// Open the first Tab by default.
var ready = function(fn) {

	// Sanity check
	if (typeof fn !== 'function') return;

	// If document is already loaded, run method
	if (document.readyState === 'complete') {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener('DOMContentLoaded', fn, false);

};


ready(function() {
	var first_tab = document.getElementsByClassName("mdl-tabs__tab")[0];
	var first_panel = document.getElementsByClassName("mdl-tabs__panel")[0];
	first_tab.classList.toggle("is-active");
	first_panel.classList.toggle("is-active");
});


// HEADROOM JS
(function() {
    var header = document.querySelector("#header");

    new Headroom(header, {
        tolerance: {
          down : 40,
          //up : 20
        },
        //offset : 200,
        classes: {
    "initial": "animated",
    "pinned": "slideInDown",
    "unpinned": "slideOutUp",
	"top" : "is-top",
	"notTop" : "not-top"
        }
    }).init();

}());
