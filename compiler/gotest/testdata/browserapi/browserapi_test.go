//go:build js && wasm

package browserapi

import (
	"syscall/js"
	"testing"
)

func TestBrowserAPI(t *testing.T) {
	document := js.Global().Get("document")
	if document.IsUndefined() || document.IsNull() {
		t.Fatal("missing browser document")
	}
	div := document.Call("createElement", "div")
	div.Set("id", "goscript-browser-api")
	if got := div.Get("id").String(); got != "goscript-browser-api" {
		t.Fatalf("div id = %q", got)
	}
}
