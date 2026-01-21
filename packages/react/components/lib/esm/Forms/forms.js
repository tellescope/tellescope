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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, CircularProgress, Flex, LoadingButton, Modal, Paper, Typography, form_display_text_for_language, useFileUpload, useFormResponses, useSession } from "../index";
import { useListForFormFields, useOrganizationTheme, WithOrganizationTheme } from "./hooks";
import { AddressInput, AllergiesInput, AppointmentBookingInput, BelugaPatientPreferenceInput, BridgeEligibilityInput, ChargeebeeInput, ConditionsInput, DatabaseSelectInput, DateInput, DateStringInput, DropdownInput, EmailInput, EmotiiInput, FileInput, FilesInput, HeightInput, HiddenValueInput, InsuranceInput, LanguageSelect, MedicationsInput, MultipleChoiceInput, NumberInput, PharmacySearchInput, PhoneInput, Progress, RankingInput, RatingInput, RedirectInput, RelatedContactsInput, RichTextInput, SignatureInput, StringInput, StringLongInput, StripeInput, TableInput, TimeInput, TimezoneInput, defaultButtonStyles } from "./inputs";
import { PRIMARY_HEX } from "@tellescope/constants";
import { calculate_form_scoring, field_can_autosubmit, form_response_value_to_string, formatted_date, object_is_empty, objects_equivalent, read_local_storage, remove_script_tags, responses_satisfy_conditions, truncate_string } from "@tellescope/utilities";
import { Divider } from "@mui/material";
export var TellescopeFormContainer = function (_a) {
    var businessId = _a.businessId, organizationIds = _a.organizationIds, props = __rest(_a, ["businessId", "organizationIds"]);
    // if context already is provided, no need to duplicate
    if (props.dontAddContext)
        return (_jsx(TellescopeFormContainerWithTheme, __assign({}, props)));
    return (_jsx(WithOrganizationTheme, __assign({ businessId: businessId, organizationIds: organizationIds }, { children: _jsx(TellescopeFormContainerWithTheme, __assign({}, props)) })));
};
var TellescopeFormContainerWithTheme = function (_a) {
    var _b;
    var _c = _a.paperMinHeight, paperMinHeight = _c === void 0 ? 575 : _c, children = _a.children, language = _a.language, onChangeLanguage = _a.onChangeLanguage, style = _a.style, hideBg = _a.hideBg, backgroundColor = _a.backgroundColor, hideLogo = _a.hideLogo, logoHeight = _a.logoHeight, maxWidth = _a.maxWidth;
    var theme = useOrganizationTheme();
    var formContent = (_jsxs(Flex, __assign({ flex: 1, column: true }, { children: [hideLogo
                ? null
                : theme.logoURL
                    ? (_jsxs(Flex, __assign({ alignItems: "center", justifyContent: "center", style: { height: logoHeight || LOGO_HEIGHT, marginTop: 10 } }, { children: [_jsx("img", { src: theme.logoURL, alt: theme.name, style: { height: logoHeight || LOGO_HEIGHT, maxWidth: 225 } }), " "] })))
                    : (_jsx(Typography, __assign({ style: { fontSize: 22, marginTop: 10, textAlign: 'center', fontWeight: 600 } }, { children: theme.name }))), language && onChangeLanguage &&
                _jsx(Flex, __assign({ style: { marginTop: 22 } }, { children: _jsx(LanguageSelect, { value: language, onChange: onChangeLanguage }) })), children] })));
    if (hideBg) {
        return (_jsx(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "center", style: style }, { children: _jsx(Flex, __assign({ flex: 1, style: { padding: 20, maxWidth: maxWidth !== null && maxWidth !== void 0 ? maxWidth : 650, minWidth: 250, minHeight: 475 } }, { children: formContent })) })));
    }
    return (_jsx(Flex, __assign({ flex: 1, alignItems: "center", justifyContent: "center", style: __assign({ backgroundColor: (_b = backgroundColor !== null && backgroundColor !== void 0 ? backgroundColor : theme.themeColor) !== null && _b !== void 0 ? _b : '#ffffff' }, style) }, { children: _jsx(Paper, __assign({ flex: true, elevation: 3, style: { marginTop: 50, marginBottom: 50, padding: 20, maxWidth: maxWidth !== null && maxWidth !== void 0 ? maxWidth : 650, minWidth: 250, minHeight: paperMinHeight } }, { children: formContent })) })));
};
var LOGO_HEIGHT = 40;
export var TellescopeForm = function (props) {
    var _a, _b;
    return (_jsx(WithOrganizationTheme, { children: _jsx(TellescopeFormWithContext, __assign({}, props, { logoHeight: (props === null || props === void 0 ? void 0 : props.logoHeight) || ((_b = (_a = props === null || props === void 0 ? void 0 : props.form) === null || _a === void 0 ? void 0 : _a.customization) === null || _b === void 0 ? void 0 : _b.logoHeight) })) }));
};
export var QuestionForField = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    var form = _a.form, value = _a.value, field = _a.field, file = _a.file, responses = _a.responses, selectedFiles = _a.selectedFiles, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, customInputs = _a.customInputs, fields = _a.fields, validateField = _a.validateField, repeats = _a.repeats, onRepeatsChange = _a.onRepeatsChange, setCustomerId = _a.setCustomerId, handleDatabaseSelect = _a.handleDatabaseSelect, enduser = _a.enduser, goToPreviousField = _a.goToPreviousField, isPreviousDisabled = _a.isPreviousDisabled, enduserId = _a.enduserId, formResponseId = _a.formResponseId, submit = _a.submit, groupId = _a.groupId, groupInstance = _a.groupInstance, goToNextField = _a.goToNextField, spacing = _a.spacing, isSinglePage = _a.isSinglePage, rootResponseId = _a.rootResponseId, isInQuestionGroup = _a.isInQuestionGroup, logicOptions = _a.logicOptions, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload, groupFields = _a.groupFields, AddToDatabase = _a.AddToDatabase;
    var String = (_b = customInputs === null || customInputs === void 0 ? void 0 : customInputs['string']) !== null && _b !== void 0 ? _b : StringInput;
    var StringLong = (_c = customInputs === null || customInputs === void 0 ? void 0 : customInputs['stringLong']) !== null && _c !== void 0 ? _c : StringLongInput;
    var Email = (_d = customInputs === null || customInputs === void 0 ? void 0 : customInputs['email']) !== null && _d !== void 0 ? _d : EmailInput;
    var Number = (_e = customInputs === null || customInputs === void 0 ? void 0 : customInputs['number']) !== null && _e !== void 0 ? _e : NumberInput;
    var Phone = (_f = customInputs === null || customInputs === void 0 ? void 0 : customInputs['phone']) !== null && _f !== void 0 ? _f : PhoneInput;
    var ResolvedDateInput = (_g = customInputs === null || customInputs === void 0 ? void 0 : customInputs['date']) !== null && _g !== void 0 ? _g : DateInput;
    var Signature = (_h = customInputs === null || customInputs === void 0 ? void 0 : customInputs['signature']) !== null && _h !== void 0 ? _h : SignatureInput;
    var MultipleChoice = (_j = customInputs === null || customInputs === void 0 ? void 0 : customInputs['multiple_choice']) !== null && _j !== void 0 ? _j : MultipleChoiceInput;
    var Stripe = (_k = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Stripe']) !== null && _k !== void 0 ? _k : StripeInput;
    var Chargebee = (_l = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Chargebee']) !== null && _l !== void 0 ? _l : ChargeebeeInput;
    var File = (_m = customInputs === null || customInputs === void 0 ? void 0 : customInputs['file']) !== null && _m !== void 0 ? _m : FileInput;
    var Files = (_o = customInputs === null || customInputs === void 0 ? void 0 : customInputs['files']) !== null && _o !== void 0 ? _o : FilesInput;
    var Ranking = (_p = customInputs === null || customInputs === void 0 ? void 0 : customInputs['ranking']) !== null && _p !== void 0 ? _p : RankingInput;
    var Rating = (_q = customInputs === null || customInputs === void 0 ? void 0 : customInputs['rating']) !== null && _q !== void 0 ? _q : RatingInput;
    var Address = (_s = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Address']) !== null && _s !== void 0 ? _s : AddressInput;
    var Time = (_t = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Time']) !== null && _t !== void 0 ? _t : TimeInput;
    var TimeZone = (_u = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Timezone']) !== null && _u !== void 0 ? _u : TimezoneInput;
    var Dropdown = (_v = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Dropdown']) !== null && _v !== void 0 ? _v : DropdownInput;
    var DatabaseSelect = (_w = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Database Select']) !== null && _w !== void 0 ? _w : DatabaseSelectInput;
    var Medications = (_x = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Medications']) !== null && _x !== void 0 ? _x : MedicationsInput;
    var RelatedContacts = (_y = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Related Contacts']) !== null && _y !== void 0 ? _y : RelatedContactsInput;
    var Insurance = (_z = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Insurance']) !== null && _z !== void 0 ? _z : InsuranceInput;
    var BridgeEligibility = (_0 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Bridge Eligibility']) !== null && _0 !== void 0 ? _0 : BridgeEligibilityInput;
    var AppointmentBooking = (_1 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Appointment Booking']) !== null && _1 !== void 0 ? _1 : AppointmentBookingInput;
    var Height = (_2 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Height']) !== null && _2 !== void 0 ? _2 : HeightInput;
    var Redirect = (_3 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Redirect']) !== null && _3 !== void 0 ? _3 : RedirectInput;
    var HiddenValue = (_4 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Hidden Value']) !== null && _4 !== void 0 ? _4 : HiddenValueInput;
    var Emotii = (_5 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Emotii']) !== null && _5 !== void 0 ? _5 : EmotiiInput;
    var Allergies = (_6 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Allergies']) !== null && _6 !== void 0 ? _6 : AllergiesInput;
    var Conditions = (_7 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Conditions']) !== null && _7 !== void 0 ? _7 : ConditionsInput;
    var RichText = (_8 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Rich Text']) !== null && _8 !== void 0 ? _8 : RichTextInput;
    var BelugaPatientPreference = (_9 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Beluga Patient Preference']) !== null && _9 !== void 0 ? _9 : BelugaPatientPreferenceInput;
    var PharmacySearch = (_10 = customInputs === null || customInputs === void 0 ? void 0 : customInputs['Pharmacy Search']) !== null && _10 !== void 0 ? _10 : PharmacySearchInput;
    var validationMessage = validateField(field);
    var feedback = useMemo(function () { return ((field.feedback || [])
        .filter(function (_a) {
        var display = _a.display, ifEquals = _a.ifEquals;
        return (ifEquals === value.answer.value
            || (Array.isArray(value.answer.value) && value.answer.value.includes(ifEquals)));
    })
        .map(function (v) { return v.display; })); }, [field.feedback, value]);
    if (!value)
        return null;
    if (isInQuestionGroup
        && field.groupShowCondition && !object_is_empty(field.groupShowCondition)
        && !responses_satisfy_conditions(responses, field.groupShowCondition, logicOptions)) {
        return null;
    }
    return (
    // margin leaves room for error message in Question Group
    _jsxs(Flex, __assign({ column: true, flex: 1, style: { marginBottom: spacing !== null && spacing !== void 0 ? spacing : 25 }, id: field.id }, { children: [field.type !== 'Redirect' && field.title &&
                _jsxs(Typography, __assign({ component: "h4", style: {
                        marginTop: 15,
                        fontSize: field.titleFontSize || (field.type === 'Question Group' ? 22 : 20),
                        fontWeight: field.type === 'Question Group' ? 'bold' : undefined,
                    } }, { children: [field.title, !(field.isOptional || field.type === 'description' || field.type === 'Question Group' || field.type === 'Insurance' || field.type === 'Bridge Eligibility') ? '*' : ''] })), !field.title && (field.type === 'Question Group' || field.type === 'signature') && !((_11 = form === null || form === void 0 ? void 0 : form.customization) === null || _11 === void 0 ? void 0 : _11.hideLogo) &&
                // ensures PDF display doesn't push description into overlap with logo / title at top of form
                // also ensures spacing between logo and question group
                _jsx("div", { style: { marginTop: 15 } }), _jsx(Description, { field: field, style: { fontSize: 16 } }), feedback.length > 0 &&
                _jsx(Flex, __assign({ column: true, style: { marginBottom: 11, marginTop: 3, } }, { children: feedback.map(function (f, i) { return (_jsx(Typography, __assign({ color: "error", style: { fontSize: 20 } }, { children: f }), i)); }) })), 
            // If field has pre-populated value and is set to be disabled when pre-populated, show as underlined text
            field.disabledWhenPrepopulated && value.answer.value !== undefined && value.answer.value !== null && value.answer.value !== '' ? (_jsx("div", __assign({ style: {
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                    width: '100%'
                } }, { children: _jsx(Typography, __assign({ style: {
                        fontSize: '1rem',
                        color: 'rgba(0, 0, 0, 0.87)',
                        whiteSpace: 'pre-wrap'
                    } }, { children: form_response_value_to_string(value.answer.value) })) })))
                : field.type === 'file' ? (_jsx(File, { field: field, value: (_12 = file.blobs) === null || _12 === void 0 ? void 0 : _12[0], onChange: onAddFile, form: form, existingFileName: value.answer.type === 'file'
                        ? (_13 = value.answer.value) === null || _13 === void 0 ? void 0 : _13.name
                        : '', handleFileUpload: handleFileUpload, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles }))
                    : field.type === 'files' ? (_jsx(Files, { field: field, value: file.blobs, onChange: onAddFile, form: form, 
                        // existingFileName={
                        //   value.answer.type === 'files'
                        //     ? value.answer.value?.name
                        //     : ''
                        // } 
                        handleFileUpload: handleFileUpload, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles }))
                        : field.type === 'dateString' ? (_jsx(DateStringInput, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                            : field.type === 'Hidden Value' ? (_jsx(HiddenValue, { groupFields: groupFields, isSinglePage: isSinglePage, goToNextField: goToNextField, goToPreviousField: goToPreviousField, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                : field.type === 'Address' ? (_jsx(Address, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                    : field.type === 'Emotii' ? (_jsx(Emotii, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                        : field.type === 'Allergies' ? (_jsx(Allergies, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                            : field.type === 'Conditions' ? (_jsx(Conditions, { enduser: enduser, enduserId: enduserId, field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                : field.type === 'Height' ? (_jsx(Height, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                    : field.type === 'Redirect' ? (_jsx(Redirect, { enduserId: enduserId, rootResponseId: rootResponseId, formResponseId: formResponseId, responses: responses, enduser: enduser, groupId: groupId, groupInsance: groupInstance, submit: submit, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                        : field.type === 'Related Contacts' ? (_jsx(RelatedContacts, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                            : field.type === 'string' ? (_jsx(String, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                : field.type === 'Appointment Booking' ? (_jsx(AppointmentBooking, { formResponseId: formResponseId, enduserId: enduserId, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, responses: responses, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                    : field.type === 'Stripe' ? (_jsx(Stripe, { enduserId: enduserId, field: field, value: value.answer.value, onChange: onFieldChange, setCustomerId: setCustomerId, form: form, responses: responses, enduser: enduser }))
                                                                        : field.type === 'Chargebee' ? (_jsx(Chargebee, { field: field, value: value.answer.value, onChange: onFieldChange, setCustomerId: setCustomerId, form: form }))
                                                                            : field.type === 'stringLong' ? (_jsx(StringLong, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                : field.type === 'Rich Text' ? (_jsx(RichText, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }, field.id))
                                                                                    : field.type === 'email' ? (_jsx(Email, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                        : field.type === 'number' ? (_jsx(Number, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                            : field.type === 'phone' ? (_jsx(Phone, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                : field.type === 'date' ? (_jsx(ResolvedDateInput, { field: field, disabled: value.disabled, value: value.answer.value ? new Date(value.answer.value) : undefined, onChange: onFieldChange, form: form }))
                                                                                                    : field.type === 'signature' ? (_jsx(Signature, { enduser: enduser, field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                        : field.type === 'multiple_choice' ? (_jsx(MultipleChoice, { field: field, value: value.answer.value, onChange: onFieldChange, form: form, responses: responses, enduser: enduser }))
                                                                                                            : field.type === 'Dropdown' ? (_jsx(Dropdown, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                : field.type === 'Database Select' ? (_jsx(DatabaseSelect, { field: field, disabled: value.disabled, value: value.answer.value, onChange: onFieldChange, onDatabaseSelect: handleDatabaseSelect, responses: responses, form: form, AddToDatabase: AddToDatabase }))
                                                                                                                    : field.type === 'Medications' ? (_jsx(Medications, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                        : field.type === 'Beluga Patient Preference' ? (_jsx(BelugaPatientPreference, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                            : field.type === 'Insurance' ? (_jsx(Insurance, { field: field, value: value.answer.value, form: form, onDatabaseSelect: handleDatabaseSelect, enduser: enduser, responses: responses, onChange: function (v, fieldId) { return onFieldChange(__assign(__assign({}, v), { relationship: (v === null || v === void 0 ? void 0 : v.relationship) || 'Self' }), fieldId); } }))
                                                                                                                                : field.type === 'Bridge Eligibility' ? (_jsx(BridgeEligibility, { field: field, value: value.answer.value, form: form, enduser: enduser, responses: responses, enduserId: enduserId, onChange: onFieldChange }))
                                                                                                                                    : field.type === 'Pharmacy Search' ? (_jsx(PharmacySearch, { field: field, value: value.answer.value, form: form, enduser: enduser, responses: responses, onChange: onFieldChange }))
                                                                                                                                        : field.type === 'rating' ? (_jsx(Rating, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                            : field.type === 'ranking' ? (_jsx(Ranking, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                : field.type === 'Table Input' ? (_jsx(TableInput, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                    : field.type === 'Timezone' ? (_jsx(TimezoneInput, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                        : field.type === 'Time' ? (_jsx(Time, { field: field, value: value.answer.value, onChange: onFieldChange, form: form }))
                                                                                                                                                            : field.type === 'Question Group' ? (_jsx(Flex, __assign({ column: true, flex: 1 }, { children: ((_15 = (_14 = field.options) === null || _14 === void 0 ? void 0 : _14.subFields) !== null && _15 !== void 0 ? _15 : []).map(function (_a, indexInGroup) {
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
                                                                                                                                                                    return (_jsx(Flex, __assign({ flex: 1 }, { children: _jsx(QuestionForField, { groupId: groupId, groupInstance: groupInstance, customInputs: customInputs, field: match, fields: fields, handleDatabaseSelect: handleDatabaseSelect, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, form: form, formResponseId: formResponseId, rootResponseId: rootResponseId, submit: submit, repeats: repeats, onRepeatsChange: onRepeatsChange, setCustomerId: setCustomerId, value: value, file: file, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, enduserId: enduserId, spacing: (_b = field.options) === null || _b === void 0 ? void 0 : _b.groupPadding, logicOptions: logicOptions, isInQuestionGroup: true, groupFields: fields.filter(function (f) { var _a, _b; return (_b = (_a = field.options) === null || _a === void 0 ? void 0 : _a.subFields) === null || _b === void 0 ? void 0 : _b.find(function (s) { return s.id === f.id; }); }), questionGroupSize: (_d = (_c = field.options) === null || _c === void 0 ? void 0 : _c.subFields) === null || _d === void 0 ? void 0 : _d.length, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload, AddToDatabase: AddToDatabase }) }), id));
                                                                                                                                                                }) })))
                                                                                                                                                                : null, ((_16 = field.options) === null || _16 === void 0 ? void 0 : _16.repeat) && (_jsx(Flex, __assign({ style: { marginTop: '8px' } }, { children: field.type === 'string' ? (_jsx(String, { field: field, label: "Repeat", value: (_17 = repeats[field.id]) !== null && _17 !== void 0 ? _17 : '', onChange: function (u) {
                        var _a;
                        return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                    }, form: form }))
                    : field.type === 'stringLong' ? (_jsx(StringLong, { field: field, label: "Repeat", value: (_18 = repeats[field.id]) !== null && _18 !== void 0 ? _18 : '', onChange: function (u) {
                            var _a;
                            return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                        }, form: form }))
                        : field.type === 'number' ? (_jsx(Number, { field: field, label: "Repeat", value: (_19 = repeats[field.id]) !== null && _19 !== void 0 ? _19 : '', onChange: function (u) {
                                var _a;
                                return onRepeatsChange(__assign(__assign({}, repeats), (_a = {}, _a[field.id] = u, _a)));
                            }, form: form }))
                            : null }))), field.type !== 'Question Group' &&
                _jsx(Typography, __assign({ color: "error", style: { marginTop: 3, height: 10, fontSize: 14, marginBottom: -10 } }, { children: (validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required' || 'Enter a valid phone number' || 'Insurer is required')
                        ? value.touched
                            ? form_display_text_for_language(form, validationMessage)
                            : null
                        : form_display_text_for_language(form, validationMessage) }))] })));
};
export var TellescopeSingleQuestionFlow = function (_a) {
    var _b, _c, _d;
    var form = _a.form, activeField = _a.activeField, currentFileValue = _a.currentFileValue, customInputs = _a.customInputs, currentValue = _a.currentValue, submitErrorMessage = _a.submitErrorMessage, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, isAutoAdvancing = _a.isAutoAdvancing, isNextDisabled = _a.isNextDisabled, isPreviousDisabled = _a.isPreviousDisabled, submit = _a.submit, showSubmit = _a.showSubmit, submittingStatus = _a.submittingStatus, validateField = _a.validateField, _e = _a.thanksMessage, thanksMessage = _e === void 0 ? "Your response was successfully recorded" : _e, htmlThanksMessage = _a.htmlThanksMessage, submitted = _a.submitted, onSuccess = _a.onSuccess, isPreview = _a.isPreview, theme = _a.theme, fields = _a.fields, responses = _a.responses, selectedFiles = _a.selectedFiles, inputStyle = _a.inputStyle, repeats = _a.repeats, setRepeats = _a.setRepeats, currentPageIndex = _a.currentPageIndex, getNumberOfRemainingPages = _a.getNumberOfRemainingPages, validateCurrentField = _a.validateCurrentField, handleDatabaseSelect = _a.handleDatabaseSelect, setCustomerId = _a.setCustomerId, customization = _a.customization, enduserId = _a.enduserId, enduser = _a.enduser, formResponseId = _a.formResponseId, groupId = _a.groupId, groupInstance = _a.groupInstance, logicOptions = _a.logicOptions, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload;
    var beforeunloadHandler = React.useCallback(function (e) {
        try {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes';
        }
        catch (err) { }
        return '';
    }, []);
    var _f = useState(false), uploading = _f[0], setUploading = _f[1];
    var _g = useState(false), autosubmitting = _g[0], setAutoSubmitting = _g[1];
    useEffect(function () {
        // ensure redirect question doesn't trip this alert
        if (activeField.value.type === 'Redirect') {
            return;
        }
        window.addEventListener('beforeunload', beforeunloadHandler);
        return function () { window.removeEventListener('beforeunload', beforeunloadHandler); };
    }, [beforeunloadHandler, activeField]);
    var handleSubmit = useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
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
    var autoSubmitRef = useRef(false);
    useEffect(function () {
        var _a;
        if (!((_a = activeField.value.options) === null || _a === void 0 ? void 0 : _a.autoSubmit)) {
            return;
        }
        if (autoSubmitRef.current)
            return;
        if (responses.find(function (r) { return r.fieldId === activeField.value.id && field_can_autosubmit(activeField.value) && r.answer.value; })) {
            autoSubmitRef.current = true;
            setAutoSubmitting(true);
            handleSubmit()
                .finally(function () { return setAutoSubmitting(false); });
        }
    }, [handleSubmit, responses, activeField]);
    var validationMessage = validateField(activeField.value);
    var handleKeyPress = useCallback(function (e) {
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
    useEffect(function () {
        window.addEventListener('keydown', handleKeyPress);
        return function () { window.removeEventListener('keydown', handleKeyPress); };
    }, [handleKeyPress]);
    var numRemainingPages = getNumberOfRemainingPages();
    // Calculate current score if real-time scoring is enabled
    var currentScores = useMemo(function () {
        var _a;
        if (!(form === null || form === void 0 ? void 0 : form.realTimeScoring) || !((_a = form.scoring) === null || _a === void 0 ? void 0 : _a.length))
            return null;
        return calculate_form_scoring({
            response: { responses: responses },
            form: { scoring: form.scoring }
        });
    }, [form === null || form === void 0 ? void 0 : form.realTimeScoring, form === null || form === void 0 ? void 0 : form.scoring, responses]);
    if (!(currentValue && currentFileValue))
        return _jsx(_Fragment, {});
    // Show loading state while auto-advancing to target question
    if (isAutoAdvancing) {
        return (_jsxs(Flex, __assign({ column: true, alignItems: "center", style: { minHeight: 200, justifyContent: 'center' } }, { children: [_jsx(CircularProgress, { size: 40 }), _jsx(Typography, __assign({ style: { marginTop: 16, textAlign: 'center' } }, { children: "Picking up where you left off..." }))] })));
    }
    return (submitted
        ? _jsx(ThanksMessage, { htmlThanksMessage: htmlThanksMessage, thanksMessage: thanksMessage, showRestartAtEnd: customization === null || customization === void 0 ? void 0 : customization.showRestartAtEnd })
        : (_jsxs(Flex, __assign({ column: true, flex: 1 }, { children: [_jsx(Flex, __assign({ flex: 1, justifyContent: "center", column: true }, { children: _jsx(Flex, __assign({ style: inputStyle }, { children: _jsx(QuestionForField, { form: form, fields: fields, field: activeField.value, submit: submit, enduserId: enduserId, formResponseId: formResponseId, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, handleDatabaseSelect: handleDatabaseSelect, setCustomerId: setCustomerId, repeats: repeats, onRepeatsChange: setRepeats, value: currentValue, file: currentFileValue, customInputs: customInputs, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, groupId: groupId, groupInstance: groupInstance, logicOptions: logicOptions, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload }) })) })), _jsxs(Flex, __assign({ alignItems: 'center', justifyContent: "space-between" }, { children: [!isPreviousDisabled()
                            ? (_jsx(Button, __assign({ variant: "outlined", disabled: isPreviousDisabled(), onClick: goToPreviousField, style: defaultButtonStyles }, { children: form_display_text_for_language(form, "Previous") })))
                            : _jsx(Flex, {}), uploading &&
                            _jsx(Modal, __assign({ open: true, setOpen: function () { return undefined; } }, { children: _jsxs(Flex, __assign({ style: {}, justifyContent: "center" }, { children: [_jsx(Typography, __assign({ style: { fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' } }, { children: "Uploading files..." })), _jsx(CircularProgress, { size: 75, style: { marginTop: 10, marginBottom: 10 } }), _jsx(Typography, __assign({ style: { fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' } }, { children: "Please stay on this page until your submission is complete!" }))] })) })), showSubmit
                            ? (_jsx(LoadingButton, { onClick: function () {
                                    setUploading(!!selectedFiles.find(function (r) { var _a; return !!((_a = r.blobs) === null || _a === void 0 ? void 0 : _a.length); }));
                                    return handleSubmit({ onFileUploadsDone: function () { return setUploading(false); } });
                                }, disabled: !!validationMessage || ((_c = (_b = currentValue.field) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.disableNext) === true || autosubmitting, submitText: form_display_text_for_language(form, "Submit"), submittingText: submittingStatus === 'uploading-files'
                                    ? 'Uploading files...'
                                    : "Submitting...", style: __assign(__assign({}, defaultButtonStyles), { minWidth: 150, width: '50%', maxWidth: 250 }), 
                                // @ts-ignore
                                color: (_d = theme.themeColor) !== null && _d !== void 0 ? _d : PRIMARY_HEX }))
                            : (_jsx(Button, __assign({ variant: "contained", disabled: isNextDisabled(), onClick: function () { return goToNextField(undefined); }, style: __assign(__assign({}, defaultButtonStyles), { width: 100 }) }, { children: form_display_text_for_language(form, "Next") })))] })), !(customization === null || customization === void 0 ? void 0 : customization.hideProgressBar) &&
                    _jsx(Progress, { numerator: currentPageIndex + (validateCurrentField() ? 0 : 1), denominator: currentPageIndex + 1 + numRemainingPages, style: { marginTop: '15px' } }), currentScores && currentScores.length > 0 && (_jsx(Flex, __assign({ style: { marginTop: 10, marginBottom: 5, width: '100%' } }, { children: currentScores.map(function (score, index) { return (_jsxs(Flex, __assign({ style: {
                            padding: '10px 14px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: 8,
                            border: "1px solid ".concat((theme === null || theme === void 0 ? void 0 : theme.themeColor) || PRIMARY_HEX, "20"),
                            marginRight: index < currentScores.length - 1 ? 12 : 0,
                            minWidth: 120,
                            flexDirection: 'column',
                            alignItems: 'center'
                        } }, { children: [_jsx(Typography, __assign({ style: {
                                    fontSize: 12,
                                    fontWeight: 'medium',
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                    marginBottom: 4
                                } }, { children: score.title })), _jsx(Typography, __assign({ style: {
                                    fontWeight: 'bold',
                                    color: (theme === null || theme === void 0 ? void 0 : theme.themeColor) || PRIMARY_HEX,
                                    fontSize: 18
                                } }, { children: score.value }))] }), index)); }) }))), _jsx(Typography, __assign({ color: "error", style: { alignText: 'center', marginTop: 3 } }, { children: submitErrorMessage }))] }))));
};
export var DEFAULT_THANKS_MESSAGE = "Your response was successfully recorded";
export var ThanksMessage = function (_a) {
    var thanksMessage = _a.thanksMessage, htmlThanksMessage = _a.htmlThanksMessage, showRestartAtEnd = _a.showRestartAtEnd, downloadComponent = _a.downloadComponent;
    return (_jsxs(Flex, __assign({ column: true }, { children: [htmlThanksMessage
                ? (_jsx("div", { style: { textAlign: 'center' }, dangerouslySetInnerHTML: {
                        __html: remove_script_tags(htmlThanksMessage)
                    } })) : (_jsx(Typography, __assign({ style: { marginTop: 25, alignSelf: 'center' } }, { children: thanksMessage || DEFAULT_THANKS_MESSAGE }))), read_local_storage('redirecting_public_group') === 'true' &&
                _jsx(_Fragment, { children: _jsxs(Typography, __assign({ style: { marginTop: 25, alignSelf: 'center' } }, { children: ["Redirecting to next form... ", _jsx(CircularProgress, { size: 20, color: "primary" })] })) }), downloadComponent &&
                _jsx(Flex, __assign({ justifyContent: "center", style: { marginTop: 15, marginBottom: 15 } }, { children: downloadComponent })), showRestartAtEnd && window.localStorage["ts_form_url"] &&
                _jsx(Button, __assign({ variant: "outlined", style: __assign(__assign({}, defaultButtonStyles), { maxWidth: 200, marginTop: 25, alignSelf: 'center' }), onClick: function () { return window.location.href = window.localStorage["ts_form_url"]; } }, { children: "Submit Again" }))] })));
};
var TellescopeFormWithContext = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var theme = useOrganizationTheme();
    return (_jsx(TellescopeFormContainer, __assign({ style: props.style, dontAddContext: true, hideBg: props.hideBg || ((_b = (_a = props.form) === null || _a === void 0 ? void 0 : _a.customization) === null || _b === void 0 ? void 0 : _b.hideBg), logoHeight: props.logoHeight, backgroundColor: props.backgroundColor, hideLogo: (_c = props === null || props === void 0 ? void 0 : props.customization) === null || _c === void 0 ? void 0 : _c.hideLogo, maxWidth: (_e = (_d = props.form) === null || _d === void 0 ? void 0 : _d.customization) === null || _e === void 0 ? void 0 : _e.maxWidth }, { children: props.submitted
            ? _jsx(ThanksMessage, __assign({}, props, { showRestartAtEnd: (_f = props === null || props === void 0 ? void 0 : props.customization) === null || _f === void 0 ? void 0 : _f.showRestartAtEnd }))
            : (_jsx(TellescopeSingleQuestionFlow, __assign({}, props, { theme: theme }))) })));
};
export var SaveDraft = function (_a) {
    var selectedFiles = _a.selectedFiles, enduserId = _a.enduserId, responses = _a.responses, existingResponses = _a.existingResponses, fields = _a.fields, onSuccess = _a.onSuccess, formResponseId = _a.formResponseId, includedFieldIds = _a.includedFieldIds, formId = _a.formId, style = _a.style, disabled = _a.disabled, getResponsesWithQuestionGroupAnswers = _a.getResponsesWithQuestionGroupAnswers, isInternalNote = _a.isInternalNote, formTitle = _a.formTitle, rootResponseId = _a.rootResponseId, parentResponseId = _a.parentResponseId;
    var _b = useFormResponses({ dontFetch: true }), updateFormResponse = _b[1].updateElement;
    var session = useSession();
    var handleUpload = useFileUpload({}).handleUpload;
    return (_jsx(LoadingButton, { style: style, disabled: disabled, variant: 'outlined', onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
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
export var UpdateResponse = function (_a) {
    var selectedFiles = _a.selectedFiles, enduserId = _a.enduserId, responses = _a.responses, onSuccess = _a.onSuccess, formResponseId = _a.formResponseId, includedFieldIds = _a.includedFieldIds, formId = _a.formId, style = _a.style, disabled = _a.disabled, getResponsesWithQuestionGroupAnswers = _a.getResponsesWithQuestionGroupAnswers, existingResponses = _a.existingResponses, fields = _a.fields;
    var _b = useFormResponses({ dontFetch: true }), updateFormResponse = _b[1].updateElement;
    var session = useSession();
    var handleUpload = useFileUpload({}).handleUpload;
    return (_jsx(LoadingButton, { style: style, disabled: disabled, variant: 'contained', onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
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
export var Description = function (_a) {
    var field = _a.field, _b = _a.color, color = _b === void 0 ? "primary" : _b, style = _a.style;
    if (!field.htmlDescription && field.description) {
        return (_jsx(Typography, __assign({ color: color, style: style }, { children: field.description })));
    }
    if (!field.htmlDescription)
        return null;
    return (_jsx("span", { dangerouslySetInnerHTML: {
            __html: remove_script_tags(field.htmlDescription)
        } }));
};
export var TellescopeSinglePageForm = function (_a) {
    var _b, _c, _d;
    var customInputs = _a.customInputs, submitErrorMessage = _a.submitErrorMessage, onAddFile = _a.onAddFile, onFieldChange = _a.onFieldChange, goToNextField = _a.goToNextField, goToPreviousField = _a.goToPreviousField, isNextDisabled = _a.isNextDisabled, isPreviousDisabled = _a.isPreviousDisabled, submit = _a.submit, showSubmit = _a.showSubmit, showSaveDraft = _a.showSaveDraft, submittingStatus = _a.submittingStatus, updating = _a.updating, validateField = _a.validateField, validateResponsesForFields = _a.validateResponsesForFields, formTitle = _a.formTitle, _e = _a.thanksMessage, thanksMessage = _e === void 0 ? DEFAULT_THANKS_MESSAGE : _e, htmlThanksMessage = _a.htmlThanksMessage, submitted = _a.submitted, style = _a.style, onSuccess = _a.onSuccess, isPreview = _a.isPreview, fields = _a.fields, selectedFiles = _a.selectedFiles, responses = _a.responses, isInternalNote = _a.isInternalNote, existingResponses = _a.existingResponses, repeats = _a.repeats, setRepeats = _a.setRepeats, setCustomerId = _a.setCustomerId, rootResponseId = _a.rootResponseId, parentResponseId = _a.parentResponseId, handleDatabaseSelect = _a.handleDatabaseSelect, submittedAt = _a.submittedAt, updatedAt = _a.updatedAt, otherEnduserIds = _a.otherEnduserIds, onBulkErrors = _a.onBulkErrors, enduser = _a.enduser, groupId = _a.groupId, groupInstance = _a.groupInstance, uploadingFiles = _a.uploadingFiles, setUploadingFiles = _a.setUploadingFiles, handleFileUpload = _a.handleFileUpload, AddToDatabase = _a.AddToDatabase, props = __rest(_a, ["customInputs", "submitErrorMessage", "onAddFile", "onFieldChange", "goToNextField", "goToPreviousField", "isNextDisabled", "isPreviousDisabled", "submit", "showSubmit", "showSaveDraft", "submittingStatus", "updating", "validateField", "validateResponsesForFields", "formTitle", "thanksMessage", "htmlThanksMessage", "submitted", "style", "onSuccess", "isPreview", "fields", "selectedFiles", "responses", "isInternalNote", "existingResponses", "repeats", "setRepeats", "setCustomerId", "rootResponseId", "parentResponseId", "handleDatabaseSelect", "submittedAt", "updatedAt", "otherEnduserIds", "onBulkErrors", "enduser", "groupId", "groupInstance", "uploadingFiles", "setUploadingFiles", "handleFileUpload", "AddToDatabase"]);
    var list = useListForFormFields(fields, responses, { form: props.form, gender: enduser === null || enduser === void 0 ? void 0 : enduser.gender });
    var includedFieldIds = (Array.from(new Set(__spreadArray(__spreadArray([], list.map(function (f) { return f.id; }), true), (existingResponses !== null && existingResponses !== void 0 ? existingResponses : []).filter(function (e) { return !e.isPrepopulatedFromEnduserField; }).map(function (e) { return e.fieldId; }), true))));
    var handleSubmit = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    var errors = useMemo(function () {
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
        if (!objects_equivalent(r.answer, match.answer)) {
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
    var currentScores = useMemo(function () {
        var _a, _b;
        if (!((_a = props.form) === null || _a === void 0 ? void 0 : _a.realTimeScoring) || !((_b = props.form.scoring) === null || _b === void 0 ? void 0 : _b.length))
            return null;
        return calculate_form_scoring({
            response: { responses: responses },
            form: { scoring: props.form.scoring }
        });
    }, [(_b = props.form) === null || _b === void 0 ? void 0 : _b.realTimeScoring, (_c = props.form) === null || _c === void 0 ? void 0 : _c.scoring, responses]);
    return (_jsx(Flex, __assign({ flex: 1, column: true }, { children: submitted
            ? _jsx(ThanksMessage, { htmlThanksMessage: htmlThanksMessage, thanksMessage: thanksMessage, showRestartAtEnd: (_d = props === null || props === void 0 ? void 0 : props.customization) === null || _d === void 0 ? void 0 : _d.showRestartAtEnd })
            : (_jsxs(_Fragment, { children: [currentScores && currentScores.length > 0 && (_jsx(Flex, __assign({ style: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            borderBottom: '1px solid #e0e0e0',
                            padding: '12px 0',
                            marginBottom: '16px',
                            width: '100%',
                            justifyContent: 'center'
                        } }, { children: currentScores.map(function (score, index) { return (_jsxs(Flex, __assign({ style: {
                                padding: '10px 14px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: 8,
                                border: "1px solid ".concat(PRIMARY_HEX, "20"),
                                marginRight: index < currentScores.length - 1 ? 12 : 0,
                                minWidth: 120,
                                flexDirection: 'column',
                                alignItems: 'center'
                            } }, { children: [_jsx(Typography, __assign({ style: {
                                        fontSize: 12,
                                        fontWeight: 'medium',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        marginBottom: 4
                                    } }, { children: score.title })), _jsx(Typography, __assign({ style: {
                                        fontWeight: 'bold',
                                        color: PRIMARY_HEX,
                                        fontSize: 18
                                    } }, { children: score.value }))] }), index)); }) }))), _jsx(Flex, __assign({ flex: 1, justifyContent: "center", column: true, style: { marginBottom: 15 } }, { children: list.map(function (activeField) {
                            var value = responses.find(function (r) { return r.fieldId === activeField.id; });
                            var file = selectedFiles.find(function (r) { return r.fieldId === activeField.id; });
                            return (_jsx(Flex, __assign({ style: { marginBottom: 5 } }, { children: _jsx(Flex, __assign({ column: true, flex: 1 }, { children: _jsx(QuestionForField, { isSinglePage: true, fields: fields, field: activeField, handleDatabaseSelect: handleDatabaseSelect, enduserId: props.enduserId, formResponseId: props.formResponseId, rootResponseId: rootResponseId, submit: submit, enduser: enduser, goToPreviousField: goToPreviousField, isPreviousDisabled: isPreviousDisabled, goToNextField: goToNextField, repeats: repeats, onRepeatsChange: setRepeats, setCustomerId: setCustomerId, value: value, file: file, customInputs: customInputs, onAddFile: onAddFile, onFieldChange: onFieldChange, responses: responses, selectedFiles: selectedFiles, validateField: validateField, groupId: groupId, groupInstance: groupInstance, uploadingFiles: uploadingFiles, setUploadingFiles: setUploadingFiles, handleFileUpload: handleFileUpload, AddToDatabase: AddToDatabase }) })) }), activeField.id));
                        }) })), _jsx(Flex, __assign({ flex: 1, wrap: "nowrap" }, { children: updating
                            ? (_jsxs(Flex, __assign({ flex: 1, column: true }, { children: [_jsx(UpdateResponse, __assign({}, props, { fields: fields, existingResponses: existingResponses, includedFieldIds: includedFieldIds, 
                                        // style={{ width: 200, marginRight: 5, height: 42 }}
                                        formId: fields[0].formId, responses: responses, selectedFiles: selectedFiles, onSuccess: onSuccess, disabled: updatesDisabled })), submittedAt &&
                                        _jsxs(Typography, __assign({ style: { marginTop: 5 } }, { children: ["Originally Submitted: ", formatted_date(new Date(submittedAt))] })), updatedAt &&
                                        _jsxs(Typography, { children: ["Last Updated: ", formatted_date(new Date(updatedAt))] })] }))) : (_jsxs(_Fragment, { children: [showSaveDraft &&
                                    _jsx(SaveDraft, __assign({ existingResponses: existingResponses, fields: fields }, props, { formTitle: formTitle, isInternalNote: isInternalNote, includedFieldIds: includedFieldIds, style: { width: 200, marginRight: 5, height: 42 }, formId: fields[0].formId, responses: responses, selectedFiles: selectedFiles, onSuccess: onSuccess, rootResponseId: rootResponseId, parentResponseId: parentResponseId })), _jsx(LoadingButton, { onClick: handleSubmit, disabled: !!validateResponsesForFields(list), style: { height: 42, width: '100%' }, submitText: "Submit Response", submittingText: submittingStatus === 'uploading-files'
                                        ? 'Uploading files...'
                                        : "Submitting..." })] })) })), _jsx(Typography, __assign({ color: "error", style: { alignText: 'center', marginTop: 3 } }, { children: submitErrorMessage })), errors.length > 0 &&
                        _jsxs(_Fragment, { children: [_jsx(Divider, { flexItem: true, sx: { my: 1 } }), _jsxs(Flex, __assign({ alignItems: "center", wrap: "nowrap" }, { children: [_jsx(Typography, __assign({ noWrap: true, style: { width: 200 } }, { children: "Question" })), _jsx(Typography, __assign({ noWrap: true, style: {} }, { children: "Error" }))] }))] }), errors.map(function (e) { return (_jsxs(Flex, __assign({ alignItems: "center", wrap: "nowrap" }, { children: [_jsx(Typography, __assign({ noWrap: true, style: { width: 200, textDecoration: 'underline', cursor: 'pointer' }, onClick: function () {
                                    var _a;
                                    try {
                                        (_a = document.getElementById(e.id)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    catch (err) {
                                        console.error(err);
                                    }
                                } }, { children: truncate_string(e.title, { length: 50 }) })), _jsx(Typography, __assign({ color: "error", style: { width: 300 } }, { children: e.error }))] }), e.id)); })] })) })));
};
//# sourceMappingURL=forms.js.map