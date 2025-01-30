"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.useHandleError = exports.parseUniquenessError = exports.stringForError = exports.ErrorBoundary = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var _1 = require(".");
var constants_1 = require("@tellescope/constants");
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
        console.error(error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (0, jsx_runtime_1.jsx)("h1", { children: (_a = this.props.errorMessage) !== null && _a !== void 0 ? _a : "Something went wrong." });
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
exports.ErrorBoundary = ErrorBoundary;
var stringForError = function (err) {
    var _a, _b;
    var toReturn = (_b = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err === null || err === void 0 ? void 0 : err.toString()) !== null && _b !== void 0 ? _b : 'An unexpected error occurred';
    // if ?.message isn't a string (by mistake), handle gracefully
    if (typeof toReturn === 'object') {
        return JSON.stringify(toReturn, null, 2);
    }
    return toReturn;
};
exports.stringForError = stringForError;
var parseUniquenessError = function (err, uniquenessMessage) {
    var message = (0, exports.stringForError)(err);
    if (message === constants_1.UNIQUENESS_VIOLATION)
        return uniquenessMessage;
    return message;
};
exports.parseUniquenessError = parseUniquenessError;
var useHandleError = function (props) {
    var uniquenessError = (props !== null && props !== void 0 ? props : {}).uniquenessError;
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(''), error = _b[0], setError = _b[1];
    var handleAPIError = (0, react_1.useCallback)(function (handler) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1, errorMessage;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setError('');
                    setLoading(true);
                    return [4 /*yield*/, handler()];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    errorMessage = (0, exports.stringForError)(err_1);
                    setError(errorMessage === constants_1.UNIQUENESS_VIOLATION && uniquenessError
                        ? uniquenessError
                        : errorMessage);
                    (_a = props === null || props === void 0 ? void 0 : props.onError) === null || _a === void 0 ? void 0 : _a.call(props, { message: errorMessage });
                    if (props === null || props === void 0 ? void 0 : props.throwOnError)
                        throw err_1;
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [uniquenessError]);
    var errorDisplay = (error
        ? (0, jsx_runtime_1.jsx)(_1.Typography, __assign({ style: { marginTop: 3 }, color: "error" }, { children: error }))
        : null);
    return {
        handleAPIError: handleAPIError,
        error: error,
        loading: loading,
        errorDisplay: errorDisplay
    };
};
exports.useHandleError = useHandleError;
//# sourceMappingURL=errors.js.map