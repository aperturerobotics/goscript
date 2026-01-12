/**
 * Represents the kinds of Go types that can be registered at runtime.
 */
export enum TypeKind {
  Basic = 'basic',
  Interface = 'interface',
  Struct = 'struct',
  Map = 'map',
  Slice = 'slice',
  Array = 'array',
  Pointer = 'pointer',
  Function = 'function',
  Channel = 'channel',
}

/**
 * Base type information shared by all type kinds
 */
export interface BaseTypeInfo {
  name?: string
  kind: TypeKind
  zeroValue?: any
}

/**
 * Represents an argument or a return value of a method.
 */
export interface MethodArg {
  name?: string // Name of the argument/return value, if available
  type: TypeInfo | string // TypeInfo object or string name of the type
}

/**
 * Represents the signature of a method, including its name, arguments, and return types.
 */
export interface MethodSignature {
  name: string
  args: MethodArg[]
  returns: MethodArg[]
}

/**
 * Information about a struct field including type and optional tag
 */
export interface StructFieldInfo {
  type: TypeInfo | string // The field's type
  tag?: string // The struct field tag (e.g., `json:"name,omitempty"`)
}

/**
 * Type information for struct types
 */
export interface StructTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Struct
  methods: MethodSignature[] // Array of method signatures
  ctor?: new (...args: any[]) => any
  fields: Record<string, TypeInfo | string | StructFieldInfo> // Field names and types for struct fields
}

/**
 * Type information for interface types
 */
export interface InterfaceTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Interface
  methods: MethodSignature[] // Array of method signatures
}

/**
 * Type information for basic types (string, number, boolean)
 */
export interface BasicTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Basic
}

/**
 * Type information for map types
 */
export interface MapTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Map
  keyType?: string | TypeInfo
  elemType?: string | TypeInfo
}

/**
 * Type information for slice types
 */
export interface SliceTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Slice
  elemType?: string | TypeInfo
}

/**
 * Type information for array types
 */
export interface ArrayTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Array
  elemType?: string | TypeInfo
  length: number
}

/**
 * Type information for pointer types
 */
export interface PointerTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Pointer
  elemType?: string | TypeInfo
}

/**
 * Type information for function types
 */
export interface FunctionTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Function
  params?: (string | TypeInfo)[]
  results?: (string | TypeInfo)[]
  isVariadic?: boolean // True if the function is variadic (e.g., ...T)
}

/**
 * Type information for channel types
 */
export interface ChannelTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Channel
  elemType?: string | TypeInfo
  direction?: 'send' | 'receive' | 'both'
}

/**
 * TypeInfo is used for runtime type checking.
 * Can be a registered type (from typeRegistry) or an ad-hoc type description.
 * When used as input to typeAssert, it can be a string (type name) or a structured description.
 */
export type TypeInfo =
  | StructTypeInfo
  | InterfaceTypeInfo
  | BasicTypeInfo
  | MapTypeInfo
  | SliceTypeInfo
  | ArrayTypeInfo
  | PointerTypeInfo
  | FunctionTypeInfo
  | ChannelTypeInfo

// Type guard functions for TypeInfo variants
export function isStructTypeInfo(info: TypeInfo): info is StructTypeInfo {
  return info.kind === TypeKind.Struct
}

export function isInterfaceTypeInfo(info: TypeInfo): info is InterfaceTypeInfo {
  return info.kind === TypeKind.Interface
}

export function isBasicTypeInfo(info: TypeInfo): info is BasicTypeInfo {
  return info.kind === TypeKind.Basic
}

export function isMapTypeInfo(info: TypeInfo): info is MapTypeInfo {
  return info.kind === TypeKind.Map
}

export function isSliceTypeInfo(info: TypeInfo): info is SliceTypeInfo {
  return info.kind === TypeKind.Slice
}

export function isArrayTypeInfo(info: TypeInfo): info is ArrayTypeInfo {
  return info.kind === TypeKind.Array
}

export function isPointerTypeInfo(info: TypeInfo): info is PointerTypeInfo {
  return info.kind === TypeKind.Pointer
}

export function isFunctionTypeInfo(info: TypeInfo): info is FunctionTypeInfo {
  return info.kind === TypeKind.Function
}

export function isChannelTypeInfo(info: TypeInfo): info is ChannelTypeInfo {
  return info.kind === TypeKind.Channel
}

/**
 * Type guard to check if a field value is a StructFieldInfo (has 'type' property)
 * vs a direct TypeInfo or string
 */
export function isStructFieldInfo(
  fieldValue: TypeInfo | string | StructFieldInfo,
): fieldValue is StructFieldInfo {
  return (
    typeof fieldValue === 'object' &&
    fieldValue !== null &&
    'type' in fieldValue &&
    !('kind' in fieldValue)
  )
}

/**
 * Comparable interface for Go's comparable constraint.
 * Types that implement this can be compared with == and !=.
 */
export interface Comparable {
  // This is a marker interface - any type that can be compared implements this
}

// Registry to store runtime type information
const typeRegistry = new Map<string, TypeInfo>()

/**
 * Registers a struct type with the runtime type system.
 *
 * @param name The name of the type.
 * @param zeroValue The zero value for the type.
 * @param methods Array of method signatures for the struct.
 * @param ctor Constructor for the struct.
 * @param fields Record of field names and their types.
 * @returns The struct type information object.
 */
export const registerStructType = (
  name: string,
  zeroValue: any,
  methods: MethodSignature[],
  ctor: new (...args: any[]) => any,
  fields: Record<string, TypeInfo | string | StructFieldInfo> = {},
): StructTypeInfo => {
  const typeInfo: StructTypeInfo = {
    name,
    kind: TypeKind.Struct,
    zeroValue,
    methods,
    ctor,
    fields,
  }
  typeRegistry.set(name, typeInfo)
  return typeInfo
}

/**
 * Registers an interface type with the runtime type system.
 *
 * @param name The name of the type.
 * @param zeroValue The zero value for the type (usually null).
 * @param methods Array of method signatures for the interface.
 * @returns The interface type information object.
 */
export const registerInterfaceType = (
  name: string,
  zeroValue: any,
  methods: MethodSignature[],
): InterfaceTypeInfo => {
  const typeInfo: InterfaceTypeInfo = {
    name,
    kind: TypeKind.Interface,
    zeroValue,
    methods,
  }
  typeRegistry.set(name, typeInfo)
  return typeInfo
}

/**
 * Gets a registered type by name from the type registry.
 * Returns undefined if the type is not registered.
 */
export const getTypeByName = (name: string): TypeInfo | undefined => {
  return typeRegistry.get(name)
}

/**
 * Represents the result of a type assertion.
 */
export interface TypeAssertResult<T> {
  value: T
  ok: boolean
}

/**
 * Normalizes a type info to a structured TypeInfo object.
 *
 * @param info The type info or name.
 * @returns A normalized TypeInfo object.
 */
function normalizeTypeInfo(info: string | TypeInfo): TypeInfo {
  if (typeof info === 'string') {
    const typeInfo = typeRegistry.get(info)
    if (typeInfo) {
      return typeInfo
    }
    return {
      kind: TypeKind.Basic,
      name: info,
    }
  }

  return info
}

function compareOptionalTypeInfo(
  type1?: string | TypeInfo,
  type2?: string | TypeInfo,
): boolean {
  if (type1 === undefined && type2 === undefined) return true
  if (type1 === undefined || type2 === undefined) return false
  // Assuming areTypeInfosIdentical will handle normalization if needed,
  // but type1 and type2 here are expected to be direct fields from TypeInfo objects.
  return areTypeInfosIdentical(type1, type2)
}

function areFuncParamOrResultArraysIdentical(
  arr1?: (string | TypeInfo)[],
  arr2?: (string | TypeInfo)[],
): boolean {
  if (arr1 === undefined && arr2 === undefined) return true
  if (arr1 === undefined || arr2 === undefined) return false
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (!areTypeInfosIdentical(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
}

function areFuncSignaturesIdentical(
  func1: FunctionTypeInfo,
  func2: FunctionTypeInfo,
): boolean {
  if ((func1.isVariadic || false) !== (func2.isVariadic || false)) {
    return false
  }
  return (
    areFuncParamOrResultArraysIdentical(func1.params, func2.params) &&
    areFuncParamOrResultArraysIdentical(func1.results, func2.results)
  )
}

export function areTypeInfosIdentical(
  type1InfoOrName: string | TypeInfo,
  type2InfoOrName: string | TypeInfo,
): boolean {
  const t1Norm = normalizeTypeInfo(type1InfoOrName)
  const t2Norm = normalizeTypeInfo(type2InfoOrName)

  if (t1Norm === t2Norm) return true // Object identity
  if (t1Norm.kind !== t2Norm.kind) return false

  // If types have names, the names must match for identity.
  // If one has a name and the other doesn't, they are not identical.
  if (t1Norm.name !== t2Norm.name) return false

  // If both are named and names match, for Basic, Struct, Interface, this is sufficient for identity.
  if (
    t1Norm.name !== undefined /* && t2Norm.name is also defined and equal */
  ) {
    if (
      t1Norm.kind === TypeKind.Basic ||
      t1Norm.kind === TypeKind.Struct ||
      t1Norm.kind === TypeKind.Interface
    ) {
      return true
    }
  }
  // For other types (Pointer, Slice, etc.), or if both are anonymous (name is undefined),
  // structural comparison is needed.

  switch (t1Norm.kind) {
    case TypeKind.Basic:
      // Names matched if they were defined, or both undefined (which means true by t1Norm.name !== t2Norm.name being false)
      return true
    case TypeKind.Pointer:
      return compareOptionalTypeInfo(
        (t1Norm as PointerTypeInfo).elemType,
        (t2Norm as PointerTypeInfo).elemType,
      )
    case TypeKind.Slice:
      return compareOptionalTypeInfo(
        (t1Norm as SliceTypeInfo).elemType,
        (t2Norm as SliceTypeInfo).elemType,
      )
    case TypeKind.Array:
      return (
        (t1Norm as ArrayTypeInfo).length === (t2Norm as ArrayTypeInfo).length &&
        compareOptionalTypeInfo(
          (t1Norm as ArrayTypeInfo).elemType,
          (t2Norm as ArrayTypeInfo).elemType,
        )
      )
    case TypeKind.Map:
      return (
        compareOptionalTypeInfo(
          (t1Norm as MapTypeInfo).keyType,
          (t2Norm as MapTypeInfo).keyType,
        ) &&
        compareOptionalTypeInfo(
          (t1Norm as MapTypeInfo).elemType,
          (t2Norm as MapTypeInfo).elemType,
        )
      )
    case TypeKind.Channel:
      return (
        // Ensure direction property exists before comparing, or handle undefined if it can be
        ((t1Norm as ChannelTypeInfo).direction || 'both') ===
          ((t2Norm as ChannelTypeInfo).direction || 'both') &&
        compareOptionalTypeInfo(
          (t1Norm as ChannelTypeInfo).elemType,
          (t2Norm as ChannelTypeInfo).elemType,
        )
      )
    case TypeKind.Function:
      return areFuncSignaturesIdentical(
        t1Norm as FunctionTypeInfo,
        t2Norm as FunctionTypeInfo,
      )
    case TypeKind.Struct:
    case TypeKind.Interface:
      // If we reach here, names were undefined (both anonymous) or names matched but was not Basic/Struct/Interface.
      // For anonymous Struct/Interface, strict identity means full structural comparison.
      // For now, we consider anonymous types not identical unless they are the same object (caught above).
      // If they were named and matched, 'return true' was hit earlier for these kinds.
      return false
    default:
      return false
  }
}

/**
 * Validates that a map key matches the expected type info.
 *
 * @param key The key to validate
 * @param keyTypeInfo The normalized type info for the key
 * @returns True if the key matches the type info, false otherwise
 */
function validateMapKey(key: any, keyTypeInfo: TypeInfo): boolean {
  if (keyTypeInfo.kind === TypeKind.Basic) {
    // For string keys
    if (keyTypeInfo.name === 'string') {
      return typeof key === 'string'
    } else if (
      keyTypeInfo.name === 'int' ||
      keyTypeInfo.name === 'float64' ||
      keyTypeInfo.name === 'number'
    ) {
      if (typeof key === 'string') {
        return /^-?\d+(\.\d+)?$/.test(key)
      } else {
        return typeof key === 'number'
      }
    }
  }
  return false
}

/**
 * Checks if a value matches a basic type info.
 *
 * @param value The value to check.
 * @param info The basic type info to match against.
 * @returns True if the value matches the basic type, false otherwise.
 */
function matchesBasicType(value: any, info: TypeInfo): boolean {
  if (info.name === 'string') return typeof value === 'string'
  if (info.name === 'number' || info.name === 'int' || info.name === 'float64')
    return typeof value === 'number'
  if (info.name === 'boolean' || info.name === 'bool')
    return typeof value === 'boolean'
  return false
}

/**
 * Checks if a value matches a struct type info.
 *
 * @param value The value to check.
 * @param info The struct type info to match against.
 * @returns True if the value matches the struct type, false otherwise.
 */
function matchesStructType(value: any, info: TypeInfo): boolean {
  if (!isStructTypeInfo(info)) return false

  // For named struct types with constructors, use instanceof (nominal matching)
  if (info.ctor && value instanceof info.ctor) {
    // With inversion: struct value assertions should ONLY match structs marked as values
    // In Go: j.(MyStruct) should only succeed if j contains a struct value (not pointer)
    return isMarkedAsStructValue(value)
  }

  // For named struct types with constructors, if instanceof fails, return false
  // This ensures named struct types use exact type matching
  if (info.ctor) {
    return false
  }

  // For anonymous struct types (no constructor), use structural matching
  if (typeof value === 'object' && value !== null && info.fields) {
    const fieldNames = Object.keys(info.fields || {})
    const valueFields = Object.keys(value)

    const fieldsExist = fieldNames.every((field) => field in value)
    const sameFieldCount = valueFields.length === fieldNames.length
    const allFieldsInStruct = valueFields.every((field) =>
      fieldNames.includes(field),
    )

    if (fieldsExist && sameFieldCount && allFieldsInStruct) {
      return Object.entries(info.fields).every(([fieldName, fieldType]) => {
        return matchesType(
          value[fieldName],
          normalizeTypeInfo(fieldType as TypeInfo | string),
        )
      })
    }

    return false
  }

  return false
}

/**
 * Checks if a value matches an interface type info by verifying it implements
 * all required methods with compatible signatures.
 *
 * @param value The value to check.
 * @param info The interface type info to match against.
 * @returns True if the value matches the interface type, false otherwise.
 */
function matchesInterfaceType(value: any, info: TypeInfo): boolean {
  // Check basic conditions first
  if (
    !isInterfaceTypeInfo(info) ||
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  // For interfaces, check if the value has all the required methods with compatible signatures
  return info.methods.every((requiredMethodSig) => {
    const actualMethod = (value as any)[requiredMethodSig.name]

    // Method must exist and be a function
    if (typeof actualMethod !== 'function') {
      return false
    }

    // Check parameter count (basic arity check)
    // Note: This is a simplified check as JavaScript functions can have optional/rest parameters
    const declaredParamCount = actualMethod.length
    const requiredParamCount = requiredMethodSig.args.length

    // Strict arity checking can be problematic in JS, so we'll be lenient
    // A method with fewer params than required is definitely incompatible
    if (declaredParamCount < requiredParamCount) {
      return false
    }

    // Check return types if we can determine them
    // This is challenging in JavaScript without runtime type information

    // If the value has a __goTypeName property, it might be a registered type
    // with more type information available
    if (value.__goTypeName) {
      const valueTypeInfo = typeRegistry.get(value.__goTypeName)
      if (valueTypeInfo && isStructTypeInfo(valueTypeInfo)) {
        // Find the matching method in the value's type info
        const valueMethodSig = valueTypeInfo.methods.find(
          (m) => m.name === requiredMethodSig.name,
        )

        if (valueMethodSig) {
          // Compare return types
          if (
            valueMethodSig.returns.length !== requiredMethodSig.returns.length
          ) {
            return false
          }

          // Compare each return type for compatibility
          for (let i = 0; i < requiredMethodSig.returns.length; i++) {
            const requiredReturnType = normalizeTypeInfo(
              requiredMethodSig.returns[i].type,
            )
            const valueReturnType = normalizeTypeInfo(
              valueMethodSig.returns[i].type,
            )

            // For interface return types, we need to check if the value's return type
            // implements the required interface
            if (isInterfaceTypeInfo(requiredReturnType)) {
              // This would be a recursive check, but we'll simplify for now
              // by just checking if the types are the same or if the value type
              // is registered as implementing the interface
              if (requiredReturnType.name !== valueReturnType.name) {
                // Check if valueReturnType implements requiredReturnType
                // This would require additional implementation tracking
                return false
              }
            }
            // For non-interface types, check direct type compatibility
            else if (requiredReturnType.name !== valueReturnType.name) {
              return false
            }
          }

          // Similarly, we could check parameter types for compatibility
          // but we'll skip that for brevity
        }
      }
    }

    // If we can't determine detailed type information, we'll accept the method
    // as long as it exists with a compatible arity
    return true
  })
}

/**
 * Checks if a value matches a map type info.
 *
 * @param value The value to check.
 * @param info The map type info to match against.
 * @returns True if the value matches the map type, false otherwise.
 */
function matchesMapType(value: any, info: TypeInfo): boolean {
  if (typeof value !== 'object' || value === null) return false
  if (!isMapTypeInfo(info)) return false

  if (info.keyType || info.elemType) {
    let entries: [any, any][] = []

    if (value instanceof Map) {
      entries = Array.from(value.entries())
    } else {
      entries = Object.entries(value)
    }

    if (entries.length === 0) return true // Empty map matches any map type

    const sampleSize = Math.min(5, entries.length)
    for (let i = 0; i < sampleSize; i++) {
      const [k, v] = entries[i]

      if (info.keyType) {
        if (
          !validateMapKey(
            k,
            normalizeTypeInfo(info.keyType as string | TypeInfo),
          )
        ) {
          return false
        }
      }

      if (
        info.elemType &&
        !matchesType(v, normalizeTypeInfo(info.elemType as string | TypeInfo))
      ) {
        return false
      }
    }
  }

  return true
}

/**
 * Checks if a value matches an array or slice type info.
 *
 * @param value The value to check.
 * @param info The array or slice type info to match against.
 * @returns True if the value matches the array or slice type, false otherwise.
 */
function matchesArrayOrSliceType(value: any, info: TypeInfo): boolean {
  // For slices and arrays, check if the value is an array and sample element types
  if (!Array.isArray(value)) return false
  if (!isArrayTypeInfo(info) && !isSliceTypeInfo(info)) return false

  if (info.elemType) {
    const arr = value as any[]
    if (arr.length === 0) return true // Empty array matches any array type

    const sampleSize = Math.min(5, arr.length)
    for (let i = 0; i < sampleSize; i++) {
      if (
        !matchesType(
          arr[i],
          normalizeTypeInfo(info.elemType as string | TypeInfo),
        )
      ) {
        return false
      }
    }
  }

  return true
}

// Symbol used to mark struct instances that represent values (not pointers)
const STRUCT_VALUE_MARKER = Symbol('structValue')

// Mark a struct instance as representing a value (not pointer)
export function markAsStructValue<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    ;(value as any)[STRUCT_VALUE_MARKER] = true
  }
  return value
}

// Check if a struct instance is marked as a value
function isMarkedAsStructValue(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    value[STRUCT_VALUE_MARKER] === true
  )
}

/**
 * Checks if a value matches a pointer type info.
 *
 * @param value The value to check.
 * @param info The pointer type info to match against.
 * @returns True if the value matches the pointer type, false otherwise.
 */
function matchesPointerType(value: any, info: TypeInfo): boolean {
  // Allow null/undefined values to match pointer types to support nil pointer assertions
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!isPointerTypeInfo(info)) return false

  if (!info.elemType) return false

  let elem = info.elemType
  let elemName: string
  if (typeof elem === 'string') {
    elemName = elem
  } else if (elem.name) {
    elemName = elem.name
  } else {
    return false
  }

  // Check if this is a registered struct type
  const registered = typeRegistry.get(elemName)
  if (registered && registered.kind === TypeKind.Struct && registered.ctor) {
    // For struct types, check if the value is marked as a pointer or is a VarRef
    if ('value' in value) {
      // VarRef case - check the inner value
      let elemTypeInfo = normalizeTypeInfo(elem)
      return matchesType(value.value, elemTypeInfo)
    }

    // Direct struct instance - with inversion, only match if NOT marked as value (i.e., is a pointer)
    return value instanceof registered.ctor && !isMarkedAsStructValue(value)
  } else {
    // For non-struct types, only VarRef objects should match
    if (!('value' in value)) {
      return false
    }
    let elemTypeInfo = normalizeTypeInfo(elem)
    return matchesType(value.value, elemTypeInfo)
  }
}

/**
 * Checks if a value matches a function type info.
 *
 * @param value The value to check.
 * @param info The function type info to match against.
 * @returns True if the value matches the function type, false otherwise.
 */
function matchesFunctionType(value: any, info: FunctionTypeInfo): boolean {
  // First check if the value is a function
  if (typeof value !== 'function') {
    return false
  }

  // This is important for named function types
  if (info.name && value.__goTypeName) {
    return info.name === value.__goTypeName
  }

  return true
}

/**
 * Checks if a value matches a channel type info.
 *
 * @param value The value to check.
 * @param info The channel type info to match against.
 * @returns True if the value matches the channel type, false otherwise.
 */
function matchesChannelType(value: any, info: ChannelTypeInfo): boolean {
  // First check if it's a channel or channel reference
  if (typeof value !== 'object' || value === null) {
    return false
  }

  // If it's a ChannelRef, get the underlying channel
  let channel = value
  let valueDirection = 'both'

  if ('channel' in value && 'direction' in value) {
    channel = value.channel
    valueDirection = value.direction
  }

  // Check if it has channel methods
  if (
    !('send' in channel) ||
    !('receive' in channel) ||
    !('close' in channel) ||
    typeof channel.send !== 'function' ||
    typeof channel.receive !== 'function' ||
    typeof channel.close !== 'function'
  ) {
    return false
  }

  if (info.elemType) {
    if (
      info.elemType === 'string' &&
      'zeroValue' in channel &&
      channel.zeroValue !== ''
    ) {
      return false
    }

    if (
      info.elemType === 'number' &&
      'zeroValue' in channel &&
      typeof channel.zeroValue !== 'number'
    ) {
      return false
    }
  }

  if (info.direction) {
    return valueDirection === info.direction
  }

  return true
}

/**
 * Checks if a value matches a type info.
 *
 * @param value The value to check.
 * @param info The type info to match against.
 * @returns True if the value matches the type info, false otherwise.
 */
function matchesType(value: any, info: TypeInfo): boolean {
  if (value === null || value === undefined) {
    return false
  }

  switch (info.kind) {
    case TypeKind.Basic:
      return matchesBasicType(value, info)

    case TypeKind.Struct:
      return matchesStructType(value, info)

    case TypeKind.Interface:
      return matchesInterfaceType(value, info)

    case TypeKind.Map:
      return matchesMapType(value, info)

    case TypeKind.Slice:
    case TypeKind.Array:
      return matchesArrayOrSliceType(value, info)

    case TypeKind.Pointer:
      return matchesPointerType(value, info)

    case TypeKind.Function:
      return matchesFunctionType(value, info as FunctionTypeInfo)

    case TypeKind.Channel:
      return matchesChannelType(value, info)

    default:
      console.warn(
        `Type matching for kind '${(info as TypeInfo).kind}' not implemented.`,
      )
      return false
  }
}

/**
 * Compares a Go type string (from typedNil) with a TypeInfo object.
 * Used to check if a typed nil pointer matches a type assertion target.
 *
 * @param typeStr The Go type string (e.g., "*struct{Name string}")
 * @param typeInfo The normalized TypeInfo to compare against
 * @returns True if the types match, false otherwise
 */
function compareTypeStringWithTypeInfo(
  typeStr: string,
  typeInfo: TypeInfo,
): boolean {
  // For pointer types, strip the leading * and compare element types
  if (isPointerTypeInfo(typeInfo)) {
    if (!typeStr.startsWith('*')) {
      return false
    }
    const elemStr = typeStr.slice(1)
    const elemType = typeInfo.elemType
    if (!elemType) {
      return false
    }

    // Handle struct types
    if (elemStr.startsWith('struct{')) {
      const elemTypeInfo = normalizeTypeInfo(elemType)
      if (!isStructTypeInfo(elemTypeInfo)) {
        return false
      }

      // For anonymous structs, compare the type string representation
      // Extract field definitions from the string
      const fieldsMatch = elemStr.match(/^struct{(.+)}$/)
      if (!fieldsMatch) {
        return false
      }

      const fieldStr = fieldsMatch[1]
      // Parse fields like "Name string" or "X int; Y string"
      const fieldParts = fieldStr.split(';').map((s) => s.trim())
      const parsedFields: Record<string, string> = {}

      for (const part of fieldParts) {
        // Handle "Name string" format
        const match = part.match(/^(\w+)\s+(.+)$/)
        if (match) {
          const [, fieldName, fieldType] = match
          parsedFields[fieldName] = fieldType.trim()
        }
      }

      // Compare fields
      const typeInfoFields = elemTypeInfo.fields || {}
      const typeInfoFieldNames = Object.keys(typeInfoFields)
      const parsedFieldNames = Object.keys(parsedFields)

      if (typeInfoFieldNames.length !== parsedFieldNames.length) {
        return false
      }

      // Check if all field names match and types are compatible
      for (const fieldName of typeInfoFieldNames) {
        if (!(fieldName in parsedFields)) {
          return false
        }

        const fieldValue = typeInfoFields[fieldName]
        // Handle StructFieldInfo (which has 'type' and optional 'tag' properties)
        const fieldTypeInfo: TypeInfo | string =
          isStructFieldInfo(fieldValue) ? fieldValue.type : fieldValue
        const typeInfoFieldType = normalizeTypeInfo(fieldTypeInfo)
        const parsedFieldType = parsedFields[fieldName]

        // Compare basic types
        if (isBasicTypeInfo(typeInfoFieldType)) {
          const expectedTypeName = typeInfoFieldType.name || ''
          // Map Go types to TypeScript/runtime types
          if (expectedTypeName === 'string' && parsedFieldType === 'string') {
            continue
          }
          if (
            (expectedTypeName === 'int' || expectedTypeName === 'number') &&
            (parsedFieldType === 'int' || parsedFieldType === 'number')
          ) {
            continue
          }
          return false
        }
      }

      return true
    }

    // Handle named types
    if (typeof elemType === 'string') {
      return elemStr === elemType
    }
    if (elemType.name) {
      return elemStr === elemType.name
    }
  }

  return false
}

/**
 * Performs a type assertion on a value against a specified type.
 * Returns an object containing the value (cast to type T) and a boolean indicating success.
 * This is used to implement Go's type assertion with comma-ok idiom: value, ok := x.(Type)
 *
 * @param value The value to check against the type
 * @param typeInfo The type information to check against (can be a string name or TypeInfo object)
 * @returns An object with the asserted value and a boolean indicating if the assertion succeeded
 */
export function typeAssert<T>(
  value: any,
  typeInfo: string | TypeInfo,
): TypeAssertResult<T> {
  const normalizedType = normalizeTypeInfo(typeInfo)

  // Handle typed nil pointers (created by typedNil() for conversions like (*T)(nil))
  if (typeof value === 'object' && value !== null && value.__isTypedNil) {
    // For typed nils, we need to compare the stored type with the expected type
    if (isPointerTypeInfo(normalizedType)) {
      // Parse the stored type string and compare with expected type
      const storedTypeStr = value.__goType as string
      if (compareTypeStringWithTypeInfo(storedTypeStr, normalizedType)) {
        return { value: null as unknown as T, ok: true }
      }
      return { value: null as unknown as T, ok: false }
    }
    return { value: null as unknown as T, ok: false }
  }

  if (isPointerTypeInfo(normalizedType) && value === null) {
    return { value: null as unknown as T, ok: true }
  }

  // Removed struct matching logic - struct types should use nominal matching
  // via matchesStructType in matchesType, not structural matching here

  if (
    isMapTypeInfo(normalizedType) &&
    typeof value === 'object' &&
    value !== null
  ) {
    if (normalizedType.keyType || normalizedType.elemType) {
      let entries: [any, any][] = []

      if (value instanceof Map) {
        entries = Array.from(value.entries())
      } else {
        entries = Object.entries(value)
      }

      if (entries.length === 0) {
        return { value: value as T, ok: true }
      }

      const sampleSize = Math.min(5, entries.length)
      for (let i = 0; i < sampleSize; i++) {
        const [k, v] = entries[i]

        if (normalizedType.keyType) {
          if (
            !validateMapKey(
              k,
              normalizeTypeInfo(normalizedType.keyType as string | TypeInfo),
            )
          ) {
            return { value: null as unknown as T, ok: false }
          }
        }

        if (normalizedType.elemType) {
          const elemTypeInfo = normalizeTypeInfo(
            normalizedType.elemType as string | TypeInfo,
          )
          if (!matchesType(v, elemTypeInfo)) {
            return { value: null as unknown as T, ok: false }
          }
        }
      }

      // If we get here, the map type assertion passes
      return { value: value as T, ok: true }
    }
  }

  const matches = matchesType(value, normalizedType)
  if (matches) {
    // Special handling for pointer type assertions:
    // If the value is a VarRef and we're asserting to a pointer type,
    // return the inner value (value.value), not the VarRef object itself
    if (
      isPointerTypeInfo(normalizedType) &&
      typeof value === 'object' &&
      value !== null &&
      'value' in value
    ) {
      return { value: value.value as T, ok: true }
    }
    return { value: value as T, ok: true }
  }

  // If we get here, the assertion failed
  // For registered types, use the zero value from the registry
  if (typeof typeInfo === 'string') {
    const registeredType = typeRegistry.get(typeInfo)
    if (registeredType && registeredType.zeroValue !== undefined) {
      return { value: registeredType.zeroValue as T, ok: false }
    }
  } else if (normalizedType.zeroValue !== undefined) {
    return { value: normalizedType.zeroValue as T, ok: false }
  }

  return { value: null as unknown as T, ok: false }
}

/**
 * Performs a type assertion on a value against a specified type.
 * Returns the value (cast to type T) if the assertion is successful,
 * otherwise throws a runtime error.
 * This is used to implement Go's single-value type assertion: value := x.(Type)
 *
 * @param value The value to check against the type
 * @param typeInfo The type information to check against (can be a string name or TypeInfo object)
 * @returns The asserted value if the assertion succeeded
 * @throws Error if the type assertion fails
 */
export function mustTypeAssert<T>(value: any, typeInfo: string | TypeInfo): T {
  const { value: assertedValue, ok } = typeAssert<T>(value, typeInfo)
  if (!ok) {
    const targetTypeName =
      typeof typeInfo === 'string' ? typeInfo : (
        typeInfo.name || JSON.stringify(typeInfo)
      )
    let valueTypeName: string | 'nil' = typeof value
    if (value && value.constructor && value.constructor.name) {
      valueTypeName = value.constructor.name
    }
    if (value === null) {
      valueTypeName = 'nil'
    }
    throw new Error(
      `inline type conversion panic: value is ${valueTypeName}, not ${targetTypeName}`,
    )
  }
  return assertedValue
}

/**
 * Checks if a value is of a specific type.
 * Similar to typeAssert but only returns a boolean without extracting the value.
 *
 * @param value The value to check
 * @param typeInfo The type information to check against
 * @returns True if the value matches the type, false otherwise
 */
export function is(value: any, typeInfo: string | TypeInfo): boolean {
  return matchesType(value, normalizeTypeInfo(typeInfo))
}

/**
 * Represents a case in a type switch statement.
 * Each case matches against one or more types and contains a body function to execute when matched.
 */
export interface TypeSwitchCase {
  types: (string | TypeInfo)[] // Array of types for this case (e.g., case int, string:)
  body: (value?: any) => void // Function representing the case body. 'value' is the asserted value if applicable.
}

/**
 * Helper for Go's type switch statement.
 * Executes the body of the first case whose type matches the value.
 *
 * @param value The value being switched upon.
 * @param cases An array of TypeSwitchCase objects.
 * @param defaultCase Optional function for the default case.
 */
export function typeSwitch(
  value: any,
  cases: TypeSwitchCase[],
  defaultCase?: () => void,
): void {
  for (const caseObj of cases) {
    // For cases with multiple types (case T1, T2:), use $.is
    if (caseObj.types.length > 1) {
      const matchesAny = caseObj.types.some((typeInfo) => is(value, typeInfo))
      if (matchesAny) {
        // For multi-type cases, the case variable (if any) gets the original value
        caseObj.body(value)
        return // Found a match, exit switch
      }
    } else if (caseObj.types.length === 1) {
      // For single-type cases (case T:), use $.typeAssert to get the typed value and ok status
      const typeInfo = caseObj.types[0]
      const { value: assertedValue, ok } = typeAssert(value, typeInfo)
      if (ok) {
        // Pass the asserted value to the case body function
        caseObj.body(assertedValue)

        return // Found a match, exit switch
      }
    }
    // Note: Cases with 0 types are not valid in Go type switches
  }

  // If no case matched and a default case exists, execute it
  if (defaultCase) {
    defaultCase()
  }
}

/**
 * Creates a typed nil pointer with type metadata for reflection.
 * This is used for type conversions like (*Interface)(nil) where we need
 * to preserve the pointer type information even though the value is null.
 *
 * @param typeName The full Go type name (e.g., "*main.Stringer")
 * @returns An object that represents a typed nil with reflection metadata
 */
export function typedNil(typeName: string): any {
  return Object.assign(Object.create(null), {
    __goType: typeName,
    __isTypedNil: true,
  })
}
