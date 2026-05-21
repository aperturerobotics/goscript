package main

type token struct {
	value int
}

func newToken(value int) *token {
	return &token{value: value}
}

func consumeToken(tok *token) int {
	return tok.value
}
