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

  var downgradeMethod_ = 'mdlDowngrade';
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
   * Finds a created component by a given DOM node.
   *
   * @param {!Node} node
   * @return {*}
   */
  function findCreatedComponentByNodeInternal(node) {
    for (var n = 0; n < createdComponents_.length; n++) {
      var component = createdComponents_[n];
      if (component.element_ === node) {
        return component;
      }
    }
  }

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {*} component
   */
  function deconstructComponentInternal(component) {
    if (component &&
        component[componentConfigProperty_]
          .classConstructor.prototype
          .hasOwnProperty(downgradeMethod_)) {
      component[downgradeMethod_]();
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace = upgrades.indexOf(
          component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      var ev = document.createEvent('Events');
      ev.initEvent('mdl-componentdowngraded', true, true);
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
      deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtZGxDb21wb25lbnRIYW5kbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIEEgY29tcG9uZW50IGhhbmRsZXIgaW50ZXJmYWNlIHVzaW5nIHRoZSByZXZlYWxpbmcgbW9kdWxlIGRlc2lnbiBwYXR0ZXJuLlxuICogTW9yZSBkZXRhaWxzIG9uIHRoaXMgZGVzaWduIHBhdHRlcm4gaGVyZTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNvbm1heWVzL21kbC1jb21wb25lbnQtZGVzaWduLXBhdHRlcm5cbiAqXG4gKiBAYXV0aG9yIEphc29uIE1heWVzLlxuICovXG4vKiBleHBvcnRlZCBjb21wb25lbnRIYW5kbGVyICovXG5cbi8vIFByZS1kZWZpbmluZyB0aGUgY29tcG9uZW50SGFuZGxlciBpbnRlcmZhY2UsIGZvciBjbG9zdXJlIGRvY3VtZW50YXRpb24gYW5kXG4vLyBzdGF0aWMgdmVyaWZpY2F0aW9uLlxudmFyIGNvbXBvbmVudEhhbmRsZXIgPSB7XG4gIC8qKlxuICAgKiBTZWFyY2hlcyBleGlzdGluZyBET00gZm9yIGVsZW1lbnRzIG9mIG91ciBjb21wb25lbnQgdHlwZSBhbmQgdXBncmFkZXMgdGhlbVxuICAgKiBpZiB0aGV5IGhhdmUgbm90IGFscmVhZHkgYmVlbiB1cGdyYWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIHRoZSBwcm9ncmFtYXRpYyBuYW1lIG9mIHRoZSBlbGVtZW50IGNsYXNzIHdlXG4gICAqIG5lZWQgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdENzc0NsYXNzIHRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZWxlbWVudHMgb2YgdGhpc1xuICAgKiB0eXBlIHdpbGwgaGF2ZS5cbiAgICovXG4gIHVwZ3JhZGVEb206IGZ1bmN0aW9uKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7fSxcbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgZWxlbWVudCByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0SnNDbGFzcyBPcHRpb25hbCBuYW1lIG9mIHRoZSBjbGFzcyB3ZSB3YW50IHRvIHVwZ3JhZGVcbiAgICogdGhlIGVsZW1lbnQgdG8uXG4gICAqL1xuICB1cGdyYWRlRWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgb3B0SnNDbGFzcykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhIHNwZWNpZmljIGxpc3Qgb2YgZWxlbWVudHMgcmF0aGVyIHRoYW4gYWxsIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR8IUFycmF5PCFFbGVtZW50PnwhTm9kZUxpc3R8IUhUTUxDb2xsZWN0aW9ufSBlbGVtZW50c1xuICAgKiBUaGUgZWxlbWVudHMgd2Ugd2lzaCB0byB1cGdyYWRlLlxuICAgKi9cbiAgdXBncmFkZUVsZW1lbnRzOiBmdW5jdGlvbihlbGVtZW50cykge30sXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGZvdW5kIGluIHRoZSBjdXJyZW50IERPTS4gVGhpcyBpc1xuICAgKiBhdXRvbWF0aWNhbGx5IGNhbGxlZCBvbiB3aW5kb3cgbG9hZC5cbiAgICovXG4gIHVwZ3JhZGVBbGxSZWdpc3RlcmVkOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgICogQWxsb3dzIHVzZXIgdG8gYmUgYWxlcnRlZCB0byBhbnkgdXBncmFkZXMgdGhhdCBhcmUgcGVyZm9ybWVkIGZvciBhIGdpdmVuXG4gICAqIGNvbXBvbmVudCB0eXBlXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyBuYW1lIG9mIHRoZSBNREwgY29tcG9uZW50IHdlIHdpc2hcbiAgICogdG8gaG9vayBpbnRvIGZvciBhbnkgdXBncmFkZXMgcGVyZm9ybWVkLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCFIVE1MRWxlbWVudCl9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBjYWxsIHVwb24gYW5cbiAgICogdXBncmFkZS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgZXhwZWN0IDEgcGFyYW1ldGVyIC0gdGhlIEhUTUxFbGVtZW50IHdoaWNoXG4gICAqIGdvdCB1cGdyYWRlZC5cbiAgICovXG4gIHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFjazogZnVuY3Rpb24oanNDbGFzcywgY2FsbGJhY2spIHt9LFxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2xhc3MgZm9yIGZ1dHVyZSB1c2UgYW5kIGF0dGVtcHRzIHRvIHVwZ3JhZGUgZXhpc3RpbmcgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljfSBjb25maWcgdGhlIHJlZ2lzdHJhdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWdpc3RlcjogZnVuY3Rpb24oY29uZmlnKSB7fSxcbiAgLyoqXG4gICAqIERvd25ncmFkZSBlaXRoZXIgYSBnaXZlbiBub2RlLCBhbiBhcnJheSBvZiBub2Rlcywgb3IgYSBOb2RlTGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHshTm9kZXwhQXJyYXk8IU5vZGU+fCFOb2RlTGlzdH0gbm9kZXNcbiAgICovXG4gIGRvd25ncmFkZUVsZW1lbnRzOiBmdW5jdGlvbihub2Rlcykge31cbn07XG5cbmNvbXBvbmVudEhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogQHR5cGUgeyFBcnJheTxjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudENvbmZpZz59ICovXG4gIHZhciByZWdpc3RlcmVkQ29tcG9uZW50c18gPSBbXTtcblxuICAvKiogQHR5cGUgeyFBcnJheTxjb21wb25lbnRIYW5kbGVyLkNvbXBvbmVudD59ICovXG4gIHZhciBjcmVhdGVkQ29tcG9uZW50c18gPSBbXTtcblxuICB2YXIgZG93bmdyYWRlTWV0aG9kXyA9ICdtZGxEb3duZ3JhZGUnO1xuICB2YXIgY29tcG9uZW50Q29uZmlnUHJvcGVydHlfID0gJ21kbENvbXBvbmVudENvbmZpZ0ludGVybmFsXyc7XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBmb3IgYSBjbGFzcyB3ZSBhcmUgaW50ZXJlc3RlZCBpbiB1c2luZy5cbiAgICogT3B0aW9uYWxseSByZXBsYWNlcyBhIG1hdGNoIHdpdGggcGFzc2VkIG9iamVjdCBpZiBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIGEgY2xhc3Mgd2Ugd2FudCB0byB1c2UuXG4gICAqIEBwYXJhbSB7Y29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc9fSBvcHRSZXBsYWNlIE9wdGlvbmFsIG9iamVjdCB0byByZXBsYWNlIG1hdGNoIHdpdGguXG4gICAqIEByZXR1cm4geyFPYmplY3R8Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGZpbmRSZWdpc3RlcmVkQ2xhc3NfKG5hbWUsIG9wdFJlcGxhY2UpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jbGFzc05hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRSZXBsYWNlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXSA9IG9wdFJlcGxhY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGNsYXNzTmFtZXMgb2YgdGhlIHVwZ3JhZGVkIGNsYXNzZXMgb24gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7IUVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZmV0Y2ggZGF0YSBmcm9tLlxuICAgKiBAcmV0dXJuIHshQXJyYXk8c3RyaW5nPn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIGdldFVwZ3JhZGVkTGlzdE9mRWxlbWVudF8oZWxlbWVudCkge1xuICAgIHZhciBkYXRhVXBncmFkZWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcpO1xuICAgIC8vIFVzZSBgWycnXWAgYXMgZGVmYXVsdCB2YWx1ZSB0byBjb25mb3JtIHRoZSBgLG5hbWUsbmFtZS4uLmAgc3R5bGUuXG4gICAgcmV0dXJuIGRhdGFVcGdyYWRlZCA9PT0gbnVsbCA/IFsnJ10gOiBkYXRhVXBncmFkZWQuc3BsaXQoJywnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiB1cGdyYWRlZCBmb3IgdGhlIGdpdmVuXG4gICAqIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdhbnQgdG8gY2hlY2suXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBqc0NsYXNzIFRoZSBjbGFzcyB0byBjaGVjayBmb3IuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIGpzQ2xhc3MpIHtcbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICByZXR1cm4gdXBncmFkZWRMaXN0LmluZGV4T2YoanNDbGFzcykgIT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaGVzIGV4aXN0aW5nIERPTSBmb3IgZWxlbWVudHMgb2Ygb3VyIGNvbXBvbmVudCB0eXBlIGFuZCB1cGdyYWRlcyB0aGVtXG4gICAqIGlmIHRoZXkgaGF2ZSBub3QgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdEpzQ2xhc3MgdGhlIHByb2dyYW1hdGljIG5hbWUgb2YgdGhlIGVsZW1lbnQgY2xhc3Mgd2VcbiAgICogbmVlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0Q3NzQ2xhc3MgdGhlIG5hbWUgb2YgdGhlIENTUyBjbGFzcyBlbGVtZW50cyBvZiB0aGlzXG4gICAqIHR5cGUgd2lsbCBoYXZlLlxuICAgKi9cbiAgZnVuY3Rpb24gdXBncmFkZURvbUludGVybmFsKG9wdEpzQ2xhc3MsIG9wdENzc0NsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRKc0NsYXNzID09PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICB0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZ2lzdGVyZWRDb21wb25lbnRzXy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cGdyYWRlRG9tSW50ZXJuYWwocmVnaXN0ZXJlZENvbXBvbmVudHNfW2ldLmNsYXNzTmFtZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzX1tpXS5jc3NDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBqc0NsYXNzID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChvcHRKc0NsYXNzKTtcbiAgICAgIGlmICh0eXBlb2Ygb3B0Q3NzQ2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciByZWdpc3RlcmVkQ2xhc3MgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhqc0NsYXNzKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWRDbGFzcykge1xuICAgICAgICAgIG9wdENzc0NsYXNzID0gcmVnaXN0ZXJlZENsYXNzLmNzc0NsYXNzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgb3B0Q3NzQ2xhc3MpO1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBlbGVtZW50cy5sZW5ndGg7IG4rKykge1xuICAgICAgICB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnRzW25dLCBqc0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZXMgYSBzcGVjaWZpYyBlbGVtZW50IHJhdGhlciB0aGFuIGFsbCBpbiB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0geyFFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHdlIHdpc2ggdG8gdXBncmFkZS5cbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRKc0NsYXNzIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGNsYXNzIHdlIHdhbnQgdG8gdXBncmFkZVxuICAgKiB0aGUgZWxlbWVudCB0by5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwoZWxlbWVudCwgb3B0SnNDbGFzcykge1xuICAgIC8vIFZlcmlmeSBhcmd1bWVudCB0eXBlLlxuICAgIGlmICghKHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byB1cGdyYWRlIE1ETCBlbGVtZW50LicpO1xuICAgIH1cbiAgICB2YXIgdXBncmFkZWRMaXN0ID0gZ2V0VXBncmFkZWRMaXN0T2ZFbGVtZW50XyhlbGVtZW50KTtcbiAgICB2YXIgY2xhc3Nlc1RvVXBncmFkZSA9IFtdO1xuICAgIC8vIElmIGpzQ2xhc3MgaXMgbm90IHByb3ZpZGVkIHNjYW4gdGhlIHJlZ2lzdGVyZWQgY29tcG9uZW50cyB0byBmaW5kIHRoZVxuICAgIC8vIG9uZXMgbWF0Y2hpbmcgdGhlIGVsZW1lbnQncyBDU1MgY2xhc3NMaXN0LlxuICAgIGlmICghb3B0SnNDbGFzcykge1xuICAgICAgdmFyIGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIE1hdGNoIENTUyAmIE5vdCB0byBiZSB1cGdyYWRlZCAmIE5vdCB1cGdyYWRlZC5cbiAgICAgICAgaWYgKGNsYXNzTGlzdC5jb250YWlucyhjb21wb25lbnQuY3NzQ2xhc3MpICYmXG4gICAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLmluZGV4T2YoY29tcG9uZW50KSA9PT0gLTEgJiZcbiAgICAgICAgICAgICFpc0VsZW1lbnRVcGdyYWRlZF8oZWxlbWVudCwgY29tcG9uZW50LmNsYXNzTmFtZSkpIHtcbiAgICAgICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghaXNFbGVtZW50VXBncmFkZWRfKGVsZW1lbnQsIG9wdEpzQ2xhc3MpKSB7XG4gICAgICBjbGFzc2VzVG9VcGdyYWRlLnB1c2goZmluZFJlZ2lzdGVyZWRDbGFzc18ob3B0SnNDbGFzcykpO1xuICAgIH1cblxuICAgIC8vIFVwZ3JhZGUgdGhlIGVsZW1lbnQgZm9yIGVhY2ggY2xhc3Nlcy5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNsYXNzZXNUb1VwZ3JhZGUubGVuZ3RoLCByZWdpc3RlcmVkQ2xhc3M7IGkgPCBuOyBpKyspIHtcbiAgICAgIHJlZ2lzdGVyZWRDbGFzcyA9IGNsYXNzZXNUb1VwZ3JhZGVbaV07XG4gICAgICBpZiAocmVnaXN0ZXJlZENsYXNzKSB7XG4gICAgICAgIC8vIE1hcmsgZWxlbWVudCBhcyB1cGdyYWRlZC5cbiAgICAgICAgdXBncmFkZWRMaXN0LnB1c2gocmVnaXN0ZXJlZENsYXNzLmNsYXNzTmFtZSk7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXVwZ3JhZGVkJywgdXBncmFkZWRMaXN0LmpvaW4oJywnKSk7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyByZWdpc3RlcmVkQ2xhc3MuY2xhc3NDb25zdHJ1Y3RvcihlbGVtZW50KTtcbiAgICAgICAgaW5zdGFuY2VbY29tcG9uZW50Q29uZmlnUHJvcGVydHlfXSA9IHJlZ2lzdGVyZWRDbGFzcztcbiAgICAgICAgY3JlYXRlZENvbXBvbmVudHNfLnB1c2goaW5zdGFuY2UpO1xuICAgICAgICAvLyBDYWxsIGFueSBjYWxsYmFja3MgdGhlIHVzZXIgaGFzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGNvbXBvbmVudCB0eXBlLlxuICAgICAgICBmb3IgKHZhciBqID0gMCwgbSA9IHJlZ2lzdGVyZWRDbGFzcy5jYWxsYmFja3MubGVuZ3RoOyBqIDwgbTsgaisrKSB7XG4gICAgICAgICAgcmVnaXN0ZXJlZENsYXNzLmNhbGxiYWNrc1tqXShlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWdpc3RlcmVkQ2xhc3Mud2lkZ2V0KSB7XG4gICAgICAgICAgLy8gQXNzaWduIHBlciBlbGVtZW50IGluc3RhbmNlIGZvciBjb250cm9sIG92ZXIgQVBJXG4gICAgICAgICAgZWxlbWVudFtyZWdpc3RlcmVkQ2xhc3MuY2xhc3NOYW1lXSA9IGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1VuYWJsZSB0byBmaW5kIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgZm9yIHRoZSBnaXZlbiBjbGFzcy4nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50cycpO1xuICAgICAgZXYuaW5pdEV2ZW50KCdtZGwtY29tcG9uZW50dXBncmFkZWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZ3JhZGVzIGEgc3BlY2lmaWMgbGlzdCBvZiBlbGVtZW50cyByYXRoZXIgdGhhbiBhbGwgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHshRWxlbWVudHwhQXJyYXk8IUVsZW1lbnQ+fCFOb2RlTGlzdHwhSFRNTENvbGxlY3Rpb259IGVsZW1lbnRzXG4gICAqIFRoZSBlbGVtZW50cyB3ZSB3aXNoIHRvIHVwZ3JhZGUuXG4gICAqL1xuICBmdW5jdGlvbiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbChlbGVtZW50cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudHMuaXRlbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKC8qKiBAdHlwZSB7QXJyYXl9ICovIChlbGVtZW50cykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGVsZW1lbnRzLmxlbmd0aCwgZWxlbWVudDsgaSA8IG47IGkrKykge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2ldO1xuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICB1cGdyYWRlRWxlbWVudEludGVybmFsKGVsZW1lbnQpO1xuICAgICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdXBncmFkZUVsZW1lbnRzSW50ZXJuYWwoZWxlbWVudC5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2xhc3MgZm9yIGZ1dHVyZSB1c2UgYW5kIGF0dGVtcHRzIHRvIHVwZ3JhZGUgZXhpc3RpbmcgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljfSBjb25maWdcbiAgICovXG4gIGZ1bmN0aW9uIHJlZ2lzdGVySW50ZXJuYWwoY29uZmlnKSB7XG4gICAgLy8gSW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIENsb3N1cmUtY29tcGlsZWQgYW5kIHVuY29tcGlsZWQgY29kZSBhY2Nlc3NpbmdcbiAgICAvLyB0aGlzIG1ldGhvZCwgd2UgbmVlZCB0byBhbGxvdyBmb3IgYm90aCB0aGUgZG90IGFuZCBhcnJheSBzeW50YXggZm9yXG4gICAgLy8gcHJvcGVydHkgYWNjZXNzLiBZb3UnbGwgdGhlcmVmb3JlIHNlZSB0aGUgYGZvby5iYXIgfHwgZm9vWydiYXInXWBcbiAgICAvLyBwYXR0ZXJuIHJlcGVhdGVkIGFjcm9zcyB0aGlzIG1ldGhvZC5cbiAgICB2YXIgd2lkZ2V0TWlzc2luZyA9ICh0eXBlb2YgY29uZmlnLndpZGdldCA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgdHlwZW9mIGNvbmZpZ1snd2lkZ2V0J10gPT09ICd1bmRlZmluZWQnKTtcbiAgICB2YXIgd2lkZ2V0ID0gdHJ1ZTtcblxuICAgIGlmICghd2lkZ2V0TWlzc2luZykge1xuICAgICAgd2lkZ2V0ID0gY29uZmlnLndpZGdldCB8fCBjb25maWdbJ3dpZGdldCddO1xuICAgIH1cblxuICAgIHZhciBuZXdDb25maWcgPSAvKiogQHR5cGUge2NvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnfSAqLyAoe1xuICAgICAgY2xhc3NDb25zdHJ1Y3RvcjogY29uZmlnLmNvbnN0cnVjdG9yIHx8IGNvbmZpZ1snY29uc3RydWN0b3InXSxcbiAgICAgIGNsYXNzTmFtZTogY29uZmlnLmNsYXNzQXNTdHJpbmcgfHwgY29uZmlnWydjbGFzc0FzU3RyaW5nJ10sXG4gICAgICBjc3NDbGFzczogY29uZmlnLmNzc0NsYXNzIHx8IGNvbmZpZ1snY3NzQ2xhc3MnXSxcbiAgICAgIHdpZGdldDogd2lkZ2V0LFxuICAgICAgY2FsbGJhY2tzOiBbXVxuICAgIH0pO1xuXG4gICAgcmVnaXN0ZXJlZENvbXBvbmVudHNfLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKGl0ZW0uY3NzQ2xhc3MgPT09IG5ld0NvbmZpZy5jc3NDbGFzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBjc3NDbGFzcyBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQ6ICcgKyBpdGVtLmNzc0NsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmNsYXNzTmFtZSA9PT0gbmV3Q29uZmlnLmNsYXNzTmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwcm92aWRlZCBjbGFzc05hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICAgICAgICAuaGFzT3duUHJvcGVydHkoY29tcG9uZW50Q29uZmlnUHJvcGVydHlfKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNREwgY29tcG9uZW50IGNsYXNzZXMgbXVzdCBub3QgaGF2ZSAnICsgY29tcG9uZW50Q29uZmlnUHJvcGVydHlfICtcbiAgICAgICAgICAnIGRlZmluZWQgYXMgYSBwcm9wZXJ0eS4nKTtcbiAgICB9XG5cbiAgICB2YXIgZm91bmQgPSBmaW5kUmVnaXN0ZXJlZENsYXNzXyhjb25maWcuY2xhc3NBc1N0cmluZywgbmV3Q29uZmlnKTtcblxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzXy5wdXNoKG5ld0NvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB1c2VyIHRvIGJlIGFsZXJ0ZWQgdG8gYW55IHVwZ3JhZGVzIHRoYXQgYXJlIHBlcmZvcm1lZCBmb3IgYSBnaXZlblxuICAgKiBjb21wb25lbnQgdHlwZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ganNDbGFzcyBUaGUgY2xhc3MgbmFtZSBvZiB0aGUgTURMIGNvbXBvbmVudCB3ZSB3aXNoXG4gICAqIHRvIGhvb2sgaW50byBmb3IgYW55IHVwZ3JhZGVzIHBlcmZvcm1lZC5cbiAgICogQHBhcmFtIHtmdW5jdGlvbighSFRNTEVsZW1lbnQpfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY2FsbCB1cG9uIGFuXG4gICAqIHVwZ3JhZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCAxIHBhcmFtZXRlciAtIHRoZSBIVE1MRWxlbWVudCB3aGljaFxuICAgKiBnb3QgdXBncmFkZWQuXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2tJbnRlcm5hbChqc0NsYXNzLCBjYWxsYmFjaykge1xuICAgIHZhciByZWdDbGFzcyA9IGZpbmRSZWdpc3RlcmVkQ2xhc3NfKGpzQ2xhc3MpO1xuICAgIGlmIChyZWdDbGFzcykge1xuICAgICAgcmVnQ2xhc3MuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGdyYWRlcyBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGZvdW5kIGluIHRoZSBjdXJyZW50IERPTS4gVGhpcyBpc1xuICAgKiBhdXRvbWF0aWNhbGx5IGNhbGxlZCBvbiB3aW5kb3cgbG9hZC5cbiAgICovXG4gIGZ1bmN0aW9uIHVwZ3JhZGVBbGxSZWdpc3RlcmVkSW50ZXJuYWwoKSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCByZWdpc3RlcmVkQ29tcG9uZW50c18ubGVuZ3RoOyBuKyspIHtcbiAgICAgIHVwZ3JhZGVEb21JbnRlcm5hbChyZWdpc3RlcmVkQ29tcG9uZW50c19bbl0uY2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYSBjcmVhdGVkIGNvbXBvbmVudCBieSBhIGdpdmVuIERPTSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0geyFOb2RlfSBub2RlXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBmdW5jdGlvbiBmaW5kQ3JlYXRlZENvbXBvbmVudEJ5Tm9kZUludGVybmFsKG5vZGUpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IGNyZWF0ZWRDb21wb25lbnRzXy5sZW5ndGg7IG4rKykge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGNyZWF0ZWRDb21wb25lbnRzX1tuXTtcbiAgICAgIGlmIChjb21wb25lbnQuZWxlbWVudF8gPT09IG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbXBvbmVudCBmb3IgdGhlIGRvd25ncmFkZSBtZXRob2QuXG4gICAqIEV4ZWN1dGUgaWYgZm91bmQuXG4gICAqIFJlbW92ZSBjb21wb25lbnQgZnJvbSBjcmVhdGVkQ29tcG9uZW50cyBsaXN0LlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGNvbXBvbmVudFxuICAgKi9cbiAgZnVuY3Rpb24gZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbChjb21wb25lbnQpIHtcbiAgICBpZiAoY29tcG9uZW50ICYmXG4gICAgICAgIGNvbXBvbmVudFtjb21wb25lbnRDb25maWdQcm9wZXJ0eV9dXG4gICAgICAgICAgLmNsYXNzQ29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgICAgICAgLmhhc093blByb3BlcnR5KGRvd25ncmFkZU1ldGhvZF8pKSB7XG4gICAgICBjb21wb25lbnRbZG93bmdyYWRlTWV0aG9kX10oKTtcbiAgICAgIHZhciBjb21wb25lbnRJbmRleCA9IGNyZWF0ZWRDb21wb25lbnRzXy5pbmRleE9mKGNvbXBvbmVudCk7XG4gICAgICBjcmVhdGVkQ29tcG9uZW50c18uc3BsaWNlKGNvbXBvbmVudEluZGV4LCAxKTtcblxuICAgICAgdmFyIHVwZ3JhZGVzID0gY29tcG9uZW50LmVsZW1lbnRfLmdldEF0dHJpYnV0ZSgnZGF0YS11cGdyYWRlZCcpLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgY29tcG9uZW50UGxhY2UgPSB1cGdyYWRlcy5pbmRleE9mKFxuICAgICAgICAgIGNvbXBvbmVudFtjb21wb25lbnRDb25maWdQcm9wZXJ0eV9dLmNsYXNzQXNTdHJpbmcpO1xuICAgICAgdXBncmFkZXMuc3BsaWNlKGNvbXBvbmVudFBsYWNlLCAxKTtcbiAgICAgIGNvbXBvbmVudC5lbGVtZW50Xy5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXBncmFkZWQnLCB1cGdyYWRlcy5qb2luKCcsJykpO1xuXG4gICAgICB2YXIgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnRzJyk7XG4gICAgICBldi5pbml0RXZlbnQoJ21kbC1jb21wb25lbnRkb3duZ3JhZGVkJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBjb21wb25lbnQuZWxlbWVudF8uZGlzcGF0Y2hFdmVudChldik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERvd25ncmFkZSBlaXRoZXIgYSBnaXZlbiBub2RlLCBhbiBhcnJheSBvZiBub2Rlcywgb3IgYSBOb2RlTGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHshTm9kZXwhQXJyYXk8IU5vZGU+fCFOb2RlTGlzdH0gbm9kZXNcbiAgICovXG4gIGZ1bmN0aW9uIGRvd25ncmFkZU5vZGVzSW50ZXJuYWwobm9kZXMpIHtcbiAgICAvKipcbiAgICAgKiBBdXhpbGlhcnkgZnVuY3Rpb24gdG8gZG93bmdyYWRlIGEgc2luZ2xlIG5vZGUuXG4gICAgICogQHBhcmFtICB7IU5vZGV9IG5vZGUgdGhlIG5vZGUgdG8gYmUgZG93bmdyYWRlZFxuICAgICAqL1xuICAgIHZhciBkb3duZ3JhZGVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgZGVjb25zdHJ1Y3RDb21wb25lbnRJbnRlcm5hbChmaW5kQ3JlYXRlZENvbXBvbmVudEJ5Tm9kZUludGVybmFsKG5vZGUpKTtcbiAgICB9O1xuICAgIGlmIChub2RlcyBpbnN0YW5jZW9mIEFycmF5IHx8IG5vZGVzIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgZG93bmdyYWRlTm9kZShub2Rlc1tuXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2RlcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIGRvd25ncmFkZU5vZGUobm9kZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gZG93bmdyYWRlIE1ETCBub2Rlcy4nKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3cgcmV0dXJuIHRoZSBmdW5jdGlvbnMgdGhhdCBzaG91bGQgYmUgbWFkZSBwdWJsaWMgd2l0aCB0aGVpciBwdWJsaWNseVxuICAvLyBmYWNpbmcgbmFtZXMuLi5cbiAgcmV0dXJuIHtcbiAgICB1cGdyYWRlRG9tOiB1cGdyYWRlRG9tSW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnQ6IHVwZ3JhZGVFbGVtZW50SW50ZXJuYWwsXG4gICAgdXBncmFkZUVsZW1lbnRzOiB1cGdyYWRlRWxlbWVudHNJbnRlcm5hbCxcbiAgICB1cGdyYWRlQWxsUmVnaXN0ZXJlZDogdXBncmFkZUFsbFJlZ2lzdGVyZWRJbnRlcm5hbCxcbiAgICByZWdpc3RlclVwZ3JhZGVkQ2FsbGJhY2s6IHJlZ2lzdGVyVXBncmFkZWRDYWxsYmFja0ludGVybmFsLFxuICAgIHJlZ2lzdGVyOiByZWdpc3RlckludGVybmFsLFxuICAgIGRvd25ncmFkZUVsZW1lbnRzOiBkb3duZ3JhZGVOb2Rlc0ludGVybmFsXG4gIH07XG59KSgpO1xuXG4vKipcbiAqIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBhIHJlZ2lzdGVyZWQgY29tcG9uZW50IHR5cGUgbWFuYWdlZCBieVxuICogY29tcG9uZW50SGFuZGxlci4gUHJvdmlkZWQgZm9yIGJlbmVmaXQgb2YgdGhlIENsb3N1cmUgY29tcGlsZXIuXG4gKlxuICogQHR5cGVkZWYge3tcbiAqICAgY29uc3RydWN0b3I6IEZ1bmN0aW9uLFxuICogICBjbGFzc0FzU3RyaW5nOiBzdHJpbmcsXG4gKiAgIGNzc0NsYXNzOiBzdHJpbmcsXG4gKiAgIHdpZGdldDogKHN0cmluZ3xib29sZWFufHVuZGVmaW5lZClcbiAqIH19XG4gKi9cbmNvbXBvbmVudEhhbmRsZXIuQ29tcG9uZW50Q29uZmlnUHVibGljOyAgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbi8qKlxuICogRGVzY3JpYmVzIHRoZSB0eXBlIG9mIGEgcmVnaXN0ZXJlZCBjb21wb25lbnQgdHlwZSBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBjb25zdHJ1Y3RvcjogIUZ1bmN0aW9uLFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY3NzQ2xhc3M6IHN0cmluZyxcbiAqICAgd2lkZ2V0OiAoc3RyaW5nfGJvb2xlYW4pLFxuICogICBjYWxsYmFja3M6ICFBcnJheTxmdW5jdGlvbighSFRNTEVsZW1lbnQpPlxuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnRDb25maWc7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLyoqXG4gKiBDcmVhdGVkIGNvbXBvbmVudCAoaS5lLiwgdXBncmFkZWQgZWxlbWVudCkgdHlwZSBhcyBtYW5hZ2VkIGJ5XG4gKiBjb21wb25lbnRIYW5kbGVyLiBQcm92aWRlZCBmb3IgYmVuZWZpdCBvZiB0aGUgQ2xvc3VyZSBjb21waWxlci5cbiAqXG4gKiBAdHlwZWRlZiB7e1xuICogICBlbGVtZW50XzogIUhUTUxFbGVtZW50LFxuICogICBjbGFzc05hbWU6IHN0cmluZyxcbiAqICAgY2xhc3NBc1N0cmluZzogc3RyaW5nLFxuICogICBjc3NDbGFzczogc3RyaW5nLFxuICogICB3aWRnZXQ6IHN0cmluZ1xuICogfX1cbiAqL1xuY29tcG9uZW50SGFuZGxlci5Db21wb25lbnQ7ICAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuLy8gRXhwb3J0IGFsbCBzeW1ib2xzLCBmb3IgdGhlIGJlbmVmaXQgb2YgQ2xvc3VyZSBjb21waWxlci5cbi8vIE5vIGVmZmVjdCBvbiB1bmNvbXBpbGVkIGNvZGUuXG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRG9tJ10gPSBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVEb207XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlRWxlbWVudCddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudDtcbmNvbXBvbmVudEhhbmRsZXJbJ3VwZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudHM7XG5jb21wb25lbnRIYW5kbGVyWyd1cGdyYWRlQWxsUmVnaXN0ZXJlZCddID1cbiAgICBjb21wb25lbnRIYW5kbGVyLnVwZ3JhZGVBbGxSZWdpc3RlcmVkO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrJ10gPVxuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXJVcGdyYWRlZENhbGxiYWNrO1xuY29tcG9uZW50SGFuZGxlclsncmVnaXN0ZXInXSA9IGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXI7XG5jb21wb25lbnRIYW5kbGVyWydkb3duZ3JhZGVFbGVtZW50cyddID0gY29tcG9uZW50SGFuZGxlci5kb3duZ3JhZGVFbGVtZW50cztcbndpbmRvdy5jb21wb25lbnRIYW5kbGVyID0gY29tcG9uZW50SGFuZGxlcjtcbndpbmRvd1snY29tcG9uZW50SGFuZGxlciddID0gY29tcG9uZW50SGFuZGxlcjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhIFwiQ3V0dGluZyB0aGUgbXVzdGFyZFwiIHRlc3QuIElmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBmZWF0dXJlc1xuICAgKiB0ZXN0ZWQsIGFkZHMgYSBtZGwtanMgY2xhc3MgdG8gdGhlIDxodG1sPiBlbGVtZW50LiBJdCB0aGVuIHVwZ3JhZGVzIGFsbCBNRExcbiAgICogY29tcG9uZW50cyByZXF1aXJpbmcgSmF2YVNjcmlwdC5cbiAgICovXG4gIGlmICgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAmJlxuICAgICAgJ3F1ZXJ5U2VsZWN0b3InIGluIGRvY3VtZW50ICYmXG4gICAgICAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICYmIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21kbC1qcycpO1xuICAgIGNvbXBvbmVudEhhbmRsZXIudXBncmFkZUFsbFJlZ2lzdGVyZWQoKTtcbiAgfSBlbHNlIHtcbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvbiB0byBhdm9pZCBKUyBlcnJvcnMuXG4gICAgICovXG4gICAgY29tcG9uZW50SGFuZGxlci51cGdyYWRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge307XG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb24gdG8gYXZvaWQgSlMgZXJyb3JzLlxuICAgICAqL1xuICAgIGNvbXBvbmVudEhhbmRsZXIucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHt9O1xuICB9XG59KTtcbiJdLCJmaWxlIjoibWRsQ29tcG9uZW50SGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

(function() {
'use strict';

if (!Date.now) {
  /**
   * Date.now polyfill.
   * @return {number} the current Date
   */
  Date.now = function() { return new Date().getTime(); };
  Date['now'] = Date.now;
}

var vendors = ['webkit', 'moz'];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
  var vp = vendors[i];
  window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
  window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] ||
      window[vp + 'CancelRequestAnimationFrame']);
  window['requestAnimationFrame'] = window.requestAnimationFrame;
  window['cancelAnimationFrame'] = window.cancelAnimationFrame;
}

if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
  var lastTime = 0;
  /**
   * requestAnimationFrame polyfill.
   * @param  {!Function} callback the callback function.
   */
  window.requestAnimationFrame = function(callback) {
    var now = Date.now();
    var nextTime = Math.max(lastTime + 16, now);
    return setTimeout(function() { callback(lastTime = nextTime); },
                      nextTime - now);
  };
  window.cancelAnimationFrame = clearTimeout;
  window['requestAnimationFrame'] = window.requestAnimationFrame;
  window['cancelAnimationFrame'] = window.cancelAnimationFrame;
}

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyQUYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vZGFyaXVzL3JlcXVlc3RBbmltYXRpb25GcmFtZS9ibG9iL21hc3Rlci9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuanNcbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSB3aGljaCBkZXJpdmVkIGZyb21cbi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuXG4vLyBGaXhlcyBmcm9tIFBhdWwgSXJpc2gsIFRpbm8gWmlqZGVsLCBBbmRyZXcgTWFvLCBLbGVtZW4gU2xhdmnEjSwgRGFyaXVzIEJhY29uXG5cbi8vIE1JVCBsaWNlbnNlXG5cbihmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuaWYgKCFEYXRlLm5vdykge1xuICAvKipcbiAgICogRGF0ZS5ub3cgcG9seWZpbGwuXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGN1cnJlbnQgRGF0ZVxuICAgKi9cbiAgRGF0ZS5ub3cgPSBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuICBEYXRlWydub3cnXSA9IERhdGUubm93O1xufVxuXG52YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddO1xuZm9yICh2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gIHZhciB2cCA9IHZlbmRvcnNbaV07XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdnAgKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9ICh3aW5kb3dbdnAgKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fFxuICAgICAgd2luZG93W3ZwICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddKTtcbiAgd2luZG93WydyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gIHdpbmRvd1snY2FuY2VsQW5pbWF0aW9uRnJhbWUnXSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcbn1cblxuaWYgKC9pUChhZHxob25lfG9kKS4qT1MgNi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSkge1xuICB2YXIgbGFzdFRpbWUgPSAwO1xuICAvKipcbiAgICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsLlxuICAgKiBAcGFyYW0gIHshRnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgIHZhciBuZXh0VGltZSA9IE1hdGgubWF4KGxhc3RUaW1lICsgMTYsIG5vdyk7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgIG5leHRUaW1lIC0gbm93KTtcbiAgfTtcbiAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2xlYXJUaW1lb3V0O1xuICB3aW5kb3dbJ3JlcXVlc3RBbmltYXRpb25GcmFtZSddID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgd2luZG93WydjYW5jZWxBbmltYXRpb25GcmFtZSddID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lO1xufVxuXG59KSgpO1xuIl0sImZpbGUiOiJyQUYuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

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
   * Class constructor for Button MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialButton = function MaterialButton(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialButton'] = MaterialButton;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialButton.prototype.Constant_ = {
    // None for now.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialButton.prototype.CssClasses_ = {
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-button__ripple-container',
    RIPPLE: 'mdl-ripple'
  };

  /**
   * Handle blur of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialButton.prototype.blurHandler_ = function(event) {
    if (event) {
      this.element_.blur();
    }
  };

  // Public methods.

  /**
   * Disable button.
   *
   * @public
   */
  MaterialButton.prototype.disable = function() {
    this.element_.disabled = true;
  };
  MaterialButton.prototype['disable'] = MaterialButton.prototype.disable;

  /**
   * Enable button.
   *
   * @public
   */
  MaterialButton.prototype.enable = function() {
    this.element_.disabled = false;
  };
  MaterialButton.prototype['enable'] = MaterialButton.prototype.enable;

  /**
   * Initialize element.
   */
  MaterialButton.prototype.init = function() {
    if (this.element_) {
      if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
        this.rippleElement_ = document.createElement('span');
        this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
        rippleContainer.appendChild(this.rippleElement_);
        this.boundRippleBlurHandler = this.blurHandler_.bind(this);
        this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
        this.element_.appendChild(rippleContainer);
      }
      this.boundButtonBlurHandler = this.blurHandler_.bind(this);
      this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
      this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
    }
  };

  /**
   * Downgrade the element.
   *
   * @private
   */
  MaterialButton.prototype.mdlDowngrade_ = function() {
    if (this.rippleElement_) {
      this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
    }
    this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
    this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  MaterialButton.prototype.mdlDowngrade =
      MaterialButton.prototype.mdlDowngrade_;

  MaterialButton.prototype['mdlDowngrade'] =
      MaterialButton.prototype.mdlDowngrade;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialButton,
    classAsString: 'MaterialButton',
    cssClass: 'mdl-js-button',
    widget: true
  });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidXR0b24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgQnV0dG9uIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVwZ3JhZGVkLlxuICAgKi9cbiAgdmFyIE1hdGVyaWFsQnV0dG9uID0gZnVuY3Rpb24gTWF0ZXJpYWxCdXR0b24oZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbEJ1dHRvbiddID0gTWF0ZXJpYWxCdXR0b247XG5cbiAgLyoqXG4gICAqIFN0b3JlIGNvbnN0YW50cyBpbiBvbmUgcGxhY2Ugc28gdGhleSBjYW4gYmUgdXBkYXRlZCBlYXNpbHkuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmcgfCBudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIC8vIE5vbmUgZm9yIG5vdy5cbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBSSVBQTEVfRUZGRUNUOiAnbWRsLWpzLXJpcHBsZS1lZmZlY3QnLFxuICAgIFJJUFBMRV9DT05UQUlORVI6ICdtZGwtYnV0dG9uX19yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgYmx1ciBvZiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5ibHVySGFuZGxlcl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5lbGVtZW50Xy5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFB1YmxpYyBtZXRob2RzLlxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIGJ1dHRvbi5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLmRpc2FibGVkID0gdHJ1ZTtcbiAgfTtcbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlWydkaXNhYmxlJ10gPSBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUuZGlzYWJsZTtcblxuICAvKipcbiAgICogRW5hYmxlIGJ1dHRvbi5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudF8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfTtcbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlWydlbmFibGUnXSA9IE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5lbmFibGU7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHZhciByaXBwbGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgIHJpcHBsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnJpcHBsZUVsZW1lbnRfKTtcbiAgICAgICAgdGhpcy5ib3VuZFJpcHBsZUJsdXJIYW5kbGVyID0gdGhpcy5ibHVySGFuZGxlcl8uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZFJpcHBsZUJsdXJIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5ib3VuZEJ1dHRvbkJsdXJIYW5kbGVyID0gdGhpcy5ibHVySGFuZGxlcl8uYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRCdXR0b25CbHVySGFuZGxlcik7XG4gICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmJvdW5kQnV0dG9uQmx1ckhhbmRsZXIpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRG93bmdyYWRlIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLm1kbERvd25ncmFkZV8gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5yaXBwbGVFbGVtZW50Xykge1xuICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZFJpcHBsZUJsdXJIYW5kbGVyKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZEJ1dHRvbkJsdXJIYW5kbGVyKTtcbiAgICB0aGlzLmVsZW1lbnRfLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmJvdW5kQnV0dG9uQmx1ckhhbmRsZXIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgYWxpYXMgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbEJ1dHRvbi5wcm90b3R5cGUubWRsRG93bmdyYWRlID1cbiAgICAgIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfO1xuXG4gIE1hdGVyaWFsQnV0dG9uLnByb3RvdHlwZVsnbWRsRG93bmdyYWRlJ10gPVxuICAgICAgTWF0ZXJpYWxCdXR0b24ucHJvdG90eXBlLm1kbERvd25ncmFkZTtcblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsQnV0dG9uLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbEJ1dHRvbicsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtYnV0dG9uJyxcbiAgICB3aWRnZXQ6IHRydWVcbiAgfSk7XG59KSgpO1xuIl0sImZpbGUiOiJidXR0b24uanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==

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
   * Adds an event listener to clean up after the animation ends.
   *
   * @private
   */
  MaterialMenu.prototype.addAnimationEndListener_ = function() {
    var cleanup = function() {
      this.element_.removeEventListener('transitionend', cleanup);
      this.element_.removeEventListener('webkitTransitionEnd', cleanup);
      this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
    }.bind(this);

    // Remove animation class once the transition is done.
    this.element_.addEventListener('transitionend', cleanup);
    this.element_.addEventListener('webkitTransitionEnd', cleanup);
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
        items[i].style.transitionDelay = null;
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

  /**
   * Downgrade the component.
   *
   * @private
   */
  MaterialMenu.prototype.mdlDowngrade_ = function() {
    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

    for (var i = 0; i < items.length; i++) {
      items[i].removeEventListener('click', this.boundItemClick_);
      items[i].removeEventListener('keydown', this.boundItemKeydown_);
    }
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  MaterialMenu.prototype.mdlDowngrade =
      MaterialMenu.prototype.mdlDowngrade_;

  MaterialMenu.prototype['mdlDowngrade'] =
      MaterialMenu.prototype.mdlDowngrade;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
  });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtZW51LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQ2xhc3MgY29uc3RydWN0b3IgZm9yIGRyb3Bkb3duIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbE1lbnUgPSBmdW5jdGlvbiBNYXRlcmlhbE1lbnUoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZS5cbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcbiAgd2luZG93WydNYXRlcmlhbE1lbnUnXSA9IE1hdGVyaWFsTWVudTtcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuQ29uc3RhbnRfID0ge1xuICAgIC8vIFRvdGFsIGR1cmF0aW9uIG9mIHRoZSBtZW51IGFuaW1hdGlvbi5cbiAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX1NFQ09ORFM6IDAuMyxcbiAgICAvLyBUaGUgZnJhY3Rpb24gb2YgdGhlIHRvdGFsIGR1cmF0aW9uIHdlIHdhbnQgdG8gdXNlIGZvciBtZW51IGl0ZW0gYW5pbWF0aW9ucy5cbiAgICBUUkFOU0lUSU9OX0RVUkFUSU9OX0ZSQUNUSU9OOiAwLjgsXG4gICAgLy8gSG93IGxvbmcgdGhlIG1lbnUgc3RheXMgb3BlbiBhZnRlciBjaG9vc2luZyBhbiBvcHRpb24gKHNvIHRoZSB1c2VyIGNhbiBzZWVcbiAgICAvLyB0aGUgcmlwcGxlKS5cbiAgICBDTE9TRV9USU1FT1VUOiAxNTBcbiAgfTtcblxuICAvKipcbiAgICogS2V5Y29kZXMsIGZvciBjb2RlIHJlYWRhYmlsaXR5LlxuICAgKlxuICAgKiBAZW51bSB7bnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5LZXljb2Rlc18gPSB7XG4gICAgRU5URVI6IDEzLFxuICAgIEVTQ0FQRTogMjcsXG4gICAgU1BBQ0U6IDMyLFxuICAgIFVQX0FSUk9XOiAzOCxcbiAgICBET1dOX0FSUk9XOiA0MFxuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBDT05UQUlORVI6ICdtZGwtbWVudV9fY29udGFpbmVyJyxcbiAgICBPVVRMSU5FOiAnbWRsLW1lbnVfX291dGxpbmUnLFxuICAgIElURU06ICdtZGwtbWVudV9faXRlbScsXG4gICAgSVRFTV9SSVBQTEVfQ09OVEFJTkVSOiAnbWRsLW1lbnVfX2l0ZW0tcmlwcGxlLWNvbnRhaW5lcicsXG4gICAgUklQUExFX0VGRkVDVDogJ21kbC1qcy1yaXBwbGUtZWZmZWN0JyxcbiAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICAvLyBTdGF0dXNlc1xuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgIElTX1ZJU0lCTEU6ICdpcy12aXNpYmxlJyxcbiAgICBJU19BTklNQVRJTkc6ICdpcy1hbmltYXRpbmcnLFxuICAgIC8vIEFsaWdubWVudCBvcHRpb25zXG4gICAgQk9UVE9NX0xFRlQ6ICdtZGwtbWVudS0tYm90dG9tLWxlZnQnLCAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdC5cbiAgICBCT1RUT01fUklHSFQ6ICdtZGwtbWVudS0tYm90dG9tLXJpZ2h0JyxcbiAgICBUT1BfTEVGVDogJ21kbC1tZW51LS10b3AtbGVmdCcsXG4gICAgVE9QX1JJR0hUOiAnbWRsLW1lbnUtLXRvcC1yaWdodCcsXG4gICAgVU5BTElHTkVEOiAnbWRsLW1lbnUtLXVuYWxpZ25lZCdcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBlbGVtZW50LlxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIC8vIENyZWF0ZSBjb250YWluZXIgZm9yIHRoZSBtZW51LlxuICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5DT05UQUlORVIpO1xuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjb250YWluZXIsIHRoaXMuZWxlbWVudF8pO1xuICAgICAgdGhpcy5lbGVtZW50Xy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudF8pO1xuICAgICAgdGhpcy5jb250YWluZXJfID0gY29udGFpbmVyO1xuXG4gICAgICAvLyBDcmVhdGUgb3V0bGluZSBmb3IgdGhlIG1lbnUgKHNoYWRvdyBhbmQgYmFja2dyb3VuZCkuXG4gICAgICB2YXIgb3V0bGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgb3V0bGluZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT1VUTElORSk7XG4gICAgICB0aGlzLm91dGxpbmVfID0gb3V0bGluZTtcbiAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUob3V0bGluZSwgdGhpcy5lbGVtZW50Xyk7XG5cbiAgICAgIC8vIEZpbmQgdGhlIFwiZm9yXCIgZWxlbWVudCBhbmQgYmluZCBldmVudHMgdG8gaXQuXG4gICAgICB2YXIgZm9yRWxJZCA9IHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdmb3InKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uZ2V0QXR0cmlidXRlKCdkYXRhLW1kbC1mb3InKTtcbiAgICAgIHZhciBmb3JFbCA9IG51bGw7XG4gICAgICBpZiAoZm9yRWxJZCkge1xuICAgICAgICBmb3JFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZvckVsSWQpO1xuICAgICAgICBpZiAoZm9yRWwpIHtcbiAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfID0gZm9yRWw7XG4gICAgICAgICAgZm9yRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUZvckNsaWNrXy5iaW5kKHRoaXMpKTtcbiAgICAgICAgICBmb3JFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVGb3JLZXlib2FyZEV2ZW50Xy5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNKTtcbiAgICAgIHRoaXMuYm91bmRJdGVtS2V5ZG93bl8gPSB0aGlzLmhhbmRsZUl0ZW1LZXlib2FyZEV2ZW50Xy5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ib3VuZEl0ZW1DbGlja18gPSB0aGlzLmhhbmRsZUl0ZW1DbGlja18uYmluZCh0aGlzKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gQWRkIGEgbGlzdGVuZXIgdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ib3VuZEl0ZW1DbGlja18pO1xuICAgICAgICAvLyBBZGQgYSB0YWIgaW5kZXggdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLnRhYkluZGV4ID0gJy0xJztcbiAgICAgICAgLy8gQWRkIGEga2V5Ym9hcmQgbGlzdGVuZXIgdG8gZWFjaCBtZW51IGl0ZW0uXG4gICAgICAgIGl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kSXRlbUtleWRvd25fKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHJpcHBsZSBjbGFzc2VzIHRvIGVhY2ggaXRlbSwgaWYgdGhlIHVzZXIgaGFzIGVuYWJsZWQgcmlwcGxlcy5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRV9JR05PUkVfRVZFTlRTKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuXG4gICAgICAgICAgdmFyIHJpcHBsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklURU1fUklQUExFX0NPTlRBSU5FUik7XG5cbiAgICAgICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgIHJpcHBsZS5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFKTtcbiAgICAgICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcblxuICAgICAgICAgIGl0ZW0uYXBwZW5kQ2hpbGQocmlwcGxlQ29udGFpbmVyKTtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfRUZGRUNUKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb3B5IGFsaWdubWVudCBjbGFzc2VzIHRvIHRoZSBjb250YWluZXIsIHNvIHRoZSBvdXRsaW5lIGNhbiB1c2UgdGhlbS5cbiAgICAgIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9MRUZUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fTEVGVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpKSB7XG4gICAgICAgIHRoaXMub3V0bGluZV8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkpIHtcbiAgICAgICAgdGhpcy5vdXRsaW5lXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX0xFRlQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UT1BfUklHSFQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICB0aGlzLm91dGxpbmVfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpO1xuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBjbGljayBvbiB0aGUgXCJmb3JcIiBlbGVtZW50LCBieSBwb3NpdGlvbmluZyB0aGUgbWVudSBhbmQgdGhlblxuICAgKiB0b2dnbGluZyBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVGb3JDbGlja18gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICB2YXIgcmVjdCA9IHRoaXMuZm9yRWxlbWVudF8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgZm9yUmVjdCA9IHRoaXMuZm9yRWxlbWVudF8ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVU5BTElHTkVEKSkge1xuICAgICAgICAvLyBEbyBub3QgcG9zaXRpb24gdGhlIG1lbnUgYXV0b21hdGljYWxseS4gUmVxdWlyZXMgdGhlIGRldmVsb3BlciB0b1xuICAgICAgICAvLyBtYW51YWxseSBzcGVjaWZ5IHBvc2l0aW9uLlxuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkJPVFRPTV9SSUdIVCkpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gYmVsb3cgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgcmlnaHQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5yaWdodCA9IChmb3JSZWN0LnJpZ2h0IC0gcmVjdC5yaWdodCkgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUudG9wID1cbiAgICAgICAgICAgIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0VG9wICsgdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRIZWlnaHQgKyAncHgnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgICAvLyBQb3NpdGlvbiBhYm92ZSB0aGUgXCJmb3JcIiBlbGVtZW50LCBhbGlnbmVkIHRvIGl0cyBsZWZ0LlxuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUubGVmdCA9IHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0TGVmdCArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5ib3R0b20gPSAoZm9yUmVjdC5ib3R0b20gLSByZWN0LnRvcCkgKyAncHgnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgICAgLy8gUG9zaXRpb24gYWJvdmUgdGhlIFwiZm9yXCIgZWxlbWVudCwgYWxpZ25lZCB0byBpdHMgcmlnaHQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5yaWdodCA9IChmb3JSZWN0LnJpZ2h0IC0gcmVjdC5yaWdodCkgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lcl8uc3R5bGUuYm90dG9tID0gKGZvclJlY3QuYm90dG9tIC0gcmVjdC50b3ApICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQ6IHBvc2l0aW9uIGJlbG93IHRoZSBcImZvclwiIGVsZW1lbnQsIGFsaWduZWQgdG8gaXRzIGxlZnQuXG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5sZWZ0ID0gdGhpcy5mb3JFbGVtZW50Xy5vZmZzZXRMZWZ0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXJfLnN0eWxlLnRvcCA9XG4gICAgICAgICAgICB0aGlzLmZvckVsZW1lbnRfLm9mZnNldFRvcCArIHRoaXMuZm9yRWxlbWVudF8ub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRvZ2dsZShldnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEga2V5Ym9hcmQgZXZlbnQgb24gdGhlIFwiZm9yXCIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVGb3JLZXlib2FyZEV2ZW50XyA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfICYmIHRoaXMuY29udGFpbmVyXyAmJiB0aGlzLmZvckVsZW1lbnRfKSB7XG4gICAgICB2YXIgaXRlbXMgPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JVEVNICtcbiAgICAgICAgJzpub3QoW2Rpc2FibGVkXSknKTtcblxuICAgICAgaWYgKGl0ZW1zICYmIGl0ZW1zLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSkpIHtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkRPV05fQVJST1cpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpdGVtc1swXS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGEga2V5Ym9hcmQgZXZlbnQgb24gYW4gaXRlbS5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oYW5kbGVJdGVtS2V5Ym9hcmRFdmVudF8gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50XyAmJiB0aGlzLmNvbnRhaW5lcl8pIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0gK1xuICAgICAgICAnOm5vdChbZGlzYWJsZWRdKScpO1xuXG4gICAgICBpZiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpLmluZGV4T2YoZXZ0LnRhcmdldCk7XG5cbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSB0aGlzLktleWNvZGVzXy5VUF9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAwKSB7XG4gICAgICAgICAgICBpdGVtc1tjdXJyZW50SW5kZXggLSAxXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRE9XTl9BUlJPVykge1xuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiBjdXJyZW50SW5kZXggKyAxKSB7XG4gICAgICAgICAgICBpdGVtc1tjdXJyZW50SW5kZXggKyAxXS5mb2N1cygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtc1swXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uU1BBQ0UgfHxcbiAgICAgICAgICAgICAgZXZ0LmtleUNvZGUgPT09IHRoaXMuS2V5Y29kZXNfLkVOVEVSKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgLy8gU2VuZCBtb3VzZWRvd24gYW5kIG1vdXNldXAgdG8gdHJpZ2dlciByaXBwbGUuXG4gICAgICAgICAgdmFyIGUgPSBuZXcgTW91c2VFdmVudCgnbW91c2Vkb3duJyk7XG4gICAgICAgICAgZXZ0LnRhcmdldC5kaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgICAgIGUgPSBuZXcgTW91c2VFdmVudCgnbW91c2V1cCcpO1xuICAgICAgICAgIGV2dC50YXJnZXQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICAgICAgICAvLyBTZW5kIGNsaWNrLlxuICAgICAgICAgIGV2dC50YXJnZXQuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gdGhpcy5LZXljb2Rlc18uRVNDQVBFKSB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBjbGljayBldmVudCBvbiBhbiBpdGVtLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLmhhbmRsZUl0ZW1DbGlja18gPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2FpdCBzb21lIHRpbWUgYmVmb3JlIGNsb3NpbmcgbWVudSwgc28gdGhlIHVzZXIgY2FuIHNlZSB0aGUgcmlwcGxlLlxuICAgICAgdGhpcy5jbG9zaW5nXyA9IHRydWU7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbihldnQpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2xvc2luZ18gPSBmYWxzZTtcbiAgICAgIH0uYmluZCh0aGlzKSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovICh0aGlzLkNvbnN0YW50Xy5DTE9TRV9USU1FT1VUKSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBpbml0aWFsIGNsaXAgKGZvciBvcGVuaW5nIHRoZSBtZW51KSBvciBmaW5hbCBjbGlwIChmb3IgY2xvc2luZ1xuICAgKiBpdCksIGFuZCBhcHBsaWVzIGl0LiBUaGlzIGFsbG93cyB1cyB0byBhbmltYXRlIGZyb20gb3IgdG8gdGhlIGNvcnJlY3QgcG9pbnQsXG4gICAqIHRoYXQgaXMsIHRoZSBwb2ludCBpdCdzIGFsaWduZWQgdG8gaW4gdGhlIFwiZm9yXCIgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCBIZWlnaHQgb2YgdGhlIGNsaXAgcmVjdGFuZ2xlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBXaWR0aCBvZiB0aGUgY2xpcCByZWN0YW5nbGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuYXBwbHlDbGlwXyA9IGZ1bmN0aW9uKGhlaWdodCwgd2lkdGgpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5VTkFMSUdORUQpKSB7XG4gICAgICAvLyBEbyBub3QgY2xpcC5cbiAgICAgIHRoaXMuZWxlbWVudF8uc3R5bGUuY2xpcCA9ICcnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5CT1RUT01fUklHSFQpKSB7XG4gICAgICAvLyBDbGlwIHRvIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBtZW51LlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID1cbiAgICAgICAgICAncmVjdCgwICcgKyB3aWR0aCArICdweCAnICsgJzAgJyArIHdpZHRoICsgJ3B4KSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9MRUZUKSkge1xuICAgICAgLy8gQ2xpcCB0byB0aGUgYm90dG9tIGxlZnQgY29ybmVyIG9mIHRoZSBtZW51LlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID1cbiAgICAgICAgICAncmVjdCgnICsgaGVpZ2h0ICsgJ3B4IDAgJyArIGhlaWdodCArICdweCAwKSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLlRPUF9SSUdIVCkpIHtcbiAgICAgIC8vIENsaXAgdG8gdGhlIGJvdHRvbSByaWdodCBjb3JuZXIgb2YgdGhlIG1lbnUuXG4gICAgICB0aGlzLmVsZW1lbnRfLnN0eWxlLmNsaXAgPSAncmVjdCgnICsgaGVpZ2h0ICsgJ3B4ICcgKyB3aWR0aCArICdweCAnICtcbiAgICAgICAgICBoZWlnaHQgKyAncHggJyArIHdpZHRoICsgJ3B4KSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQ6IGRvIG5vdCBjbGlwIChzYW1lIGFzIGNsaXBwaW5nIHRvIHRoZSB0b3AgbGVmdCBjb3JuZXIpLlxuICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJyc7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGNsZWFuIHVwIGFmdGVyIHRoZSBhbmltYXRpb24gZW5kcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUuYWRkQW5pbWF0aW9uRW5kTGlzdGVuZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXApO1xuICAgICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCd3ZWJraXRUcmFuc2l0aW9uRW5kJywgY2xlYW51cCk7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFJlbW92ZSBhbmltYXRpb24gY2xhc3Mgb25jZSB0aGUgdHJhbnNpdGlvbiBpcyBkb25lLlxuICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGNsZWFudXApO1xuICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0VHJhbnNpdGlvbkVuZCcsIGNsZWFudXApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgbWVudS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMub3V0bGluZV8pIHtcbiAgICAgIC8vIE1lYXN1cmUgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICB2YXIgd2lkdGggPSB0aGlzLmVsZW1lbnRfLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuXG4gICAgICAvLyBBcHBseSB0aGUgaW5uZXIgZWxlbWVudCdzIHNpemUgdG8gdGhlIGNvbnRhaW5lciBhbmQgb3V0bGluZS5cbiAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMuY29udGFpbmVyXy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgICAgdGhpcy5vdXRsaW5lXy5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgIHRoaXMub3V0bGluZV8uc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcblxuICAgICAgdmFyIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMuQ29uc3RhbnRfLlRSQU5TSVRJT05fRFVSQVRJT05fU0VDT05EUyAqXG4gICAgICAgICAgdGhpcy5Db25zdGFudF8uVFJBTlNJVElPTl9EVVJBVElPTl9GUkFDVElPTjtcblxuICAgICAgLy8gQ2FsY3VsYXRlIHRyYW5zaXRpb24gZGVsYXlzIGZvciBpbmRpdmlkdWFsIG1lbnUgaXRlbXMsIHNvIHRoYXQgdGhleSBmYWRlXG4gICAgICAvLyBpbiBvbmUgYXQgYSB0aW1lLlxuICAgICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtRGVsYXkgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5UT1BfTEVGVCkgfHxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uVE9QX1JJR0hUKSkge1xuICAgICAgICAgIGl0ZW1EZWxheSA9ICgoaGVpZ2h0IC0gaXRlbXNbaV0ub2Zmc2V0VG9wIC0gaXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KSAvXG4gICAgICAgICAgICAgIGhlaWdodCAqIHRyYW5zaXRpb25EdXJhdGlvbikgKyAncyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbURlbGF5ID0gKGl0ZW1zW2ldLm9mZnNldFRvcCAvIGhlaWdodCAqIHRyYW5zaXRpb25EdXJhdGlvbikgKyAncyc7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbXNbaV0uc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gaXRlbURlbGF5O1xuICAgICAgfVxuXG4gICAgICAvLyBBcHBseSB0aGUgaW5pdGlhbCBjbGlwIHRvIHRoZSB0ZXh0IGJlZm9yZSB3ZSBzdGFydCBhbmltYXRpbmcuXG4gICAgICB0aGlzLmFwcGx5Q2xpcF8oaGVpZ2h0LCB3aWR0aCk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBuZXh0IGZyYW1lLCB0dXJuIG9uIGFuaW1hdGlvbiwgYW5kIGFwcGx5IHRoZSBmaW5hbCBjbGlwLlxuICAgICAgLy8gQWxzbyBtYWtlIGl0IHZpc2libGUuIFRoaXMgdHJpZ2dlcnMgdGhlIHRyYW5zaXRpb25zLlxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQU5JTUFUSU5HKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5zdHlsZS5jbGlwID0gJ3JlY3QoMCAnICsgd2lkdGggKyAncHggJyArIGhlaWdodCArICdweCAwKSc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSk7XG4gICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAvLyBDbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8oKTtcblxuICAgICAgLy8gQWRkIGEgY2xpY2sgbGlzdGVuZXIgdG8gdGhlIGRvY3VtZW50LCB0byBjbG9zZSB0aGUgbWVudS5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkb2N1bWVudCBpcyBwcm9jZXNzaW5nIHRoZSBzYW1lIGV2ZW50IHRoYXRcbiAgICAgICAgLy8gZGlzcGxheWVkIHRoZSBtZW51IGluIHRoZSBmaXJzdCBwbGFjZS4gSWYgc28sIGRvIG5vdGhpbmcuXG4gICAgICAgIC8vIEFsc28gY2hlY2sgdG8gc2VlIGlmIHRoZSBtZW51IGlzIGluIHRoZSBwcm9jZXNzIG9mIGNsb3NpbmcgaXRzZWxmLCBhbmRcbiAgICAgICAgLy8gZG8gbm90aGluZyBpbiB0aGF0IGNhc2UuXG4gICAgICAgIC8vIEFsc28gY2hlY2sgaWYgdGhlIGNsaWNrZWQgZWxlbWVudCBpcyBhIG1lbnUgaXRlbVxuICAgICAgICAvLyBpZiBzbywgZG8gbm90aGluZy5cbiAgICAgICAgaWYgKGUgIT09IGV2dCAmJiAhdGhpcy5jbG9zaW5nXyAmJiBlLnRhcmdldC5wYXJlbnROb2RlICE9PSB0aGlzLmVsZW1lbnRfKSB7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYWxsYmFjayk7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZVsnc2hvdyddID0gTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5zaG93O1xuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgbWVudS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8gJiYgdGhpcy5jb250YWluZXJfICYmIHRoaXMub3V0bGluZV8pIHtcbiAgICAgIHZhciBpdGVtcyA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLklURU0pO1xuXG4gICAgICAvLyBSZW1vdmUgYWxsIHRyYW5zaXRpb24gZGVsYXlzOyBtZW51IGl0ZW1zIGZhZGUgb3V0IGNvbmN1cnJlbnRseS5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbXNbaV0uc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gTWVhc3VyZSB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICAgIHZhciByZWN0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBoZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICAgIHZhciB3aWR0aCA9IHJlY3Qud2lkdGg7XG5cbiAgICAgIC8vIFR1cm4gb24gYW5pbWF0aW9uLCBhbmQgYXBwbHkgdGhlIGZpbmFsIGNsaXAuIEFsc28gbWFrZSBpbnZpc2libGUuXG4gICAgICAvLyBUaGlzIHRyaWdnZXJzIHRoZSB0cmFuc2l0aW9ucy5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICB0aGlzLmFwcGx5Q2xpcF8oaGVpZ2h0LCB3aWR0aCk7XG4gICAgICB0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX1ZJU0lCTEUpO1xuXG4gICAgICAvLyBDbGVhbiB1cCBhZnRlciB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLlxuICAgICAgdGhpcy5hZGRBbmltYXRpb25FbmRMaXN0ZW5lcl8oKTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGVbJ2hpZGUnXSA9IE1hdGVyaWFsTWVudS5wcm90b3R5cGUuaGlkZTtcblxuICAvKipcbiAgICogRGlzcGxheXMgb3IgaGlkZXMgdGhlIG1lbnUsIGRlcGVuZGluZyBvbiBjdXJyZW50IHN0YXRlLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfVklTSUJMRSkpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coZXZ0KTtcbiAgICB9XG4gIH07XG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGVbJ3RvZ2dsZSddID0gTWF0ZXJpYWxNZW51LnByb3RvdHlwZS50b2dnbGU7XG5cbiAgLyoqXG4gICAqIERvd25ncmFkZSB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxNZW51LnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uSVRFTSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpdGVtc1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRJdGVtQ2xpY2tfKTtcbiAgICAgIGl0ZW1zW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmJvdW5kSXRlbUtleWRvd25fKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBhbGlhcyBmb3IgdGhlIGRvd25ncmFkZSBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsTWVudS5wcm90b3R5cGUubWRsRG93bmdyYWRlID1cbiAgICAgIE1hdGVyaWFsTWVudS5wcm90b3R5cGUubWRsRG93bmdyYWRlXztcblxuICBNYXRlcmlhbE1lbnUucHJvdG90eXBlWydtZGxEb3duZ3JhZGUnXSA9XG4gICAgICBNYXRlcmlhbE1lbnUucHJvdG90eXBlLm1kbERvd25ncmFkZTtcblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsTWVudSxcbiAgICBjbGFzc0FzU3RyaW5nOiAnTWF0ZXJpYWxNZW51JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1tZW51JyxcbiAgICB3aWRnZXQ6IHRydWVcbiAgfSk7XG59KSgpO1xuIl0sImZpbGUiOiJtZW51LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

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
   * Class constructor for Textfield MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialTextfield = function MaterialTextfield(element) {
    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    // Initialize instance.
    this.init();
  };
  window['MaterialTextfield'] = MaterialTextfield;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialTextfield.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: 'maxrows'
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialTextfield.prototype.CssClasses_ = {
    LABEL: 'mdl-textfield__label',
    INPUT: 'mdl-textfield__input',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handle input being entered.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialTextfield.prototype.onKeyDown_ = function(event) {
    var currentRowCount = event.target.value.split('\n').length;
    if (event.keyCode === 13) {
      if (currentRowCount >= this.maxRows) {
        event.preventDefault();
      }
    }
  };

  /**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialTextfield.prototype.onFocus_ = function(event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
  };

  /**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialTextfield.prototype.onBlur_ = function(event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
  };

  /**
   * Handle reset event from out side.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialTextfield.prototype.onReset_ = function(event) {
    this.updateClasses_();
  };

  /**
   * Handle class updates.
   *
   * @private
   */
  MaterialTextfield.prototype.updateClasses_ = function() {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
  };

  // Public methods.

  /**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */
  MaterialTextfield.prototype.checkDisabled = function() {
    if (this.input_.disabled) {
      this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
  };
  MaterialTextfield.prototype['checkDisabled'] =
      MaterialTextfield.prototype.checkDisabled;

  /**
   * Check the validity state and update field accordingly.
   *
   * @public
   */
  MaterialTextfield.prototype.checkValidity = function() {
    if (this.input_.validity) {
      if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };
  MaterialTextfield.prototype['checkValidity'] =
      MaterialTextfield.prototype.checkValidity;

  /**
   * Check the dirty state and update field accordingly.
   *
   * @public
   */
  MaterialTextfield.prototype.checkDirty = function() {
    if (this.input_.value && this.input_.value.length > 0) {
      this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
  };
  MaterialTextfield.prototype['checkDirty'] =
      MaterialTextfield.prototype.checkDirty;

  /**
   * Disable text field.
   *
   * @public
   */
  MaterialTextfield.prototype.disable = function() {
    this.input_.disabled = true;
    this.updateClasses_();
  };
  MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable;

  /**
   * Enable text field.
   *
   * @public
   */
  MaterialTextfield.prototype.enable = function() {
    this.input_.disabled = false;
    this.updateClasses_();
  };
  MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable;

  /**
   * Update text field value.
   *
   * @param {string} value The value to which to set the control (optional).
   * @public
   */
  MaterialTextfield.prototype.change = function(value) {

    this.input_.value = value || '';
    this.updateClasses_();
  };
  MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change;

  /**
   * Initialize element.
   */
  MaterialTextfield.prototype.init = function() {

    if (this.element_) {
      this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
      this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

      if (this.input_) {
        if (this.input_.hasAttribute(
              /** @type {string} */ (this.Constant_.MAX_ROWS_ATTRIBUTE))) {
          this.maxRows = parseInt(this.input_.getAttribute(
              /** @type {string} */ (this.Constant_.MAX_ROWS_ATTRIBUTE)), 10);
          if (isNaN(this.maxRows)) {
            this.maxRows = this.Constant_.NO_MAX_ROWS;
          }
        }

        this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.boundResetHandler = this.onReset_.bind(this);
        this.input_.addEventListener('input', this.boundUpdateClassesHandler);
        this.input_.addEventListener('focus', this.boundFocusHandler);
        this.input_.addEventListener('blur', this.boundBlurHandler);
        this.input_.addEventListener('reset', this.boundResetHandler);

        if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
          // TODO: This should handle pasting multi line text.
          // Currently doesn't.
          this.boundKeyDownHandler = this.onKeyDown_.bind(this);
          this.input_.addEventListener('keydown', this.boundKeyDownHandler);
        }
        var invalid = this.element_.classList
          .contains(this.CssClasses_.IS_INVALID);
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        if (invalid) {
          this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
      }
    }
  };

  /**
   * Downgrade the component
   *
   * @private
   */
  MaterialTextfield.prototype.mdlDowngrade_ = function() {
    this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
    this.input_.removeEventListener('focus', this.boundFocusHandler);
    this.input_.removeEventListener('blur', this.boundBlurHandler);
    this.input_.removeEventListener('reset', this.boundResetHandler);
    if (this.boundKeyDownHandler) {
      this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
    }
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  MaterialTextfield.prototype.mdlDowngrade =
      MaterialTextfield.prototype.mdlDowngrade_;

  MaterialTextfield.prototype['mdlDowngrade'] =
      MaterialTextfield.prototype.mdlDowngrade;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialTextfield,
    classAsString: 'MaterialTextfield',
    cssClass: 'mdl-js-textfield',
    widget: true
  });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0ZXh0ZmllbGQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgVGV4dGZpZWxkIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFRleHRmaWVsZCA9IGZ1bmN0aW9uIE1hdGVyaWFsVGV4dGZpZWxkKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcbiAgICB0aGlzLm1heFJvd3MgPSB0aGlzLkNvbnN0YW50Xy5OT19NQVhfUk9XUztcbiAgICAvLyBJbml0aWFsaXplIGluc3RhbmNlLlxuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuICB3aW5kb3dbJ01hdGVyaWFsVGV4dGZpZWxkJ10gPSBNYXRlcmlhbFRleHRmaWVsZDtcblxuICAvKipcbiAgICogU3RvcmUgY29uc3RhbnRzIGluIG9uZSBwbGFjZSBzbyB0aGV5IGNhbiBiZSB1cGRhdGVkIGVhc2lseS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZyB8IG51bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5Db25zdGFudF8gPSB7XG4gICAgTk9fTUFYX1JPV1M6IC0xLFxuICAgIE1BWF9ST1dTX0FUVFJJQlVURTogJ21heHJvd3MnXG4gIH07XG5cbiAgLyoqXG4gICAqIFN0b3JlIHN0cmluZ3MgZm9yIGNsYXNzIG5hbWVzIGRlZmluZWQgYnkgdGhpcyBjb21wb25lbnQgdGhhdCBhcmUgdXNlZCBpblxuICAgKiBKYXZhU2NyaXB0LiBUaGlzIGFsbG93cyB1cyB0byBzaW1wbHkgY2hhbmdlIGl0IGluIG9uZSBwbGFjZSBzaG91bGQgd2VcbiAgICogZGVjaWRlIHRvIG1vZGlmeSBhdCBhIGxhdGVyIGRhdGUuXG4gICAqXG4gICAqIEBlbnVtIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuQ3NzQ2xhc3Nlc18gPSB7XG4gICAgTEFCRUw6ICdtZGwtdGV4dGZpZWxkX19sYWJlbCcsXG4gICAgSU5QVVQ6ICdtZGwtdGV4dGZpZWxkX19pbnB1dCcsXG4gICAgSVNfRElSVFk6ICdpcy1kaXJ0eScsXG4gICAgSVNfRk9DVVNFRDogJ2lzLWZvY3VzZWQnLFxuICAgIElTX0RJU0FCTEVEOiAnaXMtZGlzYWJsZWQnLFxuICAgIElTX0lOVkFMSUQ6ICdpcy1pbnZhbGlkJyxcbiAgICBJU19VUEdSQURFRDogJ2lzLXVwZ3JhZGVkJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgaW5wdXQgYmVpbmcgZW50ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUub25LZXlEb3duXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGN1cnJlbnRSb3dDb3VudCA9IGV2ZW50LnRhcmdldC52YWx1ZS5zcGxpdCgnXFxuJykubGVuZ3RoO1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgaWYgKGN1cnJlbnRSb3dDb3VudCA+PSB0aGlzLm1heFJvd3MpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBmb2N1cy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUub25Gb2N1c18gPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0ZPQ1VTRUQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbG9zdCBmb2N1cy5cbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgZmlyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUub25CbHVyXyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRk9DVVNFRCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZSByZXNldCBldmVudCBmcm9tIG91dCBzaWRlLlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5vblJlc2V0XyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgY2xhc3MgdXBkYXRlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS51cGRhdGVDbGFzc2VzXyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hlY2tEaXNhYmxlZCgpO1xuICAgIHRoaXMuY2hlY2tWYWxpZGl0eSgpO1xuICAgIHRoaXMuY2hlY2tEaXJ0eSgpO1xuICB9O1xuXG4gIC8vIFB1YmxpYyBtZXRob2RzLlxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgZGlzYWJsZWQgc3RhdGUgYW5kIHVwZGF0ZSBmaWVsZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5pbnB1dF8uZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0RJU0FCTEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElTQUJMRUQpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlWydjaGVja0Rpc2FibGVkJ10gPVxuICAgICAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmNoZWNrRGlzYWJsZWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSB2YWxpZGl0eSBzdGF0ZSBhbmQgdXBkYXRlIGZpZWxkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hlY2tWYWxpZGl0eSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlucHV0Xy52YWxpZGl0eSkge1xuICAgICAgaWYgKHRoaXMuaW5wdXRfLnZhbGlkaXR5LnZhbGlkKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfSU5WQUxJRCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2NoZWNrVmFsaWRpdHknXSA9XG4gICAgICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hlY2tWYWxpZGl0eTtcblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGRpcnR5IHN0YXRlIGFuZCB1cGRhdGUgZmllbGQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGVja0RpcnR5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRfLnZhbHVlICYmIHRoaXMuaW5wdXRfLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0RJUlRZKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Xy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRElSVFkpO1xuICAgIH1cbiAgfTtcbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlWydjaGVja0RpcnR5J10gPVxuICAgICAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmNoZWNrRGlydHk7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGV4dCBmaWVsZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0Xy5kaXNhYmxlZCA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2Rpc2FibGUnXSA9IE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5kaXNhYmxlO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgdGV4dCBmaWVsZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRfLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzXygpO1xuICB9O1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGVbJ2VuYWJsZSddID0gTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLmVuYWJsZTtcblxuICAvKipcbiAgICogVXBkYXRlIHRleHQgZmllbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd2hpY2ggdG8gc2V0IHRoZSBjb250cm9sIChvcHRpb25hbCkuXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuXG4gICAgdGhpcy5pbnB1dF8udmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gIH07XG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZVsnY2hhbmdlJ10gPSBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuY2hhbmdlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHRoaXMubGFiZWxfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uTEFCRUwpO1xuICAgICAgdGhpcy5pbnB1dF8gPSB0aGlzLmVsZW1lbnRfLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5JTlBVVCk7XG5cbiAgICAgIGlmICh0aGlzLmlucHV0Xykge1xuICAgICAgICBpZiAodGhpcy5pbnB1dF8uaGFzQXR0cmlidXRlKFxuICAgICAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSkpKSB7XG4gICAgICAgICAgdGhpcy5tYXhSb3dzID0gcGFyc2VJbnQodGhpcy5pbnB1dF8uZ2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9ST1dTX0FUVFJJQlVURSkpLCAxMCk7XG4gICAgICAgICAgaWYgKGlzTmFOKHRoaXMubWF4Um93cykpIHtcbiAgICAgICAgICAgIHRoaXMubWF4Um93cyA9IHRoaXMuQ29uc3RhbnRfLk5PX01BWF9ST1dTO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm91bmRVcGRhdGVDbGFzc2VzSGFuZGxlciA9IHRoaXMudXBkYXRlQ2xhc3Nlc18uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ib3VuZEZvY3VzSGFuZGxlciA9IHRoaXMub25Gb2N1c18uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ib3VuZEJsdXJIYW5kbGVyID0gdGhpcy5vbkJsdXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYm91bmRSZXNldEhhbmRsZXIgPSB0aGlzLm9uUmVzZXRfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaW5wdXRfLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5ib3VuZFVwZGF0ZUNsYXNzZXNIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmJvdW5kRm9jdXNIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG4gICAgICAgIHRoaXMuaW5wdXRfLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgdGhpcy5ib3VuZFJlc2V0SGFuZGxlcik7XG5cbiAgICAgICAgaWYgKHRoaXMubWF4Um93cyAhPT0gdGhpcy5Db25zdGFudF8uTk9fTUFYX1JPV1MpIHtcbiAgICAgICAgICAvLyBUT0RPOiBUaGlzIHNob3VsZCBoYW5kbGUgcGFzdGluZyBtdWx0aSBsaW5lIHRleHQuXG4gICAgICAgICAgLy8gQ3VycmVudGx5IGRvZXNuJ3QuXG4gICAgICAgICAgdGhpcy5ib3VuZEtleURvd25IYW5kbGVyID0gdGhpcy5vbktleURvd25fLmJpbmQodGhpcyk7XG4gICAgICAgICAgdGhpcy5pbnB1dF8uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuYm91bmRLZXlEb3duSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGludmFsaWQgPSB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdFxuICAgICAgICAgIC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0lOVkFMSUQpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNsYXNzZXNfKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19JTlZBTElEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRG93bmdyYWRlIHRoZSBjb21wb25lbnRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmJvdW5kVXBkYXRlQ2xhc3Nlc0hhbmRsZXIpO1xuICAgIHRoaXMuaW5wdXRfLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5ib3VuZEZvY3VzSGFuZGxlcik7XG4gICAgdGhpcy5pbnB1dF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRCbHVySGFuZGxlcik7XG4gICAgdGhpcy5pbnB1dF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzZXQnLCB0aGlzLmJvdW5kUmVzZXRIYW5kbGVyKTtcbiAgICBpZiAodGhpcy5ib3VuZEtleURvd25IYW5kbGVyKSB7XG4gICAgICB0aGlzLmlucHV0Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5ib3VuZEtleURvd25IYW5kbGVyKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBhbGlhcyBmb3IgdGhlIGRvd25ncmFkZSBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIE1hdGVyaWFsVGV4dGZpZWxkLnByb3RvdHlwZS5tZGxEb3duZ3JhZGUgPVxuICAgICAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlLm1kbERvd25ncmFkZV87XG5cbiAgTWF0ZXJpYWxUZXh0ZmllbGQucHJvdG90eXBlWydtZGxEb3duZ3JhZGUnXSA9XG4gICAgICBNYXRlcmlhbFRleHRmaWVsZC5wcm90b3R5cGUubWRsRG93bmdyYWRlO1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxUZXh0ZmllbGQsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsVGV4dGZpZWxkJyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy10ZXh0ZmllbGQnLFxuICAgIHdpZGdldDogdHJ1ZVxuICB9KTtcbn0pKCk7XG4iXSwiZmlsZSI6InRleHRmaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

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
   * Class constructor for Layout MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialLayout = function MaterialLayout(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialLayout'] = MaterialLayout;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialLayout.prototype.Constant_ = {
    MAX_WIDTH: '(max-width: 1024px)',
    TAB_SCROLL_PIXELS: 100,

    MENU_ICON: 'menu',
    CHEVRON_LEFT: 'chevron_left',
    CHEVRON_RIGHT: 'chevron_right'
  };

  /**
   * Modes.
   *
   * @enum {number}
   * @private
   */
  MaterialLayout.prototype.Mode_ = {
    STANDARD: 0,
    SEAMED: 1,
    WATERFALL: 2,
    SCROLL: 3
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialLayout.prototype.CssClasses_ = {
    CONTAINER: 'mdl-layout__container',
    HEADER: 'mdl-layout__header',
    DRAWER: 'mdl-layout__drawer',
    CONTENT: 'mdl-layout__content',
    DRAWER_BTN: 'mdl-layout__drawer-button',

    ICON: 'material-icons',

    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
    RIPPLE: 'mdl-ripple',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

    HEADER_SEAMED: 'mdl-layout__header--seamed',
    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
    HEADER_SCROLL: 'mdl-layout__header--scroll',

    FIXED_HEADER: 'mdl-layout--fixed-header',
    OBFUSCATOR: 'mdl-layout__obfuscator',

    TAB_BAR: 'mdl-layout__tab-bar',
    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
    TAB: 'mdl-layout__tab',
    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
    PANEL: 'mdl-layout__tab-panel',

    HAS_DRAWER: 'has-drawer',
    HAS_TABS: 'has-tabs',
    HAS_SCROLLING_HEADER: 'has-scrolling-header',
    CASTING_SHADOW: 'is-casting-shadow',
    IS_COMPACT: 'is-compact',
    IS_SMALL_SCREEN: 'is-small-screen',
    IS_DRAWER_OPEN: 'is-visible',
    IS_ACTIVE: 'is-active',
    IS_UPGRADED: 'is-upgraded',
    IS_ANIMATING: 'is-animating',

    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'

  };

  /**
   * Handles scrolling on the content.
   *
   * @private
   */
  MaterialLayout.prototype.contentScrollHandler_ = function() {
    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
      return;
    }

    if (this.content_.scrollTop > 0 &&
        !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.add(this.CssClasses_.IS_COMPACT);
      this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    } else if (this.content_.scrollTop <= 0 &&
        this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
  };

  /**
   * Handles changes in screen size.
   *
   * @private
   */
  MaterialLayout.prototype.screenSizeHandler_ = function() {
    if (this.screenSizeMediaQuery_.matches) {
      this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
    } else {
      this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
      // Collapse drawer (if any) when moving to a large screen size.
      if (this.drawer_) {
        this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
        this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
      }
    }
  };

  /**
   * Handles toggling of the drawer.
   *
   * @private
   */
  MaterialLayout.prototype.drawerToggleHandler_ = function() {
    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
  };

  /**
   * Handles (un)setting the `is-animating` class
   *
   * @private
   */
  MaterialLayout.prototype.headerTransitionEndHandler_ = function() {
    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
  };

  /**
   * Handles expanding the header on click
   *
   * @private
   */
  MaterialLayout.prototype.headerClickHandler_ = function() {
    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
      this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
      this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
  };

  /**
   * Reset tab state, dropping active classes
   *
   * @private
   */
  MaterialLayout.prototype.resetTabState_ = function(tabBar) {
    for (var k = 0; k < tabBar.length; k++) {
      tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
   * Reset panel state, droping active classes
   *
   * @private
   */
  MaterialLayout.prototype.resetPanelState_ = function(panels) {
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
  };

  /**
   * Initialize element.
   */
  MaterialLayout.prototype.init = function() {
    if (this.element_) {
      var container = document.createElement('div');
      container.classList.add(this.CssClasses_.CONTAINER);
      this.element_.parentElement.insertBefore(container, this.element_);
      this.element_.parentElement.removeChild(this.element_);
      container.appendChild(this.element_);

      var directChildren = this.element_.childNodes;
      var numChildren = directChildren.length;
      for (var c = 0; c < numChildren; c++) {
        var child = directChildren[c];
        if (child.classList &&
            child.classList.contains(this.CssClasses_.HEADER)) {
          this.header_ = child;
        }

        if (child.classList &&
            child.classList.contains(this.CssClasses_.DRAWER)) {
          this.drawer_ = child;
        }

        if (child.classList &&
            child.classList.contains(this.CssClasses_.CONTENT)) {
          this.content_ = child;
        }
      }

      if (this.header_) {
        this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
      }

      var mode = this.Mode_.STANDARD;

      if (this.header_) {
        if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
          mode = this.Mode_.SEAMED;
        } else if (this.header_.classList.contains(
            this.CssClasses_.HEADER_WATERFALL)) {
          mode = this.Mode_.WATERFALL;
          this.header_.addEventListener('transitionend',
            this.headerTransitionEndHandler_.bind(this));
          this.header_.addEventListener('click',
            this.headerClickHandler_.bind(this));
        } else if (this.header_.classList.contains(
            this.CssClasses_.HEADER_SCROLL)) {
          mode = this.Mode_.SCROLL;
          container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
        }

        if (mode === this.Mode_.STANDARD) {
          this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
          this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          if (this.tabBar_) {
            this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
          }
        } else if (mode === this.Mode_.WATERFALL) {
          // Add and remove shadows depending on scroll position.
          // Also add/remove auxiliary class for styling of the compact version of
          // the header.
          this.content_.addEventListener('scroll',
              this.contentScrollHandler_.bind(this));
          this.contentScrollHandler_();
        }
      }

      // Add drawer toggling button to our layout, if we have an openable drawer.
      if (this.drawer_) {
        var drawerButton = this.element_.querySelector('.' +
          this.CssClasses_.DRAWER_BTN);
        if (!drawerButton) {
          drawerButton = document.createElement('div');
          drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);

          var drawerButtonIcon = document.createElement('i');
          drawerButtonIcon.classList.add(this.CssClasses_.ICON);
          drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
          drawerButton.appendChild(drawerButtonIcon);
        }

        if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
          //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
        } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
          //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
          drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
        }

        drawerButton.addEventListener('click',
            this.drawerToggleHandler_.bind(this));

        // Add a class if the layout has a drawer, for altering the left padding.
        // Adds the HAS_DRAWER to the elements since this.header_ may or may
        // not be present.
        this.element_.classList.add(this.CssClasses_.HAS_DRAWER);

        // If we have a fixed header, add the button to the header rather than
        // the layout.
        if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
          this.header_.insertBefore(drawerButton, this.header_.firstChild);
        } else {
          this.element_.insertBefore(drawerButton, this.content_);
        }

        var obfuscator = document.createElement('div');
        obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
        this.element_.appendChild(obfuscator);
        obfuscator.addEventListener('click',
            this.drawerToggleHandler_.bind(this));
        this.obfuscator_ = obfuscator;
      }

      // Keep an eye on screen size, and add/remove auxiliary class for styling
      // of small screens.
      this.screenSizeMediaQuery_ = window.matchMedia(
          /** @type {string} */ (this.Constant_.MAX_WIDTH));
      this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
      this.screenSizeHandler_();

      // Initialize tabs, if any.
      if (this.header_ && this.tabBar_) {
        this.element_.classList.add(this.CssClasses_.HAS_TABS);

        var tabContainer = document.createElement('div');
        tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
        this.header_.insertBefore(tabContainer, this.tabBar_);
        this.header_.removeChild(this.tabBar_);

        var leftButton = document.createElement('div');
        leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
        var leftButtonIcon = document.createElement('i');
        leftButtonIcon.classList.add(this.CssClasses_.ICON);
        leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
        leftButton.appendChild(leftButtonIcon);
        leftButton.addEventListener('click', function() {
          this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        var rightButton = document.createElement('div');
        rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
        rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
        var rightButtonIcon = document.createElement('i');
        rightButtonIcon.classList.add(this.CssClasses_.ICON);
        rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
        rightButton.appendChild(rightButtonIcon);
        rightButton.addEventListener('click', function() {
          this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
        }.bind(this));

        tabContainer.appendChild(leftButton);
        tabContainer.appendChild(this.tabBar_);
        tabContainer.appendChild(rightButton);

        // Add and remove buttons depending on scroll position.
        var tabScrollHandler = function() {
          if (this.tabBar_.scrollLeft > 0) {
            leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }

          if (this.tabBar_.scrollLeft <
              this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
            rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
          } else {
            rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
          }
        }.bind(this);

        this.tabBar_.addEventListener('scroll', tabScrollHandler);
        tabScrollHandler();

        if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
          this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
        }

        // Select element tabs, document panels
        var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
        var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);

        // Create new tabs for each tab element
        for (var i = 0; i < tabs.length; i++) {
          new MaterialLayoutTab(tabs[i], tabs, panels, this);
        }
      }

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Constructor for an individual tab.
   *
   * @constructor
   * @param {HTMLElement} tab The HTML element for the tab.
   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
   */
  function MaterialLayoutTab(tab, tabs, panels, layout) {

    /**
     * Auxiliary method to programmatically select a tab in the UI.
     */
    function selectTab() {
      var href = tab.href.split('#')[1];
      var panel = layout.content_.querySelector('#' + href);
      layout.resetTabState_(tabs);
      layout.resetPanelState_(panels);
      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
    }

    if (layout.tabBar_.classList.contains(
        layout.CssClasses_.JS_RIPPLE_EFFECT)) {
      var rippleContainer = document.createElement('span');
      rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
      rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
      var ripple = document.createElement('span');
      ripple.classList.add(layout.CssClasses_.RIPPLE);
      rippleContainer.appendChild(ripple);
      tab.appendChild(rippleContainer);
    }

    tab.addEventListener('click', function(e) {
      if (tab.getAttribute('href').charAt(0) === '#') {
        e.preventDefault();
        selectTab();
      }
    });

    tab.show = selectTab;

    tab.addEventListener('click', function(e) {
      e.preventDefault();
      var href = tab.href.split('#')[1];
      var panel = layout.content_.querySelector('#' + href);
      layout.resetTabState_(tabs);
      layout.resetPanelState_(panels);
      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
    });
  }
  window['MaterialLayoutTab'] = MaterialLayoutTab;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout'
  });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYXlvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgTGF5b3V0IE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbExheW91dCA9IGZ1bmN0aW9uIE1hdGVyaWFsTGF5b3V0KGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxMYXlvdXQnXSA9IE1hdGVyaWFsTGF5b3V0O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICBNQVhfV0lEVEg6ICcobWF4LXdpZHRoOiAxMDI0cHgpJyxcbiAgICBUQUJfU0NST0xMX1BJWEVMUzogMTAwLFxuXG4gICAgTUVOVV9JQ09OOiAnbWVudScsXG4gICAgQ0hFVlJPTl9MRUZUOiAnY2hldnJvbl9sZWZ0JyxcbiAgICBDSEVWUk9OX1JJR0hUOiAnY2hldnJvbl9yaWdodCdcbiAgfTtcblxuICAvKipcbiAgICogTW9kZXMuXG4gICAqXG4gICAqIEBlbnVtIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuTW9kZV8gPSB7XG4gICAgU1RBTkRBUkQ6IDAsXG4gICAgU0VBTUVEOiAxLFxuICAgIFdBVEVSRkFMTDogMixcbiAgICBTQ1JPTEw6IDNcbiAgfTtcblxuICAvKipcbiAgICogU3RvcmUgc3RyaW5ncyBmb3IgY2xhc3MgbmFtZXMgZGVmaW5lZCBieSB0aGlzIGNvbXBvbmVudCB0aGF0IGFyZSB1c2VkIGluXG4gICAqIEphdmFTY3JpcHQuIFRoaXMgYWxsb3dzIHVzIHRvIHNpbXBseSBjaGFuZ2UgaXQgaW4gb25lIHBsYWNlIHNob3VsZCB3ZVxuICAgKiBkZWNpZGUgdG8gbW9kaWZ5IGF0IGEgbGF0ZXIgZGF0ZS5cbiAgICpcbiAgICogQGVudW0ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5Dc3NDbGFzc2VzXyA9IHtcbiAgICBDT05UQUlORVI6ICdtZGwtbGF5b3V0X19jb250YWluZXInLFxuICAgIEhFQURFUjogJ21kbC1sYXlvdXRfX2hlYWRlcicsXG4gICAgRFJBV0VSOiAnbWRsLWxheW91dF9fZHJhd2VyJyxcbiAgICBDT05URU5UOiAnbWRsLWxheW91dF9fY29udGVudCcsXG4gICAgRFJBV0VSX0JUTjogJ21kbC1sYXlvdXRfX2RyYXdlci1idXR0b24nLFxuXG4gICAgSUNPTjogJ21hdGVyaWFsLWljb25zJyxcblxuICAgIEpTX1JJUFBMRV9FRkZFQ1Q6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgUklQUExFX0NPTlRBSU5FUjogJ21kbC1sYXlvdXRfX3RhYi1yaXBwbGUtY29udGFpbmVyJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICBSSVBQTEVfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcblxuICAgIEhFQURFUl9TRUFNRUQ6ICdtZGwtbGF5b3V0X19oZWFkZXItLXNlYW1lZCcsXG4gICAgSEVBREVSX1dBVEVSRkFMTDogJ21kbC1sYXlvdXRfX2hlYWRlci0td2F0ZXJmYWxsJyxcbiAgICBIRUFERVJfU0NST0xMOiAnbWRsLWxheW91dF9faGVhZGVyLS1zY3JvbGwnLFxuXG4gICAgRklYRURfSEVBREVSOiAnbWRsLWxheW91dC0tZml4ZWQtaGVhZGVyJyxcbiAgICBPQkZVU0NBVE9SOiAnbWRsLWxheW91dF9fb2JmdXNjYXRvcicsXG5cbiAgICBUQUJfQkFSOiAnbWRsLWxheW91dF9fdGFiLWJhcicsXG4gICAgVEFCX0NPTlRBSU5FUjogJ21kbC1sYXlvdXRfX3RhYi1iYXItY29udGFpbmVyJyxcbiAgICBUQUI6ICdtZGwtbGF5b3V0X190YWInLFxuICAgIFRBQl9CQVJfQlVUVE9OOiAnbWRsLWxheW91dF9fdGFiLWJhci1idXR0b24nLFxuICAgIFRBQl9CQVJfTEVGVF9CVVRUT046ICdtZGwtbGF5b3V0X190YWItYmFyLWxlZnQtYnV0dG9uJyxcbiAgICBUQUJfQkFSX1JJR0hUX0JVVFRPTjogJ21kbC1sYXlvdXRfX3RhYi1iYXItcmlnaHQtYnV0dG9uJyxcbiAgICBQQU5FTDogJ21kbC1sYXlvdXRfX3RhYi1wYW5lbCcsXG5cbiAgICBIQVNfRFJBV0VSOiAnaGFzLWRyYXdlcicsXG4gICAgSEFTX1RBQlM6ICdoYXMtdGFicycsXG4gICAgSEFTX1NDUk9MTElOR19IRUFERVI6ICdoYXMtc2Nyb2xsaW5nLWhlYWRlcicsXG4gICAgQ0FTVElOR19TSEFET1c6ICdpcy1jYXN0aW5nLXNoYWRvdycsXG4gICAgSVNfQ09NUEFDVDogJ2lzLWNvbXBhY3QnLFxuICAgIElTX1NNQUxMX1NDUkVFTjogJ2lzLXNtYWxsLXNjcmVlbicsXG4gICAgSVNfRFJBV0VSX09QRU46ICdpcy12aXNpYmxlJyxcbiAgICBJU19BQ1RJVkU6ICdpcy1hY3RpdmUnLFxuICAgIElTX1VQR1JBREVEOiAnaXMtdXBncmFkZWQnLFxuICAgIElTX0FOSU1BVElORzogJ2lzLWFuaW1hdGluZycsXG5cbiAgICBPTl9MQVJHRV9TQ1JFRU46ICdtZGwtbGF5b3V0LS1sYXJnZS1zY3JlZW4tb25seScsXG4gICAgT05fU01BTExfU0NSRUVOOiAnbWRsLWxheW91dC0tc21hbGwtc2NyZWVuLW9ubHknXG5cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBzY3JvbGxpbmcgb24gdGhlIGNvbnRlbnQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuY29udGVudFNjcm9sbEhhbmRsZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29udGVudF8uc2Nyb2xsVG9wID4gMCAmJlxuICAgICAgICAhdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpKSB7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkNBU1RJTkdfU0hBRE9XKTtcbiAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ09NUEFDVCk7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbnRlbnRfLnNjcm9sbFRvcCA8PSAwICYmXG4gICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5JU19DT01QQUNUKSkge1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5DQVNUSU5HX1NIQURPVyk7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0NPTVBBQ1QpO1xuICAgICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlcyBjaGFuZ2VzIGluIHNjcmVlbiBzaXplLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxMYXlvdXQucHJvdG90eXBlLnNjcmVlblNpemVIYW5kbGVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNjcmVlblNpemVNZWRpYVF1ZXJ5Xy5tYXRjaGVzKSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19TTUFMTF9TQ1JFRU4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19TTUFMTF9TQ1JFRU4pO1xuICAgICAgLy8gQ29sbGFwc2UgZHJhd2VyIChpZiBhbnkpIHdoZW4gbW92aW5nIHRvIGEgbGFyZ2Ugc2NyZWVuIHNpemUuXG4gICAgICBpZiAodGhpcy5kcmF3ZXJfKSB7XG4gICAgICAgIHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfRFJBV0VSX09QRU4pO1xuICAgICAgICB0aGlzLm9iZnVzY2F0b3JfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRvZ2dsaW5nIG9mIHRoZSBkcmF3ZXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuZHJhd2VyVG9nZ2xlSGFuZGxlcl8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRyYXdlcl8uY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLkNzc0NsYXNzZXNfLklTX0RSQVdFUl9PUEVOKTtcbiAgICB0aGlzLm9iZnVzY2F0b3JfLmNsYXNzTGlzdC50b2dnbGUodGhpcy5Dc3NDbGFzc2VzXy5JU19EUkFXRVJfT1BFTik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgKHVuKXNldHRpbmcgdGhlIGBpcy1hbmltYXRpbmdgIGNsYXNzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuaGVhZGVyVHJhbnNpdGlvbkVuZEhhbmRsZXJfID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGV4cGFuZGluZyB0aGUgaGVhZGVyIG9uIGNsaWNrXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUuaGVhZGVyQ2xpY2tIYW5kbGVyXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ09NUEFDVCkpIHtcbiAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQ09NUEFDVCk7XG4gICAgICB0aGlzLmhlYWRlcl8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNldCB0YWIgc3RhdGUsIGRyb3BwaW5nIGFjdGl2ZSBjbGFzc2VzXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXRlcmlhbExheW91dC5wcm90b3R5cGUucmVzZXRUYWJTdGF0ZV8gPSBmdW5jdGlvbih0YWJCYXIpIHtcbiAgICBmb3IgKHZhciBrID0gMDsgayA8IHRhYkJhci5sZW5ndGg7IGsrKykge1xuICAgICAgdGFiQmFyW2tdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVzZXQgcGFuZWwgc3RhdGUsIGRyb3BpbmcgYWN0aXZlIGNsYXNzZXNcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5yZXNldFBhbmVsU3RhdGVfID0gZnVuY3Rpb24ocGFuZWxzKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYW5lbHMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHBhbmVsc1tqXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZWxlbWVudC5cbiAgICovXG4gIE1hdGVyaWFsTGF5b3V0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudF8pIHtcbiAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ09OVEFJTkVSKTtcbiAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY29udGFpbmVyLCB0aGlzLmVsZW1lbnRfKTtcbiAgICAgIHRoaXMuZWxlbWVudF8ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRfKTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRfKTtcblxuICAgICAgdmFyIGRpcmVjdENoaWxkcmVuID0gdGhpcy5lbGVtZW50Xy5jaGlsZE5vZGVzO1xuICAgICAgdmFyIG51bUNoaWxkcmVuID0gZGlyZWN0Q2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBudW1DaGlsZHJlbjsgYysrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGRpcmVjdENoaWxkcmVuW2NdO1xuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5IRUFERVIpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJfID0gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5EUkFXRVIpKSB7XG4gICAgICAgICAgdGhpcy5kcmF3ZXJfID0gY2hpbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGQuY2xhc3NMaXN0ICYmXG4gICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5DT05URU5UKSkge1xuICAgICAgICAgIHRoaXMuY29udGVudF8gPSBjaGlsZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5oZWFkZXJfKSB7XG4gICAgICAgIHRoaXMudGFiQmFyXyA9IHRoaXMuaGVhZGVyXy5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuQ3NzQ2xhc3Nlc18uVEFCX0JBUik7XG4gICAgICB9XG5cbiAgICAgIHZhciBtb2RlID0gdGhpcy5Nb2RlXy5TVEFOREFSRDtcblxuICAgICAgaWYgKHRoaXMuaGVhZGVyXykge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkhFQURFUl9TRUFNRUQpKSB7XG4gICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uU0VBTUVEO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLkhFQURFUl9XQVRFUkZBTEwpKSB7XG4gICAgICAgICAgbW9kZSA9IHRoaXMuTW9kZV8uV0FURVJGQUxMO1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyVHJhbnNpdGlvbkVuZEhhbmRsZXJfLmJpbmQodGhpcykpO1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICB0aGlzLmhlYWRlckNsaWNrSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZWFkZXJfLmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uSEVBREVSX1NDUk9MTCkpIHtcbiAgICAgICAgICBtb2RlID0gdGhpcy5Nb2RlXy5TQ1JPTEw7XG4gICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5IQVNfU0NST0xMSU5HX0hFQURFUik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSA9PT0gdGhpcy5Nb2RlXy5TVEFOREFSRCkge1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSB0aGlzLk1vZGVfLlNFQU1FRCB8fCBtb2RlID09PSB0aGlzLk1vZGVfLlNDUk9MTCkge1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIGlmICh0aGlzLnRhYkJhcl8pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQmFyXy5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uQ0FTVElOR19TSEFET1cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSB0aGlzLk1vZGVfLldBVEVSRkFMTCkge1xuICAgICAgICAgIC8vIEFkZCBhbmQgcmVtb3ZlIHNoYWRvd3MgZGVwZW5kaW5nIG9uIHNjcm9sbCBwb3NpdGlvbi5cbiAgICAgICAgICAvLyBBbHNvIGFkZC9yZW1vdmUgYXV4aWxpYXJ5IGNsYXNzIGZvciBzdHlsaW5nIG9mIHRoZSBjb21wYWN0IHZlcnNpb24gb2ZcbiAgICAgICAgICAvLyB0aGUgaGVhZGVyLlxuICAgICAgICAgIHRoaXMuY29udGVudF8uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJyxcbiAgICAgICAgICAgICAgdGhpcy5jb250ZW50U2Nyb2xsSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgICAgdGhpcy5jb250ZW50U2Nyb2xsSGFuZGxlcl8oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBBZGQgZHJhd2VyIHRvZ2dsaW5nIGJ1dHRvbiB0byBvdXIgbGF5b3V0LCBpZiB3ZSBoYXZlIGFuIG9wZW5hYmxlIGRyYXdlci5cbiAgICAgIGlmICh0aGlzLmRyYXdlcl8pIHtcbiAgICAgICAgdmFyIGRyYXdlckJ1dHRvbiA9IHRoaXMuZWxlbWVudF8ucXVlcnlTZWxlY3RvcignLicgK1xuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uRFJBV0VSX0JUTik7XG4gICAgICAgIGlmICghZHJhd2VyQnV0dG9uKSB7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZHJhd2VyQnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5EUkFXRVJfQlROKTtcblxuICAgICAgICAgIHZhciBkcmF3ZXJCdXR0b25JY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbkljb24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklDT04pO1xuICAgICAgICAgIGRyYXdlckJ1dHRvbkljb24udGV4dENvbnRlbnQgPSB0aGlzLkNvbnN0YW50Xy5NRU5VX0lDT047XG4gICAgICAgICAgZHJhd2VyQnV0dG9uLmFwcGVuZENoaWxkKGRyYXdlckJ1dHRvbkljb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZHJhd2VyXy5jbGFzc0xpc3QuY29udGFpbnModGhpcy5Dc3NDbGFzc2VzXy5PTl9MQVJHRV9TQ1JFRU4pKSB7XG4gICAgICAgICAgLy9JZiBkcmF3ZXIgaGFzIE9OX0xBUkdFX1NDUkVFTiBjbGFzcyB0aGVuIGFkZCBpdCB0byB0aGUgZHJhd2VyIHRvZ2dsZSBidXR0b24gYXMgd2VsbC5cbiAgICAgICAgICBkcmF3ZXJCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLk9OX0xBUkdFX1NDUkVFTik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kcmF3ZXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLk9OX1NNQUxMX1NDUkVFTikpIHtcbiAgICAgICAgICAvL0lmIGRyYXdlciBoYXMgT05fU01BTExfU0NSRUVOIGNsYXNzIHRoZW4gYWRkIGl0IHRvIHRoZSBkcmF3ZXIgdG9nZ2xlIGJ1dHRvbiBhcyB3ZWxsLlxuICAgICAgICAgIGRyYXdlckJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uT05fU01BTExfU0NSRUVOKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICB0aGlzLmRyYXdlclRvZ2dsZUhhbmRsZXJfLmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIEFkZCBhIGNsYXNzIGlmIHRoZSBsYXlvdXQgaGFzIGEgZHJhd2VyLCBmb3IgYWx0ZXJpbmcgdGhlIGxlZnQgcGFkZGluZy5cbiAgICAgICAgLy8gQWRkcyB0aGUgSEFTX0RSQVdFUiB0byB0aGUgZWxlbWVudHMgc2luY2UgdGhpcy5oZWFkZXJfIG1heSBvciBtYXlcbiAgICAgICAgLy8gbm90IGJlIHByZXNlbnQuXG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkhBU19EUkFXRVIpO1xuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSBmaXhlZCBoZWFkZXIsIGFkZCB0aGUgYnV0dG9uIHRvIHRoZSBoZWFkZXIgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gdGhlIGxheW91dC5cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uRklYRURfSEVBREVSKSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVyXy5pbnNlcnRCZWZvcmUoZHJhd2VyQnV0dG9uLCB0aGlzLmhlYWRlcl8uZmlyc3RDaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50Xy5pbnNlcnRCZWZvcmUoZHJhd2VyQnV0dG9uLCB0aGlzLmNvbnRlbnRfKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvYmZ1c2NhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIG9iZnVzY2F0b3IuY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLk9CRlVTQ0FUT1IpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFwcGVuZENoaWxkKG9iZnVzY2F0b3IpO1xuICAgICAgICBvYmZ1c2NhdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgIHRoaXMuZHJhd2VyVG9nZ2xlSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMub2JmdXNjYXRvcl8gPSBvYmZ1c2NhdG9yO1xuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGFuIGV5ZSBvbiBzY3JlZW4gc2l6ZSwgYW5kIGFkZC9yZW1vdmUgYXV4aWxpYXJ5IGNsYXNzIGZvciBzdHlsaW5nXG4gICAgICAvLyBvZiBzbWFsbCBzY3JlZW5zLlxuICAgICAgdGhpcy5zY3JlZW5TaXplTWVkaWFRdWVyeV8gPSB3aW5kb3cubWF0Y2hNZWRpYShcbiAgICAgICAgICAvKiogQHR5cGUge3N0cmluZ30gKi8gKHRoaXMuQ29uc3RhbnRfLk1BWF9XSURUSCkpO1xuICAgICAgdGhpcy5zY3JlZW5TaXplTWVkaWFRdWVyeV8uYWRkTGlzdGVuZXIodGhpcy5zY3JlZW5TaXplSGFuZGxlcl8uYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNjcmVlblNpemVIYW5kbGVyXygpO1xuXG4gICAgICAvLyBJbml0aWFsaXplIHRhYnMsIGlmIGFueS5cbiAgICAgIGlmICh0aGlzLmhlYWRlcl8gJiYgdGhpcy50YWJCYXJfKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLkhBU19UQUJTKTtcblxuICAgICAgICB2YXIgdGFiQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRhYkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uVEFCX0NPTlRBSU5FUik7XG4gICAgICAgIHRoaXMuaGVhZGVyXy5pbnNlcnRCZWZvcmUodGFiQ29udGFpbmVyLCB0aGlzLnRhYkJhcl8pO1xuICAgICAgICB0aGlzLmhlYWRlcl8ucmVtb3ZlQ2hpbGQodGhpcy50YWJCYXJfKTtcblxuICAgICAgICB2YXIgbGVmdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsZWZ0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX0JVVFRPTik7XG4gICAgICAgIGxlZnRCdXR0b24uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLlRBQl9CQVJfTEVGVF9CVVRUT04pO1xuICAgICAgICB2YXIgbGVmdEJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIGxlZnRCdXR0b25JY29uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JQ09OKTtcbiAgICAgICAgbGVmdEJ1dHRvbkljb24udGV4dENvbnRlbnQgPSB0aGlzLkNvbnN0YW50Xy5DSEVWUk9OX0xFRlQ7XG4gICAgICAgIGxlZnRCdXR0b24uYXBwZW5kQ2hpbGQobGVmdEJ1dHRvbkljb24pO1xuICAgICAgICBsZWZ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLnNjcm9sbExlZnQgLT0gdGhpcy5Db25zdGFudF8uVEFCX1NDUk9MTF9QSVhFTFM7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdmFyIHJpZ2h0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX0JVVFRPTik7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5UQUJfQkFSX1JJR0hUX0JVVFRPTik7XG4gICAgICAgIHZhciByaWdodEJ1dHRvbkljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XG4gICAgICAgIHJpZ2h0QnV0dG9uSWNvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSUNPTik7XG4gICAgICAgIHJpZ2h0QnV0dG9uSWNvbi50ZXh0Q29udGVudCA9IHRoaXMuQ29uc3RhbnRfLkNIRVZST05fUklHSFQ7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmFwcGVuZENoaWxkKHJpZ2h0QnV0dG9uSWNvbik7XG4gICAgICAgIHJpZ2h0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLnNjcm9sbExlZnQgKz0gdGhpcy5Db25zdGFudF8uVEFCX1NDUk9MTF9QSVhFTFM7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZENoaWxkKGxlZnRCdXR0b24pO1xuICAgICAgICB0YWJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50YWJCYXJfKTtcbiAgICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0QnV0dG9uKTtcblxuICAgICAgICAvLyBBZGQgYW5kIHJlbW92ZSBidXR0b25zIGRlcGVuZGluZyBvbiBzY3JvbGwgcG9zaXRpb24uXG4gICAgICAgIHZhciB0YWJTY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHRoaXMudGFiQmFyXy5zY3JvbGxMZWZ0ID4gMCkge1xuICAgICAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVmdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy50YWJCYXJfLnNjcm9sbExlZnQgPFxuICAgICAgICAgICAgICB0aGlzLnRhYkJhcl8uc2Nyb2xsV2lkdGggLSB0aGlzLnRhYkJhcl8ub2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgICAgIHJpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByaWdodEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLnRhYkJhcl8uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGFiU2Nyb2xsSGFuZGxlcik7XG4gICAgICAgIHRhYlNjcm9sbEhhbmRsZXIoKTtcblxuICAgICAgICBpZiAodGhpcy50YWJCYXJfLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLkNzc0NsYXNzZXNfLkpTX1JJUFBMRV9FRkZFQ1QpKSB7XG4gICAgICAgICAgdGhpcy50YWJCYXJfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5SSVBQTEVfSUdOT1JFX0VWRU5UUyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZWxlY3QgZWxlbWVudCB0YWJzLCBkb2N1bWVudCBwYW5lbHNcbiAgICAgICAgdmFyIHRhYnMgPSB0aGlzLnRhYkJhcl8ucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLkNzc0NsYXNzZXNfLlRBQik7XG4gICAgICAgIHZhciBwYW5lbHMgPSB0aGlzLmNvbnRlbnRfLnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgdGhpcy5Dc3NDbGFzc2VzXy5QQU5FTCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5ldyB0YWJzIGZvciBlYWNoIHRhYiBlbGVtZW50XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG5ldyBNYXRlcmlhbExheW91dFRhYih0YWJzW2ldLCB0YWJzLCBwYW5lbHMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmFkZCh0aGlzLkNzc0NsYXNzZXNfLklTX1VQR1JBREVEKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhbiBpbmRpdmlkdWFsIHRhYi5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYiBUaGUgSFRNTCBlbGVtZW50IGZvciB0aGUgdGFiLlxuICAgKiBAcGFyYW0geyFBcnJheTxIVE1MRWxlbWVudD59IHRhYnMgQXJyYXkgd2l0aCBIVE1MIGVsZW1lbnRzIGZvciBhbGwgdGFicy5cbiAgICogQHBhcmFtIHshQXJyYXk8SFRNTEVsZW1lbnQ+fSBwYW5lbHMgQXJyYXkgd2l0aCBIVE1MIGVsZW1lbnRzIGZvciBhbGwgcGFuZWxzLlxuICAgKiBAcGFyYW0ge01hdGVyaWFsTGF5b3V0fSBsYXlvdXQgVGhlIE1hdGVyaWFsTGF5b3V0IG9iamVjdCB0aGF0IG93bnMgdGhlIHRhYi5cbiAgICovXG4gIGZ1bmN0aW9uIE1hdGVyaWFsTGF5b3V0VGFiKHRhYiwgdGFicywgcGFuZWxzLCBsYXlvdXQpIHtcblxuICAgIC8qKlxuICAgICAqIEF1eGlsaWFyeSBtZXRob2QgdG8gcHJvZ3JhbW1hdGljYWxseSBzZWxlY3QgYSB0YWIgaW4gdGhlIFVJLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNlbGVjdFRhYigpIHtcbiAgICAgIHZhciBocmVmID0gdGFiLmhyZWYuc3BsaXQoJyMnKVsxXTtcbiAgICAgIHZhciBwYW5lbCA9IGxheW91dC5jb250ZW50Xy5xdWVyeVNlbGVjdG9yKCcjJyArIGhyZWYpO1xuICAgICAgbGF5b3V0LnJlc2V0VGFiU3RhdGVfKHRhYnMpO1xuICAgICAgbGF5b3V0LnJlc2V0UGFuZWxTdGF0ZV8ocGFuZWxzKTtcbiAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgICAgcGFuZWwuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uSVNfQUNUSVZFKTtcbiAgICB9XG5cbiAgICBpZiAobGF5b3V0LnRhYkJhcl8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICBsYXlvdXQuQ3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCkpIHtcbiAgICAgIHZhciByaXBwbGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uUklQUExFX0NPTlRBSU5FUik7XG4gICAgICByaXBwbGVDb250YWluZXIuY2xhc3NMaXN0LmFkZChsYXlvdXQuQ3NzQ2xhc3Nlc18uSlNfUklQUExFX0VGRkVDVCk7XG4gICAgICB2YXIgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQobGF5b3V0LkNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICByaXBwbGVDb250YWluZXIuYXBwZW5kQ2hpbGQocmlwcGxlKTtcbiAgICAgIHRhYi5hcHBlbmRDaGlsZChyaXBwbGVDb250YWluZXIpO1xuICAgIH1cblxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmICh0YWIuZ2V0QXR0cmlidXRlKCdocmVmJykuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWxlY3RUYWIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRhYi5zaG93ID0gc2VsZWN0VGFiO1xuXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGhyZWYgPSB0YWIuaHJlZi5zcGxpdCgnIycpWzFdO1xuICAgICAgdmFyIHBhbmVsID0gbGF5b3V0LmNvbnRlbnRfLnF1ZXJ5U2VsZWN0b3IoJyMnICsgaHJlZik7XG4gICAgICBsYXlvdXQucmVzZXRUYWJTdGF0ZV8odGFicyk7XG4gICAgICBsYXlvdXQucmVzZXRQYW5lbFN0YXRlXyhwYW5lbHMpO1xuICAgICAgdGFiLmNsYXNzTGlzdC5hZGQobGF5b3V0LkNzc0NsYXNzZXNfLklTX0FDVElWRSk7XG4gICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKGxheW91dC5Dc3NDbGFzc2VzXy5JU19BQ1RJVkUpO1xuICAgIH0pO1xuICB9XG4gIHdpbmRvd1snTWF0ZXJpYWxMYXlvdXRUYWInXSA9IE1hdGVyaWFsTGF5b3V0VGFiO1xuXG4gIC8vIFRoZSBjb21wb25lbnQgcmVnaXN0ZXJzIGl0c2VsZi4gSXQgY2FuIGFzc3VtZSBjb21wb25lbnRIYW5kbGVyIGlzIGF2YWlsYWJsZVxuICAvLyBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICBjb21wb25lbnRIYW5kbGVyLnJlZ2lzdGVyKHtcbiAgICBjb25zdHJ1Y3RvcjogTWF0ZXJpYWxMYXlvdXQsXG4gICAgY2xhc3NBc1N0cmluZzogJ01hdGVyaWFsTGF5b3V0JyxcbiAgICBjc3NDbGFzczogJ21kbC1qcy1sYXlvdXQnXG4gIH0pO1xufSkoKTtcbiJdLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

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
   * Class constructor for Ripple MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var MaterialRipple = function MaterialRipple(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['MaterialRipple'] = MaterialRipple;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  MaterialRipple.prototype.Constant_ = {
    INITIAL_SCALE: 'scale(0.0001, 0.0001)',
    INITIAL_SIZE: '1px',
    INITIAL_OPACITY: '0.4',
    FINAL_OPACITY: '0',
    FINAL_SCALE: ''
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialRipple.prototype.CssClasses_ = {
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    IS_ANIMATING: 'is-animating',
    IS_VISIBLE: 'is-visible'
  };

  /**
   * Handle mouse / finger down on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialRipple.prototype.downHandler_ = function(event) {
    if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
      var rect = this.element_.getBoundingClientRect();
      this.boundHeight = rect.height;
      this.boundWidth = rect.width;
      this.rippleSize_ = Math.sqrt(rect.width * rect.width +
          rect.height * rect.height) * 2 + 2;
      this.rippleElement_.style.width = this.rippleSize_ + 'px';
      this.rippleElement_.style.height = this.rippleSize_ + 'px';
    }

    this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);

    if (event.type === 'mousedown' && this.ignoringMouseDown_) {
      this.ignoringMouseDown_ = false;
    } else {
      if (event.type === 'touchstart') {
        this.ignoringMouseDown_ = true;
      }
      var frameCount = this.getFrameCount();
      if (frameCount > 0) {
        return;
      }
      this.setFrameCount(1);
      var bound = event.currentTarget.getBoundingClientRect();
      var x;
      var y;
      // Check if we are handling a keyboard click.
      if (event.clientX === 0 && event.clientY === 0) {
        x = Math.round(bound.width / 2);
        y = Math.round(bound.height / 2);
      } else {
        var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
        var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
        x = Math.round(clientX - bound.left);
        y = Math.round(clientY - bound.top);
      }
      this.setRippleXY(x, y);
      this.setRippleStyles(true);
      window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
  };

  /**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  MaterialRipple.prototype.upHandler_ = function(event) {
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
      this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function() {
      this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
    }.bind(this), 0);
  };

  /**
   * Initialize element.
   */
  MaterialRipple.prototype.init = function() {
    if (this.element_) {
      var recentering =
          this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
      if (!this.element_.classList.contains(
          this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
        this.rippleElement_ = this.element_.querySelector('.' +
            this.CssClasses_.RIPPLE);
        this.frameCount_ = 0;
        this.rippleSize_ = 0;
        this.x_ = 0;
        this.y_ = 0;

        // Touch start produces a compat mouse down event, which would cause a
        // second ripples. To avoid that, we use this property to ignore the first
        // mouse down after a touch start.
        this.ignoringMouseDown_ = false;

        this.boundDownHandler = this.downHandler_.bind(this);
        this.element_.addEventListener('mousedown',
          this.boundDownHandler);
        this.element_.addEventListener('touchstart',
            this.boundDownHandler);

        this.boundUpHandler = this.upHandler_.bind(this);
        this.element_.addEventListener('mouseup', this.boundUpHandler);
        this.element_.addEventListener('mouseleave', this.boundUpHandler);
        this.element_.addEventListener('touchend', this.boundUpHandler);
        this.element_.addEventListener('blur', this.boundUpHandler);

        /**
         * Getter for frameCount_.
         * @return {number} the frame count.
         */
        this.getFrameCount = function() {
          return this.frameCount_;
        };

        /**
         * Setter for frameCount_.
         * @param {number} fC the frame count.
         */
        this.setFrameCount = function(fC) {
          this.frameCount_ = fC;
        };

        /**
         * Getter for rippleElement_.
         * @return {Element} the ripple element.
         */
        this.getRippleElement = function() {
          return this.rippleElement_;
        };

        /**
         * Sets the ripple X and Y coordinates.
         * @param  {number} newX the new X coordinate
         * @param  {number} newY the new Y coordinate
         */
        this.setRippleXY = function(newX, newY) {
          this.x_ = newX;
          this.y_ = newY;
        };

        /**
         * Sets the ripple styles.
         * @param  {boolean} start whether or not this is the start frame.
         */
        this.setRippleStyles = function(start) {
          if (this.rippleElement_ !== null) {
            var transformString;
            var scale;
            var size;
            var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

            if (start) {
              scale = this.Constant_.INITIAL_SCALE;
              size = this.Constant_.INITIAL_SIZE;
            } else {
              scale = this.Constant_.FINAL_SCALE;
              size = this.rippleSize_ + 'px';
              if (recentering) {
                offset = 'translate(' + this.boundWidth / 2 + 'px, ' +
                  this.boundHeight / 2 + 'px)';
              }
            }

            transformString = 'translate(-50%, -50%) ' + offset + scale;

            this.rippleElement_.style.webkitTransform = transformString;
            this.rippleElement_.style.msTransform = transformString;
            this.rippleElement_.style.transform = transformString;

            if (start) {
              this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
            } else {
              this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
            }
          }
        };

        /**
         * Handles an animation frame.
         */
        this.animFrameHandler = function() {
          if (this.frameCount_-- > 0) {
            window.requestAnimationFrame(this.animFrameHandler.bind(this));
          } else {
            this.setRippleStyles(false);
          }
        };
      }
    }
  };

  /**
   * Downgrade the component
   *
   * @private
   */
  MaterialRipple.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('mousedown',
    this.boundDownHandler);
    this.element_.removeEventListener('touchstart',
        this.boundDownHandler);

    this.element_.removeEventListener('mouseup', this.boundUpHandler);
    this.element_.removeEventListener('mouseleave', this.boundUpHandler);
    this.element_.removeEventListener('touchend', this.boundUpHandler);
    this.element_.removeEventListener('blur', this.boundUpHandler);
  };

  /**
   * Public alias for the downgrade method.
   *
   * @public
   */
  MaterialRipple.prototype.mdlDowngrade =
      MaterialRipple.prototype.mdlDowngrade_;

  MaterialRipple.prototype['mdlDowngrade'] =
      MaterialRipple.prototype.mdlDowngrade;

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: MaterialRipple,
    classAsString: 'MaterialRipple',
    cssClass: 'mdl-js-ripple-effect',
    widget: false
  });
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyaXBwbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDbGFzcyBjb25zdHJ1Y3RvciBmb3IgUmlwcGxlIE1ETCBjb21wb25lbnQuXG4gICAqIEltcGxlbWVudHMgTURMIGNvbXBvbmVudCBkZXNpZ24gcGF0dGVybiBkZWZpbmVkIGF0OlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vamFzb25tYXllcy9tZGwtY29tcG9uZW50LWRlc2lnbi1wYXR0ZXJuXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRoYXQgd2lsbCBiZSB1cGdyYWRlZC5cbiAgICovXG4gIHZhciBNYXRlcmlhbFJpcHBsZSA9IGZ1bmN0aW9uIE1hdGVyaWFsUmlwcGxlKGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnRfID0gZWxlbWVudDtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2UuXG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG4gIHdpbmRvd1snTWF0ZXJpYWxSaXBwbGUnXSA9IE1hdGVyaWFsUmlwcGxlO1xuXG4gIC8qKlxuICAgKiBTdG9yZSBjb25zdGFudHMgaW4gb25lIHBsYWNlIHNvIHRoZXkgY2FuIGJlIHVwZGF0ZWQgZWFzaWx5LlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nIHwgbnVtYmVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSaXBwbGUucHJvdG90eXBlLkNvbnN0YW50XyA9IHtcbiAgICBJTklUSUFMX1NDQUxFOiAnc2NhbGUoMC4wMDAxLCAwLjAwMDEpJyxcbiAgICBJTklUSUFMX1NJWkU6ICcxcHgnLFxuICAgIElOSVRJQUxfT1BBQ0lUWTogJzAuNCcsXG4gICAgRklOQUxfT1BBQ0lUWTogJzAnLFxuICAgIEZJTkFMX1NDQUxFOiAnJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdG9yZSBzdHJpbmdzIGZvciBjbGFzcyBuYW1lcyBkZWZpbmVkIGJ5IHRoaXMgY29tcG9uZW50IHRoYXQgYXJlIHVzZWQgaW5cbiAgICogSmF2YVNjcmlwdC4gVGhpcyBhbGxvd3MgdXMgdG8gc2ltcGx5IGNoYW5nZSBpdCBpbiBvbmUgcGxhY2Ugc2hvdWxkIHdlXG4gICAqIGRlY2lkZSB0byBtb2RpZnkgYXQgYSBsYXRlciBkYXRlLlxuICAgKlxuICAgKiBAZW51bSB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSaXBwbGUucHJvdG90eXBlLkNzc0NsYXNzZXNfID0ge1xuICAgIFJJUFBMRV9DRU5URVI6ICdtZGwtcmlwcGxlLS1jZW50ZXInLFxuICAgIFJJUFBMRV9FRkZFQ1RfSUdOT1JFX0VWRU5UUzogJ21kbC1qcy1yaXBwbGUtZWZmZWN0LS1pZ25vcmUtZXZlbnRzJyxcbiAgICBSSVBQTEU6ICdtZGwtcmlwcGxlJyxcbiAgICBJU19BTklNQVRJTkc6ICdpcy1hbmltYXRpbmcnLFxuICAgIElTX1ZJU0lCTEU6ICdpcy12aXNpYmxlJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBIYW5kbGUgbW91c2UgLyBmaW5nZXIgZG93biBvbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBUaGUgZXZlbnQgdGhhdCBmaXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hdGVyaWFsUmlwcGxlLnByb3RvdHlwZS5kb3duSGFuZGxlcl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmICghdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS53aWR0aCAmJiAhdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS5oZWlnaHQpIHtcbiAgICAgIHZhciByZWN0ID0gdGhpcy5lbGVtZW50Xy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMuYm91bmRIZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICAgIHRoaXMuYm91bmRXaWR0aCA9IHJlY3Qud2lkdGg7XG4gICAgICB0aGlzLnJpcHBsZVNpemVfID0gTWF0aC5zcXJ0KHJlY3Qud2lkdGggKiByZWN0LndpZHRoICtcbiAgICAgICAgICByZWN0LmhlaWdodCAqIHJlY3QuaGVpZ2h0KSAqIDIgKyAyO1xuICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS53aWR0aCA9IHRoaXMucmlwcGxlU2l6ZV8gKyAncHgnO1xuICAgICAgdGhpcy5yaXBwbGVFbGVtZW50Xy5zdHlsZS5oZWlnaHQgPSB0aGlzLnJpcHBsZVNpemVfICsgJ3B4JztcbiAgICB9XG5cbiAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKTtcblxuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiB0aGlzLmlnbm9yaW5nTW91c2VEb3duXykge1xuICAgICAgdGhpcy5pZ25vcmluZ01vdXNlRG93bl8gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICB0aGlzLmlnbm9yaW5nTW91c2VEb3duXyA9IHRydWU7XG4gICAgICB9XG4gICAgICB2YXIgZnJhbWVDb3VudCA9IHRoaXMuZ2V0RnJhbWVDb3VudCgpO1xuICAgICAgaWYgKGZyYW1lQ291bnQgPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RnJhbWVDb3VudCgxKTtcbiAgICAgIHZhciBib3VuZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgeDtcbiAgICAgIHZhciB5O1xuICAgICAgLy8gQ2hlY2sgaWYgd2UgYXJlIGhhbmRsaW5nIGEga2V5Ym9hcmQgY2xpY2suXG4gICAgICBpZiAoZXZlbnQuY2xpZW50WCA9PT0gMCAmJiBldmVudC5jbGllbnRZID09PSAwKSB7XG4gICAgICAgIHggPSBNYXRoLnJvdW5kKGJvdW5kLndpZHRoIC8gMik7XG4gICAgICAgIHkgPSBNYXRoLnJvdW5kKGJvdW5kLmhlaWdodCAvIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNsaWVudFggPSBldmVudC5jbGllbnRYID8gZXZlbnQuY2xpZW50WCA6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdmFyIGNsaWVudFkgPSBldmVudC5jbGllbnRZID8gZXZlbnQuY2xpZW50WSA6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgeCA9IE1hdGgucm91bmQoY2xpZW50WCAtIGJvdW5kLmxlZnQpO1xuICAgICAgICB5ID0gTWF0aC5yb3VuZChjbGllbnRZIC0gYm91bmQudG9wKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0UmlwcGxlWFkoeCwgeSk7XG4gICAgICB0aGlzLnNldFJpcHBsZVN0eWxlcyh0cnVlKTtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5hbmltRnJhbWVIYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGFuZGxlIG1vdXNlIC8gZmluZ2VyIHVwIG9uIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBldmVudCB0aGF0IGZpcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSaXBwbGUucHJvdG90eXBlLnVwSGFuZGxlcl8gPSBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIERvbid0IGZpcmUgZm9yIHRoZSBhcnRpZmljaWFsIFwibW91c2V1cFwiIGdlbmVyYXRlZCBieSBhIGRvdWJsZS1jbGljay5cbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQuZGV0YWlsICE9PSAyKSB7XG4gICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKTtcbiAgICB9XG4gICAgLy8gQWxsb3cgYSByZXBhaW50IHRvIG9jY3VyIGJlZm9yZSByZW1vdmluZyB0aGlzIGNsYXNzLCBzbyB0aGUgYW5pbWF0aW9uXG4gICAgLy8gc2hvd3MgZm9yIHRhcCBldmVudHMsIHdoaWNoIHNlZW0gdG8gdHJpZ2dlciBhIG1vdXNldXAgdG9vIHNvb24gYWZ0ZXJcbiAgICAvLyBtb3VzZWRvd24uXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5Dc3NDbGFzc2VzXy5JU19WSVNJQkxFKTtcbiAgICB9LmJpbmQodGhpcyksIDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGVsZW1lbnQuXG4gICAqL1xuICBNYXRlcmlhbFJpcHBsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnRfKSB7XG4gICAgICB2YXIgcmVjZW50ZXJpbmcgPVxuICAgICAgICAgIHRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0NFTlRFUik7XG4gICAgICBpZiAoIXRoaXMuZWxlbWVudF8uY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgIHRoaXMuQ3NzQ2xhc3Nlc18uUklQUExFX0VGRkVDVF9JR05PUkVfRVZFTlRTKSkge1xuICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfID0gdGhpcy5lbGVtZW50Xy5xdWVyeVNlbGVjdG9yKCcuJyArXG4gICAgICAgICAgICB0aGlzLkNzc0NsYXNzZXNfLlJJUFBMRSk7XG4gICAgICAgIHRoaXMuZnJhbWVDb3VudF8gPSAwO1xuICAgICAgICB0aGlzLnJpcHBsZVNpemVfID0gMDtcbiAgICAgICAgdGhpcy54XyA9IDA7XG4gICAgICAgIHRoaXMueV8gPSAwO1xuXG4gICAgICAgIC8vIFRvdWNoIHN0YXJ0IHByb2R1Y2VzIGEgY29tcGF0IG1vdXNlIGRvd24gZXZlbnQsIHdoaWNoIHdvdWxkIGNhdXNlIGFcbiAgICAgICAgLy8gc2Vjb25kIHJpcHBsZXMuIFRvIGF2b2lkIHRoYXQsIHdlIHVzZSB0aGlzIHByb3BlcnR5IHRvIGlnbm9yZSB0aGUgZmlyc3RcbiAgICAgICAgLy8gbW91c2UgZG93biBhZnRlciBhIHRvdWNoIHN0YXJ0LlxuICAgICAgICB0aGlzLmlnbm9yaW5nTW91c2VEb3duXyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYm91bmREb3duSGFuZGxlciA9IHRoaXMuZG93bkhhbmRsZXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxcbiAgICAgICAgICB0aGlzLmJvdW5kRG93bkhhbmRsZXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLFxuICAgICAgICAgICAgdGhpcy5ib3VuZERvd25IYW5kbGVyKTtcblxuICAgICAgICB0aGlzLmJvdW5kVXBIYW5kbGVyID0gdGhpcy51cEhhbmRsZXJfLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZWxlbWVudF8uYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLmJvdW5kVXBIYW5kbGVyKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Xy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICAgICAgICB0aGlzLmVsZW1lbnRfLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJvdW5kVXBIYW5kbGVyKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0dGVyIGZvciBmcmFtZUNvdW50Xy5cbiAgICAgICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgZnJhbWUgY291bnQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldEZyYW1lQ291bnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mcmFtZUNvdW50XztcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0dGVyIGZvciBmcmFtZUNvdW50Xy5cbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGZDIHRoZSBmcmFtZSBjb3VudC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0RnJhbWVDb3VudCA9IGZ1bmN0aW9uKGZDKSB7XG4gICAgICAgICAgdGhpcy5mcmFtZUNvdW50XyA9IGZDO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXR0ZXIgZm9yIHJpcHBsZUVsZW1lbnRfLlxuICAgICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fSB0aGUgcmlwcGxlIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldFJpcHBsZUVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yaXBwbGVFbGVtZW50XztcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgcmlwcGxlIFggYW5kIFkgY29vcmRpbmF0ZXMuXG4gICAgICAgICAqIEBwYXJhbSAge251bWJlcn0gbmV3WCB0aGUgbmV3IFggY29vcmRpbmF0ZVxuICAgICAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IG5ld1kgdGhlIG5ldyBZIGNvb3JkaW5hdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0UmlwcGxlWFkgPSBmdW5jdGlvbihuZXdYLCBuZXdZKSB7XG4gICAgICAgICAgdGhpcy54XyA9IG5ld1g7XG4gICAgICAgICAgdGhpcy55XyA9IG5ld1k7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIHJpcHBsZSBzdHlsZXMuXG4gICAgICAgICAqIEBwYXJhbSAge2Jvb2xlYW59IHN0YXJ0IHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgdGhlIHN0YXJ0IGZyYW1lLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zZXRSaXBwbGVTdHlsZXMgPSBmdW5jdGlvbihzdGFydCkge1xuICAgICAgICAgIGlmICh0aGlzLnJpcHBsZUVsZW1lbnRfICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgICAgdmFyIHNjYWxlO1xuICAgICAgICAgICAgdmFyIHNpemU7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJ3RyYW5zbGF0ZSgnICsgdGhpcy54XyArICdweCwgJyArIHRoaXMueV8gKyAncHgpJztcblxuICAgICAgICAgICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICAgIHNjYWxlID0gdGhpcy5Db25zdGFudF8uSU5JVElBTF9TQ0FMRTtcbiAgICAgICAgICAgICAgc2l6ZSA9IHRoaXMuQ29uc3RhbnRfLklOSVRJQUxfU0laRTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNjYWxlID0gdGhpcy5Db25zdGFudF8uRklOQUxfU0NBTEU7XG4gICAgICAgICAgICAgIHNpemUgPSB0aGlzLnJpcHBsZVNpemVfICsgJ3B4JztcbiAgICAgICAgICAgICAgaWYgKHJlY2VudGVyaW5nKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gJ3RyYW5zbGF0ZSgnICsgdGhpcy5ib3VuZFdpZHRoIC8gMiArICdweCwgJyArXG4gICAgICAgICAgICAgICAgICB0aGlzLmJvdW5kSGVpZ2h0IC8gMiArICdweCknO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSkgJyArIG9mZnNldCArIHNjYWxlO1xuXG4gICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcbiAgICAgICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uc3R5bGUubXNUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcblxuICAgICAgICAgICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMucmlwcGxlRWxlbWVudF8uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLkNzc0NsYXNzZXNfLklTX0FOSU1BVElORyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnJpcHBsZUVsZW1lbnRfLmNsYXNzTGlzdC5hZGQodGhpcy5Dc3NDbGFzc2VzXy5JU19BTklNQVRJTkcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBhbiBhbmltYXRpb24gZnJhbWUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFuaW1GcmFtZUhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodGhpcy5mcmFtZUNvdW50Xy0tID4gMCkge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1GcmFtZUhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UmlwcGxlU3R5bGVzKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEb3duZ3JhZGUgdGhlIGNvbXBvbmVudFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWF0ZXJpYWxSaXBwbGUucHJvdG90eXBlLm1kbERvd25ncmFkZV8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnRfLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsXG4gICAgdGhpcy5ib3VuZERvd25IYW5kbGVyKTtcbiAgICB0aGlzLmVsZW1lbnRfLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLFxuICAgICAgICB0aGlzLmJvdW5kRG93bkhhbmRsZXIpO1xuXG4gICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5ib3VuZFVwSGFuZGxlcik7XG4gICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5ib3VuZFVwSGFuZGxlcik7XG4gICAgdGhpcy5lbGVtZW50Xy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICAgIHRoaXMuZWxlbWVudF8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYm91bmRVcEhhbmRsZXIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgYWxpYXMgZm9yIHRoZSBkb3duZ3JhZGUgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBNYXRlcmlhbFJpcHBsZS5wcm90b3R5cGUubWRsRG93bmdyYWRlID1cbiAgICAgIE1hdGVyaWFsUmlwcGxlLnByb3RvdHlwZS5tZGxEb3duZ3JhZGVfO1xuXG4gIE1hdGVyaWFsUmlwcGxlLnByb3RvdHlwZVsnbWRsRG93bmdyYWRlJ10gPVxuICAgICAgTWF0ZXJpYWxSaXBwbGUucHJvdG90eXBlLm1kbERvd25ncmFkZTtcblxuICAvLyBUaGUgY29tcG9uZW50IHJlZ2lzdGVycyBpdHNlbGYuIEl0IGNhbiBhc3N1bWUgY29tcG9uZW50SGFuZGxlciBpcyBhdmFpbGFibGVcbiAgLy8gaW4gdGhlIGdsb2JhbCBzY29wZS5cbiAgY29tcG9uZW50SGFuZGxlci5yZWdpc3Rlcih7XG4gICAgY29uc3RydWN0b3I6IE1hdGVyaWFsUmlwcGxlLFxuICAgIGNsYXNzQXNTdHJpbmc6ICdNYXRlcmlhbFJpcHBsZScsXG4gICAgY3NzQ2xhc3M6ICdtZGwtanMtcmlwcGxlLWVmZmVjdCcsXG4gICAgd2lkZ2V0OiBmYWxzZVxuICB9KTtcbn0pKCk7XG4iXSwiZmlsZSI6InJpcHBsZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
