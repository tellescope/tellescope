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
require('source-map-support').install();
import { assert, log_header } from "@tellescope/testing";
import { getBaseEmail, buildPlusAddressRegex } from "@tellescope/utilities";
var expectThrows = function (fn, name, errorPattern) {
    var threw = false;
    var err = null;
    try {
        fn();
    }
    catch (e) {
        threw = true;
        err = e;
    }
    assert(threw && (!errorPattern || errorPattern.test((err === null || err === void 0 ? void 0 : err.message) || String(err))), "expected throw".concat(errorPattern ? " matching ".concat(errorPattern) : '', ", got ").concat(threw ? err === null || err === void 0 ? void 0 : err.message : 'no throw'), name);
};
var expectEqual = function (actual, expected, name) {
    return assert(actual === expected, "expected ".concat(JSON.stringify(expected), ", got ").concat(JSON.stringify(actual)), name);
};
var expectMatch = function (regex, value, name) {
    return assert(regex.test(value), "expected ".concat(regex, " to match \"").concat(value, "\""), name);
};
var expectNoMatch = function (regex, value, name) {
    return assert(!regex.test(value), "expected ".concat(regex, " NOT to match \"").concat(value, "\""), name);
};
export var email_utils_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, rDot, rDomain, rMulti, fromBase, fromTagged, validEmails, _i, validEmails_1, e, re;
    return __generator(this, function (_a) {
        log_header("Email Utils (getBaseEmail / buildPlusAddressRegex)");
        // ====================== getBaseEmail — happy path ======================
        expectEqual(getBaseEmail('user@example.com'), 'user@example.com', 'getBaseEmail: passthrough on plain email');
        expectEqual(getBaseEmail('user+1@example.com'), 'user@example.com', 'getBaseEmail: strips single plus tag');
        expectEqual(getBaseEmail('user+a+b+c@example.com'), 'user@example.com', 'getBaseEmail: strips everything after first +');
        expectEqual(getBaseEmail('User+Tag@Example.COM'), 'user@example.com', 'getBaseEmail: lowercases input');
        expectEqual(getBaseEmail('user+@example.com'), 'user@example.com', 'getBaseEmail: handles empty plus tag');
        // ====================== getBaseEmail — defensive ======================
        expectThrows(function () { return getBaseEmail('noatsign'); }, 'getBaseEmail: throws on missing @', /Invalid email/);
        expectThrows(function () { return getBaseEmail(''); }, 'getBaseEmail: throws on empty string', /Invalid email/);
        expectThrows(function () { return getBaseEmail('@example.com'); }, 'getBaseEmail: throws on empty local part', /Invalid email/);
        expectThrows(function () { return getBaseEmail('user@'); }, 'getBaseEmail: throws on empty domain', /Invalid email/);
        // Multi-@ inputs: the FIRST @ is the boundary — proves we don't silently drop trailing @s
        expectEqual(getBaseEmail('foo@bar@baz.com'), 'foo@bar@baz.com', 'getBaseEmail: multi-@ uses first @ as boundary, preserves rest as domain');
        expectEqual(getBaseEmail('"weird@local"@example.com'), '"weird@local"@example.com', 'getBaseEmail: quoted-local style preserves full domain');
        r = buildPlusAddressRegex('user@example.com');
        expectMatch(r, 'user@example.com', 'regex matches base email');
        expectMatch(r, 'user+1@example.com', 'regex matches plus variant');
        expectMatch(r, 'user+anything-here@example.com', 'regex matches arbitrary plus tag');
        expectMatch(r, 'USER+abc@EXAMPLE.com', 'regex is case-insensitive');
        expectMatch(r, 'user+@example.com', 'regex matches empty plus tag (gap 3 fix)');
        rDot = buildPlusAddressRegex('a.b@example.com');
        expectMatch(rDot, 'a.b@example.com', 'regex matches literal . in local');
        expectMatch(rDot, 'a.b+tag@example.com', 'regex matches plus variant of dotted local');
        expectNoMatch(rDot, 'aXb@example.com', 'regex does NOT treat . as wildcard in local');
        rDomain = buildPlusAddressRegex('user@ex.am-ple.com');
        expectMatch(rDomain, 'user@ex.am-ple.com', 'regex matches literal . and - in domain');
        expectNoMatch(rDomain, 'user@exXamXple.com', 'regex does NOT treat . as wildcard in domain');
        // ====================== buildPlusAddressRegex — non-matches ======================
        expectNoMatch(r, 'prefixuser@example.com', 'regex is anchored at start (no prefix match)');
        expectNoMatch(r, 'user@example.com.evil', 'regex is anchored at end (no suffix match)');
        expectNoMatch(r, 'user@other.com', 'regex rejects different domain');
        expectNoMatch(r, 'other@example.com', 'regex rejects different local');
        expectNoMatch(r, 'user+tag@example.com.evil', 'regex rejects suffixed domain even with plus tag');
        expectNoMatch(r, 'usertag@example.com', 'regex requires + before tag (not bare suffix)');
        rMulti = buildPlusAddressRegex('foo@bar@baz.com');
        expectMatch(rMulti, 'foo@bar@baz.com', 'multi-@ regex matches its own input (domain preserved)');
        expectNoMatch(rMulti, 'foo@baz.com', 'multi-@ regex does NOT match a stripped-down domain (proves we did not drop the second @)');
        fromBase = buildPlusAddressRegex('user@example.com');
        fromTagged = buildPlusAddressRegex('user+already@example.com');
        expectEqual(fromBase.source, fromTagged.source, 'buildPlusAddressRegex: tagged input produces same regex as base input');
        expectMatch(fromTagged, 'user+anything@example.com', 'regex from tagged input matches OTHER plus variants (not just the original tag)');
        expectMatch(fromTagged, 'user@example.com', 'regex from tagged input still matches the bare base email');
        // ====================== buildPlusAddressRegex — defensive ======================
        expectThrows(function () { return buildPlusAddressRegex('noatsign'); }, 'buildPlusAddressRegex: throws on missing @', /Invalid email/);
        expectThrows(function () { return buildPlusAddressRegex(''); }, 'buildPlusAddressRegex: throws on empty string', /Invalid email/);
        validEmails = [
            'user@example.com',
            'user+1@example.com',
            'User+Tag@Example.com',
            'a.b.c@sub.example.co.uk',
            'user+@example.com',
            'user+a+b+c@example.com',
        ];
        for (_i = 0, validEmails_1 = validEmails; _i < validEmails_1.length; _i++) {
            e = validEmails_1[_i];
            re = buildPlusAddressRegex(getBaseEmail(e));
            assert(re.test(e), "round-trip failed: regex from getBaseEmail(\"".concat(e, "\") did not match \"").concat(e, "\""), "round-trip: buildPlusAddressRegex(getBaseEmail(\"".concat(e, "\")) matches \"").concat(e, "\""));
        }
        return [2 /*return*/];
    });
}); };
if (require.main === module) {
    email_utils_tests()
        .then(function () {
        console.log("✅ Email utils test suite completed successfully");
        process.exit(0);
    })
        .catch(function (error) {
        console.error("❌ Email utils test suite failed:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=email_utils.test.js.map