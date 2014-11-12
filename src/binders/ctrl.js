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

    name: 'ctrl',
    attr: ux.opt.binder.prefix + 'ctrl',

    getNodes: proto.getNodes,

    init() {
      ux.on('preLoad', (el) => this.preLoad(el), this);
      ux.on('postLoad', () => this.postLoad(), this);
    },

    preLoad(el) {
      var ctrl, nodes, node, ln;

      // resolve controllers
      nodes = this.getNodes(el, true);
      ln    = nodes.length;

      for(var i = 0; i < ln; i++) {

        node = nodes[i];
        ctrl = node.getAttribute(this.attr);

        if(!node.getAttribute('n-scope')) {
          node.setAttribute('n-scope', ctrl);
        }

        ux.ctrls[ctrl] = {
          node: node,
          ctrl: ux.ctrls[ctrl]
        };

        ux.emit('ctrls.' + ctrl + '.preLoaded');
      }
    },

    postLoad() {

      for(var ctrl in ux.ctrls) {
        ux.emit('ctrls.' + ctrl + '.preBoot');

        ux.ctrls[ctrl].ctrl = new ux.ctrls[ctrl].ctrl(
          ux.scopes[ctrl],
          ux.ctrls[ctrl].node
        );

        ux.emit('ctrls.' + ctrl + '.postBoot');
      }
    }
  };
};