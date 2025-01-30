var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { remove_script_tags } from "@tellescope/utilities";
import { Button, Grid, Typography } from "@mui/material";
import { PDFBlockUI } from "./components";
import { css } from "@emotion/css";
import { useManagedContentRecords } from "../state";
export var usePageHeight = function () {
    var _a = useState(window.innerHeight), height = _a[0], setHeight = _a[1];
    useEffect(function () {
        var handler = function () { return setHeight(window.innerHeight); };
        window.addEventListener('resize', handler);
        return function () { return window.removeEventListener('resize', handler); };
    }, []);
    return height;
};
export var usePageWidth = function () {
    var _a = useState(window.innerWidth), width = _a[0], setWidth = _a[1];
    useEffect(function () {
        var handler = function () { return setWidth(window.innerWidth); };
        window.addEventListener('resize', handler);
        return function () { return window.removeEventListener('resize', handler); };
    }, []);
    return width;
};
export var correct_youtube_link_for_embed = function (link) {
    return link.replace('/watch?v=', '/embed/').split('&')[0];
};
export var ArticleViewer = function (_a) {
    var _b, _c, _d, _e;
    var article = _a.article, width = _a.width, maxWidth = _a.maxWidth, _f = _a.spacing, spacing = _f === void 0 ? 2 : _f, style = _a.style, _g = _a.iframeWidthAdjustment, iframeWidthAdjustment = _g === void 0 ? 0 : _g, onLinkClick = _a.onLinkClick;
    var _h = useManagedContentRecords({ dontFetch: true }), findById = _h[1].findById;
    var _style = __assign(__assign({}, style), { width: width, maxWidth: maxWidth });
    var pageWidth = usePageWidth();
    var rootRef = useRef(null);
    var _j = useState(0), rootWidth = _j[0], setRootWidth = _j[1];
    var _k = useState([]), history = _k[0], setHistory = _k[1];
    useLayoutEffect(function () {
        var _a, _b;
        setRootWidth(((_b = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) !== null && _b !== void 0 ? _b : 0) + iframeWidthAdjustment);
    }, [(_b = rootRef.current) === null || _b === void 0 ? void 0 : _b.offsetWidth, pageWidth]); // refresh on page width change
    if (history.length > 0) {
        return (_jsxs(Grid, __assign({ container: true }, { children: [history.length > 0 &&
                    _jsx(Grid, __assign({ item: true, sx: { mb: 1 } }, { children: _jsx(Button, __assign({ variant: "contained", onClick: function () { return setHistory(history.slice(0, history.length - 1)); } }, { children: "Back to Previous Article" })) })), _jsx(ArticleViewer, { article: history[history.length - 1] || article, onLinkClick: function (r) { return setHistory(function (h) { return __spreadArray(__spreadArray([], h, true), [r], false); }); } })] })));
    }
    if (!((_c = article.blocks) === null || _c === void 0 ? void 0 : _c.length)) {
        if (article.type === 'PDF' && ((_e = (_d = article.attachments) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.secureName)) {
            return _jsx(PDFBlockUI, { info: { link: article.attachments[0].secureName } });
        }
        else if (article.htmlContent) {
            return (_jsx("div", { style: style, dangerouslySetInnerHTML: {
                    __html: remove_script_tags(article.htmlContent)
                } }));
        }
        else {
            return (_jsx("div", __assign({ style: style }, { children: article.textContent })));
        }
    }
    return (_jsx(Grid, __assign({ container: true, direction: "column", justifyContent: "center", ref: rootRef, style: _style, spacing: spacing }, { children: article.blocks.map(function (block, i) {
            var _a, _b;
            return (_jsx(Grid, __assign({ item: true }, { children: block.type === 'h1' ? (_jsx(Typography, __assign({ component: "h1", sx: { fontSize: 28, fontWeight: 'bold', m: 0, p: 0 } }, { children: block.info.text })))
                    : block.type === 'h2' ? (_jsx(Typography, __assign({ component: "h2", sx: { fontSize: 23, m: 0, p: 0 } }, { children: block.info.text })))
                        : block.type === 'html' ? (_jsx("div", { style: { fontSize: 18, lineHeight: '25pt' }, className: css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["p {\n                margin-top: 0;\n                margin-bottom: 0;\n              }"], ["p {\n                margin-top: 0;\n                margin-bottom: 0;\n              }"]))), dangerouslySetInnerHTML: {
                                __html: remove_script_tags(block.info.html.replaceAll(/style="*"/g, ''))
                            } }))
                            : block.type === 'image' ? (_jsx("img", { src: block.info.link, alt: '', style: {
                                    maxWidth: block.info.maxWidth || '100%',
                                    maxHeight: block.info.maxHeight || undefined,
                                    height: block.info.height || undefined,
                                    width: block.info.width || undefined, // '' => undefined
                                } }))
                                : block.type === 'youtube' ? (_jsx("iframe", { width: rootWidth, height: rootWidth * 315 / 560, title: "YouTube video player ".concat(i), allowFullScreen: true, src: correct_youtube_link_for_embed(block.info.link) }))
                                    : block.type === 'iframe' ? (_jsx("iframe", { width: rootWidth, height: rootWidth * (block.info.height || 315) / (block.info.width || 560), title: (_a = block.info.name) !== null && _a !== void 0 ? _a : "embedded link ".concat(i), allowFullScreen: true, src: block.info.link }))
                                        : block.type === 'pdf' ? (_jsx(PDFBlockUI, { info: block.info }))
                                            : (block.type === 'content-link' && block.info.recordId && findById(block.info.recordId, { batch: true })) ? (_jsx(Typography, __assign({ sx: { cursor: 'pointer', textDecoration: 'underline' }, onClick: function () {
                                                    var r = findById(block.info.recordId);
                                                    if (r) {
                                                        if (onLinkClick) {
                                                            onLinkClick(r);
                                                        }
                                                        else {
                                                            setHistory(function (h) { return __spreadArray(__spreadArray([], h, true), [r], false); });
                                                        }
                                                    }
                                                } }, { children: ((_b = findById(block.info.recordId)) === null || _b === void 0 ? void 0 : _b.title) || 'Loading...' })))
                                                : null }), i));
        }) })));
};
export var html_for_article = function (article, options) {
    var _a;
    var rootWidth = (options === null || options === void 0 ? void 0 : options.rootWidth) || 400;
    var content = (((_a = article.blocks) !== null && _a !== void 0 ? _a : [])
        .map(function (block, i) {
        var _a, _b;
        return block.type === 'h1' ? ("<h1>".concat(block.info.text, "</h1>"))
            : block.type === 'h2' ? ("<h2>".concat(block.info.text, "</h2>"))
                : block.type === 'html' ? ("<div>".concat(remove_script_tags(remove_script_tags(block.info.html)), "</div>"))
                    : block.type === 'image' ? (
                    // wrap with div to supporting centering later 
                    "<div style=\"\">\n            <img src=\"".concat(block.info.link, "\" alt={''} style=\"max-width: ").concat(block.info.maxWidth || '100%', "; max-height: ").concat(block.info.maxHeight || undefined, "; height: ").concat(block.info.height || undefined, "; width: ").concat(block.info.width || undefined, ";\" />\n          </div>"))
                        : block.type === 'youtube' ? ("<iframe width=\"".concat(rootWidth, "\" \n            height=\"").concat(rootWidth * 315 / 560, "\"\n            title=\"").concat("YouTube video player ".concat(i), "\"\n            allowFullScreen\n            src=\"").concat(correct_youtube_link_for_embed(block.info.link), "\"\n            style=\"margin-top: 12; margin-bottom: 12\"\n          >\n          </iframe>"))
                            : block.type === 'iframe' ? ("<iframe width=\"".concat(rootWidth, "\" allowFullScreen\n            height=\"").concat(rootWidth * (block.info.height || 315) / (block.info.width || 560), "\"\n            title=\"").concat((_a = block.info.name) !== null && _a !== void 0 ? _a : "embedded link ".concat(i), "\"\n            src=\"").concat(block.info.link, "\"\n            style=\"margin-top: 12; margin-bottom: 12\"\n          >\n          </iframe> "))
                                : block.type === 'pdf' ? ("<iframe width=\"".concat(rootWidth, "\" allowFullScreen\n            height=\"500\"\n            title=\"").concat((_b = block.info.name) !== null && _b !== void 0 ? _b : "embedded pdf ".concat(i), "\"\n            src=\"").concat(block.info.link, "\"\n            style=\"margin-top: 12; margin-bottom: 12\"\n          >\n          </iframe>"))
                                    : '';
    })
        .join('<br />'));
    return ("<div>".concat(content, "</div>"));
};
var templateObject_1;
//# sourceMappingURL=ContentViewer.js.map