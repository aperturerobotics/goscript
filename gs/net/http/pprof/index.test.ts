import { describe, expect, it } from 'vitest'

import { Header, Header_Get, ResponseWriter } from '../index.js'
import { Handler, Index } from './index.js'

class writer implements ResponseWriter {
  public status = 200
  public header = new Header()
  public chunks: number[] = []

  Header(): Header {
    return this.header
  }

  Write(p: number[] | null): [number, null] {
    this.chunks.push(...(p ?? []))
    return [p?.length ?? 0, null]
  }

  WriteHeader(statusCode: number): void {
    this.status = statusCode
  }

  String(): string {
    return Buffer.from(this.chunks).toString('utf8')
  }
}

describe('net/http/pprof override', () => {
  it('serves the index text expected by debug handlers', async () => {
    const w = new writer()

    await Index(w, null)

    expect(Header_Get(w.Header(), 'Content-Type')).toContain('text/html')
    expect(w.String()).toContain('full goroutine stack dump')
  })

  it('serves named runtime profiles', async () => {
    const w = new writer()

    await Handler('goroutine').ServeHTTP(w, null)

    expect(Header_Get(w.Header(), 'Content-Type')).toContain('text/plain')
    expect(w.String()).toContain('goroutine profile')
  })
})
