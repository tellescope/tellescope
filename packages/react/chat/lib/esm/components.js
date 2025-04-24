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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { AsyncIconButton, Flex, SendIcon, useChats, } from "@tellescope/react-components";
import { remove_script_tags } from "@tellescope/utilities";
import { TextField } from "@mui/material";
export var HTMLMessage = function (_a) {
    var html = _a.html;
    return (_jsx("div", { style: { padding: 2 }, dangerouslySetInnerHTML: {
            __html: remove_script_tags(html.replace(/<a/g, '<a style="color: white;"')),
        } }));
};
export var SendMessage = function (_a) {
    var roomId = _a.roomId, _b = _a.Icon, Icon = _b === void 0 ? SendIcon : _b, onNewMessage = _a.onNewMessage, _c = _a.placeholderText, placeholderText = _c === void 0 ? "Enter a message" : _c, _d = _a.style, style = _d === void 0 ? {} : _d, sendOnEnterPress = _a.sendOnEnterPress, multiline = _a.multiline, maxRows = _a.maxRows, size = _a.size, getAttachments = _a.getAttachments, inputRef = _a.inputRef;
    var _e = useState(''), message = _e[0], setMessage = _e[1];
    var _f = useState(false), sending = _f[0], setSending = _f[1];
    var _g = useState(false), disabled = _g[0], setDisabled = _g[1];
    var _h = React.useState(false), chatFocused = _h[0], setChatFocused = _h[1];
    var _j = useChats(roomId), createMessage = _j[1].createElement;
    useEffect(function () {
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
    return (_jsxs(Flex, __assign({ row: true, flex: 1, alignContent: "center", style: style }, { children: [_jsx(Flex, __assign({ column: true, flex: 1 }, { children: _jsx(TextField, { variant: "outlined", value: message, disabled: sending, size: size, ref: inputRef, onChange: function (e) { return setMessage(e.target.value); }, "aria-label": "Enter a message", multiline: multiline, maxRows: maxRows, placeholder: placeholderText, onFocus: function () { return setChatFocused(true); }, onBlur: function () { return setChatFocused(false); } }) })), _jsx(Flex, __assign({ column: true, alignSelf: "center" }, { children: _jsx(AsyncIconButton, { label: "send", Icon: Icon, disabled: message === '' || disabled, action: function () { return __awaiter(void 0, void 0, void 0, function () {
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
//# sourceMappingURL=components.js.map