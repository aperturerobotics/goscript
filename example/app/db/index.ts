import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

// Create the SQLite database connection
const sqlite = new Database('todos.db')

// Create the Drizzle ORM instance
export const db = drizzle(sqlite, { schema })

// Re-export schema
export * from './schema'
