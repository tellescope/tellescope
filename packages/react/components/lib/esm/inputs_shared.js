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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { objects_equivalent, read_local_storage, safeJSONParse, update_local_storage, user_display_name } from "@tellescope/utilities";
import { ALL_ACCESS, UNSEARCHABLE_FIELDS } from "@tellescope/constants";
import { useSearchAPI } from "./hooks";
import { Button, Checkbox, Flex, HoverPaper, LoadingButton, LoadingData, ScrollingList, SearchTextInput, Typography, useAgentRecords, useAllergyCodes, useAppointmentBookingPages, useAppointmentLocations, useAutomationTriggers, useCalendarEventTemplates, useCallHoldQueues, useChatRooms, useDatabaseRecords, useDatabases, useDiagnosisCodes, useEnduserOrders, useEndusers, useFaxLogs, useFiles, useFormGroups, useForms, useForums, useJourneys, useManagedContentRecords, useMessageTemplateSnippets, useNotifications, useOrganizations, usePrescriptionRoutes, useResolvedSession, useSession, useSuggestedContacts, useTemplates, useTicketQueues, useTickets, useUsers, useWaitlists, value_is_loaded } from ".";
/* FILTER / SEARCH */
export var filter_setter_for_key = function (key, setFilters) { return function (f) { return setFilters(function (fs) {
    var _a;
    return (__assign(__assign({}, fs), (_a = {}, _a[key] = __assign(__assign({}, fs === null || fs === void 0 ? void 0 : fs[key]), { filter: f }), _a)));
}); }; };
export var apply_filters = function (fs, data) {
    var shouldSort = false;
    var scored = [];
    var filtered = data.filter(function (d) {
        var totalScore = 0;
        for (var _i = 0, _a = Object.values(fs); _i < _a.length; _i++) {
            var f = _a[_i];
            if (!(f === null || f === void 0 ? void 0 : f.filter))
                continue;
            var score = f.filter(d);
            if (score === 0)
                return false;
            totalScore += score;
        }
        if (totalScore > 1) {
            shouldSort = true;
            scored.push({
                score: totalScore,
                value: d,
            });
        }
        return true;
    });
    return (shouldSort
        ? scored.sort(function (v1, v2) { return v2.score - v1.score; }).map(function (v) { return v.value; })
        : filtered);
};
export var useFilters = function (args) {
    var _a = args !== null && args !== void 0 ? args : {}, onFilterChange = _a.onFilterChange, reload = _a.reload, memoryId = _a.memoryId, initialFilters = _a.initialFilters, deserialize = _a.deserialize;
    if (memoryId && !deserialize)
        console.warn("memoryId provided without deserialize");
    var _b = React.useState(initialFilters || ((memoryId && deserialize)
        ? deserialize((safeJSONParse(read_local_storage(memoryId)) || {}))
        : {})), filters = _b[0], setFilters = _b[1];
    var didReloadRef = useRef(false);
    useEffect(function () {
        if (!reload)
            return;
        if (didReloadRef.current)
            return;
        didReloadRef.current = true;
        setFilters(initialFilters || ((memoryId && deserialize)
            ? deserialize((safeJSONParse(read_local_storage(memoryId)) || {}))
            : {}));
    }, [reload, initialFilters, memoryId, deserialize]);
    useEffect(function () {
        if (!memoryId)
            return;
        update_local_storage(memoryId, JSON.stringify(filters));
    }, [filters, memoryId]);
    var prevFilterRef = React.useRef(filters);
    useEffect(function () {
        if (!onFilterChange)
            return;
        if (objects_equivalent(prevFilterRef.current, filters))
            return;
        prevFilterRef.current = filters;
        onFilterChange(filters);
    }, [filters, onFilterChange]);
    var applyFilters = useCallback(function (data) { return apply_filters(filters, data); }, [filters]);
    var compoundApiFilter = useMemo(function () {
        var _a, _b;
        var toReturn = (Object.values(filters).map(function (f) { return f.apiFilter; }).filter(function (a) { return !!a; }).length === 0
            ? null
            : {});
        if (toReturn) {
            for (var _i = 0, _c = Object.values(filters); _i < _c.length; _i++) {
                var f = _c[_i];
                if (!f.apiFilter)
                    continue;
                toReturn = __assign(__assign({}, toReturn), { filter: __assign(__assign({}, toReturn === null || toReturn === void 0 ? void 0 : toReturn.filter), f.apiFilter.filter) });
                // add search when included, defaulting to most recent (tho, there should only be one)
                if ((_b = (_a = f.apiFilter) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.query) {
                    toReturn.search = f.apiFilter.search;
                }
            }
        }
        return toReturn;
    }, [filters]);
    return {
        filters: filters,
        compoundApiFilter: compoundApiFilter,
        setFilters: setFilters,
        applyFilters: applyFilters,
        activeFilterCount: Object.values(filters).filter(function (f) { return !!f.filter; }).length
    };
};
export var record_field_matches_query = function (value, query) {
    if (typeof value === 'string' && value.toUpperCase().includes(query.toUpperCase())) {
        return true;
    }
    if (typeof value === 'number' && value.toString() === query) {
        return true;
    }
    if (typeof value === 'object') {
        for (var k in value) {
            if (record_field_matches_query(value[k], query)) {
                return true;
            }
        }
    }
    return false;
};
export var record_matches_for_query = function (records, query) {
    var matches = [];
    for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
        var record = records_1[_i];
        for (var field in record) {
            var value = record[field];
            if (UNSEARCHABLE_FIELDS.includes(field))
                continue;
            if (record_field_matches_query(value, query)) {
                matches.push(record);
                break;
            }
        }
    }
    return matches;
};
export var filter_for_query = function (query, getAdditionalFields) {
    var baseFilter = function (record) {
        if (!record)
            return 0;
        if (query === '')
            return 1;
        var queryLC = query.toLowerCase();
        var score = 0;
        // heuristic for high priority matching against full name
        if ((record === null || record === void 0 ? void 0 : record.fname) && (record === null || record === void 0 ? void 0 : record.lname)) {
            var fullName = "".concat(record.fname, " ").concat(record.lname).toLowerCase();
            if (fullName === queryLC) {
                score += 50;
            }
            else if (fullName.startsWith(queryLC)) {
                score += 25;
            }
            else if (fullName.includes(queryLC) && queryLC.length > 3) {
                score += 10;
            }
        }
        var toAdd = getAdditionalFields === null || getAdditionalFields === void 0 ? void 0 : getAdditionalFields(record);
        var joined = __assign(__assign({}, toAdd), record);
        // console.log(JSON.stringify(joined, null, 2))
        for (var field in joined) {
            var value = joined[field];
            // exact match is useful for things like id match and easy heuristic check for others
            if (value === query) {
                score += 10;
                continue;
            }
            if (UNSEARCHABLE_FIELDS.includes(field))
                continue;
            // ensure not-null
            if (value && typeof value === 'object') {
                // recursve on nested object values
                if (Object.values(value).find(function (a) {
                    if (typeof a === 'string')
                        return a.toUpperCase().includes(query.toUpperCase());
                    if (typeof a === 'object')
                        return baseFilter(a);
                    return false;
                })) {
                    score += 1;
                    continue;
                }
            }
            if (typeof value !== 'string')
                continue;
            if (value.toUpperCase().includes(query.toUpperCase())) {
                score += 1;
                continue;
            }
            // for phone number search, replace human-readable entries which are not stored
            var onlyNumbers = query.replaceAll(/[^0-9]/g, '');
            if (onlyNumbers.length >= 3 &&
                value.toUpperCase().includes(onlyNumbers)) {
                score += 1;
                continue;
            }
        }
        return score;
    };
    return ({
        filter: function (record) { return baseFilter(record); },
        apiFilter: { search: { query: query } },
    });
};
export var performBulkAction = function (_a) {
    var allSelected = _a.allSelected, 
    // apiFilter, 
    applyFilters = _a.applyFilters, selected = _a.selected, processBatch = _a.processBatch, onSuccess = _a.onSuccess, fetchBatch = _a.fetchBatch, _b = _a.batchSize, batchSize = _b === void 0 ? 100 : _b, dontAlert = _a.dontAlert;
    return __awaiter(void 0, void 0, void 0, function () {
        var args, successCount, errors, results, loaded, matches, toProcess, _c, _successCount, error, result;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(selected || allSelected))
                        throw new Error("One of allSelected or selected is required");
                    if (batchSize <= 0)
                        throw new Error("batchSize must be at least 1");
                    args = (allSelected
                        ? {}
                        : { ids: selected });
                    successCount = 0;
                    errors = [];
                    args.limit = batchSize;
                    results = [];
                    loaded = [];
                    _d.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchBatch(args)];
                case 2:
                    matches = _d.sent();
                    if (matches.length === 0)
                        return [3 /*break*/, 5];
                    loaded.push.apply(loaded, matches);
                    toProcess = applyFilters(matches);
                    if (!toProcess.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, processBatch(toProcess)];
                case 3:
                    _c = _d.sent(), _successCount = _c.successCount, error = _c.error, result = __rest(_c, ["successCount", "error"]);
                    results.push(result);
                    if (_successCount) {
                        successCount += _successCount;
                    }
                    if (error) {
                        errors.push(error);
                    }
                    _d.label = 4;
                case 4:
                    if (matches.length < batchSize) {
                        return [3 /*break*/, 5];
                    }
                    args.lastId = matches[matches.length - 1].id;
                    return [3 /*break*/, 1];
                case 5:
                    if (!dontAlert && (successCount || errors.length)) {
                        alert("Success Count: ".concat(successCount).concat(errors.length ? "\nErrors: ".concat(errors.join('\n')) : ''));
                    }
                    // clean up in case same object is reused for future queries
                    delete args.lastId;
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(loaded);
                    return [2 /*return*/, results];
            }
        });
    });
};
export var ModelSearchInput = function (_a) {
    var filterKey = _a.filterKey, setFilters = _a.setFilters, searchAPI = _a.searchAPI, onLoad = _a.onLoad, attachSearchableFields = _a.attachSearchableFields, 
    // @ts-ignore remove from props if provided by mistake
    activeFilterCount = _a.activeFilterCount, 
    // @ts-ignore remove from props if provided by mistake
    compoundApiFilter = _a.compoundApiFilter, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["filterKey", "setFilters", "searchAPI", "onLoad", "attachSearchableFields", "activeFilterCount", "compoundApiFilter", "value", "onChange"]);
    var cacheKey = "search-cache-".concat(filterKey);
    var _b = useState(read_local_storage(cacheKey) || ''), _query = _b[0], _setQuery = _b[1];
    var query = value !== null && value !== void 0 ? value : _query;
    var setQuery = onChange !== null && onChange !== void 0 ? onChange : _setQuery;
    var filterOnLoadRef = useRef(!!query);
    useEffect(function () {
        update_local_storage(cacheKey, query);
    }, [query]);
    useEffect(function () { return onChange === null || onChange === void 0 ? void 0 : onChange(query); }, [onChange, query]);
    useSearchAPI({ query: query, searchAPI: searchAPI, onLoad: onLoad });
    useEffect(function () {
        var t = setTimeout(function () {
            setFilters(function (fs) {
                var _a;
                var _b, _c, _d;
                return ((((_d = (_c = (_b = fs[filterKey]) === null || _b === void 0 ? void 0 : _b.apiFilter) === null || _c === void 0 ? void 0 : _c.search) === null || _d === void 0 ? void 0 : _d.query) === query && !filterOnLoadRef.current)
                    ? fs
                    : __assign(__assign({}, fs), (_a = {}, _a[filterKey] = filter_for_query(query, attachSearchableFields), _a)));
            });
            filterOnLoadRef.current = false;
        }, 50);
        return function () { clearTimeout(t); };
    }, [query, filterKey, setFilters, attachSearchableFields]);
    return (_jsx(SearchTextInput, __assign({}, props, { value: query, onChange: function (s) { return setQuery(s); } })));
};
export var EnduserSearch = function (props) {
    var _a, _b, _c;
    var session = useResolvedSession();
    var _d = useEndusers(), addLocalElements = _d[1].addLocalElements;
    var _e = useUsers(), usersLoading = _e[0], findUser = _e[1].findById;
    // wait for users to load, so that a saved query is able to match attachSearchableFields
    // only wait when users have ALL_ACCESS to ensures users can actually load
    if (((_c = (_b = (_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.access) === null || _b === void 0 ? void 0 : _b.users) === null || _c === void 0 ? void 0 : _c.read) === ALL_ACCESS && !value_is_loaded(usersLoading))
        return null;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "endusers" }, props, { searchAPI: session.api.endusers.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
            var _a;
            var users = (_a = t.assignedTo) === null || _a === void 0 ? void 0 : _a.map(function (userId) { return findUser(userId, { batch: true }); }).filter(function (u) { return u; });
            if (!(users === null || users === void 0 ? void 0 : users.length))
                return undefined;
            var toJoin = {};
            users.forEach(function (user, i) {
                toJoin["".concat(i, "fname")] = user.fname || '';
                toJoin["".concat(i, "lname")] = user.lname || '';
                toJoin["".concat(i, "fullname")] = "".concat(user.fname, " ").concat(user.lname);
            });
            return toJoin;
        } })));
};
export var CHAT_ROOM_SEARCH = 'chat-room-search';
export var ChatRoomSearch = function (props) {
    var session = useResolvedSession();
    var _a = useChatRooms(), addLocalElements = _a[1].addLocalElements;
    var _b = useUsers(), usersLoading = _b[0], findUser = _b[1].findById;
    var _c = useEndusers(), endusersLoading = _c[0], findEnduser = _c[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!value_is_loaded(usersLoading))
        return null;
    if (!value_is_loaded(endusersLoading))
        return null;
    return (_jsx(ModelSearchInput, __assign({ filterKey: TICKET_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.chat_rooms.getSome, onLoad: addLocalElements, attachSearchableFields: function (r) {
            var _a;
            var users = (r.userIds || []).map(function (r) { return findUser(r, { batch: true }); }).filter(function (u) { return u; });
            var endusers = (r.enduserIds || []).map(function (r) { return findEnduser(r, { batch: true }); }).filter(function (e) { return e; });
            var fields = {};
            var i = 0;
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                i++;
                fields["user_fname".concat(i)] = user.fname || '';
                fields["user_lname".concat(i)] = user.lname || '';
                fields["user_fullname".concat(i)] = "".concat(user.fname, " ").concat(user.lname);
                fields["user_email".concat(i)] = user.email || '';
            }
            i = 0;
            for (var _b = 0, endusers_1 = endusers; _b < endusers_1.length; _b++) {
                var enduser = endusers_1[_b];
                i++;
                fields["enduser_fname".concat(i)] = enduser.fname || '';
                fields["enduser_lname".concat(i)] = enduser.lname || '';
                fields["enduser_fullname".concat(i)] = "".concat(enduser.fname, " ").concat(enduser.lname);
                fields["enduser_email".concat(i)] = enduser.email || '';
                if ((_a = enduser.tags) === null || _a === void 0 ? void 0 : _a.length) {
                    fields["tags".concat(i)] = enduser.tags.join(',');
                }
            }
            return fields;
        } })));
};
export var TICKET_SEARCH_FILTER_KEY = 'ticket-search';
export var TicketSearch = function (props) {
    var session = useResolvedSession();
    var _a = useTickets(), addLocalElements = _a[1].addLocalElements;
    var _b = useUsers(), usersLoading = _b[0], findUser = _b[1].findById;
    var _c = useEndusers(), endusersLoading = _c[0], findEnduser = _c[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!value_is_loaded(usersLoading))
        return null;
    if (!value_is_loaded(endusersLoading))
        return null;
    return (_jsx(ModelSearchInput, __assign({ filterKey: TICKET_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.tickets.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
            var _a, _b, _c;
            var user = findUser((_a = t.owner) !== null && _a !== void 0 ? _a : '', { batch: true });
            var enduser = findEnduser((_b = t.enduserId) !== null && _b !== void 0 ? _b : '', { batch: true });
            if (!(user || enduser))
                return undefined;
            var fields = {};
            if (user) {
                fields.user_fname = user.fname || '';
                fields.user_lname = user.lname || '';
                fields.user_fullname = "".concat(user.fname, " ").concat(user.lname);
                fields.user_email = user.email || '';
            }
            if (enduser) {
                fields.enduser_fname = enduser.fname || '';
                fields.enduser_lname = enduser.lname || '';
                fields.enduser_fullname = "".concat(enduser.fname, " ").concat(enduser.lname);
                fields.enduser_email = enduser.email || '';
                if ((_c = enduser.tags) === null || _c === void 0 ? void 0 : _c.length) {
                    fields.tags = enduser.tags.join(',');
                }
            }
            return fields;
        } })));
};
export var ENDUSER_ORDERS_SEARCH_FILTER_KEY = 'ticket-search';
export var EnduserOrdersSearch = function (props) {
    var session = useResolvedSession();
    var _a = useEnduserOrders(), addLocalElements = _a[1].addLocalElements;
    var _b = useEndusers(), endusersLoading = _b[0], findEnduser = _b[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!value_is_loaded(endusersLoading))
        return null;
    return (_jsx(ModelSearchInput, __assign({ filterKey: ENDUSER_ORDERS_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.enduser_orders.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
            var _a, _b;
            var enduser = findEnduser((_a = t.enduserId) !== null && _a !== void 0 ? _a : '', { batch: true });
            if (!enduser)
                return undefined;
            var fields = {};
            if (enduser) {
                fields.enduser_fname = enduser.fname || '';
                fields.enduser_lname = enduser.lname || '';
                fields.enduser_fullname = "".concat(enduser.fname, " ").concat(enduser.lname);
                fields.enduser_email = enduser.email || '';
                if ((_b = enduser.tags) === null || _b === void 0 ? void 0 : _b.length) {
                    fields.tags = enduser.tags.join(',');
                }
            }
            return fields;
        } })));
};
export var PrescriptionRoutesSearch = function (props) {
    var session = useSession();
    var _a = usePrescriptionRoutes(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "prescription_routes" }, props, { searchAPI: session.api.prescription_routes.getSome, onLoad: addLocalElements })));
};
export var FaxSearch = function (props) {
    var session = useSession();
    var _a = useFaxLogs(), addLocalElements = _a[1].addLocalElements;
    // const [, { findById: findEnduser }] = useEndusers() 
    return (_jsx(ModelSearchInput, __assign({ filterKey: "fax_logs" }, props, { searchAPI: session.api.fax_logs.getSome, onLoad: addLocalElements })));
};
export var FileSearch = function (props) {
    var session = useSession();
    var _a = useFiles(), addLocalElements = _a[1].addLocalElements;
    var _b = useEndusers(), findEnduser = _b[1].findById;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "files" }, props, { searchAPI: session.api.files.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
            var enduser = t.enduserId ? findEnduser(t.enduserId, { batch: true }) : undefined;
            if (!enduser)
                return undefined;
            var toJoin = {
                fname: enduser.fname,
                lname: enduser.lname,
                fullname: "".concat(enduser.fname, " ").concat(enduser.lname),
            };
            return toJoin;
        } })));
};
export var SuggestedContactSearch = function (props) {
    var session = useSession();
    var _a = useSuggestedContacts({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "suggested-contact" }, props, { searchAPI: session.api.suggested_contacts.getSome, onLoad: addLocalElements })));
};
export var WaitlistSearch = function (props) {
    var session = useSession();
    var _a = useWaitlists({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "waitlist" }, props, { searchAPI: session.api.waitlists.getSome, onLoad: addLocalElements })));
};
export var AgentRecordSearch = function (props) {
    var session = useSession();
    var _a = useAgentRecords({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "agent-record" }, props, { searchAPI: session.api.agent_records.getSome, onLoad: addLocalElements })));
};
export var AllergyCodeSearch = function (props) {
    var session = useSession();
    var _a = useAllergyCodes({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "allergy-code" }, props, { searchAPI: session.api.allergy_codes.getSome, onLoad: addLocalElements })));
};
export var DiagnosisCodeSearch = function (props) {
    var session = useSession();
    var _a = useDiagnosisCodes({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "diagnoses-code" }, props, { searchAPI: session.api.diagnosis_codes.getSome, onLoad: addLocalElements })));
};
export var CallHoldQueueSearch = function (props) {
    var session = useSession();
    var _a = useCallHoldQueues({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "call-hold-queue" }, props, { searchAPI: session.api.call_hold_queues.getSome, onLoad: addLocalElements })));
};
export var TicketQueueSearch = function (props) {
    var session = useSession();
    var _a = useTicketQueues({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "ticket-queue" }, props, { searchAPI: session.api.ticket_queues.getSome, onLoad: addLocalElements })));
};
export var NotificationSearch = function (props) {
    var session = useSession();
    var _a = useNotifications(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "notifications-search" }, props, { searchAPI: session.api.user_notifications.getSome, onLoad: addLocalElements })));
};
export var FormSearch = function (props) {
    var session = useSession();
    var _a = useForms(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "form-search" }, props, { searchAPI: session.api.forms.getSome, onLoad: addLocalElements })));
};
export var FormGroupSearch = function (props) {
    var session = useSession();
    var _a = useFormGroups(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "form-group-search" }, props, { searchAPI: session.api.form_groups.getSome, onLoad: addLocalElements })));
};
export var AutomationTriggerSearch = function (props) {
    var session = useSession();
    var _a = useAutomationTriggers(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "trigger-search" }, props, { searchAPI: session.api.automation_triggers.getSome, onLoad: addLocalElements })));
};
export var JourneySearch = function (props) {
    var session = useSession();
    var _a = useJourneys(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "journeys" }, props, { searchAPI: session.api.journeys.getSome, onLoad: addLocalElements })));
};
export var TemplateSearch = function (props) {
    var session = useSession();
    var _a = useTemplates(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "templates" }, props, { searchAPI: session.api.templates.getSome, onLoad: addLocalElements })));
};
export var ForumSearch = function (props) {
    var session = useResolvedSession();
    var _a = useForums(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "forums" }, props, { searchAPI: session.api.forums.getSome, onLoad: addLocalElements })));
};
export var UserSearch = function (props) {
    var session = useResolvedSession();
    var _a = useUsers(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "users" }, props, { searchAPI: session.api.users.getSome, onLoad: addLocalElements })));
};
export var OrganizationSearch = function (props) {
    var session = useSession();
    var _a = useOrganizations(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "organizations" }, props, { searchAPI: session.api.organizations.getSome, onLoad: addLocalElements })));
};
export var EnduserOrUserSearch = function (props) {
    var session = useResolvedSession();
    var _a = useEndusers(), addLocalEndusers = _a[1].addLocalElements;
    var _b = useUsers(), addLocalUsers = _b[1].addLocalElements;
    var searchAPI = function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, endusers, users;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        session.api.endusers.getSome(args),
                        session.api.users.getSome(args),
                    ])];
                case 1:
                    _a = _b.sent(), endusers = _a[0], users = _a[1];
                    if (endusers.length > 0)
                        addLocalEndusers(endusers);
                    if (users.length > 0)
                        addLocalUsers(users);
                    return [2 /*return*/, __spreadArray(__spreadArray([], endusers, true), users, true)];
            }
        });
    }); };
    return (_jsx(ModelSearchInput, __assign({ filterKey: "endusers-or-users" }, props, { searchAPI: searchAPI })));
};
export var MessageTemplateSnippetSearch = function (_a) {
    var dontFetch = _a.dontFetch, props = __rest(_a, ["dontFetch"]);
    var session = useSession();
    var _b = useMessageTemplateSnippets({ dontFetch: dontFetch }), addLocalElements = _b[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "message_template_snippets" }, props, { searchAPI: session.api.message_template_snippets.getSome, onLoad: addLocalElements })));
};
export var ContentSearch = function (_a) {
    var dontFetch = _a.dontFetch, props = __rest(_a, ["dontFetch"]);
    var session = useResolvedSession();
    var _b = useManagedContentRecords({ dontFetch: dontFetch }), addLocalElements = _b[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "managed_content_records" }, props, { searchAPI: session.api.managed_content_records.getSome, onLoad: addLocalElements })));
};
export var CalendarEventTemplatesSearch = function (props) {
    var session = useSession();
    var _a = useCalendarEventTemplates(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "calendar_event_templates" }, props, { searchAPI: session.api.calendar_event_templates.getSome, onLoad: addLocalElements })));
};
export var AppointmentLocationSearch = function (props) {
    var session = useSession();
    var _a = useAppointmentLocations(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "appointment_locations" }, props, { searchAPI: session.api.appointment_locations.getSome, onLoad: addLocalElements })));
};
export var AppointmentBookingPagesSearch = function (props) {
    var session = useSession();
    var _a = useAppointmentBookingPages(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "appointment_booking_pages" }, props, { searchAPI: session.api.appointment_booking_pages.getSome, onLoad: addLocalElements })));
};
export var DatabaseSearch = function (props) {
    var session = useSession();
    var _a = useDatabases(), addLocalElements = _a[1].addLocalElements;
    return (_jsx(ModelSearchInput, __assign({ filterKey: "databases" }, props, { searchAPI: session.api.databases.getSome, onLoad: addLocalElements })));
};
export var DatabaseRecordSearch = function (_a) {
    var databaseId = _a.databaseId, props = __rest(_a, ["databaseId"]);
    var session = useSession();
    var _b = useDatabaseRecords(), addLocalElements = _b[1].addLocalElements;
    var searchAPI = useCallback(function (query) { return (session.api.database_records.getSome(__assign({ filter: { databaseId: databaseId } }, query))); }, [session, databaseId]);
    return (_jsx(ModelSearchInput, __assign({ filterKey: "database_records" }, props, { searchAPI: searchAPI, onLoad: addLocalElements })));
};
var SEARCHBAR_MIN_WIDTH = '125px';
export var UserAndEnduserSelector = function (_a) {
    var titleInput = _a.titleInput, excludeEndusers = _a.excludeEndusers, excludeUsers = _a.excludeUsers, onGoBack = _a.onGoBack, onSelect = _a.onSelect, showTitleInput = _a.showTitleInput, hiddenIds = _a.hiddenIds, _b = _a.title, title = _b === void 0 ? "Select Members" : _b, minHeight = _a.minHeight, _c = _a.maxHeight, maxHeight = _c === void 0 ? '50vh' : _c, _d = _a.searchBarPlacement, searchBarPlacement = _d === void 0 ? "top" : _d, _e = _a.initialSelected, initialSelected = _e === void 0 ? [] : _e, _f = _a.buttonText, buttonText = _f === void 0 ? "Create" : _f, filter = _a.filter, radio = _a.radio, limitToUsers = _a.limitToUsers, dontIncludeSelf = _a.dontIncludeSelf, virtualizationHeight = _a.virtualizationHeight;
    var session = useResolvedSession();
    var _g = useEndusers(), endusersLoading = _g[0], _h = _g[1], loadMoreEndusers = _h.loadMore, doneLoadingEndusers = _h.doneLoading;
    var _j = useUsers({
        dontFetch: !!limitToUsers
    }), usersLoading = _j[0], _k = _j[1], loadMoreUsers = _k.loadMore, doneLoadingUsers = _k.doneLoading;
    var doneLoading = useCallback(function () {
        return (excludeUsers || doneLoadingUsers()) && (excludeEndusers || doneLoadingEndusers());
    }, [doneLoadingEndusers, excludeUsers, excludeEndusers, doneLoadingUsers]);
    var loadMore = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!excludeEndusers && !doneLoadingEndusers()) {
                loadMoreEndusers().catch(console.error);
            }
            ;
            if (!excludeUsers && !doneLoadingUsers()) {
                loadMoreUsers().catch(console.error);
            }
            ;
            return [2 /*return*/];
        });
    }); }, [doneLoadingEndusers, doneLoadingUsers, loadMoreEndusers, loadMoreUsers]);
    var _l = useState(initialSelected), selected = _l[0], setSelected = _l[1];
    var _m = useFilters(), applyFilters = _m.applyFilters, filterProps = __rest(_m, ["applyFilters"]);
    var searchbarFullWidth = searchBarPlacement === "bottom";
    var searchbar = useMemo(function () { return (excludeUsers
        ? _jsx(EnduserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))
        : excludeEndusers
            ? _jsx(UserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))
            : _jsx(EnduserOrUserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))); }, [excludeUsers, excludeEndusers, filterProps, searchbarFullWidth]);
    var handleSelect = useCallback(function (users, endusers) {
        var usersSelected = users.filter(function (u) { return selected.includes(u.id); });
        var endusersSelected = endusers.filter(function (e) { return selected.includes(e.id); });
        if (!dontIncludeSelf) {
            if (session.type === 'enduser' && !endusersSelected.find(function (e) { return e.id === session.userInfo.id; })) {
                endusersSelected.push(session.userInfo);
            }
            else if (session.type === 'user' && !usersSelected.find(function (e) { return e.id === session.userInfo.id; })) {
                usersSelected.push(session.userInfo);
            }
        }
        onSelect === null || onSelect === void 0 ? void 0 : onSelect({ users: usersSelected, endusers: endusersSelected });
    }, [onSelect, selected, dontIncludeSelf]);
    var users = (limitToUsers
        ? limitToUsers
        : value_is_loaded(usersLoading)
            ? usersLoading.value
            : []);
    return (_jsx(LoadingData, { data: { endusers: endusersLoading }, render: function (_a) {
            var endusers = _a.endusers;
            var itemsUnfiltered = __spreadArray(__spreadArray([], excludeUsers ? [] : users, true), excludeEndusers ? [] : endusers, true).filter(function (i) { return !(hiddenIds === null || hiddenIds === void 0 ? void 0 : hiddenIds.includes(i.id)); });
            var items = applyFilters(filter
                ? itemsUnfiltered.filter(filter)
                : itemsUnfiltered);
            return (_jsxs(Flex, __assign({ flex: 1, column: true, justifyContent: "center" }, { children: [_jsxs(Flex, __assign({ alignItems: "center", justifyContent: "space-between", wrap: "nowrap", style: {
                            marginBottom: 10,
                        } }, { children: [onGoBack &&
                                _jsx(Button, __assign({ onClick: onGoBack }, { children: "Back" })), _jsx(Typography, __assign({ style: { fontSize: 16, textAlign: 'center' } }, { children: title })), _jsx(LoadingButton, { submitText: buttonText, submittingText: buttonText, disabled: selected.length === 0 && !(initialSelected === null || initialSelected === void 0 ? void 0 : initialSelected.length), style: { display: 'flex' }, onClick: function () { return handleSelect(users, endusers); } })] })), _jsx(ScrollingList, { items: items, virtualization: virtualizationHeight ? {
                            virtualize: true,
                            height: virtualizationHeight,
                            rowHeight: 45,
                            width: '100%',
                            hideHorizontalScroll: true,
                        } : undefined, emptyText: itemsUnfiltered.length === 0
                            ? "No contacts found"
                            : "No one found for search", minHeight: minHeight, maxHeight: maxHeight, doneLoading: doneLoading, loadMore: loadMore, title: showTitleInput ? titleInput : undefined, titleStyle: searchBarPlacement !== "top" ?
                            {
                                width: '100%',
                            }
                            : {}, titleActionsComponent: searchBarPlacement === 'top'
                            ? _jsx(Flex, __assign({ flex: 1, justifyContent: "flex-end", style: { marginLeft: 'auto' } }, { children: searchbar }))
                            : undefined, itemContainerStyle: { padding: 4 }, Item: function (_a) {
                            var user = _a.item;
                            return (_jsx(HoverPaper, __assign({ style: { marginBottom: 4 } }, { children: _jsxs(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "space-between", onClick: function () {
                                        return radio
                                            ? (setSelected(function (ss) {
                                                return ss.includes(user.id)
                                                    ? []
                                                    : [user.id];
                                            }))
                                            : setSelected(function (ss) { return (ss.includes(user.id)
                                                ? ss.filter(function (s) { return s !== user.id; })
                                                : __spreadArray([user.id], ss, true)); });
                                    }, style: {
                                        paddingLeft: 5, paddingRight: 5,
                                    } }, { children: [_jsx(Checkbox, { checked: selected.includes(user.id) }), _jsx(Typography, __assign({ style: {
                                                fontWeight: selected.includes(user.id) ? 'bold' : undefined,
                                            } }, { children: user_display_name(user) }))] })) })));
                        } }), searchBarPlacement === 'bottom' &&
                        _jsx(Flex, __assign({ alignSelf: "flex-end", style: { marginTop: 4, width: '100%' } }, { children: searchbar }))] })));
        } }));
};
//# sourceMappingURL=inputs_shared.js.map