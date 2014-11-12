/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

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
module.exports = (ux) => {

  ux.expr = {

    parser(name) {
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
      pipe(expression, scope, context) {

        var expr, filterCtx, filters;

        filters   = '';

        if(context && context.filter) {
         filterCtx = context.filter;
        }

        // if prop.prop | filter | filter
        if(expression.indexOf('|') !== -1) {

          // scope | filter(s)
          filters    = expression.split('|');
          expression = filters.shift();
        }

        if(expression.indexOf('.') === -1) {
          return ux.filter(scope[expression], filters, filterCtx);
        }

        // split prop.prop.prop
        expr = expression.split('.');

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
    parse(expression = '', scope, opt = {}) {
      var only, context, ln;

      only    = opt.only;
      context = opt;

      if(only) {

        // apply only once parsers
        if(ux.is.str(only)) {
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