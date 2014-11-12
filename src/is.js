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

  ux.is = {
    undef(value) {
      return value === void 0;
    },

    fn(value) {
      return typeof value === 'function';
    },

    obj(value) {
      return value && typeof value === 'object';
    },

    array(value) {
      return Array.isArray(value);
    },

    str(value) {
      return typeof value === 'string';
    },

    num(value) {
      return typeof value === 'number';
    },

    bool(value) {
      return typeof value === 'boolean';
    },

    query(value) {
      return value instanceof ux.Query && this.num(value._uid);
    },

    desktop() {
      var ua = navigator.userAgent.toLowerCase();

      return ua.indexOf('mobile') === -1
        && ua.indexOf('phone') === -1
        && typeof window.orientation === 'undefined'
      ;
    },

    // mobile and tablet
    mobile() {
      var ua = navigator.userAgent.toLowerCase();

      return typeof window.orientation !== 'undefined'
        || ua.indexOf('mobile') !== -1
        || ua.indexOf('phone') !== -1
      ;
    },

    node(value) {
      return this.obj(Node) ? value instanceof Node
        : value
          && this.obj(value)
          && this.num(value.nodeType)
          && value.nodeType !== 0
          && this.str(value.nodeName)
      ;
    },

    el(value) {
      return this.obj(HTMLElement) ? value instanceof HTMLElement // <= DOM2
        : value
          && this.obj(value)
          && value !== null
          && value.nodeType === 1
          && this.str(value.nodeName)
      ;
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
    valid(is, value, message) {

      if(this[is](value)) {
        return value;
      }

      message = message || 'The given value is not valid';

      throw new TypeError(message);
    }
  };
};