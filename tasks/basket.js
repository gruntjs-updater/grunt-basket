/**
 * grunt-basket
 * https://github.com/dendril/grunt-basket
 *
 * Copyright (c) 2014 Facundo Cabrera
 * Licensed under the MIT license.
 */
'use strict';

var util = require('util');
var _ = require('lodash');
var eachAsync = require('each-async');

function filerev(obj) {
  obj.expand = true;
  obj.cwd = filerev.cwd;
  obj.dest = filerev.dest;

  return obj;
}

function createSrcArrayFrom(pageCfg) {
  var folders = Object.keys(pageCfg), src = [], obj = {};

  for (var folder in pageCfg) {
    for(var i = 0, items = pageCfg[folder], l = items.length; i < l; i++) {
      src.push(folder + '/' + items[i]);
    }
  }

  return obj.src = src, obj;
}

module.exports = function(grunt) {

  grunt.registerMultiTask('basket', 'Asset processor based on json descriptor', function() {
    var options = this.options({
        filerev: false,
        dest: '.tmp'
      }),
      ifErrors = false,
      basket = grunt.basket || {files: {}, descriptors: {}},
      gruntFileRevConfig = {};

    if (grunt.file.isDir(options.descriptors) === false) {
      grunt.log.error('Please provide descriptors directory');
      ifErrors = true;
    }

    if (grunt.file.isDir(options.assets) === false) {
      grunt.log.error('Please provide assets directory');
      ifErrors = true;
    }

    // Fail by returning false if this task had errors
    if (ifErrors) { return false; }

    // scan descriptors descriptors
    basket.files = grunt.file.expand(options.descriptors + '/*.json');

    // setup filerev settings, does not matter if the user want it
    filerev.cwd = options.assets;
    filerev.dest = options.dest;

    // parse all the configurations files
    eachAsync(basket.files, function (el, i, next) {
      grunt.log.debug('Parsing: ', el);

      basket.descriptors[el] = grunt.file.readJSON(el);
      gruntFileRevConfig[el] = filerev(createSrcArrayFrom(basket.descriptors[el]));

      next();
    }, this.async());

    grunt.basket = basket;

    // @TODO merge settings instead of override.
    if (options.filerev) {
      grunt.config.set('filerev', gruntFileRevConfig);
    }

    grunt.log.debug('Plugin finished successfully');
    grunt.log.debug(util.inspect(basket));
  });
};
