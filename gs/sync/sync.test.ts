import { describe, expect, it } from 'vitest'

import { WaitGroup } from './sync.js'

describe('sync.WaitGroup', () => {
  it('Go tracks scheduled work and unblocks Wait after completion', async () => {
    const wg = new WaitGroup()
    const events: string[] = []

    wg.Go(async () => {
      events.push('worker start')
      await Promise.resolve()
      events.push('worker done')
    })

    const wait = wg.Wait().then(() => {
      events.push('wait done')
    })

    expect(events).toEqual([])
    await wait
    expect(events).toEqual(['worker start', 'worker done', 'wait done'])
  })
})
