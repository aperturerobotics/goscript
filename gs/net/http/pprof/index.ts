import * as $ from '@goscript/builtin/index.js'
import * as http from '@goscript/net/http/index.js'
import * as pprof from '@goscript/runtime/pprof/index.js'

async function writeString(
  w: http.ResponseWriter | null,
  value: string,
): Promise<void> {
  await w?.Write($.stringToBytes(value))
}

export async function Index(
  w: http.ResponseWriter | null,
  _r: http.Request | $.VarRef<http.Request> | null,
): Promise<void> {
  const header = await w?.Header()
  if (header != null) {
    http.Header_Set(header, 'Content-Type', 'text/html; charset=utf-8')
  }
  await writeString(
    w,
    '<html><body><a href="goroutine?debug=2">full goroutine stack dump</a></body></html>',
  )
}

export async function Cmdline(
  w: http.ResponseWriter | null,
  _r: http.Request | $.VarRef<http.Request> | null,
): Promise<void> {
  const header = await w?.Header()
  if (header != null) {
    http.Header_Set(header, 'Content-Type', 'text/plain; charset=utf-8')
  }
  await writeString(w, 'goscript')
}

export async function Profile(
  w: http.ResponseWriter | null,
  _r: http.Request | $.VarRef<http.Request> | null,
): Promise<void> {
  const header = await w?.Header()
  if (header != null) {
    http.Header_Set(header, 'Content-Type', 'application/octet-stream')
  }
  await writeString(w, 'cpu profile\n')
}

export async function Symbol(
  w: http.ResponseWriter | null,
  _r: http.Request | $.VarRef<http.Request> | null,
): Promise<void> {
  const header = await w?.Header()
  if (header != null) {
    http.Header_Set(header, 'Content-Type', 'text/plain; charset=utf-8')
  }
  await writeString(w, 'num_symbols: 0\n')
}

export async function Trace(
  w: http.ResponseWriter | null,
  _r: http.Request | $.VarRef<http.Request> | null,
): Promise<void> {
  const header = await w?.Header()
  if (header != null) {
    http.Header_Set(header, 'Content-Type', 'application/octet-stream')
  }
  await writeString(w, 'trace\n')
}

export function Handler(name: string): http.Handler {
  return {
    async ServeHTTP(w) {
      const header = await w?.Header()
      if (header != null) {
        http.Header_Set(header, 'Content-Type', 'text/plain; charset=utf-8')
      }
      const profile = pprof.Lookup(name)
      if (profile == null) {
        await http.NotFound(w, null)
        return
      }
      await writeString(w, `${name} profile\n`)
      profile.WriteTo(w as unknown as any, 1)
    },
  }
}
