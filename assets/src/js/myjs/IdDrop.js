(function() {
	'use strict';

	/**
	 * Class constructor for the MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 *
	 * @constructor
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	var IdDrop = function IdDrop(element) {
		this.element_ = element;
		this.init();
	};
	window['IdDrop'] = IdDrop;

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 *
	 * @enum {string}
	 * @private
	 */
	IdDrop.prototype.CssClasses_ = {
		TOGGLE_IS_ACTIVE: 'is-active',
		CONTENT_IS_ACTIVE: 'is-active'
	};


	IdDrop.prototype.init = function() {


		if (this.element_) {
			var forElId = this.element_.getAttribute('data-for');

			if (forElId) {
				this.forElement_ = document.getElementById(forElId);
			}
			this.boundClickHandler = this.handleForClick_.bind(this);
			this.forElement_.addEventListener('click', this.boundClickHandler);
		}
	};

	IdDrop.prototype.handleForClick_ = function(event) {
		var target = event.target;
		var targetSibling = target.nextElementSibling;
		var targetParent = target.parentElement;
		if (!target.classList.contains(this.CssClasses_.DROPDOWN_IS_ACTIVE)) {
			TweenLite.to(targetParent, 0.2, {
				scale: "105%",
				marginTop: "16px",
				ease: Power1.easeInOut
			});
			TweenLite.set(targetSibling, {
				height: "auto",
				opacity: 1
			});
			TweenLite.from(targetSibling, 0.2, {
				height: 0,
				opacity: 0
			});
			TweenLite.to(targetSibling, 0.2, {
				paddingBottom: 10
			});
			target.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetSibling.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetParent.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
		} else {
			TweenLite.to(targetParent, 0.2, {
				scale: 1,
				marginTop: '8px',
				ease: Power1.easeInOut
			});
			TweenLite.to(targetSibling, 0.2, {
				height: 0,
				opacity: 0
			});
			TweenLite.to(targetSibling, 0.2, {
				paddingBottom: 0
			});
			targetSibling.classList.remove(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			target.classList.remove(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetParent.classList.remove(this.CssClasses_.DROPDOWN_IS_ACTIVE);
		}
	};


	/**
	 * Downgrade the component.
	 *
	 * @private
	 */
	IdDrop.prototype.mdlDowngrade_ = function() {
		this.forElement_.removeEventListener('click', this.boundClickHandler);
	};

	/**
	 * Public alias for the downgrade method.
	 *
	 * @public
	 */
	IdDrop.prototype.mdlDowngrade =
		IdDrop.prototype.mdlDowngrade_;

	IdDrop.prototype['mdlDowngrade'] =
		IdDrop.prototype.mdlDowngrade;

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
		constructor: IdDrop,
		classAsString: 'IdDrop',
		cssClass: 'js-dropdown'
	});
})();






houdini.toggleContent = function(toggle, contentID, options) {

	var settings = extend(settings || defaults, options || {}); // Merge user options with defaults
	var content = document.querySelector(contentID); // Get content area

	// Toggle collapse element
	closeCollapseGroup(toggle, settings); // Close collapse group items
	toggle.classList.toggle(this.CssClasses_.TOGGLE_IS_ACTIVE); // Change text on collapse toggle
	content.classList.toggle(this.CssClasses_.CONTENT_IS_ACTIVE); // Collapse or expand content area
	stopVideos(content, settings.contentActiveClass); // If content area is closed, stop playing any videos

	settings.callback(toggle, contentID); // Run callbacks after toggling content

};

/**
 * Handle toggle click events
 * @private
 */
var eventHandler = function(event) {
	var toggle = getClosest(event.target, settings.selector);
	if (toggle) {
		if (toggle.tagName.toLowerCase() === 'a' || toggle.tagName.toLowerCase() === 'button') {
			event.preventDefault();
		}
		var contentID = toggle.hasAttribute('data-collapse') ? toggle.getAttribute('data-collapse') : toggle.parentNode.getAttribute('data-collapse');
		houdini.toggleContent(toggle, contentID, settings);
	}
};
