// Example tRPC client for the Todo API
// This demonstrates how to use the API from a TypeScript client

import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/router'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

// Create the tRPC client
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:${PORT}`,
    }),
  ],
})

async function main() {
  console.log('Todo API Client Demo')
  console.log('====================\n')

  // Get priority definitions from GoScript
  console.log('1. Getting priority definitions from GoScript:')
  const priorities = await client.priorities.query()
  console.log('   Priorities:', priorities)
  console.log('')

  // Create some todos
  console.log('2. Creating todos:')
  const todo1 = await client.create.mutate({
    title: 'Buy groceries',
    description: 'Milk, bread, eggs',
    priority: 'high',
  })
  console.log('   Created:', todo1)

  const todo2 = await client.create.mutate({
    title: 'Write documentation',
    priority: 'medium',
  })
  console.log('   Created:', todo2)

  const todo3 = await client.create.mutate({
    title: 'Take a break',
    priority: 'low',
  })
  console.log('   Created:', todo3)
  console.log('')

  // List all todos
  console.log('3. Listing all todos:')
  const allTodos = await client.list.query()
  console.log('   Total:', allTodos.length, 'todos')
  for (const todo of allTodos) {
    console.log(
      `   - [${todo.priority}] ${todo.title} (completed: ${todo.completed})`,
    )
  }
  console.log('')

  // Toggle completion
  console.log('4. Toggling completion of first todo:')
  const toggled = await client.toggle.mutate({ id: todo1.id })
  console.log(
    '   Toggled:',
    toggled?.title,
    '-> completed:',
    toggled?.completed,
  )
  console.log('')

  // Get stats
  console.log('5. Getting statistics:')
  const stats = await client.stats.query()
  console.log('   Stats:', stats)
  console.log('')

  // Filter by priority
  console.log('6. Filtering by high priority:')
  const highPriority = await client.list.query({ priority: 'high' })
  console.log('   High priority todos:', highPriority.length)
  for (const todo of highPriority) {
    console.log(`   - ${todo.title}`)
  }
  console.log('')

  // Filter active only
  console.log('7. Filtering active (incomplete) todos:')
  const active = await client.list.query({ filter: 'active' })
  console.log('   Active todos:', active.length)
  for (const todo of active) {
    console.log(`   - ${todo.title}`)
  }
  console.log('')

  // Update a todo
  console.log('8. Updating todo description:')
  const updated = await client.update.mutate({
    id: todo2.id,
    description: 'README, API docs, examples',
  })
  console.log('   Updated:', updated?.title, '->', updated?.description)
  console.log('')

  // Get single todo
  console.log('9. Getting single todo by ID:')
  const single = await client.get.query({ id: todo1.id })
  console.log('   Got:', single)
  console.log('')

  // Bulk create
  console.log('10. Bulk creating todos:')
  const bulk = await client.bulkCreate.mutate([
    { title: 'Task A', priority: 'low' },
    { title: 'Task B', priority: 'medium' },
    { title: 'Task C', priority: 'high' },
  ])
  console.log('   Created', bulk.length, 'todos in bulk')
  console.log('')

  // Final stats
  console.log('11. Final statistics:')
  const finalStats = await client.stats.query()
  console.log('   Stats:', finalStats)
  console.log('')

  // Clear completed
  console.log('12. Clearing completed todos:')
  const cleared = await client.clearCompleted.mutate()
  console.log('   Deleted:', cleared.deleted, 'completed todos')
  console.log('')

  // Delete remaining todos (cleanup)
  console.log('13. Cleaning up - deleting all todos:')
  const remaining = await client.list.query()
  for (const todo of remaining) {
    await client.delete.mutate({ id: todo.id })
    console.log('   Deleted:', todo.title)
  }
  console.log('')

  console.log('Demo complete!')
}

main().catch(console.error)
