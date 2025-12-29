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
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_account_export_data = exports.build_account_export_filename = exports.ACCOUNT_EXPORT_DATA_TYPES = void 0;
// Data types available for export
exports.ACCOUNT_EXPORT_DATA_TYPES = [
    { key: 'templates', label: 'Message Templates' },
    { key: 'forms', label: 'Forms' },
    { key: 'journeys', label: 'Journeys' },
];
var build_account_export_filename = function (orgName) {
    var sanitized = orgName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    var date = new Date().toISOString().split('T')[0];
    return "".concat(sanitized, "-config-").concat(date, ".json");
};
exports.build_account_export_filename = build_account_export_filename;
// Helper to load all pages of a resource
var load_all_pages = function (load) { return __awaiter(void 0, void 0, void 0, function () {
    var results, page;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                results = [];
                _b.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, load({
                        limit: 1000,
                        lastId: (_a = results[results.length - 1]) === null || _a === void 0 ? void 0 : _a.id,
                    })];
            case 2:
                page = _b.sent();
                results.push.apply(results, page);
                if (page.length < 1000)
                    return [3 /*break*/, 3];
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, results];
        }
    });
}); };
/**
 * Loads all account export data from the API, paginating as necessary.
 * Joins form_fields to forms and automation_steps to journeys.
 */
var load_account_export_data = function (session, options) { return __awaiter(void 0, void 0, void 0, function () {
    var selectedTypes, data, _a, _b, forms, formFields, fieldsByFormId_1, _i, formFields_1, field, existing, _c, journeys, automationSteps, stepsByJourneyId_1, _d, automationSteps_1, step, existing;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                selectedTypes = options.selectedTypes;
                data = {};
                if (!selectedTypes.includes('templates')) return [3 /*break*/, 2];
                _a = data;
                return [4 /*yield*/, load_all_pages(session.templates.getSome)];
            case 1:
                _a.templates = _e.sent();
                _e.label = 2;
            case 2:
                if (!selectedTypes.includes('forms')) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all([
                        load_all_pages(session.forms.getSome),
                        load_all_pages(session.form_fields.getSome),
                    ])
                    // Group fields by formId
                ];
            case 3:
                _b = _e.sent(), forms = _b[0], formFields = _b[1];
                fieldsByFormId_1 = new Map();
                for (_i = 0, formFields_1 = formFields; _i < formFields_1.length; _i++) {
                    field = formFields_1[_i];
                    existing = fieldsByFormId_1.get(field.formId) || [];
                    existing.push(field);
                    fieldsByFormId_1.set(field.formId, existing);
                }
                // Join fields to forms
                data.forms = forms.map(function (form) { return (__assign(__assign({}, form), { fields: fieldsByFormId_1.get(form.id) || [] })); });
                _e.label = 4;
            case 4:
                if (!selectedTypes.includes('journeys')) return [3 /*break*/, 6];
                return [4 /*yield*/, Promise.all([
                        load_all_pages(session.journeys.getSome),
                        load_all_pages(session.automation_steps.getSome),
                    ])
                    // Group steps by journeyId
                ];
            case 5:
                _c = _e.sent(), journeys = _c[0], automationSteps = _c[1];
                stepsByJourneyId_1 = new Map();
                for (_d = 0, automationSteps_1 = automationSteps; _d < automationSteps_1.length; _d++) {
                    step = automationSteps_1[_d];
                    if (!step.journeyId)
                        continue;
                    existing = stepsByJourneyId_1.get(step.journeyId) || [];
                    existing.push(step);
                    stepsByJourneyId_1.set(step.journeyId, existing);
                }
                // Join steps to journeys
                data.journeys = journeys.map(function (journey) { return (__assign(__assign({}, journey), { steps: stepsByJourneyId_1.get(journey.id) || [] })); });
                _e.label = 6;
            case 6: return [2 /*return*/, data];
        }
    });
}); };
exports.load_account_export_data = load_account_export_data;
//# sourceMappingURL=account_export.js.map