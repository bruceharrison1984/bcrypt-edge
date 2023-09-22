const BASE64_CODE =
  './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

const BASE64_INDEX = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
  -1, -1, -1, -1, -1, -1, -1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, -1, -1, -1, -1, -1, -1, 28,
  29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 50, 51, 52, 53, -1, -1, -1, -1, -1,
];

/**
 * Encodes a byte array to base64 with up to len bytes of input.
 * @param b Byte array
 * @param len Maximum input length
 */
export const base64_encode = (b: Int32Array, len: number) => {
  let off = 0,
    c1,
    c2;
  let rs = '';

  if (len <= 0 || len > b.length) throw Error('Illegal len: ' + len);

  while (off < len) {
    c1 = b[off++] & 0xff;
    rs += BASE64_CODE[(c1 >> 2) & 0x3f];
    c1 = (c1 & 0x03) << 4;

    if (off >= len) {
      rs += BASE64_CODE[c1 & 0x3f];
      break;
    }

    c2 = b[off++] & 0xff;
    c1 |= (c2 >> 4) & 0x0f;
    rs += BASE64_CODE[c1 & 0x3f];
    c1 = (c2 & 0x0f) << 2;

    if (off >= len) {
      rs += BASE64_CODE[c1 & 0x3f];
      break;
    }

    c2 = b[off++] & 0xff;
    c1 |= (c2 >> 6) & 0x03;
    rs += BASE64_CODE[c1 & 0x3f];
    rs += BASE64_CODE[c2 & 0x3f];
  }
  return rs;
};

/**
 * Decodes a base64 encoded string to up to len bytes of output.
 * @param s String to decode
 * @param len Maximum output length
 */
export const base64_decode = (s: string, len: number) => {
  const slen = s.length;
  let rs = '';

  let off = 0,
    olen = 0,
    c1,
    c2,
    c3,
    c4,
    o,
    code;
  if (len <= 0) throw Error('Illegal len: ' + len);
  while (off < slen - 1 && olen < len) {
    code = s.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;

    if (c1 == -1 || c2 == -1) break;
    o = (c1 << 2) >>> 0;
    o |= (c2 & 0x30) >> 4;
    rs += String.fromCharCode(o);

    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;

    if (c3 == -1) break;
    o = ((c2 & 0x0f) << 4) >>> 0;
    o |= (c3 & 0x3c) >> 2;
    rs += String.fromCharCode(o);

    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = ((c3 & 0x03) << 6) >>> 0;
    o |= c4;
    rs += String.fromCharCode(o);
    ++olen;
  }

  const res = new Int32Array(olen);
  for (off = 0; off < olen; off++) res[off] = rs[off].charCodeAt(0);
  return res;
};
