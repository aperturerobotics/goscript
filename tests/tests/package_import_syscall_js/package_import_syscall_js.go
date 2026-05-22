package main

import "syscall/js"

func main() {
	global := js.Global()
	global.Set("__GOSCRIPT_JS_TEST__", js.ValueOf(map[string]any{
		"name": "goscript",
		"nums": []any{1, 2, 3},
	}))
	obj := global.Get("__GOSCRIPT_JS_TEST__")
	println("type:", obj.Type().String())
	println("name:", obj.Get("name").String())
	println("length:", obj.Get("nums").Length())

	cb := js.FuncOf(func(this js.Value, args []js.Value) any {
		return args[0].Int() + 1
	})
	defer cb.Release()
	println("callback:", cb.Invoke(41).Int())

	bytes := global.Get("Uint8Array").New(3)
	bytes.SetIndex(0, 65)
	bytes.SetIndex(1, 66)
	bytes.SetIndex(2, 67)
	dst := make([]byte, 3)
	js.CopyBytesToGo(dst, bytes)
	println("bytes:", string(dst))
}
