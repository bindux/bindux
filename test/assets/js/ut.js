/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

;(function() {
  'use strict';
  var initTest, initRunner, ut;

  /**
   * Init runner of unit tests
   */
  function initRunner() {
    var runner, pushReport;

    function pushReport(state, rep) {
      var txtClass, icoClass;

      if(state === 'pass') {
        txtClass = 'success';
        icoClass = 'ok';
      }else if(state === 'fail'){
        txtClass = 'danger';
        icoClass = 'remove';
      }

      // if has a valid state
      if(txtClass) {
        ut.scope.reports.push(
          '<span class="text-' + txtClass + ' glyphicon glyphicon-' +
          icoClass + '"></span> ' +
          rep.parent.title + ' / ' + rep.title +
          ' - <span class="text-muted">' + unitjs.stats.total.assertions +
          ' ' + ut.scope.pluralize(unitjs.stats.total.assertions, 'assertion') + '</span>'
        );
      }
    }

    runner = mocha.run();

    runner.on('pass', function(rep) {
      ut.scope.passes += 1;
      pushReport('pass', rep);
    });

    runner.on('fail', function(rep) {
      ut.scope.failures += 1;
      pushReport('fail', rep);
    });

    runner.on('suite', function(suite) {
      ut.scope.current = suite.title;
    });

    runner.on('test end', function() {

      if (!$('#mocha-stats li.assertions').nodes.length) {
        $('#mocha-stats')
          .prepend('<li><strong>Test cases:</strong></li>')
          .append(
            '<li>for</li>' +
            '<li class="assertions">' +
            '<em>' + unitjs.stats.total.assertions + '</em> ' +
            '<a href="#assertions-stats">assertions:</a> </li>'
        );
      }
      $('#mocha-stats li.assertions em').text(unitjs.stats.total.assertions);
    });

    runner.on('end', function() {
      var total   = unitjs.stats.total.assertions;
      var details = '';

      $('#mocha-stats li.assertions em').text(total);

      for (var name in unitjs.stats.assertions) {
        details +=
          '<tr>' +
          '<td>' + name + '</td>' +
          '<td><em>' + unitjs.stats.assertions[name] + '</em></td>' +
          '</tr>';
      }

      $('body').append('<div id="assertions-stats">' +
        '<h2>Assertions stats</h2>' +
        '<p>Total assertions executed: <em>' + total + '</em></p>' +
        '<h3>Details:</h3><table>' + details + '</table></div>'
      );

      ut.scope.assertions += unitjs.stats.total.assertions;

      ut.parent.ux.emit('ut.case.end');
    });
  };

  /**
   * Init initAssets
   */
  function initAssets() {

    $('head').append(
      '<link rel="stylesheet" href="/assets/css/mocha.css">' +
      '<link rel="stylesheet" href="/assets/css/app.css">'
    );

    $script([
      '/assets/js/mocha.js',
      '/assets/js/unit.js',
      ],
      'ut-lib'
    );
  };


  //------------------------------------------------------------------------//

  ut = {
    parent: parent.window,

    scope: parent.window.ux.scopes.ut,

    run: function(utFile) {

      $script('/assets/js/bindux.js', function() {

        window.$ = ux.dom;

        initAssets();

        $script.ready('ut-lib', function() {
          mocha.setup('bdd');

          $script(utFile, function() {
            initRunner();
          })
        });
      })
    }
  };

  window.ut = ut;

})();