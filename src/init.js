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

  ux.init = () => {

    var load = (node) => {
      ux.on('preLoad', (el) => ux.emit('load', el));
      ux.on('load', (el) => ux.emit('postLoad', el));

      ux.emit('preLoad', node);
    };

    ux.dom.onLoaded(() => {

      var binder;

      for(var k in ux.binders) {

        binder = ux.binders[k];

        if(typeof binder.init === 'function') {
          binder.init();
          binder.init = true;
        }
      }

      // load document at the end
      load(document);

      ux.init = true;
    });
  };
};