import { sanitize_user_html } from "../utils";
// Standalone unit test for sanitize_user_html (the render-time HTML sanitizer).
// No test framework in this package — run after building:
//   cd packages/public/utilities && npm run build:cjs && node lib/cjs/tests/sanitize_user_html.test.js
var failures = 0;
var check = function (name, condition, detail) {
    if (condition) {
        console.log("  \u2713 ".concat(name));
    }
    else {
        failures++;
        console.error("  \u2717 ".concat(name).concat(detail ? " \u2014 ".concat(detail) : ''));
    }
};
var lower = function (s) { return s.toLowerCase(); };
// A payload is neutralized if the sanitized output contains no executable handler/scheme token.
var neutralized = function (out) {
    var o = lower(out);
    return !/\son[a-z]+\s*=/.test(o) // no on*= event handlers
        && !o.includes('javascript:')
        && !o.includes('vbscript:')
        && !o.includes('<script')
        && !o.includes('<iframe')
        && !o.includes('<svg')
        && !o.includes('<object')
        && !o.includes('<embed');
};
export var sanitize_user_html_tests = function () {
    console.log("sanitize_user_html — neutralizes XSS vectors");
    var xssPayloads = [
        ['img onerror', "<img src=x onerror=\"alert(document.domain)\">"],
        ['svg onload', "<svg onload=\"alert(1)\"></svg>"],
        ['svg animate onbegin', "<svg><animate onbegin=\"alert(1)\" attributeName=\"x\" dur=\"1s\"></svg>"],
        ['details ontoggle', "<details open ontoggle=\"alert(1)\"></details>"],
        ['input onfocus autofocus', "<input autofocus onfocus=\"alert(1)\">"],
        ['body onpageshow', "<body onpageshow=\"alert(1)\">"],
        ['a javascript scheme', "<a href=\"javascript:alert(1)\">x</a>"],
        ['a javascript entity-encoded', "<a href=\"jav&#x09;ascript:alert(1)\">x</a>"],
        ['iframe javascript src', "<iframe src=\"javascript:alert(1)\"></iframe>"],
        ['iframe srcdoc', "<iframe srcdoc=\"<img src=x onerror=alert(1)>\"></iframe>"],
        ['script tag', "<script>alert(1)</script>"],
        ['onerror newline before =', "<img src=x onerror\n=\"alert(1)\">"],
        ['onerror mixed case', "<IMG SRC=x OnErRoR=\"alert(1)\">"],
        ['marquee onstart', "<marquee onstart=\"alert(1)\">x</marquee>"],
    ];
    for (var _i = 0, xssPayloads_1 = xssPayloads; _i < xssPayloads_1.length; _i++) {
        var _a = xssPayloads_1[_i], name_1 = _a[0], payload = _a[1];
        var out = sanitize_user_html(payload);
        check(name_1, neutralized(out), "got: ".concat(out));
    }
    console.log("sanitize_user_html — preserves legitimate customization HTML");
    var out_heading = sanitize_user_html("<h1>Welcome</h1><h3 style=\"color:#333\">Sub</h3>");
    check('headings + style kept', out_heading.includes('<h1>') && out_heading.includes('<h3') && lower(out_heading).includes('color'));
    var out_table = sanitize_user_html("<table><thead><tr><th>H</th></tr></thead><tbody><tr><td style=\"padding:4px\" colspan=\"2\">cell</td></tr></tbody></table>");
    check('table structure kept', out_table.includes('<table') && out_table.includes('<td') && out_table.includes('colspan'));
    var out_list = sanitize_user_html("<ul><li>a</li><li>b</li></ul><ol start=\"3\"><li>c</li></ol>");
    check('lists kept', out_list.includes('<ul') && out_list.includes('<li') && out_list.includes('<ol'));
    var out_link = sanitize_user_html("<a href=\"https://example.com\">link</a>");
    check('safe link href kept', out_link.includes('href="https://example.com"'));
    check('external link hardened with rel=noopener', lower(out_link).includes('noopener'));
    var out_img = sanitize_user_html("<img src=\"https://cdn.example.com/a.png\" alt=\"pic\" width=\"200\">");
    check('http image kept', out_img.includes('src="https://cdn.example.com/a.png"') && out_img.includes('alt="pic"'));
    var out_dataimg = sanitize_user_html("<img src=\"data:image/png;base64,iVBORw0KGgo=\">");
    check('data: image kept', out_dataimg.includes('data:image/png'));
    var out_format = sanitize_user_html("<p><strong>b</strong> <em>i</em> <u>u</u> <span style=\"font-size:14px\">s</span></p><blockquote>q</blockquote>");
    check('inline formatting + inline style kept', out_format.includes('<strong>') && out_format.includes('<span') && lower(out_format).includes('font-size'));
    // Mixed: payload embedded in otherwise-legit content — content survives, handler stripped.
    var out_mixed = sanitize_user_html("<p>Hello <b>name</b></p><img src=x onerror=\"steal()\">");
    check('mixed: legit kept, handler stripped', out_mixed.includes('<b>name</b>') && !/\son[a-z]+\s*=/.test(lower(out_mixed)));
    if (failures > 0) {
        throw new Error("".concat(failures, " sanitize_user_html assertion(s) failed"));
    }
    console.log("✅ sanitize_user_html test suite passed");
};
if (require.main === module) {
    try {
        sanitize_user_html_tests();
        process.exit(0);
    }
    catch (err) {
        console.error("❌ sanitize_user_html test suite failed:", err.message);
        process.exit(1);
    }
}
//# sourceMappingURL=sanitize_user_html.test.js.map