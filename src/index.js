/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var ux, Evemit;

Evemit = require('evemit');


/**
 * @constructor
 */
function Bindux() {
  Evemit.call(this);
}

Bindux.prototype = Object.create(Evemit.prototype, {
  constructor: { value: Bindux }
});

ux = new Bindux();

ux.opt    = {
  binder: {
    prefix: 'n-'
  }
};

ux.scopes = {};
ux.ctrls  = {};

ux.binderAttr = (name) => ux.opt.binder.prefix + name;

ux.noConflict = () => {
  delete window.ux;
  delete window.bindux;
  return ux;
};

// load API
require('./is')(ux);
require('./color')(ux);
require('./expr')(ux);
require('./dom')(ux);
require('./filters')(ux);
require('./util')(ux);
require('./html')(ux);
require('./nodemap')(ux);
require('./binders')(ux);
require('./init')(ux);

module.exports = window.ux = window.bindux = ux;
