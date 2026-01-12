// Package todo provides the business logic for a todo list application.
// This Go code is transpiled to TypeScript using GoScript and used as the
// backend logic for a tRPC + Drizzle ORM + SQLite application.
package todo

import "time"

// Todo represents a single todo item.
type Todo struct {
	ID          int64
	Title       string
	Description string
	Completed   bool
	Priority    Priority
	CreatedAt   int64 // Unix timestamp
	UpdatedAt   int64 // Unix timestamp
}

// Priority represents the priority level of a todo item.
type Priority int

const (
	PriorityLow Priority = iota
	PriorityMedium
	PriorityHigh
)

// PriorityString returns the string representation of a Priority.
func PriorityString(p Priority) string {
	switch p {
	case PriorityLow:
		return "low"
	case PriorityMedium:
		return "medium"
	case PriorityHigh:
		return "high"
	default:
		return "unknown"
	}
}

// ParsePriority parses a string into a Priority.
func ParsePriority(s string) Priority {
	switch s {
	case "low":
		return PriorityLow
	case "medium":
		return PriorityMedium
	case "high":
		return PriorityHigh
	default:
		return PriorityLow
	}
}

// NewTodo creates a new Todo with the given title.
func NewTodo(title string) *Todo {
	now := time.Now().Unix()
	return &Todo{
		Title:     title,
		Priority:  PriorityMedium,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// SetDescription sets the description and updates the timestamp.
func (t *Todo) SetDescription(desc string) {
	t.Description = desc
	t.UpdatedAt = time.Now().Unix()
}

// SetPriority sets the priority and updates the timestamp.
func (t *Todo) SetPriority(p Priority) {
	t.Priority = p
	t.UpdatedAt = time.Now().Unix()
}

// MarkComplete marks the todo as completed.
func (t *Todo) MarkComplete() {
	t.Completed = true
	t.UpdatedAt = time.Now().Unix()
}

// MarkIncomplete marks the todo as not completed.
func (t *Todo) MarkIncomplete() {
	t.Completed = false
	t.UpdatedAt = time.Now().Unix()
}

// Toggle toggles the completed state.
func (t *Todo) Toggle() {
	t.Completed = !t.Completed
	t.UpdatedAt = time.Now().Unix()
}

// IsOverdue checks if the todo is overdue based on a deadline timestamp.
// Returns false if deadline is 0 (no deadline set).
func (t *Todo) IsOverdue(deadline int64) bool {
	if deadline == 0 {
		return false
	}
	return !t.Completed && time.Now().Unix() > deadline
}

// TodoList manages a collection of todos.
type TodoList struct {
	todos  []*Todo
	nextID int64
}

// NewTodoList creates a new empty TodoList.
func NewTodoList() *TodoList {
	return &TodoList{
		todos:  make([]*Todo, 0),
		nextID: 1,
	}
}

// Add adds a new todo to the list and assigns it an ID.
func (tl *TodoList) Add(todo *Todo) *Todo {
	todo.ID = tl.nextID
	tl.nextID++
	tl.todos = append(tl.todos, todo)
	return todo
}

// Get retrieves a todo by ID. Returns nil if not found.
func (tl *TodoList) Get(id int64) *Todo {
	for _, t := range tl.todos {
		if t.ID == id {
			return t
		}
	}
	return nil
}

// Remove removes a todo by ID. Returns true if removed, false if not found.
func (tl *TodoList) Remove(id int64) bool {
	for i, t := range tl.todos {
		if t.ID == id {
			tl.todos = append(tl.todos[:i], tl.todos[i+1:]...)
			return true
		}
	}
	return false
}

// All returns all todos in the list.
func (tl *TodoList) All() []*Todo {
	return tl.todos
}

// Active returns only incomplete todos.
func (tl *TodoList) Active() []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if !t.Completed {
			result = append(result, t)
		}
	}
	return result
}

// Completed returns only completed todos.
func (tl *TodoList) Completed() []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Completed {
			result = append(result, t)
		}
	}
	return result
}

// ByPriority returns todos filtered by priority.
func (tl *TodoList) ByPriority(p Priority) []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Priority == p {
			result = append(result, t)
		}
	}
	return result
}

// Count returns the total number of todos.
func (tl *TodoList) Count() int {
	return len(tl.todos)
}

// ActiveCount returns the number of incomplete todos.
func (tl *TodoList) ActiveCount() int {
	count := 0
	for _, t := range tl.todos {
		if !t.Completed {
			count++
		}
	}
	return count
}

// CompletedCount returns the number of completed todos.
func (tl *TodoList) CompletedCount() int {
	count := 0
	for _, t := range tl.todos {
		if t.Completed {
			count++
		}
	}
	return count
}

// ClearCompleted removes all completed todos.
func (tl *TodoList) ClearCompleted() int {
	removed := 0
	newTodos := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Completed {
			removed++
		} else {
			newTodos = append(newTodos, t)
		}
	}
	tl.todos = newTodos
	return removed
}

// Stats holds statistics about the todo list.
type Stats struct {
	Total      int
	Active     int
	Completed  int
	ByPriority map[string]int
}

// GetStats returns statistics about the todo list.
func (tl *TodoList) GetStats() Stats {
	stats := Stats{
		Total:      len(tl.todos),
		ByPriority: make(map[string]int),
	}

	for _, t := range tl.todos {
		if t.Completed {
			stats.Completed++
		} else {
			stats.Active++
		}

		priorityStr := PriorityString(t.Priority)
		stats.ByPriority[priorityStr]++
	}

	return stats
}

// Validate validates a todo and returns an error message if invalid.
func Validate(title string) string {
	if len(title) == 0 {
		return "title is required"
	}
	if len(title) > 200 {
		return "title must be 200 characters or less"
	}
	return ""
}

// ValidateDescription validates a description and returns an error message if invalid.
func ValidateDescription(desc string) string {
	if len(desc) > 1000 {
		return "description must be 1000 characters or less"
	}
	return ""
}
