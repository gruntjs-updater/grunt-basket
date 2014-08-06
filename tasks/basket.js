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

function createSrcArrayFrom(patterns) {
  var obj = {};
  return obj.src = patterns, obj;
}

module.exports = function(grunt) {

  grunt.registerMultiTask('basket', 'Asset processor based on json descriptor', function() {
    var options = this.options({
        filerev: false,
        dest: '.tmp',
        webroot: '/assets'
      }),
      ifErrors = false,
      basket = {files: {}, descriptors: {}, summary: {}},
      filerevConfig = {};

    function renameAndAssign(result, translation) {
      return result[translation.src[0].slice(options.assets.length)] = translation.dest, result;
    }

    // scan for descriptors
    basket.files = grunt.file.expand({
      filter: 'isFile'
    }, options.descriptors);

    if (!basket.files.length) {
      grunt.log.error('Please provide assets descriptors');
      ifErrors = true;
    }

    if (grunt.file.isDir(options.assets) === false) {
      grunt.log.error('Please provide assets directory');
      ifErrors = true;
    }

    // Fail by returning false if this task had errors
    if (ifErrors) { return false; }

    // setup filerev settings, does not matter if the user want it
    if (options.filerev) {
      filerev.cwd = options.assets;
      filerev.dest = options.dest;
    }

    // grunt.log.debug('files =>', util.inspect( basket.files, {depth: null}));

    // parse all the configurations files
    eachAsync(basket.files, function (el, i, next) {

      // [descriptor filename] = json(file content);
      basket.descriptors[el] = grunt.file.readJSON(el);

      // build per descriptor settings for filerev
      filerevConfig[el] = filerev(createSrcArrayFrom(basket.descriptors[el]));

      next();
    }, this.async());

    if (options.filerev) {
      grunt.config.merge({ filerev: filerevConfig });
    }

    // grunt.log.debug('descriptors =>', util.inspect( basket.descriptors, {depth: null}));

    // grunt.log.debug('filerev =>', util.inspect( grunt.config.get('filerev'), {depth: null}));

    for(var name in basket.descriptors) {

      // grunt.log.debug(util.inspect( basket.descriptors[name], {depth: null}));

      var datasource = grunt.file.expandMapping(
        basket.descriptors[name],
        options.webroot,
        { cwd: options.assets }
      );

      // grunt.log.debug(util.inspect(datasource, {depth: null}));

      _.assign(basket.summary, _.reduce(datasource, renameAndAssign, {}));

      grunt.log.debug(util.inspect(datasource, basket.summary, {depth: null}));
    }

    grunt.basket = basket;

    grunt.log.debug(util.inspect(basket, {depth: null}));
    grunt.log.ok('Plugin finished successfully');
  });
};
