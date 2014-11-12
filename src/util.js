/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

module.exports = (ux) => {

  // options
  ux.opt.deprecation      = true;
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
    each(array, fn, context) {
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
    merge(obj, from) {
      var ln = arguments.length;

      if (ln < 2) {
        throw new Error('There should be at least 2 arguments passed to ux.util.merge()');
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
    mergeRecursive(obj, from) {
      var ln = arguments.length;

      if (ln < 2) {
        throw new Error('There should be at least 2 arguments passed to ux.util.mergeRecursive()');
      }

      for (var i = 1; i < ln; i++) {
        for (var p in arguments[i]) {
          if (obj[p] && typeof obj[p] === 'object') {
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
    grep: function( elems, callback, invert ) {
      var matches, ln, callbackExpect, callbackInverse;

      matches = [];
      callbackExpect = !invert;

      // Go through the array, only saving the items
      // that pass the validator function
      for (var i = 0, ln = elems.length; i < ln; i++ ) {

        callbackInverse = !callback( elems[ i ], i );

        if ( callbackInverse !== callbackExpect ) {
          matches.push( elems[ i ] );
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
    propPath(obj, path, val) {
      var paths, final, p;

      paths = ux.is.array(path) ? path : path.split('.');
      final = paths.pop().trim();

      while(p = paths.shift()) {

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
    deprecate(fn, msg = '', scope = null) {
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
    padLeft(str, ln = 2, char = '0') {

      while(str.length < ln) {
        str = char + str;
      }

      return str;
    },

    toArray(obj) {
      return Array.prototype.slice.call(obj, 0);
    }
  };
};