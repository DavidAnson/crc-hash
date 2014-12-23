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
  var buffer = new Buffer(this.resultSize);
  var writeFunction = [null, null, null, buffer.writeUInt32BE][this.resultSize - 1];
  writeFunction.call(buffer, this.value || 0, 0);
  this.push(buffer);
  callback();
};

/**
 * Creates and returns an object to compute CRC hash digests.
 * The legacy update and digest methods are not supported.
 *
 * @param {string} algorithm CRC algorithm (supported values: crc32).
 * @return {Stream.Transform} Duplex stream like Crypto.Hash (unsupported methods: update, digest).
 */
module.exports.createHash = function(algorithm) {
  if (!algorithm) {
    throw new Error("Missing algorithm.");
  }
  if (algorithm === "crc32") {
    return new CrcHash(crc[algorithm], 4);
  }
  throw new Error("Unsupported algorithm.");
};
