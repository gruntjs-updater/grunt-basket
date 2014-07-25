/*
 * grunt-basket
 * https://github.com/dendril/grunt-basket
 *
 * Copyright (c) 2014 Facundo Cabrera
 * Licensed under the MIT license.
 */
'use strict';

var inspect = require('util').inspect;

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.default_options %>',
        '<%= nodeunit.filerev_options %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['.tmp', '.config']
    },

    basket: {
      default_options: {
        options: {
          descriptors: 'test/fixtures/basic/descriptors',
          assets: 'test/fixtures/basic/src'
        }
      },
      filerev_options: {
        options: {
          filerev: true,
          descriptors: 'test/fixtures/filerev/descriptors',
          assets: 'test/fixtures/filerev/src',
          dest: '.tmp/'
        }
      }
    },

    basketMetadata: {
      options: {
        assets: '<%= basket.filerev_options.options.assets %>/',
        dest: '<%= basket.filerev_options.options.dest %>',
        outputDir: '.config'
      },
      local: {
        outputName: 'local.json',
        webroot: 'build'
      },
      cdn: {
        outputName: 'cdn.json',
        webroot: '//cdn.experiment.com'
      },
      cdnWithProtocol: {
        outputName: 'cdnWithProtocol.json',
        webroot: 'http://cdn.experiment.com'
      },
      cdnWithFolder: {
        outputName: 'cdnWithFolder.json',
        webroot: 'http://cdn.experiment.com/assets/'
      }
    },

    usemin: {
      options: {
        assetsDirs: [
          'test/fixtures/filerev/src/images',
          'test/fixtures/filerev/src/css',
          'test/fixtures/filerev/src/js'
        ]
      },
      css: ['.tmp/css/*.css']
    },

    // Unit tests.
    nodeunit: {
      default_options: ['test/basket_test.js'],
      filerev_options: ['test/basket_filerev_test.js'],
      metadata_options: ['test/metadata_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('test_default_options', [
    'clean',
    'basket:default_options',
    'nodeunit:default_options'
  ]);

  grunt.registerTask('test_filerev_options', [
    'clean',
    'basket:filerev_options',
    'filerev',
    'nodeunit:filerev_options'
  ]);

  grunt.registerTask('test_metadata_options', [
    'clean',
    'basket:filerev_options',
    'filerev',
    'basketMetadata',
    'nodeunit:metadata_options'
  ]);

  // Example of use case.
  grunt.registerTask('usage', [
    'clean',
    'basket:filerev_options',
    'filerev',
    'usemin'
  ]);

  grunt.registerTask('print', 'Show filerev summary object', function() {
    grunt.log.writeln(inspect(grunt.filerev.summary));
  });

  grunt.registerTask('default', ['jshint', 'test_default_options', 'test_filerev_options', 'test_metadata_options']);
};
