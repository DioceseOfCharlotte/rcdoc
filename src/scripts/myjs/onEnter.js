(function() {
	'use strict';

	/**
	 * Class constructor.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 *
	 * @constructor
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	var Tile = function Tile(element) {
		this.element_ = element;
		this.init();
	};
	window['Tile'] = Tile;

	/**
	 * Store strings for class names defined by this component.
	 *
	 * @enum {string}
	 * @private
	 */
	Tile.prototype.CssClasses_ = {
		TILE_IS_ACTIVE: 'is-active',
	};


	Tile.prototype.init = function() {
		this.boundClickHandler = this.clickHandler.bind(this);
		this.element_.addEventListener('click', this.boundClickHandler);
	};

	Tile.prototype.clickHandler = function(event) {
		var target = event.target;
		if (target.classList.contains(this.CssClasses_.TILE_IS_BEFORE)) {
			var targetSibling = target.previousElementSibling;
		} else {
			var targetSibling = target.nextElementSibling;
		}
		var targetParent = target.parentElement;
		if (!target.classList.contains(this.CssClasses_.TILE_IS_ACTIVE)) {
			TweenLite.set(targetSibling, {
				height: "auto",
				opacity: 1
			});
			TweenLite.from(targetSibling, 0.2, {
				height: 0,
				opacity: 0
			});
			TweenLite.to(targetSibling, 0.2, {
				paddingTop: 10,
				paddingBottom: 10
			});
			target.classList.add(this.CssClasses_.TILE_IS_ACTIVE);
			targetSibling.classList.add(this.CssClasses_.TILE_IS_ACTIVE);
			if (target.classList.contains(this.CssClasses_.TILE_PARENT)) {
				targetParent.classList.add(this.CssClasses_.PARENT_IS_ACTIVE);
			}
		} else {
			TweenLite.to(targetSibling, 0.2, {
				height: 0,
				opacity: 0
			});
			TweenLite.to(targetSibling, 0.2, {
				paddingTop: 0,
				paddingBottom: 0
			});
			target.classList.remove(this.CssClasses_.TILE_IS_ACTIVE);
			targetSibling.classList.remove(this.CssClasses_.TILE_IS_ACTIVE);
			if (target.classList.contains(this.CssClasses_.TILE_PARENT)) {
				targetParent.classList.remove(this.CssClasses_.PARENT_IS_ACTIVE);
			}
		}
	};

	/**
	 * Downgrade the component.
	 *
	 * @private
	 */
	Tile.prototype.mdlDowngrade_ = function() {
		this.element_.removeEventListener('click', this.boundClickHandler);
	};

	/**
	 * Public alias for the downgrade method.
	 *
	 * @public
	 */
	Tile.prototype.mdlDowngrade =
		Tile.prototype.mdlDowngrade_;

	Tile.prototype['mdlDowngrade'] =
		Tile.prototype.mdlDowngrade;

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
		constructor: Tile,
		classAsString: 'Tile',
		cssClass: 'js-dropdown'
	});
})();
