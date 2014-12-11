/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var queryId  = -1;
var dataPriv = new WeakMap();

module.exports = (ux) => {

  var is = ux.is;

  /**
   * The root node at which to begin the `TreeWalker`'s traversal.
   *
   * @param {Node} root The root Node of this `TreeWalker` traversal.
   * Typically this will be an `element` owned by the `document`.
   *
   * @param {number} [whatToShow = NodeFilter.SHOW_ALL] An optional
   * unsigned long representing a bitmask created by combining the
   * constant properties of `NodeFilter`. It is a convenient way of filtering
   * for certain types of node. It defaults to `0xFFFFFFFF` representing
   * the `SHOW_ALL` constant.
   *
   * @param {function} [filter] An optional `NodeFilter`, that is an object
   * with a method `acceptNode`, which is called by the `TreeWalker`
   * to determine whether or not to accept a node that has passed
   * the `whatToShow` check.
   *
   * @return {array} Nodes list.
   *
   * @see https://developer.mozilla.org/en/docs/Web/API/document.createTreeWalker
   */
  function traverse(root, whatToShow = NodeFilter.SHOW_ALL, filter) {
    var walker, nodes, node;

    walker = document.createTreeWalker(root, whatToShow, filter);
    nodes  = [];

    while(node = walker.nextNode()) {
      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Execute a script in a global context.
   * Taken in jQuery.
   *
   * @param {string} code JS code to execute.
   */
  function globalExec(code) {
    var script = document.createElement('script');

    script.text = code;
    document.head.appendChild(script).parentNode.removeChild(script);
  }

  /**
   * Observe DOM and object mutation.
   *
   * @param {object} opt Options:
   *
   *   * {object} obj Object options:
   *     * {Object} [obj={}]    Object to bind with the element (`opt.el.el`).
   *     * {function} observer  Callback called on each mutation in the object `opt.obj.obj`.
   *                            Signature: observer(changes, context)
   *
   *   * {object} el Element options:
   *     * {Element}  el        DOM element to bind with the object `opt.obj.obj`.
   *     * {function} observer  Callback called on each mutation in the element (`opt.el.el`).
   *                            Signature: observer(mutations, mutationObserver, context).
   *
   *     * {object}   [opt]     Arguments passed to `MutationObserver.observe()`.
   *
   * @return {MutationObserver} An instance of `MutationObserver` (observer).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * @see https://developer.mozilla.org/en/docs/Web/API/MutationObserver
   */
  function observe(opt) {
    var isUndef, args, elObs;

    args        = opt.el.opt  || {};
    opt.ctx     = opt.ctx     || {};
    opt.obj.obj = opt.obj.obj || {};
    isUndef     = ux.is.undef;

    args.attributes    = isUndef(args.attributes)    ? false : args.attributes;
    args.childList     = isUndef(args.childList)     ? true  : args.childList;
    args.characterData = isUndef(args.characterData) ? false : args.characterData;

    Object.observe(opt.obj.obj, (changes) => opt.obj.observer(changes, {
      el    : opt.el.el,
      elObs : elObs,
      ctx   : opt.ctx
    }));

    elObs = new MutationObserver((mutations, observer)
      => opt.el.observer(mutations, observer, {
          obj: opt.obj.obj,
          ctx: opt.ctx
        }))
        .observe(opt.el, args)
    ;

    return elObs;
  }

  /**
   *  DOM Query utilities.
   *  @class Query
   */
  class Query {

    constructor(selector, element = document) {

      queryId++;

      this.engine = window.Sizzle || (selector) => this.select(selector).nodes;
      this.el     = element;
      this.nodes;

      Object.defineProperty(this, '_uid', {
        enumerable   : true,
        configurable : false,
        writable     : false,
        value        : queryId
      });

      if(selector) {

        if(is.node(selector)) {
          this.el    = selector;
          this.nodes = [selector];
        }else{
          this.find(selector);
        }
      }
    }

    /**
     * @return {Query} Current instance.
     */
    selectOne(selector) {
      this.nodes = [this.el.querySelector(selector)];
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    select(selector) {
      this.nodes = ux.util.toArray(this.el.querySelectorAll(selector));
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    selectById(id) {
      this.nodes = [this.el.getElementById(id)];
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    selectByClass(name) {
      this.nodes = ux.util.toArray(this.el.getElementsByClassName(name));
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    selectByTag(name) {
      this.nodes = ux.util.toArray(this.el.getElementsByTagName(name));
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    selectByName(name) {
      this.nodes = ux.util.toArray(this.el.getElementsByName(name));
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    findOne(selector) {
      this.find(selector);
      this.nodes = this.nodes.length > 1 ? this.nodes[0] : [];

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    find(selector) {
      this.nodes = this.engine(selector, this.el);
      return this;
    }

    /**
     * @return {Node|undefined}
     */
    get(index = 0) {
      return this.nodes[index];
    }

    /**
     * @return {Query} Current instance.
     */
    resolve(method, length = 1) {
      var target, nodes = [], ln = this.nodes.length;

      for(var i = 0; i < ln; i++) {

        target = this.nodes[i][method];

        while(target) {

          if(target && target !== nodes[nodes.length - 1] && target.nodeType === 1) {
            nodes.push(target);

            if(length === -1 || length > 1) {
              target = target[method];

              if(length > 1) {
                length--;
              }

            }else{
              target = null;
            }
          }
        }
      }

      this.nodes = nodes;

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    first() {
      this.nodes = this.nodes ? this.nodes[0] : [];
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    last() {
      this.nodes = this.nodes.length > 1 ? this.nodes.slice(-1) : [];
      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    prev() {
      return this.resolve('previousElementSibling');
    }

    /**
     * @return {Query} Current instance.
     */
    prevAll() {
      return this.resolve('previousElementSibling', -1);
    }

    /**
     * @return {Query} Current instance.
     */
    next() {
      return this.resolve('nextElementSibling');
    }

    /**
     * @return {Query} Current instance.
     */
    nextAll() {
      return this.resolve('nextElementSibling', -1);
    }

    /**
     * @return {Query} Current instance.
     */
    children() {
      var cLn, children, nodes;

      nodes = [];

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        children = this.nodes[i].children;

        if(children && children.nodeType !== 11) {

          cLn = children.length;

          for (var c = 0; c < cLn; c++) {
            nodes.push(children[c]);
          }
        }
      }

      this.nodes = nodes;

      return this;
    }

    /**
     * Get the first parent of each element in the current set of matched `nodes`.
     * @return {Query} Current instance.
     */
    parent() {
      var p;

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        p = this.nodes[i].parentNode;
        this.nodes[i] = p && p.nodeType !== 11 ? p : null;
      }

      return this;
    }

    /**
     * Find the fisrt parent of each element in the current set of matched `nodes`,
     * optionally filtered by a selector.
     *
     * @param {string} selector Selector expression to match elements against.
     * @return {Query} Current instance.
     */
    findParent(selector) {
      return this.findParents(selector, false);
    }

    /**
     * Find parent(s) of each element in the current set of matched `nodes`,
     * optionally filtered by a selector.
     *
     * @param {string|Element} selector Selector expression to match elements against.
     *
     * @param {bool}   [all=true] `true` to find all parents,
     * false` to find the first parent that match.
     *
     * @return {Query} Current instance.
     */
    findParents(selector, all = true) {
      var firstParent, p, parents = [];

      if(is.str(selector)) {
        selector = ux.dom(selector).nodes;
      }else if(!selector) {
        firstParent = true;
      }

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {

        p = this.nodes[i].parentNode;

        while (p) {

          if(!p || p.nodeType === 11) {
            continue;
          }

          if(firstParent) {

            selector    = null;
            firstParent = p;

            if(!firstParent || firstParent.nodeType === 11) {
              firstParent = true;
              continue;
            }

            selector = [firstParent];
          }

          if(selector && parents.indexOf(p) === -1 && selector.indexOf(p) !== -1) {
            parents.push(p);

            if(!all) {
              break;
            }
          }

          p = p.parentNode;
        }
      }

      this.nodes = parents;

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    each(fn) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        if (fn.call(this.nodes[i], this.el, i) === false) {
          break;
        }
      }

      return this;
    }

    css(name, value) {
      var ln;

      if(is.obj(name)) {
        for(var prop in name) {
          this.css(prop, name[prop]);
        }

        return this;
      }

      if(is.undef(value)) {

        if(this.nodes[0]) {
          return this.nodes[0].style[name]
            || window.getComputedStyle(this.nodes[0], null).getPropertyValue(name);
        }

        return void 0;
      }else{

        ln = this.nodes.length;

        if(name === 'display') {

          for (var i = 0; i < ln; i++) {
            dataPriv.set(this.nodes[i], {
              lastDisplay: this.nodes[i].style.display
            });

            this.nodes[i].style.display = value;
          }

          return this;
        }

        for (var i = 0; i < ln; i++) {
          this.nodes[i].style[name] = value;
        }

        return this;
      }
    }

    /**
     * Determine whether any of the matched elements are assigned the given class.
     *
     * @param {string} name The class name to search for.
     * @return {bool} `true` if a node contains the given class,
     * otherwise `false`
     */
    hasClass(name) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        if(this.nodes[i].classList.contains(name)) {
          return true;
        }
      }

      return false;
    }

    /**
     * Add a class to each element in the current set of matched `nodes`.
     *
     * @param {string} name The class name to add
     * @return {Query} Current instance.
     */
    addClass(name) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].classList.add(name);
      }

      return this;
    }

    /**
      * Remove a class to each element in the current set of matched `nodes`.
      *
      * @param {string} name The class name to add
      * @return {Query} Current instance.
      */
    removeClass(name) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].classList.remove(name);
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    toggleClass(name) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].classList.toggle(name);
      }

      return this;
    }

    /**
     * Hide each element in the current set of matched `nodes`.
     * @return {Query} Current instance.
     */
    hide() {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {

        if(dataPriv.has(this.nodes[i])) {
          dataPriv.get(this.nodes[i]).oldDisplay = this.nodes[i].style.display;
        }else{
          dataPriv.set(this.nodes[i], {
            oldDisplay: this.nodes[i].style.display
          });
        }

        this.nodes[i].style.display = 'none';
      }

      return this;
    }

    /**
      * Show each element in the current set of matched `nodes`.
      * @return {Query} Current instance.
      */
    show() {
      var value;

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {

        value = '';

        if(dataPriv.has(this.nodes[i])) {
          value = dataPriv.get(this.nodes[i]).oldDisplay || value;
        }

        this.nodes[i].style.display = value;
      }

      return this;
    }

    attr(name, value) {
      var ln;

      if(is.undef(value)) {

        var list  = this.nodes[0].attributes;

        ln = list.length;

        if(name) {
          for (var i = 0; i < ln; i++){

            if(name == list[i].nodeName) {
              return list[i].value;
            }
          }

          return void 0;
        }

        var attrs = {};

        for (var i = 0; i < ln; i++){
          attrs[list[i].nodeName] = list[i].value;
        }

        return attrs;
      }

      ln = this.nodes.length;

      for (var i = 0; i < ln; i++) {
        this.nodes[i].setAttribute(name, value);
      }

      return this;
    }

    text(value) {
      var txt = '', ln = this.nodes.length;

      if(is.undef(value)) {
        for (var i = 0; i < ln; i++) {
          txt += this.nodes[i].textContent;
        }

        return txt;
      }

      for (var i = 0; i < ln; i++) {
        this.nodes[i].textContent = value;
      }

      return this;
    }

    html(value) {
      var html = '', ln = this.nodes.length;

      if(is.undef(value)) {
        for (var i = 0; i < ln; i++) {
          html += this.nodes[i].innerHTML;
        }

        return html;
      }

      for (var i = 0; i < ln; i++) {
        this.nodes[i].innerHTML = value;
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    prepend(value) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].insertAdjacentHTML('afterbegin', value);
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    prependText(value) {
      return this.prependChild(document.createTextNode(value));
    }

    /**
     * @return {Query} Current instance.
     */
    prependChild(node) {
      var type;

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {

        type = this.nodes[i].nodeType;

        if(type === 1 || type === 11 || type === 9) {

          this.nodes[i].insertBefore(
            node.cloneNode(true),
            this.nodes[i].firstChild
          );
        }
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    append(value) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].insertAdjacentHTML('beforeend', value);
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    appendText(value) {
      return this.appendChild(document.createTextNode(value));
    }

    /**
     * @return {Query} Current instance.
     */
    appendChild(node) {
      var type;

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {

        type = this.nodes[i].nodeType;

        if(type === 1 || type === 11 || type === 9) {
          this.nodes[i].appendChild(node.cloneNode(true));
        }
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    insertBefore(value) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].insertAdjacentHTML('beforebegin', value);
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    insertAfter(value) {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].insertAdjacentHTML('afterend', value);
      }

      return this;
    }

    /**
     * Empty the selected nodes
     *
     * @return {Query} Current instance.
     */
    empty() {
      var range;

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        range = document.createRange();
        range.selectNodeContents(this.nodes[i]);
        range.deleteContents();
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    remove() {

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].remove();
      }

      return this;
    }

    /**
     * Replace all nodes selected by the `node`.
     *
     * The `node` can be :
     *   * an `element` (`object`)
     *   * or a `TextNode` (`object`)
     *   * or HTML (`string`).
     *
     * @param {Node|string} node The new node.
     *
     * @return {Query} The current instance.
     */
    replaceWith(node) {

      if(is.str(node)) {
        node = ux.html.toNode(node);
      }

      for (var i = 0, ln = this.nodes.length; i < ln; i++) {
        this.nodes[i].parentNode
          .replaceChild(node.cloneNode(true), this.nodes[i]);
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    on(event, listener, useCapture = false) {
      var ln = this.nodes.length;

      if(ln) {
        for (var i = 0; i < ln; i++) {
          this.nodes[i].addEventListener(event, listener, useCapture);
        }
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    off(event, listener, useCapture = false) {
      var ln = this.nodes.length;

      if(ln) {
        for (var i = 0; i < ln; i++) {
          this.nodes[i].removeEventListener(event, listener, useCapture);
        }
      }

      return this;
    }

    /**
     * @return {Query} Current instance.
     */
    trigger(event, data) {
      var ln = this.nodes.length;

      if(ln) {

        if(is.str(event)) {
          event = new Event(event);
        }

        for (var i = 0; i < ln; i++) {
          this.nodes[i].dispatchEvent(event, data);
        }

        return this;
      }
    }
  }


  /*------------------------------------------------------------------------*\
    Init
  \*------------------------------------------------------------------------*/

  ux.Query = Query;

  // browser support
  if(!document.querySelector) {
    ux.Query.prototype.select = ux.Query.prototype.findOne;
  }

  if(!document.querySelectorAll) {
    ux.Query.prototype.selectAll = ux.Query.prototype.find;
  }

  ux.dom = (selector, element) => new ux.Query(selector, element);

  ux.dom.traverse   = traverse;
  ux.dom.observe    = observe;
  ux.dom.globalExec = globalExec;

  ux.dom.onLoaded = (listener, useCapture = false)
    => document.addEventListener('DOMContentLoaded', listener, useCapture)
  ;
};