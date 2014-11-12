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

  ux.color =  {
    names:{
      aqua    : '#00ffff', black  : '#000000', blue  : '#0000ff',
      fuchsia : '#ff00ff', gray   : '#808080', green : '#008000',
      lime    : '#00ff00', maroon : '#800000', navy  : '#000080',
      olive   : '#808000', purple : '#800080', red   : '#ff0000',
      silver  : '#c0c0c0', teal   : '#008080', white : '#ffffff',
      yellow  : '#ffff00'
    },

    /**
     * Hex to RGB(A)
     */
    toRgb(color, alpha) {

      color = '0x' + this.toHex(color).substring(1);
      color = [(color >> 16) & 255, (color >> 8) & 255, color & 255];

      if(!ux.is.undef(alpha)) {
        color.push(alpha);
      }

      return 'rgb(' + color.join(',') +')';
    },

    toHex(color) {
      var tem, i, c, A;

      i = 0;
      c = color ? color.toString().toLowerCase(): '';

      if(/^#[a-f0-9]{3,6}$/.test(c)){
        if(c.length < 7){
          A = c.split('');
          c = A[0] + A[1] + A[1] + A[2] + A[2] + A[3] + A[3];
        }

        return c;
      }

      if(/^[a-z]+$/.test(c)){
        return this.names[c] || '';
      }

      c = c.match(/\d+(\.\d+)?%?/g) || [];

      if(c.length < 3) {
        return '';
      }

      c = c.slice(0, 3);

      while(i < 3) {

        tem = c[i].indexOf('%') != -1 ? Math.round(parseFloat(c[i]) * 2.55)
          : parseInt(c[i]);

        if(tem < 0 || tem > 255) {
          c.length = 0;
        }else {
          c[i++] = ux.util.padLeft(tem.toString(16), 2);
        }
      }

      return c.length == 3 ? '#'+c.join('').toLowerCase() : '';
    }
  };
};