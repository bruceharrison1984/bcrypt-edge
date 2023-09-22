"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8Array = exports.utf8Length = void 0;
/** Calculates the byte length of a string encoded as UTF8. */
function utf8Length(value) {
    var len = 0, c = 0;
    for (var i = 0; i < value.length; ++i) {
        c = value.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xfc00) === 0xd800 &&
            (value.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
            ++i;
            len += 4;
        }
        else
            len += 3;
    }
    return len;
}
exports.utf8Length = utf8Length;
/** Converts a string to an array of UTF8 bytes. */
function utf8Array(value) {
    var offset = 0, c1, c2;
    var buffer = new Array(utf8Length(value));
    for (var i = 0, k = value.length; i < k; ++i) {
        c1 = value.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        }
        else if (c1 < 2048) {
            buffer[offset++] = (c1 >> 6) | 192;
            buffer[offset++] = (c1 & 63) | 128;
        }
        else if ((c1 & 0xfc00) === 0xd800 &&
            ((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
            c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
            ++i;
            buffer[offset++] = (c1 >> 18) | 240;
            buffer[offset++] = ((c1 >> 12) & 63) | 128;
            buffer[offset++] = ((c1 >> 6) & 63) | 128;
            buffer[offset++] = (c1 & 63) | 128;
        }
        else {
            buffer[offset++] = (c1 >> 12) | 224;
            buffer[offset++] = ((c1 >> 6) & 63) | 128;
            buffer[offset++] = (c1 & 63) | 128;
        }
    }
    return buffer;
}
exports.utf8Array = utf8Array;
