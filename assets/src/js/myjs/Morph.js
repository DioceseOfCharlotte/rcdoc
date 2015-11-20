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
	var Morph = function Morph(element) {
		this.element_ = element;
		this.init();
	};
	window['Morph'] = Morph;

	/**
	 * Store constants in one place so they can be updated easily.
	 *
	 * @enum {string}
	 * @private
	 */
	Morph.prototype.Constant_ = {
		FIRST_SVG: '#cart',
		SECOND_SVG: '#bread',
		THIRD_SVG: '#heart',
		TRIGGER: '#row-give',
		FIRST_OFFSET: 0,
		SECOND_OFFSET: 300,
	};

	/**
	 * Store strings for class names defined by this component.
	 *
	 * @enum {string}
	 * @private
	 */
	Morph.prototype.CssClasses_ = {
		//MORPH_ROW: 'js-morph',
	};


	/**
	 * Initialize element.
	 */
	Morph.prototype.init = function() {
		this.element_.addEventListener('scroll',
			this.morphScrollHandler_.bind(this));
		this.morphScrollHandler_();
	};

	/**
	 * Handles scrolling on the content.
	 *
	 * @private
	 */
	Morph.prototype.morphScrollHandler_ = function() {

		// Animation Setup
		var bread_tween = TweenLite.to(this.Constant_.FIRST_SVG, 1, {
			morphSVG: this.Constant_.SECOND_SVG
		});
		var heart_tween = TweenLite.to(this.Constant_.FIRST_SVG, 1, {
			morphSVG: this.Constant_.THIRD_SVG
		});

		// init ScrollMagic Controller
		var controller = new ScrollMagic.Controller();

		// Scene
		var bread_scene = new ScrollMagic.Scene({
				triggerElement: this.Constant_.TRIGGER,
				duration: 160,
				offset: this.Constant_.FIRST_OFFSET
			})
			.setTween(bread_tween)
			//.addIndicators();

		// Scene
		var heart_scene = new ScrollMagic.Scene({
				triggerElement: this.Constant_.TRIGGER,
				offset: this.Constant_.SECOND_OFFSET,
				duration: 160,
			})
			.setTween(heart_tween)
			//.addIndicators();

		controller.addScene([
			bread_scene,
			heart_scene
		]);

	};



	// in the global scope.
	componentHandler.register({
		constructor: Morph,
		classAsString: 'Morph',
		cssClass: 'js-morph'
	});
})();
