import * as $ from '../../../../builtin/index.js'
import * as context from '../../../../context/index.js'

type Job = (() => void | globalThis.Promise<void>) | null

// ConcurrentQueue runs jobs with a bounded number of active workers.
export class ConcurrentQueue {
  private readonly maxConcurrency: number
  private running = 0
  private readonly queue: Job[] = []
  private waitCh = $.makeChannel<{}>(0, {}, 'both')

  constructor(maxConcurrency: number, initialElems: $.Slice<Job> = null) {
    this.maxConcurrency = maxConcurrency
    for (const job of initialElems ?? []) {
      this.queue.push(job)
    }
    this.update()
  }

  public Enqueue(jobs: $.Slice<Job>): [number, number]
  public Enqueue(...jobs: Job[]): [number, number]
  public Enqueue(...args: [$.Slice<Job>] | Job[]): [number, number] {
    const jobs = normalizeJobs(args)
    for (const job of jobs) {
      if (this.maxConcurrency <= 0 || this.running < this.maxConcurrency) {
        this.running++
        this.start(job)
        continue
      }
      this.queue.push(job)
    }
    if (jobs.length !== 0) {
      this.notify()
    }
    return [this.queue.length, this.running]
  }

  public async WaitIdle(
    ctx: context.Context,
    errCh: $.Channel<$.GoError> | null,
  ): Promise<$.GoError> {
    for (;;) {
      if (this.running === 0 && this.queue.length === 0) {
        return null
      }
      const waitCh = this.waitCh
      const [hasReturn, err] = await $.selectStatement<unknown, $.GoError>(
        [
          {
            id: 0,
            isSend: false,
            channel: ctx?.Done() ?? null,
            onSelected: async () => context.Canceled,
          },
          {
            id: 1,
            isSend: false,
            channel: errCh,
            onSelected: async (result) => {
              if (!result.ok) {
                return context.Canceled
              }
              return result.value ?? null
            },
          },
          {
            id: 2,
            isSend: false,
            channel: waitCh,
            onSelected: async () => null,
          },
        ],
        false,
      )
      if (hasReturn && err != null) {
        return err
      }
    }
  }

  public async WatchState(
    ctx: context.Context,
    _errCh: $.Channel<$.GoError> | null,
    cb: ((queued: number, running: number) => [boolean, $.GoError]) | null,
  ): Promise<$.GoError> {
    if (cb == null) {
      return null
    }
    for (;;) {
      const waitCh = this.waitCh
      const [cont, err] = cb(this.queue.length, this.running)
      if (err != null || !cont) {
        return err
      }
      const [hasReturn, waitErr] = await $.selectStatement<unknown, $.GoError>(
        [
          {
            id: 0,
            isSend: false,
            channel: ctx?.Done() ?? null,
            onSelected: async () => context.Canceled,
          },
          {
            id: 1,
            isSend: false,
            channel: waitCh,
            onSelected: async () => null,
          },
        ],
        false,
      )
      if (hasReturn && waitErr != null) {
        return waitErr
      }
    }
  }

  private start(job: Job): void {
    queueMicrotask(async () => {
      try {
        await job?.()
      } finally {
        this.running--
        this.update()
        this.notify()
      }
    })
  }

  private update(): void {
    while (
      this.queue.length !== 0 &&
      (this.maxConcurrency <= 0 || this.running < this.maxConcurrency)
    ) {
      const job = this.queue.shift() ?? null
      this.running++
      this.start(job)
    }
  }

  private notify(): void {
    const waitCh = this.waitCh
    this.waitCh = $.makeChannel<{}>(0, {}, 'both')
    waitCh.close()
  }
}

export function NewConcurrentQueue(
  maxConcurrency: number,
  initialElems?: $.Slice<Job>,
): ConcurrentQueue
export function NewConcurrentQueue(
  maxConcurrency: number,
  ...initialElems: Job[]
): ConcurrentQueue
export function NewConcurrentQueue(
  maxConcurrency: number,
  ...args: [$.Slice<Job>?] | Job[]
): ConcurrentQueue {
  return new ConcurrentQueue(maxConcurrency, normalizeJobs(args))
}

function normalizeJobs(args: [$.Slice<Job>?] | Job[]): Job[] {
  if (args.length === 0) {
    return []
  }
  if (args.length === 1 && (Array.isArray(args[0]) || args[0] == null)) {
    return Array.from((args[0] as $.Slice<Job>) ?? [])
  }
  return args as Job[]
}
