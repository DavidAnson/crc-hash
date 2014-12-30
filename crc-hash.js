/*
 * crc-hash
 * https://github.com/DavidAnson/crc-hash
 *
 * Copyright (c) 2014 David Anson
 * Licensed under the MIT license.
 */

"use strict";

// Imports
var stream = require("stream");
var util = require("util");
var crc = require("crc");
var Transform = stream.Transform;

// Constructor
function CrcHash(implementation, resultSize) {
  Transform.call(this);
  this.implementation = implementation;
  this.resultSize = resultSize;
  this.value = undefined;
}

// Subclass
util.inherits(CrcHash, Transform);

// Transform function implementations
CrcHash.prototype._transform = function(chunk, encoding, callback) {
  this.value = this.implementation(chunk, this.value);
  callback();
};
CrcHash.prototype._flush = function(callback) {
  var buffer = new Buffer(4);
  buffer.writeUInt32BE(this.value || 0, 0);
  buffer = buffer.slice(4 - this.resultSize);
  this.push(buffer);
  callback();
};

/**
 * Creates and returns a hash object which can be used to generate CRC hash digests.
 * Note: The legacy update and digest methods of the Hash class are not supported.
 *
 * @param {string} algorithm CRC algorithm (supported values: crc32, crc24, crc16, crc16ccitt, crc16modbus, crc8, crc81wire, crc1)
 * @return {Stream.Transform} Duplex stream as with Crypto.Hash (unsupported methods: update, digest)
 */
module.exports.createHash = function(algorithm) {
  if (!algorithm) {
    throw new Error("Missing algorithm.");
  }
  var size;
  switch (algorithm) {
    case "crc1":
    case "crc8":
    case "crc81wire":
      size = 1;
      break;
    case "crc16":
    case "crc16ccitt":
    case "crc16modbus":
      size = 2;
      break;
    case "crc24":
      size = 3;
      break;
    case "crc32":
      size = 4;
      break;
    default:
      throw new Error("Unsupported algorithm.");
  }
  return new CrcHash(crc[algorithm], size);
};
