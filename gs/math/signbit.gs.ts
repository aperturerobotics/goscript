import * as $ from "@goscript/builtin/index.js";

// Signbit reports whether x is negative or negative zero. It reads the IEEE-754
// sign bit directly so that negative NaN (sign bit set) reports true, matching
// Go; a value comparison would miss it because -NaN < 0 is false.
export function Signbit(x: number): boolean {
	const dv = new DataView(new ArrayBuffer(8))
	dv.setFloat64(0, x)
	return (dv.getUint8(0) & 0x80) !== 0
}

