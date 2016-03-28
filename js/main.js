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

      var ev = document.createEvent('Events');
      ev.initEvent('mdl-componentupgraded', true, true);
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
    var componentIndex = createdComponents_.indexOf(component);
    createdComponents_.splice(componentIndex, 1);

    var upgrades = component.element_.getAttribute('data-upgraded').split(',');
    var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
    upgrades.splice(componentPlace, 1);
    component.element_.setAttribute('data-upgraded', upgrades.join(','));

    var ev = document.createEvent('Events');
    ev.initEvent('mdl-componentdowngraded', true, true);
    component.element_.dispatchEvent(ev);
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

(function() {
  'use strict';

  /**
   * Class constructor for dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialMenu = function MaterialMenu(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialMenu'] = MaterialMenu;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialMenu.prototype.Constant_ = {
    // Total duration of the menu animation.
    TRANSITION_DURATION_SECONDS: 0.3,
    // The fraction of the total duration we want to use for menu item animations.
    TRANSITION_DURATION_FRACTION: 0.8,
    // How long the menu stays open after choosing an option (so the user can see
    // the ripple).
    CLOSE_TIMEOUT: 150
  };

  /**
   * Keycodes, for code readability.
   *
   * @enum {number}
   * @private
   */
  MaterialMenu.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    UP_ARROW: 38,
    DOWN_ARROW: 40
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialMenu.prototype.CssClasses_ = {
    CONTAINER: 'mdl-menu__container',
    OUTLINE: 'mdl-menu__outline',
    ITEM: 'mdl-menu__item',
    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    // Statuses
    IS_UPGRADED: 'is-upgraded',
    IS_VISIBLE: 'is-visible',
    IS_ANIMATING: 'is-animating',
    // Alignment options
    BOTTOM_LEFT: 'mdl-menu--bottom-left',  // This is the default.
    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
    TOP_LEFT: 'mdl-menu--top-left',
    TOP_RIGHT: 'mdl-menu--top-right',
    UNALIGNED: 'mdl-menu--unaligned'
  };

  /**
   * Initialize element.
   */
  MaterialMenu.prototype.init = function() {
    if (this.element_) {
      // Create container for the menu.
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);
      this.container_ = container;

      // Create outline for the menu (shadow and background).
      var outline = document.createElement('div');
      outline.classList.add(this.CssClasses_.OUTLINE);
      this.outline_ = outline;
      container.insertBefore(outline, this.element_);

      // Find the "for" element and bind events to it.
      var forElId = this.element_.getAttribute('for') ||
                      this.element_.getAttribute('data-mdl-for');
      var forEl = null;
      if (forElId) {
        forEl = document.getElementById(forElId);
        if (forEl) {
          this.forElement_ = forEl;
          forEl.addEventListener('click', this.handleForClick_.bind(this));
          forEl.addEventListener('keydown',
              this.handleForKeyboardEvent_.bind(this));
        }
      }

      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
      this.boundItemClick_ = this.handleItemClick_.bind(this);
      for (var i = 0; i < items.length; i++) {
        // Add a listener to each menu item.
        items[i].addEventListener('click', this.boundItemClick_);
        // Add a tab index to each menu item.
        items[i].tabIndex = '-1';
        // Add a keyboard listener to each menu item.
        items[i].addEventListener('keydown', this.boundItemKeydown_);
      }

      // Add ripple classes to each item, if the user has enabled ripples.
      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

        for (i = 0; i < items.length; i++) {
          var item = items[i];

          var rippleContainer = document.createElement('span');
          rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);

          var ripple = document.createElement('span');
          ripple.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(ripple);

          item.appendChild(rippleContainer);
          item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
        }
      }

      // Copy alignment classes to the container, so the outline can use them.
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
      }
      if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
      }
      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        this.outline_.classList.add(this.CssClasses_.UNALIGNED);
      }

      container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Handles a click on the "for" element, by positioning the menu and then
   * toggling it.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleForClick_ = function(evt) {
    if (this.element_ && this.forElement_) {
      var rect = this.forElement_.getBoundingClientRect();
      var forRect = this.forElement_.parentElement.getBoundingClientRect();

      if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        // Do not position the menu automatically. Requires the developer to
        // manually specify position.
      } else if (this.element_.classList.contains(
          this.CssClasses_.BOTTOM_RIGHT)) {
        // Position below the "for" element, aligned to its right.
        this.container_.style.right = (forRect.right - rect.right) + 'px';
        this.container_.style.top =
            this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        // Position above the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
      } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        // Position above the "for" element, aligned to its right.
        this.container_.style.right = (forRect.right - rect.right) + 'px';
        this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
      } else {
        // Default: position below the "for" element, aligned to its left.
        this.container_.style.left = this.forElement_.offsetLeft + 'px';
        this.container_.style.top =
            this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
      }
    }

    this.toggle(evt);
  };

  /**
   * Handles a keyboard event on the "for" element.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleForKeyboardEvent_ = function(evt) {
    if (this.element_ && this.container_ && this.forElement_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
        ':not([disabled])');

      if (items && items.length > 0 &&
          this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          items[items.length - 1].focus();
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          items[0].focus();
        }
      }
    }
  };

  /**
   * Handles a keyboard event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleItemKeyboardEvent_ = function(evt) {
    if (this.element_ && this.container_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
        ':not([disabled])');

      if (items && items.length > 0 &&
          this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

        if (evt.keyCode === this.Keycodes_.UP_ARROW) {
          evt.preventDefault();
          if (currentIndex > 0) {
            items[currentIndex - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
          evt.preventDefault();
          if (items.length > currentIndex + 1) {
            items[currentIndex + 1].focus();
          } else {
            items[0].focus();
          }
        } else if (evt.keyCode === this.Keycodes_.SPACE ||
              evt.keyCode === this.Keycodes_.ENTER) {
          evt.preventDefault();
          // Send mousedown and mouseup to trigger ripple.
          var e = new MouseEvent('mousedown');
          evt.target.dispatchEvent(e);
          e = new MouseEvent('mouseup');
          evt.target.dispatchEvent(e);
          // Send click.
          evt.target.click();
        } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
          evt.preventDefault();
          this.hide();
        }
      }
    }
  };

  /**
   * Handles a click event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
  MaterialMenu.prototype.handleItemClick_ = function(evt) {
    if (evt.target.hasAttribute('disabled')) {
      evt.stopPropagation();
    } else {
      // Wait some time before closing menu, so the user can see the ripple.
      this.closing_ = true;
      window.setTimeout(function(evt) {
        this.hide();
        this.closing_ = false;
      }.bind(this), /** @type {number} */ (this.Constant_.CLOSE_TIMEOUT));
    }
  };

  /**
   * Calculates the initial clip (for opening the menu) or final clip (for closing
   * it), and applies it. This allows us to animate from or to the correct point,
   * that is, the point it's aligned to in the "for" element.
   *
   * @param {number} height Height of the clip rectangle
   * @param {number} width Width of the clip rectangle
   * @private
   */
  MaterialMenu.prototype.applyClip_ = function(height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      // Do not clip.
      this.element_.style.clip = '';
    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
      // Clip to the top right corner of the menu.
      this.element_.style.clip =
          'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      // Clip to the bottom left corner of the menu.
      this.element_.style.clip =
          'rect(' + height + 'px 0 ' + height + 'px 0)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      // Clip to the bottom right corner of the menu.
      this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' +
          height + 'px ' + width + 'px)';
    } else {
      // Default: do not clip (same as clipping to the top left corner).
      this.element_.style.clip = '';
    }
  };

  /**
   * Cleanup function to remove animation listeners.
   *
   * @param {Event} evt
   * @private
   */

  MaterialMenu.prototype.removeAnimationEndListener_ = function(evt) {
    evt.target.classList.remove(MaterialMenu.prototype.CssClasses_.IS_ANIMATING);
  };

  /**
   * Adds an event listener to clean up after the animation ends.
   *
   * @private
   */
  MaterialMenu.prototype.addAnimationEndListener_ = function() {
    this.element_.addEventListener('transitionend', this.removeAnimationEndListener_);
    this.element_.addEventListener('webkitTransitionEnd', this.removeAnimationEndListener_);
  };

  /**
   * Displays the menu.
   *
   * @public
   */
  MaterialMenu.prototype.show = function(evt) {
    if (this.element_ && this.container_ && this.outline_) {
      // Measure the inner element.
      var height = this.element_.getBoundingClientRect().height;
      var width = this.element_.getBoundingClientRect().width;

      // Apply the inner element's size to the container and outline.
      this.container_.style.width = width + 'px';
      this.container_.style.height = height + 'px';
      this.outline_.style.width = width + 'px';
      this.outline_.style.height = height + 'px';

      var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS *
          this.Constant_.TRANSITION_DURATION_FRACTION;

      // Calculate transition delays for individual menu items, so that they fade
      // in one at a time.
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
      for (var i = 0; i < items.length; i++) {
        var itemDelay = null;
        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ||
            this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
          itemDelay = ((height - items[i].offsetTop - items[i].offsetHeight) /
              height * transitionDuration) + 's';
        } else {
          itemDelay = (items[i].offsetTop / height * transitionDuration) + 's';
        }
        items[i].style.transitionDelay = itemDelay;
      }

      // Apply the initial clip to the text before we start animating.
      this.applyClip_(height, width);

      // Wait for the next frame, turn on animation, and apply the final clip.
      // Also make it visible. This triggers the transitions.
      window.requestAnimationFrame(function() {
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
        this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
      }.bind(this));

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();

      // Add a click listener to the document, to close the menu.
      var callback = function(e) {
        // Check to see if the document is processing the same event that
        // displayed the menu in the first place. If so, do nothing.
        // Also check to see if the menu is in the process of closing itself, and
        // do nothing in that case.
        // Also check if the clicked element is a menu item
        // if so, do nothing.
        if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
          document.removeEventListener('click', callback);
          this.hide();
        }
      }.bind(this);
      document.addEventListener('click', callback);
    }
  };
  MaterialMenu.prototype['show'] = MaterialMenu.prototype.show;

  /**
   * Hides the menu.
   *
   * @public
   */
  MaterialMenu.prototype.hide = function() {
    if (this.element_ && this.container_ && this.outline_) {
      var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

      // Remove all transition delays; menu items fade out concurrently.
      for (var i = 0; i < items.length; i++) {
        items[i].style.removeProperty('transition-delay');
      }

      // Measure the inner element.
      var rect = this.element_.getBoundingClientRect();
      var height = rect.height;
      var width = rect.width;

      // Turn on animation, and apply the final clip. Also make invisible.
      // This triggers the transitions.
      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
      this.applyClip_(height, width);
      this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);

      // Clean up after the animation is complete.
      this.addAnimationEndListener_();
    }
  };
  MaterialMenu.prototype['hide'] = MaterialMenu.prototype.hide;

  /**
   * Displays or hides the menu, depending on current state.
   *
   * @public
   */
  MaterialMenu.prototype.toggle = function(evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
      this.hide();
    } else {
      this.show(evt);
    }
  };
  MaterialMenu.prototype['toggle'] = MaterialMenu.prototype.toggle;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
  });
})();

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

(function() {
  'use strict';

  /**
   * Class constructor for Tabs MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  var MaterialTabs = function MaterialTabs(element) {
    // Stores the HTML element.
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialTabs'] = MaterialTabs;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string}
   * @private
   */
  MaterialTabs.prototype.Constant_ = {
    // None at the moment.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialTabs.prototype.CssClasses_ = {
    TAB_CLASS: 'mdl-tabs__tab',
    PANEL_CLASS: 'mdl-tabs__panel',
    ACTIVE_CLASS: 'is-active',
    UPGRADED_CLASS: 'is-upgraded',

    MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
    MDL_RIPPLE: 'mdl-ripple',
    MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
  };

  /**
   * Handle clicks to a tabs component
   *
   * @private
   */
  MaterialTabs.prototype.initTabs_ = function() {
    if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
      this.element_.classList.add(
        this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
    }

    // Select element tabs, document panels
    this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
    this.panels_ =
        this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);

    // Create new tabs for each tab element
    for (var i = 0; i < this.tabs_.length; i++) {
      new MaterialTab(this.tabs_[i], this);
    }

    this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
  };

  /**
   * Reset tab state, dropping active classes
   *
   * @private
   */
  MaterialTabs.prototype.resetTabState_ = function() {
    for (var k = 0; k < this.tabs_.length; k++) {
      this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
  };

  /**
   * Reset panel state, droping active classes
   *
   * @private
   */
  MaterialTabs.prototype.resetPanelState_ = function() {
    for (var j = 0; j < this.panels_.length; j++) {
      this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
  };

  /**
   * Initialize element.
   */
  MaterialTabs.prototype.init = function() {
    if (this.element_) {
      this.initTabs_();
    }
  };

  /**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {Element} tab The HTML element for the tab.
   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
   */
  function MaterialTab(tab, ctx) {
    if (tab) {
      if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
        rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
        var ripple = document.createElement('span');
        ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
        rippleContainer.appendChild(ripple);
        tab.appendChild(rippleContainer);
      }

      tab.addEventListener('click', function(e) {
        e.preventDefault();
        var href = tab.href.split('#')[1];
        var panel = ctx.element_.querySelector('#' + href);
        ctx.resetTabState_();
        ctx.resetPanelState_();
        tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
        panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
      });

    }
  }

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialTabs,
    classAsString: 'MaterialTabs',
    cssClass: 'mdl-js-tabs'
  });
})();

/*
 * steer - v2.0.2
 * https://github.com/jeremenichelli/steer
 * 2014 (c) Jeremias Menichelli - MIT License
*/

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.steer = factory();
    }
})(this, function() {
    var y = 0,
        config = {
            events: true,
            up: undefined,
            down: undefined
        },
        direction = 'null',
        oldDirection = 'null',
        root = window;

    /*
     * Binds event on scroll
     * @method
     * @param {function} fn - function to call on scroll
     */
    var _bindScrollEvent = function(fn) {
        if (root.addEventListener) {
            root.addEventListener('scroll', fn, false);
        } else if (root.attachEvent) {
            root.attachEvent('onscroll', fn);
        } else {
            root.onscroll = fn;
        }
    };

    /*
     * Replaces configuration values with custom ones
     * @method
     * @param {object} obj - object containing custom options
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
     * Calls a function inside a try catch structure
     * @method
     * @param {function} fn - function to call
     * @param {array} args - arguments to use in the function
     */
    var _safeFn = function(fn, args) {
        if (typeof fn === 'function') {
            try {
                fn.apply(null, args);
            } catch (e) {
                console.error(e);
            }
        }
    };

    /*
     * Main function which sets all variables and bind events if needed
     * @method
     * @param {object} configObj - object containing custom options
     */
    var _set = function(configObj) {
        _setConfigObject(configObj);

        if (config.events) {
            _bindScrollEvent(_compareDirection);
        }
    };

    /*
     * Cross browser way to get how much is scrolled
     * @method
     */
    var _getYPosition = function() {
        return root.scrollY || root.pageYOffset || document.documentElement.scrollTop;
    };

    /*
     * Returns direction and updates position variable
     * @method
     */
    var _getDirection = function() {
        var actualPosition = _getYPosition(),
            direction;

        direction = (actualPosition < y) ? 'up' : 'down';

        // updates general position variable
        y = actualPosition;

        return direction;
    };

    /*
     * Compares old and new directions and call specific function
     * @method
     */
    var _compareDirection = function() {
        direction = _getDirection();

        if (direction !== oldDirection) {
            oldDirection = direction;
            _safeFn(config[direction], [ y ]);
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

// Open the first Tab by default.
function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}


ready(function() {
	var firstTab = document.getElementsByClassName('mdl-tabs__tab')[0];
	var firstPanel = document.getElementsByClassName('mdl-tabs__panel')[0];
	firstTab.classList.toggle('is-active');
	firstPanel.classList.toggle('is-active');
});


	window.onload = function() {
		// getting the element where the message goes
		var header = document.getElementById('header');
		// calling steer
		steer.set({
			events: false,
			up: function(position){
				header.classList.add('fadeInDown');
				header.classList.remove('fadeOutUp');
				header.classList.add('u-fix');
			},
			down: function(position){
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

//
// ;(function() {
//     var throttle = function(type, name, obj) {
//         var obj = obj || window;
//         var running = false;
//         var func = function() {
//             if (running) { return; }
//             running = true;
//             requestAnimationFrame(function() {
//                 obj.dispatchEvent(new CustomEvent(name));
//                 running = false;
//             });
//         };
//         obj.addEventListener(type, func);
//     };
//     throttle ("scroll", "optimizedScroll");
// })();
//
// // to use the script *without* anti-jank, set the event to "scroll" and remove the anonymous function.
//
// window.addEventListener("optimizedScroll", function() {
//     if (window.pageYOffset > 0) {
//         document.getElementById("article-hero").style.transform = "translateY(" + window.pageYOffset*(-.9) + "px)";
//     }
// });

'use strict';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1kbENvbXBvbmVudEhhbmRsZXIuanMiLCJtZW51LmpzIiwidGFicy5qcyIsInN0ZWVyLmpzIiwiRHJvcGRvd24uanMiLCJtYWluLmpzIiwiZXM2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbGVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RFQSxDQUFDLFlBQVk7QUFDWCxlQURXOztBQUdYLE1BQUksZ0JBQWdCLFNBQVMsYUFBVCxDQUF1QixJQUF2QixDQUE0QixRQUE1QixDQUFoQixDQUhPOztBQUtYLE1BQUksVUFBVSxjQUFjLGVBQWQsQ0FBVixDQUxPO0FBTVgsTUFBSSxPQUFPLFNBQVMsSUFBVCxDQU5BO0FBT1gsTUFBSSxhQUFhLGNBQWMsU0FBZCxDQUFiLENBUE87QUFRWCxNQUFJLFVBQVUsY0FBYyxtQkFBZCxDQUFWLENBUk87QUFTWCxNQUFJLGNBQWMsY0FBYyxlQUFkLENBQWQsQ0FUTzs7QUFXWCxXQUFTLFNBQVQsR0FBcUI7QUFDbkIsU0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixtQkFBdEIsRUFEbUI7QUFFbkIsZUFBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLGNBQTVCLEVBRm1CO0FBR25CLFlBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixXQUF6QixFQUhtQjtBQUl0QixnQkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFdBQTdCLEVBSnNCO0dBQXJCOztBQU9BLFdBQVMsVUFBVCxHQUFzQjtBQUNwQixTQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLG1CQUF0QixFQURvQjtBQUVwQixlQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsY0FBNUIsRUFGb0I7QUFHcEIsWUFBUSxTQUFSLENBQWtCLE1BQWxCLENBQXlCLFdBQXpCLEVBSG9CO0FBSXBCLGdCQUFZLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsV0FBN0IsRUFKb0I7QUFLcEIsWUFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLFlBQXRCLEVBTG9CO0dBQXRCOztBQVFBLGNBQVksZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsU0FBdEMsRUExQlc7QUEyQlgsVUFBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxVQUFsQyxFQTNCVztBQTRCWCxVQUFRLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFVBQVUsS0FBVixFQUFpQjtBQUNqRCxRQUFJLE1BQU0sTUFBTixDQUFhLFFBQWIsS0FBMEIsR0FBMUIsSUFBaUMsTUFBTSxNQUFOLENBQWEsUUFBYixLQUEwQixJQUExQixFQUFnQztBQUNuRSxrQkFEbUU7S0FBckU7R0FEZ0MsQ0FBbEMsQ0E1Qlc7Q0FBWixDQUFEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNSBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBBIGNvbXBvbmVudCBoYW5kbGVyIGludGVyZmFjZSB1c2luZyB0aGUgcmV2ZWFsaW5nIG1vZHVsZSBkZXNpZ24gcGF0dGVybi5cbiAqIE1vcmUgZGV0YWlscyBvbiB0aGlzIGRlc2lnbiBwYXR0ZXJuIGhlcmU6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gKlxuICogQGF1dGhvciBKYXNvbiBNYXllcy5cbiAqL1xuLyogZXhwb3J0ZWQgY29tcG9uZW50SGFuZGxlciAqL1xuXG4vLyBQcmUtZGVmaW5pbmcgdGhlIGNvbXBvbmVudEhhbmRsZXIgaW50ZXJmYWNlLCBmb3IgY2xvc3VyZSBkb2N1bWVudGF0aW9uIGFuZFxuLy8gc3RhdGljIHZlcmlmaWNhdGlvbi5cbnZhciBjb21wb25lbnRIYW5kbGVyID0ge1xuICAvKipcbiAgICogU2VhcmNoZXMgZXhpc3RpbmcgRE9NIGZvciBlbGVtZW50cyBvZiBvdXIgY29tcG9uZW50IHR5cGUgYW5kIHVwZ3JhZGVzIHRoZW1cbiAgICogaWYgdGhleSBoYXZlIG5vdCBhbHJlYWR5IGJlZW4gdXBncmFkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyB0aGUgcHJvZ3JhbWF0aWMgbmFtZSBvZiB0aGUgZWxlbWVudCBjbGFzcyB3ZVxuICAgKiBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZi5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRDc3NDbGFzcyB0aGUgbmFtZSBvZiB0aGUgQ1NTIGNsYXNzIGVsZW1lbnRzIG9mIHRoaXNcbiAgICogdHlwZSB3aWxsIGhhdmUuXG4gICAqL1xuICB1cGdyYWRlRG9tOiBmdW5jdGlvbihvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGVsZW1lbnQgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgT3B0aW9uYWwgbmFtZSBvZiB0aGUgY2xhc3Mgd2Ugd2FudCB0byB1cGdyYWRlXG4gICAqIHRoZSBlbGVtZW50IHRvLlxuICAgKi9cbiAgdXBncmFkZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdEpzQ2xhc3MpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBsaXN0IG9mIGVsZW1lbnRzIHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fCFBcnJheTwhRWxlbWVudD58IU5vZGVMaXN0fCFIVE1MQ29sbGVjdGlvbn0gZWxlbWVudHNcbiAgICogVGhlIGVsZW1lbnRzIHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICovXG4gIHVwZ3JhZGVFbGVtZW50czogZnVuY3Rpb24oZWxlbWVudHMpIHt9LFxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICAqIEFsbG93cyB1c2VyIHRvIGJlIGFsZXJ0ZWQgdG8gYW55IHVwZ3JhZGVzIHRoYXQgYXJlIHBlcmZvcm1lZCBmb3IgYSBnaXZlblxuICAgKiBjb21wb25lbnQgdHlwZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgTURMIGNvbXBvbmVudCB3ZSB3aXNoXG4gICAqIHRvIGhvb2sgaW50byBmb3IgYW55IHVwZ3JhZGVzIHBlcmZvcm1lZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbighSFRNTEVsZW1lbnQpfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB1cG9uIGFuXG4gICAqIHVwZ3JhZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCAxIHBhcmFtZXRlciAtIHRoZSBIVE1MRWxlbWVudCB3aGljaFxuICAgKiBnb3QgdXBncmFkZWQuXG4gICAqL1xuICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IGZ1bmN0aW9uKGpzQ2xhc3MsIGNhbGxiYWNrKSB7fSxcbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNsYXNzIGZvciBmdXR1cmUgdXNlIGFuZCBhdHRlbXB0cyB0byB1cGdyYWRlIGV4aXN0aW5nIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpY30gY29uZmlnIHRoZSByZWdpc3RyYXRpb24gY29uZmlndXJhdGlvblxuICAgKi9cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKGNvbmZpZykge30sXG4gIC8qKlxuICAgKiBEb3duZ3JhZGUgZWl0aGVyIGEgZ2l2ZW4gbm9kZSwgYW4gYXJyYXkgb2Ygbm9kZXMsIG9yIGEgTm9kZUxpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7IU5vZGV8IUFycmF5PCFOb2RlPnwhTm9kZUxpc3R9IG5vZGVzXG4gICAqL1xuICBkb3duZ3JhZGVFbGVtZW50czogZnVuY3Rpb24obm9kZXMpIHt9XG59O1xuXG5jb21wb25lbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc+fSAqL1xuICB2YXIgcmVnaXN0ZXJlZENvbXBvbmVudHNfID0gW107XG5cbiAgLyoqIEB0eXBlIHshQXJyYXk8Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ+fSAqL1xuICB2YXIgY3JlYXRlZENvbXBvbmVudHNfID0gW107XG5cbiAgdmFyIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyA9ICdtZGxDb21wb25lbnRDb25maWdJbnRlcm5hbF8nO1xuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyByZWdpc3RlcmVkIGNvbXBvbmVudHMgZm9yIGEgY2xhc3Mgd2UgYXJlIGludGVyZXN0ZWQgaW4gdXNpbmcuXG4gICAqIE9wdGlvbmFsbHkgcmVwbGFjZXMgYSBtYXRjaCB3aXRoIHBhc3NlZCBvYmplY3QgaWYgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiBhIGNsYXNzIHdlIHdhbnQgdG8gdXNlLlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnPX0gb3B0UmVwbGFjZSBPcHRpb25hbCBvYmplY3QgdG8gcmVwbGFjZSBtYXRjaCB3aXRoLlxuICAgKiBAcmV0dXJuIHshT2JqZWN0fGJvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kUmVnaXN0ZXJlZENsYXNzXyhuYW1lLCBvcHRSZXBsYWNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY2xhc3NOYW1lID09PSBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0UmVwbGFjZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0gPSBvcHRSZXBsYWNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkQ29tcG9uZW50c19baV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBjbGFzc05hbWVzIG9mIHRoZSB1cGdyYWRlZCBjbGFzc2VzIG9uIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGZldGNoIGRhdGEgZnJvbS5cbiAgICogQHJldHVybiB7IUFycmF5PHN0cmluZz59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBnZXRVcGdyYWRlZExpc3RPZkVsZW1lbnRfKGVsZW1lbnQpIHtcbiAgICB2YXIgZGF0YVVwZ3JhZGVkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnKTtcbiAgICAvLyBVc2UgYFsnJ11gIGFzIGRlZmF1bHQgdmFsdWUgdG8gY29uZm9ybSB0aGUgYCxuYW1lLG5hbWUuLi5gIHN0eWxlLlxuICAgIHJldHVybiBkYXRhVXBncmFkZWQgPT09IG51bGwgPyBbJyddIDogZGF0YVVwZ3JhZGVkLnNwbGl0KCcsJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gdXBncmFkZWQgZm9yIHRoZSBnaXZlblxuICAgKiBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3YW50IHRvIGNoZWNrLlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgdG8gY2hlY2sgZm9yLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBqc0NsYXNzKSB7XG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCk7XG4gICAgcmV0dXJuIHVwZ3JhZGVkTGlzdC5pbmRleE9mKGpzQ2xhc3MpICE9PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2hlcyBleGlzdGluZyBET00gZm9yIGVsZW1lbnRzIG9mIG91ciBjb21wb25lbnQgdHlwZSBhbmQgdXBncmFkZXMgdGhlbVxuICAgKiBpZiB0aGV5IGhhdmUgbm90IGFscmVhZHkgYmVlbiB1cGdyYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIHRoZSBwcm9ncmFtYXRpYyBuYW1lIG9mIHRoZSBlbGVtZW50IGNsYXNzIHdlXG4gICAqIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdENzc0NsYXNzIHRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZWxlbWVudHMgb2YgdGhpc1xuICAgKiB0eXBlIHdpbGwgaGF2ZS5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVEb21JbnRlcm5hbChvcHRKc0NsYXNzLCBvcHRDc3NDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygb3B0SnNDbGFzcyA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdENzc0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdXBncmFkZURvbUludGVybmFsKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jbGFzc05hbWUsXG4gICAgICAgICAgICByZWdpc3RlcmVkQ29tcG9uZW50c19baV0uY3NzQ2xhc3MpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIganNDbGFzcyA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAob3B0SnNDbGFzcyk7XG4gICAgICBpZiAodHlwZW9mIG9wdENzc0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgcmVnaXN0ZXJlZENsYXNzID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oanNDbGFzcyk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3MpIHtcbiAgICAgICAgICBvcHRDc3NDbGFzcyA9IHJlZ2lzdGVyZWRDbGFzcy5jc3NDbGFzcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIG9wdENzc0NsYXNzKTtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgZWxlbWVudHMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgdXBncmFkZUVsZW1lbnRJbnRlcm5hbChlbGVtZW50c1tuXSwganNDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnQsIG9wdEpzQ2xhc3MpIHtcbiAgICAvLyBWZXJpZnkgYXJndW1lbnQgdHlwZS5cbiAgICBpZiAoISh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gdXBncmFkZSBNREwgZWxlbWVudC4nKTtcbiAgICB9XG4gICAgdmFyIHVwZ3JhZGVkTGlzdCA9IGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCk7XG4gICAgdmFyIGNsYXNzZXNUb1VwZ3JhZGUgPSBbXTtcbiAgICAvLyBJZiBqc0NsYXNzIGlzIG5vdCBwcm92aWRlZCBzY2FuIHRoZSByZWdpc3RlcmVkIGNvbXBvbmVudHMgdG8gZmluZCB0aGVcbiAgICAvLyBvbmVzIG1hdGNoaW5nIHRoZSBlbGVtZW50J3MgQ1NTIGNsYXNzTGlzdC5cbiAgICBpZiAoIW9wdEpzQ2xhc3MpIHtcbiAgICAgIHZhciBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyBNYXRjaCBDU1MgJiBOb3QgdG8gYmUgdXBncmFkZWQgJiBOb3QgdXBncmFkZWQuXG4gICAgICAgIGlmIChjbGFzc0xpc3QuY29udGFpbnMoY29tcG9uZW50LmNzc0NsYXNzKSAmJlxuICAgICAgICAgICAgY2xhc3Nlc1RvVXBncmFkZS5pbmRleE9mKGNvbXBvbmVudCkgPT09IC0xICYmXG4gICAgICAgICAgICAhaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGNvbXBvbmVudC5jbGFzc05hbWUpKSB7XG4gICAgICAgICAgY2xhc3Nlc1RvVXBncmFkZS5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIWlzRWxlbWVudFVwZ3JhZGVkXyhlbGVtZW50LCBvcHRKc0NsYXNzKSkge1xuICAgICAgY2xhc3Nlc1RvVXBncmFkZS5wdXNoKGZpbmRSZWdpc3RlcmVkQ2xhc3NfKG9wdEpzQ2xhc3MpKTtcbiAgICB9XG5cbiAgICAvLyBVcGdyYWRlIHRoZSBlbGVtZW50IGZvciBlYWNoIGNsYXNzZXMuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjbGFzc2VzVG9VcGdyYWRlLmxlbmd0aCwgcmVnaXN0ZXJlZENsYXNzOyBpIDwgbjsgaSsrKSB7XG4gICAgICByZWdpc3RlcmVkQ2xhc3MgPSBjbGFzc2VzVG9VcGdyYWRlW2ldO1xuICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAvLyBNYXJrIGVsZW1lbnQgYXMgdXBncmFkZWQuXG4gICAgICAgIHVwZ3JhZGVkTGlzdC5wdXNoKHJlZ2lzdGVyZWRDbGFzcy5jbGFzc05hbWUpO1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcsIHVwZ3JhZGVkTGlzdC5qb2luKCcsJykpO1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgcmVnaXN0ZXJlZENsYXNzLmNsYXNzQ29uc3RydWN0b3IoZWxlbWVudCk7XG4gICAgICAgIGluc3RhbmNlW2NvbXBvbmVudENvbmZpZ1Byb3BlcnR5X10gPSByZWdpc3RlcmVkQ2xhc3M7XG4gICAgICAgIGNyZWF0ZWRDb21wb25lbnRzXy5wdXNoKGluc3RhbmNlKTtcbiAgICAgICAgLy8gQ2FsbCBhbnkgY2FsbGJhY2tzIHRoZSB1c2VyIGhhcyByZWdpc3RlcmVkIHdpdGggdGhpcyBjb21wb25lbnQgdHlwZS5cbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIG0gPSByZWdpc3RlcmVkQ2xhc3MuY2FsbGJhY2tzLmxlbmd0aDsgaiA8IG07IGorKykge1xuICAgICAgICAgIHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3Nbal0oZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVnaXN0ZXJlZENsYXNzLndpZGdldCkge1xuICAgICAgICAgIC8vIEFzc2lnbiBwZXIgZWxlbWVudCBpbnN0YW5jZSBmb3IgY29udHJvbCBvdmVyIEFQSVxuICAgICAgICAgIGVsZW1lbnRbcmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZV0gPSBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdVbmFibGUgdG8gZmluZCBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IGZvciB0aGUgZ2l2ZW4gY2xhc3MuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKTtcbiAgICAgIGV2LmluaXRFdmVudCgnbWRsLWNvbXBvbmVudHVwZ3JhZGVkJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXYpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGxpc3Qgb2YgZWxlbWVudHMgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR8IUFycmF5PCFFbGVtZW50PnwhTm9kZUxpc3R8IUhUTUxDb2xsZWN0aW9ufSBlbGVtZW50c1xuICAgKiBUaGUgZWxlbWVudHMgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZUVsZW1lbnRzSW50ZXJuYWwoZWxlbWVudHMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnRzLml0ZW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgvKiogQHR5cGUge0FycmF5fSAqLyAoZWxlbWVudHMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnRzID0gW2VsZW1lbnRzXTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBlbGVtZW50cy5sZW5ndGgsIGVsZW1lbnQ7IGkgPCBuOyBpKyspIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tpXTtcbiAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdXBncmFkZUVsZW1lbnRJbnRlcm5hbChlbGVtZW50KTtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHVwZ3JhZGVFbGVtZW50c0ludGVybmFsKGVsZW1lbnQuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNsYXNzIGZvciBmdXR1cmUgdXNlIGFuZCBhdHRlbXB0cyB0byB1cGdyYWRlIGV4aXN0aW5nIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ1B1YmxpY30gY29uZmlnXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3RlckludGVybmFsKGNvbmZpZykge1xuICAgIC8vIEluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBDbG9zdXJlLWNvbXBpbGVkIGFuZCB1bmNvbXBpbGVkIGNvZGUgYWNjZXNzaW5nXG4gICAgLy8gdGhpcyBtZXRob2QsIHdlIG5lZWQgdG8gYWxsb3cgZm9yIGJvdGggdGhlIGRvdCBhbmQgYXJyYXkgc3ludGF4IGZvclxuICAgIC8vIHByb3BlcnR5IGFjY2Vzcy4gWW91J2xsIHRoZXJlZm9yZSBzZWUgdGhlIGBmb28uYmFyIHx8IGZvb1snYmFyJ11gXG4gICAgLy8gcGF0dGVybiByZXBlYXRlZCBhY3Jvc3MgdGhpcyBtZXRob2QuXG4gICAgdmFyIHdpZGdldE1pc3NpbmcgPSAodHlwZW9mIGNvbmZpZy53aWRnZXQgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBjb25maWdbJ3dpZGdldCddID09PSAndW5kZWZpbmVkJyk7XG4gICAgdmFyIHdpZGdldCA9IHRydWU7XG5cbiAgICBpZiAoIXdpZGdldE1pc3NpbmcpIHtcbiAgICAgIHdpZGdldCA9IGNvbmZpZy53aWRnZXQgfHwgY29uZmlnWyd3aWRnZXQnXTtcbiAgICB9XG5cbiAgICB2YXIgbmV3Q29uZmlnID0gLyoqIEB0eXBlIHtjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZ30gKi8gKHtcbiAgICAgIGNsYXNzQ29uc3RydWN0b3I6IGNvbmZpZy5jb25zdHJ1Y3RvciB8fCBjb25maWdbJ2NvbnN0cnVjdG9yJ10sXG4gICAgICBjbGFzc05hbWU6IGNvbmZpZy5jbGFzc0FzU3RyaW5nIHx8IGNvbmZpZ1snY2xhc3NBc1N0cmluZyddLFxuICAgICAgY3NzQ2xhc3M6IGNvbmZpZy5jc3NDbGFzcyB8fCBjb25maWdbJ2Nzc0NsYXNzJ10sXG4gICAgICB3aWRnZXQ6IHdpZGdldCxcbiAgICAgIGNhbGxiYWNrczogW11cbiAgICB9KTtcblxuICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtLmNzc0NsYXNzID09PSBuZXdDb25maWcuY3NzQ2xhc3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY3NzQ2xhc3MgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkOiAnICsgaXRlbS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5jbGFzc05hbWUgPT09IG5ld0NvbmZpZy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcHJvdmlkZWQgY2xhc3NOYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbmZpZy5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgICAgICAgLmhhc093blByb3BlcnR5KGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnTURMIGNvbXBvbmVudCBjbGFzc2VzIG11c3Qgbm90IGhhdmUgJyArIGNvbXBvbmVudENvbmZpZ1Byb3BlcnR5XyArXG4gICAgICAgICAgJyBkZWZpbmVkIGFzIGEgcHJvcGVydHkuJyk7XG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmluZFJlZ2lzdGVyZWRDbGFzc18oY29uZmlnLmNsYXNzQXNTdHJpbmcsIG5ld0NvbmZpZyk7XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50c18ucHVzaChuZXdDb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgdXNlciB0byBiZSBhbGVydGVkIHRvIGFueSB1cGdyYWRlcyB0aGF0IGFyZSBwZXJmb3JtZWQgZm9yIGEgZ2l2ZW5cbiAgICogY29tcG9uZW50IHR5cGVcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpzQ2xhc3MgVGhlIGNsYXNzIG5hbWUgb2YgdGhlIE1ETCBjb21wb25lbnQgd2Ugd2lzaFxuICAgKiB0byBob29rIGludG8gZm9yIGFueSB1cGdyYWRlcyBwZXJmb3JtZWQuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oIUhUTUxFbGVtZW50KX0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGNhbGwgdXBvbiBhblxuICAgKiB1cGdyYWRlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBleHBlY3QgMSBwYXJhbWV0ZXIgLSB0aGUgSFRNTEVsZW1lbnQgd2hpY2hcbiAgICogZ290IHVwZ3JhZGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrSW50ZXJuYWwoanNDbGFzcywgY2FsbGJhY2spIHtcbiAgICB2YXIgcmVnQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICBpZiAocmVnQ2xhc3MpIHtcbiAgICAgIHJlZ0NsYXNzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3VuZCBpbiB0aGUgY3VycmVudCBET00uIFRoaXMgaXNcbiAgICogYXV0b21hdGljYWxseSBjYWxsZWQgb24gd2luZG93IGxvYWQuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsKCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmxlbmd0aDsgbisrKSB7XG4gICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW25dLmNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuICAgKiBFeGVjdXRlIGlmIGZvdW5kLlxuICAgKiBSZW1vdmUgY29tcG9uZW50IGZyb20gY3JlYXRlZENvbXBvbmVudHMgbGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHs/Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnR9IGNvbXBvbmVudFxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbChjb21wb25lbnQpIHtcbiAgICB2YXIgY29tcG9uZW50SW5kZXggPSBjcmVhdGVkQ29tcG9uZW50c18uaW5kZXhPZihjb21wb25lbnQpO1xuICAgIGNyZWF0ZWRDb21wb25lbnRzXy5zcGxpY2UoY29tcG9uZW50SW5kZXgsIDEpO1xuXG4gICAgdmFyIHVwZ3JhZGVzID0gY29tcG9uZW50LmVsZW1lbnRfLmdldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcpLnNwbGl0KCcsJyk7XG4gICAgdmFyIGNvbXBvbmVudFBsYWNlID0gdXBncmFkZXMuaW5kZXhPZihjb21wb25lbnRbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXS5jbGFzc0FzU3RyaW5nKTtcbiAgICB1cGdyYWRlcy5zcGxpY2UoY29tcG9uZW50UGxhY2UsIDEpO1xuICAgIGNvbXBvbmVudC5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnLCB1cGdyYWRlcy5qb2luKCcsJykpO1xuXG4gICAgdmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xuICAgIGV2LmluaXRFdmVudCgnbWRsLWNvbXBvbmVudGRvd25ncmFkZWQnLCB0cnVlLCB0cnVlKTtcbiAgICBjb21wb25lbnQuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChldik7XG4gIH1cblxuICAvKipcbiAgICogRG93bmdyYWRlIGVpdGhlciBhIGdpdmVuIG5vZGUsIGFuIGFycmF5IG9mIG5vZGVzLCBvciBhIE5vZGVMaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfCFBcnJheTwhTm9kZT58IU5vZGVMaXN0fSBub2Rlc1xuICAgKi9cbiAgZnVuY3Rpb24gZG93bmdyYWRlTm9kZXNJbnRlcm5hbChub2Rlcykge1xuICAgIC8qKlxuICAgICAqIEF1eGlsaWFyeSBmdW5jdGlvbiB0byBkb3duZ3JhZGUgYSBzaW5nbGUgbm9kZS5cbiAgICAgKiBAcGFyYW0gIHshTm9kZX0gbm9kZSB0aGUgbm9kZSB0byBiZSBkb3duZ3JhZGVkXG4gICAgICovXG4gICAgdmFyIGRvd25ncmFkZU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICBjcmVhdGVkQ29tcG9uZW50c18uZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uZWxlbWVudF8gPT09IG5vZGU7XG4gICAgICB9KS5mb3JFYWNoKGRlY29uc3RydWN0Q29tcG9uZW50SW50ZXJuYWwpO1xuICAgIH07XG4gICAgaWYgKG5vZGVzIGluc3RhbmNlb2YgQXJyYXkgfHwgbm9kZXMgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBub2Rlcy5sZW5ndGg7IG4rKykge1xuICAgICAgICBkb3duZ3JhZGVOb2RlKG5vZGVzW25dKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGVzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgZG93bmdyYWRlTm9kZShub2Rlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byBkb3duZ3JhZGUgTURMIG5vZGVzLicpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyByZXR1cm4gdGhlIGZ1bmN0aW9ucyB0aGF0IHNob3VsZCBiZSBtYWRlIHB1YmxpYyB3aXRoIHRoZWlyIHB1YmxpY2x5XG4gIC8vIGZhY2luZyBuYW1lcy4uLlxuICByZXR1cm4ge1xuICAgIHVwZ3JhZGVEb206IHVwZ3JhZGVEb21JbnRlcm5hbCxcbiAgICB1cGdyYWRlRWxlbWVudDogdXBncmFkZUVsZW1lbnRJbnRlcm5hbCxcbiAgICB1cGdyYWRlRWxlbWVudHM6IHVwZ3JhZGVFbGVtZW50c0ludGVybmFsLFxuICAgIHVwZ3JhZGVBbGxSZWdpc3RlcmVkOiB1cGdyYWRlQWxsUmVnaXN0ZXJlZEludGVybmFsLFxuICAgIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFjazogcmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrSW50ZXJuYWwsXG4gICAgcmVnaXN0ZXI6IHJlZ2lzdGVySW50ZXJuYWwsXG4gICAgZG93bmdyYWRlRWxlbWVudHM6IGRvd25ncmFkZU5vZGVzSW50ZXJuYWxcbiAgfTtcbn0pKCk7XG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBjb25zdHJ1Y3RvcjogRnVuY3Rpb24sXG4gKiAgIGNsYXNzQXNTdHJpbmc6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiAoc3RyaW5nfGJvb2xlYW58dW5kZWZpbmVkKVxuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWdQdWJsaWM7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLyoqXG4gKiBEZXNjcmliZXMgdGhlIHR5cGUgb2YgYSByZWdpc3RlcmVkIGNvbXBvbmVudCB0eXBlIG1hbmFnZWQgYnlcbiAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICpcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGNvbnN0cnVjdG9yOiAhRnVuY3Rpb24sXG4gKiAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IChzdHJpbmd8Ym9vbGVhbiksXG4gKiAgIGNhbGxiYWNrczogIUFycmF5PGZ1bmN0aW9uKCFIVE1MRWxlbWVudCk+XG4gKiB9fVxuICovXG5jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZzsgIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vKipcbiAqIENyZWF0ZWQgY29tcG9uZW50IChpLmUuLCB1cGdyYWRlZCBlbGVtZW50KSB0eXBlIGFzIG1hbmFnZWQgYnlcbiAqIGNvbXBvbmVudEhhbmRsZXIuIFByb3ZpZGVkIGZvciBiZW5lZml0IG9mIHRoZSBDbG9zdXJlIGNvbXBpbGVyLlxuICpcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGVsZW1lbnRfOiAhSFRNTEVsZW1lbnQsXG4gKiAgIGNsYXNzTmFtZTogc3RyaW5nLFxuICogICBjbGFzc0FzU3RyaW5nOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogc3RyaW5nXG4gKiB9fVxuICovXG5jb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudDsgIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4vLyBFeHBvcnQgYWxsIHN5bWJvbHMsIGZvciB0aGUgYmVuZWZpdCBvZiBDbG9zdXJlIGNvbXBpbGVyLlxuLy8gTm8gZWZmZWN0IG9uIHVuY29tcGlsZWQgY29kZS5cbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVEb20nXSA9IGNvbXBvbmVudEhhbmRsZXIudXBncmFkZURvbTtcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVFbGVtZW50J10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50O1xuY29tcG9uZW50SGFuZGxlclsndXBncmFkZUVsZW1lbnRzJ10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50cztcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVBbGxSZWdpc3RlcmVkJ10gPVxuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQ7XG5jb21wb25lbnRIYW5kbGVyWydyZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2snXSA9XG4gICAgY29tcG9uZW50SGFuZGxlci5yZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s7XG5jb21wb25lbnRIYW5kbGVyWydyZWdpc3RlciddID0gY29tcG9uZW50SGFuZGxlci5yZWdpc3RlcjtcbmNvbXBvbmVudEhhbmRsZXJbJ2Rvd25ncmFkZUVsZW1lbnRzJ10gPSBjb21wb25lbnRIYW5kbGVyLmRvd25ncmFkZUVsZW1lbnRzO1xud2luZG93LmNvbXBvbmVudEhhbmRsZXIgPSBjb21wb25lbnRIYW5kbGVyO1xud2luZG93Wydjb21wb25lbnRIYW5kbGVyJ10gPSBjb21wb25lbnRIYW5kbGVyO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGEgXCJDdXR0aW5nIHRoZSBtdXN0YXJkXCIgdGVzdC4gSWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGZlYXR1cmVzXG4gICAqIHRlc3RlZCwgYWRkcyBhIG1kbC1qcyBjbGFzcyB0byB0aGUgPGh0bWw+IGVsZW1lbnQuIEl0IHRoZW4gdXBncmFkZXMgYWxsIE1ETFxuICAgKiBjb21wb25lbnRzIHJlcXVpcmluZyBKYXZhU2NyaXB0LlxuICAgKi9cbiAgaWYgKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpICYmXG4gICAgICAncXVlcnlTZWxlY3RvcicgaW4gZG9jdW1lbnQgJiZcbiAgICAgICdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cgJiYgQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWRsLWpzJyk7XG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlQWxsUmVnaXN0ZXJlZCgpO1xuICB9IGVsc2Uge1xuICAgIC8qKlxuICAgICAqIER1bW15IGZ1bmN0aW9uIHRvIGF2b2lkIEpTIGVycm9ycy5cbiAgICAgKi9cbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVFbGVtZW50ID0gZnVuY3Rpb24oKSB7fTtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge307XG4gIH1cbn0pO1xuIiwiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgZHJvcGRvd24gTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbiAgdmFyIE1hdGVyaWFsTWVudSA9IGZ1bmN0aW9uIE1hdGVyaWFsTWVudShlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG5cbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsTWVudSddID0gTWF0ZXJpYWxNZW51O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gICAgLy8gVG90YWwgZHVyYXRpb24gb2YgdGhlIG1lbnUgYW5pbWF0aW9uLlxuICAgIFRSQU5TSVRJT05fRFVSQVRJT05fU0VDT05EUzogMC4zLFxuICAgIC8vIFRoZSBmcmFjdGlvbiBvZiB0aGUgdG90YWwgZHVyYXRpb24gd2Ugd2FudCB0byB1c2UgZm9yIG1lbnUgaXRlbSBhbmltYXRpb25zLlxuICAgIFRSQU5TSVRJT05fRFVSQVRJT05fRlJBQ1RJT046IDAuOCxcbiAgICAvLyBIb3cgbG9uZyB0aGUgbWVudSBzdGF5cyBvcGVuIGFmdGVyIGNob29zaW5nIGFuIG9wdGlvbiAoc28gdGhlIHVzZXIgY2FuIHNlZVxuICAgIC8vIHRoZSByaXBwbGUpLlxuICAgIENMT1NFX1RJTUVPVVQ6IDE1MFxuICB9O1xuXG4gIC8qKlxuICAgKiBLZXljb2RlcywgZm9yIGNvZGUgcmVhZGFiaWxpdHkuXG4gICAqXG4gICAqIEBlbnVtIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLktleWNvZGVzXyA9IHtcbiAgICBFTlRFUjogMTMsXG4gICAgRVNDQVBFOiAyNyxcbiAgICBTUEFDRTogMzIsXG4gICAgVVBfQVJST1c6IDM4LFxuICAgIERPV05fQVJST1c6IDQwXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIENPTlRBSU5FUjogJ21kbC1tZW51X19jb250YWluZXInLFxuICAgIE9VVExJTkU6ICdtZGwtbWVudV9fb3V0bGluZScsXG4gICAgSVRFTTogJ21kbC1tZW51X19pdGVtJyxcbiAgICBJVEVNX1JJUFBMRV9DT05UQUlORVI6ICdtZGwtbWVudV9faXRlbS1yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgIFJJUFBMRV9JR05PUkVfRVZFTlRTOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QtLWlnbm9yZS1ldmVudHMnLFxuICAgIFJJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgIC8vIFN0YXR1c2VzXG4gICAgSVNfVVBHUkFERUQ6ICdpcy11cGdyYWRlZCcsXG4gICAgSVNfVklTSUJMRTogJ2lzLXZpc2libGUnLFxuICAgIElTX0FOSU1BVElORzogJ2lzLWFuaW1hdGluZycsXG4gICAgLy8gQWxpZ25tZW50IG9wdGlvbnNcbiAgICBCT1RUT01fTEVGVDogJ21kbC1tZW51LS1ib3R0b20tbGVmdCcsICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0LlxuICAgIEJPVFRPTV9SSUdIVDogJ21kbC1tZW51LS1ib3R0b20tcmlnaHQnLFxuICAgIFRPUF9MRUZUOiAnbWRsLW1lbnUtLXRvcC1sZWZ0JyxcbiAgICBUT1BfUklHSFQ6ICdtZGwtbWVudS0tdG9wLXJpZ2h0JyxcbiAgICBVTkFMSUdORUQ6ICdtZGwtbWVudS0tdW5hbGlnbmVkJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Xykge1xuICAgICAgLy8gQ3JlYXRlIGNvbnRhaW5lciBmb3IgdGhlIG1lbnUuXG4gICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkNPTlRBSU5FUik7XG4gICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNvbnRhaW5lciwgdGhpcy5lbGVtZW50Xyk7XG4gICAgICB0aGlzLmVsZW1lbnRfLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Xyk7XG4gICAgICB0aGlzLmNvbnRhaW5lcl8gPSBjb250YWluZXI7XG5cbiAgICAgIC8vIENyZWF0ZSBvdXRsaW5lIGZvciB0aGUgbWVudSAoc2hhZG93IGFuZCBiYWNrZ3JvdW5kKS5cbiAgICAgIHZhciBvdXRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBvdXRsaW5lLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5PVVRMSU5FKTtcbiAgICAgIHRoaXMub3V0bGluZV8gPSBvdXRsaW5lO1xuICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShvdXRsaW5lLCB0aGlzLmVsZW1lbnRfKTtcblxuICAgICAgLy8gRmluZCB0aGUgXCJmb3JcIiBlbGVtZW50IGFuZCBiaW5kIGV2ZW50cyB0byBpdC5cbiAgICAgIHZhciBmb3JFbElkID0gdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2ZvcicpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Xy5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWRsLWZvcicpO1xuICAgICAgdmFyIGZvckVsID0gbnVsbDtcbiAgICAgIGlmIChmb3JFbElkKSB7XG4gICAgICAgIGZvckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZm9yRWxJZCk7XG4gICAgICAgIGlmIChmb3JFbCkge1xuICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8gPSBmb3JFbDtcbiAgICAgICAgICBmb3JFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlRm9yQ2xpY2tfLmJpbmQodGhpcykpO1xuICAgICAgICAgIGZvckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLFxuICAgICAgICAgICAgICB0aGlzLmhhbmRsZUZvcktleWJvYXJkRXZlbnRfLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0pO1xuICAgICAgdGhpcy5ib3VuZEl0ZW1LZXlkb3duXyA9IHRoaXMuaGFuZGxlSXRlbUtleWJvYXJkRXZlbnRfLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmJvdW5kSXRlbUNsaWNrXyA9IHRoaXMuaGFuZGxlSXRlbUNsaWNrXy5iaW5kKHRoaXMpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBBZGQgYSBsaXN0ZW5lciB0byBlYWNoIG1lbnUgaXRlbS5cbiAgICAgICAgaXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kSXRlbUNsaWNrXyk7XG4gICAgICAgIC8vIEFkZCBhIHRhYiBpbmRleCB0byBlYWNoIG1lbnUgaXRlbS5cbiAgICAgICAgaXRlbXNbaV0udGFiSW5kZXggPSAnLTEnO1xuICAgICAgICAvLyBBZGQgYSBrZXlib2FyZCBsaXN0ZW5lciB0byBlYWNoIG1lbnUgaXRlbS5cbiAgICAgICAgaXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmRJdGVtS2V5ZG93bl8pO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgcmlwcGxlIGNsYXNzZXMgdG8gZWFjaCBpdGVtLCBpZiB0aGUgdXNlciBoYXMgZW5hYmxlZCByaXBwbGVzLlxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVCkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0lHTk9SRV9FVkVOVFMpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XG5cbiAgICAgICAgICB2YXIgcmlwcGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTV9SSVBQTEVfQ09OVEFJTkVSKTtcblxuICAgICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEUpO1xuICAgICAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZChyaXBwbGUpO1xuXG4gICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvcHkgYWxpZ25tZW50IGNsYXNzZXMgdG8gdGhlIGNvbnRhaW5lciwgc28gdGhlIG91dGxpbmUgY2FuIHVzZSB0aGVtLlxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX0xFRlQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9MRUZUKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlVOQUxJR05FRCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVVBHUkFERUQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBhIGNsaWNrIG9uIHRoZSBcImZvclwiIGVsZW1lbnQsIGJ5IHBvc2l0aW9uaW5nIHRoZSBtZW51IGFuZCB0aGVuXG4gICAqIHRvZ2dsaW5nIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhhbmRsZUZvckNsaWNrXyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuZm9yRWxlbWVudF8pIHtcbiAgICAgIHZhciByZWN0ID0gdGhpcy5mb3JFbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBmb3JSZWN0ID0gdGhpcy5mb3JFbGVtZW50Xy5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpKSB7XG4gICAgICAgIC8vIERvIG5vdCBwb3NpdGlvbiB0aGUgbWVudSBhdXRvbWF0aWNhbGx5LiBSZXF1aXJlcyB0aGUgZGV2ZWxvcGVyIHRvXG4gICAgICAgIC8vIG1hbnVhbGx5IHNwZWNpZnkgcG9zaXRpb24uXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uQk9UVE9NX1JJR0hUKSkge1xuICAgICAgICAvLyBQb3NpdGlvbiBiZWxvdyB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyByaWdodC5cbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnJpZ2h0ID0gKGZvclJlY3QucmlnaHQgLSByZWN0LnJpZ2h0KSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS50b3AgPVxuICAgICAgICAgICAgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRUb3AgKyB0aGlzLmZvckVsZW1lbnRfLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpKSB7XG4gICAgICAgIC8vIFBvc2l0aW9uIGFib3ZlIHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIGxlZnQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5sZWZ0ID0gdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRMZWZ0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLmJvdHRvbSA9IChmb3JSZWN0LmJvdHRvbSAtIHJlY3QudG9wKSArICdweCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICAvLyBQb3NpdGlvbiBhYm92ZSB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyByaWdodC5cbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnJpZ2h0ID0gKGZvclJlY3QucmlnaHQgLSByZWN0LnJpZ2h0KSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5ib3R0b20gPSAoZm9yUmVjdC5ib3R0b20gLSByZWN0LnRvcCkgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGVmYXVsdDogcG9zaXRpb24gYmVsb3cgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgbGVmdC5cbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLmxlZnQgPSB0aGlzLmZvckVsZW1lbnRfLm9mZnNldExlZnQgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUudG9wID1cbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0VG9wICsgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudG9nZ2xlKGV2dCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBrZXlib2FyZCBldmVudCBvbiB0aGUgXCJmb3JcIiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhhbmRsZUZvcktleWJvYXJkRXZlbnRfID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMuZm9yRWxlbWVudF8pIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0gK1xuICAgICAgICAnOm5vdChbZGlzYWJsZWRdKScpO1xuXG4gICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLlVQX0FSUk9XKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRE9XTl9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGl0ZW1zWzBdLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBrZXlib2FyZCBldmVudCBvbiBhbiBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50XyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXykge1xuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSArXG4gICAgICAgICc6bm90KFtkaXNhYmxlZF0pJyk7XG5cbiAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgdGhpcy5jb250YWluZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcykuaW5kZXhPZihldnQudGFyZ2V0KTtcblxuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLlVQX0FSUk9XKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5ET1dOX0FSUk9XKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IGN1cnJlbnRJbmRleCArIDEpIHtcbiAgICAgICAgICAgIGl0ZW1zW2N1cnJlbnRJbmRleCArIDFdLmZvY3VzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1zWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5TUEFDRSB8fFxuICAgICAgICAgICAgICBldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRU5URVIpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAvLyBTZW5kIG1vdXNlZG93biBhbmQgbW91c2V1cCB0byB0cmlnZ2VyIHJpcHBsZS5cbiAgICAgICAgICB2YXIgZSA9IG5ldyBNb3VzZUV2ZW50KCdtb3VzZWRvd24nKTtcbiAgICAgICAgICBldnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgICAgICAgZSA9IG5ldyBNb3VzZUV2ZW50KCdtb3VzZXVwJyk7XG4gICAgICAgICAgZXZ0LnRhcmdldC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgICAgIC8vIFNlbmQgY2xpY2suXG4gICAgICAgICAgZXZ0LnRhcmdldC5jbGljaygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5FU0NBUEUpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBhIGNsaWNrIGV2ZW50IG9uIGFuIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGFuZGxlSXRlbUNsaWNrXyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXYWl0IHNvbWUgdGltZSBiZWZvcmUgY2xvc2luZyBtZW51LCBzbyB0aGUgdXNlciBjYW4gc2VlIHRoZSByaXBwbGUuXG4gICAgICB0aGlzLmNsb3NpbmdfID0gdHJ1ZTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5jbG9zaW5nXyA9IGZhbHNlO1xuICAgICAgfS5iaW5kKHRoaXMpLCAvKiogQHR5cGUge251bWJlcn0gKi8gKHRoaXMuQ29uc3RhbnRfLkNMT1NFX1RJTUVPVVQpKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGluaXRpYWwgY2xpcCAoZm9yIG9wZW5pbmcgdGhlIG1lbnUpIG9yIGZpbmFsIGNsaXAgKGZvciBjbG9zaW5nXG4gICAqIGl0KSwgYW5kIGFwcGxpZXMgaXQuIFRoaXMgYWxsb3dzIHVzIHRvIGFuaW1hdGUgZnJvbSBvciB0byB0aGUgY29ycmVjdCBwb2ludCxcbiAgICogdGhhdCBpcywgdGhlIHBvaW50IGl0J3MgYWxpZ25lZCB0byBpbiB0aGUgXCJmb3JcIiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IEhlaWdodCBvZiB0aGUgY2xpcCByZWN0YW5nbGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIFdpZHRoIG9mIHRoZSBjbGlwIHJlY3RhbmdsZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5hcHBseUNsaXBfID0gZnVuY3Rpb24oaGVpZ2h0LCB3aWR0aCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlVOQUxJR05FRCkpIHtcbiAgICAgIC8vIERvIG5vdCBjbGlwLlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJyc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCkpIHtcbiAgICAgIC8vIENsaXAgdG8gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIG1lbnUuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPVxuICAgICAgICAgICdyZWN0KDAgJyArIHdpZHRoICsgJ3B4ICcgKyAnMCAnICsgd2lkdGggKyAncHgpJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpKSB7XG4gICAgICAvLyBDbGlwIHRvIHRoZSBib3R0b20gbGVmdCBjb3JuZXIgb2YgdGhlIG1lbnUuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPVxuICAgICAgICAgICdyZWN0KCcgKyBoZWlnaHQgKyAncHggMCAnICsgaGVpZ2h0ICsgJ3B4IDApJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgLy8gQ2xpcCB0byB0aGUgYm90dG9tIHJpZ2h0IGNvcm5lciBvZiB0aGUgbWVudS5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9ICdyZWN0KCcgKyBoZWlnaHQgKyAncHggJyArIHdpZHRoICsgJ3B4ICcgK1xuICAgICAgICAgIGhlaWdodCArICdweCAnICsgd2lkdGggKyAncHgpJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmYXVsdDogZG8gbm90IGNsaXAgKHNhbWUgYXMgY2xpcHBpbmcgdG8gdGhlIHRvcCBsZWZ0IGNvcm5lcikuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAnJztcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFudXAgZnVuY3Rpb24gdG8gcmVtb3ZlIGFuaW1hdGlvbiBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShNYXRlcmlhbE1lbnUucHJvdG90eXBlLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gY2xlYW4gdXAgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBlbmRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLnJlbW92ZUFuaW1hdGlvbkVuZExpc3RlbmVyXyk7XG4gICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgdGhpcy5yZW1vdmVBbmltYXRpb25FbmRMaXN0ZW5lcl8pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgbWVudS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMub3V0bGluZV8pIHtcbiAgICAgIC8vIE1lYXN1cmUgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICB2YXIgd2lkdGggPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXG4gICAgICAvLyBBcHBseSB0aGUgaW5uZXIgZWxlbWVudCdzIHNpemUgdG8gdGhlIGNvbnRhaW5lciBhbmQgb3V0bGluZS5cbiAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgdGhpcy5vdXRsaW5lXy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMub3V0bGluZV8uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuQ29uc3RhbnRfLlRSQU5TSVRJT05fRFVSQVRJT05fU0VDT05EUyAqXG4gICAgICAgICAgdGhpcy5Db25zdGFudF8uVFJBTlNJVElPTl9EVVJBVElPTl9GUkFDVElPTjtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRyYW5zaXRpb24gZGVsYXlzIGZvciBpbmRpdmlkdWFsIG1lbnUgaXRlbXMsIHNvIHRoYXQgdGhleSBmYWRlXG4gICAgICAvLyBpbiBvbmUgYXQgYSB0aW1lLlxuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtRGVsYXkgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkgfHxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICAgIGl0ZW1EZWxheSA9ICgoaGVpZ2h0IC0gaXRlbXNbaV0ub2Zmc2V0VG9wIC0gaXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KSAvXG4gICAgICAgICAgICAgIGhlaWdodCAqIHRyYW5zaXRpb25EdXJhdGlvbikgKyAncyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbURlbGF5ID0gKGl0ZW1zW2ldLm9mZnNldFRvcCAvIGhlaWdodCAqIHRyYW5zaXRpb25EdXJhdGlvbikgKyAncyc7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbXNbaV0uc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gaXRlbURlbGF5O1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSB0aGUgaW5pdGlhbCBjbGlwIHRvIHRoZSB0ZXh0IGJlZm9yZSB3ZSBzdGFydCBhbmltYXRpbmcuXG4gICAgICB0aGlzLmFwcGx5Q2xpcF8oaGVpZ2h0LCB3aWR0aCk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lLCB0dXJuIG9uIGFuaW1hdGlvbiwgYW5kIGFwcGx5IHRoZSBmaW5hbCBjbGlwLlxuICAgICAgLy8gQWxzbyBtYWtlIGl0IHZpc2libGUuIFRoaXMgdHJpZ2dlcnMgdGhlIHRyYW5zaXRpb25zLlxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJ3JlY3QoMCAnICsgd2lkdGggKyAncHggJyArIGhlaWdodCArICdweCAwKSc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBDbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8oKTtcblxuICAgICAgLy8gQWRkIGEgY2xpY2sgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50LCB0byBjbG9zZSB0aGUgbWVudS5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkb2N1bWVudCBpcyBwcm9jZXNzaW5nIHRoZSBzYW1lIGV2ZW50IHRoYXRcbiAgICAgICAgLy8gZGlzcGxheWVkIHRoZSBtZW51IGluIHRoZSBmaXJzdCBwbGFjZS4gSWYgc28sIGRvIG5vdGhpbmcuXG4gICAgICAgIC8vIEFsc28gY2hlY2sgdG8gc2VlIGlmIHRoZSBtZW51IGlzIGluIHRoZSBwcm9jZXNzIG9mIGNsb3NpbmcgaXRzZWxmLCBhbmRcbiAgICAgICAgLy8gZG8gbm90aGluZyBpbiB0aGF0IGNhc2UuXG4gICAgICAgIC8vIEFsc28gY2hlY2sgaWYgdGhlIGNsaWNrZWQgZWxlbWVudCBpcyBhIG1lbnUgaXRlbVxuICAgICAgICAvLyBpZiBzbywgZG8gbm90aGluZy5cbiAgICAgICAgaWYgKGUgIT09IGV2dCAmJiAhdGhpcy5jbG9zaW5nXyAmJiBlLnRhcmdldC5wYXJlbnROb2RlICE9PSB0aGlzLmVsZW1lbnRfKSB7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYWxsYmFjayk7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZVsnc2hvdyddID0gTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5zaG93O1xuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgbWVudS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMub3V0bGluZV8pIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0pO1xuXG4gICAgICAvLyBSZW1vdmUgYWxsIHRyYW5zaXRpb24gZGVsYXlzOyBtZW51IGl0ZW1zIGZhZGUgb3V0IGNvbmN1cnJlbnRseS5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbXNbaV0uc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24tZGVsYXknKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWVhc3VyZSB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICAgIHZhciByZWN0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBoZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICAgIHZhciB3aWR0aCA9IHJlY3Qud2lkdGg7XG5cbiAgICAgIC8vIFR1cm4gb24gYW5pbWF0aW9uLCBhbmQgYXBwbHkgdGhlIGZpbmFsIGNsaXAuIEFsc28gbWFrZSBpbnZpc2libGUuXG4gICAgICAvLyBUaGlzIHRyaWdnZXJzIHRoZSB0cmFuc2l0aW9ucy5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICB0aGlzLmFwcGx5Q2xpcF8oaGVpZ2h0LCB3aWR0aCk7XG4gICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpO1xuXG4gICAgICAvLyBDbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8oKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGVbJ2hpZGUnXSA9IE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGlkZTtcblxuICAvKipcbiAgICogRGlzcGxheXMgb3IgaGlkZXMgdGhlIG1lbnUsIGRlcGVuZGluZyBvbiBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSkpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coZXZ0KTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGVbJ3RvZ2dsZSddID0gTWF0ZXJpYWxNZW51LnByb3RvdHlwZS50b2dnbGU7XG5cbiAgLy8gVGhlIGNvbXBvbmVudCByZWdpc3RlcnMgaXRzZWxmLiBJdCBjYW4gYXNzdW1lIGNvbXBvbmVudEhhbmRsZXIgaXMgYXZhaWxhYmxlXG4gIC8vIGluIHRoZSBnbG9iYWwgc2NvcGUuXG4gIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIoe1xuICAgIGNvbnN0cnVjdG9yOiBNYXRlcmlhbE1lbnUsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsTWVudScsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtbWVudScsXG4gICAgd2lkZ2V0OiB0cnVlXG4gIH0pO1xufSkoKTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIFRhYnMgTURMIGNvbXBvbmVudC5cbiAgICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXBncmFkZWQuXG4gICAqL1xuICB2YXIgTWF0ZXJpYWxUYWJzID0gZnVuY3Rpb24gTWF0ZXJpYWxUYWJzKGVsZW1lbnQpIHtcbiAgICAvLyBTdG9yZXMgdGhlIEhUTUwgZWxlbWVudC5cbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxUYWJzJ10gPSBNYXRlcmlhbFRhYnM7XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICAvLyBOb25lIGF0IHRoZSBtb21lbnQuXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIFRBQl9DTEFTUzogJ21kbC10YWJzX190YWInLFxuICAgIFBBTkVMX0NMQVNTOiAnbWRsLXRhYnNfX3BhbmVsJyxcbiAgICBBQ1RJVkVfQ0xBU1M6ICdpcy1hY3RpdmUnLFxuICAgIFVQR1JBREVEX0NMQVNTOiAnaXMtdXBncmFkZWQnLFxuXG4gICAgTURMX0pTX1JJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgTURMX1JJUFBMRV9DT05UQUlORVI6ICdtZGwtdGFic19fcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgTURMX1JJUFBMRTogJ21kbC1yaXBwbGUnLFxuICAgIE1ETF9KU19SSVBQTEVfRUZGRUNUX0lHTk9SRV9FVkVOVFM6ICdtZGwtanMtcmlwcGxlLWVmZmVjdC0taWdub3JlLWV2ZW50cydcbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIGNsaWNrcyB0byBhIHRhYnMgY29tcG9uZW50XG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLmluaXRUYWJzXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLk1ETF9KU19SSVBQTEVfRUZGRUNUKSkge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKFxuICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLk1ETF9KU19SSVBQTEVfRUZGRUNUX0lHTk9SRV9FVkVOVFMpO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdCBlbGVtZW50IHRhYnMsIGRvY3VtZW50IHBhbmVsc1xuICAgIHRoaXMudGFic18gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5UQUJfQ0xBU1MpO1xuICAgIHRoaXMucGFuZWxzXyA9XG4gICAgICAgIHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLlBBTkVMX0NMQVNTKTtcblxuICAgIC8vIENyZWF0ZSBuZXcgdGFicyBmb3IgZWFjaCB0YWIgZWxlbWVudFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50YWJzXy5sZW5ndGg7IGkrKykge1xuICAgICAgbmV3IE1hdGVyaWFsVGFiKHRoaXMudGFic19baV0sIHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlVQR1JBREVEX0NMQVNTKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVzZXQgdGFiIHN0YXRlLCBkcm9wcGluZyBhY3RpdmUgY2xhc3Nlc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxUYWJzLnByb3RvdHlwZS5yZXNldFRhYlN0YXRlXyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy50YWJzXy5sZW5ndGg7IGsrKykge1xuICAgICAgdGhpcy50YWJzX1trXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQUNUSVZFX0NMQVNTKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc2V0IHBhbmVsIHN0YXRlLCBkcm9waW5nIGFjdGl2ZSBjbGFzc2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRhYnMucHJvdG90eXBlLnJlc2V0UGFuZWxTdGF0ZV8gPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMucGFuZWxzXy5sZW5ndGg7IGorKykge1xuICAgICAgdGhpcy5wYW5lbHNfW2pdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxUYWJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHRoaXMuaW5pdFRhYnNfKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYW4gaW5kaXZpZHVhbCB0YWIuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhYiBUaGUgSFRNTCBlbGVtZW50IGZvciB0aGUgdGFiLlxuICAgKiBAcGFyYW0ge01hdGVyaWFsVGFic30gY3R4IFRoZSBNYXRlcmlhbFRhYnMgb2JqZWN0IHRoYXQgb3ducyB0aGUgdGFiLlxuICAgKi9cbiAgZnVuY3Rpb24gTWF0ZXJpYWxUYWIodGFiLCBjdHgpIHtcbiAgICBpZiAodGFiKSB7XG4gICAgICBpZiAoY3R4LmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhjdHguQ3NzQ2xhc3Nlc18uTURMX0pTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHZhciByaXBwbGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5NRExfUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5NRExfSlNfUklQUExFX0VGRkVDVCk7XG4gICAgICAgIHZhciByaXBwbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5NRExfUklQUExFKTtcbiAgICAgICAgcmlwcGxlQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpcHBsZSk7XG4gICAgICAgIHRhYi5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGhyZWYgPSB0YWIuaHJlZi5zcGxpdCgnIycpWzFdO1xuICAgICAgICB2YXIgcGFuZWwgPSBjdHguZWxlbWVudF8ucXVlcnlTZWxlY3RvcignIycgKyBocmVmKTtcbiAgICAgICAgY3R4LnJlc2V0VGFiU3RhdGVfKCk7XG4gICAgICAgIGN0eC5yZXNldFBhbmVsU3RhdGVfKCk7XG4gICAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKGN0eC5Dc3NDbGFzc2VzXy5BQ1RJVkVfQ0xBU1MpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsVGFicyxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxUYWJzJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy10YWJzJ1xuICB9KTtcbn0pKCk7XG4iLCIvKlxuICogc3RlZXIgLSB2Mi4wLjJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qZXJlbWVuaWNoZWxsaS9zdGVlclxuICogMjAxNCAoYykgSmVyZW1pYXMgTWVuaWNoZWxsaSAtIE1JVCBMaWNlbnNlXG4qL1xuXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LnN0ZWVyID0gZmFjdG9yeSgpO1xuICAgIH1cbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgIHZhciB5ID0gMCxcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgICAgZXZlbnRzOiB0cnVlLFxuICAgICAgICAgICAgdXA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRvd246IHVuZGVmaW5lZFxuICAgICAgICB9LFxuICAgICAgICBkaXJlY3Rpb24gPSAnbnVsbCcsXG4gICAgICAgIG9sZERpcmVjdGlvbiA9ICdudWxsJyxcbiAgICAgICAgcm9vdCA9IHdpbmRvdztcblxuICAgIC8qXG4gICAgICogQmluZHMgZXZlbnQgb24gc2Nyb2xsXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gZnVuY3Rpb24gdG8gY2FsbCBvbiBzY3JvbGxcbiAgICAgKi9cbiAgICB2YXIgX2JpbmRTY3JvbGxFdmVudCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGlmIChyb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZm4sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChyb290LmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICByb290LmF0dGFjaEV2ZW50KCdvbnNjcm9sbCcsIGZuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3Qub25zY3JvbGwgPSBmbjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFJlcGxhY2VzIGNvbmZpZ3VyYXRpb24gdmFsdWVzIHdpdGggY3VzdG9tIG9uZXNcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIG9iamVjdCBjb250YWluaW5nIGN1c3RvbSBvcHRpb25zXG4gICAgICovXG4gICAgdmFyIF9zZXRDb25maWdPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgLy8gb3ZlcnJpZGUgd2l0aCBjdXN0b20gYXR0cmlidXRlc1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9ialtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENhbGxzIGEgZnVuY3Rpb24gaW5zaWRlIGEgdHJ5IGNhdGNoIHN0cnVjdHVyZVxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhcmdzIC0gYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgZnVuY3Rpb25cbiAgICAgKi9cbiAgICB2YXIgX3NhZmVGbiA9IGZ1bmN0aW9uKGZuLCBhcmdzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIE1haW4gZnVuY3Rpb24gd2hpY2ggc2V0cyBhbGwgdmFyaWFibGVzIGFuZCBiaW5kIGV2ZW50cyBpZiBuZWVkZWRcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ09iaiAtIG9iamVjdCBjb250YWluaW5nIGN1c3RvbSBvcHRpb25zXG4gICAgICovXG4gICAgdmFyIF9zZXQgPSBmdW5jdGlvbihjb25maWdPYmopIHtcbiAgICAgICAgX3NldENvbmZpZ09iamVjdChjb25maWdPYmopO1xuXG4gICAgICAgIGlmIChjb25maWcuZXZlbnRzKSB7XG4gICAgICAgICAgICBfYmluZFNjcm9sbEV2ZW50KF9jb21wYXJlRGlyZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENyb3NzIGJyb3dzZXIgd2F5IHRvIGdldCBob3cgbXVjaCBpcyBzY3JvbGxlZFxuICAgICAqIEBtZXRob2RcbiAgICAgKi9cbiAgICB2YXIgX2dldFlQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcm9vdC5zY3JvbGxZIHx8IHJvb3QucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGRpcmVjdGlvbiBhbmQgdXBkYXRlcyBwb3NpdGlvbiB2YXJpYWJsZVxuICAgICAqIEBtZXRob2RcbiAgICAgKi9cbiAgICB2YXIgX2dldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0dWFsUG9zaXRpb24gPSBfZ2V0WVBvc2l0aW9uKCksXG4gICAgICAgICAgICBkaXJlY3Rpb247XG5cbiAgICAgICAgZGlyZWN0aW9uID0gKGFjdHVhbFBvc2l0aW9uIDwgeSkgPyAndXAnIDogJ2Rvd24nO1xuXG4gICAgICAgIC8vIHVwZGF0ZXMgZ2VuZXJhbCBwb3NpdGlvbiB2YXJpYWJsZVxuICAgICAgICB5ID0gYWN0dWFsUG9zaXRpb247XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBDb21wYXJlcyBvbGQgYW5kIG5ldyBkaXJlY3Rpb25zIGFuZCBjYWxsIHNwZWNpZmljIGZ1bmN0aW9uXG4gICAgICogQG1ldGhvZFxuICAgICAqL1xuICAgIHZhciBfY29tcGFyZURpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkaXJlY3Rpb24gPSBfZ2V0RGlyZWN0aW9uKCk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gb2xkRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBvbGREaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgICAgICBfc2FmZUZuKGNvbmZpZ1tkaXJlY3Rpb25dLCBbIHkgXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0OiBfc2V0LFxuICAgICAgICB0cmlnZ2VyOiBfY29tcGFyZURpcmVjdGlvblxuICAgIH07XG59KTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBDbGFzcyBjb25zdHJ1Y3Rvci5cblx0ICogSW1wbGVtZW50cyBNREwgY29tcG9uZW50IGRlc2lnbiBwYXR0ZXJuIGRlZmluZWQgYXQ6XG5cdCAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuXHQgKi9cblx0dmFyIERyb3Bkb3duID0gZnVuY3Rpb24gRHJvcGRvd24oZWxlbWVudCkge1xuXHRcdHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9O1xuXHR3aW5kb3dbJ0Ryb3Bkb3duJ10gPSBEcm9wZG93bjtcblxuXHQvKipcblx0ICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudC5cblx0ICpcblx0ICogQGVudW0ge3N0cmluZ31cblx0ICogQHByaXZhdGVcblx0ICovXG5cdERyb3Bkb3duLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcblx0XHREUk9QRE9XTl9JU19BQ1RJVkU6ICdpcy1hY3RpdmUnLFxuXHRcdERST1BET1dOX0lTX0JFRk9SRTogJ2pzLWRyb3AtYmVmb3JlJyxcblx0XHREUk9QRE9XTl9QQVJFTlQ6ICdqcy13aXRoLXBhcmVudCcsXG5cdFx0UEFSRU5UX0lTX0FDVElWRTogJ2lzLWFjdGl2ZScsXG5cdH07XG5cblxuXHREcm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuYm91bmRDbGlja0hhbmRsZXIgPSB0aGlzLmNsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kQ2xpY2tIYW5kbGVyKTtcblx0fTtcblxuXHREcm9wZG93bi5wcm90b3R5cGUuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQkVGT1JFKSkge1xuXHRcdFx0dmFyIHRhcmdldFNpYmxpbmcgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHRhcmdldFNpYmxpbmcgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdH1cblx0XHR2YXIgdGFyZ2V0UGFyZW50ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG5cdFx0aWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRFJPUERPV05fSVNfQUNUSVZFKSkge1xuXHRcdFx0VHdlZW5MaXRlLnNldCh0YXJnZXRTaWJsaW5nLCB7XG5cdFx0XHRcdGhlaWdodDogXCJhdXRvXCIsXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdH0pO1xuXHRcdFx0VHdlZW5MaXRlLmZyb20odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHRcdGhlaWdodDogMCxcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0fSk7XG5cdFx0XHRUd2VlbkxpdGUudG8odGFyZ2V0U2libGluZywgMC4yLCB7XG5cdFx0XHRcdHBhZGRpbmdUb3A6IDEwLFxuXHRcdFx0XHRwYWRkaW5nQm90dG9tOiAxMFxuXHRcdFx0fSk7XG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0FDVElWRSk7XG5cdFx0XHR0YXJnZXRTaWJsaW5nLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9QQVJFTlQpKSB7XG5cdFx0XHRcdHRhcmdldFBhcmVudC5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUEFSRU5UX0lTX0FDVElWRSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdFR3ZWVuTGl0ZS50byh0YXJnZXRTaWJsaW5nLCAwLjIsIHtcblx0XHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR9KTtcblx0XHRcdFR3ZWVuTGl0ZS50byh0YXJnZXRTaWJsaW5nLCAwLjIsIHtcblx0XHRcdFx0cGFkZGluZ1RvcDogMCxcblx0XHRcdFx0cGFkZGluZ0JvdHRvbTogMFxuXHRcdFx0fSk7XG5cdFx0XHR0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLkRST1BET1dOX0lTX0FDVElWRSk7XG5cdFx0XHR0YXJnZXRTaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9JU19BQ1RJVkUpO1xuXHRcdFx0aWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUk9QRE9XTl9QQVJFTlQpKSB7XG5cdFx0XHRcdHRhcmdldFBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uUEFSRU5UX0lTX0FDVElWRSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEb3duZ3JhZGUgdGhlIGNvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdERyb3Bkb3duLnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRDbGlja0hhbmRsZXIpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQdWJsaWMgYWxpYXMgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlID1cblx0XHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlXztcblxuXHREcm9wZG93bi5wcm90b3R5cGVbJ21kbERvd25ncmFkZSddID1cblx0XHREcm9wZG93bi5wcm90b3R5cGUubWRsRG93bmdyYWRlO1xuXG5cdC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuXHQvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuXHRjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcblx0XHRjb25zdHJ1Y3RvcjogRHJvcGRvd24sXG5cdFx0Y2xhc3NBc1N0cmluZzogJ0Ryb3Bkb3duJyxcblx0XHRjc3NDbGFzczogJ2pzLWRyb3Bkb3duJ1xuXHR9KTtcbn0pKCk7XG4iLCIvLyBPcGVuIHRoZSBmaXJzdCBUYWIgYnkgZGVmYXVsdC5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG5cdGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdsb2FkaW5nJykge1xuXHRcdGZuKCk7XG5cdH0gZWxzZSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcblx0fVxufVxuXG5cbnJlYWR5KGZ1bmN0aW9uKCkge1xuXHR2YXIgZmlyc3RUYWIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGwtdGFic19fdGFiJylbMF07XG5cdHZhciBmaXJzdFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWRsLXRhYnNfX3BhbmVsJylbMF07XG5cdGZpcnN0VGFiLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuXHRmaXJzdFBhbmVsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xufSk7XG5cblxuXHR3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gZ2V0dGluZyB0aGUgZWxlbWVudCB3aGVyZSB0aGUgbWVzc2FnZSBnb2VzXG5cdFx0dmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcblx0XHQvLyBjYWxsaW5nIHN0ZWVyXG5cdFx0c3RlZXIuc2V0KHtcblx0XHRcdGV2ZW50czogZmFsc2UsXG5cdFx0XHR1cDogZnVuY3Rpb24ocG9zaXRpb24pe1xuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnZmFkZUluRG93bicpO1xuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dFVwJyk7XG5cdFx0XHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCd1LWZpeCcpO1xuXHRcdFx0fSxcblx0XHRcdGRvd246IGZ1bmN0aW9uKHBvc2l0aW9uKXtcblx0XHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXRVcCcpO1xuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluRG93bicpO1xuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgndS1maXgnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB5ID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cdFx0XHRpZiAoeSA+IDEzMSkge1xuXHRcdFx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdG9wJyk7XG5cdFx0XHRcdHN0ZWVyLnRyaWdnZXIoKTtcblx0XHRcdH1cblx0XHRcdGlmICh5ID09IDApIHtcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgndS1maXgnKTtcblx0XHRcdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2lzLXRvcCcpO1xuICAgICAgICAgICAgfVxuXHRcdH07XG5cdH1cblxuLy9cbi8vIDsoZnVuY3Rpb24oKSB7XG4vLyAgICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgb2JqKSB7XG4vLyAgICAgICAgIHZhciBvYmogPSBvYmogfHwgd2luZG93O1xuLy8gICAgICAgICB2YXIgcnVubmluZyA9IGZhbHNlO1xuLy8gICAgICAgICB2YXIgZnVuYyA9IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHsgcmV0dXJuOyB9XG4vLyAgICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbi8vICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSkpO1xuLy8gICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9O1xuLy8gICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jKTtcbi8vICAgICB9O1xuLy8gICAgIHRocm90dGxlIChcInNjcm9sbFwiLCBcIm9wdGltaXplZFNjcm9sbFwiKTtcbi8vIH0pKCk7XG4vL1xuLy8gLy8gdG8gdXNlIHRoZSBzY3JpcHQgKndpdGhvdXQqIGFudGktamFuaywgc2V0IHRoZSBldmVudCB0byBcInNjcm9sbFwiIGFuZCByZW1vdmUgdGhlIGFub255bW91cyBmdW5jdGlvbi5cbi8vXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9wdGltaXplZFNjcm9sbFwiLCBmdW5jdGlvbigpIHtcbi8vICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gMCkge1xuLy8gICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFydGljbGUtaGVyb1wiKS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVkoXCIgKyB3aW5kb3cucGFnZVlPZmZzZXQqKC0uOSkgKyBcInB4KVwiO1xuLy8gICAgIH1cbi8vIH0pO1xuIiwiXG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBxdWVyeVNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvci5iaW5kKGRvY3VtZW50KTtcblxuICB2YXIgc2lkZU5hdiA9IHF1ZXJ5U2VsZWN0b3IoJyNtZW51LXByaW1hcnknKTtcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICB2YXIgc2l0ZUhlYWRlciA9IHF1ZXJ5U2VsZWN0b3IoJyNoZWFkZXInKTtcbiAgdmFyIG1lbnVCdG4gPSBxdWVyeVNlbGVjdG9yKCcjc2lkZS1tZW51LXRvZ2dsZScpO1xuICB2YXIgY29udGVudE1hc2sgPSBxdWVyeVNlbGVjdG9yKCcjY29udGVudC1tYXNrJyk7XG5cbiAgZnVuY3Rpb24gY2xvc2VNZW51KCkge1xuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndS1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICBzaXRlSGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NpZGViYXItb3BlbicpO1xuICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG5cdGNvbnRlbnRNYXNrLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlTWVudSgpIHtcbiAgICBib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3Utb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgc2l0ZUhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdzaWRlYmFyLW9wZW4nKTtcbiAgICBzaWRlTmF2LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuICAgIGNvbnRlbnRNYXNrLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuICAgIHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnaGFzLW9wZW5lZCcpO1xuICB9XG5cbiAgY29udGVudE1hc2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1lbnUpO1xuICBtZW51QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG4gIHNpZGVOYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnQScgfHwgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnTEknKSB7XG4gICAgICBjbG9zZU1lbnUoKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
