import * as $ from '@goscript/builtin/index.js'

export class Setting {
  constructor(public name = '') {}

  public IncNonDefault(): void {}

  public Name(): string {
    return this.name.startsWith('#') ? this.name.slice(1) : this.name
  }

  public String(): string {
    return `${this.Name()}=${this.Value()}`
  }

  public Undocumented(): boolean {
    return this.name.startsWith('#')
  }

  public Value(): string {
    return ''
  }

  public clone(): Setting {
    return new Setting(this.name)
  }
}

export function New(name: string): Setting {
  return $.markAsStructValue(new Setting(name))
}

export function Value(name: string): string {
  return New(name).Value()
}
