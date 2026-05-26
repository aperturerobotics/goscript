package dep

import (
	"github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/inner"
	"github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx"
)

type Tx = tx.Tx

type Store interface {
	NewTransaction(write bool) *Tx
}

type BaseStore struct {
	*inner.CoreStore
}

func NewBaseStore(prefix string) *BaseStore {
	return &BaseStore{
		CoreStore: inner.NewCoreStore(prefix),
	}
}
