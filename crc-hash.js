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

// Helpers
CrcHash.prototype.getResultBuffer = function() {
  var buffer = new Buffer(4);
  buffer.writeUInt32BE(this.value || 0, 0);
  buffer = buffer.slice(4 - this.resultSize);
  return buffer;
};
CrcHash.prototype.getErrorFunction = function(message) {
  return function() {
    throw new Error(message);
  };
};

// Transform function implementations
CrcHash.prototype._transform = function(chunk, encoding, callback) {
  this.value = this.implementation(chunk, this.value);
  callback();
};
CrcHash.prototype._flush = function(callback) {
  var buffer = this.getResultBuffer();
  this.push(buffer);
  callback();
};

// Legacy update/digest support
CrcHash.prototype.update = function(data, encoding) {
  // Validate data parameter
  if ((typeof data !== "string") && !(data instanceof Buffer)) {
    throw new Error("Not a string or buffer");
  }
  if (!(data instanceof Buffer)) {
    // Normalize encoding parameter
    if ((encoding !== "utf8") && (encoding !== "ascii") && (encoding !== "binary")) {
      encoding = "binary";
    }
    // Create Buffer for data
    data = new Buffer(data, encoding);
  }
  // Update hash and return
  this.value = this.implementation(data, this.value);
  return this;
};
CrcHash.prototype.digest = function(encoding) {
  // hash object can not be used after digest method has been called
  this.update = this.getErrorFunction("HashUpdate fail");
  this.digest = this.getErrorFunction("Not initialized");
  // Unsupported encoding returns a Buffer
  if ((encoding !== "hex") && (encoding !== "binary") && (encoding !== "base64")) {
    encoding = null;
  }
  // Return Buffer or encoded string
  var buffer = this.getResultBuffer();
  return encoding ? buffer.toString(encoding) : buffer;
};

/**
 * Creates and returns a hash object which can be used to generate CRC hash digests.
 *
 * @param {string} algorithm CRC algorithm (supported values: crc32, crc24, crc16, crc16ccitt, crc16modbus, crc8, crc81wire, crc1).
 * @return {Stream.Transform} Duplex stream as with Crypto.Hash (including legacy update/digest methods).
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
