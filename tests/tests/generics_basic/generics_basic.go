package main

type Ordered interface {
	~int | ~float64 | ~string
}

type Score int

func min[T Ordered](a, b T) T {
	if b < a {
		return b
	}
	return a
}

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(value T) {
	s.items = append(s.items, value)
}

func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		panic("pop from empty stack")
	}
	last := len(s.items) - 1
	value := s.items[last]
	s.items = s.items[:last]
	return value, true
}

func (s *Stack[T]) Len() int {
	return len(s.items)
}

type Set[T comparable] map[T]struct{}

func NewSet[T comparable](values ...T) Set[T] {
	set := make(Set[T])
	for _, value := range values {
		set[value] = struct{}{}
	}
	return set
}

func (s Set[T]) Add(value T) {
	s[value] = struct{}{}
}

func (s Set[T]) Has(value T) bool {
	_, ok := s[value]
	return ok
}

type Cloner[T any] interface {
	Clone() T
}

type Item struct {
	Name string
}

func (i *Item) Clone() *Item {
	if i == nil {
		return nil
	}
	return &Item{Name: i.Name + " copy"}
}

func CloneAll[T Cloner[T]](items []T) []T {
	clones := make([]T, 0, len(items))
	for _, item := range items {
		clones = append(clones, item.Clone())
	}
	return clones
}

type Mapper[K comparable, V any] struct {
	values map[K]V
}

func NewMapper[K comparable, V any]() *Mapper[K, V] {
	return &Mapper[K, V]{
		values: make(map[K]V),
	}
}

func (m *Mapper[K, V]) Put(key K, value V) {
	m.values[key] = value
}

func (m *Mapper[K, V]) Get(key K) (V, bool) {
	value, ok := m.values[key]
	return value, ok
}

func Apply[T any](value T, fn func(T) T) T {
	return fn(value)
}

type Pair[T any] struct {
	First  T
	Second T
}

func (p Pair[T]) Swap() Pair[T] {
	return Pair[T]{First: p.Second, Second: p.First}
}

func main() {
	println("=== Generic constraints ===")
	println("min:", min(8, 3), min(Score(9), Score(4)), min("go", "ts"))

	println("=== Generic stack ===")
	var stack Stack[int]
	stack.Push(10)
	stack.Push(20)
	value, ok := stack.Pop()
	println("pop:", value, ok, stack.Len())
	value, ok = stack.Pop()
	println("pop:", value, ok, stack.Len())

	println("=== Generic map alias ===")
	seen := NewSet("go", "ts")
	seen.Add("wasm")
	println("set:", seen.Has("go"), seen.Has("rust"), len(seen))

	println("=== Interface constraint ===")
	items := []*Item{{Name: "alpha"}, {Name: "beta"}}
	clones := CloneAll(items)
	println("clone:", clones[0].Name, clones[1].Name, clones[0] == items[0])

	println("=== Generic struct with map field ===")
	mapper := NewMapper[string, int]()
	mapper.Put("answer", 42)
	answer, found := mapper.Get("answer")
	println("mapper:", answer, found)

	println("=== Function instantiation ===")
	applyInt := Apply[int]
	println("apply:", applyInt(21, func(n int) int { return n * 2 }))

	println("=== Generic pair method ===")
	pair := Pair[string]{First: "left", Second: "right"}
	swapped := pair.Swap()
	println("pair:", swapped.First, swapped.Second)
}
