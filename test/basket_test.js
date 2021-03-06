'use strict';

var grunt = require('grunt');
var util = require('util');

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
  defaultOptions: function(test) {
    test.expect(1);

    test.deepEqual(
      grunt.basket,
      grunt.file.readJSON('test/fixtures/basic/expected.json'),
      'Descriptors are stored under the plugin name for future usage'
    );

    test.done();
  }
};
