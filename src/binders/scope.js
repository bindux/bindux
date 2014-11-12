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

  var proto, scopeObserved, getNodes;

  scopeObserved = {};

  getNodes = (el, ctx, force) => {

    if(force) {
      el = el === document ? ux.dom(null, el) : ux.dom(el);
      ctx.nodes = el.select('['+ ctx.attr +']').nodes;
    }

    return ctx.nodes;
  };

  // proto binder
  proto = {

    getNodes(el, force) {
      return getNodes(el, this, force);
    },

    nodes: [],

    build(el, fn) {
      var expr, nodes, nodeScope, scopeName, ln, checkNode;

      nodes = this.getNodes(el, true);
      ln    = nodes.length;

      checkNode = (idx, ns, expression, attr) => {
        if(!ns) {
          throw new ReferenceError(
            'Scope not found for the binder ' + attr
            + '="'+ expression + '" (node #' + idx+')'
          );
        }
      };

      // Resolve all n-text and the binded scope
      for(var i = 0; i < ln; i++) {
        expr      = nodes[i].getAttribute(this.attr);
        scopeName = nodes[i].getAttribute('n-scope');

        if(scopeName) {
          nodeScope = nodes[i];
          checkNode(i, nodeScope, expr, this.attr);
        }else{
          nodeScope = ux.dom(nodes[i]).findParent('[n-scope]').nodes[0];
          checkNode(i, nodeScope, expr, this.attr);
          scopeName = nodeScope.getAttribute('n-scope');
        }

        fn({
          node: nodes[i],
          expr: expr,
          scopeName: scopeName,
          nodeScope: nodeScope
        });
      }
    },

    init() {

      if(this.preLoad) {
        ux.on('preLoad', (el) => this.preLoad(el), this);
      }

      if(this.load) {
        ux.on('load', (el) => this.load(el), this);
      }

      if(this.postLoad) {
        ux.on('postLoad', (el) => this.postLoad(el), this);
      }
    },

    load(el) {
      this.build(el, (data) => {
        ux.nodeMaps.addOnce({
          node      : data.node,
          nodeScope : data.nodeScope,
          scopeName : data.scopeName
        });

        ux.nodeMaps.setBinder(data.node, this, data.expr);

        if(this.onScopeChanges) {
          ux.on('scopes.' + data.scopeName + '.changes',
            (changes) => this.onScopeChanges(data.node, changes),
            this
          );
        }
      });
    },

    /**
     * Listener on scopes changes called on event `scopes.{scopeName}.changes`.
     * @param {Element} node  The node element.
     * @param {object} changes
     */
    onScopeChanges(node, changes) {
      var ns = ux.nodeMaps.get(node);

      this.nodeUpdate(
        ns.node,
        ux.scopes[ns.scopeName],
        ns.binders[this.name].expr,
        changes
      );
    }
  };

  // resolve attribute
  Object.defineProperty(proto, 'attr', {
    get: function() {
      return ux.binderAttr(this.name);
    }
  });

  // ux.binders.scope
  return {
    proto : proto,
    name  : 'scope',
    attr  : ux.opt.binder.prefix + 'scope',

    getNodes(el, force) {
      return getNodes(el, this, force);
    },

    init() {
      ux.on('load', (el) => this.load(el), this);
      ux.on('postLoad', () => this.postLoad(), this);
    },

    load(el) {
      var name, nodes;

      nodes = this.getNodes(el, true);

      for(var i = 0, ln = nodes.length; i < ln; i++) {
        name = nodes[i].getAttribute(this.attr);

        if(!ux.scopes[name]) {
          ux.scopes[name] = {};
        }
      }
    },

    postLoad() {
      for(var name in ux.scopes) {

        if(scopeObserved[name] === true) {
          continue;
        }

        Object.observe(ux.scopes[name], (changes)
          => ux.emit('scopes.' + name + '.changes', changes)
        );

        scopeObserved[name] = true;
      }
    }
  };
};