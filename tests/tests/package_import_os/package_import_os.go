package main

import "os"

func main() {
	if wd, err := os.Getwd(); err == nil {
		if wd != "" {
			println("Current working directory ok")
		}
	} else {
		println("Error getting working directory:", err.Error())
	}

	// Test Environment variables - these work
	os.Setenv("TEST_VAR", "test_value")
	println("Set environment variable TEST_VAR")

	if val := os.Getenv("TEST_VAR"); val != "" {
		println("Got environment variable TEST_VAR:", val)
	}

	os.Unsetenv("TEST_VAR")
	if val := os.Getenv("TEST_VAR"); val == "" {
		println("Environment variable TEST_VAR unset successfully")
	}

	// Test Hostname - works with mock data
	if hostname, err := os.Hostname(); err == nil {
		println("Hostname:", hostname)
	} else {
		println("Error getting hostname:", err.Error())
	}

	n, err := os.Stdout.Write([]byte("stdout write works\n"))
	if err == nil {
		println("Stdout write bytes:", n)
	} else {
		println("Stdout write error:", err.Error())
	}

	fileName := "os-runtime-file.txt"
	writeErr := os.WriteFile(fileName, []byte("runtime file contents"), 0o644)
	if writeErr == nil {
		println("WriteFile ok")
	} else {
		println("WriteFile error:", writeErr.Error())
	}

	if data, readErr := os.ReadFile(fileName); readErr == nil {
		println("ReadFile data:", string(data))
	} else {
		println("ReadFile error:", readErr.Error())
	}

	if info, statErr := os.Stat(fileName); statErr == nil {
		println("Stat name:", info.Name())
		println("Stat size:", info.Size())
	} else {
		println("Stat error:", statErr.Error())
	}

	removeErr := os.Remove(fileName)
	if removeErr == nil {
		println("Remove ok")
	} else {
		println("Remove error:", removeErr.Error())
	}

	if tempDir, err := os.MkdirTemp("", "os-temp-dir-*"); err == nil {
		println("MkdirTemp ok")
		os.RemoveAll(tempDir)
	} else {
		println("MkdirTemp error:", err.Error())
	}

	if tempFile, err := os.CreateTemp("", "os-temp-file-*"); err == nil {
		println("CreateTemp ok")
		println("CreateTemp name empty:", tempFile.Name() == "")
		tempFile.Close()
		os.Remove(tempFile.Name())
	} else {
		println("CreateTemp error:", err.Error())
	}
}
