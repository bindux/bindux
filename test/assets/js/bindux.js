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

	var ux, Evemit;

	Evemit = __webpack_require__(11);


	/**
	 * @constructor
	 */
	function Bindux() {
	  Evemit.call(this);
	}

	Bindux.prototype = Object.create(Evemit.prototype, {
	  constructor: { value: Bindux }
	});

	ux = new Bindux();

	ux.opt = {
	  binder: {
	    prefix: "n-"
	  }
	};

	ux.scopes = {};
	ux.ctrls = {};

	ux.binderAttr = function (name) {
	  return ux.opt.binder.prefix + name;
	};

	ux.noConflict = function () {
	  delete window.ux;
	  delete window.bindux;
	  return ux;
	};

	// load API
	__webpack_require__(1)(ux);
	__webpack_require__(2)(ux);
	__webpack_require__(3)(ux);
	__webpack_require__(4)(ux);
	__webpack_require__(5)(ux);
	__webpack_require__(6)(ux);
	__webpack_require__(7)(ux);
	__webpack_require__(8)(ux);
	__webpack_require__(9)(ux);
	__webpack_require__(10)(ux);

	module.exports = window.ux = window.bindux = ux;

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

	module.exports = function (ux) {
	  ux.is = {
	    undef: function (value) {
	      return value === void 0;
	    },

	    fn: function (value) {
	      return typeof value === "function";
	    },

	    obj: function (value) {
	      return value && typeof value === "object";
	    },

	    array: function (value) {
	      return Array.isArray(value);
	    },

	    str: function (value) {
	      return typeof value === "string";
	    },

	    num: function (value) {
	      return typeof value === "number";
	    },

	    bool: function (value) {
	      return typeof value === "boolean";
	    },

	    query: function (value) {
	      return value instanceof ux.Query && this.num(value._uid);
	    },

	    desktop: function () {
	      var ua = navigator.userAgent.toLowerCase();

	      return ua.indexOf("mobile") === -1 && ua.indexOf("phone") === -1 && typeof window.orientation === "undefined";
	    },

	    // mobile and tablet
	    mobile: function () {
	      var ua = navigator.userAgent.toLowerCase();

	      return typeof window.orientation !== "undefined" || ua.indexOf("mobile") !== -1 || ua.indexOf("phone") !== -1;
	    },

	    node: function (value) {
	      return this.obj(Node) ? value instanceof Node : value && this.obj(value) && this.num(value.nodeType) && value.nodeType !== 0 && this.str(value.nodeName);
	    },

	    el: function (value) {
	      return this.obj(HTMLElement) ? value instanceof HTMLElement // <= DOM2
	       : value && this.obj(value) && value !== null && value.nodeType === 1 && this.str(value.nodeName);
	    },

	    /**
	     * Validate a given `value`.
	     *
	     * @param {string} is    The validator name.
	     * @param {mixed}  value Value to validate.
	     * @param {string} [message='The given value is not valid'] message  Error message.
	     * @return {mixed} Returns the `value` if valid.
	     * @throw TypeError if not valid.
	     */
	    valid: function (is, value, message) {
	      if (this[is](value)) {
	        return value;
	      }

	      message = message || "The given value is not valid";

	      throw new TypeError(message);
	    }
	  };
	};

/***/ },
/* 2 */
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

	module.exports = function (ux) {
	  ux.color = {
	    names: {
	      aqua: "#00ffff", black: "#000000", blue: "#0000ff",
	      fuchsia: "#ff00ff", gray: "#808080", green: "#008000",
	      lime: "#00ff00", maroon: "#800000", navy: "#000080",
	      olive: "#808000", purple: "#800080", red: "#ff0000",
	      silver: "#c0c0c0", teal: "#008080", white: "#ffffff",
	      yellow: "#ffff00"
	    },

	    /**
	     * Hex to RGB(A)
	     */
	    toRgb: function (color, alpha) {
	      color = "0x" + this.toHex(color).substring(1);
	      color = [(color >> 16) & 255, (color >> 8) & 255, color & 255];

	      if (!ux.is.undef(alpha)) {
	        color.push(alpha);
	      }

	      return "rgb(" + color.join(",") + ")";
	    },

	    toHex: function (color) {
	      var tem, i, c, A;

	      i = 0;
	      c = color ? color.toString().toLowerCase() : "";

	      if (/^#[a-f0-9]{3,6}$/.test(c)) {
	        if (c.length < 7) {
	          A = c.split("");
	          c = A[0] + A[1] + A[1] + A[2] + A[2] + A[3] + A[3];
	        }

	        return c;
	      }

	      if (/^[a-z]+$/.test(c)) {
	        return this.names[c] || "";
	      }

	      c = c.match(/\d+(\.\d+)?%?/g) || [];

	      if (c.length < 3) {
	        return "";
	      }

	      c = c.slice(0, 3);

	      while (i < 3) {
	        tem = c[i].indexOf("%") != -1 ? Math.round(parseFloat(c[i]) * 2.55) : parseInt(c[i]);

	        if (tem < 0 || tem > 255) {
	          c.length = 0;
	        } else {
	          c[i++] = ux.util.padLeft(tem.toString(16), 2);
	        }
	      }

	      return c.length == 3 ? "#" + c.join("").toLowerCase() : "";
	    }
	  };
	};

/***/ },
/* 3 */
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

	/**
	 * parsing
	 * ```js
	 * ux.expr.parse(expr, scope);
	 * ```
	 * with a specific parser
	 * ```js
	 * ux.expr.parser('pipe').parse(expr, scope);
	 * ```
	 */
	module.exports = function (ux) {
	  ux.expr = {
	    parser: function (name) {
	      return this.parsers[name];
	    },

	    parsers: {
	      /**
	       * Parse an expression like:
	       * `name`
	       * Using filters:
	       * `name | ucFirst | escape`
	       *
	       * @param {string} expr  Expression to parse.
	       * @param {object} scope Scope to bind.
	       * @param {object} [context] Context (ignored here)
	       * @return {string} Returns the value.
	       */
	      pipe: function (expression, scope, context) {
	        var expr, filterCtx, filters;

	        filters = "";

	        if (context && context.filter) {
	          filterCtx = context.filter;
	        }

	        // if prop.prop | filter | filter
	        if (expression.indexOf("|") !== -1) {
	          // scope | filter(s)
	          filters = expression.split("|");
	          expression = filters.shift();
	        }

	        if (expression.indexOf(".") === -1) {
	          return ux.filter(scope[expression], filters, filterCtx);
	        }

	        // split prop.prop.prop
	        expr = expression.split(".");

	        return ux.filter(ux.util.propPath(scope, expr), filters, filterCtx);
	      }
	    },

	    /**
	     * Expression parser.
	     *
	     * @param {string} expr  Expression to parse.
	     * @param {object} scope Scope to bind.
	     *
	     * @param {object} [opt]   Options to pass to the parsers:
	     *   * {string|array} [only] Use only the given parser(s).
	     *   * {*} [...argument] Other arguments that should be passed to the parser(s).
	     *
	     * @return {string|obj} Expression computed.
	     * `string` or `object` (depend of the parser used).
	     */
	    parse: function (expression, scope, opt) {
	      if (expression === undefined) expression = "";
	      if (opt === undefined) opt = {};
	      var only, context, ln;

	      only = opt.only;
	      context = opt;

	      if (only) {
	        // apply only once parsers
	        if (ux.is.str(only)) {
	          return this.parsers[only](expression, scope, context);
	        }

	        // apply only given parsers
	        ln = only.length;

	        for (var i = 0; i < ln; i++) {
	          expression = this.parsers[only[i]](expression, scope, context);
	        }

	        return expression;
	      }

	      // apply all parsers
	      for (var name in this.parsers) {
	        expression = this.parsers[name](expression, scope, context);
	      }

	      return expression;
	    }
	  };
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classProps = function (child, staticProps, instanceProps) {
	  if (staticProps) Object.defineProperties(child, staticProps);
	  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
	};

	/**
	 * This file is part of Bindux.
	 *
	 * (c) Nicolas Tallefourtane <dev@nicolab.net>
	 *
	 * For the full copyright and license information, please view the LICENSE
	 * file distributed with this source code or visit http://bindux.com.
	 */

	"use strict";

	var queryId = -1;
	var dataPriv = new WeakMap();

	module.exports = function (ux) {
	  var is = ux.is;

	  /**
	   * The root node at which to begin the `TreeWalker`'s traversal.
	   *
	   * @param {Node} root The root Node of this `TreeWalker` traversal.
	   * Typically this will be an `element` owned by the `document`.
	   *
	   * @param {number} [whatToShow = NodeFilter.SHOW_ALL] An optional
	   * unsigned long representing a bitmask created by combining the
	   * constant properties of `NodeFilter`. It is a convenient way of filtering
	   * for certain types of node. It defaults to `0xFFFFFFFF` representing
	   * the `SHOW_ALL` constant.
	   *
	   * @param {function} [filter] An optional `NodeFilter`, that is an object
	   * with a method `acceptNode`, which is called by the `TreeWalker`
	   * to determine whether or not to accept a node that has passed
	   * the `whatToShow` check.
	   *
	   * @return {array} Nodes list.
	   *
	   * @see https://developer.mozilla.org/en/docs/Web/API/document.createTreeWalker
	   */
	  function traverse(root, whatToShow, filter) {
	    if (whatToShow === undefined) whatToShow = NodeFilter.SHOW_ALL;
	    return (function () {
	      var walker, nodes, node;

	      walker = document.createTreeWalker(root, whatToShow, filter);
	      nodes = [];

	      while (node = walker.nextNode()) {
	        nodes.push(node);
	      }

	      return nodes;
	    })();
	  }

	  /**
	   * Execute a script in a global context.
	   * Taken in jQuery.
	   *
	   * @param {string} code JS code to execute.
	   */
	  function globalExec(code) {
	    var script = document.createElement("script");

	    script.text = code;
	    document.head.appendChild(script).parentNode.removeChild(script);
	  }

	  /**
	   * Observe DOM and object mutation.
	   *
	   * @param {object} opt Options:
	   *
	   *   * {object} obj Object options:
	   *     * {Object} [obj={}]    Object to bind with the element (`opt.el.el`).
	   *     * {function} observer  Callback called on each mutation in the object `opt.obj.obj`.
	   *                            Signature: observer(changes, context)
	   *
	   *   * {object} el Element options:
	   *     * {Element}  el        DOM element to bind with the object `opt.obj.obj`.
	   *     * {function} observer  Callback called on each mutation in the element (`opt.el.el`).
	   *                            Signature: observer(mutations, mutationObserver, context).
	   *
	   *     * {object}   [opt]     Arguments passed to `MutationObserver.observe()`.
	   *
	   * @return {MutationObserver} An instance of `MutationObserver` (observer).
	   *
	   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
	   * @see https://developer.mozilla.org/en/docs/Web/API/MutationObserver
	   */
	  function observe(opt) {
	    var isUndef, args, elObs;

	    args = opt.el.opt || {};
	    opt.ctx = opt.ctx || {};
	    opt.obj.obj = opt.obj.obj || {};
	    isUndef = ux.is.undef;

	    args.attributes = isUndef(args.attributes) ? false : args.attributes;
	    args.childList = isUndef(args.childList) ? true : args.childList;
	    args.characterData = isUndef(args.characterData) ? false : args.characterData;

	    Object.observe(opt.obj.obj, function (changes) {
	      return opt.obj.observer(changes, {
	        el: opt.el.el,
	        elObs: elObs,
	        ctx: opt.ctx
	      });
	    });

	    elObs = new MutationObserver(function (mutations, observer) {
	      return opt.el.observer(mutations, observer, {
	        obj: opt.obj.obj,
	        ctx: opt.ctx
	      });
	    }).observe(opt.el, args);

	    return elObs;
	  }

	  /**
	   *  DOM Query utilities.
	   *  @class Query
	   */
	  var _Query = (function () {
	    var _Query = function _Query(selector, element) {
	      var _this = this;
	      if (element === undefined) element = document;
	      return (function () {
	        queryId++;

	        _this.engine = window.Sizzle || function (selector) {
	          return _this.select(selector).nodes;
	        };
	        _this.el = element;
	        _this.nodes;

	        Object.defineProperty(_this, "_uid", {
	          enumerable: true,
	          configurable: false,
	          writable: false,
	          value: queryId
	        });

	        if (selector) {
	          if (is.node(selector)) {
	            _this.el = selector;
	            _this.nodes = [selector];
	          } else {
	            _this.find(selector);
	          }
	        }
	      })();
	    };

	    _classProps(_Query, null, {
	      selectOne: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (selector) {
	          this.nodes = [this.el.querySelector(selector)];
	          return this;
	        }
	      },
	      select: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (selector) {
	          this.nodes = ux.util.toArray(this.el.querySelectorAll(selector));
	          return this;
	        }
	      },
	      selectById: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (id) {
	          this.nodes = [this.el.getElementById(id)];
	          return this;
	        }
	      },
	      selectByClass: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (name) {
	          this.nodes = ux.util.toArray(this.el.getElementsByClassName(name));
	          return this;
	        }
	      },
	      selectByTag: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (name) {
	          this.nodes = ux.util.toArray(this.el.getElementsByTagName(name));
	          return this;
	        }
	      },
	      selectByName: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (name) {
	          this.nodes = ux.util.toArray(this.el.getElementsByName(name));
	          return this;
	        }
	      },
	      findOne: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (selector) {
	          this.find(selector);
	          this.nodes = this.nodes.length > 1 ? this.nodes[0] : [];

	          return this;
	        }
	      },
	      find: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (selector) {
	          this.nodes = this.engine(selector, this.el);
	          return this;
	        }
	      },
	      get: {
	        writable: true,


	        /**
	         * @return {Node|undefined}
	         */
	        value: function (index) {
	          if (index === undefined) index = 0;
	          return this.nodes[index];
	        }
	      },
	      resolve: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (method, length) {
	          if (length === undefined) length = 1;
	          var target, nodes = [], ln = this.nodes.length;

	          for (var i = 0; i < ln; i++) {
	            target = this.nodes[i][method];

	            while (target) {
	              if (target && target !== nodes[nodes.length - 1] && target.nodeType === 1) {
	                nodes.push(target);

	                if (length === -1 || length > 1) {
	                  target = target[method];

	                  if (length > 1) {
	                    length--;
	                  }
	                } else {
	                  target = null;
	                }
	              }
	            }
	          }

	          this.nodes = nodes;

	          return this;
	        }
	      },
	      first: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          this.nodes = this.nodes ? this.nodes[0] : [];
	          return this;
	        }
	      },
	      last: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          this.nodes = this.nodes.length > 1 ? this.nodes.slice(-1) : [];
	          return this;
	        }
	      },
	      prev: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          return this.resolve("previousElementSibling");
	        }
	      },
	      prevAll: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          return this.resolve("previousElementSibling", -1);
	        }
	      },
	      next: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          return this.resolve("nextElementSibling");
	        }
	      },
	      nextAll: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          return this.resolve("nextElementSibling", -1);
	        }
	      },
	      children: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          var cLn, children, nodes;

	          nodes = [];

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            children = this.nodes[i].children;

	            if (children && children.nodeType !== 11) {
	              cLn = children.length;

	              for (var c = 0; c < cLn; c++) {
	                nodes.push(children[c]);
	              }
	            }
	          }

	          this.nodes = nodes;

	          return this;
	        }
	      },
	      parent: {
	        writable: true,


	        /**
	         * Get the first parent of each element in the current set of matched `nodes`.
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          var p;

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            p = this.nodes[i].parentNode;
	            this.nodes[i] = p && p.nodeType !== 11 ? p : null;
	          }

	          return this;
	        }
	      },
	      findParent: {
	        writable: true,


	        /**
	         * Find the fisrt parent of each element in the current set of matched `nodes`,
	         * optionally filtered by a selector.
	         *
	         * @param {string} selector Selector expression to match elements against.
	         * @return {Query} Current instance.
	         */
	        value: function (selector) {
	          return this.findParents(selector, false);
	        }
	      },
	      findParents: {
	        writable: true,


	        /**
	         * Find parent(s) of each element in the current set of matched `nodes`,
	         * optionally filtered by a selector.
	         *
	         * @param {string|Element} selector Selector expression to match elements against.
	         *
	         * @param {bool}   [all=true] `true` to find all parents,
	         * false` to find the first parent that match.
	         *
	         * @return {Query} Current instance.
	         */
	        value: function (selector, all) {
	          if (all === undefined) all = true;
	          var firstParent, p, parents = [];

	          if (is.str(selector)) {
	            selector = ux.dom(selector).nodes;
	          } else if (!selector) {
	            firstParent = true;
	          }

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            p = this.nodes[i].parentNode;

	            while (p) {
	              if (!p || p.nodeType === 11) {
	                continue;
	              }

	              if (firstParent) {
	                selector = null;
	                firstParent = p;

	                if (!firstParent || firstParent.nodeType === 11) {
	                  firstParent = true;
	                  continue;
	                }

	                selector = [firstParent];
	              }

	              if (selector && parents.indexOf(p) === -1 && selector.indexOf(p) !== -1) {
	                parents.push(p);

	                if (!all) {
	                  break;
	                }
	              }

	              p = p.parentNode;
	            }
	          }

	          this.nodes = parents;

	          return this;
	        }
	      },
	      each: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (fn) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            if (fn.call(this.nodes[i], this.el, i) === false) {
	              break;
	            }
	          }

	          return this;
	        }
	      },
	      css: {
	        writable: true,
	        value: function (name, value) {
	          var ln;

	          if (is.obj(name)) {
	            for (var prop in name) {
	              this.css(prop, name[prop]);
	            }

	            return this;
	          }

	          if (is.undef(value)) {
	            if (this.nodes[0]) {
	              return this.nodes[0].style[name] || window.getComputedStyle(this.nodes[0], null).getPropertyValue(name);
	            }

	            return void 0;
	          } else {
	            ln = this.nodes.length;

	            if (name === "display") {
	              for (var i = 0; i < ln; i++) {
	                dataPriv.set(this.nodes[i], {
	                  lastDisplay: this.nodes[i].style.display
	                });

	                this.nodes[i].style.display = value;
	              }

	              return this;
	            }

	            for (var i = 0; i < ln; i++) {
	              this.nodes[i].style[name] = value;
	            }

	            return this;
	          }
	        }
	      },
	      hasClass: {
	        writable: true,


	        /**
	         * Determine whether any of the matched elements are assigned the given class.
	         *
	         * @param {string} name The class name to search for.
	         * @return {bool} `true` if a node contains the given class,
	         * otherwise `false`
	         */
	        value: function (name) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            if (this.nodes[i].classList.contains(name)) {
	              return true;
	            }
	          }

	          return false;
	        }
	      },
	      addClass: {
	        writable: true,


	        /**
	         * Add a class to each element in the current set of matched `nodes`.
	         *
	         * @param {string} name The class name to add
	         * @return {Query} Current instance.
	         */
	        value: function (name) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].classList.add(name);
	          }

	          return this;
	        }
	      },
	      removeClass: {
	        writable: true,


	        /**
	          * Remove a class to each element in the current set of matched `nodes`.
	          *
	          * @param {string} name The class name to add
	          * @return {Query} Current instance.
	          */
	        value: function (name) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].classList.remove(name);
	          }

	          return this;
	        }
	      },
	      toggleClass: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (name) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].classList.toggle(name);
	          }

	          return this;
	        }
	      },
	      hide: {
	        writable: true,


	        /**
	         * Hide each element in the current set of matched `nodes`.
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            if (dataPriv.has(this.nodes[i])) {
	              dataPriv.get(this.nodes[i]).oldDisplay = this.nodes[i].style.display;
	            } else {
	              dataPriv.set(this.nodes[i], {
	                oldDisplay: this.nodes[i].style.display
	              });
	            }

	            this.nodes[i].style.display = "none";
	          }

	          return this;
	        }
	      },
	      show: {
	        writable: true,


	        /**
	          * Show each element in the current set of matched `nodes`.
	          * @return {Query} Current instance.
	          */
	        value: function () {
	          var value;

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            value = "";

	            if (dataPriv.has(this.nodes[i])) {
	              value = dataPriv.get(this.nodes[i]).oldDisplay || value;
	            }

	            this.nodes[i].style.display = value;
	          }

	          return this;
	        }
	      },
	      attr: {
	        writable: true,
	        value: function (name, value) {
	          var ln;

	          if (is.undef(value)) {
	            var list = this.nodes[0].attributes;

	            ln = list.length;

	            if (name) {
	              for (var i = 0; i < ln; i++) {
	                if (name == list[i].nodeName) {
	                  return list[i].value;
	                }
	              }

	              return void 0;
	            }

	            var attrs = {};

	            for (var i = 0; i < ln; i++) {
	              attrs[list[i].nodeName] = list[i].value;
	            }

	            return attrs;
	          }

	          ln = this.nodes.length;

	          for (var i = 0; i < ln; i++) {
	            this.nodes[i].setAttribute(name, value);
	          }

	          return this;
	        }
	      },
	      text: {
	        writable: true,
	        value: function (value) {
	          var txt = "", ln = this.nodes.length;

	          if (is.undef(value)) {
	            for (var i = 0; i < ln; i++) {
	              txt += this.nodes[i].textContent;
	            }

	            return txt;
	          }

	          for (var i = 0; i < ln; i++) {
	            this.nodes[i].textContent = value;
	          }

	          return this;
	        }
	      },
	      html: {
	        writable: true,
	        value: function (value) {
	          var html = "", ln = this.nodes.length;

	          if (is.undef(value)) {
	            for (var i = 0; i < ln; i++) {
	              html += this.nodes[i].innerHTML;
	            }

	            return html;
	          }

	          for (var i = 0; i < ln; i++) {
	            this.nodes[i].innerHTML = value;
	          }

	          return this;
	        }
	      },
	      prepend: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].insertAdjacentHTML("afterbegin", value);
	          }

	          return this;
	        }
	      },
	      prependText: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          return this.prependChild(document.createTextNode(value));
	        }
	      },
	      prependChild: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (node) {
	          var type;

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            type = this.nodes[i].nodeType;

	            if (type === 1 || type === 11 || type === 9) {
	              this.nodes[i].insertBefore(node.cloneNode(true), this.nodes[i].firstChild);
	            }
	          }

	          return this;
	        }
	      },
	      append: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].insertAdjacentHTML("beforeend", value);
	          }

	          return this;
	        }
	      },
	      appendText: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          return this.appendChild(document.createTextNode(value));
	        }
	      },
	      appendChild: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (node) {
	          var type;

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            type = this.nodes[i].nodeType;

	            if (type === 1 || type === 11 || type === 9) {
	              this.nodes[i].appendChild(node.cloneNode(true));
	            }
	          }

	          return this;
	        }
	      },
	      insertBefore: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].insertAdjacentHTML("beforebegin", value);
	          }

	          return this;
	        }
	      },
	      insertAfter: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (value) {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].insertAdjacentHTML("afterend", value);
	          }

	          return this;
	        }
	      },
	      empty: {
	        writable: true,


	        /**
	         * Empty the selected nodes
	         *
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          var range;

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            range = document.createRange();
	            range.selectNodeContents(this.nodes[i]);
	            range.deleteContents();
	          }

	          return this;
	        }
	      },
	      remove: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function () {
	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].remove();
	          }

	          return this;
	        }
	      },
	      replaceWith: {
	        writable: true,


	        /**
	         * Replace all nodes selected by the `node`.
	         *
	         * The `node` can be :
	         *   * an `element` (`object`)
	         *   * or a `TextNode` (`object`)
	         *   * or HTML (`string`).
	         *
	         * @param {Node|string} node The new node.
	         *
	         * @return {Query} The current instance.
	         */
	        value: function (node) {
	          if (is.str(node)) {
	            node = ux.html.toNode(node);
	          }

	          for (var i = 0, ln = this.nodes.length; i < ln; i++) {
	            this.nodes[i].parentNode.replaceChild(node.cloneNode(true), this.nodes[i]);
	          }

	          return this;
	        }
	      },
	      on: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (event, listener, useCapture) {
	          if (useCapture === undefined) useCapture = false;
	          var ln = this.nodes.length;

	          if (ln) {
	            for (var i = 0; i < ln; i++) {
	              this.nodes[i].addEventListener(event, listener, useCapture);
	            }
	          }

	          return this;
	        }
	      },
	      off: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (event, listener, useCapture) {
	          if (useCapture === undefined) useCapture = false;
	          var ln = this.nodes.length;

	          if (ln) {
	            for (var i = 0; i < ln; i++) {
	              this.nodes[i].removeEventListener(event, listener, useCapture);
	            }
	          }

	          return this;
	        }
	      },
	      trigger: {
	        writable: true,


	        /**
	         * @return {Query} Current instance.
	         */
	        value: function (event, data) {
	          var ln = this.nodes.length;

	          if (ln) {
	            if (is.str(event)) {
	              event = new Event(event);
	            }

	            for (var i = 0; i < ln; i++) {
	              this.nodes[i].dispatchEvent(event, data);
	            }

	            return this;
	          }
	        }
	      }
	    });

	    return _Query;
	  })();




	  /*------------------------------------------------------------------------*\
	    Init
	  \*------------------------------------------------------------------------*/

	  ux.Query = _Query;

	  // browser support
	  if (!document.querySelector) {
	    ux.Query.prototype.select = ux.Query.prototype.findOne;
	  }

	  if (!document.querySelectorAll) {
	    ux.Query.prototype.selectAll = ux.Query.prototype.find;
	  }

	  ux.dom = function (selector, element) {
	    return new ux.Query(selector, element);
	  };

	  ux.dom.traverse = traverse;
	  ux.dom.observe = observe;
	  ux.dom.globalExec = globalExec;

	  ux.dom.onLoaded = function (listener, useCapture) {
	    if (useCapture === undefined) useCapture = false;
	    return document.addEventListener("DOMContentLoaded", listener, useCapture);
	  };
	};

/***/ },
/* 5 */
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

	module.exports = function (ux) {
	  /**
	   * Filters
	   * ```js
	   * expr.filters.hello = function(input) {
	   *   return 'Hello ' + input;
	   * }
	   * ```
	   * @type {Object}
	   */
	  ux.filters = {
	    uc: function (str) {
	      str += "";
	      return str.toUpperCase();
	    },

	    ucFirst: function (str) {
	      str += "";
	      return str.charAt(0).toUpperCase() + str.substr(1);
	    },

	    lc: function (str) {
	      str += "";
	      return str.toLowerCase();
	    },

	    lcFirst: function (str) {
	      str += "";
	      return str.charAt(0).toLowerCase() + str.substr(1);
	    },

	    rmSpace: function (str) {
	      return str.split(" ").join("");
	    }
	  };

	  ux.filter = function (value, filters, context) {
	    if (ux.is.fn(value) && context && context.resolveFn) {
	      value = value.call(context.bind ? context.bind : null, context.args ? context.args : []);
	    }

	    if (!filters) {
	      return value;
	    }

	    if (!ux.is.array(filters)) {
	      filters = filters.split("|");
	    }

	    for (var i = 0, ln = filters.length; i < ln; i++) {
	      value = ux.filters[filters[i].trim()](value);
	    }

	    return value;
	  };

	  // load filters: escape / e, unescape
	  __webpack_require__(12)(ux);
	};

/***/ },
/* 6 */
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

	module.exports = function (ux) {
	  // options
	  ux.opt.deprecation = true;
	  ux.opt.throwDeprecation = false;

	  ux.util = {
	    /**
	     * List of regular expressions.
	     * Note: Use the `partials` property for the partials `string` of some regular expressions.
	     *
	     * @type {Object}
	     */
	    rx: {
	      // capture the first HTML tag
	      firstHtmlTag: /<[\n\r ]*([a-z0-9\-_]+)/mi
	    },

	    /**
	     * Execute `fn` for each value of `array`.
	     * @param {array}    Array to traverse.
	     * @param {function} fn Function to call for each value in `àrray`.
	     * @param {object}   [context] Context (`this`) to bind in the function `fn`.
	     */
	    each: function (array, fn, context) {
	      var i = 0, val;

	      while ((val = obj[i])) {
	        fn.call(context, val, i, obj);
	        i++;
	      }
	    },

	    /**
	     * Merge object `from` in object `obj`.
	     *
	     * ```js
	     *  var obj  = { foo: 'bar' };
	     *  var from = { bar: 'baz' };
	     *
	     *  ux.util.merge(obj, from);
	     *  // => { foo: 'bar', bar: 'baz' }
	     * ```
	     *
	     * @param {object}          obj   Object that receives the value from `from`.
	     * @param {...object|array} from  One or more objects to merge in `obj`.
	     * @return {object} `obj` merged
	     */
	    merge: function (obj, from) {
	      var ln = arguments.length;

	      if (ln < 2) {
	        throw new Error("There should be at least 2 arguments passed to ux.util.merge()");
	      }

	      for (var i = 1; i < ln; i++) {
	        if (obj && from) {
	          for (var key in from) {
	            obj[key] = obj[key] = arguments[i][key];
	          }
	        }
	      }

	      return obj;
	    },

	    /**
	     * Merge recursive.
	     *
	     * @param {object|array} obj       Object that receives the value from `from`
	     * @param {...object|array} from   One or more objects to merge in `obj`.
	     * @return {object} `obj` merged
	     */
	    mergeRecursive: function (obj, from) {
	      var ln = arguments.length;

	      if (ln < 2) {
	        throw new Error("There should be at least 2 arguments passed to ux.util.mergeRecursive()");
	      }

	      for (var i = 1; i < ln; i++) {
	        for (var p in arguments[i]) {
	          if (obj[p] && typeof obj[p] === "object") {
	            obj[p] = this.mergeRecursive(obj[p], arguments[i][p]);
	          } else {
	            obj[p] = arguments[i][p];
	          }
	        }
	      }

	      return obj;
	    },

	    /**
	     * Taken in jQuery, works like jQuery.grep().
	     *
	     * @param  {array}   elems    The array to search through.
	     *
	     * @param  {function} callback  The function to process each item against.
	     *
	     * Function( `Object` elementOfArray, `Integer` indexInArray ) => `Boolean`
	     *
	     * The first argument to the function is the item, and the second
	     * argument is the index. The function should return a Boolean value.
	     * `this` will be the global window object.
	     *
	     * @param  {bool}   invert   If "invert" is `false`, or not provided,
	     * then the function returns an array consisting of all elements for which
	     * `callback` returns `true`. If `invert` is `true`, then the function returns
	     * an array consisting of all elements for which `callback` returns `false`.
	     *
	     * @return {array}
	     */
	    grep: function (elems, callback, invert) {
	      var matches, ln, callbackExpect, callbackInverse;

	      matches = [];
	      callbackExpect = !invert;

	      // Go through the array, only saving the items
	      // that pass the validator function
	      for (var i = 0, ln = elems.length; i < ln; i++) {
	        callbackInverse = !callback(elems[i], i);

	        if (callbackInverse !== callbackExpect) {
	          matches.push(elems[i]);
	        }
	      }

	      return matches;
	    },

	    /**
	     * Get or set a property of object via dot notation as path.
	     *
	     * @param {object}       obj   Object to handle.
	     * @param {string|array} path  Property path.
	     * @param {mixed}        [val] Property value.
	     * @return {mixed} The path value.
	     */
	    propPath: function (obj, path, val) {
	      var paths, final, p;

	      paths = ux.is.array(path) ? path : path.split(".");
	      final = paths.pop().trim();

	      while (p = paths.shift()) {
	        if (obj[p] === void 0) {
	          return obj[p];
	        }

	        obj = obj[p];
	      }

	      return val ? (obj[final] = val) : obj[final];
	    },



	    /**
	     * Mark that a method should not be used.
	     *
	     * @param {function} fn         Function to deprecate.
	     * @param {string} [msg='']     Message of the deprecation.
	     * @param {object} [scope=null] Scope (this) to bind.
	     *
	     * @return {function} Returns a modified function which warns once by default.
	     * If `ux.opt.deprecation` is falsy (null, 0, false), then it is a no-op.
	     */
	    deprecate: function (fn, msg, scope) {
	      if (msg === undefined) msg = "";
	      if (scope === undefined) scope = null;
	      var warned;

	      function deprecated() {
	        if (!warned && ux.opt.deprecation) {
	          if (ux.opt.throwDeprecation) {
	            throw new Error(msg);
	          } else {
	            console.error(msg);
	          }
	          warned = true;
	        }

	        return fn.apply(scope, arguments);
	      }

	      return deprecated;
	    },

	    /**
	     * Add string (`char`) at left of `str`.
	     * @param {string} str
	     * @param {number} [ln = 2]
	     * @param {string} [char = 0]
	     * @return {string}
	     */
	    padLeft: function (str, ln, char) {
	      if (ln === undefined) ln = 2;
	      if (char === undefined) char = "0";


	      while (str.length < ln) {
	        str = char + str;
	      }

	      return str;
	    },

	    toArray: function (obj) {
	      return Array.prototype.slice.call(obj, 0);
	    }
	  };
	};

/***/ },
/* 7 */
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

	module.exports = function (ux) {
	  ux.html = {
	    /**
	     * Get the first HTML tag.
	     *
	     * @param {string} str
	     * @return {string|null} Returns the tag (lowercase) if found, `null` otherwise.
	     */
	    getFirstTag: function (str) {
	      var match;

	      if (str.indexOf("<") === -1) {
	        return null;
	      }

	      match = str.match(ux.util.rx.firstHtmlTag);

	      return match ? match[1].trim().toLowerCase() : null;
	    },

	    /**
	     * Get attributes from a string.
	     *
	     * @param {string} str
	     * @return {object} Returns attribute(s) name=value pairs in object.
	     */
	    getAttrs: function (str) {
	      var attr, value, rxStartTag, startTag, rxAttrs, match, attrs;

	      // regex to pick out start tag from start of element's HTML.
	      rxStartTag = /^<\w+\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[\w\-.:]+))?)*\s*\/?>/;
	      startTag = str.match(rxStartTag);
	      startTag = startTag ? startTag[0] : "";

	      // regex to pick out attribute name and (optional) value from start tag.
	      rxAttrs = /\s+([\w\-.:]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([\w\-.:]+)))?/g;
	      match = rxAttrs.exec(startTag);
	      attrs = {};

	      while (match) {
	        // attribute name in $1.
	        attr = match[1];

	        // assume no value specified.
	        value = match[1];

	        // if match[2] is set, then attribute has a value.
	        if (match[2]) {
	          // attribute value is in $3, $4 or $5.
	          value = match[3] ? match[3] : match[4] ? match[4] : match[5];
	        }

	        attrs[attr] = value;
	        match = rxAttrs.exec(startTag);
	      }

	      return attrs;
	    },

	    /**
	     * HTML/string to Node (`Element` or `TextNode`).
	     *
	     * @param {string} str
	     * @return {Node} Node Returns an object `Element` or `TextNode`.
	     */
	    toNode: function (str) {
	      var el = document.createElement("div");

	      el.insertAdjacentHTML("beforeend", str);
	      el = el.lastChild;

	      return el;
	    },

	    /**
	     * Remove HTML tags.
	     * Inspired by http://phpjs.org/functions/strip_tags/
	     *
	     * ```js
	     * // 'Who <b>are</b> <i>you</i>'
	     * ux.html.stripTags('<p>Who</p> <br /><b>are</b> <i>you</i>', '<i><b>');
	     * ```
	     *
	     * @param {string} str
	     * @param {string} [allowed] Allowed HTML tag(s)
	     * @return {string} Returns string without HTML tag
	     * or only with `allowed` tag(s).
	     */
	    stripTags: function (str, allowed) {
	      var tags, comments;

	      tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
	      comments = /<!--[\s\S]*?-->/gi;

	      // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	      allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");

	      return str.replace(comments, "").replace(tags, function ($0, $1) {
	        return allowed.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
	      });
	    }
	  };
	};

/***/ },
/* 8 */
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

	module.exports = function (ux) {
	  ux.nodeMaps = new WeakMap();

	  ux.nodeMaps.addOnce = function (data) {
	    if (this.has(data.node)) {
	      return this;
	    }

	    if (!data.binders) {
	      data.binders = {};
	    }

	    return this.set(data.node, data);
	  };

	  ux.nodeMaps.setBinder = function (node, binder, expr) {
	    this.get(node).binders[binder.name] = { binder: binder, expr: expr };
	    return this;
	  };
	};

/***/ },
/* 9 */
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

	module.exports = function (ux) {
	  ux.binders = {
	    scope: __webpack_require__(13)(ux)
	  };

	  // depends of ux.binders.scope
	  ux.binders.ctrl = __webpack_require__(14)(ux);
	  ux.binders.each = __webpack_require__(15)(ux);
	  ux.binders.el = __webpack_require__(16)(ux);
	  ux.binders.text = __webpack_require__(17)(ux);
	  ux.binders.html = __webpack_require__(18)(ux);
	  ux.binders.on = __webpack_require__(19)(ux);
	};

/***/ },
/* 10 */
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

	module.exports = function (ux) {
	  ux.init = function () {
	    var load = function (node) {
	      ux.on("preLoad", function (el) {
	        return ux.emit("load", el);
	      });
	      ux.on("load", function (el) {
	        return ux.emit("postLoad", el);
	      });

	      ux.emit("preLoad", node);
	    };

	    ux.dom.onLoaded(function () {
	      var binder;

	      for (var k in ux.binders) {
	        binder = ux.binders[k];

	        if (typeof binder.init === "function") {
	          binder.init();
	          binder.init = true;
	        }
	      }

	      // load document at the end
	      load(document);

	      ux.init = true;
	    });
	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @name Evemit
	 * @description Minimal and fast JavaScript event emitter for Node.js and front-end.
	 * @author Nicolas Tallefourtane <dev@nicolab.net>
	 * @link https://github.com/Nicolab/evemit
	 * @license MIT https://github.com/Nicolab/evemit/blob/master/LICENSE
	 */
	;(function () {
	  "use strict";

	  /**
	   * Evemit
	   *
	   * @constructor
	   * @api public
	   */
	  function Evemit() {
	    this.events = {};
	  }

	  /**
	   * Register a new event listener for a given event.
	   *
	   * @param {string}   event      Event name.
	   * @param {function} fn         Callback function (listener).
	   * @param {*}        [context]  Context for function execution.
	   * @return {Evemit} Current instance.
	   * @api public
	   */
	  Evemit.prototype.on = function (event, fn, context) {
	    if (!this.events[event]) {
	      this.events[event] = [];
	    }

	    if (context) {
	      fn._E_ctx = context;
	    }

	    this.events[event].push(fn);

	    return this;
	  };

	  /**
	   * Add an event listener that's only called once.
	   *
	   * @param {string}    event      Event name.
	   * @param {function}  fn         Callback function (listener).
	   * @param {*}         [context]  Context for function execution.
	   * @return {Evemit} Current instance.
	   * @api public
	   */
	  Evemit.prototype.once = function (event, fn, context) {
	    fn._E_once = true;
	    return this.on(event, fn, context);
	  };

	  /**
	   * Emit an event to all registered event listeners.
	   *
	   * @param  {string} event      Event name.
	   * @param  {*}      [...arg]   One or more arguments to pass to the listeners.
	   * @return {bool} Indication, `true` if at least one listener was executed,
	   * otherwise returns `false`.
	   * @api public
	   */
	  Evemit.prototype.emit = function (event, arg1, arg2, arg3, arg4) {
	    var fn, evs, args, aLn;

	    if (!this.events[event]) {
	      return false;
	    }

	    args = Array.prototype.slice.call(arguments, 1);
	    aLn = args.length;
	    evs = this.events[event];

	    for (var i = 0, ln = evs.length; i < ln; i++) {
	      fn = evs[i];

	      if (fn._E_once) {
	        this.off(event, fn);
	      }

	      // Function.apply() is a bit slower, so try to do without
	      if (aLn === 0) {
	        fn.call(fn._E_ctx);
	      } else if (aLn === 1) {
	        fn.call(fn._E_ctx, arg1);
	      } else if (aLn === 2) {
	        fn.call(fn._E_ctx, arg1, arg2);
	      } else if (aLn === 3) {
	        fn.call(fn._E_ctx, arg1, arg2, arg3);
	      } else if (aLn === 4) {
	        fn.call(fn._E_ctx, arg1, arg2, arg3, arg4);
	      } else {
	        fn.apply(fn._E_ctx, args);
	      }
	    }

	    return true;
	  };

	  /**
	   * Remove event listeners.
	   *
	   * @param {string}   event  The event to remove.
	   * @param {function} fn     The listener that we need to find.
	   * @return {Evemit} Current instance.
	   * @api public
	   */
	  Evemit.prototype.off = function (event, fn) {
	    if (!this.events[event]) {
	      return this;
	    }

	    for (var i = 0, ln = this.events[event].length; i < ln; i++) {
	      if (this.events[event][i] === fn) {
	        this.events[event][i] = null;
	        delete this.events[event][i];
	      }
	    }

	    // re-index
	    this.events[event] = this.events[event].filter(function (ltns) {
	      return typeof ltns !== "undefined";
	    });

	    return this;
	  };

	  /**
	   * Get a list of assigned event listeners.
	   *
	   * @param {string} [event] The events that should be listed.
	   * If not provided, all listeners are returned.
	   * Use the property `Evemit.events` if you want to get an object like
	   * ```
	   * {event1: [array of listeners], event2: [array of listeners], ...}
	   * ```
	   *
	   * @return {array}
	   * @api public
	   */
	  Evemit.prototype.listeners = function (event) {
	    var evs, ltns;

	    if (event) {
	      return this.events[event] || [];
	    }

	    evs = this.events;
	    ltns = [];

	    for (var ev in evs) {
	      ltns = ltns.concat(evs[ev].valueOf());
	    }

	    return ltns;
	  };

	  /**
	   * Expose Evemit
	   * @type {Evemit}
	   */
	  if (typeof module !== "undefined" && module.exports) {
	    module.exports = Evemit;
	  } else {
	    window.Evemit = Evemit;
	  }
	})();

/***/ },
/* 12 */
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

	var reEscapedHtml, reUnescapedHtml, htmlEscapes, htmlUnescapes;

	/**
	 * Extracted from Lo-Dash (https://lodash.com/)
	 * and adapted for BindUX.
	 */

	// Used to match HTML entities and HTML characters
	reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g;
	reUnescapedHtml = /[&<>"'`]/g;

	/**
	 * Used to map characters to HTML entities.
	 *
	 * **Note:** Though the ">" character is escaped for symmetry, characters like
	 * ">" and "/" don't require escaping in HTML and have no special meaning
	 * unless they're part of a tag or unquoted attribute value.
	 * See [Mathias Bynens's article](http://mathiasbynens.be/notes/ambiguous-ampersands)
	 * (under "semi-related fun fact") for more details.
	 *
	 * Backticks are escaped because in Internet Explorer < 9, they can break out
	 * of attribute values or HTML comments. See [#102](http://html5sec.org/#102),
	 * [#108](http://html5sec.org/#108), and [#133](http://html5sec.org/#133) of
	 * the [HTML5 Security Cheatsheet](http://html5sec.org/) for more details.
	 */
	htmlEscapes = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  "\"": "&quot;",
	  "'": "&#39;",
	  "`": "&#96;"
	};

	// Used to map HTML entities to characters
	htmlUnescapes = {
	  "&amp;": "&",
	  "&lt;": "<",
	  "&gt;": ">",
	  "&quot;": "\"",
	  "&#39;": "'",
	  "&#96;": "`"
	};

	/**
	 * Converts the characters "&", "<", ">", '"', "'", and '`', in `str` to
	 * their corresponding HTML entities.
	 *
	 * **Note:** No other characters are escaped. To escape additional characters
	 * use a third-party library like [_he_](http://mths.be/he).
	 *
	 * When working with HTML you should always quote attribute values to reduce
	 * XSS vectors. See [Ryan Grove's article](http://wonko.com/post/html-escaping)
	 * for more details.
	 *
	 * @param {string} [str=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * ${='fred, barney, & pebbles' | escape}
	 * // => 'fred, barney, &amp; pebbles'
	 *
	 * Same of
	 * ${:'fred, barney, & pebbles'}
	 * // => 'fred, barney, &amp; pebbles'
	 */
	function escape(str) {
	  // reset `lastIndex` because in IE < 9 `String#replace` does not
	  str = str == null ? "" : String(str);

	  return str && (reUnescapedHtml.lastIndex = 0, reUnescapedHtml.test(str)) ? str.replace(reUnescapedHtml, function (chr) {
	    return htmlEscapes[chr];
	  }) : str;
	}

	/**
	 * The inverse of `escape`, this method converts the HTML entities
	 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `str` to their
	 * corresponding characters.
	 *
	 * **Note:** No other HTML entities are unescaped. To unescape additional HTML
	 * entities use a third-party library like [_he_](http://mths.be/he).
	 *
	 * @param {string} [str=''] The string to unescape.
	 * @returns {string} Returns the unescaped string.
	 * @example
	 *
	 * ${='fred, barney, &amp; pebbles' | unescape}
	 * // => 'fred, barney, & pebbles'
	 */
	function unescape(str) {
	  str = str == null ? "" : String(str);

	  return str && (reEscapedHtml.lastIndex = 0, reEscapedHtml.test(str)) ? str.replace(reEscapedHtml, function (chr) {
	    return htmlUnescapes[chr];
	  }) : str;
	}

	module.exports = function (ux) {
	  ux.filters.e = ux.filters.escape = escape;
	  ux.filters.unescape = unescape;
	};

/***/ },
/* 13 */
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

	module.exports = function (ux) {
	  var proto, scopeObserved, getNodes;

	  scopeObserved = {};

	  getNodes = function (el, ctx, force) {
	    if (force) {
	      el = el === document ? ux.dom(null, el) : ux.dom(el);
	      ctx.nodes = el.select("[" + ctx.attr + "]").nodes;
	    }

	    return ctx.nodes;
	  };

	  // proto binder
	  proto = {
	    getNodes: function (el, force) {
	      return getNodes(el, this, force);
	    },

	    nodes: [],

	    build: function (el, fn) {
	      var expr, nodes, nodeScope, scopeName, ln, checkNode;

	      nodes = this.getNodes(el, true);
	      ln = nodes.length;

	      checkNode = function (idx, ns, expression, attr) {
	        if (!ns) {
	          throw new ReferenceError("Scope not found for the binder " + attr + "=\"" + expression + "\" (node #" + idx + ")");
	        }
	      };

	      // Resolve all n-text and the binded scope
	      for (var i = 0; i < ln; i++) {
	        expr = nodes[i].getAttribute(this.attr);
	        scopeName = nodes[i].getAttribute("n-scope");

	        if (scopeName) {
	          nodeScope = nodes[i];
	          checkNode(i, nodeScope, expr, this.attr);
	        } else {
	          nodeScope = ux.dom(nodes[i]).findParent("[n-scope]").nodes[0];
	          checkNode(i, nodeScope, expr, this.attr);
	          scopeName = nodeScope.getAttribute("n-scope");
	        }

	        fn({
	          node: nodes[i],
	          expr: expr,
	          scopeName: scopeName,
	          nodeScope: nodeScope
	        });
	      }
	    },

	    init: function () {
	      var _this = this;


	      if (this.preLoad) {
	        ux.on("preLoad", function (el) {
	          return _this.preLoad(el);
	        }, this);
	      }

	      if (this.load) {
	        ux.on("load", function (el) {
	          return _this.load(el);
	        }, this);
	      }

	      if (this.postLoad) {
	        ux.on("postLoad", function (el) {
	          return _this.postLoad(el);
	        }, this);
	      }
	    },

	    load: function (el) {
	      var _this2 = this;
	      this.build(el, function (data) {
	        ux.nodeMaps.addOnce({
	          node: data.node,
	          nodeScope: data.nodeScope,
	          scopeName: data.scopeName
	        });

	        ux.nodeMaps.setBinder(data.node, _this2, data.expr);

	        if (_this2.onScopeChanges) {
	          ux.on("scopes." + data.scopeName + ".changes", function (changes) {
	            return _this2.onScopeChanges(data.node, changes);
	          }, _this2);
	        }
	      });
	    },

	    /**
	     * Listener on scopes changes called on event `scopes.{scopeName}.changes`.
	     * @param {Element} node  The node element.
	     * @param {object} changes
	     */
	    onScopeChanges: function (node, changes) {
	      var ns = ux.nodeMaps.get(node);

	      this.nodeUpdate(ns.node, ux.scopes[ns.scopeName], ns.binders[this.name].expr, changes);
	    }
	  };

	  // resolve attribute
	  Object.defineProperty(proto, "attr", {
	    get: function () {
	      return ux.binderAttr(this.name);
	    }
	  });

	  // ux.binders.scope
	  return {
	    proto: proto,
	    name: "scope",
	    attr: ux.opt.binder.prefix + "scope",

	    getNodes: function (el, force) {
	      return getNodes(el, this, force);
	    },

	    init: function () {
	      var _this3 = this;
	      ux.on("load", function (el) {
	        return _this3.load(el);
	      }, this);
	      ux.on("postLoad", function () {
	        return _this3.postLoad();
	      }, this);
	    },

	    load: function (el) {
	      var name, nodes;

	      nodes = this.getNodes(el, true);

	      for (var i = 0, ln = nodes.length; i < ln; i++) {
	        name = nodes[i].getAttribute(this.attr);

	        if (!ux.scopes[name]) {
	          ux.scopes[name] = {};
	        }
	      }
	    },

	    postLoad: function () {
	      for (var name in ux.scopes) {
	        if (scopeObserved[name] === true) {
	          continue;
	        }

	        Object.observe(ux.scopes[name], function (changes) {
	          return ux.emit("scopes." + name + ".changes", changes);
	        });

	        scopeObserved[name] = true;
	      }
	    }
	  };
	};

/***/ },
/* 14 */
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

	module.exports = function (ux) {
	  var proto = ux.binders.scope.proto;

	  return {
	    name: "ctrl",
	    attr: ux.opt.binder.prefix + "ctrl",

	    getNodes: proto.getNodes,

	    init: function () {
	      var _this = this;
	      ux.on("preLoad", function (el) {
	        return _this.preLoad(el);
	      }, this);
	      ux.on("postLoad", function () {
	        return _this.postLoad();
	      }, this);
	    },

	    preLoad: function (el) {
	      var ctrl, nodes, node, ln;

	      // resolve controllers
	      nodes = this.getNodes(el, true);
	      ln = nodes.length;

	      for (var i = 0; i < ln; i++) {
	        node = nodes[i];
	        ctrl = node.getAttribute(this.attr);

	        if (!node.getAttribute("n-scope")) {
	          node.setAttribute("n-scope", ctrl);
	        }

	        ux.ctrls[ctrl] = {
	          node: node,
	          ctrl: ux.ctrls[ctrl]
	        };

	        ux.emit("ctrls." + ctrl + ".preLoaded");
	      }
	    },

	    postLoad: function () {
	      for (var ctrl in ux.ctrls) {
	        ux.emit("ctrls." + ctrl + ".preBoot");

	        ux.ctrls[ctrl].ctrl = new ux.ctrls[ctrl].ctrl(ux.scopes[ctrl], ux.ctrls[ctrl].node);

	        ux.emit("ctrls." + ctrl + ".postBoot");
	      }
	    }
	  };
	};

/***/ },
/* 15 */
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

	module.exports = function (ux) {
	  var scopeObserved = [];

	  return {
	    __proto__: ux.binders.scope.proto,

	    name: "each",

	    init: function () {
	      var _this = this;
	      ux.on("load", function (el) {
	        return _this.load(el);
	      }, this);
	      ux.on("postLoad", function (el) {
	        return _this.postLoad(el);
	      }, this);
	    },

	    load: function (el) {
	      var _this2 = this;
	      this.build(el, function (data) {
	        var nodeMap, binder, expr, splitExpr, scopeName, vpropName, propName;

	        ux.nodeMaps.addOnce({
	          node: data.node,
	          nodeScope: data.nodeScope,
	          scopeName: data.scopeName
	        });

	        ux.nodeMaps.setBinder(data.node, _this2, data.expr);

	        nodeMap = ux.nodeMaps.get(data.node);
	        binder = nodeMap.binders[_this2.name];
	        expr = binder.expr;
	        splitExpr = expr.split(" ");
	        vpropName = splitExpr.shift().trim();
	        propName = splitExpr.pop().trim();
	        scopeName = data.scopeName;

	        binder.propName = propName;
	        binder.vpropName = vpropName;
	        binder.contents = nodeMap.node.cloneNode(true);

	        ux.on("binders.each.scopes." + scopeName + "." + propName + ".changes", function () {
	          return _this2.resolveNodeContents(nodeMap);
	        });

	        ux.on("scopes." + data.scopeName + ".changes", function (changes) {
	          changes.forEach(function (change) {
	            if (change.type === "update" && change.name === binder.propName && change.oldValue) {
	              _this2.resolveNodeContents(nodeMap);
	            }
	          });
	        }, _this2);
	      });
	    },

	    postLoad: function () {
	      var nodes, node, nodeMap, scopeName, propName, obj;

	      // nodes: each
	      nodes = this.nodes;

	      for (var i = 0, ln = nodes.length; i < ln; i++) {
	        node = nodes[i];
	        nodeMap = ux.nodeMaps.get(node);
	        scopeName = nodeMap.scopeName;
	        propName = nodeMap.binders[this.name].propName;
	        obj = ux.scopes[scopeName][propName];

	        if (scopeObserved.indexOf(obj) !== -1) {
	          continue;
	        }

	        Object.observe(obj, function (changes) {
	          return ux.emit("binders.each.scopes." + scopeName + "." + propName + ".changes", changes);
	        });
	      }
	    },

	    // disabled
	    onScopeChanges: null,

	    nodeUpdate: function (node) {
	      this.resolveNodeContents(ux.nodeMap.get(node));
	    },

	    resolveNodeContents: function (nodeMap) {
	      var child, node, range, clone, walker, obj, binder, scopeName, propName, vpropName;

	      node = nodeMap.node;
	      binder = nodeMap.binders[this.name];
	      range = document.createRange();
	      scopeName = nodeMap.scopeName;
	      propName = binder.propName;
	      vpropName = binder.vpropName;
	      obj = ux.scopes[scopeName][propName];

	      range.selectNodeContents(node);
	      range.deleteContents();

	      for (var k in obj) {
	        clone = binder.contents.cloneNode(true);

	        this.resolveBinders(clone, k, ux.scopes[scopeName], propName, vpropName, true);

	        if (clone.children.length) {
	          walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

	          while (walker.nextNode()) {
	            child = walker.currentNode;
	            this.resolveBinders(child, k, ux.scopes[scopeName], propName, vpropName);
	          }
	        }

	        node.appendChild(clone);
	      }
	    },

	    resolveBinders: function (node, key, scope, propName, vpropName, skipEach) {
	      var attr, expr;

	      for (var bName in ux.binders) {
	        attr = ux.binders[bName].attr;

	        if (skipEach && attr === this.attr) {
	          continue;
	        }

	        if (node.hasAttribute(attr)) {
	          expr = node.getAttribute(attr);

	          if (expr === vpropName) {
	            expr = propName + "." + key;
	            node.setAttribute(attr, expr);
	          }

	          ux.binders[bName].nodeUpdate(node, scope, expr);
	        }
	      }
	    }
	  };
	};

/***/ },
/* 16 */
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

	module.exports = function (ux) {
	  return {
	    __proto__: ux.binders.scope.proto,

	    name: "el",

	    init: function () {
	      var _this = this;
	      ux.on("load", function (el) {
	        return _this.load(el);
	      }, this);
	    },

	    nodeUpdate: function (node, scope, expr) {
	      var split, nodeExpr, scopeExpr, parse;

	      parse = function () {
	        return ux.expr.parse(scopeExpr, scope, {
	          filter: {
	            resolveFn: true,
	            args: {
	              node: node,
	              nodeExpr: nodeExpr,
	              scopeExpr: scopeExpr
	            }
	          }
	        });
	      };

	      // node expression : scope expression
	      split = expr.split(":");

	      if (split.length >= 2) {
	        nodeExpr = split[0].trim();
	        scopeExpr = split[1].trim();
	        ux.util.propPath(node, nodeExpr, parse());
	      } else {
	        scopeExpr = expr;
	        parse();
	      }
	    }
	  };
	};

/***/ },
/* 17 */
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

	module.exports = function (ux) {
	  return {
	    __proto__: ux.binders.scope.proto,

	    name: "text",

	    init: function () {
	      var _this = this;
	      ux.on("load", function (el) {
	        return _this.load(el);
	      }, this);
	    },

	    nodeUpdate: function (node, scope, expr) {
	      ux.dom(node).text(ux.expr.parse(expr, scope, {
	        filter: {
	          resolveFn: true
	        }
	      }));
	    }
	  };
	};

/***/ },
/* 18 */
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

	module.exports = function (ux) {
	  return {
	    __proto__: ux.binders.scope.proto,

	    name: "html",

	    init: function () {
	      var _this = this;
	      ux.on("load", function (el) {
	        return _this.load(el);
	      }, this);
	    },

	    nodeUpdate: function (node, scope, expr) {
	      ux.dom(node).html(ux.expr.parse(expr, scope, {
	        filter: {
	          resolveFn: true
	        }
	      }));
	    }
	  };
	};

/***/ },
/* 19 */
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

	module.exports = function (ux) {
	  var proto = ux.binders.scope.proto;

	  return {
	    name: "on",

	    attr: ux.opt.binder.prefix + "on",

	    getNodes: proto.getNodes,
	    build: proto.build,

	    init: function () {
	      var _this = this;
	      ux.on("load", function (el) {
	        return _this.load(el);
	      }, this);
	      ux.on("postLoad", function (el) {
	        return _this.postLoad(el);
	      }, this);
	    },

	    load: function (el) {
	      var _this2 = this;
	      this.build(el, function (data) {
	        ux.nodeMaps.addOnce({
	          node: data.node,
	          nodeScope: data.nodeScope,
	          scopeName: data.scopeName
	        });

	        ux.nodeMaps.setBinder(data.node, _this2, data.expr);
	      });
	    },

	    postLoad: function (el) {
	      var nodeMap, split, nodes, node;

	      nodes = this.getNodes(el, true);

	      for (var i = 0, ln = nodes.length; i < ln; i++) {
	        node = nodes[i];
	        nodeMap = ux.nodeMaps.get(node);

	        // event : listener
	        split = nodeMap.binders[this.name].expr.split(":");

	        ux.dom(node).on(split[0].trim(), ux.scopes[nodeMap.scopeName][split[1].trim()]);
	      }
	    }
	  };
	};

/***/ }
/******/ ])