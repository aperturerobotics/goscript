import * as $ from '@goscript/builtin/index.js'
import * as bytes from '@goscript/bytes/index.js'
import * as errors from '@goscript/errors/index.js'
import * as http from '@goscript/net/http/index.js'
import * as io from '@goscript/io/index.js'

export class ResponseRecorder implements http.ResponseWriter {
  public Code = 200
  public Body = new bytes.Buffer()
  private headerMap = new http.Header()

  public Header(): http.Header {
    return this.headerMap
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    return this.Body.Write(p)
  }

  public WriteHeader(statusCode: number): void {
    this.Code = statusCode
  }

  public Result(): http.Response {
    return new http.Response({
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
    this.URL = init?.URL ?? 'http://127.0.0.1'
    this.handler = init?.Handler ?? null
  }

  public Client(): http.Client {
    return new http.Client()
  }

  public Close(): void {}

  public Config(): http.Server {
    return new http.Server({ Handler: this.handler })
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
