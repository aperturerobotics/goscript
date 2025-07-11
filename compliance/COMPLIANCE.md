# GoScript Compliance Tests

Each test usually has only three files:

1. test_name.go - the Go code to convert to TypeScript
2. test_name.gs.ts - the generated TypeScript code, created automatically on test run
3. expected.log - the expected output from running the .gs.ts, created automatically on first test run

It is also possible to have multiple packages, see `rune_const_reference` for an example.

To run the tests, within the project root: `go test -v ./compiler`

To run a specific compliance test, for example:

```bash
go test -timeout 30s -run ^TestCompliance/for_range_channel$ ./compiler
```
