import * as $ from '@goscript/builtin/index.js'
import { writeHostStderrText } from '@goscript/builtin/hostio.js'

export class BuildSetting {
  public Key: string
  public Value: string

  constructor(init?: Partial<{ Key: string; Value: string }>) {
    this.Key = init?.Key ?? ''
    this.Value = init?.Value ?? ''
  }

  public clone(): BuildSetting {
    return $.markAsStructValue(
      new BuildSetting({ Key: this.Key, Value: this.Value }),
    )
  }
}

export class Module {
  public Path: string
  public Version: string
  public Sum: string
  public Replace: Module | $.VarRef<Module> | null

  constructor(
    init?: Partial<{
      Path: string
      Version: string
      Sum: string
      Replace: Module | $.VarRef<Module> | null
    }>,
  ) {
    this.Path = init?.Path ?? ''
    this.Version = init?.Version ?? ''
    this.Sum = init?.Sum ?? ''
    this.Replace = init?.Replace ?? null
  }

  public clone(): Module {
    return $.markAsStructValue(
      new Module({
        Path: this.Path,
        Version: this.Version,
        Sum: this.Sum,
        Replace: this.Replace,
      }),
    )
  }
}

export class BuildInfo {
  public GoVersion: string
  public Path: string
  public Main: Module
  public Deps: $.Slice<Module | $.VarRef<Module> | null>
  public Settings: $.Slice<BuildSetting>

  constructor(
    init?: Partial<{
      GoVersion: string
      Path: string
      Main: Module
      Deps: $.Slice<Module | $.VarRef<Module> | null>
      Settings: $.Slice<BuildSetting>
    }>,
  ) {
    this.GoVersion = init?.GoVersion ?? ''
    this.Path = init?.Path ?? ''
    this.Main = init?.Main ?? new Module()
    this.Deps = init?.Deps ?? null
    this.Settings = init?.Settings ?? null
  }

  public clone(): BuildInfo {
    return $.markAsStructValue(
      new BuildInfo({
        GoVersion: this.GoVersion,
        Path: this.Path,
        Main: this.Main.clone(),
        Deps: this.Deps,
        Settings: this.Settings,
      }),
    )
  }
}

export function Stack(): Uint8Array {
  const stack = new Error().stack ?? 'stack trace unavailable'
  return new TextEncoder().encode(stack)
}

export function PrintStack(): void {
  writeHostStderrText(new TextDecoder().decode(Stack()))
}

export function ReadBuildInfo(): [BuildInfo | null, boolean] {
  return [null, false]
}
