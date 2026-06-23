import * as $ from "@goscript/builtin/index.js";

// Copysign returns a value with the magnitude of f and the sign of sign. It
// copies the IEEE-754 sign bit byte-for-byte so that a negative NaN sign is
// honored, matching Go's bit-level implementation; Math.sign cannot report the
// sign of NaN.
export function Copysign(f: number, sign: number): number {
	const dv = new DataView(new ArrayBuffer(8))
	dv.setFloat64(0, sign)
	const signByte = dv.getUint8(0) & 0x80
	dv.setFloat64(0, f)
	dv.setUint8(0, (dv.getUint8(0) & 0x7f) | signByte)
	return dv.getFloat64(0)
}

