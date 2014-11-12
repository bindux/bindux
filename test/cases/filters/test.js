/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var test    = unitjs;
var assert  = test.assert;
var $di     = test.$di;
var filters = ux.filters;
var filter  = ux.filter;

test.$di.set('escapeVal', {
  raw: '<div>"\'a\'" &=foo?</div>',
  escaped: '&lt;div&gt;&quot;&#39;a&#39;&quot; &amp;=foo?&lt;/div&gt;'
});

describe('Filters', function() {

  it('ux.filters.uc', function() {
    assert(filter('aAaa', 'uc') === 'AAAA');
  });

  it('ux.filters.ucFirst', function() {
    assert(filter('abC', 'ucFirst') === 'AbC');
  });

  it('ux.filters.lc', function() {
    assert(filter('aBcD', 'lc') === 'abcd');
  });

  it('ux.filters.lcFirst', function() {
    assert(filter('ABcD', 'lcFirst') === 'aBcD');
  });

  it('ux.filters.rmSpace', function() {
    assert(filter(' A B  c   D ', 'rmSpace') === 'ABcD');
  });

  describe('HTML entities', function() {

    it('ux.filters.escape', function() {
      var escapeVal = $di.get('escapeVal');

      assert(escapeVal.raw
        && filter(escapeVal.raw, 'escape') === escapeVal.escaped);
    });

    it('ux.filters.e', function() {
      var escapeVal = $di.get('escapeVal');

      assert(filters.escape === filters.e);
      assert(escapeVal.raw
        && filter(escapeVal.raw, 'e') === escapeVal.escaped);
    });

    it('ux.filters.unescape', function() {
      var escapeVal = $di.get('escapeVal');

      assert(escapeVal.raw
        && filter(escapeVal.escaped, 'unescape') === escapeVal.raw);
    });
  })

  describe('context', function() {

    it.skip('should be able to bind', function() {

    });

    it.skip('should pass arguments', function() {

    });
  });

  it('should be able to create a filter', function() {

    assert(!ux.filters._spy);

    ux.filters._spy = test.spy();
    filter('a','uc|_spy');

    assert(ux.filters._spy.calledOnce);
    assert(ux.filters._spy.calledWith('A'));
  });

  it('should be able to chain by pipeline', function() {
    assert(filter(' A A A ', 'rmSpace|lc|ucFirst') === 'Aaa');
  });
});