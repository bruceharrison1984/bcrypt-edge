import {
  BCRYPT_SALT_LEN,
  GENSALT_DEFAULT_LOG2_ROUNDS,
  _hash,
} from './bcrypt/impl';
import { base64_encode } from './bcrypt/util/base64';

const getRandomValues = (length: number) => {
  const buffer = new Int32Array(length);
  return crypto.getRandomValues(buffer);
};

/**
 * Synchronously generates a salt.
 * @param {number=} rounds Number of rounds to use, defaults to 10 if omitted
 * @returns {string} Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync = (rounds?: number) => {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;

  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  const salt = [];
  salt.push('$2a$');
  if (rounds < 10) salt.push('0');
  salt.push(rounds.toString());
  salt.push('$');
  salt.push(base64_encode(getRandomValues(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN)); // May throw
  return salt.join('');
};

/**
 * Synchronously generates a hash for the given string.
 * @param {string} s String to hash
 * @param {(number|string)=} salt Salt length to generate or salt to use, default to 10
 * @returns {string} Resulting hash
 */
export const hashSync = (value: string | Buffer, salt?: string | number) => {
  if (typeof salt === 'undefined') salt = GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof salt === 'number') salt = genSaltSync(salt);
  if (typeof value !== 'string' || typeof salt !== 'string')
    throw Error('Illegal arguments: ' + typeof value + ', ' + typeof salt);

  return _hash(value, salt);
};

/**
 * Compares two strings of the same length in constant time.
 * @param {string} known Must be of the correct length
 * @param {string} unknown Must be the same length as `known`
 * @returns {boolean}
 * @inner
 */
const safeStringCompare = (known: string, unknown: string) => {
  let diff = known.length ^ unknown.length;
  for (let i = 0; i < known.length; ++i) {
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
export const compareSync = (value: string | Buffer, hash: string) => {
  if (typeof value !== 'string' || typeof hash !== 'string')
    throw Error('Illegal arguments: ' + typeof value + ', ' + typeof hash);
  if (hash.length !== 60) return false;
  return safeStringCompare(
    hashSync(value, hash.substring(0, hash.length - 31)),
    hash
  );
};

/**
 * Gets the number of rounds used to encrypt the specified hash.
 * @param {string} hash Hash to extract the used number of rounds from
 * @returns {number} Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
export const getRounds = (hash: string) => {
  if (typeof hash !== 'string')
    throw Error('Illegal arguments: ' + typeof hash);
  return parseInt(hash.split('$')[2], 10);
};

/**
 * Gets the salt portion from a hash. Does not validate the hash.
 * @param {string} hash Hash to extract the salt from
 * @returns {string} Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
export const getSaltSync = (hash: string) => {
  if (typeof hash !== 'string')
    throw Error('Illegal arguments: ' + typeof hash);
  if (hash.length !== 60)
    throw Error('Illegal hash length: ' + hash.length + ' != 60');
  return hash.substring(0, 29);
};

export default {
  compareSync,
  getRounds,
  genSaltSync,
  hashSync,
};
