export const IV0 = 0x6a09e667
export const IV1 = 0xbb67ae85
export const IV2 = 0x3c6ef372
export const IV3 = 0xa54ff53a
export const IV4 = 0x510e527f
export const IV5 = 0x9b05688c
export const IV6 = 0x1f83d9ab
export const IV7 = 0x5be0cd19

export const IV: number[] = [IV0, IV1, IV2, IV3, IV4, IV5, IV6, IV7]

export const Flag_ChunkStart = 1 << 0
export const Flag_ChunkEnd = 1 << 1
export const Flag_Parent = 1 << 2
export const Flag_Root = 1 << 3
export const Flag_Keyed = 1 << 4
export const Flag_DeriveKeyContext = 1 << 5
export const Flag_DeriveKeyMaterial = 1 << 6

export const BlockLen = 64
export const ChunkLen = 1024

export const HasAVX2 = false
export const HasSSE41 = false

export const OptimizeLittleEndian = false
