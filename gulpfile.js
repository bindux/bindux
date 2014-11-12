/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

/**
 * Bindux dev tasks
 */


var gulp     = require('gulp');
var flow     = require('./tasks/index');
var lazypipe = flow.lazypipe;
var gp       = flow.gp;
var cfg      = flow.cfg;


/*----------------------------------------------------------------------------*\
  Pipelines
\*----------------------------------------------------------------------------*/


var jsBuildTasks = lazypipe()
  .pipe(gp.webpack, cfg.webpack.opt)
  .pipe(gp.concat, 'bindux.js')
;

var jsMinTasks = lazypipe()
  .pipe(gp.uglify)
  .pipe(gp.header, cfg.banner)
  .pipe(function() {
    return gp.rename(function(path) {
      path.basename += '.min';
    });
  })
;

var jsProdTasks = jsBuildTasks
  .pipe(jsMinTasks)
;

var jsTestTasks = lazypipe()
  .pipe(gp.webpack, cfg.webpack.optTest)
  .pipe(gp.concat, 'app.js')
;

var jsBuildPaths = lazypipe()
  .pipe(gulp.dest, cfg.testJsDir)
  .pipe(gulp.dest, cfg.distDir)
;


/*----------------------------------------------------------------------------*\
  Tasks
\*----------------------------------------------------------------------------*/

gulp.task('dist.build', function(done) {

  gulp.src(cfg.src)
    .pipe(jsProdTasks())
    .pipe(jsBuildPaths())
    .on('end', done)
  ;
});

gulp.task('test.app.build', function(done) {

  gulp.src(cfg.srcAppTest)
    .pipe(jsTestTasks())
    .pipe(gulp.dest(cfg.testJsDir))
    .on('end', done)
  ;
});

gulp.task('test.src.build', function(done) {

  gulp.src(cfg.src)
    .pipe(jsBuildTasks())
    .pipe(gulp.dest(cfg.testJsDir))
    .pipe(jsMinTasks())
    .pipe(gulp.dest(cfg.testJsDir))
    .on('end', done)
  ;
});

gulp.task('test.build', ['test.src.build', 'test.app.build']);

gulp.task('dev.watch', function() {
  gp.livereload.listen();

  gulp.watch(cfg.src, ['test.src.build']);
  gulp.watch(cfg.srcAppTest, ['test.app.build']);
  gulp.watch(cfg.testDir + '/**')
    .on('change', gp.livereload.changed);
});


/*----------------------------------------------------------------------------*\
  Bundles
\*----------------------------------------------------------------------------*/

gulp.task('dev', function() {
  flow.runSeq('default', 'dev.watch');
});

gulp.task('default', function() {
  flow.runSeq('dist.build', 'test.build');
});
