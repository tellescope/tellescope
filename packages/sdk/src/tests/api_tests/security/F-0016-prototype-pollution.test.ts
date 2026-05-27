import { add_value_for_dotted_key } from "@tellescope/utilities"

// Regression test for F-0016 (pattern 17 — prototype pollution).
// add_value_for_dotted_key must NOT write through __proto__/constructor/prototype path segments
// (which would pollute Object.prototype process-wide), while still performing legitimate dotted assignment.
//
// Pure-function test — no Session needed. Runs in the main suite and standalone:
//   ./build_cjs.sh && cd packages/public/sdk && node -r dotenv/config lib/cjs/tests/api_tests/security/F-0016-prototype-pollution.test.js

const fail = (msg: string) => { throw new Error(msg) }

export const prototype_pollution_tests = async () => {
  console.log("Running F-0016 prototype-pollution regression tests")

  // 1. __proto__ path must not pollute Object.prototype
  add_value_for_dotted_key({ insurance: {} } as any, 'insurance.__proto__.__pp_a__', 'polluted')
  const leakedA = ({} as any).__pp_a__
  delete (Object.prototype as any).__pp_a__ // clean up regardless, so a failure here can't contaminate the rest of the suite
  if (leakedA !== undefined) fail('Object.prototype polluted via __proto__ path')

  // 2. constructor.prototype path must not pollute
  add_value_for_dotted_key({ insurance: {} } as any, 'insurance.constructor.prototype.__pp_b__', 'polluted')
  const leakedB = ({} as any).__pp_b__
  delete (Object.prototype as any).__pp_b__
  if (leakedB !== undefined) fail('Object.prototype polluted via constructor.prototype path')

  // 3. a leading __proto__ segment must not pollute either
  add_value_for_dotted_key({} as any, '__proto__.__pp_c__', 'polluted')
  const leakedC = ({} as any).__pp_c__
  delete (Object.prototype as any).__pp_c__
  if (leakedC !== undefined) fail('Object.prototype polluted via leading __proto__ segment')

  // 4. legitimate dotted assignment still works (existing intermediate objects)
  const obj = { a: { b: {} } } as any
  add_value_for_dotted_key(obj, 'a.b.c', 42)
  if (obj.a.b.c !== 42) fail('legitimate dotted assignment broke')

  // 5. single-key assignment still works
  const flat = {} as any
  add_value_for_dotted_key(flat, 'name', 'ok')
  if (flat.name !== 'ok') fail('single-key assignment broke')

  console.log("✅ F-0016 prototype-pollution regression tests passed")
}

if (require.main === module) {
  prototype_pollution_tests()
    .then(() => { console.log("✅ suite completed"); process.exit(0) })
    .catch((err) => { console.error("❌ suite failed:", err); process.exit(1) })
}
