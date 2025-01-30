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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconModal = exports.defaultModalStyle = exports.useModalIconButton = exports.DownloadFileIconButton = exports.useDownloadSecureFile = exports.ClickToDownloadFileComponent = exports.AsyncButton = exports.AsyncIconButton = exports.useAsyncAction = exports.LabeledIconButton = exports.DEFAULT_ICON_BUTTON_SIZE = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
// import DefaultIcon from '@mui/icons-material/Info';
var mui_1 = require("./mui");
var layout_1 = require("./layout");
var index_1 = require("./index");
exports.DEFAULT_ICON_BUTTON_SIZE = 25;
var LabeledIconButton = function (_a) {
    var _b = _a.Icon, Icon = _b === void 0 ? function () { return null; } : _b, label = _a.label, _c = _a.id, id = _c === void 0 ? undefined : _c, _d = _a.ariaLabel, ariaLabel = _d === void 0 ? label : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.color, color = _f === void 0 ? "primary" : _f, _g = _a.placement, placement = _g === void 0 ? 'top' : _g, _h = _a.onClick, onClick = _h === void 0 ? console.warn : _h, _j = _a.showArrow, showArrow = _j === void 0 ? true : _j, _k = _a.padding, padding = _k === void 0 ? 5 : _k, _l = _a.open, open = _l === void 0 ? undefined : _l, _m = _a.size, size = _m === void 0 ? exports.DEFAULT_ICON_BUTTON_SIZE : _m, _o = _a.offsetX, offsetX = _o === void 0 ? 0 : _o, _p = _a.offsetY, offsetY = _p === void 0 ? 0 : _p, _q = _a.enterDelay, enterDelay = _q === void 0 ? 0 : _q, _r = _a.enterNextDelay, enterNextDelay = _r === void 0 ? enterDelay : _r, style = _a.style;
    var positionStyle = {
        position: "relative", top: offsetY, left: offsetX,
    };
    var Button = ((0, jsx_runtime_1.jsx)(mui_1.IconButton, __assign({ color: color !== 'white' ? color : undefined, "aria-label": label !== null && label !== void 0 ? label : ariaLabel, style: __assign(__assign(__assign({ padding: padding }, disabled ? positionStyle : {}), (color === 'white' ? { color: disabled ? '#bdbdbd' : 'white' } : {})), style), onClick: onClick, id: id, disabled: disabled }, { children: (0, jsx_runtime_1.jsx)(Icon, { size: size, style: { fontSize: size } }) })));
    // don't include tooltip when disabled
    if (disabled)
        return Button;
    return ((0, jsx_runtime_1.jsx)(mui_1.Tooltip, __assign({ label: label, placement: placement, arrow: showArrow, open: open, enterDelay: enterDelay, enterNextDelay: enterNextDelay, style: positionStyle }, { children: Button })));
};
exports.LabeledIconButton = LabeledIconButton;
var CircularProgressIcon = function (_a) {
    var style = _a.style;
    return (0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ style: style }, { children: (0, jsx_runtime_1.jsx)(mui_1.CircularProgress, { style: style }) }));
};
var useAsyncAction = function (_a) {
    var action = _a.action, _b = _a.staysMounted, staysMounted = _b === void 0 ? true : _b, onSuccess = _a.onSuccess, onError = _a.onError, onChange = _a.onChange;
    var _c = (0, react_1.useState)(false), performingAction = _c[0], setPerformingAction = _c[1];
    var handlePerformAction = function () {
        setPerformingAction(true);
        onChange === null || onChange === void 0 ? void 0 : onChange(true);
        action()
            .then(onSuccess)
            .catch(onError !== null && onError !== void 0 ? onError : console.error)
            .finally(function () {
            if (staysMounted) {
                setPerformingAction(false);
                onChange === null || onChange === void 0 ? void 0 : onChange(false);
            }
        });
    };
    return { performingAction: performingAction, handlePerformAction: handlePerformAction };
};
exports.useAsyncAction = useAsyncAction;
var AsyncIconButton = function (_a) {
    var _b, _c;
    var Icon = _a.Icon, props = __rest(_a, ["Icon"]);
    var _d = (0, exports.useAsyncAction)(props), performingAction = _d.performingAction, handlePerformAction = _d.handlePerformAction;
    props.size = ((_b = props.size) !== null && _b !== void 0 ? _b : exports.DEFAULT_ICON_BUTTON_SIZE);
    if (props.size > 10) {
        props.size -= 5;
    } // reasonable size adjustment for default size of icon button
    return (0, jsx_runtime_1.jsx)(exports.LabeledIconButton, __assign({}, props, { disabled: (_c = props.disabled) !== null && _c !== void 0 ? _c : performingAction, onClick: handlePerformAction, Icon: performingAction
            ? function () { return ((0, jsx_runtime_1.jsx)(CircularProgressIcon, { style: {
                    minHeight: props.size, minWidth: props.size,
                    maxHeight: props.size, maxWidth: props.size,
                } })); } : Icon }));
};
exports.AsyncIconButton = AsyncIconButton;
var AsyncButton = function (_a) {
    var text = _a.text, _b = _a.loadingText, loadingText = _b === void 0 ? text : _b, variant = _a.variant, props = __rest(_a, ["text", "loadingText", "variant"]);
    var _c = (0, exports.useAsyncAction)(props), performingAction = _c.performingAction, handlePerformAction = _c.handlePerformAction;
    return ((0, jsx_runtime_1.jsx)(mui_1.Button, __assign({ disabled: performingAction, onClick: handlePerformAction, variant: variant }, { children: performingAction ? loadingText : text })));
};
exports.AsyncButton = AsyncButton;
var ClickToDownloadFileComponent = function (_a) {
    var secureName = _a.secureName, onDownload = _a.onDownload, onError = _a.onError, children = _a.children;
    var session = (0, index_1.useResolvedSession)();
    return ((0, jsx_runtime_1.jsx)(layout_1.Flex, __assign({ onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadURL, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, session.api.files.file_download_URL({ secureName: secureName })];
                    case 1:
                        downloadURL = (_a.sent()).downloadURL;
                        onDownload(downloadURL);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        onError === null || onError === void 0 ? void 0 : onError(err_1 === null || err_1 === void 0 ? void 0 : err_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); } }, { children: children })));
};
exports.ClickToDownloadFileComponent = ClickToDownloadFileComponent;
var useDownloadSecureFile = function (options) {
    var session = (0, index_1.useResolvedSession)();
    return {
        downloadFile: function (secureName) { return __awaiter(void 0, void 0, void 0, function () {
            var downloadURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, session.api.files.file_download_URL(__assign({ secureName: secureName }, options))];
                    case 1:
                        downloadURL = (_a.sent()).downloadURL;
                        return [2 /*return*/, downloadURL];
                }
            });
        }); }
    };
};
exports.useDownloadSecureFile = useDownloadSecureFile;
var DownloadFileIconButton = function (_a) {
    var preferInBrowser = _a.preferInBrowser, publicURL = _a.publicURL, secureName = _a.secureName, _b = _a.label, label = _b === void 0 ? "Download File" : _b, _c = _a.Icon, Icon = _c === void 0 ? mui_1.DownloadIcon : _c, onDownload = _a.onDownload, onError = _a.onError, props = __rest(_a, ["preferInBrowser", "publicURL", "secureName", "label", "Icon", "onDownload", "onError"]);
    var session = (0, index_1.useResolvedSession)();
    var _d = (0, react_1.useState)(publicURL !== null && publicURL !== void 0 ? publicURL : ''), downloadURL = _d[0], setDownloadURL = _d[1];
    return ((0, jsx_runtime_1.jsx)(exports.AsyncIconButton, __assign({ Icon: Icon }, props, { label: label, ariaLabel: 'download icon', action: function () { return __awaiter(void 0, void 0, void 0, function () {
            var downloadURL_1, err_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (downloadURL) {
                            onDownload(downloadURL);
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (!secureName)
                            return [2 /*return*/];
                        return [4 /*yield*/, session.api.files.file_download_URL({ secureName: secureName, preferInBrowser: preferInBrowser })];
                    case 2:
                        downloadURL_1 = (_b.sent()).downloadURL;
                        setDownloadURL(downloadURL_1);
                        onDownload(downloadURL_1);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        onError === null || onError === void 0 ? void 0 : onError((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.message) !== null && _a !== void 0 ? _a : '');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); } })));
};
exports.DownloadFileIconButton = DownloadFileIconButton;
var useModalIconButton = function (props) {
    var _a = react_1.default.useState(false), open = _a[0], setOpen = _a[1];
    return __assign({ open: open, setOpen: setOpen }, props);
};
exports.useModalIconButton = useModalIconButton;
exports.defaultModalStyle = {
    backgroundColor: '#ffffff',
    marginTop: '10vh',
    marginLeft: '10vw',
    height: '80vh',
    width: '80vw',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
};
var IconModal = function (_a) {
    var open = _a.open, setOpen = _a.setOpen, children = _a.children, disabled = _a.disabled, onClick = _a.onClick, style = _a.style, ModalComponent = _a.ModalComponent, props = __rest(_a, ["open", "setOpen", "children", "disabled", "onClick", "style", "ModalComponent"]);
    var defaultStyle = ModalComponent ? undefined : exports.defaultModalStyle;
    var ModalResolved = ModalComponent !== null && ModalComponent !== void 0 ? ModalComponent : mui_1.Modal;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ModalResolved, __assign({ open: open, setOpen: setOpen, style: style !== null && style !== void 0 ? style : defaultStyle }, { children: children })), (0, jsx_runtime_1.jsx)(exports.LabeledIconButton, __assign({ disabled: disabled || open }, props, { onClick: function (e) {
                    setOpen(function (o) { return !o; });
                    onClick === null || onClick === void 0 ? void 0 : onClick(e);
                } }))] }));
};
exports.IconModal = IconModal;
//# sourceMappingURL=controls.js.map