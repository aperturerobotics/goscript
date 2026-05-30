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
  typeName?: string
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
  name?: string // The Go field name when it differs from the TypeScript key.
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
const duplicateTypeRegistry = new Map<string, TypeInfo[]>()

function registerTypeInfo(name: string, typeInfo: TypeInfo): void {
  const existing = typeRegistry.get(name)
  if (existing && existing !== typeInfo) {
    const candidates = duplicateTypeRegistry.get(name) ?? [existing]
    if (!candidates.includes(typeInfo)) {
      candidates.push(typeInfo)
    }
    duplicateTypeRegistry.set(name, candidates)
  }
  typeRegistry.set(name, typeInfo)
}

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
  registerTypeInfo(name, typeInfo)
  return typeInfo
}

function resolveZeroValue<T>(zeroValue: any): T {
  if (typeof zeroValue === 'function') {
    return zeroValue() as T
  }
  return zeroValue as T
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
  registerTypeInfo(name, typeInfo)
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

function typeInfoRuntimeName(info: TypeInfo): string | undefined {
  return info.typeName || info.name
}

function goTypeMatchesTypeInfo(goType: string, info: TypeInfo): boolean {
  const runtimeName = typeInfoRuntimeName(info)
  return (
    (runtimeName !== undefined && goType === runtimeName) ||
    compareTypeStringWithTypeInfo(goType, info)
  )
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
  if (
    info.name === 'number' ||
    info.name === 'int' ||
    info.name === 'int8' ||
    info.name === 'int16' ||
    info.name === 'int32' ||
    info.name === 'int64' ||
    info.name === 'uint' ||
    info.name === 'uint8' ||
    info.name === 'byte' ||
    info.name === 'uint16' ||
    info.name === 'uint32' ||
    info.name === 'uint64' ||
    info.name === 'uintptr' ||
    info.name === 'float32' ||
    info.name === 'float64'
  )
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
        const fieldTypeInfo =
          isStructFieldInfo(fieldType) ? fieldType.type : fieldType
        return matchesType(value[fieldName], normalizeTypeInfo(fieldTypeInfo))
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
  if (!isInterfaceTypeInfo(info) || value === null || value === undefined) {
    return false
  }
  if (info.methods.length === 0) {
    return true
  }
  if (typeof value !== 'object') {
    return false
  }

  const methodTarget =
    value.__isVarRef === true && 'value' in value ? value.value : value
  if (
    (typeof methodTarget !== 'object' && typeof methodTarget !== 'function') ||
    methodTarget === null
  ) {
    return false
  }

  // For interfaces, check if the value has all the required methods with compatible signatures
  return info.methods.every((requiredMethodSig) => {
    const actualMethod = (methodTarget as any)[requiredMethodSig.name]

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
    if (methodTarget.__goTypeName) {
      const valueTypeInfo = typeRegistry.get(methodTarget.__goTypeName)
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
    const entries =
      value instanceof Map ? Array.from(value.entries()) : Object.entries(value)

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
  if (!isArrayTypeInfo(info) && !isSliceTypeInfo(info)) return false

  if (value instanceof Uint8Array) {
    if (isArrayTypeInfo(info) && value.length !== info.length) return false
    return isNumberElementType(info.elemType)
  }

  if (!Array.isArray(value)) return false

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

function isNumberElementType(typeInfo: string | TypeInfo | undefined): boolean {
  if (typeInfo === undefined) return true
  const info = normalizeTypeInfo(typeInfo)
  return (
    info.kind === TypeKind.Basic &&
    (info.name === undefined ||
      info.name === 'number' ||
      info.name === 'int' ||
      info.name === 'uint' ||
      info.name === 'uint8' ||
      info.name === 'byte' ||
      info.name === 'float64')
  )
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

export function cloneStructValue<T>(value: T): T {
  const cloneable = value as T & {
    __goscriptClone?: () => T
    clone?: () => T
  }
  if (typeof cloneable.__goscriptClone === 'function') {
    return cloneable.__goscriptClone()
  }
  if (typeof cloneable.clone === 'function') {
    return cloneable.clone()
  }
  throw new Error('runtime error: value is not cloneable')
}

export function cloneArrayValue<T>(value: T): T {
  if (value instanceof Uint8Array) {
    const out = new Uint8Array(value.length)
    out.set(value)
    return out as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => cloneArrayValue(item)) as T
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

  if (typeof value.__goType === 'string') {
    return compareTypeStringWithTypeInfo(value.__goType, info)
  }

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
  if (typeof value !== 'function') {
    return false
  }
  const valueInfo = functionValueTypeInfo(value)
  if (!valueInfo) {
    return false
  }
  return areTypeInfosIdentical(valueInfo, info)
}

function functionValueTypeInfo(value: any): FunctionTypeInfo | null {
  const typeInfo = value.__typeInfo
  if (!typeInfo || typeInfo.kind !== TypeKind.Function) {
    return null
  }
  const goTypeName =
    typeof value.__goTypeName === 'string' ? value.__goTypeName : undefined
  if (goTypeName && typeInfo.name && goTypeName !== typeInfo.name) {
    return null
  }
  if (goTypeName && !typeInfo.name) {
    return { ...typeInfo, name: goTypeName }
  }
  return typeInfo
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
  if (
    typeof value === 'object' &&
    typeof value.__goType === 'string' &&
    goTypeMatchesTypeInfo(value.__goType, info)
  ) {
    return true
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
  typeInfo: string | TypeInfo,
): boolean {
  const normalized = normalizeTypeInfo(typeInfo)
  const runtimeName = typeInfoRuntimeName(normalized)
  if (runtimeName !== undefined && typeStr === runtimeName) {
    return true
  }

  // For pointer types, strip the leading * and compare element types
  if (isPointerTypeInfo(normalized)) {
    if (!typeStr.startsWith('*')) {
      return false
    }
    const elemStr = typeStr.slice(1)
    const elemType = normalized.elemType
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
    return compareTypeStringWithTypeInfo(elemStr, elemType)
  }

  if (isSliceTypeInfo(normalized)) {
    if (!typeStr.startsWith('[]') || !normalized.elemType) {
      return false
    }
    return compareTypeStringWithTypeInfo(typeStr.slice(2), normalized.elemType)
  }

  if (isArrayTypeInfo(normalized)) {
    const match = typeStr.match(/^\[(\d+)\](.+)$/)
    if (!match || !normalized.elemType) {
      return false
    }
    return (
      Number(match[1]) === normalized.length &&
      compareTypeStringWithTypeInfo(match[2], normalized.elemType)
    )
  }

  if (isBasicTypeInfo(normalized)) {
    const name = typeInfoRuntimeName(normalized)
    if (name === undefined) {
      return false
    }
    if (typeStr === name) {
      return true
    }
    if (name === 'uint8' && typeStr === 'byte') {
      return true
    }
    if (name === 'int32' && typeStr === 'rune') {
      return true
    }
    return (
      name === 'int' &&
      [
        'byte',
        'rune',
        'int8',
        'int16',
        'int32',
        'int64',
        'uint',
        'uint8',
        'uint16',
        'uint32',
        'uint64',
        'uintptr',
      ].includes(typeStr)
    )
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
    if (
      isInterfaceTypeInfo(normalizedType) &&
      matchesInterfaceType(value, normalizedType)
    ) {
      return { value: value as T, ok: true }
    }
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
    return { value: null as unknown as T, ok: false }
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.__goType === 'string' &&
    goTypeMatchesTypeInfo(value.__goType, normalizedType)
  ) {
    if ('__goValue' in value) {
      return { value: value.__goValue as T, ok: true }
    }
    return { value: value as T, ok: true }
  }

  // Removed struct matching logic - struct types should use nominal matching
  // via matchesStructType in matchesType, not structural matching here

  if (
    isMapTypeInfo(normalizedType) &&
    typeof value === 'object' &&
    value !== null
  ) {
    if (normalizedType.keyType || normalizedType.elemType) {
      const entries =
        value instanceof Map ?
          Array.from(value.entries())
        : Object.entries(value)

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
    return { value: value as T, ok: true }
  }

  if (typeof typeInfo === 'string') {
    for (const candidate of duplicateTypeRegistry.get(typeInfo) ?? []) {
      if (candidate !== normalizedType && matchesType(value, candidate)) {
        return { value: value as T, ok: true }
      }
    }
  }

  // If we get here, the assertion failed
  // For registered types, use the zero value from the registry
  if (typeof typeInfo === 'string') {
    const registeredType = typeRegistry.get(typeInfo)
    if (registeredType && registeredType.zeroValue !== undefined) {
      return { value: resolveZeroValue<T>(registeredType.zeroValue), ok: false }
    }
  } else if (normalizedType.zeroValue !== undefined) {
    return { value: resolveZeroValue<T>(normalizedType.zeroValue), ok: false }
  }

  return { value: null as unknown as T, ok: false }
}

export function typeAssertTuple<T>(
  value: any,
  typeInfo: string | TypeInfo,
): [T, boolean] {
  const { value: assertedValue, ok } = typeAssert<T>(value, typeInfo)
  return [assertedValue, ok]
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
  body: (value?: any) => any // Function representing the case body. 'value' is the asserted value if applicable.
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
  defaultCase?: () => any,
): any {
  for (const caseObj of cases) {
    // For cases with multiple types (case T1, T2:), use $.is
    if (caseObj.types.length > 1) {
      const matchesAny = caseObj.types.some((typeInfo) => is(value, typeInfo))
      if (matchesAny) {
        // For multi-type cases, the case variable (if any) gets the original value
        return caseObj.body(value)
      }
    } else if (caseObj.types.length === 1) {
      // For single-type cases (case T:), use $.typeAssert to get the typed value and ok status
      const typeInfo = caseObj.types[0]
      const { value: assertedValue, ok } = typeAssert(value, typeInfo)
      if (ok) {
        // Pass the asserted value to the case body function
        return caseObj.body(assertedValue)
      }
    }
    // Note: Cases with 0 types are not valid in Go type switches
  }

  // If no case matched and a default case exists, execute it
  if (defaultCase) {
    return defaultCase()
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

export function interfaceValue<T>(value: unknown, typeName: string): T {
  if (value !== null && value !== undefined) {
    if (typeof value === 'object') {
      Object.defineProperty(value, '__goType', {
        value: typeName,
        writable: true,
        configurable: true,
      })
    }
    return value as T
  }

  const nilValue = typedNil(typeName)
  if (!typeName.startsWith('*')) {
    return nilValue as T
  }

  const dynamicType = typeRegistry.get(typeName.slice(1))
  if (!dynamicType || !isStructTypeInfo(dynamicType) || !dynamicType.ctor) {
    return nilValue as T
  }

  const prototype = dynamicType.ctor.prototype as Record<string, unknown>
  for (const method of dynamicType.methods) {
    const implementation = prototype[method.name]
    if (typeof implementation !== 'function') {
      continue
    }
    Object.defineProperty(nilValue, method.name, {
      value: (...args: unknown[]) => implementation.call(null, ...args),
      enumerable: true,
    })
  }
  return nilValue as T
}

export function namedValueInterfaceValue<T>(
  value: unknown,
  typeName: string,
  methods: Record<string, (receiver: any, ...args: any[]) => any>,
  typeInfo?: TypeInfo | string,
): T {
  const boxed: any = {
    __goType: typeName,
    __goValue: value,
    __goTypeInfo: typeInfo,
    valueOf: () => value,
    toString: () => String(value),
    [Symbol.toPrimitive]: () => value as any,
  }
  for (const [name, method] of Object.entries(methods)) {
    boxed[name] = (...args: any[]) => method(value, ...args)
  }
  return boxed as T
}

export function namedFunction<T>(
  fn: T,
  typeName: string,
  typeInfo?: FunctionTypeInfo,
): T {
  if (typeof fn !== 'function') {
    return fn
  }
  return Object.assign(
    fn,
    typeInfo ?
      { __goTypeName: typeName, __typeInfo: typeInfo }
    : { __goTypeName: typeName },
  )
}

export function functionValue<T extends (...args: any[]) => any>(
  fn: T,
  typeInfo: FunctionTypeInfo,
): T {
  return Object.assign(
    fn,
    typeInfo.name ?
      { __typeInfo: typeInfo, __goTypeName: typeInfo.name }
    : { __typeInfo: typeInfo },
  )
}

export interface GenericTypeDescriptor<T = any> {
  type?: TypeInfo | string
  zero?: () => T
  methods?: Record<string, (receiver: T, ...args: any[]) => any>
}

export type GenericTypeArgs = Record<string, GenericTypeDescriptor>

export function genericZero<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  fallback: T,
): T {
  const zero = typeArgs?.[name]?.zero
  if (zero) {
    return zero() as T
  }
  return fallback
}

export function callGenericMethod<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  method: string,
  receiver: T,
  ...args: any[]
): any {
  const fn = typeArgs?.[name]?.methods?.[method]
  if (fn) {
    return fn(receiver, ...args)
  }
  return (receiver as any)[method](...args)
}
