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

describe('ux.util', function() {

  it.skip('ux.util.each()', function() {

  });

  it('ux.util.merge()', function() {
    var a, b, obj;

    test
      .given(function() {
        obj = {};
        a = {
          k1:'v1', k2: {b: 'v2'}, k3: {a: 'v3'}
        };

        b = {
          k2: 'replace 2',
          k4: 4
        };
      })
      .when(function() {
        obj = ux.util.merge(a, b)
      })
      .then(function() {
        test
          .object(obj)

          .array(Object.keys(obj))
            .is(['k1', 'k2', 'k3', 'k4'])

          .object(obj)
            .is({
              k1: 'v1',
              k2: 'replace 2',
              k3: { a: 'v3' },
              k4: 4
            })
        ;
      })
    ;

  });

  it('ux.util.mergeRecursive()', function() {
    var a, b, obj;

    test
      .given(function() {
        obj = {};
        a = {
          k1:'v1', k2:2, k3: {
            a: { aa: { saa: 'vaa', saa2: 'vaa2' } }
          }
        };

        b = {
          k2: 'replace 2',
          k3: {
            a: { aa: { saa: 'replace vaa'} },
            b: 'b added'
          },
          k4: 4
        };
      })
      .when(function() {
        obj = ux.util.mergeRecursive(a, b)
      })
      .then(function() {
        test
          .object(obj)

          .array(Object.keys(obj))
            .is(['k1', 'k2', 'k3', 'k4'])

          .object(obj)
            .is({
              k1: 'v1',
              k2: 'replace 2',
              k3: {
                a: { aa: { saa: 'replace vaa', saa2: 'vaa2' } },
                b: 'b added'
              },
              k4: 4
            })
        ;
      })
    ;
  });

  it.skip('ux.util.grep()', function() {

  });

  it.skip('ux.util.propPath()', function() {

  });

  it.skip('ux.util.deprecate()', function() {

  });

  it.skip('ux.util.padLeft()', function() {

  });

  it('ux.util.toArray()', function() {

    // array like (example: arguments)
    test.array(ux.util.toArray({0: 'a', '1': 'b', 2: 3, length: 3}))
      .is(['a', 'b', 3]);
  });
});