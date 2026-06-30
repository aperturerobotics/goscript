module github.com/s4wave/goscript/prototypes/spacewave-async-metric

go 1.26.3

toolchain go1.26.4

require (
	github.com/pkg/errors v0.9.1
	github.com/s4wave/goscript v0.2.10-0.20260630071943-192219ba14f3
	github.com/s4wave/spacewave v0.52.0-rc2.0.20260630090613-1c9b6e07c592
)

require (
	github.com/aperturerobotics/json-iterator-lite v1.1.0 // indirect
	github.com/sirupsen/logrus v1.9.5-0.20260508084601-d4a50659cfd6 // indirect
	golang.org/x/mod v0.37.0 // indirect
	golang.org/x/sync v0.21.0 // indirect
	golang.org/x/sys v0.46.0 // indirect
	golang.org/x/tools v0.47.0 // indirect
)

replace github.com/s4wave/goscript => ../..
