"use strict";

var crypto = require("crypto");
var crcHash = require("../crc-hash");

function hashViaStream(hash, data, encoding) {
  hash.setEncoding(encoding || "hex");
  if (data) {
    hash.write(data);
  }
  hash.end();
  return hash.read();
}

var hashFactories = [
  function() {
    // Node.js Crypto module MD5 (used to validate test harness)
    return crypto.createHash("md5");
  },
  function() {
    return crcHash.createHash("crc32");
  }
];

exports.crcHashLegacyTest = {
  hashNothingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    hashFactories.forEach(function(factory) {
      var hash = factory();
      test.equal(hash.digest("hex"), hashViaStream(factory(), null));
    });
    test.done();
  },

  hashStringIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashCharactersIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      for (var i = 0; i < data.length; i++) {
        hash.update(data[i]);
      }
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashBufferIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = new Buffer("Hello world.");
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashBufferWithEncodingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = new Buffer("Hello world.");
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data, "utf8");
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashWithUtf8EncodingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data, "utf8");
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashWithAsciiEncodingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data, "ascii");
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashWithBinaryEncodingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data, "binary");
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashWithBadEncodingIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data, "bad");
      test.equal(hash.digest("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashToBinaryIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest("binary"), hashViaStream(factory(), data, "binary"));
    });
    test.done();
  },

  hashToBase64IsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest("base64"), hashViaStream(factory(), data, "base64"));
    });
    test.done();
  },

  hashToBufferIsCorrect: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest().toString("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  hashToBadEncodingReturnsBuffer: function(test) {
    test.expect(hashFactories.length);
    var data = "Hello world.";
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.update(data);
      test.equal(hash.digest("bad").toString("hex"), hashViaStream(factory(), data));
    });
    test.done();
  },

  updateReturnsThis: function(test) {
    test.expect(hashFactories.length);
    hashFactories.forEach(function(factory) {
      var hash = factory();
      test.equal(hash.update(""), hash);
    });
    test.done();
  },

  updateWithNoDataThrows: function(test) {
    test.expect(hashFactories.length);
    hashFactories.forEach(function(factory) {
      var hash = factory();
      test.throws(function() {
        hash.update();
      }, /Not a string or buffer/);
    });
    test.done();
  },

  updateThrowsAfterDigest: function(test) {
    test.expect(hashFactories.length);
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.digest();
      test.throws(function() {
        hash.update("");
      }, /HashUpdate fail/);
    });
    test.done();
  },

  digestThrowsAfterDigest: function(test) {
    test.expect(hashFactories.length);
    hashFactories.forEach(function(factory) {
      var hash = factory();
      hash.digest();
      test.throws(function() {
        hash.digest();
      }, /Not initialized/);
    });
    test.done();
  }
};
