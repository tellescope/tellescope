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
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Button, Checkbox, Chip, CircularProgress, Collapse, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton as MuiIconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { CANVAS_TITLE, EMOTII_TITLE, INSURANCE_RELATIONSHIPS, INSURANCE_RELATIONSHIPS_CANVAS, PRIMARY_HEX, RELATIONSHIP_TYPES, TELLESCOPE_GENDERS } from "@tellescope/constants";
import { MM_DD_YYYY_to_YYYY_MM_DD, capture_is_supported, downloadFile, emit_gtm_event, first_letter_capitalized, form_response_value_to_string, format_stripe_subscription_interval, getLocalTimezone, getPublicFileURL, mm_dd_yyyy, object_is_empty, replace_enduser_template_values, responses_satisfy_conditions, truncate_string, update_local_storage, user_display_name } from "@tellescope/utilities";
import { TIMEZONES_USA } from "@tellescope/types-models";
import { VALID_STATES, emailValidator, phoneValidator } from "@tellescope/validation";
import Slider from '@mui/material/Slider';
import LinearProgress from '@mui/material/LinearProgress';
import DatePicker from "react-datepicker";
import { datepickerCSS } from "./css/react-datepicker"; // avoids build issue with RN
import { CancelIcon, IconButton, LabeledIconButton, LoadingButton, form_display_text_for_language, isDateString, useResolvedSession } from "..";
import { css } from '@emotion/css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import heic2any from "heic2any";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LanguageIcon from '@mui/icons-material/Language';
import { Elements, PaymentElement, useStripe, useElements, EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircleOutline, Delete, Edit, ExpandMore } from "@mui/icons-material";
import { WYSIWYG } from "./wysiwyg";
// Debounce hook for search functionality
var useDebounce = function (value, delay) {
    var _a = useState(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    useEffect(function () {
        var handler = setTimeout(function () { return setDebouncedValue(value); }, delay);
        return function () { return clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};
export var LanguageSelect = function (_a) {
    var value = _a.value, props = __rest(_a, ["value"]);
    return (_jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "center", wrap: "nowrap", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(LanguageIcon, { color: "primary" }) })), _jsx(Grid, __assign({ item: true, style: { width: 150 } }, { children: _jsx(StringSelector, __assign({}, props, { options: ["English", "Español"], size: "small", value: value === 'Spanish' ? 'Español' : value, label: (value === 'Español' || value === 'Spanish') ? 'Idioma'
                        : "Language" })) }))] })));
};
export var defaultInputProps = { sx: {
        borderRadius: 4,
        // boxShadow: '2px 2px 2px #00000033',
    } };
export var defaultButtonStyles = {
    borderRadius: '10px',
};
export var PdfViewer = function (_a) {
    // const [numPages, setNumPages] = useState<number>();
    // const [page, setPage] = useState(1);
    var url = _a.url, _b = _a.height, height = _b === void 0 ? 420 : _b;
    // const parentRef = useRef<HTMLDivElement | null>(null);
    // const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    //   setNumPages(numPages);
    // }
    // const pdfHeight: number | undefined = pdfPage?._pageInfo?.view?.[3]
    // const pdfWidth: number | undefined = pdfPage?._pageInfo?.view?.[2]
    // const parentWidth = parentRef.current?.clientWidth
    return (_jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsx("iframe", { src: 
                // url
                // encodeURI(`http://localhost:5173?url=${url}`)
                // encodeURI(`http://tellescope-pdf-renderer.s3-website.us-east-2.amazonaws.com?url=${url}`)
                encodeURI("https://pdf.tellescope.com?url=".concat(url)), title: "PDF Viewer", style: {
                    border: 'none',
                    height: height,
                    width: '100%',
                    marginBottom: '5px'
                } }), _jsx("a", __assign({ href: url, target: "__blank", rel: "noopener noreferrer", style: { marginTop: 5 } }, { children: "View in new tab or download here" }))] })));
};
export var RatingInput = function (_a) {
    var _b, _d, _e, _f, _g;
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    var from = (_d = (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.from) !== null && _d !== void 0 ? _d : 1; // allow 0
    var to = (_f = (_e = field === null || field === void 0 ? void 0 : field.options) === null || _e === void 0 ? void 0 : _e.to) !== null && _f !== void 0 ? _f : 10; // allow 0
    var step = ((_g = field.options) === null || _g === void 0 ? void 0 : _g.rangeStepSize) || 1;
    var allMarks = [];
    for (var i = from; i <= to; i += (step)) {
        allMarks.push({ value: i, label: i });
    }
    var marks = __spreadArray([], allMarks, true);
    while (marks.length > 25) {
        marks = marks.filter(function (_, i) { return i % 2 === 0; });
    }
    return (_jsx(Slider, { min: from, max: to, step: step, marks: marks, valueLabelDisplay: marks.length < allMarks.length ? 'auto' : "off", value: value, onChange: function (e, v) { return onChange(v, field.id); }, sx: {
            '& .MuiSlider-thumb': value === undefined ? { display: 'none' } : {}, // Hide thumb until value is set
        } }, field.id));
};
// a little function to help us with reordering the result
var reorder = function (list, startIndex, endIndex) {
    var result = Array.from(list);
    var removed = result.splice(startIndex, 1)[0];
    result.splice(endIndex, 0, removed);
    return result;
};
var grid = 8;
var getItemStyle = function (isDragging, draggableStyle) { return (__assign({ 
    // some basic styles to make the items look a bit nicer
    userSelect: "none", padding: "".concat(grid * 2, "px"), margin: "0 0 ".concat(grid, "px 0"), 
    // change background colour if dragging
    backgroundColor: isDragging ? "#ffffff88" : undefined, border: '1px solid', borderColor: "primary.main", borderRadius: 5 }, draggableStyle)); };
var getListStyle = function (isDraggingOver) { return ({
// background: isDraggingOver ? "#ffffff44" : undefined,
// padding: `${grid}px`,
// width: '250px'
}); };
export var RankingInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    return (_jsxs(Grid, __assign({ container: true, direction: 'column' }, { children: [_jsx(DragDropContext, __assign({ onDragEnd: function (result) {
                    if (!value)
                        return;
                    if (!result.destination) {
                        return;
                    }
                    onChange(reorder(value, result.source.index, result.destination.index), field.id);
                } }, { children: _jsx(Droppable, __assign({ droppableId: "droppable" }, { children: function (provided, snapshot) { return (_jsxs(Box, __assign({}, provided.droppableProps, { ref: provided.innerRef, sx: getListStyle(snapshot.isDraggingOver) }, { children: [(value !== null && value !== void 0 ? value : []).map(function (item, index) { return (_jsx(Draggable, __assign({ draggableId: item, index: index }, { children: function (provided, snapshot) { return (_jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { sx: getItemStyle(snapshot.isDragging, provided.draggableProps.style) }, { children: [item, _jsx(DragIndicatorIcon, { color: "primary" })] }))); } }), item)); }), provided.placeholder] }))); } })) })), _jsx(Typography, __assign({ color: "primary", style: { marginTop: 3 } }, { children: "Drag and drop to re-order the above options" }))] })));
};
var CustomDateInput = forwardRef(function (props, ref) { return (_jsx(TextField, __assign({ InputProps: defaultInputProps, fullWidth: true, inputRef: ref }, props))); });
export var DateInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, _b = _a.placement, placement = _b === void 0 ? 'top' : _b, props = __rest(_a, ["field", "value", "onChange", "placement"]);
    var inputRef = useRef(null);
    return (_jsx(DatePicker // wrap in item to prevent movement on focused
    , { selected: value, onChange: function (d) { return onChange === null || onChange === void 0 ? void 0 : onChange(d, field.id); }, showTimeSelect: true, required: !field.isOptional, dateFormat: "Pp", autoComplete: "off", timeIntervals: 15, popperPlacement: placement, customInput: _jsx(CustomDateInput, __assign({ inputRef: inputRef }, props)), 
        // className={css`width: 100%;`}
        className: css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), datepickerCSS) }));
};
export var TableInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? [] : _d, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var choices = (_b = field.options) === null || _b === void 0 ? void 0 : _b.tableChoices;
    var handleNewRow = useCallback(function () {
        if (!(choices === null || choices === void 0 ? void 0 : choices.length))
            return;
        onChange(__spreadArray(__spreadArray([], value, true), [choices.map(function (c) { return ({
                label: c.label,
                entry: '',
            }); })], false), field.id, true);
    }, [value, field.id]);
    var handleChange = useCallback(function (r, c, u) {
        onChange(value.map(function (v, _i) {
            return _i !== r
                ? v
                : v.map(function (e, _c) { return _c === c ? u : e; });
        }), field.id, true);
    }, [value, onChange, field.id]);
    var handleRemove = useCallback(function (i) {
        onChange(value.filter(function (_, _i) { return i !== _i; }), field.id, true);
    }, [value, onChange, field.id]);
    useEffect(function () {
        if (field.isOptional)
            return;
        if (value.length)
            return;
        handleNewRow();
    }, [field.isOptional, value, handleNewRow]);
    if (!(choices === null || choices === void 0 ? void 0 : choices.length)) {
        return _jsx(Typography, __assign({ color: "error" }, { children: "No input choices available" }));
    }
    var length = choices.length || 1;
    var iconWidth = '35px';
    var width = "calc(".concat((100 / length).toFixed(2), "% - calc(").concat(iconWidth, " / ").concat(length, "))");
    return (_jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [value.map(function (row, i) { return (_jsxs(_Fragment, { children: [_jsxs(Grid, __assign({ container: true, alignItems: "center", spacing: 1 }, { children: [choices.map(function (v, columnIndex) {
                                var _a, _b, _d, _e, _f, _g, _h;
                                return (_jsx(Grid, __assign({ item: true, sx: { width: width } }, { children: v.type === 'Text'
                                        ? (_jsx(TextField, { label: v.label, size: "small", fullWidth: true, title: v.label, InputProps: defaultInputProps, value: (_a = row.find(function (c, _i) { return columnIndex === _i; })) === null || _a === void 0 ? void 0 : _a.entry, onChange: function (e) { return handleChange(i, columnIndex, { label: v.label, entry: e.target.value }); } }))
                                        : v.type === 'Date' ? (_jsx(DateStringInput, { label: v.label, size: "small", fullWidth: true, title: v.label, field: field, value: (_b = row.find(function (c, _i) { return columnIndex === _i; })) === null || _b === void 0 ? void 0 : _b.entry, onChange: function (entry) {
                                                if (entry === void 0) { entry = ''; }
                                                return handleChange(i, columnIndex, { label: v.label, entry: entry });
                                            } }))
                                            : v.type === 'Select' ? (_jsxs(FormControl, __assign({ size: "small", fullWidth: true }, { children: [_jsx(InputLabel, __assign({ id: "demo-select-small" }, { children: v.label })), _jsxs(Select, __assign({ label: v.label, size: "small", title: v.label, sx: defaultInputProps.sx, value: (_d = row.find(function (c, _i) { return columnIndex === _i; })) === null || _d === void 0 ? void 0 : _d.entry, onChange: function (e) { return handleChange(i, columnIndex, { label: v.label, entry: e.target.value }); } }, { children: [_jsx(MenuItem, __assign({ value: "" }, { children: _jsx("em", { children: "None" }) })), v.info.choices.map(function (c) { return (_jsx(MenuItem, __assign({ value: c }, { children: c }), c)); })] }))] })))
                                                : (v.type === 'Database' && v.info.databaseId && v.info.databaseLabel) ? (_jsx(DatabaseSelectInput, { responses: [], size: "small", field: __assign(__assign({}, field), { options: { databaseId: v.info.databaseId, databaseLabel: v.info.databaseLabel }, title: v.label }), value: ((_e = row.find(function (_, _i) { return columnIndex === _i; })) === null || _e === void 0 ? void 0 : _e.entry) ? [{
                                                            text: JSON.parse(((_f = row.find(function (_, _i) { return columnIndex === _i; })) === null || _f === void 0 ? void 0 : _f.entry) || '{}').text || '',
                                                            databaseId: JSON.parse(((_g = row.find(function (_, _i) { return columnIndex === _i; })) === null || _g === void 0 ? void 0 : _g.entry) || '{}').databaseId || '',
                                                            recordId: JSON.parse(((_h = row.find(function (_, _i) { return columnIndex === _i; })) === null || _h === void 0 ? void 0 : _h.entry) || '{}').recordId || '',
                                                        }] : [], onChange: function (records) { var _a; return handleChange(i, columnIndex, { label: v.label, entry: JSON.stringify((_a = records === null || records === void 0 ? void 0 : records[0]) !== null && _a !== void 0 ? _a : '') }); } }))
                                                    : null }), v.label));
                            }), _jsx(Grid, __assign({ item: true, sx: { ml: 'auto', width: iconWidth } }, { children: _jsx(LabeledIconButton, { Icon: CancelIcon, label: "Remove", onClick: function () { return handleRemove(i); }, disabled: !field.isOptional && value.length === 1 }) }))] }), i), _jsx(Divider, { flexItem: true, sx: { my: 1 } })] })); }), _jsx(Button, __assign({ variant: "outlined", size: "small", onClick: handleNewRow, sx: { width: 200 } }, { children: "Add new entry" }))] })));
};
export var AutoFocusTextField = function (props) { return (_jsx(TextField, __assign({ InputProps: defaultInputProps }, props))); };
var CustomDateStringInput = forwardRef(function (props, ref) { return (_jsx(TextField, __assign({ InputProps: defaultInputProps, fullWidth: true, inputRef: ref }, props))); });
export var DateStringInput = function (_a) {
    var _b;
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var inputRef = useRef(null);
    // if (value && isDateString(value)) {
    //   console.log(value, new Date(
    //     new Date(MM_DD_YYYY_to_YYYY_MM_DD(value)).getTime()
    //   + (new Date().getTimezoneOffset() * 60 * 1000)
    //   ))
    // }
    return (((_b = field.options) === null || _b === void 0 ? void 0 : _b.useDatePicker)
        ? (_jsx(DatePicker // wrap in item to prevent movement on focused
        , { selected: (value && isDateString(value))
                ? new Date(new Date(MM_DD_YYYY_to_YYYY_MM_DD(value)).getTime()
                    + ((new Date().getTimezoneOffset() + 60) * 60 * 1000) // additional hour (60 minutes) needs to be added for date to line up properly
                )
                : undefined, onChange: function (d) { return onChange === null || onChange === void 0 ? void 0 : onChange(mm_dd_yyyy(d), field.id); }, showTimeSelect: false, required: !field.isOptional, autoComplete: "off", dateFormat: "MM-dd-yyyy", customInput: _jsx(CustomDateStringInput, __assign({ inputRef: inputRef }, props, { label: (!field.title && field.placeholder) ? field.placeholder : props.label })), 
            // className={css`width: 100%;`}
            className: css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ""], ["", ""])), datepickerCSS) }))
        : (_jsx(AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, placeholder: "MM-DD-YYYY", value: value, label: (!field.title && field.placeholder) ? field.placeholder : props.label, onChange: function (e) {
                var v = e.target.value || '';
                onChange((v.length === 2 && /\d{2}/.test(v) && (value === null || value === void 0 ? void 0 : value.length) !== 3 // allow deletion
                    ? v + '-'
                    : v.length === 5 && /\d{2}-\d{2}/.test(v) && (value === null || value === void 0 ? void 0 : value.length) !== 6 // allow deletion
                        ? v + '-'
                        : v)
                    .replaceAll('/', '-'), field.id);
            } }))));
};
export var StringInput = function (_a) {
    var field = _a.field, value = _a.value, form = _a.form, onChange = _a.onChange, props = __rest(_a, ["field", "value", "form", "onChange"]);
    return (_jsx(AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: (field.placeholder || form_display_text_for_language(form, "Answer here...", '')), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
export var StringLongInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return (_jsx(AutoFocusTextField, __assign({}, props, { multiline: true, minRows: 3, maxRows: 8, required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || form_display_text_for_language(form, "Answer here...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
export var PhoneInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return (_jsx(AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || form_display_text_for_language(form, "Enter phone...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
export var EmailInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return (_jsx(AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, type: "email", value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || form_display_text_for_language(form, "Enter email...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
export var NumberInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    // Prevent the default scroll behavior when focused on this input
    var inputRef = useRef(null);
    useEffect(function () {
        var _a;
        var handleWheel = function (e) {
            var _a;
            (_a = e === null || e === void 0 ? void 0 : e.preventDefault) === null || _a === void 0 ? void 0 : _a.call(e);
        };
        // Get the actual input element inside the TextField
        var inputElement = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        if (inputElement) {
            inputElement.addEventListener('wheel', handleWheel, { passive: false });
            // Clean up event listener when component unmounts
            return function () {
                inputElement.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);
    return (_jsx(TextField, __assign({ ref: inputRef, autoFocus: true, InputProps: defaultInputProps }, props, { required: !field.isOptional, fullWidth: true, type: "number", value: value, onChange: function (e) { return onChange(parseInt(e.target.value), field.id); }, label: (!field.title && field.placeholder) ? field.placeholder : props.label, placeholder: field.placeholder || form_display_text_for_language(form, "Enter a number...", ''), onScroll: function (e) { return e.preventDefault(); }, sx: {
            '& input[type=number]': {
                '-moz-appearance': 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0
            }
        } })));
};
export var InsuranceInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var field = _a.field, onDatabaseSelect = _a.onDatabaseSelect, value = _a.value, onChange = _a.onChange, form = _a.form, responses = _a.responses, enduser = _a.enduser, props = __rest(_a, ["field", "onDatabaseSelect", "value", "onChange", "form", "responses", "enduser"]);
    var session = useResolvedSession();
    var _t = useState([]), payers = _t[0], setPayers = _t[1];
    var _u = useState(''), query = _u[0], setQuery = _u[1];
    var addressQuestion = useMemo(function () { return responses === null || responses === void 0 ? void 0 : responses.find(function (r) {
        var _a;
        if (r.answer.type !== 'Address')
            return false;
        if (r.field.intakeField !== 'Address')
            return false;
        // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
        if (!((_a = r.answer.value) === null || _a === void 0 ? void 0 : _a.state))
            return false;
        return true;
    }); }, [responses]);
    var state = useMemo(function () {
        var _a, _b, _d;
        return ((((_a = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _a === void 0 ? void 0 : _a.type) === 'Address' ? (_d = (_b = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.state : undefined) || (enduser === null || enduser === void 0 ? void 0 : enduser.state));
    }, [enduser === null || enduser === void 0 ? void 0 : enduser.state, addressQuestion]);
    var loadRef = useRef(false); // so session changes don't cause
    useEffect(function () {
        var _a;
        if (((_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === CANVAS_TITLE)
            return; // instead, look-up while typing against Canvas Search API
        if (loadRef.current)
            return;
        loadRef.current = true;
        // just load all at once, should be reasonably performant compared to paging
        session.api.form_fields.load_choices_from_database({ fieldId: field.id, limit: 10000 })
            .then(function (_a) {
            var choices = _a.choices;
            return setPayers(choices
                .map(function (c) {
                var _a, _b, _d, _e, _f, _g, _h, _j;
                return ({
                    id: ((_b = (_a = c.values.find(function (v) { var _a, _b; return ((_b = (_a = v.label) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'id'; })) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                    name: ((_e = (_d = c.values.find(function (v) { var _a, _b; return ((_b = (_a = v.label) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'name'; })) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.toString()) || '',
                    state: ((_g = (_f = c.values.find(function (v) { var _a, _b; return ((_b = (_a = v.label) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'state'; })) === null || _f === void 0 ? void 0 : _f.value) === null || _g === void 0 ? void 0 : _g.toString()) || '',
                    type: ((_j = (_h = c.values.find(function (v) { var _a, _b; return ((_b = (_a = v.label) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'type'; })) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.toString()) || '',
                    databaseRecord: c,
                });
            })
                .filter(function (c) { return !c.state || !state || (c.state === state); }));
        })
            .catch(console.error);
    }, [session, state, (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.dataSource]);
    var searchRef = useRef(query);
    useEffect(function () {
        var _a;
        if (((_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.dataSource) !== CANVAS_TITLE) {
            return;
        }
        if (!query)
            return;
        if (searchRef.current === query)
            return;
        searchRef.current = query;
        session.api.integrations.proxy_read({
            integration: CANVAS_TITLE,
            query: query,
            type: 'organizations',
        })
            .then(function (_a) {
            var data = _a.data;
            try {
                setPayers(data.map(function (d) { return ({
                    id: d.resource.id,
                    name: d.resource.name,
                }); }));
            }
            catch (err) {
                console.error;
            }
        })
            .catch(console.error);
    }, [session, (_d = field === null || field === void 0 ? void 0 : field.options) === null || _d === void 0 ? void 0 : _d.dataSource, query]);
    return (_jsxs(Grid, __assign({ container: true, spacing: 2, sx: { mt: '0' } }, { children: [_jsx(Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: _jsx(Autocomplete, { freeSolo: !((_e = field.options) === null || _e === void 0 ? void 0 : _e.requirePredefinedInsurer), options: payers.map(function (p) { return p.name; }), value: (value === null || value === void 0 ? void 0 : value.payerName) || '', onChange: function (e, v) {
                        var _a, _b;
                        return onChange(__assign(__assign({}, value), { payerName: v || '', payerId: ((_a = payers.find(function (p) { return p.name === v; })) === null || _a === void 0 ? void 0 : _a.id) || '', payerType: ((_b = payers.find(function (p) { return p.name === v; })) === null || _b === void 0 ? void 0 : _b.type) || '' }), field.id);
                    }, onInputChange: ((_f = field.options) === null || _f === void 0 ? void 0 : _f.requirePredefinedInsurer)
                        ? function (e, v) { if (v) {
                            setQuery(v);
                        } }
                        : function (e, v) {
                            var _a, _b, _d;
                            if (v) {
                                setQuery(v);
                            }
                            var databaseRecord = (_a = payers.find(function (p) { return p.name === v; })) === null || _a === void 0 ? void 0 : _a.databaseRecord;
                            if (databaseRecord) {
                                onDatabaseSelect === null || onDatabaseSelect === void 0 ? void 0 : onDatabaseSelect([databaseRecord]);
                            }
                            onChange(__assign(__assign({}, value), { payerName: v || '', payerId: ((_b = payers.find(function (p) { return p.name === v; })) === null || _b === void 0 ? void 0 : _b.id) || '', payerType: ((_d = payers.find(function (p) { return p.name === v; })) === null || _d === void 0 ? void 0 : _d.type) || '' }), field.id);
                        }, renderInput: function (params) {
                        var _a;
                        return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "Insurer", placeholder: ((_a = field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === CANVAS_TITLE ? "Search insurer..." : "Insurer" })));
                    } }) })), _jsx(Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: _jsx(TextField, { InputProps: defaultInputProps, required: !field.isOptional, fullWidth: true, value: (_g = value === null || value === void 0 ? void 0 : value.memberId) !== null && _g !== void 0 ? _g : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { memberId: e.target.value }), field.id); }, label: form_display_text_for_language(form, "Member ID", ''), size: "small" }) })), _jsx(Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: _jsx(TextField, { InputProps: defaultInputProps, required: false, fullWidth: true, value: (_h = value === null || value === void 0 ? void 0 : value.planName) !== null && _h !== void 0 ? _h : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { planName: e.target.value }), field.id); }, label: form_display_text_for_language(form, "Plan Name", ''), size: "small" }) })), _jsx(Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: _jsx(DateStringInput, { size: "small", label: "Plan Start Date", field: __assign(__assign({}, field), { isOptional: true }), value: (value === null || value === void 0 ? void 0 : value.startDate) || '', onChange: function (startDate) {
                        return onChange(__assign(__assign({}, value), { startDate: startDate }), field.id);
                    } }) })), ((_j = field.options) === null || _j === void 0 ? void 0 : _j.includeGroupNumber) &&
                _jsx(Grid, __assign({ item: true, xs: 12 }, { children: _jsx(TextField, { InputProps: defaultInputProps, fullWidth: true, value: (_k = value === null || value === void 0 ? void 0 : value.groupNumber) !== null && _k !== void 0 ? _k : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { groupNumber: e.target.value }), field.id); }, label: form_display_text_for_language(form, "Group Number", ''), size: "small" }) })), _jsx(Grid, __assign({ item: true, xs: 12 }, { children: _jsx(StringSelector, { size: "small", label: "Relationship to Policy Owner", options: ((((_l = field.options) === null || _l === void 0 ? void 0 : _l.billingProvider) === CANVAS_TITLE || ((_m = field.options) === null || _m === void 0 ? void 0 : _m.dataSource) === CANVAS_TITLE)
                        ? INSURANCE_RELATIONSHIPS_CANVAS
                        : INSURANCE_RELATIONSHIPS)
                        .sort(function (x, y) { return x.localeCompare(y); }), value: (value === null || value === void 0 ? void 0 : value.relationship) || 'Self', onChange: function (relationship) {
                        return onChange(__assign(__assign({}, value), { relationship: relationship || 'Self' }), field.id);
                    } }) })), ((value === null || value === void 0 ? void 0 : value.relationship) || 'Self') !== 'Self' &&
                _jsxs(_Fragment, { children: [_jsx(Grid, __assign({ item: true, xs: 12 }, { children: _jsx(Typography, __assign({ sx: { fontWeight: 'bold' } }, { children: "Policy Owner Details" })) })), _jsx(Grid, __assign({ item: true, xs: 6 }, { children: _jsx(TextField, { label: "First Name", size: "small", InputProps: defaultInputProps, fullWidth: true, value: ((_o = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _o === void 0 ? void 0 : _o.fname) || '', required: !field.isOptional, onChange: function (e) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { fname: e.target.value }) }), field.id);
                                } }) })), _jsx(Grid, __assign({ item: true, xs: 6 }, { children: _jsx(TextField, { label: "Last Name", size: "small", InputProps: defaultInputProps, fullWidth: true, value: ((_p = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _p === void 0 ? void 0 : _p.lname) || '', required: !field.isOptional, onChange: function (e) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { lname: e.target.value }) }), field.id);
                                } }) })), _jsx(Grid, __assign({ item: true, xs: 6 }, { children: _jsx(StringSelector, { options: TELLESCOPE_GENDERS, size: "small", label: "Gender", value: ((_q = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _q === void 0 ? void 0 : _q.gender) || '', required: !field.isOptional, onChange: function (v) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { gender: v }) }), field.id);
                                } }) })), _jsx(Grid, __assign({ item: true, xs: 6 }, { children: _jsx(DateStringInput, { size: "small", label: "Date of Birth", field: __assign(__assign({}, field), { isOptional: field.isOptional || ((_r = field.options) === null || _r === void 0 ? void 0 : _r.billingProvider) === 'Candid' }), value: ((_s = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _s === void 0 ? void 0 : _s.dateOfBirth) || '', onChange: function (dateOfBirth) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { dateOfBirth: dateOfBirth }) }), field.id);
                                } }) }))] })] })));
};
var StringSelector = function (_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, required = _a.required, getDisplayValue = _a.getDisplayValue, props = __rest(_a, ["options", "value", "onChange", "required", "getDisplayValue"]);
    return (_jsxs(FormControl, __assign({ fullWidth: true, size: props.size, required: required }, { children: [_jsx(InputLabel, { children: props.label }), _jsx(Select, __assign({}, props, { value: value, onChange: function (e) { return onChange(e.target.value); }, fullWidth: true, sx: defaultInputProps.sx }, { children: options.map(function (o, i) {
                    var _a;
                    return (_jsx(MenuItem, __assign({ value: o }, { children: (_a = getDisplayValue === null || getDisplayValue === void 0 ? void 0 : getDisplayValue(o)) !== null && _a !== void 0 ? _a : o }), o || i));
                }) }))] })));
};
var HourSelector = function (props) { return (_jsx(StringSelector, __assign({}, props, { options: Array(12).fill('').map(function (_, i) { return (i + 1) <= 9 ? "0".concat(i + 1) : (i + 1).toString(); }) }))); };
var MinuteSelector = function (props) { return (_jsx(StringSelector, __assign({}, props, { options: Array(60).fill('').map(function (_, i) { return i <= 9 ? "0".concat(i) : i.toString(); }) }))); };
var AmPmSelector = function (props) { return (_jsx(StringSelector, __assign({}, props, { options: ['AM', 'PM'] }))); };
export var TimeInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var _b = (value || '').split(':'), hour = _b[0], _d = _b[1], rest = _d === void 0 ? '' : _d;
    var _e = rest.split(' '), minute = _e[0], amPm = _e[1], _f = _e[2], zone = _f === void 0 ? getLocalTimezone() : _f;
    return (_jsxs(Grid, __assign({ container: true, alignItems: 'center', spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true, sx: { width: 100 } }, { children: _jsx(HourSelector, { value: hour, onChange: function (hour) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) })), _jsx(Grid, __assign({ item: true, sx: { width: 100 } }, { children: _jsx(MinuteSelector, { value: minute, onChange: function (minute) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) })), _jsx(Grid, __assign({ item: true, sx: { width: 100 } }, { children: _jsx(AmPmSelector, { value: amPm, onChange: function (amPm) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) }))] })));
};
export var TimezoneInput = function (_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, field = _a.field, onChange = _a.onChange, props = __rest(_a, ["value", "field", "onChange"]);
    return (_jsx(StringSelector, __assign({}, props, { value: value, options: TIMEZONES_USA, onChange: function (v) { return onChange(v, field.id); } })));
};
export var AddressInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var field = _a.field, form = _a.form, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "form", "value", "onChange"]);
    return (
    // state only
    ((_d = (_b = field.options) === null || _b === void 0 ? void 0 : _b.addressFields) === null || _d === void 0 ? void 0 : _d.includes('state'))
        ? (_jsx(Autocomplete, __assign({ value: (value === null || value === void 0 ? void 0 : value.state) || '', options: ((_f = (_e = field.options) === null || _e === void 0 ? void 0 : _e.validStates) === null || _f === void 0 ? void 0 : _f.length) ? field.options.validStates : VALID_STATES, disablePortal: true, onChange: function (e, v) { return v &&
                onChange(__assign(__assign({}, value), { state: v !== null && v !== void 0 ? v : '' }), field.id); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, 
                // don't use 'small' so as to be consistent with other text fields, in case this is used in a group
                // size={'small'} 
                label: form_display_text_for_language(form, "State") }))); } }, props)))
        : (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 2, sx: { mt: 0 } }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(AutoFocusTextField, __assign({}, props, { size: "small", required: !field.isOptional, fullWidth: true, value: (_g = value === null || value === void 0 ? void 0 : value.addressLineOne) !== null && _g !== void 0 ? _g : '', label: form_display_text_for_language(form, "Address Line 1"), placeholder: form_display_text_for_language(form, "Address Line 1"), onChange: function (e) {
                            var _a;
                            return onChange(__assign(__assign({}, value), { addressLineOne: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                        } })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(TextField, __assign({}, props, { size: "small", required: false, fullWidth: true, InputProps: defaultInputProps, value: (_h = value === null || value === void 0 ? void 0 : value.addressLineTwo) !== null && _h !== void 0 ? _h : '', label: form_display_text_for_language(form, "Address Line 2"), placeholder: form_display_text_for_language(form, "Address Line 2"), onChange: function (e) {
                            var _a;
                            return onChange(__assign(__assign({}, value), { addressLineTwo: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                        } })) })), _jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true, xs: 12, sm: field.fullZIP ? 5 : 6 }, { children: _jsx(TextField, __assign({}, props, { size: "small", required: !field.isOptional, InputProps: defaultInputProps, fullWidth: true, value: (_j = value === null || value === void 0 ? void 0 : value.city) !== null && _j !== void 0 ? _j : '', label: form_display_text_for_language(form, "City"), placeholder: form_display_text_for_language(form, "City"), onChange: function (e) {
                                        var _a;
                                        return onChange(__assign(__assign({}, value), { city: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                    } })) })), _jsx(Grid, __assign({ item: true, xs: field.fullZIP ? 4 : 6, sm: field.fullZIP ? 2 : 3 }, { children: _jsx(Autocomplete, __assign({ value: (value === null || value === void 0 ? void 0 : value.state) || '', fullWidth: true, options: ((_l = (_k = field.options) === null || _k === void 0 ? void 0 : _k.validStates) === null || _l === void 0 ? void 0 : _l.length) ? field.options.validStates : VALID_STATES, disablePortal: true, onChange: function (e, v) { return v &&
                                        onChange(__assign(__assign({}, value), { state: v !== null && v !== void 0 ? v : '' }), field.id); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), size: 'small', required: !field.isOptional, label: form_display_text_for_language(form, "State") }))); } }, props)) })), _jsx(Grid, __assign({ item: true, xs: field.fullZIP ? 5 : 6, sm: field.fullZIP ? 2 : 3 }, { children: _jsx(TextField, __assign({}, props, { size: "small", required: !field.isOptional, InputProps: defaultInputProps, fullWidth: true, value: (_m = value === null || value === void 0 ? void 0 : value.zipCode) !== null && _m !== void 0 ? _m : '', label: form_display_text_for_language(form, "ZIP Code"), placeholder: form_display_text_for_language(form, "ZIP Code"), onChange: function (e) {
                                        var _a;
                                        return onChange(__assign(__assign({}, value), { zipCode: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                    } })) })), field.fullZIP &&
                                _jsx(Grid, __assign({ item: true, xs: 3 }, { children: _jsx(TextField, __assign({}, props, { size: "small", label: "ZIP+4", required: !field.isOptional && field.fullZIP, InputProps: defaultInputProps, value: (_o = value === null || value === void 0 ? void 0 : value.zipPlusFour) !== null && _o !== void 0 ? _o : '', placeholder: "ZIP + 4", onChange: function (e) {
                                            var _a;
                                            return onChange(__assign(__assign({}, value), { zipPlusFour: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                        } })) }))] })) }))] }))));
};
export var ESignatureTerms = function () {
    var companyName = 'Tellescope';
    try {
        var indexOfName = window.location.href.indexOf('name=');
        if (indexOfName !== -1) {
            companyName = (decodeURIComponent(window.location.href.substring(indexOfName + 5))
                || companyName);
        }
    }
    catch (err) {
        console.error(err);
    }
    return (_jsxs("div", __assign({ style: { paddingLeft: 10 } }, { children: [_jsxs("h1", { children: [companyName, " Electronic Signature Terms"] }), _jsxs("p", { children: ["By selecting the \"I consent to use electronic signatures\" checkbox, you are signing this Agreement electronically. You agree your electronic signature is the legal equivalent of your manual/handwritten signature on this Agreement. By selecting \"I consent to use electronic signatures\" using any device, means or action, you consent to the legally binding terms and conditions of this Agreement. You further agree that your signature on this document (hereafter referred to as your \"E-Signature\") is as valid as if you signed the document in writing. You also agree that no certification authority or other third party verification is necessary to validate your E-Signature, and that the lack of such certification or third party verification will not in any way affect the enforceability of your E-Signature or any resulting agreement between you and", companyName, " or between you and a customer of ", companyName, "."] })] })));
};
export var SignatureInput = function (_a) {
    var _b, _d, _e, _f, _g;
    var value = _a.value, field = _a.field, _h = _a.autoFocus, autoFocus = _h === void 0 ? true : _h, enduser = _a.enduser, onChange = _a.onChange;
    var prefill = (((_b = field.options) === null || _b === void 0 ? void 0 : _b.prefillSignature) && (enduser === null || enduser === void 0 ? void 0 : enduser.fname) && enduser.lname
        ? "".concat(enduser.fname, " ").concat(enduser.lname)
        : undefined);
    var handleConsentChange = function () {
        var _a, _b, _d, _e;
        var newConsent = !(value === null || value === void 0 ? void 0 : value.signed);
        onChange({
            pdfAttachment: (_a = field.options) === null || _a === void 0 ? void 0 : _a.pdfAttachment,
            fullName: (_d = (_b = value === null || value === void 0 ? void 0 : value.fullName) !== null && _b !== void 0 ? _b : prefill) !== null && _d !== void 0 ? _d : '',
            signed: newConsent,
            url: (_e = field.options) === null || _e === void 0 ? void 0 : _e.signatureUrl,
        }, field.id);
    };
    var handleNameChange = function (newName) {
        var _a, _b, _d;
        onChange({
            pdfAttachment: (_a = field.options) === null || _a === void 0 ? void 0 : _a.pdfAttachment,
            signed: (_b = value === null || value === void 0 ? void 0 : value.signed) !== null && _b !== void 0 ? _b : false,
            fullName: newName,
            url: (_d = field.options) === null || _d === void 0 ? void 0 : _d.signatureUrl,
        }, field.id);
    };
    return (_jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [((_d = field.options) === null || _d === void 0 ? void 0 : _d.pdfAttachment) &&
                _jsx(PdfViewer, { url: getPublicFileURL({ businessId: field.businessId, name: field.options.pdfAttachment }) }), !((_e = field.options) === null || _e === void 0 ? void 0 : _e.pdfAttachment) && ((_f = field.options) === null || _f === void 0 ? void 0 : _f.signatureUrl) &&
                _jsxs(Grid, __assign({ container: true, direction: "column", sx: { mb: 2 } }, { children: [_jsx("iframe", { src: field.options.signatureUrl, style: {
                                border: 'none',
                                height: 400,
                                width: '100%',
                                marginBottom: '5px'
                            } }), _jsx("a", __assign({ href: field.options.signatureUrl, target: "_blank", rel: "noopener noreferrer" }, { children: "View document in new tab" }))] })), _jsxs(Grid, __assign({ item: true, xs: 12 }, { children: [_jsx(Checkbox, { style: { margin: 0, marginTop: 5, padding: 0, paddingRight: 3 }, color: "primary", checked: !!(value === null || value === void 0 ? void 0 : value.signed), onClick: function () { return handleConsentChange(); }, inputProps: { 'aria-label': 'consent to e-signature checkbox' } }), _jsxs(Typography, __assign({ component: "span", style: { position: 'relative', top: 5, left: 2 } }, { children: ["I consent to use ", _jsx("a", __assign({ href: "/e-signature-terms?name=".concat(((_g = field.options) === null || _g === void 0 ? void 0 : _g.esignatureTermsCompanyName) || ''), target: "_blank", rel: "noopener noreferrer" }, { children: " electronic signatures " }))] }))] })), _jsxs(Grid, __assign({ item: true, xs: 12, style: { marginTop: 12 } }, { children: [_jsx(TextField, { disabled: !(value === null || value === void 0 ? void 0 : value.signed), autoFocus: autoFocus, style: { width: '100%' }, size: "small", "aria-label": "Full Name", value: value === null || value === void 0 ? void 0 : value.fullName, placeholder: prefill || "Full Name", variant: "outlined", onChange: function (e) { return handleNameChange(e.target.value); }, InputProps: defaultInputProps }), _jsx(Typography, __assign({ color: "primary", style: { fontSize: 15, marginTop: 2 } }, { children: "Enter your legal full name to complete the signature" }))] }))] })));
};
var formatBytes = function (bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(2)), " ").concat(sizes[i]);
};
export function convertHEIC(file) {
    return __awaiter(this, void 0, void 0, function () {
        var blobURL, blobRes, blob, conversionResult, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blobURL = (typeof file === 'string' ? file : URL.createObjectURL(file));
                    return [4 /*yield*/, fetch(blobURL)
                        // convert response to blob
                    ];
                case 1:
                    blobRes = _a.sent();
                    return [4 /*yield*/, blobRes.blob()
                        // convert to PNG - response is blob
                    ];
                case 2:
                    blob = _a.sent();
                    return [4 /*yield*/, heic2any({ blob: blob })
                        // convert to blob url
                    ];
                case 3:
                    conversionResult = _a.sent();
                    url = URL.createObjectURL(Array.isArray(conversionResult) ? conversionResult[0] : conversionResult);
                    return [2 /*return*/, url];
            }
        });
    });
}
;
var value_is_image = function (f) { var _a; return (_a = f === null || f === void 0 ? void 0 : f.type) === null || _a === void 0 ? void 0 : _a.includes('image'); };
export var FileInput = function (_a) {
    var _b;
    var value = _a.value, onChange = _a.onChange, field = _a.field, existingFileName = _a.existingFileName, uploadingFiles = _a.uploadingFiles, handleFileUpload = _a.handleFileUpload, setUploadingFiles = _a.setUploadingFiles;
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useDropzone({
        onDrop: useCallback(function (acceptedFiles) {
            var _a, _b, _d, _e;
            var file = acceptedFiles.pop();
            if (!file)
                return;
            if (((_a = field.options) === null || _a === void 0 ? void 0 : _a.maxFileSize) && file.size > field.options.maxFileSize) {
                return setError("File size must be less than ".concat(formatBytes(field.options.maxFileSize)));
            }
            if ((_d = (_b = field.options) === null || _b === void 0 ? void 0 : _b.validFileTypes) === null || _d === void 0 ? void 0 : _d.length) {
                var match = field.options.validFileTypes.find(function (t) { return file.type.includes(t.toLowerCase()); });
                if (!match) {
                    return setError("File must have type: ".concat(field.options.validFileTypes.join(', ')));
                }
            }
            setError('');
            onChange(file, field.id);
            if (((_e = field.options) === null || _e === void 0 ? void 0 : _e.autoUploadFiles) && handleFileUpload) {
                setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return __spreadArray(__spreadArray([], fs, true), [{ fieldId: field.id }], false); });
                handleFileUpload(file, field.id)
                    .finally(function () { return setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return fs.filter(function (f) { return f.fieldId !== field.id; }); }); });
            }
        }, [onChange, (_b = field.options) === null || _b === void 0 ? void 0 : _b.validFileTypes, handleFileUpload, setUploadingFiles]),
    }), getRootProps = _e.getRootProps, getInputProps = _e.getInputProps, isDragActive = _e.isDragActive;
    var _f = useState(''), preview = _f[0], setPreview = _f[1];
    useEffect(function () {
        if (!value_is_image(value))
            return;
        if ((value.type.includes('heif') || value.type.includes('heic'))) {
            convertHEIC(value).then(setPreview).catch(console.error);
            return;
        }
        try {
            setPreview(URL.createObjectURL(value));
        }
        catch (err) {
            console.error(err);
        }
    }, [value]);
    if (uploadingFiles === null || uploadingFiles === void 0 ? void 0 : uploadingFiles.find(function (f) { return f.fieldId === field.id; })) {
        return _jsx(LinearProgress, {});
    }
    return (_jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsxs(Grid, __assign({ container: true }, getRootProps(), { sx: {
                    width: "100%",
                    border: "1px dashed #000000",
                    borderRadius: 10,
                    padding: (preview && !isDragActive) ? 0 : 6,
                    '&:hover': {
                        border: "1px solid ".concat(PRIMARY_HEX),
                        cursor: 'pointer',
                    }
                }, alignItems: "center", justifyContent: "center" }, { children: [_jsx("input", __assign({}, getInputProps({ multiple: false }))), _jsx("p", { children: isDragActive ? "Drop to select file"
                            : value
                                ? (preview
                                    ? _jsx("img", { src: preview, style: { paddingLeft: '10%', width: '80%', maxHeight: 200 } })
                                    : "".concat(truncate_string(value.name, { length: 30, showEllipsis: true }), " selected!"))
                                : capture_is_supported()
                                    ? (_jsxs(Grid, __assign({ container: true, direction: "column", alignItems: "center" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(AddPhotoAlternateIcon, { color: "primary" }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ sx: { fontSize: 14, textAlign: 'center' } }, { children: "Select file or take picture" })) }))] })))
                                    : "Select a File" })] })), _jsx(Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: (!(value === null || value === void 0 ? void 0 : value.name) && existingFileName) &&
                    _jsxs(Typography, { children: [existingFileName, " selected!"] }) })), error &&
                _jsx(Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: _jsx(Typography, __assign({ color: "error" }, { children: error })) }))] })));
};
export var safe_create_url = function (file) {
    try {
        return URL.createObjectURL(file);
    }
    catch (err) {
        console.error('safe_create_url error:', err);
        return null;
    }
};
export var FilesInput = function (_a) {
    var _b;
    var value = _a.value, onChange = _a.onChange, field = _a.field, existingFileName = _a.existingFileName, uploadingFiles = _a.uploadingFiles, handleFileUpload = _a.handleFileUpload, setUploadingFiles = _a.setUploadingFiles;
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useDropzone({
        onDrop: useCallback(function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
            var _loop_1, _a, acceptedFiles_1, file, state_1;
            var _b, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return __spreadArray(__spreadArray([], fs, true), [{ fieldId: field.id }], false); });
                        _loop_1 = function (file) {
                            var match;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        if ((_d = (_b = field.options) === null || _b === void 0 ? void 0 : _b.validFileTypes) === null || _d === void 0 ? void 0 : _d.length) {
                                            match = field.options.validFileTypes.find(function (t) { return file.type.includes(t.toLowerCase()); });
                                            if (!match) {
                                                return [2 /*return*/, { value: setError("File must have type: ".concat(field.options.validFileTypes.join(', '))) }];
                                            }
                                        }
                                        if (!(((_e = field.options) === null || _e === void 0 ? void 0 : _e.autoUploadFiles) && handleFileUpload)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, handleFileUpload(file, field.id).catch(console.error)];
                                    case 1:
                                        _g.sent();
                                        _g.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        _a = 0, acceptedFiles_1 = acceptedFiles;
                        _f.label = 1;
                    case 1:
                        if (!(_a < acceptedFiles_1.length)) return [3 /*break*/, 4];
                        file = acceptedFiles_1[_a];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        state_1 = _f.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _f.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4:
                        setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return fs.filter(function (f) { return f.fieldId !== field.id; }); });
                        setError('');
                        onChange(__spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []), true), acceptedFiles, true), field.id);
                        return [2 /*return*/];
                }
            });
        }); }, [onChange, value, (_b = field.options) === null || _b === void 0 ? void 0 : _b.validFileTypes, handleFileUpload, setUploadingFiles]),
    }), getRootProps = _e.getRootProps, getInputProps = _e.getInputProps, isDragActive = _e.isDragActive;
    var previews = useMemo(function () { return ((value !== null && value !== void 0 ? value : []).map(function (v) {
        return value_is_image(v) ? safe_create_url(v) : null;
    })); }, [value]);
    if (uploadingFiles === null || uploadingFiles === void 0 ? void 0 : uploadingFiles.find(function (f) { return f.fieldId === field.id; })) {
        return _jsx(LinearProgress, {});
    }
    return (_jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsxs(Grid, __assign({ container: true }, getRootProps(), { sx: {
                    width: "100%",
                    border: "1px dashed #000000",
                    borderRadius: 10,
                    padding: 2,
                    '&:hover': {
                        border: "1px solid ".concat(PRIMARY_HEX),
                        cursor: 'pointer',
                    }
                }, alignItems: "center", justifyContent: "center" }, { children: [_jsx("input", __assign({}, getInputProps({ multiple: false }))), _jsx("p", { children: isDragActive
                            ? "Drop to select files"
                            : capture_is_supported()
                                ? (_jsxs(Grid, __assign({ container: true, direction: "column", alignItems: "center" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(AddPhotoAlternateIcon, { color: "primary" }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ sx: { fontSize: 14, textAlign: 'center' } }, { children: "Select files or take pictures" })) }))] })))
                                : "Select Files" })] })), _jsx(Grid, __assign({ container: true, direction: "column", sx: { overflowY: 'auto', maxHeight: '250px', mt: 1 }, wrap: "nowrap" }, { children: value === null || value === void 0 ? void 0 : value.map(function (file, i) {
                    var _a;
                    return (_jsx(Grid, __assign({ item: true, sx: { mt: 0.5 } }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", wrap: "nowrap" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [_jsx(Typography, __assign({ sx: { mr: 1 } }, { children: file.name })), ((_a = file.type) === null || _a === void 0 ? void 0 : _a.includes('image')) && previews[i] &&
                                                _jsx(Grid, __assign({ item: true }, { children: _jsx("img", { src: previews[i], style: { maxWidth: '45%', maxHeight: 80, height: '100%' } }) }))] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(LabeledIconButton, { label: "Remove", Icon: Delete, onClick: function () { return onChange(value.filter(function (f, _i) { return i !== _i; }), field.id); } }) }))] })) }), i));
                }) })), error &&
                _jsx(Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: _jsx(Typography, __assign({ color: "error" }, { children: error })) }))] })));
};
var multipleChoiceItemSx = {
    border: '1px solid #888888',
    py: 0.25,
    borderRadius: 2.5,
    mb: 0.5,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
};
export var MultipleChoiceInput = function (_a) {
    var _b;
    var field = _a.field, form = _a.form, _value = _a.value, onChange = _a.onChange;
    var value = typeof _value === 'string' ? [_value] : _value; // if loading existingResponses, allows them to be a string
    var _d = field.options, choices = _d.choices, radio = _d.radio, other = _d.other, optionDetails = _d.optionDetails;
    var _e = useState({}), expandedDescriptions = _e[0], setExpandedDescriptions = _e[1];
    // current other string
    var enteringOtherStringRef = React.useRef(''); // if typing otherString as prefix of a checkbox value, don't auto-select
    var otherString = (_b = value === null || value === void 0 ? void 0 : value.find(function (v) { var _a; return v === enteringOtherStringRef.current || !((_a = (choices !== null && choices !== void 0 ? choices : [])) === null || _a === void 0 ? void 0 : _a.find(function (c) { return c === v; })); })) !== null && _b !== void 0 ? _b : '';
    var getDescriptionForChoice = useCallback(function (choice) {
        var _a;
        return (_a = optionDetails === null || optionDetails === void 0 ? void 0 : optionDetails.find(function (detail) { return detail.option === choice; })) === null || _a === void 0 ? void 0 : _a.description;
    }, [optionDetails]);
    var toggleDescription = useCallback(function (index) {
        setExpandedDescriptions(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = !prev[index], _a)));
        });
    }, []);
    return (_jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [radio
                ? (_jsxs(FormControl, __assign({ fullWidth: true }, { children: [_jsx(FormLabel, __assign({ id: "radio-group-".concat(field.id, "-label") }, { children: form_display_text_for_language(form, "Select One") })), _jsx(RadioGroup, __assign({ "aria-labelledby": "radio-group-".concat(field.id, "-label"), defaultValue: "female", name: "radio-group-".concat(field.id) }, { children: (choices !== null && choices !== void 0 ? choices : []).map(function (c, i) {
                                var description = getDescriptionForChoice(c);
                                var hasDescription = !!description;
                                var isExpanded = expandedDescriptions[i];
                                return (_jsxs(Box, __assign({ sx: { width: '100%' } }, { children: [_jsx(Box, __assign({ sx: { display: 'flex', alignItems: 'center', width: '100%' } }, { children: _jsx(FormControlLabel, { sx: __assign(__assign({}, multipleChoiceItemSx), { flex: 1, marginLeft: '0px' }), checked: !!(value === null || value === void 0 ? void 0 : value.includes(c)) && c !== otherString, control: _jsx(Radio, { onClick: function () { return onChange((value === null || value === void 0 ? void 0 : value.includes(c)) ? [] : [c], field.id); } }), label: _jsxs(Box, __assign({ sx: { display: 'flex', alignItems: 'center', width: '100%' } }, { children: [_jsx(Typography, __assign({ component: "span", sx: { flex: 1 } }, { children: c })), hasDescription && (_jsx(MuiIconButton, __assign({ size: "small", onClick: function (e) {
                                                                e.stopPropagation();
                                                                toggleDescription(i);
                                                            }, sx: {
                                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                transition: 'transform 0.2s',
                                                                ml: 1
                                                            } }, { children: _jsx(ExpandMore, { fontSize: "small" }) })))] })) }) })), hasDescription && (_jsx(Collapse, __assign({ in: isExpanded }, { children: _jsx(Box, __assign({ sx: { pl: '42px', pr: 2, pb: 1 } }, { children: _jsx(Typography, __assign({ variant: "body2", color: "text.secondary" }, { children: description })) })) })))] }), i));
                            }) }))] }))) : ((choices !== null && choices !== void 0 ? choices : []).map(function (c, i) {
                var description = getDescriptionForChoice(c);
                var hasDescription = !!description;
                var isExpanded = expandedDescriptions[i];
                return (_jsx(Grid, __assign({ xs: 12 }, { children: _jsxs(Box, __assign({ sx: { width: '100%' } }, { children: [_jsxs(Box, __assign({ sx: __assign(__assign({}, multipleChoiceItemSx), { display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }), onClick: function (e) {
                                    var _a, _b, _d, _e;
                                    // Don't trigger selection if clicking on the expand button
                                    if (e.target.closest('.expand-button')) {
                                        return;
                                    }
                                    onChange(((value === null || value === void 0 ? void 0 : value.includes(c))
                                        ? ((radio || ((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.radioChoices) === null || _b === void 0 ? void 0 : _b.includes(c)))
                                            ? []
                                            : value.filter(function (v) { return v !== c; }))
                                        : ((radio || ((_e = (_d = field.options) === null || _d === void 0 ? void 0 : _d.radioChoices) === null || _e === void 0 ? void 0 : _e.includes(c)))
                                            ? [c]
                                            : __spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []).filter(function (x) { var _a, _b; return !((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.radioChoices) === null || _b === void 0 ? void 0 : _b.includes(x)); }), true), [c], false))), field.id);
                                } }, { children: [_jsx(Checkbox, { color: "primary", checked: !!(value === null || value === void 0 ? void 0 : value.includes(c)) && c !== otherString, inputProps: { 'aria-label': 'primary checkbox' } }), _jsx(Typography, __assign({ component: "span", sx: { flex: 1 } }, { children: c })), hasDescription && (_jsx(MuiIconButton, __assign({ className: "expand-button", size: "small", onClick: function (e) {
                                            e.stopPropagation();
                                            toggleDescription(i);
                                        }, sx: {
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                            ml: 1
                                        } }, { children: _jsx(ExpandMore, { fontSize: "small" }) })))] })), hasDescription && (_jsx(Collapse, __assign({ in: isExpanded }, { children: _jsx(Box, __assign({ sx: { pl: '42px', pr: 2, pb: 1 } }, { children: _jsx(Typography, __assign({ variant: "body2", color: "text.secondary" }, { children: description })) })) })))] })) }), i));
            })), other &&
                _jsx(Grid, __assign({ item: true, xs: 12 }, { children: _jsx(TextField // className={classes.textField}
                    , { InputProps: { sx: { borderRadius: 2.5 } }, sx: { width: radio ? "calc(100% - 15px)" : '100%' }, size: "small", "aria-label": form_display_text_for_language(form, "Other"), value: otherString, placeholder: form_display_text_for_language(form, "Other"), variant: "outlined", 
                        // onClick={() => !otherChecked && handleOtherChecked()} // allow click to enable when disabled
                        onChange: function (e) {
                            enteringOtherStringRef.current = e.target.value;
                            onChange((radio
                                ? (e.target.value.trim()
                                    ? [e.target.value]
                                    : [])
                                : (e.target.value.trim()
                                    // remove existing other string (if exists) and append new one
                                    ? __spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []).filter(function (v) { return v !== otherString; }), true), [e.target.value], false) : value === null || value === void 0 ? void 0 : value.filter(function (v) { return v !== otherString; }))), field.id);
                        } }) }))] })));
};
// Helper to emit GTM purchase event for Stripe payments (single source of truth)
var emitStripePurchaseEvent = function (field, cost) {
    var _a;
    emit_gtm_event({
        event: 'form_purchase',
        productIds: ((_a = field.options) === null || _a === void 0 ? void 0 : _a.productIds) || [],
        fieldId: field.id,
        value: cost / 100,
        currency: 'USD',
    });
};
export var StripeInput = function (_a) {
    var _b, _d, _e;
    var field = _a.field, value = _a.value, onChange = _a.onChange, setCustomerId = _a.setCustomerId, enduserId = _a.enduserId, form = _a.form, responses = _a.responses, enduser = _a.enduser;
    var session = useResolvedSession();
    var _f = useState(''), clientSecret = _f[0], setClientSecret = _f[1];
    var _g = useState(''), businessName = _g[0], setBusinessName = _g[1];
    var _h = useState(false), isCheckout = _h[0], setIsCheckout = _h[1];
    var _j = useState(), stripePromise = _j[0], setStripePromise = _j[1];
    var _k = useState(''), answertext = _k[0], setAnswertext = _k[1];
    var _l = useState(''), error = _l[0], setError = _l[1];
    var _m = useState([]), selectedProducts = _m[0], setSelectedProducts = _m[1];
    var _o = useState(false), showProductSelection = _o[0], setShowProductSelection = _o[1];
    var _p = useState([]), availableProducts = _p[0], setAvailableProducts = _p[1];
    var _q = useState(false), loadingProducts = _q[0], setLoadingProducts = _q[1];
    // Compute visible products based on conditional logic
    var visibleProducts = useMemo(function () {
        if (!showProductSelection || availableProducts.length === 0) {
            return availableProducts;
        }
        return availableProducts.filter(function (product) {
            var _a, _b;
            // Find condition for this product
            var productCondition = (_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.productConditions) === null || _b === void 0 ? void 0 : _b.find(function (c) { return c.productId === product._id; });
            // If no condition defined, show by default
            if (!(productCondition === null || productCondition === void 0 ? void 0 : productCondition.showCondition) || object_is_empty(productCondition.showCondition)) {
                return true;
            }
            // Evaluate condition against current form responses
            return responses_satisfy_conditions(responses || [], productCondition.showCondition, {
                dateOfBirth: enduser === null || enduser === void 0 ? void 0 : enduser.dateOfBirth,
                gender: enduser === null || enduser === void 0 ? void 0 : enduser.gender,
                state: enduser === null || enduser === void 0 ? void 0 : enduser.state,
                form: form,
                activeResponses: responses,
            });
        });
    }, [availableProducts, (_b = field.options) === null || _b === void 0 ? void 0 : _b.productConditions, responses, showProductSelection, enduser, form]);
    // Automatically deselect products that become hidden
    useEffect(function () {
        var visibleProductIds = visibleProducts.map(function (p) { return p._id; });
        setSelectedProducts(function (prev) { return prev.filter(function (id) { return visibleProductIds.includes(id); }); });
    }, [visibleProducts]);
    var fetchRef = useRef(false);
    useEffect(function () {
        var _a, _b, _d;
        if (fetchRef.current)
            return;
        if (value && ((_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.stripeCustomerId)) {
            return setCustomerId(function (c) { var _a; return c ? c : (_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.stripeCustomerId; }); // already paid or saved card
        }
        // Check if product selection mode is enabled
        if (((_b = field.options) === null || _b === void 0 ? void 0 : _b.stripeProductSelectionMode) && (((_d = field.options) === null || _d === void 0 ? void 0 : _d.productIds) || []).length > 1) {
            setShowProductSelection(true);
            setLoadingProducts(true);
            // Fetch product data with real-time Stripe pricing via proxy_read
            var productIds = (field.options.productIds || []).join(',');
            session.api.integrations.proxy_read({
                integration: 'Stripe',
                type: 'product-prices',
                id: productIds,
                query: field.options.stripeKey
            })
                .then(function (_a) {
                var data = _a.data;
                setAvailableProducts(data.products || []);
                setLoadingProducts(false);
            })
                .catch(function (e) {
                var _a, _b;
                console.error('Error loading product data:', e);
                var errorMessage = ((_b = (_a = e === null || e === void 0 ? void 0 : e.message) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, 'Stripe pricing error:'))
                    ? e.message.replace('Stripe pricing error: ', '')
                    : 'Failed to load product information from Stripe';
                setError("Product configuration error: ".concat(errorMessage));
                setLoadingProducts(false);
            });
            return;
        }
        fetchRef.current = true;
        session.api.form_responses.stripe_details({ fieldId: field.id, enduserId: enduserId })
            .then(function (_a) {
            var clientSecret = _a.clientSecret, publishableKey = _a.publishableKey, stripeAccount = _a.stripeAccount, businessName = _a.businessName, customerId = _a.customerId, isCheckout = _a.isCheckout, answerText = _a.answerText;
            setAnswertext(answerText || '');
            setIsCheckout(!!isCheckout);
            setClientSecret(clientSecret);
            setStripePromise(loadStripe(publishableKey, { stripeAccount: stripeAccount }));
            setBusinessName(businessName);
            setCustomerId(customerId);
        })
            .catch(function (e) {
            console.error(e);
            if (typeof (e === null || e === void 0 ? void 0 : e.message) === 'string') {
                setError(e.message);
            }
        });
    }, [session, value, field.id, enduserId]);
    var cost = (showProductSelection
        ? selectedProducts.reduce(function (total, productId) {
            var _a;
            var product = availableProducts.find(function (p) { return p._id === productId; });
            if (product === null || product === void 0 ? void 0 : product.currentPrice) {
                return total + (product.currentPrice.amount || 0);
            }
            return total + (((_a = product === null || product === void 0 ? void 0 : product.cost) === null || _a === void 0 ? void 0 : _a.amount) || 0);
        }, 0)
        : 0 // Will be calculated by existing Stripe flow when not in selection mode
    );
    // Emit GTM purchase event once when success screen is displayed
    var purchaseEmittedRef = useRef(false);
    useEffect(function () {
        var _a;
        // Only emit for actual purchases (chargeImmediately), not for saving card details
        if (value && ((_a = field.options) === null || _a === void 0 ? void 0 : _a.chargeImmediately) && !purchaseEmittedRef.current) {
            emitStripePurchaseEvent(field, cost);
            purchaseEmittedRef.current = true;
        }
    }, [value, field, cost]);
    // Handle product selection step
    if (showProductSelection) {
        if (error) {
            return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 2, alignItems: "center" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "error", variant: "h6" }, { children: "Product Configuration Error" })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "error", sx: { textAlign: 'center' } }, { children: error })) }))] })));
        }
        if (loadingProducts) {
            return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 2, alignItems: "center" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(LinearProgress, {}) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, { children: "Loading product information..." }) }))] })));
        }
        // Check if all products are filtered out by conditional logic
        if (visibleProducts.length === 0) {
            return (_jsx(Grid, __assign({ container: true, direction: "column", spacing: 2, alignItems: "center" }, { children: _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "textSecondary" }, { children: "No products are available based on your previous answers." })) })) })));
        }
        var isSingleSelection_1 = ((_d = field.options) === null || _d === void 0 ? void 0 : _d.radio) === true;
        var handleProductSelection_1 = function (productId) {
            if (isSingleSelection_1) {
                setSelectedProducts([productId]);
            }
            else {
                setSelectedProducts(function (prev) {
                    return prev.includes(productId)
                        ? prev.filter(function (id) { return id !== productId; })
                        : __spreadArray(__spreadArray([], prev, true), [productId], false);
                });
            }
        };
        var handleContinueToPayment = function () {
            if (selectedProducts.length === 0)
                return;
            setShowProductSelection(false);
            fetchRef.current = true;
            // Now fetch Stripe details with selected products
            session.api.form_responses.stripe_details(__assign({ fieldId: field.id, enduserId: enduserId }, (selectedProducts.length > 0 && { selectedProductIds: selectedProducts }) // Pass selected products to Stripe checkout
            ))
                .then(function (_a) {
                var clientSecret = _a.clientSecret, publishableKey = _a.publishableKey, stripeAccount = _a.stripeAccount, businessName = _a.businessName, customerId = _a.customerId, isCheckout = _a.isCheckout, answerText = _a.answerText;
                setAnswertext(answerText || '');
                setIsCheckout(!!isCheckout);
                setClientSecret(clientSecret);
                setStripePromise(loadStripe(publishableKey, { stripeAccount: stripeAccount }));
                setBusinessName(businessName);
                setCustomerId(customerId);
            })
                .catch(function (e) {
                console.error(e);
                if (typeof (e === null || e === void 0 ? void 0 : e.message) === 'string') {
                    setError(e.message);
                }
            });
        };
        return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 2 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Typography, __assign({ variant: "h6" }, { children: ["Select Product", isSingleSelection_1 ? '' : 's'] })) })), visibleProducts.map(function (product) {
                    var _a, _b, _d;
                    // Use real-time Stripe pricing if available, fallback to Tellescope pricing
                    var price = product.currentPrice || product.cost;
                    var priceAmount = (price === null || price === void 0 ? void 0 : price.amount) || 0;
                    var priceCurrency = (price === null || price === void 0 ? void 0 : price.currency) || 'USD';
                    return (_jsx(Grid, __assign({ item: true }, { children: _jsx(FormControlLabel, { control: isSingleSelection_1 ? (_jsx(Radio, { checked: selectedProducts.includes(product._id), onChange: function () { return handleProductSelection_1(product._id); } })) : (_jsx(Checkbox, { checked: selectedProducts.includes(product._id), onChange: function () { return handleProductSelection_1(product._id); } })), label: _jsxs(Box, { children: [_jsx(Typography, __assign({ variant: "body1", fontWeight: "bold" }, { children: product.title })), product.description && (_jsx(Typography, __assign({ variant: "body2", color: "textSecondary" }, { children: product.description }))), _jsxs(Typography, __assign({ variant: "body2", color: "primary" }, { children: ["$", (priceAmount / 100).toFixed(2), " ", priceCurrency.toUpperCase(), ((_a = product.currentPrice) === null || _a === void 0 ? void 0 : _a.isSubscription) && (_jsx(Typography, __assign({ component: "span", variant: "caption", sx: { ml: 0.5 } }, { children: format_stripe_subscription_interval((_b = product.currentPrice) === null || _b === void 0 ? void 0 : _b.interval, (_d = product.currentPrice) === null || _d === void 0 ? void 0 : _d.interval_count) })))] }))] }) }) }), product._id));
                }), _jsx(Grid, __assign({ item: true }, { children: _jsx(Button, __assign({ variant: "contained", onClick: handleContinueToPayment, disabled: selectedProducts.length === 0, sx: { mt: 2 } }, { children: "Continue to Payment" })) }))] })));
    }
    if (error) {
        return (_jsx(Typography, __assign({ color: "error" }, { children: error })));
    }
    if (value) {
        return (_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [_jsx(CheckCircleOutline, { color: "success" }), _jsx(Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: ((_e = field.options) === null || _e === void 0 ? void 0 : _e.chargeImmediately) ? 'Your purchase was successful' : "Your payment details have been saved!" }))] })));
    }
    if (!(clientSecret && stripePromise))
        return _jsx(LinearProgress, {});
    if (isCheckout && stripePromise)
        return (_jsx(EmbeddedCheckoutProvider, __assign({ stripe: stripePromise, options: {
                clientSecret: clientSecret,
                onComplete: function () { return onChange(answertext || 'Completed checkout', field.id); },
            } }, { children: _jsx(EmbeddedCheckout, {}) })));
    return (_jsx(Elements, __assign({ stripe: stripePromise, options: {
            clientSecret: clientSecret,
        } }, { children: _jsx(StripeForm, { businessName: businessName, onSuccess: function () { return onChange(answertext || 'Saved card details', field.id); }, cost: cost, field: field }) })));
};
var StripeForm = function (_a) {
    var _b, _d, _e;
    var businessName = _a.businessName, onSuccess = _a.onSuccess, field = _a.field, cost = _a.cost;
    var stripe = useStripe();
    var elements = useElements();
    var _f = useState(false), ready = _f[0], setReady = _f[1];
    var _g = useState(''), errorMessage = _g[0], setErrorMessage = _g[1];
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        var _a, _b;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // We don't want to let default form submission happen here,
                    // which would refresh the page.
                    event === null || event === void 0 ? void 0 : event.preventDefault();
                    if (!stripe || !elements) {
                        // Stripe.js hasn't yet loaded.
                        // Make sure to disable form submission until Stripe.js has loaded.
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, (((_a = field.options) === null || _a === void 0 ? void 0 : _a.chargeImmediately) ? stripe.confirmPayment : stripe.confirmSetup)({
                            //`Elements` instance that was used to create the Payment Element
                            elements: elements,
                            confirmParams: {
                                return_url: window.location.href,
                            },
                            redirect: 'if_required', //  ensures the redirect url won't be used, unless the Bank redirect payment type is enabled (it's not, just card)
                        })];
                case 1:
                    error = (_d.sent()).error;
                    if (error) {
                        // This point will only be reached if there is an immediate error when
                        // confirming the payment. Show error to your customer (for example, payment
                        // details incomplete)
                        setErrorMessage((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : '');
                    }
                    else {
                        onSuccess();
                        // Your customer will be redirected to your `return_url`. For some payment
                        // methods like iDEAL, your customer will be redirected to an intermediate
                        // site first to authorize the payment, then redirected to the `return_url`.
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("form", __assign({ onSubmit: handleSubmit }, { children: [_jsx(PaymentElement, { onReady: function () { return setReady(true); }, options: {
                    business: { name: businessName },
                } }), _jsx(Button, __assign({ variant: "contained", color: "primary", type: "submit", sx: { mt: 1 }, disabled: !(stripe && ready) }, { children: ((_b = field.options) === null || _b === void 0 ? void 0 : _b.chargeImmediately) ? 'Make Payment' : 'Save Payment Details' })), cost > 0 &&
                _jsx(Typography, __assign({ sx: { mt: 0.5 } }, { children: ((_d = field.options) === null || _d === void 0 ? void 0 : _d.customPriceMessage)
                        ? field.options.customPriceMessage.replaceAll('{{PRICE}}', "$".concat((cost / 100).toFixed(2)))
                        : "You will be charged $".concat((cost / 100).toFixed(2), " ").concat(((_e = field.options) === null || _e === void 0 ? void 0 : _e.chargeImmediately) ? '' : 'on form submission') })), errorMessage &&
                _jsx(Typography, __assign({ color: "error", sx: { mt: 0.5 } }, { children: errorMessage }))] })));
};
export var Progress = function (_a) {
    var numerator = _a.numerator, denominator = _a.denominator, style = _a.style;
    return (_jsxs(Box, __assign({ sx: __assign({ display: 'flex', alignItems: 'center' }, style) }, { children: [_jsx(Box, __assign({ sx: { width: '100%', mr: 1 } }, { children: _jsx(LinearProgress, { variant: "determinate", style: { height: '10px' }, value: (numerator / (denominator || 1)) * 100 }) })), _jsx(Box, __assign({ sx: { minWidth: 35 } }, { children: _jsxs(Typography, __assign({ variant: "body2", color: "text.secondary" }, { children: [(numerator / (denominator || 1) * 100).toFixed(0), "%"] })) }))] })));
};
export var DropdownInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j;
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    var _k = useState(''), typing = _k[0], setTyping = _k[1];
    // this should run only once, even if the field updates but the id is unchanged, otherwise will overwrite input
    var typingRef = useRef('');
    useEffect(function () {
        if (typingRef.current === field.id)
            return;
        typingRef.current = field.id;
        setTyping('');
    }, [field]);
    return (_jsx(Autocomplete, { id: field.id, style: { marginTop: 5 }, multiple: !((_b = field.options) === null || _b === void 0 ? void 0 : _b.radio), freeSolo: !!((_d = field.options) === null || _d === void 0 ? void 0 : _d.other), value: ((_e = field.options) === null || _e === void 0 ? void 0 : _e.radio)
            ? ((_f = value === null || value === void 0 ? void 0 : value[0]) !== null && _f !== void 0 ? _f : '')
            : (value !== null && value !== void 0 ? value : []), onChange: function (_, v) { return (onChange((typeof v === 'string' || v === null) ? [v !== null && v !== void 0 ? v : ''] : v, field.id)); }, options: (_h = (_g = field.options) === null || _g === void 0 ? void 0 : _g.choices) !== null && _h !== void 0 ? _h : [], inputValue: ((_j = field.options) === null || _j === void 0 ? void 0 : _j.radio) && Array.isArray(value) && value[0]
            ? value[0]
            : typing, onInputChange: function (e, value) { return setTyping(value); }, renderInput: function (params) {
            var _a, _b;
            return _jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), onChange: function (e) {
                    var _a;
                    return ((((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio) && field.options.other)
                        ? onChange(e.target.value ? [e.target.value] : [], field.id)
                        : undefined);
                }, placeholder: field.placeholder
                    ? field.placeholder + ((!field.title && !field.isOptional) ? '*' : '')
                    : undefined, label: (!((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio) && ((_b = field.options) === null || _b === void 0 ? void 0 : _b.other))
                    ? "Press enter to save a custom value"
                    : '' }));
        } }));
};
var choicesForDatabase = {};
var preventRefetch = {};
var LOAD_CHOICES_LIMIT = 500;
var MIN_SEARCH_CHARS = 3;
var SEARCH_DEBOUNCE_MS = 300;
var useDatabaseChoices = function (_a) {
    var _b, _d;
    var _e = _a.databaseId, databaseId = _e === void 0 ? '' : _e, field = _a.field, otherAnswers = _a.otherAnswers, _f = _a.searchQuery, searchQuery = _f === void 0 ? '' : _f;
    var session = useResolvedSession();
    var _g = useState(false), isSearching = _g[0], setIsSearching = _g[1];
    var _h = useState([]), searchResults = _h[0], setSearchResults = _h[1];
    var _j = useState(false), initialLoadComplete = _j[0], setInitialLoadComplete = _j[1];
    var debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
    // Load initial page on mount (only once, not recursively)
    var initialLoadRef = useRef(false);
    useEffect(function () {
        var _a, _b, _d;
        if (initialLoadRef.current)
            return;
        if (((_a = choicesForDatabase[databaseId]) === null || _a === void 0 ? void 0 : _a.done) || ((_d = (_b = choicesForDatabase[databaseId]) === null || _b === void 0 ? void 0 : _b.records) === null || _d === void 0 ? void 0 : _d.length)) {
            setInitialLoadComplete(true);
            return;
        }
        initialLoadRef.current = true;
        preventRefetch[databaseId + field.id] = true;
        session.api.form_fields.load_choices_from_database({
            fieldId: field.id,
            limit: LOAD_CHOICES_LIMIT,
            databaseId: databaseId,
        })
            .then(function (_a) {
            var _b;
            var newChoices = _a.choices;
            choicesForDatabase[databaseId] = {
                lastId: (_b = newChoices === null || newChoices === void 0 ? void 0 : newChoices[newChoices.length - 1]) === null || _b === void 0 ? void 0 : _b.id,
                records: newChoices.sort(function (c1, c2) { return (label_for_database_record(field, c1)
                    .localeCompare(label_for_database_record(field, c2))); }),
                done: true, // Don't load more pages automatically
            };
            setInitialLoadComplete(true);
        })
            .catch(function (err) {
            console.error(err);
            preventRefetch[databaseId + field.id] = false;
            setInitialLoadComplete(true); // Mark as complete even on error to avoid infinite loading
        });
    }, [session, field, databaseId]);
    // Handle debounced search
    var searchRef = useRef(debouncedSearch);
    useEffect(function () {
        var trimmed = debouncedSearch.trim();
        // If search is cleared, return to initial results
        if (!trimmed) {
            setSearchResults([]);
            setIsSearching(false);
            searchRef.current = debouncedSearch;
            return;
        }
        // Only search if meets minimum character requirement
        if (trimmed.length < MIN_SEARCH_CHARS) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        // Avoid duplicate searches
        if (searchRef.current === debouncedSearch)
            return;
        searchRef.current = debouncedSearch;
        setIsSearching(true);
        session.api.form_fields.load_choices_from_database({
            fieldId: field.id,
            limit: LOAD_CHOICES_LIMIT,
            databaseId: databaseId,
            search: trimmed,
        })
            .then(function (_a) {
            var _b, _d;
            var newChoices = _a.choices;
            // Add search results to the same cache as initial load
            // This ensures selected search results persist even after search is cleared
            var existingRecords = (_d = (_b = choicesForDatabase[databaseId]) === null || _b === void 0 ? void 0 : _b.records) !== null && _d !== void 0 ? _d : [];
            var existingIds = new Set(existingRecords.map(function (r) { return r.id; }));
            var uniqueNewChoices = newChoices.filter(function (c) { return !existingIds.has(c.id); });
            if (uniqueNewChoices.length > 0) {
                choicesForDatabase[databaseId] = __assign(__assign({}, choicesForDatabase[databaseId]), { records: __spreadArray(__spreadArray([], existingRecords, true), uniqueNewChoices, true).sort(function (c1, c2) { return (label_for_database_record(field, c1)
                        .localeCompare(label_for_database_record(field, c2))); }), done: true });
            }
            setSearchResults(newChoices.sort(function (c1, c2) { return (label_for_database_record(field, c1)
                .localeCompare(label_for_database_record(field, c2))); }));
            setIsSearching(false);
        })
            .catch(function (err) {
            console.error(err);
            setIsSearching(false);
        });
    }, [session, field, databaseId, debouncedSearch]);
    var addChoice = useCallback(function (record) {
        if (!choicesForDatabase[databaseId]) {
            choicesForDatabase[databaseId] = {
                done: false,
                records: [],
            };
        }
        choicesForDatabase[databaseId].records.push(record);
    }, [choicesForDatabase, databaseId]);
    // Use search results if searching, otherwise use cached initial results
    var activeChoices = debouncedSearch.trim().length >= MIN_SEARCH_CHARS
        ? searchResults
        : ((_d = (_b = choicesForDatabase[databaseId]) === null || _b === void 0 ? void 0 : _b.records) !== null && _d !== void 0 ? _d : []);
    return {
        addChoice: addChoice,
        doneLoading: initialLoadComplete,
        isSearching: isSearching,
        choices: __spreadArray(__spreadArray([], activeChoices, true), (otherAnswers || []).map(function (v) {
            var _a;
            return ({
                id: v.text,
                databaseId: databaseId,
                values: [{ label: ((_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseLabel) || '', type: 'Text', value: v.text }],
            });
        }), true),
        minSearchChars: MIN_SEARCH_CHARS,
    };
};
var label_for_database_record = function (field, record) {
    var _a, _b, _d, _e;
    if (!record)
        return '';
    var addedLabels = ((((_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseLabels) || [])
        .map(function (l) { var _a, _b; return (_b = (_a = record.values.find(function (v) { return v.label === l; })) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString(); })
        .filter(function (v) { return v === null || v === void 0 ? void 0 : v.trim(); }));
    return (((_e = (_d = (_b = record.values.find(function (v) { var _a; return v.label === ((_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseLabel); })) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '')
        + (addedLabels.length
            ? " (".concat(addedLabels.join(', '), ")")
            : ''));
};
var get_other_answers = function (_value, typing) {
    try {
        var existing = ((_value || [])
            .filter(function (v) { return typeof v === 'string' || v.recordId === v.text; })
            .map(function (v) { return typeof v === 'string' ? { databaseId: '', recordId: v, text: v } : v; }));
        if (typing) {
            existing.push({ text: typing, databaseId: '', recordId: typing });
        }
        return existing;
    }
    catch (err) {
        console.error(err);
    }
    return [];
};
export var DatabaseSelectInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k;
    var AddToDatabase = _a.AddToDatabase, field = _a.field, _value = _a.value, onChange = _a.onChange, onDatabaseSelect = _a.onDatabaseSelect, responses = _a.responses, size = _a.size, disabled = _a.disabled, enduser = _a.enduser, inputProps = _a.inputProps;
    var _l = useState(''), typing = _l[0], setTyping = _l[1];
    var _m = useState(false), open = _m[0], setOpen = _m[1];
    var _o = useDatabaseChoices({
        databaseId: (_b = field.options) === null || _b === void 0 ? void 0 : _b.databaseId,
        field: field,
        otherAnswers: get_other_answers(_value, ((_d = field === null || field === void 0 ? void 0 : field.options) === null || _d === void 0 ? void 0 : _d.other) ? typing : undefined),
        searchQuery: typing,
    }), addChoice = _o.addChoice, choices = _o.choices, doneLoading = _o.doneLoading, isSearching = _o.isSearching, minSearchChars = _o.minSearchChars;
    var value = React.useMemo(function () {
        var _a, _b;
        try {
            // if the value is a string (some single answer that was save), make sure we coerce to array
            var __value = typeof _value === 'string' ? [_value] : _value;
            return ((_b = (_a = __value === null || __value === void 0 ? void 0 : __value.map(function (v) {
                return choices.find(function (c) {
                    return c.id === v.recordId || (typeof v === 'string' && label_for_database_record(field, c) === v);
                });
            })) === null || _a === void 0 ? void 0 : _a.filter(function (v) { return v; })) !== null && _b !== void 0 ? _b : []);
        }
        catch (err) {
            console.error('Error resolving database answers for _value', err);
            return [];
        }
    }, [_value, choices, field]);
    var filterResponse = useMemo(function () {
        var _a, _b, _d, _e;
        return (((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.fieldId)
            ? (_e = (_d = responses.find(function (r) { var _a, _b; return r.fieldId === ((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.fieldId); })) === null || _d === void 0 ? void 0 : _d.answer) === null || _e === void 0 ? void 0 : _e.value
            : undefined);
    }, [responses, (_e = field.options) === null || _e === void 0 ? void 0 : _e.databaseFilter]);
    // State filtering logic similar to Insurance component
    var addressQuestion = useMemo(function () { return responses === null || responses === void 0 ? void 0 : responses.find(function (r) {
        var _a;
        if (r.answer.type !== 'Address')
            return false;
        if (r.field.intakeField !== 'Address')
            return false;
        // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
        if (!((_a = r.answer.value) === null || _a === void 0 ? void 0 : _a.state))
            return false;
        return true;
    }); }, [responses]);
    var state = useMemo(function () {
        var _a, _b, _d, _e;
        return (((_a = field.options) === null || _a === void 0 ? void 0 : _a.filterByEnduserState)
            ? ((((_b = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _b === void 0 ? void 0 : _b.type) === 'Address' ? (_e = (_d = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.state : undefined) || (enduser === null || enduser === void 0 ? void 0 : enduser.state))
            : undefined);
    }, [enduser === null || enduser === void 0 ? void 0 : enduser.state, addressQuestion, (_f = field.options) === null || _f === void 0 ? void 0 : _f.filterByEnduserState]);
    var filteredChoicesWithPotentialDuplicates = useMemo(function () {
        var _a, _b;
        if (!choices)
            return [];
        if (!filterResponse)
            return choices;
        if (!((_b = (_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.databaseLabel))
            if (!value || value.length === 0)
                return choices;
        return (choices
            .filter(function (c) {
            var _a;
            var v = (_a = c.values.find(function (_v) { var _a, _b; return _v.label === ((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.databaseLabel); })) === null || _a === void 0 ? void 0 : _a.value;
            if (!v)
                return true;
            // use .text on r values to handle Database Select types as filter source (in addition to basic text and list of text)
            if (typeof v === 'object') {
                return !!(Object.values(v).find(function (oVal) { return (typeof oVal === 'string' || typeof oVal === 'number'
                    ? (Array.isArray(filterResponse)
                        ? filterResponse.find(function (r) { return r === oVal.toString() || (typeof r === 'object' && r.text === oVal); })
                        : (typeof filterResponse === 'string' || typeof filterResponse === 'number')
                            ? filterResponse.toString() === oVal.toString()
                            : false)
                    : false); }));
            }
            if (typeof v === 'string' || typeof v === 'number') {
                return !!(Array.isArray(filterResponse)
                    ? filterResponse.find(function (r) { return r === v.toString() || (typeof r === 'object' && r.text === v); })
                    : (typeof filterResponse === 'string' || typeof filterResponse === 'number')
                        ? filterResponse.toString() === v.toString()
                        : (typeof filterResponse === 'object' && filterResponse.city === v.toString()) ? true
                            : (typeof filterResponse === 'object' && filterResponse.state === v.toString()) ? true
                                : (typeof filterResponse === 'object' && filterResponse.zipCode === v.toString()) ? true
                                    : false);
            }
            return false;
        }));
    }, [choices, filterResponse, (_g = field.options) === null || _g === void 0 ? void 0 : _g.databaseFilter, value]);
    // Apply state filtering as a secondary filter (doesn't modify existing logic)
    var stateFilteredChoices = useMemo(function () {
        var _a;
        if (!((_a = field.options) === null || _a === void 0 ? void 0 : _a.filterByEnduserState) || !state) {
            return filteredChoicesWithPotentialDuplicates;
        }
        return filteredChoicesWithPotentialDuplicates.filter(function (c) {
            var _a, _b;
            var recordState = ((_b = (_a = c.values.find(function (v) { var _a, _b; return ((_b = (_a = v.label) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'state'; })) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString()) || '';
            return !recordState || recordState === state;
        });
    }, [filteredChoicesWithPotentialDuplicates, (_h = field.options) === null || _h === void 0 ? void 0 : _h.filterByEnduserState, state]);
    var filteredChoices = useMemo(function () {
        var filtered = [];
        var uniques = new Set([]);
        for (var _a = 0, stateFilteredChoices_1 = stateFilteredChoices; _a < stateFilteredChoices_1.length; _a++) {
            var c = stateFilteredChoices_1[_a];
            var text = label_for_database_record(field, c);
            if (uniques.has(text))
                continue; // duplicate found
            uniques.add(text);
            filtered.push(c);
        }
        return filtered;
    }, [field, stateFilteredChoices]);
    // Show placeholder when typing but below minimum search characters
    var charsNeeded = typing.trim().length > 0 && typing.trim().length < minSearchChars
        ? minSearchChars - typing.trim().length
        : 0;
    if (!doneLoading)
        return _jsx(LinearProgress, {});
    return (_jsxs(_Fragment, { children: [_jsx(Autocomplete, { id: field.id, freeSolo: false, size: size, componentsProps: { popper: { sx: { wordBreak: "break-word" } } }, options: filteredChoices, multiple: true, loading: isSearching, open: open, onOpen: function () { return setOpen(true); }, onClose: function () { return setOpen(false); }, getOptionLabel: function (o) { return (Array.isArray(o) // edge case
                    ? ''
                    : label_for_database_record(field, o)); }, value: value, disabled: disabled, onChange: function (_, v) {
                    var _a, _b, _d, _e, _f;
                    if (v.length && onDatabaseSelect) {
                        onDatabaseSelect(((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio)
                            ? [v[v.length - 1]] // if radio, only last selected
                            : v);
                    }
                    return onChange((!((_b = field.options) === null || _b === void 0 ? void 0 : _b.radio)
                        ? v.map(function (_v) {
                            var _a;
                            return ({
                                databaseId: (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseId,
                                recordId: _v.id,
                                text: label_for_database_record(field, _v),
                            });
                        })
                        : [{
                                databaseId: (_d = field.options) === null || _d === void 0 ? void 0 : _d.databaseId,
                                recordId: (_f = (_e = v[v.length - 1]) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : '',
                                text: label_for_database_record(field, v[v.length - 1]),
                            }]), field.id);
                }, inputValue: typing, onInputChange: function (e, v) { return e && setTyping(v); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: (inputProps || defaultInputProps).sx, endAdornment: (_jsxs(_Fragment, { children: [isSearching ? _jsx(CircularProgress, { color: "inherit", size: 20 }) : null, params.InputProps.endAdornment] })) }), placeholder: charsNeeded > 0 ? "Type ".concat(charsNeeded, " more character").concat(charsNeeded > 1 ? 's' : '', " to search...") : undefined, helperText: charsNeeded > 0 ? "Type ".concat(charsNeeded, " more character").concat(charsNeeded > 1 ? 's' : '', " to search") : undefined }))); }, 
                // use custom Chip to ensure very long entries break properly (whitespace: normal)
                renderTags: function (value, getTagProps) {
                    return value.map(function (value, index) { return (_jsx(Chip, __assign({ label: _jsx(Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: Array.isArray(value) ? '' : label_for_database_record(field, value) })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
                } }), AddToDatabase && ((_j = field === null || field === void 0 ? void 0 : field.options) === null || _j === void 0 ? void 0 : _j.allowAddToDatabase) && (_jsx(AddToDatabase, { databaseId: (_k = field.options) === null || _k === void 0 ? void 0 : _k.databaseId, onAdd: addChoice }))] }));
};
var displayTermsCache = undefined;
var DRUGS_FOR_DISPLAY_TERM = {};
var RX_NORM_CODE_FOR_DRUG = {};
var NDC_CODES_FOR_RX_NORM_CODE = {};
var useMedications = function (_a) {
    var dontFetch = _a.dontFetch;
    var _b = useState(displayTermsCache), displayTerms = _b[0], setDisplayTerms = _b[1];
    var fetchRef = useRef(displayTerms !== undefined);
    useEffect(function () {
        if (dontFetch)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        // thankfully, this endpoint has cache control, so repeated requests should fetch from disk anyway
        axios.get('https://rxnav.nlm.nih.gov/REST/displaynames.json')
            .then(function (result) {
            var _a, _b, _d;
            return setDisplayTerms({
                displayTermsList: {
                    term: ((_d = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.displayTermsList) === null || _b === void 0 ? void 0 : _b.term) === null || _d === void 0 ? void 0 : _d.filter(function (t) {
                        try {
                            // parse out some of the not immediately useful / non-human-readable options
                            if (t.startsWith('('))
                                return false;
                            if (t.startsWith('.'))
                                return false;
                            if (!isNaN(parseInt(t.charAt(0))))
                                return false; // starts with a number
                            return true;
                        }
                        catch (err) {
                            return false;
                        }
                    }))
                }
            });
        })
            .catch(console.error);
    }, [dontFetch]);
    var getDrugsForDisplayTerm = useCallback(function (s) { return __awaiter(void 0, void 0, void 0, function () {
        var drugs, _a;
        var _b, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = DRUGS_FOR_DISPLAY_TERM[s];
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios.get("https://rxnav.nlm.nih.gov/REST/drugs.json?name=".concat(s))];
                case 1:
                    _a = ((_f = (_e = (_d = (_b = (_g.sent())
                        .data) === null || _b === void 0 ? void 0 : _b.drugGroup) === null || _d === void 0 ? void 0 : _d.conceptGroup) === null || _e === void 0 ? void 0 : _e.find(function (v) { return v.conceptProperties; })) === null || _f === void 0 ? void 0 : _f.conceptProperties);
                    _g.label = 2;
                case 2:
                    drugs = _a;
                    if (!DRUGS_FOR_DISPLAY_TERM[s]) {
                        DRUGS_FOR_DISPLAY_TERM[s] = drugs; // cache for future lookups
                    }
                    return [2 /*return*/, drugs];
            }
        });
    }); }, []);
    var getCodesForDrug = useCallback(function (s) { return __awaiter(void 0, void 0, void 0, function () {
        var rxNormCode, _a, NDCs, _b;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _a = RX_NORM_CODE_FOR_DRUG[s];
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=".concat(s, "&allsrc=1"))];
                case 1:
                    _a = ((_f = (_e = (_d = (_l.sent())
                        .data) === null || _d === void 0 ? void 0 : _d.idGroup) === null || _e === void 0 ? void 0 : _e.rxnormId) === null || _f === void 0 ? void 0 : _f[0]);
                    _l.label = 2;
                case 2:
                    rxNormCode = _a;
                    RX_NORM_CODE_FOR_DRUG[s] = rxNormCode; // cache for future lookups
                    _b = NDC_CODES_FOR_RX_NORM_CODE[rxNormCode];
                    if (_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios.get("https://rxnav.nlm.nih.gov/REST/rxcui/".concat(rxNormCode, "/ndcs.json"))];
                case 3:
                    _b = ((_k = (_j = (_h = (_g = (_l.sent())
                        .data) === null || _g === void 0 ? void 0 : _g.ndcGroup) === null || _h === void 0 ? void 0 : _h.ndcList) === null || _j === void 0 ? void 0 : _j.ndc) !== null && _k !== void 0 ? _k : []);
                    _l.label = 4;
                case 4:
                    NDCs = _b;
                    NDC_CODES_FOR_RX_NORM_CODE[rxNormCode] = NDCs; // cache for future lookups
                    return [2 /*return*/, {
                            rxNormCode: rxNormCode,
                            NDCs: NDCs,
                        }];
            }
        });
    }); }, []);
    if (displayTerms === undefined) {
        return {
            displayTerms: undefined,
            doneLoading: false,
            getDrugsForDisplayTerm: getDrugsForDisplayTerm,
            getCodesForDrug: getCodesForDrug,
        };
    }
    return {
        displayTerms: displayTerms,
        doneLoading: true,
        getDrugsForDisplayTerm: getDrugsForDisplayTerm,
        getCodesForDrug: getCodesForDrug,
    };
};
var filterOptions = function (options, _a) {
    var inputValue = _a.inputValue;
    return ((inputValue
        ? (options
            .filter(function (o) { return o.toLowerCase().includes(inputValue.toLowerCase()); })
            // show shorter matches first (tends to promote exact match and simpler medications)
            .sort(function (v1, v2) { return v1.length - v2.length; })
        // .reverse()
        ) : (options))
        .slice(0, 100) // dramatic performance improvement (when not virtualized) to show a subset like this
    );
};
var FDB_URL = "http://www.fdbhealth.com/";
export var CanvasMedicationsInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? [] : _d, onChange = _a.onChange;
    var session = useResolvedSession();
    var _e = useState(''), query = _e[0], setQuery = _e[1];
    var _f = useState([]), results = _f[0], setResults = _f[1];
    // if two Medications questions shown in a row, reset state
    useEffect(function () {
        setQuery('');
        setResults([]);
    }, [field.id]);
    var fetchRef = useRef(query);
    useEffect(function () {
        if (fetchRef.current === query)
            return;
        fetchRef.current = query;
        if (!query)
            return;
        var t = setTimeout(function () {
            session.api.integrations
                .proxy_read({
                integration: CANVAS_TITLE,
                type: 'medications',
                query: query,
            })
                .then(function (r) {
                var _a;
                setResults((((_a = r.data) === null || _a === void 0 ? void 0 : _a.entry) || [])
                    .map(function (v) {
                    var fdbCode = v.resource.code.coding.find(function (c) { return c.system === FDB_URL; });
                    return {
                        displayTerm: (fdbCode === null || fdbCode === void 0 ? void 0 : fdbCode.display) || '',
                        drugName: (fdbCode === null || fdbCode === void 0 ? void 0 : fdbCode.display) || '',
                        fdbCode: (fdbCode === null || fdbCode === void 0 ? void 0 : fdbCode.code) || '',
                    };
                }));
            });
        }, 200);
        return function () { clearTimeout(t); };
    }, [session, query, (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.dataSource]);
    return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Autocomplete, { multiple: true, value: value, options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
                        if (!v) {
                            return;
                        }
                        onChange(v, field.id);
                        setResults([]);
                    }, getOptionLabel: function (v) { return first_letter_capitalized(v.displayTerm); }, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search medications..." }))); }, renderTags: function (value, getTagProps) {
                        return value.map(function (value, index) { return (_jsx(Chip, __assign({ label: _jsx(Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: value.displayTerm })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
                    } }) })), (value || []).map(function (medication, i) {
                var _a;
                return (_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, direction: "column", spacing: 0.75 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ noWrap: true, sx: { fontSize: 14 } }, { children: medication.drugName })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(TextField, { InputProps: { sx: defaultInputProps.sx }, fullWidth: true, size: "small", label: "Medication instructions: how much you take, how often, and when", value: ((_a = medication.dosage) === null || _a === void 0 ? void 0 : _a.description) || '', onChange: function (e) { return (onChange((value || []).map(function (v, _i) {
                                        return i === _i
                                            ? __assign(__assign({}, v), { dosage: __assign(__assign({}, v.dosage), { description: e.target.value }) }) : v;
                                    }), field.id)); } }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Divider, { flexItem: true, sx: { my: 0.5 } }) }))] })) }), i));
            })] })));
};
export var MedicationsInput = function (_a) {
    var _b, _d;
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var _e = useMedications({
        dontFetch: ((_b = field.options) === null || _b === void 0 ? void 0 : _b.dataSource) === CANVAS_TITLE
    }), displayTerms = _e.displayTerms, doneLoading = _e.doneLoading, getCodesForDrug = _e.getCodesForDrug, getDrugsForDisplayTerm = _e.getDrugsForDisplayTerm;
    var _f = useState({}), drugs = _f[0], setDrugs = _f[1];
    // uncomment to load data after initial typing
    // const [query, setQuery] = useState('')
    // useEffect(() => {
    //   if (!value?.length) return
    //   Promise.all((value ?? []).map(v => (
    //     v.displayTerm ? getDrugsForDisplayTerm(v.displayTerm) : null
    //   )))
    //   .then(values => {
    //     const toSet: typeof drugs = {}
    //     values.forEach((v, i) => {
    //       toSet[value[i].displayTerm] = v ?? []
    //       if (!v?.length) {
    //         // drug is unknown, and previously looked-up NDCs and rxNormCode should be reset
    //         value[i].drugName = "Unknown"
    //         value[i].NDCs = []
    //         value[i].rxNormCode = ''
    //       }
    //     })
    //     setDrugs(toSet)
    //   })
    //   .catch(console.error)
    // }, [value, getDrugsForDisplayTerm])
    if (((_d = field.options) === null || _d === void 0 ? void 0 : _d.dataSource) === CANVAS_TITLE) {
        return _jsx(CanvasMedicationsInput, __assign({ field: field, value: value, onChange: onChange }, props));
    }
    return (_jsxs(Grid, __assign({ container: true, direction: "column", sx: { mt: 2 } }, { children: [(value !== null && value !== void 0 ? value : []).map(function (v, i) {
                var _a, _b, _d, _e, _f, _g, _h, _j, _k, _l;
                return (_jsxs(_Fragment, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: _jsx(Grid, __assign({ item: true, sx: { width: '100%' } }, { children: _jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Autocomplete, { freeSolo: false, multiple: false, loading: !doneLoading, options: 
                                                    // uncomment to load data after initial typing
                                                    // query.length === 0 ? [] :
                                                    ((_b = (_a = displayTerms === null || displayTerms === void 0 ? void 0 : displayTerms.displayTermsList) === null || _a === void 0 ? void 0 : _a.term) !== null && _b !== void 0 ? _b : []), 
                                                    // uncomment to load data after initial typing
                                                    // noOptionsText={query.length === 0 ? "Start typing..." : undefined}
                                                    // uncomment to load data after initial typing
                                                    // inputValue={query} onInputChange={(e, v) => setQuery(v)}
                                                    getOptionLabel: first_letter_capitalized, filterOptions: filterOptions, value: v.displayTerm, onChange: function (_, displayTerm) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var drugs, _a;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0:
                                                                    if (!displayTerm) return [3 /*break*/, 2];
                                                                    return [4 /*yield*/, getDrugsForDisplayTerm(displayTerm)];
                                                                case 1:
                                                                    _a = _b.sent();
                                                                    return [3 /*break*/, 3];
                                                                case 2:
                                                                    _a = null;
                                                                    _b.label = 3;
                                                                case 3:
                                                                    drugs = _a;
                                                                    if (displayTerm) {
                                                                        setDrugs(function (ds) {
                                                                            var _a;
                                                                            return (__assign(__assign({}, ds), (_a = {}, _a[displayTerm] = drugs !== null && drugs !== void 0 ? drugs : [], _a)));
                                                                        });
                                                                    }
                                                                    onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                        ? __assign(__assign({}, _v), { displayTerm: displayTerm || '', drugName: (drugs === null || drugs === void 0 ? void 0 : drugs.length) ? '' : "Unknown", drugSynonym: '', reasonForTaking: '', dosage: {
                                                                                unit: '',
                                                                                value: '',
                                                                                quantity: '',
                                                                                frequency: '',
                                                                            }, 
                                                                            // reset these on new search term to avoid stale data
                                                                            NDCs: [], rxNormCode: '' }) : _v); }), field.id);
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }, renderInput: function (params) {
                                                        return _jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, label: "Search", size: "small", fullWidth: true }));
                                                    } }) })), v.displayTerm && v.drugName !== "Unknown" && !v.otherDrug &&
                                                _jsx(Grid, __assign({ item: true, sx: { mt: 1.5 } }, { children: _jsx(Autocomplete, { freeSolo: false, options: drugs[v.displayTerm]
                                                            ? drugs[v.displayTerm].length
                                                                ? drugs[v.displayTerm]
                                                                : [{ name: 'Unknown', rxcui: '' }]
                                                            : [] // still loading
                                                        , multiple: false, getOptionLabel: function (d) { return (d === null || d === void 0 ? void 0 : d.synonym) ? d.synonym : ((d === null || d === void 0 ? void 0 : d.name) || ''); }, value: (_e = __spreadArray(__spreadArray([], (_d = drugs[v.displayTerm]) !== null && _d !== void 0 ? _d : [], true), [{ name: "Unknown", rxcui: '' }], false).find(function (d) { return d.name === v.drugName; })) !== null && _e !== void 0 ? _e : null, onChange: function (_, drug) { return __awaiter(void 0, void 0, void 0, function () {
                                                            var info, _a;
                                                            return __generator(this, function (_b) {
                                                                switch (_b.label) {
                                                                    case 0:
                                                                        if (!drug)
                                                                            return [2 /*return*/];
                                                                        if (!(drug.name === 'Unknown')) return [3 /*break*/, 2];
                                                                        return [4 /*yield*/, getCodesForDrug(v.displayTerm)]; // might get us a value, better than searching Unknown or keeping a prior value
                                                                    case 1:
                                                                        _a = _b.sent(); // might get us a value, better than searching Unknown or keeping a prior value
                                                                        return [3 /*break*/, 4];
                                                                    case 2: return [4 /*yield*/, getCodesForDrug(drug.name)];
                                                                    case 3:
                                                                        _a = _b.sent();
                                                                        _b.label = 4;
                                                                    case 4:
                                                                        info = (_a);
                                                                        onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                            ? __assign(__assign(__assign({}, _v), { drugName: drug.name, drugSynonym: drug.synonym || '' }), info) : _v); }), field.id);
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }, renderInput: function (params) {
                                                            return _jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, label: "Drug Select", size: "small", fullWidth: true }));
                                                        } }) })), v.displayTerm && (v.drugName === "Unknown" || !v.drugName) &&
                                                _jsx(Grid, __assign({ item: true, sx: { mt: 1 } }, { children: _jsx(TextField, { label: 'Other Drug', fullWidth: true, size: "small", required: true, InputProps: defaultInputProps, value: (_g = (_f = value === null || value === void 0 ? void 0 : value.find(function (v, _i) { return _i === i; })) === null || _f === void 0 ? void 0 : _f.otherDrug) !== null && _g !== void 0 ? _g : '', onChange: function (e) { return (onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                            ? __assign(__assign({}, _v), { otherDrug: e.target.value }) : _v); }), field.id)); } }) })), v.displayTerm &&
                                                _jsxs(Grid, __assign({ container: true, spacing: 1, sx: { mt: 0 } }, { children: [_jsxs(Grid, __assign({ item: true, xs: 12, md: 6 }, { children: [_jsx(Typography, __assign({ sx: { fontSize: 13.5 } }, { children: "Units (e.g. capsule, table, puff) per dose?" })), _jsx(TextField, { type: "number", size: "small", fullWidth: true, InputProps: defaultInputProps, value: (_h = v.dosage) === null || _h === void 0 ? void 0 : _h.quantity, onChange: function (e) {
                                                                        return onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                            ? __assign(__assign({}, _v), { dosage: __assign(__assign({}, _v.dosage), { quantity: e.target.value }) }) : _v); }), field.id);
                                                                    }, 
                                                                    // hide arrows for number input, which continue to increase after initial press
                                                                    sx: {
                                                                        '& input[type=number]': {
                                                                            '-moz-appearance': 'textfield'
                                                                        },
                                                                        '& input[type=number]::-webkit-outer-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        },
                                                                        '& input[type=number]::-webkit-inner-spin-button': {
                                                                            '-webkit-appearance': 'none',
                                                                            margin: 0
                                                                        }
                                                                    } })] })), _jsxs(Grid, __assign({ item: true, xs: 12, md: 6 }, { children: [_jsxs(Typography, __assign({ sx: { fontSize: 13.5 } }, { children: ["How many times per ", _jsx("strong", { children: "day" }), "?"] })), _jsx(StringSelector, { size: "small", options: ["1", "2", "3", "4", "5", "6", "As Needed"], value: (_k = (_j = v.dosage) === null || _j === void 0 ? void 0 : _j.frequency) !== null && _k !== void 0 ? _k : '', onChange: function (frequency) { return __awaiter(void 0, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                                ? __assign(__assign({}, _v), { dosage: __assign(__assign({}, _v.dosage), { frequency: frequency || '' }) }) : _v); }), field.id);
                                                                            return [2 /*return*/];
                                                                        });
                                                                    }); } })] }))] })), v.displayTerm &&
                                                _jsx(Grid, __assign({ item: true, sx: { mt: 1.25 } }, { children: _jsx(TextField, { label: "Reason for taking medication", size: "small", fullWidth: true, InputProps: defaultInputProps, value: (_l = v.reasonForTaking) !== null && _l !== void 0 ? _l : '', onChange: function (e) {
                                                            return onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                ? __assign(__assign({}, _v), { reasonForTaking: e.target.value }) : _v); }), field.id);
                                                        } }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "primary", sx: { textDecoration: 'underline', cursor: 'pointer' }, onClick: function () { return onChange((value !== null && value !== void 0 ? value : []).filter(function (_, _i) { return i !== _i; }), field.id); } }, { children: "Remove medication" })) })), window.location.origin.includes(':300') && i === 0 &&
                                                _jsxs(Grid, __assign({ item: true, sx: { mt: 3 } }, { children: [_jsx("strong", { children: "DEBUG:" }), " ", _jsx("br", {}), _jsx("pre", __assign({ style: { wordWrap: 'break-word' } }, { children: JSON.stringify(value !== null && value !== void 0 ? value : {}, null, 2) }))] })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Grid, { container: true }) }))] })) })) })) }), i), _jsx(Grid, __assign({ item: true }, { children: _jsx(Divider, { flexItem: true, sx: { my: 1 } }) }))] }));
            }), _jsx(Grid, __assign({ item: true }, { children: _jsx(Button, __assign({ color: "primary", variant: "outlined", onClick: function () { return onChange(__spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []), true), [{ displayTerm: '', drugName: '' }], false), field.id); } }, { children: "Add Medication" })) }))] })));
};
export var BelugaPatientPreferenceInput = function (_a) {
    var field = _a.field, _value = _a.value, onChange = _a.onChange;
    var value = Array.isArray(_value) ? _value : [];
    return (_jsxs(Grid, __assign({ container: true, direction: "column", sx: { mt: 2 } }, { children: [value.map(function (v, i) {
                var _a, _b, _d, _e, _f, _g, _h, _j;
                return (_jsxs(_Fragment, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: _jsx(Grid, __assign({ item: true, sx: { width: '100%' } }, { children: _jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1.5 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(TextField, { label: "Medication Name", size: "small", fullWidth: true, required: true, value: (_a = v.name) !== null && _a !== void 0 ? _a : '', onChange: function (e) {
                                                        return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { name: e.target.value }) : _v); }), field.id);
                                                    } }) })), _jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true, xs: 12, md: 6 }, { children: _jsx(TextField, { label: "Strength", size: "small", fullWidth: true, required: true, value: (_b = v.strength) !== null && _b !== void 0 ? _b : '', onChange: function (e) {
                                                                    return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { strength: e.target.value }) : _v); }), field.id);
                                                                } }) })), _jsx(Grid, __assign({ item: true, xs: 12, md: 6 }, { children: _jsx(TextField, { label: "Dispense Unit", size: "small", fullWidth: true, required: true, value: (_d = v.dispenseUnit) !== null && _d !== void 0 ? _d : '', onChange: function (e) {
                                                                    return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { dispenseUnit: e.target.value }) : _v); }), field.id);
                                                                } }) }))] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true, xs: 12, md: 4 }, { children: _jsx(TextField, { label: "Quantity", size: "small", fullWidth: true, required: true, value: (_e = v.quantity) !== null && _e !== void 0 ? _e : '', onChange: function (e) {
                                                                    return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { quantity: e.target.value }) : _v); }), field.id);
                                                                } }) })), _jsx(Grid, __assign({ item: true, xs: 12, md: 4 }, { children: _jsx(TextField, { label: "Refills", size: "small", fullWidth: true, required: true, value: (_f = v.refills) !== null && _f !== void 0 ? _f : '', onChange: function (e) {
                                                                    return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { refills: e.target.value }) : _v); }), field.id);
                                                                } }) })), _jsx(Grid, __assign({ item: true, xs: 12, md: 4 }, { children: _jsx(TextField, { label: "Days Supply", size: "small", fullWidth: true, required: true, value: (_g = v.daysSupply) !== null && _g !== void 0 ? _g : '', onChange: function (e) {
                                                                    return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { daysSupply: e.target.value }) : _v); }), field.id);
                                                                } }) }))] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(TextField, { label: "Sig (Instructions)", size: "small", fullWidth: true, required: true, multiline: true, rows: 2, value: (_h = v.sig) !== null && _h !== void 0 ? _h : '', onChange: function (e) {
                                                        return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { sig: e.target.value }) : _v); }), field.id);
                                                    } }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(TextField, { label: "Med ID (NDC11)", size: "small", fullWidth: true, required: true, value: (_j = v.medId) !== null && _j !== void 0 ? _j : '', onChange: function (e) {
                                                        return onChange(value.map(function (_v, _i) { return (i === _i ? __assign(__assign({}, _v), { medId: e.target.value }) : _v); }), field.id);
                                                    } }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "primary", sx: { textDecoration: 'underline', cursor: 'pointer' }, onClick: function () { return onChange(value.filter(function (_, _i) { return i !== _i; }), field.id); } }, { children: "Remove medication" })) }))] })) })) })) }), i), _jsx(Grid, __assign({ item: true }, { children: _jsx(Divider, { flexItem: true, sx: { my: 1 } }) }))] }));
            }), _jsx(Grid, __assign({ item: true }, { children: _jsx(Button, __assign({ color: "primary", variant: "outlined", onClick: function () { return onChange(__spreadArray(__spreadArray([], value, true), [
                        { name: '', strength: '', quantity: '', refills: '', daysSupply: '', sig: '', dispenseUnit: '', medId: '' }
                    ], false), field.id); } }, { children: "Add Medication" })) }))] })));
};
export var contact_is_valid = function (e) {
    if (e.email) {
        try {
            emailValidator.validate()(e.email);
        }
        catch (err) {
            return "Email is invalid";
        }
    }
    if (e.phone) {
        try {
            phoneValidator.validate()(e.phone);
        }
        catch (err) {
            return "Phone is invalid";
        }
    }
    if (e.dateOfBirth && !isDateString(e.dateOfBirth)) {
        return "Date of birth should be MM-DD-YYYY";
    }
};
export var RelatedContactsInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _w, _x;
    var field = _a.field, _value = _a.value, onChange = _a.onChange, parentError = _a.error, props = __rest(_a, ["field", "value", "onChange", "error"]);
    // safeguard against any rogue values like empty string
    var value = Array.isArray(_value) ? _value : [];
    var _y = useState(value.length === 1 ? 0 : -1), editing = _y[0], setEditing = _y[1];
    var handleAddContact = useCallback(function () {
        var _a, _b;
        onChange(__spreadArray(__spreadArray([], value, true), [
            { relationships: ((_b = (_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.relatedContactTypes) === null || _b === void 0 ? void 0 : _b.length) === 1 ? [{ type: field.options.relatedContactTypes[0], id: '' }] : [] }
        ], false), field.id, true);
        setEditing(value.length);
    }, [onChange, value, field === null || field === void 0 ? void 0 : field.id, (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.relatedContactTypes]);
    if (value[editing]) {
        var _z = value[editing], fname = _z.fname, lname = _z.lname, email = _z.email, phone = _z.phone, _0 = _z.fields, fields_1 = _0 === void 0 ? {} : _0, _1 = _z.dateOfBirth, dateOfBirth = _1 === void 0 ? '' : _1, relationships = _z.relationships;
        var errorMessage = contact_is_valid(value[editing]);
        return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", spacing: 1 }, { children: [!((_e = (_d = field.options) === null || _d === void 0 ? void 0 : _d.hiddenDefaultFields) === null || _e === void 0 ? void 0 : _e.includes('First Name')) &&
                                _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(TextField, { label: "First Name", size: "small", fullWidth: true, InputProps: defaultInputProps, value: fname, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { fname: e.target.value }) : v; }), field.id); } }) })), !((_g = (_f = field.options) === null || _f === void 0 ? void 0 : _f.hiddenDefaultFields) === null || _g === void 0 ? void 0 : _g.includes('Last Name')) &&
                                _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(TextField, { label: "Last Name", size: "small", fullWidth: true, InputProps: defaultInputProps, value: lname, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { lname: e.target.value }) : v; }), field.id); } }) })), _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(StringSelector, { options: ((_j = (_h = field.options) === null || _h === void 0 ? void 0 : _h.relatedContactTypes) === null || _j === void 0 ? void 0 : _j.length) ? field.options.relatedContactTypes : RELATIONSHIP_TYPES, label: "Relationship", size: "small", disabled: ((_l = (_k = field === null || field === void 0 ? void 0 : field.options) === null || _k === void 0 ? void 0 : _k.relatedContactTypes) === null || _l === void 0 ? void 0 : _l.length) === 1, value: (_o = (_m = relationships === null || relationships === void 0 ? void 0 : relationships[0]) === null || _m === void 0 ? void 0 : _m.type) !== null && _o !== void 0 ? _o : '', onChange: function (type) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { relationships: [{ type: type, id: '' /* to be filled on server-side */ }] }) : v; }), field.id); } }) }))] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", spacing: 1 }, { children: [!((_q = (_p = field.options) === null || _p === void 0 ? void 0 : _p.hiddenDefaultFields) === null || _q === void 0 ? void 0 : _q.includes('Date of Birth')) &&
                                _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(DateStringInput, { value: dateOfBirth, field: __assign(__assign({}, field), { isOptional: true }), size: "small", label: "Date of Birth (MM-DD-YYYY)", onChange: function (dateOfBirth) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { dateOfBirth: dateOfBirth }) : v; }), field.id); } }) })), !((_s = (_r = field.options) === null || _r === void 0 ? void 0 : _r.hiddenDefaultFields) === null || _s === void 0 ? void 0 : _s.includes('Email')) &&
                                _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(TextField, { label: "Email", size: "small", fullWidth: true, type: "email", InputProps: defaultInputProps, value: email, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { email: e.target.value }) : v; }), field.id); } }) })), !((_u = (_t = field.options) === null || _t === void 0 ? void 0 : _t.hiddenDefaultFields) === null || _u === void 0 ? void 0 : _u.includes('Phone Number')) &&
                                _jsx(Grid, __assign({ item: true, xs: 4 }, { children: _jsx(TextField, { label: "Phone Number", size: "small", fullWidth: true, InputProps: defaultInputProps, value: phone, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { phone: e.target.value.trim() }) : v; }), field.id); } }) }))] })) })), (((_w = field.options) === null || _w === void 0 ? void 0 : _w.tableChoices) || []).length > 0 &&
                    _jsx(Grid, __assign({ item: true }, { children: _jsx(Grid, __assign({ container: true, spacing: 1 }, { children: (((_x = field.options) === null || _x === void 0 ? void 0 : _x.tableChoices) || []).map(function (_a, i) {
                                var info = _a.info, label = _a.label, type = _a.type;
                                return (_jsx(Grid, __assign({ item: true, xs: 6 }, { children: type === 'Text'
                                        ? (_jsx(TextField, { label: label, size: "small", fullWidth: true, InputProps: defaultInputProps, value: fields_1[label] || '', onChange: function (e) { return onChange(value.map(function (v, i) {
                                                var _a;
                                                return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e.target.value, _a)) }) : v;
                                            }), field.id); } }))
                                        : type === 'Date' ? (_jsx(DateStringInput, { label: label, size: "small", fullWidth: true, field: __assign(__assign({}, field), { isOptional: true }), value: fields_1[label] || '', onChange: function (e) {
                                                if (e === void 0) { e = ''; }
                                                return onChange(value.map(function (v, i) {
                                                    var _a;
                                                    return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e, _a)) }) : v;
                                                }), field.id);
                                            } }))
                                            : type === 'Select' ? (_jsxs(FormControl, __assign({ size: "small", fullWidth: true }, { children: [_jsx(InputLabel, __assign({ id: "demo-select-small" }, { children: label })), _jsxs(Select, __assign({ label: label, size: "small", sx: defaultInputProps.sx, value: fields_1[label] || '', onChange: function (e) { return onChange(value.map(function (v, i) {
                                                            var _a;
                                                            return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e.target.value, _a)) }) : v;
                                                        }), field.id); } }, { children: [_jsx(MenuItem, __assign({ value: "" }, { children: _jsx("em", { children: "None" }) })), info.choices.map(function (c) { return (_jsx(MenuItem, __assign({ value: c }, { children: c }), c)); })] }))] })))
                                                : null }), i));
                            }) })) })), _jsx(Grid, __assign({ item: true, sx: { my: 0.75 } }, { children: _jsx(Button, __assign({ variant: "outlined", onClick: function () { return setEditing(-1); }, size: "small", disabled: !!errorMessage || !!parentError }, { children: "Save Contact" })) })), errorMessage &&
                    _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "error" }, { children: errorMessage })) }))] })));
    }
    return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: value.map(function (contact, i) { return (_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", wrap: "nowrap", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [_jsx(IconButton, __assign({ onClick: function () { return setEditing(i); }, color: "primary", size: "small" }, { children: _jsx(Edit, {}) })), _jsx(Typography, __assign({ noWrap: true }, { children: user_display_name(contact) || "Unnamed Contact ".concat(i + 1) }))] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(LabeledIconButton, { Icon: Delete, label: "Remove", onClick: function () { return onChange(value.filter(function (v, _i) { return i !== _i; }), field.id); } }) }))] })) }), i)); }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Button, __assign({ variant: "contained", onClick: handleAddContact }, { children: "Add Contact" })) }))] })));
};
export var AppointmentBookingInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l;
    var formResponseId = _a.formResponseId, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, responses = _a.responses, goToPreviousField = _a.goToPreviousField, isPreviousDisabled = _a.isPreviousDisabled, enduserId = _a.enduserId, props = __rest(_a, ["formResponseId", "field", "value", "onChange", "form", "responses", "goToPreviousField", "isPreviousDisabled", "enduserId"]);
    var session = useResolvedSession();
    var _m = useState(), loaded = _m[0], setLoaded = _m[1];
    var _o = useState(''), error = _o[0], setError = _o[1];
    var _p = useState(false), acknowledgedWarning = _p[0], setAcknowledgedWarning = _p[1];
    var _q = useState(450), height = _q[0], setHeight = _q[1];
    var _r = useState(false), confirming = _r[0], setConfirming = _r[1];
    var bookingPageId = (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.bookingPageId;
    var downloadICS = useCallback(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = downloadFile;
                    return [4 /*yield*/, session.api.calendar_events.download_ics_file({ calendarEventId: event.id, excludeAttendee: true })];
                case 1:
                    _a.apply(void 0, [_b.sent(),
                        { name: "event.ics", dataIsURL: true, type: 'text/calendar' }]);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [session]);
    var addressQuestion = useMemo(function () { return responses === null || responses === void 0 ? void 0 : responses.find(function (r) {
        var _a;
        if (r.answer.type !== 'Address')
            return false;
        if (r.field.intakeField !== 'Address')
            return false;
        // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
        if (!((_a = r.answer.value) === null || _a === void 0 ? void 0 : _a.state))
            return false;
        return true;
    }); }, [responses]);
    var state = useMemo(function () {
        var _a, _b, _d;
        return (((_a = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _a === void 0 ? void 0 : _a.type) === 'Address' ? (_d = (_b = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.state : undefined);
    }, [addressQuestion]);
    var loadBookingInfo = useCallback(function () {
        if (!bookingPageId)
            return;
        setError('');
        session.api.form_fields.booking_info({
            enduserId: enduserId,
            bookingPageId: bookingPageId,
            enduserFields: { state: state }
        })
            .then(setLoaded)
            .catch(function (e) { return setError((e === null || e === void 0 ? void 0 : e.message) || (e === null || e === void 0 ? void 0 : e.toString()) || 'Error loading appointment details'); });
    }, [enduserId, bookingPageId, session, state]);
    var fetchRef = useRef(false);
    useEffect(function () {
        if (value)
            return;
        if (!bookingPageId)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        loadBookingInfo();
    }, [bookingPageId, loadBookingInfo, value]);
    useEffect(function () {
        var handleMessage = function (m) {
            var _a, _b, _d, _e, _f, _g, _h, _j, _k;
            // entropy to separate from other booking pages rendered on the same screen
            if (((_a = m === null || m === void 0 ? void 0 : m.data) === null || _a === void 0 ? void 0 : _a.type) === 'Booking Success'
                && typeof ((_b = m === null || m === void 0 ? void 0 : m.data) === null || _b === void 0 ? void 0 : _b.bookedEventId) === 'string'
                && (!((_d = m === null || m === void 0 ? void 0 : m.data) === null || _d === void 0 ? void 0 : _d.entropy) || ((_e = m === null || m === void 0 ? void 0 : m.data) === null || _e === void 0 ? void 0 : _e.entropy) === (loaded === null || loaded === void 0 ? void 0 : loaded.entropy))) {
                onChange(m.data.bookedEventId, field.id);
                emit_gtm_event({ event: 'form_progress', fieldId: field.id, formId: field.formId, title: field.title, status: "Appointment Booked" });
            }
            if (((_f = m === null || m === void 0 ? void 0 : m.data) === null || _f === void 0 ? void 0 : _f.type) === 'CalendarPicker') {
                setHeight(750);
            }
            if (((_g = m === null || m === void 0 ? void 0 : m.data) === null || _g === void 0 ? void 0 : _g.type) === 'UsersPicker') {
                setHeight(450);
            }
            if (((_h = m === null || m === void 0 ? void 0 : m.data) === null || _h === void 0 ? void 0 : _h.type) === 'Confirmation') {
                setConfirming(true);
            }
            if (((_j = m === null || m === void 0 ? void 0 : m.data) === null || _j === void 0 ? void 0 : _j.type) === 'Join Link' && ((_k = m === null || m === void 0 ? void 0 : m.data) === null || _k === void 0 ? void 0 : _k.link)) {
                update_local_storage('tellescope_last_booking_page_join_link', m.data.link);
            }
            else {
                setConfirming(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return function () { window.removeEventListener('message', handleMessage); };
    }, [field === null || field === void 0 ? void 0 : field.id, field === null || field === void 0 ? void 0 : field.formId, field === null || field === void 0 ? void 0 : field.title, onChange, acknowledgedWarning, value, loaded === null || loaded === void 0 ? void 0 : loaded.entropy]);
    if (value) {
        return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [_jsx(CheckCircleOutline, { color: "success" }), _jsx(Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Your appointment has been booked" }))] })) })), _jsx(Grid, __assign({ item: true, sx: { maxWidth: 250 } }, { children: _jsx(LoadingButton, { variant: "contained", style: { maxWidth: 250 }, submitText: "Add to Calendar", submittingText: "Downloading...", onClick: function () { return downloadICS({ id: value }); } }) }))] })));
    }
    if (!bookingPageId) {
        return _jsx(Typography, { children: "No booking page specified" });
    }
    if (error) {
        return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsxs(Typography, __assign({ color: "error" }, { children: ["Error: ", error] })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(LoadingButton, { disabled: !bookingPageId, style: { maxWidth: 300 }, variant: "contained", onClick: loadBookingInfo, submitText: "Try Again", submittingText: "Loading..." }) }))] })));
    }
    if (!(loaded === null || loaded === void 0 ? void 0 : loaded.bookingURL)) {
        return _jsx(LinearProgress, {});
    }
    var bookingURL = loaded.bookingURL;
    if ((_e = (_d = field.options) === null || _d === void 0 ? void 0 : _d.userTags) === null || _e === void 0 ? void 0 : _e.length) {
        bookingURL += "&userTags=".concat(field.options.userTags
            .flatMap(function (t) {
            var _a, _b;
            // set dynamic tags if found
            if (t === '{{logic}}') {
                return new URL(window.location.href).searchParams.get('logic') || '{{logic}}';
            }
            if (t.startsWith("{{field.") && t.endsWith(".value}}")) {
                var fieldId_1 = t.replace('{{field.', '').replace(".value}}", '');
                var answer = (_a = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.fieldId === fieldId_1; })) === null || _a === void 0 ? void 0 : _a.answer;
                if (!(answer === null || answer === void 0 ? void 0 : answer.value))
                    return t;
                if (answer.type === 'Insurance') {
                    return answer.value.payerName || '';
                }
                if (Array.isArray(answer.value) && typeof ((_b = answer.value) === null || _b === void 0 ? void 0 : _b[0]) === 'string') {
                    return answer.value;
                }
                return form_response_value_to_string(answer.value);
            }
            return t;
        })
            .join(','));
    }
    if ((_g = (_f = field.options) === null || _f === void 0 ? void 0 : _f.userFilterTags) === null || _g === void 0 ? void 0 : _g.length) {
        bookingURL += "&userFilterTags=".concat(field.options.userFilterTags
            .flatMap(function (t) {
            var _a, _b;
            // set dynamic tags if found
            if (t === '{{logic}}') {
                return new URL(window.location.href).searchParams.get('logic') || '{{logic}}';
            }
            if (t.startsWith("{{field.") && t.endsWith(".value}}")) {
                var fieldId_2 = t.replace('{{field.', '').replace(".value}}", '');
                var answer = (_a = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.fieldId === fieldId_2; })) === null || _a === void 0 ? void 0 : _a.answer;
                if (!(answer === null || answer === void 0 ? void 0 : answer.value))
                    return t;
                if (answer.type === 'Insurance') {
                    return answer.value.payerName || '';
                }
                if (Array.isArray(answer.value) && typeof ((_b = answer.value) === null || _b === void 0 ? void 0 : _b[0]) === 'string') {
                    return answer.value;
                }
                return form_response_value_to_string(answer.value);
            }
            return t;
        })
            .join(','));
    }
    // need to use form?.id for internally-submitted forms because formResponseId isn't generated until initial submission or saved draft
    if (((_h = field.options) === null || _h === void 0 ? void 0 : _h.holdAppointmentMinutes) && (formResponseId || (field === null || field === void 0 ? void 0 : field.id))) {
        bookingURL += "&formResponseId=".concat(formResponseId || (field === null || field === void 0 ? void 0 : field.id));
        bookingURL += "&holdAppointmentMinutes=".concat(field.options.holdAppointmentMinutes);
    }
    return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1, sx: { mt: 1 } }, { children: [!!((_k = (_j = field.options) === null || _j === void 0 ? void 0 : _j.userFilterTags) === null || _k === void 0 ? void 0 : _k.length) && !((_l = field.options.userTags) === null || _l === void 0 ? void 0 : _l.length) && !(isPreviousDisabled === null || isPreviousDisabled === void 0 ? void 0 : isPreviousDisabled()) && !confirming &&
                _jsx(Grid, __assign({ item: true, alignSelf: "flex-start" }, { children: _jsx(Button, __assign({ variant: "outlined", onClick: goToPreviousField, sx: { height: 25, p: 0.5, px: 1 } }, { children: "Back" })) })), loaded.warningMessage &&
                _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ color: "error", sx: { fontSize: 20, fontWeight: 'bold' } }, { children: loaded.warningMessage })) })), _jsx(Grid, __assign({ item: true }, { children: (!loaded.warningMessage || acknowledgedWarning)
                    ? (_jsx("iframe", { title: "Appointment Booking Embed", src: bookingURL, style: { border: 'none', width: '100%', height: height } }))
                    : (_jsx(Button, __assign({ variant: "outlined", onClick: function () { return setAcknowledgedWarning(true); } }, { children: "Show Booking Page Preview" }))) }))] })));
};
export var HeightInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? {} : _d, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    return (_jsxs(Grid, __assign({ container: true, alignItems: 'center', wrap: "nowrap", spacing: 1, style: { marginTop: 5 } }, { children: [_jsx(Grid, __assign({ item: true, sx: { width: '100%' } }, { children: _jsx(TextField, { fullWidth: true, size: "small", label: "Feet", type: "number", value: (value === null || value === void 0 ? void 0 : value.feet) || '', onChange: function (e) { return onChange(__assign(__assign({}, value), { feet: parseInt(e.target.value) }), field.id); } }) })), _jsx(Grid, __assign({ item: true, sx: { width: '100%' } }, { children: _jsx(TextField, { fullWidth: true, size: "small", label: "Inches", type: "number", value: (_b = value === null || value === void 0 ? void 0 : value.inches) !== null && _b !== void 0 ? _b : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { inches: parseInt(e.target.value) }), field.id); } }) }))] })));
};
export var include_current_url_parameters_if_templated = function (url) {
    try {
        // get parameters from the current URL, and replace all values where {{URL_PARAM.paramName}} is used
        var params_1 = new URL(window.location.href).searchParams;
        return url.replace(/{{URL_PARAM\.(.*?)}}/g, function (_, paramName) {
            var value = params_1.get(paramName);
            console.log(paramName, value);
            if (value === null)
                return '';
            return value;
        });
    }
    catch (err) {
        console.error(err);
    }
    return url;
};
export var RedirectInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var enduserId = _a.enduserId, groupId = _a.groupId, groupInsance = _a.groupInsance, rootResponseId = _a.rootResponseId, formResponseId = _a.formResponseId, field = _a.field, submit = _a.submit, _u = _a.value, value = _u === void 0 ? {} : _u, onChange = _a.onChange, responses = _a.responses, enduser = _a.enduser, props = __rest(_a, ["enduserId", "groupId", "groupInsance", "rootResponseId", "formResponseId", "field", "submit", "value", "onChange", "responses", "enduser"]);
    var session = useResolvedSession();
    var eId = '';
    try {
        eId = new URL(window.location.href).searchParams.get('eId') || enduserId || (enduser === null || enduser === void 0 ? void 0 : enduser.id) || '';
    }
    catch (err) { }
    var email = (((_d = (_b = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'email'; })) === null || _b === void 0 ? void 0 : _b.answer) === null || _d === void 0 ? void 0 : _d.value)
        || (enduser === null || enduser === void 0 ? void 0 : enduser.email)
        || session.userInfo.email);
    var phone = (((_f = (_e = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'phone'; })) === null || _e === void 0 ? void 0 : _e.answer) === null || _f === void 0 ? void 0 : _f.value)
        || (enduser === null || enduser === void 0 ? void 0 : enduser.phone)
        || session.userInfo.phone);
    var fname = (((_h = (_g = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'fname'; })) === null || _g === void 0 ? void 0 : _g.answer) === null || _h === void 0 ? void 0 : _h.value)
        || (enduser === null || enduser === void 0 ? void 0 : enduser.fname)
        || ((_j = session.userInfo) === null || _j === void 0 ? void 0 : _j.fname));
    var lname = (((_l = (_k = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'lname'; })) === null || _k === void 0 ? void 0 : _k.answer) === null || _l === void 0 ? void 0 : _l.value)
        || (enduser === null || enduser === void 0 ? void 0 : enduser.lname)
        || ((_m = session.userInfo) === null || _m === void 0 ? void 0 : _m.lname));
    var state = (((_p = (_o = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'state'; })) === null || _o === void 0 ? void 0 : _o.answer) === null || _p === void 0 ? void 0 : _p.value)
        || ((_s = (_r = (_q = responses === null || responses === void 0 ? void 0 : responses.find(function (r) { return r.intakeField === 'Address'; })) === null || _q === void 0 ? void 0 : _q.answer) === null || _r === void 0 ? void 0 : _r.value) === null || _s === void 0 ? void 0 : _s.state)
        || (enduser === null || enduser === void 0 ? void 0 : enduser.state)
        || ((_t = session.userInfo) === null || _t === void 0 ? void 0 : _t.state));
    useEffect(function () {
        var _a, _b;
        if (session.type === 'user') {
            return;
        }
        if ((_a = field.options) === null || _a === void 0 ? void 0 : _a.redirectExternalUrl) {
            submit === null || submit === void 0 ? void 0 : submit().finally(function () {
                var _a;
                if (!((_a = field.options) === null || _a === void 0 ? void 0 : _a.redirectExternalUrl)) {
                    return;
                }
                window.location.href = (include_current_url_parameters_if_templated(replace_enduser_template_values(field.options.redirectExternalUrl, __assign(__assign({}, session.userInfo), { id: eId, email: email, fname: fname, lname: lname, state: state, phone: phone }))));
            }).catch(console.error);
            return;
        }
        if (!((_b = field.options) === null || _b === void 0 ? void 0 : _b.redirectFormId)) {
            return;
        }
        session.api.form_responses.prepare_form_response({
            enduserId: session.userInfo.id || eId,
            formId: field.options.redirectFormId,
            rootResponseId: rootResponseId || formResponseId,
            parentResponseId: formResponseId,
        })
            .then(function (_a) {
            var fullURL = _a.fullURL;
            return (
            // we should still redirect even if submission fails
            submit === null || submit === void 0 ? void 0 : submit().catch(console.error).finally(function () {
                // if accessing form group in portal
                if (window.location.href.includes('/documents') && groupId && groupInsance) {
                    var toRedirect = "".concat(window.location.origin, "/documents?groupId=").concat(groupId, "&groupInstance=").concat(groupInsance);
                    if (fullURL.endsWith('&')) {
                        window.location.replace(fullURL + "back=".concat(toRedirect, "&"));
                    }
                    else {
                        window.location.replace(fullURL + "&back=".concat(toRedirect));
                    }
                }
                else {
                    window.location.replace(fullURL);
                }
            }));
        })
            .catch(console.error);
    }, [session, email, fname, lname, state, phone]);
    if (session.type === 'user') {
        return (_jsx(Typography, { children: "Redirect is for patient-facing forms only" }));
    }
    return null;
};
export var HiddenValueInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, isSinglePage = _a.isSinglePage, groupFields = _a.groupFields;
    var lastRef = useRef(0);
    var lastIdRef = useRef('');
    // in a Question Group, only the first Hidden Value should navigate
    // AND, it should only navigate if the group only contains hidden values
    var firstHiddenValue = groupFields === null || groupFields === void 0 ? void 0 : groupFields.find(function (v) { return v.type === 'Hidden Value'; });
    var dontNavigate = ((firstHiddenValue && (firstHiddenValue === null || firstHiddenValue === void 0 ? void 0 : firstHiddenValue.id) !== field.id) // is in a group, but not the first hidden value
        || !!(groupFields === null || groupFields === void 0 ? void 0 : groupFields.find(function (v) { return v.type !== 'Hidden Value'; })) // group contains at least 1 non-hidden value
    );
    var publicIdentifier = useMemo(function () {
        try {
            return new URL(window.location.href).searchParams.get('publicIdentifier') || '';
        }
        catch (err) {
            return '';
        }
    }, []);
    var valueToSet = useMemo(function () { return ((field.title === "{{PUBLIC_IDENTIFIER}}" && publicIdentifier) ? publicIdentifier
        : field.title); }, [field.title, publicIdentifier]);
    useEffect(function () {
        if (lastRef.current > Date.now() - 1000 && lastIdRef.current === field.id)
            return;
        lastRef.current = Date.now();
        lastIdRef.current = field.id;
        if (value) {
            if (isSinglePage)
                return;
            onChange('', field.id);
            if (dontNavigate)
                return;
            goToPreviousField === null || goToPreviousField === void 0 ? void 0 : goToPreviousField();
        }
        else {
            onChange(valueToSet, field.id);
            if (dontNavigate)
                return;
            // pass value that is set after above onChange
            goToNextField === null || goToNextField === void 0 ? void 0 : goToNextField({ type: 'Hidden Value', value: valueToSet });
        }
    }, [value, onChange, field.id, valueToSet, goToNextField, goToPreviousField, isSinglePage, dontNavigate]);
    return _jsx(_Fragment, {});
};
export var EmotiiInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = useResolvedSession();
    var requestIdRef = useRef(value || "".concat(field.id).concat(formResponseId || Date.now()));
    var _b = useState(), data = _b[0], setData = _b[1];
    var _d = useState(0), loadCount = _d[0], setLoadCount = _d[1];
    var fetchRef = useRef(false);
    useEffect(function () {
        if (value)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        session.api.integrations
            .proxy_read({
            integration: EMOTII_TITLE,
            type: 'get_survey',
            id: props === null || props === void 0 ? void 0 : props.enduserId,
            query: requestIdRef.current,
        })
            .then(function (r) { return setData(r.data); });
    }, [session, value, props === null || props === void 0 ? void 0 : props.enduserId]);
    var loadAnswerRef = useRef(false);
    useEffect(function () {
        if (loadCount !== 2)
            return;
        if (loadAnswerRef.current)
            return;
        loadAnswerRef.current = true;
        onChange(requestIdRef.current, field.id);
    }, [loadCount]);
    if (value || loadCount === 2)
        return (_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [_jsx(CheckCircleOutline, { color: "success" }), _jsx(Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Please click Next or Submit to continue." }))] })));
    if (!data) {
        return _jsx(LinearProgress, {});
    }
    return (_jsx("iframe", { src: data.surveyUrl, style: { border: 'none', height: 650, width: '100%' }, onLoad: function () { return setLoadCount(function (l) { return l + 1; }); } }));
};
export var AllergiesInput = function (_a) {
    var _b;
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = useResolvedSession();
    var _d = useState(''), query = _d[0], setQuery = _d[1];
    var _e = useState([]), results = _e[0], setResults = _e[1];
    // if two allergy questions shown in a row, reset state
    useEffect(function () {
        setQuery('');
        setResults([]);
    }, [field.id]);
    var fetchRef = useRef(query);
    useEffect(function () {
        if (fetchRef.current === query)
            return;
        fetchRef.current = query;
        if (!query)
            return;
        var t = setTimeout(function () {
            var _a;
            if (((_a = field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === CANVAS_TITLE) {
                session.api.integrations
                    .proxy_read({
                    integration: CANVAS_TITLE,
                    type: 'allergies',
                    query: query,
                })
                    .then(function (r) {
                    var deduped = [];
                    var totalResults = ((r.data.entry || [])
                        .flatMap(function (v) { var _a, _b; return ((_b = (_a = v === null || v === void 0 ? void 0 : v.resource) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.coding) || []; })
                        .filter(function (v) { return v.system.includes('fdbhealth'); })
                        .map(function (v) { return ({ code: v.code, display: v.display, system: v.system }); }));
                    var _loop_2 = function (v) {
                        if (deduped.find(function (d) { return d.display === v.display; })) {
                            return "continue";
                        }
                        deduped.push(v);
                    };
                    for (var _a = 0, totalResults_1 = totalResults; _a < totalResults_1.length; _a++) {
                        var v = totalResults_1[_a];
                        _loop_2(v);
                    }
                    setResults(deduped);
                });
            }
            else {
                session.api.allergy_codes.getSome({ search: { query: query } })
                    .then(function (results) {
                    var deduped = [];
                    var _loop_3 = function (v) {
                        if (deduped.find(function (d) { return d.display === v.display; })) {
                            return "continue";
                        }
                        deduped.push(v);
                    };
                    for (var _a = 0, results_1 = results; _a < results_1.length; _a++) {
                        var v = results_1[_a];
                        _loop_3(v);
                    }
                    setResults(deduped);
                });
            }
        }, 200);
        return function () { clearTimeout(t); };
    }, [session, query, (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.dataSource]);
    return (_jsxs(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Autocomplete, { multiple: true, value: value || [], options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
                        if (!v) {
                            return;
                        }
                        onChange(v, field.id);
                        setResults([]);
                    }, getOptionLabel: function (v) { return first_letter_capitalized(v.display); }, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search allergies..." }))); }, renderTags: function (value, getTagProps) {
                        return value.map(function (value, index) { return (_jsx(Chip, __assign({ label: _jsx(Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: value.display })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
                    } }) })), (value || []).map(function (allergy, i) { return (_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", columnGap: 0.5, justifyContent: "space-between" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ noWrap: true, sx: { width: 85, fontSize: 14 } }, { children: allergy.display })) })), _jsx(Grid, __assign({ item: true, sx: { width: 140 } }, { children: _jsx(StringSelector, { options: ['mild', 'moderate', 'severe'], size: "small", label: "Severity", value: allergy.severity || '', onChange: function (severity) { return onChange((value || []).map(function (v, _i) { return i === _i ? __assign(__assign({}, v), { severity: severity }) : v; }), field.id); }, getDisplayValue: first_letter_capitalized }) })), _jsx(Grid, __assign({ item: true, sx: { width: "50%" } }, { children: _jsx(TextField, { InputProps: { sx: defaultInputProps.sx }, fullWidth: true, size: "small", label: "Note", value: allergy.note || '', onChange: function (e) { return onChange((value || []).map(function (v, _i) { return i === _i ? __assign(__assign({}, v), { note: e.target.value }) : v; }), field.id); } }) }))] })) }), i)); })] })));
};
var display_with_code = function (v) { return "".concat(v.code, ": ").concat(first_letter_capitalized(v.display)); };
export var ConditionsInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = useResolvedSession();
    var _b = useState(''), query = _b[0], setQuery = _b[1];
    var _d = useState([]), results = _d[0], setResults = _d[1];
    var fetchRef = useRef(query);
    useEffect(function () {
        if (fetchRef.current === query)
            return;
        fetchRef.current = query;
        if (!query)
            return;
        var t = setTimeout(function () {
            session.api.diagnosis_codes.getSome({ search: { query: query } })
                .then(function (codes) {
                var deduped = [];
                var _loop_4 = function (v) {
                    if (deduped.find(function (d) { return d.display === v.display; })) {
                        return "continue";
                    }
                    deduped.push(v);
                };
                for (var _a = 0, codes_1 = codes; _a < codes_1.length; _a++) {
                    var v = codes_1[_a];
                    _loop_4(v);
                }
                setResults(deduped);
            });
        }, 200);
        return function () { clearTimeout(t); };
    }, [session, query]);
    return (_jsx(Autocomplete, { multiple: true, value: value || [], options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
            if (!v) {
                return;
            }
            onChange(v, field.id);
            setResults([]);
        }, getOptionLabel: display_with_code, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return (_jsx(TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search conditions..." }))); }, renderTags: function (value, getTagProps) {
            return value.map(function (value, index) { return (_jsx(Chip, __assign({ label: _jsx(Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: display_with_code(value) })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
        } }));
};
export var RichTextInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    return (_jsx(WYSIWYG, { stopEnterPropagation: true, initialHTML: value, onChange: function (v) { return onChange(v, field.id); }, style: { width: '100%' }, editorStyle: { width: '100%' } }));
};
export var ChargeebeeInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, setCustomerId = _a.setCustomerId;
    var session = useResolvedSession();
    var _b = useState(''), url = _b[0], setUrl = _b[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    var _e = useState(0), loadCount = _e[0], setLoadCount = _e[1];
    var fetchRef = useRef(false);
    useEffect(function () {
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        session.api.form_responses.chargebee_details({ fieldId: field.id })
            .then(function (_a) {
            var url = _a.url;
            return setUrl(url);
        })
            .catch(setError);
    }, [session]);
    var loadAnswerRef = useRef(false);
    useEffect(function () {
        if (loadCount !== 2)
            return;
        if (loadAnswerRef.current)
            return;
        loadAnswerRef.current = true;
        onChange({ url: url }, field.id);
    }, [loadCount, url]);
    if (value || loadCount === 2) {
        return (_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [_jsx(CheckCircleOutline, { color: "success" }), _jsx(Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Your purchase was successful" }))] })));
    }
    if (error && typeof error === 'string')
        return _jsx(Typography, __assign({ color: "error" }, { children: error }));
    if (!url)
        return _jsx(LinearProgress, {});
    return (_jsx("iframe", { src: url, title: "Checkout", style: { border: 'none', width: '100%', height: 700 }, onLoad: function () { return setLoadCount(function (l) { return l + 1; }); } }));
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=inputs.js.map