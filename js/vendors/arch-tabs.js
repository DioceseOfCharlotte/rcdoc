document.addEventListener('click', delegate(tabHeaderCheck, tabSwitch));

function delegate(criteria, handler) {
  return function (e) {
    var elem = e.target;
    do {
      if (!criteria(elem)) {
        continue;
      }
      e.delegateTarget = elem;
      handler.call(this, e);
      return;
    } while ((elem = elem.parentNode))
  }
}

function tabHeaderCheck(elem) {
  return (elem instanceof HTMLElement) && elem.matches('.tab-header');
}

function tabSwitch(e) {
  var elem = e.delegateTarget;
  var tabHeaders = [].slice.call(elem.parentNode.children);
  var tabIndex = parseInt(elem.dataset.index, 10);
  var tabContents = [].slice.call(document.getElementsByClassName('tab-content'));

  // Set Tab header active
  tabHeaders.forEach(function (el, index) {
    if (index !== tabIndex) {
      el.classList.remove('is-active');
    } else {
      if (!el.classList.contains('is-active')) {
        el.classList.add('is-active');
      }
    }
	if (tabIndex[0]) {
      tabIndex[0].classList.toggle('is-active');
    }
  });

  // Set corresponding tab content to be visible
  tabContents.forEach(function (el, index) {
    if (index !== tabIndex) {
      el.classList.remove('is-active');
    } else {
      el.classList.add('is-active');
    }
  });
}

//(function() {
var tabTab = document.getElementsByClassName('tab-header');
var tabPane = document.getElementsByClassName('tab-content');


if (tabTab.length != 0) {
    tabTab[0].classList.toggle('is-active');
    tabPane[0].classList.toggle('is-active');
}
//});
