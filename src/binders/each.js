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
  var scopeObserved = [];

  return {
    __proto__ : ux.binders.scope.proto,

    name : 'each',

    init() {
      ux.on('load', (el) => this.load(el), this);
      ux.on('postLoad', (el) => this.postLoad(el), this);
    },

    load(el) {
      this.build(el, (data) => {
        var nodeMap, binder, expr, splitExpr, scopeName, vpropName, propName;

        ux.nodeMaps.addOnce({
          node      : data.node,
          nodeScope : data.nodeScope,
          scopeName : data.scopeName
        });

        ux.nodeMaps.setBinder(data.node, this, data.expr);

        nodeMap   = ux.nodeMaps.get(data.node);
        binder    = nodeMap.binders[this.name];
        expr      = binder.expr;
        splitExpr = expr.split(' ');
        vpropName = splitExpr.shift().trim();
        propName  = splitExpr.pop().trim();
        scopeName = data.scopeName;

        binder.propName  = propName;
        binder.vpropName = vpropName;
        binder.contents  = nodeMap.node.cloneNode(true);

        ux.on(
          'binders.each.scopes.' + scopeName + '.' + propName + '.changes',
          () => this.resolveNodeContents(nodeMap)
        );

        ux.on('scopes.' + data.scopeName + '.changes', (changes) => {
          changes.forEach((change) => {
            if(change.type === 'update'
              && change.name === binder.propName
              && change.oldValue) {
              this.resolveNodeContents(nodeMap);
            }
          });
        }, this);
      });
    },

    postLoad() {
      var nodes, node, nodeMap, scopeName, propName, obj;

      // nodes: each
      nodes = this.nodes;

      for(var i = 0, ln = nodes.length; i < ln; i++) {

        node      = nodes[i];
        nodeMap   = ux.nodeMaps.get(node);
        scopeName = nodeMap.scopeName;
        propName  = nodeMap.binders[this.name].propName;
        obj       = ux.scopes[scopeName][propName];

        if(scopeObserved.indexOf(obj) !== -1) {
          continue;
        }

        Object.observe(obj, (changes)
          => ux.emit(
              'binders.each.scopes.' + scopeName + '.' + propName + '.changes',
              changes
            )
        );
      }
    },

    // disabled
    onScopeChanges: null,

    nodeUpdate(node) {
      this.resolveNodeContents(ux.nodeMap.get(node));
    },

    resolveNodeContents(nodeMap) {
      var child, node, range, clone, walker,
        obj, binder, scopeName, propName, vpropName;

      node      = nodeMap.node;
      binder    = nodeMap.binders[this.name];
      range     = document.createRange();
      scopeName = nodeMap.scopeName;
      propName  = binder.propName;
      vpropName = binder.vpropName;
      obj       = ux.scopes[scopeName][propName];

      range.selectNodeContents(node);
      range.deleteContents();

      for(var k in obj) {
        clone = binder.contents.cloneNode(true);

        this.resolveBinders(
          clone, k, ux.scopes[scopeName], propName, vpropName, true
        );

        if(clone.children.length) {
          walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

          while(walker.nextNode()) {
            child = walker.currentNode;
            this.resolveBinders(
              child, k, ux.scopes[scopeName], propName, vpropName
            );
          }
        }

        node.appendChild(clone);
      }
    },

    resolveBinders(node, key, scope, propName, vpropName, skipEach) {
      var attr, expr;

      for(var bName in ux.binders) {
        attr = ux.binders[bName].attr;

        if(skipEach && attr === this.attr) {
          continue;
        }

        if(node.hasAttribute(attr)) {
          expr = node.getAttribute(attr);

          if(expr === vpropName) {
            expr = propName + '.' + key;
            node.setAttribute(attr, expr);
          }

          ux.binders[bName].nodeUpdate(node, scope, expr);
        }
      }
    }
  };
};