import * as $ from '@goscript/builtin/index.js'

// FeatureID is the identifier for a single CPU feature.
export type FeatureID = number

// UNKNOWN is the sentinel for an unrecognized feature.
export const UNKNOWN: FeatureID = -1

// AVX2 identifies AVX2 SIMD support. Matches the upstream iota value.
export const AVX2: FeatureID = 19

// AVX512F identifies AVX-512 Foundation support. Matches the upstream iota value.
export const AVX512F: FeatureID = 26

// CPUInfo reports detected CPU capabilities. The browser/wasm target has no
// SIMD instruction set to detect, so this override reports no features and
// callers fall back to portable Go implementations.
export class CPUInfo {
  constructor(_init?: Partial<{}>) {}

  public clone(): CPUInfo {
    return $.markAsStructValue(new CPUInfo())
  }

  // Supports reports whether all listed features are available. The wasm
  // target never exposes native SIMD features, so this always reports false.
  public Supports(..._ids: FeatureID[]): boolean {
    return false
  }
}

// CPU holds the detected capabilities of the current CPU. On wasm there is no
// native CPU feature set, so it reports nothing.
export let CPU: CPUInfo = $.markAsStructValue(new CPUInfo())

export function __goscript_set_CPU(value: CPUInfo): void {
  CPU = value
}
