import * as $ from '@goscript/builtin/index.js'
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
