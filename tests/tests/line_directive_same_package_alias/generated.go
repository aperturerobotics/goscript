package main

//line grammar.y:1
type yySymType struct {
	value int
}

type yyParserImpl struct{}

func yyNewParser() *yyParserImpl {
	return &yyParserImpl{}
}
