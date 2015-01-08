# crc-hash

> A Crypto Hash (Stream) implementation for the CRC algorithm.


## Overview

Node.js's [Crypto module](http://nodejs.org/api/crypto.html) implements the [Hash class](http://nodejs.org/api/crypto.html#crypto_class_hash) which offers a simple [Stream](http://nodejs.org/api/stream.html)-based interface for creating hash digests of data. The [createHash function](http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) supports many popular algorithms like [SHA](http://en.wikipedia.org/wiki/Secure_Hash_Algorithm) and [MD5](http://en.wikipedia.org/wiki/MD5), but does not include older/simpler [CRC algorithms](http://en.wikipedia.org/wiki/Cyclic_redundancy_check) like CRC-32. Fortunately, the [crc package in npm](https://www.npmjs.com/package/crc) provides comprehensive CRC support and offers an API that can be conveniently used by a Hash subclass.

`crc-hash` is a Crypto Hash wrapper for the `crc` package that makes it easy for Node.js programs to use the CRC family of hash algorithms via a standard interface.


## Algorithms

All algorithms implemented by `crc` are supported by `crc-hash`:

* CRC-1
* CRC-8
* CRC-8 1-Wire
* CRC-16
* CRC-16 CCITT
* CRC-16 Modbus
* CRC-24
* CRC-32


## Interface

```
/**
 * Creates and returns a hash object which can be used to generate CRC hash digests.
 *
 * @param {string} algorithm CRC algorithm (supported values: crc32, crc24, crc16, crc16ccitt, crc16modbus, crc8, crc81wire, crc1).
 * @return {Stream.Transform} Duplex stream as with Crypto.Hash (including legacy update/digest methods).
 */
createHash(algorithm)
```

See also:

* [Node.js Crypto documentation](http://nodejs.org/api/crypto.html)
* [Node.js Stream documentation](http://nodejs.org/api/stream.html)


## Credits

* [crc](https://www.npmjs.com/package/crc) by [alexgorbatchev](https://www.npmjs.com/~alexgorbatchev)


## License

[MIT](LICENSE)


## Release History

* 0.1.0 - Initial release, supports Stream programming model.
* 0.2.0 - Add support for legacy update/digest methods of Hash.
