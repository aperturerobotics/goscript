# GoScript

[![GoDoc Widget]][GoDoc] [![Go Report Card Widget]][Go Report Card] [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/aperturerobotics/goscript)

[GoDoc]: https://godoc.org/github.com/aperturerobotics/goscript
[GoDoc Widget]: https://godoc.org/github.com/aperturerobotics/goscript?status.svg
[Go Report Card Widget]: https://goreportcard.com/badge/github.com/aperturerobotics/goscript
[Go Report Card]: https://goreportcard.com/report/github.com/aperturerobotics/goscript

## What is GoScript?

GoScript is a **Go to TypeScript compiler** that translates Go code to TypeScript at the AST level. Perfect for sharing algorithms and business logic between Go backends and TypeScript frontends.

> Right now goscript looks pretty cool if you problem is "I want this self-sufficient algorithm be available in Go and JS runtimes". gopherjs's ambition, however, has always been "any valid Go program can run in a browser". There is a lot that goes on in gopherjs that is necessary for supporting the standard library, which goes beyond cross-language translation.
>
> &mdash; [nevkontakte](https://gophers.slack.com/archives/C039C0R2T/p1745870396945719), developer of [GopherJS](https://github.com/gopherjs/gopherjs)

### 🎯 Why GoScript?

**Write once, run everywhere.** Share your Go algorithms, business logic, and data structures seamlessly between your backend and frontend without maintaining two codebases.

✅ **Perfect for:**
- Sharing business logic between Go services and web apps
- Porting Go algorithms to run in browsers
- Building TypeScript libraries from existing Go code
- Full-stack teams that love Go's simplicity

⚠️ **What's supported:**
GoScript compiles a powerful subset of Go:
- Structs, interfaces, methods, and functions
- Channels and goroutines (translated to async/await)
- Slices, maps, and most built-in types
- Basic reflection support
- Standard control flow (if, for, switch, etc.)

**Current limitations:**
- Uses JavaScript `number` type (64-bit float, not Go's int types)
- No pointer arithmetic (`uintptr`) or `unsafe` package
- No complex numbers
- Limited standard library (growing rapidly)

If you're building algorithms, business logic, or data processing code, GoScript has you covered! 🚀

📖 **Learn more:** [Design document](./design/DESIGN.md) | [Compliance tests](./compliance/COMPLIANCE.md)

## 🚀 Get Started in 2 Minutes

### Installation

**Option 1: Go Install**
```bash
go install github.com/aperturerobotics/goscript/cmd/goscript@latest
```

**Option 2: NPM**
```bash
npm install -g goscript
```

### Your First Compilation

```bash
# Compile your Go package to TypeScript
goscript compile --package . --output ./dist
```

## 📦 Using Generated Code in Your Project

After compiling your Go code to TypeScript, you'll need to set up your project to consume the generated files.

### TypeScript Configuration

Create or update your `tsconfig.json` with these settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "esnext.disposable", "dom"],
    "baseUrl": "./",
    "paths": {
      "@goscript/*": ["./path/to/generated/output/@goscript/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

**Important requirements:**
- **`target: "ES2022"` or newer** - Required for `Disposable` and other features
- **`lib: ["esnext.disposable"]`** - Enables TypeScript's disposable types for resource management
- **`baseUrl` and `paths`** - Allows TypeScript to resolve `@goscript/*` imports
- **`moduleResolution: "bundler"`** - Recommended for modern bundlers

You should be able to use any TypeScript bundler to compile the generated TypeScript.

## 💡 See It In Action

### Example: User Management

**Go Code** (`user.go`):
```go
package main

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func (u *User) IsValid() bool {
    return u.Name != "" && u.Email != ""
}

func NewUser(id int, name, email string) *User {
    return &User{ID: id, Name: name, Email: email}
}

func FindUserByEmail(users []*User, email string) *User {
    for _, user := range users {
        if user.Email == email {
            return user
        }
    }
    return nil
}
```

**Compile it:**
```bash
goscript compile --package . --output ./dist
```

**Generated TypeScript** (`user.ts`):
```typescript
export class User {
  public ID: number = 0
  public Name: string = ""
  public Email: string = ""

  public IsValid(): boolean {
    const u = this
    return u.Name !== "" && u.Email !== ""
  }

  constructor(init?: Partial<User>) {
    if (init) Object.assign(this, init)
  }
}

export function NewUser(id: number, name: string, email: string): User {
  return new User({ ID: id, Name: name, Email: email })
}

export function FindUserByEmail(users: User[], email: string): User | null {
  for (let user of users) {
    if (user.Email === email) {
      return user
    }
  }
  return null
}
```

**Use in your frontend:**
```typescript
import { NewUser, FindUserByEmail } from '@goscript/myapp/user'

// Same logic, now in TypeScript!
const users = [
  NewUser(1, "Alice", "alice@example.com"),
  NewUser(2, "Bob", "bob@example.com")
]

const alice = FindUserByEmail(users, "alice@example.com")
console.log(alice?.IsValid()) // true
```

### Example: Async Processing with Channels

**Go Code:**
```go
func ProcessMessages(messages []string) chan string {
    results := make(chan string, len(messages))
    
    for _, msg := range messages {
        go func(m string) {
            // Simulate processing
            processed := "✓ " + m
            results <- processed
        }(msg)
    }
    
    return results
}
```

**Generated TypeScript:**
```typescript
export function ProcessMessages(messages: string[]): $.Channel<string> {
  let results = $.makeChannel<string>(messages.length, "")
  
  for (let msg of messages) {
    queueMicrotask(async (m: string) => {
      let processed = "✓ " + m
      await results.send(processed)
    })(msg)
  }
  
  return results
}
```

**Use with async/await:**
```typescript
import { ProcessMessages } from '@goscript/myapp/processor'

async function handleMessages() {
  const channel = ProcessMessages(["hello", "world", "goscript"])
  
  // Receive processed messages
  for (let i = 0; i < 3; i++) {
    const result = await channel.receive()
    console.log(result) // "✓ hello", "✓ world", "✓ goscript"
  }
}
```

## 🛠️ Integration & Usage

### Command Line

```bash
goscript compile --package ./my-go-code --output ./dist
```

**Options:**
- `--package <path>` - Go package to compile (default: ".")
- `--output <dir>` - Output directory for TypeScript files

### Programmatic API

**Go:**
```go
import "github.com/aperturerobotics/goscript/compiler"

conf := &compiler.Config{OutputPath: "./dist"}
comp, err := compiler.NewCompiler(conf, logger, nil)
_, err = comp.CompilePackages(ctx, "your/package/path")
```

**Node.js:**
```typescript
import { compile } from 'goscript'

await compile({
  pkg: './my-go-package',
  output: './dist'
})
```

### Frontend Frameworks

**React + GoScript:**
```typescript
import { NewCalculator } from '@goscript/myapp/calculator'

function CalculatorApp() {
  const [calc] = useState(() => NewCalculator())
  
  const handleAdd = () => {
    const result = calc.Add(5, 3)
    setResult(result)
  }

  return <button onClick={handleAdd}>Add 5 + 3</button>
}
```

**Vue + GoScript:**
```vue
<script setup lang="ts">
import { NewUser, FindUserByEmail } from '@goscript/myapp/user'

const users = ref([
  NewUser(1, "Alice", "alice@example.com")
])

const searchUser = (email: string) => {
  return FindUserByEmail(users.value, email)
}
</script>
```

## 🚀 What's Next?

**Current Status:**
- ✅ Core language features (structs, methods, interfaces)
- ✅ Async/await for goroutines and channels  
- ✅ Basic reflection support
- ✅ Most control flow and data types

**Coming Soon:**
- 📦 Expanded standard library
- 🧪 Go test → TypeScript test conversion
- ⚡ Performance optimizations
- 🔧 Better tooling integration

Check the [compliance tests](./compliance/COMPLIANCE.md) for detailed progress.

## License

MIT
