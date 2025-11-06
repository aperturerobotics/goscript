import * as $ from "@goscript/builtin/index.js"
import * as _ from "@goscript/unsafe/index.js"
import * as base64 from "@goscript/encoding/base64/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as cmp from "@goscript/cmp/index.js"
import * as encoding from "@goscript/encoding/index.js"
import * as errors from "@goscript/errors/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as io from "@goscript/io/index.js"
import * as math from "@goscript/math/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as slices from "@goscript/slices/index.js"
import * as strconv from "@goscript/strconv/index.js"
import * as strings from "@goscript/strings/index.js"
import * as sync from "@goscript/sync/index.js"
import * as unicode from "@goscript/unicode/index.js"
import * as utf16 from "@goscript/unicode/utf16/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

let htmlSafeSet = $.arrayToSlice<boolean>([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true])

let safeSet = $.arrayToSlice<boolean>([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true])

