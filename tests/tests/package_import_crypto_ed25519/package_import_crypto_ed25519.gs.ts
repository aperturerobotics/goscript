// Generated file based on package_import_crypto_ed25519.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rand from "@goscript/crypto/rand/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rand/index.js"
import "@goscript/io/index.js"

export async function generateWithReader(src: io.Reader | null): globalThis.Promise<$.GoError> {
	let [, , err] = await ed25519.GenerateKey($.pointerValueOrNil(src)!)
	return err
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = await ed25519.GenerateKey($.pointerValueOrNil(rand.Reader)!)
	let pub: ed25519.PublicKey = (__goscriptTuple0[0] as ed25519.PublicKey)
	let priv: ed25519.PrivateKey = (__goscriptTuple0[1] as ed25519.PrivateKey)
	let err = __goscriptTuple0[2]
	$.println("generate err nil", err == null)
	$.println("pub len", $.len((pub as ed25519.PublicKey)))
	$.println("priv len", $.len((priv as ed25519.PrivateKey)))

	let msg: $.Slice<number> = new Uint8Array([103, 111, 115, 99, 114, 105, 112, 116])
	let sig: $.Slice<number> = await ed25519.Sign((priv as ed25519.PrivateKey), msg)
	$.println("sig len", $.len(sig))
	$.println("verify ok", await ed25519.Verify((pub as ed25519.PublicKey), msg, sig))
	$.println("verify wrong", await ed25519.Verify((pub as ed25519.PublicKey), new Uint8Array([119, 114, 111, 110, 103]), sig))

	let pubFromPriv: ed25519.PublicKey = ($.mustTypeAssert<ed25519.PublicKey>(ed25519.PrivateKey_Public(priv), "ed25519.PublicKey") as ed25519.PublicKey)
	$.println("public equal", bytes.Equal(pub, pubFromPriv))
	$.println("private seed len", $.len(ed25519.PrivateKey_Seed(priv)))
	$.println("nil literal reader err nil", await generateWithReader(null) == null)
	let src: io.Reader | null = null as io.Reader | null
	$.println("nil interface reader err nil", await generateWithReader(src) == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
