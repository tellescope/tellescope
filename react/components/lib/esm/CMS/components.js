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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HoverPaper, useFileForSecureName, PdfViewer } from "..";
import { Grid, Typography } from "@mui/material";
import { FileOpen as OpenFileIcon, } from "@mui/icons-material";
export var PDFBlockUI = function (_a) {
    var _b;
    var info = _a.info;
    // support secure links
    var loadedImage = useFileForSecureName({ secureName: info.link, preferInBrowser: true });
    if (!loadedImage)
        return null;
    return _jsx(PdfViewer, { url: loadedImage, height: 750 });
    return (_jsx(HoverPaper, __assign({ style: { padding: 15, width: '100%' }, onClick: function () { return window.open(loadedImage, "_blank"); } }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "center" }, { children: [_jsx(Typography, { children: (_b = info.name) !== null && _b !== void 0 ? _b : 'View PDF' }), _jsx(OpenFileIcon, { color: "primary", sx: { ml: 1 } })] })) })));
};
//# sourceMappingURL=components.js.map