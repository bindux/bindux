/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var $, cases, initUt;

$ = bindux.dom;

cases = [
  '/cases/binders/index.html',
  '/cases/color/index.html',
  //'/cases/dom/index.html',
  '/cases/expr/index.html',
  '/cases/filters/index.html',
  '/cases/html/index.html',
  '/cases/is/index.html',
  '/cases/nodemap/index.html',
  '/cases/util/index.html'
];

initUt = (scope, el) => {

  scope.assertions = 0;
  scope.failures   = 0;
  scope.passes     = 0;
  scope.reports    = [];
  scope.current    = '';
  scope.nextAuto   = 0;

  scope.pluralize = (num, txt) => {
    return num > 1 ? txt + 's' : txt;
  };

  scope.status = () => {
    return `
      <div class="pull-left">
        Test cases: ${scope.failures} ${scope.pluralize(scope.failures, 'failure')}
        ${scope.reportIssue()}
        - ${scope.passes} ${scope.pluralize(scope.passes, 'passe')}
      </div>

      <div class="pull-right">
        Validations: ${scope.assertions} ${scope.pluralize(scope.assertions, 'assertion')}
      </div>
      <div class="clearfix"></div>
    `;
  }

  scope.reportIssue = () => {
    if(!scope.failures) {
      return '';
    }

    return `(please, <a
      href="https://github.com/unitjs/unit.js/issues/new?title=[UT report]%20&body=Hello,%0D%0A%0D%0Athe unit test failed with%0D%0A  * Bindux version:%20(version)%0D%0A  * browser:%20(name)%0D%0A  * version:%20(version)"
    title="Quick report on Github">report the failure</a>!)`;
  };


};


/**
 * Unit tests controllers
 *
 * @param {object} scope
 * @param {Element} el
 */
ux.ctrls.ut = (scope, el) => {
  var fNode, rpNode, rp, utNext, nNode;

  initUt(scope, el);

  fNode  = $('#ut-frame').get();
  nNode  = $('#ut-next').get();
  rp     = $('#ut-replay');
  rpNode = rp.get();

  rp.hide();

  scope.utNext = () => {
    if(cases.length && !scope.failures) {
      fNode.src = cases.shift();

      if(scope.nextAuto && rpNode.style.display !== 'none') {
        rp.hide();
      }else if(!scope.nextAuto && rpNode.style.display === 'none'){
        rp.show();
      }

    }else if(!scope.failures){
      scope.current = 'finish!';

      if(rpNode.style.display === 'none') {
        rp.hide();
      }
    }else if(scope.failures){
      rp.show();
    }
  };

  scope.utReplay = () => {
    fNode.contentWindow.location.reload(true);
  };

  ux.on('ut.case.end', () => {
    if(scope.nextAuto) {
      scope.utNext();
    }
  });

  scope.onCheckNextAuto = (e) => {
    nNode.disabled  = scope.nextAuto = e.target.checked;

    if(scope.nextAuto) {
      scope.utNext();
      nNode.innerHTML = 'Run';
    }else{
      nNode.innerHTML = 'Next';
    }
  }
};
