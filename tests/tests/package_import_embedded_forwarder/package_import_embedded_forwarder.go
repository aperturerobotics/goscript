package main

import "github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep"

type Store interface {
	dep.Store
	Execute() string
}

type VerboseStore struct {
	*dep.BaseStore
	name string
}

func NewVerboseStore(name string) *VerboseStore {
	return &VerboseStore{
		BaseStore: dep.NewBaseStore(name),
		name:      name,
	}
}

func (s *VerboseStore) Execute() string {
	return "execute:" + s.name
}

func useStore(store Store) {
	read := store.NewTransaction(false)
	write := store.NewTransaction(true)
	println(store.Execute())
	println(read.Name)
	println(write.Name)
}

func main() {
	useStore(NewVerboseStore("outer"))
}
