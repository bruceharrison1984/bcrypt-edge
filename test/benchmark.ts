import * as bcrypt from 'bcrypt';
import bcryptEdge from '../src/bcrypt';
import { expect, test, suite } from 'vitest';

// This is a best effort to compare the two libraries. It is difficult to do since they cannot run in the same environment as one another.

// drop async methods
type IBcrypt = Omit<typeof bcrypt, 'genSalt' | 'hash' | 'compare'>;

suite('Benchmarks', () => {
  const pass = 'ä☺𠜎️☁';

  const testSync = (salt: string, impl: IBcrypt) => {
    const start = Date.now();
    const hash = impl.hashSync(pass, salt);
    const end = Date.now();
    const difference = end - start;
    return [hash, difference];
  };

  test('Bcrypt-Edge max input length = 72', () => {
    let s = '';
    const salt = bcryptEdge.genSaltSync(4);
    let last = null;
    while (s.length < 100) {
      s += '0';
      var hash = bcryptEdge.hashSync(s, salt);
      if (hash === last) break;
      last = hash;
    }
    expect(s.length - 1).toBe(72);
  });

  test.each([8, 9, 10, 11, 12, 13, 14, 15])(
    'Hashes Match for %i hash iterations',
    (rounds) => {
      var salt = bcryptEdge.genSaltSync(rounds);
      console.log(`\n** Using ${rounds} rounds with salt ${salt} **`);
      const [bcryptHash, bcryptHashTime] = testSync(salt, bcrypt);
      const [bcryptEdgeHash, bcryptedgeHashTime] = testSync(salt, bcryptEdge);
      console.log(
        `- Bcrypt      | Hash Time: ${bcryptHashTime}ms | Final Hash: ${bcryptHash}`
      );
      console.log(
        `- Bcrypt-Edge | Hash Time: ${bcryptedgeHashTime}ms | Final Hash: ${bcryptEdgeHash}`
      );
      expect(bcryptEdgeHash).toBe(bcryptHash);
    }
  );
});
