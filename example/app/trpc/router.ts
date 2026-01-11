import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db, todos } from '../db'

// Import GoScript-compiled todo logic
import {
  Validate,
  ValidateDescription,
  PriorityString,
  type Priority,
} from '@goscript/github.com/aperturerobotics/goscript/example/app/todo/index.js'

// Priority constants (matching Go's iota values)
// Note: GoScript iota support is being improved - for now we define these manually
const PriorityLow: Priority = 0
const PriorityMedium: Priority = 1
const PriorityHigh: Priority = 2

// Initialize tRPC
const t = initTRPC.create()

// Zod schemas for validation
const prioritySchema = z.enum(['low', 'medium', 'high'])

const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: prioritySchema.optional().default('medium'),
})

const updateTodoSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  priority: prioritySchema.optional(),
  completed: z.boolean().optional(),
})

// Create the router
export const appRouter = t.router({
  // List all todos
  list: t.procedure
    .input(
      z
        .object({
          filter: z.enum(['all', 'active', 'completed']).optional(),
          priority: prioritySchema.optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      let query = db.select().from(todos)

      const results = await query

      // Apply filters using GoScript logic concepts
      let filtered = results

      if (input?.filter === 'active') {
        filtered = results.filter((t) => !t.completed)
      } else if (input?.filter === 'completed') {
        filtered = results.filter((t) => t.completed)
      }

      if (input?.priority) {
        filtered = filtered.filter((t) => t.priority === input.priority)
      }

      return filtered
    }),

  // Get a single todo by ID
  get: t.procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.select().from(todos).where(eq(todos.id, input.id))
      return result[0] ?? null
    }),

  // Create a new todo
  create: t.procedure.input(createTodoSchema).mutation(async ({ input }) => {
    // Use GoScript validation
    const titleError = Validate(input.title)
    if (titleError !== '') {
      throw new Error(titleError)
    }

    if (input.description) {
      const descError = ValidateDescription(input.description)
      if (descError !== '') {
        throw new Error(descError)
      }
    }

    const result = await db
      .insert(todos)
      .values({
        title: input.title,
        description: input.description ?? '',
        priority: input.priority,
      })
      .returning()

    return result[0]
  }),

  // Update a todo
  update: t.procedure.input(updateTodoSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input

    // Use GoScript validation if title is being updated
    if (updates.title) {
      const titleError = Validate(updates.title)
      if (titleError !== '') {
        throw new Error(titleError)
      }
    }

    if (updates.description) {
      const descError = ValidateDescription(updates.description)
      if (descError !== '') {
        throw new Error(descError)
      }
    }

    const result = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning()

    return result[0] ?? null
  }),

  // Toggle todo completion status
  toggle: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // First get the current todo
      const current = await db
        .select()
        .from(todos)
        .where(eq(todos.id, input.id))

      if (!current[0]) {
        throw new Error('Todo not found')
      }

      // Toggle the completed status
      const result = await db
        .update(todos)
        .set({
          completed: !current[0].completed,
          updatedAt: new Date(),
        })
        .where(eq(todos.id, input.id))
        .returning()

      return result[0]
    }),

  // Delete a todo
  delete: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const result = await db
        .delete(todos)
        .where(eq(todos.id, input.id))
        .returning()

      return result[0] ?? null
    }),

  // Clear all completed todos
  clearCompleted: t.procedure.mutation(async () => {
    const result = await db
      .delete(todos)
      .where(eq(todos.completed, true))
      .returning()

    return { deleted: result.length }
  }),

  // Get statistics
  stats: t.procedure.query(async () => {
    const allTodos = await db.select().from(todos)

    const stats = {
      total: allTodos.length,
      active: allTodos.filter((t) => !t.completed).length,
      completed: allTodos.filter((t) => t.completed).length,
      byPriority: {
        low: allTodos.filter((t) => t.priority === 'low').length,
        medium: allTodos.filter((t) => t.priority === 'medium').length,
        high: allTodos.filter((t) => t.priority === 'high').length,
      },
    }

    return stats
  }),

  // Bulk operations
  bulkCreate: t.procedure
    .input(z.array(createTodoSchema))
    .mutation(async ({ input }) => {
      // Validate all items using GoScript
      for (const item of input) {
        const titleError = Validate(item.title)
        if (titleError !== '') {
          throw new Error(`Validation error: ${titleError}`)
        }
        if (item.description) {
          const descError = ValidateDescription(item.description)
          if (descError !== '') {
            throw new Error(`Validation error: ${descError}`)
          }
        }
      }

      const values = input.map((item) => ({
        title: item.title,
        description: item.description ?? '',
        priority: item.priority,
      }))

      const result = await db.insert(todos).values(values).returning()

      return result
    }),

  // Priority helpers exposed from GoScript
  priorities: t.procedure.query(() => {
    return {
      low: { value: PriorityLow, label: PriorityString(PriorityLow) },
      medium: { value: PriorityMedium, label: PriorityString(PriorityMedium) },
      high: { value: PriorityHigh, label: PriorityString(PriorityHigh) },
    }
  }),
})

// Export type for client
export type AppRouter = typeof appRouter
