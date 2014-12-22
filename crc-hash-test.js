"use strict";

var crcHash = require("./crc-hash");

exports.crcHashTest = {
  createHashNoArgument: function(test) {
    test.expect(1);
    test.throws(function() {
      crcHash.createHash();
    }, /Missing algorithm\./);
    test.done();
  },

  createHashBadArgument: function(test) {
    test.expect(1);
    test.throws(function() {
      crcHash.createHash(10);
    }, /Unsupported algorithm\./);
    test.done();
  },

  createHashUnsupportedArgument: function(test) {
    test.expect(1);
    test.throws(function() {
      crcHash.createHash("md5");
    }, /Unsupported algorithm\./);
    test.done();
  },

  createHashIncorrectCase: function(test) {
    test.expect(1);
    test.throws(function() {
      crcHash.createHash("CRC32");
    }, /Unsupported algorithm\./);
    test.done();
  },

  createHashCorrectCase: function(test) {
    test.expect(1);
    test.ok(crcHash.createHash("crc32"));
    test.done();
  }
};
