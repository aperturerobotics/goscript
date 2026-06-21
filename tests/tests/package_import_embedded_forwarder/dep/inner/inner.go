package inner

import "github.com/s4wave/goscript/tests/tests/package_import_embedded_forwarder/dep/tx"

type CoreStore struct {
	Prefix string
}

func NewCoreStore(prefix string) *CoreStore {
	return &CoreStore{Prefix: prefix}
}

func (s *CoreStore) NewTransaction(write bool) *tx.Tx {
	if write {
		return &tx.Tx{Name: s.Prefix + ":write"}
	}
	return &tx.Tx{Name: s.Prefix + ":read"}
}
