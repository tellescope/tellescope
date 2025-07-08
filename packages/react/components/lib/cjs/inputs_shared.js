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
exports.UserAndEnduserSelector = exports.DatabaseRecordSearch = exports.DatabaseSearch = exports.AppointmentBookingPagesSearch = exports.AppointmentLocationSearch = exports.CalendarEventTemplatesSearch = exports.ContentSearch = exports.MessageTemplateSnippetSearch = exports.EnduserOrUserSearch = exports.OrganizationSearch = exports.UserSearch = exports.ForumSearch = exports.TemplateSearch = exports.JourneySearch = exports.AutomationTriggerSearch = exports.FormGroupSearch = exports.FormSearch = exports.NotificationSearch = exports.TicketQueueSearch = exports.CallHoldQueueSearch = exports.DiagnosisCodeSearch = exports.AllergyCodeSearch = exports.AgentRecordSearch = exports.WaitlistSearch = exports.SuggestedContactSearch = exports.FileSearch = exports.FaxSearch = exports.PrescriptionRoutesSearch = exports.EnduserOrdersSearch = exports.ENDUSER_ORDERS_SEARCH_FILTER_KEY = exports.TicketSearch = exports.TICKET_SEARCH_FILTER_KEY = exports.ChatRoomSearch = exports.CHAT_ROOM_SEARCH = exports.EnduserSearch = exports.ModelSearchInput = exports.performBulkAction = exports.filter_for_query = exports.record_matches_for_query = exports.record_field_matches_query = exports.useFilters = exports.apply_filters = exports.filter_setter_for_key = exports.useFiltersV2 = exports.remove_inactive_filters = exports.apply_mongodb_style_filter = exports.mongo_db_filter_to_list_of_strings_with_qualifier = exports.list_of_strings_with_qualifier_to_mongodb_filter = exports.mongo_db_filter_to_enduser_condition = exports.enduser_condition_to_mongodb_filter = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var utilities_1 = require("@tellescope/utilities");
var constants_1 = require("@tellescope/constants");
var hooks_1 = require("./hooks");
var _1 = require(".");
var validation_1 = require("@tellescope/validation");
var enduser_condition_to_mongodb_filter = function (condition, customFields) {
    var _a, _b;
    if (!condition) {
        return condition;
    }
    if (condition.$and) {
        return { $and: condition.$and.map(function (v) { return (0, exports.enduser_condition_to_mongodb_filter)(v, customFields); }) };
    }
    if (condition.$or) {
        return { $or: condition.$or.map(function (v) { return (0, exports.enduser_condition_to_mongodb_filter)(v, customFields); }) };
    }
    if (condition.$nor) {
        return { $nor: condition.$nor.map(function (v) { return (0, exports.enduser_condition_to_mongodb_filter)(v, customFields); }) };
    }
    if (condition.$not) {
        return { $not: (0, exports.enduser_condition_to_mongodb_filter)(condition.$not, customFields) };
    }
    if (condition && typeof condition === 'object' && condition.constructor === Object) {
        var updated = {};
        for (var _i = 0, _c = Object.entries(condition); _i < _c.length; _i++) {
            var _d = _c[_i], _key = _d[0], _value = _d[1];
            var key = customFields.includes(_key) ? "fields.".concat(_key) : _key;
            var value = (0, exports.enduser_condition_to_mongodb_filter)(_value, customFields);
            // console.log(key, _value, value)
            if (key === 'condition') {
                var toReturn = (0, exports.enduser_condition_to_mongodb_filter)(value, customFields);
                delete updated.condition;
                return toReturn;
            } // base case is comparison to value, so just return it
            // journeys currently have a special ui/syntax in filter
            if (key === 'Journeys') {
                if ((typeof (value === null || value === void 0 ? void 0 : value.$in)) === 'string') {
                    return _a = {}, _a["journeys.".concat(value.$in)] = { $exists: true }, _a;
                }
                else if ((typeof (value === null || value === void 0 ? void 0 : value.$nin)) === 'string') {
                    return _b = {}, _b["journeys.".concat(value.$nin)] = { $exists: false }, _b;
                }
            }
            if (key === 'Healthie ID') {
                // $setSet ($nin null, '')
                if (value === null || value === void 0 ? void 0 : value.$nin)
                    return { $or: [{ source: constants_1.HEALTHIE_TITLE, externalId: { $nin: [null, ''] } }, { 'references.type': constants_1.HEALTHIE_TITLE }] };
                // $isNotSet ($in null, '')
                if (value === null || value === void 0 ? void 0 : value.$in)
                    return { $and: [{ source: { $ne: constants_1.HEALTHIE_TITLE } }, { 'references.type': { $ne: constants_1.HEALTHIE_TITLE } }] };
            }
            // ensure to parse string to number values
            if (key === 'height') {
                return {
                    'height.value': (0, utilities_1.replace_keys_and_values_in_object)(value, function (v) { return typeof v === 'string' && !v.startsWith('$') ? parseFloat(v) : v; })
                };
            }
            if (key === 'weight') {
                return {
                    'weight.value': (0, utilities_1.replace_keys_and_values_in_object)(value, function (v) { return typeof v === 'string' && !v.startsWith('$') ? parseFloat(v) : v; })
                };
            }
            if (key === "relationships") {
                return {
                    'relationships.type': value
                };
            }
            // case for isSet and isNotSet includes empty string as unset value
            if (key === '$isSet') {
                updated.$nin = [null, '', []];
            }
            else if (key === '$isNotSet') {
                updated.$in = [null, '', []];
            }
            else if (key === '$contains') {
                updated.$regex = value;
            }
            else if (key === '$doesNotContain') {
                updated.$not = { $regex: value };
            }
            else if (key === '$before') {
                updated.$lt = value;
            }
            else if (key === '$after') {
                updated.$gt = value;
            }
            else {
                updated[key] = value;
            }
        }
        return updated;
    }
    return condition;
};
exports.enduser_condition_to_mongodb_filter = enduser_condition_to_mongodb_filter;
var mongo_db_filter_to_enduser_condition = function (filter) {
    var _a;
    var _b, _c;
    if (!filter) {
        return filter;
    }
    if ((0, utilities_1.objects_equivalent)(filter, {
        "$and": [
            {
                "source": {
                    "$ne": "Healthie"
                }
            },
            {
                "references.type": {
                    "$ne": "Healthie"
                }
            }
        ]
    })) {
        return { condition: { 'Healthie ID': { $isNotSet: 'Value' } } };
    }
    if ((0, utilities_1.objects_equivalent)(filter, {
        "$or": [
            {
                "source": "Healthie",
                "externalId": {
                    "$nin": [
                        null,
                        ""
                    ]
                }
            },
            {
                "references.type": "Healthie"
            }
        ]
    })) {
        return { condition: { 'Healthie ID': { $isSet: 'Value' } } };
    }
    if (filter.$and) {
        return { $and: filter.$and.map(function (v) { return (0, exports.mongo_db_filter_to_enduser_condition)(v); }) };
    }
    if (filter.$or) {
        return { $or: filter.$or.map(function (v) { return (0, exports.mongo_db_filter_to_enduser_condition)(v); }) };
    }
    if (filter.$nor) {
        return { $nor: filter.$nor.map(function (v) { return (0, exports.mongo_db_filter_to_enduser_condition)(v); }) };
    }
    if (filter.$not) {
        return { $not: (0, exports.mongo_db_filter_to_enduser_condition)(filter.$not) };
    }
    if (filter && typeof filter === 'object' && filter.constructor === Object) {
        if ((0, utilities_1.object_is_empty)(filter))
            return filter;
        var updated = { condition: {} };
        for (var _i = 0, _d = Object.entries(filter); _i < _d.length; _i++) {
            var _e = _d[_i], _key = _e[0], value = _e[1];
            var key = ((typeof _key === 'string' && _key.startsWith('fields.')) ? _key.replace('fields.', '')
                : _key === 'height.value' ? 'height'
                    : _key === 'weight.value' ? 'weight'
                        : _key === 'relationships.type' ? 'relationships'
                            : _key);
            if (value && typeof value === 'object' && value.constructor === Object) {
                updated.condition[key] = {};
                if (Object.keys(value)[0] === '$exists') {
                    if (key.startsWith('journeys.')) {
                        // journeys currently have a special ui/syntax in filter
                        updated.condition['Journeys'] = (_a = {}, _a[value.$exists ? '$in' : '$nin'] = key.split('.')[1], _a);
                    }
                    else if (value.$exists) {
                        updated.condition[key]['$isSet'] = "Value";
                    }
                    else {
                        updated.condition[key]['$isNotSet'] = "Value";
                    }
                }
                // case for isSet and isNotSet includes empty string as unset value
                else if (Array.isArray(value.$in) && value.$in.length === 3 && value.$in.includes(null) && value.$in.includes('') && value.$in.find(function (v) { return Array.isArray(v) && v.length === 0; })) {
                    updated.condition[key]['$isNotSet'] = "Value";
                }
                else if (Array.isArray(value.$nin) && value.$nin.length === 3 && value.$nin.includes(null) && value.$nin.includes('') && value.$nin.find(function (v) { return Array.isArray(v) && v.length === 0; })) {
                    updated.condition[key]['$isSet'] = "Value";
                }
                else if (Object.keys(value)[0] === '$gt' && (value.$gt instanceof Date || (0, utilities_1.is_full_iso_string_heuristic)(value.$gt) || value.$gt === '$now')) {
                    updated.condition[key]['$after'] = value.$gt;
                }
                else if (Object.keys(value)[0] === '$lt' && (value.$lt instanceof Date || (0, utilities_1.is_full_iso_string_heuristic)(value.$lt) || value.$lt === '$now')) {
                    updated.condition[key]['$before'] = value.$lt;
                }
                else if (Object.keys(value)[0] === '$regex') {
                    updated.condition[key]['$contains'] = value.$regex;
                }
                else if (Object.keys(value)[0] === '$not' && ((_c = Object.keys((_b = value.$not) !== null && _b !== void 0 ? _b : {})) === null || _c === void 0 ? void 0 : _c[0]) === '$regex') {
                    updated.condition[key]['$doesNotContain'] = value.$not.$regex;
                }
                else {
                    updated.condition[key] = value;
                }
            }
            else {
                updated.condition[key] = value;
            }
        }
        return updated;
    }
    return filter;
};
exports.mongo_db_filter_to_enduser_condition = mongo_db_filter_to_enduser_condition;
var list_of_strings_with_qualifier_to_mongodb_filter = function (tags) {
    if ((tags === null || tags === void 0 ? void 0 : tags.qualifier) === 'All Of') {
        return { $all: tags.values || [] };
    }
    return { $in: (tags === null || tags === void 0 ? void 0 : tags.values) || [] };
};
exports.list_of_strings_with_qualifier_to_mongodb_filter = list_of_strings_with_qualifier_to_mongodb_filter;
var mongo_db_filter_to_list_of_strings_with_qualifier = function (filter) {
    var defaultValue = { qualifier: 'One Of', values: [] };
    if (!filter) {
        return defaultValue;
    }
    if (filter.$all) {
        return { values: filter.$all, qualifier: 'All Of' };
    }
    if (filter.$in) {
        return { values: filter.$in, qualifier: 'One Of' };
    }
    return defaultValue;
};
exports.mongo_db_filter_to_list_of_strings_with_qualifier = mongo_db_filter_to_list_of_strings_with_qualifier;
var apply_mongodb_style_filter = function (data, filter, options) {
    var matchesFilter = function (item, filter) {
        if (!options.showArchived && (item === null || item === void 0 ? void 0 : item.archivedAt))
            return false;
        var _loop_1 = function (key, condition) {
            if (key === "$and") {
                if (!Array.isArray(condition) || !condition.every(function (subFilter) { return matchesFilter(item, subFilter); })) {
                    return { value: false };
                }
            }
            else if (key === "$or") {
                if (!Array.isArray(condition) || !condition.some(function (subFilter) { return matchesFilter(item, subFilter); })) {
                    return { value: false };
                }
            }
            else if (key === "$nor") {
                if (!Array.isArray(condition) || condition.some(function (subFilter) { return matchesFilter(item, subFilter); })) {
                    return { value: false };
                }
            }
            else if (key === "$not") {
                if (typeof condition !== "object" || matchesFilter(item, condition)) {
                    return { value: false };
                }
            }
            else {
                var value_1 = (0, utilities_1.value_for_dotted_key)(item, key, { handleArray: true });
                // console.log('checking value', key, value, condition)
                // to be consistent with mongodb, $in/$nin should match null and undefined
                var modifyArrayOperandForNull = function (v) { return (__spreadArray(__spreadArray([], v, true), (v.includes(null) ? [undefined] : []), true)); };
                if (Array.isArray(value_1)) {
                    if (typeof condition === "object" && condition !== null) {
                        for (var _c = 0, _d = Object.entries(condition); _c < _d.length; _c++) {
                            var _e = _d[_c], operator = _e[0], operand = _e[1];
                            // handle empty array
                            if (Array.isArray(value_1) && value_1.length === 0) {
                                if (operator === '$eq' && Array.isArray(operand) && operand.length === 0) {
                                    continue;
                                }
                                if (operator === '$ne' && Array.isArray(operand) && operand.length === 0) {
                                    return { value: false };
                                }
                                if (Array.isArray(operand) && operand.find(function (a) { return Array.isArray(a) && a.length === 0; })) {
                                    if (operator === '$in') {
                                        continue;
                                    }
                                    if (operator === '$nin') {
                                        return { value: false };
                                    }
                                }
                            }
                            if (operator === '$eq' && !value_1.includes(operand))
                                return { value: false };
                            if (operator === '$ne' && value_1.includes(operand))
                                return { value: false };
                            if (operator === "$in" && Array.isArray(operand) && !modifyArrayOperandForNull(operand).some(function (o) { return value_1.includes(o); }))
                                return { value: false };
                            if (operator === "$nin" && Array.isArray(operand) && modifyArrayOperandForNull(operand).some(function (o) { return value_1.includes(o); }))
                                return { value: false };
                            if (operator === "$all" && Array.isArray(operand) && !operand.every(function (o) { return value_1.includes(o); }))
                                return { value: false };
                            if (operator === '$all' && condition.length === 0)
                                return { value: false };
                            if (operator === '$all' && Array.isArray(operand) && operand.length === 0)
                                return { value: false };
                            if (operator === "$size" && value_1.length !== operand)
                                return { value: false };
                            if (operator === '$exists' && operand === false)
                                return { value: false };
                        }
                    }
                    else {
                        if (!value_1.includes(condition))
                            return { value: false };
                    }
                }
                else {
                    if (typeof condition === "object" && condition !== null) {
                        for (var _f = 0, _g = Object.entries(condition); _f < _g.length; _f++) {
                            var _h = _g[_f], operator = _h[0], operand = _h[1];
                            var numberValue = ((0, utilities_1.is_full_iso_string_heuristic)(value_1 === null || value_1 === void 0 ? void 0 : value_1.toString())
                                ? new Date(value_1).getTime()
                                : parseFloat(value_1));
                            var parsedOperandForNumber = ((0, utilities_1.is_full_iso_string_heuristic)(operand === null || operand === void 0 ? void 0 : operand.toString())
                                ? new Date(operand).getTime()
                                : operand === '$now'
                                    ? new Date().getTime()
                                    : parseFloat(operand));
                            if (operator === "$eq" && value_1 !== operand)
                                return { value: false };
                            if (operator === "$ne" && value_1 === operand)
                                return { value: false };
                            if (operator === "$in" && (!Array.isArray(operand) || !(modifyArrayOperandForNull(operand).includes(value_1))))
                                return { value: false };
                            if (operator === "$nin" && !(Array.isArray(operand) && !modifyArrayOperandForNull(operand).includes(value_1)))
                                return { value: false };
                            if (operator === "$exists" && ((operand && value_1 === undefined) || (!operand && value_1 !== undefined)))
                                return { value: false };
                            if (operator === "$regex" && !(typeof value_1 === "string" && new RegExp(operand).test(value_1)))
                                return { value: false };
                            if (operator === "$gt" && (numberValue <= parseFloat(parsedOperandForNumber) || isNaN(numberValue) || numberValue === null || numberValue === undefined))
                                return { value: false };
                            if (operator === "$gte" && (numberValue < parseFloat(parsedOperandForNumber) || isNaN(numberValue) || numberValue === null || numberValue === undefined))
                                return { value: false };
                            if (operator === "$lt" && (numberValue >= parseFloat(parsedOperandForNumber) || isNaN(numberValue) || numberValue === null || numberValue === undefined))
                                return { value: false };
                            if (operator === "$lte" && (numberValue > parseFloat(parsedOperandForNumber) || isNaN(numberValue) || numberValue === null || numberValue === undefined))
                                return { value: false };
                            // only valid for lists, shoujld return false by default
                            if (operator === '$all')
                                return { value: false };
                        }
                    }
                    else {
                        if (value_1 !== condition)
                            return { value: false };
                    }
                }
            }
        };
        for (var _i = 0, _a = Object.entries(filter); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], condition = _b[1];
            var state_1 = _loop_1(key, condition);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return true;
    };
    try {
        return data.filter(function (item) { return matchesFilter(item, filter); });
    }
    catch (err) {
        console.error("Filter error:", err);
    }
    return data;
};
exports.apply_mongodb_style_filter = apply_mongodb_style_filter;
var remove_inactive_filters = function (filters) { return (filters.map(function (f) {
    // gpt4o
    var cleanedFilter = Object.entries(f).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        if (key === "$and" || key === "$or") {
            var subFilters = Array.isArray(value) ? value.filter(function (sub) { return Object.keys(sub).length > 0; }) : [];
            if (subFilters.length > 0) {
                acc[key] = subFilters;
            }
        }
        else if (key === "$in" || key === "$all") {
            if (Array.isArray(value) && value.length > 0) {
                acc[key] = value;
            }
        }
        else if (key === "$exists" || key === "$not") {
            acc[key] = value;
        }
        else if (typeof value === "object" && value !== null) {
            var nestedFilter = (0, exports.remove_inactive_filters)([value])[0];
            if (nestedFilter && Object.keys(nestedFilter).length > 0) {
                acc[key] = nestedFilter;
            }
        }
        else {
            acc[key] = value;
        }
        return acc;
    }, {});
    return Object.keys(cleanedFilter).length > 0 ? cleanedFilter : null;
})
    .filter(function (v) { return v && !(0, utilities_1.object_is_empty)(v); })); };
exports.remove_inactive_filters = remove_inactive_filters;
var useFiltersV2 = function (args) {
    var _a = args !== null && args !== void 0 ? args : {}, onFilterChange = _a.onFilterChange, reload = _a.reload, memoryId = _a.memoryId, initialFilters = _a.initialFilters, showArchived = _a.showArchived;
    var loadFilters = (0, react_1.useCallback)(function () { return (initialFilters || (memoryId
        ? ((0, utilities_1.safeJSONParse)((0, utilities_1.read_local_storage)(memoryId)) || {})
        : {})); }, [initialFilters, memoryId]);
    var _b = react_1.default.useState(loadFilters()), filters = _b[0], setFilters = _b[1];
    var didReloadRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (!reload)
            return;
        if (didReloadRef.current)
            return;
        didReloadRef.current = true;
        setFilters(loadFilters);
    }, [reload, loadFilters]);
    (0, react_1.useEffect)(function () {
        if (!memoryId)
            return;
        (0, utilities_1.update_local_storage)(memoryId, JSON.stringify(filters));
    }, [filters, memoryId]);
    var prevFilterRef = react_1.default.useRef(filters);
    (0, react_1.useEffect)(function () {
        if (!onFilterChange)
            return;
        if ((0, utilities_1.objects_equivalent)(prevFilterRef.current, filters))
            return;
        prevFilterRef.current = filters;
        onFilterChange(filters);
    }, [filters, onFilterChange]);
    var mdbFilter = (0, react_1.useMemo)(function () { return ({
        $and: (0, exports.remove_inactive_filters)(Object.values(filters))
    }); }, [filters]);
    var applyFilters = (0, react_1.useCallback)((function (data) { return (0, exports.apply_mongodb_style_filter)(data, mdbFilter, { showArchived: !!showArchived }); }), [mdbFilter, showArchived]);
    return {
        mdbFilter: mdbFilter,
        filters: filters,
        setFilters: setFilters,
        applyFilters: applyFilters,
        activeFilterCount: Object.values(filters).filter(function (f) { return !!f.filter; }).length
    };
};
exports.useFiltersV2 = useFiltersV2;
/* FILTER / SEARCH */
var filter_setter_for_key = function (key, setFilters) { return function (f) { return setFilters(function (fs) {
    var _a;
    return (__assign(__assign({}, fs), (_a = {}, _a[key] = __assign(__assign({}, fs === null || fs === void 0 ? void 0 : fs[key]), { filter: f }), _a)));
}); }; };
exports.filter_setter_for_key = filter_setter_for_key;
var apply_filters = function (fs, data) {
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
exports.apply_filters = apply_filters;
var useFilters = function (args) {
    var _a = args !== null && args !== void 0 ? args : {}, onFilterChange = _a.onFilterChange, reload = _a.reload, memoryId = _a.memoryId, initialFilters = _a.initialFilters, deserialize = _a.deserialize, showArchived = _a.showArchived;
    if (memoryId && !deserialize)
        console.warn("memoryId provided without deserialize");
    var _b = react_1.default.useState(initialFilters || ((memoryId && deserialize)
        ? deserialize(((0, utilities_1.safeJSONParse)((0, utilities_1.read_local_storage)(memoryId)) || {}))
        : {})), filters = _b[0], setFilters = _b[1];
    var didReloadRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (!reload)
            return;
        if (didReloadRef.current)
            return;
        didReloadRef.current = true;
        setFilters(initialFilters || ((memoryId && deserialize)
            ? deserialize(((0, utilities_1.safeJSONParse)((0, utilities_1.read_local_storage)(memoryId)) || {}))
            : {}));
    }, [reload, initialFilters, memoryId, deserialize]);
    (0, react_1.useEffect)(function () {
        if (!memoryId)
            return;
        (0, utilities_1.update_local_storage)(memoryId, JSON.stringify(filters));
    }, [filters, memoryId]);
    var prevFilterRef = react_1.default.useRef(filters);
    (0, react_1.useEffect)(function () {
        if (!onFilterChange)
            return;
        if ((0, utilities_1.objects_equivalent)(prevFilterRef.current, filters))
            return;
        prevFilterRef.current = filters;
        onFilterChange(filters);
    }, [filters, onFilterChange]);
    var applyFilters = (0, react_1.useCallback)((function (data) { return (0, exports.apply_filters)(filters, data).filter(function (v) {
        return (showArchived !== null && showArchived !== void 0 ? showArchived : true) ? true : !v.archivedAt;
    }); }), [filters, showArchived]);
    var compoundApiFilter = (0, react_1.useMemo)(function () {
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
exports.useFilters = useFilters;
var record_field_matches_query = function (value, query) {
    if (typeof value === 'string' && value.toUpperCase().includes(query.toUpperCase())) {
        return true;
    }
    if (typeof value === 'number' && value.toString() === query) {
        return true;
    }
    if (typeof value === 'object') {
        for (var k in value) {
            if ((0, exports.record_field_matches_query)(value[k], query)) {
                return true;
            }
        }
    }
    return false;
};
exports.record_field_matches_query = record_field_matches_query;
var record_matches_for_query = function (records, query) {
    var matches = [];
    for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
        var record = records_1[_i];
        for (var field in record) {
            var value = record[field];
            if (constants_1.UNSEARCHABLE_FIELDS.includes(field))
                continue;
            if ((0, exports.record_field_matches_query)(value, query)) {
                matches.push(record);
                break;
            }
        }
    }
    return matches;
};
exports.record_matches_for_query = record_matches_for_query;
var is_phone_prefix = function (s) {
    if (s.length <= 3)
        return false;
    // has ONLY numbers, (), +, - and spaces
    return /^[ 0-9()+-]+$/.test(s);
};
var filter_for_query = function (query, getAdditionalFields) {
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
        for (var field in joined) {
            var value = joined[field];
            // exact match is useful for things like id match and easy heuristic check for others
            if (value === query) {
                score += 10;
                continue;
            }
            if (constants_1.UNSEARCHABLE_FIELDS.includes(field))
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
            if (is_phone_prefix(query)) {
                var onlyNumbers = query.replaceAll(/[^0-9]/g, '');
                if (onlyNumbers.length >= 3 &&
                    value.toUpperCase().includes(onlyNumbers)) {
                    score += 1;
                    continue;
                }
            }
        }
        return score;
    };
    return ({
        filter: function (record) { return baseFilter(record); },
        apiFilter: { search: { query: query } },
    });
};
exports.filter_for_query = filter_for_query;
var performBulkAction = function (_a) {
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
exports.performBulkAction = performBulkAction;
var ModelSearchInput = function (_a) {
    var _b, _c, _d;
    var filterKey = _a.filterKey, setFilters = _a.setFilters, searchAPI = _a.searchAPI, onLoad = _a.onLoad, attachSearchableFields = _a.attachSearchableFields, 
    // @ts-ignore remove from props if provided by mistake
    activeFilterCount = _a.activeFilterCount, 
    // @ts-ignore remove from props if provided by mistake
    compoundApiFilter = _a.compoundApiFilter, value = _a.value, onChange = _a.onChange, props = __rest(_a, ["filterKey", "setFilters", "searchAPI", "onLoad", "attachSearchableFields", "activeFilterCount", "compoundApiFilter", "value", "onChange"]);
    var dontPersist = false;
    try { // may fail to load if enduser session
        var organizationLoading = (0, _1.useOrganization)()[0];
        dontPersist = !!((0, _1.value_is_loaded)(organizationLoading) ? (_d = (_c = (_b = organizationLoading.value) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c.interface) === null || _d === void 0 ? void 0 : _d.dontPersistSearches : undefined);
    }
    catch (err) { }
    var cacheKey = "search-cache-".concat(filterKey);
    var _e = (0, react_1.useState)(dontPersist ? '' : ((0, utilities_1.read_local_storage)(cacheKey) || '')), _query = _e[0], _setQuery = _e[1];
    var query = value !== null && value !== void 0 ? value : _query;
    var setQuery = onChange !== null && onChange !== void 0 ? onChange : _setQuery;
    var filterOnLoadRef = (0, react_1.useRef)(!!query);
    (0, react_1.useEffect)(function () {
        (0, utilities_1.update_local_storage)(cacheKey, query);
    }, [query]);
    (0, react_1.useEffect)(function () { return onChange === null || onChange === void 0 ? void 0 : onChange(query); }, [onChange, query]);
    (0, hooks_1.useSearchAPI)({ query: query, searchAPI: searchAPI, onLoad: onLoad });
    (0, react_1.useEffect)(function () {
        var t = setTimeout(function () {
            setFilters(function (fs) {
                var _a;
                var _b, _c, _d;
                return ((((_d = (_c = (_b = fs[filterKey]) === null || _b === void 0 ? void 0 : _b.apiFilter) === null || _c === void 0 ? void 0 : _c.search) === null || _d === void 0 ? void 0 : _d.query) === query && !filterOnLoadRef.current)
                    ? fs
                    : __assign(__assign({}, fs), (_a = {}, _a[filterKey] = (0, exports.filter_for_query)(query, attachSearchableFields), _a)));
            });
            filterOnLoadRef.current = false;
        }, 50);
        return function () { clearTimeout(t); };
    }, [query, filterKey, setFilters, attachSearchableFields]);
    return ((0, jsx_runtime_1.jsx)(_1.SearchTextInput, __assign({}, props, { value: query, onChange: function (s) { return setQuery(s); } })));
};
exports.ModelSearchInput = ModelSearchInput;
var EnduserSearch = function (props) {
    var _a, _b, _c;
    var session = (0, _1.useResolvedSession)();
    var _d = (0, _1.useEndusers)(), addLocalElements = _d[1].addLocalElements;
    var _e = (0, _1.useUsers)(), usersLoading = _e[0], findUser = _e[1].findById;
    // wait for users to load, so that a saved query is able to match attachSearchableFields
    // only wait when users have ALL_ACCESS to ensures users can actually load
    if (((_c = (_b = (_a = session.userInfo) === null || _a === void 0 ? void 0 : _a.access) === null || _b === void 0 ? void 0 : _b.users) === null || _c === void 0 ? void 0 : _c.read) === constants_1.ALL_ACCESS && !(0, _1.value_is_loaded)(usersLoading))
        return null;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "endusers" }, props, { searchAPI: function (_a) {
            var search = _a.search;
            return __awaiter(void 0, void 0, void 0, function () {
                var phone, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            phone = validation_1.phoneValidator.validate()(search.query);
                            if (!phone) return [3 /*break*/, 2];
                            return [4 /*yield*/, Promise.all([
                                    session.api.endusers.getSome({ filter: { phone: phone } }),
                                    session.api.endusers.getSome({ search: search }),
                                ])];
                        case 1: return [2 /*return*/, (_b.sent()).flatMap(function (v) { return v; })];
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            err_1 = _b.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, session.api.endusers.getSome({ search: search })];
                    }
                });
            });
        }, onLoad: addLocalElements, attachSearchableFields: function (t) {
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
exports.EnduserSearch = EnduserSearch;
exports.CHAT_ROOM_SEARCH = 'chat-room-search';
var ChatRoomSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useChatRooms)(), addLocalElements = _a[1].addLocalElements;
    var _b = (0, _1.useUsers)(), usersLoading = _b[0], findUser = _b[1].findById;
    var _c = (0, _1.useEndusers)(), endusersLoading = _c[0], findEnduser = _c[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!(0, _1.value_is_loaded)(usersLoading))
        return null;
    if (!(0, _1.value_is_loaded)(endusersLoading))
        return null;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: exports.TICKET_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.chat_rooms.getSome, onLoad: addLocalElements, attachSearchableFields: function (r) {
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
exports.ChatRoomSearch = ChatRoomSearch;
exports.TICKET_SEARCH_FILTER_KEY = 'ticket-search';
var TicketSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useTickets)(), addLocalElements = _a[1].addLocalElements;
    var _b = (0, _1.useUsers)(), usersLoading = _b[0], findUser = _b[1].findById;
    var _c = (0, _1.useEndusers)(), endusersLoading = _c[0], findEnduser = _c[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!(0, _1.value_is_loaded)(usersLoading))
        return null;
    if (!(0, _1.value_is_loaded)(endusersLoading))
        return null;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: exports.TICKET_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.tickets.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
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
exports.TicketSearch = TicketSearch;
exports.ENDUSER_ORDERS_SEARCH_FILTER_KEY = 'ticket-search';
var EnduserOrdersSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useEnduserOrders)(), addLocalElements = _a[1].addLocalElements;
    var _b = (0, _1.useEndusers)(), endusersLoading = _b[0], findEnduser = _b[1].findById;
    // wait for users/endusers to load, so that a saved query is able to match attachSearchableFields
    if (!(0, _1.value_is_loaded)(endusersLoading))
        return null;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: exports.ENDUSER_ORDERS_SEARCH_FILTER_KEY }, props, { searchAPI: session.api.enduser_orders.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
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
exports.EnduserOrdersSearch = EnduserOrdersSearch;
var PrescriptionRoutesSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.usePrescriptionRoutes)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "prescription_routes" }, props, { searchAPI: session.api.prescription_routes.getSome, onLoad: addLocalElements })));
};
exports.PrescriptionRoutesSearch = PrescriptionRoutesSearch;
var FaxSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useFaxLogs)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "fax_logs" }, props, { searchAPI: session.api.fax_logs.getSome, onLoad: addLocalElements })));
};
exports.FaxSearch = FaxSearch;
var FileSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useFiles)(), addLocalElements = _a[1].addLocalElements;
    var _b = (0, _1.useEndusers)(), findEnduser = _b[1].findById;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "files" }, props, { searchAPI: session.api.files.getSome, onLoad: addLocalElements, attachSearchableFields: function (t) {
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
exports.FileSearch = FileSearch;
var SuggestedContactSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useSuggestedContacts)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "suggested-contact" }, props, { searchAPI: session.api.suggested_contacts.getSome, onLoad: addLocalElements })));
};
exports.SuggestedContactSearch = SuggestedContactSearch;
var WaitlistSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useWaitlists)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "waitlist" }, props, { searchAPI: session.api.waitlists.getSome, onLoad: addLocalElements })));
};
exports.WaitlistSearch = WaitlistSearch;
var AgentRecordSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useAgentRecords)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "agent-record" }, props, { searchAPI: session.api.agent_records.getSome, onLoad: addLocalElements })));
};
exports.AgentRecordSearch = AgentRecordSearch;
var AllergyCodeSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useAllergyCodes)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "allergy-code" }, props, { searchAPI: session.api.allergy_codes.getSome, onLoad: addLocalElements })));
};
exports.AllergyCodeSearch = AllergyCodeSearch;
var DiagnosisCodeSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useDiagnosisCodes)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "diagnoses-code" }, props, { searchAPI: session.api.diagnosis_codes.getSome, onLoad: addLocalElements })));
};
exports.DiagnosisCodeSearch = DiagnosisCodeSearch;
var CallHoldQueueSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useCallHoldQueues)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "call-hold-queue" }, props, { searchAPI: session.api.call_hold_queues.getSome, onLoad: addLocalElements })));
};
exports.CallHoldQueueSearch = CallHoldQueueSearch;
var TicketQueueSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useTicketQueues)({ dontFetch: true }), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "ticket-queue" }, props, { searchAPI: session.api.ticket_queues.getSome, onLoad: addLocalElements })));
};
exports.TicketQueueSearch = TicketQueueSearch;
var NotificationSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useNotifications)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "notifications-search" }, props, { searchAPI: session.api.user_notifications.getSome, onLoad: addLocalElements })));
};
exports.NotificationSearch = NotificationSearch;
var FormSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useForms)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "form-search" }, props, { searchAPI: session.api.forms.getSome, onLoad: addLocalElements })));
};
exports.FormSearch = FormSearch;
var FormGroupSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useFormGroups)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "form-group-search" }, props, { searchAPI: session.api.form_groups.getSome, onLoad: addLocalElements })));
};
exports.FormGroupSearch = FormGroupSearch;
var AutomationTriggerSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useAutomationTriggers)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "trigger-search" }, props, { searchAPI: session.api.automation_triggers.getSome, onLoad: addLocalElements })));
};
exports.AutomationTriggerSearch = AutomationTriggerSearch;
var JourneySearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useJourneys)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "journeys" }, props, { searchAPI: session.api.journeys.getSome, onLoad: addLocalElements })));
};
exports.JourneySearch = JourneySearch;
var TemplateSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useTemplates)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "templates" }, props, { searchAPI: session.api.templates.getSome, onLoad: addLocalElements })));
};
exports.TemplateSearch = TemplateSearch;
var ForumSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useForums)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "forums" }, props, { searchAPI: session.api.forums.getSome, onLoad: addLocalElements })));
};
exports.ForumSearch = ForumSearch;
var UserSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useUsers)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "users" }, props, { searchAPI: session.api.users.getSome, onLoad: addLocalElements })));
};
exports.UserSearch = UserSearch;
var OrganizationSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useOrganizations)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "organizations" }, props, { searchAPI: session.api.organizations.getSome, onLoad: addLocalElements })));
};
exports.OrganizationSearch = OrganizationSearch;
var EnduserOrUserSearch = function (props) {
    var session = (0, _1.useResolvedSession)();
    var _a = (0, _1.useEndusers)(), addLocalEndusers = _a[1].addLocalElements;
    var _b = (0, _1.useUsers)(), addLocalUsers = _b[1].addLocalElements;
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
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "endusers-or-users" }, props, { searchAPI: searchAPI })));
};
exports.EnduserOrUserSearch = EnduserOrUserSearch;
var MessageTemplateSnippetSearch = function (_a) {
    var dontFetch = _a.dontFetch, props = __rest(_a, ["dontFetch"]);
    var session = (0, _1.useSession)();
    var _b = (0, _1.useMessageTemplateSnippets)({ dontFetch: dontFetch }), addLocalElements = _b[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "message_template_snippets" }, props, { searchAPI: session.api.message_template_snippets.getSome, onLoad: addLocalElements })));
};
exports.MessageTemplateSnippetSearch = MessageTemplateSnippetSearch;
var ContentSearch = function (_a) {
    var dontFetch = _a.dontFetch, props = __rest(_a, ["dontFetch"]);
    var session = (0, _1.useResolvedSession)();
    var _b = (0, _1.useManagedContentRecords)({ dontFetch: dontFetch }), addLocalElements = _b[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "managed_content_records" }, props, { searchAPI: session.api.managed_content_records.getSome, onLoad: addLocalElements })));
};
exports.ContentSearch = ContentSearch;
var CalendarEventTemplatesSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useCalendarEventTemplates)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "calendar_event_templates" }, props, { searchAPI: session.api.calendar_event_templates.getSome, onLoad: addLocalElements })));
};
exports.CalendarEventTemplatesSearch = CalendarEventTemplatesSearch;
var AppointmentLocationSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useAppointmentLocations)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "appointment_locations" }, props, { searchAPI: session.api.appointment_locations.getSome, onLoad: addLocalElements })));
};
exports.AppointmentLocationSearch = AppointmentLocationSearch;
var AppointmentBookingPagesSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useAppointmentBookingPages)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "appointment_booking_pages" }, props, { searchAPI: session.api.appointment_booking_pages.getSome, onLoad: addLocalElements })));
};
exports.AppointmentBookingPagesSearch = AppointmentBookingPagesSearch;
var DatabaseSearch = function (props) {
    var session = (0, _1.useSession)();
    var _a = (0, _1.useDatabases)(), addLocalElements = _a[1].addLocalElements;
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "databases" }, props, { searchAPI: session.api.databases.getSome, onLoad: addLocalElements })));
};
exports.DatabaseSearch = DatabaseSearch;
var DatabaseRecordSearch = function (_a) {
    var databaseId = _a.databaseId, props = __rest(_a, ["databaseId"]);
    var session = (0, _1.useSession)();
    var _b = (0, _1.useDatabaseRecords)(), addLocalElements = _b[1].addLocalElements;
    var searchAPI = (0, react_1.useCallback)(function (query) { return (session.api.database_records.getSome(__assign({ filter: { databaseId: databaseId } }, query))); }, [session, databaseId]);
    return ((0, jsx_runtime_1.jsx)(exports.ModelSearchInput, __assign({ filterKey: "database_records" }, props, { searchAPI: searchAPI, onLoad: addLocalElements })));
};
exports.DatabaseRecordSearch = DatabaseRecordSearch;
var SEARCHBAR_MIN_WIDTH = '125px';
var UserAndEnduserSelector = function (_a) {
    var titleInput = _a.titleInput, excludeEndusers = _a.excludeEndusers, excludeUsers = _a.excludeUsers, onGoBack = _a.onGoBack, onSelect = _a.onSelect, showTitleInput = _a.showTitleInput, hiddenIds = _a.hiddenIds, _b = _a.title, title = _b === void 0 ? "Select Members" : _b, minHeight = _a.minHeight, _c = _a.maxHeight, maxHeight = _c === void 0 ? '50vh' : _c, _d = _a.searchBarPlacement, searchBarPlacement = _d === void 0 ? "top" : _d, _e = _a.initialSelected, initialSelected = _e === void 0 ? [] : _e, _f = _a.buttonText, buttonText = _f === void 0 ? "Create" : _f, filter = _a.filter, radio = _a.radio, limitToUsers = _a.limitToUsers, dontIncludeSelf = _a.dontIncludeSelf, virtualizationHeight = _a.virtualizationHeight, showEntityType = _a.showEntityType;
    var session = (0, _1.useResolvedSession)();
    var _g = (0, _1.useEndusers)(), endusersLoading = _g[0], _h = _g[1], loadMoreEndusers = _h.loadMore, doneLoadingEndusers = _h.doneLoading;
    var _j = (0, _1.useUsers)({
        dontFetch: !!limitToUsers
    }), usersLoading = _j[0], _k = _j[1], loadMoreUsers = _k.loadMore, doneLoadingUsers = _k.doneLoading;
    var typesLoading = (0, _1.useEnduserCustomTypes)({ dontFetch: !showEntityType })[0];
    var entityTypes = (0, react_1.useMemo)(function () { return ((0, _1.value_is_loaded)(typesLoading) ? typesLoading.value : []); }, [typesLoading]);
    var doneLoading = (0, react_1.useCallback)(function () {
        return (excludeUsers || doneLoadingUsers()) && (excludeEndusers || doneLoadingEndusers());
    }, [doneLoadingEndusers, excludeUsers, excludeEndusers, doneLoadingUsers]);
    var loadMore = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    var _l = (0, react_1.useState)(initialSelected), selected = _l[0], setSelected = _l[1];
    var _m = (0, exports.useFilters)(), applyFilters = _m.applyFilters, filterProps = __rest(_m, ["applyFilters"]);
    var searchbarFullWidth = searchBarPlacement === "bottom";
    var searchbar = (0, react_1.useMemo)(function () { return (excludeUsers
        ? (0, jsx_runtime_1.jsx)(exports.EnduserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))
        : excludeEndusers
            ? (0, jsx_runtime_1.jsx)(exports.UserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))
            : (0, jsx_runtime_1.jsx)(exports.EnduserOrUserSearch, __assign({}, filterProps, { style: { minWidth: SEARCHBAR_MIN_WIDTH }, fullWidth: searchbarFullWidth }))); }, [excludeUsers, excludeEndusers, filterProps, searchbarFullWidth]);
    var handleSelect = (0, react_1.useCallback)(function (users, endusers) {
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
        : (0, _1.value_is_loaded)(usersLoading)
            ? usersLoading.value
            : []);
    return ((0, jsx_runtime_1.jsx)(_1.LoadingData, { data: { endusers: endusersLoading }, render: function (_a) {
            var endusers = _a.endusers;
            var itemsUnfiltered = __spreadArray(__spreadArray([], excludeUsers ? [] : users, true), excludeEndusers ? [] : endusers, true).filter(function (i) { return !(hiddenIds === null || hiddenIds === void 0 ? void 0 : hiddenIds.includes(i.id)); });
            var items = applyFilters(filter
                ? itemsUnfiltered.filter(filter)
                : itemsUnfiltered);
            return ((0, jsx_runtime_1.jsxs)(_1.Flex, __assign({ flex: 1, column: true, justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsxs)(_1.Flex, __assign({ alignItems: "center", justifyContent: "space-between", wrap: "nowrap", style: {
                            marginBottom: 10,
                        } }, { children: [onGoBack &&
                                (0, jsx_runtime_1.jsx)(_1.Button, __assign({ onClick: onGoBack }, { children: "Back" })), (0, jsx_runtime_1.jsx)(_1.Typography, __assign({ style: { fontSize: 16, textAlign: 'center' } }, { children: title })), (0, jsx_runtime_1.jsx)(_1.LoadingButton, { submitText: buttonText, submittingText: buttonText, disabled: selected.length === 0 && !(initialSelected === null || initialSelected === void 0 ? void 0 : initialSelected.length), style: { display: 'flex' }, onClick: function () { return handleSelect(users, endusers); } })] })), (0, jsx_runtime_1.jsx)(_1.ScrollingList, { items: items, virtualization: virtualizationHeight ? {
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
                            ? (0, jsx_runtime_1.jsx)(_1.Flex, __assign({ flex: 1, justifyContent: "flex-end", style: { marginLeft: 'auto' } }, { children: searchbar }))
                            : undefined, itemContainerStyle: { padding: 4 }, Item: function (_a) {
                            var _b;
                            var user = _a.item;
                            return ((0, jsx_runtime_1.jsx)(_1.HoverPaper, __assign({ style: { marginBottom: 4 } }, { children: (0, jsx_runtime_1.jsxs)(_1.Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "space-between", onClick: function () {
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
                                    } }, { children: [(0, jsx_runtime_1.jsx)(_1.Checkbox, { checked: selected.includes(user.id) }), (0, jsx_runtime_1.jsxs)(_1.Flex, __assign({ flex: 1, column: true, alignItems: "flex-end", justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)(_1.Typography, __assign({ style: {
                                                        fontWeight: selected.includes(user.id) ? 'bold' : undefined,
                                                    } }, { children: (0, utilities_1.user_display_name)(user) })), showEntityType && user.customTypeId &&
                                                    (0, jsx_runtime_1.jsx)(_1.Typography, __assign({ style: {
                                                            fontWeight: selected.includes(user.id) ? 'bold' : undefined,
                                                            fontSize: 12.5,
                                                        } }, { children: (_b = entityTypes.find(function (t) { return t.id === user.customTypeId; })) === null || _b === void 0 ? void 0 : _b.title }))] }))] })) })));
                        } }), searchBarPlacement === 'bottom' &&
                        (0, jsx_runtime_1.jsx)(_1.Flex, __assign({ alignSelf: "flex-end", style: { marginTop: 4, width: '100%' } }, { children: searchbar }))] })));
        } }));
};
exports.UserAndEnduserSelector = UserAndEnduserSelector;
//# sourceMappingURL=inputs_shared.js.map