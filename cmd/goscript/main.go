package main

import (
	"os"

	"github.com/aperturerobotics/cli"
)

// version is set by goreleaser via ldflags
var version = "dev"

func main() {
	app := cli.NewApp()
	app.Version = version

	app.Authors = []*cli.Author{
		{Name: "Christian Stewart", Email: "christian@aperture.us"},
	}

	app.Usage = "GoScript compiles Go to Typescript."
	app.Commands = append(app.Commands, CompileCommands...)

	if err := app.Run(os.Args); err != nil {
		_, _ = os.Stderr.WriteString(err.Error() + "\n")
		os.Exit(1)
	}
}
