/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var flow = {

  cfg      : require('./config'),
  runSeq   : require('run-sequence'),
  lazypipe : require('lazypipe'),
  webpack  : require('webpack'),

  gp: {
    concat     : require('gulp-concat'),
    header     : require('gulp-header'),
    livereload : require('gulp-livereload'),
    rename     : require('gulp-rename'),
    uglify     : require('gulp-uglify'),
    webpack    : require('gulp-webpack'),
  }
};

module.exports = flow;