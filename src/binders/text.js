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

  return {

    __proto__ : ux.binders.scope.proto,

    name : 'text',

    init() {
      ux.on('load', (el) => this.load(el), this);
    },

    nodeUpdate(node, scope, expr) {
      ux.dom(node).text(ux.expr.parse(expr, scope, {
        filter: {
          resolveFn: true
        }
      }));
    }
  };
};