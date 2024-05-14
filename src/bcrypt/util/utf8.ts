/** Converts a string to an array of UTF8 bytes. */
export function utf8Array(value: string): Int32Array {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(value);
  const int32Array = new Int32Array(uint8Array.byteLength);
  int32Array.set(uint8Array);

  return int32Array;
}
