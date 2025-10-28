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
exports.TellescopeSinglePageForm = exports.Description = exports.UpdateResponse = exports.SaveDraft = exports.ThanksMessage = exports.DEFAULT_THANKS_MESSAGE = exports.TellescopeSingleQuestionFlowV2 = exports.QuestionForField = exports.TellescopeFormV2 = exports.TellescopeFormContainerV2 = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var index_1 = require("../index");
var hooks_1 = require("./hooks");
var inputs_v2_1 = require("./inputs.v2");
var constants_1 = require("@tellescope/constants");
var utilities_1 = require("@tellescope/utilities");
var material_1 = require("@mui/material");
var TellescopeFormContainerV2 = function (_a) {
    var businessId = _a.businessId, organizationIds = _a.organizationIds, props = __rest(_a, ["businessId", "organizationIds"]);
    // if context already is provided, no need to duplicate
    if (props.dontAddContext)
        return ((0, jsx_runtime_1.jsx)(TellescopeFormContainerWithThemeV2, __assign({}, props)));
    return ((0, jsx_runtime_1.jsx)(hooks_1.WithOrganizationTheme, __assign({ businessId: businessId, organizationIds: organizationIds }, { children: (0, jsx_runtime_1.jsx)(TellescopeFormContainerWithThemeV2, __assign({}, props)) })));
};
exports.TellescopeFormContainerV2 = TellescopeFormContainerV2;
var TellescopeFormContainerWithThemeV2 = function (_a) {
    var _b = _a.paperMinHeight, paperMinHeight = _b === void 0 ? 575 : _b, children = _a.children, language = _a.language, onChangeLanguage = _a.onChangeLanguage, style = _a.style, hideBg = _a.hideBg, backgroundColor = _a.backgroundColor, hideLogo = _a.hideLogo, logoHeight = _a.logoHeight, maxWidth = _a.maxWidth;
    var theme = (0, hooks_1.useOrganizationTheme)();
    // V2: No paper background by default, cleaner layout with light blue background
    // Ignore theme colors or white backgrounds - use our V2 default light blue
    var shouldUseCustomBg = backgroundColor && backgroundColor !== theme.themeColor && backgroundColor !== '#ffffff';
    var finalBgColor = shouldUseCustomBg ? backgroundColor : '#F4F3FA';
    return ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ flex: 1, column: true, alignItems: "center", style: __assign({ backgroundColor: finalBgColor, overflow: 'auto', paddingTop: window.innerWidth < 600 ? 20 : 40, paddingBottom: window.innerWidth < 600 ? 20 : 40 }, style) }, { children: (0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ flex: 1, column: true, style: __assign({ padding: window.innerWidth < 600 ? '0 12px' : '0 20px', maxWidth: maxWidth !== null && maxWidth !== void 0 ? maxWidth : 650, minWidth: 250, width: '100%', height: '100%', boxSizing: 'border-box' }, (window.innerWidth < 600 ? {
                paddingBottom: '80px' // Extra bottom padding on mobile to keep button above Safari navigation
            } : {})) }, { children: [language && onChangeLanguage &&
                    (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: { marginTop: 22 } }, { children: (0, jsx_runtime_1.jsx)(inputs_v2_1.LanguageSelect, { value: language, onChange: onChangeLanguage }) })), children] })) })));
};
var LOGO_HEIGHT = 40;
var TellescopeFormV2 = function (props) {
    var _a, _b;
    return ((0, jsx_runtime_1.jsx)(hooks_1.WithOrganizationTheme, { children: (0, jsx_runtime_1.jsx)(TellescopeFormWithContextV2, __assign({}, props, { logoHeight: (props === null || props === void 0 ? void 0 : props.logoHeight) || ((_b = (_a = props === null || props === void 0 ? void 0 : props.form) === null || _a === void 0 ? void 0 : _a.customization) === null || _b === void 0 ? void 0 : _b.logoHeight) })) }));
};
exports.TellescopeFormV2 = TellescopeFormV2;
var QuestionForField = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
    var form = _a.form, value = _a.value, field = _a.field, file = _a.file, responses = _a.responses, selectedFiles = _a.selectedFiles, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, customInputs = _a.customInputs, fields = _a.fields, validateField = _a.validateField, repeats = _a.repeats, onRepeatsChange = _a.onRepeatsChange, setCustomerId = _a.setCustomerId, handleDatabaseSelect = _a.handleDatabaseSelect, enduser = _a.enduser, goToPreviousField = _a.goToPreviousField, isPreviousDisabled = _a.isPreviousDisabled, enduserId = _a.enduserId, formResponseId = _a.formResponseId, submit = _a.submit, groupId = _a.groupId, groupInstance = _a.groupInstance, goToNextField = _a.goToNextField, spacing = _a.spacing, isSinglePage = _a.isSinglePage, rootResponseId = _a.rootResponseId, isInQuestionGroup = _a.isInQuestionGroup, logicOptions = _a.logicOptions, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload, groupFields = _a.groupFields, AddToDatabase = _a.AddToDatabase;
    var String = (_b = customInputs === null || customInputs === void 0 ? void 0 : customInputs['string']) !== null && _b !== void 0 ? _b : inputs_v2_1.StringInput;
    var StringLong = (_c = customInputs === null || customInputs === void 0 ? void 0 : customInputs['stringLong']) !== null && _c !== void 0 ? _c : inputs_v2_1.StringLongInput;
    var Email = (_d = customInputs === null || customInputs === void 0 ? void 0 : customInputs['email']) !== null && _d !== void 0 ? _d : inputs_v2_1.EmailInput;
    var Number = (_e = customInputs === null || customInputs === void 0 ? void 0 : customInputs['number']) !== null && _e !== void 0 ? _e : inputs_v2_1.NumberInput;
    var Phone = (_f = customInputs === null || customInputs === void 0 ? void 0 : customInputs['phone']) !== null && _f !== void 0 ? _f : inputs_v2_1.PhoneInput;
    var ResolvedDateInput = (_g = customInputs === null || customInputs === void 0 ? void 0 : customInputs['date']) !== null && _g !== void 0 ? _g : inputs_v2_1.DateInput;
    var Signature = (_h = customInputs === null || customInputs === void 0 ? void 0 : customInputs['signature']) !== null && _h !== void 0 ? _h : inputs_v2_1.SignatureInput;
    var MultipleChoice = (_j = customInputs === null || customInputs === void 0 ? void 0 : customInputs['multiple_choice']) !== null && _j !== void 0 ? _j : inputs_v2_1.MultipleChoiceInput;
    var Stripe = (_k = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Stripe']) !== null && _k !== void 0 ? _k : inputs_v2_1.StripeInput;
    var Chargebee = (_l = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Chargebee']) !== null && _l !== void 0 ? _l : inputs_v2_1.ChargeebeeInput;
    var File = (_m = customInputs === null || customInputs === void 0 ? void 0 : customInputs['file']) !== null && _m !== void 0 ? _m : inputs_v2_1.FileInput;
    var Files = (_o = customInputs === null || customInputs === void 0 ? void 0 : customInputs['files']) !== null && _o !== void 0 ? _o : inputs_v2_1.FilesInput;
    var Ranking = (_p = customInputs === null || customInputs === void 0 ? void 0 : customInputs['ranking']) !== null && _p !== void 0 ? _p : inputs_v2_1.RankingInput;
    var Rating = (_q = customInputs === null || customInputs === void 0 ? void 0 : customInputs['rating']) !== null && _q !== void 0 ? _q : inputs_v2_1.RatingInput;
    var Address = (_s = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Address']) !== null && _s !== void 0 ? _s : inputs_v2_1.AddressInput;
    var Time = (_t = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Time']) !== null && _t !== void 0 ? _t : inputs_v2_1.TimeInput;
    var TimeZone = (_u = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Timezone']) !== null && _u !== void 0 ? _u : inputs_v2_1.TimezoneInput;
    var Dropdown = (_v = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Dropdown']) !== null && _v !== void 0 ? _v : inputs_v2_1.DropdownInput;
    var DatabaseSelect = (_w = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Database Select']) !== null && _w !== void 0 ? _w : inputs_v2_1.DatabaseSelectInput;
    var Medications = (_x = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Medications']) !== null && _x !== void 0 ? _x : inputs_v2_1.MedicationsInput;
    var RelatedContacts = (_y = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Related Contacts']) !== null && _y !== void 0 ? _y : inputs_v2_1.RelatedContactsInput;
    var Insurance = (_z = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Insurance']) !== null && _z !== void 0 ? _z : inputs_v2_1.InsuranceInput;
    var AppointmentBooking = (_0 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Appointment Booking']) !== null && _0 !== void 0 ? _0 : inputs_v2_1.AppointmentBookingInput;
    var Height = (_1 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Height']) !== null && _1 !== void 0 ? _1 : inputs_v2_1.HeightInput;
    var Redirect = (_2 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Redirect']) !== null && _2 !== void 0 ? _2 : inputs_v2_1.RedirectInput;
    var HiddenValue = (_3 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Hidden Value']) !== null && _3 !== void 0 ? _3 : inputs_v2_1.HiddenValueInput;
    var Emotii = (_4 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Emotii']) !== null && _4 !== void 0 ? _4 : inputs_v2_1.EmotiiInput;
    var Allergies = (_5 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Allergies']) !== null && _5 !== void 0 ? _5 : inputs_v2_1.AllergiesInput;
    var Conditions = (_6 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Conditions']) !== null && _6 !== void 0 ? _6 : inputs_v2_1.ConditionsInput;
    var RichText = (_7 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Rich Text']) !== null && _7 !== void 0 ? _7 : inputs_v2_1.RichTextInput;
    var BelugaPatientPreference = (_8 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Beluga Patient Preference']) !== null && _8 !== void 0 ? _8 : inputs_v2_1.BelugaPatientPreferenceInput;
    var validationMessage = validateField(field);
    var feedback = (0, react_1.useMemo)(function () { return ((field.feedback || [])
        .filter(function (_a) {
        var display = _a.display, ifEquals = _a.ifEquals;
        return (ifEquals === value.answer.value
            || (Array.isArray(value.answer.value) && value.answer.value.includes(ifEquals)));
    })
        .map(function (v) { return v.display; })); }, [field.feedback, value]);
    if (!value)
        return null;
    if (isInQuestionGroup
        && field.groupShowCondition && !(0, utilities_1.object_is_empty)(field.groupShowCondition)
        && !(0, utilities_1.responses_satisfy_conditions)(responses, field.groupShowCondition, logicOptions)) {
        return null;
    }
    return (
    // margin leaves room for error message in Question Group
    (0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ column: true, flex: 1, style: { marginBottom: spacing !== null && spacing !== void 0 ? spacing : 25 }, id: field.id }, { children: [field.type !== 'Redirect' && field.title &&
                (0, jsx_runtime_1.jsxs)(index_1.Typography, __assign({ component: "h4", style: {
                        marginTop: 15,
                        marginBottom: 14,
                        fontSize: field.titleFontSize || (field.type === 'Question Group' ? 22 : 20),
                        fontWeight: field.type === 'Question Group' ? 'bold' : undefined,
                    } }, { children: [field.title, !(field.isOptional || field.type === 'description' || field.type === 'Question Group' || field.type === 'Insurance') ? '*' : ''] })), !field.title && (field.type === 'Question Group' || field.type === 'signature') && !((_9 = form === null || form === void 0 ? void 0 : form.customization) === null || _9 === void 0 ? void 0 : _9.hideLogo) &&
                // ensures PDF display doesn't push description into overlap with logo / title at top of form
                // also ensures spacing between logo and question group
                (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 15 } }), (0, jsx_runtime_1.jsx)(exports.Description, { field: field, style: { fontSize: 14, color: '#00000099', marginBottom: 11 } }), feedback.length > 0 &&
                (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ column: true, style: { marginBottom: 11, marginTop: 3, } }, { children: feedback.map(function (f, i) { return ((0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: "error", style: { fontSize: 20 } }, { children: f }), i)); }) })), 
            // If field has pre-populated value and is set to be disabled when pre-populated, show as underlined text
            field.disabledWhenPrepopulated && value.answer.value !== undefined && value.answer.value !== null && value.answer.value !== '' ? ((0, jsx_runtime_1.jsx)("div", __assign({ style: {
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                    width: '100%'
                } }, { children: (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: {
                        fontSize: '1rem',
                        color: 'rgba(0, 0, 0, 0.87)',
                        whiteSpace: 'pre-wrap'
                    } }, { children: (0, utilities_1.form_response_value_to_string)(value.answer.value) })) })))
                : field.type === 'file' ? ((0, jsx_runtime_1.jsx)(File, { field: field, value: (_10 = file.blobs) === null || _10 === void 0 ? void 0 : _10[0], onChange: onAddFile, form: form, existingFileName: value.answer.type === 'file'
                        ? (_11 = value.answer.value) === null || _11 === void 0 ? void 0 : _11.name
                        : '', handleFileUpload: handleFileUpload, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles }))
                    : field.type === 'files' ? ((0, jsx_runtime_1.jsx)(Files, { field: field, value: file.blobs, onChange: onAddFile, form: form, 
                        // existingFileName={
                        //   value.answer.type === 'files'
                        //     ? value.answer.value?.name
                        //     : ''
                        // } 
                        handleFileUpload: handleFileUpload, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles }))
                        : field.type === 'dateString' ? ((0, jsx_runtime_1.jsx)(inputs_v2_1.DateStringInput, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                            : field.type === 'Hidden Value' ? ((0, jsx_runtime_1.jsx)(HiddenValue, { groupFields: groupFields, isSinglePage: isSinglePage, goToNextField: goToNextField, goToPreviousField: goToPreviousField, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                : field.type === 'Address' ? ((0, jsx_runtime_1.jsx)(Address, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                    : field.type === 'Emotii' ? ((0, jsx_runtime_1.jsx)(Emotii, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                        : field.type === 'Allergies' ? ((0, jsx_runtime_1.jsx)(Allergies, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                            : field.type === 'Conditions' ? ((0, jsx_runtime_1.jsx)(Conditions, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                : field.type === 'Height' ? ((0, jsx_runtime_1.jsx)(Height, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                    : field.type === 'Redirect' ? ((0, jsx_runtime_1.jsx)(Redirect, { enduserId: enduserId, rootResponseId: rootResponseId, formResponseId: formResponseId, responses: responses, enduser: enduser, groupId: groupId, groupInsance: groupInstance, submit: submit, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                        : field.type === 'Related Contacts' ? ((0, jsx_runtime_1.jsx)(RelatedContacts, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                            : field.type === 'string' ? ((0, jsx_runtime_1.jsx)(String, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form, error: !!validationMessage && (!['A response is required', 'A value must be checked', 'A file is required', 'Enter a valid phone number', 'Insurer is required'].includes(validationMessage) || value.touched) }))
                                                                : field.type === 'Appointment Booking' ? ((0, jsx_runtime_1.jsx)(AppointmentBooking, { formResponseId: formResponseId, enduserId: enduserId, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, responses: responses, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                    : field.type === 'Stripe' ? ((0, jsx_runtime_1.jsx)(Stripe, { enduserId: enduserId, field: field, value: value.answer.value, onChange: onFieldChange, setCustomerId: setCustomerId, form: form, responses: responses, enduser: enduser }))
                                                                        : field.type === 'Chargebee' ? ((0, jsx_runtime_1.jsx)(Chargebee, { field: field, value: value.answer.value, onChange: onFieldChange, setCustomerId: setCustomerId, form: form }))
                                                                            : field.type === 'stringLong' ? ((0, jsx_runtime_1.jsx)(StringLong, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form, error: !!validationMessage && (!['A response is required', 'A value must be checked', 'A file is required', 'Enter a valid phone number', 'Insurer is required'].includes(validationMessage) || value.touched) }))
                                                                                : field.type === 'Rich Text' ? ((0, jsx_runtime_1.jsx)(RichText, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }, field.id))
                                                                                    : field.type === 'email' ? ((0, jsx_runtime_1.jsx)(Email, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form, error: !!validationMessage && (!['A response is required', 'A value must be checked', 'A file is required', 'Enter a valid phone number', 'Insurer is required'].includes(validationMessage) || value.touched) }))
                                                                                        : field.type === 'number' ? ((0, jsx_runtime_1.jsx)(Number, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form, error: !!validationMessage && (!['A response is required', 'A value must be checked', 'A file is required', 'Enter a valid phone number', 'Insurer is required'].includes(validationMessage) || value.touched) }))
                                                                                            : field.type === 'phone' ? ((0, jsx_runtime_1.jsx)(Phone, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form, error: !!validationMessage && (!['A response is required', 'A value must be checked', 'A file is required', 'Enter a valid phone number', 'Insurer is required'].includes(validationMessage) || value.touched) }))
                                                                                                : field.type === 'date' ? ((0, jsx_runtime_1.jsx)(ResolvedDateInput, { field: field, disabled: value.disabled, value: value.answer.value ? new Date(value.answer.value) : undefined, onChange: onFieldChange, form: form }))
                                                                                                    : field.type === 'signature' ? ((0, jsx_runtime_1.jsx)(Signature, { enduser: enduser, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                        : field.type === 'multiple_choice' ? ((0, jsx_runtime_1.jsx)(MultipleChoice, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                            : field.type === 'Dropdown' ? ((0, jsx_runtime_1.jsx)(Dropdown, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                : field.type === 'Database Select' ? ((0, jsx_runtime_1.jsx)(DatabaseSelect, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, onDatabaseSelect: handleDatabaseSelect, responses: responses, form: form, AddToDatabase: AddToDatabase }))
                                                                                                                    : field.type === 'Medications' ? ((0, jsx_runtime_1.jsx)(Medications, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                        : field.type === 'Beluga Patient Preference' ? ((0, jsx_runtime_1.jsx)(BelugaPatientPreference, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                            : field.type === 'Insurance' ? ((0, jsx_runtime_1.jsx)(Insurance, { field: field, value: value.answer.value, form: form, onDatabaseSelect: handleDatabaseSelect, enduser: enduser, responses: responses, onChange: function (v, fieldId) { return onFieldChange(__assign(__assign({}, v), { relationship: (v === null || v === void 0 ? void 0 : v.relationship) || 'Self' }), fieldId); } }))
                                                                                                                                : field.type === 'rating' ? ((0, jsx_runtime_1.jsx)(Rating, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                    : field.type === 'ranking' ? ((0, jsx_runtime_1.jsx)(Ranking, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                        : field.type === 'Table Input' ? ((0, jsx_runtime_1.jsx)(inputs_v2_1.TableInput, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                            : field.type === 'Timezone' ? ((0, jsx_runtime_1.jsx)(inputs_v2_1.TimezoneInput, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                : field.type === 'Time' ? ((0, jsx_runtime_1.jsx)(Time, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                    : field.type === 'Question Group' ? ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ column: true, flex: 1 }, { children: ((_13 = (_12 = field.options) === null || _12 === void 0 ? void 0 : _12.subFields) !== null && _13 !== void 0 ? _13 : []).map(function (_a, indexInGroup) {
                                                                                                                                                            var _b, _c, _d;
                                                                                                                                                            var id = _a.id;
                                                                                                                                                            var match = fields.find(function (f) { return f.id === id; });
                                                                                                                                                            if (!match)
                                                                                                                                                                return null;
                                                                                                                                                            var value = responses.find(function (r) { return r.fieldId === match.id; });
                                                                                                                                                            var file = selectedFiles.find(function (r) { return r.fieldId === match.id; });
                                                                                                                                                            if (!value)
                                                                                                                                                                return null;
                                                                                                                                                            if (!file)
                                                                                                                                                                return null;
                                                                                                                                                            return ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ flex: 1 }, { children: (0, jsx_runtime_1.jsx)(exports.QuestionForField, { groupId: groupId, groupInstance: groupInstance, customInputs: customInputs, field: match, fields: fields, handleDatabaseSelect: handleDatabaseSelect, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, form: form, formResponseId: formResponseId, rootResponseId: rootResponseId, submit: submit, repeats: repeats, onRepeatsChange: onRepeatsChange, setCustomerId: setCustomerId, value: value, file: file, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, enduserId: enduserId, spacing: (_b = field.options) === null || _b === void 0 ? void 0 : _b.groupPadding, logicOptions: logicOptions, isInQuestionGroup: true, groupFields: fields.filter(function (f) { var _a, _b; return (_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.subFields) === null || _b === void 0 ? void 0 : _b.find(function (s) { return s.id === f.id; }); }), questionGroupSize: (_d = (_c = field.options) === null || _c === void 0 ? void 0 : _c.subFields) === null || _d === void 0 ? void 0 : _d.length, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload, AddToDatabase: AddToDatabase }) }), id));
                                                                                                                                                        }) })))
                                                                                                                                                        : null, ((_14 = field.options) === null || _14 === void 0 ? void 0 : _14.repeat) && ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: { marginTop: '8px' } }, { children: field.type === 'string' ? ((0, jsx_runtime_1.jsx)(String, { field: field, label: "Repeat", value: (_15 = repeats[field.id]) !== null && _15 !== void 0 ? _15 : '', onChange: function (u) {
                        var _a;
                        return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                    }, form: form }))
                    : field.type === 'stringLong' ? ((0, jsx_runtime_1.jsx)(StringLong, { field: field, label: "Repeat", value: (_16 = repeats[field.id]) !== null && _16 !== void 0 ? _16 : '', onChange: function (u) {
                            var _a;
                            return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                        }, form: form }))
                        : field.type === 'number' ? ((0, jsx_runtime_1.jsx)(Number, { field: field, label: "Repeat", value: (_17 = repeats[field.id]) !== null && _17 !== void 0 ? _17 : '', onChange: function (u) {
                                var _a;
                                return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                            }, form: form }))
                            : null }))), field.type !== 'Question Group' &&
                (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: "error", style: { marginTop: 3, height: 10, fontSize: 14, marginBottom: -10 } }, { children: (validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required' || 'Enter a valid phone number' || 'Insurer is required')
                        ? value.touched
                            ? (0, index_1.form_display_text_for_language)(form, validationMessage)
                            : null
                        : (0, index_1.form_display_text_for_language)(form, validationMessage) }))] })));
};
exports.QuestionForField = QuestionForField;
var TellescopeSingleQuestionFlowV2 = function (_a) {
    var _b, _c, _d, _e;
    var form = _a.form, activeField = _a.activeField, currentFileValue = _a.currentFileValue, customInputs = _a.customInputs, currentValue = _a.currentValue, submitErrorMessage = _a.submitErrorMessage, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, isAutoAdvancing = _a.isAutoAdvancing, isNextDisabled = _a.isNextDisabled, isPreviousDisabled = _a.isPreviousDisabled, submit = _a.submit, showSubmit = _a.showSubmit, submittingStatus = _a.submittingStatus, validateField = _a.validateField, _f = _a.thanksMessage, thanksMessage = _f === void 0 ? "Your response was successfully recorded" : _f, htmlThanksMessage = _a.htmlThanksMessage, submitted = _a.submitted, onSuccess = _a.onSuccess, isPreview = _a.isPreview, theme = _a.theme, fields = _a.fields, responses = _a.responses, selectedFiles = _a.selectedFiles, inputStyle = _a.inputStyle, repeats = _a.repeats, setRepeats = _a.setRepeats, currentPageIndex = _a.currentPageIndex, getNumberOfRemainingPages = _a.getNumberOfRemainingPages, validateCurrentField = _a.validateCurrentField, handleDatabaseSelect = _a.handleDatabaseSelect, setCustomerId = _a.setCustomerId, customization = _a.customization, enduserId = _a.enduserId, enduser = _a.enduser, formResponseId = _a.formResponseId, groupId = _a.groupId, groupInstance = _a.groupInstance, logicOptions = _a.logicOptions, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload;
    var beforeunloadHandler = react_1.default.useCallback(function (e) {
        try {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes';
        }
        catch (err) { }
        return '';
    }, []);
    var _g = (0, react_1.useState)(false), uploading = _g[0], setUploading = _g[1];
    var _h = (0, react_1.useState)(false), autosubmitting = _h[0], setAutoSubmitting = _h[1];
    (0, react_1.useEffect)(function () {
        // ensure redirect question doesn't trip this alert
        if (activeField.value.type === 'Redirect') {
            return;
        }
        window.addEventListener('beforeunload', beforeunloadHandler);
        return function () { window.removeEventListener('beforeunload', beforeunloadHandler); };
    }, [beforeunloadHandler, activeField]);
    var handleSubmit = (0, react_1.useCallback)(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isPreview) {
                        return [2 /*return*/, onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess({})];
                    }
                    return [4 /*yield*/, submit(__assign(__assign({ onSuccess: onSuccess }, options), { onPreRedirect: function () {
                                // submission may trigger a redirect, so don't block with warning message
                                try {
                                    window.removeEventListener('beforeunload', beforeunloadHandler);
                                }
                                catch (err) { }
                            } }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [isPreview, onSuccess, submit, beforeunloadHandler]);
    var autoSubmitRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        var _a;
        if (!((_a = activeField.value.options) === null || _a === void 0 ? void 0 : _a.autoSubmit)) {
            return;
        }
        if (autoSubmitRef.current)
            return;
        if (responses.find(function (r) { return r.fieldId === activeField.value.id && (0, utilities_1.field_can_autosubmit)(activeField.value) && r.answer.value; })) {
            autoSubmitRef.current = true;
            setAutoSubmitting(true);
            handleSubmit()
                .finally(function () { return setAutoSubmitting(false); });
        }
    }, [handleSubmit, responses, activeField]);
    var validationMessage = validateField(activeField.value);
    var handleKeyPress = (0, react_1.useCallback)(function (e) {
        var _a, _b;
        if (e.key === 'Enter'
            && !(activeField.value.type === 'Dropdown' && ((_a = activeField.value.options) === null || _a === void 0 ? void 0 : _a.other) && !((_b = activeField.value.options) === null || _b === void 0 ? void 0 : _b.radio))) {
            if (activeField.value.type === 'stringLong')
                return; // 
            if (activeField.value.type === 'Question Group')
                return; // ensure enter is allowed in stringLong at end of a question group before next
            if (isNextDisabled())
                return;
            goToNextField(undefined);
        }
    }, [activeField, isNextDisabled, goToNextField, isPreviousDisabled, goToPreviousField]);
    (0, react_1.useEffect)(function () {
        window.addEventListener('keydown', handleKeyPress);
        return function () { window.removeEventListener('keydown', handleKeyPress); };
    }, [handleKeyPress]);
    var numRemainingPages = getNumberOfRemainingPages();
    // Calculate current score if real-time scoring is enabled
    var currentScores = (0, react_1.useMemo)(function () {
        var _a;
        if (!(form === null || form === void 0 ? void 0 : form.realTimeScoring) || !((_a = form.scoring) === null || _a === void 0 ? void 0 : _a.length))
            return null;
        return (0, utilities_1.calculate_form_scoring)({
            response: { responses: responses },
            form: { scoring: form.scoring }
        });
    }, [form === null || form === void 0 ? void 0 : form.realTimeScoring, form === null || form === void 0 ? void 0 : form.scoring, responses]);
    if (!(currentValue && currentFileValue))
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    // Show loading state while auto-advancing to target question
    if (isAutoAdvancing) {
        return ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ column: true, alignItems: "center", style: { minHeight: 200, justifyContent: 'center' } }, { children: [(0, jsx_runtime_1.jsx)(index_1.CircularProgress, { size: 40 }), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: { marginTop: 16, textAlign: 'center' } }, { children: "Picking up where you left off..." }))] })));
    }
    return (submitted
        ? (0, jsx_runtime_1.jsx)(exports.ThanksMessage, { htmlThanksMessage: htmlThanksMessage, thanksMessage: thanksMessage, showRestartAtEnd: customization === null || customization === void 0 ? void 0 : customization.showRestartAtEnd })
        : ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ column: true, flex: 1, style: { justifyContent: 'space-between' } }, { children: [(0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ column: true }, { children: [!(customization === null || customization === void 0 ? void 0 : customization.hideProgressBar) &&
                            (0, jsx_runtime_1.jsx)(inputs_v2_1.Progress, { numerator: currentPageIndex + (validateCurrentField() ? 0 : 1), denominator: currentPageIndex + 1 + numRemainingPages, style: { marginBottom: '20px' }, color: (_c = (_b = customization === null || customization === void 0 ? void 0 : customization.primaryColor) !== null && _b !== void 0 ? _b : theme === null || theme === void 0 ? void 0 : theme.themeColor) !== null && _c !== void 0 ? _c : '#798ED0' }), !(customization === null || customization === void 0 ? void 0 : customization.hideLogo) && ((theme === null || theme === void 0 ? void 0 : theme.logoURL)
                            ? ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ alignItems: "flex-start", style: { marginBottom: '20px' } }, { children: (0, jsx_runtime_1.jsx)("img", { src: theme.logoURL, alt: theme.name, style: { maxHeight: (customization === null || customization === void 0 ? void 0 : customization.logoHeight) || LOGO_HEIGHT, maxWidth: 225 } }) })))
                            : ((0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: { fontSize: 22, marginBottom: '20px', textAlign: 'left', fontWeight: 600 } }, { children: theme === null || theme === void 0 ? void 0 : theme.name })))), (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ column: true }, { children: (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: inputStyle }, { children: (0, jsx_runtime_1.jsx)(exports.QuestionForField, { form: form, fields: fields, field: activeField.value, submit: submit, enduserId: enduserId, formResponseId: formResponseId, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, handleDatabaseSelect: handleDatabaseSelect, setCustomerId: setCustomerId, repeats: repeats, onRepeatsChange: setRepeats, value: currentValue, file: currentFileValue, customInputs: customInputs, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, groupId: groupId, groupInstance: groupInstance, logicOptions: logicOptions, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload }) })) }))] })), (0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ flex: 1, alignItems: 'flex-end', justifyContent: "space-between", style: { gap: 10, marginTop: '20px' } }, { children: [!isPreviousDisabled() && ((0, jsx_runtime_1.jsx)(index_1.Button, __assign({ variant: "outlined", color: "secondary", disabled: isPreviousDisabled(), onClick: goToPreviousField, style: __assign(__assign({}, inputs_v2_1.defaultButtonStyles), { flex: 1 }) }, { children: (0, index_1.form_display_text_for_language)(form, "Previous") }))), uploading &&
                            (0, jsx_runtime_1.jsx)(index_1.Modal, __assign({ open: true, setOpen: function () { return undefined; } }, { children: (0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ style: {}, justifyContent: "center" }, { children: [(0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: { fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' } }, { children: "Uploading files..." })), (0, jsx_runtime_1.jsx)(index_1.CircularProgress, { size: 75, style: { marginTop: 10, marginBottom: 10 } }), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: { fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' } }, { children: "Please stay on this page until your submission is complete!" }))] })) })), showSubmit
                            ? ((0, jsx_runtime_1.jsx)(index_1.LoadingButton, { muiColor: "secondary", onClick: function () {
                                    setUploading(!!selectedFiles.find(function (r) { var _a; return !!((_a = r.blobs) === null || _a === void 0 ? void 0 : _a.length); }));
                                    return handleSubmit({ onFileUploadsDone: function () { return setUploading(false); } });
                                }, disabled: !!validationMessage || ((_e = (_d = currentValue.field) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.disableNext) === true || autosubmitting, submitText: (0, index_1.form_display_text_for_language)(form, "Submit"), submittingText: submittingStatus === 'uploading-files'
                                    ? 'Uploading files...'
                                    : "Submitting...", style: __assign(__assign({}, inputs_v2_1.defaultButtonStyles), { flex: 1 }) }))
                            : ((0, jsx_runtime_1.jsx)(index_1.Button, __assign({ variant: "contained", disabled: isNextDisabled(), onClick: function () { return goToNextField(undefined); }, color: "secondary", style: __assign(__assign({}, inputs_v2_1.defaultButtonStyles), { flex: 1 }) }, { children: (0, index_1.form_display_text_for_language)(form, "Continue") })))] })), currentScores && currentScores.length > 0 && ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: { marginTop: 10, marginBottom: 5, width: '100%' } }, { children: currentScores.map(function (score, index) {
                        var _a, _b;
                        var primaryColor = (_b = (_a = customization === null || customization === void 0 ? void 0 : customization.primaryColor) !== null && _a !== void 0 ? _a : theme === null || theme === void 0 ? void 0 : theme.themeColor) !== null && _b !== void 0 ? _b : '#798ED0';
                        return ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ style: {
                                padding: '10px 14px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: 8,
                                border: "1px solid ".concat(primaryColor, "20"),
                                marginRight: index < currentScores.length - 1 ? 12 : 0,
                                minWidth: 120,
                                flexDirection: 'column',
                                alignItems: 'center'
                            } }, { children: [(0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: {
                                        fontSize: 12,
                                        fontWeight: 'medium',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        marginBottom: 4
                                    } }, { children: score.title })), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: {
                                        fontWeight: 'bold',
                                        color: primaryColor,
                                        fontSize: 18
                                    } }, { children: score.value }))] }), index));
                    }) }))), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: "error", style: { alignText: 'center', marginTop: 3 } }, { children: submitErrorMessage }))] }))));
};
exports.TellescopeSingleQuestionFlowV2 = TellescopeSingleQuestionFlowV2;
exports.DEFAULT_THANKS_MESSAGE = "Your response was successfully recorded";
var ThanksMessage = function (_a) {
    var thanksMessage = _a.thanksMessage, htmlThanksMessage = _a.htmlThanksMessage, showRestartAtEnd = _a.showRestartAtEnd, downloadComponent = _a.downloadComponent;
    return ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ column: true }, { children: [htmlThanksMessage
                ? ((0, jsx_runtime_1.jsx)("div", { style: { textAlign: 'center' }, dangerouslySetInnerHTML: {
                        __html: (0, utilities_1.remove_script_tags)(htmlThanksMessage)
                    } })) : ((0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: { marginTop: 25, alignSelf: 'center' } }, { children: thanksMessage || exports.DEFAULT_THANKS_MESSAGE }))), (0, utilities_1.read_local_storage)('redirecting_public_group') === 'true' &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(index_1.Typography, __assign({ style: { marginTop: 25, alignSelf: 'center' } }, { children: ["Redirecting to next form... ", (0, jsx_runtime_1.jsx)(index_1.CircularProgress, { size: 20, color: "primary" })] })) }), downloadComponent &&
                (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ justifyContent: "center", style: { marginTop: 15, marginBottom: 15 } }, { children: downloadComponent })), showRestartAtEnd && window.localStorage["ts_form_url"] &&
                (0, jsx_runtime_1.jsx)(index_1.Button, __assign({ variant: "outlined", style: __assign(__assign({}, inputs_v2_1.defaultButtonStyles), { maxWidth: 200, marginTop: 25, alignSelf: 'center' }), onClick: function () { return window.location.href = window.localStorage["ts_form_url"]; } }, { children: "Submit Again" }))] })));
};
exports.ThanksMessage = ThanksMessage;
var TellescopeFormWithContextV2 = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var theme = (0, hooks_1.useOrganizationTheme)();
    // V2: Override MUI theme with customization colors
    var primaryColor = (_c = (_b = (_a = props.customization) === null || _a === void 0 ? void 0 : _a.primaryColor) !== null && _b !== void 0 ? _b : theme === null || theme === void 0 ? void 0 : theme.themeColor) !== null && _c !== void 0 ? _c : '#798ED0';
    var secondaryColor = (_f = (_e = (_d = props.customization) === null || _d === void 0 ? void 0 : _d.secondaryColor) !== null && _e !== void 0 ? _e : theme === null || theme === void 0 ? void 0 : theme.themeColorSecondary) !== null && _f !== void 0 ? _f : '#585E72';
    return ((0, jsx_runtime_1.jsx)(index_1.WithTheme, __assign({ theme: { primary: primaryColor, secondary: secondaryColor } }, { children: (0, jsx_runtime_1.jsx)(exports.TellescopeFormContainerV2, __assign({ style: props.style, dontAddContext: true, hideBg: props.hideBg || ((_h = (_g = props.form) === null || _g === void 0 ? void 0 : _g.customization) === null || _h === void 0 ? void 0 : _h.hideBg), logoHeight: props.logoHeight, backgroundColor: props.backgroundColor, hideLogo: (_j = props === null || props === void 0 ? void 0 : props.customization) === null || _j === void 0 ? void 0 : _j.hideLogo, maxWidth: (_l = (_k = props.form) === null || _k === void 0 ? void 0 : _k.customization) === null || _l === void 0 ? void 0 : _l.maxWidth }, { children: props.submitted
                ? (0, jsx_runtime_1.jsx)(exports.ThanksMessage, __assign({}, props, { showRestartAtEnd: (_m = props === null || props === void 0 ? void 0 : props.customization) === null || _m === void 0 ? void 0 : _m.showRestartAtEnd }))
                : ((0, jsx_runtime_1.jsx)(exports.TellescopeSingleQuestionFlowV2, __assign({}, props, { theme: theme }))) })) })));
};
var SaveDraft = function (_a) {
    var selectedFiles = _a.selectedFiles, enduserId = _a.enduserId, responses = _a.responses, existingResponses = _a.existingResponses, fields = _a.fields, onSuccess = _a.onSuccess, formResponseId = _a.formResponseId, includedFieldIds = _a.includedFieldIds, formId = _a.formId, style = _a.style, disabled = _a.disabled, getResponsesWithQuestionGroupAnswers = _a.getResponsesWithQuestionGroupAnswers, isInternalNote = _a.isInternalNote, formTitle = _a.formTitle, rootResponseId = _a.rootResponseId, parentResponseId = _a.parentResponseId;
    var _b = (0, index_1.useFormResponses)({ dontFetch: true }), updateFormResponse = _b[1].updateElement;
    var session = (0, index_1.useSession)();
    var handleUpload = (0, index_1.useFileUpload)({}).handleUpload;
    return ((0, jsx_runtime_1.jsx)(index_1.LoadingButton, { style: style, disabled: disabled, variant: 'outlined', onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
            var hasFile, _loop_1, _i, selectedFiles_1, blobInfo, err_1, response, _a, _b, err_2;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        hasFile = selectedFiles.find(function (f) { var _a; return !!((_a = f.blobs) === null || _a === void 0 ? void 0 : _a.length); }) !== undefined;
                        if (!hasFile) return [3 /*break*/, 8];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        _loop_1 = function (blobInfo) {
                            var blobs, fieldId, _g, blobs_1, blob, result, secureName, responseIndex;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        blobs = blobInfo.blobs, fieldId = blobInfo.fieldId;
                                        if (!blobs)
                                            return [2 /*return*/, "continue"];
                                        _g = 0, blobs_1 = blobs;
                                        _h.label = 1;
                                    case 1:
                                        if (!(_g < blobs_1.length)) return [3 /*break*/, 4];
                                        blob = blobs_1[_g];
                                        result = { name: blob.name, secureName: '' };
                                        return [4 /*yield*/, handleUpload({
                                                name: blob.name,
                                                size: blob.size,
                                                type: blob.type,
                                                enduserId: enduserId,
                                            }, blob)];
                                    case 2:
                                        secureName = (_h.sent()).secureName;
                                        responseIndex = responses.findIndex(function (f) { return f.fieldId === fieldId; });
                                        if (responses[responseIndex].answer.type === 'files') {
                                            if (!responses[responseIndex].answer.value) {
                                                responses[responseIndex].answer.value = [];
                                            }
                                            responses[responseIndex].answer.value.push(__assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_c = result.name) !== null && _c !== void 0 ? _c : '' }));
                                        }
                                        else {
                                            responses[responseIndex].answer.value = __assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_d = result.name) !== null && _d !== void 0 ? _d : '' });
                                        }
                                        _h.label = 3;
                                    case 3:
                                        _g++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, selectedFiles_1 = selectedFiles;
                        _f.label = 2;
                    case 2:
                        if (!(_i < selectedFiles_1.length)) return [3 /*break*/, 5];
                        blobInfo = selectedFiles_1[_i];
                        return [5 /*yield**/, _loop_1(blobInfo)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        err_1 = _f.sent();
                        return [3 /*break*/, 8];
                    case 7: return [7 /*endfinally*/];
                    case 8:
                        _f.trys.push([8, 13, 14, 15]);
                        _a = updateFormResponse;
                        if (!(formResponseId !== null && formResponseId !== void 0)) return [3 /*break*/, 9];
                        _b = formResponseId;
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, session.api.form_responses.prepare_form_response({ rootResponseId: rootResponseId, parentResponseId: parentResponseId, isInternalNote: isInternalNote, formId: formId, enduserId: enduserId, title: formTitle })];
                    case 10:
                        _b = (_f.sent()).response.id;
                        _f.label = 11;
                    case 11: return [4 /*yield*/, _a.apply(void 0, [(_b),
                            {
                                draftSavedAt: new Date(),
                                draftSavedBy: (_e = session === null || session === void 0 ? void 0 : session.userInfo) === null || _e === void 0 ? void 0 : _e.id,
                                responses: __spreadArray(__spreadArray([], (existingResponses !== null && existingResponses !== void 0 ? existingResponses : []).filter(function (r) { return !fields.find(function (f) { return f.id === r.fieldId; }); }), true), getResponsesWithQuestionGroupAnswers(includedFieldIds.map(function (id) { return responses.find(function (r) { return r.fieldId === id; }); })), true)
                            },
                            { replaceObjectFields: true }])];
                    case 12:
                        response = _f.sent();
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response);
                        return [3 /*break*/, 15];
                    case 13:
                        err_2 = _f.sent();
                        return [3 /*break*/, 15];
                    case 14: return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        }); }, submitText: "Save Draft", submittingText: "Saving..." }));
};
exports.SaveDraft = SaveDraft;
var UpdateResponse = function (_a) {
    var selectedFiles = _a.selectedFiles, enduserId = _a.enduserId, responses = _a.responses, onSuccess = _a.onSuccess, formResponseId = _a.formResponseId, includedFieldIds = _a.includedFieldIds, formId = _a.formId, style = _a.style, disabled = _a.disabled, getResponsesWithQuestionGroupAnswers = _a.getResponsesWithQuestionGroupAnswers, existingResponses = _a.existingResponses, fields = _a.fields;
    var _b = (0, index_1.useFormResponses)({ dontFetch: true }), updateFormResponse = _b[1].updateElement;
    var session = (0, index_1.useSession)();
    var handleUpload = (0, index_1.useFileUpload)({}).handleUpload;
    return ((0, jsx_runtime_1.jsx)(index_1.LoadingButton, { style: style, disabled: disabled, variant: 'contained', onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
            var hasFile, _loop_2, _i, selectedFiles_2, blobInfo, err_3, response, _a, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        hasFile = selectedFiles.find(function (f) { var _a; return !!((_a = f.blobs) === null || _a === void 0 ? void 0 : _a.length); }) !== undefined;
                        if (!hasFile) return [3 /*break*/, 8];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _loop_2 = function (blobInfo) {
                            var blobs, fieldId, _f, blobs_2, blob, result, secureName, responseIndex;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        blobs = blobInfo.blobs, fieldId = blobInfo.fieldId;
                                        if (!blobs)
                                            return [2 /*return*/, "continue"];
                                        _f = 0, blobs_2 = blobs;
                                        _g.label = 1;
                                    case 1:
                                        if (!(_f < blobs_2.length)) return [3 /*break*/, 4];
                                        blob = blobs_2[_f];
                                        result = { name: blob.name, secureName: '' };
                                        return [4 /*yield*/, handleUpload({
                                                name: blob.name,
                                                size: blob.size,
                                                type: blob.type,
                                                enduserId: enduserId,
                                            }, blob)];
                                    case 2:
                                        secureName = (_g.sent()).secureName;
                                        responseIndex = responses.findIndex(function (f) { return f.fieldId === fieldId; });
                                        if (responses[responseIndex].answer.type === 'files') {
                                            if (!responses[responseIndex].answer.value) {
                                                responses[responseIndex].answer.value = [];
                                            }
                                            responses[responseIndex].answer.value.push(__assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_c = result.name) !== null && _c !== void 0 ? _c : '' }));
                                        }
                                        else {
                                            responses[responseIndex].answer.value = __assign(__assign({}, result), { type: blob.type, secureName: secureName, name: (_d = result.name) !== null && _d !== void 0 ? _d : '' });
                                        }
                                        _g.label = 3;
                                    case 3:
                                        _f++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, selectedFiles_2 = selectedFiles;
                        _e.label = 2;
                    case 2:
                        if (!(_i < selectedFiles_2.length)) return [3 /*break*/, 5];
                        blobInfo = selectedFiles_2[_i];
                        return [5 /*yield**/, _loop_2(blobInfo)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        err_3 = _e.sent();
                        return [3 /*break*/, 8];
                    case 7: return [7 /*endfinally*/];
                    case 8:
                        _a = updateFormResponse;
                        if (!(formResponseId !== null && formResponseId !== void 0)) return [3 /*break*/, 9];
                        _b = formResponseId;
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, session.api.form_responses.prepare_form_response({ formId: formId, enduserId: enduserId })];
                    case 10:
                        _b = (_e.sent()).response.id;
                        _e.label = 11;
                    case 11: return [4 /*yield*/, _a.apply(void 0, [(_b),
                            {
                                responses: __spreadArray(__spreadArray([], (existingResponses !== null && existingResponses !== void 0 ? existingResponses : []).filter(function (r) { return !fields.find(function (f) { return f.id === r.fieldId; }); }), true), getResponsesWithQuestionGroupAnswers(includedFieldIds.map(function (id) { return responses.find(function (r) { return r.fieldId === id; }); })), true)
                            },
                            { replaceObjectFields: true }])];
                    case 12:
                        response = _e.sent();
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response);
                        return [2 /*return*/];
                }
            });
        }); }, submitText: "Update", submittingText: "Saving..." }));
};
exports.UpdateResponse = UpdateResponse;
var Description = function (_a) {
    var field = _a.field, _b = _a.color, color = _b === void 0 ? "primary" : _b, style = _a.style;
    if (!field.htmlDescription && field.description) {
        return ((0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: color, style: style }, { children: field.description })));
    }
    if (!field.htmlDescription)
        return null;
    return ((0, jsx_runtime_1.jsx)("span", { style: style, dangerouslySetInnerHTML: {
            __html: (0, utilities_1.remove_script_tags)(field.htmlDescription)
        } }));
};
exports.Description = Description;
var TellescopeSinglePageForm = function (_a) {
    var _b, _c, _d;
    var customInputs = _a.customInputs, submitErrorMessage = _a.submitErrorMessage, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, isNextDisabled = _a.isNextDisabled, isPreviousDisabled = _a.isPreviousDisabled, submit = _a.submit, showSubmit = _a.showSubmit, showSaveDraft = _a.showSaveDraft, submittingStatus = _a.submittingStatus, updating = _a.updating, validateField = _a.validateField, validateResponsesForFields = _a.validateResponsesForFields, formTitle = _a.formTitle, _e = _a.thanksMessage, thanksMessage = _e === void 0 ? exports.DEFAULT_THANKS_MESSAGE : _e, htmlThanksMessage = _a.htmlThanksMessage, submitted = _a.submitted, style = _a.style, onSuccess = _a.onSuccess, isPreview = _a.isPreview, fields = _a.fields, selectedFiles = _a.selectedFiles, responses = _a.responses, isInternalNote = _a.isInternalNote, existingResponses = _a.existingResponses, repeats = _a.repeats, setRepeats = _a.setRepeats, setCustomerId = _a.setCustomerId, rootResponseId = _a.rootResponseId, parentResponseId = _a.parentResponseId, handleDatabaseSelect = _a.handleDatabaseSelect, submittedAt = _a.submittedAt, updatedAt = _a.updatedAt, otherEnduserIds = _a.otherEnduserIds, onBulkErrors = _a.onBulkErrors, enduser = _a.enduser, groupId = _a.groupId, groupInstance = _a.groupInstance, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload, AddToDatabase = _a.AddToDatabase, props = __rest(_a, ["customInputs", "submitErrorMessage", "onAddFile", "onFieldChange", "goToNextField", "goToPreviousField", "isNextDisabled", "isPreviousDisabled", "submit", "showSubmit", "showSaveDraft", "submittingStatus", "updating", "validateField", "validateResponsesForFields", "formTitle", "thanksMessage", "htmlThanksMessage", "submitted", "style", "onSuccess", "isPreview", "fields", "selectedFiles", "responses", "isInternalNote", "existingResponses", "repeats", "setRepeats", "setCustomerId", "rootResponseId", "parentResponseId", "handleDatabaseSelect", "submittedAt", "updatedAt", "otherEnduserIds", "onBulkErrors", "enduser", "groupId", "groupInstance", "uploadingFiles", "setUploadingFiles", "handleFileUpload", "AddToDatabase"]);
    var list = (0, hooks_1.useListForFormFields)(fields, responses, { form: props.form, gender: enduser === null || enduser === void 0 ? void 0 : enduser.gender });
    var includedFieldIds = (Array.from(new Set(__spreadArray(__spreadArray([], list.map(function (f) { return f.id; }), true), (existingResponses !== null && existingResponses !== void 0 ? existingResponses : []).filter(function (e) { return !e.isPrepopulatedFromEnduserField; }).map(function (e) { return e.fieldId; }), true))));
    var handleSubmit = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isPreview) {
                        return [2 /*return*/, onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess({})];
                    }
                    return [4 /*yield*/, submit({
                            onSuccess: onSuccess,
                            includedFieldIds: includedFieldIds,
                            otherEnduserIds: otherEnduserIds,
                            onBulkErrors: onBulkErrors,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [isPreview, onSuccess, submit, otherEnduserIds, onBulkErrors]);
    var errors = (0, react_1.useMemo)(function () {
        var es = [];
        try {
            list.forEach(function (field) {
                var error = validateField(field);
                if (error && typeof error === 'string')
                    es.push({
                        id: field.id,
                        title: field.title,
                        error: error,
                    });
            });
        }
        catch (err) {
            console.error(err);
        }
        return es;
    }, [list, validateField]);
    var updatesDisabled = true;
    var _loop_3 = function (r) {
        var match = existingResponses === null || existingResponses === void 0 ? void 0 : existingResponses.find(function (_r) { return _r.fieldId === r.fieldId; });
        if (!match) {
            updatesDisabled = false;
            return "break";
        }
        if (!(0, utilities_1.objects_equivalent)(r.answer, match.answer)) {
            updatesDisabled = false;
            return "break";
        }
    };
    for (var _i = 0, _f = responses !== null && responses !== void 0 ? responses : []; _i < _f.length; _i++) {
        var r = _f[_i];
        var state_1 = _loop_3(r);
        if (state_1 === "break")
            break;
    }
    // Calculate current score if real-time scoring is enabled
    var currentScores = (0, react_1.useMemo)(function () {
        var _a, _b;
        if (!((_a = props.form) === null || _a === void 0 ? void 0 : _a.realTimeScoring) || !((_b = props.form.scoring) === null || _b === void 0 ? void 0 : _b.length))
            return null;
        return (0, utilities_1.calculate_form_scoring)({
            response: { responses: responses },
            form: { scoring: props.form.scoring }
        });
    }, [(_b = props.form) === null || _b === void 0 ? void 0 : _b.realTimeScoring, (_c = props.form) === null || _c === void 0 ? void 0 : _c.scoring, responses]);
    return ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ flex: 1, column: true }, { children: submitted
            ? (0, jsx_runtime_1.jsx)(exports.ThanksMessage, { htmlThanksMessage: htmlThanksMessage, thanksMessage: thanksMessage, showRestartAtEnd: (_d = props === null || props === void 0 ? void 0 : props.customization) === null || _d === void 0 ? void 0 : _d.showRestartAtEnd })
            : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [currentScores && currentScores.length > 0 && ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            borderBottom: '1px solid #e0e0e0',
                            padding: '12px 0',
                            marginBottom: '16px',
                            width: '100%',
                            justifyContent: 'center'
                        } }, { children: currentScores.map(function (score, index) { return ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ style: {
                                padding: '10px 14px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: 8,
                                border: "1px solid ".concat(constants_1.PRIMARY_HEX, "20"),
                                marginRight: index < currentScores.length - 1 ? 12 : 0,
                                minWidth: 120,
                                flexDirection: 'column',
                                alignItems: 'center'
                            } }, { children: [(0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: {
                                        fontSize: 12,
                                        fontWeight: 'medium',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        marginBottom: 4
                                    } }, { children: score.title })), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ style: {
                                        fontWeight: 'bold',
                                        color: constants_1.PRIMARY_HEX,
                                        fontSize: 18
                                    } }, { children: score.value }))] }), index)); }) }))), (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ flex: 1, justifyContent: "center", column: true, style: { marginBottom: 15 } }, { children: list.map(function (activeField) {
                            var value = responses.find(function (r) { return r.fieldId === activeField.id; });
                            var file = selectedFiles.find(function (r) { return r.fieldId === activeField.id; });
                            return ((0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ style: { marginBottom: 5 } }, { children: (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ column: true, flex: 1 }, { children: (0, jsx_runtime_1.jsx)(exports.QuestionForField, { isSinglePage: true, fields: fields, field: activeField, handleDatabaseSelect: handleDatabaseSelect, enduserId: props.enduserId, formResponseId: props.formResponseId, rootResponseId: rootResponseId, submit: submit, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, repeats: repeats, onRepeatsChange: setRepeats, setCustomerId: setCustomerId, value: value, file: file, customInputs: customInputs, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, groupId: groupId, groupInstance: groupInstance, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload, AddToDatabase: AddToDatabase }) })) }), activeField.id));
                        }) })), (0, jsx_runtime_1.jsx)(index_1.Flex, __assign({ flex: 1, wrap: "nowrap" }, { children: updating
                            ? ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ flex: 1, column: true }, { children: [(0, jsx_runtime_1.jsx)(exports.UpdateResponse, __assign({}, props, { fields: fields, existingResponses: existingResponses, includedFieldIds: includedFieldIds, 
                                        // style={{ width: 200, marginRight: 5, height: 42 }}
                                        formId: fields[0].formId, responses: responses, selectedFiles: selectedFiles, onSuccess: onSuccess, disabled: updatesDisabled })), submittedAt &&
                                        (0, jsx_runtime_1.jsxs)(index_1.Typography, __assign({ style: { marginTop: 5 } }, { children: ["Originally Submitted: ", (0, utilities_1.formatted_date)(new Date(submittedAt))] })), updatedAt &&
                                        (0, jsx_runtime_1.jsxs)(index_1.Typography, { children: ["Last Updated: ", (0, utilities_1.formatted_date)(new Date(updatedAt))] })] }))) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showSaveDraft &&
                                    (0, jsx_runtime_1.jsx)(exports.SaveDraft, __assign({ existingResponses: existingResponses, fields: fields }, props, { formTitle: formTitle, isInternalNote: isInternalNote, includedFieldIds: includedFieldIds, style: { width: 200, marginRight: 5, height: 42 }, formId: fields[0].formId, responses: responses, selectedFiles: selectedFiles, onSuccess: onSuccess, rootResponseId: rootResponseId, parentResponseId: parentResponseId })), (0, jsx_runtime_1.jsx)(index_1.LoadingButton, { onClick: handleSubmit, disabled: !!validateResponsesForFields(list), style: { height: 42, width: '100%' }, submitText: "Submit Response", submittingText: submittingStatus === 'uploading-files'
                                        ? 'Uploading files...'
                                        : "Submitting..." })] })) })), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: "error", style: { alignText: 'center', marginTop: 3 } }, { children: submitErrorMessage })), errors.length > 0 &&
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, { flexItem: true, sx: { my: 1 } }), (0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ noWrap: true, style: { width: 200 } }, { children: "Question" })), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ noWrap: true, style: {} }, { children: "Error" }))] }))] }), errors.map(function (e) { return ((0, jsx_runtime_1.jsxs)(index_1.Flex, __assign({ alignItems: "center", wrap: "nowrap" }, { children: [(0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ noWrap: true, style: { width: 200, textDecoration: 'underline', cursor: 'pointer' }, onClick: function () {
                                    var _a;
                                    try {
                                        (_a = document.getElementById(e.id)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    catch (err) {
                                        console.error(err);
                                    }
                                } }, { children: (0, utilities_1.truncate_string)(e.title, { length: 50 }) })), (0, jsx_runtime_1.jsx)(index_1.Typography, __assign({ color: "error", style: { width: 300 } }, { children: e.error }))] }), e.id)); })] })) })));
};
exports.TellescopeSinglePageForm = TellescopeSinglePageForm;
//# sourceMappingURL=forms.v2.js.map