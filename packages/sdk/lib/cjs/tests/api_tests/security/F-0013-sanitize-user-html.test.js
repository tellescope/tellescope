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
exports.sanitize_user_html_xss_tests = void 0;
var utilities_1 = require("@tellescope/utilities");
// Regression test for F-0013 / F-0014 (pattern 06 — XSS via dangerouslySetInnerHTML).
// sanitize_user_html is the canonical render-time sanitizer that replaced remove_script_tags
// at every dangerouslySetInnerHTML sink. This asserts it neutralizes XSS vectors (incl. encoded /
// whitespace / mixed-case / iframe-srcdoc bypass variants) while preserving legitimate
// customization HTML (tables, headings, lists, links, images, inline styles).
//
// Pure-function test — no Session needed. Runs as part of the main suite and standalone:
//   ./build_cjs.sh && cd packages/public/sdk && node -r dotenv/config lib/cjs/tests/api_tests/security/F-0013-sanitize-user-html.test.js
var fail = function (msg) { throw new Error(msg); };
var has_no_executable_vector = function (out) {
    var o = out.toLowerCase();
    // A handler smuggled into an attribute VALUE (e.g. title="&lt;img onerror=...&gt;") is inert
    // text — strip quoted values before checking for *live* on*= attributes to avoid false positives.
    var withoutValues = o.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    return !/\son[a-z]+\s*=/.test(withoutValues) // no live on*= event-handler attribute
        && !o.includes('javascript:') // dropped schemes never appear in safe output
        && !o.includes('vbscript:')
        && !o.includes('<script') // literal dangerous tags (encoded &lt;script is fine)
        && !o.includes('<iframe')
        && !o.includes('<svg')
        && !o.includes('<math')
        && !o.includes('<object')
        && !o.includes('<embed')
        && !o.includes('<form')
        && !o.includes('<noscript')
        && !o.includes('<template');
};
var sanitize_user_html_xss_tests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var xssPayloads, _i, xssPayloads_1, _a, name_1, payload, out, clobber, heading, table, list, link, img, dataimg, fmt, mixed;
    return __generator(this, function (_b) {
        console.log("Running F-0013/F-0014 sanitize_user_html XSS regression tests");
        xssPayloads = [
            ['img onerror', "<img src=x onerror=\"alert(document.domain)\">"],
            ['svg onload', "<svg onload=\"alert(1)\"></svg>"],
            ['svg animate onbegin', "<svg><animate onbegin=\"alert(1)\" attributeName=\"x\" dur=\"1s\"></svg>"],
            ['details ontoggle', "<details open ontoggle=\"alert(1)\"></details>"],
            ['input onfocus autofocus', "<input autofocus onfocus=\"alert(1)\">"],
            ['body onpageshow', "<body onpageshow=\"alert(1)\">"],
            ['a javascript scheme', "<a href=\"javascript:alert(1)\">x</a>"],
            ['a javascript entity-encoded', "<a href=\"jav&#x09;ascript:alert(1)\">x</a>"],
            ['iframe javascript src', "<iframe src=\"javascript:alert(1)\"></iframe>"],
            ['iframe srcdoc nested', "<iframe srcdoc=\"<img src=x onerror=alert(1)>\"></iframe>"],
            ['script tag', "<script>alert(1)</script>"],
            ['onerror newline before =', "<img src=x onerror\n=\"alert(1)\">"],
            ['onerror mixed case', "<IMG SRC=x OnErRoR=\"alert(1)\">"],
            ['marquee onstart', "<marquee onstart=\"alert(1)\">x</marquee>"],
            // mutation / namespace confusion — svg/math/noscript/template must be stripped
            ['mathml mglyph style mxss', "<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>"],
            ['svg foreignObject', "<svg><foreignObject><img src=x onerror=alert(1)></foreignObject></svg>"],
            ['noscript context confusion', "<noscript><p title=\"</noscript><img src=x onerror=alert(1)>\">"],
            ['template content', "<template><img src=x onerror=alert(1)></template>"],
            // comment / CDATA confusion
            ['comment confusion', "<!--><img src=x onerror=alert(1)>-->"],
            ['cdata confusion', "<![CDATA[<img src=x onerror=alert(1)>]]>"],
            // markup smuggled inside an attribute value must stay inert
            ['markup inside attr value', "<img src=\"x\" alt=\"<script>alert(1)</script>\">"],
            // protocol obfuscation
            ['vbscript scheme', "<a href=\"vbscript:msgbox(1)\">x</a>"],
            ['data text/html href', "<a href=\"data:text/html,<script>alert(1)</script>\">x</a>"],
            ['javascript decimal entity', "<a href=\"&#74;avascript:alert(1)\">x</a>"],
            ['javascript newline entity', "<a href=\"jav&#x0A;ascript:alert(1)\">x</a>"],
        ];
        for (_i = 0, xssPayloads_1 = xssPayloads; _i < xssPayloads_1.length; _i++) {
            _a = xssPayloads_1[_i], name_1 = _a[0], payload = _a[1];
            out = (0, utilities_1.sanitize_user_html)(payload);
            if (!has_no_executable_vector(out))
                fail("XSS not neutralized [".concat(name_1, "] -> ").concat(out));
        }
        clobber = (0, utilities_1.sanitize_user_html)("<a id=\"x\" name=\"getElementById\">link</a><img name=\"y\">");
        if (/\b(id|name)\s*=/.test(clobber))
            fail("id/name not stripped (DOM clobbering): ".concat(clobber));
        heading = (0, utilities_1.sanitize_user_html)("<h1>Welcome</h1><h3 style=\"color:#333\">Sub</h3>");
        if (!(heading.includes('<h1>') && heading.includes('<h3') && heading.toLowerCase().includes('color')))
            fail("headings/style stripped: ".concat(heading));
        table = (0, utilities_1.sanitize_user_html)("<table><thead><tr><th>H</th></tr></thead><tbody><tr><td style=\"padding:4px\" colspan=\"2\">cell</td></tr></tbody></table>");
        if (!(table.includes('<table') && table.includes('<td') && table.includes('colspan')))
            fail("table stripped: ".concat(table));
        list = (0, utilities_1.sanitize_user_html)("<ul><li>a</li></ul><ol start=\"3\"><li>c</li></ol>");
        if (!(list.includes('<ul') && list.includes('<li') && list.includes('<ol')))
            fail("list stripped: ".concat(list));
        link = (0, utilities_1.sanitize_user_html)("<a href=\"https://example.com\">link</a>");
        if (!link.includes('href="https://example.com"'))
            fail("safe link stripped: ".concat(link));
        if (!link.toLowerCase().includes('noopener'))
            fail("external link not hardened: ".concat(link));
        img = (0, utilities_1.sanitize_user_html)("<img src=\"https://cdn.example.com/a.png\" alt=\"pic\" width=\"200\">");
        if (!(img.includes('src="https://cdn.example.com/a.png"') && img.includes('alt="pic"')))
            fail("http image stripped: ".concat(img));
        dataimg = (0, utilities_1.sanitize_user_html)("<img src=\"data:image/png;base64,iVBORw0KGgo=\">");
        if (!dataimg.includes('data:image/png'))
            fail("data: image stripped: ".concat(dataimg));
        fmt = (0, utilities_1.sanitize_user_html)("<p><strong>b</strong> <em>i</em> <span style=\"font-size:14px\">s</span></p><blockquote>q</blockquote>");
        if (!(fmt.includes('<strong>') && fmt.includes('<span') && fmt.toLowerCase().includes('font-size')))
            fail("formatting stripped: ".concat(fmt));
        mixed = (0, utilities_1.sanitize_user_html)("<p>Hello <b>name</b></p><img src=x onerror=\"steal()\">");
        if (!(mixed.includes('<b>name</b>') && !/\son[a-z]+\s*=/.test(mixed.toLowerCase())))
            fail("mixed content not handled: ".concat(mixed));
        console.log("✅ F-0013/F-0014 sanitize_user_html XSS regression tests passed");
        return [2 /*return*/];
    });
}); };
exports.sanitize_user_html_xss_tests = sanitize_user_html_xss_tests;
if (require.main === module) {
    (0, exports.sanitize_user_html_xss_tests)()
        .then(function () { console.log("✅ suite completed"); process.exit(0); })
        .catch(function (err) { console.error("❌ suite failed:", err); process.exit(1); });
}
//# sourceMappingURL=F-0013-sanitize-user-html.test.js.map