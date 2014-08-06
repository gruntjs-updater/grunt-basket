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
        '<%= nodeunit.defaultOptions %>',
        '<%= nodeunit.filerevOptions %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['.tmp', '.config']
    },

    basket: {
      defaultOptions: {
        options: {
          descriptors: 'test/fixtures/basic/descriptors/*.json',
          assets: 'test/fixtures/basic/src/'
        }
      },
      filerevOptions: {
        options: {
          filerev: true,
          descriptors: 'test/fixtures/filerev/descriptors/*.json',
          assets: 'test/fixtures/filerev/src/',
          dest: '.tmp/'
        }
      },
      noFilerev: {
        options: {
          descriptors: [
            'test/fixtures/nofilerev/descriptors/*.json',
            '!**/exclude.json'
          ],
          assets: 'test/fixtures/nofilerev/src/',
          dest: '.tmp/'
        }
      }
    },

    basketMetadata: {
      options: {
        assets: 'test/fixtures/filerev/src/',
        dest: '.tmp/',
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
      },

      noFilerev: {
        options: {
          assets: 'test/fixtures/nofilerev/src/',
          dest: '.tmp/',
          outputDir: '.config/'
        },
        outputName: 'nofilerev.json',
        webroot: '/assets'
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
      defaultOptions: ['test/basket_test.js'],
      filerevOptions: ['test/basket_filerev_test.js'],
      metadataOptions: ['test/metadata_test.js'],
      noFilerev: ['test/no_filerev_test.js']
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

  grunt.registerTask('testDefaultOptions', [
    'clean',
    'basket:defaultOptions',
    'nodeunit:defaultOptions'
  ]);

  grunt.registerTask('testFilerevOptions', [
    'clean',
    'basket:filerevOptions',
    'filerev',
    'nodeunit:filerevOptions'
  ]);

  grunt.registerTask('testMetadataOptions', [
    'clean',
    'basket:filerevOptions',
    'filerev',
    'basketMetadata:local',
    'basketMetadata:cdn',
    'basketMetadata:cdnWithProtocol',
    'basketMetadata:cdnWithFolder',
    'nodeunit:metadataOptions'
  ]);

  grunt.registerTask('testNoFilrevPresentOptions', [
    'clean',
    'basket:noFilerev',
    'basketMetadata:noFilerev',
    'nodeunit:noFilerev'
  ]);

  grunt.registerTask('print', 'Show filerev summary object', function() {
    grunt.log.writeln(inspect(grunt.filerev.summary));
  });

  grunt.registerTask('default', [
    'jshint',
    'testDefaultOptions',
    'testFilerevOptions',
    'testMetadataOptions',
    'testNoFilrevPresentOptions'
  ]);
};
