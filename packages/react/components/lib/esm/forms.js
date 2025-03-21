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
import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, CircularProgress, TextField, Typography, } from "./mui";
import { Flex, Form, SUPPORTS_FORMS, WithHTMLFormContext, } from "./layout";
import { useHandleError } from "./errors";
// for help with type inference, flexibility to add modifications later
export var create_input_schema = function (o) { return o; };
export var validation_for_input_schema = function (schema) {
    var validationObject = {};
    for (var field in schema) {
        validationObject[field] = schema[field].validator;
    }
    return Yup.object(validationObject);
};
export var initial_values_for_input_schema = function (schema, dynamicallySet) {
    var _a;
    if (dynamicallySet === void 0) { dynamicallySet = {}; }
    var initial_values = {};
    for (var field in schema) {
        initial_values[field] = (_a = dynamicallySet[field]) !== null && _a !== void 0 ? _a : schema[field].initialValue;
    }
    return initial_values;
};
// formik requires string signature but will cast numbers appropriately
export var initial_values_for_formik = function (schema, dynamicallySet) {
    if (dynamicallySet === void 0) { dynamicallySet = {}; }
    return initial_values_for_input_schema(schema, dynamicallySet);
};
var stringValidation = function (o) {
    var _a, _b, _c;
    return Yup.string()
        .max((_a = o === null || o === void 0 ? void 0 : o.max) !== null && _a !== void 0 ? _a : 1000)
        .min((_b = o === null || o === void 0 ? void 0 : o.min) !== null && _b !== void 0 ? _b : 0)
        .required((_c = o === null || o === void 0 ? void 0 : o.required) !== null && _c !== void 0 ? _c : "Required");
};
export var validators = {
    firstName: stringValidation({ max: 25 }),
    lastName: stringValidation({ max: 40 }),
    email: stringValidation({ max: 1000 }).email("Invalid email address"),
    password: stringValidation({ min: 8, max: 100, })
        .matches(/[a-z]/, "Must contain a lowercase letter")
        .matches(/[A-Z]/, "Must contain an uppercase letter")
        .matches(/[0-9@#!$%^&*(){}[\];:\\|'",<.>/?]/, "Must contain a number or special character"),
};
export var emailInput = function (_a) {
    var id = _a.id, _b = _a.name, name = _b === void 0 ? id : _b, _c = _a.label, label = _c === void 0 ? id : _c, _d = _a.initialValue, initialValue = _d === void 0 ? '' : _d, _e = _a.required, required = _e === void 0 ? true : _e, _f = _a.autoComplete, autoComplete = _f === void 0 ? "username" : _f, props = __rest(_a, ["id", "name", "label", "initialValue", "required", "autoComplete"]);
    return ({
        id: id,
        name: name,
        label: label,
        initialValue: initialValue,
        validation: validators.email,
        Component: TextField,
        componentProps: __assign({ autoComplete: autoComplete, type: 'email', required: required }, props)
    });
};
export var passwordInput = function (_a) {
    var id = _a.id, _b = _a.name, name = _b === void 0 ? id : _b, _c = _a.label, label = _c === void 0 ? id : _c, _d = _a.initialValue, initialValue = _d === void 0 ? '' : _d, _e = _a.required, required = _e === void 0 ? true : _e, _f = _a.autoComplete, autoComplete = _f === void 0 ? "current-password" : _f, props = __rest(_a, ["id", "name", "label", "initialValue", "required", "autoComplete"]);
    return ({
        id: id,
        name: name,
        label: label,
        initialValue: initialValue,
        validation: validators.password,
        Component: TextField,
        componentProps: __assign({ autoComplete: autoComplete, type: 'password', required: required }, props)
    });
};
export var FormikSubmitButton = function (_a) {
    var formik = _a.formik, enabled = _a.enabled, _b = _a.disabledIfUnchanged, disabledIfUnchanged = _b === void 0 ? true : _b, disabled = _a.disabled, onClick = _a.onClick, submitText = _a.submitText, submittingText = _a.submittingText, style = _a.style, props = __rest(_a, ["formik", "enabled", "disabledIfUnchanged", "disabled", "onClick", "submitText", "submittingText", "style"]);
    return (_jsx(SubmitButton, __assign({ onClick: onClick, submitText: submitText, submittingText: submittingText, disabled: !enabled && (disabled || !formik.isValid || (disabledIfUnchanged && !formik.dirty)), style: style, submitting: formik.isSubmitting }, props)));
};
export var LoadingButton = function (_a) {
    var _b;
    var muiColor = _a.muiColor, disabled = _a.disabled, uniquenessError = _a.uniquenessError, throwOnError = _a.throwOnError, _c = _a.variant, variant = _c === void 0 ? "contained" : _c, onError = _a.onError, submitting = _a.submitting, onClick = _a.onClick, _d = _a.submitText, submitText = _d === void 0 ? "Submit" : _d, _e = _a.submittingText, submittingText = _e === void 0 ? "Submitting" : _e, type = _a.type, _f = _a.style, style = _f === void 0 ? { marginTop: 5, width: '100%' } : _f;
    var _g = useHandleError({ onError: onError, uniquenessError: uniquenessError }), errorDisplay = _g.errorDisplay, handleAPIError = _g.handleAPIError, loading = _g.loading;
    var formLoading = (_b = React.useContext(WithHTMLFormContext)) === null || _b === void 0 ? void 0 : _b.loading;
    return (_jsxs(_Fragment, { children: [_jsxs(Button, __assign({ color: muiColor || "primary", variant: variant, type: type, onClick: function () { return handleAPIError(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!onClick)
                                    return [2 /*return*/];
                                return [4 /*yield*/, onClick()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }); }, style: style, disabled: loading || submitting || disabled || formLoading }, { children: [_jsx(Typography, __assign({ component: "span" }, { children: submitting ? submittingText : submitText })), (submitting || loading) && _jsx(CircularProgress, { size: 11, style: { marginLeft: 5, marginBottom: 1 } })] })), !(onError || throwOnError) && errorDisplay] }));
};
// onClick conditionally disabled, should be child of Form in browser to ensure handleSubmit is used correctly
export var SubmitButton = function (_a) {
    var onClick = _a.onClick, props = __rest(_a, ["onClick"]);
    return (_jsx(LoadingButton, __assign({ throwOnError: true }, props, { type: "submit", onClick: SUPPORTS_FORMS ? undefined : onClick })));
};
export var FormBuilder = function (_a) {
    var fields = _a.fields, onSubmit = _a.onSubmit, onSuccess = _a.onSuccess, onError = _a.onError, style = _a.style, disabledIfUnchanged = _a.disabledIfUnchanged, options = __rest(_a, ["fields", "onSubmit", "onSuccess", "onError", "style", "disabledIfUnchanged"]);
    var _b = React.useState(''), error = _b[0], setError = _b[1];
    var validationSchema = {};
    var initialValues = {}; // todo, stricter typing 
    for (var id in fields) {
        validationSchema[id] = fields[id].validation;
        initialValues[id] = fields[id].initialValue;
    }
    return (_jsx(Formik, __assign({ initialValues: initialValues, validationSchema: Yup.object(validationSchema), onSubmit: function (v, o) { return __awaiter(void 0, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setError('');
                        o.setSubmitting(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, onSubmit(v)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        if (typeof e_1 === 'string')
                            setError(e_1);
                        else if (typeof (e_1 === null || e_1 === void 0 ? void 0 : e_1.message) === 'string')
                            setError(e_1.message);
                        else
                            setError("An error occurred");
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                        onError === null || onError === void 0 ? void 0 : onError(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); } }, { children: function (formik) { return (_jsx(Flex, __assign({ column: true, flex: 1, style: style }, { children: _jsxs(Form, __assign({ onSubmit: formik.handleSubmit }, { children: [_jsx(Flex, __assign({ column: true }, { children: Object.keys(fields).map(function (fieldName) {
                            var _a;
                            var id = fieldName;
                            var _b = fields[id], Component = _b.Component, label = _b.label, name = _b.name, _c = _b.componentProps, componentProps = _c === void 0 ? {} : _c;
                            componentProps.style = (_a = componentProps.style) !== null && _a !== void 0 ? _a : {
                                width: '100%',
                                marginTop: 5,
                                marginBottom: 5,
                            };
                            return (_createElement(Component, __assign({}, componentProps, { id: id, key: id, name: name !== null && name !== void 0 ? name : id, label: label !== null && label !== void 0 ? label : id, required: !!(componentProps === null || componentProps === void 0 ? void 0 : componentProps.required), value: formik.values[id], onChange: formik.handleChange(id), onBlur: formik.handleBlur(id), error: formik.touched[id] && Boolean(formik.errors[id]), helperText: formik.touched[id] && formik.errors[id] })));
                        }) })), _jsxs(Flex, __assign({ column: true }, { children: [_jsx(Flex, { children: _jsx(FormikSubmitButton, __assign({ formik: formik, disabledIfUnchanged: disabledIfUnchanged, onClick: formik.handleSubmit }, options)) }), _jsx(Flex, { children: error ? _jsx(Typography, __assign({ color: "error" }, { children: error === null || error === void 0 ? void 0 : error.toString() })) : null })] }))] })) }))); } })));
};
//# sourceMappingURL=forms.js.map