"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeebeeInput = exports.RichTextInput = exports.ConditionsInput = exports.AllergiesInput = exports.EmotiiInput = exports.HiddenValueInput = exports.RedirectInput = exports.HeightInput = exports.AppointmentBookingInput = exports.RelatedContactsInput = exports.contact_is_valid = exports.MedicationsInput = exports.CanvasMedicationsInput = exports.DatabaseSelectInput = exports.DropdownInput = exports.Progress = exports.StripeInput = exports.MultipleChoiceInput = exports.FilesInput = exports.safe_create_url = exports.FileInput = exports.convertHEIC = exports.SignatureInput = exports.ESignatureTerms = exports.AddressInput = exports.TimeInput = exports.InsuranceInput = exports.NumberInput = exports.EmailInput = exports.PhoneInput = exports.StringLongInput = exports.StringInput = exports.DateStringInput = exports.AutoFocusTextField = exports.TableInput = exports.DateInput = exports.RankingInput = exports.RatingInput = exports.PdfViewer = exports.defaultButtonStyles = exports.defaultInputProps = exports.LanguageSelect = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
var material_1 = require("@mui/material");
var react_dropzone_1 = require("react-dropzone");
var constants_1 = require("@tellescope/constants");
var utilities_1 = require("@tellescope/utilities");
var validation_1 = require("@tellescope/validation");
var Slider_1 = __importDefault(require("@mui/material/Slider"));
var LinearProgress_1 = __importDefault(require("@mui/material/LinearProgress"));
var react_datepicker_1 = __importDefault(require("react-datepicker"));
var react_datepicker_2 = require("./css/react-datepicker"); // avoids build issue with RN
var __1 = require("..");
var css_1 = require("@emotion/css");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var DragIndicator_1 = __importDefault(require("@mui/icons-material/DragIndicator"));
var heic2any_1 = __importDefault(require("heic2any"));
var AddPhotoAlternate_1 = __importDefault(require("@mui/icons-material/AddPhotoAlternate"));
var Language_1 = __importDefault(require("@mui/icons-material/Language"));
var react_stripe_js_1 = require("@stripe/react-stripe-js");
var stripe_js_1 = require("@stripe/stripe-js");
var icons_material_1 = require("@mui/icons-material");
var wysiwyg_1 = require("./wysiwyg");
var LanguageSelect = function (_a) {
    var value = _a.value, props = __rest(_a, ["value"]);
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "center", wrap: "nowrap", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(Language_1.default, { color: "primary" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, style: { width: 150 } }, { children: (0, jsx_runtime_1.jsx)(StringSelector, __assign({}, props, { options: ["English", "Español"], size: "small", value: value === 'Spanish' ? 'Español' : value, label: (value === 'Español' || value === 'Spanish') ? 'Idioma'
                        : "Language" })) }))] })));
};
exports.LanguageSelect = LanguageSelect;
exports.defaultInputProps = { sx: {
        borderRadius: 4,
        // boxShadow: '2px 2px 2px #00000033',
    } };
exports.defaultButtonStyles = {
    borderRadius: '10px',
};
var PdfViewer = function (_a) {
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsx)("iframe", { src: 
                // url
                // encodeURI(`http://localhost:5173?url=${url}`)
                // encodeURI(`http://tellescope-pdf-renderer.s3-website.us-east-2.amazonaws.com?url=${url}`)
                encodeURI("https://pdf.tellescope.com?url=".concat(url)), title: "PDF Viewer", style: {
                    border: 'none',
                    height: height,
                    width: '100%',
                    marginBottom: '5px'
                } }), (0, jsx_runtime_1.jsx)("a", __assign({ href: url, target: "__blank", rel: "noopener noreferrer", style: { marginTop: 5 } }, { children: "View in new tab or download here" }))] })));
};
exports.PdfViewer = PdfViewer;
var RatingInput = function (_a) {
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
    return ((0, jsx_runtime_1.jsx)(Slider_1.default, { min: from, max: to, step: step, marks: marks, valueLabelDisplay: marks.length < allMarks.length ? 'auto' : "off", value: value, onChange: function (e, v) { return onChange(v, field.id); } }));
};
exports.RatingInput = RatingInput;
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
var RankingInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: 'column' }, { children: [(0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.DragDropContext, __assign({ onDragEnd: function (result) {
                    if (!value)
                        return;
                    if (!result.destination) {
                        return;
                    }
                    onChange(reorder(value, result.source.index, result.destination.index), field.id);
                } }, { children: (0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Droppable, __assign({ droppableId: "droppable" }, { children: function (provided, snapshot) { return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({}, provided.droppableProps, { ref: provided.innerRef, sx: getListStyle(snapshot.isDraggingOver) }, { children: [(value !== null && value !== void 0 ? value : []).map(function (item, index) { return ((0, jsx_runtime_1.jsx)(react_beautiful_dnd_1.Draggable, __assign({ draggableId: item, index: index }, { children: function (provided, snapshot) { return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { sx: getItemStyle(snapshot.isDragging, provided.draggableProps.style) }, { children: [item, (0, jsx_runtime_1.jsx)(DragIndicator_1.default, { color: "primary" })] }))); } }), item)); }), provided.placeholder] }))); } })) })), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "primary", style: { marginTop: 3 } }, { children: "Drag and drop to re-order the above options" }))] })));
};
exports.RankingInput = RankingInput;
var CustomDateInput = (0, react_1.forwardRef)(function (props, ref) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({ InputProps: exports.defaultInputProps, fullWidth: true, inputRef: ref }, props))); });
var DateInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, _b = _a.placement, placement = _b === void 0 ? 'top' : _b, props = __rest(_a, ["field", "value", "onChange", "placement"]);
    var inputRef = (0, react_1.useRef)(null);
    return ((0, jsx_runtime_1.jsx)(react_datepicker_1.default // wrap in item to prevent movement on focused
    , { selected: value, onChange: function (d) { return onChange === null || onChange === void 0 ? void 0 : onChange(d, field.id); }, showTimeSelect: true, required: !field.isOptional, dateFormat: "Pp", autoComplete: "off", timeIntervals: 15, popperPlacement: placement, customInput: (0, jsx_runtime_1.jsx)(CustomDateInput, __assign({ inputRef: inputRef }, props)), 
        // className={css`width: 100%;`}
        className: (0, css_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), react_datepicker_2.datepickerCSS) }));
};
exports.DateInput = DateInput;
var TableInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? [] : _d, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var choices = (_b = field.options) === null || _b === void 0 ? void 0 : _b.tableChoices;
    var handleNewRow = (0, react_1.useCallback)(function () {
        if (!(choices === null || choices === void 0 ? void 0 : choices.length))
            return;
        onChange(__spreadArray(__spreadArray([], value, true), [choices.map(function (c) { return ({
                label: c.label,
                entry: '',
            }); })], false), field.id, true);
    }, [value, field.id]);
    var handleChange = (0, react_1.useCallback)(function (r, c, u) {
        onChange(value.map(function (v, _i) {
            return _i !== r
                ? v
                : v.map(function (e, _c) { return _c === c ? u : e; });
        }), field.id, true);
    }, [value, onChange, field.id]);
    var handleRemove = (0, react_1.useCallback)(function (i) {
        onChange(value.filter(function (_, _i) { return i !== _i; }), field.id, true);
    }, [value, onChange, field.id]);
    (0, react_1.useEffect)(function () {
        if (field.isOptional)
            return;
        if (value.length)
            return;
        handleNewRow();
    }, [field.isOptional, value, handleNewRow]);
    if (!(choices === null || choices === void 0 ? void 0 : choices.length)) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error" }, { children: "No input choices available" }));
    }
    var length = choices.length || 1;
    var iconWidth = '35px';
    var width = "calc(".concat((100 / length).toFixed(2), "% - calc(").concat(iconWidth, " / ").concat(length, "))");
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [value.map(function (row, i) { return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", spacing: 1 }, { children: [choices.map(function (v, columnIndex) {
                                var _a, _b, _d;
                                return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: width } }, { children: v.type === 'Text'
                                        ? ((0, jsx_runtime_1.jsx)(material_1.TextField, { label: v.label, size: "small", fullWidth: true, title: v.label, InputProps: exports.defaultInputProps, value: (_a = row.find(function (c, _i) { return columnIndex === _i; })) === null || _a === void 0 ? void 0 : _a.entry, onChange: function (e) { return handleChange(i, columnIndex, { label: v.label, entry: e.target.value }); } }))
                                        : v.type === 'Date' ? ((0, jsx_runtime_1.jsx)(exports.DateStringInput, { label: v.label, size: "small", fullWidth: true, title: v.label, field: field, value: (_b = row.find(function (c, _i) { return columnIndex === _i; })) === null || _b === void 0 ? void 0 : _b.entry, onChange: function (entry) {
                                                if (entry === void 0) { entry = ''; }
                                                return handleChange(i, columnIndex, { label: v.label, entry: entry });
                                            } }))
                                            : v.type === 'Select' ? ((0, jsx_runtime_1.jsxs)(material_1.FormControl, __assign({ size: "small", fullWidth: true }, { children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, __assign({ id: "demo-select-small" }, { children: v.label })), (0, jsx_runtime_1.jsxs)(material_1.Select, __assign({ label: v.label, size: "small", title: v.label, sx: exports.defaultInputProps.sx, value: (_d = row.find(function (c, _i) { return columnIndex === _i; })) === null || _d === void 0 ? void 0 : _d.entry, onChange: function (e) { return handleChange(i, columnIndex, { label: v.label, entry: e.target.value }); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, __assign({ value: "" }, { children: (0, jsx_runtime_1.jsx)("em", { children: "None" }) })), v.info.choices.map(function (c) { return ((0, jsx_runtime_1.jsx)(material_1.MenuItem, __assign({ value: c }, { children: c }), c)); })] }))] })))
                                                : null }), v.label));
                            }), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { ml: 'auto', width: iconWidth } }, { children: (0, jsx_runtime_1.jsx)(__1.LabeledIconButton, { Icon: __1.CancelIcon, label: "Remove", onClick: function () { return handleRemove(i); }, disabled: !field.isOptional && value.length === 1 }) }))] }), i), (0, jsx_runtime_1.jsx)(material_1.Divider, { flexItem: true, sx: { my: 1 } })] })); }), (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "outlined", size: "small", onClick: handleNewRow, sx: { width: 200 } }, { children: "Add new entry" }))] })));
};
exports.TableInput = TableInput;
var AutoFocusTextField = function (props) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({ InputProps: exports.defaultInputProps }, props))); };
exports.AutoFocusTextField = AutoFocusTextField;
var CustomDateStringInput = (0, react_1.forwardRef)(function (props, ref) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({ InputProps: exports.defaultInputProps, fullWidth: true, inputRef: ref }, props))); });
var DateStringInput = function (_a) {
    var _b;
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var inputRef = (0, react_1.useRef)(null);
    // if (value && isDateString(value)) {
    //   console.log(value, new Date(
    //     new Date(MM_DD_YYYY_to_YYYY_MM_DD(value)).getTime()
    //   + (new Date().getTimezoneOffset() * 60 * 1000)
    //   ))
    // }
    return (((_b = field.options) === null || _b === void 0 ? void 0 : _b.useDatePicker)
        ? ((0, jsx_runtime_1.jsx)(react_datepicker_1.default // wrap in item to prevent movement on focused
        , { selected: (value && (0, __1.isDateString)(value))
                ? new Date(new Date((0, utilities_1.MM_DD_YYYY_to_YYYY_MM_DD)(value)).getTime()
                    + ((new Date().getTimezoneOffset() + 60) * 60 * 1000) // additional hour (60 minutes) needs to be added for date to line up properly
                )
                : undefined, onChange: function (d) { return onChange === null || onChange === void 0 ? void 0 : onChange((0, utilities_1.mm_dd_yyyy)(d), field.id); }, showTimeSelect: false, required: !field.isOptional, autoComplete: "off", dateFormat: "MM-dd-yyyy", customInput: (0, jsx_runtime_1.jsx)(CustomDateStringInput, __assign({ inputRef: inputRef }, props, { label: (!field.title && field.placeholder) ? field.placeholder : props.label })), 
            // className={css`width: 100%;`}
            className: (0, css_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ""], ["", ""])), react_datepicker_2.datepickerCSS) }))
        : ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, placeholder: "MM-DD-YYYY", value: value, label: (!field.title && field.placeholder) ? field.placeholder : props.label, onChange: function (e) {
                var v = e.target.value || '';
                onChange((v.length === 2 && /\d{2}/.test(v) && (value === null || value === void 0 ? void 0 : value.length) !== 3 // allow deletion
                    ? v + '-'
                    : v.length === 5 && /\d{2}-\d{2}/.test(v) && (value === null || value === void 0 ? void 0 : value.length) !== 6 // allow deletion
                        ? v + '-'
                        : v)
                    .replaceAll('/', '-'), field.id);
            } }))));
};
exports.DateStringInput = DateStringInput;
var StringInput = function (_a) {
    var field = _a.field, value = _a.value, form = _a.form, onChange = _a.onChange, props = __rest(_a, ["field", "value", "form", "onChange"]);
    return ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: (field.placeholder || (0, __1.form_display_text_for_language)(form, "Answer here...", '')), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
exports.StringInput = StringInput;
var StringLongInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { multiline: true, minRows: 3, maxRows: 8, required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || (0, __1.form_display_text_for_language)(form, "Answer here...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
exports.StringLongInput = StringLongInput;
var PhoneInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || (0, __1.form_display_text_for_language)(form, "Enter phone...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
exports.PhoneInput = PhoneInput;
var EmailInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, type: "email", value: value, onChange: function (e) { return onChange(e.target.value, field.id); }, placeholder: field.placeholder || (0, __1.form_display_text_for_language)(form, "Enter email...", ''), label: (!field.title && field.placeholder) ? field.placeholder : props.label })));
};
exports.EmailInput = EmailInput;
var NumberInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, props = __rest(_a, ["field", "value", "onChange", "form"]);
    return ((0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { required: !field.isOptional, fullWidth: true, type: "number", value: value, onChange: function (e) { return onChange(parseInt(e.target.value), field.id); }, label: (!field.title && field.placeholder) ? field.placeholder : props.label, placeholder: field.placeholder || (0, __1.form_display_text_for_language)(form, "Enter a number...", ''), sx: {
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
exports.NumberInput = NumberInput;
var InsuranceInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, responses = _a.responses, enduser = _a.enduser, props = __rest(_a, ["field", "value", "onChange", "form", "responses", "enduser"]);
    var session = (0, __1.useResolvedSession)();
    var _t = (0, react_1.useState)([]), payers = _t[0], setPayers = _t[1];
    var _u = (0, react_1.useState)(''), query = _u[0], setQuery = _u[1];
    var addressQuestion = (0, react_1.useMemo)(function () { return responses === null || responses === void 0 ? void 0 : responses.find(function (r) {
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
    var state = (0, react_1.useMemo)(function () {
        var _a, _b, _d;
        return ((((_a = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _a === void 0 ? void 0 : _a.type) === 'Address' ? (_d = (_b = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.state : undefined) || (enduser === null || enduser === void 0 ? void 0 : enduser.state));
    }, [enduser === null || enduser === void 0 ? void 0 : enduser.state, addressQuestion]);
    var loadRef = (0, react_1.useRef)(false); // so session changes don't cause
    (0, react_1.useEffect)(function () {
        var _a;
        if (((_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === constants_1.CANVAS_TITLE)
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
                });
            })
                .filter(function (c) { return !c.state || !state || (c.state === state); }));
        })
            .catch(console.error);
    }, [session, state, (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.dataSource]);
    var searchRef = (0, react_1.useRef)(query);
    (0, react_1.useEffect)(function () {
        var _a;
        if (((_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.dataSource) !== constants_1.CANVAS_TITLE) {
            return;
        }
        if (!query)
            return;
        if (searchRef.current === query)
            return;
        searchRef.current = query;
        session.api.integrations.proxy_read({
            integration: constants_1.CANVAS_TITLE,
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, spacing: 2, sx: { mt: '0' } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { freeSolo: !((_e = field.options) === null || _e === void 0 ? void 0 : _e.requirePredefinedInsurer), options: payers.map(function (p) { return p.name; }), value: (value === null || value === void 0 ? void 0 : value.payerName) || '', onChange: function (e, v) {
                        var _a, _b;
                        return onChange(__assign(__assign({}, value), { payerName: v || '', payerId: ((_a = payers.find(function (p) { return p.name === v; })) === null || _a === void 0 ? void 0 : _a.id) || '', payerType: ((_b = payers.find(function (p) { return p.name === v; })) === null || _b === void 0 ? void 0 : _b.type) || '' }), field.id);
                    }, onInputChange: ((_f = field.options) === null || _f === void 0 ? void 0 : _f.requirePredefinedInsurer)
                        ? function (e, v) { if (v) {
                            setQuery(v);
                        } }
                        : function (e, v) {
                            var _a, _b;
                            if (v) {
                                setQuery(v);
                            }
                            onChange(__assign(__assign({}, value), { payerName: v || '', payerId: ((_a = payers.find(function (p) { return p.name === v; })) === null || _a === void 0 ? void 0 : _a.id) || '', payerType: ((_b = payers.find(function (p) { return p.name === v; })) === null || _b === void 0 ? void 0 : _b.type) || '' }), field.id);
                        }, renderInput: function (params) {
                        var _a;
                        return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "Insurer", placeholder: ((_a = field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === constants_1.CANVAS_TITLE ? "Search insurer..." : "Insurer" })));
                    } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { InputProps: exports.defaultInputProps, required: !field.isOptional, fullWidth: true, value: (_g = value === null || value === void 0 ? void 0 : value.memberId) !== null && _g !== void 0 ? _g : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { memberId: e.target.value }), field.id); }, label: (0, __1.form_display_text_for_language)(form, "Member ID", ''), size: "small" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { InputProps: exports.defaultInputProps, required: false, fullWidth: true, value: (_h = value === null || value === void 0 ? void 0 : value.planName) !== null && _h !== void 0 ? _h : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { planName: e.target.value }), field.id); }, label: (0, __1.form_display_text_for_language)(form, "Plan Name", ''), size: "small" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12, sm: 6 }, { children: (0, jsx_runtime_1.jsx)(exports.DateStringInput, { size: "small", label: "Plan Start Date", field: __assign(__assign({}, field), { isOptional: true }), value: (value === null || value === void 0 ? void 0 : value.startDate) || '', onChange: function (startDate) {
                        return onChange(__assign(__assign({}, value), { startDate: startDate }), field.id);
                    } }) })), ((_j = field.options) === null || _j === void 0 ? void 0 : _j.includeGroupNumber) &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { InputProps: exports.defaultInputProps, fullWidth: true, value: (_k = value === null || value === void 0 ? void 0 : value.groupNumber) !== null && _k !== void 0 ? _k : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { groupNumber: e.target.value }), field.id); }, label: (0, __1.form_display_text_for_language)(form, "Group Number", ''), size: "small" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12 }, { children: (0, jsx_runtime_1.jsx)(StringSelector, { size: "small", label: "Relationship to Policy Owner", options: ((((_l = field.options) === null || _l === void 0 ? void 0 : _l.billingProvider) === constants_1.CANVAS_TITLE || ((_m = field.options) === null || _m === void 0 ? void 0 : _m.dataSource) === constants_1.CANVAS_TITLE)
                        ? constants_1.INSURANCE_RELATIONSHIPS_CANVAS
                        : constants_1.INSURANCE_RELATIONSHIPS)
                        .sort(function (x, y) { return x.localeCompare(y); }), value: (value === null || value === void 0 ? void 0 : value.relationship) || 'Self', onChange: function (relationship) {
                        return onChange(__assign(__assign({}, value), { relationship: relationship || 'Self' }), field.id);
                    } }) })), ((value === null || value === void 0 ? void 0 : value.relationship) || 'Self') !== 'Self' &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12 }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { fontWeight: 'bold' } }, { children: "Policy Owner Details" })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "First Name", size: "small", InputProps: exports.defaultInputProps, fullWidth: true, value: ((_o = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _o === void 0 ? void 0 : _o.fname) || '', required: !field.isOptional, onChange: function (e) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { fname: e.target.value }) }), field.id);
                                } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Last Name", size: "small", InputProps: exports.defaultInputProps, fullWidth: true, value: ((_p = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _p === void 0 ? void 0 : _p.lname) || '', required: !field.isOptional, onChange: function (e) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { lname: e.target.value }) }), field.id);
                                } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 6 }, { children: (0, jsx_runtime_1.jsx)(StringSelector, { options: constants_1.TELLESCOPE_GENDERS, size: "small", label: "Gender", value: ((_q = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _q === void 0 ? void 0 : _q.gender) || '', required: !field.isOptional, onChange: function (v) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { gender: v }) }), field.id);
                                } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 6 }, { children: (0, jsx_runtime_1.jsx)(exports.DateStringInput, { size: "small", label: "Date of Birth", field: __assign(__assign({}, field), { isOptional: field.isOptional || ((_r = field.options) === null || _r === void 0 ? void 0 : _r.billingProvider) === 'Candid' }), value: ((_s = value === null || value === void 0 ? void 0 : value.relationshipDetails) === null || _s === void 0 ? void 0 : _s.dateOfBirth) || '', onChange: function (dateOfBirth) {
                                    return onChange(__assign(__assign({}, value), { relationshipDetails: __assign(__assign({}, value === null || value === void 0 ? void 0 : value.relationshipDetails), { dateOfBirth: dateOfBirth }) }), field.id);
                                } }) }))] })] })));
};
exports.InsuranceInput = InsuranceInput;
var StringSelector = function (_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, required = _a.required, getDisplayValue = _a.getDisplayValue, props = __rest(_a, ["options", "value", "onChange", "required", "getDisplayValue"]);
    return ((0, jsx_runtime_1.jsxs)(material_1.FormControl, __assign({ fullWidth: true, size: props.size, required: required }, { children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { children: props.label }), (0, jsx_runtime_1.jsx)(material_1.Select, __assign({}, props, { value: value, onChange: function (e) { return onChange(e.target.value); }, fullWidth: true, sx: exports.defaultInputProps.sx }, { children: options.map(function (o, i) {
                    var _a;
                    return ((0, jsx_runtime_1.jsx)(material_1.MenuItem, __assign({ value: o }, { children: (_a = getDisplayValue === null || getDisplayValue === void 0 ? void 0 : getDisplayValue(o)) !== null && _a !== void 0 ? _a : o }), o || i));
                }) }))] })));
};
var HourSelector = function (props) { return ((0, jsx_runtime_1.jsx)(StringSelector, __assign({}, props, { options: Array(12).fill('').map(function (_, i) { return (i + 1) <= 9 ? "0".concat(i + 1) : (i + 1).toString(); }) }))); };
var MinuteSelector = function (props) { return ((0, jsx_runtime_1.jsx)(StringSelector, __assign({}, props, { options: Array(60).fill('').map(function (_, i) { return i <= 9 ? "0".concat(i) : i.toString(); }) }))); };
var AmPmSelector = function (props) { return ((0, jsx_runtime_1.jsx)(StringSelector, __assign({}, props, { options: ['AM', 'PM'] }))); };
var TimeInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var _b = (value || '').split(':'), hour = _b[0], _d = _b[1], rest = _d === void 0 ? '' : _d;
    var _e = rest.split(' '), minute = _e[0], amPm = _e[1], _f = _e[2], zone = _f === void 0 ? (0, utilities_1.getLocalTimezone)() : _f;
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: 'center', spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: 100 } }, { children: (0, jsx_runtime_1.jsx)(HourSelector, { value: hour, onChange: function (hour) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: 100 } }, { children: (0, jsx_runtime_1.jsx)(MinuteSelector, { value: minute, onChange: function (minute) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: 100 } }, { children: (0, jsx_runtime_1.jsx)(AmPmSelector, { value: amPm, onChange: function (amPm) { return onChange("".concat(hour, ":").concat(minute, " ").concat(amPm, " ").concat(zone), field.id); } }) }))] })));
};
exports.TimeInput = TimeInput;
var AddressInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var field = _a.field, form = _a.form, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "form", "value", "onChange"]);
    return (
    // state only
    ((_d = (_b = field.options) === null || _b === void 0 ? void 0 : _b.addressFields) === null || _d === void 0 ? void 0 : _d.includes('state'))
        ? ((0, jsx_runtime_1.jsx)(material_1.Autocomplete, __assign({ value: value === null || value === void 0 ? void 0 : value.state, options: ((_f = (_e = field.options) === null || _e === void 0 ? void 0 : _e.validStates) === null || _f === void 0 ? void 0 : _f.length) ? field.options.validStates : validation_1.VALID_STATES, disablePortal: true, onChange: function (e, v) { return v &&
                onChange(__assign(__assign({}, value), { state: v !== null && v !== void 0 ? v : '' }), field.id); }, renderInput: function (params) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, 
                // don't use 'small' so as to be consistent with other text fields, in case this is used in a group
                // size={'small'} 
                label: (0, __1.form_display_text_for_language)(form, "State") }))); } }, props)))
        : ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 2, sx: { mt: 0 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(exports.AutoFocusTextField, __assign({}, props, { size: "small", required: !field.isOptional, fullWidth: true, value: (_g = value === null || value === void 0 ? void 0 : value.addressLineOne) !== null && _g !== void 0 ? _g : '', label: (0, __1.form_display_text_for_language)(form, "Address Line 1"), placeholder: (0, __1.form_display_text_for_language)(form, "Address Line 1"), onChange: function (e) {
                            var _a;
                            return onChange(__assign(__assign({}, value), { addressLineOne: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                        } })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, props, { size: "small", required: false, fullWidth: true, InputProps: exports.defaultInputProps, value: (_h = value === null || value === void 0 ? void 0 : value.addressLineTwo) !== null && _h !== void 0 ? _h : '', label: (0, __1.form_display_text_for_language)(form, "Address Line 2"), placeholder: (0, __1.form_display_text_for_language)(form, "Address Line 2"), onChange: function (e) {
                            var _a;
                            return onChange(__assign(__assign({}, value), { addressLineTwo: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                        } })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12, sm: field.fullZIP ? 5 : 6 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, props, { size: "small", required: !field.isOptional, InputProps: exports.defaultInputProps, fullWidth: true, value: (_j = value === null || value === void 0 ? void 0 : value.city) !== null && _j !== void 0 ? _j : '', label: (0, __1.form_display_text_for_language)(form, "City"), placeholder: (0, __1.form_display_text_for_language)(form, "City"), onChange: function (e) {
                                        var _a;
                                        return onChange(__assign(__assign({}, value), { city: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                    } })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: field.fullZIP ? 4 : 6, sm: field.fullZIP ? 2 : 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, __assign({ value: value === null || value === void 0 ? void 0 : value.state, fullWidth: true, options: ((_l = (_k = field.options) === null || _k === void 0 ? void 0 : _k.validStates) === null || _l === void 0 ? void 0 : _l.length) ? field.options.validStates : validation_1.VALID_STATES, disablePortal: true, onChange: function (e, v) { return v &&
                                        onChange(__assign(__assign({}, value), { state: v !== null && v !== void 0 ? v : '' }), field.id); }, renderInput: function (params) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), size: 'small', required: !field.isOptional, label: (0, __1.form_display_text_for_language)(form, "State") }))); } }, props)) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: field.fullZIP ? 5 : 6, sm: field.fullZIP ? 2 : 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, props, { size: "small", required: !field.isOptional, InputProps: exports.defaultInputProps, fullWidth: true, value: (_m = value === null || value === void 0 ? void 0 : value.zipCode) !== null && _m !== void 0 ? _m : '', label: (0, __1.form_display_text_for_language)(form, "ZIP Code"), placeholder: (0, __1.form_display_text_for_language)(form, "ZIP Code"), onChange: function (e) {
                                        var _a;
                                        return onChange(__assign(__assign({}, value), { zipCode: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                    } })) })), field.fullZIP &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 3 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, props, { size: "small", label: "ZIP+4", required: !field.isOptional && field.fullZIP, InputProps: exports.defaultInputProps, value: (_o = value === null || value === void 0 ? void 0 : value.zipPlusFour) !== null && _o !== void 0 ? _o : '', placeholder: "ZIP + 4", onChange: function (e) {
                                            var _a;
                                            return onChange(__assign(__assign({}, value), { zipPlusFour: (_a = e.target.value) !== null && _a !== void 0 ? _a : '' }), field.id);
                                        } })) }))] })) }))] }))));
};
exports.AddressInput = AddressInput;
var ESignatureTerms = function () {
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
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { paddingLeft: 10 } }, { children: [(0, jsx_runtime_1.jsxs)("h1", { children: [companyName, " Electronic Signature Terms"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["By selecting the \"I consent to use electronic signatures\" checkbox, you are signing this Agreement electronically. You agree your electronic signature is the legal equivalent of your manual/handwritten signature on this Agreement. By selecting \"I consent to use electronic signatures\" using any device, means or action, you consent to the legally binding terms and conditions of this Agreement. You further agree that your signature on this document (hereafter referred to as your \"E-Signature\") is as valid as if you signed the document in writing. You also agree that no certification authority or other third party verification is necessary to validate your E-Signature, and that the lack of such certification or third party verification will not in any way affect the enforceability of your E-Signature or any resulting agreement between you and", companyName, " or between you and a customer of ", companyName, "."] })] })));
};
exports.ESignatureTerms = ESignatureTerms;
var SignatureInput = function (_a) {
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center" }, { children: [((_d = field.options) === null || _d === void 0 ? void 0 : _d.pdfAttachment) &&
                (0, jsx_runtime_1.jsx)(exports.PdfViewer, { url: (0, utilities_1.getPublicFileURL)({ businessId: field.businessId, name: field.options.pdfAttachment }) }), !((_e = field.options) === null || _e === void 0 ? void 0 : _e.pdfAttachment) && ((_f = field.options) === null || _f === void 0 ? void 0 : _f.signatureUrl) &&
                (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", sx: { mb: 2 } }, { children: [(0, jsx_runtime_1.jsx)("iframe", { src: field.options.signatureUrl, style: {
                                border: 'none',
                                height: 400,
                                width: '100%',
                                marginBottom: '5px'
                            } }), (0, jsx_runtime_1.jsx)("a", __assign({ href: field.options.signatureUrl, target: "_blank", rel: "noopener noreferrer" }, { children: "View document in new tab" }))] })), (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ item: true, xs: 12 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { style: { margin: 0, marginTop: 5, padding: 0, paddingRight: 3 }, color: "primary", checked: !!(value === null || value === void 0 ? void 0 : value.signed), onClick: function () { return handleConsentChange(); }, inputProps: { 'aria-label': 'consent to e-signature checkbox' } }), (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ component: "span", style: { position: 'relative', top: 5, left: 2 } }, { children: ["I consent to use ", (0, jsx_runtime_1.jsx)("a", __assign({ href: "/e-signature-terms?name=".concat(((_g = field.options) === null || _g === void 0 ? void 0 : _g.esignatureTermsCompanyName) || ''), target: "_blank", rel: "noopener noreferrer" }, { children: " electronic signatures " }))] }))] })), (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ item: true, xs: 12, style: { marginTop: 12 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { disabled: !(value === null || value === void 0 ? void 0 : value.signed), autoFocus: autoFocus, style: { width: '100%' }, size: "small", "aria-label": "Full Name", value: value === null || value === void 0 ? void 0 : value.fullName, placeholder: prefill || "Full Name", variant: "outlined", onChange: function (e) { return handleNameChange(e.target.value); }, InputProps: exports.defaultInputProps }), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "primary", style: { fontSize: 15, marginTop: 2 } }, { children: "Enter your legal full name to complete the signature" }))] }))] })));
};
exports.SignatureInput = SignatureInput;
function convertHEIC(file) {
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
                    return [4 /*yield*/, (0, heic2any_1.default)({ blob: blob })
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
exports.convertHEIC = convertHEIC;
;
var value_is_image = function (f) { var _a; return (_a = f === null || f === void 0 ? void 0 : f.type) === null || _a === void 0 ? void 0 : _a.includes('image'); };
var FileInput = function (_a) {
    var _b;
    var value = _a.value, onChange = _a.onChange, field = _a.field, existingFileName = _a.existingFileName, uploadingFiles = _a.uploadingFiles, handleFileUpload = _a.handleFileUpload, setUploadingFiles = _a.setUploadingFiles;
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_dropzone_1.useDropzone)({
        onDrop: (0, react_1.useCallback)(function (acceptedFiles) {
            var _a, _b, _d;
            var file = acceptedFiles.pop();
            if (!file)
                return;
            if ((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.validFileTypes) === null || _b === void 0 ? void 0 : _b.length) {
                var match = field.options.validFileTypes.find(function (t) { return file.type.includes(t.toLowerCase()); });
                if (!match) {
                    return setError("File must have type: ".concat(field.options.validFileTypes.join(', ')));
                }
            }
            setError('');
            onChange(file, field.id);
            if (((_d = field.options) === null || _d === void 0 ? void 0 : _d.autoUploadFiles) && handleFileUpload) {
                setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return __spreadArray(__spreadArray([], fs, true), [{ fieldId: field.id }], false); });
                handleFileUpload(file, field.id)
                    .finally(function () { return setUploadingFiles === null || setUploadingFiles === void 0 ? void 0 : setUploadingFiles(function (fs) { return fs.filter(function (f) { return f.fieldId !== field.id; }); }); });
            }
        }, [onChange, (_b = field.options) === null || _b === void 0 ? void 0 : _b.validFileTypes, handleFileUpload, setUploadingFiles]),
    }), getRootProps = _e.getRootProps, getInputProps = _e.getInputProps, isDragActive = _e.isDragActive;
    var _f = (0, react_1.useState)(''), preview = _f[0], setPreview = _f[1];
    (0, react_1.useEffect)(function () {
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
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true }, getRootProps(), { sx: {
                    width: "100%",
                    border: "1px dashed #000000",
                    borderRadius: 10,
                    padding: (preview && !isDragActive) ? 0 : 6,
                    '&:hover': {
                        border: "1px solid ".concat(constants_1.PRIMARY_HEX),
                        cursor: 'pointer',
                    }
                }, alignItems: "center", justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)("input", __assign({}, getInputProps({ multiple: false }))), (0, jsx_runtime_1.jsx)("p", { children: isDragActive ? "Drop to select file"
                            : value
                                ? (preview
                                    ? (0, jsx_runtime_1.jsx)("img", { src: preview, style: { paddingLeft: '10%', width: '80%', maxHeight: 200 } })
                                    : "".concat((0, utilities_1.truncate_string)(value.name, { length: 30, showEllipsis: true }), " selected!"))
                                : (0, utilities_1.capture_is_supported)()
                                    ? ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(AddPhotoAlternate_1.default, { color: "primary" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { fontSize: 14, textAlign: 'center' } }, { children: "Select file or take picture" })) }))] })))
                                    : "Select a File" })] })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: (!(value === null || value === void 0 ? void 0 : value.name) && existingFileName) &&
                    (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [existingFileName, " selected!"] }) })), error &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error" }, { children: error })) }))] })));
};
exports.FileInput = FileInput;
var safe_create_url = function (file) {
    try {
        return URL.createObjectURL(file);
    }
    catch (err) {
        console.error('safe_create_url error:', err);
        return null;
    }
};
exports.safe_create_url = safe_create_url;
var FilesInput = function (_a) {
    var _b;
    var value = _a.value, onChange = _a.onChange, field = _a.field, existingFileName = _a.existingFileName, uploadingFiles = _a.uploadingFiles, handleFileUpload = _a.handleFileUpload, setUploadingFiles = _a.setUploadingFiles;
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_dropzone_1.useDropzone)({
        onDrop: (0, react_1.useCallback)(function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
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
    var previews = (0, react_1.useMemo)(function () { return ((value !== null && value !== void 0 ? value : []).map(function (v) {
        return value_is_image(v) ? (0, exports.safe_create_url)(v) : null;
    })); }, [value]);
    if (uploadingFiles === null || uploadingFiles === void 0 ? void 0 : uploadingFiles.find(function (f) { return f.fieldId === field.id; })) {
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true }, getRootProps(), { sx: {
                    width: "100%",
                    border: "1px dashed #000000",
                    borderRadius: 10,
                    padding: 2,
                    '&:hover': {
                        border: "1px solid ".concat(constants_1.PRIMARY_HEX),
                        cursor: 'pointer',
                    }
                }, alignItems: "center", justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)("input", __assign({}, getInputProps({ multiple: false }))), (0, jsx_runtime_1.jsx)("p", { children: isDragActive
                            ? "Drop to select files"
                            : (0, utilities_1.capture_is_supported)()
                                ? ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(AddPhotoAlternate_1.default, { color: "primary" }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { fontSize: 14, textAlign: 'center' } }, { children: "Select files or take pictures" })) }))] })))
                                : "Select Files" })] })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, direction: "column", sx: { overflowY: 'auto', maxHeight: '250px', mt: 1 }, wrap: "nowrap" }, { children: value === null || value === void 0 ? void 0 : value.map(function (file, i) {
                    var _a;
                    return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { mt: 0.5 } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { mr: 1 } }, { children: file.name })), ((_a = file.type) === null || _a === void 0 ? void 0 : _a.includes('image')) && previews[i] &&
                                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)("img", { src: previews[i], style: { maxWidth: '45%', maxHeight: 80, height: '100%' } }) }))] })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(__1.LabeledIconButton, { label: "Remove", Icon: icons_material_1.Delete, onClick: function () { return onChange(value.filter(function (f, _i) { return i !== _i; }), field.id); } }) }))] })) }), i));
                }) })), error &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, alignSelf: "center", sx: { mt: 0.5 } }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error" }, { children: error })) }))] })));
};
exports.FilesInput = FilesInput;
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
var MultipleChoiceInput = function (_a) {
    var _b;
    var field = _a.field, form = _a.form, _value = _a.value, onChange = _a.onChange;
    var value = typeof _value === 'string' ? [_value] : _value; // if loading existingResponses, allows them to be a string
    var _d = field.options, choices = _d.choices, radio = _d.radio, other = _d.other;
    // current other string
    var enteringOtherStringRef = react_1.default.useRef(''); // if typing otherString as prefix of a checkbox value, don't auto-select
    var otherString = (_b = value === null || value === void 0 ? void 0 : value.find(function (v) { var _a; return v === enteringOtherStringRef.current || !((_a = (choices !== null && choices !== void 0 ? choices : [])) === null || _a === void 0 ? void 0 : _a.find(function (c) { return c === v; })); })) !== null && _b !== void 0 ? _b : '';
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center" }, { children: [radio
                ? ((0, jsx_runtime_1.jsxs)(material_1.FormControl, __assign({ fullWidth: true }, { children: [(0, jsx_runtime_1.jsx)(material_1.FormLabel, __assign({ id: "radio-group-".concat(field.id, "-label") }, { children: (0, __1.form_display_text_for_language)(form, "Select One") })), (0, jsx_runtime_1.jsx)(material_1.RadioGroup, __assign({ "aria-labelledby": "radio-group-".concat(field.id, "-label"), defaultValue: "female", name: "radio-group-".concat(field.id) }, { children: (choices !== null && choices !== void 0 ? choices : []).map(function (c, i) {
                                return (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { color: "primary", label: c, sx: multipleChoiceItemSx, style: { marginLeft: '0px' }, checked: !!(value === null || value === void 0 ? void 0 : value.includes(c)) && c !== otherString, control: (0, jsx_runtime_1.jsx)(material_1.Radio, { onClick: function () { return onChange((value === null || value === void 0 ? void 0 : value.includes(c)) ? [] : [c], field.id); } }) }, i);
                            }) }))] }))) : ((choices !== null && choices !== void 0 ? choices : []).map(function (c, i) { return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ xs: 12, onClick: function () { return onChange(((value === null || value === void 0 ? void 0 : value.includes(c))
                    ? (radio
                        ? []
                        : value.filter(function (v) { return v !== c; }))
                    : (radio
                        ? [c]
                        : __spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []), true), [c], false))), field.id); } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", sx: multipleChoiceItemSx }, { children: [(0, jsx_runtime_1.jsx)(material_1.Checkbox, { color: "primary", checked: !!(value === null || value === void 0 ? void 0 : value.includes(c)) && c !== otherString, inputProps: { 'aria-label': 'primary checkbox' } }), (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ component: "span" }, { children: [" ", c, " "] }))] })) }), i)); })), other &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 12 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField // className={classes.textField}
                    , { InputProps: { sx: { borderRadius: 2.5 } }, sx: { width: radio ? "calc(100% - 15px)" : '100%' }, size: "small", "aria-label": (0, __1.form_display_text_for_language)(form, "Other"), value: otherString, placeholder: (0, __1.form_display_text_for_language)(form, "Other"), variant: "outlined", 
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
exports.MultipleChoiceInput = MultipleChoiceInput;
var StripeInput = function (_a) {
    var _b, _d;
    var field = _a.field, value = _a.value, onChange = _a.onChange, setCustomerId = _a.setCustomerId;
    var session = (0, __1.useResolvedSession)();
    var _e = (0, react_1.useState)(''), clientSecret = _e[0], setClientSecret = _e[1];
    var _f = (0, react_1.useState)(''), businessName = _f[0], setBusinessName = _f[1];
    var _g = (0, react_1.useState)(false), isCheckout = _g[0], setIsCheckout = _g[1];
    var _h = (0, react_1.useState)(), stripePromise = _h[0], setStripePromise = _h[1];
    var _j = (0, __1.useProducts)({ dontFetch: true }), findProduct = _j[1].findById;
    var _k = (0, react_1.useState)(''), answertext = _k[0], setAnswertext = _k[1];
    var fetchRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        var _a;
        if (fetchRef.current)
            return;
        if (value && ((_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.stripeCustomerId)) {
            return setCustomerId(function (c) { var _a; return c ? c : (_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.stripeCustomerId; }); // already paid or saved card
        }
        fetchRef.current = true;
        session.api.form_responses.stripe_details({ fieldId: field.id })
            .then(function (_a) {
            var clientSecret = _a.clientSecret, publishableKey = _a.publishableKey, stripeAccount = _a.stripeAccount, businessName = _a.businessName, customerId = _a.customerId, isCheckout = _a.isCheckout, answerText = _a.answerText;
            setAnswertext(answerText || '');
            setIsCheckout(!!isCheckout);
            setClientSecret(clientSecret);
            setStripePromise((0, stripe_js_1.loadStripe)(publishableKey, { stripeAccount: stripeAccount }));
            setBusinessName(businessName);
            setCustomerId(customerId);
        })
            .catch(console.error);
    }, [session, value, field.id]);
    var cost = ((((_b = field.options) === null || _b === void 0 ? void 0 : _b.productIds) || []).map(function (id) { return findProduct(id, { batch: false }); }) // seems to be having issues with bulk read
        .reduce(function (t, p) { var _a; return t + (((_a = p === null || p === void 0 ? void 0 : p.cost) === null || _a === void 0 ? void 0 : _a.amount) || 0); }, 0));
    if (value) {
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(icons_material_1.CheckCircleOutline, { color: "success" }), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: ((_d = field.options) === null || _d === void 0 ? void 0 : _d.chargeImmediately) ? 'Your purchase was successful' : "Your payment details have been saved!" }))] })));
    }
    if (!(clientSecret && stripePromise))
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    if (isCheckout && stripePromise)
        return ((0, jsx_runtime_1.jsx)(react_stripe_js_1.EmbeddedCheckoutProvider, __assign({ stripe: stripePromise, options: {
                clientSecret: clientSecret,
                onComplete: function () { return onChange(answertext || 'Completed checkout', field.id); },
            } }, { children: (0, jsx_runtime_1.jsx)(react_stripe_js_1.EmbeddedCheckout, {}) })));
    return ((0, jsx_runtime_1.jsx)(react_stripe_js_1.Elements, __assign({ stripe: stripePromise, options: {
            clientSecret: clientSecret,
        } }, { children: (0, jsx_runtime_1.jsx)(StripeForm, { businessName: businessName, onSuccess: function () { return onChange(answertext || 'Saved card details', field.id); }, cost: cost, field: field }) })));
};
exports.StripeInput = StripeInput;
var StripeForm = function (_a) {
    var _b, _d, _e;
    var businessName = _a.businessName, onSuccess = _a.onSuccess, field = _a.field, cost = _a.cost;
    var stripe = (0, react_stripe_js_1.useStripe)();
    var elements = (0, react_stripe_js_1.useElements)();
    var _f = (0, react_1.useState)(false), ready = _f[0], setReady = _f[1];
    var _g = (0, react_1.useState)(''), errorMessage = _g[0], setErrorMessage = _g[1];
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
    return ((0, jsx_runtime_1.jsxs)("form", __assign({ onSubmit: handleSubmit }, { children: [(0, jsx_runtime_1.jsx)(react_stripe_js_1.PaymentElement, { onReady: function () { return setReady(true); }, options: {
                    business: { name: businessName },
                } }), (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "contained", color: "primary", type: "submit", sx: { mt: 1 }, disabled: !(stripe && ready) }, { children: ((_b = field.options) === null || _b === void 0 ? void 0 : _b.chargeImmediately) ? 'Make Payment' : 'Save Payment Details' })), cost > 0 &&
                (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { mt: 0.5 } }, { children: ((_d = field.options) === null || _d === void 0 ? void 0 : _d.customPriceMessage)
                        ? field.options.customPriceMessage.replaceAll('{{PRICE}}', "$".concat((cost / 100).toFixed(2)))
                        : "You will be charged $".concat((cost / 100).toFixed(2), " ").concat(((_e = field.options) === null || _e === void 0 ? void 0 : _e.chargeImmediately) ? '' : 'on form submission') })), errorMessage &&
                (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error", sx: { mt: 0.5 } }, { children: errorMessage }))] })));
};
var Progress = function (_a) {
    var numerator = _a.numerator, denominator = _a.denominator, style = _a.style;
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, __assign({ sx: __assign({ display: 'flex', alignItems: 'center' }, style) }, { children: [(0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: { width: '100%', mr: 1 } }, { children: (0, jsx_runtime_1.jsx)(LinearProgress_1.default, { variant: "determinate", style: { height: '10px' }, value: (numerator / (denominator || 1)) * 100 }) })), (0, jsx_runtime_1.jsx)(material_1.Box, __assign({ sx: { minWidth: 35 } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ variant: "body2", color: "text.secondary" }, { children: [(numerator / (denominator || 1) * 100).toFixed(0), "%"] })) }))] })));
};
exports.Progress = Progress;
var DropdownInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j;
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    var _k = (0, react_1.useState)(''), typing = _k[0], setTyping = _k[1];
    // this should run only once, even if the field updates but the id is unchanged, otherwise will overwrite input
    var typingRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(function () {
        if (typingRef.current === field.id)
            return;
        typingRef.current = field.id;
        setTyping('');
    }, [field]);
    return ((0, jsx_runtime_1.jsx)(material_1.Autocomplete, { id: field.id, style: { marginTop: 5 }, multiple: !((_b = field.options) === null || _b === void 0 ? void 0 : _b.radio), freeSolo: !!((_d = field.options) === null || _d === void 0 ? void 0 : _d.other), value: ((_e = field.options) === null || _e === void 0 ? void 0 : _e.radio)
            ? ((_f = value === null || value === void 0 ? void 0 : value[0]) !== null && _f !== void 0 ? _f : '')
            : (value !== null && value !== void 0 ? value : []), onChange: function (_, v) { return (onChange((typeof v === 'string' || v === null) ? [v !== null && v !== void 0 ? v : ''] : v, field.id)); }, options: (_h = (_g = field.options) === null || _g === void 0 ? void 0 : _g.choices) !== null && _h !== void 0 ? _h : [], inputValue: ((_j = field.options) === null || _j === void 0 ? void 0 : _j.radio) && Array.isArray(value) && value[0]
            ? value[0]
            : typing, onInputChange: function (e, value) { return setTyping(value); }, renderInput: function (params) {
            var _a, _b;
            return (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), onChange: function (e) {
                    var _a;
                    return ((((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio) && field.options.other)
                        ? onChange(e.target.value ? [e.target.value] : [], field.id)
                        : undefined);
                }, placeholder: field.placeholder + ((!field.title && !field.isOptional) ? '*' : ''), label: (!((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio) && ((_b = field.options) === null || _b === void 0 ? void 0 : _b.other))
                    ? "Press enter to save a custom value"
                    : '' }));
        } }));
};
exports.DropdownInput = DropdownInput;
var choicesForDatabase = {};
var LOAD_CHOICES_LIMIT = 500;
var useDatabaseChoices = function (_a) {
    var _b, _d, _e, _f;
    var _g = _a.databaseId, databaseId = _g === void 0 ? '' : _g, field = _a.field, otherAnswers = _a.otherAnswers;
    var session = (0, __1.useResolvedSession)();
    var _h = (0, react_1.useState)(0), renderCount = _h[0], setRenderCount = _h[1];
    // todo: make searchable, don't load all
    (0, react_1.useEffect)(function () {
        var _a, _b, _d, _e;
        if ((_a = choicesForDatabase[databaseId]) === null || _a === void 0 ? void 0 : _a.done)
            return;
        if (renderCount > 100)
            return; // limit to 50000 entries / prevent infinite looping
        var choices = (_d = (_b = choicesForDatabase[databaseId]) === null || _b === void 0 ? void 0 : _b.records) !== null && _d !== void 0 ? _d : [];
        var lastId = (_e = choicesForDatabase[databaseId]) === null || _e === void 0 ? void 0 : _e.lastId;
        session.api.form_fields.load_choices_from_database({
            fieldId: field.id,
            lastId: lastId,
            limit: LOAD_CHOICES_LIMIT,
            databaseId: databaseId,
        })
            .then(function (_a) {
            var _b;
            var newChoices = _a.choices;
            choicesForDatabase[databaseId] = {
                lastId: (_b = newChoices === null || newChoices === void 0 ? void 0 : newChoices[newChoices.length - 1]) === null || _b === void 0 ? void 0 : _b.id,
                records: __spreadArray(__spreadArray([], choices, true), newChoices, true).sort(function (c1, c2) { return (label_for_database_record(field, c1)
                    .localeCompare(label_for_database_record(field, c2))); }),
                done: newChoices.length < LOAD_CHOICES_LIMIT,
            };
            setRenderCount(function (r) { return r + 1; });
        })
            .catch(function (err) {
            console.error(err);
        });
    }, [session, field, databaseId, renderCount]);
    return {
        doneLoading: (_d = (_b = choicesForDatabase[databaseId]) === null || _b === void 0 ? void 0 : _b.done) !== null && _d !== void 0 ? _d : false,
        choices: __spreadArray(__spreadArray([], (_f = (_e = choicesForDatabase[databaseId]) === null || _e === void 0 ? void 0 : _e.records) !== null && _f !== void 0 ? _f : [], true), (otherAnswers || []).map(function (v) {
            var _a;
            return ({
                id: v.text,
                databaseId: databaseId,
                values: [{ label: ((_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseLabel) || '', type: 'Text', value: v.text }],
            });
        }), true),
        renderCount: renderCount,
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
var DatabaseSelectInput = function (_a) {
    var _b, _d, _e, _f;
    var field = _a.field, _value = _a.value, onChange = _a.onChange, onDatabaseSelect = _a.onDatabaseSelect, responses = _a.responses;
    var _g = (0, react_1.useState)(''), typing = _g[0], setTyping = _g[1];
    var _h = useDatabaseChoices({
        databaseId: (_b = field.options) === null || _b === void 0 ? void 0 : _b.databaseId,
        field: field,
        otherAnswers: get_other_answers(_value, ((_d = field === null || field === void 0 ? void 0 : field.options) === null || _d === void 0 ? void 0 : _d.other) ? typing : undefined),
    }), choices = _h.choices, doneLoading = _h.doneLoading;
    var value = react_1.default.useMemo(function () {
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
    var filterResponse = (0, react_1.useMemo)(function () {
        var _a, _b, _d, _e;
        return (((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.fieldId)
            ? (_e = (_d = responses.find(function (r) { var _a, _b; return r.fieldId === ((_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseFilter) === null || _b === void 0 ? void 0 : _b.fieldId); })) === null || _d === void 0 ? void 0 : _d.answer) === null || _e === void 0 ? void 0 : _e.value
            : undefined);
    }, [responses, (_e = field.options) === null || _e === void 0 ? void 0 : _e.databaseFilter]);
    var filteredChoicesWithPotentialDuplicates = (0, react_1.useMemo)(function () {
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
                        : false);
            }
            return false;
        }));
    }, [choices, filterResponse, (_f = field.options) === null || _f === void 0 ? void 0 : _f.databaseFilter, value]);
    var filteredChoices = (0, react_1.useMemo)(function () {
        var filtered = [];
        var uniques = new Set([]);
        for (var _a = 0, filteredChoicesWithPotentialDuplicates_1 = filteredChoicesWithPotentialDuplicates; _a < filteredChoicesWithPotentialDuplicates_1.length; _a++) {
            var c = filteredChoicesWithPotentialDuplicates_1[_a];
            var text = label_for_database_record(field, c);
            if (uniques.has(text))
                continue; // duplicate found
            uniques.add(text);
            filtered.push(c);
        }
        return filtered;
    }, [field, filteredChoicesWithPotentialDuplicates]);
    if (!doneLoading)
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    return ((0, jsx_runtime_1.jsx)(material_1.Autocomplete, { id: field.id, freeSolo: false, componentsProps: { popper: { sx: { wordBreak: "break-word" } } }, options: filteredChoices, multiple: true, getOptionLabel: function (o) { return (Array.isArray(o) // edge case
            ? ''
            : label_for_database_record(field, o)); }, value: value, onChange: function (_, v) {
            var _a, _b, _d, _e;
            if (v.length && onDatabaseSelect) {
                onDatabaseSelect(v);
            }
            return onChange((!((_a = field.options) === null || _a === void 0 ? void 0 : _a.radio)
                ? v.map(function (_v) {
                    var _a;
                    return ({
                        databaseId: (_a = field.options) === null || _a === void 0 ? void 0 : _a.databaseId,
                        recordId: _v.id,
                        text: label_for_database_record(field, _v),
                    });
                })
                : [{
                        databaseId: (_b = field.options) === null || _b === void 0 ? void 0 : _b.databaseId,
                        recordId: (_e = (_d = v[v.length - 1]) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : '',
                        text: label_for_database_record(field, v[v.length - 1]),
                    }]), field.id);
        }, inputValue: typing, onInputChange: function (e, v) { return e && setTyping(v); }, renderInput: function (params) { return (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }) })); }, 
        // use custom Chip to ensure very long entries break properly (whitespace: normal)
        renderTags: function (value, getTagProps) {
            return value.map(function (value, index) { return ((0, jsx_runtime_1.jsx)(material_1.Chip, __assign({ label: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: Array.isArray(value) ? '' : label_for_database_record(field, value) })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
        } }));
};
exports.DatabaseSelectInput = DatabaseSelectInput;
var displayTermsCache = undefined;
var DRUGS_FOR_DISPLAY_TERM = {};
var RX_NORM_CODE_FOR_DRUG = {};
var NDC_CODES_FOR_RX_NORM_CODE = {};
var useMedications = function (_a) {
    var dontFetch = _a.dontFetch;
    var _b = (0, react_1.useState)(displayTermsCache), displayTerms = _b[0], setDisplayTerms = _b[1];
    var fetchRef = (0, react_1.useRef)(displayTerms !== undefined);
    (0, react_1.useEffect)(function () {
        if (dontFetch)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        // thankfully, this endpoint has cache control, so repeated requests should fetch from disk anyway
        axios_1.default.get('https://rxnav.nlm.nih.gov/REST/displaynames.json')
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
    var getDrugsForDisplayTerm = (0, react_1.useCallback)(function (s) { return __awaiter(void 0, void 0, void 0, function () {
        var drugs, _a;
        var _b, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = DRUGS_FOR_DISPLAY_TERM[s];
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.get("https://rxnav.nlm.nih.gov/REST/drugs.json?name=".concat(s))];
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
    var getCodesForDrug = (0, react_1.useCallback)(function (s) { return __awaiter(void 0, void 0, void 0, function () {
        var rxNormCode, _a, NDCs, _b;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _a = RX_NORM_CODE_FOR_DRUG[s];
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=".concat(s, "&allsrc=1"))];
                case 1:
                    _a = ((_f = (_e = (_d = (_l.sent())
                        .data) === null || _d === void 0 ? void 0 : _d.idGroup) === null || _e === void 0 ? void 0 : _e.rxnormId) === null || _f === void 0 ? void 0 : _f[0]);
                    _l.label = 2;
                case 2:
                    rxNormCode = _a;
                    RX_NORM_CODE_FOR_DRUG[s] = rxNormCode; // cache for future lookups
                    _b = NDC_CODES_FOR_RX_NORM_CODE[rxNormCode];
                    if (_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios_1.default.get("https://rxnav.nlm.nih.gov/REST/rxcui/".concat(rxNormCode, "/ndcs.json"))];
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
var CanvasMedicationsInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? [] : _d, onChange = _a.onChange;
    var session = (0, __1.useResolvedSession)();
    var _e = (0, react_1.useState)(''), query = _e[0], setQuery = _e[1];
    var _f = (0, react_1.useState)([]), results = _f[0], setResults = _f[1];
    // if two Medications questions shown in a row, reset state
    (0, react_1.useEffect)(function () {
        setQuery('');
        setResults([]);
    }, [field.id]);
    var fetchRef = (0, react_1.useRef)(query);
    (0, react_1.useEffect)(function () {
        if (fetchRef.current === query)
            return;
        fetchRef.current = query;
        if (!query)
            return;
        var t = setTimeout(function () {
            session.api.integrations
                .proxy_read({
                integration: constants_1.CANVAS_TITLE,
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { multiple: true, value: value, options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
                        if (!v) {
                            return;
                        }
                        onChange(v, field.id);
                        setResults([]);
                    }, getOptionLabel: function (v) { return (0, utilities_1.first_letter_capitalized)(v.displayTerm); }, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search medications..." }))); }, renderTags: function (value, getTagProps) {
                        return value.map(function (value, index) { return ((0, jsx_runtime_1.jsx)(material_1.Chip, __assign({ label: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: value.displayTerm })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
                    } }) })), (value || []).map(function (medication, i) {
                var _a;
                return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 0.75 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ noWrap: true, sx: { fontSize: 14 } }, { children: medication.drugName })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { InputProps: { sx: exports.defaultInputProps.sx }, fullWidth: true, size: "small", label: "Medication instructions: how much you take, how often, and when", value: ((_a = medication.dosage) === null || _a === void 0 ? void 0 : _a.description) || '', onChange: function (e) { return (onChange((value || []).map(function (v, _i) {
                                        return i === _i
                                            ? __assign(__assign({}, v), { dosage: __assign(__assign({}, v.dosage), { description: e.target.value }) }) : v;
                                    }), field.id)); } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Divider, { flexItem: true, sx: { my: 0.5 } }) }))] })) }), i));
            })] })));
};
exports.CanvasMedicationsInput = CanvasMedicationsInput;
var MedicationsInput = function (_a) {
    var _b, _d;
    var field = _a.field, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    var _e = useMedications({
        dontFetch: ((_b = field.options) === null || _b === void 0 ? void 0 : _b.dataSource) === constants_1.CANVAS_TITLE
    }), displayTerms = _e.displayTerms, doneLoading = _e.doneLoading, getCodesForDrug = _e.getCodesForDrug, getDrugsForDisplayTerm = _e.getDrugsForDisplayTerm;
    var _f = (0, react_1.useState)({}), drugs = _f[0], setDrugs = _f[1];
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
    if (((_d = field.options) === null || _d === void 0 ? void 0 : _d.dataSource) === constants_1.CANVAS_TITLE) {
        return (0, jsx_runtime_1.jsx)(exports.CanvasMedicationsInput, __assign({ field: field, value: value, onChange: onChange }, props));
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", sx: { mt: 2 } }, { children: [(value !== null && value !== void 0 ? value : []).map(function (v, i) {
                var _a, _b, _d, _e, _f, _g, _h, _j, _k, _l;
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: '100%' } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { freeSolo: false, multiple: false, loading: !doneLoading, options: 
                                                    // uncomment to load data after initial typing
                                                    // query.length === 0 ? [] :
                                                    ((_b = (_a = displayTerms === null || displayTerms === void 0 ? void 0 : displayTerms.displayTermsList) === null || _a === void 0 ? void 0 : _a.term) !== null && _b !== void 0 ? _b : []), 
                                                    // uncomment to load data after initial typing
                                                    // noOptionsText={query.length === 0 ? "Start typing..." : undefined}
                                                    // uncomment to load data after initial typing
                                                    // inputValue={query} onInputChange={(e, v) => setQuery(v)}
                                                    getOptionLabel: utilities_1.first_letter_capitalized, filterOptions: filterOptions, value: v.displayTerm, onChange: function (_, displayTerm) { return __awaiter(void 0, void 0, void 0, function () {
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
                                                        return (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, label: "Search", size: "small", fullWidth: true }));
                                                    } }) })), v.displayTerm && v.drugName !== "Unknown" && !v.otherDrug &&
                                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { mt: 1.5 } }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { freeSolo: false, options: drugs[v.displayTerm]
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
                                                            return (0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, label: "Drug Select", size: "small", fullWidth: true }));
                                                        } }) })), v.displayTerm && (v.drugName === "Unknown" || !v.drugName) &&
                                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { mt: 1 } }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: 'Other Drug', fullWidth: true, size: "small", required: true, InputProps: exports.defaultInputProps, value: (_g = (_f = value === null || value === void 0 ? void 0 : value.find(function (v, _i) { return _i === i; })) === null || _f === void 0 ? void 0 : _f.otherDrug) !== null && _g !== void 0 ? _g : '', onChange: function (e) { return (onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                            ? __assign(__assign({}, _v), { otherDrug: e.target.value }) : _v); }), field.id)); } }) })), v.displayTerm &&
                                                (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, spacing: 1, sx: { mt: 0 } }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ item: true, xs: 12, md: 6 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { fontSize: 13.5 } }, { children: "Units (e.g. capsule, table, puff) per dose?" })), (0, jsx_runtime_1.jsx)(material_1.TextField, { type: "number", size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: (_h = v.dosage) === null || _h === void 0 ? void 0 : _h.quantity, onChange: function (e) {
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
                                                                    } })] })), (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ item: true, xs: 12, md: 6 }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ sx: { fontSize: 13.5 } }, { children: ["How many times per ", (0, jsx_runtime_1.jsx)("strong", { children: "day" }), "?"] })), (0, jsx_runtime_1.jsx)(StringSelector, { size: "small", options: ["1", "2", "3", "4", "5", "6", "As Needed"], value: (_k = (_j = v.dosage) === null || _j === void 0 ? void 0 : _j.frequency) !== null && _k !== void 0 ? _k : '', onChange: function (frequency) { return __awaiter(void 0, void 0, void 0, function () {
                                                                        return __generator(this, function (_a) {
                                                                            onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                                ? __assign(__assign({}, _v), { dosage: __assign(__assign({}, _v.dosage), { frequency: frequency || '' }) }) : _v); }), field.id);
                                                                            return [2 /*return*/];
                                                                        });
                                                                    }); } })] }))] })), v.displayTerm &&
                                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { mt: 1.25 } }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Reason for taking medication", size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: (_l = v.reasonForTaking) !== null && _l !== void 0 ? _l : '', onChange: function (e) {
                                                            return onChange((value !== null && value !== void 0 ? value : []).map(function (_v, _i) { return (i === _i
                                                                ? __assign(__assign({}, _v), { reasonForTaking: e.target.value }) : _v); }), field.id);
                                                        } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "primary", sx: { textDecoration: 'underline', cursor: 'pointer' }, onClick: function () { return onChange((value !== null && value !== void 0 ? value : []).filter(function (_, _i) { return i !== _i; }), field.id); } }, { children: "Remove medication" })) })), window.location.origin.includes(':300') && i === 0 &&
                                                (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ item: true, sx: { mt: 3 } }, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "DEBUG:" }), " ", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("pre", __assign({ style: { wordWrap: 'break-word' } }, { children: JSON.stringify(value !== null && value !== void 0 ? value : {}, null, 2) }))] })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true }) }))] })) })) })) }), i), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Divider, { flexItem: true, sx: { my: 1 } }) }))] }));
            }), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ color: "primary", variant: "outlined", onClick: function () { return onChange(__spreadArray(__spreadArray([], (value !== null && value !== void 0 ? value : []), true), [{ displayTerm: '', drugName: '' }], false), field.id); } }, { children: "Add Medication" })) }))] })));
};
exports.MedicationsInput = MedicationsInput;
var contact_is_valid = function (e) {
    if (e.email) {
        try {
            validation_1.emailValidator.validate()(e.email);
        }
        catch (err) {
            return "Email is invalid";
        }
    }
    if (e.phone) {
        try {
            validation_1.phoneValidator.validate()(e.phone);
        }
        catch (err) {
            return "Phone is invalid";
        }
    }
    if (e.dateOfBirth && !(0, __1.isDateString)(e.dateOfBirth)) {
        return "Date of birth should be MM-DD-YYYY";
    }
};
exports.contact_is_valid = contact_is_valid;
var RelatedContactsInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var field = _a.field, _value = _a.value, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    // safeguard against any rogue values like empty string
    var value = Array.isArray(_value) ? _value : [];
    var _s = (0, react_1.useState)(-1), editing = _s[0], setEditing = _s[1];
    if (value[editing]) {
        var _t = value[editing], fname = _t.fname, lname = _t.lname, email = _t.email, phone = _t.phone, _u = _t.fields, fields_1 = _u === void 0 ? {} : _u, _w = _t.dateOfBirth, dateOfBirth = _w === void 0 ? '' : _w, relationships = _t.relationships;
        var errorMessage = (0, exports.contact_is_valid)(value[editing]);
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", spacing: 1 }, { children: [!((_d = (_b = field.options) === null || _b === void 0 ? void 0 : _b.hiddenDefaultFields) === null || _d === void 0 ? void 0 : _d.includes('First Name')) &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "First Name", size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: fname, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { fname: e.target.value }) : v; }), field.id); } }) })), !((_f = (_e = field.options) === null || _e === void 0 ? void 0 : _e.hiddenDefaultFields) === null || _f === void 0 ? void 0 : _f.includes('Last Name')) &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Last Name", size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: lname, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { lname: e.target.value }) : v; }), field.id); } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(StringSelector, { options: constants_1.RELATIONSHIP_TYPES, label: "Relationship", size: "small", value: (_h = (_g = relationships === null || relationships === void 0 ? void 0 : relationships[0]) === null || _g === void 0 ? void 0 : _g.type) !== null && _h !== void 0 ? _h : '', onChange: function (type) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { relationships: [{ type: type, id: '' /* to be filled on server-side */ }] }) : v; }), field.id); } }) }))] })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", spacing: 1 }, { children: [!((_k = (_j = field.options) === null || _j === void 0 ? void 0 : _j.hiddenDefaultFields) === null || _k === void 0 ? void 0 : _k.includes('Date of Birth')) &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(exports.DateStringInput, { value: dateOfBirth, field: __assign(__assign({}, field), { isOptional: true }), size: "small", label: "Date of Birth (MM-DD-YYYY)", onChange: function (dateOfBirth) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { dateOfBirth: dateOfBirth }) : v; }), field.id); } }) })), !((_m = (_l = field.options) === null || _l === void 0 ? void 0 : _l.hiddenDefaultFields) === null || _m === void 0 ? void 0 : _m.includes('Email')) &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Email", size: "small", fullWidth: true, type: "email", InputProps: exports.defaultInputProps, value: email, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { email: e.target.value }) : v; }), field.id); } }) })), !((_p = (_o = field.options) === null || _o === void 0 ? void 0 : _o.hiddenDefaultFields) === null || _p === void 0 ? void 0 : _p.includes('Phone Number')) &&
                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 4 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Phone Number", size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: phone, onChange: function (e) { return onChange(value.map(function (v, i) { return i === editing ? __assign(__assign({}, v), { phone: e.target.value }) : v; }), field.id); } }) }))] })) })), (((_q = field.options) === null || _q === void 0 ? void 0 : _q.tableChoices) || []).length > 0 &&
                    (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, spacing: 1 }, { children: (((_r = field.options) === null || _r === void 0 ? void 0 : _r.tableChoices) || []).map(function (_a) {
                                var info = _a.info, label = _a.label, type = _a.type;
                                return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, xs: 6 }, { children: type === 'Text'
                                        ? ((0, jsx_runtime_1.jsx)(material_1.TextField, { label: label, size: "small", fullWidth: true, InputProps: exports.defaultInputProps, value: fields_1[label] || '', onChange: function (e) { return onChange(value.map(function (v, i) {
                                                var _a;
                                                return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e.target.value, _a)) }) : v;
                                            }), field.id); } }))
                                        : type === 'Date' ? ((0, jsx_runtime_1.jsx)(exports.DateStringInput, { label: label, size: "small", fullWidth: true, field: field, value: fields_1[label] || '', onChange: function (e) {
                                                if (e === void 0) { e = ''; }
                                                return onChange(value.map(function (v, i) {
                                                    var _a;
                                                    return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e, _a)) }) : v;
                                                }), field.id);
                                            } }))
                                            : type === 'Select' ? ((0, jsx_runtime_1.jsxs)(material_1.FormControl, __assign({ size: "small", fullWidth: true }, { children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, __assign({ id: "demo-select-small" }, { children: label })), (0, jsx_runtime_1.jsxs)(material_1.Select, __assign({ label: label, size: "small", sx: exports.defaultInputProps.sx, value: fields_1[label] || '', onChange: function (e) { return onChange(value.map(function (v, i) {
                                                            var _a;
                                                            return i === editing ? __assign(__assign({}, v), { fields: __assign(__assign({}, fields_1), (_a = {}, _a[label] = e.target.value, _a)) }) : v;
                                                        }), field.id); } }, { children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, __assign({ value: "" }, { children: (0, jsx_runtime_1.jsx)("em", { children: "None" }) })), info.choices.map(function (c) { return ((0, jsx_runtime_1.jsx)(material_1.MenuItem, __assign({ value: c }, { children: c }), c)); })] }))] })))
                                                : null })));
                            }) })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { my: 0.75 } }, { children: (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "outlined", onClick: function () { return setEditing(-1); }, size: "small" }, { children: "Save Contact" })) })), errorMessage &&
                    (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error" }, { children: errorMessage })) }))] })));
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: value.map(function (contact, i) { return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between", wrap: "nowrap", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center" }, { children: [(0, jsx_runtime_1.jsx)(__1.IconButton, __assign({ onClick: function () { return setEditing(i); }, color: "primary", size: "small" }, { children: (0, jsx_runtime_1.jsx)(icons_material_1.Edit, {}) })), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ noWrap: true }, { children: (0, utilities_1.user_display_name)(contact) || "Unnamed Contact ".concat(i + 1) }))] })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(__1.LabeledIconButton, { Icon: icons_material_1.Delete, label: "Remove", onClick: function () { return onChange(value.filter(function (v, _i) { return i !== _i; }), field.id); } }) }))] })) }), i)); }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "contained", onClick: function () {
                        onChange(__spreadArray(__spreadArray([], value, true), [{}], false), field.id, true);
                        setEditing(value.length);
                    } }, { children: "Add Contact" })) }))] })));
};
exports.RelatedContactsInput = RelatedContactsInput;
var AppointmentBookingInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l;
    var formResponseId = _a.formResponseId, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, responses = _a.responses, goToPreviousField = _a.goToPreviousField, isPreviousDisabled = _a.isPreviousDisabled, enduserId = _a.enduserId, props = __rest(_a, ["formResponseId", "field", "value", "onChange", "form", "responses", "goToPreviousField", "isPreviousDisabled", "enduserId"]);
    var session = (0, __1.useResolvedSession)();
    var _m = (0, react_1.useState)(), loaded = _m[0], setLoaded = _m[1];
    var _o = (0, react_1.useState)(''), error = _o[0], setError = _o[1];
    var _p = (0, react_1.useState)(false), acknowledgedWarning = _p[0], setAcknowledgedWarning = _p[1];
    var _q = (0, react_1.useState)(450), height = _q[0], setHeight = _q[1];
    var _r = (0, react_1.useState)(false), confirming = _r[0], setConfirming = _r[1];
    var bookingPageId = (_b = field === null || field === void 0 ? void 0 : field.options) === null || _b === void 0 ? void 0 : _b.bookingPageId;
    var downloadICS = (0, react_1.useCallback)(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = utilities_1.downloadFile;
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
    var addressQuestion = (0, react_1.useMemo)(function () { return responses === null || responses === void 0 ? void 0 : responses.find(function (r) {
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
    var state = (0, react_1.useMemo)(function () {
        var _a, _b, _d;
        return (((_a = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _a === void 0 ? void 0 : _a.type) === 'Address' ? (_d = (_b = addressQuestion === null || addressQuestion === void 0 ? void 0 : addressQuestion.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.state : undefined);
    }, [addressQuestion]);
    var loadBookingInfo = (0, react_1.useCallback)(function () {
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
    var fetchRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (value)
            return;
        if (!bookingPageId)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        loadBookingInfo();
    }, [bookingPageId, loadBookingInfo, value]);
    (0, react_1.useEffect)(function () {
        var handleMessage = function (m) {
            var _a, _b, _d, _e, _f, _g, _h;
            // entropy to separate from other booking pages rendered on the same screen
            if (((_a = m === null || m === void 0 ? void 0 : m.data) === null || _a === void 0 ? void 0 : _a.type) === 'Booking Success'
                && typeof ((_b = m === null || m === void 0 ? void 0 : m.data) === null || _b === void 0 ? void 0 : _b.bookedEventId) === 'string'
                && (!((_d = m === null || m === void 0 ? void 0 : m.data) === null || _d === void 0 ? void 0 : _d.entropy) || ((_e = m === null || m === void 0 ? void 0 : m.data) === null || _e === void 0 ? void 0 : _e.entropy) === (loaded === null || loaded === void 0 ? void 0 : loaded.entropy))) {
                onChange(m.data.bookedEventId, field.id);
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
            else {
                setConfirming(false);
            }
        };
        window.addEventListener('message', handleMessage);
        return function () { window.removeEventListener('message', handleMessage); };
    }, [field === null || field === void 0 ? void 0 : field.id, onChange, acknowledgedWarning, value, loaded === null || loaded === void 0 ? void 0 : loaded.entropy]);
    if (value) {
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(icons_material_1.CheckCircleOutline, { color: "success" }), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Your appointment has been booked" }))] })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { maxWidth: 250 } }, { children: (0, jsx_runtime_1.jsx)(__1.LoadingButton, { variant: "contained", style: { maxWidth: 250 }, submitText: "Add to Calendar", submittingText: "Downloading...", onClick: function () { return downloadICS({ id: value }); } }) }))] })));
    }
    if (!bookingPageId) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "No booking page specified" });
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ color: "error" }, { children: ["Error: ", error] })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(__1.LoadingButton, { disabled: !bookingPageId, style: { maxWidth: 300 }, variant: "contained", onClick: loadBookingInfo, submitText: "Try Again", submittingText: "Loading..." }) }))] })));
    }
    if (!(loaded === null || loaded === void 0 ? void 0 : loaded.bookingURL)) {
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
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
                return (0, utilities_1.form_response_value_to_string)(answer.value);
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
                return (0, utilities_1.form_response_value_to_string)(answer.value);
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1, sx: { mt: 1 } }, { children: [!!((_k = (_j = field.options) === null || _j === void 0 ? void 0 : _j.userFilterTags) === null || _k === void 0 ? void 0 : _k.length) && !((_l = field.options.userTags) === null || _l === void 0 ? void 0 : _l.length) && !(isPreviousDisabled === null || isPreviousDisabled === void 0 ? void 0 : isPreviousDisabled()) && !confirming &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, alignSelf: "flex-start" }, { children: (0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "outlined", onClick: goToPreviousField, sx: { height: 25, p: 0.5, px: 1 } }, { children: "Back" })) })), loaded.warningMessage &&
                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error", sx: { fontSize: 20, fontWeight: 'bold' } }, { children: loaded.warningMessage })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (!loaded.warningMessage || acknowledgedWarning)
                    ? ((0, jsx_runtime_1.jsx)("iframe", { title: "Appointment Booking Embed", src: bookingURL, style: { border: 'none', width: '100%', height: height } }))
                    : ((0, jsx_runtime_1.jsx)(material_1.Button, __assign({ variant: "outlined", onClick: function () { return setAcknowledgedWarning(true); } }, { children: "Show Booking Page Preview" }))) }))] })));
};
exports.AppointmentBookingInput = AppointmentBookingInput;
var HeightInput = function (_a) {
    var _b;
    var field = _a.field, _d = _a.value, value = _d === void 0 ? {} : _d, onChange = _a.onChange, props = __rest(_a, ["field", "value", "onChange"]);
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: 'center', wrap: "nowrap", spacing: 1, style: { marginTop: 5 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: '100%' } }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, size: "small", label: "Feet", type: "number", value: (value === null || value === void 0 ? void 0 : value.feet) || '', onChange: function (e) { return onChange(__assign(__assign({}, value), { feet: parseInt(e.target.value) }), field.id); } }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: '100%' } }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, size: "small", label: "Inches", type: "number", value: (_b = value === null || value === void 0 ? void 0 : value.inches) !== null && _b !== void 0 ? _b : '', onChange: function (e) { return onChange(__assign(__assign({}, value), { inches: parseInt(e.target.value) }), field.id); } }) }))] })));
};
exports.HeightInput = HeightInput;
var RedirectInput = function (_a) {
    var _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var enduserId = _a.enduserId, groupId = _a.groupId, groupInsance = _a.groupInsance, rootResponseId = _a.rootResponseId, formResponseId = _a.formResponseId, field = _a.field, submit = _a.submit, _u = _a.value, value = _u === void 0 ? {} : _u, onChange = _a.onChange, responses = _a.responses, enduser = _a.enduser, props = __rest(_a, ["enduserId", "groupId", "groupInsance", "rootResponseId", "formResponseId", "field", "submit", "value", "onChange", "responses", "enduser"]);
    var session = (0, __1.useResolvedSession)();
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
    (0, react_1.useEffect)(function () {
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
                window.location.href = ((0, utilities_1.replace_enduser_template_values)(field.options.redirectExternalUrl, __assign(__assign({}, session.userInfo), { id: eId, email: email, fname: fname, lname: lname, state: state, phone: phone })));
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
        return ((0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Redirect is for patient-facing forms only" }));
    }
    return null;
};
exports.RedirectInput = RedirectInput;
var HiddenValueInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, isSinglePage = _a.isSinglePage;
    var lastRef = (0, react_1.useRef)(0);
    var lastIdRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(function () {
        if (lastRef.current > Date.now() - 1000 && lastIdRef.current === field.id)
            return;
        lastRef.current = Date.now();
        lastIdRef.current = field.id;
        if (value) {
            if (isSinglePage)
                return;
            onChange('', field.id);
            goToPreviousField === null || goToPreviousField === void 0 ? void 0 : goToPreviousField();
        }
        else {
            onChange(field.title, field.id);
            console.log('going to next field for hidden value', field.title, !!goToNextField);
            // pass value that is set after above onChange
            goToNextField === null || goToNextField === void 0 ? void 0 : goToNextField({ type: 'Hidden Value', value: field.title });
        }
    }, [value, onChange, field, goToNextField, goToPreviousField, isSinglePage]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
};
exports.HiddenValueInput = HiddenValueInput;
var EmotiiInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = (0, __1.useResolvedSession)();
    var requestIdRef = (0, react_1.useRef)(value || "".concat(field.id).concat(formResponseId || Date.now()));
    var _b = (0, react_1.useState)(), data = _b[0], setData = _b[1];
    var _d = (0, react_1.useState)(0), loadCount = _d[0], setLoadCount = _d[1];
    var fetchRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (value)
            return;
        if (fetchRef.current)
            return;
        fetchRef.current = true;
        session.api.integrations
            .proxy_read({
            integration: constants_1.EMOTII_TITLE,
            type: 'get_survey',
            id: props === null || props === void 0 ? void 0 : props.enduserId,
            query: requestIdRef.current,
        })
            .then(function (r) { return setData(r.data); });
    }, [session, value, props === null || props === void 0 ? void 0 : props.enduserId]);
    var loadAnswerRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loadCount !== 2)
            return;
        if (loadAnswerRef.current)
            return;
        loadAnswerRef.current = true;
        onChange(requestIdRef.current, field.id);
    }, [loadCount]);
    if (value || loadCount === 2)
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(icons_material_1.CheckCircleOutline, { color: "success" }), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Please click Next or Submit to continue." }))] })));
    if (!data) {
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)("iframe", { src: data.surveyUrl, style: { border: 'none', height: 650, width: '100%' }, onLoad: function () { return setLoadCount(function (l) { return l + 1; }); } }));
};
exports.EmotiiInput = EmotiiInput;
var AllergiesInput = function (_a) {
    var _b;
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = (0, __1.useResolvedSession)();
    var _d = (0, react_1.useState)(''), query = _d[0], setQuery = _d[1];
    var _e = (0, react_1.useState)([]), results = _e[0], setResults = _e[1];
    // if two allergy questions shown in a row, reset state
    (0, react_1.useEffect)(function () {
        setQuery('');
        setResults([]);
    }, [field.id]);
    var fetchRef = (0, react_1.useRef)(query);
    (0, react_1.useEffect)(function () {
        if (fetchRef.current === query)
            return;
        fetchRef.current = query;
        if (!query)
            return;
        var t = setTimeout(function () {
            var _a;
            if (((_a = field.options) === null || _a === void 0 ? void 0 : _a.dataSource) === constants_1.CANVAS_TITLE) {
                session.api.integrations
                    .proxy_read({
                    integration: constants_1.CANVAS_TITLE,
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { multiple: true, value: value || [], options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
                        if (!v) {
                            return;
                        }
                        onChange(v, field.id);
                        setResults([]);
                    }, getOptionLabel: function (v) { return (0, utilities_1.first_letter_capitalized)(v.display); }, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search allergies..." }))); }, renderTags: function (value, getTagProps) {
                        return value.map(function (value, index) { return ((0, jsx_runtime_1.jsx)(material_1.Chip, __assign({ label: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: value.display })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
                    } }) })), (value || []).map(function (allergy, i) { return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap", columnGap: 0.5, justifyContent: "space-between" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ noWrap: true, sx: { width: 85, fontSize: 14 } }, { children: allergy.display })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: 140 } }, { children: (0, jsx_runtime_1.jsx)(StringSelector, { options: ['mild', 'moderate', 'severe'], size: "small", label: "Severity", value: allergy.severity || '', onChange: function (severity) { return onChange((value || []).map(function (v, _i) { return i === _i ? __assign(__assign({}, v), { severity: severity }) : v; }), field.id); }, getDisplayValue: utilities_1.first_letter_capitalized }) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, sx: { width: "50%" } }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { InputProps: { sx: exports.defaultInputProps.sx }, fullWidth: true, size: "small", label: "Note", value: allergy.note || '', onChange: function (e) { return onChange((value || []).map(function (v, _i) { return i === _i ? __assign(__assign({}, v), { note: e.target.value }) : v; }), field.id); } }) }))] })) }), i)); })] })));
};
exports.AllergiesInput = AllergiesInput;
var display_with_code = function (v) { return "".concat(v.code, ": ").concat((0, utilities_1.first_letter_capitalized)(v.display)); };
var ConditionsInput = function (_a) {
    var goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, field = _a.field, value = _a.value, onChange = _a.onChange, form = _a.form, formResponseId = _a.formResponseId, props = __rest(_a, ["goToNextField", "goToPreviousField", "field", "value", "onChange", "form", "formResponseId"]);
    var session = (0, __1.useResolvedSession)();
    var _b = (0, react_1.useState)(''), query = _b[0], setQuery = _b[1];
    var _d = (0, react_1.useState)([]), results = _d[0], setResults = _d[1];
    var fetchRef = (0, react_1.useRef)(query);
    (0, react_1.useEffect)(function () {
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
    return ((0, jsx_runtime_1.jsx)(material_1.Autocomplete, { multiple: true, value: value || [], options: results, style: { marginTop: 5 }, noOptionsText: query.length ? 'No results found' : 'Type to start search', onChange: function (e, v) {
            if (!v) {
                return;
            }
            onChange(v, field.id);
            setResults([]);
        }, getOptionLabel: display_with_code, filterOptions: function (o) { return o; }, inputValue: query, onInputChange: function (e, v) { return e && setQuery(v); }, renderInput: function (params) { return ((0, jsx_runtime_1.jsx)(material_1.TextField, __assign({}, params, { InputProps: __assign(__assign({}, params.InputProps), { sx: exports.defaultInputProps.sx }), required: !field.isOptional, size: "small", label: "", placeholder: "Search conditions..." }))); }, renderTags: function (value, getTagProps) {
            return value.map(function (value, index) { return ((0, jsx_runtime_1.jsx)(material_1.Chip, __assign({ label: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { whiteSpace: 'normal' } }, { children: display_with_code(value) })) }, getTagProps({ index: index }), { sx: { height: "100%", py: 0.5 } }))); });
        } }));
};
exports.ConditionsInput = ConditionsInput;
var RichTextInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange;
    return ((0, jsx_runtime_1.jsx)(wysiwyg_1.WYSIWYG, { initialHTML: value, onChange: function (v) { return onChange(v, field.id); }, style: { width: '100%' }, editorStyle: { width: '100%' } }));
};
exports.RichTextInput = RichTextInput;
var ChargeebeeInput = function (_a) {
    var field = _a.field, value = _a.value, onChange = _a.onChange, setCustomerId = _a.setCustomerId;
    var session = (0, __1.useResolvedSession)();
    var _b = (0, react_1.useState)(''), url = _b[0], setUrl = _b[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(0), loadCount = _e[0], setLoadCount = _e[1];
    var fetchRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
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
    var loadAnswerRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loadCount !== 2)
            return;
        if (loadAnswerRef.current)
            return;
        loadAnswerRef.current = true;
        onChange({ url: url }, field.id);
    }, [loadCount, url]);
    if (value || loadCount === 2) {
        return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(icons_material_1.CheckCircleOutline, { color: "success" }), (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ sx: { ml: 1, fontSize: 20 } }, { children: "Your purchase was successful" }))] })));
    }
    if (error && typeof error === 'string')
        return (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ color: "error" }, { children: error }));
    if (!url)
        return (0, jsx_runtime_1.jsx)(LinearProgress_1.default, {});
    return ((0, jsx_runtime_1.jsx)("iframe", { src: url, title: "Checkout", style: { border: 'none', width: '100%', height: 700 }, onLoad: function () { return setLoadCount(function (l) { return l + 1; }); } }));
};
exports.ChargeebeeInput = ChargeebeeInput;
var templateObject_1, templateObject_2;
//# sourceMappingURL=inputs.js.map