"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prototype_pollution_tests = void 0;
var utilities_1 = require("@tellescope/utilities");
// Regression test for F-0016 (pattern 17 — prototype pollution).
// add_value_for_dotted_key must NOT write through __proto__/constructor/prototype path segments
// (which would pollute Object.prototype process-wide), while still performing legitimate dotted assignment.
//
// Pure-function test — no Session needed. Runs in the main suite and standalone:
//   ./build_cjs.sh && cd packages/public/sdk && node -r dotenv/config lib/cjs/tests/api_tests/security/F-0016-prototype-pollution.test.js
var fail = function (msg) { throw new Error(msg); };
var prototype_pollution_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var leakedA, leakedB, leakedC, obj, flat;
    return __generator(this, function (_a) {
        console.log("Running F-0016 prototype-pollution regression tests");
        // 1. __proto__ path must not pollute Object.prototype
        (0, utilities_1.add_value_for_dotted_key)({ insurance: {} }, 'insurance.__proto__.__pp_a__', 'polluted');
        leakedA = {}.__pp_a__;
        delete Object.prototype.__pp_a__; // clean up regardless, so a failure here can't contaminate the rest of the suite
        if (leakedA !== undefined)
            fail('Object.prototype polluted via __proto__ path');
        // 2. constructor.prototype path must not pollute
        (0, utilities_1.add_value_for_dotted_key)({ insurance: {} }, 'insurance.constructor.prototype.__pp_b__', 'polluted');
        leakedB = {}.__pp_b__;
        delete Object.prototype.__pp_b__;
        if (leakedB !== undefined)
            fail('Object.prototype polluted via constructor.prototype path');
        // 3. a leading __proto__ segment must not pollute either
        (0, utilities_1.add_value_for_dotted_key)({}, '__proto__.__pp_c__', 'polluted');
        leakedC = {}.__pp_c__;
        delete Object.prototype.__pp_c__;
        if (leakedC !== undefined)
            fail('Object.prototype polluted via leading __proto__ segment');
        obj = { a: { b: {} } };
        (0, utilities_1.add_value_for_dotted_key)(obj, 'a.b.c', 42);
        if (obj.a.b.c !== 42)
            fail('legitimate dotted assignment broke');
        flat = {};
        (0, utilities_1.add_value_for_dotted_key)(flat, 'name', 'ok');
        if (flat.name !== 'ok')
            fail('single-key assignment broke');
        console.log("✅ F-0016 prototype-pollution regression tests passed");
        return [2 /*return*/];
    });
}); };
exports.prototype_pollution_tests = prototype_pollution_tests;
if (require.main === module) {
    (0, exports.prototype_pollution_tests)()
        .then(function () { console.log("✅ suite completed"); process.exit(0); })
        .catch(function (err) { console.error("❌ suite failed:", err); process.exit(1); });
}
//# sourceMappingURL=F-0016-prototype-pollution.test.js.map