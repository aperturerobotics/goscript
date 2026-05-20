package main

import "github.com/aperturerobotics/goscript/tests/tests/call_imported_interface_param/subpkg"

func Use(w subpkg.Writer) {
	_, _ = w.Write([]byte("x"))
}
