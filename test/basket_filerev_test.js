'use strict';

var grunt = require('grunt');
var util = require('util');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.pages_config = {
  filerev_options: function(test) {
    test.expect(1);

    test.deepEqual(grunt.config.get('filerev')['test/fixtures/filerev/descriptors/page.json'], {
      src: ['js/one.js', 'js/two.js', 'css/one.css', 'css/two.css', 'images/*.{png,jpg,webp}'],
      expand: true,
      cwd: grunt.config.get('basket').filerev_options.options.assets,
      dest: grunt.config.get('basket').filerev_options.options.dest
    });

    test.done();
  }
};
