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

  ux.binders = {
    scope : require('./binders/scope')(ux)
  };

  // depends of ux.binders.scope
  ux.binders.ctrl = require('./binders/ctrl')(ux);
  ux.binders.each = require('./binders/each')(ux);
  ux.binders.el   = require('./binders/el')(ux);
  ux.binders.text = require('./binders/text')(ux);
  ux.binders.html = require('./binders/html')(ux);
  ux.binders.on   = require('./binders/on')(ux);
};

