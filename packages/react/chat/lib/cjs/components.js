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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = exports.HTMLMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_components_1 = require("@tellescope/react-components");
var utilities_1 = require("@tellescope/utilities");
var material_1 = require("@mui/material");
var HTMLMessage = function (_a) {
    var html = _a.html;
    return ((0, jsx_runtime_1.jsx)("div", { style: { padding: 2 }, dangerouslySetInnerHTML: {
            __html: (0, utilities_1.remove_script_tags)(html.replace(/<a/g, '<a style="color: white;"')),
        } }));
};
exports.HTMLMessage = HTMLMessage;
var SendMessage = function (_a) {
    var roomId = _a.roomId, _b = _a.Icon, Icon = _b === void 0 ? react_components_1.SendIcon : _b, onNewMessage = _a.onNewMessage, _c = _a.placeholderText, placeholderText = _c === void 0 ? "Enter a message" : _c, _d = _a.style, style = _d === void 0 ? {} : _d, sendOnEnterPress = _a.sendOnEnterPress, multiline = _a.multiline, maxRows = _a.maxRows, size = _a.size, getAttachments = _a.getAttachments;
    var _e = (0, react_1.useState)(''), message = _e[0], setMessage = _e[1];
    var _f = (0, react_1.useState)(false), sending = _f[0], setSending = _f[1];
    var _g = (0, react_1.useState)(false), disabled = _g[0], setDisabled = _g[1];
    var _h = react_1.default.useState(false), chatFocused = _h[0], setChatFocused = _h[1];
    var _j = (0, react_components_1.useChats)(roomId), createMessage = _j[1].createElement;
    (0, react_1.useEffect)(function () {
        if (!chatFocused)
            return;
        if (!sendOnEnterPress)
            return;
        if (typeof window === 'undefined')
            return;
        var handleSend = function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var attachments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (e.key !== 'Enter')
                            return [2 /*return*/];
                        setDisabled(true);
                        if (!message.trim())
                            return [2 /*return*/];
                        return [4 /*yield*/, (getAttachments === null || getAttachments === void 0 ? void 0 : getAttachments())];
                    case 1:
                        attachments = _a.sent();
                        createMessage({ message: message, roomId: roomId, attachments: attachments })
                            .then(function (m) {
                            setMessage('');
                            onNewMessage === null || onNewMessage === void 0 ? void 0 : onNewMessage(m);
                        })
                            .catch(console.error)
                            .finally(function () { return setDisabled(false); });
                        return [2 /*return*/];
                }
            });
        }); };
        window.addEventListener('keypress', handleSend);
        return function () { window.removeEventListener('keypress', handleSend); };
    }, [sendOnEnterPress, chatFocused, message, roomId]);
    return ((0, jsx_runtime_1.jsxs)(react_components_1.Flex, __assign({ row: true, flex: 1, alignContent: "center", style: style }, { children: [(0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, flex: 1 }, { children: (0, jsx_runtime_1.jsx)(material_1.TextField, { variant: "outlined", value: message, disabled: sending, size: size, onChange: function (e) { return setMessage(e.target.value); }, "aria-label": "Enter a message", multiline: multiline, maxRows: maxRows, placeholder: placeholderText, onFocus: function () { return setChatFocused(true); }, onBlur: function () { return setChatFocused(false); } }) })), (0, jsx_runtime_1.jsx)(react_components_1.Flex, __assign({ column: true, alignSelf: "center" }, { children: (0, jsx_runtime_1.jsx)(react_components_1.AsyncIconButton, { label: "send", Icon: Icon, disabled: message === '' || disabled, action: function () { return __awaiter(void 0, void 0, void 0, function () {
                        var attachments;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (getAttachments === null || getAttachments === void 0 ? void 0 : getAttachments())];
                                case 1:
                                    attachments = _a.sent();
                                    return [2 /*return*/, createMessage({ message: message, roomId: roomId, attachments: attachments })];
                            }
                        });
                    }); }, onSuccess: function (m) {
                        setMessage('');
                        onNewMessage === null || onNewMessage === void 0 ? void 0 : onNewMessage(m);
                    }, onChange: setSending }) }))] })));
};
exports.SendMessage = SendMessage;
//# sourceMappingURL=components.js.map