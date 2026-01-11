import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './trpc/router'
import { db } from './db'
import { sql } from 'drizzle-orm'

// Initialize the database table
function initDb() {
  // Create tables if they don't exist (bun:sqlite is synchronous)
  db.run(sql`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `)
  console.log('Database initialized')
}

// Create the HTTP server
const server = createHTTPServer({
  router: appRouter,
})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

// Start the server
function main() {
  initDb()

  server.listen(PORT)
  console.log(`Todo API server running at http://localhost:${PORT}`)
  console.log('')
  console.log('Available tRPC procedures:')
  console.log('  - list: Get all todos (filter by status/priority)')
  console.log('  - get: Get a single todo by ID')
  console.log('  - create: Create a new todo')
  console.log('  - update: Update a todo')
  console.log('  - toggle: Toggle todo completion')
  console.log('  - delete: Delete a todo')
  console.log('  - clearCompleted: Clear all completed todos')
  console.log('  - stats: Get todo statistics')
  console.log('  - bulkCreate: Create multiple todos')
  console.log('  - priorities: Get priority definitions from GoScript')
  console.log('')
  console.log('Example curl commands:')
  console.log('')
  console.log('Create a todo:')
  console.log(`  curl -X POST http://localhost:${PORT}/create \\`)
  console.log('    -H "Content-Type: application/json" \\')
  console.log('    -d \'{"title":"Buy groceries","priority":"high"}\'')
  console.log('')
  console.log('List all todos:')
  console.log(`  curl http://localhost:${PORT}/list`)
  console.log('')
  console.log('Get stats:')
  console.log(`  curl http://localhost:${PORT}/stats`)
}

main()
