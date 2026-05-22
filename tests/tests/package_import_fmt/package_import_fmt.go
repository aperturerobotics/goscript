package main

import (
	"bytes"
	"fmt"
)

type byteFormatter struct {
	prefix []byte
}

func (b byteFormatter) Format(state fmt.State, verb rune) {
	buf := append([]byte{}, b.prefix...)
	buf = append(buf, byte(verb))
	_, _ = state.Write(buf)
}

func main() {
	// Test basic Print functions
	fmt.Print("Hello")
	fmt.Print(" ")
	fmt.Print("World")
	fmt.Println()

	// Test Printf with basic formatting
	name := "Go"
	version := 1.21
	fmt.Printf("Welcome to %s %.2f\n", name, version)

	// Test Println
	fmt.Println("This is println")

	// Test Sprint functions
	result := fmt.Sprint("Sprint", " ", "result")
	fmt.Println("Sprint result:", result)
	parts := []any{"Spread", " ", "result"}
	spreadResult := fmt.Sprint(parts...)
	fmt.Println("Sprint spread result:", spreadResult)

	// Test Sprintf
	formatted := fmt.Sprintf("Number: %d, String: %s", 42, "test")
	fmt.Println("Sprintf result:", formatted)
	formatArgs := []any{7, "spread"}
	formattedSpread := fmt.Sprintf("Spread Number: %d, String: %s", formatArgs...)
	fmt.Println("Sprintf spread result:", formattedSpread)

	// Test Sprintln
	sprintln_result := fmt.Sprintln("Sprintln", "result")
	fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	err := fmt.Errorf("error code: %d", 404)
	fmt.Println("Error:", err)

	// Test various format verbs
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", 123)
	fmt.Printf("Float: %f\n", 3.14159)
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", 42)
	fmt.Printf("Value: %v\n", []int{1, 2, 3})

	// Test width and precision
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", 3.14159)
	fmt.Printf("Both: '%5.2f'\n", 3.14159)
	fmt.Printf("Formatter: %v\n", byteFormatter{prefix: []byte("byte-")})
	appended := fmt.Append([]byte("base-"), "tail")
	fmt.Println("Append bytes:", string(appended))
	var buf bytes.Buffer
	fmt.Fprintln(&buf, "Buffered writer")
	fmt.Print(buf.String())

	println("test finished")
}
