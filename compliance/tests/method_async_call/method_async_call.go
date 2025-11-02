package main

import "sync"

type FileTracker struct {
	mutex sync.Mutex
	lines []int
}

// AddLine is async because it uses a mutex
func (f *FileTracker) AddLine(offset int) {
	f.mutex.Lock()
	f.lines = append(f.lines, offset)
	f.mutex.Unlock()
}

type Scanner struct {
	file *FileTracker
}

// next() calls an async method but itself is not marked async
func (s *Scanner) next() {
	s.file.AddLine(10)
}

func main() {
	tracker := &FileTracker{lines: []int{}}
	scanner := &Scanner{file: tracker}
	scanner.next()
	println(len(tracker.lines))
}
