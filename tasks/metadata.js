/*
 * grunt-basket
 * https://github.com/dendril/grunt-basket
 *
 * Copyright (c) 2014 Facundo Cabrera
 * Licensed under the MIT license.
 */
'use strict';

var util = require('util');
var _ = require('lodash');
var path = require('path');
var url = require('url');

function pathHelper(src) {
  var urlParse = url.parse(src, false, true);

  if (urlParse.host) {
    return _.partial(url.resolve, src);
  } else {
    return _.partial(path.join, src);
  }
}

module.exports = function(grunt) {

  grunt.registerMultiTask('basketMetadata', 'consolidate url rewrites in different json files based on environment configurations', function() {
    var options = this.options({
        outputDir: '.config'
      }),
      ifErrors = false,
      datasource = grunt.filerev &&  grunt.filerev.summary || false,
      targetConfig = this.data;

    if (grunt.file.isDir(options.assets) === false) {
      grunt.log.error('Please provide your original assets directory');
      ifErrors = true;
    }

    if (grunt.file.isDir(options.dest) === false) {
      grunt.log.error('Please provide the destination of filerev assets');
      ifErrors = true;
    }

    if (!(_.isString(targetConfig.outputName) && targetConfig.outputName.length > 0)) {
      grunt.log.error('Please provide the configuration filename');
      ifErrors = true;
    }

    if (!datasource) {
      grunt.log.error('Please provide the filerev output');
      ifErrors = true;
    }

    // Fail by returning false if this task had errors
    if (ifErrors) { return false; }

    var pathProcessor = pathHelper(targetConfig.webroot);

    var rewrites = _.reduce(datasource, function(result, translation, originalPath) {
      result[originalPath.slice(options.assets.length)] = pathProcessor(translation.slice(options.dest.length));
      return result;
    }, {});

    grunt.file.write(path.join(options.outputDir, targetConfig.outputName), JSON.stringify(rewrites, null, '    '));
  });

};
