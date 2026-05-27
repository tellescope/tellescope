import { sanitize_user_html } from "@tellescope/utilities"

// Regression test for F-0013 / F-0014 (pattern 06 — XSS via dangerouslySetInnerHTML).
// sanitize_user_html is the canonical render-time sanitizer that replaced remove_script_tags
// at every dangerouslySetInnerHTML sink. This asserts it neutralizes XSS vectors (incl. encoded /
// whitespace / mixed-case / iframe-srcdoc bypass variants) while preserving legitimate
// customization HTML (tables, headings, lists, links, images, inline styles).
//
// Pure-function test — no Session needed. Runs as part of the main suite and standalone:
//   ./build_cjs.sh && cd packages/public/sdk && node -r dotenv/config lib/cjs/tests/api_tests/security/F-0013-sanitize-user-html.test.js

const fail = (msg: string) => { throw new Error(msg) }

const has_no_executable_vector = (out: string) => {
  const o = out.toLowerCase()
  // A handler smuggled into an attribute VALUE (e.g. title="&lt;img onerror=...&gt;") is inert
  // text — strip quoted values before checking for *live* on*= attributes to avoid false positives.
  const withoutValues = o.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''")
  return !/\son[a-z]+\s*=/.test(withoutValues)   // no live on*= event-handler attribute
      && !o.includes('javascript:')              // dropped schemes never appear in safe output
      && !o.includes('vbscript:')
      && !o.includes('<script')                  // literal dangerous tags (encoded &lt;script is fine)
      && !o.includes('<iframe')
      && !o.includes('<svg')
      && !o.includes('<math')
      && !o.includes('<object')
      && !o.includes('<embed')
      && !o.includes('<form')
      && !o.includes('<noscript')
      && !o.includes('<template')
}

export const sanitize_user_html_xss_tests = async () => {
  console.log("Running F-0013/F-0014 sanitize_user_html XSS regression tests")

  const xssPayloads: [string, string][] = [
    ['img onerror', `<img src=x onerror="alert(document.domain)">`],
    ['svg onload', `<svg onload="alert(1)"></svg>`],
    ['svg animate onbegin', `<svg><animate onbegin="alert(1)" attributeName="x" dur="1s"></svg>`],
    ['details ontoggle', `<details open ontoggle="alert(1)"></details>`],
    ['input onfocus autofocus', `<input autofocus onfocus="alert(1)">`],
    ['body onpageshow', `<body onpageshow="alert(1)">`],
    ['a javascript scheme', `<a href="javascript:alert(1)">x</a>`],
    ['a javascript entity-encoded', `<a href="jav&#x09;ascript:alert(1)">x</a>`],
    ['iframe javascript src', `<iframe src="javascript:alert(1)"></iframe>`],
    ['iframe srcdoc nested', `<iframe srcdoc="<img src=x onerror=alert(1)>"></iframe>`],
    ['script tag', `<script>alert(1)</script>`],
    ['onerror newline before =', `<img src=x onerror\n="alert(1)">`],
    ['onerror mixed case', `<IMG SRC=x OnErRoR="alert(1)">`],
    ['marquee onstart', `<marquee onstart="alert(1)">x</marquee>`],
    // mutation / namespace confusion — svg/math/noscript/template must be stripped
    ['mathml mglyph style mxss', `<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>`],
    ['svg foreignObject', `<svg><foreignObject><img src=x onerror=alert(1)></foreignObject></svg>`],
    ['noscript context confusion', `<noscript><p title="</noscript><img src=x onerror=alert(1)>">`],
    ['template content', `<template><img src=x onerror=alert(1)></template>`],
    // comment / CDATA confusion
    ['comment confusion', `<!--><img src=x onerror=alert(1)>-->`],
    ['cdata confusion', `<![CDATA[<img src=x onerror=alert(1)>]]>`],
    // markup smuggled inside an attribute value must stay inert
    ['markup inside attr value', `<img src="x" alt="<script>alert(1)</script>">`],
    // protocol obfuscation
    ['vbscript scheme', `<a href="vbscript:msgbox(1)">x</a>`],
    ['data text/html href', `<a href="data:text/html,<script>alert(1)</script>">x</a>`],
    ['javascript decimal entity', `<a href="&#74;avascript:alert(1)">x</a>`],
    ['javascript newline entity', `<a href="jav&#x0A;ascript:alert(1)">x</a>`],
  ]
  for (const [name, payload] of xssPayloads) {
    const out = sanitize_user_html(payload)
    if (!has_no_executable_vector(out)) fail(`XSS not neutralized [${name}] -> ${out}`)
  }

  // DOM clobbering: caller-controlled id/name must be stripped
  const clobber = sanitize_user_html(`<a id="x" name="getElementById">link</a><img name="y">`)
  if (/\b(id|name)\s*=/.test(clobber)) fail(`id/name not stripped (DOM clobbering): ${clobber}`)

  // legitimate customization HTML must survive
  const heading = sanitize_user_html(`<h1>Welcome</h1><h3 style="color:#333">Sub</h3>`)
  if (!(heading.includes('<h1>') && heading.includes('<h3') && heading.toLowerCase().includes('color'))) fail(`headings/style stripped: ${heading}`)

  const table = sanitize_user_html(`<table><thead><tr><th>H</th></tr></thead><tbody><tr><td style="padding:4px" colspan="2">cell</td></tr></tbody></table>`)
  if (!(table.includes('<table') && table.includes('<td') && table.includes('colspan'))) fail(`table stripped: ${table}`)

  const list = sanitize_user_html(`<ul><li>a</li></ul><ol start="3"><li>c</li></ol>`)
  if (!(list.includes('<ul') && list.includes('<li') && list.includes('<ol'))) fail(`list stripped: ${list}`)

  const link = sanitize_user_html(`<a href="https://example.com">link</a>`)
  if (!link.includes('href="https://example.com"')) fail(`safe link stripped: ${link}`)
  if (!link.toLowerCase().includes('noopener')) fail(`external link not hardened: ${link}`)

  const img = sanitize_user_html(`<img src="https://cdn.example.com/a.png" alt="pic" width="200">`)
  if (!(img.includes('src="https://cdn.example.com/a.png"') && img.includes('alt="pic"'))) fail(`http image stripped: ${img}`)

  const dataimg = sanitize_user_html(`<img src="data:image/png;base64,iVBORw0KGgo=">`)
  if (!dataimg.includes('data:image/png')) fail(`data: image stripped: ${dataimg}`)

  const fmt = sanitize_user_html(`<p><strong>b</strong> <em>i</em> <span style="font-size:14px">s</span></p><blockquote>q</blockquote>`)
  if (!(fmt.includes('<strong>') && fmt.includes('<span') && fmt.toLowerCase().includes('font-size'))) fail(`formatting stripped: ${fmt}`)

  const mixed = sanitize_user_html(`<p>Hello <b>name</b></p><img src=x onerror="steal()">`)
  if (!(mixed.includes('<b>name</b>') && !/\son[a-z]+\s*=/.test(mixed.toLowerCase()))) fail(`mixed content not handled: ${mixed}`)

  console.log("✅ F-0013/F-0014 sanitize_user_html XSS regression tests passed")
}

if (require.main === module) {
  sanitize_user_html_xss_tests()
    .then(() => { console.log("✅ suite completed"); process.exit(0) })
    .catch((err) => { console.error("❌ suite failed:", err); process.exit(1) })
}
