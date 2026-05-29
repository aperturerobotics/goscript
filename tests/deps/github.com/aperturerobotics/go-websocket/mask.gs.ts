// Generated file based on mask.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/math/bits/index.js"

export function maskGo(b: $.Slice<number>, key: number): number {
	if ($.len(b) >= 8) {
		let key64 = $.uint($.uint64Add(($.uint64Mul($.uint(key, 64), (2 ** 32))), $.uint(key, 64)), 64)

		// At some point in the future we can clean these unrolled loops up.
		// See https://github.com/golang/go/issues/31586#issuecomment-487436401

		// Then we xor until b is less than 128 bytes.
		while ($.len(b) >= 128) {
			let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 32, 40)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 32, 40), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 40, 48)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 40, 48), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 48, 56)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 48, 56), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 56, 64)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 56, 64), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 64, 72)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 64, 72), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 72, 80)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 72, 80), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 80, 88)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 80, 88), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 88, 96)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 88, 96), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 96, 104)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 96, 104), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 104, 112)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 104, 112), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 112, 120)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 112, 120), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 120, 128)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 120, 128), $.uint($.uint64Xor(v, key64), 64))
			b = $.goSlice(b, 128, undefined)
		}

		// Then we xor until b is less than 64 bytes.
		while ($.len(b) >= 64) {
			let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 32, 40)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 32, 40), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 40, 48)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 40, 48), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 48, 56)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 48, 56), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 56, 64)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 56, 64), $.uint($.uint64Xor(v, key64), 64))
			b = $.goSlice(b, 64, undefined)
		}

		// Then we xor until b is less than 32 bytes.
		while ($.len(b) >= 32) {
			let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint($.uint64Xor(v, key64), 64))
			b = $.goSlice(b, 32, undefined)
		}

		// Then we xor until b is less than 16 bytes.
		while ($.len(b) >= 16) {
			let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint($.uint64Xor(v, key64), 64))
			v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16)), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint($.uint64Xor(v, key64), 64))
			b = $.goSlice(b, 16, undefined)
		}

		// Then we xor until b is less than 8 bytes.
		while ($.len(b) >= 8) {
			let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b), 64)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint($.uint64Xor(v, key64), 64))
			b = $.goSlice(b, 8, undefined)
		}
	}

	// Then we xor until b is less than 4 bytes.
	while ($.len(b) >= 4) {
		let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint32(b), 32)
		$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint32(b, $.uint(v ^ key, 32))
		b = $.goSlice(b, 4, undefined)
	}

	// xor remaining bytes.
	for (let __goscriptRangeTarget0 = b, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		b![i] = b![i] ^ ($.uint($.uint(key, 8), 8))
		key = $.uint(bits.RotateLeft32($.uint(key, 32), -8), 32)
	}

	return $.uint(key, 32)
}
