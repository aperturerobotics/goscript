// Generated file based on package_import_pkg_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"
import "@goscript/github.com/pkg/errors/index.js"

export async function main(): globalThis.Promise<void> {
	// Test New
	let err1 = errors.New("basic error")
	$.println("New error:", $.pointerValue<Exclude<$.GoError, null>>(err1).Error())

	// Test Errorf
	let err2 = errors.Errorf("formatted error: %d", 42)
	$.println("Errorf error:", $.pointerValue<Exclude<$.GoError, null>>(err2).Error())

	// Test WithStack
	let baseErr = errors.New("base error")
	let err3 = errors.WithStack($.pointerValueOrNil(baseErr))
	$.println("WithStack error:", $.pointerValue<Exclude<$.GoError, null>>(err3).Error())

	// Test Wrap
	let err4 = errors.Wrap($.pointerValueOrNil(baseErr), "wrapped message")
	$.println("Wrap error:", $.pointerValue<Exclude<$.GoError, null>>(err4).Error())

	// Test Wrapf
	let err5 = errors.Wrapf($.pointerValueOrNil(baseErr), "wrapped with format: %s", "test")
	$.println("Wrapf error:", $.pointerValue<Exclude<$.GoError, null>>(err5).Error())

	// Test WithMessage
	let err6 = errors.WithMessage($.pointerValueOrNil(baseErr), "additional message")
	$.println("WithMessage error:", $.pointerValue<Exclude<$.GoError, null>>(err6).Error())

	// Test WithMessagef
	let err7 = errors.WithMessagef($.pointerValueOrNil(baseErr), "additional formatted message: %d", 123)
	$.println("WithMessagef error:", $.pointerValue<Exclude<$.GoError, null>>(err7).Error())

	// Test Cause
	let cause = errors.Cause($.pointerValueOrNil(err4))
	$.println("Cause error:", $.pointerValue<Exclude<$.GoError, null>>(cause).Error())

	// Test nil handling
	let nilErr = errors.WithStack(null)
	if (nilErr == null) {
		$.println("WithStack with nil returns nil")
	}

	let nilWrap = errors.Wrap(null, "message")
	if (nilWrap == null) {
		$.println("Wrap with nil returns nil")
	}

	let err: $.GoError = null as $.GoError
	let nilWrapVar = errors.Wrap($.pointerValueOrNil(err), "message")
	if (nilWrapVar == null) {
		$.println("Wrap with nil error variable returns nil")
	}

	// Test Go 1.13 error handling
	let unwrapped = errors.Unwrap($.pointerValueOrNil(err4))
	if (unwrapped != null) {
		$.println("Unwrap error:", $.pointerValue<Exclude<$.GoError, null>>(unwrapped).Error())
	}

	// Test Is
	if (errors.Is($.pointerValueOrNil(err4), $.pointerValueOrNil(baseErr))) {
		$.println("Is check passed")
	}

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
