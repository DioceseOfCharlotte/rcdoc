


function DropPanel(element) {
    'use strict';
    this.element_ = element;
    this.init();
}

DropPanel.prototype.init = function() {
    "use strict";
    this.boundClickHandler = this.clickHandler.bind(this);
    this.element_.addEventListener('click', this.boundClickHandler);
};


DropPanel.prototype.clickHandler = function(event) {
    "use strict";
    var target = event.target;
    if( ! target.classList.contains(this.CssClasses_.PANEL_IS_ACTIVE)){
        target.classList.add(this.CssClasses_.PANEL_IS_ACTIVE);
        target.nextElementSibling.classList.add(this.CssClasses_.PANEL_IS_VISIBLE);
    } else {
        target.nextElementSibling.classList.remove(this.CssClasses_.PANEL_IS_VISIBLE);
        target.classList.remove(this.CssClasses_.PANEL_IS_ACTIVE);
    }
};


DropPanel.prototype.CssClasses_ = {
    PANEL_IS_ACTIVE: 'is-active',
    PANEL_IS_VISIBLE: 'is-visible'
};

DropPanel.prototype.mdlDowngrade_ = function() {
  'use strict';
  this.element_.removeEventListener('click', this.boundClickHandler);
};

componentHandler.register({
    constructor: DropPanel,
    classAsString: 'DropPanel',
    cssClass: 'js-drop-panel'
});

//document.querySelector('.mdl-grid').classList.add('is-animating');



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
  var Dropdown = function Dropdown(element) {
    this.element_ = element;
    this.init();
  };
  window['Dropdown'] = Dropdown;

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  Dropdown.prototype.CssClasses_ = {
    DROPDOWN_IS_ACTIVE: 'is-active'
  };


  Dropdown.prototype.init = function() {
    this.boundClickHandler = this.clickHandler.bind(this);
    this.element_.addEventListener('click', this.boundClickHandler);
  };

  Dropdown.prototype.clickHandler = function(event) {
      var target = event.target;
      var targetSibling = target.nextElementSibling;
      var targetParent = target.parentElement;
      if( ! target.classList.contains(this.CssClasses_.DROPDOWN_IS_ACTIVE)){
				TweenLite.to(targetParent, 0.2, {y:5});
        TweenLite.set(targetSibling, {height:"auto", opacity:1});
        TweenLite.from(targetSibling, 0.2, {height:0, opacity:0});
        TweenLite.to(targetSibling, 0.2, {paddingBottom:10});
        target.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
        targetSibling.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
        targetParent.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
      } else {
				TweenLite.to(targetParent, 0.2, {y:0});
        TweenLite.to(targetSibling, 0.2, {height:0, opacity:0});
        TweenLite.to(targetSibling, 0.2, {paddingBottom:0});
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
  Dropdown.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('click', this.boundClickHandler);
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  Dropdown.prototype.mdlDowngrade =
      Dropdown.prototype.mdlDowngrade_;

  Dropdown.prototype['mdlDowngrade'] =
      Dropdown.prototype.mdlDowngrade;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
      constructor: Dropdown,
      classAsString: 'Dropdown',
      cssClass: 'js-dropdown'
  });
})();






var $ = jQuery.noConflict();
//
// $( document ).ready(function() {
//   var $yeti = $('.tile');
//
// $('.tile').each(function() {
//     MotionUI.animateIn($yeti, 'fadeIn');
// 	})
// });
(function($) {
		$(document).on('facetwp-loaded', function() {
				componentHandler.upgradeAllRegistered();
		 });
})(jQuery);


TweenMax.staggerFrom(".tile", 1, {
	y:-900,
	ease: Power3.easeOut
}, 0.3);

TweenMax.staggerFrom(".tile", 0.5, {
	opacity:0.5
}, 0.2);



$(".tile").click(function(){
	TweenMax.staggerTo(".tile", 0.8, {
		y:-900,
		opacity:0,
		ease:Back.easeIn.config(0.7),
	}, 0.1);
});



// Animation Setup
var heart_tween = TweenLite.to("#cart", 1, {morphSVG:"#heart"});
var bread_tween = TweenLite.to("#cart", 1, {morphSVG:"#bread"});

// init ScrollMagic Controller
var controller = new ScrollMagic.Controller();


// Background Scene
var heart_scene = new ScrollMagic.Scene({
  triggerElement: '#row-give',
	offset: 300
})
.setTween(heart_tween)
//.addIndicators();

// Background Scene
var bread_scene = new ScrollMagic.Scene({
  triggerElement: '#row-give',
	//offset: 200
})
.setTween(bread_tween)
//.addIndicators();

controller.addScene([
  heart_scene,
	bread_scene
]);
