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

module.exports = function(grunt) {

  grunt.registerMultiTask('basketMetadata', 'consolidate url rewrites in different json files based on environment configurations', function() {
    var options = this.options({
        outputDir: '.config'
      }),
      ifErrors = false,
      datasource = grunt.filerev &&  grunt.filerev.summary || grunt.basket &&  grunt.basket.summary || false,
      targetConfig = this.data;

    function pathHelper(src) {
      var urlParse = url.parse(src, false, true);

      grunt.log.debug('pathHelper =>', util.inspect( src, {depth: null}));

      if (urlParse.host) {
        return _.partial(url.resolve, src);
      } else {
        return _.partial(path.join, src);
      }
    }

    grunt.log.debug('datasource =>', util.inspect( datasource, {depth: null}));

    if (!_.isString(options.assets) || grunt.file.isDir(options.assets) === false) {
      grunt.log.error('Please provide your original assets directory');
      ifErrors = true;
    }

    if (!_.isString(options.dest)) {
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

    grunt.log.debug('targetConfig =>', util.inspect( targetConfig, {depth: null}));

    var pathProcessor = pathHelper(targetConfig.webroot);

    grunt.log.debug('datasource =>', util.inspect( datasource, {depth: null}));

    var rewrites = _.reduce(datasource, function(result, translation, originalPath) {

      grunt.log.debug('text =>', util.inspect( translation.slice(options.dest.length), {depth: null}));

      result[originalPath.slice(options.assets.length)] = pathProcessor(translation.slice(options.dest.length));
      return result;
    }, {});

    grunt.log.debug(options.outputDir, targetConfig.outputName);

    grunt.file.write(path.join(options.outputDir, targetConfig.outputName), JSON.stringify(rewrites, null, '    '));

    grunt.log.ok('Plugin finished successfully');
  });

};
