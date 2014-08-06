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
  local: function(test) {
    test.expect(1);

    var generated = grunt.file.readJSON('.config/local.json');
    var fixture = grunt.file.readJSON('test/fixtures/metadata/local.json');

    test.deepEqual(generated, fixture);

    test.done();
  },
  cdn: function(test) {
    test.expect(1);

    var generated = grunt.file.readJSON('.config/cdn.json');
    var fixture = grunt.file.readJSON('test/fixtures/metadata/cdn.json');

    test.deepEqual(generated, fixture);

    test.done();
  },
  cdnWithFolder: function(test) {
    test.expect(1);

    var generated = grunt.file.readJSON('.config/cdnWithFolder.json');
    var fixture = grunt.file.readJSON('test/fixtures/metadata/cdnWithFolder.json');

    test.deepEqual(generated, fixture);

    test.done();
  },
  cdnWithProtocol: function(test) {
    test.expect(1);

    var generated = grunt.file.readJSON('.config/cdnWithProtocol.json');
    var fixture = grunt.file.readJSON('test/fixtures/metadata/cdnWithProtocol.json');

    test.deepEqual(generated, fixture);

    test.done();
  }
};
