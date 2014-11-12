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
var assert = test.assert;
var is     = ux.is;
var fn     = function(){};

describe('ux.is', function() {

  it('is undef', function() {
    assert(is.undef() && is.undef(undefined) && is.undef(void 0));
    assert(!is.undef(0) && !is.undef(null) && !is.undef(false));
    assert(!is.undef({}) && !is.undef([]) && !is.undef(''));
  });

  it('is fn', function() {
    assert(is.fn(fn) && is.fn(RegExp));
    assert(!is.fn({}));
  });

  it('is obj', function() {
    assert(is.obj({}) && is.obj([]));
    assert(!is.obj() && !is.obj('') && !is.obj(fn));
  });

  it('is array', function() {
    assert(is.array([]));
    assert(!is.array() && !is.array({}));
  });

  it('is str', function() {
    assert(is.str(''));
    assert(!is.str() && !is.str({}));
  });

  it('is num', function() {
    assert(is.num(0) && is.num(10));
    assert(!is.num(null) && !is.num(false) && !is.num());
    assert(!is.num(void 0) && !is.num(undefined));
  });

  it('is bool', function() {
    assert(is.bool(true) && is.bool(false));
    assert(!is.bool(null) && !is.bool(0) && !is.bool(1) && !is.bool());
    assert(!is.bool(void 0) && !is.bool(undefined));
  });

  it('is query', function() {
    assert(is.query(ux.dom('body')));
    assert(!is.query(document.querySelectorAll('body')));
    assert(!is.query());
  });

  it.skip('is desktop', function() {

  });

  it.skip('is mobile', function() {

  });

  it('is node', function() {
    assert(is.node(ux.dom('body').get()));
    assert(is.node(document.querySelector('body')));
    assert(is.node(document.createElement('div')));
    assert(is.node(document.createTextNode('hey!')));
    assert(!is.node() && !is.node({}) && !is.node([]));
  });

  it('is el', function() {
    assert(is.el(ux.dom('body').get()));
    assert(is.el(document.querySelector('body')));
    assert(is.el(document.createElement('div')));
    assert(!is.el(document.createTextNode('hey!')));
    assert(!is.el() && !is.el({}) && !is.el([]));
  });

  it('is valid', function() {

    assert(is.valid('str', 'hello'));

    test
      .exception(function() {
        is.valid('str', 0);
      })
        .isInstanceOf(TypeError)
        .hasMessage(/not valid/)
    ;
  });
});