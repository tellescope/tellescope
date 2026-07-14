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
exports.BackgroundEffectSelector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
/**
 * Three-way background-effect selector shared by the in-call control bar and
 * the pre-join preview. Renders an IconButton whose glyph reflects the active
 * effect and opens a menu offering None / Blur (always) and Image (only when
 * available). When Image is unavailable it behaves like a None/Blur toggle,
 * visually equivalent to the previous blur-only control.
 */
var BackgroundEffectSelector = function (_a) {
    var effect = _a.effect, setEffect = _a.setEffect, isImageAvailable = _a.isImageAvailable, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.size, size = _d === void 0 ? 'medium' : _d, sx = _a.sx;
    var _e = (0, react_1.useState)(null), anchorEl = _e[0], setAnchorEl = _e[1];
    var open = Boolean(anchorEl);
    var handleSelect = function (next) {
        setEffect(next);
        setAnchorEl(null);
    };
    var spinnerSize = size === 'small' ? 16 : 20;
    var buttonIcon = isLoading
        ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: spinnerSize, sx: { color: 'white' } })
        : effect === 'blur'
            ? (0, jsx_runtime_1.jsx)(icons_material_1.BlurOn, { fontSize: size })
            : effect === 'image'
                ? (0, jsx_runtime_1.jsx)(icons_material_1.Wallpaper, { fontSize: size })
                : (0, jsx_runtime_1.jsx)(icons_material_1.BlurOff, { fontSize: size });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, __assign({ onClick: function (e) { return setAnchorEl(e.currentTarget); }, disabled: disabled || isLoading, size: size, sx: __assign({ color: effect !== 'none' ? '#4caf50' : 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.5)' } }, sx) }, { children: buttonIcon })), (0, jsx_runtime_1.jsxs)(material_1.Menu, __assign({ anchorEl: anchorEl, open: open, onClose: function () { return setAnchorEl(null); } }, { children: [(0, jsx_runtime_1.jsxs)(material_1.MenuItem, __assign({ selected: effect === 'none', onClick: function () { return handleSelect('none'); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { children: (0, jsx_runtime_1.jsx)(icons_material_1.BlurOff, { fontSize: "small" }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemText, { children: "None" })] })), (0, jsx_runtime_1.jsxs)(material_1.MenuItem, __assign({ selected: effect === 'blur', onClick: function () { return handleSelect('blur'); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { children: (0, jsx_runtime_1.jsx)(icons_material_1.BlurOn, { fontSize: "small" }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemText, { children: "Blur" })] })), isImageAvailable && ((0, jsx_runtime_1.jsxs)(material_1.MenuItem, __assign({ selected: effect === 'image', onClick: function () { return handleSelect('image'); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { children: (0, jsx_runtime_1.jsx)(icons_material_1.Wallpaper, { fontSize: "small" }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemText, { children: "Image" })] })))] }))] }));
};
exports.BackgroundEffectSelector = BackgroundEffectSelector;
//# sourceMappingURL=BackgroundEffectSelector.js.map