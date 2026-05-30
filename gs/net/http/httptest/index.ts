import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as http from '@goscript/net/http/index.js'
import * as io from '@goscript/io/index.js'
import * as strings from '@goscript/strings/index.js'

export const DefaultRemoteAddr = '1.2.3.4'

class responseBody implements io.ReadCloser {
  private reader: bytes.Reader

  constructor(data: $.Bytes) {
    this.reader = bytes.NewReader(Uint8Array.from(data ?? []))
  }

  public Read(p: $.Bytes): [number, $.GoError] {
    return this.reader.Read(p)
  }

  public Close(): $.GoError {
    return null
  }
}

export class ResponseRecorder implements http.ResponseWriter {
  public Code = 200
  public Body = new bytes.Buffer()
  public Flushed = false
  private headerMap = new http.Header()
  private wroteHeader = false

  public Header(): http.Header {
    return this.headerMap
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    if (!this.wroteHeader) {
      this.WriteHeader(http.StatusOK)
    }
    return this.Body.Write(p)
  }

  public WriteString(s: string): [number, $.GoError] {
    return this.Write($.stringToBytes(s))
  }

  public WriteHeader(statusCode: number): void {
    if (this.wroteHeader) {
      return
    }
    this.wroteHeader = true
    this.Code = statusCode
  }

  public Flush(): void {
    if (!this.wroteHeader) {
      this.WriteHeader(http.StatusOK)
    }
    this.Flushed = true
  }

  public Result(): http.Response {
    return new http.Response({
      Body: new responseBody(this.Body.Bytes()),
      Header: this.headerMap,
      StatusCode: this.Code,
    })
  }
}

export function NewRecorder(): ResponseRecorder {
  return new ResponseRecorder()
}

export function NewRequest(
  method: string,
  target: string,
  body: io.Reader | null,
): http.Request {
  return NewRequestWithContext(context.Background(), method, target, body)
}

export function NewRequestWithContext(
  ctx: any,
  method: string,
  target: string,
  body: io.Reader | null,
): http.Request {
  if (ctx == null) {
    throw errors.New('nil context')
  }
  const [req, err] = http.NewRequestWithContext(ctx, method, target, body)
  if (err != null || req == null) {
    throw (
      err ?? errors.New('net/http/httptest: NewRequest returned nil request')
    )
  }
  req.ContentLength = requestBodyContentLength(body)
  req.RemoteAddr = '192.0.2.1:1234'
  req.RequestURI = target
  if (req.Host === '') {
    req.Host = 'example.com'
  }
  if (target.startsWith('https://')) {
    req.TLS = {}
  }
  return req
}

function requestBodyContentLength(body: io.Reader | null): number {
  if (body == null) {
    return 0
  }
  const value = $.pointerValueOrNil<any>(body as any)
  if (value === http.NoBody) {
    return 0
  }
  if (value instanceof bytes.Buffer || value instanceof bytes.Reader || value instanceof strings.Reader) {
    return value.Len()
  }
  return -1
}

export class Server {
  public ConfigValue: http.Server
  public Listener: any = null
  public EnableHTTP2 = false
  public TLS: any = null
  public URL: string
  private handler: http.Handler | null

  constructor(init?: Partial<Server> & { Handler?: http.Handler | null }) {
    this.handler = init?.Handler ?? null
    this.ConfigValue = init?.ConfigValue ?? new http.Server({ Handler: this.handler })
    this.URL = init?.URL ?? http.RegisterInProcessServer(this.handler)
  }

  public Client(): http.Client {
    return new http.Client({ Transport: new serverTransport(this) })
  }

  public Close(): void {
    http.UnregisterInProcessServer(this.URL)
  }

  public Config(): http.Server {
    return this.ConfigValue
  }

  public Start(): void {}

  public StartTLS(): void {}

  public ServeHTTP(
    w: http.ResponseWriter | null,
    r: http.Request | $.VarRef<http.Request> | null,
  ): void | Promise<void> {
    return this.handler?.ServeHTTP(w, r)
  }
}

class serverTransport implements http.RoundTripper {
  constructor(private server: Server) {}

  public async RoundTrip(
    req: http.Request | $.VarRef<http.Request> | null,
  ): Promise<[http.Response | null, $.GoError]> {
    const request = $.pointerValue<http.Request | null>(req)
    if (request == null) {
      return [null, errors.New('net/http: nil Request')]
    }
    const recorder = NewRecorder()
    let closeErr: $.GoError | undefined
    try {
      const served = this.server.ServeHTTP(recorder, serverRequest(request))
      if (served instanceof Promise) {
        await served
      }
    } finally {
      closeErr = request.Body?.Close?.() ?? null
    }
    if (closeErr != null) {
      return [null, closeErr]
    }
    const response = recorder.Result()
    if (request.Method === http.MethodHead) {
      response.Body = http.NoBody
    }
    return [response, null]
  }
}

function serverRequest(request: http.Request): http.Request {
  const req = Object.assign(
    Object.create(Object.getPrototypeOf(request)),
    request,
  ) as http.Request
  const rawQuery = request.URL?.RawQuery ?? ''
  const query = rawQuery === '' ? '' : `?${rawQuery}`
  req.RequestURI = `${request.URL?.Path ?? '/'}${query}`
  req.Host = request.Host === '' ? request.URL?.Host ?? '' : request.Host
  if (req.URL?.clone != null) {
    req.URL = req.URL.clone()
    req.URL.Scheme = ''
    req.URL.Host = ''
  }
  return req
}

export function NewServer(handler: http.Handler | null): Server {
  return new Server({ Handler: handler })
}

export function NewTLSServer(handler: http.Handler | null): Server {
  const server = new Server({ Handler: handler })
  server.URL = server.URL.replace(/^http:\/\//, 'https://')
  return server
}

export function NewUnstartedServer(handler: http.Handler | null): Server {
  return new Server({ Handler: handler })
}

export function Server_Start(_s: Server | $.VarRef<Server> | null): $.GoError {
  return errors.New(
    'net/http/httptest: Server.Start is not implemented in GoScript',
  )
}
