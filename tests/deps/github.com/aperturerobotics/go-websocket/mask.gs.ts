// Generated file based on mask.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/math/bits/index.js"

export function maskGo(b: $.Slice<number>, key: number): number {
	if ($.len(b) >= 8) {
		let key64 = $.uint64Add(($.uint64Mul($.uint64(key), (2 ** 32))), $.uint64(key))

		// At some point in the future we can clean these unrolled loops up.
		// See https://github.com/golang/go/issues/31586#issuecomment-487436401

		// Then we xor until b is less than 128 bytes.
		while ($.len(b) >= 128) {
			let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 32, 40))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 32, 40), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 40, 48))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 40, 48), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 48, 56))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 48, 56), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 56, 64))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 56, 64), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 64, 72))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 64, 72), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 72, 80))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 72, 80), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 80, 88))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 80, 88), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 88, 96))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 88, 96), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 96, 104))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 96, 104), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 104, 112))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 104, 112), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 112, 120))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 112, 120), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 120, 128))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 120, 128), $.uint64Xor(v, key64))
			b = $.goSlice(b, 128, undefined)
		}

		// Then we xor until b is less than 64 bytes.
		while ($.len(b) >= 64) {
			let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 32, 40))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 32, 40), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 40, 48))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 40, 48), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 48, 56))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 48, 56), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 56, 64))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 56, 64), $.uint64Xor(v, key64))
			b = $.goSlice(b, 64, undefined)
		}

		// Then we xor until b is less than 32 bytes.
		while ($.len(b) >= 32) {
			let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 16, 24))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 16, 24), $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 24, 32))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 24, 32), $.uint64Xor(v, key64))
			b = $.goSlice(b, 32, undefined)
		}

		// Then we xor until b is less than 16 bytes.
		while ($.len(b) >= 16) {
			let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint64Xor(v, key64))
			v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(b, 8, 16))
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.goSlice(b, 8, 16), $.uint64Xor(v, key64))
			b = $.goSlice(b, 16, undefined)
		}

		// Then we xor until b is less than 8 bytes.
		while ($.len(b) >= 8) {
			let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64(b)
			$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64(b, $.uint64Xor(v, key64))
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
