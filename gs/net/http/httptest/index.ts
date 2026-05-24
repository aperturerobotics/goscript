import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as http from '@goscript/net/http/index.js'

export class ResponseRecorder implements http.ResponseWriter {
  public Code = 200
  public Body: $.Slice<number> = null
  private headerMap = new http.Header()

  public Header(): http.Header {
    return this.headerMap
  }

  public Write(p: $.Slice<number>): [number, $.GoError] {
    this.Body = $.append(this.Body, p)
    return [$.len(p), null]
  }

  public WriteHeader(statusCode: number): void {
    this.Code = statusCode
  }
}

export function NewRecorder(): ResponseRecorder {
  return new ResponseRecorder()
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
