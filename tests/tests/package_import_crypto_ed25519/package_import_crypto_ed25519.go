package main

import (
	"bytes"
	"crypto/ed25519"
	"crypto/rand"
)

func main() {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	println("generate err nil", err == nil)
	println("pub len", len(pub))
	println("priv len", len(priv))

	msg := []byte("goscript")
	sig := ed25519.Sign(priv, msg)
	println("sig len", len(sig))
	println("verify ok", ed25519.Verify(pub, msg, sig))
	println("verify wrong", ed25519.Verify(pub, []byte("wrong"), sig))

	pubFromPriv := priv.Public().(ed25519.PublicKey)
	println("public equal", bytes.Equal(pub, pubFromPriv))
	println("private seed len", len(priv.Seed()))
}
