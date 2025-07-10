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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Button, Checkbox, Paper, Typography, NavigateBeforeIcon, NavigateNextIcon, SortDescendingIcon, SortAscendingIcon, SortInactiveIcon, FilterIcon, FilterActiveIcon, Modal, TextField, } from "./mui";
import { LabeledIconButton, } from "./controls";
import { DraggableList, Flex, ScrollingList, WithHover, } from "./layout";
import { read_local_storage, update_local_storage } from "@tellescope/utilities";
import Draggable from 'react-draggable'; // The default
import { PRIMARY_HEX } from "@tellescope/constants";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Autocomplete } from "@mui/material";
import { LoadingButton } from "./forms";
// import DragHandleIcon from '@mui/icons-material/DragHandle';
var LIGHT_GRAY = "#fafafa";
export var GRAY = "#EFEFEF";
var DARK_GRAY = "#E8E8E8";
var DARKER_GRAY = "#52575C";
var ROW_HEIGHT = 45;
export var TableTitle = function (_a) {
    var title = _a.title, description = _a.description, actionsComponent = _a.actionsComponent, style = _a.style, _b = _a.textStyle, textStyle = _b === void 0 ? {} : _b, horizontalPadding = _a.horizontalPadding;
    return (_jsxs(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "space-between", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, backgroundColor: LIGHT_GRAY, minHeight: 50, paddingTop: 0 }, style) }, { children: [typeof title === 'string'
                ? (_jsx(Typography, __assign({ component: "h3", style: __assign({ fontWeight: 600, fontSize: 18, marginRight: horizontalPadding }, textStyle) }, { children: title })))
                : _jsx(Flex, { children: title }), _jsx(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "flex-end" }, { children: actionsComponent }))] })));
};
var defaultWidthForFields = function (n) { return n <= 0 ? '100%' : "".concat(Math.floor(100 / n), "%"); };
var checkboxStyle = {
    position: 'relative',
    right: '10px',
};
var COLUMN_RESIZE_HANDLE_WIDTH = 3;
export var TableHeader = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var fields = _a.fields, sorting = _a.sorting, setSorting = _a.setSorting, selectable = _a.selectable, allSelected = _a.allSelected, setAllSelected = _a.setAllSelected, style = _a.style, textStyle = _a.textStyle, horizontalPadding = _a.horizontalPadding, _o = _a.fontSize, fontSize = _o === void 0 ? 15 : _o, memoryId = _a.memoryId, widthOffsets = _a.widthOffsets, setWidthOffsets = _a.setWidthOffsets, onExport = _a.onExport, localFilters = _a.localFilters, setLocalFilters = _a.setLocalFilters, filterSuggestions = _a.filterSuggestions, _p = _a.minColumnWidth, minColumnWidth = _p === void 0 ? 75 : _p, _q = _a.columnResizeZIndex, columnResizeZIndex = _q === void 0 ? 1000 : _q, _r = _a.headerHeight, headerHeight = _r === void 0 ? ROW_HEIGHT : _r;
    var _s = useState(-1), openFilter = _s[0], setOpenFilter = _s[1];
    var _t = useState(0), startX = _t[0], setStartX = _t[1];
    var _u = useState(), dragPosition = _u[0], setDragPosition = _u[1];
    return (_jsxs(_Fragment, { children: [_jsx(Modal, __assign({ open: openFilter !== -1, setOpen: function (o) { return !o && setOpenFilter(-1); } }, { children: ((_b = fields[openFilter]) === null || _b === void 0 ? void 0 : _b.filterComponent)
                    || (_jsx(Flex, __assign({ flex: 1, justifyContent: "center" }, { children: ((_c = fields[openFilter]) === null || _c === void 0 ? void 0 : _c.filterType) === 'multi'
                            ? (_jsxs(_Fragment, { children: [_jsx(Autocomplete, { disableClearable: true, disablePortal: true, size: 'small', options: ['One Of', 'All Of'], sx: { width: 140, mr: 0.5 }, onChange: function (e, value) {
                                            setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? __assign(__assign({}, f), { valuesQualifier: value === 'All Of' ? 'All Of' : 'One Of' }) : f; }); });
                                        }, value: ((_d = localFilters[openFilter]) === null || _d === void 0 ? void 0 : _d.valuesQualifier) === 'All Of' ? 'All Of' : 'One Of', renderInput: function (params) {
                                            var _a;
                                            return _jsx(TextField, __assign({}, params, { fullWidth: true, autoFocus: true, label: "Qualifier", size: 'small', value: ((_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.valuesQualifier) === 'All Of' ? 'All Of' : 'One Of' }));
                                        } }), _jsx(Autocomplete, { size: 'small', disablePortal: true, multiple: true, options: ((filterSuggestions === null || filterSuggestions === void 0 ? void 0 : filterSuggestions[(_f = (_e = fields[openFilter]) === null || _e === void 0 ? void 0 : _e.key) === null || _f === void 0 ? void 0 : _f.toString()]) || []).sort(), freeSolo: true, autoSelect // allow any input and select it on change
                                        : true, onChange: function (e, values) {
                                            if (values === void 0) { values = []; }
                                            setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? { query: '', values: values } : f; }); });
                                        }, value: (_h = (_g = localFilters[openFilter]) === null || _g === void 0 ? void 0 : _g.values) !== null && _h !== void 0 ? _h : [], renderInput: function (params) {
                                            var _a, _b;
                                            return _jsx(TextField, __assign({}, params, { autoFocus: true, label: "Filter by", size: 'small', style: { width: 400 }, value: (_b = (_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.query) !== null && _b !== void 0 ? _b : '' }));
                                        } })] })) : (_jsx(Autocomplete, { size: 'small', disablePortal: true, options: ((filterSuggestions === null || filterSuggestions === void 0 ? void 0 : filterSuggestions[(_k = (_j = fields[openFilter]) === null || _j === void 0 ? void 0 : _j.key) === null || _k === void 0 ? void 0 : _k.toString()]) || []).sort(), freeSolo: true, autoSelect // allow any input and select it on change
                            : true, onChange: function (e, _query) {
                                var query = _query || '';
                                setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? { query: query } : f; }); });
                            }, value: (_m = (_l = localFilters[openFilter]) === null || _l === void 0 ? void 0 : _l.query) !== null && _m !== void 0 ? _m : '', renderInput: function (params) {
                                var _a, _b;
                                return _jsx(TextField, __assign({}, params, { autoFocus: true, label: "Filter", size: 'small', style: { width: 400 }, value: (_b = (_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.query) !== null && _b !== void 0 ? _b : '' }));
                            } })) }))) })), _jsxs(Flex, __assign({ alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, minHeight: headerHeight, backgroundColor: DARK_GRAY }, style) }, { children: [selectable &&
                        _jsx(Flex, __assign({ style: checkboxStyle }, { children: setAllSelected ? _jsx(Checkbox, { checked: allSelected, onChange: setAllSelected }) : _jsx(Flex, { style: { width: 42 } }) })), _jsx(Flex, __assign({ flex: 1, wrap: "nowrap" }, { children: fields.map(function (_a, i) {
                            var _b, _c, _d, _e, _f, _g;
                            var key = _a.key, label = _a.label, textAlign = _a.textAlign, width = _a.width, getSortValue = _a.getSortValue, hidden = _a.hidden, style = _a.style, filterIsActive = _a.filterIsActive, filterComponent = _a.filterComponent, allowWidthAdjustment = _a.allowWidthAdjustment, getFilterValue = _a.getFilterValue;
                            if (hidden)
                                return null;
                            var sort = sorting.find(function (s) { return s.field === label; });
                            return (_jsxs(Flex, __assign({ wrap: "nowrap", flex: width !== undefined ? 0 : 1, style: __assign({ alignItems: 'center', marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined, justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start' }, style) }, { children: [_jsxs(Flex, __assign({ wrap: "nowrap", style: {
                                            textAlign: textAlign,
                                            justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
                                            width: (typeof width === 'number'
                                                ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                                                : (width !== null && width !== void 0 ? width : defaultWidthForFields(fields.length))),
                                            alignItems: 'center',
                                        } }, { children: [_jsx(Typography, __assign({ component: "h5", noWrap: true, style: __assign({ fontWeight: 600, fontSize: fontSize }, textStyle) }, { children: label })), _jsxs(Flex, __assign({ wrap: "nowrap" }, { children: [getSortValue && ((sort === null || sort === void 0 ? void 0 : sort.direction) === 'ascending'
                                                        ? _jsx(LabeledIconButton, { size: 22, Icon: SortAscendingIcon, color: "primary", label: "Click to Sort Descending", onClick: function () { return setSorting(function (sorting) { return sorting.map(function (s) { return s.field !== label ? s : __assign(__assign({}, s), { direction: 'descending' }); }); }); } })
                                                        : (sort === null || sort === void 0 ? void 0 : sort.direction) === 'descending'
                                                            ? _jsx(LabeledIconButton, { size: 22, Icon: SortDescendingIcon, color: "primary", label: "Click to Disable Sort", onClick: function () { return setSorting(function (sorting) { return sorting.filter(function (s) { return s.field !== label; }); }); } })
                                                            : _jsx(LabeledIconButton, { size: 22, Icon: SortInactiveIcon, color: "inherit", label: "Click to Sort Ascending", onClick: function () { return setSorting(function (sorting) { return __spreadArray(__spreadArray([], sorting, true), [{
                                                                        field: label,
                                                                        direction: 'ascending'
                                                                    }], false); }); } })), filterComponent && (_jsx(LabeledIconButton, { size: 22, offsetX: getSortValue ? -7 : -4, label: "Filter", disabled: openFilter !== -1, color: filterIsActive ? "primary" : 'inherit', Icon: filterIsActive ? FilterActiveIcon : FilterIcon, onClick: function () { return setOpenFilter(i); } })), !filterComponent && getFilterValue &&
                                                        _jsx(LabeledIconButton, { size: 22, offsetX: getSortValue ? -7 : -4, label: "Filter", disabled: openFilter !== -1, color: (((_b = localFilters[i]) === null || _b === void 0 ? void 0 : _b.query) || !!((_d = (_c = localFilters === null || localFilters === void 0 ? void 0 : localFilters[i]) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.length)) ? "primary" : 'inherit', Icon: (((_e = localFilters[i]) === null || _e === void 0 ? void 0 : _e.query) || !!((_g = (_f = localFilters === null || localFilters === void 0 ? void 0 : localFilters[i]) === null || _f === void 0 ? void 0 : _f.values) === null || _g === void 0 ? void 0 : _g.length)) ? FilterActiveIcon : FilterIcon, onClick: function () { return setOpenFilter(i); } })] }))] })), allowWidthAdjustment && memoryId &&
                                        _jsx(Flex, __assign({ flex: 1, justifyContent: "flex-end" }, { children: _jsx(Draggable, __assign({ axis: "x", position: dragPosition, onStart: function (e, data) {
                                                    setDragPosition(undefined);
                                                    setStartX(data.lastX - (widthOffsets[key] || 0));
                                                }, onStop: function (e, data) {
                                                    setWidthOffsets(function (o) {
                                                        var _a;
                                                        var increment = Math.max(
                                                        // 0,
                                                        (data.lastX - startX) / 1);
                                                        update_local_storage("".concat(memoryId).concat(key, "width"), increment.toString());
                                                        return __assign(__assign({}, o), (_a = {}, _a[key] = increment, _a));
                                                    });
                                                    setDragPosition({ x: 0, y: 0 }); // snaps back to appropriate spot
                                                } }, { children: _jsx("div", { style: {
                                                        width: COLUMN_RESIZE_HANDLE_WIDTH, marginLeft: -COLUMN_RESIZE_HANDLE_WIDTH,
                                                        height: '30px',
                                                        backgroundColor: '#22222266',
                                                        cursor: 'col-resize',
                                                        zIndex: columnResizeZIndex,
                                                        position: 'relative', right: '6px',
                                                    } }) })) }))] }), key));
                        }) })), onExport &&
                        _jsx(Flex, { children: _jsx(LabeledIconButton, { Icon: CloudDownloadIcon, label: "Export Data", onClick: onExport }) })] }))] }));
};
var ROW_DIVIDER_STYLE = "1px solid ".concat(DARK_GRAY);
var get_display_value = function (item, key, indices, render, options) {
    if (render) {
        return render(item, indices, options !== null && options !== void 0 ? options : {});
    }
    var value = item[key];
    if (!(key in item))
        console.warn("Value missing for key ".concat(key, " while rendering Table without a specified render function."));
    if (value === null || value === undefined) {
        return null;
    }
    if (React.isValidElement(value)) {
        return value;
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value.toString === 'function') {
        return value.toString();
    }
    throw new Error("Missing renderer in renderFields for key ".concat(key, ". The given value is not a valid React Element and does not have a toString() method."));
};
export var TableRow = function (_a) {
    var item = _a.item, indices = _a.indices, fields = _a.fields, onClick = _a.onClick, onPress = _a.onPress, hover = _a.hover, hoveredColor = _a.hoveredColor, notHoveredColor = _a.notHoveredColor, horizontalPadding = _a.horizontalPadding, style = _a.style, textStyle = _a.textStyle, selectable = _a.selectable, allSelected = _a.allSelected, selected = _a.selected, setSelected = _a.setSelected, _b = _a.fontSize, fontSize = _b === void 0 ? 14 : _b, widthOffsets = _a.widthOffsets, allowUnselectItemsAfterSelectAll = _a.allowUnselectItemsAfterSelectAll, setAllSelected = _a.setAllSelected, _c = _a.minColumnWidth, minColumnWidth = _c === void 0 ? 75 : _c, _d = _a.rowHeight, rowHeight = _d === void 0 ? ROW_HEIGHT : _d;
    return (_jsx(WithHover, __assign({ hoveredColor: hoveredColor !== null && hoveredColor !== void 0 ? hoveredColor : GRAY, notHoveredColor: notHoveredColor, disabled: !hover, flex: true }, { children: _jsxs(Flex, __assign({ flex: 1, alignItems: "center", onClick: function () { var _a; return (_a = (onClick !== null && onClick !== void 0 ? onClick : onPress)) === null || _a === void 0 ? void 0 : _a(item); }, style: __assign(__assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, minHeight: rowHeight }, style), { backgroundColor: undefined }) }, { children: [selectable && setSelected &&
                    _jsx(Flex, __assign({ style: checkboxStyle }, { children: _jsx(Checkbox, { disabled: allSelected && !allowUnselectItemsAfterSelectAll, checked: allSelected || (selected === null || selected === void 0 ? void 0 : selected.includes(item.id.toString())), onChange: function () {
                                // if allowUnselectItemsAfterSelectAll, checking box should disable all selected
                                if (allSelected) {
                                    setAllSelected === null || setAllSelected === void 0 ? void 0 : setAllSelected(false);
                                }
                                setSelected((selected === null || selected === void 0 ? void 0 : selected.includes(item.id.toString()))
                                    ? selected.filter(function (s) { return s !== item.id.toString(); })
                                    : __spreadArray(__spreadArray([], (selected !== null && selected !== void 0 ? selected : []), true), [item.id.toString()], false));
                            } }) })), _jsx(Flex, __assign({ flex: 1, wrap: "nowrap", style: { overflow: 'hidden' } }, { children: fields.map(function (_a, i) {
                        var key = _a.key, width = _a.width, _b = _a.textAlign, textAlign = _b === void 0 ? 'left' : _b, render = _a.render, hidden = _a.hidden, style = _a.style;
                        return hidden ? null : (_jsx(Flex, __assign({ flex: width !== undefined ? 0 : 1, style: __assign({ alignItems: 'center', marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined, justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start' }, style) }, { children: _jsx(Typography, __assign({ component: "div", style: __assign({ textAlign: textAlign, fontSize: fontSize, width: (typeof width === 'number'
                                        ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                                        : (width !== null && width !== void 0 ? width : defaultWidthForFields(fields.length))), 
                                    // display: flex ? 'flex' : undefined,
                                    // flex: flex ? 1 : undefined,
                                    color: DARKER_GRAY }, textStyle) }, { children: get_display_value(item, key, indices, render, {
                                    adjustedWidth: (typeof width === 'number'
                                        ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                                        : undefined)
                                }) })) }), key));
                    }) }))] })) })));
};
var DEFAULT_PAGE_SIZE = 10;
export var usePagination = function (_a) {
    var _b;
    var _c = _a.paginated, paginated = _c === void 0 ? true : _c, items = _a.items, pageMemoryId = _a.pageMemoryId, _d = _a.pageSize, pageSize = _d === void 0 ? DEFAULT_PAGE_SIZE : _d, applySorting = _a.applySorting, initialPage = _a.initialPage;
    if (pageSize < 1)
        throw new Error("pageSize must be greater than 0");
    if (initialPage && initialPage < 0)
        throw new Error("initialPage must be a positive number");
    var count = items.length;
    var numPages = Math.ceil(count / pageSize);
    var fromMemory = pageMemoryId ? parseInt((_b = read_local_storage(pageMemoryId)) !== null && _b !== void 0 ? _b : '') : undefined;
    var _e = useState(initialPage !== null && initialPage !== void 0 ? initialPage : (typeof fromMemory === 'number' && !isNaN(fromMemory)
        ? fromMemory
        : 0)), selectedPage = _e[0], setSelectedPage = _e[1];
    useEffect(function () {
        if (!pageMemoryId)
            return;
        update_local_storage(pageMemoryId, selectedPage.toString());
    }, [pageMemoryId, selectedPage]);
    var goToPage = useCallback(function (page) {
        setSelectedPage(function (s) { return (s !== page && page <= numPages && page >= 0) ? page : s; });
    }, [numPages]);
    var goToNext = useCallback(function () {
        setSelectedPage(function (s) { return s <= numPages ? s + 1 : s; });
    }, [numPages]);
    var goToPrevious = useCallback(function () {
        setSelectedPage(function (s) { return s > 0 ? s - 1 : s; });
    }, []);
    var mapSelectedItems = useCallback(function (apply) {
        var sorted = applySorting ? applySorting(__spreadArray([], items, true)) : items; // don't need to deep copy if not sorting in place
        if (!paginated)
            return sorted;
        var mapped = [];
        for (var i = selectedPage * pageSize; i < (selectedPage + 1) * pageSize && i < count; i++) {
            mapped.push(apply(sorted[i], { index: i, isLast: i === count - 1 || i === (selectedPage + 1) * pageSize - 1 }));
        }
        return mapped;
    }, [items, applySorting, count, selectedPage, numPages, pageSize]);
    useEffect(function () {
        if (selectedPage >= numPages) {
            goToPage(0);
        }
    }, [goToPage, selectedPage, numPages]);
    return {
        selectedPage: selectedPage,
        numPages: numPages,
        goToNext: goToNext,
        goToPrevious: goToPrevious,
        goToPage: goToPage,
        mapSelectedItems: mapSelectedItems,
        previousDisabled: selectedPage === 0,
        nextDisabled: selectedPage === numPages - 1
    };
};
export var TableFooter = function (_a) {
    var horizontalPadding = _a.horizontalPadding, style = _a.style, previousDisabled = _a.previousDisabled, nextDisabled = _a.nextDisabled, selectedPage = _a.selectedPage, numPages = _a.numPages, goToNext = _a.goToNext, goToPrevious = _a.goToPrevious;
    return (_jsxs(Flex, __assign({ flex: 1, alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, borderTop: BORDER_STYLE }, style) }, { children: [numPages > 1 &&
                _jsxs(_Fragment, { children: [_jsx(LabeledIconButton, { Icon: NavigateBeforeIcon, label: "Previous", placement: "bottom", color: "primary", onClick: goToPrevious, disabled: previousDisabled }), _jsx(LabeledIconButton, { Icon: NavigateNextIcon, label: "Next", placement: "bottom", color: "primary", onClick: goToNext, disabled: nextDisabled })] }), _jsxs(Typography, __assign({ style: { fontSize: 12, marginLeft: 'auto' } }, { children: ["Page ", selectedPage + 1, " of ", numPages] }))] })));
};
// returns diaply numbers, not index
var resolve_middle_page_numbers = function (selectedPage, numPages) {
    if (numPages <= 2)
        return [undefined, undefined, undefined];
    if (numPages === 3)
        return [undefined, 2, undefined];
    if (numPages === 4)
        return [2, 3, undefined];
    if (selectedPage <= 2)
        return [2, 3, 4];
    if (selectedPage >= numPages - 2)
        return [numPages - 3, numPages - 2, numPages - 1];
    return [selectedPage, selectedPage + 1, selectedPage + 2];
};
var FOOTER_BUTTON_SIZE = 30;
export var TableFooterNumbered = function (_a) {
    var showLoadAll = _a.showLoadAll, horizontalPadding = _a.horizontalPadding, loadMore = _a.loadMore, loadMoreOptions = _a.loadMoreOptions, doneLoading = _a.doneLoading, style = _a.style, previousDisabled = _a.previousDisabled, nextDisabled = _a.nextDisabled, selectedPage = _a.selectedPage, numPages = _a.numPages, goToNext = _a.goToNext, goToPrevious = _a.goToPrevious, goToPage = _a.goToPage;
    var _b = resolve_middle_page_numbers(selectedPage, numPages), middleLeft = _b[0], middle = _b[1], middleRight = _b[2];
    var buttonProps = {
        color: "primary",
        variant: "contained",
        style: {
            minHeight: FOOTER_BUTTON_SIZE,
            height: FOOTER_BUTTON_SIZE,
            minWidth: FOOTER_BUTTON_SIZE,
            width: FOOTER_BUTTON_SIZE,
            marginTop: 3,
            marginBottom: 3,
            marginRight: 1,
        }
    };
    useEffect(function () {
        if (!(loadMore && doneLoading))
            return;
        if (doneLoading())
            return;
        if (previousDisabled)
            return; // return if on the first page
        if (!nextDisabled)
            return; // return if not on last page
        loadMore(loadMoreOptions);
    }, [loadMore, nextDisabled, doneLoading, loadMoreOptions]);
    return (_jsx(Flex, __assign({ flex: 1, alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, borderTop: BORDER_STYLE }, style) }, { children: ((doneLoading && !(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading())) || numPages > 1) &&
            _jsxs(_Fragment, { children: [_jsx(Button, __assign({ disabled: previousDisabled }, buttonProps, { onClick: goToPrevious }, { children: _jsx(NavigateBeforeIcon, {}) })), _jsx(Button, __assign({ disabled: previousDisabled }, buttonProps, { onClick: function () { return goToPage(0); } }, { children: "1" })), middleLeft !== undefined &&
                        _jsx(Button, __assign({ disabled: selectedPage === middleLeft - 1 }, buttonProps, { onClick: function () { return goToPage(middleLeft - 1); } }, { children: middleLeft })), middle !== undefined &&
                        _jsx(Button, __assign({ disabled: selectedPage === middle - 1 }, buttonProps, { onClick: function () { return goToPage(middle - 1); } }, { children: middle })), middleRight !== undefined &&
                        _jsx(Button, __assign({ disabled: selectedPage === middleRight - 1 }, buttonProps, { onClick: function () { return goToPage(middleRight - 1); } }, { children: middleRight })), numPages !== 1 &&
                        _jsx(Button, __assign({ disabled: nextDisabled }, buttonProps, { onClick: function () { return goToPage(numPages - 1); } }, { children: numPages })), _jsx(Button, __assign({ disabled: nextDisabled }, buttonProps, { onClick: goToNext }, { children: _jsx(NavigateNextIcon, {}) })), showLoadAll &&
                        _jsx(LoadingButton, { variant: "outlined", submitText: "Load All", submittingText: "Loading...", style: { width: 175, height: 32, marginLeft: 5 }, disabled: doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading(), onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading())) return [3 /*break*/, 2];
                                            return [4 /*yield*/, (loadMore === null || loadMore === void 0 ? void 0 : loadMore(loadMoreOptions))];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 0];
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); } }), _jsxs(Typography, __assign({ style: { fontSize: 12, marginLeft: 'auto' } }, { children: ["Page ", selectedPage + 1, " of ", numPages] }))] }) })));
};
var BORDER_STYLE = "1px solid ".concat(GRAY);
export var Table = function (_a) {
    var items = _a.items, emptyText = _a.emptyText, titleComponentHeight = _a.titleComponentHeight, emptyComponent = _a.emptyComponent, noPaper = _a.noPaper, _b = _a.pageOptions, pageOptions = _b === void 0 ? { paginated: true } : _b, _c = _a.style, style = _c === void 0 ? {} : _c, _d = _a.horizontalPadding, horizontalPadding = _d === void 0 ? 20 : _d, _e = _a.elevation, elevation = _e === void 0 ? 5 : _e, headerFontSize = _a.headerFontSize, rowFontSize = _a.rowFontSize, onClick = _a.onClick, onPress = _a.onPress, loadMore = _a.loadMore, doneLoading = _a.doneLoading, loadMoreOptions = _a.loadMoreOptions, 
    // onClearFilter,
    _filterCounts = _a.filterCounts, title = _a.title, titleStyle = _a.titleStyle, titleActionsComponent = _a.titleActionsComponent, 
    // description,
    _f = _a.TitleComponent, 
    // description,
    TitleComponent = _f === void 0 ? TableTitle : _f, renderTitleComponent = _a.renderTitleComponent, fields = _a.fields, _g = _a.HeaderComponent, HeaderComponent = _g === void 0 ? TableHeader : _g, headerHeight = _a.headerHeight, hover = _a.hover, hoveredColor = _a.hoveredColor, _h = _a.RowComponent, RowComponent = _h === void 0 ? TableRow : _h, _j = _a.footerStyle, footerStyle = _j === void 0 ? 'numbered' : _j, _k = _a.FooterComponent, FooterComponent = _k === void 0 ? footerStyle === 'numbered' ? TableFooterNumbered : TableFooter : _k, rowHeight = _a.rowHeight, selectable = _a.selectable, selected = _a.selected, setSelected = _a.setSelected, allSelected = _a.allSelected, setAllSelected = _a.setAllSelected, allowUnselectItemsAfterSelectAll = _a.allowUnselectItemsAfterSelectAll, noWrap = _a.noWrap, maxWidth = _a.maxWidth, maxRowsHeight = _a.maxRowsHeight, memoryId = _a.memoryId, _paginated = _a.paginated, onReorder = _a.onReorder, virtualization = _a.virtualization, onExport = _a.onExport, sort = _a.sort, refreshFilterSuggestionsKey = _a.refreshFilterSuggestionsKey, minColumnWidth = _a.minColumnWidth, columnResizeZIndex = _a.columnResizeZIndex, onChangeColumnSorting = _a.onChangeColumnSorting;
    var sortingStorageKey = (memoryId !== null && memoryId !== void 0 ? memoryId : '') + 'sorting';
    var cachedSortString = read_local_storage(sortingStorageKey);
    var localFilterStorageKey = (memoryId !== null && memoryId !== void 0 ? memoryId : '') + 'localfilter';
    var cachedLocalFilterString = read_local_storage(localFilterStorageKey);
    var loadedFilter = [];
    try {
        loadedFilter = JSON.parse(cachedLocalFilterString);
    }
    catch (err) { }
    var keyString = fields.map(function (f) { return f.key; }).join('');
    var _l = useState(fields.map(function (_, i) {
        var _a, _b;
        return ({
            query: ((_a = loadedFilter[i]) === null || _a === void 0 ? void 0 : _a.query) || '',
            values: ((_b = loadedFilter[i]) === null || _b === void 0 ? void 0 : _b.values) || [],
        });
    })), localFilters = _l[0], setLocalFilters = _l[1];
    // keep cached in local storage
    useEffect(function () { return update_local_storage(localFilterStorageKey, JSON.stringify(localFilters)); }, [localFilterStorageKey, localFilters]);
    // reset when changing view
    useEffect(function () {
        var updated = (fields.map(function (_, i) {
            var _a, _b;
            return ({
                query: ((_a = loadedFilter[i]) === null || _a === void 0 ? void 0 : _a.query) || '',
                values: ((_b = loadedFilter[i]) === null || _b === void 0 ? void 0 : _b.values) || [],
            });
        }));
        setLocalFilters(updated);
    }, [keyString]);
    var _m = useState({}), widthOffsets = _m[0], setWidthOffsets = _m[1];
    if (memoryId) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var key = fields_1[_i].key;
            widthOffsets[key] = (parseInt(read_local_storage("".concat(memoryId !== null && memoryId !== void 0 ? memoryId : '').concat(key, "width"))) || 0);
        }
    }
    var loadedSorting;
    try {
        loadedSorting = JSON.parse(cachedSortString);
    }
    catch (err) { }
    var _o = useState(Array.isArray(loadedSorting)
        ? loadedSorting
        : []), sorting = _o[0], setSorting = _o[1];
    useEffect(function () {
        onChangeColumnSorting === null || onChangeColumnSorting === void 0 ? void 0 : onChangeColumnSorting(sorting);
        if (!memoryId)
            return;
        update_local_storage(sortingStorageKey, JSON.stringify(sorting));
    }, [sorting, memoryId, onChangeColumnSorting]);
    // sorts in place
    var applySorting = useCallback(function (items) {
        if (items.find(function (i) { return typeof i.index === 'number'; })) {
            items.sort(function (item1, item2) {
                var _a, _b;
                return (
                // default to -1 so that new elements without index appear at the start
                ((_a = item1.index) !== null && _a !== void 0 ? _a : -1) - ((_b = item2.index) !== null && _b !== void 0 ? _b : -1));
            });
        }
        var _loop_1 = function (s) {
            items.sort(function (itemA, itemB) {
                var _a, _b;
                try {
                    var field = fields.find(function (f) { return f.label === s.field; });
                    var a = itemA[s.field] || ((_a = field === null || field === void 0 ? void 0 : field.getSortValue) === null || _a === void 0 ? void 0 : _a.call(field, itemA));
                    var b = itemB[s.field] || ((_b = field === null || field === void 0 ? void 0 : field.getSortValue) === null || _b === void 0 ? void 0 : _b.call(field, itemB));
                    var comparison = ((s.type === 'number' && typeof a === 'number' && typeof b === 'number')
                        ? a - b
                        : (s.type === 'string' && typeof a === 'string' && typeof b === 'string')
                            ? a.localeCompare(b)
                            : (s.type === 'date'
                                && (typeof a === 'string' || typeof a === 'number')
                                && (typeof b === 'string' || typeof b === 'number'))
                                ? new Date(a).getTime() - new Date(b).getTime()
                                : 0);
                    return comparison * (s.ascending ? 1 : -1);
                }
                catch (err) {
                    return 0;
                }
            });
        };
        for (var _i = 0, _a = (sort || []); _i < _a.length; _i++) {
            var s = _a[_i];
            _loop_1(s);
        }
        var _loop_2 = function (s) {
            items.sort(function (itemA, itemB) {
                var field = fields.find(function (f) { return f.label === s.field; });
                if (!(field === null || field === void 0 ? void 0 : field.getSortValue))
                    return 0;
                var a = field.getSortValue(itemA);
                var b = field.getSortValue(itemB);
                var comparison = ((typeof a === 'number' && typeof b === 'number')
                    ? a - b
                    : (typeof a === 'string' && typeof b === 'string')
                        ? a.localeCompare(b)
                        : 0);
                return comparison * (s.direction === 'descending' ? -1 : 1);
            });
        };
        for (var _b = 0, sorting_1 = sorting; _b < sorting_1.length; _b++) {
            var s = sorting_1[_b];
            _loop_2(s);
        }
        return items;
    }, [sorting, fields, sort]);
    var paginated = _paginated !== null && _paginated !== void 0 ? _paginated : pageOptions.paginated !== false; // default to true
    var paginationProps = __rest(usePagination(__assign(__assign({ items: items }, pageOptions), { applySorting: ((sort === null || sort === void 0 ? void 0 : sort.length) || sorting.length || onReorder) ? applySorting : undefined // don't sort when sorting is empty, way more efficient with time/memory
     })), []);
    RowComponent = RowComponent !== null && RowComponent !== void 0 ? RowComponent : TableRow; // don't allow to be undefined 
    var sorted = useMemo(function () { return paginationProps.mapSelectedItems(function (i) { return i; }); }, [paginationProps.mapSelectedItems]);
    var filtered = useMemo(function () {
        if (!localFilters.find(function (f) { var _a; return (f === null || f === void 0 ? void 0 : f.query) || ((_a = f === null || f === void 0 ? void 0 : f.values) === null || _a === void 0 ? void 0 : _a.length); }))
            return sorted;
        if (!fields.find(function (f) { return f.getSortValue; }))
            return sorted;
        return sorted.filter(function (v) {
            var _a;
            var _loop_3 = function (i) {
                var _b = fields[i], getFilterValue = _b.getFilterValue, filterType = _b.filterType;
                if (!getFilterValue)
                    return "continue";
                var _c = (_a = localFilters[i]) !== null && _a !== void 0 ? _a : {}, query = _c.query, values = _c.values, valuesQualifier = _c.valuesQualifier;
                if (filterType === 'multi') {
                    if (!(values === null || values === void 0 ? void 0 : values.length))
                        return "continue";
                    var filterValueOrValues = getFilterValue(v);
                    var filterValues_1 = Array.isArray(filterValueOrValues) ? filterValueOrValues : [filterValueOrValues];
                    if (valuesQualifier === 'All Of') {
                        return { value: values.every(function (v) { return filterValues_1.includes(v); }) };
                    }
                    if (!filterValues_1.find(function (v) { return values.includes(v); })) {
                        return { value: false };
                    }
                }
                else {
                    if (!query)
                        return "continue";
                    var filterValueOrValues = getFilterValue(v);
                    var filterValues = Array.isArray(filterValueOrValues) ? filterValueOrValues : [filterValueOrValues];
                    if (!filterValues.find(function (v) { return v === query; })) {
                        return { value: false };
                    }
                }
            };
            for (var i = 0; i < fields.length; i++) {
                var state_1 = _loop_3(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return true;
        });
    }, [sorted, localFilters, fields]);
    // make sure filterCounts incorporates column filters whose state is in Table, not parent component
    var filterCounts = (_filterCounts && !paginated) ? __assign(__assign({}, _filterCounts), { filtered: filtered.length }) : undefined;
    var headerFilterIsActive = (!!(fields.find(function (f) { return f.filterIsActive; }) || localFilters.find(function (f) { return f === null || f === void 0 ? void 0 : f.query; })));
    var draggable = (onReorder && sorting.length === 0);
    var ListComponent = useMemo(function () { return (draggable
        ? DraggableList
        : ScrollingList); }, [draggable]);
    // don't use filtered values, otherwise reduces suggestions to only those remaining
    var filterSuggestions = useMemo(function () {
        var suggestions = {};
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var _a = fields_2[_i], key = _a.key, getFilterValue = _a.getFilterValue, _b = _a.filterSuggestions, filterSuggestions_1 = _b === void 0 ? [] : _b;
            if (!getFilterValue) {
                suggestions[key.toString()] = [];
                continue;
            }
            suggestions[key.toString()] = Array.from(new Set(__spreadArray(__spreadArray([], filterSuggestions_1, true), sorted.flatMap(getFilterValue), true)));
        }
        return suggestions;
    }, [sorted, keyString, refreshFilterSuggestionsKey]);
    var table = (_jsxs(Flex, __assign({ column: true }, { children: [title && TitleComponent && !renderTitleComponent && (_jsx(TitleComponent, { title: title, actionsComponent: titleActionsComponent, 
                // description={description} 
                horizontalPadding: noPaper ? 0 : horizontalPadding, style: __assign({ maxWidth: maxWidth }, titleStyle) })), title && renderTitleComponent && (renderTitleComponent({
                title: title,
                actionsComponent: titleActionsComponent,
                horizontalPadding: noPaper ? 0 : horizontalPadding,
                style: __assign({ maxWidth: maxWidth }, titleStyle)
            })), filterCounts && filterCounts.total !== filterCounts.filtered &&
                _jsxs(Typography, __assign({ style: {
                        fontSize: 14, color: PRIMARY_HEX,
                        textAlign: 'center', textDecoration: 'underline',
                    } }, { children: ["Showing ", filterCounts.filtered, " of ", filterCounts.total, " loaded records due to filters"] })), _jsx(ListComponent, { items: filtered, onReorder: onReorder, noWrap: noWrap, maxHeight: maxRowsHeight, maxWidth: maxWidth, virtualization: virtualization, header: fields && HeaderComponent && fields.length > 0 && (items.length > 0 || headerFilterIsActive) && (_jsx(HeaderComponent, { selectable: selectable, allSelected: allSelected, allowUnselectItemsAfterSelectAll: allowUnselectItemsAfterSelectAll, headerHeight: headerHeight, setAllSelected: function (v) {
                        setAllSelected === null || setAllSelected === void 0 ? void 0 : setAllSelected(v);
                        if (v) {
                            setSelected === null || setSelected === void 0 ? void 0 : setSelected(filtered.map(function (v) { return v.id.toString(); }));
                        }
                        else {
                            setSelected === null || setSelected === void 0 ? void 0 : setSelected([]);
                        }
                    }, fields: fields, horizontalPadding: horizontalPadding, fontSize: headerFontSize, widthOffsets: widthOffsets, setWidthOffsets: setWidthOffsets, sorting: sorting, setSorting: setSorting, localFilters: localFilters, setLocalFilters: setLocalFilters, memoryId: memoryId, filterSuggestions: filterSuggestions, style: {
                        flexWrap: noWrap ? 'nowrap' : undefined,
                        paddingLeft: draggable ? '42px' : horizontalPadding,
                    }, onExport: onExport ? function () {
                        onExport({
                            // use items, not sorted, as sorted only includes first page when paginated
                            data: (paginated ? items : filtered).map(function (s) { return fields.map(function (f) { var _a; return ((_a = f.getExportData) === null || _a === void 0 ? void 0 : _a.call(f, s)) || ''; }); }),
                            labels: fields.map(function (f) { return f.label; })
                        });
                    }
                        : undefined, minColumnWidth: minColumnWidth, columnResizeZIndex: columnResizeZIndex })), 
                // handle load when scroll to bottom, when table not paginated
                doneLoading: !paginated ? doneLoading : undefined, loadMore: !paginated ? loadMore : undefined, loadMoreOptions: loadMoreOptions, 
                // renderProps={{ horizontalPadding }}
                emptyText: emptyComponent !== null && emptyComponent !== void 0 ? emptyComponent : ((emptyText || headerFilterIsActive)
                    ? (_jsxs(_Fragment, { children: [_jsx(Typography, __assign({ style: { padding: horizontalPadding } }, { children: emptyText || 'No results found the current filter' })), loadMore && !(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) &&
                                _jsx("div", __assign({ style: { paddingLeft: horizontalPadding, paddingBottom: horizontalPadding } }, { children: _jsx(LoadingButton, { submitText: "Load Older Data", submittingText: "Loading...", onClick: loadMore, variant: "outlined", style: { width: 200, textAlign: 'center', marginTop: 10 } }) }))] }))
                    : undefined), Item: function (_a) {
                    var _b;
                    var item = _a.item, index = _a.index;
                    return ( // index within this list, e.g. a single page
                    _jsx(RowComponent, { widthOffsets: widthOffsets, rowHeight: rowHeight, selectable: selectable, selected: selected, setSelected: setSelected, allSelected: allSelected, setAllSelected: setAllSelected, allowUnselectItemsAfterSelectAll: allowUnselectItemsAfterSelectAll, item: item, indices: {
                            // selectedPage indexed by zero
                            index: index + paginationProps.selectedPage * ((_b = pageOptions.pageSize) !== null && _b !== void 0 ? _b : DEFAULT_PAGE_SIZE),
                            indexOfPage: index
                        }, fields: fields, hover: hover, hoveredColor: hoveredColor, fontSize: rowFontSize, horizontalPadding: horizontalPadding, style: {
                            flexWrap: noWrap ? 'nowrap' : undefined,
                            borderBottom: ((index < items.length - 1 || !paginated) &&
                                (pageOptions.pageSize === undefined || index < pageOptions.pageSize - 1))
                                ? BORDER_STYLE
                                : undefined,
                        }, onClick: onClick, onPress: onPress, minColumnWidth: minColumnWidth }, item.id));
                } }), paginated && FooterComponent && items.length > 0 && // avoid displaying footer / unnecessary border when no items
                _jsx(FooterComponent, __assign({ showLoadAll: pageOptions.showLoadAll, doneLoading: doneLoading, loadMore: loadMore, loadMoreOptions: loadMoreOptions }, paginationProps, pageOptions, { horizontalPadding: horizontalPadding }))] })));
    if (noPaper)
        return table;
    return (_jsx(Paper, __assign({ style: style, elevation: elevation }, { children: table })));
};
//# sourceMappingURL=table.js.map