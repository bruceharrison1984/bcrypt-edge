"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSaltSync = exports.getRounds = exports.compareSync = exports.hashSync = exports.genSaltSync = void 0;
var impl_1 = require("./bcrypt/impl");
var base64_1 = require("./bcrypt/util/base64");
var getRandomValues = function (length) {
    var buffer = new Uint32Array(length);
    return Array.from(crypto.getRandomValues(buffer));
};
/**
 * Synchronously generates a salt.
 * @param {number=} rounds Number of rounds to use, defaults to 10 if omitted
 * @returns {string} Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
var genSaltSync = function (rounds) {
    rounds = rounds || impl_1.GENSALT_DEFAULT_LOG2_ROUNDS;
    if (rounds < 4)
        rounds = 4;
    else if (rounds > 31)
        rounds = 31;
    var salt = [];
    salt.push('$2a$');
    if (rounds < 10)
        salt.push('0');
    salt.push(rounds.toString());
    salt.push('$');
    salt.push((0, base64_1.base64_encode)(getRandomValues(impl_1.BCRYPT_SALT_LEN), impl_1.BCRYPT_SALT_LEN)); // May throw
    return salt.join('');
};
exports.genSaltSync = genSaltSync;
/**
 * Synchronously generates a hash for the given string.
 * @param {string} s String to hash
 * @param {(number|string)=} salt Salt length to generate or salt to use, default to 10
 * @returns {string} Resulting hash
 */
var hashSync = function (value, salt) {
    if (typeof salt === 'undefined')
        salt = impl_1.GENSALT_DEFAULT_LOG2_ROUNDS;
    if (typeof salt === 'number')
        salt = (0, exports.genSaltSync)(salt);
    if (typeof value !== 'string' || typeof salt !== 'string')
        throw Error('Illegal arguments: ' + typeof value + ', ' + typeof salt);
    return (0, impl_1._hash)(value, salt);
};
exports.hashSync = hashSync;
/**
 * Compares two strings of the same length in constant time.
 * @param {string} known Must be of the correct length
 * @param {string} unknown Must be the same length as `known`
 * @returns {boolean}
 * @inner
 */
var safeStringCompare = function (known, unknown) {
    var diff = known.length ^ unknown.length;
    for (var i = 0; i < known.length; ++i) {
        diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
    }
    return diff === 0;
};
/**
 * Synchronously tests a string against a hash.
 * @param {string} s String to compare
 * @param {string} hash Hash to test against
 * @returns {boolean} true if matching, otherwise false
 * @throws {Error} If an argument is illegal
 */
var compareSync = function (value, hash) {
    if (typeof value !== 'string' || typeof hash !== 'string')
        throw Error('Illegal arguments: ' + typeof value + ', ' + typeof hash);
    if (hash.length !== 60)
        return false;
    return safeStringCompare((0, exports.hashSync)(value, hash.substring(0, hash.length - 31)), hash);
};
exports.compareSync = compareSync;
/**
 * Gets the number of rounds used to encrypt the specified hash.
 * @param {string} hash Hash to extract the used number of rounds from
 * @returns {number} Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
var getRounds = function (hash) {
    if (typeof hash !== 'string')
        throw Error('Illegal arguments: ' + typeof hash);
    return parseInt(hash.split('$')[2], 10);
};
exports.getRounds = getRounds;
/**
 * Gets the salt portion from a hash. Does not validate the hash.
 * @param {string} hash Hash to extract the salt from
 * @returns {string} Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
var getSaltSync = function (hash) {
    if (typeof hash !== 'string')
        throw Error('Illegal arguments: ' + typeof hash);
    if (hash.length !== 60)
        throw Error('Illegal hash length: ' + hash.length + ' != 60');
    return hash.substring(0, 29);
};
exports.getSaltSync = getSaltSync;
exports.default = {
    compareSync: exports.compareSync,
    getRounds: exports.getRounds,
    genSaltSync: exports.genSaltSync,
    hashSync: exports.hashSync,
};
