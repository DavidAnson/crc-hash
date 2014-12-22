"use strict";

var crypto = require("crypto");
var crcHash = require("./crc-hash");

function testHashOutput(test, hash, input, expected) {
  test.expect(1);
  hash.setEncoding("hex");
  input(hash);
  hash.end();
  test.equal(hash.read(), expected);
  test.done();
}

function noInput() {
  return function() {};
}

function stringInput(str) {
  return function(hash) {
    hash.write(str);
  };
}

function characterInput(str) {
  return function(hash) {
    for (var i = 0; i < str.length; i++) {
      hash.write(str[i]);
    }
  };
}

function bufferInput(str) {
  return function(hash) {
    hash.write(new Buffer(str));
  };
}

exports.crcHashTest = {
  //
  // createHash
  //
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
  },

  //
  // Node.js crypto MD5 (used to validate test harness)
  //
  md5NoInput: function(test) {
    testHashOutput(test, crypto.createHash("md5"), noInput(), "d41d8cd98f00b204e9800998ecf8427e");
  },

  md5StringInput: function(test) {
    testHashOutput(test, crypto.createHash("md5"), stringInput("Hello world."), "764569e58f53ea8b6404f6fa7fc0247f");
  },

  md5CharacterInput: function(test) {
    testHashOutput(test, crypto.createHash("md5"), characterInput("Hello world."), "764569e58f53ea8b6404f6fa7fc0247f");
  },

  md5BufferInput: function(test) {
    testHashOutput(test, crypto.createHash("md5"), bufferInput("Hello world."), "764569e58f53ea8b6404f6fa7fc0247f");
  },

  //
  // CRC-32
  //
  crc32NoInput: function(test) {
    testHashOutput(test, crcHash.createHash("crc32"), noInput(), "00000000");
  },

  crc32StringInput: function(test) {
    testHashOutput(test, crcHash.createHash("crc32"), stringInput("Hello world."), "8b3a0404");
  },

  crc32CharacterInput: function(test) {
    testHashOutput(test, crcHash.createHash("crc32"), characterInput("Hello world."), "8b3a0404");
  },

  crc32BufferInput: function(test) {
    testHashOutput(test, crcHash.createHash("crc32"), bufferInput("Hello world."), "8b3a0404");
  }
};
