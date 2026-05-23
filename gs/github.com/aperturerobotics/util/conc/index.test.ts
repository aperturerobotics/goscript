import { describe, expect, test } from 'vitest'
import { makeChannel } from '../../../../builtin/index.js'
import { Background } from '../../../../context/index.js'
import { NewConcurrentQueue } from './index.js'

const tick = () => new Promise<void>((resolve) => queueMicrotask(resolve))

describe('util/conc override', () => {
  test('runs queued jobs within the concurrency limit', async () => {
    const release = makeChannel<{}>(0, {}, 'both')
    const started: number[] = []
    const done: number[] = []
    const job = (idx: number) => async () => {
      started.push(idx)
      await release.receive()
      done.push(idx)
    }

    const q = NewConcurrentQueue(2, [job(0)])
    const [queued, running] = q.Enqueue([job(1), job(2), job(3), job(4)])
    expect([queued, running]).toEqual([3, 2])

    await tick()
    expect(started).toEqual([0, 1])

    release.close()
    expect(await q.WaitIdle(Background(), null)).toBeNull()
    expect(done).toEqual([0, 1, 2, 3, 4])
  })
})
