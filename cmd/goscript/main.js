#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go up two levels from cmd/goscript/ to the goscript module root
const projectRoot = path.join(__dirname, '..', '..');

// The user's working directory (where they invoked the command)
const userCwd = process.cwd();

// Get arguments passed to the script, excluding node executable and script path
const args = process.argv.slice(2);

// Resolve --output and --dir paths relative to the user's cwd, since the
// go run process executes from the goscript module root, not the user's project.
const resolvedArgs = [];
let hasDir = false;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--dir') {
    hasDir = true;
    resolvedArgs.push(arg);
    if (i + 1 < args.length) {
      i++;
      resolvedArgs.push(path.resolve(userCwd, args[i]));
    }
  } else if (arg.startsWith('--dir=')) {
    hasDir = true;
    const val = arg.slice('--dir='.length);
    resolvedArgs.push('--dir=' + path.resolve(userCwd, val));
  } else if (arg === '--output' || arg === '-o') {
    resolvedArgs.push(arg);
    if (i + 1 < args.length) {
      i++;
      resolvedArgs.push(path.resolve(userCwd, args[i]));
    }
  } else if (arg.startsWith('--output=')) {
    const val = arg.slice('--output='.length);
    resolvedArgs.push('--output=' + path.resolve(userCwd, val));
  } else {
    resolvedArgs.push(arg);
  }
}

// Inject --dir with user's cwd if not explicitly provided, so the compiler
// loads packages from the user's project instead of the goscript module root.
if (!hasDir) {
  resolvedArgs.push('--dir', userCwd);
}

// Build the command: go run from the goscript module root
const command = `go run ./cmd/goscript ${resolvedArgs.join(' ')}`;

// Execute from the goscript module root so Go can resolve the module
const child = spawn(command, {
  shell: true,
  stdio: 'inherit',
  cwd: projectRoot,
});

child.on('error', (error) => {
  console.error(`Failed to start subprocess: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
