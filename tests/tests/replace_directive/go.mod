module github.com/aperturerobotics/goscript/tests/tests/replace_directive

go 1.21

require github.com/example/replaced v0.0.0

replace github.com/example/replaced => ./subpkg
