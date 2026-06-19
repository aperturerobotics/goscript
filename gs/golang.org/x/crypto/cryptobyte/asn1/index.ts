export type Tag = number

const classConstructed = 0x20
const classContextSpecific = 0x80

export function Tag_Constructed(t: Tag): Tag {
  return (t | classConstructed) & 0xff
}

export function Tag_ContextSpecific(t: Tag): Tag {
  return (t | classContextSpecific) & 0xff
}

export const BOOLEAN: Tag = 1
export const INTEGER: Tag = 2
export const BIT_STRING: Tag = 3
export const OCTET_STRING: Tag = 4
export const NULL: Tag = 5
export const OBJECT_IDENTIFIER: Tag = 6
export const ENUM: Tag = 10
export const UTF8String: Tag = 12
export const SEQUENCE: Tag = 16 | classConstructed
export const SET: Tag = 17 | classConstructed
export const PrintableString: Tag = 19
export const T61String: Tag = 20
export const IA5String: Tag = 22
export const UTCTime: Tag = 23
export const GeneralizedTime: Tag = 24
export const GeneralString: Tag = 27
