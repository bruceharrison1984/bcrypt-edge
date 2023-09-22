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
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 */
export const genSaltSync = (rounds?: number) => {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;

  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  let salt = '';
  salt += '$2a$';
  if (rounds < 10) salt += '0';
  salt += rounds.toString();
  salt += '$';
  salt += base64_encode(getRandomValues(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN); // May thr
  return salt;
};

/**
 * Synchronously generates a hash for the given string.
 * @param s String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
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
 * @param known Must be of the correct length
 * @param unknown Must be the same length as `known`
 * @returns Boolean
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
 * @param s String to compare
 * @param hash Hash to test against
 * @returns true if matching, otherwise false
 * @throws If an argument is illegal
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
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws If `hash` is not a string
 */
export const getRounds = (hash: string) => {
  if (typeof hash !== 'string')
    throw Error('Illegal arguments: ' + typeof hash);
  return parseInt(hash.split('$')[2], 10);
};

/**
 * Gets the salt portion from a hash. Does not validate the hash.
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws If `hash` is not a string or otherwise invalid
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
