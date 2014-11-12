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

  ux.html = {

    /**
     * Get the first HTML tag.
     *
     * @param {string} str
     * @return {string|null} Returns the tag (lowercase) if found, `null` otherwise.
     */
    getFirstTag(str) {
      var match;

      if(str.indexOf('<') === -1) {
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
    getAttrs(str) {
      var attr, value, rxStartTag, startTag, rxAttrs, match, attrs;

      // regex to pick out start tag from start of element's HTML.
      rxStartTag = /^<\w+\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[\w\-.:]+))?)*\s*\/?>/;
      startTag   = str.match(rxStartTag);
      startTag   = startTag ? startTag[0] : '';

      // regex to pick out attribute name and (optional) value from start tag.
      rxAttrs = /\s+([\w\-.:]+)(\s*=\s*(?:"([^"]*)"|'([^']*)'|([\w\-.:]+)))?/g;
      match   = rxAttrs.exec(startTag);
      attrs   = {};

      while(match) {

        // attribute name in $1.
        attr = match[1];

        // assume no value specified.
        value = match[1];

        // if match[2] is set, then attribute has a value.
        if (match[2]) {

          // attribute value is in $3, $4 or $5.
            value = match[3] ? match[3]
            : match[4] ? match[4]
            : match[5];
        }

        attrs[attr] = value;
        match       = rxAttrs.exec(startTag);
      }

      return attrs;
    },

    /**
     * HTML/string to Node (`Element` or `TextNode`).
     *
     * @param {string} str
     * @return {Node} Node Returns an object `Element` or `TextNode`.
     */
    toNode(str) {
      var el = document.createElement('div');

      el.insertAdjacentHTML('beforeend', str);
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
    stripTags(str, allowed) {
      var tags, comments;

      tags     = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      comments = /<!--[\s\S]*?-->/gi;

      // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
      allowed = (
        ( (allowed || '') + '' )
        .toLowerCase()
        .match(/<[a-z][a-z0-9]*>/g) || []
      )
      .join('');

      return str
        .replace(comments, '')
        .replace(tags, ($0, $1)
          => allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '')
      ;
    }
  };
};