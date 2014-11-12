/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Bindux.
	 *
	 * (c) Nicolas Tallefourtane <dev@nicolab.net>
	 *
	 * For the full copyright and license information, please view the LICENSE
	 * file distributed with this source code or visit http://bindux.com.
	 */

	"use strict";

	// load controller
	__webpack_require__(1);

	ux.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Bindux.
	 *
	 * (c) Nicolas Tallefourtane <dev@nicolab.net>
	 *
	 * For the full copyright and license information, please view the LICENSE
	 * file distributed with this source code or visit http://bindux.com.
	 */

	"use strict";

	var $, cases, initUt;

	$ = bindux.dom;

	cases = ["/cases/binders/index.html", "/cases/color/index.html",
	//'/cases/dom/index.html',
	"/cases/expr/index.html", "/cases/filters/index.html", "/cases/html/index.html", "/cases/is/index.html", "/cases/nodemap/index.html", "/cases/util/index.html"];

	initUt = function (scope, el) {
	  scope.assertions = 0;
	  scope.failures = 0;
	  scope.passes = 0;
	  scope.reports = [];
	  scope.current = "";
	  scope.nextAuto = 0;

	  scope.pluralize = function (num, txt) {
	    return num > 1 ? txt + "s" : txt;
	  };

	  scope.status = function () {
	    return "\n      <div class=\"pull-left\">\n        Test cases: " + scope.failures + " " + scope.pluralize(scope.failures, "failure") + "\n        " + scope.reportIssue() + "\n        - " + scope.passes + " " + scope.pluralize(scope.passes, "passe") + "\n      </div>\n\n      <div class=\"pull-right\">\n        Validations: " + scope.assertions + " " + scope.pluralize(scope.assertions, "assertion") + "\n      </div>\n      <div class=\"clearfix\"></div>\n    ";
	  };

	  scope.reportIssue = function () {
	    if (!scope.failures) {
	      return "";
	    }

	    return "(please, <a\n      href=\"https://github.com/unitjs/unit.js/issues/new?title=[UT report]%20&body=Hello,%0D%0A%0D%0Athe unit test failed with%0D%0A  * Bindux version:%20(version)%0D%0A  * browser:%20(name)%0D%0A  * version:%20(version)\"\n    title=\"Quick report on Github\">report the failure</a>!)";
	  };

	};


	/**
	 * Unit tests controllers
	 *
	 * @param {object} scope
	 * @param {Element} el
	 */
	ux.ctrls.ut = function (scope, el) {
	  var fNode, rpNode, rp, utNext, nNode;

	  initUt(scope, el);

	  fNode = $("#ut-frame").get();
	  nNode = $("#ut-next").get();
	  rp = $("#ut-replay");
	  rpNode = rp.get();

	  rp.hide();

	  scope.utNext = function () {
	    if (cases.length && !scope.failures) {
	      fNode.src = cases.shift();

	      if (scope.nextAuto && rpNode.style.display !== "none") {
	        rp.hide();
	      } else if (!scope.nextAuto && rpNode.style.display === "none") {
	        rp.show();
	      }
	    } else if (!scope.failures) {
	      scope.current = "finish!";

	      if (rpNode.style.display === "none") {
	        rp.hide();
	      }
	    } else if (scope.failures) {
	      rp.show();
	    }
	  };

	  scope.utReplay = function () {
	    fNode.contentWindow.location.reload(true);
	  };

	  ux.on("ut.case.end", function () {
	    if (scope.nextAuto) {
	      scope.utNext();
	    }
	  });

	  scope.onCheckNextAuto = function (e) {
	    nNode.disabled = scope.nextAuto = e.target.checked;

	    if (scope.nextAuto) {
	      scope.utNext();
	      nNode.innerHTML = "Run";
	    } else {
	      nNode.innerHTML = "Next";
	    }
	  };
	};

/***/ }
/******/ ])