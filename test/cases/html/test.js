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
var html   = ux.html;

describe('HTML', function() {

  it('ux.html', function() {
    test.object(ux.html)
      .isIdenticalTo(html);
  });

  it('ux.html.getFirstTag()', function() {
    var str, attr;

    str  = 'some text <div id="layout" class="active">contents</div> ...';
    attr = html.getFirstTag(str);

    test.string(attr)
      .isIdenticalTo('div');
  });

  it('ux.html.getAttrs()', function() {
    var str, attrs;

    str = '<div id="layout" class="active">' +
     '<span class="something">contents</span>' +
     '</div>';

    test.object(html.getAttrs(str))
      .is({id: "layout", class: "active"});
  });

  it('ux.html.toNode()', function() {
    var txtNode = html.toNode('contents');
    var element = html.toNode('<strong>contents</strong>');

    assert(txtNode.nodeType === Node.TEXT_NODE);
    assert(element.nodeType === Node.ELEMENT_NODE);
    assert(element.nodeName.toLowerCase() === 'strong');
  });

  it('ux.html.stripTags()', function() {
    var htmlString = '<p><span class="something">Who</span></p>' +
      ' <br /><b>are</b> <i>you</i>';

    test
      .string(html.stripTags(htmlString))
        .is('Who are you')

      .string(html.stripTags(htmlString, '<i><b>'))
        .is('Who <b>are</b> <i>you</i>')
    ;
  });
});