import * as $ from "@goscript/builtin/index.js";

// Float32bits returns the IEEE 754 binary representation of f,
// with the sign bit of f and the result in the same bit position.
// Float32bits(Float32frombits(x)) == x.
export function Float32bits(f: number): number {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setFloat32(0, f, true); // little endian
	return view.getUint32(0, true);
}

// Float32frombits returns the floating-point number corresponding
// to the IEEE 754 binary representation b, with the sign bit of b
// and the result in the same bit position.
// Float32frombits(Float32bits(x)) == x.
export function Float32frombits(b: number): number {
	const buffer = new ArrayBuffer(4);
	const view = new DataView(buffer);
	view.setUint32(0, b, true); // little endian
	return view.getFloat32(0, true);
}

// Float64bits returns the IEEE 754 binary representation of f as a uint64,
// with the sign bit of f and the result in the same bit position,
// and Float64bits(Float64frombits(x)) == x. The uint64 maps to bigint to
// preserve the full 64-bit pattern.
export function Float64bits(f: number): bigint {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setFloat64(0, f, true); // little endian
	return view.getBigUint64(0, true);
}

// Float64frombits returns the floating-point number corresponding
// to the IEEE 754 binary representation b, with the sign bit of b
// and the result in the same bit position.
// Float64frombits(Float64bits(x)) == x. The uint64 argument is a bigint.
export function Float64frombits(b: bigint): number {
	const buffer = new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setBigUint64(0, BigInt.asUintN(64, b), true); // little endian
	return view.getFloat64(0, true);
}

