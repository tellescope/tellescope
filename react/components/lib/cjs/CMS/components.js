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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFBlockUI = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var __1 = require("..");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var PDFBlockUI = function (_a) {
    var _b;
    var info = _a.info;
    // support secure links
    var loadedImage = (0, __1.useFileForSecureName)({ secureName: info.link, preferInBrowser: true });
    if (!loadedImage)
        return null;
    return (0, jsx_runtime_1.jsx)(__1.PdfViewer, { url: loadedImage, height: 750 });
    return ((0, jsx_runtime_1.jsx)(__1.HoverPaper, __assign({ style: { padding: 15, width: '100%' }, onClick: function () { return window.open(loadedImage, "_blank"); } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: (_b = info.name) !== null && _b !== void 0 ? _b : 'View PDF' }), (0, jsx_runtime_1.jsx)(icons_material_1.FileOpen, { color: "primary", sx: { ml: 1 } })] })) })));
};
exports.PDFBlockUI = PDFBlockUI;
//# sourceMappingURL=components.js.map