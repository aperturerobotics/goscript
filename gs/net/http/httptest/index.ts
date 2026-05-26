import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as errors from '@goscript/errors/index.js'
import * as http from '@goscript/net/http/index.js'
import * as io from '@goscript/io/index.js'

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

  public WriteHeader(statusCode: number): void {
    if (this.wroteHeader) {
      return
    }
    this.wroteHeader = true
    this.Code = statusCode
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

export function NewRequest(method: string, target: string, body: io.Reader | null): http.Request {
  const [req, err] = http.NewRequest(method, target, body)
  if (err != null || req == null) {
    throw err ?? errors.New('net/http/httptest: NewRequest returned nil request')
  }
  return req
}

export class Server {
  public URL: string
  private handler: http.Handler | null

  constructor(init?: Partial<Server> & { Handler?: http.Handler | null }) {
    this.handler = init?.Handler ?? null
    this.URL = init?.URL ?? http.RegisterInProcessServer(this.handler)
  }

  public Client(): http.Client {
    return new http.Client({ Transport: new serverTransport(this) })
  }

  public Close(): void {
    http.UnregisterInProcessServer(this.URL)
  }

  public Config(): http.Server {
    return new http.Server({ Handler: this.handler })
  }

  public ServeHTTP(w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): void | Promise<void> {
    return this.handler?.ServeHTTP(w, r)
  }
}

class serverTransport implements http.RoundTripper {
  constructor(private server: Server) {}

  public RoundTrip(req: http.Request | $.VarRef<http.Request> | null): [http.Response | null, $.GoError] {
    const request = $.pointerValue<http.Request | null>(req)
    if (request == null) {
      return [null, errors.New('net/http: nil Request')]
    }
    const recorder = NewRecorder()
    const served = this.server.ServeHTTP(recorder, request)
    if (served instanceof Promise) {
      return [null, errors.New('net/http/httptest: async handlers are not supported by Client.Do')]
    }
    return [recorder.Result(), null]
  }
}

export function NewServer(handler: http.Handler | null): Server {
  return new Server({ Handler: handler })
}

export function NewUnstartedServer(handler: http.Handler | null): Server {
  return new Server({ Handler: handler })
}

export function Server_Start(_s: Server | $.VarRef<Server> | null): $.GoError {
  return errors.New('net/http/httptest: Server.Start is not implemented in GoScript')
}
