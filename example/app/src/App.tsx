import { useState } from 'react'
import { trpc } from './trpc'

type Filter = 'all' | 'active' | 'completed'
type Priority = 'low' | 'medium' | 'high'

export default function App() {
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<Filter>('all')

  const utils = trpc.useUtils()

  const { data: todos, isLoading } = trpc.list.useQuery(
    filter === 'all' ? undefined : { filter },
  )

  const { data: stats } = trpc.stats.useQuery()

  const createMutation = trpc.create.useMutation({
    onSuccess: () => {
      utils.list.invalidate()
      utils.stats.invalidate()
      setNewTodo('')
    },
  })

  const toggleMutation = trpc.toggle.useMutation({
    onSuccess: () => {
      utils.list.invalidate()
      utils.stats.invalidate()
    },
  })

  const deleteMutation = trpc.delete.useMutation({
    onSuccess: () => {
      utils.list.invalidate()
      utils.stats.invalidate()
    },
  })

  const clearCompletedMutation = trpc.clearCompleted.useMutation({
    onSuccess: () => {
      utils.list.invalidate()
      utils.stats.invalidate()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    createMutation.mutate({ title: newTodo.trim(), priority })
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Todo App</h1>
        <p>Powered by GoScript + tRPC + React</p>
      </header>

      <div className="card">
        <form className="add-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            disabled={createMutation.isPending}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            disabled={createMutation.isPending || !newTodo.trim()}
          >
            Add
          </button>
        </form>

        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {isLoading ?
          <div className="loading">Loading...</div>
        : todos && todos.length > 0 ?
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div
                  className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => toggleMutation.mutate({ id: todo.id })}
                />
                <div className="todo-content">
                  <div
                    className={`todo-title ${todo.completed ? 'completed' : ''}`}
                  >
                    {todo.title}
                  </div>
                  <div className="todo-meta">
                    <span
                      className={`priority-badge priority-${todo.priority}`}
                    >
                      {todo.priority}
                    </span>
                  </div>
                </div>
                <button
                  className="todo-delete"
                  onClick={() => deleteMutation.mutate({ id: todo.id })}
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        : <div className="empty-state">
            <p>
              {filter === 'all' ?
                'No todos yet. Add one above!'
              : filter === 'active' ?
                'No active todos!'
              : 'No completed todos!'}
            </p>
          </div>
        }

        {stats && stats.total > 0 && (
          <div className="stats">
            <span>
              {stats.active} item{stats.active !== 1 ? 's' : ''} left
            </span>
            {stats.completed > 0 && (
              <button onClick={() => clearCompletedMutation.mutate()}>
                Clear completed ({stats.completed})
              </button>
            )}
          </div>
        )}
      </div>

      <div className="powered-by">
        Built with{' '}
        <a href="https://github.com/aperturerobotics/goscript">GoScript</a> - Go
        business logic compiled to TypeScript
      </div>
    </div>
  )
}
