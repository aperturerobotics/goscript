# GoScript Website Design

## Overview

A GitHub Pages website for GoScript featuring interactive demos that compile Go code to TypeScript and execute it in the browser. The website demonstrates GoScript's capabilities through a playground and compliance test browser.

## Architecture

### Phase 1: Pre-compiled Examples (MVP)

For the initial release, we use pre-compiled examples to avoid the complexity of running the Go compiler in the browser:

1. **Pre-compiled Compliance Tests**
   - Generate a manifest of all compliance tests at build time
   - Include Go source, generated TypeScript, and expected output
   - Allow users to browse tests and see transformations

2. **Pre-compiled Examples**
   - Curated set of example programs demonstrating key features
   - Go source + generated TypeScript pairs
   - In-browser execution of the TypeScript

3. **In-Browser Execution**
   - Bundle `@goscript/builtin` runtime for browser
   - Execute generated TypeScript in a sandboxed environment
   - Capture and display `println` output

### Phase 2: WASM Compilation (Future)

Compile the GoScript compiler to WASM for client-side compilation:

- Requires solving `go/packages` dependency on Go toolchain
- Could use a simplified parser-only approach for single-file programs
- Would enable live editing without server

## Website Structure

```
website/
├── index.html              # Landing page
├── playground/
│   └── index.html          # Interactive playground
├── tests/
│   └── index.html          # Compliance test browser
├── assets/
│   ├── css/
│   │   └── style.css       # Shared styles
│   └── js/
│       ├── main.js         # Core utilities
│       ├── playground.js   # Playground logic
│       ├── tests.js        # Test browser logic
│       └── runtime.js      # Bundled goscript runtime
├── data/
│   ├── examples.json       # Curated examples with pre-compiled TS
│   └── tests.json          # Test manifest with source/output
└── CNAME                   # Custom domain (optional)
```

## Implementation

### Build Process

1. **Generate Test Manifest** (`scripts/generate-test-manifest.ts`)
   - Scan `tests/tests/` directory
   - Extract Go source, TypeScript output, expected logs
   - Generate `website/data/tests.json`

2. **Bundle Runtime** (`scripts/bundle-runtime.ts`)
   - Bundle `@goscript/builtin` for browser using esbuild
   - Output to `website/assets/js/runtime.js`

3. **Generate Examples** (`scripts/generate-examples.ts`)
   - Compile curated Go examples using goscript
   - Generate `website/data/examples.json`

### Pages

#### Landing Page (`index.html`)

- Project overview and features
- Quick demo with side-by-side Go/TypeScript
- Links to playground and test browser
- Installation instructions
- GitHub stars/links

#### Playground (`playground/index.html`)

- Monaco editor for Go code (left panel)
- Monaco editor for TypeScript output (right panel, read-only)
- Console output panel (bottom)
- Example selector dropdown
- "Run" button to execute TypeScript

#### Test Browser (`tests/index.html`)

- Searchable list of compliance tests (left panel)
- Test detail view (right panel):
  - Go source code
  - Generated TypeScript
  - Expected output
  - "Run" button to execute and verify

### Runtime Execution

Generated TypeScript is executed in-browser using dynamic import and function evaluation:

```javascript
// Load the bundled runtime
const $ = await import('./runtime.js')

// Capture output
const output = []
const printlnCapture = (...args) => output.push(args.map(String).join(' '))

// Execute the generated code in an async context
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const execCode = new AsyncFunction('$', 'println', generatedCode)
await execCode($, printlnCapture)

// Display results
console.log(output.join('\n'))
```

## Build Scripts

### package.json additions

```json
{
  "scripts": {
    "website:build": "npm run website:manifest && npm run website:bundle && npm run website:examples",
    "website:manifest": "bun run scripts/generate-test-manifest.ts",
    "website:bundle": "bun run scripts/bundle-runtime.ts",
    "website:examples": "bun run scripts/generate-examples.ts",
    "website:serve": "cd website && python3 -m http.server 8080"
  }
}
```

### GitHub Actions Workflow

```yaml
name: Deploy Website
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.23'
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run website:build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website
```

## Design Principles

1. **Static First**: Pre-compile everything, no server needed for basic functionality
2. **Progressive Enhancement**: Start with static content, add interactivity
3. **Fast Initial Load**: Lazy-load Monaco editor and runtime only when needed
4. **Mobile Friendly**: Responsive design (though editing is desktop-focused)
5. **Accessible**: Semantic HTML, keyboard navigation, ARIA labels

## Example Programs

The playground will include these curated examples:

1. **Hello World** - Basic println
2. **Variables & Types** - Type declarations, inference
3. **Functions** - Parameters, returns, multiple returns
4. **Structs** - Definition, methods, embedding
5. **Interfaces** - Declaration, implementation
6. **Slices** - Creation, append, range
7. **Maps** - Creation, access, iteration
8. **Channels** - Buffered/unbuffered, send/receive
9. **Goroutines** - Basic concurrency
10. **Error Handling** - Error returns, checking

## Future Enhancements

1. **Share Links**: URL-encoded source for sharing examples
2. **Dark Mode**: Theme toggle matching system preference
3. **Diff View**: Show changes between Go input variations
4. **Category Filtering**: Filter tests by feature (channels, generics, etc.)
5. **Performance Metrics**: Show compilation/execution time
6. **WASM Compiler**: Client-side compilation for live editing
7. **More Stdlib**: Bundle additional standard library packages
