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

  var proto = ux.binders.scope.proto;

  return {

    name : 'on',

    attr: ux.opt.binder.prefix + 'on',

    getNodes: proto.getNodes,
    build: proto.build,

    init() {
      ux.on('load', (el) => this.load(el), this);
      ux.on('postLoad', (el) => this.postLoad(el), this);
    },

    load(el) {
      this.build(el, (data) => {
        ux.nodeMaps.addOnce({
          node      : data.node,
          nodeScope : data.nodeScope,
          scopeName : data.scopeName
        });

        ux.nodeMaps.setBinder(data.node, this, data.expr);
      });
    },

    postLoad(el) {
      var nodeMap, split, nodes, node;

      nodes = this.getNodes(el, true);

      for(var i = 0, ln = nodes.length; i < ln; i++) {
        node    = nodes[i];
        nodeMap = ux.nodeMaps.get(node);

        // event : listener
        split = nodeMap.binders[this.name].expr.split(':');

        ux.dom(node).on(
          split[0].trim(),
          ux.scopes[nodeMap.scopeName][split[1].trim()]
        );
      }
    }
  };
};