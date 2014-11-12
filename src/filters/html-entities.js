/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var reEscapedHtml, reUnescapedHtml, htmlEscapes, htmlUnescapes;

/**
 * Extracted from Lo-Dash (https://lodash.com/)
 * and adapted for BindUX.
 */

// Used to match HTML entities and HTML characters
reEscapedHtml   = /&(?:amp|lt|gt|quot|#39|#96);/g;
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
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

// Used to map HTML entities to characters
htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
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
  str = str == null ? '' : String(str);

  return str && (reUnescapedHtml.lastIndex = 0, reUnescapedHtml.test(str))
    ? str.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
    : str;
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
  str = str == null ? '' : String(str);

  return str && (reEscapedHtml.lastIndex = 0, reEscapedHtml.test(str))
    ? str.replace(reEscapedHtml, (chr) => htmlUnescapes[chr])
    : str;
}

module.exports = (ux) => {
  ux.filters.e = ux.filters.escape = escape;
  ux.filters.unescape = unescape;
};
