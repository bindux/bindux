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

    uc (str){
      str += '';
      return str.toUpperCase();
    },

    ucFirst (str){
      str += '';
      return str.charAt(0).toUpperCase() + str.substr(1);
    },

    lc (str){
      str += '';
      return str.toLowerCase();
    },

    lcFirst (str){
      str += '';
      return str.charAt(0).toLowerCase() + str.substr(1);
    },

    rmSpace(str) {
      return str.split(' ').join('');
    }
  };

  ux.filter = (value, filters, context) => {

    if(ux.is.fn(value) && context && context.resolveFn) {
      value = value.call(
        context.bind ? context.bind : null,
        context.args ? context.args : []
      );
    }

    if(!filters) {
      return value;
    }

    if(!ux.is.array(filters)) {
      filters = filters.split('|');
    }

    for (var i = 0, ln = filters.length; i < ln; i++) {
      value = ux.filters[filters[i].trim()](value);
    }

    return value;
  };

  // load filters: escape / e, unescape
  require('./filters/html-entities')(ux);
};