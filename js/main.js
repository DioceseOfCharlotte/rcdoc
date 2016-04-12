/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A component handler interface using the revealing module design pattern.
 * More details on this design pattern here:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @author Jason Mayes.
 */
/* exported componentHandler */

// Pre-defining the componentHandler interface, for closure documentation and
// static verification.
var componentHandler = {
  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  upgradeDom: function(optJsClass, optCssClass) {},
  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  upgradeElement: function(element, optJsClass) {},
  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  upgradeElements: function(elements) {},
  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  upgradeAllRegistered: function() {},
  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  registerUpgradedCallback: function(jsClass, callback) {},
  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
   */
  register: function(config) {},
  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  downgradeElements: function(nodes) {}
};

componentHandler = (function() {
  'use strict';

  /** @type {!Array<componentHandler.ComponentConfig>} */
  var registeredComponents_ = [];

  /** @type {!Array<componentHandler.Component>} */
  var createdComponents_ = [];

  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   *
   * @param {string} name The name of a class we want to use.
   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
   * @return {!Object|boolean}
   * @private
   */
  function findRegisteredClass_(name, optReplace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (typeof optReplace !== 'undefined') {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }

  /**
   * Returns an array of the classNames of the upgraded classes on the element.
   *
   * @param {!Element} element The element to fetch data from.
   * @return {!Array<string>}
   * @private
   */
  function getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  }

  /**
   * Returns true if the given element has already been upgraded for the given
   * class.
   *
   * @param {!Element} element The element we want to check.
   * @param {string} jsClass The class to check for.
   * @returns {boolean}
   * @private
   */
  function isElementUpgraded_(element, jsClass) {
    var upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }

  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {string=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {string=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (typeof optJsClass === 'undefined' &&
        typeof optCssClass === 'undefined') {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className,
            registeredComponents_[i].cssClass);
      }
    } else {
      var jsClass = /** @type {string} */ (optJsClass);
      if (typeof optCssClass === 'undefined') {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll('.' + optCssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }

  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      registeredComponents_.forEach(function(component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) &&
            classesToUpgrade.indexOf(component) === -1 &&
            !isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
          'Unable to find a registered component for the given class.');
      }

      var ev;
      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
        ev = new Event('mdl-componentupgraded', {
          'bubbles': true, 'cancelable': false
        });
      } else {
        ev = document.createEvent('Events');
        ev.initEvent('mdl-componentupgraded', true, true);
      }
      element.dispatchEvent(ev);
    }
  }

  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
        elements = Array.prototype.slice.call(elements);
      }
    }
    for (var i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        upgradeElementInternal(element);
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
      }
    }
  }

  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config
   */
  function registerInternal(config) {
    // In order to support both Closure-compiled and uncompiled code accessing
    // this method, we need to allow for both the dot and array syntax for
    // property access. You'll therefore see the `foo.bar || foo['bar']`
    // pattern repeated across this method.
    var widgetMissing = (typeof config.widget === 'undefined' &&
        typeof config['widget'] === 'undefined');
    var widget = true;

    if (!widgetMissing) {
      widget = config.widget || config['widget'];
    }

    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
      classConstructor: config.constructor || config['constructor'],
      className: config.classAsString || config['classAsString'],
      cssClass: config.cssClass || config['cssClass'],
      widget: widget,
      callbacks: []
    });

    registeredComponents_.forEach(function(item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    });

    if (config.constructor.prototype
        .hasOwnProperty(componentConfigProperty_)) {
      throw new Error(
          'MDL component classes must not have ' + componentConfigProperty_ +
          ' defined as a property.');
    }

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }

  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {string} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }

  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {?componentHandler.Component} component
   */
  function deconstructComponentInternal(component) {
    if (component) {
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      var ev;
      if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
        ev = new Event('mdl-componentdowngraded', {
          'bubbles': true, 'cancelable': false
        });
      } else {
        ev = document.createEvent('Events');
        ev.initEvent('mdl-componentdowngraded', true, true);
      }
      component.element_.dispatchEvent(ev);
    }
  }

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  function downgradeNodesInternal(nodes) {
    /**
     * Auxiliary function to downgrade a single node.
     * @param  {!Node} node the node to be downgraded
     */
    var downgradeNode = function(node) {
      createdComponents_.filter(function(item) {
        return item.element_ === node;
      }).forEach(deconstructComponentInternal);
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  }

  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal
  };
})();

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: Function,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: (string|boolean|undefined)
 * }}
 */
componentHandler.ComponentConfigPublic;  // jshint ignore:line

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig;  // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
 */
componentHandler.Component;  // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
componentHandler['upgradeDom'] = componentHandler.upgradeDom;
componentHandler['upgradeElement'] = componentHandler.upgradeElement;
componentHandler['upgradeElements'] = componentHandler.upgradeElements;
componentHandler['upgradeAllRegistered'] =
    componentHandler.upgradeAllRegistered;
componentHandler['registerUpgradedCallback'] =
    componentHandler.registerUpgradedCallback;
componentHandler['register'] = componentHandler.register;
componentHandler['downgradeElements'] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window['componentHandler'] = componentHandler;

window.addEventListener('load', function() {
  'use strict';

  /**
   * Performs a "Cutting the mustard" test. If the browser supports the features
   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
   * components requiring JavaScript.
   */
  if ('classList' in document.createElement('div') &&
      'querySelector' in document &&
      'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.upgradeElement = function() {};
    /**
     * Dummy function to avoid JS errors.
     */
    componentHandler.register = function() {};
  }
});

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
	var Dropdown = function Dropdown(element) {
		this.element_ = element;
		this.init();
	};
	window['Dropdown'] = Dropdown;

	/**
	 * Store strings for class names defined by this component.
	 *
	 * @enum {string}
	 * @private
	 */
	Dropdown.prototype.CssClasses_ = {
		DROPDOWN_IS_ACTIVE: 'is-active',
		DROPDOWN_IS_BEFORE: 'js-drop-before',
		DROPDOWN_PARENT: 'js-with-parent',
		PARENT_IS_ACTIVE: 'is-active',
	};


	Dropdown.prototype.init = function() {
		this.boundClickHandler = this.clickHandler.bind(this);
		this.element_.addEventListener('click', this.boundClickHandler);
	};

	Dropdown.prototype.clickHandler = function(event) {
		var target = event.target;
		if (target.classList.contains(this.CssClasses_.DROPDOWN_IS_BEFORE)) {
			var targetSibling = target.previousElementSibling;
		} else {
			var targetSibling = target.nextElementSibling;
		}
		var targetParent = target.parentElement;
		if (!target.classList.contains(this.CssClasses_.DROPDOWN_IS_ACTIVE)) {
			// TweenLite.set(targetSibling, {
			// 	height: "auto",
			// 	opacity: 1
			// });
			// TweenLite.from(targetSibling, 0.2, {
			// 	height: 0,
			// 	opacity: 0
			// });
			// TweenLite.to(targetSibling, 0.2, {
			// 	paddingTop: 10,
			// 	paddingBottom: 10
			// });
			target.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetSibling.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			if (target.classList.contains(this.CssClasses_.DROPDOWN_PARENT)) {
				targetParent.classList.add(this.CssClasses_.PARENT_IS_ACTIVE);
			}
		} else {
			// TweenLite.to(targetSibling, 0.2, {
			// 	height: 0,
			// 	opacity: 0
			// });
			// TweenLite.to(targetSibling, 0.2, {
			// 	paddingTop: 0,
			// 	paddingBottom: 0
			// });
			target.classList.remove(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetSibling.classList.remove(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			if (target.classList.contains(this.CssClasses_.DROPDOWN_PARENT)) {
				targetParent.classList.remove(this.CssClasses_.PARENT_IS_ACTIVE);
			}
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
		if (y == 0) {
			header.classList.remove('u-fix');
			header.classList.add('is-top');
		}
	};
}

'use strict';

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

var domReady = function domReady(callback) {
	document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kbENvbXBvbmVudEhhbmRsZXIuanMiLCJzdGVlci5qcyIsIkRyb3Bkb3duLmpzIiwibWFpbi5qcyIsImVzNi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdCQSxDQUFDLFlBQVc7QUFDWCxjQURXOztBQUdYLEtBQUksZ0JBQWdCLFNBQVMsYUFBVCxDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFoQixDQUhPOztBQUtYLEtBQUksVUFBVSxjQUFjLGVBQWQsQ0FBVixDQUxPO0FBTVgsS0FBSSxPQUFPLFNBQVMsSUFBVCxDQU5BO0FBT1gsS0FBSSxhQUFhLGNBQWMsU0FBZCxDQUFiLENBUE87QUFRWCxLQUFJLFVBQVUsY0FBYyxtQkFBZCxDQUFWLENBUk87QUFTWCxLQUFJLGNBQWMsY0FBYyxlQUFkLENBQWQsQ0FUTzs7QUFXWCxVQUFTLFNBQVQsR0FBcUI7QUFDcEIsT0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixtQkFBdEIsRUFEb0I7QUFFcEIsYUFBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLGNBQTVCLEVBRm9CO0FBR3BCLFVBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixXQUF6QixFQUhvQjtBQUlwQixjQUFZLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsV0FBN0IsRUFKb0I7RUFBckI7O0FBT0EsVUFBUyxVQUFULEdBQXNCO0FBQ3JCLE9BQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsbUJBQXRCLEVBRHFCO0FBRXJCLGFBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixjQUE1QixFQUZxQjtBQUdyQixVQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsV0FBekIsRUFIcUI7QUFJckIsY0FBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFdBQTdCLEVBSnFCO0FBS3JCLFVBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixZQUF0QixFQUxxQjtFQUF0Qjs7QUFRQSxhQUFZLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFNBQXRDLEVBMUJXO0FBMkJYLFNBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsVUFBbEMsRUEzQlc7QUE0QlgsU0FBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxVQUFTLEtBQVQsRUFBZ0I7QUFDakQsTUFBSSxNQUFNLE1BQU4sQ0FBYSxRQUFiLEtBQTBCLEdBQTFCLElBQWlDLE1BQU0sTUFBTixDQUFhLFFBQWIsS0FBMEIsSUFBMUIsRUFBZ0M7QUFDcEUsZUFEb0U7R0FBckU7RUFEaUMsQ0FBbEMsQ0E1Qlc7Q0FBWCxDQUFEOztBQW9DQSxJQUFJLFdBQVcsU0FBWCxRQUFXLENBQVMsUUFBVCxFQUFtQjtBQUNqQyxVQUFTLFVBQVQsS0FBd0IsYUFBeEIsSUFDQyxTQUFTLFVBQVQsS0FBd0IsVUFBeEIsR0FBcUMsVUFEdEMsR0FDbUQsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsUUFBOUMsQ0FEbkQsQ0FEaUM7Q0FBbkIiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEEgY29tcG9uZW50IGhhbmRsZXIgaW50ZXJmYWNlIHVzaW5nIHRoZSByZXZlYWxpbmcgbW9kdWxlIGRlc2lnbiBwYXR0ZXJuLlxuICogTW9yZSBkZXRhaWxzIG9uIHRoaXMgZGVzaWduIHBhdHRlcm4gaGVyZTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAqXG4gKiBAYXV0aG9yIEphc29uIE1heWVzLlxuICovXG4vKiBleHBvcnRlZCBjb21wb25lbnRIYW5kbGVyICovXG5cbi8vIFByZS1kZWZpbmluZyB0aGUgY29tcG9uZW50SGFuZGxlciBpbnRlcmZhY2UsIGZvciBjbG9zdXJlIGRvY3VtZW50YXRpb24gYW5kXG4vLyBzdGF0aWMgdmVyaWZpY2F0aW9uLlxudmFyIGNvbXBvbmVudEhhbmRsZXIgPSB7XG4gIC8qKlxuICAgKiBTZWFyY2hlcyBleGlzdGluZyBET00gZm9yIGVsZW1lbnRzIG9mIG91ciBjb21wb25lbnQgdHlwZSBhbmQgdXBncmFkZXMgdGhlbVxuICAgKiBpZiB0aGV5IGhhdmUgbm90IGFscmVhZHkgYmVlbiB1cGdyYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIHRoZSBwcm9ncmFtYXRpYyBuYW1lIG9mIHRoZSBlbGVtZW50IGNsYXNzIHdlXG4gICAqIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdENzc0NsYXNzIHRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZWxlbWVudHMgb2YgdGhpc1xuICAgKiB0eXBlIHdpbGwgaGF2ZS5cbiAgICovXG4gIHVwZ3JhZGVEb206IGZ1bmN0aW9uKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7fSxcbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgb3B0SnNDbGFzcykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGxpc3Qgb2YgZWxlbWVudHMgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR8IUFycmF5PCFFbGVtZW50PnwhTm9kZUxpc3R8IUhUTUxDb2xsZWN0aW9ufSBlbGVtZW50c1xuICAgKiBUaGUgZWxlbWVudHMgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKi9cbiAgdXBncmFkZUVsZW1lbnRzOiBmdW5jdGlvbihlbGVtZW50cykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGZvdW5kIGluIHRoZSBjdXJyZW50IERPTS4gVGhpcyBpc1xuICAgKiBhdXRvbWF0aWNhbGx5IGNhbGxlZCBvbiB3aW5kb3cgbG9hZC5cbiAgICovXG4gIHVwZ3JhZGVBbGxSZWdpc3RlcmVkOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgICogQWxsb3dzIHVzZXIgdG8gYmUgYWxlcnRlZCB0byBhbnkgdXBncmFkZXMgdGhhdCBhcmUgcGVyZm9ybWVkIGZvciBhIGdpdmVuXG4gICAqIGNvbXBvbmVudCB0eXBlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyBuYW1lIG9mIHRoZSBNREwgY29tcG9uZW50IHdlIHdpc2hcbiAgICogdG8gaG9vayBpbnRvIGZvciBhbnkgdXBncmFkZXMgcGVyZm9ybWVkLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCFIVE1MRWxlbWVudCl9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBjYWxsIHVwb24gYW5cbiAgICogdXBncmFkZS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgZXhwZWN0IDEgcGFyYW1ldGVyIC0gdGhlIEhUTUxFbGVtZW50IHdoaWNoXG4gICAqIGdvdCB1cGdyYWRlZC5cbiAgICovXG4gIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFjazogZnVuY3Rpb24oanNDbGFzcywgY2FsbGJhY2spIHt9LFxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2xhc3MgZm9yIGZ1dHVyZSB1c2UgYW5kIGF0dGVtcHRzIHRvIHVwZ3JhZGUgZXhpc3RpbmcgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljfSBjb25maWcgdGhlIHJlZ2lzdHJhdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWdpc3RlcjogZnVuY3Rpb24oY29uZmlnKSB7fSxcbiAgLyoqXG4gICAqIERvd25ncmFkZSBlaXRoZXIgYSBnaXZlbiBub2RlLCBhbiBhcnJheSBvZiBub2Rlcywgb3IgYSBOb2RlTGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHshTm9kZXwhQXJyYXk8IU5vZGU+fCFOb2RlTGlzdH0gbm9kZXNcbiAgICovXG4gIGRvd25ncmFkZUVsZW1lbnRzOiBmdW5jdGlvbihub2Rlcykge31cbn07XG5cbmNvbXBvbmVudEhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogQHR5cGUgeyFBcnJheTxjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZz59ICovXG4gIHZhciByZWdpc3RlcmVkQ29tcG9uZW50c18gPSBbXTtcblxuICAvKiogQHR5cGUgeyFBcnJheTxjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudD59ICovXG4gIHZhciBjcmVhdGVkQ29tcG9uZW50c18gPSBbXTtcblxuICB2YXIgY29tcG9uZW50Q29uZmlnUHJvcGVydHlfID0gJ21kbENvbXBvbmVudENvbmZpZ0ludGVybmFsXyc7XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3IgYSBjbGFzcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbiB1c2luZy5cbiAgICogT3B0aW9uYWxseSByZXBsYWNlcyBhIG1hdGNoIHdpdGggcGFzc2VkIG9iamVjdCBpZiBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIGEgY2xhc3Mgd2Ugd2FudCB0byB1c2UuXG4gICAqIEBwYXJhbSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc9fSBvcHRSZXBsYWNlIE9wdGlvbmFsIG9iamVjdCB0byByZXBsYWNlIG1hdGNoIHdpdGguXG4gICAqIEByZXR1cm4geyFPYmplY3R8Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGZpbmRSZWdpc3RlcmVkQ2xhc3NfKG5hbWUsIG9wdFJlcGxhY2UpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jbGFzc05hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRSZXBsYWNlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXSA9IG9wdFJlcGxhY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGNsYXNzTmFtZXMgb2YgdGhlIHVwZ3JhZGVkIGNsYXNzZXMgb24gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZmV0Y2ggZGF0YSBmcm9tLlxuICAgKiBAcmV0dXJuIHshQXJyYXk8c3RyaW5nPn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCkge1xuICAgIHZhciBkYXRhVXBncmFkZWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcpO1xuICAgIC8vIFVzZSBgWycnXWAgYXMgZGVmYXVsdCB2YWx1ZSB0byBjb25mb3JtIHRoZSBgLG5hbWUsbmFtZS4uLmAgc3R5bGUuXG4gICAgcmV0dXJuIGRhdGFVcGdyYWRlZCA9PT0gbnVsbCA/IFsnJ10gOiBkYXRhVXBncmFkZWQuc3BsaXQoJywnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiB1cGdyYWRlZCBmb3IgdGhlIGdpdmVuXG4gICAqIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdhbnQgdG8gY2hlY2suXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyB0byBjaGVjayBmb3IuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGpzQ2xhc3MpIHtcbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICByZXR1cm4gdXBncmFkZWRMaXN0LmluZGV4T2YoanNDbGFzcykgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGV4aXN0aW5nIERPTSBmb3IgZWxlbWVudHMgb2Ygb3VyIGNvbXBvbmVudCB0eXBlIGFuZCB1cGdyYWRlcyB0aGVtXG4gICAqIGlmIHRoZXkgaGF2ZSBub3QgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgdGhlIHByb2dyYW1hdGljIG5hbWUgb2YgdGhlIGVsZW1lbnQgY2xhc3Mgd2VcbiAgICogbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0Q3NzQ2xhc3MgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcyBlbGVtZW50cyBvZiB0aGlzXG4gICAqIHR5cGUgd2lsbCBoYXZlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZURvbUludGVybmFsKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRKc0NsYXNzID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW2ldLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBqc0NsYXNzID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChvcHRKc0NsYXNzKTtcbiAgICAgIGlmICh0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciByZWdpc3RlcmVkQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAgIG9wdENzc0NsYXNzID0gcmVnaXN0ZXJlZENsYXNzLmNzc0NsYXNzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgb3B0Q3NzQ2xhc3MpO1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBlbGVtZW50cy5sZW5ndGg7IG4rKykge1xuICAgICAgICB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnRzW25dLCBqc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBlbGVtZW50IHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGNsYXNzIHdlIHdhbnQgdG8gdXBncmFkZVxuICAgKiB0aGUgZWxlbWVudCB0by5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCwgb3B0SnNDbGFzcykge1xuICAgIC8vIFZlcmlmeSBhcmd1bWVudCB0eXBlLlxuICAgIGlmICghKHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byB1cGdyYWRlIE1ETCBlbGVtZW50LicpO1xuICAgIH1cbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICB2YXIgY2xhc3Nlc1RvVXBncmFkZSA9IFtdO1xuICAgIC8vIElmIGpzQ2xhc3MgaXMgbm90IHByb3ZpZGVkIHNjYW4gdGhlIHJlZ2lzdGVyZWQgY29tcG9uZW50cyB0byBmaW5kIHRoZVxuICAgIC8vIG9uZXMgbWF0Y2hpbmcgdGhlIGVsZW1lbnQncyBDU1MgY2xhc3NMaXN0LlxuICAgIGlmICghb3B0SnNDbGFzcykge1xuICAgICAgdmFyIGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIE1hdGNoIENTUyAmIE5vdCB0byBiZSB1cGdyYWRlZCAmIE5vdCB1cGdyYWRlZC5cbiAgICAgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucyhjb21wb25lbnQuY3NzQ2xhc3MpICYmXG4gICAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLmluZGV4T2YoY29tcG9uZW50KSA9PT0gLTEgJiZcbiAgICAgICAgICAgICFpc0VsZW1lbnRVcGdyYWRlZF8oZWxlbWVudCwgY29tcG9uZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIG9wdEpzQ2xhc3MpKSB7XG4gICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goZmluZFJlZ2lzdGVyZWRDbGFzc18ob3B0SnNDbGFzcykpO1xuICAgIH1cblxuICAgIC8vIFVwZ3JhZGUgdGhlIGVsZW1lbnQgZm9yIGVhY2ggY2xhc3Nlcy5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNsYXNzZXNUb1VwZ3JhZGUubGVuZ3RoLCByZWdpc3RlcmVkQ2xhc3M7IGkgPCBuOyBpKyspIHtcbiAgICAgIHJlZ2lzdGVyZWRDbGFzcyA9IGNsYXNzZXNUb1VwZ3JhZGVbaV07XG4gICAgICBpZiAocmVnaXN0ZXJlZENsYXNzKSB7XG4gICAgICAgIC8vIE1hcmsgZWxlbWVudCBhcyB1cGdyYWRlZC5cbiAgICAgICAgdXBncmFkZWRMaXN0LnB1c2gocmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZWRMaXN0LmpvaW4oJywnKSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyByZWdpc3RlcmVkQ2xhc3MuY2xhc3NDb25zdHJ1Y3RvcihlbGVtZW50KTtcbiAgICAgICAgaW5zdGFuY2VbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXSA9IHJlZ2lzdGVyZWRDbGFzcztcbiAgICAgICAgY3JlYXRlZENvbXBvbmVudHNfLnB1c2goaW5zdGFuY2UpO1xuICAgICAgICAvLyBDYWxsIGFueSBjYWxsYmFja3MgdGhlIHVzZXIgaGFzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGNvbXBvbmVudCB0eXBlLlxuICAgICAgICBmb3IgKHZhciBqID0gMCwgbSA9IHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3MubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICAgICAgcmVnaXN0ZXJlZENsYXNzLmNhbGxiYWNrc1tqXShlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3Mud2lkZ2V0KSB7XG4gICAgICAgICAgLy8gQXNzaWduIHBlciBlbGVtZW50IGluc3RhbmNlIGZvciBjb250cm9sIG92ZXIgQVBJXG4gICAgICAgICAgZWxlbWVudFtyZWdpc3RlcmVkQ2xhc3MuY2xhc3NOYW1lXSA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgZm9yIHRoZSBnaXZlbiBjbGFzcy4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV2O1xuICAgICAgaWYgKCdDdXN0b21FdmVudCcgaW4gd2luZG93ICYmIHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXYgPSBuZXcgRXZlbnQoJ21kbC1jb21wb25lbnR1cGdyYWRlZCcsIHtcbiAgICAgICAgICAnYnViYmxlcyc6IHRydWUsICdjYW5jZWxhYmxlJzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKTtcbiAgICAgICAgZXYuaW5pdEV2ZW50KCdtZGwtY29tcG9uZW50dXBncmFkZWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgbGlzdCBvZiBlbGVtZW50cyByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudHwhQXJyYXk8IUVsZW1lbnQ+fCFOb2RlTGlzdHwhSFRNTENvbGxlY3Rpb259IGVsZW1lbnRzXG4gICAqIFRoZSBlbGVtZW50cyB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGlmIChlbGVtZW50cyBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbGVtZW50cyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZWxlbWVudHMubGVuZ3RoLCBlbGVtZW50OyBpIDwgbjsgaSsrKSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjbGFzcyBmb3IgZnV0dXJlIHVzZSBhbmQgYXR0ZW1wdHMgdG8gdXBncmFkZSBleGlzdGluZyBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWdQdWJsaWN9IGNvbmZpZ1xuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJJbnRlcm5hbChjb25maWcpIHtcbiAgICAvLyBJbiBvcmRlciB0byBzdXBwb3J0IGJvdGggQ2xvc3VyZS1jb21waWxlZCBhbmQgdW5jb21waWxlZCBjb2RlIGFjY2Vzc2luZ1xuICAgIC8vIHRoaXMgbWV0aG9kLCB3ZSBuZWVkIHRvIGFsbG93IGZvciBib3RoIHRoZSBkb3QgYW5kIGFycmF5IHN5bnRheCBmb3JcbiAgICAvLyBwcm9wZXJ0eSBhY2Nlc3MuIFlvdSdsbCB0aGVyZWZvcmUgc2VlIHRoZSBgZm9vLmJhciB8fCBmb29bJ2JhciddYFxuICAgIC8vIHBhdHRlcm4gcmVwZWF0ZWQgYWNyb3NzIHRoaXMgbWV0aG9kLlxuICAgIHZhciB3aWRnZXRNaXNzaW5nID0gKHR5cGVvZiBjb25maWcud2lkZ2V0ID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2YgY29uZmlnWyd3aWRnZXQnXSA9PT0gJ3VuZGVmaW5lZCcpO1xuICAgIHZhciB3aWRnZXQgPSB0cnVlO1xuXG4gICAgaWYgKCF3aWRnZXRNaXNzaW5nKSB7XG4gICAgICB3aWRnZXQgPSBjb25maWcud2lkZ2V0IHx8IGNvbmZpZ1snd2lkZ2V0J107XG4gICAgfVxuXG4gICAgdmFyIG5ld0NvbmZpZyA9IC8qKiBAdHlwZSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWd9ICovICh7XG4gICAgICBjbGFzc0NvbnN0cnVjdG9yOiBjb25maWcuY29uc3RydWN0b3IgfHwgY29uZmlnWydjb25zdHJ1Y3RvciddLFxuICAgICAgY2xhc3NOYW1lOiBjb25maWcuY2xhc3NBc1N0cmluZyB8fCBjb25maWdbJ2NsYXNzQXNTdHJpbmcnXSxcbiAgICAgIGNzc0NsYXNzOiBjb25maWcuY3NzQ2xhc3MgfHwgY29uZmlnWydjc3NDbGFzcyddLFxuICAgICAgd2lkZ2V0OiB3aWRnZXQsXG4gICAgICBjYWxsYmFja3M6IFtdXG4gICAgfSk7XG5cbiAgICByZWdpc3RlcmVkQ29tcG9uZW50c18uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBpZiAoaXRlbS5jc3NDbGFzcyA9PT0gbmV3Q29uZmlnLmNzc0NsYXNzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGNzc0NsYXNzIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZDogJyArIGl0ZW0uY3NzQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uY2xhc3NOYW1lID09PSBuZXdDb25maWcuY2xhc3NOYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGNsYXNzTmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb25maWcuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgIC5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnRDb25maWdQcm9wZXJ0eV8pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ01ETCBjb21wb25lbnQgY2xhc3NlcyBtdXN0IG5vdCBoYXZlICcgKyBjb21wb25lbnRDb25maWdQcm9wZXJ0eV8gK1xuICAgICAgICAgICcgZGVmaW5lZCBhcyBhIHByb3BlcnR5LicpO1xuICAgIH1cblxuICAgIHZhciBmb3VuZCA9IGZpbmRSZWdpc3RlcmVkQ2xhc3NfKGNvbmZpZy5jbGFzc0FzU3RyaW5nLCBuZXdDb25maWcpO1xuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLnB1c2gobmV3Q29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHVzZXIgdG8gYmUgYWxlcnRlZCB0byBhbnkgdXBncmFkZXMgdGhhdCBhcmUgcGVyZm9ybWVkIGZvciBhIGdpdmVuXG4gICAqIGNvbXBvbmVudCB0eXBlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyBuYW1lIG9mIHRoZSBNREwgY29tcG9uZW50IHdlIHdpc2hcbiAgICogdG8gaG9vayBpbnRvIGZvciBhbnkgdXBncmFkZXMgcGVyZm9ybWVkLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCFIVE1MRWxlbWVudCl9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBjYWxsIHVwb24gYW5cbiAgICogdXBncmFkZS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgZXhwZWN0IDEgcGFyYW1ldGVyIC0gdGhlIEhUTUxFbGVtZW50IHdoaWNoXG4gICAqIGdvdCB1cGdyYWRlZC5cbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsKGpzQ2xhc3MsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHJlZ0NsYXNzID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oanNDbGFzcyk7XG4gICAgaWYgKHJlZ0NsYXNzKSB7XG4gICAgICByZWdDbGFzcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGFsbCByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm91bmQgaW4gdGhlIGN1cnJlbnQgRE9NLiBUaGlzIGlzXG4gICAqIGF1dG9tYXRpY2FsbHkgY2FsbGVkIG9uIHdpbmRvdyBsb2FkLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCgpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IG4rKykge1xuICAgICAgdXBncmFkZURvbUludGVybmFsKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tuXS5jbGFzc05hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY29tcG9uZW50IGZvciB0aGUgZG93bmdyYWRlIG1ldGhvZC5cbiAgICogRXhlY3V0ZSBpZiBmb3VuZC5cbiAgICogUmVtb3ZlIGNvbXBvbmVudCBmcm9tIGNyZWF0ZWRDb21wb25lbnRzIGxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7P2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50fSBjb21wb25lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwoY29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgdmFyIGNvbXBvbmVudEluZGV4ID0gY3JlYXRlZENvbXBvbmVudHNfLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5zcGxpY2UoY29tcG9uZW50SW5kZXgsIDEpO1xuXG4gICAgICB2YXIgdXBncmFkZXMgPSBjb21wb25lbnQuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJykuc3BsaXQoJywnKTtcbiAgICAgIHZhciBjb21wb25lbnRQbGFjZSA9IHVwZ3JhZGVzLmluZGV4T2YoY29tcG9uZW50W2NvbXBvbmVudENvbmZpZ1Byb3BlcnR5X10uY2xhc3NBc1N0cmluZyk7XG4gICAgICB1cGdyYWRlcy5zcGxpY2UoY29tcG9uZW50UGxhY2UsIDEpO1xuICAgICAgY29tcG9uZW50LmVsZW1lbnRfLnNldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcsIHVwZ3JhZGVzLmpvaW4oJywnKSk7XG5cbiAgICAgIHZhciBldjtcbiAgICAgIGlmICgnQ3VzdG9tRXZlbnQnIGluIHdpbmRvdyAmJiB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGV2ID0gbmV3IEV2ZW50KCdtZGwtY29tcG9uZW50ZG93bmdyYWRlZCcsIHtcbiAgICAgICAgICAnYnViYmxlcyc6IHRydWUsICdjYW5jZWxhYmxlJzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKTtcbiAgICAgICAgZXYuaW5pdEV2ZW50KCdtZGwtY29tcG9uZW50ZG93bmdyYWRlZCcsIHRydWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgY29tcG9uZW50LmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQoZXYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEb3duZ3JhZGUgZWl0aGVyIGEgZ2l2ZW4gbm9kZSwgYW4gYXJyYXkgb2Ygbm9kZXMsIG9yIGEgTm9kZUxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7IU5vZGV8IUFycmF5PCFOb2RlPnwhTm9kZUxpc3R9IG5vZGVzXG4gICAqL1xuICBmdW5jdGlvbiBkb3duZ3JhZGVOb2Rlc0ludGVybmFsKG5vZGVzKSB7XG4gICAgLyoqXG4gICAgICogQXV4aWxpYXJ5IGZ1bmN0aW9uIHRvIGRvd25ncmFkZSBhIHNpbmdsZSBub2RlLlxuICAgICAqIEBwYXJhbSAgeyFOb2RlfSBub2RlIHRoZSBub2RlIHRvIGJlIGRvd25ncmFkZWRcbiAgICAgKi9cbiAgICB2YXIgZG93bmdyYWRlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5lbGVtZW50XyA9PT0gbm9kZTtcbiAgICAgIH0pLmZvckVhY2goZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbCk7XG4gICAgfTtcbiAgICBpZiAobm9kZXMgaW5zdGFuY2VvZiBBcnJheSB8fCBub2RlcyBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG5vZGVzLmxlbmd0aDsgbisrKSB7XG4gICAgICAgIGRvd25ncmFkZU5vZGUobm9kZXNbbl0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZXMgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICBkb3duZ3JhZGVOb2RlKG5vZGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50IHByb3ZpZGVkIHRvIGRvd25ncmFkZSBNREwgbm9kZXMuJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gTm93IHJldHVybiB0aGUgZnVuY3Rpb25zIHRoYXQgc2hvdWxkIGJlIG1hZGUgcHVibGljIHdpdGggdGhlaXIgcHVibGljbHlcbiAgLy8gZmFjaW5nIG5hbWVzLi4uXG4gIHJldHVybiB7XG4gICAgdXBncmFkZURvbTogdXBncmFkZURvbUludGVybmFsLFxuICAgIHVwZ3JhZGVFbGVtZW50OiB1cGdyYWRlRWxlbWVudEludGVybmFsLFxuICAgIHVwZ3JhZGVFbGVtZW50czogdXBncmFkZUVsZW1lbnRzSW50ZXJuYWwsXG4gICAgdXBncmFkZUFsbFJlZ2lzdGVyZWQ6IHVwZ3JhZGVBbGxSZWdpc3RlcmVkSW50ZXJuYWwsXG4gICAgcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrOiByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2tJbnRlcm5hbCxcbiAgICByZWdpc3RlcjogcmVnaXN0ZXJJbnRlcm5hbCxcbiAgICBkb3duZ3JhZGVFbGVtZW50czogZG93bmdyYWRlTm9kZXNJbnRlcm5hbFxuICB9O1xufSkoKTtcblxuLyoqXG4gKiBEZXNjcmliZXMgdGhlIHR5cGUgb2YgYSByZWdpc3RlcmVkIGNvbXBvbmVudCB0eXBlIG1hbmFnZWQgYnlcbiAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICpcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGNvbnN0cnVjdG9yOiBGdW5jdGlvbixcbiAqICAgY2xhc3NBc1N0cmluZzogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IChzdHJpbmd8Ym9vbGVhbnx1bmRlZmluZWQpXG4gKiB9fVxuICovXG5jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpYzsgIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vKipcbiAqIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IHR5cGUgbWFuYWdlZCBieVxuICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgY29uc3RydWN0b3I6ICFGdW5jdGlvbixcbiAqICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogKHN0cmluZ3xib29sZWFuKSxcbiAqICAgY2FsbGJhY2tzOiAhQXJyYXk8ZnVuY3Rpb24oIUhUTUxFbGVtZW50KT5cbiAqIH19XG4gKi9cbmNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnOyAgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8qKlxuICogQ3JlYXRlZCBjb21wb25lbnQgKGkuZS4sIHVwZ3JhZGVkIGVsZW1lbnQpIHR5cGUgYXMgbWFuYWdlZCBieVxuICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgZWxlbWVudF86ICFIVE1MRWxlbWVudCxcbiAqICAgY2xhc3NOYW1lOiBzdHJpbmcsXG4gKiAgIGNsYXNzQXNTdHJpbmc6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiBzdHJpbmdcbiAqIH19XG4gKi9cbmNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50OyAgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8vIEV4cG9ydCBhbGwgc3ltYm9scywgZm9yIHRoZSBiZW5lZml0IG9mIENsb3N1cmUgY29tcGlsZXIuXG4vLyBObyBlZmZlY3Qgb24gdW5jb21waWxlZCBjb2RlLlxuY29tcG9uZW50SGFuZGxlclsndXBncmFkZURvbSddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRG9tO1xuY29tcG9uZW50SGFuZGxlclsndXBncmFkZUVsZW1lbnQnXSA9IGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQ7XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRWxlbWVudHMnXSA9IGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnRzO1xuY29tcG9uZW50SGFuZGxlclsndXBncmFkZUFsbFJlZ2lzdGVyZWQnXSA9XG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZDtcbmNvbXBvbmVudEhhbmRsZXJbJ3JlZ2lzdGVyVXBncmFkZWRDYWxsYmFjayddID1cbiAgICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyVXBncmFkZWRDYWxsYmFjaztcbmNvbXBvbmVudEhhbmRsZXJbJ3JlZ2lzdGVyJ10gPSBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyO1xuY29tcG9uZW50SGFuZGxlclsnZG93bmdyYWRlRWxlbWVudHMnXSA9IGNvbXBvbmVudEhhbmRsZXIuZG93bmdyYWRlRWxlbWVudHM7XG53aW5kb3cuY29tcG9uZW50SGFuZGxlciA9IGNvbXBvbmVudEhhbmRsZXI7XG53aW5kb3dbJ2NvbXBvbmVudEhhbmRsZXInXSA9IGNvbXBvbmVudEhhbmRsZXI7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogUGVyZm9ybXMgYSBcIkN1dHRpbmcgdGhlIG11c3RhcmRcIiB0ZXN0LiBJZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgZmVhdHVyZXNcbiAgICogdGVzdGVkLCBhZGRzIGEgbWRsLWpzIGNsYXNzIHRvIHRoZSA8aHRtbD4gZWxlbWVudC4gSXQgdGhlbiB1cGdyYWRlcyBhbGwgTURMXG4gICAqIGNvbXBvbmVudHMgcmVxdWlyaW5nIEphdmFTY3JpcHQuXG4gICAqL1xuICBpZiAoJ2NsYXNzTGlzdCcgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgJiZcbiAgICAgICdxdWVyeVNlbGVjdG9yJyBpbiBkb2N1bWVudCAmJlxuICAgICAgJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyAmJiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtZGwtanMnKTtcbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkKCk7XG4gIH0gZWxzZSB7XG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb24gdG8gYXZvaWQgSlMgZXJyb3JzLlxuICAgICAqL1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUVsZW1lbnQgPSBmdW5jdGlvbigpIHt9O1xuICAgIC8qKlxuICAgICAqIER1bW15IGZ1bmN0aW9uIHRvIGF2b2lkIEpTIGVycm9ycy5cbiAgICAgKi9cbiAgICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxufSk7XG4iLCIvKlxuICogc3RlZXIgLSB2Mi4xLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qZXJlbWVuaWNoZWxsaS9zdGVlclxuICogMjAxNCAoYykgSmVyZW1pYXMgTWVuaWNoZWxsaSAtIE1JVCBMaWNlbnNlXG4qL1xuXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LnN0ZWVyID0gZmFjdG9yeSgpO1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciB5ID0gMCxcbiAgICAgICAgcm9vdCA9IHdpbmRvdyxcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgICAgZXZlbnRzOiB0cnVlLFxuICAgICAgICAgICAgdXA6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICBkb3duOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH0sXG4gICAgICAgIGRpcmVjdGlvbiA9IG51bGwsXG4gICAgICAgIG9sZERpcmVjdGlvbiA9IG51bGw7XG5cbiAgICAvKlxuICAgICAqIFJlcGxhY2VzIGNvbmZpZ3VyYXRpb24gdmFsdWVzIHdpdGggY3VzdG9tIG9uZXNcbiAgICAgKiBAbWV0aG9kIF9zZXRDb25maWdPYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gb2JqZWN0IGNvbnRhaW5pbmcgY3VzdG9tIG9wdGlvbnNcbiAgICAgKi9cbiAgICB2YXIgX3NldENvbmZpZ09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAvLyBvdmVycmlkZSB3aXRoIGN1c3RvbSBhdHRyaWJ1dGVzXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldID0gb2JqW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogTWFpbiBmdW5jdGlvbiB3aGljaCBzZXRzIGFsbCB2YXJpYWJsZXMgYW5kIGJpbmQgZXZlbnRzIGlmIG5lZWRlZFxuICAgICAqIEBtZXRob2QgX3NldFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdPYmogb2JqZWN0IGNvbnRhaW5pbmcgY3VzdG9tIG9wdGlvbnNcbiAgICAgKi9cbiAgICB2YXIgX3NldCA9IGZ1bmN0aW9uKGNvbmZpZ09iaikge1xuICAgICAgICBfc2V0Q29uZmlnT2JqZWN0KGNvbmZpZ09iaik7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5ldmVudHMpIHtcbiAgICAgICAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgX2NvbXBhcmVEaXJlY3Rpb24pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ3Jvc3MgYnJvd3NlciB3YXkgdG8gZ2V0IGhvdyBtdWNoIGlzIHNjcm9sbGVkXG4gICAgICogQG1ldGhvZCBfZ2V0WVBvc2l0aW9uXG4gICAgICovXG4gICAgdmFyIF9nZXRZUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJvb3Quc2Nyb2xsWSB8fCByb290LnBhZ2VZT2Zmc2V0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgZGlyZWN0aW9uIGFuZCB1cGRhdGVzIHBvc2l0aW9uIHZhcmlhYmxlXG4gICAgICogQG1ldGhvZCBfZ2V0RGlyZWN0aW9uXG4gICAgICovXG4gICAgdmFyIF9nZXREaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdHVhbFBvc2l0aW9uID0gX2dldFlQb3NpdGlvbigpLFxuICAgICAgICAgICAgZGlyZWN0aW9uO1xuXG4gICAgICAgIGRpcmVjdGlvbiA9IGFjdHVhbFBvc2l0aW9uIDwgeSA/ICd1cCcgOiAnZG93bic7XG5cbiAgICAgICAgLy8gdXBkYXRlcyBnZW5lcmFsIHBvc2l0aW9uIHZhcmlhYmxlXG4gICAgICAgIHkgPSBhY3R1YWxQb3NpdGlvbjtcblxuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENvbXBhcmVzIG9sZCBhbmQgbmV3IGRpcmVjdGlvbnMgYW5kIGNhbGwgc3BlY2lmaWMgZnVuY3Rpb25cbiAgICAgKiBAbWV0aG9kIF9jb21wYXJlRGlyZWN0aW9uXG4gICAgICovXG4gICAgdmFyIF9jb21wYXJlRGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IF9nZXREaXJlY3Rpb24oKTtcblxuICAgICAgICAvLyB3aGVuIGRpcmVjdGlvbiBjaGFuZ2VzIHVwZGF0ZSBhbmQgY2FsbCBtZXRob2RcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gb2xkRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBvbGREaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBjb25maWdbZGlyZWN0aW9uXS5jYWxsKHJvb3QsIHkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHNldDogX3NldCxcbiAgICAgICAgdHJpZ2dlcjogX2NvbXBhcmVEaXJlY3Rpb25cbiAgICB9O1xufSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQvKipcblx0ICogQ2xhc3MgY29uc3RydWN0b3IuXG5cdCAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuXHQgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cblx0ICovXG5cdHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIERyb3Bkb3duKGVsZW1lbnQpIHtcblx0XHR0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblx0XHR0aGlzLmluaXQoKTtcblx0fTtcblx0d2luZG93WydEcm9wZG93biddID0gRHJvcGRvd247XG5cblx0LyoqXG5cdCAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQuXG5cdCAqXG5cdCAqIEBlbnVtIHtzdHJpbmd9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHREcm9wZG93bi5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG5cdFx0RFJPUERPV05fSVNfQUNUSVZFOiAnaXMtYWN0aXZlJyxcblx0XHREUk9QRE9XTl9JU19CRUZPUkU6ICdqcy1kcm9wLWJlZm9yZScsXG5cdFx0RFJPUERPV05fUEFSRU5UOiAnanMtd2l0aC1wYXJlbnQnLFxuXHRcdFBBUkVOVF9JU19BQ1RJVkU6ICdpcy1hY3RpdmUnLFxuXHR9O1xuXG5cblx0RHJvcGRvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmJvdW5kQ2xpY2tIYW5kbGVyID0gdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ib3VuZENsaWNrSGFuZGxlcik7XG5cdH07XG5cblx0RHJvcGRvd24ucHJvdG90eXBlLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0JFRk9SRSkpIHtcblx0XHRcdHZhciB0YXJnZXRTaWJsaW5nID0gdGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciB0YXJnZXRTaWJsaW5nID0gdGFyZ2V0Lm5leHRFbGVtZW50U2libGluZztcblx0XHR9XG5cdFx0dmFyIHRhcmdldFBhcmVudCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xuXHRcdGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0FDVElWRSkpIHtcblx0XHRcdC8vIFR3ZWVuTGl0ZS5zZXQodGFyZ2V0U2libGluZywge1xuXHRcdFx0Ly8gXHRoZWlnaHQ6IFwiYXV0b1wiLFxuXHRcdFx0Ly8gXHRvcGFjaXR5OiAxXG5cdFx0XHQvLyB9KTtcblx0XHRcdC8vIFR3ZWVuTGl0ZS5mcm9tKHRhcmdldFNpYmxpbmcsIDAuMiwge1xuXHRcdFx0Ly8gXHRoZWlnaHQ6IDAsXG5cdFx0XHQvLyBcdG9wYWNpdHk6IDBcblx0XHRcdC8vIH0pO1xuXHRcdFx0Ly8gVHdlZW5MaXRlLnRvKHRhcmdldFNpYmxpbmcsIDAuMiwge1xuXHRcdFx0Ly8gXHRwYWRkaW5nVG9wOiAxMCxcblx0XHRcdC8vIFx0cGFkZGluZ0JvdHRvbTogMTBcblx0XHRcdC8vIH0pO1xuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0dGFyZ2V0U2libGluZy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQUNUSVZFKTtcblx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fUEFSRU5UKSkge1xuXHRcdFx0XHR0YXJnZXRQYXJlbnQuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlBBUkVOVF9JU19BQ1RJVkUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUd2VlbkxpdGUudG8odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHQvLyBcdGhlaWdodDogMCxcblx0XHRcdC8vIFx0b3BhY2l0eTogMFxuXHRcdFx0Ly8gfSk7XG5cdFx0XHQvLyBUd2VlbkxpdGUudG8odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHQvLyBcdHBhZGRpbmdUb3A6IDAsXG5cdFx0XHQvLyBcdHBhZGRpbmdCb3R0b206IDBcblx0XHRcdC8vIH0pO1xuXHRcdFx0dGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0dGFyZ2V0U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQUNUSVZFKTtcblx0XHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fUEFSRU5UKSkge1xuXHRcdFx0XHR0YXJnZXRQYXJlbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLlBBUkVOVF9JU19BQ1RJVkUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRG93bmdyYWRlIHRoZSBjb21wb25lbnQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlXyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZWxlbWVudF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kQ2xpY2tIYW5kbGVyKTtcblx0fTtcblxuXHQvKipcblx0ICogUHVibGljIGFsaWFzIGZvciB0aGUgZG93bmdyYWRlIG1ldGhvZC5cblx0ICpcblx0ICogQHB1YmxpY1xuXHQgKi9cblx0RHJvcGRvd24ucHJvdG90eXBlLm1kbERvd25ncmFkZSA9XG5cdFx0RHJvcGRvd24ucHJvdG90eXBlLm1kbERvd25ncmFkZV87XG5cblx0RHJvcGRvd24ucHJvdG90eXBlWydtZGxEb3duZ3JhZGUnXSA9XG5cdFx0RHJvcGRvd24ucHJvdG90eXBlLm1kbERvd25ncmFkZTtcblxuXHQvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcblx0Ly8gaW4gdGhlIGdsb2JhbCBzY29wZS5cblx0Y29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG5cdFx0Y29uc3RydWN0b3I6IERyb3Bkb3duLFxuXHRcdGNsYXNzQXNTdHJpbmc6ICdEcm9wZG93bicsXG5cdFx0Y3NzQ2xhc3M6ICdqcy1kcm9wZG93bidcblx0fSk7XG59KSgpO1xuIiwiLy8gU3RlZXIgZml4IGhlYWRlclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHQvLyBnZXR0aW5nIHRoZSBlbGVtZW50IHdoZXJlIHRoZSBtZXNzYWdlIGdvZXNcblx0dmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcblx0Ly8gY2FsbGluZyBzdGVlclxuXHRzdGVlci5zZXQoe1xuXHRcdGV2ZW50czogZmFsc2UsXG5cdFx0dXA6IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cdFx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnZmFkZUluRG93bicpO1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVPdXRVcCcpO1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3UtZml4Jyk7XG5cdFx0fSxcblx0XHRkb3duOiBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXRVcCcpO1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbkRvd24nKTtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCd1LWZpeCcpO1xuXHRcdH1cblx0fSk7XG5cdHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB5ID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cdFx0aWYgKHkgPiAxMzEpIHtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdpcy10b3AnKTtcblx0XHRcdHN0ZWVyLnRyaWdnZXIoKTtcblx0XHR9XG5cdFx0aWYgKHkgPT0gMCkge1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3UtZml4Jyk7XG5cdFx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaXMtdG9wJyk7XG5cdFx0fVxuXHR9O1xufVxuIiwiLy8gT2ZmLWNhbnZhcyBzaWRlYmFyXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRsZXQgcXVlcnlTZWxlY3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IuYmluZChkb2N1bWVudCk7XG5cblx0bGV0IHNpZGVOYXYgPSBxdWVyeVNlbGVjdG9yKCcjbWVudS1wcmltYXJ5Jyk7XG5cdGxldCBib2R5ID0gZG9jdW1lbnQuYm9keTtcblx0bGV0IHNpdGVIZWFkZXIgPSBxdWVyeVNlbGVjdG9yKCcjaGVhZGVyJyk7XG5cdGxldCBtZW51QnRuID0gcXVlcnlTZWxlY3RvcignI3NpZGUtbWVudS10b2dnbGUnKTtcblx0bGV0IGNvbnRlbnRNYXNrID0gcXVlcnlTZWxlY3RvcignI2NvbnRlbnQtbWFzaycpO1xuXG5cdGZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcblx0XHRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Utb3ZlcmZsb3ctaGlkZGVuJyk7XG5cdFx0c2l0ZUhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdzaWRlYmFyLW9wZW4nKTtcblx0XHRzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHRcdGNvbnRlbnRNYXNrLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcblx0XHRib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3Utb3ZlcmZsb3ctaGlkZGVuJyk7XG5cdFx0c2l0ZUhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdzaWRlYmFyLW9wZW4nKTtcblx0XHRzaWRlTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuXHRcdGNvbnRlbnRNYXNrLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuXHRcdHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnaGFzLW9wZW5lZCcpO1xuXHR9XG5cblx0Y29udGVudE1hc2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1lbnUpO1xuXHRtZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG5cdHNpZGVOYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdBJyB8fCBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdMSScpIHtcblx0XHRcdGNsb3NlTWVudSgpO1xuXHRcdH1cblx0fSk7XG59KSgpO1xuXG5cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fFxuXHRcdGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiA/IGNhbGxiYWNrKCkgOiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBjYWxsYmFjayk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
