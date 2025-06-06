import * as $ from "@goscript/builtin/index.js";

// FormatFloat converts the floating-point number f to a string,
// according to the format fmt and precision prec. It rounds the
// result assuming that the original was obtained from a floating-point
// value of bitSize bits (32 for float32, 64 for float64).
export function FormatFloat(f: number, fmt: number, prec: number, bitSize: number): string {
	const fmtChar = String.fromCharCode(fmt);
	
	// Handle special cases
	if (isNaN(f)) {
		return "NaN";
	}
	if (f === Infinity) {
		return "+Inf";
	}
	if (f === -Infinity) {
		return "-Inf";
	}
	
	// Convert to appropriate precision for float32
	if (bitSize === 32) {
		f = Math.fround(f);
	}
	
	switch (fmtChar.toLowerCase()) {
		case 'e':
			// Exponential notation
			if (prec < 0) {
				return f.toExponential();
			}
			return f.toExponential(prec);
			
		case 'f':
			// Fixed-point notation
			if (prec < 0) {
				return f.toString();
			}
			return f.toFixed(prec);
			
		case 'g':
			// Use the more compact of 'e' or 'f'
			if (prec < 0) {
				return f.toPrecision();
			}
			return f.toPrecision(prec + 1);
			
		case 'x':
			// Hexadecimal notation (simplified)
			return f.toString(16);
			
		default:
			// Default to 'g' format
			if (prec < 0) {
				return f.toString();
			}
			return f.toPrecision(prec + 1);
	}
}

// AppendFloat appends the string form of the floating-point number f,
// as generated by FormatFloat, to dst and returns the extended buffer.
export function AppendFloat(dst: $.Bytes, f: number, fmt: number, prec: number, bitSize: number): $.Bytes {
	const str = FormatFloat(f, fmt, prec, bitSize);
	return $.append(dst, ...$.stringToBytes(str)!);
} 