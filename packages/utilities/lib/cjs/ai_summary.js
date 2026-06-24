"use strict";
// Shared, transport-agnostic AI summary code.
//
// This module holds the *pure* parts of the Form "AI profile summary" feature so they can be
// reused by both the webapp SDK loader (data_sources.ts) and the backend DB loader
// (api/modules/ai_summary_context.ts). It must stay free of any SDK/DB/React imports — only
// plain record shapes, the types-models Enduser, and constants.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAISummaryContext = exports.assembleAISummaryContext = exports.buildAISummarySourceFilter = exports.sanitizeFilter = exports.aiSummaryError = exports.FORBIDDEN_FILTER_OPERATORS = exports.enduserProfileToText = exports.DATA_SOURCE_MAP = exports.DATA_SOURCE_LABELS = exports.fmtObservation = exports.fmtResponses = exports.fmtFromMS = exports.fmt = exports.stripHtml = void 0;
var constants_1 = require("@tellescope/constants");
/* ---------------------------------- formatters ---------------------------------- */
var stripHtml = function (s) { return s
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim(); };
exports.stripHtml = stripHtml;
var fmt = function (d) {
    if (!d)
        return '';
    try {
        return new Date(d).toISOString().slice(0, 16).replace('T', ' ');
    }
    catch (_a) {
        return '';
    }
};
exports.fmt = fmt;
var fmtFromMS = function (ms) {
    if (typeof ms !== 'number')
        return '';
    try {
        return new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
    }
    catch (_a) {
        return '';
    }
};
exports.fmtFromMS = fmtFromMS;
var fmtResponses = function (responses) {
    if (!Array.isArray(responses))
        return '';
    return responses
        .map(function (r) {
        var ans = r === null || r === void 0 ? void 0 : r.answer;
        var v = ans === null || ans === void 0 ? void 0 : ans.value;
        if (v === undefined || v === null)
            return '';
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            return "".concat(r.fieldTitle || '', ": ").concat(v);
        }
        if (Array.isArray(v))
            return "".concat(r.fieldTitle || '', ": ").concat(v.map(function (x) { var _a; return (_a = x === null || x === void 0 ? void 0 : x.label) !== null && _a !== void 0 ? _a : x; }).join(', '));
        return '';
    })
        .filter(Boolean)
        .join(' | ');
};
exports.fmtResponses = fmtResponses;
var fmtObservation = function (o) {
    var _a, _b, _c, _d;
    var m = o.measurement;
    // numeric value + unit when present; fall back to qualitative result ("positive", etc.)
    var reading = m && typeof m.value === 'number'
        ? "".concat(m.value).concat(m.unit ? " ".concat(m.unit) : '')
        : ((_a = o.qualitativeResult) !== null && _a !== void 0 ? _a : '');
    var name = o.type || o.code || o.category || ''; // what was measured
    var extras = [
        o.refRange ? "ref ".concat(o.refRange) : '',
        (_b = o.statusIndicator) !== null && _b !== void 0 ? _b : '',
    ].filter(Boolean).join(', ');
    var label = name ? "".concat(name, ": ") : '';
    var tail = extras ? " (".concat(extras, ")") : '';
    return "[Observation ".concat((0, exports.fmt)((_d = (_c = o.timestamp) !== null && _c !== void 0 ? _c : o.recordedAt) !== null && _d !== void 0 ? _d : o.createdAt), "] ").concat(label).concat(reading).concat(tail).trim();
};
exports.fmtObservation = fmtObservation;
/* ---------------------------------- data source metadata ---------------------------------- */
exports.DATA_SOURCE_LABELS = {
    enduser_observations: 'Observations',
    form_responses: 'Form Responses',
    chats: 'Chat Messages',
    phone_calls: 'Phone Calls',
    calendar_events: 'Calendar Events',
    tickets: 'Tickets',
    sms_messages: 'SMS Messages',
    emails: 'Emails',
    enduser_orders: 'Orders',
    enduser_medications: 'Medications',
    purchases: 'Purchases',
};
exports.DATA_SOURCE_MAP = {
    enduser_observations: {
        collection: 'enduser_observations',
        sortField: 'timestamp',
        format: exports.fmtObservation,
    },
    form_responses: {
        collection: 'form_responses',
        sortField: 'submittedAt',
        format: function (fr) { var _a, _b; return "[Form \"".concat((_a = fr.formTitle) !== null && _a !== void 0 ? _a : '', "\" ").concat((0, exports.fmt)((_b = fr.submittedAt) !== null && _b !== void 0 ? _b : fr.createdAt), "] ").concat((0, exports.fmtResponses)(fr.responses)); },
    },
    chats: {
        collection: 'chats',
        sortField: 'timestamp',
        // enduserId is set only on enduser-authored chats (schema initializer); senderId is always set
        // (userId for staff, enduserId for patients) so it can't distinguish the sender.
        format: function (m) { var _a, _b; return "[Chat ".concat((0, exports.fmt)((_a = m.timestamp) !== null && _a !== void 0 ? _a : m.createdAt), " ").concat(m.enduserId ? 'patient' : 'staff', "] ").concat((_b = m.message) !== null && _b !== void 0 ? _b : ''); },
    },
    phone_calls: {
        collection: 'phone_calls',
        sortField: 'createdAt',
        format: function (c) { var _a, _b, _c, _d; return "[Call ".concat((0, exports.fmt)(c.createdAt), " ").concat((_a = c.direction) !== null && _a !== void 0 ? _a : '', " ").concat((_b = c.durationInSeconds) !== null && _b !== void 0 ? _b : 0, "s] ").concat((_d = (_c = c.aiSummary) !== null && _c !== void 0 ? _c : c.summary) !== null && _d !== void 0 ? _d : ''); },
    },
    calendar_events: {
        collection: 'calendar_events',
        sortField: 'startTimeInMS',
        format: function (e) { var _a, _b; return "[Appt ".concat((0, exports.fmtFromMS)(e.startTimeInMS), "] ").concat((_a = e.title) !== null && _a !== void 0 ? _a : '', " (").concat((_b = e.type) !== null && _b !== void 0 ? _b : '', ")"); },
        enduserMatchClause: function (enduserId) { return ({ 'attendees.id': enduserId }); },
    },
    tickets: {
        collection: 'tickets',
        sortField: 'createdAt',
        format: function (t) { var _a; return "[Ticket ".concat((0, exports.fmt)(t.createdAt), " ").concat(t.closedAt ? 'closed' : 'open', "] ").concat((_a = t.title) !== null && _a !== void 0 ? _a : ''); },
    },
    sms_messages: {
        collection: 'sms_messages',
        sortField: 'timestamp',
        format: function (s) { var _a, _b; return "[SMS ".concat((0, exports.fmt)((_a = s.timestamp) !== null && _a !== void 0 ? _a : s.createdAt), " ").concat(s.inbound ? 'in' : 'out', "] ").concat((_b = s.message) !== null && _b !== void 0 ? _b : ''); },
    },
    emails: {
        collection: 'emails',
        sortField: 'timestamp',
        format: function (e) {
            var _a, _b;
            var body = e.textContent || (0, exports.stripHtml)(e.HTMLContent || '');
            return "[Email ".concat((0, exports.fmt)((_a = e.timestamp) !== null && _a !== void 0 ? _a : e.createdAt), "] ").concat((_b = e.subject) !== null && _b !== void 0 ? _b : '', "\n").concat(body.slice(0, 2000));
        },
    },
    enduser_orders: {
        collection: 'enduser_orders',
        sortField: 'createdAt',
        format: function (o) { var _a, _b; return "[Order ".concat((0, exports.fmt)(o.createdAt), "] ").concat((_a = o.status) !== null && _a !== void 0 ? _a : '', " \u2014 ").concat(((_b = o.items) !== null && _b !== void 0 ? _b : []).map(function (i) { var _a, _b; return (_b = (_a = i.title) !== null && _a !== void 0 ? _a : i.sku) !== null && _b !== void 0 ? _b : ''; }).filter(Boolean).join(', ')); },
    },
    enduser_medications: {
        collection: 'enduser_medications',
        sortField: 'createdAt',
        format: function (m) { var _a, _b, _c; return "[Medication ".concat((0, exports.fmt)(m.createdAt), "] ").concat((_a = m.title) !== null && _a !== void 0 ? _a : '', " ").concat((_b = m.dosage) !== null && _b !== void 0 ? _b : '', " ").concat((_c = m.status) !== null && _c !== void 0 ? _c : '').trim(); },
    },
    purchases: {
        collection: 'purchases',
        sortField: 'createdAt',
        format: function (p) { var _a; return "[Purchase ".concat((0, exports.fmt)(p.createdAt), "] ").concat((_a = p.title) !== null && _a !== void 0 ? _a : '', " ").concat(typeof p.amount === 'number' ? "$".concat(p.amount) : '').trim(); },
    },
};
var enduserProfileToText = function (e) {
    var _a, _b, _c;
    var lines = [];
    lines.push('## enduser');
    if (e.fname || e.lname)
        lines.push("Name: ".concat((_a = e.fname) !== null && _a !== void 0 ? _a : '', " ").concat((_b = e.lname) !== null && _b !== void 0 ? _b : '').trim());
    if (e.dateOfBirth)
        lines.push("DOB: ".concat(e.dateOfBirth));
    if (e.gender)
        lines.push("Gender: ".concat(e.gender));
    if (e.state)
        lines.push("State: ".concat(e.state));
    if (e.email)
        lines.push("Email: ".concat(e.email));
    if (e.phone)
        lines.push("Phone: ".concat(e.phone));
    if ((_c = e.tags) === null || _c === void 0 ? void 0 : _c.length)
        lines.push("Tags: ".concat(e.tags.join(', ')));
    if (e.fields && typeof e.fields === 'object') {
        var entries = Object.entries(e.fields).filter(function (_a) {
            var _ = _a[0], v = _a[1];
            return v !== '' && v !== null && v !== undefined;
        });
        if (entries.length) {
            lines.push('Custom fields:');
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var _d = entries_1[_i], k = _d[0], v = _d[1];
                lines.push("  - ".concat(k, ": ").concat(typeof v === 'object' ? JSON.stringify(v) : String(v)));
            }
        }
    }
    return lines.join('\n');
};
exports.enduserProfileToText = enduserProfileToText;
/* ---------------------------------- filter sanitization ---------------------------------- */
exports.FORBIDDEN_FILTER_OPERATORS = ['$where', '$function'];
var aiSummaryError = function (code, message) { return Object.assign(new Error(message), { code: code }); };
exports.aiSummaryError = aiSummaryError;
var sanitizeFilter = function (filter) {
    if (!filter || typeof filter !== 'object')
        return {};
    var json = JSON.stringify(filter);
    for (var _i = 0, FORBIDDEN_FILTER_OPERATORS_1 = exports.FORBIDDEN_FILTER_OPERATORS; _i < FORBIDDEN_FILTER_OPERATORS_1.length; _i++) {
        var op = FORBIDDEN_FILTER_OPERATORS_1[_i];
        if (json.includes(op)) {
            throw (0, exports.aiSummaryError)(400, "AI summary filter cannot contain ".concat(op));
        }
    }
    return filter;
};
exports.sanitizeFilter = sanitizeFilter;
// Build the mongo filter + effective limit for a single data source. Shared by both loaders so
// the lookback / enduserMatch / sanitized-filter / default-limit logic stays identical.
var buildAISummarySourceFilter = function (_a) {
    var _b;
    var _c;
    var ds = _a.ds, enduserId = _a.enduserId, mapEntry = _a.mapEntry;
    var userFilter = (0, exports.sanitizeFilter)(ds.filter);
    var lookbackClause = ds.lookbackMS
        ? (_b = {}, _b[mapEntry.sortField] = { $gte: new Date(Date.now() - ds.lookbackMS) }, _b) : {};
    var enduserMatch = mapEntry.enduserMatchClause ? mapEntry.enduserMatchClause(enduserId) : { enduserId: enduserId };
    var mdbFilter = { $and: [userFilter, lookbackClause, enduserMatch] };
    var effectiveLimit = (_c = ds.limit) !== null && _c !== void 0 ? _c : constants_1.DEFAULT_AI_SUMMARY_DATA_SOURCE_LIMIT;
    return { mdbFilter: mdbFilter, effectiveLimit: effectiveLimit };
};
exports.buildAISummarySourceFilter = buildAISummarySourceFilter;
// Join the profile block + per-source blocks, estimate tokens, and enforce the input budget.
var assembleAISummaryContext = function (_a) {
    var profileBlock = _a.profileBlock, sources = _a.sources;
    var blocks = sources
        .filter(function (s) { return s.formattedLines.length > 0; })
        .map(function (s) { return "## ".concat(s.type, "\n").concat(s.formattedLines.join('\n')); });
    var contextText = __spreadArray([profileBlock], blocks, true).filter(Boolean).join('\n\n');
    var estimatedTokens = Math.ceil(contextText.length / 4);
    if (estimatedTokens > constants_1.MAX_AI_SUMMARY_INPUT_TOKENS) {
        throw (0, exports.aiSummaryError)(413, 'AI summary input exceeds token budget — reduce limits, shorten lookback, or remove data sources.');
    }
    return { contextText: contextText, estimatedTokens: estimatedTokens, profileBlock: profileBlock, sources: sources };
};
exports.assembleAISummaryContext = assembleAISummaryContext;
// Transport-agnostic loader. Callers inject loadProfile/loadRecords backed by the SDK (webapp) or
// the DB (api). Per-source failures degrade to an empty section so one broken collection doesn't
// sink the whole summary; filter-sanitization (400) and the token-budget (413) errors still throw.
var loadAISummaryContext = function (_a) {
    var enduserId = _a.enduserId, configuration = _a.configuration, loadProfile = _a.loadProfile, loadRecords = _a.loadRecords, _b = _a.includeProfile, includeProfile = _b === void 0 ? true : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var enduser, _c, profileBlock, sections, sources;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!includeProfile) return [3 /*break*/, 2];
                    return [4 /*yield*/, loadProfile(enduserId)];
                case 1:
                    _c = _e.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _c = null;
                    _e.label = 3;
                case 3:
                    enduser = _c;
                    profileBlock = enduser ? (0, exports.enduserProfileToText)(enduser) : '';
                    return [4 /*yield*/, Promise.all(((_d = configuration.dataSources) !== null && _d !== void 0 ? _d : []).map(function (ds) { return __awaiter(void 0, void 0, void 0, function () {
                            var m, _a, mdbFilter, effectiveLimit, records, list, formattedLines, err_1;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        m = exports.DATA_SOURCE_MAP[ds.type];
                                        if (!m)
                                            return [2 /*return*/, null];
                                        _a = (0, exports.buildAISummarySourceFilter)({ ds: ds, enduserId: enduserId, mapEntry: m }), mdbFilter = _a.mdbFilter, effectiveLimit = _a.effectiveLimit;
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, loadRecords({ type: ds.type, collection: m.collection, mdbFilter: mdbFilter, limit: effectiveLimit, sortField: m.sortField })];
                                    case 2:
                                        records = _d.sent();
                                        list = Array.isArray(records) ? records : [];
                                        formattedLines = list.map(m.format).filter(Boolean);
                                        return [2 /*return*/, {
                                                type: ds.type,
                                                label: (_b = exports.DATA_SOURCE_LABELS[ds.type]) !== null && _b !== void 0 ? _b : ds.type,
                                                lookbackMS: ds.lookbackMS,
                                                limit: effectiveLimit,
                                                records: list,
                                                formattedLines: formattedLines,
                                            }];
                                    case 3:
                                        err_1 = _d.sent();
                                        console.error("Failed to load ".concat(ds.type, " for AI summary"), err_1);
                                        return [2 /*return*/, {
                                                type: ds.type,
                                                label: (_c = exports.DATA_SOURCE_LABELS[ds.type]) !== null && _c !== void 0 ? _c : ds.type,
                                                lookbackMS: ds.lookbackMS,
                                                limit: effectiveLimit,
                                                records: [],
                                                formattedLines: [],
                                            }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    sections = _e.sent();
                    sources = sections.filter(function (s) { return s !== null; });
                    return [2 /*return*/, (0, exports.assembleAISummaryContext)({ profileBlock: profileBlock, sources: sources })];
            }
        });
    });
};
exports.loadAISummaryContext = loadAISummaryContext;
//# sourceMappingURL=ai_summary.js.map