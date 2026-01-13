# GoScript Todo App Example

This advanced example demonstrates how to use GoScript to build a full-stack todo list application with modern TypeScript tooling.

## Technology Stack

- **GoScript** - Business logic written in Go, transpiled to TypeScript
- **tRPC** - Type-safe API layer with end-to-end type safety
- **React** - Frontend UI library
- **Vite** - Fast frontend build tool
- **TanStack Query** - Powerful data fetching for React
- **Drizzle ORM** - Type-safe database access with excellent DX
- **SQLite** - Embedded database (via Bun's native bun:sqlite)
- **Zod** - Runtime input validation with TypeScript type inference
- **Bun** - Fast all-in-one JavaScript runtime

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
│                   (client.ts / curl)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     tRPC Server                              │
│                    (server.ts)                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    tRPC Router                               │
│                  (trpc/router.ts)                            │
│                                                              │
│  ┌─────────────────────┐    ┌────────────────────────────┐  │
│  │   GoScript Logic    │◄───│      Zod Validation        │  │
│  │  (todo/todo.go)     │    │    (input schemas)         │  │
│  │  Compiled to TS     │    └────────────────────────────┘  │
│  └─────────────────────┘                                     │
│              │                                               │
│              ▼                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Drizzle ORM                             │    │
│  │            (db/schema.ts)                            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SQLite                                  │
│                    (todos.db)                                │
└─────────────────────────────────────────────────────────────┘
```

## GoScript Integration

The core business logic for todos is written in Go (`todo/todo.go`) and includes:

### Types
- `Todo` - Struct with ID, title, description, priority, timestamps
- `Priority` - Enum type (Low, Medium, High)
- `TodoList` - Collection manager with CRUD operations
- `Stats` - Statistics struct for analytics

### Functions
- `NewTodo(title)` - Create a new todo
- `NewTodoList()` - Create a new list
- `Validate(title)` - Validate todo title
- `ValidateDescription(desc)` - Validate description
- `PriorityString(p)` - Convert priority to string
- `ParsePriority(s)` - Parse string to priority

### Methods on Todo
- `SetDescription(desc)` - Set description with timestamp
- `SetPriority(p)` - Set priority with timestamp
- `MarkComplete()` / `MarkIncomplete()` - Toggle completion
- `Toggle()` - Toggle completed state
- `IsOverdue(deadline)` - Check if overdue

### Methods on TodoList
- `Add(todo)` - Add todo with auto-ID
- `Get(id)` / `Remove(id)` - CRUD operations
- `All()` / `Active()` / `Completed()` - Filtering
- `ByPriority(p)` - Filter by priority
- `Count()` / `ActiveCount()` / `CompletedCount()` - Stats
- `ClearCompleted()` - Bulk delete
- `GetStats()` - Get full statistics

The Go code is compiled to TypeScript using GoScript and then imported in the tRPC router to provide type-safe validation and business logic.

## Quick Start

```bash
# Install dependencies
bun install

# Build GoScript code
bash build.bash

# Start development mode (API server + Vite frontend)
bun run dev
```

- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3000

The Vite dev server proxies `/api` requests to the backend server.

## API Endpoints

All endpoints are tRPC procedures accessible via HTTP:

| Procedure        | Type     | Description                                    |
|------------------|----------|------------------------------------------------|
| `list`           | Query    | List all todos (filterable by status/priority) |
| `get`            | Query    | Get a single todo by ID                        |
| `create`         | Mutation | Create a new todo                              |
| `update`         | Mutation | Update a todo                                  |
| `toggle`         | Mutation | Toggle todo completion                         |
| `delete`         | Mutation | Delete a todo                                  |
| `clearCompleted` | Mutation | Clear all completed todos                      |
| `stats`          | Query    | Get todo statistics                            |
| `bulkCreate`     | Mutation | Create multiple todos at once                  |
| `priorities`     | Query    | Get priority definitions from GoScript         |

## Example Usage

### Using curl

```bash
# Create a todo
curl -X POST http://localhost:3000/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","priority":"high"}'

# List all todos
curl http://localhost:3000/list

# Get stats
curl http://localhost:3000/stats

# Toggle completion
curl -X POST http://localhost:3000/toggle \
  -H "Content-Type: application/json" \
  -d '{"id":1}'

# Filter by priority
curl 'http://localhost:3000/list?input={"priority":"high"}'

# Filter active only
curl 'http://localhost:3000/list?input={"filter":"active"}'
```

### Using the tRPC Client

```bash
# Start the server in one terminal
bash run.bash

# Run the client demo in another terminal
bun run client.ts
```

The client demo showcases:
- Creating todos with different priorities
- Listing and filtering todos
- Toggling completion status
- Getting statistics
- Bulk operations
- Cleanup

## File Structure

```
example/app/
├── src/                  # React frontend source
│   ├── App.tsx           # Main React component
│   ├── main.tsx          # React entry point
│   ├── trpc.ts           # tRPC React client setup
│   └── index.css         # Styles
├── todo/
│   └── todo.go           # Go business logic (GoScript source)
├── db/
│   ├── schema.ts         # Drizzle ORM schema definition
│   └── index.ts          # Database connection setup
├── trpc/
│   └── router.ts         # tRPC router with all procedures
├── output/               # GoScript compiled output (generated)
│   └── @goscript/
│       ├── builtin/      # GoScript runtime
│       ├── time/         # Go time package
│       └── github.com/   # Compiled app packages
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Vite configuration
├── server.ts             # HTTP server entry point
├── client.ts             # Example tRPC client (CLI)
├── drizzle.config.ts     # Drizzle Kit configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── go.mod                # Go module definition
├── build.bash            # GoScript build script
├── run.bash              # Build and run script
└── README.md             # This file
```

## Development

```bash
# Build GoScript code only
bash build.bash

# Start full dev mode (API + frontend with hot reload)
bun run dev

# Start only the API server
bun run dev:server

# Start only the Vite frontend
bun run dev:frontend

# Build frontend for production
bun run build:frontend

# Generate Drizzle migrations (if using migrations)
bun run db:generate

# Run Drizzle Studio (visual database browser)
bun run db:studio
```

## How It Works

1. **Go Business Logic**: Write your business logic in Go (`todo/todo.go`)
2. **GoScript Compilation**: Run `bash build.bash` to transpile Go to TypeScript
3. **Import in TypeScript**: The compiled code is imported in `trpc/router.ts`
4. **tRPC Integration**: GoScript validation functions are used in tRPC mutations
5. **Drizzle Persistence**: Drizzle ORM handles database operations
6. **Type Safety**: End-to-end type safety from Go types through tRPC to the client

## Key Benefits

- **Write Once**: Business logic written in Go, usable in TypeScript
- **Type Safety**: Full type safety from database to API to client
- **Validation**: Go validation logic reused in the TypeScript API
- **Modern Stack**: Uses the latest TypeScript tooling (tRPC, Drizzle, Zod)
- **Fast Runtime**: Bun provides excellent performance
- **Simple Setup**: SQLite requires no external database server

## Notes

- GoScript is experimental - some Go features may have limited support
- Priority constants from iota are manually defined in the router (GoScript iota support is being improved)
- The `time` package from Go is used for timestamps in the generated code
