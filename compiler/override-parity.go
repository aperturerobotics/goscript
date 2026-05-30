package compiler

import (
	"io"
	"io/fs"
	"maps"
	"path"
	"strings"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
	"github.com/pkg/errors"
)

type overrideParityStatus string

const (
	overrideParityStatusReal     overrideParityStatus = "real"
	overrideParityStatusBlocked  overrideParityStatus = "blocked"
	overrideParityStatusDeferred overrideParityStatus = "deferred"
)

type overrideParityLedger struct {
	SchemaVersion int                            `json:"schemaVersion"`
	Strict        bool                           `json:"strict"`
	Symbols       map[string]overrideParityEntry `json:"symbols"`
}

type overrideParityEntry struct {
	Status overrideParityStatus `json:"status"`
	Reason string               `json:"reason,omitempty"`
}

func newOverrideParityLedger() overrideParityLedger {
	return overrideParityLedger{
		Symbols: make(map[string]overrideParityEntry),
	}
}

func loadOverrideParityLedger(root overridePackageRoot) (overrideParityLedger, error) {
	ledger := newOverrideParityLedger()
	data, err := fs.ReadFile(root.fsys, path.Join(root.dir, "parity.json"))
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return ledger, nil
		}
		return overrideParityLedger{}, err
	}
	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "schemaVersion":
			ledger.SchemaVersion = iter.ReadInt()
		case "strict":
			ledger.Strict = iter.ReadBool()
		case "symbols":
			for symbol := iter.ReadObject(); symbol != ""; symbol = iter.ReadObject() {
				entry := overrideParityEntry{}
				for entryField := iter.ReadObject(); entryField != ""; entryField = iter.ReadObject() {
					switch entryField {
					case "status":
						entry.Status = overrideParityStatus(iter.ReadString())
					case "reason":
						entry.Reason = iter.ReadString()
					default:
						iter.Skip()
					}
				}
				ledger.Symbols[symbol] = entry
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return overrideParityLedger{}, iter.Error
	}
	if ledger.SchemaVersion != 1 {
		return overrideParityLedger{}, errors.New("parity.json schemaVersion must be 1")
	}
	if ledger.Symbols == nil {
		ledger.Symbols = make(map[string]overrideParityEntry)
	}
	for symbol, entry := range ledger.Symbols {
		if symbol == "" {
			return overrideParityLedger{}, errors.New("parity.json symbol names must not be empty")
		}
		if !entry.Status.valid() {
			return overrideParityLedger{}, errors.New("parity.json contains an unknown status")
		}
		if entry.Status == overrideParityStatusBlocked && strings.TrimSpace(entry.Reason) == "" {
			return overrideParityLedger{}, errors.New("parity.json blocked symbols must include a reason")
		}
	}
	return ledger, nil
}

func (s overrideParityStatus) valid() bool {
	switch s {
	case overrideParityStatusReal,
		overrideParityStatusBlocked,
		overrideParityStatusDeferred:
		return true
	default:
		return false
	}
}

func (s overrideParityStatus) requiresExport() bool {
	return s == overrideParityStatusReal
}

func (s overrideParityStatus) forbidsExport() bool {
	return s == overrideParityStatusBlocked
}

func cloneOverrideParityLedger(ledger overrideParityLedger) overrideParityLedger {
	return overrideParityLedger{
		SchemaVersion: ledger.SchemaVersion,
		Strict:        ledger.Strict,
		Symbols:       maps.Clone(ledger.Symbols),
	}
}
