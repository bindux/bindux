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
      var name, nodes, node, ln;

      // resolve controllers
      nodes = this.getNodes(el, true);
      ln    = nodes.length;

      for(var i = 0; i < ln; i++) {

        node = nodes[i];
        name = node.getAttribute(this.attr);

        if(!node.getAttribute('n-scope')) {
          node.setAttribute('n-scope', name);
        }

        // if is not preloaded
        if(ux.is.fn(ux.ctrls[name])) {
          ux.ctrls[name] = {
            node: node,
            ctrl: ux.ctrls[name]
          };

          ux.emit('ctrls.' + name + '.preLoaded');
        }
      }
    },

    postLoad() {
      var ctrl;

      for(var name in ux.ctrls) {
        ctrl = ux.ctrls[name];

        // if state is preloaded
        if(ctrl && ux.is.obj(ctrl) && ctrl.node  && ux.is.fn(ctrl.ctrl)) {
          ux.emit('ctrls.' + name + '.preBoot');

          ux.ctrls[name].ctrl = new ctrl.ctrl(
            ux.scopes[name],
            ctrl.node
          );

          ux.emit('ctrls.' + name + '.postBoot');
        }
      }
    }
  };
};