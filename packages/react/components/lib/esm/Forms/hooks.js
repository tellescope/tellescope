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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { phoneValidator } from "@tellescope/validation";
import { WithTheme, contact_is_valid, useAddGTMTag, useFileUpload, useFormFields, useFormResponses, useResolvedSession, value_is_loaded } from "../index";
import ReactGA from "react-ga4";
import isEmail from "validator/lib/isEmail";
import { append_current_utm_params, field_can_autoadvance, getLocalTimezone, get_time_values, get_utm_params, object_is_empty, responses_satisfy_conditions, update_local_storage } from "@tellescope/utilities";
export var useFlattenedTree = function (root) {
    var _a;
    var flat = [];
    var processing = [root];
    while (processing.length) {
        var node = processing.pop();
        if (!node)
            break;
        flat.push(node.value);
        var _loop_1 = function (child) {
            // continue DFS with unprocessed children
            if (flat.find(function (e) { return e.id === child.value.id; }))
                return "continue";
            processing.push(child);
        };
        for (var _i = 0, _b = (_a = node.children) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
            var child = _b[_i];
            _loop_1(child);
        }
    }
    return flat;
};
export var useNodeInTree = function (root, nodeId) {
    var _a;
    var processed = [root.value.id];
    var processing = [root];
    while (processing.length) {
        var node = processing.pop();
        if (!node)
            break;
        if (node.value.id === nodeId)
            return node;
        for (var _i = 0, _b = (_a = node.children) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
            var child = _b[_i];
            // continue DFS with unprocessed children
            if (processed.includes(child.value.id))
                continue;
            processing.push(child);
            processed.push(child.value.id);
        }
    }
    return undefined;
};
// only need to consider a newly added edge if run on every newly added edge
export var loopDetected = function (edges, startId, endId) {
    var startEdge = edges.find(function (e) { return e.source === startId && e.target === endId; });
    var processed = [];
    var processing = [startEdge];
    var _loop_2 = function () {
        var edge = processing.pop();
        if (!edge)
            return "break";
        if (edge.target === startId)
            return { value: true };
        for (var _i = 0, _a = edges.filter(function (e) { return e.source === edge.target; }); _i < _a.length; _i++) {
            var adjacentEdge = _a[_i];
            // continue DFS with unprocessed children
            if (processed.includes(adjacentEdge.id))
                continue;
            processing.push(adjacentEdge);
            processed.push(adjacentEdge.id);
        }
    };
    while (processing.length) {
        var state_1 = _loop_2();
        if (typeof state_1 === "object")
            return state_1.value;
        if (state_1 === "break")
            break;
    }
    return false;
};
export var default_label_for_compound_logic = function (f) {
    try {
        if (f.$and) {
            return "[".concat(f.$and.map(default_label_for_compound_logic).join(' AND '), "]");
        }
        if (f.$or) {
            return "(".concat(f.$or.map(default_label_for_compound_logic).join(' OR '), ")");
        }
        if (f.condition) {
            if (typeof f.condition === 'string')
                return f.condition;
            if (typeof f.condition === 'object') {
                var key = Object.keys(f.condition).pop();
                if (!key)
                    return '';
                if (key === '$exists')
                    return '';
                var value = f.condition[key];
                if (value && typeof value === 'object') {
                    var objectKey = Object.keys(value)[0];
                    if (objectKey === '$ne') {
                        return "".concat(key, " Does Not Equal ").concat(value[objectKey]);
                    }
                    if (objectKey === '$gt') {
                        return "".concat(key, " Greater Than ").concat(value[objectKey]);
                    }
                    if (objectKey === '$lt') {
                        return "".concat(key, " Less Than ").concat(value[objectKey]);
                    }
                }
                if (typeof value !== 'string')
                    return '';
                return value;
            }
        }
    }
    catch (err) {
        console.error(err);
        return '';
    }
    return '';
};
export var COMPOUND_LOGIC_LABEL_SENTINEL = "___compound___";
export var useGraphForFormFields = function (fields) {
    var _a;
    var edges = [];
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var field = fields_1[_i];
        for (var _b = 0, _c = (_a = field.previousFields) !== null && _a !== void 0 ? _a : []; _b < _c.length; _b++) {
            var parent_1 = _c[_b];
            if (parent_1.info.fieldId) {
                edges.push({
                    source: parent_1.info.fieldId,
                    target: field.id,
                    type: parent_1.type,
                    id: "".concat(parent_1.info.fieldId, "-").concat(field.id),
                    label: (parent_1.type === 'previousEquals'
                        ? parent_1.info.equals // if adding text, make sure that the edge editor is able to remove it first
                        : parent_1.type === 'compoundLogic'
                            ? (parent_1.info.label || default_label_for_compound_logic(parent_1.info.condition)) // 'Advanced Logic')
                            : "Default"),
                });
            }
        }
    }
    return {
        nodes: ( // important that this is a copy, filter achieves this
        fields.filter(function (f) { return !(f.isInGroup
            && fields.find(function (p) { var _a, _b; return (_b = (_a = p.options) === null || _a === void 0 ? void 0 : _a.subFields) === null || _b === void 0 ? void 0 : _b.find(function (s) { return s.id === f.id; }); })); })),
        edges: edges
    };
};
export var useTreeForFormFields = function (_fields) {
    var _a, _b;
    // ensure all fields actually belong to the same form
    var fields = _fields.filter(function (f) { return f.formId === _fields[0].formId; });
    var nodesForId = {};
    for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
        var step = fields_2[_i];
        nodesForId[step.id] = {
            value: step,
            children: [],
        };
    }
    var _loop_3 = function (parentId) {
        var parent_2 = nodesForId[parentId];
        for (var childId in nodesForId) {
            if (childId === parentId)
                continue;
            var child = nodesForId[childId];
            if ((child.value.previousFields).find(function (p) { var _a; return ((_a = p.info) === null || _a === void 0 ? void 0 : _a.fieldId) === parentId; })) {
                parent_2.children.push(child);
            }
        }
    };
    for (var parentId in nodesForId) {
        _loop_3(parentId);
    }
    // find and return root
    return nodesForId[(_b = (_a = fields.find(function (s) { return s.previousFields.find(function (p) { return p.type === 'root'; }); })) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ''];
};
export var getNextField = function (activeField, currentValue, responses, options) {
    if (activeField.children.length === 0) {
        return;
    }
    // if the one child isn't valid, we can show an early submission now, so don't return it by default
    // if (activeField.children.length === 1) {
    //   return activeField.children[0]
    // } 
    try {
        var advancedLogic = (activeField.children
            .filter(function (c) { return !!c.value.previousFields.find(function (p) { return p.type === 'compoundLogic' && p.info.fieldId === currentValue.fieldId; }); })
            .map(function (c) { return ({ node: c, logic: c.value.previousFields.find(function (p) { return p.type === 'compoundLogic' && p.info.fieldId === currentValue.fieldId; }) }); })
            .sort(function (v1, v2) { return v2.logic.info.priority - v1.logic.info.priority; }) // sort descending (highest priority at index 0)
        );
        for (var _i = 0, advancedLogic_1 = advancedLogic; _i < advancedLogic_1.length; _i++) {
            var _a = advancedLogic_1[_i], node = _a.node, logic = _a.logic;
            if (responses_satisfy_conditions(responses, logic.info.condition, options)) {
                return node;
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    return (activeField.children.find(function (c) { return c.value.previousFields.find(function (p) {
        var _a, _b, _c, _d, _e, _g;
        return p.type === 'previousEquals'
            && p.info.fieldId === currentValue.fieldId
            && (((currentValue.answer.type === 'multiple_choice' || currentValue.answer.type === 'Dropdown')
                && ((_a = currentValue.answer.value) === null || _a === void 0 ? void 0 : _a.includes(p.info.equals)))
                || (p.info.equals === currentValue.answer.value)
                || (currentValue.answer.type === 'Address' && (p.info.equals === ((_b = currentValue.answer.value) === null || _b === void 0 ? void 0 : _b.state)
                    || p.info.equals === ((_c = currentValue.answer.value) === null || _c === void 0 ? void 0 : _c.zipCode)
                    || p.info.equals === ((_d = currentValue.answer.value) === null || _d === void 0 ? void 0 : _d.city)))
                || (currentValue.answer.type === 'Database Select' && ((_e = currentValue.answer.value) === null || _e === void 0 ? void 0 : _e.find(function (v) { return v.text === p.info.equals; })))
                || (currentValue.answer.type === 'Insurance' && (((_g = currentValue.answer.value) === null || _g === void 0 ? void 0 : _g.payerName) === p.info.equals)));
    }); })) || (activeField
        .children.find(function (c) { return (c.value.previousFields.find(function (p) {
        return p.type === 'after'
            && p.info.fieldId === activeField.value.id;
    })); }));
};
export var useListForFormFields = function (fields, responses, options) {
    var list = [];
    var root = fields.find(function (f) { return f.previousFields.find(function (p) { return p.type === 'root'; }); });
    if (!root)
        return [];
    list.push(root);
    var _loop_4 = function () {
        var lastField = list[list.length - 1];
        if (!lastField)
            return "break";
        var currentValue = responses.find(function (r) { return r.fieldId === lastField.id; });
        if (!currentValue)
            return "break";
        var nextField = getNextField({
            value: lastField,
            children: (fields.filter(function (f) { return f.previousFields.find(function (p) { return p.type !== 'root' && p.info.fieldId === lastField.id; }); })
                .map(function (value) { return ({
                value: value,
                children: []
            }); }))
        }, currentValue, responses, __assign(__assign({}, options), { activeResponses: responses.filter(function (r) { return r.fieldId === currentValue.fieldId || list.find(function (l) { return l.id === r.fieldId; }); }) }));
        if (!nextField)
            return "break";
        if (list.find(function (f) { return f.id === nextField.value.id; }))
            return "break"; // prevent infinite looping in safe case
        list.push(nextField.value);
    };
    while (true) {
        var state_2 = _loop_4();
        if (state_2 === "break")
            break;
    }
    return list;
};
// load and build a tree of questions for a form
// only useful for clients who have broad access to forms and form resonses (e.g. users)
export var useLoadTreeForFormFields = function (formId) {
    var _a = useFormFields({ loadFilter: { formId: formId } }), filtered = _a[1].filtered;
    var formFieldsLoading = filtered(function (f) { return f.formId === formId; });
    if (!value_is_loaded(formFieldsLoading))
        return undefined;
    return useTreeForFormFields(formFieldsLoading.value);
};
export var useFieldsForForm = function (formId) {
    var _a = useFormFields({ loadFilter: { formId: formId !== null && formId !== void 0 ? formId : '' } }), _b = _a[1], filtered = _b.filtered, reload = _b.reload;
    useEffect(function () {
        if (!formId)
            return;
        // ensure formResponses are loaded for a given form
        reload({ loadFilter: { formId: formId } });
    }, [formId, reload]);
    return filtered(function (f) { return f.formId === formId; });
};
var OrganizationThemeContext = createContext(null);
export var WithOrganizationTheme = function (_a) {
    var businessId = _a.businessId, organizationIds = _a.organizationIds, children = _a.children;
    var _b = useState({}), theme = _b[0], setTheme = _b[1];
    return (_jsx(OrganizationThemeContext.Provider, __assign({ value: { businessId: businessId, organizationIds: organizationIds, theme: theme, setTheme: setTheme } }, { children: _jsx(WithTheme, __assign({ theme: {
                primary: theme.themeColor,
                secondary: theme.themeColorSecondary
            } }, { children: children })) })));
};
// uses context if provided, otherwise fetches separately for each hook call (but doesn't fail)
export var useOrganizationTheme = function () {
    var _a, _b;
    var context = useContext(OrganizationThemeContext);
    if (context === null) {
        console.warn("useOrganizationTheme should be called in a child of WithOrganizationTheme");
    }
    var session = useResolvedSession();
    var _c = useState((_a = context.theme) !== null && _a !== void 0 ? _a : {}), theme = _c[0], setTheme = _c[1];
    useEffect(function () {
        var _a, _b;
        if (theme.name)
            return; // indicates already loaded
        session.api.organizations.get_theme({
            businessId: (_a = context === null || context === void 0 ? void 0 : context.businessId) !== null && _a !== void 0 ? _a : session.userInfo.businessId,
            organizationIds: (_b = context === null || context === void 0 ? void 0 : context.organizationIds) !== null && _b !== void 0 ? _b : session.userInfo.organizationIds,
        })
            .then(function (_a) {
            var theme = _a.theme;
            setTheme(theme);
            context === null || context === void 0 ? void 0 : context.setTheme(theme);
        })
            .catch(console.error);
    }, [theme, session]);
    return (_b = context === null || context === void 0 ? void 0 : context.theme) !== null && _b !== void 0 ? _b : theme;
};
export var isDateString = function (_s) {
    if (_s === void 0) { _s = ''; }
    var s = _s.trim();
    if (!/^\d{2}-\d{2}-\d{4}$/.test(s)) {
        return false;
    }
    var _a = s.split('-').map(function (v) { return parseInt(v); }), mm = _a[0], dd = _a[1]; // dont use shorthand map(parseInt), causes radix mess
    if (mm === 0 || mm > 12)
        return false;
    if (dd === 0 || dd > 31)
        return false;
    // this seems to have inconsistent behavior in some mobile browsers, leave out for now
    // // ensure mm-dd-yyyy is actually valid
    // const [mm,dd,yyyy] = s.split('-').map(v => parseInt(v)) // don't shorthand, for radix argument of parseInt gets messed up
    // const d = Date.parse(`${yyyy}-${mm}-${dd}`) // this format should be explicitly supported by all implementations
    // if (isNaN(d)) return false
    return true;
};
var isZIPString = function (s) {
    if (s === void 0) { s = ''; }
    return /^\d{5}$/.test(s) || /^\d{5}-\d{4}$/.test(s);
};
// return the existing value to initialie a field, but only if the field type is consistent with the existing response
var existing_response_if_compatible = function (existingResponses, field) {
    var _a;
    if (!existingResponses)
        return undefined;
    var match = (_a = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (_f) { return _f.fieldId === field.id; })) === null || _a === void 0 ? void 0 : _a.answer;
    if (!match)
        return;
    // fix for mismatch in loading stored responses
    // should come before 'if type is same, this is fine'
    if (typeof match.value === 'string' && (field.type === 'Dropdown'
        || field.type === 'multiple_choice')) {
        return [match.value];
    }
    // if type is same, this is fine
    if (match.type === field.type) {
        return match.value;
    }
    // multiple types correspond to string values
    if (typeof match.value === 'string' && (field.type === 'string'
        || field.type === 'stringLong'
        || field.type === 'dateString'
        || field.type === 'email'
        || field.type === 'phone'
        || field.type === 'Stripe')) {
        return match.value;
    }
    // multiple types correspond to number values
    if (typeof match.value === 'number' && (field.type === 'number'
        || field.type === 'rating')) {
        return match.value;
    }
    // multiple types correspond to string list values
    if (Array.isArray(match.value) && (field.type === 'Dropdown'
        || field.type === 'multiple_choice')) {
        return match.value;
    }
    return undefined; // no valid match, write off as data loss due to incompatible type of new question
};
var shouldCallout = function (field, value) {
    var _a;
    if (!field)
        return false;
    if (!value)
        return false;
    try {
        if (!((_a = field.calloutConditions) === null || _a === void 0 ? void 0 : _a.length))
            return false;
        var _loop_5 = function (condition) {
            if (Array.isArray(value) && value.find(function (v) { return v === condition.value; })) {
                return { value: true };
            }
            if (value === condition.value) {
                return { value: true };
            }
        };
        for (var _i = 0, _b = field.calloutConditions; _i < _b.length; _i++) {
            var condition = _b[_i];
            var state_3 = _loop_5(condition);
            if (typeof state_3 === "object")
                return state_3.value;
        }
    }
    catch (err) { }
    return false;
};
export var useTellescopeForm = function (_a) {
    var _b, _c;
    var dontAutoadvance = _a.dontAutoadvance, isPublicForm = _a.isPublicForm, form = _a.form, urlLogicValue = _a.urlLogicValue, customization = _a.customization, carePlanId = _a.carePlanId, calendarEventId = _a.calendarEventId, context = _a.context, ga4measurementId = _a.ga4measurementId, rootResponseId = _a.rootResponseId, parentResponseId = _a.parentResponseId, accessCode = _a.accessCode, existingResponses = _a.existingResponses, automationStepId = _a.automationStepId, enduserId = _a.enduserId, formResponseId = _a.formResponseId, fields = _a.fields, isInternalNote = _a.isInternalNote, formTitle = _a.formTitle, submitRedirectURL = _a.submitRedirectURL, enduser = _a.enduser;
    var _d = get_time_values(new Date()), amPm = _d.amPm, hoursAmPm = _d.hoursAmPm, minutes = _d.minutes;
    var root = useTreeForFormFields(fields);
    if (!root) {
        console.error(fields);
        throw new Error("Root not found for given fields"); // don't change this message, error handlers expect it
    }
    var formId = root.value.formId;
    var session = useResolvedSession();
    var sessionType = session.type;
    var handleUpload = useFileUpload({ enduserId: session.type === 'enduser' ? session.userInfo.id : enduserId }).handleUpload;
    var _e = useFormResponses({ dontFetch: true }), _g = _e[1], updateFormResponse = _g.updateElement, updateLocalFormResponse = _g.updateLocalElement;
    var _h = useState(), customerId = _h[0], setCustomerId = _h[1];
    var _j = useState(root), activeField = _j[0], setActiveField = _j[1];
    var _k = useState(undefined), submittingStatus = _k[0], setSubmittingStatus = _k[1];
    var _l = useState(''), submitErrorMessage = _l[0], setSubmitErrorMessage = _l[1];
    var _m = useState(0), currentPageIndex = _m[0], setCurrentPageIndex = _m[1];
    var _o = useState([]), uploadingFiles = _o[0], setUploadingFiles = _o[1];
    var prevFieldStackRef = useRef([]);
    var _p = useState({}), repeats = _p[0], setRepeats = _p[1];
    var gaEventRef = useRef({});
    var goBackURL = '';
    try {
        goBackURL = new URL(window.location.href).searchParams.get('back') || '';
    }
    catch (err) { }
    useAddGTMTag(form === null || form === void 0 ? void 0 : form.gtmTag);
    useEffect(function () {
        try {
            window.location.hash = activeField.value.id;
        }
        catch (err) { }
    }, [activeField]);
    var getNumberOfRemainingPages = useCallback(function (field, explored) {
        if (field === void 0) { field = activeField.value; }
        if (explored === void 0) { explored = []; }
        // prevents recursing on an already explored node (there shouldn't be loops anyway, but just in case)
        if (explored.includes(field.id))
            return 0;
        explored.push(field.id); // make sure to push this node to prevent future exploration
        var children = fields.filter(function (f) { return (f.previousFields.find(function (f) { return f.type !== 'root' && f.info.fieldId === field.id; })); });
        if (children.length === 0)
            return 0;
        return (1 + Math.max.apply(Math, children.map(function (c) { return getNumberOfRemainingPages(c, explored); })));
    }, [activeField, fields]);
    useEffect(function () {
        if (!ga4measurementId)
            return;
        if (!gaEventRef.current['initialize']) {
            ReactGA.initialize(ga4measurementId);
            gaEventRef.current['initialize'] = true;
        }
        if (gaEventRef.current[activeField.value.id])
            return;
        gaEventRef.current[activeField.value.id] = true;
        ReactGA.event({
            category: "form_".concat(activeField.value.formId),
            action: "Form Progress",
            label: activeField.value.title,
            transport: "beacon",
            value: 1,
        });
    }, [ga4measurementId, activeField]);
    // placeholders for initial fields, reset when fields prop changes, since questions are now different (e.g. different form selected) 
    var fieldInitRef = useRef('');
    var initializeFields = useCallback(function () { return (fields.map(function (f) {
        var _a, _b, _c, _d, _e, _g, _h, _j, _k, _l, _m, _o, _p, _q, _t, _u, _v, _w, _x;
        return ({
            fieldId: f.id,
            fieldTitle: f.title,
            fieldDescription: f.description,
            fieldHtmlDescription: f.htmlDescription,
            externalId: f.externalId,
            intakeField: f.intakeField || undefined,
            touched: false,
            includeInSubmit: false,
            sharedWithEnduser: f.sharedWithEnduser,
            isCalledOut: (_a = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _a === void 0 ? void 0 : _a.isCalledOut,
            isHighlightedOnTimeline: (_b = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _b === void 0 ? void 0 : _b.isHighlightedOnTimeline,
            disabled: !!(((_d = (_c = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _c === void 0 ? void 0 : _c.answer) === null || _d === void 0 ? void 0 : _d.value) && f.disabledWhenPrepopulated),
            // keep consistent with onFieldChange
            computedValueKey: (
            // the height typeof is unnecessary (no actual type comparison), but don't change without testing both number and height question types
            (f === null || f === void 0 ? void 0 : f.intakeField) === 'height' && typeof ((_g = (_e = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _e === void 0 ? void 0 : _e.answer) === null || _g === void 0 ? void 0 : _g.value)
                ? 'Height'
                : (f === null || f === void 0 ? void 0 : f.intakeField) === 'weight' && typeof ((_j = (_h = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _h === void 0 ? void 0 : _h.answer) === null || _j === void 0 ? void 0 : _j.value) === 'number'
                    ? 'Weight'
                    : (f === null || f === void 0 ? void 0 : f.intakeField) === 'dateOfBirth' && ((_l = (_k = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _k === void 0 ? void 0 : _k.answer) === null || _l === void 0 ? void 0 : _l.type) === 'dateString'
                        ? 'Date of Birth'
                        : (f === null || f === void 0 ? void 0 : f.intakeField) === 'gender' && ['multiple_choice', 'Dropdown'].includes(((_o = (_m = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id; })) === null || _m === void 0 ? void 0 : _m.answer) === null || _o === void 0 ? void 0 : _o.type) || '')
                            ? 'Gender'
                            : (f === null || f === void 0 ? void 0 : f.intakeField) === 'Address' && (existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (r) { return r.fieldId === f.id && r.answer.type === 'Address'; }))
                                ? 'State'
                                : undefined),
            answer: {
                type: f.type,
                value: ((_p = existing_response_if_compatible(existingResponses, f)) !== null && _p !== void 0 ? _p : ((f.type === 'Insurance' || f.type === 'Address' || f.type === 'file' || f.type === 'signature' || f.type === 'multiple_choice' || f.type === 'Dropdown' || f.type === 'Table Input' || f.type === 'Database Select' || f.type === 'Medications')
                    ? undefined
                    : f.type === 'Question Group'
                        ? (_q = f.options) === null || _q === void 0 ? void 0 : _q.subFields
                        : f.type === 'ranking'
                            ? (_t = f.options) === null || _t === void 0 ? void 0 : _t.choices
                            : f.type === 'Time'
                                ? "".concat("".concat(hoursAmPm < 10 ? '0' : '').concat(hoursAmPm), ":").concat(minutes, " ").concat(amPm.toUpperCase(), " ").concat(getLocalTimezone())
                                : f.type === 'rating'
                                    ? ((((_u = f.options) === null || _u === void 0 ? void 0 : _u.default) && !isNaN(parseInt(f.options.default)))
                                        ? parseInt(f.options.default)
                                        : f.isOptional
                                            ? undefined
                                            : (((_v = f.options) === null || _v === void 0 ? void 0 : _v.from) || 1))
                                    : f.type === 'Related Contacts'
                                        ? (f.isOptional ? [] : [{ relationships: ((_x = (_w = f === null || f === void 0 ? void 0 : f.options) === null || _w === void 0 ? void 0 : _w.relatedContactTypes) === null || _x === void 0 ? void 0 : _x.length) === 1 ? [{ type: f.options.relatedContactTypes[0], id: '' }] : [] }])
                                        : '' // null flag that the response was not filled out
                )),
            },
            field: f,
        });
    })); }, [fields, existingResponses]);
    var _q = useState(initializeFields()), responses = _q[0], setResponses = _q[1];
    useEffect(function () {
        // Be very careful about refreshing data to avoid losing progress -- only in the case the selected form has changed
        if (fieldInitRef.current === formId)
            return;
        fieldInitRef.current = formId;
        setResponses(initializeFields());
    }, [formId, initializeFields]);
    // placeholders for initial files, reset when fields prop changes, since questions are now different (e.g. different form selected) 
    var fileInitRef = useRef('');
    var initializeFiles = useCallback(function () { return (fields.map(function (f) { return ({
        fieldId: f.id,
        fieldTitle: f.title,
        externalId: f.externalId,
        blob: undefined,
    }); })); }, [fields]);
    var _t = useState(initializeFiles()), selectedFiles = _t[0], setSelectedFiles = _t[1];
    useEffect(function () {
        // Be very careful about refreshing data to avoid losing progress -- only in the case the selected form has changed
        if (fileInitRef.current === formId)
            return;
        fileInitRef.current = formId;
        setSelectedFiles(initializeFiles());
    }, [formId, initializeFiles]);
    var currentValue = (responses.find(function (f) { return f.fieldId === activeField.value.id; }));
    var currentFileValue = (selectedFiles.find(function (f) { return f.fieldId === activeField.value.id; }));
    var logicOptions = {
        urlLogicValue: urlLogicValue,
        activeResponses: responses.filter(function (r) { return r.includeInSubmit; }),
        dateOfBirth: enduser === null || enduser === void 0 ? void 0 : enduser.dateOfBirth,
        gender: enduser === null || enduser === void 0 ? void 0 : enduser.gender,
        state: enduser === null || enduser === void 0 ? void 0 : enduser.state,
        form: form,
    };
    var handleDatabaseSelect = useCallback(function (databaseRecords) {
        try {
            // no need to update if there's no prepopulation
            if (!(fields === null || fields === void 0 ? void 0 : fields.find(function (f) { var _a, _b; return ((_a = f.prepopulateFromDatabase) === null || _a === void 0 ? void 0 : _a.databaseId) && ((_b = f.prepopulateFromDatabase) === null || _b === void 0 ? void 0 : _b.field); })))
                return;
            setResponses(function (rs) { return rs.map(function (r) {
                var _a, _b, _c, _d, _e, _g, _h;
                var field = fields.find(function (f) { return f.id === r.fieldId; });
                // don't overwrite an existing value by default
                if (!((_a = field === null || field === void 0 ? void 0 : field.prepopulateFromDatabase) === null || _a === void 0 ? void 0 : _a.overwrite)) {
                    if (r.answer.type === 'Address') {
                        if (!object_is_empty((_b = r.answer.value) !== null && _b !== void 0 ? _b : {})) {
                            return r;
                        }
                    }
                    else if ((_c = r.answer) === null || _c === void 0 ? void 0 : _c.value) {
                        return r;
                    }
                }
                if (!(((_d = field === null || field === void 0 ? void 0 : field.prepopulateFromDatabase) === null || _d === void 0 ? void 0 : _d.databaseId)
                    && ((_e = field === null || field === void 0 ? void 0 : field.prepopulateFromDatabase) === null || _e === void 0 ? void 0 : _e.field))) {
                    return r;
                }
                var databaseValues = (databaseRecords
                    .map(function (r) { return ((r.values || []).find(function (v) {
                    var _a, _b, _c;
                    return (v.label === ((_a = field.prepopulateFromDatabase) === null || _a === void 0 ? void 0 : _a.field)
                        && ((_b = databaseRecords[0]) === null || _b === void 0 ? void 0 : _b.databaseId) === ((_c = field.prepopulateFromDatabase) === null || _c === void 0 ? void 0 : _c.databaseId));
                })); })
                    .filter(function (v) { return v; }));
                if (databaseValues.length === 0)
                    return r;
                var stringValues = [];
                for (var _i = 0, databaseValues_1 = databaseValues; _i < databaseValues_1.length; _i++) {
                    var databaseValue = databaseValues_1[_i];
                    if (databaseValue.type === 'Address') {
                        if (r.answer.type !== 'Address')
                            return r;
                        return __assign(__assign({}, r), { answer: __assign(__assign({}, r.answer), { value: __assign(__assign({}, databaseValue.value), { addressLineOne: ((_g = databaseValue.value) === null || _g === void 0 ? void 0 : _g.lineOne) || '', addressLineTwo: ((_h = databaseValue.value) === null || _h === void 0 ? void 0 : _h.lineTwo) || '' }) }) });
                    }
                    if (r.answer.type === 'string' || r.answer.type === 'stringLong') {
                        if ((databaseValue.type === 'Text' || databaseValue.type === 'Text Long')
                            && databaseValue.value) {
                            stringValues.push(databaseValue.value);
                        }
                        if (databaseValue.type === 'Number' && typeof databaseValue.value === 'number') {
                            stringValues.push((databaseValue.value || '').toString());
                        }
                        if (databaseValue.type === 'Multiple Select' || databaseValue.type === 'Text List') {
                            if ((databaseValue.value || []).length) {
                                stringValues.push((databaseValue.value || []).join(", "));
                            }
                        }
                    }
                }
                if (stringValues.length && (r.answer.type === 'string' || r.answer.type === 'stringLong')) {
                    return __assign(__assign({}, r), { answer: __assign(__assign({}, r.answer), { value: stringValues.join(' \n\n') }) });
                }
                return r;
            }); });
        }
        catch (err) {
            console.error(err);
        }
    }, [fields]);
    var updateInclusion = useCallback(function (includeInSubmit) {
        setResponses(function (rs) {
            var current = rs.find(function (r) { return r.fieldId === (currentValue === null || currentValue === void 0 ? void 0 : currentValue.fieldId); });
            if (!current)
                return rs;
            return (__spreadArray(__spreadArray([], rs.filter(function (r) { return r.fieldId !== current.fieldId; }), true), [
                __assign(__assign({}, current), { includeInSubmit: includeInSubmit })
            ], false));
        });
    }, [currentValue]);
    useEffect(function () {
        if (currentValue === null || currentValue === void 0 ? void 0 : currentValue.includeInSubmit)
            return;
        updateInclusion(true);
    }, [updateInclusion, currentValue]);
    var validateBasicField = useCallback(function (field) {
        var _a, _b, _c, _d, _e, _g, _h, _j, _k, _l, _m, _o, _p, _q, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39;
        var value = responses.find(function (r) { return r.fieldId === field.id; });
        var file = selectedFiles.find(function (r) { return r.fieldId === field.id; });
        if (!value)
            return "Value not provided";
        if (!file)
            return "File not provided";
        // if question is in group, and question is hidden in group, don't validate
        if (field.isInGroup
            && field.groupShowCondition && !object_is_empty(field.groupShowCondition)
            && !responses_satisfy_conditions(responses, field.groupShowCondition, logicOptions)) {
            return null;
        }
        if (((_a = value.answer) === null || _a === void 0 ? void 0 : _a.type) === 'Rich Text' && ((_c = (_b = value.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.trim()) === '<p></p>' && !field.isOptional) {
            return "Answer is required";
        }
        if (value.answer.type === 'Insurance') {
            if (((_e = (_d = value.answer.value) === null || _d === void 0 ? void 0 : _d.relationshipDetails) === null || _e === void 0 ? void 0 : _e.dateOfBirth) && !isDateString(value.answer.value.relationshipDetails.dateOfBirth)) {
                return "Enter date of birth in MM-DD-YYYY format";
            }
            if (field.isOptional)
                return null;
            if (!((_g = value.answer.value) === null || _g === void 0 ? void 0 : _g.payerName)) {
                return "Insurer is required";
            }
            if (!((_h = value.answer.value) === null || _h === void 0 ? void 0 : _h.memberId)) {
                return "Member ID is required";
            }
            // assumes Self by default when left blank
            if (((_j = value.answer.value) === null || _j === void 0 ? void 0 : _j.relationship) && ((_k = value.answer.value) === null || _k === void 0 ? void 0 : _k.relationship) !== 'Self' && !((_m = (_l = value.answer.value) === null || _l === void 0 ? void 0 : _l.relationshipDetails) === null || _m === void 0 ? void 0 : _m.fname)) {
                return "First name is required";
            }
            if (((_o = value.answer.value) === null || _o === void 0 ? void 0 : _o.relationship) && ((_p = value.answer.value) === null || _p === void 0 ? void 0 : _p.relationship) !== 'Self' && !((_t = (_q = value.answer.value) === null || _q === void 0 ? void 0 : _q.relationshipDetails) === null || _t === void 0 ? void 0 : _t.lname)) {
                return "Last name is required";
            }
            if (((_u = value.answer.value) === null || _u === void 0 ? void 0 : _u.relationship) && ((_v = value.answer.value) === null || _v === void 0 ? void 0 : _v.relationship) !== 'Self' && !((_x = (_w = value.answer.value) === null || _w === void 0 ? void 0 : _w.relationshipDetails) === null || _x === void 0 ? void 0 : _x.gender)) {
                return "Gender is required";
            }
            if (((_y = value.answer.value) === null || _y === void 0 ? void 0 : _y.relationship) && ((_z = value.answer.value) === null || _z === void 0 ? void 0 : _z.relationship) !== 'Self' && !((_1 = (_0 = value.answer.value) === null || _0 === void 0 ? void 0 : _0.relationshipDetails) === null || _1 === void 0 ? void 0 : _1.dateOfBirth)) {
                return "Date of birth is required";
            }
        }
        // even when optional, name is required when signed is checked
        if (value.answer.type === 'signature' && ((_2 = value.answer.value) === null || _2 === void 0 ? void 0 : _2.signed) && !value.answer.value.fullName) {
            return "Please enter your full name";
        }
        // event when optional, phone should be valid phone number if partially entered
        if (value.answer.type === 'phone') {
            if (field.isOptional && !value.answer.value)
                return null;
            try {
                phoneValidator.validate()(value.answer.value);
            }
            catch (err) {
                return (_3 = err === null || err === void 0 ? void 0 : err.message) !== null && _3 !== void 0 ? _3 : "Enter a valid phone number";
            }
        }
        if (field.type === 'description')
            return null;
        if (field.type === 'string' || field.type === 'stringLong' || field.type === 'number') {
            if (((_4 = field.options) === null || _4 === void 0 ? void 0 : _4.maxLength) && field.options.maxLength !== -1) {
                if (((_5 = value.answer.value) !== null && _5 !== void 0 ? _5 : '').toString().length > field.options.maxLength) {
                    return "Answer must be no more than ".concat(field.options.maxLength, " characters");
                }
            }
            if (((_6 = field.options) === null || _6 === void 0 ? void 0 : _6.minLength) && field.options.minLength !== -1) {
                // allow optional when min length is greater than 0, only show error when value is entered
                if (field.isOptional && !value.answer.value)
                    return null;
                if (((_7 = value.answer.value) !== null && _7 !== void 0 ? _7 : '').toString().length < field.options.minLength) {
                    return "Answer must be at least ".concat(field.options.minLength, " characters");
                }
            }
            if (((_8 = field.options) === null || _8 === void 0 ? void 0 : _8.repeat) && (!field.isOptional || value.answer.value || repeats[field.id])) {
                if (value.answer.value !== repeats[field.id]) {
                    return "Answers must match";
                }
            }
            if (value.answer.type === 'string' && (value.answer.value || '').length >= 5000) {
                return "Must be under 5000 characters, got ".concat((_9 = value.answer.value) === null || _9 === void 0 ? void 0 : _9.length);
            }
            if (value.answer.type === 'stringLong' && (value.answer.value || '').length >= 20000) {
                return "Must be under 20000 characters, got ".concat((_10 = value.answer.value) === null || _10 === void 0 ? void 0 : _10.length);
            }
        }
        if (value.answer.type === 'number' && value.answer.value) {
            if (((_12 = (_11 = field.options) === null || _11 === void 0 ? void 0 : _11.min) !== null && _12 !== void 0 ? _12 : -Infinity) >= value.answer.value) {
                return "Must be greater than ".concat((_13 = field.options) === null || _13 === void 0 ? void 0 : _13.min);
            }
            if (((_15 = (_14 = field.options) === null || _14 === void 0 ? void 0 : _14.max) !== null && _15 !== void 0 ? _15 : Infinity) <= value.answer.value) {
                return "Must be less than ".concat((_16 = field.options) === null || _16 === void 0 ? void 0 : _16.max);
            }
        }
        if (field.isOptional || (sessionType === 'user' && field.type === 'Appointment Booking' && !enduserId)) {
            return null;
        }
        if (value.answer.type === 'Height') {
            if (typeof ((_17 = value.answer.value) === null || _17 === void 0 ? void 0 : _17.feet) !== 'number' || isNaN((_18 = value.answer.value) === null || _18 === void 0 ? void 0 : _18.feet)) {
                return "Feet must be provided";
            }
            if (typeof ((_19 = value.answer.value) === null || _19 === void 0 ? void 0 : _19.inches) !== 'number' || isNaN((_20 = value.answer.value) === null || _20 === void 0 ? void 0 : _20.inches)) {
                return "Inches must be provided (enter 0 for no inches)";
            }
        }
        if (value.answer.type === 'Related Contacts') {
            for (var i = 0; i < ((_21 = value.answer.value) !== null && _21 !== void 0 ? _21 : []).length; i++) {
                var contact = value.answer.value[i];
                var errorMessage = contact_is_valid(contact);
                if (errorMessage) {
                    return "Contact ".concat(i + 1, ": ").concat(errorMessage);
                }
                if (Object.values(contact).every(function (v) { return !v; })) {
                    return "Contact ".concat(i + 1, ": At least one field is required");
                }
            }
        }
        if (value.answer.type === 'Medications') {
            if (!((_23 = (_22 = value.answer) === null || _22 === void 0 ? void 0 : _22.value) === null || _23 === void 0 ? void 0 : _23.length)) {
                return "At least one medication is required";
            }
            for (var _i = 0, _40 = (_24 = value.answer.value) !== null && _24 !== void 0 ? _24 : []; _i < _40.length; _i++) {
                var m = _40[_i];
                if (!(m.drugName || m.otherDrug)) {
                    return "A drug selection is required for each medication";
                }
            }
        }
        // remaining are required, non-empty
        if (field.type === 'file' || field.type === 'files') {
            if (!((_25 = file.blobs) === null || _25 === void 0 ? void 0 : _25.length)) {
                return "A file is required";
            }
            if (typeof ((_26 = field.options) === null || _26 === void 0 ? void 0 : _26.min) === 'number' && file.blobs.length < field.options.min) {
                return "At least ".concat((_27 = field.options) === null || _27 === void 0 ? void 0 : _27.min, " file(s) are required");
            }
            if (typeof ((_28 = field.options) === null || _28 === void 0 ? void 0 : _28.max) === 'number' && file.blobs.length > field.options.max) {
                return "At most ".concat((_29 = field.options) === null || _29 === void 0 ? void 0 : _29.max, " file(s) are allowed");
            }
            return null; // no need to check against other stuff
        }
        // remaining can refer to currentValue, not currentFileValue
        // don't treat 0 as missing
        if ((value.answer.type === 'number' || value.answer.type === 'rating')
            && typeof value.answer.value === 'number' && !isNaN(value.answer.value)) {
            return;
        }
        if (value.answer.type === 'Hidden Value')
            return;
        if (!value.answer.value) {
            return "A response is required";
        }
        // remaining values exist and need to be validated by type
        if (value.answer.type === 'Address') {
            var stateOnly = (_31 = (_30 = field.options) === null || _30 === void 0 ? void 0 : _30.addressFields) === null || _31 === void 0 ? void 0 : _31.includes('state');
            if (!value.answer.value.addressLineOne && !stateOnly) {
                return "Address Line 1 is required";
            }
            if (!value.answer.value.city && !stateOnly) {
                return "City is required";
            }
            if (!value.answer.value.state) {
                return "State is required";
            }
            if (!value.answer.value.zipCode && !stateOnly) {
                return "ZIP code is required";
            }
            if (!isZIPString((_32 = value.answer.value) === null || _32 === void 0 ? void 0 : _32.zipCode) && !stateOnly) {
                return "Enter a valid ZIP code";
            }
            if (!((_33 = value.answer.value) === null || _33 === void 0 ? void 0 : _33.zipPlusFour) && field.fullZIP && !stateOnly) {
                return "ZIP+4 is required";
            }
            if (((_34 = value.answer.value) === null || _34 === void 0 ? void 0 : _34.zipPlusFour) && !stateOnly) {
                var zipPlus4 = ((_35 = value.answer.value) === null || _35 === void 0 ? void 0 : _35.zipPlusFour) || '';
                if (zipPlus4.length !== 4 || !/\d{4}$/.test(zipPlus4)) {
                    return "ZIP+4 must be 4 digits";
                }
            }
        }
        // string type is validated by being non-empty, file is already validated
        if (value.answer.type === 'email') {
            if (!isEmail(value.answer.value)) {
                return "Enter a valid email";
            }
        }
        else if (value.answer.type === 'Table Input') {
            var rowNumber = 0;
            for (var _41 = 0, _42 = value.answer.value || []; _41 < _42.length; _41++) {
                var row = _42[_41];
                rowNumber++;
                for (var _43 = 0, row_1 = row; _43 < row_1.length; _43++) {
                    var cell = row_1[_43];
                    if (!cell.entry) {
                        return "Enter a value for ".concat(cell.label, " in row ").concat(rowNumber);
                    }
                }
            }
        }
        else if (value.answer.type === 'dateString') {
            if (!isDateString(value.answer.value)) {
                return "Enter a date in MM-DD-YYYY format";
            }
        }
        else if (value.answer.type === 'multiple_choice' || value.answer.type === 'Dropdown') {
            if (value.answer.value.length === 0) {
                return "A value must be ".concat(value.answer.type === 'multiple_choice' ? 'checked' : 'selected');
            }
        }
        else if (value.answer.type === 'number') {
            if (typeof value.answer.value !== 'number') {
                return "Please enter a number";
            }
        }
        else if (value.answer.type === 'rating') {
            if ((((_36 = field === null || field === void 0 ? void 0 : field.options) === null || _36 === void 0 ? void 0 : _36.from) && value.answer.value < field.options.from)
                || ((_37 = field === null || field === void 0 ? void 0 : field.options) === null || _37 === void 0 ? void 0 : _37.to) && value.answer.value > field.options.to) {
                return "Please enter a number between ".concat((_38 = field === null || field === void 0 ? void 0 : field.options) === null || _38 === void 0 ? void 0 : _38.from, " and ").concat((_39 = field === null || field === void 0 ? void 0 : field.options) === null || _39 === void 0 ? void 0 : _39.to);
            }
        }
        else if (value.answer.type === 'signature') {
            if (!value.answer.value.fullName) {
                return "Please enter your full name";
            }
            if (!value.answer.value.signed) {
                return "Please accept the terms of this signature";
            }
        }
        return null;
    }, [responses, selectedFiles, currentValue, activeField, repeats, sessionType, logicOptions]);
    // nested Question Group fields are disabled, so it's safe to avoid recursion multiple times
    var validateField = useCallback(function (field) {
        var _a, _b, _c, _d, _e, _g, _h, _j;
        var value = responses.find(function (r) { return r.fieldId === field.id; });
        if (!value)
            return "Value is missing";
        if (value.answer.type === 'Question Group') {
            var _loop_6 = function (f) {
                var match = fields.find(function (_f) { return _f.id === f.id; });
                if (!match)
                    return "continue";
                var message_1 = validateBasicField(match);
                if (message_1)
                    return { value: message_1 };
            };
            for (var _i = 0, _k = (_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.subFields) !== null && _b !== void 0 ? _b : []; _i < _k.length; _i++) {
                var f = _k[_i];
                var state_4 = _loop_6(f);
                if (typeof state_4 === "object")
                    return state_4.value;
            }
        }
        var message = validateBasicField(field);
        if (message)
            return message;
        if (value.answer.type === 'Table Input') {
            for (var _l = 0, _m = (_c = value.answer.value) !== null && _c !== void 0 ? _c : []; _l < _m.length; _l++) {
                var row = _m[_l];
                var _loop_7 = function (cell) {
                    var type = (_g = (_e = (_d = field.options) === null || _d === void 0 ? void 0 : _d.tableChoices) === null || _e === void 0 ? void 0 : _e.find(function (t) { return t.label === cell.label; })) === null || _g === void 0 ? void 0 : _g.type;
                    if (type === 'Date' && !isDateString(cell.entry)) {
                        return { value: "Enter a date in MM-DD-YYYY format for ".concat(cell.label, " in row ").concat(((_j = (_h = value.answer.value) === null || _h === void 0 ? void 0 : _h.indexOf(row)) !== null && _j !== void 0 ? _j : 0) + 1) };
                    }
                };
                for (var _o = 0, row_2 = row; _o < row_2.length; _o++) {
                    var cell = row_2[_o];
                    var state_5 = _loop_7(cell);
                    if (typeof state_5 === "object")
                        return state_5.value;
                }
            }
        }
    }, [responses, fields, validateBasicField]);
    var validateCurrentField = function () { return validateField(activeField.value); };
    var validateResponsesForFields = useCallback(function (_fields) {
        if (_fields === void 0) { _fields = fields; }
        for (var _i = 0, _fields_1 = _fields; _i < _fields_1.length; _i++) {
            var f = _fields_1[_i];
            var errorMessage = validateField(f);
            if (errorMessage)
                return errorMessage;
        }
    }, [validateField, fields, responses]);
    var nextField = (!currentValue ? undefined
        : (getNextField(activeField, currentValue, responses, logicOptions)));
    var showSubmit = activeField.children.length === 0 || !nextField;
    var getResponsesWithQuestionGroupAnswers = useCallback(function (responsesToSubmit) {
        // ensure Question Group responses are included
        var _a, _b;
        for (var _i = 0, responsesToSubmit_1 = responsesToSubmit; _i < responsesToSubmit_1.length; _i++) {
            var r = responsesToSubmit_1[_i];
            if (((_a = r === null || r === void 0 ? void 0 : r.answer) === null || _a === void 0 ? void 0 : _a.type) !== 'Question Group')
                continue;
            var _loop_8 = function (f) {
                var match = responses.find(function (r) { return r.fieldId === (f === null || f === void 0 ? void 0 : f.id); });
                if (!match || responsesToSubmit.find(function (r) { return r.fieldId === match.fieldId; }))
                    return "continue";
                responsesToSubmit.push(match);
            };
            for (var _c = 0, _d = (_b = r.answer.value) !== null && _b !== void 0 ? _b : []; _c < _d.length; _c++) {
                var f = _d[_c];
                _loop_8(f);
            }
        }
        return responsesToSubmit;
    }, [responses]);
    var handleFileUpload = useCallback(function (blob, fieldId) { return __awaiter(void 0, void 0, void 0, function () {
        var responseIndex, result, secureName;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    responseIndex = responses.findIndex(function (f) { return f.fieldId === fieldId; });
                    result = { name: blob.name, secureName: '' };
                    return [4 /*yield*/, handleUpload({
                            name: blob.name,
                            size: blob.size,
                            type: blob.type,
                            enduserId: enduserId,
                        }, blob)];
                case 1:
                    secureName = (_c.sent()).secureName;
                    if (responses[responseIndex].answer.type === 'files') {
                        if (!responses[responseIndex].answer.value) {
                            responses[responseIndex].answer.value = [];
                        }
                        responses[responseIndex].answer.value.push(__assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_a = result.name) !== null && _a !== void 0 ? _a : '' }));
                    }
                    else {
                        responses[responseIndex].answer.value = __assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_b = result.name) !== null && _b !== void 0 ? _b : '' });
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [responses, handleUpload]);
    var submit = useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var hasFile, _loop_9, _i, selectedFiles_1, blobInfo, err_1, responsesToSubmit_3, _a, responsesToSubmit_2, r, _loop_10, _b, _c, f, errors, _d, _e, eId, _g, formResponse, nextFormGroupPublicURL, _h, _j, _k, err_2, err_3;
        var _l;
        var _m, _o, _p, _q, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        return __generator(this, function (_4) {
            switch (_4.label) {
                case 0:
                    setSubmitErrorMessage('');
                    hasFile = selectedFiles.find(function (f) { var _a; return !!((_a = f.blobs) === null || _a === void 0 ? void 0 : _a.length); }) !== undefined;
                    setSubmittingStatus(hasFile ? 'submitting' : 'uploading-files');
                    if (!hasFile) return [3 /*break*/, 8];
                    _4.label = 1;
                case 1:
                    _4.trys.push([1, 6, 7, 8]);
                    _loop_9 = function (blobInfo) {
                        var blobs, fieldId, responseIndex, response, _5, blobs_1, blob;
                        return __generator(this, function (_6) {
                            switch (_6.label) {
                                case 0:
                                    blobs = blobInfo.blobs, fieldId = blobInfo.fieldId;
                                    if (!blobs)
                                        return [2 /*return*/, "continue"];
                                    responseIndex = responses.findIndex(function (f) { return f.fieldId === fieldId; });
                                    response = responses[responseIndex];
                                    if ((_o = (_m = response.field) === null || _m === void 0 ? void 0 : _m.options) === null || _o === void 0 ? void 0 : _o.autoUploadFiles) {
                                        return [2 /*return*/, "continue"];
                                    } // must have uploaded prior to submission
                                    _5 = 0, blobs_1 = blobs;
                                    _6.label = 1;
                                case 1:
                                    if (!(_5 < blobs_1.length)) return [3 /*break*/, 4];
                                    blob = blobs_1[_5];
                                    return [4 /*yield*/, handleFileUpload(blob, fieldId)];
                                case 2:
                                    _6.sent();
                                    _6.label = 3;
                                case 3:
                                    _5++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, selectedFiles_1 = selectedFiles;
                    _4.label = 2;
                case 2:
                    if (!(_i < selectedFiles_1.length)) return [3 /*break*/, 5];
                    blobInfo = selectedFiles_1[_i];
                    return [5 /*yield**/, _loop_9(blobInfo)];
                case 3:
                    _4.sent();
                    _4.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    setSubmittingStatus("submitting");
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _4.sent();
                    console.error(err_1);
                    setSubmitErrorMessage((_p = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _p !== void 0 ? _p : 'Failed to upload file');
                    return [3 /*break*/, 8];
                case 7:
                    setSubmittingStatus(undefined);
                    return [7 /*endfinally*/];
                case 8:
                    (_q = options === null || options === void 0 ? void 0 : options.onFileUploadsDone) === null || _q === void 0 ? void 0 : _q.call(options);
                    if (!accessCode && session.type === 'enduser')
                        throw new Error('enduser session without accessCode');
                    _4.label = 9;
                case 9:
                    _4.trys.push([9, 18, 19, 20]);
                    responsesToSubmit_3 = ((options === null || options === void 0 ? void 0 : options.includedFieldIds)
                        ? options.includedFieldIds.map(function (id) { return responses.find(function (r) { return r.fieldId === id; }); })
                        : responses.filter(function (r) { return r.includeInSubmit; }));
                    // ensure Question Group responses are included
                    // see getResponsesWithQuestionGroupAnswers
                    for (_a = 0, responsesToSubmit_2 = responsesToSubmit_3; _a < responsesToSubmit_2.length; _a++) {
                        r = responsesToSubmit_2[_a];
                        if (r.answer.type !== 'Question Group')
                            continue;
                        _loop_10 = function (f) {
                            var match = responses.find(function (r) { return r.fieldId === (f === null || f === void 0 ? void 0 : f.id); });
                            if (!match || responsesToSubmit_3.find(function (r) { return r.fieldId === match.fieldId; }))
                                return "continue";
                            // hidden in group by conditional logic
                            if ((match.field.groupShowCondition && !object_is_empty(match.field.groupShowCondition)
                                && !responses_satisfy_conditions(responses, match.field.groupShowCondition, logicOptions)))
                                return "continue";
                            responsesToSubmit_3.push(match);
                        };
                        for (_b = 0, _c = (_t = r.answer.value) !== null && _t !== void 0 ? _t : []; _b < _c.length; _b++) {
                            f = _c[_b];
                            _loop_10(f);
                        }
                    }
                    errors = [];
                    _d = 0, _e = __spreadArray([enduserId], ((_u = options === null || options === void 0 ? void 0 : options.otherEnduserIds) !== null && _u !== void 0 ? _u : []), true);
                    _4.label = 10;
                case 10:
                    if (!(_d < _e.length)) return [3 /*break*/, 17];
                    eId = _e[_d];
                    _4.label = 11;
                case 11:
                    _4.trys.push([11, 15, , 16]);
                    update_local_storage('redirecting_public_group', '');
                    _j = (_h = session.api.form_responses).submit_form_response;
                    _l = {};
                    _k = accessCode;
                    if (_k) return [3 /*break*/, 13];
                    return [4 /*yield*/, session.api.form_responses.prepare_form_response({
                            formId: formId,
                            enduserId: eId,
                            isInternalNote: isInternalNote,
                            title: formTitle,
                            parentResponseId: parentResponseId,
                            rootResponseId: rootResponseId,
                            carePlanId: carePlanId,
                            context: context,
                            calendarEventId: calendarEventId,
                        })];
                case 12:
                    _k = (_4.sent()).accessCode;
                    _4.label = 13;
                case 13: return [4 /*yield*/, _j.apply(_h, [(_l.accessCode = (_k),
                            _l.responses = __spreadArray(__spreadArray([], responsesToSubmit_3, true), (existingResponses !== null && existingResponses !== void 0 ? existingResponses : []).filter(function (r) {
                                return !responsesToSubmit_3.find(function (_r) { return r.fieldId === _r.fieldId; })
                                    // but don't include responses which were populated from a patient field and not a prior response
                                    // if these are edited, they would be included in responsesToSubmit
                                    && !r.isPrepopulatedFromEnduserField;
                            }), true),
                            _l.automationStepId = automationStepId,
                            _l.customerId = customerId,
                            _l.productIds = responsesToSubmit_3.flatMap(function (r) { var _a, _b, _c; return (_c = (_b = (_a = r.field) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.productIds) !== null && _c !== void 0 ? _c : []; }),
                            _l.utm = get_utm_params(),
                            _l)])
                    // do actual redirect later to prevent popup
                ];
                case 14:
                    _g = _4.sent(), formResponse = _g.formResponse, nextFormGroupPublicURL = _g.nextFormGroupPublicURL;
                    // do actual redirect later to prevent popup
                    if (isPublicForm && nextFormGroupPublicURL) {
                        update_local_storage('redirecting_public_group', 'true');
                    }
                    if (!((_v = options === null || options === void 0 ? void 0 : options.otherEnduserIds) === null || _v === void 0 ? void 0 : _v.length)) { // only track for signle submission
                        if (ga4measurementId) {
                            ReactGA.event({
                                category: "form_".concat(formResponse.formId),
                                action: "Form Submitted",
                                label: "Form Submitted",
                                transport: "beacon",
                                value: 2,
                            });
                        }
                        updateLocalFormResponse(formResponse.id, formResponse);
                        (_w = options === null || options === void 0 ? void 0 : options.onPreRedirect) === null || _w === void 0 ? void 0 : _w.call(options); // in case redirect on success
                        (_x = options === null || options === void 0 ? void 0 : options.onSuccess) === null || _x === void 0 ? void 0 : _x.call(options, formResponse);
                    }
                    else {
                        if (eId === options.otherEnduserIds[options.otherEnduserIds.length - 1]) {
                            updateLocalFormResponse(formResponse.id, formResponse);
                            (_y = options === null || options === void 0 ? void 0 : options.onPreRedirect) === null || _y === void 0 ? void 0 : _y.call(options); // in case redirect on success
                            (_z = options === null || options === void 0 ? void 0 : options.onSuccess) === null || _z === void 0 ? void 0 : _z.call(options, formResponse);
                        }
                    }
                    if (isPublicForm && nextFormGroupPublicURL) {
                        window.location.href = nextFormGroupPublicURL;
                    }
                    return [3 /*break*/, 16];
                case 15:
                    err_2 = _4.sent();
                    if (options === null || options === void 0 ? void 0 : options.onBulkErrors) { // only track for signle submission
                        errors.push({ enduserId: eId, message: (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || (err_2 === null || err_2 === void 0 ? void 0 : err_2.toString()) });
                    }
                    return [3 /*break*/, 16];
                case 16:
                    _d++;
                    return [3 /*break*/, 10];
                case 17:
                    if (errors.length) {
                        (_0 = options === null || options === void 0 ? void 0 : options.onBulkErrors) === null || _0 === void 0 ? void 0 : _0.call(options, errors);
                    }
                    if (goBackURL) {
                        ((_1 = window === null || window === void 0 ? void 0 : window.top) !== null && _1 !== void 0 ? _1 : window).location.href = append_current_utm_params(goBackURL);
                    }
                    if (submitRedirectURL) {
                        ((_2 = window === null || window === void 0 ? void 0 : window.top) !== null && _2 !== void 0 ? _2 : window).location.href = append_current_utm_params(submitRedirectURL);
                    }
                    return [3 /*break*/, 20];
                case 18:
                    err_3 = _4.sent();
                    console.error(err_3);
                    setSubmitErrorMessage((_3 = err_3 === null || err_3 === void 0 ? void 0 : err_3.message) !== null && _3 !== void 0 ? _3 : 'An error occurred');
                    return [3 /*break*/, 20];
                case 19:
                    setSubmittingStatus(undefined);
                    return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    }); }, [accessCode, automationStepId, enduserId, responses, selectedFiles, session, handleUpload, existingResponses, ga4measurementId, rootResponseId, parentResponseId, calendarEventId, goBackURL, logicOptions, handleFileUpload]);
    var isNextDisabled = useCallback(function () {
        if (uploadingFiles.length) {
            return true;
        }
        if (activeField.children.length === 0) {
            return true;
        }
        if (validateField(activeField.value)) {
            return true;
        }
        return false;
    }, [activeField, validateField, uploadingFiles]);
    var autoAdvanceRef = useRef(false);
    // don't make option, to avoid user passing invalid data, like an onclick event
    var goToNextField = useCallback(function (answer) {
        var _a, _b, _c;
        if (!currentValue)
            return;
        if (isNextDisabled() && (currentValue === null || currentValue === void 0 ? void 0 : currentValue.answer.type) !== 'Hidden Value')
            return;
        if (currentValue.answer.type === 'Question Group') {
            var responsesToSave = ((((_a = currentValue.field.options) === null || _a === void 0 ? void 0 : _a.subFields) || [])
                .map(function (_a) {
                var id = _a.id;
                return responses.find(function (f) { return f.fieldId === id; });
            })
                .filter(function (f) { return f && (f === null || f === void 0 ? void 0 : f.answer.type) !== 'file' && (f === null || f === void 0 ? void 0 : f.answer.type) !== 'files'; }));
            if (responsesToSave.length) {
                session.api.form_responses.save_field_response({
                    accessCode: accessCode,
                    formResponseId: formResponseId,
                    responses: responsesToSave,
                })
                    .catch(console.error);
            }
        }
        else if (((_b = currentValue === null || currentValue === void 0 ? void 0 : currentValue.answer) === null || _b === void 0 ? void 0 : _b.type) !== 'file' && ((_c = currentValue === null || currentValue === void 0 ? void 0 : currentValue.answer) === null || _c === void 0 ? void 0 : _c.type) !== 'files' && (formResponseId || accessCode)) {
            session.api.form_responses.save_field_response({
                accessCode: accessCode,
                formResponseId: formResponseId,
                response: __assign(__assign({}, currentValue), { answer: answer || currentValue.answer }),
            })
                .catch(console.error);
        }
        try {
            window.scrollTo({ top: 0 });
        }
        catch (err) { } // scroll to top if needed
        setActiveField(function (activeField) {
            var newField = getNextField(activeField, currentValue, responses, logicOptions);
            // when autoadvancing, prevent adding duplicates by checking whether already on stack
            if (newField !== undefined && !prevFieldStackRef.current.find(function (v) { return v.value.id === (activeField === null || activeField === void 0 ? void 0 : activeField.value.id); })) {
                prevFieldStackRef.current.push(activeField);
                setCurrentPageIndex(function (i) { return i + 1; });
            }
            return newField || activeField;
        });
    }, [prevFieldStackRef, currentValue, isNextDisabled, updateFormResponse, session, responses, logicOptions]);
    useEffect(function () {
        if (dontAutoadvance)
            return;
        if (!autoAdvanceRef.current)
            return;
        autoAdvanceRef.current = false;
        // add slight delay so it's obvious which answer was selected before proceeding
        var t = setTimeout(goToNextField, 250);
        return function () { clearTimeout(t); };
    }, [responses, goToNextField, dontAutoadvance]);
    var isPreviousDisabled = useCallback(function () {
        var _a, _b;
        return (prevFieldStackRef.current.length === 0
            || ((_b = (_a = activeField === null || activeField === void 0 ? void 0 : activeField.value) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.disableGoBack) === true);
    }, [prevFieldStackRef, (_c = (_b = activeField === null || activeField === void 0 ? void 0 : activeField.value) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.disableGoBack]);
    var goToPreviousField = useCallback(function () {
        if (isPreviousDisabled())
            return;
        updateInclusion(false);
        var previous = prevFieldStackRef.current.pop();
        if (previous) {
            try {
                window.scrollTo({ top: 0 });
            }
            catch (err) { } // scroll to top if needed
            setActiveField(previous);
            setCurrentPageIndex(function (i) { return i - 1; });
        }
    }, [isPreviousDisabled, updateInclusion, prevFieldStackRef]);
    var onFieldChange = useCallback(function (value, fieldId, touched) {
        var _a;
        if (touched === void 0) { touched = true; }
        var field = fields.find(function (f) { return f.id === fieldId; });
        if (((_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a.autoAdvance) && field_can_autoadvance(field)) {
            autoAdvanceRef.current = true;
        }
        setResponses(function (rs) { return rs.map(function (r) {
            var _a;
            return r.fieldId !== fieldId ? r : (__assign(__assign({}, r), { touched: touched, isCalledOut: shouldCallout(fields === null || fields === void 0 ? void 0 : fields.find(function (f) { return (f === null || f === void 0 ? void 0 : f.id) === fieldId; }), value), isHighlightedOnTimeline: (_a = fields === null || fields === void 0 ? void 0 : fields.find(function (f) { return (f === null || f === void 0 ? void 0 : f.id) === fieldId; })) === null || _a === void 0 ? void 0 : _a.highlightOnTimeline, answer: __assign(__assign({}, r.answer), { value: value }), 
                // keep consistent with initialize existing responses
                computedValueKey: ((field === null || field === void 0 ? void 0 : field.intakeField) === 'height'
                    ? 'Height'
                    : (field === null || field === void 0 ? void 0 : field.intakeField) === 'weight' && typeof value === 'number'
                        ? 'Weight'
                        : (field === null || field === void 0 ? void 0 : field.intakeField) === 'dateOfBirth' && r.answer.type === 'dateString'
                            ? 'Date of Birth'
                            : (field === null || field === void 0 ? void 0 : field.intakeField) === 'gender' && (r.answer.type === 'Dropdown' || r.answer.type === 'multiple_choice')
                                ? 'Gender'
                                : (field === null || field === void 0 ? void 0 : field.intakeField) === 'Address' && r.answer.type === 'Address'
                                    ? 'State'
                                    : undefined) }));
        }); });
        // ensure stripe payment is stored as saved immediately
        var saveField = fields.find(function (f) { return f.id === fieldId && (f.type === 'Stripe' || f.type === 'Appointment Booking'); });
        if (saveField && typeof value === 'string' && (formResponseId || accessCode)) {
            session.api.form_responses.save_field_response({
                accessCode: accessCode,
                formResponseId: formResponseId,
                response: {
                    answer: {
                        type: saveField.type,
                        value: value,
                    },
                    fieldId: saveField.id,
                    fieldTitle: saveField.title,
                    externalId: saveField.externalId,
                    fieldDescription: saveField.description,
                    fieldHtmlDescription: saveField.htmlDescription,
                },
            })
                .catch(console.error);
        }
        var cbSaveField = fields.find(function (f) { return f.id === fieldId && (f.type === 'Chargebee'); });
        if (cbSaveField && typeof value === 'object' && (formResponseId || accessCode)) {
            session.api.form_responses.save_field_response({
                accessCode: accessCode,
                formResponseId: formResponseId,
                response: {
                    answer: {
                        type: cbSaveField.type,
                        value: value,
                    },
                    fieldId: cbSaveField.id,
                    fieldTitle: cbSaveField.title,
                    externalId: cbSaveField.externalId,
                    fieldDescription: cbSaveField.description,
                    fieldHtmlDescription: cbSaveField.htmlDescription,
                },
            })
                .catch(console.error);
        }
    }, [fields]);
    var onAddFile = useCallback(function (blobs, fieldId) {
        if (fieldId === void 0) { fieldId = activeField.value.id; }
        setSelectedFiles(function (fs) { return fs.map(function (f) { return f.fieldId !== fieldId ? f : (__assign(__assign({}, f), { blobs: (blobs === undefined
                ? undefined
                : Array.isArray(blobs)
                    ? blobs
                    : [blobs]) })); }); });
    }, [activeField, fields]);
    return {
        enduserId: enduserId,
        formResponseId: formResponseId,
        activeField: activeField,
        currentValue: currentValue,
        currentFileValue: currentFileValue,
        getResponsesWithQuestionGroupAnswers: getResponsesWithQuestionGroupAnswers,
        fields: fields,
        responses: responses,
        selectedFiles: selectedFiles,
        onFieldChange: onFieldChange,
        onAddFile: onAddFile,
        isNextDisabled: isNextDisabled,
        isPreviousDisabled: isPreviousDisabled,
        goToPreviousField: goToPreviousField,
        goToNextField: goToNextField,
        submit: submit,
        showSubmit: showSubmit,
        // submitDisabled,
        submitErrorMessage: submitErrorMessage,
        submittingStatus: submittingStatus,
        validateField: validateField,
        validateResponsesForFields: validateResponsesForFields,
        validateCurrentField: validateCurrentField,
        existingResponses: existingResponses,
        repeats: repeats,
        setRepeats: setRepeats,
        currentPageIndex: currentPageIndex,
        getNumberOfRemainingPages: getNumberOfRemainingPages,
        setCustomerId: setCustomerId,
        customization: customization,
        handleDatabaseSelect: handleDatabaseSelect,
        logicOptions: logicOptions,
        uploadingFiles: uploadingFiles,
        setUploadingFiles: setUploadingFiles,
        handleFileUpload: handleFileUpload,
    };
};
//# sourceMappingURL=hooks.js.map