/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var test     = unitjs;
var assert   = test.assert;
var nodeMaps = ux.nodeMaps;
var mainNode = ux.dom('main').get();

describe('ux.nodeMaps', function() {

  it('ux.nodeMaps.addOnce()', function() {

    assert(!nodeMaps.has(mainNode));

    test.object(nodeMaps.addOnce({node: mainNode, someProp: 'great'}))
      .isInstanceOf(WeakMap);

    assert(nodeMaps.has(mainNode));
    assert(nodeMaps.get(mainNode).someProp === 'great');
  });

  it('ux.nodeMaps.setBinder()', function() {
    var binder = { name: 'mock', a: 'va'};
    var expr   = 'foo|bar';

    assert(!ux.binders.mock);

    nodeMaps.addOnce({ node: mainNode });

    test
      .object(nodeMaps.setBinder(mainNode, binder, expr))
        .isIdenticalTo(nodeMaps)

      .object(nodeMaps.get(mainNode).binders.mock)
        .hasProperty('binder', binder)
        .hasProperty('expr', expr)
    ;
  });

  describe('Map', function() {

    it('is a WeapMap', function() {
      test
        .object(nodeMaps)
          .isInstanceOf(WeakMap)
          .hasProperty('has')
          .hasProperty('get')
          .hasProperty('set')
          .hasProperty('delete')
          .hasProperty('clear')
        ;
    });

    it('should be able to check the existence', function() {
      nodeMaps.addOnce({ node: mainNode });
      assert(nodeMaps.has(mainNode));

      nodeMaps.delete(mainNode);
      assert(!nodeMaps.has(mainNode));
    });

    it('should be store a node reference', function() {
      var nodeContents = mainNode.innerHTML;

      nodeMaps.addOnce({ node: mainNode });
      assert(nodeMaps.get(mainNode).node === mainNode);

      nodeMaps.get(mainNode).node.innerHTML = 'edited';
      assert(mainNode.innerHTML === 'edited');

      assert(ux.dom('main').get() === nodeMaps.get(mainNode).node);
    });

    it('should be able to add a node', function() {
      var data = {a: new Date()};

      if(nodeMaps.has(mainNode)) {
        nodeMaps.delete(mainNode);
      }

      assert(!nodeMaps.has(mainNode));
      assert(nodeMaps.set(mainNode, data));
      assert(nodeMaps.get(mainNode) === data);
    });

    it('should be able to get a node', function() {
      var data = {a:'v1'};

      if(nodeMaps.has(mainNode)) {
        nodeMaps.delete(mainNode);
      }

      assert(nodeMaps.set(mainNode, data));
      assert(nodeMaps.get(mainNode) === data
        && nodeMaps.get(mainNode).a === 'v1');
    });

    it('should be able to set a node', function() {
      var data = {a:'v1'};

      if(nodeMaps.has(mainNode)) {
        nodeMaps.delete(mainNode);
      }

      assert(nodeMaps.set(mainNode, data));
      assert(nodeMaps.get(mainNode) === data);

      nodeMaps.get(mainNode).b = 'v2';
      assert(nodeMaps.get(mainNode).b === 'v2');

      nodeMaps.set(mainNode, {c: 'v3'});

      test
        .object(nodeMaps.get(mainNode))
          .hasNotProperty('a', 'v1')
          .hasNotProperty('b', 'v2')
          .hasProperty('c', 'v3')
      ;

    });

    it('should be able to delete a node', function() {
      nodeMaps.addOnce({ node: mainNode });
      assert(nodeMaps.has(mainNode));

      nodeMaps.delete(mainNode);
      assert(!nodeMaps.has(mainNode));
    });

    it('should be able to clear all maps', function() {
      var bodyNode = ux.dom('body').get();

      nodeMaps.addOnce({ node: mainNode });
      nodeMaps.addOnce({ node: bodyNode });

      assert(nodeMaps.has(mainNode));
      assert(nodeMaps.has(bodyNode));

      nodeMaps.clear();

      assert(!nodeMaps.has(mainNode));
      assert(!nodeMaps.has(bodyNode));
    });
  });
});