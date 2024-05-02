/**
 * Synchronously generates a salt.
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 */
declare const genSaltSync: (rounds?: number) => string;
/**
 * Synchronously generates a hash for the given string.
 * @param s String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
declare const hashSync: (value: string | Buffer, salt?: string | number) => string;
/**
 * Synchronously tests a string against a hash.
 * @param s String to compare
 * @param hash Hash to test against
 * @returns true if matching, otherwise false
 * @throws If an argument is illegal
 */
declare const compareSync: (value: string | Buffer, hash: string) => boolean;
/**
 * Gets the number of rounds used to encrypt the specified hash.
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws If `hash` is not a string
 */
declare const getRounds: (hash: string) => number;
/**
 * Gets the salt portion from a hash. Does not validate the hash.
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws If `hash` is not a string or otherwise invalid
 */
declare const getSaltSync: (hash: string) => string;
declare const _default: {
    compareSync: (value: string | Buffer, hash: string) => boolean;
    getRounds: (hash: string) => number;
    genSaltSync: (rounds?: number | undefined) => string;
    hashSync: (value: string | Buffer, salt?: string | number | undefined) => string;
};
export { _default as default, genSaltSync, hashSync, compareSync, getRounds, getSaltSync };
