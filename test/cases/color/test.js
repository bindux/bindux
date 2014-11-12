/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var test   = unitjs;
var color  = ux.color;
var assert = test.assert;

describe('Color', function() {

  it('ux.color', function() {
    test.object(ux.color);
  });

  it('ux.color.names', function() {
    test.object(color.names);
    assert(color.names.white === '#ffffff');
  });

  it('ux.color.toHex', function() {

    assert(color.toHex('#fff') === '#ffffff');
    assert(color.toHex('black') === '#000000');

    assert(color.toHex('rgb(0,0,0)') === '#000000');
    assert(color.toHex('rgb(255,255,255)') === '#ffffff');

    assert(color.toHex('rgb(0,0,0,0.8)') === '#000000');
    assert(color.toHex('rgb(255,255,255,0.8)') === '#ffffff');

    assert(color.toHex('rgba(0,0,0,0.8)') === '#000000');
    assert(color.toHex('rgba(255,255,255,0.8)') === '#ffffff');
  });

  it('ux.color.toRgb', function() {
    assert(color.toRgb('255,255,255') === 'rgb(255,255,255)');
    assert(color.toRgb('0,0,0') === 'rgb(0,0,0)');

    assert(color.toRgb('#000000') === 'rgb(0,0,0)');
    assert(color.toRgb('#ffffff') === 'rgb(255,255,255)');

    assert(color.toRgb('#000000', 0.8) === 'rgb(0,0,0,0.8)');
    assert(color.toRgb('#ffffff', 0.8) === 'rgb(255,255,255,0.8)');
    assert(color.toRgb('#ffffff', '0.8') === 'rgb(255,255,255,0.8)');
  });
});