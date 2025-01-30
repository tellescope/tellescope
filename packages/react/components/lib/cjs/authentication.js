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
exports.useResolvedSession = exports.Logout = exports.EnduserLogin = exports.UserLogin = exports.LoginForm = exports.useEnduserSession = exports.EnduserSession = exports.useSession = exports.useEnduserSessionContext = exports.WithEnduserSession = exports.EnduserSessionContext = exports.useSessionContext = exports.WithSession = exports.SessionContext = exports.useRunOnce = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var sdk_1 = require("@tellescope/sdk");
Object.defineProperty(exports, "EnduserSession", { enumerable: true, get: function () { return sdk_1.EnduserSession; } });
var forms_1 = require("./forms");
var useRunOnce = function (action) {
    var ref = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (ref.current)
            return;
        ref.current = true;
        action();
    }, [action]);
};
exports.useRunOnce = useRunOnce;
exports.SessionContext = (0, react_1.createContext)({});
var WithSession = function (p) {
    var _a = (0, react_1.useState)(function () { return new sdk_1.Session(p.sessionOptions); }), session = _a[0], setSession = _a[1];
    var _b = (0, react_1.useState)(0), updateCount = _b[0], setUpdateCount = _b[1]; // trigger refresh when keeping reference to session the same
    var lastRefreshRef = (0, react_1.useRef)(Date.now());
    var logout = function () {
        setSession(function (s) { return new sdk_1.Session(p.sessionOptions); });
        return session.logout();
    };
    var updateLocalSessionInfo = function (u, a) {
        session.setUserInfo(__assign(__assign({}, session.userInfo), u));
        session.setAuthToken(a || session.authToken);
        setSession(session);
        setUpdateCount(function (u) { return u + 1; });
    };
    var refresh = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!session.authToken)
                        return [2 /*return*/]; // refresh will fail
                    if ((_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.requiresMFA)
                        return [2 /*return*/]; // refresh will fail
                    // console.log('refreshing session')
                    return [4 /*yield*/, session.refresh_session({ invalidatePreviousToken: options === null || options === void 0 ? void 0 : options.invalidatePreviousToken })
                            .then(function (_a) {
                            var authToken = _a.authToken, user = _a.user;
                            return updateLocalSessionInfo(user, authToken);
                        })
                            .catch(function (e) { return console.error('error refreshing', e); })];
                case 1:
                    // console.log('refreshing session')
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, exports.useRunOnce)(refresh); // refresh on load
    (0, react_1.useEffect)(function () {
        // poll to automatically refresh session every hour
        var i = setInterval(function () {
            if (!session.authToken)
                return;
            if (lastRefreshRef.current > Date.now() - 10000)
                return; // don't refresh if last refresh was under 10 seconds ago
            lastRefreshRef.current = Date.now();
            session.refresh_session()
                .then(function (_a) {
                var authToken = _a.authToken, user = _a.user;
                return updateLocalSessionInfo(user, authToken);
            })
                .catch(console.error);
        }, 1000 * 60 * 60);
        return function () { clearInterval(i); };
    }, [session, updateLocalSessionInfo]);
    var updateUserInfo = function (updates, options) { return __awaiter(void 0, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, session.api.users.updateOne(session.userInfo.id, updates, options)];
                case 1:
                    updated = _a.sent();
                    return [4 /*yield*/, refresh()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, updated];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)(exports.SessionContext.Provider, __assign({ value: {
            session: session,
            updateCount: updateCount,
            refresh: refresh,
            logout: logout,
            updateUserInfo: updateUserInfo,
            updateLocalSessionInfo: updateLocalSessionInfo,
        } }, { children: p.children })));
};
exports.WithSession = WithSession;
var useSessionContext = function () { return (0, react_1.useContext)(exports.SessionContext); };
exports.useSessionContext = useSessionContext;
exports.EnduserSessionContext = (0, react_1.createContext)({});
var WithEnduserSession = function (p) {
    var _a = (0, react_1.useState)(function () { return new sdk_1.EnduserSession(p.sessionOptions); }), enduserSession = _a[0], setEnduserSession = _a[1];
    var logout = function () {
        setEnduserSession(function (s) { return new sdk_1.EnduserSession(p.sessionOptions); });
        return enduserSession.logout();
    };
    var updateLocalSessionInfo = function (u, a) {
        setEnduserSession(function (s) {
            var _a;
            return new sdk_1.EnduserSession(__assign(__assign({}, s), { handleUnauthenticated: s.handleUnauthenticated, host: s.host, apiKey: s.apiKey, authToken: a !== null && a !== void 0 ? a : s.authToken, businessId: (_a = u.businessId) !== null && _a !== void 0 ? _a : s.businessId, enduser: __assign(__assign({}, s.userInfo), u) }));
        });
    };
    var refresh = function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, authToken, enduser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, enduserSession.refresh_session(args)];
                case 1:
                    _a = _b.sent(), authToken = _a.authToken, enduser = _a.enduser;
                    updateLocalSessionInfo(enduser, authToken);
                    return [2 /*return*/];
            }
        });
    }); };
    var updateUserInfo = function (updates, options) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, enduser, authToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, enduserSession.api.endusers.updateOne(enduserSession.userInfo.id, updates, options)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, enduserSession.refresh_session()];
                case 2:
                    _a = _b.sent(), enduser = _a.enduser, authToken = _a.authToken;
                    updateLocalSessionInfo(enduser, authToken);
                    return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)(exports.EnduserSessionContext.Provider, __assign({ value: {
            enduserSession: enduserSession,
            refresh: refresh,
            logout: logout,
            updateUserInfo: updateUserInfo,
            updateLocalSessionInfo: updateLocalSessionInfo,
        } }, { children: p.children })));
};
exports.WithEnduserSession = WithEnduserSession;
var useEnduserSessionContext = function () { return (0, react_1.useContext)(exports.EnduserSessionContext); };
exports.useEnduserSessionContext = useEnduserSessionContext;
var useSession = function (o) {
    if (o === void 0) { o = {}; }
    var session = (0, react_1.useContext)(exports.SessionContext).session;
    if (!session && o.throwIfMissingContext !== false) {
        throw new Error("useSession used outside of WithSession");
    }
    return session !== null && session !== void 0 ? session : null;
};
exports.useSession = useSession;
var useEnduserSession = function (o) {
    if (o === void 0) { o = {}; }
    var enduserSession = (0, react_1.useContext)(exports.EnduserSessionContext).enduserSession;
    if (!enduserSession && o.throwIfMissingContext !== false) {
        throw new Error("useEnduserSession used outside of WithEnduserSession");
    }
    return enduserSession !== null && enduserSession !== void 0 ? enduserSession : null;
};
exports.useEnduserSession = useEnduserSession;
var LoginForm = function (_a) {
    var onSubmit = _a.onSubmit, style = _a.style, fillEmail = _a.fillEmail, fillPassword = _a.fillPassword;
    return ((0, jsx_runtime_1.jsx)(forms_1.FormBuilder, { disabledIfUnchanged: false, style: style, fields: {
            email: (0, forms_1.emailInput)({ id: 'email', initialValue: fillEmail }),
            password: (0, forms_1.passwordInput)({ id: 'password', initialValue: fillPassword }),
        }, submitText: "Login", submittingText: "Logging in", onSubmit: onSubmit }));
};
exports.LoginForm = LoginForm;
var UserLogin = function (_a) {
    var onLogin = _a.onLogin, props = __rest(_a, ["onLogin"]);
    var _b = (0, react_1.useContext)(exports.SessionContext), session = _b.session, updateLocalSessionInfo = _b.updateLocalSessionInfo;
    if (!(session && updateLocalSessionInfo))
        throw new Error("UserLogin used outside of WithSession");
    return ((0, jsx_runtime_1.jsx)(exports.LoginForm, __assign({}, props, { onSubmit: function (_a) {
            var email = _a.email, password = _a.password;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, authToken, userInfo;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, session.authenticate(email, password)];
                        case 1:
                            _b = _c.sent(), authToken = _b.authToken, userInfo = __rest(_b, ["authToken"]);
                            updateLocalSessionInfo === null || updateLocalSessionInfo === void 0 ? void 0 : updateLocalSessionInfo(userInfo, authToken);
                            onLogin === null || onLogin === void 0 ? void 0 : onLogin(__assign({ authToken: authToken }, userInfo));
                            return [2 /*return*/];
                    }
                });
            });
        } })));
};
exports.UserLogin = UserLogin;
var EnduserLogin = function (_a) {
    var onLogin = _a.onLogin, props = __rest(_a, ["onLogin"]);
    var _b = (0, react_1.useContext)(exports.EnduserSessionContext), enduserSession = _b.enduserSession, updateLocalSessionInfo = _b.updateLocalSessionInfo;
    if (!(enduserSession && updateLocalSessionInfo))
        throw new Error("EnduserLogin used outside of WithEnduserSession");
    return ((0, jsx_runtime_1.jsx)(exports.LoginForm, __assign({}, props, { onSubmit: function (_a) {
            var email = _a.email, password = _a.password;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, authToken, enduser;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, enduserSession.authenticate(email, password)];
                        case 1:
                            _b = _c.sent(), authToken = _b.authToken, enduser = _b.enduser;
                            updateLocalSessionInfo === null || updateLocalSessionInfo === void 0 ? void 0 : updateLocalSessionInfo(enduser, authToken);
                            onLogin === null || onLogin === void 0 ? void 0 : onLogin(__assign({ authToken: authToken }, enduser));
                            return [2 /*return*/];
                    }
                });
            });
        } })));
};
exports.EnduserLogin = EnduserLogin;
var Logout = function (_a) {
    var _b, _c;
    var onLogout = _a.onLogout, children = _a.children;
    var _d = (_b = (0, react_1.useContext)(exports.SessionContext)) !== null && _b !== void 0 ? _b : {}, session = _d.session, updateLocalSessionInfo = _d.updateLocalSessionInfo, logoutUser = _d.logout;
    var _e = (_c = (0, react_1.useContext)(exports.EnduserSessionContext)) !== null && _c !== void 0 ? _c : {}, enduserSession = _e.enduserSession, updateLocalEnduserSessionInfo = _e.updateLocalSessionInfo, logoutEnduser = _e.logout;
    var loggedOut = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loggedOut.current)
            return;
        loggedOut.current = true;
        var s = (session !== null && session !== void 0 ? session : enduserSession);
        if (!s)
            throw new Error("Missing SessionContext and EnduserSessionContext");
        s.logout()
            .finally(function () {
            if (session) {
                logoutUser().catch(console.error);
            }
            else {
                logoutEnduser().catch(console.error);
            }
            onLogout === null || onLogout === void 0 ? void 0 : onLogout();
        });
    }, [session, enduserSession, updateLocalSessionInfo, updateLocalEnduserSessionInfo, loggedOut]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.Logout = Logout;
var useResolvedSession = function (type) {
    var u_session = (0, exports.useSession)({ throwIfMissingContext: type === 'user' });
    var e_session = (0, exports.useEnduserSession)({ throwIfMissingContext: type === 'enduser' });
    if (u_session === null && e_session === null) {
        throw new Error("Could not resolve session for user or enduser. Ensure you are using the proper WithSession or WithEnduserSession provider.");
    }
    return (type === 'user' ? u_session
        : type === 'enduser' ? e_session
            : (u_session !== null && u_session !== void 0 ? u_session : e_session));
};
exports.useResolvedSession = useResolvedSession;
//# sourceMappingURL=authentication.js.map