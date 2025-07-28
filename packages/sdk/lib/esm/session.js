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
import axios from "axios";
import NodeFormData from "form-data";
export var DEFAULT_HOST = 'https://api.tellescope.com';
export var wait = function (f, ms) {
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return f ? f.then(resolve).catch(reject) : resolve(); }, ms);
    });
};
var generateBearer = function (authToken) { return "Bearer ".concat(authToken); };
var generateAPIKeyHeader = function (authToken) { return "API_KEY ".concat(authToken); };
var parseError = function (err) {
    var _a, _b;
    if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 413)
        return "Please try again with less data or a smaller file.";
    if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.status) === 500)
        return "Something went wrong on our end, and our team has been notified. Please try again later.";
    if (err.response && err.response.data)
        return err.response.data;
    // worker uses string match to detect API down and allow retry, do not change
    if (err.request)
        return "No response - please check your Internet connection and try again";
    if (err.message)
        return err.message;
    return err;
};
var DEFAULT_AUTHTOKEN_KEY = 'tellescope_authToken';
var has_local_storage = function () {
    try {
        return (typeof window !== 'undefined' && !!window.localStorage);
    }
    catch (err) { // no access due to incognito browser, etc.
        console.log('error caught in has_local_storage', err);
        return false;
    }
};
var set_cache = function (key, authToken) {
    if (!has_local_storage())
        return;
    try {
        window.localStorage[key] = authToken; // browser settings may still deny access, need to catch the error
    }
    catch (err) { }
};
var access_cache = function (key) {
    if (key === void 0) { key = DEFAULT_AUTHTOKEN_KEY; }
    if (!has_local_storage())
        return;
    try {
        return window.localStorage[key]; // browser settings may still deny access, need to catch the error
    }
    catch (err) {
        return '';
    }
};
export var SOCKET_POLLING_DELAY = 250;
// Custom paramsSerializer function that replicates axios 0.21.4 default behavior
function defaultParamsSerializer(params) {
    var parts = [];
    // Helper function to check if value is an array
    function isArray(val) {
        return Array.isArray(val);
    }
    // Helper function to check if value is a date
    function isDate(val) {
        return Object.prototype.toString.call(val) === '[object Date]';
    }
    // Helper function to check if value is an object
    function isObject(val) {
        return val !== null && typeof val === 'object' && !isArray(val) && !isDate(val);
    }
    // Helper function to iterate over object properties
    function forEach(obj, fn) {
        if (obj === null || typeof obj === "undefined") {
            return;
        }
        var processObj;
        if (typeof obj !== "object") {
            processObj = [obj];
        }
        else {
            processObj = obj;
        }
        if (isArray(processObj)) {
            for (var i = 0, l = processObj.length; i < l; i++) {
                fn.call(null, processObj[i], i, processObj);
            }
        }
        else {
            for (var key in processObj) {
                if (Object.prototype.hasOwnProperty.call(processObj, key)) {
                    fn.call(null, processObj[key], key, processObj);
                }
            }
        }
    }
    forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
            return;
        }
        var processKey = String(key);
        var processVal;
        if (isArray(val)) {
            processKey = processKey + '[]';
            processVal = val;
        }
        else {
            processVal = [val];
        }
        forEach(processVal, function parseValue(v) {
            var stringValue;
            if (isDate(v)) {
                stringValue = v.toISOString();
            }
            else if (isObject(v)) {
                stringValue = JSON.stringify(v);
            }
            else {
                stringValue = String(v);
            }
            parts.push(encodeURIComponent(processKey) + '=' + encodeURIComponent(stringValue));
        });
    });
    return parts.join('&');
}
var Session = /** @class */ (function () {
    function Session(o) {
        if (o === void 0) { o = {}; }
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.sessionStart = Date.now();
        this.AUTO_REFRESH_MS = 3600000; // 1hr elapsed
        this.resolve_field = function (p, field) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p()];
                case 1: return [2 /*return*/, (_a.sent())[field]];
            }
        }); }); };
        this.setAuthToken = function (a) {
            _this.authToken = a;
            _this.config.headers.Authorization = generateBearer(a);
            set_cache(_this.cacheKey, a);
        };
        this.setUserInfo = function (u) {
            var _a;
            _this.userInfo = u;
            _this.organizationIds = (_a = _this.organizationIds) !== null && _a !== void 0 ? _a : u.organizationIds;
            set_cache(_this.cacheKey + 'userInfo', JSON.stringify(u));
        };
        this.clearCache = function () {
            set_cache(_this.cacheKey, '');
            set_cache(_this.cacheKey + 'userInfo', '');
        };
        this.clearState = function (keepSocket) {
            _this.apiKey = '';
            _this.authToken = '';
            _this.userInfo = {};
            _this.clearCache();
        };
        this.getAuthInfo = function (requiresAuth) { return requiresAuth && (_this.apiKey ? {} // included in headers
            : _this.servicesSecret ? {
                servicesSecret: _this.servicesSecret,
                sessionInfo: __assign(__assign({}, _this.userSessionInfo), { businessId: _this.businessId, organization: _this.businessId }),
            }
                : {}); };
        this.errorHandler = function (_err) { return __awaiter(_this, void 0, void 0, function () {
            var err, refreshed;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        err = parseError(_err);
                        if (!(err === 'Unauthenticated')) return [3 /*break*/, 2];
                        return [4 /*yield*/, ((_a = this.handleUnauthenticated) === null || _a === void 0 ? void 0 : _a.call(this))];
                    case 1:
                        refreshed = _b.sent();
                        if (!refreshed) {
                            this.clearState();
                        }
                        _b.label = 2;
                    case 2: return [2 /*return*/, err];
                }
            });
        }); };
        this.POST = function (endpoint, args, authenticated, o) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, axios.post(this.host + endpoint, __assign(__assign({}, args), this.getAuthInfo(authenticated)), __assign(__assign({}, this.config), o))];
                        case 1: return [2 /*return*/, (_a.sent()).data];
                        case 2:
                            err_1 = _a.sent();
                            return [4 /*yield*/, this.errorHandler(err_1)];
                        case 3: throw _a.sent();
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        this.GET = function (endpoint, params, authenticated, options) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, axios.get(this.host + endpoint, __assign({ params: __assign(__assign({}, params), this.getAuthInfo(authenticated)), headers: this.config.headers, paramsSerializer: defaultParamsSerializer }, options))];
                        case 1: return [2 /*return*/, (_a.sent()).data];
                        case 2:
                            err_2 = _a.sent();
                            return [4 /*yield*/, this.errorHandler(err_2)];
                        case 3: throw _a.sent();
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        this.PATCH = function (endpoint, params, authenticated) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, axios.patch(this.host + endpoint, __assign(__assign({}, params), this.getAuthInfo(authenticated)), this.config)];
                        case 1: return [2 /*return*/, (_a.sent()).data];
                        case 2:
                            err_3 = _a.sent();
                            return [4 /*yield*/, this.errorHandler(err_3)];
                        case 3: throw _a.sent();
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        this.DELETE = function (endpoint, args, authenticated) {
            if (authenticated === void 0) { authenticated = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 4]);
                            return [4 /*yield*/, axios.delete(this.host + endpoint, { data: __assign(__assign({}, args), this.getAuthInfo(authenticated)),
                                    headers: this.config.headers })];
                        case 1: return [2 /*return*/, (_a.sent()).data];
                        case 2:
                            err_4 = _a.sent();
                            return [4 /*yield*/, this.errorHandler(err_4)];
                        case 3: throw _a.sent();
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        this.UPLOAD = function (presigned, file) { return __awaiter(_this, void 0, void 0, function () {
            var formData, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new NodeFormData();
                        Object.keys(presigned.fields).forEach(function (key) {
                            formData.append(key, presigned.fields[key]);
                        });
                        formData.append("file", file); // must be appended last
                        headers = formData.getHeaders ? __assign(__assign({}, formData.getHeaders()), { 'Content-Length': formData.maxDataSize }) : { 'Content-Type': 'multipart/form-data' };
                        return [4 /*yield*/, axios.post(presigned.url, formData, { headers: headers })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.DOWNLOAD = function (downloadURL) { return __awaiter(_this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get(downloadURL)];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, content.data];
                }
            });
        }); };
        this.EMIT = function (route, args, authenticated, options) {
            if (authenticated === void 0) { authenticated = true; }
            if (options === void 0) { options = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        this.ON = function (s, callback) {
            //this.socket?.on(s, callback)
        };
        /**
        * @deprecated Use handle_events, subscription is no longer necessary
        */
        this.subscribe = function (rooms, handlers) {
            console.warn("subscribe is deprecated in favor of handle_events, as they are now functionally the same");
            if (handlers) {
                _this.handle_events(handlers);
            }
        };
        this.handle_events = function (handlers) {
            for (var handler in handlers) {
                // load any data that was pushed to this event while handler was off
                var loadedData = _this.loadedSocketEvents[handler];
                if (Array.isArray(loadedData) && loadedData.length > 0) {
                    _this.loadedSocketEvents[handler] = [];
                    handlers[handler](loadedData);
                }
                // set handler on to load data directly for an event
                _this.handlers[handler] = handlers[handler];
            }
        };
        this.unsubscribe = function (roomIds) { return _this.EMIT('leave-rooms', { roomIds: roomIds }); };
        this.removeAllSocketListeners = function () {
            if (_this.enableSocketLogging) {
                console.log('removeAllSocketListeners');
            }
            _this.handlers = {};
        };
        this.removeListenersForEvent = function (event) {
            delete _this.handlers[event];
        };
        this.socket_log = function (message) {
            console.log("".concat(_this.type, " ").concat(_this.userInfo.id, " got socket message: ").concat(message));
        };
        this.initialize_socket = function () {
            var _a;
            if (!(((_a = _this.userInfo) === null || _a === void 0 ? void 0 : _a.businessId) || _this.businessId)) {
                if (_this.enableSocketLogging) {
                    console.warn("Attempting to initialize_socket without businessId set");
                }
                return;
            }
            if (!_this.authToken)
                return;
            if (_this.userInfo.denySocket) {
                console.warn("not attempting socket connection since denySocket: true");
                return;
            }
        };
        this.socket_ping = function (handler) { };
        this.authenticate_socket = function () {
            // if (this.userInfo.requiresMFA) return
            // if (this.lastSocketConnection + 2500 > Date.now()) return
            // this.lastSocketConnection = Date.now()
            // if (this.enableSocketLogging) console.log('authenticating socket')
            // this.initialize_socket()
            // if (!this.socket) {
            //   console.warn("failed to initialize_socket")
            //   return
            // }
            // this.socket.removeAllListeners()
            // this.socket.on('ping', () => {
            //   if (this.enableSocketLogging) { this.socket_log("pong") }
            // })
            // // handle events which are sent when handlers may be off
            // this.socket?.onAny((e, v)=> {
            //   if (this.handlers[e] && v) {
            //     this.handlers[e](v)
            //   } else if (Array.isArray(v)) {
            //     if (!this.loadedSocketEvents[e]) {
            //       this.loadedSocketEvents[e] = []
            //     }
            //     this.loadedSocketEvents[e].push(...v)
            //   }
            // })
            // this.socket.on('connect', () => {
            //   if (this.enableSocketLogging) { this.socket_log(`connect, authenticated=${this.socketAuthenticated}`) }
            // })
            // this.socket.on('disconnect', () => { 
            //   this.socketAuthenticated = false 
            //   if (this.enableSocketLogging) { this.socket_log("disconnect") }
            // })
            // this.socket.on('authenticated', () => { 
            //   this.socketAuthenticated = true 
            //   // if (this.enableSocketLogging) { 
            //   this.socket_log("authenticated") 
            //   // }
            // })
            // this.socket.on('error', (error: any) => {
            //   console.warn('socket error: ', error)
            // })
            // this.socket.on('connect_error', (error: any) => {
            //   console.warn('connect_error: ', error)
            //   // setTimeout(() => {
            //   //   this.socket?.connect()
            //   // })
            // })
        };
        /** @deprecated */
        this.connectSocket = function () { return __awaiter(_this, void 0, void 0, function () {
            var loopCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.socketAuthenticated)
                            return [2 /*return*/];
                        loopCount = 0;
                        // await wait(undefined, SOCKET_POLLING_DELAY)
                        this.authenticate_socket();
                        _a.label = 1;
                    case 1:
                        if (!(!(this.socketAuthenticated) && ++loopCount < 10)) return [3 /*break*/, 3];
                        return [4 /*yield*/, wait(undefined, SOCKET_POLLING_DELAY)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        if (loopCount === 10) {
                            console.error("Failed to authenticate ".concat(this.type, " ").concat(this.userInfo.id, " after 10 attempts"));
                            return [2 /*return*/];
                        }
                        if (this.enableSocketLogging) {
                            console.log("Authenticated ".concat(this.type, " ").concat(this.userInfo.id, " after ").concat(loopCount, " reconnection attempts"));
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        if (o.servicesSecret && !o.businessId)
            throw new Error("Services secret provided without businessId");
        if (o.enableSocketLogging) {
            console.log("socket log: Creating new Session");
        }
        this.lastSocketConnection = 0;
        this.handlers = {};
        this.loadedSocketEvents = {};
        this.host = (_a = o.host) !== null && _a !== void 0 ? _a : DEFAULT_HOST;
        this.apiKey = (_b = o.apiKey) !== null && _b !== void 0 ? _b : '';
        this.servicesSecret = o.servicesSecret;
        this.businessId = o.businessId;
        this.organizationIds = (_c = o.organizationIds) !== null && _c !== void 0 ? _c : (_d = o.user) === null || _d === void 0 ? void 0 : _d.organizationIds;
        this.expirationInSeconds = o.expirationInSeconds;
        this.socketAuthenticated = false;
        this.handleUnauthenticated = o.handleUnauthenticated;
        this.enableSocketLogging = o.enableSocketLogging;
        this.type = o.type;
        this.cacheKey = o.cacheKey || DEFAULT_AUTHTOKEN_KEY;
        // keep ?? over || to allow '' argument to avoid access_cache
        this.authToken = (_f = (_e = o.authToken) !== null && _e !== void 0 ? _e : access_cache(o.cacheKey)) !== null && _f !== void 0 ? _f : '';
        this.userInfo = (_g = o === null || o === void 0 ? void 0 : o.user) !== null && _g !== void 0 ? _g : JSON.parse(access_cache(o.cacheKey + 'userInfo') || '{}');
        if (this.authToken) {
            set_cache(this.cacheKey, this.authToken);
            if ((this.businessId || this.userInfo.businessId)) {
                this.authenticate_socket();
            }
        }
        this.config = {
            headers: {
                Authorization: (this.apiKey
                    ? generateAPIKeyHeader(this.apiKey)
                    : generateBearer((_h = this.authToken) !== null && _h !== void 0 ? _h : ''))
            }
        }; // initialize after authToken
    }
    return Session;
}());
export { Session };
//# sourceMappingURL=session.js.map