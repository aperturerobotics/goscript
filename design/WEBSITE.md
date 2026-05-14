# GoScript Website Design

## Overview

A GitHub Pages website for GoScript featuring precompiled Go-to-TypeScript demos and browser execution of generated TypeScript. The website demonstrates GoScript's package output through a playground and compliance test browser without requiring a live compiler in the browser.

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
- Could use a separately scoped parser-only approach for single-file programs
- Would enable live editing without server

The current v2 WASM adapter is intentionally diagnostic-only. Direct browser
source-string compilation returns `goscript/wasm:single-file-unsupported`, and
the website consumes precompiled examples/tests until direct single-file support
is designed and verified.

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
│       └── goscript-wasm.js # WASM adapter wrapper
├── public/data/
│   ├── examples.json       # Curated examples with pre-compiled TS
│   ├── required-packages.json # Runtime/override package manifest
│   └── tests.json          # Test manifest with source/output
└── public/CNAME            # Custom domain
```

## Implementation

### Build Process

1. **Generate Test Manifest** (`scripts/generate-test-manifest.ts`)
   - Scan `tests/tests/` directory
   - Extract Go source, TypeScript output, expected logs
   - Generate `website/public/data/tests.json`

2. **Generate Examples** (`scripts/generate-examples.ts`)
   - Compile curated Go examples using goscript
   - Generate `website/public/data/examples.json`

3. **Vite Build** (`cd website && bun run build`)
   - Builds the static site from checked-in HTML/CSS/JS and generated public data
   - Does not start the website dev server

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

Generated TypeScript is executed in-browser by bundling precompiled output with
the browser runtime and a resolver for `@goscript/*` imports:

```javascript
const result = await esbuild.transform(generatedCode, {
  loader: 'ts',
  format: 'esm',
})

const module = await import(URL.createObjectURL(new Blob([result.code], {
  type: 'text/javascript',
})))
await module.main()
```

## Build Scripts

### package.json additions

```json
{
  "scripts": {
    "website:build": "bun run website:manifest && bun run website:examples && cd website && bun run build",
    "website:manifest": "bun run scripts/generate-test-manifest.ts",
    "website:examples": "bun run scripts/generate-examples.ts",
    "website:serve": "cd website && bun run preview"
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
