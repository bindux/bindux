/**
 * This file is part of Bindux.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file distributed with this source code or visit http://bindux.com.
 */

'use strict';

var path    = require('path');
var webpack = require('webpack');
var pkg     = require(path.join('..', 'package.json'));


/*----------------------------------------------------------------------------*\
  Global
\*----------------------------------------------------------------------------*/

var cfg = {

  // paths
  src : [
    '!node_modules/**/*',
    '!**/_*/*',
    'src/**/*.js'
  ],
  srcAppTest: [
    'test/assets/app/**'
  ],
  testDir   : 'test',
  testJsDir : 'test/assets/js',
  distDir   : 'dist',

  // package
  pkg    : pkg,
  banner : '/*! '+ pkg.name + ' v'+ pkg.version + ' | '+ pkg.licenses[0].type +
    ' (c) '+ (new Date().getFullYear()) +' ' + pkg.author.name +
    ' - ' + pkg.homepage +' */'
};


/*----------------------------------------------------------------------------*\
  Webpack
\*----------------------------------------------------------------------------*/

// returns options value (not a reference)
var webpackOpt = function() {

  return {

    watch: false,
    entry: {
      main: pkg.main
    },
    output: {
      filename: '[name].js',
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.IgnorePlugin(/_[a-z-A-Z0-9-]/),
      new webpack.optimize.DedupePlugin(),
    ],
    module: {
      loaders: [
          { test: /\.js$/, loader: '6to5-loader'}
      ]
    }
  };
};

cfg.webpack = {
  opt     : webpackOpt(),
  optTest : webpackOpt()
};

cfg.webpack.optTest.entry = {
  main: './test/assets/app/index.js'
};


module.exports = cfg;
