# Bindux - Bind the User eXperience

Powerful and modern data binding (like Angular, Ember, ...) + templating + DOM manipulation (like jQuery, Zepto, jqLite, ...) in only 23kb minified (7kb gzipped).


Bindux in a few words:

  * Near of native JS and HTML5 / CSS3.
  * DOM manipulation (if you prefer, you can use Bindux with jQuery).
  * Native data-binding, Bindux use `Object.observe()`, you can use a polyfill for old browsers.
  * Some useful helpers to manipulate the DOM, data-binding, values, HTML, ...
  * Standart compliant, no need for <%=foo%> or {{foo}} assignments.
  * Templating based on HTML, HTML is a great markup langage and natively evaluated by the browser.
  * Not brilliant meta language, hieroglyphic or any other symbol to remember. Only HTML we already know.
  * _DSL-free_ (Domain Specific Languages), if needed you can use with any template engine.
    * Note: DOM templating with Domain Specific Languages (suck as <%=foo%> or {{foo}}) is SLOW. All template engines require parsing and rendering phases.
  * Easy to use
  * Extensible


This is the alpha version, the documentation is in progress.


## Install

Download [dist/bindux.min.js](dist/bindux.min.js).


## Usage

Bindux expose the variables `bindux` and a shortcut `ux`.

```js
// true
console.log(bindux === ux);
```

`bindux.noConflict()` to redefine in your sauce:

```js
var ui = bindux.noConflict();

// now `ui` is `bindux` object
console.log(ui);

// now is undefined
console.log(bindux);

// now is undefined
console.log(ux);
```


### DOM

Documentation in progress, the following is some quick examples:
```js
ux.dom('div').css('color', 'green');

// or jQuery like
var $ = ux.dom;
$('div').css('color', 'green');
```


Some methods:
```js
var $        = ux.dom;
var elements = $('div');

elements.attr('href', newLink);
elements.html('<b>great</b>');
elements.text('some text');
elements.append('<b>html</b>');
elements.appendText('text');
elements.appendChild(node);
elements.prepend('<b>html</b>');
elements.prependText('text');
elements.prependChild(node);
elements.insertBefore('added before');
elements.insertAfter('added after');
elements.parent();
elements.findParent('.someClass');
elements.addClass('btn-success');
elements.toggleClass('some-class');
elements.show();
elements.hide();
elements.on('click', listener);
elements.off('click', listener);
elements.trigger('click', data);

elements.css({
  color: '#333',

  // or 'background-color': '#f1f1f1'
  backgroundColor: '#f1f1f1'
});

// each node
elements.each(function() {
  $(this).next().addClass('selected');
  this.remove();
});

```

Traverse the tree of `node` and keep only the text nodes:
```js
var textNodes = $.traverse(node, NodeFilter.SHOW_TEXT);
```

Observe DOM mutations and bind with the `items` object:
```js
var items = {};

$.observe({

  // element
  el: {
    el: $('#list').get(),

    observer: function(mutations, observer, context) {
      console.log(mutations, observer, context);
    }
  },

  // object
  obj: {
    obj: items,

    observer: function(changes, context) {
      console.log(changes, context);
    }
  }
});
```

... and more, see the API in the [code source](src/dom.js).

### Binders

_TODO: doc_

Binders are used to make the link between the JS code and the HTML document.<br>
Like the AngularJS directives  (ng-repeat, etc).

Each binding is linked by an attribute and an object (named the `scope`).

All binding attributes are prefixed by `n-` (n = node). You can change the prefix like this:
```js
ux.opt.binder.prefix = 'ux-';
```

All scopes are stored in `ux.scopes` object.

If a property passed from HTML to a binder is a function,
then it will be executed and its return value will be used by the binder.


Init the binding with `ux.init()`:

```js
// define the controllers of your application
ux.ctrls.header  = headerCtrl;
ux.ctrls.navBar  = navBarCtrl;
ux.ctrls.chat    = chatCtrl;
ux.ctrls.article = articleCtrl;
ux.ctrls.user    = userCtrl;

// initialize the binding
ux.init();
```


#### ctrl

The controller which manages the scope.<br>
The use of controllers is not mandatory, you can define directly a scope `ux.scopes.something` but the controllers are convenient for code organization.

When defining a controller, a scope of the same name is automatically created if it does not exist.


HTML
```html
<div n-ctrl="myCtrl"></div>
```

JS
```js
/**
 * My controller
 *
 * @param {object} scope The scope to handle.
 * @param {Element} el The node element of the controller
 */
ux.ctrls.myCtrl = function(scope, el) {

};
```


#### each

Like `ng-repeat` of AngularJS, the binder `each` instantiates a template once per item from a collection. Each template instance gets its own scope, where the given loop variable is set to the current collection item.

HTML
```html
<div n-ctrl="myCtrl">
  <ul>
    <li n-each="message messages" n-html="message"></li>
  </ul>
</div>
```

If you prefer the Angular way (message `in` messages):
```html
<div n-ctrl="myCtrl">
  <ul>
    <li n-each="message in messages" n-html="message"></li>
  </ul>
</div>
```

JS
```js
scope.messages = [];

scope.messages.push('Hello');
scope.messages.push('Hi');
```

It's also possible to use an object or an array of objects.

Example with an `array` of `object`:

HTML
```html
<div n-ctrl="myCtrl">
  <ul>
    <li n-each="user users">
      <span n-text="user.name"></span>
      <span n-text="user.email"></span>
      <p n-html="user.bio"></p>
    </li>
  </ul>
</div>
```

JS
```js
scope.users = [];

scope.users.push({
  name  : 'Nico',
  email : 'contact@domain.tld',
  bio   : 'I eat <strong>pizza</strong>, miam!'
});

scope.users.push({
  name  : 'Sarah Connor',
  email : 'contact@fear.ltd',
  bio   : 'I am the mom of the future o_O I eat <strong>bullets</strong>!'
});
```


#### el

Handles directly an element.


HTML
```html
<div n-ctrl="myCtrl">
  <img n-el="src:logoUrl">
</div>
```

JS
```js
scope.logoUrl = '/assets/img/logo.png';
```

Use only a callback which manages the element:

HTML
```html
<div n-ctrl="myCtrl">
  <div n-el="elHandler"></div>
</div>
```

JS
```js
scope.elHandler = function(data) {

  // current element
  var node = data.node;

  console.log(data);
};
```


#### html

Add the property value performed as HTML.

HTML
```html
<div n-ctrl="myCtrl">
  <div n-html="contents"></div>
</div>
```

JS
```js
scope.contents = '<strong>Hello world</strong>';
```

Displays:

```html
<div n-html="contents"><strong>Hello world</strong></div>
```

#### text

Add the property value performed as text. The HTML tags are natively escaped by the browser (TextNode).

HTML
```html
<div n-ctrl="myCtrl">
  <div n-text="contents"></div>
</div>
```

JS
```js
scope.contents = '<strong>Hello world</strong>';
```

Displays:

```html
<div n-text="contents">&lt;strong&gt;Hello world&lt;/strong&gt;</div>
```


#### on

Binds an event listener on the element using the event specified.

Attribute value: `event:listener`.

HTML
```html
<div n-ctrl="myCtrl">
  <button on="click:onClick">Click me!</button>
</div>
```

JS
```js
scope.onClick = function(event) {
  $(this).text('clicked :)');
};
```


#### scope

Define the scope to bind in the HTML. It's useful to bind another scope easily.

HTML
```html
<div n-ctrl="a">
  <span n-text="scope a"></span>
</div>
<div n-ctrl="b">
  <span n-scope="a" n-text="scope a"></span>
  <span n-text="scope b"></span>
</div>

<!-- Without controller -->
<div n-scope="b">

  <!-- Uses the scope "b" -->
  <div n-html="user.name"></div>
</div>
```


### Filters

Transform a value. Example, HELLO to Hello:

JS
```js
scope.val = 'HELLO';
```

HTML
```html
<span n-text="val|lc|ucFirst"></span>
```

List:

  * __lc__ Make a string lowercase
  * __lcFirst__ Make a string's first character lowercase
  * __uc__ Make a string uppercase
  * __lcFirst__ Make a string's first character uppercase
  * __rmSpace__ Remove space
  * __escape__ Escape a string (replace HTML tags and some character by HTML entities)
  * __e__ Shortcut of _escape_ filter
  * __unescape__ Converts the HTML entities in escaped string (with _escape_ / _e_ filter), to their corresponding characters


Create a new filter:
```js
ux.filters.strong = function(str) {
  return '<strong>' + str + '</strong>';
};
```

Then use:
```html
<span n-text="val|strong"></span>
```


### Parser

Parsing:
```js
var value = ux.expr.parse(expression, scope);
```
Note: `expression` is passed to all parsers (by default Bindux have only one parser `pipe`).


use a specific parser:
```js
var value = ux.expr.parser('pipe').parse(expression, scope);
```

Create a new parser:

```js
ux.expr.parsers.something = function(expression, scope, context) {
  // parse ...

  return str;
};
```
Note: `context` is an optional argument to pass context data.


Then use:
```js
var value = ux.expr.parser('something').parse(expression, scope, context);
```

When calling `ux.expr.parse()`, all parsers are used (also the new parser `something`).

If needed, you can pass the `context`:
```js
var value = ux.expr.parse(expression, scope, context);
```

### events

Bindux inherits of [evemit](https://github.com/Nicolab/evemit).

```js
ux.on('say-hello', function(hello) {
  console.log(hello); // Hello World!
});

ux.emit('say-hello', 'Hello World!');
```

Methods:

  * [ux.on(event, fn, [context])](https://github.com/Nicolab/evemit/blob/master/API.md#Evemit#on)
  * [ux.once(event, fn, [context])](https://github.com/Nicolab/evemit/blob/master/API.md#Evemit#once)
  * [ux.emit(event, [...arg])](https://github.com/Nicolab/evemit/blob/master/API.md#Evemit#emit)
  * [ux.off(event, fn)](https://github.com/Nicolab/evemit/blob/master/API.md#Evemit#off)
  * [ux.listeners([event])](https://github.com/Nicolab/evemit/blob/master/API.md#Evemit#listeners)

See the [doc of Evemit](https://github.com/Nicolab/evemit).

#### Internal events

##### preLoad

Emitted by `ux.init()` on preloading.

##### load

Emitted by `ux.init()` on loading.

##### postLoad

Emitted by `ux.init()` on postloading.

##### scopes.{scope name}.changes

Emitted when a scope object was changed.<br>
Example a scope defined with `ux.scopes.user` emit `scopes.user.changes`.

##### ctrls.{controller name}.preLoaded

Emitted on preloading of a controller.<br>
Example a controller defined with `ux.ctrls.user` emit `ctrls.user.preLoad`.

##### ctrls.{controller name}.preBoot

Emitted on prebooting of a controller.

##### ctrls.{controller name}.postBoot

Emitted on postbooting of a controller.

##### binders.each.scopes.{scope name}.{property name}.changes

Emitted by `ux.binders.each` when a property (or an `array` key) of a scope was changed.

Example, consider a scope named `app` (`ux.scopes.app`):

Scope object:
```js
// if this code is in a controller,
// `scope` variable is passed by argument
var scope = ux.scopes.app;

scope.users = {
  nico: {
    job: 'developer',
    age: '32',
    country: 'France',
    avatar: '/img/avatars/default.png'
  }
};
```

Binder:
```html
<ul>
  <li n-each="user in users"></li>
</ul>
```
When `scope.users` changes:
```js
scope.users.nico.avatar = '/img/avatars/tux.png';
```

The event emitted is `binders.each.scopes.app.users.changes`


### ux.color

In a application it is common to manipulate the colors via hexa and RGB(A).<br>
The `ux.color` object is an handy helper to facilitate the transition from one to the other.

#### toRgb(color, alpha)

Convert a given `color` to RGB(A).

```js
// rgb(255,255,255)
ux.color.toRgb('#ffffff');

// rgb(255,255,255)
ux.color.toRgb('white');

// rgb(255,255,255)
ux.color.toRgb('255,255,255');

// rgb(255,255,255)
ux.color.toRgb('#fff');

// rgb(255,255,255,0.8)
ux.color.toRgb('#fff', 0.8)
```

#### toHex(color)

Convert a given `color` to Hexa.

```js
// #ffffff
ux.color.toHex('#fff');

// #ffffff
ux.color.toHex('white');

// #ffffff
ux.color.toHex('rgb(255,255,255)');

// #ffffff
ux.color.toHex('rgb(255,255,255,0.8)');

// #ffffff
ux.color.toHex('rgba(255,255,255,0.8)');
```

#### names

Some color names.

```js
// #008000
console.log(ux.color.names.green);

// see all colors
console.log(ux.color.names);
```

### ux.html

#### getFirstTag(str)

Get the first HTML tag.
Returns the tag (lowercase) if found, `null` otherwise.

```js
var attr, str;

str = 'some text before <div id="layout" class="active">' +
 '<span class="something">contents</span>' +
 '</div> some text after';

attr = ux.html.getFirstTag(str);

// div
console.log(attr);
```

#### getAttrs(str)

Get attributes from a string.
Returns attribute(s) name=value pairs in object.

```js
var attrs, str;

str = '<div id="layout" class="active">' +
 '<span class="something">contents</span>' +
 '</div>';

attrs = ux.html.getAttrs(str);

// Object {id: "layout", class: "active"}
console.log(attrs);
```

#### toNode(str)

Convert a given string / HTML to `Node` instance (`Element` or `TextNode`).

```js
var node;

// TextNode
// (node.nodeType === Node.TEXT_NODE)
node = ux.html.toNode('hello');

console.log(node.data);

// Element (strong)
// (node.nodeType === Node.ELEMENT_NODE)
// (node.nodeName === 'STRONG')
node = ux.html.toNode('<strong>hello</strong>');

console.log(node.innerHTML);
```

#### stripTags(str, allowed)

Returns the string (`str`) without HTML tag, or only with `allowed` tag(s).

Remove all tags:
```js
// Who are you
ux.html.stripTags('<p>Who</p> <br /><b>are</b> <i>you</i>');
```

Remove all tags except `<i>` and `<b>`:
```js
// Who <b>are</b> <i>you</i>
ux.html.stripTags('<p>Who</p> <br /><b>are</b> <i>you</i>', '<i><b>');
```


## Browser support

Bindux is near of the native features and standart compliant. Bindux is based on the native capabilities of standarts supported by the major modern browsers: Chrome 29+, Firefox 24+, Opera 24+, IE 11+, Safari 6.1+ and browsers based on its.

No hack imposed to the modern browsers, so it's very well for the performance.
The hacks are only necessary for the old browsers and should be handled independently.

For make that the old browsers support the modern features you can use polyfills:

  * [es5-shim](https://github.com/es-shims/es5-shim), provides ES5 (EcmaScript 5)
  * [DOM4](https://github.com/WebReflection/dom4), provides DOM4 spec
  * [es6-collections](https://github.com/WebReflection/es6-collections), provides WeakMap, Map and Set


## Development of Bindux core

Bindux is developped in ES6 (EcmaScript6) in [src](https://github.com/bindux/bindux/tree/master/test) directory and is compiled to ES5 in the [dist/bindux.min.js](https://raw.githubusercontent.com/bindux/bindux/master/dist/bindux.min.js).

Build a minified distributable, in the terminal:
```sh
gulp
```

Develop with the automatic rebuilds (the distribulable and the unit tests):
```sh
gulp dev
```

### Unit tests

Bindux is unit tested with [Unit.js](http://unitjs.com) and [Mocha](http://unitjs.com/guide/mocha.html).

_TODO: There are still things to test._

### Why this project?

Just for personal preferences :)

I mention here, only my personal motivation. I do not pretend to judge something is better than another. The best approach for one, is not necessarily for others. That depends on several criteria specific to each developer.
Some are willing to sacrifice performance to get some comfort, others prefer over-optimization, even if the maintainability is more complex.

Here are my personal criteria that revolve mainly around:

  * Comfort,
  * Simplicity
  * Reusability
  * Performance.

In all my development, I try to find a harmonious balance to meet these criteria.<br>
I design my front-end application for it to be smooth and fast on PC and mobile.

Sometimes I use jQuery for some DOM manipulations, sometimes I use Angular for large application.<br>

However, a responsive website (or application) which should be also fluid in the mobile and the tablet,
the treatments and the lib size must be as small as possible.

Concerning the size:
  * jQuery2 size is 84kb minified
  * Angular size is 108kb minified

At first, I wanted to make a data-binding lib + Zepto (a jQuery like), but the size of Zepto minified is 25kb. Only for facilitate DOM manipulation is far too.
<br>This weight is justified because the approach of jQuery and Zepto is to simplify things by resolving the arguments that can be of different types, provide support for different browsers, ...

I like also this approach. Also, like many developers when I call a function, I know exactly what I want to do. Needless that the function takes on the responsibility to analyze the arguments to call the appropriate subroutine. This at a cost of treatment and extra size.

Ensure the browser support into each libraries / frameworks, Ouch! We are in 2014 there are libraries who do that very well (es5-shim, DOM4, html5shiv, ...). Which in addition provides support for the rest of the code. Coding zen in harmony, even with the old browsers :)

No need to impose some hacks and additional treatments to users who did the smart choice to use a modern browser. His choice to use a recent version of its browser should be rewarded by better performance offered by his browser.

Concerning productivity for a large application, Angular like many full stack framework, facilitates some things and unfortunately complicates others (loss time by making some verbose implementations + looking in the doc).

I prefer to go directly to the essentials ([KISS principle](http://en.wikipedia.org/wiki/KISS_principle)).


## LICENSE

[MIT](https://github.com/bindux/bindux/blob/master/LICENSE) (c) 2014, Nicolas Tallefourtane.


## Author

Bindux is designed and built with love by

| [![Nicolas Tallefourtane - Nicolab.net](http://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](http://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |