import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as io from '@goscript/io/index.js'
import * as protobuf_go_lite from '@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js'
import type {
  Client as StarpcClient,
  Mux as StarpcMux,
  Server as StarpcServer,
} from 'starpc'

export type Message = protobuf_go_lite.Message
export type TypeScriptClient = StarpcClient
export type TypeScriptMux = StarpcMux
export type TypeScriptServer = StarpcServer

type MaybePromise<T> = T | Promise<T>

export const ErrReset = $.newError('stream reset')
export const ErrUnimplemented = $.newError('unimplemented')
export const ErrCompleted = $.newError(
  'unexpected packet after rpc was completed',
)
export const ErrUnrecognizedPacket = $.newError('unrecognized packet type')
export const ErrEmptyPacket = $.newError('invalid empty packet')
export const ErrInvalidMessage = $.newError('invalid message')
export const ErrEmptyMethodID = $.newError('method id empty')
export const ErrEmptyServiceID = $.newError('service id empty')
export const ErrNoAvailableClients = $.newError('no available rpc clients')
export const ErrNilWriter = $.newError('writer cannot be nil')

export class RawMessage implements Message {
  private data: $.Slice<number>
  private copyData: boolean

  constructor(init?: Partial<{ data?: $.Slice<number>; copy?: boolean }>) {
    this.data = init?.data ?? null
    this.copyData = init?.copy ?? false
  }

  public GetData(): $.Slice<number> {
    return this.data
  }

  public SetData(data: $.Slice<number>): void {
    if (!this.copyData) {
      this.data = data
      return
    }
    const next = new Uint8Array($.len(data))
    $.copy(next, data)
    this.data = next
  }

  public Clear(): void {
    this.data = $.goSlice(this.data, 0, 0)
  }

  public Reset(): void {
    this.data = null
  }

  public MarshalVT(): [$.Slice<number>, $.GoError] {
    if (!this.copyData) {
      return [this.data, null]
    }
    const next = new Uint8Array($.len(this.data))
    $.copy(next, this.data)
    return [next, null]
  }

  public UnmarshalVT(data: $.Slice<number>): $.GoError {
    this.SetData(data)
    return null
  }

  public SizeVT(): number {
    return $.len(this.data)
  }

  public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
    if ($.len(dAtA) !== $.len(this.data)) {
      return [0, $.newError('invalid buffer length')]
    }
    $.copy(dAtA, this.data)
    return [$.len(dAtA), null]
  }

  public clone(): RawMessage {
    const cloned = new RawMessage({ copy: this.copyData })
    cloned.SetData(this.data)
    return $.markAsStructValue(cloned)
  }
}

export function NewRawMessage(
  data: $.Slice<number>,
  copy: boolean,
): RawMessage {
  return new RawMessage({ data, copy })
}

export interface Client {
  ExecCall(
    ctx: context.Context,
    service: string,
    method: string,
    input: Message | null,
    output: Message | null,
  ): Promise<$.GoError>
  NewStream(
    ctx: context.Context,
    service: string,
    method: string,
    firstMsg: Message | null,
  ): Promise<[Stream | null, $.GoError]>
}

export class ClientSet implements Client {
  private clients: $.Slice<Client | null>

  constructor(init?: Partial<{ clients?: $.Slice<Client | null> }>) {
    this.clients = init?.clients ?? null
  }

  public async ExecCall(
    ctx: context.Context,
    service: string,
    method: string,
    input: Message | null,
    output: Message | null,
  ): Promise<$.GoError> {
    return this.execCall(ctx, (client) =>
      client.ExecCall(ctx, service, method, input, output),
    )
  }

  public async NewStream(
    ctx: context.Context,
    service: string,
    method: string,
    firstMsg: Message | null,
  ): Promise<[Stream | null, $.GoError]> {
    let stream: Stream | null = null
    const err = await this.execCall(ctx, async (client) => {
      const [next, callErr] = await client.NewStream(
        ctx,
        service,
        method,
        firstMsg,
      )
      stream = next
      return callErr
    })
    return [stream, err]
  }

  private async execCall(
    ctx: context.Context,
    call: (client: Client) => MaybePromise<$.GoError>,
  ): Promise<$.GoError> {
    let anyClient = false
    for (let i = 0; i < $.len(this.clients); i++) {
      const client = this.clients![i]
      if (client == null) {
        continue
      }
      anyClient = true
      const err = await call(client)
      if (err == null) {
        return null
      }
      if (err === context.Canceled && contextErr(ctx) === context.Canceled) {
        return context.Canceled
      }
      if (err.Error() === ErrUnimplemented!.Error()) {
        continue
      }
      return err
    }
    return anyClient ? ErrUnimplemented : ErrNoAvailableClients
  }
}

export function NewClientSet(clients: $.Slice<Client | null>): ClientSet {
  return new ClientSet({ clients })
}

export class PrefixClient implements Client {
  private client: Client | null
  private serviceIDPrefixes: $.Slice<string>

  constructor(
    clientOrInit?:
      | Client
      | Partial<{ client?: Client | null; serviceIDPrefixes?: $.Slice<string> }>
      | null,
    serviceIDPrefixes?: $.Slice<string>,
  ) {
    if (
      clientOrInit != null &&
      typeof clientOrInit === 'object' &&
      'client' in clientOrInit
    ) {
      this.client = clientOrInit.client ?? null
      this.serviceIDPrefixes = clientOrInit.serviceIDPrefixes ?? null
      return
    }
    this.client = clientOrInit as Client | null
    this.serviceIDPrefixes = serviceIDPrefixes ?? null
  }

  public async ExecCall(
    ctx: context.Context,
    service: string,
    method: string,
    input: Message | null,
    output: Message | null,
  ): Promise<$.GoError> {
    const [stripped, err] = this.stripCheckServiceIDPrefix(service)
    if (err != null) {
      return err
    }
    if (this.client == null) {
      return ErrNoAvailableClients
    }
    return this.client.ExecCall(ctx, stripped, method, input, output)
  }

  public async NewStream(
    ctx: context.Context,
    service: string,
    method: string,
    firstMsg: Message | null,
  ): Promise<[Stream | null, $.GoError]> {
    const [stripped, err] = this.stripCheckServiceIDPrefix(service)
    if (err != null) {
      return [null, err]
    }
    if (this.client == null) {
      return [null, ErrNoAvailableClients]
    }
    return this.client.NewStream(ctx, stripped, method, firstMsg)
  }

  private stripCheckServiceIDPrefix(service: string): [string, $.GoError] {
    if ($.len(this.serviceIDPrefixes) === 0) {
      return [service, null]
    }
    const [stripped, matched] = CheckStripPrefix(
      service,
      this.serviceIDPrefixes,
    )
    if (matched === '') {
      return [service, ErrUnimplemented]
    }
    return [stripped, null]
  }
}

export function NewPrefixClient(
  client: Client | null,
  serviceIDPrefixes: $.Slice<string>,
): PrefixClient {
  return new PrefixClient(client, serviceIDPrefixes)
}

export interface Stream {
  Context(): context.Context
  MsgSend(msg: Message | null): MaybePromise<$.GoError>
  MsgRecv(msg: Message | null): MaybePromise<$.GoError>
  CloseSend(): MaybePromise<$.GoError>
  Close(): MaybePromise<$.GoError>
}

export interface StreamRecv<T> extends Stream {
  Recv(): MaybePromise<[T, $.GoError]>
  RecvTo(value: T): MaybePromise<$.GoError>
}

export interface StreamSend<T> extends Stream {
  Send(value: T): MaybePromise<$.GoError>
}

export interface StreamSendAndClose<T> extends StreamSend<T> {
  SendAndClose(value: T): MaybePromise<$.GoError>
}

class emptyStream implements Stream {
  private ctx: context.Context
  private closed = false

  constructor(ctx: context.Context = context.Background()) {
    this.ctx = ctx
  }

  public Context(): context.Context {
    return this.ctx
  }

  public MsgSend(_msg: Message | null): $.GoError {
    return this.closed ? ErrCompleted : null
  }

  public MsgRecv(_msg: Message | null): $.GoError {
    return this.closed ? io.EOF : io.EOF
  }

  public CloseSend(): $.GoError {
    this.closed = true
    return null
  }

  public Close(): $.GoError {
    this.closed = true
    return null
  }
}

class streamWithClose implements Stream {
  constructor(
    private stream: Stream,
    private closeFn: () => MaybePromise<$.GoError>,
  ) {}

  public Context(): context.Context {
    return this.stream.Context()
  }

  public MsgSend(msg: Message | null): MaybePromise<$.GoError> {
    return this.stream.MsgSend(msg)
  }

  public MsgRecv(msg: Message | null): MaybePromise<$.GoError> {
    return this.stream.MsgRecv(msg)
  }

  public CloseSend(): MaybePromise<$.GoError> {
    return this.stream.CloseSend()
  }

  public async Close(): Promise<$.GoError> {
    const err = await this.stream.Close()
    const closeErr = await this.closeFn()
    return err ?? closeErr
  }
}

export function NewStreamWithClose(
  stream: Stream | null,
  close: () => MaybePromise<$.GoError>,
): Stream {
  return new streamWithClose(stream ?? new emptyStream(), close)
}

export interface Invoker {
  InvokeMethod(
    serviceID: string,
    methodID: string,
    stream: Stream | null,
  ): MaybePromise<[boolean, $.GoError]>
}

export interface QueryableInvoker {
  HasService(serviceID: string): boolean
  HasServiceMethod(serviceID: string, methodID: string): boolean
}

export type InvokerFunc = (
  serviceID: string,
  methodID: string,
  stream: Stream | null,
) => [boolean, $.GoError] | Promise<[boolean, $.GoError]>

export async function InvokeMethod(
  fn: InvokerFunc,
  serviceID: string,
  methodID: string,
  stream: Stream | null,
): Promise<[boolean, $.GoError]> {
  if (fn == null) {
    return [false, null]
  }
  return fn(serviceID, methodID, stream)
}

export async function InvokerFunc_InvokeMethod(
  fn: InvokerFunc,
  serviceID: string,
  methodID: string,
  stream: Stream | null,
): Promise<[boolean, $.GoError]> {
  return InvokeMethod(fn, serviceID, methodID, stream)
}

export type InvokerSlice = $.Slice<Invoker | null>

export async function InvokerSlice_InvokeMethod(
  s: InvokerSlice,
  serviceID: string,
  methodID: string,
  stream: Stream | null,
): Promise<[boolean, $.GoError]> {
  for (let i = 0; i < $.len(s); i++) {
    const invoker = s![i]
    if (invoker == null) {
      continue
    }
    const [handled, err] = await invoker.InvokeMethod(
      serviceID,
      methodID,
      stream,
    )
    if (handled || err != null) {
      return [true, err]
    }
  }
  return [false, null]
}

export interface Handler extends Invoker {
  GetServiceID(): string
  GetMethodIDs(): $.Slice<string>
}

type HandlerMap = Map<string, Handler>

export interface Mux extends Invoker, QueryableInvoker {
  Register(handler: Handler | null): $.GoError
}

class defaultMux implements Mux {
  private fallback: $.Slice<Invoker | null>
  private services = new Map<string, HandlerMap>()

  constructor(fallback: $.Slice<Invoker | null>) {
    this.fallback = fallback
  }

  public Register(handler: Handler | null): $.GoError {
    if (handler == null) {
      return ErrUnimplemented
    }
    const serviceID = handler.GetServiceID()
    if (serviceID === '') {
      return ErrEmptyServiceID
    }
    let methods = this.services.get(serviceID)
    if (methods === undefined) {
      methods = new Map()
      this.services.set(serviceID, methods)
    }
    const methodIDs = handler.GetMethodIDs()
    for (let i = 0; i < $.len(methodIDs); i++) {
      const methodID = methodIDs![i]
      if (methodID !== '') {
        methods.set(methodID, handler)
      }
    }
    return null
  }

  public HasService(serviceID: string): boolean {
    return serviceID !== '' && (this.services.get(serviceID)?.size ?? 0) !== 0
  }

  public HasServiceMethod(serviceID: string, methodID: string): boolean {
    if (serviceID === '' || methodID === '') {
      return false
    }
    return this.services.get(serviceID)?.has(methodID) ?? false
  }

  public async InvokeMethod(
    serviceID: string,
    methodID: string,
    stream: Stream | null,
  ): Promise<[boolean, $.GoError]> {
    let handler: Handler | undefined
    if (serviceID === '') {
      for (const methods of this.services.values()) {
        handler = methods.get(methodID)
        if (handler !== undefined) {
          break
        }
      }
    } else {
      handler = this.services.get(serviceID)?.get(methodID)
    }
    if (handler !== undefined) {
      return handler.InvokeMethod(serviceID, methodID, stream)
    }
    for (let i = 0; i < $.len(this.fallback); i++) {
      const invoker = this.fallback![i]
      if (invoker == null) {
        continue
      }
      const [handled, err] = await invoker.InvokeMethod(
        serviceID,
        methodID,
        stream,
      )
      if (handled || err != null) {
        return [handled, err]
      }
    }
    return [false, null]
  }
}

export function NewMux(...fallbackInvokers: (Invoker | null)[]): Mux {
  return new defaultMux(fallbackInvokers)
}

export class PrefixInvoker implements Invoker {
  private inv: Invoker | null
  private serviceIDPrefixes: $.Slice<string>

  constructor(
    invOrInit?:
      | Invoker
      | Partial<{ inv?: Invoker | null; serviceIDPrefixes?: $.Slice<string> }>
      | null,
    serviceIDPrefixes?: $.Slice<string>,
  ) {
    if (
      invOrInit != null &&
      typeof invOrInit === 'object' &&
      'inv' in invOrInit
    ) {
      this.inv = invOrInit.inv ?? null
      this.serviceIDPrefixes = invOrInit.serviceIDPrefixes ?? null
      return
    }
    this.inv = invOrInit as Invoker | null
    this.serviceIDPrefixes = serviceIDPrefixes ?? null
  }

  public async InvokeMethod(
    serviceID: string,
    methodID: string,
    stream: Stream | null,
  ): Promise<[boolean, $.GoError]> {
    if ($.len(this.serviceIDPrefixes) !== 0) {
      const [strippedID, matchedPrefix] = CheckStripPrefix(
        serviceID,
        this.serviceIDPrefixes,
      )
      if (matchedPrefix === '') {
        return [false, null]
      }
      serviceID = strippedID
    }
    if (this.inv == null) {
      return [false, null]
    }
    return this.inv.InvokeMethod(serviceID, methodID, stream)
  }
}

export function NewPrefixInvoker(
  inv: Invoker | null,
  serviceIDPrefixes: $.Slice<string>,
): PrefixInvoker {
  return new PrefixInvoker(inv, serviceIDPrefixes)
}

export function CheckStripPrefix(
  serviceID: string,
  serviceIDPrefixes: $.Slice<string>,
): [string, string] {
  for (let i = 0; i < $.len(serviceIDPrefixes); i++) {
    const prefix = serviceIDPrefixes![i]
    if (prefix !== '' && serviceID.startsWith(prefix)) {
      return [serviceID.slice(prefix.length), prefix]
    }
  }
  return [serviceID, '']
}

export class Server {
  private invoker: Invoker | null

  constructor(init?: Partial<{ invoker?: Invoker | null }>) {
    this.invoker = init?.invoker ?? null
  }

  public GetInvoker(): Invoker | null {
    return this.invoker
  }

  public HandleStream(
    _ctx: context.Context,
    _rwc: io.ReadWriteCloser | null,
  ): void {}
}

export function NewServer(invoker: Invoker | null): Server {
  return new Server({ invoker })
}

export type PacketHandler = (pkt: Packet | null) => $.GoError
export type PacketDataHandler = (data: $.Slice<number>) => $.GoError
export type CloseHandler = (closeErr: $.GoError) => void

export class Packet {
  public Body: unknown = null

  public GetBody(): unknown {
    return this.Body
  }

  public MarshalVT(): [$.Slice<number>, $.GoError] {
    return [new Uint8Array(), null]
  }

  public UnmarshalVT(_data: $.Slice<number>): $.GoError {
    return null
  }

  public SizeVT(): number {
    return 0
  }

  public MarshalToSizedBufferVT(_data: $.Slice<number>): [number, $.GoError] {
    return [0, null]
  }

  public Reset(): void {
    this.Body = null
  }
}

export class CallStart {
  public RpcService = ''
  public RpcMethod = ''
  public Data: $.Slice<number> = null
  public DataIsZero = false
}

export class CallData {
  public Data: $.Slice<number> = null
  public DataIsZero = false
  public Complete = false
  public Error = ''
}

export class Packet_CallStart {
  constructor(public CallStart: CallStart | null = null) {}
}

export class Packet_CallData {
  constructor(public CallData: CallData | null = null) {}
}

export class Packet_CallCancel {
  constructor(public CallCancel = true) {}
}

export function NewPacketDataHandler(
  handler: PacketHandler,
): PacketDataHandler {
  return (data) => {
    const pkt = new Packet()
    const err = pkt.UnmarshalVT(data)
    if (err != null) {
      return err
    }
    return handler(pkt)
  }
}

export function NewCallStartPacket(
  service: string,
  method: string,
  data: $.Slice<number>,
  dataIsZero: boolean,
): Packet {
  const pkt = new Packet()
  pkt.Body = new Packet_CallStart(
    Object.assign(new CallStart(), {
      RpcService: service,
      RpcMethod: method,
      Data: data,
      DataIsZero: dataIsZero,
    }),
  )
  return pkt
}

export function NewCallDataPacket(
  data: $.Slice<number>,
  dataIsZero: boolean,
  complete: boolean,
  err: $.GoError,
): Packet {
  const pkt = new Packet()
  pkt.Body = new Packet_CallData(
    Object.assign(new CallData(), {
      Data: data,
      DataIsZero: dataIsZero,
      Complete: complete || err != null,
      Error: err?.Error() ?? '',
    }),
  )
  return pkt
}

export function NewCallCancelPacket(): Packet {
  const pkt = new Packet()
  pkt.Body = new Packet_CallCancel(true)
  return pkt
}

function contextErr(ctx: context.Context): $.GoError {
  if (ctx == null) {
    return null
  }
  return ctx.Err()
}
