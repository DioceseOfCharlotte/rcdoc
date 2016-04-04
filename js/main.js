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
  upgradeDom: function(optJsClass, optCssClass) {}, // eslint-disable-line
  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!Element} element The element we wish to upgrade.
   * @param {string=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  upgradeElement: function(element, optJsClass) {}, // eslint-disable-line
  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  upgradeElements: function(elements) {}, // eslint-disable-line
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
  registerUpgradedCallback: function(jsClass, callback) {}, // eslint-disable-line
  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
   */
  register: function(config) {}, // eslint-disable-line
  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes The list of nodes.
   */
  downgradeElements: function(nodes) {} // eslint-disable-line
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
   * @return {!Object|boolean} Registered components.
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
   * @return {!Array<string>} Array of classNames.
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
   * @return {boolean} Whether the element is upgraded.
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
        var instance = new registeredClass.classConstructor(element); // eslint-disable-line
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
      if (typeof elements.item === 'function') {
        elements = Array.prototype.slice.call(/** @type {Array} */ (elements));
      } else {
        elements = [elements];
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
   * @param {componentHandler.ComponentConfigPublic} config The configuration.
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
        throw new Error('The provided cssClass has already been registered: ' +
            item.cssClass);
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
   * @param {?componentHandler.Component} component The component to downgrade.
   */
  function deconstructComponentInternal(component) {
    if (component) {
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades =
          component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace =
          upgrades.indexOf(component[componentConfigProperty_].classAsString);
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
    }
  }

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes The list of nodes.
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
componentHandler.ComponentConfigPublic; // eslint-disable-line

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
componentHandler.ComponentConfig; // eslint-disable-line

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
componentHandler.Component; // eslint-disable-line

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
  if (
      'classList' in document.documentElement &&
      'querySelector' in document &&
      'addEventListener' in window &&
      'forEach' in Array.prototype) {
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
			target.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			targetSibling.classList.add(this.CssClasses_.DROPDOWN_IS_ACTIVE);
			if (target.classList.contains(this.CssClasses_.DROPDOWN_PARENT)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kbENvbXBvbmVudEhhbmRsZXIuanMiLCJzdGVlci5qcyIsIkRyb3Bkb3duLmpzIiwibWFpbi5qcyIsImVzNi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9lQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1QkEsQ0FBQyxZQUFZO0FBQ1gsZUFEVzs7QUFHWCxNQUFJLGdCQUFnQixTQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBNEIsUUFBNUIsQ0FBaEIsQ0FITzs7QUFLWCxNQUFJLFVBQVUsY0FBYyxlQUFkLENBQVYsQ0FMTztBQU1YLE1BQUksT0FBTyxTQUFTLElBQVQsQ0FOQTtBQU9YLE1BQUksYUFBYSxjQUFjLFNBQWQsQ0FBYixDQVBPO0FBUVgsTUFBSSxVQUFVLGNBQWMsbUJBQWQsQ0FBVixDQVJPO0FBU1gsTUFBSSxjQUFjLGNBQWMsZUFBZCxDQUFkLENBVE87O0FBV1gsV0FBUyxTQUFULEdBQXFCO0FBQ25CLFNBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsbUJBQXRCLEVBRG1CO0FBRW5CLGVBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixjQUE1QixFQUZtQjtBQUduQixZQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsV0FBekIsRUFIbUI7QUFJdEIsZ0JBQVksU0FBWixDQUFzQixNQUF0QixDQUE2QixXQUE3QixFQUpzQjtHQUFyQjs7QUFPQSxXQUFTLFVBQVQsR0FBc0I7QUFDcEIsU0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixtQkFBdEIsRUFEb0I7QUFFcEIsZUFBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLGNBQTVCLEVBRm9CO0FBR3BCLFlBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixXQUF6QixFQUhvQjtBQUlwQixnQkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFdBQTdCLEVBSm9CO0FBS3BCLFlBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixZQUF0QixFQUxvQjtHQUF0Qjs7QUFRQSxjQUFZLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFNBQXRDLEVBMUJXO0FBMkJYLFVBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsVUFBbEMsRUEzQlc7QUE0QlgsVUFBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxVQUFVLEtBQVYsRUFBaUI7QUFDakQsUUFBSSxNQUFNLE1BQU4sQ0FBYSxRQUFiLEtBQTBCLEdBQTFCLElBQWlDLE1BQU0sTUFBTixDQUFhLFFBQWIsS0FBMEIsSUFBMUIsRUFBZ0M7QUFDbkUsa0JBRG1FO0tBQXJFO0dBRGdDLENBQWxDLENBNUJXO0NBQVosQ0FBRDs7QUFvQ0EsSUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFVLFFBQVYsRUFBb0I7QUFDakMsV0FBUyxVQUFULEtBQXdCLGFBQXhCLElBQ0EsU0FBUyxVQUFULEtBQXdCLFVBQXhCLEdBQXFDLFVBRHJDLEdBQ2tELFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFFBQTlDLENBRGxELENBRGlDO0NBQXBCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBBIGNvbXBvbmVudCBoYW5kbGVyIGludGVyZmFjZSB1c2luZyB0aGUgcmV2ZWFsaW5nIG1vZHVsZSBkZXNpZ24gcGF0dGVybi5cbiAqIE1vcmUgZGV0YWlscyBvbiB0aGlzIGRlc2lnbiBwYXR0ZXJuIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gKlxuICogQGF1dGhvciBKYXNvbiBNYXllcy5cbiAqL1xuLyogZXhwb3J0ZWQgY29tcG9uZW50SGFuZGxlciAqL1xuXG4vLyBQcmUtZGVmaW5pbmcgdGhlIGNvbXBvbmVudEhhbmRsZXIgaW50ZXJmYWNlLCBmb3IgY2xvc3VyZSBkb2N1bWVudGF0aW9uIGFuZFxuLy8gc3RhdGljIHZlcmlmaWNhdGlvbi5cbnZhciBjb21wb25lbnRIYW5kbGVyID0ge1xuICAvKipcbiAgICogU2VhcmNoZXMgZXhpc3RpbmcgRE9NIGZvciBlbGVtZW50cyBvZiBvdXIgY29tcG9uZW50IHR5cGUgYW5kIHVwZ3JhZGVzIHRoZW1cbiAgICogaWYgdGhleSBoYXZlIG5vdCBhbHJlYWR5IGJlZW4gdXBncmFkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyB0aGUgcHJvZ3JhbWF0aWMgbmFtZSBvZiB0aGUgZWxlbWVudCBjbGFzcyB3ZVxuICAgKiBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZi5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRDc3NDbGFzcyB0aGUgbmFtZSBvZiB0aGUgQ1NTIGNsYXNzIGVsZW1lbnRzIG9mIHRoaXNcbiAgICogdHlwZSB3aWxsIGhhdmUuXG4gICAqL1xuICB1cGdyYWRlRG9tOiBmdW5jdGlvbihvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgb3B0SnNDbGFzcykge30sIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgbGlzdCBvZiBlbGVtZW50cyByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudHwhQXJyYXk8IUVsZW1lbnQ+fCFOb2RlTGlzdHwhSFRNTENvbGxlY3Rpb259IGVsZW1lbnRzXG4gICAqIFRoZSBlbGVtZW50cyB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudHM6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7fSwgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICAqIEFsbG93cyB1c2VyIHRvIGJlIGFsZXJ0ZWQgdG8gYW55IHVwZ3JhZGVzIHRoYXQgYXJlIHBlcmZvcm1lZCBmb3IgYSBnaXZlblxuICAgKiBjb21wb25lbnQgdHlwZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgTURMIGNvbXBvbmVudCB3ZSB3aXNoXG4gICAqIHRvIGhvb2sgaW50byBmb3IgYW55IHVwZ3JhZGVzIHBlcmZvcm1lZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbighSFRNTEVsZW1lbnQpfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB1cG9uIGFuXG4gICAqIHVwZ3JhZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCAxIHBhcmFtZXRlciAtIHRoZSBIVE1MRWxlbWVudCB3aGljaFxuICAgKiBnb3QgdXBncmFkZWQuXG4gICAqL1xuICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IGZ1bmN0aW9uKGpzQ2xhc3MsIGNhbGxiYWNrKSB7fSwgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2xhc3MgZm9yIGZ1dHVyZSB1c2UgYW5kIGF0dGVtcHRzIHRvIHVwZ3JhZGUgZXhpc3RpbmcgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljfSBjb25maWcgdGhlIHJlZ2lzdHJhdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWdpc3RlcjogZnVuY3Rpb24oY29uZmlnKSB7fSwgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAvKipcbiAgICogRG93bmdyYWRlIGVpdGhlciBhIGdpdmVuIG5vZGUsIGFuIGFycmF5IG9mIG5vZGVzLCBvciBhIE5vZGVMaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfCFBcnJheTwhTm9kZT58IU5vZGVMaXN0fSBub2RlcyBUaGUgbGlzdCBvZiBub2Rlcy5cbiAgICovXG4gIGRvd25ncmFkZUVsZW1lbnRzOiBmdW5jdGlvbihub2Rlcykge30gLy8gZXNsaW50LWRpc2FibGUtbGluZVxufTtcblxuY29tcG9uZW50SGFuZGxlciA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBAdHlwZSB7IUFycmF5PGNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPn0gKi9cbiAgdmFyIHJlZ2lzdGVyZWRDb21wb25lbnRzXyA9IFtdO1xuXG4gIC8qKiBAdHlwZSB7IUFycmF5PGNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Pn0gKi9cbiAgdmFyIGNyZWF0ZWRDb21wb25lbnRzXyA9IFtdO1xuXG4gIHZhciBjb21wb25lbnRDb25maWdQcm9wZXJ0eV8gPSAnbWRsQ29tcG9uZW50Q29uZmlnSW50ZXJuYWxfJztcblxuICAvKipcbiAgICogU2VhcmNoZXMgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGZvciBhIGNsYXNzIHdlIGFyZSBpbnRlcmVzdGVkIGluIHVzaW5nLlxuICAgKiBPcHRpb25hbGx5IHJlcGxhY2VzIGEgbWF0Y2ggd2l0aCBwYXNzZWQgb2JqZWN0IGlmIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgYSBjbGFzcyB3ZSB3YW50IHRvIHVzZS5cbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZz19IG9wdFJlcGxhY2UgT3B0aW9uYWwgb2JqZWN0IHRvIHJlcGxhY2UgbWF0Y2ggd2l0aC5cbiAgICogQHJldHVybiB7IU9iamVjdHxib29sZWFufSBSZWdpc3RlcmVkIGNvbXBvbmVudHMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kUmVnaXN0ZXJlZENsYXNzXyhuYW1lLCBvcHRSZXBsYWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lID09PSBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0UmVwbGFjZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0gPSBvcHRSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkQ29tcG9uZW50c19baV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjbGFzc05hbWVzIG9mIHRoZSB1cGdyYWRlZCBjbGFzc2VzIG9uIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZldGNoIGRhdGEgZnJvbS5cbiAgICogQHJldHVybiB7IUFycmF5PHN0cmluZz59IEFycmF5IG9mIGNsYXNzTmFtZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfKGVsZW1lbnQpIHtcbiAgICB2YXIgZGF0YVVwZ3JhZGVkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKTtcbiAgICAvLyBVc2UgYFsnJ11gIGFzIGRlZmF1bHQgdmFsdWUgdG8gY29uZm9ybSB0aGUgYCxuYW1lLG5hbWUuLi5gIHN0eWxlLlxuICAgIHJldHVybiBkYXRhVXBncmFkZWQgPT09IG51bGwgPyBbJyddIDogZGF0YVVwZ3JhZGVkLnNwbGl0KCcsJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWQgZm9yIHRoZSBnaXZlblxuICAgKiBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3YW50IHRvIGNoZWNrLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIHVwZ3JhZGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGpzQ2xhc3MpIHtcbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICByZXR1cm4gdXBncmFkZWRMaXN0LmluZGV4T2YoanNDbGFzcykgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGV4aXN0aW5nIERPTSBmb3IgZWxlbWVudHMgb2Ygb3VyIGNvbXBvbmVudCB0eXBlIGFuZCB1cGdyYWRlcyB0aGVtXG4gICAqIGlmIHRoZXkgaGF2ZSBub3QgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgdGhlIHByb2dyYW1hdGljIG5hbWUgb2YgdGhlIGVsZW1lbnQgY2xhc3Mgd2VcbiAgICogbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0Q3NzQ2xhc3MgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcyBlbGVtZW50cyBvZiB0aGlzXG4gICAqIHR5cGUgd2lsbCBoYXZlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZURvbUludGVybmFsKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRKc0NsYXNzID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW2ldLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBqc0NsYXNzID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChvcHRKc0NsYXNzKTtcbiAgICAgIGlmICh0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciByZWdpc3RlcmVkQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAgIG9wdENzc0NsYXNzID0gcmVnaXN0ZXJlZENsYXNzLmNzc0NsYXNzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgb3B0Q3NzQ2xhc3MpO1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBlbGVtZW50cy5sZW5ndGg7IG4rKykge1xuICAgICAgICB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnRzW25dLCBqc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBlbGVtZW50IHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGNsYXNzIHdlIHdhbnQgdG8gdXBncmFkZVxuICAgKiB0aGUgZWxlbWVudCB0by5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCwgb3B0SnNDbGFzcykge1xuICAgIC8vIFZlcmlmeSBhcmd1bWVudCB0eXBlLlxuICAgIGlmICghKHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byB1cGdyYWRlIE1ETCBlbGVtZW50LicpO1xuICAgIH1cbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICB2YXIgY2xhc3Nlc1RvVXBncmFkZSA9IFtdO1xuICAgIC8vIElmIGpzQ2xhc3MgaXMgbm90IHByb3ZpZGVkIHNjYW4gdGhlIHJlZ2lzdGVyZWQgY29tcG9uZW50cyB0byBmaW5kIHRoZVxuICAgIC8vIG9uZXMgbWF0Y2hpbmcgdGhlIGVsZW1lbnQncyBDU1MgY2xhc3NMaXN0LlxuICAgIGlmICghb3B0SnNDbGFzcykge1xuICAgICAgdmFyIGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIE1hdGNoIENTUyAmIE5vdCB0byBiZSB1cGdyYWRlZCAmIE5vdCB1cGdyYWRlZC5cbiAgICAgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucyhjb21wb25lbnQuY3NzQ2xhc3MpICYmXG4gICAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLmluZGV4T2YoY29tcG9uZW50KSA9PT0gLTEgJiZcbiAgICAgICAgICAgICFpc0VsZW1lbnRVcGdyYWRlZF8oZWxlbWVudCwgY29tcG9uZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIG9wdEpzQ2xhc3MpKSB7XG4gICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goZmluZFJlZ2lzdGVyZWRDbGFzc18ob3B0SnNDbGFzcykpO1xuICAgIH1cblxuICAgIC8vIFVwZ3JhZGUgdGhlIGVsZW1lbnQgZm9yIGVhY2ggY2xhc3Nlcy5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNsYXNzZXNUb1VwZ3JhZGUubGVuZ3RoLCByZWdpc3RlcmVkQ2xhc3M7IGkgPCBuOyBpKyspIHtcbiAgICAgIHJlZ2lzdGVyZWRDbGFzcyA9IGNsYXNzZXNUb1VwZ3JhZGVbaV07XG4gICAgICBpZiAocmVnaXN0ZXJlZENsYXNzKSB7XG4gICAgICAgIC8vIE1hcmsgZWxlbWVudCBhcyB1cGdyYWRlZC5cbiAgICAgICAgdXBncmFkZWRMaXN0LnB1c2gocmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZWRMaXN0LmpvaW4oJywnKSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyByZWdpc3RlcmVkQ2xhc3MuY2xhc3NDb25zdHJ1Y3RvcihlbGVtZW50KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICBpbnN0YW5jZVtjb21wb25lbnRDb25maWdQcm9wZXJ0eV9dID0gcmVnaXN0ZXJlZENsYXNzO1xuICAgICAgICBjcmVhdGVkQ29tcG9uZW50c18ucHVzaChpbnN0YW5jZSk7XG4gICAgICAgIC8vIENhbGwgYW55IGNhbGxiYWNrcyB0aGUgdXNlciBoYXMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgY29tcG9uZW50IHR5cGUuXG4gICAgICAgIGZvciAodmFyIGogPSAwLCBtID0gcmVnaXN0ZXJlZENsYXNzLmNhbGxiYWNrcy5sZW5ndGg7IGogPCBtOyBqKyspIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ2xhc3MuY2FsbGJhY2tzW2pdKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcy53aWRnZXQpIHtcbiAgICAgICAgICAvLyBBc3NpZ24gcGVyIGVsZW1lbnQgaW5zdGFuY2UgZm9yIGNvbnRyb2wgb3ZlciBBUElcbiAgICAgICAgICBlbGVtZW50W3JlZ2lzdGVyZWRDbGFzcy5jbGFzc05hbWVdID0gaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnVW5hYmxlIHRvIGZpbmQgYSByZWdpc3RlcmVkIGNvbXBvbmVudCBmb3IgdGhlIGdpdmVuIGNsYXNzLicpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXY7XG4gICAgICBpZiAoJ0N1c3RvbUV2ZW50JyBpbiB3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldiA9IG5ldyBFdmVudCgnbWRsLWNvbXBvbmVudHVwZ3JhZGVkJywge1xuICAgICAgICAgICdidWJibGVzJzogdHJ1ZSwgJ2NhbmNlbGFibGUnOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xuICAgICAgICBldi5pbml0RXZlbnQoJ21kbC1jb21wb25lbnR1cGdyYWRlZCcsIHRydWUsIHRydWUpO1xuICAgICAgfVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBsaXN0IG9mIGVsZW1lbnRzIHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fCFBcnJheTwhRWxlbWVudD58IU5vZGVMaXN0fCFIVE1MQ29sbGVjdGlvbn0gZWxlbWVudHNcbiAgICogVGhlIGVsZW1lbnRzIHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50c0ludGVybmFsKGVsZW1lbnRzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cy5pdGVtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoLyoqIEB0eXBlIHtBcnJheX0gKi8gKGVsZW1lbnRzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cyA9IFtlbGVtZW50c107XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gZWxlbWVudHMubGVuZ3RoLCBlbGVtZW50OyBpIDwgbjsgaSsrKSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudHNbaV07XG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCk7XG4gICAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50LmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjbGFzcyBmb3IgZnV0dXJlIHVzZSBhbmQgYXR0ZW1wdHMgdG8gdXBncmFkZSBleGlzdGluZyBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWdQdWJsaWN9IGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVySW50ZXJuYWwoY29uZmlnKSB7XG4gICAgLy8gSW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIENsb3N1cmUtY29tcGlsZWQgYW5kIHVuY29tcGlsZWQgY29kZSBhY2Nlc3NpbmdcbiAgICAvLyB0aGlzIG1ldGhvZCwgd2UgbmVlZCB0byBhbGxvdyBmb3IgYm90aCB0aGUgZG90IGFuZCBhcnJheSBzeW50YXggZm9yXG4gICAgLy8gcHJvcGVydHkgYWNjZXNzLiBZb3UnbGwgdGhlcmVmb3JlIHNlZSB0aGUgYGZvby5iYXIgfHwgZm9vWydiYXInXWBcbiAgICAvLyBwYXR0ZXJuIHJlcGVhdGVkIGFjcm9zcyB0aGlzIG1ldGhvZC5cbiAgICB2YXIgd2lkZ2V0TWlzc2luZyA9ICh0eXBlb2YgY29uZmlnLndpZGdldCA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIGNvbmZpZ1snd2lkZ2V0J10gPT09ICd1bmRlZmluZWQnKTtcbiAgICB2YXIgd2lkZ2V0ID0gdHJ1ZTtcblxuICAgIGlmICghd2lkZ2V0TWlzc2luZykge1xuICAgICAgd2lkZ2V0ID0gY29uZmlnLndpZGdldCB8fCBjb25maWdbJ3dpZGdldCddO1xuICAgIH1cblxuICAgIHZhciBuZXdDb25maWcgPSAvKiogQHR5cGUge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnfSAqLyAoe1xuICAgICAgY2xhc3NDb25zdHJ1Y3RvcjogY29uZmlnLmNvbnN0cnVjdG9yIHx8IGNvbmZpZ1snY29uc3RydWN0b3InXSxcbiAgICAgIGNsYXNzTmFtZTogY29uZmlnLmNsYXNzQXNTdHJpbmcgfHwgY29uZmlnWydjbGFzc0FzU3RyaW5nJ10sXG4gICAgICBjc3NDbGFzczogY29uZmlnLmNzc0NsYXNzIHx8IGNvbmZpZ1snY3NzQ2xhc3MnXSxcbiAgICAgIHdpZGdldDogd2lkZ2V0LFxuICAgICAgY2FsbGJhY2tzOiBbXVxuICAgIH0pO1xuXG4gICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKGl0ZW0uY3NzQ2xhc3MgPT09IG5ld0NvbmZpZy5jc3NDbGFzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBjc3NDbGFzcyBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQ6ICcgK1xuICAgICAgICAgICAgaXRlbS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5jbGFzc05hbWUgPT09IG5ld0NvbmZpZy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY2xhc3NOYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgLmhhc093blByb3BlcnR5KGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnTURMIGNvbXBvbmVudCBjbGFzc2VzIG11c3Qgbm90IGhhdmUgJyArIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyArXG4gICAgICAgICAgJyBkZWZpbmVkIGFzIGEgcHJvcGVydHkuJyk7XG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oY29uZmlnLmNsYXNzQXNTdHJpbmcsIG5ld0NvbmZpZyk7XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50c18ucHVzaChuZXdDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdXNlciB0byBiZSBhbGVydGVkIHRvIGFueSB1cGdyYWRlcyB0aGF0IGFyZSBwZXJmb3JtZWQgZm9yIGEgZ2l2ZW5cbiAgICogY29tcG9uZW50IHR5cGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpzQ2xhc3MgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIE1ETCBjb21wb25lbnQgd2Ugd2lzaFxuICAgKiB0byBob29rIGludG8gZm9yIGFueSB1cGdyYWRlcyBwZXJmb3JtZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oIUhUTUxFbGVtZW50KX0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGNhbGwgdXBvbiBhblxuICAgKiB1cGdyYWRlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBleHBlY3QgMSBwYXJhbWV0ZXIgLSB0aGUgSFRNTEVsZW1lbnQgd2hpY2hcbiAgICogZ290IHVwZ3JhZGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrSW50ZXJuYWwoanNDbGFzcywgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVnQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICBpZiAocmVnQ2xhc3MpIHtcbiAgICAgIHJlZ0NsYXNzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsKCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmxlbmd0aDsgbisrKSB7XG4gICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW25dLmNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuICAgKiBFeGVjdXRlIGlmIGZvdW5kLlxuICAgKiBSZW1vdmUgY29tcG9uZW50IGZyb20gY3JlYXRlZENvbXBvbmVudHMgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHs/Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnR9IGNvbXBvbmVudCBUaGUgY29tcG9uZW50IHRvIGRvd25ncmFkZS5cbiAgICovXG4gIGZ1bmN0aW9uIGRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwoY29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgdmFyIGNvbXBvbmVudEluZGV4ID0gY3JlYXRlZENvbXBvbmVudHNfLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5zcGxpY2UoY29tcG9uZW50SW5kZXgsIDEpO1xuXG4gICAgICB2YXIgdXBncmFkZXMgPVxuICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKS5zcGxpdCgnLCcpO1xuICAgICAgdmFyIGNvbXBvbmVudFBsYWNlID1cbiAgICAgICAgICB1cGdyYWRlcy5pbmRleE9mKGNvbXBvbmVudFtjb21wb25lbnRDb25maWdQcm9wZXJ0eV9dLmNsYXNzQXNTdHJpbmcpO1xuICAgICAgdXBncmFkZXMuc3BsaWNlKGNvbXBvbmVudFBsYWNlLCAxKTtcbiAgICAgIGNvbXBvbmVudC5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnLCB1cGdyYWRlcy5qb2luKCcsJykpO1xuXG4gICAgICB2YXIgZXY7XG4gICAgICBpZiAoJ0N1c3RvbUV2ZW50JyBpbiB3aW5kb3cgJiYgdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldiA9IG5ldyBFdmVudCgnbWRsLWNvbXBvbmVudGRvd25ncmFkZWQnLCB7XG4gICAgICAgICAgJ2J1YmJsZXMnOiB0cnVlLCAnY2FuY2VsYWJsZSc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnRzJyk7XG4gICAgICAgIGV2LmluaXRFdmVudCgnbWRsLWNvbXBvbmVudGRvd25ncmFkZWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRG93bmdyYWRlIGVpdGhlciBhIGdpdmVuIG5vZGUsIGFuIGFycmF5IG9mIG5vZGVzLCBvciBhIE5vZGVMaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfCFBcnJheTwhTm9kZT58IU5vZGVMaXN0fSBub2RlcyBUaGUgbGlzdCBvZiBub2Rlcy5cbiAgICovXG4gIGZ1bmN0aW9uIGRvd25ncmFkZU5vZGVzSW50ZXJuYWwobm9kZXMpIHtcbiAgICAvKipcbiAgICAgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gZG93bmdyYWRlIGEgc2luZ2xlIG5vZGUuXG4gICAgICogQHBhcmFtICB7IU5vZGV9IG5vZGUgdGhlIG5vZGUgdG8gYmUgZG93bmdyYWRlZFxuICAgICAqL1xuICAgIHZhciBkb3duZ3JhZGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgY3JlYXRlZENvbXBvbmVudHNfLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmVsZW1lbnRfID09PSBub2RlO1xuICAgICAgfSkuZm9yRWFjaChkZWNvbnN0cnVjdENvbXBvbmVudEludGVybmFsKTtcbiAgICB9O1xuICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5IHx8IG5vZGVzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgZG93bmdyYWRlTm9kZShub2Rlc1tuXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIGRvd25ncmFkZU5vZGUobm9kZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gZG93bmdyYWRlIE1ETCBub2Rlcy4nKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3cgcmV0dXJuIHRoZSBmdW5jdGlvbnMgdGhhdCBzaG91bGQgYmUgbWFkZSBwdWJsaWMgd2l0aCB0aGVpciBwdWJsaWNseVxuICAvLyBmYWNpbmcgbmFtZXMuLi5cbiAgcmV0dXJuIHtcbiAgICB1cGdyYWRlRG9tOiB1cGdyYWRlRG9tSW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnQ6IHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnRzOiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbCxcbiAgICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogdXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCxcbiAgICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsLFxuICAgIHJlZ2lzdGVyOiByZWdpc3RlckludGVybmFsLFxuICAgIGRvd25ncmFkZUVsZW1lbnRzOiBkb3duZ3JhZGVOb2Rlc0ludGVybmFsXG4gIH07XG59KSgpO1xuXG4vKipcbiAqIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IHR5cGUgbWFuYWdlZCBieVxuICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgY29uc3RydWN0b3I6IEZ1bmN0aW9uLFxuICogICBjbGFzc0FzU3RyaW5nOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogKHN0cmluZ3xib29sZWFufHVuZGVmaW5lZClcbiAqIH19XG4gKi9cbmNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBjb25zdHJ1Y3RvcjogIUZ1bmN0aW9uLFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiAoc3RyaW5nfGJvb2xlYW4pLFxuICogICBjYWxsYmFja3M6ICFBcnJheTxmdW5jdGlvbighSFRNTEVsZW1lbnQpPlxuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuLyoqXG4gKiBDcmVhdGVkIGNvbXBvbmVudCAoaS5lLiwgdXBncmFkZWQgZWxlbWVudCkgdHlwZSBhcyBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBlbGVtZW50XzogIUhUTUxFbGVtZW50LFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY2xhc3NBc1N0cmluZzogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IHN0cmluZ1xuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuLy8gRXhwb3J0IGFsbCBzeW1ib2xzLCBmb3IgdGhlIGJlbmVmaXQgb2YgQ2xvc3VyZSBjb21waWxlci5cbi8vIE5vIGVmZmVjdCBvbiB1bmNvbXBpbGVkIGNvZGUuXG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRG9tJ10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVEb207XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRWxlbWVudCddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudDtcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudHM7XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlQWxsUmVnaXN0ZXJlZCddID1cbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrJ10gPVxuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXInXSA9IGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXI7XG5jb21wb25lbnRIYW5kbGVyWydkb3duZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci5kb3duZ3JhZGVFbGVtZW50cztcbndpbmRvdy5jb21wb25lbnRIYW5kbGVyID0gY29tcG9uZW50SGFuZGxlcjtcbndpbmRvd1snY29tcG9uZW50SGFuZGxlciddID0gY29tcG9uZW50SGFuZGxlcjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIFwiQ3V0dGluZyB0aGUgbXVzdGFyZFwiIHRlc3QuIElmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBmZWF0dXJlc1xuICAgKiB0ZXN0ZWQsIGFkZHMgYSBtZGwtanMgY2xhc3MgdG8gdGhlIDxodG1sPiBlbGVtZW50LiBJdCB0aGVuIHVwZ3JhZGVzIGFsbCBNRExcbiAgICogY29tcG9uZW50cyByZXF1aXJpbmcgSmF2YVNjcmlwdC5cbiAgICovXG4gIGlmIChcbiAgICAgICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJlxuICAgICAgJ3F1ZXJ5U2VsZWN0b3InIGluIGRvY3VtZW50ICYmXG4gICAgICAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICYmXG4gICAgICAnZm9yRWFjaCcgaW4gQXJyYXkucHJvdG90eXBlKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kbC1qcycpO1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQoKTtcbiAgfSBlbHNlIHtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge307XG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb24gdG8gYXZvaWQgSlMgZXJyb3JzLlxuICAgICAqL1xuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHt9O1xuICB9XG59KTtcbiIsIi8qXG4gKiBzdGVlciAtIHYyLjEuMVxuICogaHR0cHM6Ly9naXRodWIuY29tL2plcmVtZW5pY2hlbGxpL3N0ZWVyXG4gKiAyMDE0IChjKSBKZXJlbWlhcyBNZW5pY2hlbGxpIC0gTUlUIExpY2Vuc2VcbiovXG5cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3Quc3RlZXIgPSBmYWN0b3J5KCk7XG4gICAgfVxufSkodGhpcywgZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHkgPSAwLFxuICAgICAgICByb290ID0gd2luZG93LFxuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgICBldmVudHM6IHRydWUsXG4gICAgICAgICAgICB1cDogZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICAgIGRvd246IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSxcbiAgICAgICAgZGlyZWN0aW9uID0gbnVsbCxcbiAgICAgICAgb2xkRGlyZWN0aW9uID0gbnVsbDtcblxuICAgIC8qXG4gICAgICogUmVwbGFjZXMgY29uZmlndXJhdGlvbiB2YWx1ZXMgd2l0aCBjdXN0b20gb25lc1xuICAgICAqIEBtZXRob2QgX3NldENvbmZpZ09iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBvYmplY3QgY29udGFpbmluZyBjdXN0b20gb3B0aW9uc1xuICAgICAqL1xuICAgIHZhciBfc2V0Q29uZmlnT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIHdpdGggY3VzdG9tIGF0dHJpYnV0ZXNcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBNYWluIGZ1bmN0aW9uIHdoaWNoIHNldHMgYWxsIHZhcmlhYmxlcyBhbmQgYmluZCBldmVudHMgaWYgbmVlZGVkXG4gICAgICogQG1ldGhvZCBfc2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ09iaiBvYmplY3QgY29udGFpbmluZyBjdXN0b20gb3B0aW9uc1xuICAgICAqL1xuICAgIHZhciBfc2V0ID0gZnVuY3Rpb24oY29uZmlnT2JqKSB7XG4gICAgICAgIF9zZXRDb25maWdPYmplY3QoY29uZmlnT2JqKTtcblxuICAgICAgICBpZiAoY29uZmlnLmV2ZW50cykge1xuICAgICAgICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBfY29tcGFyZURpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBDcm9zcyBicm93c2VyIHdheSB0byBnZXQgaG93IG11Y2ggaXMgc2Nyb2xsZWRcbiAgICAgKiBAbWV0aG9kIF9nZXRZUG9zaXRpb25cbiAgICAgKi9cbiAgICB2YXIgX2dldFlQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcm9vdC5zY3JvbGxZIHx8IHJvb3QucGFnZVlPZmZzZXQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogUmV0dXJucyBkaXJlY3Rpb24gYW5kIHVwZGF0ZXMgcG9zaXRpb24gdmFyaWFibGVcbiAgICAgKiBAbWV0aG9kIF9nZXREaXJlY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgX2dldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0dWFsUG9zaXRpb24gPSBfZ2V0WVBvc2l0aW9uKCksXG4gICAgICAgICAgICBkaXJlY3Rpb247XG5cbiAgICAgICAgZGlyZWN0aW9uID0gYWN0dWFsUG9zaXRpb24gPCB5ID8gJ3VwJyA6ICdkb3duJztcblxuICAgICAgICAvLyB1cGRhdGVzIGdlbmVyYWwgcG9zaXRpb24gdmFyaWFibGVcbiAgICAgICAgeSA9IGFjdHVhbFBvc2l0aW9uO1xuXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ29tcGFyZXMgb2xkIGFuZCBuZXcgZGlyZWN0aW9ucyBhbmQgY2FsbCBzcGVjaWZpYyBmdW5jdGlvblxuICAgICAqIEBtZXRob2QgX2NvbXBhcmVEaXJlY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgX2NvbXBhcmVEaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGlyZWN0aW9uID0gX2dldERpcmVjdGlvbigpO1xuXG4gICAgICAgIC8vIHdoZW4gZGlyZWN0aW9uIGNoYW5nZXMgdXBkYXRlIGFuZCBjYWxsIG1ldGhvZFxuICAgICAgICBpZiAoZGlyZWN0aW9uICE9PSBvbGREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIG9sZERpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgICAgIGNvbmZpZ1tkaXJlY3Rpb25dLmNhbGwocm9vdCwgeSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0OiBfc2V0LFxuICAgICAgICB0cmlnZ2VyOiBfY29tcGFyZURpcmVjdGlvblxuICAgIH07XG59KTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBDbGFzcyBjb25zdHJ1Y3Rvci5cblx0ICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG5cdCAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuXHQgKi9cblx0dmFyIERyb3Bkb3duID0gZnVuY3Rpb24gRHJvcGRvd24oZWxlbWVudCkge1xuXHRcdHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9O1xuXHR3aW5kb3dbJ0Ryb3Bkb3duJ10gPSBEcm9wZG93bjtcblxuXHQvKipcblx0ICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudC5cblx0ICpcblx0ICogQGVudW0ge3N0cmluZ31cblx0ICogQHByaXZhdGVcblx0ICovXG5cdERyb3Bkb3duLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcblx0XHREUk9QRE9XTl9JU19BQ1RJVkU6ICdpcy1hY3RpdmUnLFxuXHRcdERST1BET1dOX0lTX0JFRk9SRTogJ2pzLWRyb3AtYmVmb3JlJyxcblx0XHREUk9QRE9XTl9QQVJFTlQ6ICdqcy13aXRoLXBhcmVudCcsXG5cdFx0UEFSRU5UX0lTX0FDVElWRTogJ2lzLWFjdGl2ZScsXG5cdH07XG5cblxuXHREcm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuYm91bmRDbGlja0hhbmRsZXIgPSB0aGlzLmNsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kQ2xpY2tIYW5kbGVyKTtcblx0fTtcblxuXHREcm9wZG93bi5wcm90b3R5cGUuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQkVGT1JFKSkge1xuXHRcdFx0dmFyIHRhcmdldFNpYmxpbmcgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHRhcmdldFNpYmxpbmcgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdH1cblx0XHR2YXIgdGFyZ2V0UGFyZW50ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG5cdFx0aWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQUNUSVZFKSkge1xuXHRcdFx0VHdlZW5MaXRlLnNldCh0YXJnZXRTaWJsaW5nLCB7XG5cdFx0XHRcdGhlaWdodDogXCJhdXRvXCIsXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdH0pO1xuXHRcdFx0VHdlZW5MaXRlLmZyb20odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHRcdGhlaWdodDogMCxcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0fSk7XG5cdFx0XHRUd2VlbkxpdGUudG8odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHRcdHBhZGRpbmdUb3A6IDEwLFxuXHRcdFx0XHRwYWRkaW5nQm90dG9tOiAxMFxuXHRcdFx0fSk7XG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0FDVElWRSk7XG5cdFx0XHR0YXJnZXRTaWJsaW5nLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9QQVJFTlQpKSB7XG5cdFx0XHRcdHRhcmdldFBhcmVudC5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUEFSRU5UX0lTX0FDVElWRSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdFR3ZWVuTGl0ZS50byh0YXJnZXRTaWJsaW5nLCAwLjIsIHtcblx0XHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR9KTtcblx0XHRcdFR3ZWVuTGl0ZS50byh0YXJnZXRTaWJsaW5nLCAwLjIsIHtcblx0XHRcdFx0cGFkZGluZ1RvcDogMCxcblx0XHRcdFx0cGFkZGluZ0JvdHRvbTogMFxuXHRcdFx0fSk7XG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0FDVElWRSk7XG5cdFx0XHR0YXJnZXRTaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9QQVJFTlQpKSB7XG5cdFx0XHRcdHRhcmdldFBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uUEFSRU5UX0lTX0FDVElWRSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEb3duZ3JhZGUgdGhlIGNvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdERyb3Bkb3duLnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRDbGlja0hhbmRsZXIpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQdWJsaWMgYWxpYXMgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlID1cblx0XHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlXztcblxuXHREcm9wZG93bi5wcm90b3R5cGVbJ21kbERvd25ncmFkZSddID1cblx0XHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlO1xuXG5cdC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuXHQvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuXHRjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcblx0XHRjb25zdHJ1Y3RvcjogRHJvcGRvd24sXG5cdFx0Y2xhc3NBc1N0cmluZzogJ0Ryb3Bkb3duJyxcblx0XHRjc3NDbGFzczogJ2pzLWRyb3Bkb3duJ1xuXHR9KTtcbn0pKCk7XG4iLCJcbi8vIFN0ZWVyIGZpeCBoZWFkZXJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0Ly8gZ2V0dGluZyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgbWVzc2FnZSBnb2VzXG5cdHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyJyk7XG5cdC8vIGNhbGxpbmcgc3RlZXJcblx0c3RlZXIuc2V0KHtcblx0XHRldmVudHM6IGZhbHNlLFxuXHRcdHVwOiBmdW5jdGlvbihwb3NpdGlvbikge1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2ZhZGVJbkRvd24nKTtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0VXAnKTtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCd1LWZpeCcpO1xuXHRcdH0sXG5cdFx0ZG93bjogZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCdmYWRlT3V0VXAnKTtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW5Eb3duJyk7XG5cdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgndS1maXgnKTtcblx0XHR9XG5cdH0pO1xuXHR3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgeSA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXHRcdGlmICh5ID4gMTMxKSB7XG5cdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdG9wJyk7XG5cdFx0XHRzdGVlci50cmlnZ2VyKCk7XG5cdFx0fVxuXHRcdGlmICh5ID09IDApIHtcblx0XHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCd1LWZpeCcpO1xuXHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2lzLXRvcCcpO1xuXHRcdH1cblx0fTtcbn1cbiIsIlxuXG4vLyBPZmYtY2FudmFzIHNpZGViYXJcbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBsZXQgcXVlcnlTZWxlY3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IuYmluZChkb2N1bWVudCk7XG5cbiAgbGV0IHNpZGVOYXYgPSBxdWVyeVNlbGVjdG9yKCcjbWVudS1wcmltYXJ5Jyk7XG4gIGxldCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgbGV0IHNpdGVIZWFkZXIgPSBxdWVyeVNlbGVjdG9yKCcjaGVhZGVyJyk7XG4gIGxldCBtZW51QnRuID0gcXVlcnlTZWxlY3RvcignI3NpZGUtbWVudS10b2dnbGUnKTtcbiAgbGV0IGNvbnRlbnRNYXNrID0gcXVlcnlTZWxlY3RvcignI2NvbnRlbnQtbWFzaycpO1xuXG4gIGZ1bmN0aW9uIGNsb3NlTWVudSgpIHtcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Utb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgc2l0ZUhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdzaWRlYmFyLW9wZW4nKTtcbiAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXHRjb250ZW50TWFzay5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZU1lbnUoKSB7XG4gICAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd1LW92ZXJmbG93LWhpZGRlbicpO1xuICAgIHNpdGVIZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnc2lkZWJhci1vcGVuJyk7XG4gICAgc2lkZU5hdi5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnKTtcbiAgICBjb250ZW50TWFzay5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnKTtcbiAgICBzaWRlTmF2LmNsYXNzTGlzdC5hZGQoJ2hhcy1vcGVuZWQnKTtcbiAgfVxuXG4gIGNvbnRlbnRNYXNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNZW51KTtcbiAgbWVudUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU1lbnUpO1xuICBzaWRlTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0EnIHx8IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0xJJykge1xuICAgICAgY2xvc2VNZW51KCk7XG4gICAgfVxuICB9KTtcbn0pKCk7XG5cblxudmFyIGRvbVJlYWR5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fFxuICBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgPyBjYWxsYmFjaygpIDogZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2spO1xufTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
