//go:build js && wasm

package browserapi

import (
	"fmt"
	"os"
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

func TestBrowserStderrUsesConsoleLog(t *testing.T) {
	console := js.Global().Get("console")
	if console.IsUndefined() || console.IsNull() {
		t.Fatal("missing browser console")
	}

	originalLog := console.Get("log")
	originalError := console.Get("error")
	calls := make([]string, 0, 1)
	logFn := js.FuncOf(func(this js.Value, args []js.Value) any {
		calls = append(calls, "log:"+args[0].String())
		return nil
	})
	errorFn := js.FuncOf(func(this js.Value, args []js.Value) any {
		calls = append(calls, "error:"+args[0].String())
		return nil
	})
	defer logFn.Release()
	defer errorFn.Release()
	defer console.Set("log", originalLog)
	defer console.Set("error", originalError)

	console.Set("log", logFn)
	console.Set("error", errorFn)

	if _, err := fmt.Fprintln(os.Stderr, "goscript stderr proof"); err != nil {
		t.Fatal(err)
	}

	if len(calls) != 1 || calls[0] != "log:goscript stderr proof" {
		t.Fatalf("stderr console calls = %#v, want console.log", calls)
	}
}
