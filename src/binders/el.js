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

    name : 'el',

    init() {
      ux.on('load', (el) => this.load(el), this);
    },

    nodeUpdate(node, scope, expr) {
      var split, nodeExpr, scopeExpr, parse;

      parse = () => ux.expr.parse(scopeExpr, scope, {
        filter: {
          resolveFn: true,
          args: {
            node: node,
            nodeExpr: nodeExpr,
            scopeExpr: scopeExpr
          }
        }
      });

      // node expression : scope expression
      split = expr.split(':');

      if(split.length >= 2) {
        nodeExpr  = split[0].trim();
        scopeExpr = split[1].trim();
        ux.util.propPath(node, nodeExpr, parse());
      }else{
        scopeExpr = expr;
        parse();
      }
    }
  };
};