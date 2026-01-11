// Generated file based on package_import_pkg_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"

export async function main(): Promise<void> {
	// Test New
	let err1 = errors.New("basic error")
	$.println("New error:", err1!.Error())

	// Test Errorf
	let err2 = errors.Errorf("formatted error: %d", 42)
	$.println("Errorf error:", err2!.Error())

	// Test WithStack
	let baseErr = errors.New("base error")
	let err3 = errors.WithStack(baseErr)
	$.println("WithStack error:", err3!.Error())

	// Test Wrap
	let err4 = errors.Wrap(baseErr, "wrapped message")
	$.println("Wrap error:", err4!.Error())

	// Test Wrapf
	let err5 = errors.Wrapf(baseErr, "wrapped with format: %s", "test")
	$.println("Wrapf error:", err5!.Error())

	// Test WithMessage
	let err6 = errors.WithMessage(baseErr, "additional message")
	$.println("WithMessage error:", err6!.Error())

	// Test WithMessagef
	let err7 = errors.WithMessagef(baseErr, "additional formatted message: %d", 123)
	$.println("WithMessagef error:", err7!.Error())

	// Test Cause
	let cause = errors.Cause(err4)
	$.println("Cause error:", cause!.Error())

	// Test nil handling
	let nilErr = errors.WithStack(null)
	if (nilErr == null) {
		$.println("WithStack with nil returns nil")
	}

	let nilWrap = errors.Wrap(null, "message")
	if (nilWrap == null) {
		$.println("Wrap with nil returns nil")
	}

	// Test Go 1.13 error handling
	let unwrapped = errors.Unwrap(err4)
	if (unwrapped != null) {
		$.println("Unwrap error:", unwrapped!.Error())
	}

	// Test Is
	if (errors.Is(err4, baseErr)) {
		$.println("Is check passed")
	}

	$.println("test finished")
}

