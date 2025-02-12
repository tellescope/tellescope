"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WYSIWYG = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_draft_wysiwyg_1 = require("react-draft-wysiwyg");
var draftjs_to_html_1 = __importDefault(require("draftjs-to-html"));
var html_to_draftjs_1 = __importDefault(require("html-to-draftjs"));
var draft_js_1 = require("draft-js");
var material_1 = require("@mui/material");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
var getToolbar = function (_a) {
    var hideEmoji = _a.hideEmoji;
    return ({
        // hide image and embedded in favor of custom sections
        options: __spreadArray([
            // 'inline', 
            // 'blockType', 
            'fontSize',
            // 'fontFamily', 
            'list',
            'textAlign',
            // 'colorPicker', 
            'link'
        ], (hideEmoji ? [] : ['emoji']), true),
        inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
            // bold: { icon: bold, className: undefined },
            // italic: { icon: italic, className: undefined },
            // underline: { icon: underline, className: undefined },
            // strikethrough: { icon: strikethrough, className: undefined },
            // monospace: { icon: monospace, className: undefined },
            // superscript: { icon: superscript, className: undefined },
            // subscript: { icon: subscript, className: undefined },
        },
        blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontSize: {
            // icon: fontSize,
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontFamily: {
            options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['unordered', 'ordered', 'indent', 'outdent'],
            // unordered: { icon: unordered, className: undefined },
            // ordered: { icon: ordered, className: undefined },
            // indent: { icon: indent, className: undefined },
            // outdent: { icon: outdent, className: undefined },
        },
        textAlign: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['left', 'center', 'right', 'justify'],
            // left: { icon: left, className: undefined },
            // center: { icon: center, className: undefined },
            // right: { icon: right, className: undefined },
            // justify: { icon: justify, className: undefined },
        },
        colorPicker: {
            // icon: color,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
        },
        link: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            dropdownClassName: undefined,
            showOpenOptionOnHover: true,
            defaultTargetOption: '_blank',
            options: ['link', 'unlink'],
            // link: { icon: link, className: undefined },
            // unlink: { icon: unlink, className: undefined },
            linkCallback: undefined
        },
        emoji: {
            // icon: emoji,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            emojis: [
                '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                '✅', '❎', '💯',
            ],
        },
        embedded: {
            // icon: embedded,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            embedCallback: undefined,
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        image: {
            // icon: image,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            // uploadCallback,
            previewImage: true,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: false, mandatory: false },
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        remove: {
            // icon: eraser, 
            className: undefined, component: undefined
        },
        history: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['undo', 'redo'],
            // undo: { icon: undo, className: undefined },
            // redo: { icon: redo, className: undefined },
        },
    });
};
var WYSIWYG = function (_a) {
    var updateHtml = _a.updateHtml, _b = _a.initialHTML, _initialHTML = _b === void 0 ? '' : _b, autoFocus = _a.autoFocus, onChange = _a.onChange, style = _a.style, editorStyle = _a.editorStyle, hideEmoji = _a.hideEmoji;
    var trimmed = _initialHTML.trim();
    var initialHTML = (trimmed.startsWith('<p>') && trimmed.endsWith('</p>')
        ? trimmed
        : "<p>".concat(trimmed, "</p>"));
    var _c = (0, react_1.useState)(draft_js_1.EditorState.createWithContent(draft_js_1.ContentState.createFromBlockArray((0, html_to_draftjs_1.default)(initialHTML).contentBlocks))), editorState = _c[0], setEditorState = _c[1];
    var editorStateRef = (0, react_1.useRef)(editorState);
    var editorRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!updateHtml)
            return;
        setEditorState(draft_js_1.EditorState.createWithContent(draft_js_1.ContentState.createFromBlockArray((0, html_to_draftjs_1.default)(updateHtml).contentBlocks)));
    }, [updateHtml]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (!autoFocus)
            return;
        if (editorRef.current) {
            (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.focusEditor) === null || _b === void 0 ? void 0 : _b.call(_a);
            setEditorState(function (es) { return draft_js_1.EditorState.moveFocusToEnd(es); });
        }
    }, [editorRef, autoFocus]);
    (0, react_1.useEffect)(function () {
        if (editorStateRef.current === editorState)
            return;
        editorStateRef.current = editorState;
        // unbounce a bit for perf
        var t = setTimeout(function () { return (onChange((0, draftjs_to_html_1.default)((0, draft_js_1.convertToRaw)(editorState.getCurrentContent())))); }, 99);
        return function () { clearTimeout(t); };
    }, [onChange, editorState]);
    var toolbar = (0, react_1.useMemo)(function () { return getToolbar({ hideEmoji: hideEmoji }); }, [hideEmoji]);
    return ((0, jsx_runtime_1.jsx)(material_1.Paper, __assign({ sx: { padding: 1 }, style: style }, { children: (0, jsx_runtime_1.jsx)(react_draft_wysiwyg_1.Editor, { spellCheck: true, ref: editorRef, editorStyle: editorStyle, editorState: editorState, wrapperClassName: "demo-wrapper", editorClassName: "demo-editor", onEditorStateChange: setEditorState, toolbar: toolbar }) })));
};
exports.WYSIWYG = WYSIWYG;
//# sourceMappingURL=wysiwyg.js.map