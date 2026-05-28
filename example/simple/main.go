package main

type Score int

type User struct {
	Name   string
	Points Score
	Tags   []string
}

func NewUser(name string, points Score, tags ...string) User {
	return User{
		Name:   name,
		Points: points,
		Tags:   append([]string{}, tags...),
	}
}

func (u *User) AddPoints(points Score) {
	u.Points += points
}

func (u User) Clone() User {
	return User{
		Name:   u.Name,
		Points: u.Points,
		Tags:   append([]string{}, u.Tags...),
	}
}

func (u User) Describe() string {
	return u.Name
}

type Describer interface {
	Describe() string
}

type Ordered interface {
	~int | ~float64 | ~string
}

func Min[T Ordered](a, b T) T {
	if b < a {
		return b
	}
	return a
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

type Pair[A, B any] struct {
	First  A
	Second B
}

func Swap[A, B any](pair Pair[A, B]) Pair[B, A] {
	return Pair[B, A]{First: pair.Second, Second: pair.First}
}

func Filter[T any](items []T, keep func(T) bool) []T {
	filtered := make([]T, 0, len(items))
	for _, item := range items {
		if keep(item) {
			filtered = append(filtered, item)
		}
	}
	return filtered
}

func SumValues[K comparable](values map[K]int) int {
	sum := 0
	for _, value := range values {
		sum += value
	}
	return sum
}

func Classify(value any) string {
	switch v := value.(type) {
	case User:
		return v.Name
	case *User:
		return v.Name
	case string:
		return v
	default:
		return "unknown"
	}
}

func SendAll[T any](out chan<- T, values []T) {
	for _, value := range values {
		out <- value
	}
}

func Collect[T any](in <-chan T, count int) []T {
	values := make([]T, 0, count)
	for range count {
		values = append(values, <-in)
	}
	return values
}

func cleanup(label string) {
	println("cleanup:", label)
}

func main() {
	defer cleanup("simple")

	println("GoScript feature tour")

	user := NewUser("ada", 7, "go", "wasm")
	user.AddPoints(5)
	clone := user.Clone()
	clone.Tags[0] = "typescript"
	println("struct:", user.Name, user.Points, user.Tags[0], clone.Tags[0])

	var describer Describer = user
	println("interface:", describer.Describe())
	println("type switch:", Classify(&user), Classify(42))

	seen := NewSet("go", "ts")
	seen.Add("wasm")
	println("set:", seen.Has("go"), seen.Has("rust"), len(seen))

	scores := map[string]int{"go": 3, "ts": 4, "wasm": 5}
	println("map:", SumValues(scores))

	nums := []int{1, 2, 3, 4, 5}
	evens := Filter(nums, func(n int) bool { return n%2 == 0 })
	println("filter:", len(evens), evens[0], evens[1])

	swapped := Swap(Pair[string, int]{First: "answer", Second: 42})
	println("pair:", swapped.First, swapped.Second)

	println("min:", Min(8, 3), Min(Score(9), Score(4)), Min("go", "ts"))

	ch := make(chan int, 3)
	go SendAll(ch, nums[:3])
	collected := Collect(ch, 3)
	println("channel:", len(collected), collected[0], collected[2])

	ready := make(chan string, 1)
	ready <- "buffered"
	select {
	case msg := <-ready:
		println("select:", msg)
	default:
		println("select: default")
	}
}
