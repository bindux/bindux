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

  ux.nodeMaps = new WeakMap();

  ux.nodeMaps.addOnce = function(data) {

    if(this.has(data.node)) {
      return this;
    }

    if(!data.binders) {
      data.binders = {};
    }

    return this.set(data.node, data);
  };

  ux.nodeMaps.setBinder = function(node, binder, expr) {
    this.get(node).binders[binder.name] = { binder, expr};
    return this;
  };
};