package compiler

import "testing"

func TestIntegerBitHelpersHandleNilTypes(t *testing.T) {
	if bits, ok := unsignedIntegerBits(nil); ok || bits != 0 {
		t.Fatalf("unsignedIntegerBits(nil) = %d, %v; want 0, false", bits, ok)
	}
	if bits, ok := signedIntegerBits(nil); ok || bits != 0 {
		t.Fatalf("signedIntegerBits(nil) = %d, %v; want 0, false", bits, ok)
	}
	if bits, ok := integerBits(nil); ok || bits != 0 {
		t.Fatalf("integerBits(nil) = %d, %v; want 0, false", bits, ok)
	}
	if isRuntimeWideIntegerType(nil) {
		t.Fatalf("isRuntimeWideIntegerType(nil) = true; want false")
	}
}
