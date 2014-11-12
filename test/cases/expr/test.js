/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var test = unitjs;

describe('Expression', function() {

  it('ux.expr', function() {
    test.object(ux.expr);
  });

  it('ux.expr.parse()', function() {
    test.function(ux.expr.parse);
  });
});