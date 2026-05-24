import * as $ from '@goscript/builtin/index.js'
import * as http from '@goscript/net/http/index.js'
import * as pprof from '@goscript/runtime/pprof/index.js'

function writeString(w: http.ResponseWriter | null, value: string): void {
  w?.Write($.stringToBytes(value))
}

export function Index(w: http.ResponseWriter | null, _r: http.Request | $.VarRef<http.Request> | null): void {
  w?.Header().Set('Content-Type', 'text/html; charset=utf-8')
  writeString(w, '<html><body><a href="goroutine?debug=2">full goroutine stack dump</a></body></html>')
}

export function Cmdline(w: http.ResponseWriter | null, _r: http.Request | $.VarRef<http.Request> | null): void {
  w?.Header().Set('Content-Type', 'text/plain; charset=utf-8')
  writeString(w, 'goscript')
}

export function Profile(w: http.ResponseWriter | null, _r: http.Request | $.VarRef<http.Request> | null): void {
  w?.Header().Set('Content-Type', 'application/octet-stream')
  writeString(w, 'cpu profile\n')
}

export function Symbol(w: http.ResponseWriter | null, _r: http.Request | $.VarRef<http.Request> | null): void {
  w?.Header().Set('Content-Type', 'text/plain; charset=utf-8')
  writeString(w, 'num_symbols: 0\n')
}

export function Trace(w: http.ResponseWriter | null, _r: http.Request | $.VarRef<http.Request> | null): void {
  w?.Header().Set('Content-Type', 'application/octet-stream')
  writeString(w, 'trace\n')
}

export function Handler(name: string): http.Handler {
  return {
    ServeHTTP(w) {
      w?.Header().Set('Content-Type', 'text/plain; charset=utf-8')
      const profile = pprof.Lookup(name)
      if (profile == null) {
        http.NotFound(w, null)
        return
      }
      writeString(w, `${name} profile\n`)
      profile.WriteTo(w, 1)
    },
  }
}
