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

exports.basket = {
  filerevOptions: function(test) {
    test.expect(2);

    test.deepEqual(
      grunt.config.get('filerev')['test/fixtures/filerev/descriptors/page.json'],
      grunt.file.readJSON('test/fixtures/filerev/expected.page.json')
    );

    test.deepEqual(
      grunt.config.get('filerev')['test/fixtures/filerev/descriptors/another.page.json'],
      grunt.file.readJSON('test/fixtures/filerev/expected.another.page.json')
    );

    test.done();
  }
};
