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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { IconButton, Menu, MenuItem, CircularProgress, ListItemIcon, ListItemText } from '@mui/material';
import { BlurOn as BlurOnIcon, BlurOff as BlurOffIcon, Wallpaper as WallpaperIcon, } from '@mui/icons-material';
/**
 * Three-way background-effect selector shared by the in-call control bar and
 * the pre-join preview. Renders an IconButton whose glyph reflects the active
 * effect and opens a menu offering None / Blur (always) and Image (only when
 * available). When Image is unavailable it behaves like a None/Blur toggle,
 * visually equivalent to the previous blur-only control.
 */
export var BackgroundEffectSelector = function (_a) {
    var effect = _a.effect, setEffect = _a.setEffect, isImageAvailable = _a.isImageAvailable, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.size, size = _d === void 0 ? 'medium' : _d, sx = _a.sx;
    var _e = useState(null), anchorEl = _e[0], setAnchorEl = _e[1];
    var open = Boolean(anchorEl);
    var handleSelect = function (next) {
        setEffect(next);
        setAnchorEl(null);
    };
    var spinnerSize = size === 'small' ? 16 : 20;
    var buttonIcon = isLoading
        ? _jsx(CircularProgress, { size: spinnerSize, sx: { color: 'white' } })
        : effect === 'blur'
            ? _jsx(BlurOnIcon, { fontSize: size })
            : effect === 'image'
                ? _jsx(WallpaperIcon, { fontSize: size })
                : _jsx(BlurOffIcon, { fontSize: size });
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, __assign({ onClick: function (e) { return setAnchorEl(e.currentTarget); }, disabled: disabled || isLoading, size: size, sx: __assign({ color: effect !== 'none' ? '#4caf50' : 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.5)' } }, sx) }, { children: buttonIcon })), _jsxs(Menu, __assign({ anchorEl: anchorEl, open: open, onClose: function () { return setAnchorEl(null); } }, { children: [_jsxs(MenuItem, __assign({ selected: effect === 'none', onClick: function () { return handleSelect('none'); } }, { children: [_jsx(ListItemIcon, { children: _jsx(BlurOffIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "None" })] })), _jsxs(MenuItem, __assign({ selected: effect === 'blur', onClick: function () { return handleSelect('blur'); } }, { children: [_jsx(ListItemIcon, { children: _jsx(BlurOnIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Blur" })] })), isImageAvailable && (_jsxs(MenuItem, __assign({ selected: effect === 'image', onClick: function () { return handleSelect('image'); } }, { children: [_jsx(ListItemIcon, { children: _jsx(WallpaperIcon, { fontSize: "small" }) }), _jsx(ListItemText, { children: "Image" })] })))] }))] }));
};
//# sourceMappingURL=BackgroundEffectSelector.js.map