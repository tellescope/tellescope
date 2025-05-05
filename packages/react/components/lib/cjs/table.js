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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.TableFooterNumbered = exports.TableFooter = exports.usePagination = exports.TableRow = exports.TableHeader = exports.TableTitle = exports.GRAY = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var mui_1 = require("./mui");
var controls_1 = require("./controls");
var layout_1 = require("./layout");
var utilities_1 = require("@tellescope/utilities");
var react_draggable_1 = __importDefault(require("react-draggable")); // The default
var constants_1 = require("@tellescope/constants");
var CloudDownload_1 = __importDefault(require("@mui/icons-material/CloudDownload"));
var material_1 = require("@mui/material");
var forms_1 = require("./forms");
// import DragHandleIcon from '@mui/icons-material/DragHandle';
var LIGHT_GRAY = "#fafafa";
exports.GRAY = "#EFEFEF";
var DARK_GRAY = "#E8E8E8";
var DARKER_GRAY = "#52575C";
var ROW_HEIGHT = 45;
var TableTitle = function (_a) {
    var title = _a.title, description = _a.description, actionsComponent = _a.actionsComponent, style = _a.style, _b = _a.textStyle, textStyle = _b === void 0 ? {} : _b, horizontalPadding = _a.horizontalPadding;
    return ((0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "space-between", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, backgroundColor: LIGHT_GRAY, minHeight: 50, paddingTop: 0 }, style) }, { children: [typeof title === 'string'
                ? ((0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ component: "h3", style: __assign({ fontWeight: 600, fontSize: 18, marginRight: horizontalPadding }, textStyle) }, { children: title })))
                : (0, jsx_runtime_1.jsx)(layout_1.Flex, { children: title }), (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "flex-end" }, { children: actionsComponent }))] })));
};
exports.TableTitle = TableTitle;
var defaultWidthForFields = function (n) { return n <= 0 ? '100%' : "".concat(Math.floor(100 / n), "%"); };
var checkboxStyle = {
    position: 'relative',
    right: '10px',
};
var COLUMN_RESIZE_HANDLE_WIDTH = 3;
var TableHeader = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var fields = _a.fields, sorting = _a.sorting, setSorting = _a.setSorting, selectable = _a.selectable, allSelected = _a.allSelected, setAllSelected = _a.setAllSelected, style = _a.style, textStyle = _a.textStyle, horizontalPadding = _a.horizontalPadding, _o = _a.fontSize, fontSize = _o === void 0 ? 15 : _o, memoryId = _a.memoryId, widthOffsets = _a.widthOffsets, setWidthOffsets = _a.setWidthOffsets, onExport = _a.onExport, localFilters = _a.localFilters, setLocalFilters = _a.setLocalFilters, filterSuggestions = _a.filterSuggestions, _p = _a.minColumnWidth, minColumnWidth = _p === void 0 ? 75 : _p, _q = _a.columnResizeZIndex, columnResizeZIndex = _q === void 0 ? 1000 : _q, _r = _a.headerHeight, headerHeight = _r === void 0 ? ROW_HEIGHT : _r;
    var _s = (0, react_1.useState)(-1), openFilter = _s[0], setOpenFilter = _s[1];
    var _t = (0, react_1.useState)(0), startX = _t[0], setStartX = _t[1];
    var _u = (0, react_1.useState)(), dragPosition = _u[0], setDragPosition = _u[1];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(mui_1.Modal, __assign({ open: openFilter !== -1, setOpen: function (o) { return !o && setOpenFilter(-1); } }, { children: ((_b = fields[openFilter]) === null || _b === void 0 ? void 0 : _b.filterComponent)
                    || ((0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, justifyContent: "center" }, { children: ((_c = fields[openFilter]) === null || _c === void 0 ? void 0 : _c.filterType) === 'multi'
                            ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Autocomplete, { disableClearable: true, disablePortal: true, size: 'small', options: ['One Of', 'All Of'], sx: { width: 140, mr: 0.5 }, onChange: function (e, value) {
                                            setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? __assign(__assign({}, f), { valuesQualifier: value === 'All Of' ? 'All Of' : 'One Of' }) : f; }); });
                                        }, value: ((_d = localFilters[openFilter]) === null || _d === void 0 ? void 0 : _d.valuesQualifier) === 'All Of' ? 'All Of' : 'One Of', renderInput: function (params) {
                                            var _a;
                                            return (0, jsx_runtime_1.jsx)(mui_1.TextField, __assign({}, params, { fullWidth: true, autoFocus: true, label: "Qualifier", size: 'small', value: ((_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.valuesQualifier) === 'All Of' ? 'All Of' : 'One Of' }));
                                        } }), (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { size: 'small', disablePortal: true, multiple: true, options: ((filterSuggestions === null || filterSuggestions === void 0 ? void 0 : filterSuggestions[(_f = (_e = fields[openFilter]) === null || _e === void 0 ? void 0 : _e.key) === null || _f === void 0 ? void 0 : _f.toString()]) || []).sort(), freeSolo: true, autoSelect // allow any input and select it on change
                                        : true, onChange: function (e, values) {
                                            if (values === void 0) { values = []; }
                                            setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? { query: '', values: values } : f; }); });
                                        }, value: (_h = (_g = localFilters[openFilter]) === null || _g === void 0 ? void 0 : _g.values) !== null && _h !== void 0 ? _h : [], renderInput: function (params) {
                                            var _a, _b;
                                            return (0, jsx_runtime_1.jsx)(mui_1.TextField, __assign({}, params, { autoFocus: true, label: "Filter by", size: 'small', style: { width: 400 }, value: (_b = (_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.query) !== null && _b !== void 0 ? _b : '' }));
                                        } })] })) : ((0, jsx_runtime_1.jsx)(material_1.Autocomplete, { size: 'small', disablePortal: true, options: ((filterSuggestions === null || filterSuggestions === void 0 ? void 0 : filterSuggestions[(_k = (_j = fields[openFilter]) === null || _j === void 0 ? void 0 : _j.key) === null || _k === void 0 ? void 0 : _k.toString()]) || []).sort(), freeSolo: true, autoSelect // allow any input and select it on change
                            : true, onChange: function (e, _query) {
                                var query = _query || '';
                                setLocalFilters(function (fs) { return fs.map(function (f, i) { return i === openFilter ? { query: query } : f; }); });
                            }, value: (_m = (_l = localFilters[openFilter]) === null || _l === void 0 ? void 0 : _l.query) !== null && _m !== void 0 ? _m : '', renderInput: function (params) {
                                var _a, _b;
                                return (0, jsx_runtime_1.jsx)(mui_1.TextField, __assign({}, params, { autoFocus: true, label: "Filter", size: 'small', style: { width: 400 }, value: (_b = (_a = localFilters[openFilter]) === null || _a === void 0 ? void 0 : _a.query) !== null && _b !== void 0 ? _b : '' }));
                            } })) }))) })), (0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, minHeight: headerHeight, backgroundColor: DARK_GRAY }, style) }, { children: [selectable &&
                        (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ style: checkboxStyle }, { children: setAllSelected ? (0, jsx_runtime_1.jsx)(mui_1.Checkbox, { checked: allSelected, onChange: setAllSelected }) : (0, jsx_runtime_1.jsx)(layout_1.Flex, { style: { width: 42 } }) })), (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, wrap: "nowrap" }, { children: fields.map(function (_a, i) {
                            var _b, _c, _d, _e, _f, _g;
                            var key = _a.key, label = _a.label, textAlign = _a.textAlign, width = _a.width, getSortValue = _a.getSortValue, hidden = _a.hidden, style = _a.style, filterIsActive = _a.filterIsActive, filterComponent = _a.filterComponent, allowWidthAdjustment = _a.allowWidthAdjustment, getFilterValue = _a.getFilterValue;
                            if (hidden)
                                return null;
                            var sort = sorting.find(function (s) { return s.field === label; });
                            return ((0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ wrap: "nowrap", flex: width !== undefined ? 0 : 1, style: __assign({ alignItems: 'center', marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined, justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start' }, style) }, { children: [(0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ wrap: "nowrap", style: {
                                            textAlign: textAlign,
                                            justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start',
                                            width: (typeof width === 'number'
                                                ? Math.max(minColumnWidth, width + (widthOffsets[key] || 0))
                                                : (width !== null && width !== void 0 ? width : defaultWidthForFields(fields.length))),
                                            alignItems: 'center',
                                        } }, { children: [(0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ component: "h5", noWrap: true, style: __assign({ fontWeight: 600, fontSize: fontSize }, textStyle) }, { children: label })), (0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ wrap: "nowrap" }, { children: [getSortValue && ((sort === null || sort === void 0 ? void 0 : sort.direction) === 'ascending'
                                                        ? (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { size: 22, Icon: mui_1.SortAscendingIcon, color: "primary", label: "Click to Sort Descending", onClick: function () { return setSorting(function (sorting) { return sorting.map(function (s) { return s.field !== label ? s : __assign(__assign({}, s), { direction: 'descending' }); }); }); } })
                                                        : (sort === null || sort === void 0 ? void 0 : sort.direction) === 'descending'
                                                            ? (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { size: 22, Icon: mui_1.SortDescendingIcon, color: "primary", label: "Click to Disable Sort", onClick: function () { return setSorting(function (sorting) { return sorting.filter(function (s) { return s.field !== label; }); }); } })
                                                            : (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { size: 22, Icon: mui_1.SortInactiveIcon, color: "inherit", label: "Click to Sort Ascending", onClick: function () { return setSorting(function (sorting) { return __spreadArray(__spreadArray([], sorting, true), [{
                                                                        field: label,
                                                                        direction: 'ascending'
                                                                    }], false); }); } })), filterComponent && ((0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { size: 22, offsetX: getSortValue ? -7 : -4, label: "Filter", disabled: openFilter !== -1, color: filterIsActive ? "primary" : 'inherit', Icon: filterIsActive ? mui_1.FilterActiveIcon : mui_1.FilterIcon, onClick: function () { return setOpenFilter(i); } })), !filterComponent && getFilterValue &&
                                                        (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { size: 22, offsetX: getSortValue ? -7 : -4, label: "Filter", disabled: openFilter !== -1, color: (((_b = localFilters[i]) === null || _b === void 0 ? void 0 : _b.query) || !!((_d = (_c = localFilters === null || localFilters === void 0 ? void 0 : localFilters[i]) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.length)) ? "primary" : 'inherit', Icon: (((_e = localFilters[i]) === null || _e === void 0 ? void 0 : _e.query) || !!((_g = (_f = localFilters === null || localFilters === void 0 ? void 0 : localFilters[i]) === null || _f === void 0 ? void 0 : _f.values) === null || _g === void 0 ? void 0 : _g.length)) ? mui_1.FilterActiveIcon : mui_1.FilterIcon, onClick: function () { return setOpenFilter(i); } })] }))] })), allowWidthAdjustment && memoryId &&
                                        (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, justifyContent: "flex-end" }, { children: (0, jsx_runtime_1.jsx)(react_draggable_1.default, __assign({ axis: "x", position: dragPosition, onStart: function (e, data) {
                                                    setDragPosition(undefined);
                                                    setStartX(data.lastX - (widthOffsets[key] || 0));
                                                }, onStop: function (e, data) {
                                                    setWidthOffsets(function (o) {
                                                        var _a;
                                                        var increment = Math.max(
                                                        // 0,
                                                        (data.lastX - startX) / 1);
                                                        (0, utilities_1.update_local_storage)("".concat(memoryId).concat(key, "width"), increment.toString());
                                                        return __assign(__assign({}, o), (_a = {}, _a[key] = increment, _a));
                                                    });
                                                    setDragPosition({ x: 0, y: 0 }); // snaps back to appropriate spot
                                                } }, { children: (0, jsx_runtime_1.jsx)("div", { style: {
                                                        width: COLUMN_RESIZE_HANDLE_WIDTH, marginLeft: -COLUMN_RESIZE_HANDLE_WIDTH,
                                                        height: '30px',
                                                        backgroundColor: '#22222266',
                                                        cursor: 'col-resize',
                                                        zIndex: columnResizeZIndex,
                                                        position: 'relative', right: '6px',
                                                    } }) })) }))] }), key));
                        }) })), onExport &&
                        (0, jsx_runtime_1.jsx)(layout_1.Flex, { children: (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { Icon: CloudDownload_1.default, label: "Export Data", onClick: onExport }) })] }))] }));
};
exports.TableHeader = TableHeader;
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
    if (react_1.default.isValidElement(value)) {
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
var TableRow = function (_a) {
    var item = _a.item, indices = _a.indices, fields = _a.fields, onClick = _a.onClick, onPress = _a.onPress, hover = _a.hover, hoveredColor = _a.hoveredColor, notHoveredColor = _a.notHoveredColor, horizontalPadding = _a.horizontalPadding, style = _a.style, textStyle = _a.textStyle, selectable = _a.selectable, allSelected = _a.allSelected, selected = _a.selected, setSelected = _a.setSelected, _b = _a.fontSize, fontSize = _b === void 0 ? 14 : _b, widthOffsets = _a.widthOffsets, allowUnselectItemsAfterSelectAll = _a.allowUnselectItemsAfterSelectAll, setAllSelected = _a.setAllSelected, _c = _a.minColumnWidth, minColumnWidth = _c === void 0 ? 75 : _c, _d = _a.rowHeight, rowHeight = _d === void 0 ? ROW_HEIGHT : _d;
    return ((0, jsx_runtime_1.jsx)(layout_1.WithHover, __assign({ hoveredColor: hoveredColor !== null && hoveredColor !== void 0 ? hoveredColor : exports.GRAY, notHoveredColor: notHoveredColor, disabled: !hover, flex: true }, { children: (0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ flex: 1, alignItems: "center", onClick: function () { var _a; return (_a = (onClick !== null && onClick !== void 0 ? onClick : onPress)) === null || _a === void 0 ? void 0 : _a(item); }, style: __assign(__assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, minHeight: rowHeight }, style), { backgroundColor: undefined }) }, { children: [selectable && setSelected &&
                    (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ style: checkboxStyle }, { children: (0, jsx_runtime_1.jsx)(mui_1.Checkbox, { disabled: allSelected && !allowUnselectItemsAfterSelectAll, checked: allSelected || (selected === null || selected === void 0 ? void 0 : selected.includes(item.id.toString())), onChange: function () {
                                // if allowUnselectItemsAfterSelectAll, checking box should disable all selected
                                if (allSelected) {
                                    setAllSelected === null || setAllSelected === void 0 ? void 0 : setAllSelected(false);
                                }
                                setSelected((selected === null || selected === void 0 ? void 0 : selected.includes(item.id.toString()))
                                    ? selected.filter(function (s) { return s !== item.id.toString(); })
                                    : __spreadArray(__spreadArray([], (selected !== null && selected !== void 0 ? selected : []), true), [item.id.toString()], false));
                            } }) })), (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, wrap: "nowrap", style: { overflow: 'hidden' } }, { children: fields.map(function (_a, i) {
                        var key = _a.key, width = _a.width, _b = _a.textAlign, textAlign = _b === void 0 ? 'left' : _b, render = _a.render, hidden = _a.hidden, style = _a.style;
                        return hidden ? null : ((0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: width !== undefined ? 0 : 1, style: __assign({ alignItems: 'center', marginLeft: i === fields.length - 1 && textAlign === 'right' ? 'auto' : undefined, justifyContent: textAlign === 'right' ? 'flex-end' : 'flex-start' }, style) }, { children: (0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ component: "div", style: __assign({ textAlign: textAlign, fontSize: fontSize, width: (typeof width === 'number'
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
exports.TableRow = TableRow;
var DEFAULT_PAGE_SIZE = 10;
var usePagination = function (_a) {
    var _b;
    var _c = _a.paginated, paginated = _c === void 0 ? true : _c, items = _a.items, pageMemoryId = _a.pageMemoryId, _d = _a.pageSize, pageSize = _d === void 0 ? DEFAULT_PAGE_SIZE : _d, applySorting = _a.applySorting, initialPage = _a.initialPage;
    if (pageSize < 1)
        throw new Error("pageSize must be greater than 0");
    if (initialPage && initialPage < 0)
        throw new Error("initialPage must be a positive number");
    var count = items.length;
    var numPages = Math.ceil(count / pageSize);
    var fromMemory = pageMemoryId ? parseInt((_b = (0, utilities_1.read_local_storage)(pageMemoryId)) !== null && _b !== void 0 ? _b : '') : undefined;
    var _e = (0, react_1.useState)(initialPage !== null && initialPage !== void 0 ? initialPage : (typeof fromMemory === 'number' && !isNaN(fromMemory)
        ? fromMemory
        : 0)), selectedPage = _e[0], setSelectedPage = _e[1];
    (0, react_1.useEffect)(function () {
        if (!pageMemoryId)
            return;
        (0, utilities_1.update_local_storage)(pageMemoryId, selectedPage.toString());
    }, [pageMemoryId, selectedPage]);
    var goToPage = (0, react_1.useCallback)(function (page) {
        setSelectedPage(function (s) { return (s !== page && page <= numPages && page >= 0) ? page : s; });
    }, [numPages]);
    var goToNext = (0, react_1.useCallback)(function () {
        setSelectedPage(function (s) { return s <= numPages ? s + 1 : s; });
    }, [numPages]);
    var goToPrevious = (0, react_1.useCallback)(function () {
        setSelectedPage(function (s) { return s > 0 ? s - 1 : s; });
    }, []);
    var mapSelectedItems = (0, react_1.useCallback)(function (apply) {
        var sorted = applySorting ? applySorting(__spreadArray([], items, true)) : items; // don't need to deep copy if not sorting in place
        if (!paginated)
            return sorted;
        var mapped = [];
        for (var i = selectedPage * pageSize; i < (selectedPage + 1) * pageSize && i < count; i++) {
            mapped.push(apply(sorted[i], { index: i, isLast: i === count - 1 || i === (selectedPage + 1) * pageSize - 1 }));
        }
        return mapped;
    }, [items, applySorting, count, selectedPage, numPages, pageSize]);
    (0, react_1.useEffect)(function () {
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
exports.usePagination = usePagination;
var TableFooter = function (_a) {
    var horizontalPadding = _a.horizontalPadding, style = _a.style, previousDisabled = _a.previousDisabled, nextDisabled = _a.nextDisabled, selectedPage = _a.selectedPage, numPages = _a.numPages, goToNext = _a.goToNext, goToPrevious = _a.goToPrevious;
    return ((0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ flex: 1, alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, borderTop: BORDER_STYLE }, style) }, { children: [numPages > 1 &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { Icon: mui_1.NavigateBeforeIcon, label: "Previous", placement: "bottom", color: "primary", onClick: goToPrevious, disabled: previousDisabled }), (0, jsx_runtime_1.jsx)(controls_1.LabeledIconButton, { Icon: mui_1.NavigateNextIcon, label: "Next", placement: "bottom", color: "primary", onClick: goToNext, disabled: nextDisabled })] }), (0, jsx_runtime_1.jsxs)(mui_1.Typography, __assign({ style: { fontSize: 12, marginLeft: 'auto' } }, { children: ["Page ", selectedPage + 1, " of ", numPages] }))] })));
};
exports.TableFooter = TableFooter;
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
var TableFooterNumbered = function (_a) {
    var horizontalPadding = _a.horizontalPadding, loadMore = _a.loadMore, loadMoreOptions = _a.loadMoreOptions, doneLoading = _a.doneLoading, style = _a.style, previousDisabled = _a.previousDisabled, nextDisabled = _a.nextDisabled, selectedPage = _a.selectedPage, numPages = _a.numPages, goToNext = _a.goToNext, goToPrevious = _a.goToPrevious, goToPage = _a.goToPage;
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
    (0, react_1.useEffect)(function () {
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
    return ((0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ flex: 1, alignItems: "center", style: __assign({ paddingLeft: horizontalPadding, paddingRight: horizontalPadding, borderTop: BORDER_STYLE }, style) }, { children: ((doneLoading && !(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading())) || numPages > 1) &&
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: previousDisabled }, buttonProps, { onClick: goToPrevious }, { children: (0, jsx_runtime_1.jsx)(mui_1.NavigateBeforeIcon, {}) })), (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: previousDisabled }, buttonProps, { onClick: function () { return goToPage(0); } }, { children: "1" })), middleLeft !== undefined &&
                        (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: selectedPage === middleLeft - 1 }, buttonProps, { onClick: function () { return goToPage(middleLeft - 1); } }, { children: middleLeft })), middle !== undefined &&
                        (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: selectedPage === middle - 1 }, buttonProps, { onClick: function () { return goToPage(middle - 1); } }, { children: middle })), middleRight !== undefined &&
                        (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: selectedPage === middleRight - 1 }, buttonProps, { onClick: function () { return goToPage(middleRight - 1); } }, { children: middleRight })), numPages !== 1 &&
                        (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: nextDisabled }, buttonProps, { onClick: function () { return goToPage(numPages - 1); } }, { children: numPages })), (0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: nextDisabled }, buttonProps, { onClick: goToNext }, { children: (0, jsx_runtime_1.jsx)(mui_1.NavigateNextIcon, {}) })), (0, jsx_runtime_1.jsxs)(mui_1.Typography, __assign({ style: { fontSize: 12, marginLeft: 'auto' } }, { children: ["Page ", selectedPage + 1, " of ", numPages] }))] }) })));
};
exports.TableFooterNumbered = TableFooterNumbered;
var BORDER_STYLE = "1px solid ".concat(exports.GRAY);
var Table = function (_a) {
    var items = _a.items, emptyText = _a.emptyText, titleComponentHeight = _a.titleComponentHeight, emptyComponent = _a.emptyComponent, noPaper = _a.noPaper, _b = _a.pageOptions, pageOptions = _b === void 0 ? { paginated: true } : _b, _c = _a.style, style = _c === void 0 ? {} : _c, _d = _a.horizontalPadding, horizontalPadding = _d === void 0 ? 20 : _d, _e = _a.elevation, elevation = _e === void 0 ? 5 : _e, headerFontSize = _a.headerFontSize, rowFontSize = _a.rowFontSize, onClick = _a.onClick, onPress = _a.onPress, loadMore = _a.loadMore, doneLoading = _a.doneLoading, loadMoreOptions = _a.loadMoreOptions, 
    // onClearFilter,
    _filterCounts = _a.filterCounts, title = _a.title, titleStyle = _a.titleStyle, titleActionsComponent = _a.titleActionsComponent, 
    // description,
    _f = _a.TitleComponent, 
    // description,
    TitleComponent = _f === void 0 ? exports.TableTitle : _f, renderTitleComponent = _a.renderTitleComponent, fields = _a.fields, _g = _a.HeaderComponent, HeaderComponent = _g === void 0 ? exports.TableHeader : _g, headerHeight = _a.headerHeight, hover = _a.hover, hoveredColor = _a.hoveredColor, _h = _a.RowComponent, RowComponent = _h === void 0 ? exports.TableRow : _h, _j = _a.footerStyle, footerStyle = _j === void 0 ? 'numbered' : _j, _k = _a.FooterComponent, FooterComponent = _k === void 0 ? footerStyle === 'numbered' ? exports.TableFooterNumbered : exports.TableFooter : _k, rowHeight = _a.rowHeight, selectable = _a.selectable, selected = _a.selected, setSelected = _a.setSelected, allSelected = _a.allSelected, setAllSelected = _a.setAllSelected, allowUnselectItemsAfterSelectAll = _a.allowUnselectItemsAfterSelectAll, noWrap = _a.noWrap, maxWidth = _a.maxWidth, maxRowsHeight = _a.maxRowsHeight, memoryId = _a.memoryId, _paginated = _a.paginated, onReorder = _a.onReorder, virtualization = _a.virtualization, onExport = _a.onExport, sort = _a.sort, refreshFilterSuggestionsKey = _a.refreshFilterSuggestionsKey, minColumnWidth = _a.minColumnWidth, columnResizeZIndex = _a.columnResizeZIndex;
    var sortingStorageKey = (memoryId !== null && memoryId !== void 0 ? memoryId : '') + 'sorting';
    var cachedSortString = (0, utilities_1.read_local_storage)(sortingStorageKey);
    var localFilterStorageKey = (memoryId !== null && memoryId !== void 0 ? memoryId : '') + 'localfilter';
    var cachedLocalFilterString = (0, utilities_1.read_local_storage)(localFilterStorageKey);
    var loadedFilter = [];
    try {
        loadedFilter = JSON.parse(cachedLocalFilterString);
    }
    catch (err) { }
    var keyString = fields.map(function (f) { return f.key; }).join('');
    var _l = (0, react_1.useState)(fields.map(function (_, i) {
        var _a, _b;
        return ({
            query: ((_a = loadedFilter[i]) === null || _a === void 0 ? void 0 : _a.query) || '',
            values: ((_b = loadedFilter[i]) === null || _b === void 0 ? void 0 : _b.values) || [],
        });
    })), localFilters = _l[0], setLocalFilters = _l[1];
    // keep cached in local storage
    (0, react_1.useEffect)(function () { return (0, utilities_1.update_local_storage)(localFilterStorageKey, JSON.stringify(localFilters)); }, [localFilterStorageKey, localFilters]);
    // reset when changing view
    (0, react_1.useEffect)(function () {
        var updated = (fields.map(function (_, i) {
            var _a, _b;
            return ({
                query: ((_a = loadedFilter[i]) === null || _a === void 0 ? void 0 : _a.query) || '',
                values: ((_b = loadedFilter[i]) === null || _b === void 0 ? void 0 : _b.values) || [],
            });
        }));
        setLocalFilters(updated);
    }, [keyString]);
    var _m = (0, react_1.useState)({}), widthOffsets = _m[0], setWidthOffsets = _m[1];
    if (memoryId) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var key = fields_1[_i].key;
            widthOffsets[key] = (parseInt((0, utilities_1.read_local_storage)("".concat(memoryId !== null && memoryId !== void 0 ? memoryId : '').concat(key, "width"))) || 0);
        }
    }
    var loadedSorting;
    try {
        loadedSorting = JSON.parse(cachedSortString);
    }
    catch (err) { }
    var _o = (0, react_1.useState)(Array.isArray(loadedSorting)
        ? loadedSorting
        : []), sorting = _o[0], setSorting = _o[1];
    (0, react_1.useEffect)(function () {
        if (!memoryId)
            return;
        (0, utilities_1.update_local_storage)(sortingStorageKey, JSON.stringify(sorting));
    }, [sorting, memoryId]);
    // sorts in place
    var applySorting = (0, react_1.useCallback)(function (items) {
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
    var paginationProps = __rest((0, exports.usePagination)(__assign(__assign({ items: items }, pageOptions), { applySorting: ((sort === null || sort === void 0 ? void 0 : sort.length) || sorting.length || onReorder) ? applySorting : undefined // don't sort when sorting is empty, way more efficient with time/memory
     })), []);
    RowComponent = RowComponent !== null && RowComponent !== void 0 ? RowComponent : exports.TableRow; // don't allow to be undefined 
    var sorted = (0, react_1.useMemo)(function () { return paginationProps.mapSelectedItems(function (i) { return i; }); }, [paginationProps.mapSelectedItems]);
    var filtered = (0, react_1.useMemo)(function () {
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
    var ListComponent = (0, react_1.useMemo)(function () { return (draggable
        ? layout_1.DraggableList
        : layout_1.ScrollingList); }, [draggable]);
    // don't use filtered values, otherwise reduces suggestions to only those remaining
    var filterSuggestions = (0, react_1.useMemo)(function () {
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
    var table = ((0, jsx_runtime_1.jsxs)(layout_1.Flex, __assign({ column: true }, { children: [title && TitleComponent && !renderTitleComponent && ((0, jsx_runtime_1.jsx)(TitleComponent, { title: title, actionsComponent: titleActionsComponent, 
                // description={description} 
                horizontalPadding: noPaper ? 0 : horizontalPadding, style: __assign({ maxWidth: maxWidth }, titleStyle) })), title && renderTitleComponent && (renderTitleComponent({
                title: title,
                actionsComponent: titleActionsComponent,
                horizontalPadding: noPaper ? 0 : horizontalPadding,
                style: __assign({ maxWidth: maxWidth }, titleStyle)
            })), filterCounts && filterCounts.total !== filterCounts.filtered &&
                (0, jsx_runtime_1.jsxs)(mui_1.Typography, __assign({ style: {
                        fontSize: 14, color: constants_1.PRIMARY_HEX,
                        textAlign: 'center', textDecoration: 'underline',
                    } }, { children: ["Showing ", filterCounts.filtered, " of ", filterCounts.total, " loaded records due to filters"] })), (0, jsx_runtime_1.jsx)(ListComponent, { items: filtered, onReorder: onReorder, noWrap: noWrap, maxHeight: maxRowsHeight, maxWidth: maxWidth, virtualization: virtualization, header: fields && HeaderComponent && fields.length > 0 && (items.length > 0 || headerFilterIsActive) && ((0, jsx_runtime_1.jsx)(HeaderComponent, { selectable: selectable, allSelected: allSelected, allowUnselectItemsAfterSelectAll: allowUnselectItemsAfterSelectAll, headerHeight: headerHeight, setAllSelected: function (v) {
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
                    ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(mui_1.Typography, __assign({ style: { padding: horizontalPadding } }, { children: emptyText || 'No results found the current filter' })), loadMore && !(doneLoading === null || doneLoading === void 0 ? void 0 : doneLoading()) &&
                                (0, jsx_runtime_1.jsx)("div", __assign({ style: { paddingLeft: horizontalPadding, paddingBottom: horizontalPadding } }, { children: (0, jsx_runtime_1.jsx)(forms_1.LoadingButton, { submitText: "Load Older Data", submittingText: "Loading...", onClick: loadMore, variant: "outlined", style: { width: 200, textAlign: 'center', marginTop: 10 } }) }))] }))
                    : undefined), Item: function (_a) {
                    var _b;
                    var item = _a.item, index = _a.index;
                    return ( // index within this list, e.g. a single page
                    (0, jsx_runtime_1.jsx)(RowComponent, { widthOffsets: widthOffsets, rowHeight: rowHeight, selectable: selectable, selected: selected, setSelected: setSelected, allSelected: allSelected, setAllSelected: setAllSelected, allowUnselectItemsAfterSelectAll: allowUnselectItemsAfterSelectAll, item: item, indices: {
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
                (0, jsx_runtime_1.jsx)(FooterComponent, __assign({ doneLoading: doneLoading, loadMore: loadMore, loadMoreOptions: loadMoreOptions }, paginationProps, pageOptions, { horizontalPadding: horizontalPadding }))] })));
    if (noPaper)
        return table;
    return ((0, jsx_runtime_1.jsx)(mui_1.Paper, __assign({ style: style, elevation: elevation }, { children: table })));
};
exports.Table = Table;
//# sourceMappingURL=table.js.map