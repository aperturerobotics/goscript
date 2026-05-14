package main

import (
	"os"

	"github.com/aperturerobotics/cli"
)

// version is set by goreleaser via ldflags
var version = "dev"

func main() {
	app := newApp()
	if err := app.Run(os.Args); err != nil {
		_, _ = os.Stderr.WriteString(err.Error() + "\n")
		os.Exit(1)
	}
}

func newApp() *cli.App {
	app := cli.NewApp()
	app.Version = version

	app.Authors = []*cli.Author{
		{Name: "Christian Stewart", Email: "christian@aperture.us"},
	}

	app.Usage = "GoScript compiles Go to Typescript."
	app.Commands = append(app.Commands, compileCommands()...)

	return app
}
