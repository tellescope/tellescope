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
import { remove_script_tags } from "@tellescope/utilities";
import { WEBHOOK_MODELS, TIMEZONE_MAP, VALID_STATES, } from "@tellescope/types-models";
import v from 'validator';
export var isDate = v.isDate, isEmail = v.isEmail, isMobilePhone = v.isMobilePhone, isSlug = v.isSlug, isMongoId = v.isMongoId, isMimeType = v.isMimeType, isURL = v.isURL;
// import {
//   BUSINESS_TYPE,
// } from "@tellescope/constants"
import { filter_object, is_defined, is_object, is_whitespace, object_is_empty, to_object_id, } from "@tellescope/utilities";
import { ACTIVE_CAMPAIGN_TITLE, ALL_ACCESS, ASSIGNED_ACCESS, ATHENA_TITLE, CANDID_TITLE, CANVAS_TITLE, DEFAULT_ACCESS, DEVELOP_HEALTH_TITLE, DOCSUMO_TITLE, DOSESPOT_TITLE, EMOTII_TITLE, ENDUSER_FIELD_TYPES, FULLSCRIPT_INTEGRATIONS_TITLE, GOGO_MEDS_TITLE, INSURANCE_RELATIONSHIPS, MFAX_TITLE, NO_ACCESS, OUTLOOK_INTEGRATIONS_TITLE, PAGER_DUTY_TITLE, SMART_METER_TITLE, SQUARE_INTEGRATIONS_TITLE, STRIPE_TITLE, ZENDESK_INTEGRATIONS_TITLE, ZOHO_TITLE, ZOOM_TITLE, ZUS_TITLE, } from "@tellescope/constants";
var EXAMPLE_OBJECT_ID = '60398b0231a295e64f084fd9';
var getTypeString = function () { return "string"; };
var getTypeNumber = function () { return "number"; };
var getExampleString = function () { return 'example string'; };
var getExampleObjectId = function () { return EXAMPLE_OBJECT_ID; };
var escape_fieldValue = function (f) { return (typeof f === 'string'
    ? remove_script_tags(f)
    : f); };
export var MAX_FILE_SIZE = 1000000000; // 1gb megabytes in bytes
var DEFAULT_MAX_LENGTH = 50000;
export var build_validator = function (escapeFunction, options) {
    if (options === void 0) { options = {}; }
    var shouldTruncate = options.shouldTruncate, isOptional = options.isOptional, toLower = options.toLower, emptyStringOk = options.emptyStringOk, emptyListOk = options.emptyListOk, nullOk = options.nullOk, isObject = options.isObject, isNumber = options.isNumber, listOf = options.listOf, isBoolean = options.isBoolean, unique = options.unique, _a = options.field, field = _a === void 0 ? '' : _a;
    var minLength = options.minLength || 0;
    var maxLength = options.maxLength || DEFAULT_MAX_LENGTH;
    return function (fieldValue) {
        if (isOptional && fieldValue === undefined)
            return undefined;
        if (isOptional && fieldValue === null && !nullOk)
            return undefined;
        if (nullOk && fieldValue === null)
            return null;
        // ensure this comes before emptyStringOk to ensure empty string types are coerced to empty array when empty list is ok
        if (listOf && (fieldValue === null || fieldValue === void 0 ? void 0 : fieldValue.length) === 0) {
            if (emptyListOk)
                return [];
            else
                throw new Error("Expecting a list of values but list is empty");
        }
        if ((emptyStringOk || isOptional) && fieldValue === '')
            return '';
        if (!emptyStringOk && fieldValue === '')
            throw "Expecting non-empty string but got ".concat(escape_fieldValue(fieldValue));
        if (isObject && typeof fieldValue !== 'object') {
            try {
                if (typeof fieldValue !== 'string')
                    throw '';
                // be helpful and decodeURI if needed (%22 is invalid in JSON unless at least one '"" is present, so this should be safe)
                if (fieldValue && fieldValue.includes('%22') && !fieldValue.includes('"')) {
                    fieldValue = JSON.parse(decodeURIComponent(fieldValue));
                }
                else {
                    fieldValue = JSON.parse(fieldValue); // seems necessary for parsing query string
                }
            }
            catch (err) {
                throw "Expecting an object but got ".concat(escape_fieldValue(fieldValue));
            }
        }
        if (isNumber && fieldValue === 0)
            return 0; // avoid falsey issues later
        if (!isOptional && !fieldValue && !(isBoolean && fieldValue === false)) {
            throw { message: 'missing value', field: field };
        }
        // asserts for listOf === true, that fieldValue typed as array
        if (listOf && !Array.isArray(fieldValue))
            throw "Expecting a list of values but got ".concat(escape_fieldValue(fieldValue));
        if (toLower && typeof fieldValue === 'string') {
            fieldValue = fieldValue.toLowerCase();
        }
        var values = listOf && Array.isArray(fieldValue) ? fieldValue.filter(function (a) { return !!a || (a === 0 && isNumber); }) : [fieldValue];
        if (listOf && unique && Array.isArray(values)) {
            values = Array.from(new Set(values));
        }
        var escapedValues = [];
        if (values.length > 1000)
            throw new Error("Arrays should not contain more than 1000 elements");
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (emptyStringOk && value === '') {
                escapedValues.push('');
                continue;
            }
            var escapedValue = escapeFunction(value); // may throw exception, this is fine
            if (typeof escapedValue === 'string') { // is string
                if (escapedValue.length > maxLength) {
                    if (shouldTruncate) {
                        escapedValue = escapedValue.substring(0, maxLength);
                    }
                    else {
                        throw "Length of escapedValue ".concat(escapedValue, " exceeds maxLength ").concat(maxLength);
                    }
                }
                if (escapedValue.length < minLength) {
                    throw new Error("Length of escapedValue ".concat(escapedValue, " shorter than minLength ").concat(minLength));
                }
                if (!isOptional && escapedValue.length === 0) {
                    throw "Value has 0 length after escaping but field is required";
                }
            }
            else if (isObject && is_object(escapedValue)) { // is parsed JSON
                var parsed = JSON.stringify(escapedValue);
                if (parsed.length > maxLength) {
                    throw "Length of JSON ".concat(parsed, " exceeds maxLength ").concat(maxLength);
                }
            }
            escapedValues.push(escapedValue);
        }
        return listOf ? escapedValues : escapedValues[0];
    };
};
export var fieldsToValidationOld = function (fs) {
    var validation = {};
    for (var f in fs) {
        validation[f] = fs[f].validator.validate({ isOptional: !fs[f].required });
    }
    return validation;
};
/********************************* VALIDATORS *********************************/
var optionsWithDefaults = function (options) {
    if (options === void 0) { options = {}; }
    return {
        maxLength: options.maxLength || 1000,
        minLength: options.minLength || 0,
        shouldTruncate: options.shouldTruncate || false,
        isOptional: options.isOptional || false,
        emptyStringOk: options.emptyStringOk || false,
        nullOk: options.nullOk || false,
        isObject: options.isObject || false,
        isNumber: options.isNumber || false,
        isBoolean: options.isBoolean || false,
        listOf: options.listOf || false,
        emptyListOk: options.emptyListOk || false,
    };
};
export var binaryOrValidator = function (f1, f2) { return function (o) {
    if (o === void 0) { o = {}; }
    return build_validator(function (value) {
        try {
            return f1(value);
        }
        catch (err) {
            return f2(value);
        }
    }, __assign(__assign({}, o), { listOf: false }));
}; };
export var orValidator = function (validators, _o) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (value) {
            for (var field in validators) {
                var escape_1 = validators[field];
                try {
                    // console.log(field, value)
                    return escape_1.validate()(value);
                }
                catch (err) {
                    // console.error(err)
                    continue;
                }
            }
            throw "Value does not match any of the expected options: ".concat(typeof value === 'object' ? JSON.stringify(value, null, 2) : '');
        }, __assign(__assign(__assign({}, _o), o), { listOf: false }));
    },
    getExample: function () { return Object.values(validators)[0].getExample(); },
    getType: function () { return [Object.values(validators).map(function (v) { return v.getType(); })]; }
}); };
export var filterCommandsValidator = function (o) {
    if (o === void 0) { o = {}; }
    return build_validator(function (value) {
        if (!is_object(value)) {
            throw new Error("Expecting object value for FilterType");
        }
        // this incorrectly prevents multiple combinations (e.g. gt and lt)
        // if (value._exists && typeof value._exists === 'boolean' ) return { _exists: value._exists }
        // if (value._gt && typeof value._gt === 'number' ) return { _gt: value._gt }
        // if (value._gte && typeof value._gte === 'number' ) return { _gte: value._gte }
        // if (value._lt && typeof value._lt === 'number' ) return { _lt: value._lt }
        // if (value._lte && typeof value._gt === 'number' ) return { _lte: value._lte }
        // if (value._all && Array.isArray(value._all)) return { _all: value._all }
        // if (value._in && Array.isArray(value._in)) return { _in: value._in }
        // if (value._nin && Array.isArray(value._nin)) return { _nin: value._nin }
        // if (value._ne) return { _ne: value._ne }
        if (Object.keys(value).find(function (k) { return k.startsWith('$'); })) { // ignore any $ injections
            throw new Error("Unknown filter value ".concat(JSON.stringify(value)));
        }
        return value;
    }, __assign(__assign({}, o), { isObject: true, listOf: false }));
};
export var convertCommand = function (key, value) {
    if (key === '_exists') {
        return { $exists: value };
    }
    else if (key === '_lt') {
        return { $lt: value };
    }
    else if (key === '_lte') {
        return { $lte: value };
    }
    else if (key === '_gt') {
        return { $gt: value };
    }
    else if (key === '_gte') {
        return { $gte: value };
    }
    else if (key === '_all') {
        return { $all: value };
    }
    else if (key === '_in') {
        return { $in: value };
    }
    else if (key === '_nin') {
        return { $nin: value };
    }
    else if (key === '_ne') {
        return { $ne: value };
    }
    return null;
};
export var convertCommands = function (operators) {
    var filterOperators = {};
    for (var field in operators) {
        var value = operators[field];
        var keys = Object.keys(value);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var converted = convertCommand(key, value[key]);
            if (converted) {
                filterOperators[field] = __assign(__assign({}, filterOperators[field]), converted);
            }
        }
    }
    return filterOperators;
};
export var objectValidatorOld = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (object) {
            var _a;
            var emptyOk = (_a = objectOptions.emptyOk) !== null && _a !== void 0 ? _a : true;
            var validated = {};
            if (!is_object(object)) {
                throw new Error("Expected a non-null object by got ".concat(object));
            }
            if (!emptyOk && object_is_empty(object)) {
                throw new Error("Expected a non-empty object");
            }
            // don't throw on unrecognized fields, just ignore/don't validate them
            if (objectOptions.throwOnUnrecognizedField) {
                var unrecognizedFields = [];
                for (var field in object) {
                    if (!i[field]) {
                        unrecognizedFields.push(field);
                    }
                }
                if (unrecognizedFields.length > 0) {
                    throw new Error("Got unexpected field(s) [".concat(unrecognizedFields.join(', '), "]"));
                }
            }
            for (var field in i) {
                var value = object[field];
                var escaped = i[field](value); // may be required
                if (escaped === undefined)
                    continue;
                validated[field] = escaped;
            }
            return validated;
        }, __assign(__assign({}, o), { isObject: true, listOf: false }));
    };
};
export var listValidatorOld = function (b) { return function (o) { return build_validator(b, __assign(__assign({}, o), { listOf: true })); }; };
var exampleObject = function (fields) {
    var examples = {};
    for (var field in fields) {
        examples[field] = fields[field].getExample();
    }
    return examples;
};
var typeObject = function (fields) {
    var types = {};
    for (var field in fields) {
        types[field] = fields[field].getType();
    }
    return types;
};
export var objectValidator = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return ({
        validate: function (o) {
            if (o === void 0) { o = {}; }
            return build_validator(function (_object) {
                var _a, _b;
                var object = ((_a = objectOptions.inputModifier) === null || _a === void 0 ? void 0 : _a.call(objectOptions, _object)) || _object;
                var emptyOk = (_b = objectOptions.emptyOk) !== null && _b !== void 0 ? _b : true;
                // const isOptional = !!objectOptions.isOptional || o.isOptional
                var validated = {};
                if (!is_object(object)) {
                    throw new Error("Expected a non-null object by got ".concat(object));
                }
                if (!emptyOk && object_is_empty(object)) {
                    throw new Error("Expected a non-empty object");
                }
                // don't throw on unrecognized fields, just ignore/don't validate them
                if (objectOptions.throwOnUnrecognizedField) {
                    var unrecognizedFields = [];
                    for (var field in object) {
                        if (!i[field]) {
                            unrecognizedFields.push(field);
                        }
                    }
                    if (unrecognizedFields.length > 0) {
                        throw new Error("Got unexpected field(s) [".concat(unrecognizedFields.join(', '), "]"));
                    }
                }
                for (var field in i) {
                    // console.log('validating field of object', field)
                    var value = object[field];
                    try {
                        var escaped = i[field].validate({ field: field })(value); // may be required
                        // console.log('escaped', escaped)
                        if (escaped === undefined)
                            continue;
                        validated[field] = escaped;
                    }
                    catch (err) {
                        if (err.message === 'missing value') {
                            throw __assign(__assign({}, err), { field: o.field || field });
                        }
                        throw err;
                    }
                }
                return validated;
            }, __assign(__assign({}, o), { maxLength: 100000, isObject: true, listOf: false, isOptional: !!objectOptions.isOptional || o.isOptional }));
        },
        getExample: function () { return exampleObject(i); },
        getType: function () { return typeObject(i); },
    });
};
export var listOfObjectsValidator = function (i, objectOptions) {
    if (objectOptions === void 0) { objectOptions = { emptyOk: true }; }
    return ({
        validate: function (o) {
            if (o === void 0) { o = {}; }
            return build_validator(function (object) {
                var emptyOk = !!objectOptions.emptyOk || o.emptyListOk;
                var validated = {};
                if (!is_object(object)) {
                    throw new Error("Expected a non-null object by got ".concat(object));
                }
                if (!emptyOk && object_is_empty(object)) {
                    throw new Error("Expected a non-empty object");
                }
                // don't throw on unrecognized fields, just ignore/don't validate them
                // const unrecognizedFields = []
                // for (const field in object) {
                //   if (!(i as Indexable)[field]) {
                //     unrecognizedFields.push(field)
                //   } 
                // }
                // if (unrecognizedFields.length > 0) {
                //   throw new Error(`Got unexpected field(s) [${unrecognizedFields.join(', ')}]`)
                // }
                for (var field in i) {
                    var value = object[field];
                    var escaped = i[field].validate()(value); // may be required
                    if (escaped === undefined)
                        continue;
                    validated[field] = escaped;
                }
                return validated;
            }, __assign(__assign({}, o), { isObject: true, listOf: true, emptyListOk: !!objectOptions.emptyOk || o.emptyListOk }));
        },
        getExample: function () { return [exampleObject(i)]; },
        getType: function () { return [typeObject(i)]; } // don't forget list
    });
};
export var objectAnyFieldsValidator = function (valueValidator) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (object) {
            if (object === void 0) { object = {}; }
            if (!is_object(object)) {
                throw new Error("Expected a non-null object by got ${object}");
            }
            var validated = {};
            for (var field in object) {
                if (valueValidator) {
                    validated[field] = valueValidator.validate()(object[field]);
                }
                else if (typeof object[field] === 'number') {
                    validated[field] = numberValidator.validate()(object[field]);
                }
                else if (typeof object[field] === 'string') {
                    validated[field] = stringValidator.validate({ emptyStringOk: true })(object[field]);
                }
                else if (object[field] === null) {
                    validated[field] = null;
                }
                else {
                    if (valueValidator) {
                        throw new Error("Field ".concat(field, " is not a string or number"));
                    }
                    validated[field] = object[field];
                }
            }
            return validated;
        }, __assign(__assign({}, o), { isObject: true, listOf: false, isOptional: true }));
    },
    getExample: function () { var _a, _b; return "{ \"key\": ".concat((_b = (_a = valueValidator === null || valueValidator === void 0 ? void 0 : valueValidator.getExample) === null || _a === void 0 ? void 0 : _a.call(valueValidator)) !== null && _b !== void 0 ? _b : '"value"', " }"); },
    getType: function () { var _a, _b; return "{ \"key\": ".concat((_b = (_a = valueValidator === null || valueValidator === void 0 ? void 0 : valueValidator.getType) === null || _a === void 0 ? void 0 : _a.call(valueValidator)) !== null && _b !== void 0 ? _b : 'string', " }"); },
}); };
export var objectAnyFieldsAnyValuesValidator = objectAnyFieldsValidator();
export var optionalEmptyObjectValidator = ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (object) {
            return {};
        }, __assign(__assign({}, o), { isOptional: true, isObject: true, listOf: false }));
    },
    getExample: function () { return "{ }"; },
    getType: function () { return "{ }"; },
});
export var optionalAnyObjectValidator = ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (object) {
            if (typeof object !== 'object')
                throw "Must be an object value";
            return object;
        }, __assign(__assign({}, o), { isOptional: true, isObject: true, listOf: false }));
    },
    getExample: function () { return "{ }"; },
    getType: function () { return "{ }"; },
});
export var escapeString = function (o) {
    if (o === void 0) { o = {}; }
    return function (string) {
        if (typeof string !== "string")
            throw new Error('Expecting string value');
        if (o.trim) {
            string = string.trim();
            if (o.isOptional && string === '') {
                throw new Error(o.errorMessage || "String is only whitespace");
            }
        }
        return string;
    };
};
export var stringValidator = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidatorOptional = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidatorOptionalEmptyOkay = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 1000, listOf: false, isOptional: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator5000OptionalEmptyOkay = {
    validate: function (o) {
        var _a;
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: (_a = o.maxLength) !== null && _a !== void 0 ? _a : 5000, listOf: false, isOptional: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator100 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 100, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString
};
export var stringValidator250 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 250, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator1000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 1000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator1000Optional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 1000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator5000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator20000ptional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 20000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator5000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator5000Optional = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 5000, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator25000 = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 25000, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator100000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 100000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator100000OptionalEmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 100000, isOptional: true, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator25000OptionalEmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 25000, isOptional: true, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var stringValidator25000EmptyOkay = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 25000, listOf: false, emptyStringOk: true }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var SMSMessageValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeString(o), __assign(__assign({}, o), { maxLength: 1200, listOf: false }));
    },
    getExample: getExampleString,
    getType: getTypeString,
};
export var listValidator = function (b, _o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listValidatorEmptyOk = function (b, o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign({}, o), { listOf: true, emptyListOk: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listValidatorOptionalOrEmptyOk = function (b, o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign({}, o), { listOf: true, emptyListOk: true, isOptional: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listValidatorUnique = function (b, _o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listValidatorUniqueEmptyOkay = function (b, _o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true, emptyListOk: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listValidatorUniqueOptionalEmptyOkay = function (b, _o) { return ({
    validate: function (o) { return build_validator(b.validate(o), __assign(__assign(__assign({}, _o), o), { listOf: true, unique: true, emptyListOk: true, isOptional: true })); },
    getExample: function () { return [b.getExample()]; },
    getType: function () { return [b.getExample()]; },
}); };
export var listOfStringsValidator = listValidator(stringValidator);
export var listOfStringsValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk(stringValidator);
export var listOfStringsValidatorEmptyOk = listValidatorEmptyOk(stringValidator);
export var listOfStringsValidatorUniqueOptionalOrEmptyOkay = listValidatorUniqueOptionalEmptyOkay(stringValidator);
export var listOfObjectAnyFieldsAnyValuesValidator = listValidator(objectAnyFieldsAnyValuesValidator);
export var listOfUniqueStringsValidatorEmptyOk = listValidatorUniqueEmptyOkay(stringValidator);
export var booleanValidatorBuilder = function (defaults) { return ({
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (boolean) {
            if (boolean === 'true')
                return true;
            if (boolean === 'false')
                return false;
            if (typeof boolean !== 'boolean') {
                throw new Error(options.errorMessage || "Invalid boolean");
            }
            return boolean;
        }, __assign(__assign(__assign({}, defaults), options), { isBoolean: true, listOf: false }));
    },
    getExample: function () { return true; },
    getType: function () { return "boolean"; },
}); };
export var booleanValidator = booleanValidatorBuilder({});
export var booleanValidatorOptional = booleanValidatorBuilder({ isOptional: true });
export var escapeMongoId = function (mongoId) {
    if (typeof mongoId !== 'string')
        throw new Error('Expecting string id');
    if (!isMongoId(mongoId)) {
        throw new Error("Invalid id");
    }
    return mongoId;
};
export var mongoIdValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (s) { return to_object_id(escapeMongoId(s)); }, __assign(__assign({}, optionsWithDefaults(o)), { maxLength: 100, listOf: false }));
    },
    getType: getTypeString,
    getExample: getExampleObjectId,
};
export var buildMongoIdStringValidator = function (options) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(escapeMongoId, __assign(__assign({}, optionsWithDefaults(__assign(__assign({}, options), o))), { maxLength: 100, listOf: false }));
    },
    getType: getTypeString,
    getExample: getExampleObjectId,
}); };
export var nullValidator = function (o) {
    if (o === void 0) { o = {}; }
    return build_validator(function (v) {
        if (v !== null)
            throw Error('Expecting null');
        return v;
    }, __assign(__assign({}, o), { listOf: false }));
};
export var stringReadonlyValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (s) { throw new Error("This field cannot be updated"); }, __assign(__assign({}, o), { isOptional: true, emptyStringOk: true, listOf: false }));
    },
    getType: getTypeString,
    getExample: function () { return "string (readonly)"; },
};
export var mongoIdRequired = mongoIdValidator.validate();
export var mongoIdOptional = mongoIdValidator.validate({ isOptional: true });
export var listOfMongoIdValidator = listValidator(mongoIdValidator);
export var mongoIdStringRequired = buildMongoIdStringValidator({ isOptional: false });
export var mongoIdStringOptional = buildMongoIdStringValidator({ isOptional: true });
export var listOfMongoIdStringValidator = listValidator(mongoIdStringRequired);
export var listOfMongoIdStringValidatorOptional = listValidator(mongoIdStringRequired, { isOptional: true });
export var listOfMongoIdStringValidatorEmptyOk = listValidatorEmptyOk(mongoIdStringRequired);
export var listOfMongoIdStringValidatorOptionalOrEmptyOk = listValidatorOptionalOrEmptyOk(mongoIdStringRequired);
export var sharedWithOrganizationIdsValidator = listValidatorEmptyOk(listValidator(mongoIdStringRequired));
export var slugValidator = {
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (s) {
            if (typeof s !== 'string')
                throw new Error("Expecting a string");
            if (!isSlug(s))
                throw new Error("Invalid format for ".concat(s));
            return s;
        }, __assign(__assign({}, optionsWithDefaults(o)), { maxLength: 10000, listOf: false }));
    },
    getType: getTypeString,
    getExample: function () { return 'this-is-a-slug'; },
};
export var first_letter_capitalized = function (s) {
    if (s === void 0) { s = ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
};
export var escape_name = function (namestring) { return namestring.replaceAll(/[^a-zA-Z0-9-_ /.]/g, '').substring(0, 100); };
// enforces first-letter capitalization
export var nameValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (name) {
            if (typeof name !== 'string')
                throw new Error('Expecting string value');
            // need to explicitly trim here, trim: true not currently working (mar 7, 2024)
            name = name.trim().substring(0, 100); // escape_name(name)  
            if (!name)
                throw new Error("Invalid name");
            return first_letter_capitalized(name);
        }, __assign(__assign({}, options), { maxLength: 100, trim: true, listOf: false }));
    },
    getExample: function () { return 'John'; },
    getType: getTypeString,
};
export var emailValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!isEmail(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
export var emailValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!isEmail(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
export var emailValidatorEmptyOkay = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (email) {
            if (typeof email !== 'string')
                throw new Error('Expecting string value');
            if (!isEmail(email)) {
                throw new Error(options.errorMessage || "Invalid email: ".concat(escape_fieldValue(email)));
            }
            return email.toLowerCase();
        }, __assign(__assign({}, options), { maxLength: 250, emptyStringOk: true, listOf: false }));
    },
    getExample: function () { return "example@tellescope.com"; },
    getType: getTypeString,
};
export var numberValidatorBuilder = function (_a) {
    var lower = _a.lower, upper = _a.upper, higherOptions = __rest(_a, ["lower", "upper"]);
    return ({
        validate: function (options) {
            if (options === void 0) { options = {}; }
            options.isNumber = true;
            return build_validator(function (number) {
                number = Number(number); // ok to throw error!
                if (typeof number !== "number" || isNaN(number)) {
                    throw new Error(options.errorMessage || "Not a valid number");
                }
                if (!(lower || upper))
                    return number;
                if (!(number >= lower && number <= upper)) {
                    throw new Error(options.errorMessage || "Not a valid number for [".concat(lower, "-").concat(upper, "]"));
                }
                return number;
            }, __assign(__assign({}, optionsWithDefaults(__assign(__assign({}, higherOptions), options))), { listOf: false }));
        },
        getExample: function () { return lower; },
        getType: getTypeNumber,
    });
};
export var nonNegNumberValidator = numberValidatorBuilder({ lower: 0, upper: 10000000000000 }); // max is 2286 in UTC MS
export var positiveNumberValidator = numberValidatorBuilder({ lower: 1, upper: 10000000000000 }); // max is 2286 in UTC MS
export var numberValidator = numberValidatorBuilder({ lower: -10000000000000, upper: 10000000000000 }); // max is 2286 in UTC MS
export var numberValidatorOptional = numberValidatorBuilder({ lower: -10000000000000, upper: 10000000000000, isOptional: true, emptyStringOk: true }); // max is 2286 in UTC MS
export var listOfNumbersValidatorUniqueOptionalOrEmptyOkay = listValidatorUniqueOptionalEmptyOkay(numberValidator, { isNumber: true });
export var fileSizeValidator = numberValidatorBuilder({ lower: 0, upper: MAX_FILE_SIZE });
export var numberOrStringValidatorEmptyOkay = orValidator({
    number: numberValidator,
    string: stringValidator5000EmptyOkay,
});
export var numberOrStringValidatorOptional = orValidator({
    number: numberValidatorOptional,
    string: stringValidatorOptional
});
export var dateValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (date) {
            if (isDate(date))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
export var dateOptionalOrEmptyStringValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (date) {
            if (date === '')
                return date;
            // coerce to string in case date is an actual Date object
            if (isDate(date === null || date === void 0 ? void 0 : date.toString()))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, emptyStringOk: true, isOptional: true, listOf: false }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
export var dateValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (date) {
            if (isDate(date))
                throw new Error(options.errorMessage || "Invalid date");
            return new Date(date);
        }, __assign(__assign({}, options), { maxLength: 250, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return new Date().toISOString(); },
    getType: function () { return "Date"; },
};
export var dateRangeValidator = objectValidator({
    from: dateOptionalOrEmptyStringValidator,
    to: dateOptionalOrEmptyStringValidator,
});
export var dateRangeOptionalValidator = objectValidator({
    from: dateOptionalOrEmptyStringValidator,
    to: dateOptionalOrEmptyStringValidator,
}, { isOptional: true, emptyOk: true });
export var exactMatchValidator = function (matches, options) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (match) {
            if (matches.filter(function (m) { return m === match; }).length === 0) {
                throw new Error("Value must match one of ".concat(matches));
            }
            return match;
        }, __assign(__assign({}, o), { nullOk: matches.includes(null), listOf: false }));
    },
    getExample: function () { var _a; return (_a = matches[0]) !== null && _a !== void 0 ? _a : 'null'; },
    getType: getTypeString,
}); };
export var exactMatchValidatorOptional = function (matches) { return ({
    validate: function (o) {
        if (o === void 0) { o = {}; }
        return build_validator(function (match) {
            if (matches.filter(function (m) { return m === match; }).length === 0) {
                throw new Error("Value must match one of ".concat(matches));
            }
            return match;
        }, __assign(__assign({}, o), { nullOk: matches.includes(null), listOf: false, isOptional: true }));
    },
    getExample: function () { var _a; return (_a = matches[0]) !== null && _a !== void 0 ? _a : 'null'; },
    getType: getTypeString,
}); };
export var exactMatchListValidator = function (matches) { return listValidator(exactMatchValidator(matches)); };
// export for backwards compatibility after moving to types-models
export { VALID_STATES };
export var stateValidator = exactMatchValidator(VALID_STATES);
export var stateValidatorOptional = exactMatchValidatorOptional(VALID_STATES);
export var journeysValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (journeys) {
            if (typeof journeys !== 'object') {
                throw new Error('Expecting an object');
            }
            var mIdValidator = mongoIdValidator.validate();
            var stateValidator = stringValidator.validate({ isOptional: true, maxLength: 75, errorMessage: "Journey state names may not exceed 75 characters" });
            for (var j in journeys) {
                mIdValidator(j);
                journeys[j] = stateValidator(journeys[j]);
            }
            return journeys;
        }, __assign(__assign({}, options), { isObject: true, listOf: false }));
    },
    getExample: function () {
        var _a;
        return (_a = {}, _a[EXAMPLE_OBJECT_ID] = "status", _a);
    },
    getType: function () { return ({ string: "string" }); },
};
export var escape_phone_number = function (p) {
    if (p === void 0) { p = ''; }
    return p.replace(/[^\d+]/g, '');
};
export var phoneValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (phone) {
            if (typeof phone !== "string")
                throw new Error("Expecting phone to be string but got ".concat(phone));
            var escaped = escape_phone_number(phone);
            if (escaped === '311')
                return escaped;
            if (escaped.length < 10)
                throw new Error("Phone number must be at least 10 digits");
            escaped = escaped.startsWith('+') ? escaped
                : escaped.length === 10 ? '+1' + escaped // assume US country code for now
                    : "+" + escaped; // assume country code provided, but missing leading +
            // phone numbers from Gambia, which is not supported by isMobilePhone
            if (escaped.length === 11 && escaped.startsWith('+220') && /[0-9]$/.test(escaped.substring(1))) {
                return escaped;
            }
            if (!isMobilePhone(escaped, 'any', { strictMode: true })) {
                throw "Invalid phone number: ".concat(phone);
            }
            return escaped;
        }, __assign(__assign({}, options), { maxLength: 25, listOf: false }));
    },
    getExample: function () { return "+15555555555"; },
    getType: getTypeString,
};
export var phoneValidatorOptional = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (phone) {
            if (typeof phone !== "string")
                throw new Error("Expecting phone to be string but got ".concat(phone));
            var escaped = escape_phone_number(phone);
            if (escaped === '311')
                return escaped;
            if (escaped.length < 10)
                throw new Error("Phone number must be at least 10 digits");
            escaped = escaped.startsWith('+') ? escaped
                : escaped.length === 10 ? '+1' + escaped // assume US country code for now
                    : "+" + escaped; // assume country code provided, but missing leading +
            // phone numbers from Gambia, which is not supported by isMobilePhone
            if (escaped.length === 11 && escaped.startsWith('+220') && /[0-9]$/.test(escaped.substring(1))) {
                return escaped;
            }
            if (!isMobilePhone(escaped, 'any', { strictMode: true })) {
                throw "Invalid phone number: ".concat(phone);
            }
            return escaped;
        }, __assign(__assign({}, options), { maxLength: 25, listOf: false, isOptional: true, emptyStringOk: true }));
    },
    getExample: function () { return "+15555555555"; },
    getType: getTypeString,
};
export var fileTypeValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (s) {
            if (typeof s !== 'string')
                throw new Error("fileType must be a string");
            if (!isMimeType(s))
                throw new Error("".concat(s, " is not a valid file type"));
            return s;
        }, __assign(__assign({}, options), { emptyStringOk: true, listOf: false }));
    },
    getExample: function () { return 'text/plain'; },
    getType: getTypeString,
};
export var urlValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (s) {
            if (typeof s !== 'string')
                throw new Error("URL must be a string");
            if (!isURL(s))
                throw new Error("".concat(s, " is not a valid URL"));
            return s;
        }, __assign(__assign({}, options), { listOf: false }));
    },
    getExample: function () { return '"https://www.tellescope.com"'; },
    getType: getTypeString,
};
export var safeBase64Validator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (sb64) {
            if (typeof sb64 !== 'string')
                throw new Error("Expecting string");
            // https://stackoverflow.com/questions/12930007/how-to-validate-base64-string-using-regex-in-javascript
            // regex with = + and / replaced as get_random_base64_URL_safe 
            if (!/^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}..|[A-Za-z0-9_-]{3}.)?$/.test(sb64)) {
                throw "Invalid safe base64";
            }
            return sb64;
        }, __assign(__assign({}, options), { listOf: false }));
    },
    getExample: function () { return '129vjas0fkj1234jgfmnaef'; },
    getType: getTypeString,
};
export var subdomainValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (subdomain) {
            if (typeof subdomain !== 'string')
                throw new Error("Expecting string value");
            subdomain = subdomain.toLowerCase();
            if (subdomain.startsWith('-')) {
                subdomain = subdomain.substring(1);
            }
            while (subdomain.endsWith('-')) {
                subdomain = subdomain.substring(0, subdomain.length - 1);
            }
            subdomain = subdomain.replace(/[^a-zA-Z\d-]/g, '');
            return subdomain;
        }, __assign(__assign({}, options), { maxLength: 50, listOf: false }));
    },
    getExample: function () { return 'example'; },
    getType: getTypeString,
};
// export const fileResponseValidator: EscapeBuilder<FileResponse> = (options={}) => build_validator(
//   (file: any) => {
//     if (!file.secureName) throw new Error("Missing name")
//     return {
//       type: 'file',
//       name: stringValidator({ shouldTruncate: true, maxLength: 250 })(file.name).substring(0, 250),
//       secureName: safeBase64Validator()(file.secureName)
//     }
//   }, 
//   { ...options, isObject: true, listOf: false }
// )
export var fileResponseValidator = objectValidator({
    type: exactMatchValidator(['file']),
    name: stringValidator1000,
    secureName: stringValidator250,
});
export var signatureResponseValidator = objectValidator({
    type: exactMatchValidator(['signature']),
    fullName: stringValidator100,
    signed: booleanValidator,
});
export var labeledFieldsValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    field: stringValidator100,
    value: stringValidator5000,
}));
var DEFAULT_ENDUSER_FIELDS = [
    '_id', 'email', 'phone', 'fname', 'lname', 'journeys', 'tags', 'preference'
];
// todo: move preference to FIELD_TYPES with drop-down option in user-facing forms
// const FIELD_TYPES = ['string', 'number', 'email', 'phone', 'multiple_choice', 'file', 'signature']
// const VALIDATE_OPTIONS_FOR_FIELD_TYPES = {
//   'multiple_choice': {
//     choices: listOfStringsValidator({  maxLength: 100, errorMessage: "Multiple choice options must be under 100 characters, and you must have at least one option." }),
//     radio: booleanValidator({ errorMessage: "radio must be a boolean" }),
//     other: booleanValidator({ isOptional: true, errorMessage: "other must be a boolean" }),
//     REQUIRED: ['choices', 'radio'],
//   }
// }
var _FORM_FIELD_TYPES = {
    "Appointment Booking": '',
    email: '',
    file: '',
    files: '',
    multiple_choice: '',
    number: '',
    phone: '',
    signature: '',
    string: '',
    stringLong: '',
    ranking: '',
    rating: '',
    date: '',
    dateString: '',
    "Question Group": '',
    "Table Input": '',
    description: '',
    Address: '',
    Time: '',
    Stripe: '',
    Chargebee: '',
    Dropdown: '',
    "Database Select": '',
    Medications: '',
    "Related Contacts": "",
    'Insurance': '',
    Height: '',
    Redirect: '',
    'Hidden Value': '',
    Emotii: '',
    Allergies: "",
    Conditions: "",
    "Rich Text": "",
};
export var FORM_FIELD_TYPES = Object.keys(_FORM_FIELD_TYPES);
export var formFieldTypeValidator = exactMatchValidator(FORM_FIELD_TYPES);
export var FORM_FIELD_VALIDATORS_BY_TYPE = {
    'Chargebee': objectAnyFieldsAnyValuesValidator.validate(),
    'Allergies': objectAnyFieldsAnyValuesValidator.validate(),
    'Conditions': objectAnyFieldsAnyValuesValidator.validate(),
    "Emotii": stringValidator.validate({ maxLength: 5000 }),
    "Hidden Value": stringValidator.validate({ maxLength: 5000 }),
    'Appointment Booking': stringValidator.validate({ maxLength: 100, isOptional: true }),
    'Redirect': stringValidator.validate({ maxLength: 100 }),
    'Related Contacts': objectAnyFieldsAnyValuesValidator.validate(),
    'Insurance': objectAnyFieldsAnyValuesValidator.validate(),
    'Address': objectAnyFieldsAnyValuesValidator.validate(),
    'Database Select': objectAnyFieldsAnyValuesValidator.validate(),
    'Height': objectAnyFieldsAnyValuesValidator.validate(),
    'Time': stringValidator.validate({ maxLength: 100 }),
    'Stripe': stringValidator.validate({ maxLength: 100 }),
    'Medications': listValidator(objectAnyFieldsAnyValuesValidator).validate(),
    Dropdown: listOfStringsValidator.validate({ emptyListOk: true }),
    'description': function (g) { return ''; },
    'Table Input': function (g) { return Array.isArray(g) ? g : []; },
    'Question Group': function (g) { return Array.isArray(g) ? g : []; },
    // need to keep consistent with other validation
    'string': stringValidator.validate({ maxLength: 5000, emptyStringOk: true, errorMessage: "Response must not exceed 5000 characters" }),
    'stringLong': stringValidator.validate({ maxLength: 20000, emptyStringOk: true, errorMessage: "Response must not exceed 20000 characters" }),
    'Rich Text': stringValidator.validate({ maxLength: 25000, emptyStringOk: true, errorMessage: "Response must not exceed 25000 characters" }),
    'number': numberValidator.validate({ errorMessage: "Response must be a number" }),
    'email': emailValidator.validate(),
    'userEmail': emailValidator.validate(),
    'phone': phoneValidator.validate(),
    'phoneNumber': phoneValidator.validate(),
    "date": dateValidator.validate(),
    "dateString": stringValidator100.validate(),
    "ranking": listOfStringsValidator.validate(),
    "rating": numberValidator.validate(),
    // fileInfo: FileResponse
    'file': function (fileInfo, _, isOptional) {
        if (isOptional && (!fileInfo || object_is_empty(fileInfo))) {
            return { type: 'file', secureName: null };
        }
        return fileResponseValidator.validate()(fileInfo);
    },
    'files': function (fs) { return fs; },
    'signature': function (sigInfo, _, isOptional) {
        if (isOptional && (!sigInfo || object_is_empty(sigInfo))) {
            return { type: 'signature', signed: null };
        }
        return signatureResponseValidator.validate()(sigInfo);
    },
    // choiceInfo: { indexes: [], otherText?: string }  
    'multiple_choice': function (choiceInfo, fieldOptions, isOptional) {
        if (isOptional && !choiceInfo)
            return [];
        var indexes = choiceInfo.indexes, otherText = choiceInfo.otherText;
        if (!indexes || indexes.length === undefined) { // no indexes (or empty array) provided
            throw new Error('At least 1 choice is required');
        }
        var parsed = [];
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var i = indexes_1[_i];
            if (typeof i !== 'number')
                throw new Error("Choice ".concat(i, " is not a valid index"));
            if (i < 0 || i >= fieldOptions.choices.length)
                throw new Error("Choice ".concat(i, " is not a valid index"));
            parsed.push(fieldOptions.choices[i]);
        }
        if (otherText && fieldOptions.other === true)
            parsed.push(otherText);
        // todo: add length limit to otherText?
        if (parsed.length === 0)
            throw new Error("No options provided");
        if (parsed.length > 1 && fieldOptions.radio === true)
            throw new Error("Only 1 choice is allowed");
        return parsed;
    },
};
export var fieldsValidator = {
    validate: function (options) {
        if (options === void 0) { options = {}; }
        return build_validator(function (fields) {
            if (!is_object(fields))
                throw new Error("Expecting an object");
            for (var k in fields) {
                if (DEFAULT_ENDUSER_FIELDS.includes(k))
                    throw new Error("key ".concat(k, " conflicts with a built-in field."));
                if (k.startsWith('_'))
                    throw new Error("Fields that start with '_' are not allowed");
                if (is_whitespace(k)) {
                    delete fields[k];
                    continue;
                }
                if (k.length > 256)
                    throw new Error("key ".concat(k, " is greater than 256 characters"));
                var val = fields[k];
                if (typeof val === 'string') {
                    if (val.length > 512)
                        fields[k] = val.substring(0, 512);
                    continue;
                }
                else if (typeof val === 'number' || val === null || typeof val === 'boolean') {
                    continue; // nothing to restrict on number type yet
                }
                else if (typeof val === 'object') {
                    if (JSON.stringify(val).length > 10000)
                        throw new Error("object value for key ".concat(k, " exceeds the maximum length of 10000 characters in string representation"));
                    // previous restricted structure for fields object
                    // try {
                    //   if (val.type && typeof val.type === 'string') { // form responses can be stored as custom fields (form responses is simple array)
                    //     FORM_FIELD_VALIDATORS_BY_TYPE[val.type as keyof typeof FORM_FIELD_VALIDATORS_BY_TYPE](val, undefined as never, undefined as never)
                    //     continue
                    //   }
                    //   if (val.length && typeof val.length === 'number') { // array of strings is ok too, (inclusive of multiple-choice responses)
                    //     if (val.find((s: any) => typeof s !== 'string') !== undefined) {
                    //       throw new Error('List must contain only strings')
                    //     }
                    //     continue 
                    //   }
                    //   if (val.value === undefined) throw new Error(`value field is undefined for key ${k}`)
                    //   if (JSON.stringify(val).length > 1024) throw new Error(`object value for key ${k} exceeds the maximum length of 1024 characters in string representation`)
                    //   const escaped = { value: val.value } as Indexable // create new object to omit unrecognized fields
                    //   escaped.title = val.title // optional
                    //   escaped.description = val.description // optional
                    //   fields[k] = escaped
                    // } catch(err) {
                    //   throw new Error(`object value is invalid JSON for key ${k}`)
                    // }
                }
                else {
                    throw new Error("Expecting value to be a string or object but got ".concat(typeof val, " for key ").concat(k));
                }
            }
            return fields;
        }, __assign(__assign({}, options), { maxLength: 100000, isObject: true, listOf: false }));
    },
    getExample: function () { return "{}"; },
    getType: function () { return "{}"; },
};
export var preferenceValidator = exactMatchValidator(['email', 'sms', 'call', 'chat']);
export var updateOptionsValidator = objectValidator({
    replaceObjectFields: booleanValidatorOptional,
    dontSendWebhook: booleanValidatorOptional,
}, { isOptional: true });
export var journeyStatePriorityValidator = exactMatchValidator(["Disengaged", "N/A", "Engaged"]);
export var journeyStateValidator = objectValidator({
    name: stringValidator100,
    priority: journeyStatePriorityValidator,
    description: stringValidatorOptional,
    requiresFollowup: booleanValidatorOptional, // deprecated
});
// deprecated
// export const journeyStateUpdateValidator = objectValidator<JourneyState>({
//   name: stringValidator100({ isOptional: true }),
//   priority: journeyStatePriorityValidator({ isOptional: true }),
//   description: stringValidator({ isOptional: true }),
//   requiresFollowup: booleanValidator({ isOptional: true }),
// })
export var journeyStatesValidator = listValidator(journeyStateValidator);
export var emailEncodingValidator = exactMatchValidator(['', 'base64']);
export var validateIndexable = function (keyValidator, valueValidator) { return function (o) { return build_validator(function (v) {
    if (!is_object(v))
        throw new Error("Expecting an object");
    var validated = {};
    for (var k in v) {
        validated[keyValidator(k)] = valueValidator(v[k]);
    }
    return validated;
}, __assign(__assign({}, o), { isObject: true, listOf: false })); }; };
export var indexableValidator = function (keyValidator, valueValidator) { return ({
    validate: validateIndexable(keyValidator.validate(), valueValidator.validate()),
    getExample: function () { return "{ ".concat(keyValidator.getExample(), ": ").concat(valueValidator.getExample(), " }"); },
    getType: function () { return "{ ".concat(keyValidator.getType(), ": ").concat(valueValidator.getType(), " }"); },
}); };
export var indexableNumberValidator = function (keyValidator, valueValidator) { return ({
    validate: validateIndexable(keyValidator.validate(), valueValidator.validate()),
    getExample: function () { return "{ ".concat(keyValidator.getExample(), ": ").concat(valueValidator.getExample(), " }"); },
    getType: function () { return "{ ".concat(keyValidator.getType(), ": ").concat(valueValidator.getType(), " }"); },
}); };
export var rejectionWithMessage = function (o) { return build_validator(function (v) { throw new Error((o === null || o === void 0 ? void 0 : o.errorMessage) || 'This field is not valid'); }, __assign(__assign({}, o), { isOptional: true, listOf: false })); };
export var numberToDateValidator = indexableNumberValidator(numberValidator, dateValidator);
export var idStringToDateValidator = indexableValidator(mongoIdStringRequired, dateOptionalOrEmptyStringValidator);
// todo: move preference to FIELD_TYPES with drop-down option in user-facing forms
var FIELD_TYPES = ['string', 'number', 'email', 'phone', 'multiple_choice', 'file', 'signature'];
var VALIDATE_OPTIONS_FOR_FIELD_TYPES = {
    'multiple_choice': {
        choices: listOfStringsValidator,
        radio: booleanValidator,
        other: booleanValidatorOptional,
        REQUIRED: ['choices', 'radio'],
    }
};
export var RESERVED_INTAKE_FIELDS = ['_id', 'id', 'externalId', 'phoneConsent', 'emailConsent', 'tags', 'journeys', 'updatedAt', 'preference', 'assignedTo', 'lastCommunication'];
export var INTERNAL_NAME_TO_DISPLAY_FIELD = {
    "string": 'Text',
    "stringLong": 'Text Long',
    'file': "File",
    'dateString': "Date",
    'date': "Date & Time",
    'rating': "Rating",
    'ranking': "Ranking",
    "number": 'Number',
    "email": "Email",
    "phone": "Phone Number",
    multiple_choice: "Multiple Choice",
    "signature": "Signature",
};
var isFormField = function (f, fieldOptions) {
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    if (!is_object(f))
        throw new Error("Expecting an object");
    var field = f;
    var forUpdate = fieldOptions.forUpdate;
    if (forUpdate) {
        var isOptional = field.isOptional, type = field.type, title = field.title, description = field.description, intakeField = field.intakeField, options = field.options;
        if (object_is_empty(filter_object({
            isOptional: isOptional,
            type: type,
            title: title,
            description: description,
            intakeField: intakeField,
            options: options
        }, is_defined))) {
            throw "No update provided";
        }
    }
    if (forUpdate === false || field.isOptional !== undefined)
        field.isOptional = !!field.isOptional; // coerce to bool, defaulting to false (required)
    if (!forUpdate && !field.type)
        throw "field.type is required"; // fieldName otherwise given as 'field' in validation for every subfield
    if (field.type)
        exactMatchValidator(FIELD_TYPES).validate(field.type);
    if (!forUpdate && !field.title)
        throw "field.title is required"; // fieldName otherwise given as 'field' in validation for every subfield
    if (field.title) {
        field.title = stringValidator.validate({
            maxLength: 100,
            errorMessage: "field title is required and must not exceed 100 characters"
        })(field.title);
    }
    if (!forUpdate || field.description !== undefined) { // don't overwrite description on update with ''
        field.description = stringValidator.validate({
            isOptional: true,
            maxLength: 500,
            errorMessage: "field description must be under 500 characters"
        })(field.description) || '';
    }
    field.options = field.options || {}; // ensure at least an empty object is provided
    if (VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type] !== undefined) {
        if (typeof field.options !== 'object')
            throw new Error("Expected options to be an object but got ".concat(typeof field.options));
        var validators = VALIDATE_OPTIONS_FOR_FIELD_TYPES[field.type];
        var requiredOptions = validators.REQUIRED;
        if (requiredOptions.length > Object.keys(field.options).length) {
            for (var _i = 0, requiredOptions_1 = requiredOptions; _i < requiredOptions_1.length; _i++) {
                var k = requiredOptions_1[_i];
                if (field.options[k] === undefined) {
                    throw new Error("Missing required field ".concat(k));
                }
            }
        }
        for (var k in field.options) {
            if (validators[k] === undefined) {
                throw new Error("Got unexpected option ".concat(k, " for field of type ").concat(INTERNAL_NAME_TO_DISPLAY_FIELD[field.type] || 'Text'));
            }
            field.options[k] = validators[k].validate(field.options[k]);
        }
    }
    if (field.intakeField !== undefined) { // allow null to unset intake
        if (RESERVED_INTAKE_FIELDS.includes(field.intakeField)) {
            throw new Error("".concat(field.intakeField, " is reserved for internal use only and cannot be used as an intake field"));
        }
        var intakeType = ENDUSER_FIELD_TYPES[field.intakeField];
        if (intakeType && intakeType !== field.type) {
            throw new Error("Intake field ".concat(field.intakeField, " requires a form field type of ").concat(INTERNAL_NAME_TO_DISPLAY_FIELD[intakeType] || 'Text'));
        }
    }
    return field;
};
export var addressValidator = objectValidator({
    city: stringValidator,
    state: stateValidator,
    lineOne: stringValidator,
    lineTwo: stringValidatorOptional,
    zipCode: stringValidator100,
    zipPlusFour: stringValidator1000Optional,
    title: stringValidator1000Optional,
});
export var addressOptionalValidator = objectValidator({
    city: stringValidatorOptional,
    state: stateValidatorOptional,
    lineOne: stringValidatorOptional,
    lineTwo: stringValidatorOptional,
    zipCode: stringValidator1000Optional,
    zipPlusFour: stringValidator1000Optional,
    title: stringValidator1000Optional,
}, { isOptional: true, emptyOk: true });
var _TELLESCOPE_GENDER = {
    Female: '',
    Male: '',
    Other: '',
    Unknown: '',
};
export var TELLESCOPE_GENDER = Object.keys(_TELLESCOPE_GENDER);
export var tellescopeGenderValidator = exactMatchValidator(TELLESCOPE_GENDER);
export var tellescopeGenderOptionalValidator = exactMatchValidatorOptional(__spreadArray(__spreadArray([], TELLESCOPE_GENDER, true), [''], false));
export var insuranceOptionalValidator = objectValidator({
    memberId: stringValidatorOptional,
    payerId: stringValidatorOptional,
    payerName: stringValidatorOptional,
    cardFront: stringValidatorOptional,
    cardBack: stringValidatorOptional,
    relationship: exactMatchValidatorOptional(INSURANCE_RELATIONSHIPS),
    coverageId: stringValidatorOptional,
    requestId: stringValidatorOptional,
    eligibility: stringValidator100000OptionalEmptyOkay,
    // eligible: booleanValidatorOptional,
    eligibilityRanAt: dateValidatorOptional,
    status: stringValidatorOptional,
    relationshipDetails: objectValidator({
        // address: addressOptionalValidator, // optional for Candid
        fname: stringValidatorOptional,
        lname: stringValidatorOptional,
        gender: tellescopeGenderOptionalValidator,
        dateOfBirth: stringValidatorOptional, // required for Canvas, optional for Candid
    }, { isOptional: true, emptyOk: true }),
    payerType: stringValidatorOptional,
    groupNumber: stringValidatorOptional,
    planName: stringValidatorOptional,
    startDate: stringValidatorOptional,
}, { isOptional: true, emptyOk: true });
// validate optional vs not at endpoint-level
export var formResponseAnswerValidator = orValidator({
    Height: objectValidator({
        type: exactMatchValidator(['Height']),
        value: objectValidator({
            feet: numberValidatorOptional,
            inches: numberValidatorOptional,
        }),
    }),
    "Appointment Booking": objectValidator({
        type: exactMatchValidator(['Appointment Booking']),
        value: stringValidatorOptional,
    }),
    "Redirect": objectValidator({
        type: exactMatchValidator(['Redirect']),
        value: stringValidator,
    }),
    "Related Contacts": objectValidator({
        type: exactMatchValidator(['Related Contacts']),
        value: listValidatorOptionalOrEmptyOk(objectAnyFieldsAnyValuesValidator),
    }),
    "Insurance": objectValidator({
        type: exactMatchValidator(['Insurance']),
        value: insuranceOptionalValidator,
    }),
    "Question Group": objectValidator({
        type: exactMatchValidator(['Question Group']),
        value: listValidatorEmptyOk(objectValidator({
            id: mongoIdStringRequired,
        }))
    }),
    "Address": objectValidator({
        type: exactMatchValidator(['Address']),
        value: objectValidator({
            addressLineOne: stringValidator1000Optional,
            addressLineTwo: stringValidator1000Optional,
            city: stringValidator1000Optional,
            state: stateValidatorOptional,
            zipCode: stringValidator1000Optional,
            zipPlusFour: stringValidator1000Optional,
        }, { emptyOk: true, isOptional: true })
    }),
    "Table Input": objectValidator({
        type: exactMatchValidator(['Table Input']),
        value: listValidatorOptionalOrEmptyOk(// optional to support optional Table Input questions
        listValidator(objectValidator({
            label: stringValidator,
            entry: stringValidatorOptionalEmptyOkay,
        })))
    }),
    description: objectValidator({
        type: exactMatchValidator(['description']),
        value: stringValidatorOptionalEmptyOkay,
    }),
    email: objectValidator({
        type: exactMatchValidator(['email']),
        value: emailValidatorOptional,
    }),
    number: objectValidator({
        type: exactMatchValidator(['number']),
        value: numberValidatorOptional,
    }),
    rating: objectValidator({
        type: exactMatchValidator(['rating']),
        value: numberValidatorOptional,
    }),
    phone: objectValidator({
        type: exactMatchValidator(['phone']),
        value: phoneValidatorOptional,
    }),
    string: objectValidator({
        type: exactMatchValidator(['string']),
        value: stringValidator5000Optional,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'number') {
                return __assign(__assign({}, o), { value: o.value.toString() });
            }
            if (Array.isArray(o === null || o === void 0 ? void 0 : o.value) && o.value.length === 1 && typeof (o === null || o === void 0 ? void 0 : o.value[0]) === 'string') {
                return __assign(__assign({}, o), { value: o.value[0] });
            }
            return o;
        })
    }),
    Time: objectValidator({
        type: exactMatchValidator(['Time']),
        value: stringValidator1000Optional,
    }),
    "Hidden Value": objectValidator({
        type: exactMatchValidator(['Hidden Value']),
        value: stringValidator1000Optional,
    }),
    "Emotii": objectValidator({
        type: exactMatchValidator(['Emotii']),
        value: stringValidator1000Optional,
    }),
    Stripe: objectValidator({
        type: exactMatchValidator(['Stripe']),
        value: stringValidator1000Optional,
    }),
    // need to keep consistent with other validation
    stringLong: objectValidator({
        type: exactMatchValidator(['stringLong']),
        value: stringValidator20000ptional,
    }),
    "Rich Text": objectValidator({
        type: exactMatchValidator(['Rich Text']),
        value: stringValidator25000OptionalEmptyOkay,
    }),
    date: objectValidator({
        type: exactMatchValidator(['date']),
        value: dateValidatorOptional,
    }),
    dateString: objectValidator({
        type: exactMatchValidator(['dateString']),
        value: stringValidator1000Optional,
    }),
    file: objectValidator({
        type: exactMatchValidator(['file']),
        value: objectValidator({
            name: stringValidator5000,
            secureName: stringValidator250,
            type: stringValidator1000Optional,
        }, { emptyOk: false, isOptional: true }),
    }),
    files: objectValidator({
        type: exactMatchValidator(['files']),
        value: listValidatorOptionalOrEmptyOk(objectValidator({
            name: stringValidator5000,
            secureName: stringValidator250,
            type: stringValidator1000Optional,
        }, { emptyOk: false, isOptional: true })),
    }),
    multiple_choice: objectValidator({
        type: exactMatchValidator(['multiple_choice']),
        value: listOfStringsValidatorOptionalOrEmptyOk,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [o.value] });
            }
            return o;
        })
    }),
    Dropdown: objectValidator({
        type: exactMatchValidator(['Dropdown']),
        value: listOfStringsValidatorOptionalOrEmptyOk,
    }, {
        inputModifier: (function (o) {
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [o.value] });
            }
            return o;
        })
    }),
    ranking: objectValidator({
        type: exactMatchValidator(['ranking']),
        value: listOfStringsValidatorOptionalOrEmptyOk,
    }),
    signature: objectValidator({
        type: exactMatchValidator(['signature']),
        value: objectValidator({
            fullName: stringValidator1000Optional,
            signed: booleanValidatorOptional,
            pdfAttachment: stringValidatorOptional,
            url: stringValidator1000Optional,
            signedPdfSecureName: stringReadonlyValidator, // created/set in backend only
        }, { emptyOk: false, isOptional: true }),
    }),
    "Database Select": objectValidator({
        type: exactMatchValidator(['Database Select']),
        value: listValidatorOptionalOrEmptyOk(objectValidator({
            recordId: stringValidatorOptional,
            databaseId: mongoIdStringOptional,
            text: stringValidator25000,
        }, { emptyOk: false, isOptional: true })),
    }, {
        inputModifier: (function (o) {
            var _a;
            if (typeof (o === null || o === void 0 ? void 0 : o.value) === 'string') {
                return __assign(__assign({}, o), { value: [{ text: o.value }] });
            }
            if (Array.isArray(o === null || o === void 0 ? void 0 : o.value) && typeof ((_a = o === null || o === void 0 ? void 0 : o.value) === null || _a === void 0 ? void 0 : _a[0]) === 'string') {
                return __assign(__assign({}, o), { value: o.value.map(function (text) { return ({ text: text }); }) });
            }
            return o;
        })
    }),
    "Medications": objectValidator({
        type: exactMatchValidator(['Medications']),
        value: listValidatorOptionalOrEmptyOk(objectValidator({
            displayTerm: stringValidatorOptionalEmptyOkay,
            drugName: stringValidatorOptionalEmptyOkay,
            drugSynonym: stringValidatorOptionalEmptyOkay,
            otherDrug: stringValidatorOptionalEmptyOkay,
            NDCs: listOfStringsValidatorOptionalOrEmptyOk,
            rxNormCode: stringValidatorOptionalEmptyOkay,
            fdbCode: stringValidatorOptionalEmptyOkay,
            reasonForTaking: stringValidatorOptionalEmptyOkay,
            dosage: objectValidator({
                description: stringValidatorOptionalEmptyOkay,
                value: stringValidatorOptionalEmptyOkay,
                unit: stringValidatorOptionalEmptyOkay,
                quantity: stringValidatorOptionalEmptyOkay,
                frequency: stringValidatorOptionalEmptyOkay,
                frequencyDescriptor: stringValidatorOptionalEmptyOkay,
            }, { emptyOk: true, isOptional: true }),
        }, { emptyOk: false, isOptional: true })),
    }),
    "Allergies": objectValidator({
        type: exactMatchValidator(['Allergies']),
        value: listValidatorOptionalOrEmptyOk(objectValidator({
            code: stringValidator100,
            display: stringValidator,
            system: stringValidatorOptional,
            note: stringValidatorOptional,
            severity: stringValidatorOptional,
        })),
    }),
    "Conditions": objectValidator({
        type: exactMatchValidator(['Conditions']),
        value: listValidatorOptionalOrEmptyOk(objectValidator({
            code: stringValidator100,
            display: stringValidator,
            system: stringValidator1000,
        })),
    }),
    Chargebee: objectValidator({
        type: exactMatchValidator(['Chargebee']),
        value: objectValidator({
            url: stringValidatorOptional
        }, { emptyOk: true, isOptional: true })
    })
});
export var mmddyyyyRegex = /^\d{2}-\d{2}-\d{4}$/;
export var photonDisabledForEnduser = function (enduser) { return !(enduser.fname && enduser.lname && enduser.gender && enduser.phone
    && enduser.dateOfBirth && mmddyyyyRegex.test(enduser.dateOfBirth)); };
export var fullscriptDisabledForEnduser = function (enduser) { return !(enduser.fname && enduser.lname && enduser.email); };
export var formResponseValidator = objectValidator({
    fieldId: stringValidatorOptionalEmptyOkay,
    fieldTitle: stringValidator5000EmptyOkay,
    fieldDescription: stringValidator5000Optional,
    fieldHtmlDescription: stringValidator25000OptionalEmptyOkay,
    answer: formResponseAnswerValidator,
    answerIsHTML: booleanValidatorOptional,
    externalId: stringValidatorOptional,
    sharedWithEnduser: booleanValidatorOptional,
    isCalledOut: booleanValidatorOptional,
    isHighlightedOnTimeline: booleanValidatorOptional,
    computedValueKey: stringValidatorOptional,
    disabled: booleanValidatorOptional,
    intakeField: stringValidatorOptionalEmptyOkay,
});
export var formResponsesValidator = listValidator(formResponseValidator);
export var intakePhoneValidator = exactMatchValidator(['optional', 'required', 'hidden']);
export var intakeDateOfBirthValidator = exactMatchValidator(['optional', 'required', 'hidden']);
export var formFieldValidator = function (options, fieldOptions) {
    if (options === void 0) { options = {}; }
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    return build_validator(function (v) { return isFormField(v, fieldOptions); }, __assign(__assign({}, options), { isObject: true, listOf: false }));
};
export var listOfFormFieldsValidator = function (options, fieldOptions) {
    if (options === void 0) { options = {}; }
    if (fieldOptions === void 0) { fieldOptions = { forUpdate: false }; }
    return build_validator(function (v) { return isFormField(v, fieldOptions); }, __assign(__assign({}, options), { isObject: true, listOf: true, emptyListOk: true }));
};
// // to ensure all topics in type have coverage at compile-time
// const _CHAT_ROOM_TOPICS: { [K in ChatRoomTopic]: any } = {
//   task: '',
//   enduser: '',
// }
// export const CHAT_ROOM_TOPICS = Object.keys(_CHAT_ROOM_TOPICS) as ChatRoomTopic[]
// export const chatRoomTopicValidator = exactMatchValidator<ChatRoomTopic>(CHAT_ROOM_TOPICS)
// to ensure all topics in type have coverage at compile-time
var _CHAT_ROOM_TYPES = {
    internal: '',
    external: '',
    'Group Chat': '',
};
export var CHAT_ROOM_TYPES = Object.keys(_CHAT_ROOM_TYPES);
export var chatRoomTypeValidator = exactMatchValidator(CHAT_ROOM_TYPES);
var _ACCOUNT_TYPES = {
    Business: '',
};
export var ACCOUNT_TYPES = Object.keys(_ACCOUNT_TYPES);
export var accountTypeValidator = exactMatchValidator(ACCOUNT_TYPES);
var _MESSAGE_TEMPLATE_TYPES = {
    enduser: '',
    team: '',
    Reply: '',
};
export var MESSAGE_TEMPLATE_TYPES = Object.keys(_MESSAGE_TEMPLATE_TYPES);
export var messageTemplateTypeValidator = exactMatchValidator(MESSAGE_TEMPLATE_TYPES);
var _MEETING_STATUSES = {
    ended: '',
    live: '',
    scheduled: '',
};
export var MEETING_STATUSES = Object.keys(_MEETING_STATUSES);
export var meetingStatusValidator = exactMatchValidator(MEETING_STATUSES);
var _CUD = {
    create: '',
    update: '',
    delete: '',
};
export var CUD = Object.keys(_CUD);
export var CUDStringValidator = exactMatchValidator(CUD);
export var CUDValidator = objectValidator({
    create: booleanValidatorOptional,
    update: booleanValidatorOptional,
    delete: booleanValidatorOptional,
}, { isOptional: true });
var _UNIT_OF_TIME = {
    Days: '',
    Hours: '',
    Minutes: '',
    Seconds: '',
};
export var UNITS_OF_TIME = Object.keys(_UNIT_OF_TIME);
export var UnitOfTimeValidator = exactMatchValidator(UNITS_OF_TIME);
var WebhookSubscriptionValidatorObject = {};
for (var model in WEBHOOK_MODELS) {
    WebhookSubscriptionValidatorObject[model] = CUDValidator;
}
export var WebhookSubscriptionValidator = objectValidator(WebhookSubscriptionValidatorObject, { throwOnUnrecognizedField: true });
export var sessionTypeValidator = exactMatchValidator(['user', 'enduser']);
export var sessionTypeOrAnyoneValidatorOptional = exactMatchValidatorOptional(['user', 'enduser', 'Anyone']);
export var listOfDisplayNameInfo = listValidator(objectValidator({
    fname: nameValidator,
    lname: nameValidator,
    id: listOfMongoIdStringValidator,
}));
export var attendeeInfoValidator = objectValidator({
    AttendeeId: stringValidator,
    ExternalUserId: mongoIdStringRequired,
    JoinToken: stringValidator,
});
export var attendeeValidator = objectValidator({
    type: sessionTypeValidator,
    id: mongoIdStringRequired,
    info: attendeeInfoValidator,
});
export var listOfAttendeesValidator = listValidator(attendeeValidator);
export var meetingInfoValidator = objectValidator({
    Meeting: objectAnyFieldsAnyValuesValidator,
});
export var userIdentityValidator = objectValidator({
    type: sessionTypeValidator,
    id: mongoIdStringRequired,
});
export var listOfUserIndentitiesValidator = listValidator(userIdentityValidator);
export var calendarEventAttendeeValidator = objectValidator({
    type: sessionTypeValidator,
    id: mongoIdStringRequired,
    joinLinkToken: stringValidatorOptionalEmptyOkay,
});
export var calendarEventAttendeesValidator = listValidator(calendarEventAttendeeValidator);
export var chatAttachmentValidator = objectValidator({
    type: stringValidator100,
    name: stringValidatorOptional,
    secureName: stringValidator250,
});
export var listOfChatAttachmentsValidator = listValidatorEmptyOk(chatAttachmentValidator);
export var genericAttachmentValidator = objectValidator({
    displayName: stringValidator1000,
    fileId: mongoIdStringRequired,
    type: stringValidatorOptional,
    secureName: stringValidator250,
});
export var listOfGenericAttachmentsValidator = listValidatorEmptyOk(genericAttachmentValidator);
export var meetingsListValidator = listValidator(objectValidator({
    id: mongoIdStringRequired,
    updatedAt: stringValidator,
    status: meetingStatusValidator,
}));
export var userDisplayInfoValidator = objectValidator({
    id: mongoIdStringRequired,
    createdAt: dateValidator,
    avatar: stringValidator,
    fname: nameValidator,
    lname: nameValidator,
    lastActive: dateValidator,
    lastLogout: dateValidator,
    email: emailValidator,
});
export var meetingDisplayInfoValidator = indexableValidator(mongoIdStringRequired, userDisplayInfoValidator);
export var chatRoomUserInfoValidator = objectAnyFieldsValidator(objectValidator({
    unreadCount: nonNegNumberValidator,
    markedUnread: booleanValidatorOptional,
}));
var _LIST_QUERY_QUALIFIERS = {
    "One Of": '',
    "All Of": "",
};
export var LIST_QUERY_QUALIFIERS = Object.keys(_LIST_QUERY_QUALIFIERS);
export var listQueryQualifiersValidator = exactMatchValidator(LIST_QUERY_QUALIFIERS);
export var listOfStringsWithQualifierValidator = objectValidator({
    qualifier: listQueryQualifiersValidator,
    values: listOfStringsValidator,
});
export var listOfStringsWithQualifierValidatorOptional = objectValidator({
    qualifier: listQueryQualifiersValidator,
    values: listOfStringsValidator,
}, { isOptional: true });
export var listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay = objectValidator({
    qualifier: listQueryQualifiersValidator,
    values: listOfStringsValidatorEmptyOk,
}, { isOptional: true });
var _AUTOMATION_ENDUSER_STATUS = {
    active: '',
    finished: '',
    cancelled: '',
    error: '',
};
export var AUTOMATION_ENDUSER_STATUS = Object.keys(_AUTOMATION_ENDUSER_STATUS);
export var automatedActionStatusValidator = exactMatchValidator(AUTOMATION_ENDUSER_STATUS);
var _AUTOMATION_EVENTS = {
    formResponse: '',
    formResponses: '',
    afterAction: '',
    onJourneyStart: '',
    formUnsubmitted: '',
    formsUnsubmitted: '',
    ticketCompleted: '',
    waitForTrigger: '',
};
export var AUTOMATION_EVENTS = Object.keys(_AUTOMATION_EVENTS);
export var automationEventTypeValidator = exactMatchValidator(AUTOMATION_EVENTS);
var _AUTOMATION_ACTIONS = {
    createTicket: '',
    createCarePlan: '',
    completeCarePlan: '',
    sendEmail: '',
    sendSMS: '',
    sendChat: '',
    pushFormsToPortal: '',
    sendForm: '',
    sendWebhook: '',
    setEnduserStatus: '',
    setEnduserFields: '',
    shareContent: '',
    notifyTeam: '',
    addEnduserTags: '',
    removeEnduserTags: '',
    addToJourney: '',
    removeFromJourney: '',
    removeFromAllJourneys: '',
    iterableSendEmail: '',
    iterableCustomEvent: '',
    zendeskCreateTicket: '',
    zusSync: '',
    zusPull: '',
    pagerDutyCreateIncident: '',
    smartMeterPlaceOrder: '',
    healthieSync: '',
    healthieAddToCourse: '',
    healthieSendChat: '',
    completeTickets: '',
    changeContactType: '',
    activeCampaignSync: '',
    activeCampaignAddToLists: '',
    switchToRelatedContact: '',
    canvasSync: '',
    elationSync: '',
    developHealthMedEligibility: '',
    cancelFutureAppointments: '',
    customerIOIdentify: '',
    customerIOTrack: '',
    addAccessTags: '',
    removeAccessTags: '',
    cancelCurrentEvent: '',
    confirmCurrentEvent: '',
};
export var AUTOMATION_ACTIONS = Object.keys(_AUTOMATION_ACTIONS);
export var automationActionTypeValidator = exactMatchValidator(AUTOMATION_ACTIONS);
var _COMMUNICATIONS_CHANNELS = {
    Email: '',
    SMS: '',
    Chat: '',
};
export var COMMUNICATIONS_CHANNELS = Object.keys(_COMMUNICATIONS_CHANNELS);
export var communicationsChannelValidator = exactMatchValidator(COMMUNICATIONS_CHANNELS);
export var communicationsChannelValidatorOptional = exactMatchValidatorOptional(COMMUNICATIONS_CHANNELS);
var _MESSAGE_TEMPLATE_MODES = {
    richtext: '',
    html: '',
};
export var MESSAGE_TEMPLATE_MODES = Object.keys(_MESSAGE_TEMPLATE_MODES);
export var messageTemplateModeValidator = exactMatchValidator(MESSAGE_TEMPLATE_MODES);
var sharedReminderValidators = {
    msBeforeStartTime: numberValidator,
    didRemind: booleanValidatorOptional,
    dontSendIfPassed: booleanValidatorOptional,
    dontSendIfJoined: booleanValidatorOptional,
};
export var calendarEventReminderValidator = orValidator({
    webhook: objectValidator(__assign({ info: objectValidator({}, { emptyOk: true, isOptional: true }), type: exactMatchValidator(['webhook']) }, sharedReminderValidators)),
    'add-to-journey': objectValidator(__assign({ info: objectValidator({
            journeyId: mongoIdStringRequired,
        }), type: exactMatchValidator(['add-to-journey']) }, sharedReminderValidators)),
    'Remove From Journey': objectValidator(__assign({ info: objectValidator({
            journeyId: mongoIdStringRequired,
        }), type: exactMatchValidator(['Remove From Journey']) }, sharedReminderValidators)),
    "enduser-notification": objectValidator(__assign({ info: objectValidator({
            templateId: mongoIdStringOptional,
            channel: communicationsChannelValidatorOptional,
        }, { emptyOk: true }), type: exactMatchValidator(['enduser-notification']) }, sharedReminderValidators)),
    "user-notification": objectValidator(__assign({ info: objectValidator({
            templateId: mongoIdStringOptional,
            channel: communicationsChannelValidatorOptional,
        }, { emptyOk: true }), type: exactMatchValidator(['user-notification']) }, sharedReminderValidators)),
    "create-ticket": objectValidator(__assign({ info: objectValidator({
            title: stringValidator1000Optional,
        }, { emptyOk: true }), type: exactMatchValidator(['create-ticket']) }, sharedReminderValidators)),
});
export var listOfCalendarEventRemindersValidator = listValidatorEmptyOk(calendarEventReminderValidator);
export var cancelConditionValidator = orValidator({
    formResponse: objectValidator({
        type: exactMatchValidator(['formResponse']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    formResponses: objectValidator({
        type: exactMatchValidator(['formResponses']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
            unsubmittedFormCount: numberValidator,
        }, { emptyOk: false }),
    }),
});
export var cancelConditionsValidator = listOfObjectsValidator({
    type: exactMatchValidator(['formResponse']),
    info: objectValidator({
        automationStepId: mongoIdStringRequired,
    }, { emptyOk: false }),
});
export var cancelConditionsValidatorOptional = listValidatorOptionalOrEmptyOk(objectValidator({
    type: exactMatchValidator(['formResponse']),
    info: objectValidator({
        automationStepId: mongoIdStringRequired,
    }, { emptyOk: false }),
}));
var delayValidation = {
    automationStepId: mongoIdStringRequired,
    delayInMS: nonNegNumberValidator,
    delay: nonNegNumberValidator,
    unit: UnitOfTimeValidator,
    cancelConditions: cancelConditionsValidatorOptional,
    officeHoursOnly: booleanValidatorOptional,
    abTestCondition: stringValidatorOptionalEmptyOkay,
};
export var automationEventValidator = orValidator({
    formResponse: objectValidator({
        type: exactMatchValidator(['formResponse']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    formResponses: objectValidator({
        type: exactMatchValidator(['formResponses']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    afterAction: objectValidator({
        type: exactMatchValidator(['afterAction']),
        info: objectValidator(__assign(__assign({}, delayValidation), { formCondition: objectValidator({
                formId: mongoIdStringRequired,
                formFieldId: mongoIdStringRequired,
                before: booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true, }), fieldCondition: objectValidator({
                field: stringValidator,
                before: booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true, }), eventCondition: objectValidator({
                before: booleanValidatorOptional,
            }, { isOptional: true, emptyOk: true }) }), { emptyOk: false }),
    }),
    formUnsubmitted: objectValidator({
        type: exactMatchValidator(['formUnsubmitted']),
        info: objectValidator(__assign(__assign({}, delayValidation), { automationStepId: mongoIdStringRequired }), { emptyOk: false }),
    }),
    formsUnsubmitted: objectValidator({
        type: exactMatchValidator(['formsUnsubmitted']),
        info: objectValidator(__assign(__assign({}, delayValidation), { automationStepId: mongoIdStringRequired }), { emptyOk: false }),
    }),
    onJourneyStart: objectValidator({
        type: exactMatchValidator(['onJourneyStart']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    ticketCompleted: objectValidator({
        type: exactMatchValidator(['ticketCompleted']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
            closedForReason: stringValidatorOptional,
        }, { emptyOk: false }),
    }),
    waitForTrigger: objectValidator({
        type: exactMatchValidator(['waitForTrigger']),
        info: objectValidator({
            automationStepId: mongoIdStringRequired,
            triggerId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
});
export var automationEventsValidator = listValidatorEmptyOk(automationEventValidator);
export var automationConditionValidator = orValidator({
    atJourneyState: objectValidator({
        type: exactMatchValidator(['atJourneyState']),
        info: objectValidator({ state: stringValidator100, journeyId: mongoIdStringRequired }, { emptyOk: false }),
    }),
});
export var listOfAutomationConditionsValidator = listValidatorEmptyOk(automationConditionValidator);
export var ticketReminderValidator = objectValidator({
    msBeforeDueDate: numberValidator,
    didRemind: booleanValidatorOptional,
    queueId: mongoIdStringOptional,
});
export var ticketActionValidator = orValidator({
    "Complete Form": objectValidator({
        type: exactMatchValidator(['Complete Form']),
        info: objectValidator({
            formId: mongoIdStringRequired,
            formResponseId: mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: dateOptionalOrEmptyStringValidator,
        optional: booleanValidatorOptional,
    }),
    "Create Prescription": objectValidator({
        type: exactMatchValidator(['Create Prescription']),
        info: objectValidator({}, { emptyOk: true, isOptional: true }),
        completedAt: dateOptionalOrEmptyStringValidator,
        optional: booleanValidatorOptional,
    }),
    "Send SMS": objectValidator({
        type: exactMatchValidator(['Send SMS']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            smsId: mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: dateOptionalOrEmptyStringValidator,
        optional: booleanValidatorOptional,
    }),
    "Send Email": objectValidator({
        type: exactMatchValidator(['Send Email']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            emailId: mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: dateOptionalOrEmptyStringValidator,
        optional: booleanValidatorOptional,
    }),
    "Send Chat": objectValidator({
        type: exactMatchValidator(['Send Chat']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            chatId: mongoIdStringOptional,
            chatRoomId: mongoIdStringOptional,
        }, { emptyOk: false }),
        completedAt: dateOptionalOrEmptyStringValidator,
        optional: booleanValidatorOptional,
    }),
});
export var ticketActionsValidator = listValidatorOptionalOrEmptyOk(ticketActionValidator);
export var senderAssignmentStrategyValidatorOptional = orValidator({
    'Care Team Primary': objectValidator({
        type: exactMatchValidator(['Care Team Primary']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    'Default': objectValidator({
        type: exactMatchValidator(['Default']),
        info: objectValidator({}, { emptyOk: true }),
    }),
}, { isOptional: true });
export var smartMeterLinesValidator = listValidator(objectValidator({
    quantity: nonNegNumberValidator,
    sku: stringValidator,
}));
export var automationForMessageValidator = objectValidator({
    senderId: mongoIdStringRequired,
    templateId: mongoIdStringRequired,
    assignment: senderAssignmentStrategyValidatorOptional,
    sendToDestinationOfRelatedContactTypes: listOfStringsValidatorOptionalOrEmptyOk,
}, { emptyOk: false });
export var developHealthDrugsValidator = listValidator(objectValidator({
    name: stringValidator,
    dosage: stringValidator,
    quantity: numberValidator,
}));
export var developHealthDiagnosesValidator = listValidatorEmptyOk(objectValidator({
    code: stringValidator,
}));
export var developHealthMockResultValidator = objectValidator({
    status: stringValidator,
    case: stringValidator,
}, { emptyOk: true, isOptional: true });
export var automationActionValidator = orValidator({
    developHealthMedEligibility: objectValidator({
        type: exactMatchValidator(['developHealthMedEligibility']),
        info: objectValidator({
            drugs: developHealthDrugsValidator,
            diagnoses: developHealthDiagnosesValidator,
            mock_result: developHealthMockResultValidator,
            providerUserId: mongoIdStringRequired,
        }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    setEnduserStatus: objectValidator({
        type: exactMatchValidator(['setEnduserStatus']),
        info: objectValidator({ status: stringValidator250 }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    sendEmail: objectValidator({
        type: exactMatchValidator(['sendEmail']),
        info: objectValidator({
            senderId: mongoIdStringRequired,
            templateId: mongoIdStringRequired,
            assignment: senderAssignmentStrategyValidatorOptional,
            fromEmailOverride: emailValidatorOptional,
            sendToDestinationOfRelatedContactTypes: listOfStringsValidatorOptionalOrEmptyOk,
        }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    sendSMS: objectValidator({
        type: exactMatchValidator(['sendSMS']),
        info: automationForMessageValidator,
        continueOnError: booleanValidatorOptional,
    }),
    notifyTeam: objectValidator({
        type: exactMatchValidator(['notifyTeam']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            forAssigned: booleanValidator,
            roles: listOfStringsValidatorOptionalOrEmptyOk,
            tags: listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
        }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    sendForm: objectValidator({
        type: exactMatchValidator(['sendForm']),
        info: objectValidator({
            senderId: mongoIdStringRequired,
            formId: mongoIdStringRequired,
            channel: communicationsChannelValidatorOptional,
            assignment: senderAssignmentStrategyValidatorOptional,
        }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    shareContent: objectValidator({
        type: exactMatchValidator(['shareContent']),
        info: objectValidator({
            managedContentRecordIds: listOfMongoIdStringValidator,
        }, { emptyOk: false }),
        continueOnError: booleanValidatorOptional,
    }),
    createTicket: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['createTicket']),
        info: objectValidator({
            title: stringValidator1000,
            description: stringValidatorOptionalEmptyOkay,
            assignmentStrategy: orValidator({
                'care-team-random': objectValidator({
                    type: exactMatchValidator(['care-team-random']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
                'care-team-primary': objectValidator({
                    type: exactMatchValidator(['care-team-primary']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
                'previous-owner': objectValidator({
                    type: exactMatchValidator(['previous-owner']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
                'by-tags': objectValidator({
                    type: exactMatchValidator(['by-tags']),
                    info: listOfStringsWithQualifierValidator,
                }),
                'queue': objectValidator({
                    type: exactMatchValidator(['queue']),
                    info: objectValidator({
                        queueId: mongoIdStringRequired,
                        tags: listOfStringsWithQualifierValidatorOptional,
                    }),
                }),
                'Recently-Booked Appointment Host': objectValidator({
                    type: exactMatchValidator(['Recently-Booked Appointment Host']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
                'Form Submitter for Journey Trigger': objectValidator({
                    type: exactMatchValidator(['Form Submitter for Journey Trigger']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
                'default': objectValidator({
                    type: exactMatchValidator(['default']),
                    info: objectValidator({}, { emptyOk: true }),
                }),
            }),
            closeReasons: listOfStringsValidatorOptionalOrEmptyOk,
            restrictByState: booleanValidatorOptional,
            restrictByCareTeam: booleanValidatorOptional,
            defaultAssignee: mongoIdStringRequired,
            forCarePlan: booleanValidatorOptional,
            hiddenFromTickets: booleanValidatorOptional,
            htmlDescription: stringValidator100000OptionalEmptyOkay,
            actions: ticketActionsValidator,
            dueDateOffsetInMS: numberValidatorOptional,
            skipDaysOfWeekForDueDate: listOfNumbersValidatorUniqueOptionalOrEmptyOkay,
            closeOnFinishedActions: booleanValidatorOptional,
            requireConfirmation: booleanValidatorOptional,
            reminders: listValidatorOptionalOrEmptyOk(ticketReminderValidator),
            priority: numberValidatorOptional,
            preserveContext: booleanValidatorOptional,
            tags: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
            contextFormIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
            contextEnduserFields: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
        }, { emptyOk: false }),
    }),
    sendWebhook: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['sendWebhook']),
        info: objectValidator({
            message: stringValidator5000,
            url: stringValidator20000ptional,
            fields: labeledFieldsValidator,
            secret: stringValidatorOptional,
        }, { emptyOk: false }),
    }),
    setEnduserFields: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['setEnduserFields']),
        info: objectValidator({
            fields: listValidator(objectValidator({
                name: stringValidator,
                type: stringValidator,
                value: stringValidator,
                increment: numberValidatorOptional,
            }))
        }, { emptyOk: false }),
    }),
    addEnduserTags: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['addEnduserTags']),
        info: objectValidator({
            tags: listOfStringsValidator,
            replaceExisting: booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    removeEnduserTags: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['removeEnduserTags']),
        info: objectValidator({
            tags: listOfStringsValidator,
        }, { emptyOk: false }),
    }),
    addAccessTags: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['addAccessTags']),
        info: objectValidator({
            tags: listOfStringsValidator,
            replaceExisting: booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    removeAccessTags: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['removeAccessTags']),
        info: objectValidator({
            tags: listOfStringsValidator,
        }, { emptyOk: false }),
    }),
    addToJourney: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['addToJourney']),
        info: objectValidator({
            journeyId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    removeFromJourney: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['removeFromJourney']),
        info: objectValidator({
            journeyId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    removeFromAllJourneys: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['removeFromAllJourneys']),
        info: objectValidator({}, { emptyOk: true, isOptional: true }),
    }),
    iterableSendEmail: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['iterableSendEmail']),
        info: objectValidator({
            campaignId: stringValidator,
        }, { emptyOk: false }),
    }),
    iterableCustomEvent: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['iterableCustomEvent']),
        info: objectValidator({
            eventName: stringValidator,
            description: stringValidator,
            dataFieldsMapping: listValidatorOptionalOrEmptyOk(objectValidator({
                iterable: stringValidator,
                tellescope: stringValidator,
            })),
            environment: stringValidatorOptional,
            customEmailField: stringValidatorOptional,
        }, { emptyOk: false }),
    }),
    zendeskCreateTicket: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['zendeskCreateTicket']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            defaultSenderId: mongoIdStringRequired,
        }, { emptyOk: false }),
    }),
    createCarePlan: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['createCarePlan']),
        info: objectValidator({
            title: stringValidator1000,
            htmlDescription: stringValidator100000EmptyOkay,
            hideRemainingTicketsProgress: booleanValidatorOptional,
            highlightedEnduserFields: listOfStringsValidatorOptionalOrEmptyOk,
            closeAutomaticallyByTicket: booleanValidatorOptional,
        }, { emptyOk: false }),
    }),
    completeCarePlan: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['completeCarePlan']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    zusSync: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['zusSync']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    zusPull: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['zusPull']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    pagerDutyCreateIncident: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['pagerDutyCreateIncident']),
        info: objectValidator({
            title: stringValidator,
            type: stringValidator,
            serviceId: stringValidator,
        }),
    }),
    smartMeterPlaceOrder: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['smartMeterPlaceOrder']),
        info: objectValidator({
            lines: smartMeterLinesValidator,
            shipping: stringValidator100,
        }),
    }),
    sendChat: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['sendChat']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            identifier: stringValidator100,
            includeCareTeam: booleanValidatorOptional,
            userIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
    }),
    healthieSync: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['healthieSync']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    elationSync: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['elationSync']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    canvasSync: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['canvasSync']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    healthieAddToCourse: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['healthieAddToCourse']),
        info: objectValidator({ courseId: stringValidator100 }),
    }),
    healthieSendChat: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['healthieSendChat']),
        info: objectValidator({
            templateId: mongoIdStringRequired,
            identifier: stringValidator100,
            includeCareTeam: booleanValidatorOptional,
        }),
    }),
    completeTickets: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['completeTickets']),
        info: objectValidator({
            journeyIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
    }),
    changeContactType: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['changeContactType']),
        info: objectValidator({
            type: stringValidatorOptional, // can be empty string for default contact type or id for others
        }),
    }),
    activeCampaignSync: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['activeCampaignSync']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    activeCampaignAddToLists: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['activeCampaignAddToLists']),
        info: objectValidator({
            listIds: listOfStringsValidator,
        }),
    }),
    switchToRelatedContact: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['switchToRelatedContact']),
        info: objectValidator({
            type: stringValidator100,
            otherTypes: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
        }, {}),
    }),
    pushFormsToPortal: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['pushFormsToPortal']),
        info: objectValidator({
            formIds: listOfMongoIdStringValidator,
        }, { emptyOk: false }),
    }),
    cancelFutureAppointments: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['cancelFutureAppointments']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    customerIOIdentify: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['customerIOIdentify']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    customerIOTrack: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['customerIOTrack']),
        info: objectValidator({
            event: stringValidator,
            trackProperties: listOfStringsValidatorOptionalOrEmptyOk,
        }, { emptyOk: false }),
    }),
    cancelCurrentEvent: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['cancelCurrentEvent']),
        info: objectValidator({}, { emptyOk: true, isOptional: true }),
    }),
    confirmCurrentEvent: objectValidator({
        continueOnError: booleanValidatorOptional,
        type: exactMatchValidator(['confirmCurrentEvent']),
        info: objectValidator({}, { emptyOk: true, isOptional: true }),
    }),
});
export var journeyContextValidator = objectValidator({
    calendarEventId: mongoIdStringOptional,
    formResponseId: mongoIdStringOptional,
    purchaseId: mongoIdStringOptional,
    templateId: mongoIdStringOptional,
    orderId: mongoIdStringOptional,
    observationId: mongoIdStringOptional,
    phoneCallId: mongoIdStringOptional,
    smsId: mongoIdStringOptional,
    chatId: mongoIdStringOptional,
    emailId: mongoIdStringOptional,
    formGroupId: mongoIdStringOptional,
    publicIdentifier: stringValidatorOptional,
    databaseRecordId: mongoIdStringOptional,
    databaseRecordCreator: mongoIdStringOptional,
    eligibilityResultId: mongoIdStringOptional,
    fileId: mongoIdStringOptional,
});
export var relatedRecordValidator = objectValidator({
    type: stringValidator100,
    id: stringValidator100,
    creator: mongoIdStringOptional,
    environment: stringValidatorOptional,
});
export var listOfRelatedRecordsValidator = listValidatorEmptyOk(relatedRecordValidator);
export var relatedRecordsValidatorOptional = listValidatorOptionalOrEmptyOk(relatedRecordValidator);
export var searchOptionsValidator = objectValidator({
    query: stringValidator100,
});
export var notificationPreferenceValidator = objectValidator({
    email: booleanValidatorOptional,
});
export var notificationPreferencesValidator = objectAnyFieldsValidator(notificationPreferenceValidator);
export var FHIRObservationCategoryValidator = exactMatchValidator(['vital-signs']);
var _FHIR_OBSERVATION_STATUS_CODES = {
    "entered-in-error": '',
    amended: '',
    cancelled: '',
    corrected: '',
    final: '',
    preliminary: '',
    registered: '',
    unknown: '',
};
export var FHIR_OBSERVATION_STATUS_CODES = Object.keys(_FHIR_OBSERVATION_STATUS_CODES);
export var FHIRObservationStatusCodeValidator = exactMatchValidator(FHIR_OBSERVATION_STATUS_CODES);
export var FHIRObservationValueValidator = objectValidator({
    unit: stringValidator,
    value: numberValidator,
});
export var previousFormFieldValidator = orValidator({
    root: objectValidator({
        type: exactMatchValidator(['root']),
        info: objectValidator({}, { emptyOk: true }),
    }),
    "after": objectValidator({
        type: exactMatchValidator(['after']),
        info: objectValidator({ fieldId: mongoIdStringRequired }, { emptyOk: false }),
    }),
    "previousEquals": objectValidator({
        type: exactMatchValidator(['previousEquals']),
        info: objectValidator({
            fieldId: mongoIdStringRequired,
            equals: stringValidator250,
        }, { emptyOk: false }),
    }),
    "compoundLogic": objectValidator({
        type: exactMatchValidator(['compoundLogic']),
        info: objectValidator({
            fieldId: mongoIdStringRequired,
            priority: numberValidator,
            label: stringValidatorOptionalEmptyOkay,
            condition: objectAnyFieldsAnyValuesValidator,
        }, { emptyOk: false }),
    }),
});
export var previousFormFieldsValidator = listValidatorEmptyOk(previousFormFieldValidator);
export var portalSettingsValidator = objectValidator({
    authentication: objectValidator({
        landingTitle: stringValidator1000Optional,
        landingGraphic: stringValidator1000Optional,
        landingLogo: stringValidator1000Optional,
        loginDescription: stringValidator1000Optional,
        loginGraphic: stringValidator1000Optional,
        loginTitle: stringValidator1000Optional,
        registerDescription: stringValidator1000Optional,
        registerGraphic: stringValidator1000Optional,
        registerTitle: stringValidator1000Optional,
        hideRegister: booleanValidatorOptional,
        dontPromptSetPassword: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    communication: objectValidator({
        allowEnduserInitiatedChat: booleanValidatorOptional,
        allowChatCareTeamSelection: booleanValidatorOptional,
        sendEmailNotificationsToEnduser: booleanValidatorOptional,
        sendSMSNotificationsToEnduser: booleanValidatorOptional,
        enduserInitiatedChatDefaultSubject: stringValidator5000OptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
    orders: objectValidator({
        customOrderTrackingURL: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
    documents: objectValidator({
        hideMissingAnswers: booleanValidatorOptional,
        availableFormsTitle: stringValidatorOptionalEmptyOkay,
        outstandingFormsTitle: stringValidatorOptionalEmptyOkay,
    }, { isOptional: true, emptyOk: true }),
});
export var organizationThemeValidator = objectValidator({
    logoURL: stringValidatorOptional,
    themeColor: stringValidatorOptional,
    themeColorSecondary: stringValidatorOptional,
    name: stringValidator250,
    subdomain: stringValidator250,
    businessId: mongoIdStringRequired,
    faviconURL: stringValidator250,
    customPortalURL: stringValidator250,
    portalSettings: portalSettingsValidator,
    organizationIds: listOfStringsValidatorOptionalOrEmptyOk,
    customPrivacyPolicy: stringValidatorOptional,
    customTermsOfService: stringValidatorOptional,
    requireCustomTermsOnMagicLink: booleanValidatorOptional,
});
var _MANAGED_CONTENT_RECORD_TYPES = {
    Article: '',
    PDF: '',
    Video: '',
};
export var MANAGED_CONTENT_RECORD_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_TYPES);
export var managedContentRecordTypeValidator = exactMatchValidator(MANAGED_CONTENT_RECORD_TYPES);
var _MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = {
    'All': '',
    'By Tags': '',
    Manual: '',
    Individual: '',
};
export var MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES = Object.keys(_MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES);
export var managedContentRecordAssignmentTypeValidator = exactMatchValidator(MANAGED_CONTENT_RECORD_ASSIGNMENT_TYPES);
export var passwordValidator = {
    getExample: getExampleString,
    getType: getTypeString,
    validate: (function (o) { return build_validator(function (password) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof password !== 'string') {
            throw new Error("Password must be a string");
        }
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (((_b = (_a = password.match(/[a-z]/g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1 // 1 lowercase
            || (((_d = (_c = password.match(/[A-Z]/g)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) < 1 // 1 uppercase
                && ((_f = (_e = password.match(/[0-9]/g)) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) < 1 // 1 number
                && ((_h = (_g = password.match(/[^a-zA-Z0-9]/g)) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0) < 1 // 1 special character
            )) {
            console.error('bad password regex');
            throw new Error('Password must included 1 uppercase letter, 1 number, or 1 symbol');
        }
        return password;
    }, __assign(__assign({}, o), { listOf: false, emptyStringOk: false })); }),
};
export var flowchartUIValidator = objectValidator({
    x: numberValidator,
    y: numberValidator,
}, { emptyOk: true });
export var integrationAuthenticationsValidator = objectValidator({
    type: exactMatchValidator(['oauth2', 'apiKey']),
    info: objectValidator({
        access_token: stringValidator250,
        refresh_token: stringValidator250,
        scope: stringValidator25000EmptyOkay,
        expiry_date: nonNegNumberValidator,
        token_type: exactMatchValidator(['Bearer']),
        external_id: stringValidatorOptional,
        state: stringValidatorOptional,
        email: emailValidatorOptional,
    }),
});
var _TABLE_INPUT_TYPES = {
    Date: '',
    Text: '',
    Select: '',
    Database: '',
};
export var TABLE_INPUT_TYPES = Object.keys(_TABLE_INPUT_TYPES);
export var tableInputTypesValidator = exactMatchValidator(TABLE_INPUT_TYPES);
export var tableInputChoiceValidator = orValidator({
    Text: objectValidator({
        type: exactMatchValidator(['Text']),
        label: stringValidator1000,
        info: optionalEmptyObjectValidator,
    }),
    Date: objectValidator({
        type: exactMatchValidator(['Date']),
        label: stringValidator1000,
        info: optionalEmptyObjectValidator,
    }),
    Select: objectValidator({
        type: exactMatchValidator(['Select']),
        label: stringValidator1000,
        info: objectValidator({
            choices: listOfStringsValidator,
        }),
    }),
    Database: objectValidator({
        type: exactMatchValidator(['Database']),
        label: stringValidator1000,
        info: objectValidator({
            databaseId: mongoIdStringRequired,
            databaseLabel: stringValidator1000,
        }),
    }),
});
export var formFieldFeedbackValidator = objectValidator({
    ifEquals: stringValidator,
    display: stringValidator,
});
export var canvasCodingValidator = objectValidator({
    code: stringValidator,
    display: stringValidator,
    system: stringValidator,
}, {});
export var canvasCodingValidatorOptional = objectValidator({
    code: stringValidatorOptional,
    display: stringValidatorOptional,
    system: stringValidatorOptional,
}, {});
export var formFieldOptionsValidator = objectValidator({
    default: stringValidatorOptional,
    bookingPageId: stringValidatorOptional,
    tableChoices: listValidatorOptionalOrEmptyOk(tableInputChoiceValidator),
    choices: listOfStringsValidatorOptionalOrEmptyOk,
    canvasCodings: listValidatorOptionalOrEmptyOk(canvasCodingValidator),
    from: numberValidatorOptional,
    to: numberValidatorOptional,
    other: booleanValidatorOptional,
    radio: booleanValidatorOptional,
    pdfAttachment: stringValidator5000Optional,
    subFields: listValidatorOptionalOrEmptyOk(objectValidator({
        id: mongoIdStringRequired,
    })),
    validFileTypes: listOfStringsValidatorOptionalOrEmptyOk,
    productIds: listOfStringsValidatorOptionalOrEmptyOk,
    chargeImmediately: booleanValidatorOptional,
    signatureUrl: stringValidator5000Optional,
    maxLength: numberValidatorOptional,
    minLength: numberValidatorOptional,
    repeat: booleanValidatorOptional,
    databaseId: mongoIdStringOptional,
    databaseLabel: stringValidatorOptionalEmptyOkay,
    databaseLabels: listOfStringsValidatorOptionalOrEmptyOk,
    databaseFilter: objectValidator({
        databaseLabel: stringValidator1000Optional,
        fieldId: mongoIdStringOptional,
    }, { isOptional: true, emptyOk: true }),
    useDatePicker: booleanValidatorOptional,
    sharedIntakeFields: listOfStringsValidatorOptionalOrEmptyOk,
    hiddenDefaultFields: listOfStringsValidatorOptionalOrEmptyOk,
    copyResponse: booleanValidatorOptional,
    disableGoBack: booleanValidatorOptional,
    disableNext: booleanValidatorOptional,
    canvasConsentCategory: objectValidator({
        code: stringValidator,
        display: stringValidator,
        system: stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentCoding: objectValidator({
        code: stringValidator,
        system: stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentType: objectValidator({
        code: stringValidator,
        system: stringValidator,
        display: stringValidator,
    }, { isOptional: true, emptyOk: true }),
    canvasDocumentComment: stringValidatorOptional,
    canvasReviewMode: stringValidatorOptional,
    customPriceMessage: stringValidatorOptional,
    billingProvider: stringValidatorOptional,
    addressFields: listOfStringsValidatorOptionalOrEmptyOk,
    validStates: listOfStringsValidatorOptionalOrEmptyOk,
    autoAdvance: booleanValidatorOptional,
    autoSubmit: booleanValidatorOptional,
    userTags: listOfStringsValidatorOptionalOrEmptyOk,
    userFilterTags: listOfStringsValidatorOptionalOrEmptyOk,
    prefillSignature: booleanValidatorOptional,
    requirePredefinedInsurer: booleanValidatorOptional,
    includeGroupNumber: booleanValidatorOptional,
    holdAppointmentMinutes: numberValidatorOptional,
    rangeStepSize: numberValidatorOptional,
    redirectFormId: mongoIdStringOptional,
    redirectExternalUrl: stringValidatorOptional,
    customTypeId: mongoIdStringOptional,
    groupPadding: numberValidatorOptional,
    saveIntakeOnPartial: booleanValidatorOptional,
    max: numberValidatorOptional,
    min: numberValidatorOptional,
    stripeKey: stringValidatorOptionalEmptyOkay,
    dataSource: stringValidatorOptionalEmptyOkay,
    esignatureTermsCompanyName: stringValidatorOptionalEmptyOkay,
    observationCode: stringValidatorOptionalEmptyOkay,
    observationDisplay: stringValidatorOptionalEmptyOkay,
    observationUnit: stringValidatorOptionalEmptyOkay,
    autoUploadFiles: booleanValidatorOptional,
    chargebeeEnvironment: stringValidatorOptional,
    chargebeePlanId: stringValidatorOptional,
    chargebeeItemId: stringValidatorOptional,
    relatedContactTypes: listOfStringsValidatorOptionalOrEmptyOk,
});
export var blockValidator = orValidator({
    h1: objectValidator({
        type: exactMatchValidator(['h1']),
        info: objectValidator({
            text: stringValidator5000EmptyOkay,
        }),
    }),
    h2: objectValidator({
        type: exactMatchValidator(['h2']),
        info: objectValidator({
            text: stringValidator5000EmptyOkay,
        }),
    }),
    html: objectValidator({
        type: exactMatchValidator(['html']),
        info: objectValidator({
            html: stringValidator25000EmptyOkay,
        }),
    }),
    image: objectValidator({
        type: exactMatchValidator(['image']),
        info: objectValidator({
            link: stringValidator5000EmptyOkay,
            name: stringValidatorOptional,
            height: numberValidatorOptional,
            maxHeight: numberValidatorOptional,
            width: numberValidatorOptional,
            maxWidth: numberValidatorOptional,
        }),
    }),
    pdf: objectValidator({
        type: exactMatchValidator(['pdf']),
        info: objectValidator({
            link: stringValidator5000EmptyOkay,
            name: stringValidatorOptional,
            height: numberValidatorOptional,
            maxHeight: numberValidatorOptional,
            width: numberValidatorOptional,
            maxWidth: numberValidatorOptional,
        }),
    }),
    youtube: objectValidator({
        type: exactMatchValidator(['youtube']),
        info: objectValidator({
            link: stringValidator5000EmptyOkay,
            name: stringValidatorOptional,
            height: numberValidatorOptional,
            maxHeight: numberValidatorOptional,
            width: numberValidatorOptional,
            maxWidth: numberValidatorOptional,
        }),
    }),
    iframe: objectValidator({
        type: exactMatchValidator(['iframe']),
        info: objectValidator({
            link: stringValidator5000EmptyOkay,
            name: stringValidatorOptional,
            height: numberValidatorOptional,
            maxHeight: numberValidatorOptional,
            width: numberValidatorOptional,
            maxWidth: numberValidatorOptional,
        }),
    }),
    "content-link": objectValidator({
        type: exactMatchValidator(["content-link"]),
        info: objectValidator({
            recordId: mongoIdStringRequired,
        }),
    }),
});
var _BLOCK_TYPES = {
    h1: '',
    h2: '',
    html: '',
    image: '',
    pdf: '',
    youtube: '',
    iframe: '',
    "content-link": '',
};
export var BLOCK_TYPES = Object.keys(_BLOCK_TYPES);
export var blockTypeValidator = exactMatchValidator(BLOCK_TYPES);
export var is_block_type = function (type) { return BLOCK_TYPES.includes(type); };
export var blocksValidator = listValidatorEmptyOk(blockValidator);
var _DATABASE_RECORD_FIELD_TYPES = {
    Text: '',
    "Text Long": '',
    "Text List": '',
    Number: '',
    Address: '',
    'Multiple Select': '',
    Email: '',
    Phone: '',
    Date: '',
    Dropdown: '',
    Timestamp: '',
};
export var DATABASE_RECORD_FIELD_TYPES = Object.keys(_DATABASE_RECORD_FIELD_TYPES);
export var databaseRecordFieldTypeValidator = exactMatchValidator(DATABASE_RECORD_FIELD_TYPES);
export var is_database_record_field_type = function (type) { return DATABASE_RECORD_FIELD_TYPES.includes(type); };
export var databaseFieldValidator = orValidator({
    Text: objectValidator({
        type: exactMatchValidator(['Text']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    Email: objectValidator({
        type: exactMatchValidator(['Email']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    Phone: objectValidator({
        type: exactMatchValidator(['Phone']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Text Long': objectValidator({
        type: exactMatchValidator(['Text Long']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Text List': objectValidator({
        type: exactMatchValidator(['Text List']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Number': objectValidator({
        type: exactMatchValidator(['Number']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Address': objectValidator({
        type: exactMatchValidator(['Address']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Multiple Select': objectValidator({
        type: exactMatchValidator(['Multiple Select']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
            options: listOfStringsValidatorEmptyOk,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Dropdown': objectValidator({
        type: exactMatchValidator(['Dropdown']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
            options: listOfStringsValidatorEmptyOk,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Timestamp': objectValidator({
        type: exactMatchValidator(['Timestamp']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
    'Date': objectValidator({
        type: exactMatchValidator(['Date']),
        label: stringValidator250,
        showConditions: optionalAnyObjectValidator,
        hideFromTable: booleanValidatorOptional,
        wrap: stringValidatorOptional,
        required: booleanValidatorOptional,
        options: objectValidator({
            width: stringValidatorOptionalEmptyOkay,
        }, { isOptional: true, emptyOk: true }),
    }),
});
export var databaseFieldsValidator = listValidator(databaseFieldValidator);
export var databaseRecordValueValidator = orValidator({
    Text: objectValidator({
        type: exactMatchValidator(['Text']),
        value: stringValidator5000OptionalEmptyOkay,
        label: stringValidator250,
    }),
    Phone: objectValidator({
        type: exactMatchValidator(['Phone']),
        value: phoneValidatorOptional,
        label: stringValidator250,
    }),
    Email: objectValidator({
        type: exactMatchValidator(['Email']),
        value: emailValidatorOptional,
        label: stringValidator250,
    }),
    'Text Long': objectValidator({
        type: exactMatchValidator(['Text Long']),
        value: stringValidator5000OptionalEmptyOkay,
        label: stringValidator250,
    }),
    'Text List': objectValidator({
        type: exactMatchValidator(['Text List']),
        value: listOfStringsValidatorOptionalOrEmptyOk,
        label: stringValidator250,
    }),
    'Number': objectValidator({
        type: exactMatchValidator(['Number']),
        value: numberValidatorOptional,
        label: stringValidator250,
    }),
    'Address': objectValidator({
        type: exactMatchValidator(['Address']),
        value: addressOptionalValidator,
        label: stringValidator250,
    }),
    'Multiple Select': objectValidator({
        type: exactMatchValidator(['Multiple Select']),
        value: listOfStringsValidatorOptionalOrEmptyOk,
        label: stringValidator250,
    }),
    'Dropdown': objectValidator({
        type: exactMatchValidator(['Dropdown']),
        value: stringValidatorOptional,
        label: stringValidator250,
    }),
    'Date': objectValidator({
        type: exactMatchValidator(['Date']),
        value: stringValidatorOptional,
        label: stringValidator250,
    }),
    'Timestamp': objectValidator({
        type: exactMatchValidator(['Timestamp']),
        value: stringValidatorOptional,
        label: stringValidator250,
    }),
});
export var databaseRecordValuesValidator = listValidator(databaseRecordValueValidator);
export var organizationAccessValidator = objectValidator({
    create: booleanValidatorOptional,
    update: booleanValidatorOptional,
    read: booleanValidatorOptional,
    delete: booleanValidatorOptional,
});
var _PORTAL_PAGES = {
    "Care Plan": true,
    "Appointment Booking": true,
    Documents: true,
    Education: true,
    Home: true,
    Community: true,
    Communications: true,
    "My Events": true,
    Orders: true,
    Vitals: true,
};
export var PORTAL_PAGES = Object.keys(_PORTAL_PAGES);
export var portalPageValidator = exactMatchValidator(PORTAL_PAGES);
var _FORM_TYPES = {
    note: true,
    enduserFacing: true,
};
export var FORM_TYPES = Object.keys(_FORM_TYPES);
export var formTypeValidator = exactMatchValidator(FORM_TYPES);
export var portalBlockValidator = orValidator({
    carePlan: objectValidator({
        type: exactMatchValidator(['carePlan']),
        info: objectValidator({}, { emptyOk: true })
    }),
    education: objectValidator({
        type: exactMatchValidator(['education']),
        info: objectValidator({}, { emptyOk: true })
    }),
    Events: objectValidator({
        type: exactMatchValidator(['Events']),
        info: objectValidator({}, { emptyOk: true })
    }),
    careTeam: objectValidator({
        type: exactMatchValidator(['careTeam']),
        info: objectValidator({
            title: stringValidator,
            roles: listOfStringsValidatorOptionalOrEmptyOk,
            showAll: booleanValidatorOptional,
            // members: listValidatorEmptyOk(
            //   objectValidator<CareTeamMemberPortalCustomizationInfo>({
            //     title: stringValidator(),
            //     role: stringValidator({ isOptional: true }),
            //   })()
            // )()
        })
    }),
    text: objectValidator({
        type: exactMatchValidator(['text']),
        info: objectValidator({
            text: stringValidator5000,
        })
    }),
    chat: objectValidator({
        type: exactMatchValidator(['chat']),
        info: objectValidator({}, { emptyOk: true })
    }),
    "Manage Subscription Button": objectValidator({
        type: exactMatchValidator(['Manage Subscription Button']),
        info: objectValidator({}, { emptyOk: true })
    }),
    "Orders": objectValidator({
        type: exactMatchValidator(['Orders']),
        info: objectValidator({}, { emptyOk: true })
    }),
    HTML: objectValidator({
        type: exactMatchValidator(['HTML']),
        info: objectValidator({
            html: stringValidator5000,
        })
    }),
});
export var portalBlocksValidator = listValidatorEmptyOk(portalBlockValidator);
var _PORTAL_BLOCK_TYPES = {
    carePlan: '',
    careTeam: '',
    education: '',
    text: '',
    Events: '',
    chat: '',
    "Manage Subscription Button": '',
    Orders: '',
    HTML: '',
};
export var PORTAL_BLOCK_TYPES = Object.keys(_PORTAL_BLOCK_TYPES);
export var portalTypeValidator = exactMatchValidator(PORTAL_BLOCK_TYPES);
export var enduserTaskForEventValidator = objectValidator({
    id: mongoIdStringRequired,
    enduserId: mongoIdStringRequired,
});
export var enduserTasksForEventValidator = listValidatorEmptyOk(enduserTaskForEventValidator);
export var enduserFormResponseForEventValidator = objectValidator({
    enduserId: mongoIdStringRequired,
    formId: mongoIdStringRequired,
    accessCode: stringValidator1000,
});
export var enduserFormResponsesForEventValidator = listValidatorEmptyOk(enduserFormResponseForEventValidator);
export var genericUnitWithQuantityValidator = objectValidator({
    value: numberOrStringValidatorEmptyOkay,
    unit: stringValidator1000,
});
export var stateCredentialValidator = objectValidator({
    expiresAt: dateValidatorOptional,
    licenseId: stringValidatorOptionalEmptyOkay,
    state: stateValidator,
});
export var stateCredentialsValidator = listValidatorEmptyOk(stateCredentialValidator);
export var baseAvailabilityBlockValidator = objectValidator({
    durationInMinutes: nonNegNumberValidator,
    startTimeInMS: nonNegNumberValidator,
    userId: mongoIdStringRequired,
});
export var baseAvailabilityBlocksValidator = listValidatorEmptyOk(baseAvailabilityBlockValidator);
export var weeklyAvailabilityValidator = objectValidator({
    dayOfWeekStartingSundayIndexedByZero: nonNegNumberValidator,
    endTimeInMinutes: nonNegNumberValidator,
    startTimeInMinutes: nonNegNumberValidator,
    locationId: mongoIdStringOptional,
    locationIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
    active: dateRangeOptionalValidator,
    validTemplateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
    intervalInMinutes: numberValidatorOptional,
    priority: numberValidatorOptional,
});
export var weeklyAvailabilitiesValidator = listValidatorEmptyOk(weeklyAvailabilityValidator);
export var timezoneValidator = exactMatchValidator(Object.keys(TIMEZONE_MAP));
export var timezoneValidatorOptional = exactMatchValidator(Object.keys(TIMEZONE_MAP), { isOptional: true });
export var accessValidator = exactMatchValidator([
    ALL_ACCESS, DEFAULT_ACCESS, ASSIGNED_ACCESS, NO_ACCESS,
]);
var _CUSTOM_ENDUSER_FIELD_TYPES = {
    "Select": true,
    "Multiple Select": true,
    "Text": true,
    "Multiple Text": true,
    "Date": true,
    "Auto Detect": true,
    Table: true,
    File: true,
    Number: true,
};
export var CUSTOM_ENDUSER_FIELD_TYPES = Object.keys(_CUSTOM_ENDUSER_FIELD_TYPES);
export var customEnduserFieldTypeValidator = exactMatchValidator(CUSTOM_ENDUSER_FIELD_TYPES);
var _AVAILABILITY_BLOCK_ENTITIES = {
    organization: true,
    user: true,
};
export var AVAILABILITY_BLOCK_ENTITIES = Object.keys(_AVAILABILITY_BLOCK_ENTITIES);
export var availabilityEntitiesValidator = exactMatchValidator(AVAILABILITY_BLOCK_ENTITIES);
export var indexUpdateValidator = objectValidator({
    id: mongoIdStringRequired,
    index: nonNegNumberValidator,
});
export var indexUpdatesValidator = listValidator(indexUpdateValidator);
export var customEnduserFieldValidator = orValidator({
    Select: objectValidator({
        type: exactMatchValidator(['Select']),
        info: objectValidator({
            options: listOfStringsValidator,
            other: booleanValidatorOptional,
        }),
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    "Multiple Select": objectValidator({
        type: exactMatchValidator(['Multiple Select']),
        info: objectValidator({
            options: listOfStringsValidator,
        }),
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    Text: objectValidator({
        type: exactMatchValidator(['Text']),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    Number: objectValidator({
        type: exactMatchValidator(['Number']),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    File: objectValidator({
        type: exactMatchValidator(['File']),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    "Multiple Text": objectValidator({
        type: exactMatchValidator(["Multiple Text"]),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    Date: objectValidator({
        type: exactMatchValidator(['Date']),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    "Auto Detect": objectValidator({
        type: exactMatchValidator(["Auto Detect"]),
        info: optionalEmptyObjectValidator,
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
    "Table": objectValidator({
        type: exactMatchValidator(["Table"]),
        info: objectValidator({
            columns: listValidator(tableInputChoiceValidator),
        }),
        field: stringValidator,
        required: booleanValidatorOptional,
        hiddenFromProfile: booleanValidatorOptional,
        requireConfirmation: booleanValidatorOptional,
    }),
});
export var customEnduserFieldsValidatorOptionalOrEmpty = listValidatorOptionalOrEmptyOk(customEnduserFieldValidator);
export var buildInFieldsValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    field: stringValidator100,
    label: stringValidator100,
    hidden: booleanValidatorOptional,
    required: booleanValidatorOptional,
    requireConfirmation: booleanValidatorOptional,
}));
export var customDashboardViewValidator = (objectValidator({
    blocks: listValidatorOptionalOrEmptyOk(objectValidator({
        type: exactMatchValidator(['Inbox', 'Tickets', 'Team Chats', 'Upcoming Events', "To-Dos", "Database"]),
        info: objectValidator({
            databaseId: mongoIdStringOptional,
        }, { emptyOk: true, isOptional: true }),
    }))
}, { isOptional: true, emptyOk: true }));
export var organizationSettingsValidator = objectValidator({
    endusers: objectValidator({
        disableMultipleChatRooms: booleanValidatorOptional,
        disableCalendarEventAutoAssignment: booleanValidatorOptional,
        disableAdhocFields: booleanValidatorOptional,
        autoReplyEnabled: booleanValidatorOptional,
        recordCalls: booleanValidatorOptional,
        transcribeCalls: booleanValidatorOptional,
        showFreeNote: booleanValidatorOptional,
        autoSaveFreeNote: booleanValidatorOptional,
        canDeleteFreeNote: booleanValidatorOptional,
        customFields: customEnduserFieldsValidatorOptionalOrEmpty,
        builtinFields: buildInFieldsValidator,
        tags: listOfStringsValidatorOptionalOrEmptyOk,
        transcribeCallInboundPlayback: stringValidatorOptionalEmptyOkay,
        sendSMSOnZoomStart: booleanValidatorOptional,
        enableGroupMMS: booleanValidatorOptional,
        enableAccessTags: booleanValidatorOptional,
        flaggedFileText: stringValidatorOptional,
        defaultPhoneNumber: stringValidatorOptional,
        showBulkFormInput: booleanValidatorOptional,
        autofillSignature: booleanValidatorOptional,
        showFullVitalsTab: booleanValidatorOptional,
        canMoveCalls: booleanValidatorOptional,
        canMoveSMS: booleanValidatorOptional,
        showDeleteCallRecordingOnTimeline: booleanValidatorOptional,
        inboxRepliesMarkRead: booleanValidatorOptional,
        recordCallAudioPlayback: stringValidatorOptional,
        dontRecordCallsToPhone: listOfStringsValidatorOptionalOrEmptyOk,
        disableAutoreplyForCustomEntities: booleanValidatorOptional,
        alwaysShowInsurance: booleanValidatorOptional,
        defaultToOutboundConferenceCall: booleanValidatorOptional,
        sharedInboxReadStatus: booleanValidatorOptional,
        dontMarkReadForAssigned: booleanValidatorOptional,
        matchEmailAndNames: booleanValidatorOptional,
        hideNotesFromComposeForm: booleanValidatorOptional,
        showSalesforceId: booleanValidatorOptional,
        loopQueueCallSound: booleanValidatorOptional,
        showOrdersInSidebar: booleanValidatorOptional,
        showDiagnoses: booleanValidatorOptional,
        requireObservationInvalidationReason: booleanValidatorOptional,
        showDeviceOrders: booleanValidatorOptional,
        defaultHideFilesFromPortal: booleanValidatorOptional,
        hideUnorderedFullscriptMeds: booleanValidatorOptional,
        detailField: stringValidatorOptional,
        showDownloadCallRecordings: booleanValidatorOptional,
        launchDosespotWebhookURL: stringValidatorOptionalEmptyOkay,
        reverseTimeline: booleanValidatorOptional,
    }, { isOptional: true }),
    tickets: objectValidator({
        defaultJourneyDueDateOffsetInMS: numberValidatorOptional,
        disableSnooze: booleanValidatorOptional,
        showCommunications: booleanValidatorOptional,
        showJourneys: booleanValidatorOptional,
        requireDueDate: booleanValidatorOptional,
        allowArchival: booleanValidatorOptional,
        returnToTicketsList: booleanValidatorOptional,
        dontAddToCareTeamOnTicketAssignment: booleanValidatorOptional,
    }, { isOptional: true }),
    calendar: objectValidator({
        dayStart: objectValidator({
            hour: numberValidator,
            minute: numberValidatorOptional,
            // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
        }, { isOptional: true }),
        dayEnd: objectValidator({
            hour: numberValidator,
            minute: numberValidatorOptional,
            // timezone: timezoneValidator, // weird stuff happens at the boundaries with timezones, leave out for now
        }, { isOptional: true }),
        bookingStartOffset: objectValidator({
            month: numberValidatorOptional,
            day: numberValidatorOptional,
            hour: numberValidatorOptional,
        }, { isOptional: true }),
        bookingEndOffset: objectValidator({
            month: numberValidatorOptional,
            day: numberValidatorOptional,
            hour: numberValidatorOptional,
        }, { isOptional: true }),
        templateRequired: booleanValidatorOptional,
        locationRequired: booleanValidatorOptional,
        cancelReasons: listOfStringsValidatorOptionalOrEmptyOk,
    }, { isOptional: true }),
    dashboard: objectValidator({
        view: customDashboardViewValidator,
    }, { isOptional: true, emptyOk: true, }),
    users: objectValidator({
        sessionDurationInHours: numberValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    integrations: objectValidator({
        vitalLabOrderPhysicianOptional: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
    interface: objectValidator({
        dontPersistSearches: booleanValidatorOptional,
        showEndusersV2: booleanValidatorOptional,
    }, { isOptional: true, emptyOk: true, }),
});
export var calendarEventPortalSettingsValidator = objectValidator({
    hideUsers: booleanValidatorOptional,
});
export var vitalComparisonValidator = orValidator({
    "Less Than": objectValidator({
        type: exactMatchValidator(['Less Than']),
        value: numberValidator,
    }),
    "Greater Than": objectValidator({
        type: exactMatchValidator(['Greater Than']),
        value: numberValidator,
    }),
    "Between": objectValidator({
        type: exactMatchValidator(['Between']),
        value: objectValidator({
            lower: numberValidator,
            upper: numberValidator,
        }),
    }),
});
export var vitalConfigurationRangeValidator = objectValidator({
    classification: stringValidator100,
    trendIntervalInMS: numberValidatorOptional,
    comparison: vitalComparisonValidator,
    deviationFromProfileWeight: booleanValidatorOptional,
});
export var vitalConfigurationRangesValidator = listValidator(vitalConfigurationRangeValidator);
var _AUTOMATION_TRIGGER_EVENT_TYPES = {
    "Form Submitted": true,
    "Form Unsubmitted": true,
    "Form Started": true,
    "Purchase Made": true,
    "Refund Issued": true,
    "Subscription Ended": true,
    "Appointment No-Showed": true,
    "Appointment Created": true,
    "Appointment Cancelled": true,
    "Appointment Completed": true,
    "Appointment Rescheduled": true,
    "Field Equals": true,
    "Tag Added": true,
    "Contact Created": true,
    "No Recent Appointment": true,
    "Medication Added": true,
    "On Birthday": true,
    "Has Not Engaged": true,
    "Vital Count": true,
    'Vital Update': true,
    "SMS Reply": true,
    "Order Status Equals": true,
    "Missed Call": true,
    "Order Created": true,
    "Problem Created": true,
    "Message Delivery Failure": true,
    "Incoming Message": true,
    "Pregnancy Ended": true,
    "Form Group Completed": true,
    "Form Group Incomplete": true,
    "Left Voicemail": true,
    "Message Opened": true,
    "Message Link Clicked": true,
    "Healthie Note Locked": true,
    "Database Entry Added": true,
    "Eligibility Result Received": true,
    "File Added": true,
};
export var AUTOMATION_TRIGGER_EVENT_TYPES = Object.keys(_AUTOMATION_TRIGGER_EVENT_TYPES);
export var automationTriggerEventValidator = orValidator({
    "Form Submitted": objectValidator({
        type: exactMatchValidator(['Form Submitted']),
        info: objectValidator({
            formId: mongoIdStringRequired,
            otherFormIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
            publicIdentifier: stringValidatorOptionalEmptyOkay,
            submitterType: sessionTypeOrAnyoneValidatorOptional,
            hasExpiredEvent: booleanValidatorOptional,
        }),
        conditions: orValidator({
            optional: optionalAnyObjectValidator,
            included: objectAnyFieldsAnyValuesValidator,
        }, { isOptional: true }),
    }),
    "Form Unsubmitted": objectValidator({
        type: exactMatchValidator(['Form Unsubmitted']),
        info: objectValidator({
            formId: mongoIdStringRequired,
            intervalInMS: nonNegNumberValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Form Started": objectValidator({
        type: exactMatchValidator(['Form Started']),
        info: objectValidator({
            formIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Field Equals": objectValidator({
        type: exactMatchValidator(['Field Equals']),
        info: objectValidator({
            field: stringValidator1000,
            value: stringValidator1000,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Contact Created": objectValidator({
        type: exactMatchValidator(['Contact Created']),
        info: optionalEmptyObjectValidator,
        conditions: optionalEmptyObjectValidator,
    }),
    "No Recent Appointment": objectValidator({
        type: exactMatchValidator(['No Recent Appointment']),
        info: objectValidator({
            intervalInMS: nonNegNumberValidator,
            templateIds: listOfStringsValidatorOptionalOrEmptyOk,
            titles: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Purchase Made": objectValidator({
        type: exactMatchValidator(['Purchase Made']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            productIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Refund Issued": objectValidator({
        type: exactMatchValidator(['Refund Issued']),
        info: optionalEmptyObjectValidator,
        conditions: optionalEmptyObjectValidator,
    }),
    "Subscription Ended": objectValidator({
        type: exactMatchValidator(['Subscription Ended']),
        info: optionalEmptyObjectValidator,
        conditions: optionalEmptyObjectValidator,
    }),
    "Message Delivery Failure": objectValidator({
        type: exactMatchValidator(['Message Delivery Failure']),
        info: optionalEmptyObjectValidator,
        conditions: optionalEmptyObjectValidator,
    }),
    "Incoming Message": objectValidator({
        type: exactMatchValidator(['Incoming Message']),
        info: objectValidator({
            noCareTeam: booleanValidatorOptional,
            destinations: listOfStringsValidatorOptionalOrEmptyOk,
            channels: listOfStringsValidatorOptionalOrEmptyOk,
            keywords: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Appointment No-Showed": objectValidator({
        type: exactMatchValidator(['Appointment No-Showed']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Appointment Created": objectValidator({
        type: exactMatchValidator(['Appointment Created']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Appointment Completed": objectValidator({
        type: exactMatchValidator(['Appointment Completed']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Appointment Cancelled": objectValidator({
        type: exactMatchValidator(['Appointment Cancelled']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            by: exactMatchValidatorOptional(['', 'enduser', 'user']),
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Appointment Rescheduled": objectValidator({
        type: exactMatchValidator(['Appointment Rescheduled']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Medication Added": objectValidator({
        type: exactMatchValidator(['Medication Added']),
        info: objectValidator({
            titles: listOfStringsValidatorEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "On Birthday": objectValidator({
        type: exactMatchValidator(['On Birthday']),
        info: objectValidator({
            minutes: nonNegNumberValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Has Not Engaged": objectValidator({
        type: exactMatchValidator(['Has Not Engaged']),
        info: objectValidator({
            intervalInMS: nonNegNumberValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Vital Count": objectValidator({
        type: exactMatchValidator(['Vital Count']),
        info: objectValidator({
            minutes: nonNegNumberValidator,
            units: listOfStringsValidatorEmptyOk,
            comparison: vitalComparisonValidator,
            periodInMS: numberValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Vital Update": objectValidator({
        type: exactMatchValidator(['Vital Update']),
        info: objectValidator({
            configurationIds: listOfMongoIdStringValidator,
            classifications: listOfStringsValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "SMS Reply": objectValidator({
        type: exactMatchValidator(['SMS Reply']),
        info: objectValidator({
            templateIds: listOfMongoIdStringValidator,
            replyKeywords: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Order Status Equals": objectValidator({
        type: exactMatchValidator(['Order Status Equals']),
        info: objectValidator({
            source: stringValidator100,
            status: stringValidator100,
            fills: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Missed Call": objectValidator({
        type: exactMatchValidator(['Missed Call']),
        info: objectValidator({
            inputs: listOfStringsValidatorOptionalOrEmptyOk,
            phoneNumbers: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Left Voicemail": objectValidator({
        type: exactMatchValidator(['Left Voicemail']),
        info: objectValidator({
            inputs: listOfStringsValidatorOptionalOrEmptyOk,
            phoneNumbers: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Order Created": objectValidator({
        type: exactMatchValidator(['Order Created']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            fills: listOfStringsValidatorOptionalOrEmptyOk,
            partialFrequency: stringValidatorOptional,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Problem Created": objectValidator({
        type: exactMatchValidator(['Problem Created']),
        info: objectValidator({
            titles: listOfStringsValidatorOptionalOrEmptyOk,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Pregnancy Ended": objectValidator({
        type: exactMatchValidator(['Pregnancy Ended']),
        info: objectValidator({
            reason: stringValidatorOptional,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Form Group Completed": objectValidator({
        type: exactMatchValidator(['Form Group Completed']),
        info: objectValidator({
            groupId: mongoIdStringRequired,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Form Group Incomplete": objectValidator({
        type: exactMatchValidator(['Form Group Incomplete']),
        info: objectValidator({
            groupId: mongoIdStringRequired,
            intervalInMS: nonNegNumberValidator,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Message Opened": objectValidator({
        type: exactMatchValidator(['Message Opened']),
        info: objectValidator({
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { emptyOk: true }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Message Link Clicked": objectValidator({
        type: exactMatchValidator(['Message Link Clicked']),
        info: objectValidator({
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { emptyOk: true }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Healthie Note Locked": objectValidator({
        type: exactMatchValidator(['Healthie Note Locked']),
        info: objectValidator({
            healthieFormIds: listOfStringsValidatorOptionalOrEmptyOk,
            answersCondition: objectAnyFieldsAnyValuesValidator,
        }, { emptyOk: true }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Database Entry Added": objectValidator({
        type: exactMatchValidator(['Database Entry Added']),
        info: objectValidator({
            databaseId: mongoIdStringRequired,
        }, { emptyOk: true }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Eligibility Result Received": objectValidator({
        type: exactMatchValidator(['Eligibility Result Received']),
        info: objectValidator({
            source: stringValidator100,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "File Added": objectValidator({
        type: exactMatchValidator(['File Added']),
        info: objectValidator({
            source: stringValidator100,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
    "Tag Added": objectValidator({
        type: exactMatchValidator(['Tag Added']),
        info: objectValidator({
            tag: stringValidator100,
        }),
        conditions: optionalEmptyObjectValidator,
    }),
});
var _AUTOMATION_TRIGGER_ACTION_TYPES = {
    "Add To Journey": true,
    "Remove From Journey": true,
    "Move To Step": true,
    "Set Fields": true,
    "Add Tags": true,
    "Remove Tags": true,
    "Add Access Tags": true,
    "Assign Care Team": true,
    "Remove Care Team": true,
    "Remove From All Journeys": true,
    "Canvas: Add Patient": true,
    "Zus: Delete Enrollment": true,
    "Require Form Followups": true,
    "Add to Waitlist": true,
    "Grant Access From Waitlist": true,
};
export var AUTOMATION_TRIGGER_ACTION_TYPES = Object.keys(_AUTOMATION_TRIGGER_ACTION_TYPES);
export var automationTriggerActionValidator = orValidator({
    "Add To Journey": objectValidator({
        type: exactMatchValidator(['Add To Journey']),
        info: objectValidator({
            journeyId: mongoIdStringRequired,
            doNotRestart: booleanValidatorOptional,
        }),
    }),
    "Remove From Journey": objectValidator({
        type: exactMatchValidator(['Remove From Journey']),
        info: objectValidator({
            journeyId: mongoIdStringRequired,
        }),
    }),
    "Move To Step": objectValidator({
        type: exactMatchValidator(['Move To Step']),
        info: optionalEmptyObjectValidator,
    }),
    "Add Tags": objectValidator({
        type: exactMatchValidator(['Add Tags']),
        info: objectValidator({
            tags: listOfStringsValidator,
            replaceExisting: booleanValidatorOptional,
        }),
    }),
    "Remove Tags": objectValidator({
        type: exactMatchValidator(['Remove Tags']),
        info: objectValidator({
            tags: listOfStringsValidator,
        }),
    }),
    "Add Access Tags": objectValidator({
        type: exactMatchValidator(['Add Access Tags']),
        info: objectValidator({
            tags: listOfStringsValidator,
        }),
    }),
    "Assign Care Team": objectValidator({
        type: exactMatchValidator(['Assign Care Team']),
        info: objectValidator({
            tags: listOfStringsWithQualifierValidator,
            limitToOneUser: booleanValidatorOptional,
        }),
    }),
    "Remove Care Team": objectValidator({
        type: exactMatchValidator(['Remove Care Team']),
        info: objectValidator({
            tags: listOfStringsWithQualifierValidator,
        }),
    }),
    "Set Fields": objectValidator({
        type: exactMatchValidator(['Set Fields']),
        info: objectValidator({
            fields: listValidator(objectValidator({
                name: stringValidator,
                type: stringValidator,
                value: stringValidator,
                increment: numberValidatorOptional,
            }))
        }),
    }),
    "Remove From All Journeys": objectValidator({
        type: exactMatchValidator(['Remove From All Journeys']),
        info: optionalEmptyObjectValidator,
    }),
    "Canvas: Add Patient": objectValidator({
        type: exactMatchValidator(['Canvas: Add Patient']),
        info: optionalEmptyObjectValidator,
    }),
    "Zus: Delete Enrollment": objectValidator({
        type: exactMatchValidator(['Zus: Delete Enrollment']),
        info: objectValidator({
            packageId: stringValidator100,
        }),
    }),
    "Require Form Followups": objectValidator({
        type: exactMatchValidator(['Require Form Followups']),
        info: objectValidator({
            formIds: listOfUniqueStringsValidatorEmptyOk,
        }),
    }),
    "Add to Waitlist": objectValidator({
        type: exactMatchValidator(['Add to Waitlist']),
        info: objectValidator({
            waitlistId: mongoIdStringRequired,
        }),
    }),
    "Grant Access From Waitlist": objectValidator({
        type: exactMatchValidator(['Grant Access From Waitlist']),
        info: objectValidator({
            waitlistId: mongoIdStringRequired,
            count: numberValidator,
        }),
    }),
});
var _AUTOMATION_TRIGGER_STATUSES = {
    Active: true,
    Inactive: true,
};
export var AUTOMATION_TRIGGER_STATUSES = Object.keys(_AUTOMATION_TRIGGER_STATUSES);
export var automatioNTriggerStatusValidator = exactMatchValidator(AUTOMATION_TRIGGER_STATUSES);
var _EMBEDDING_TYPES = {
    "text-embedding-ada-002": true,
};
export var EMBEDDING_TYPES = Object.keys(_EMBEDDING_TYPES);
export var embeddingTypeValidator = exactMatchValidator(EMBEDDING_TYPES);
export var superbillPatientInfoValidator = objectValidator({
    dateOfBirth: stringValidator,
    name: stringValidator,
    phone: stringValidator,
});
export var superbillProviderInfoValidator = objectValidator({
    address: addressValidator,
    email: emailValidator,
    officeName: stringValidator1000,
    phone: stringValidator,
    placeOfServiceCode: stringValidatorOptionalEmptyOkay,
    providerLicense: stringValidator,
    providerName: stringValidator,
    providerNPI: stringValidator,
    taxId: stringValidator,
});
export var billingCodeValidator = objectValidator({
    code: numberOrStringValidatorOptional,
    label: stringValidator,
});
export var billingCodeValidatorOptional = objectValidator({
    code: numberValidatorOptional,
    label: stringValidatorOptional,
}, { emptyOk: true, isOptional: true });
var superbillLineItemValidator = objectValidator({
    billingCode: billingCodeValidator,
    quantity: numberValidator,
    cost: objectValidator({
        amount: numberValidator,
        currency: stringValidator,
    }),
    discount: numberValidatorOptional,
});
export var superbillLineItemsValidator = listValidator(superbillLineItemValidator);
var ticketSnoozeValidator = objectValidator({
    at: dateValidator,
    until: dateValidator,
    reason: stringValidatorOptional,
});
export var ticketSnoozesValidator = listValidatorOptionalOrEmptyOk(ticketSnoozeValidator);
// for each model name, this should be optional, but when a model name is provided, all CRUD fields should be required
// if this changes (e.g. CRUD fields are made optional), must merge better in authentication.ts in API
export var accessPermissionValidator = objectValidator({
    create: accessValidator,
    delete: accessValidator,
    read: accessValidator,
    update: accessValidator,
    showInSidebar: booleanValidatorOptional,
}, { isOptional: true });
export var accessPermissionsValidator = objectValidator({
    enduser_custom_types: accessPermissionValidator,
    superbill_providers: accessPermissionValidator,
    superbills: accessPermissionValidator,
    availability_blocks: accessPermissionValidator,
    analytics_frames: accessPermissionValidator,
    endusers: accessPermissionValidator,
    enduser_status_updates: accessPermissionValidator,
    engagement_events: accessPermissionValidator,
    journeys: accessPermissionValidator,
    api_keys: accessPermissionValidator,
    emails: accessPermissionValidator,
    sms_messages: accessPermissionValidator,
    chat_rooms: accessPermissionValidator,
    chats: accessPermissionValidator,
    users: accessPermissionValidator,
    templates: accessPermissionValidator,
    files: accessPermissionValidator,
    tickets: accessPermissionValidator,
    meetings: accessPermissionValidator,
    notes: accessPermissionValidator,
    forms: accessPermissionValidator,
    form_fields: accessPermissionValidator,
    form_responses: accessPermissionValidator,
    calendar_events: accessPermissionValidator,
    calendar_event_templates: accessPermissionValidator,
    calendar_event_RSVPs: accessPermissionValidator,
    automation_steps: accessPermissionValidator,
    automated_actions: accessPermissionValidator,
    webhooks: accessPermissionValidator,
    user_logs: accessPermissionValidator,
    user_notifications: accessPermissionValidator,
    enduser_observations: accessPermissionValidator,
    managed_content_records: accessPermissionValidator,
    managed_content_record_assignments: accessPermissionValidator,
    forums: accessPermissionValidator,
    forum_posts: accessPermissionValidator,
    post_likes: accessPermissionValidator,
    comment_likes: accessPermissionValidator,
    post_comments: accessPermissionValidator,
    organizations: accessPermissionValidator,
    integrations: accessPermissionValidator,
    databases: accessPermissionValidator,
    database_records: accessPermissionValidator,
    portal_customizations: accessPermissionValidator,
    care_plans: accessPermissionValidator,
    enduser_tasks: accessPermissionValidator,
    role_based_access_permissions: accessPermissionValidator,
    appointment_booking_pages: accessPermissionValidator,
    appointment_locations: accessPermissionValidator,
    products: accessPermissionValidator,
    purchase_credits: accessPermissionValidator,
    purchases: accessPermissionValidator,
    phone_calls: accessPermissionValidator,
    background_errors: accessPermissionValidator,
    enduser_views: accessPermissionValidator,
    automation_triggers: accessPermissionValidator,
    enduser_profile_views: accessPermissionValidator,
    enduser_medications: accessPermissionValidator,
    phone_trees: accessPermissionValidator,
    table_views: accessPermissionValidator,
    email_sync_denials: accessPermissionValidator,
    ticket_thread_comments: accessPermissionValidator,
    ticket_threads: accessPermissionValidator,
    configurations: accessPermissionValidator,
    ticket_queues: accessPermissionValidator,
    group_mms_conversations: accessPermissionValidator,
    enduser_orders: accessPermissionValidator,
    enduser_encounters: accessPermissionValidator,
    vital_configurations: accessPermissionValidator,
    blocked_phones: accessPermissionValidator,
    prescription_routes: accessPermissionValidator,
    enduser_problems: accessPermissionValidator,
    flowchart_notes: accessPermissionValidator,
    webhook_logs: accessPermissionValidator,
    form_groups: accessPermissionValidator,
    portal_brandings: accessPermissionValidator,
    message_template_snippets: accessPermissionValidator,
    fax_logs: accessPermissionValidator,
    call_hold_queues: accessPermissionValidator,
    suggested_contacts: accessPermissionValidator,
    diagnosis_codes: accessPermissionValidator,
    allergy_codes: accessPermissionValidator,
    integration_logs: accessPermissionValidator,
    enduser_eligibility_results: accessPermissionValidator,
    agent_records: accessPermissionValidator,
    waitlists: accessPermissionValidator,
    // deprecated but for backwards compatibility
    apiKeys: accessPermissionValidator,
});
export var organizationLimitsValidator = objectValidator({
    suggested_contacts: accessPermissionValidator,
    message_template_snippets: accessPermissionValidator,
    webhook_logs: accessPermissionValidator,
    enduser_problems: accessPermissionValidator,
    prescription_routes: accessPermissionValidator,
    group_mms_conversations: accessPermissionValidator,
    enduser_custom_types: numberValidatorOptional,
    superbill_providers: numberValidatorOptional,
    superbills: numberValidatorOptional,
    automation_triggers: numberValidatorOptional,
    background_errors: numberValidatorOptional,
    enduser_views: numberValidatorOptional,
    availability_blocks: numberValidatorOptional,
    analytics_frames: numberValidatorOptional,
    endusers: numberValidatorOptional,
    enduser_status_updates: numberValidatorOptional,
    engagement_events: numberValidatorOptional,
    journeys: numberValidatorOptional,
    api_keys: numberValidatorOptional,
    emails: numberValidatorOptional,
    sms_messages: numberValidatorOptional,
    chat_rooms: numberValidatorOptional,
    chats: numberValidatorOptional,
    users: numberValidatorOptional,
    templates: numberValidatorOptional,
    files: numberValidatorOptional,
    tickets: numberValidatorOptional,
    meetings: numberValidatorOptional,
    notes: numberValidatorOptional,
    forms: numberValidatorOptional,
    form_fields: numberValidatorOptional,
    form_responses: numberValidatorOptional,
    calendar_events: numberValidatorOptional,
    calendar_event_templates: numberValidatorOptional,
    calendar_event_RSVPs: numberValidatorOptional,
    automation_steps: numberValidatorOptional,
    automated_actions: numberValidatorOptional,
    webhooks: numberValidatorOptional,
    user_logs: numberValidatorOptional,
    user_notifications: numberValidatorOptional,
    enduser_observations: numberValidatorOptional,
    managed_content_records: numberValidatorOptional,
    managed_content_record_assignments: numberValidatorOptional,
    forums: numberValidatorOptional,
    forum_posts: numberValidatorOptional,
    post_likes: numberValidatorOptional,
    comment_likes: numberValidatorOptional,
    post_comments: numberValidatorOptional,
    organizations: numberValidatorOptional,
    integrations: numberValidatorOptional,
    databases: numberValidatorOptional,
    database_records: numberValidatorOptional,
    portal_customizations: numberValidatorOptional,
    care_plans: numberValidatorOptional,
    enduser_tasks: numberValidatorOptional,
    role_based_access_permissions: numberValidatorOptional,
    appointment_booking_pages: numberValidatorOptional,
    appointment_locations: numberValidatorOptional,
    products: numberValidatorOptional,
    purchase_credits: numberValidatorOptional,
    purchases: numberValidatorOptional,
    phone_calls: numberValidatorOptional,
    enduser_profile_views: numberValidatorOptional,
    enduser_medications: numberValidatorOptional,
    phone_trees: numberValidatorOptional,
    table_views: numberValidatorOptional,
    email_sync_denials: numberValidatorOptional,
    ticket_threads: numberValidatorOptional,
    ticket_thread_comments: numberValidatorOptional,
    configurations: numberValidatorOptional,
    ticket_queues: numberValidatorOptional,
    enduser_orders: numberValidatorOptional,
    enduser_encounters: numberValidatorOptional,
    vital_configurations: numberValidatorOptional,
    blocked_phones: numberValidatorOptional,
    flowchart_notes: numberValidatorOptional,
    form_groups: numberValidatorOptional,
    portal_brandings: numberValidatorOptional,
    fax_logs: numberValidatorOptional,
    call_hold_queues: numberValidatorOptional,
    diagnosis_codes: numberValidatorOptional,
    allergy_codes: numberValidatorOptional,
    integration_logs: numberValidatorOptional,
    enduser_eligibility_results: numberValidatorOptional,
    agent_records: numberValidatorOptional,
    waitlists: numberValidatorOptional,
}, { emptyOk: true });
var _LOGIN_FLOW_RESULTS = {
    // "continue-set-password": true, // something we may turn on later / as requested
    "continue-with-password": true,
    "sent-email": true,
    "sent-sms": true
};
export var LOGIN_FLOW_RESULTS = Object.keys(_LOGIN_FLOW_RESULTS);
export var loginFlowResultValidator = exactMatchValidator(LOGIN_FLOW_RESULTS);
export var appointmentTermsValidator = listValidatorEmptyOk(objectValidator({
    link: stringValidator5000,
    title: stringValidator1000,
}));
var _CURRENCIES = {
    USD: '',
};
export var CURRENCIES = Object.keys(_CURRENCIES);
export var currencyValidator = exactMatchValidator(CURRENCIES);
var _PAYMENT_PROCESSORS = {
    Stripe: '',
    Square: '',
};
export var PAYMENT_PROCESSORS = Object.keys(_PAYMENT_PROCESSORS);
export var paymentProcessorValidator = exactMatchValidator(PAYMENT_PROCESSORS);
export var costValidator = objectValidator({
    amount: nonNegNumberValidator,
    currency: currencyValidator,
});
export var purchaseCreditValueValidator = orValidator({
    Credit: objectValidator({
        type: exactMatchValidator(['Credit']),
        info: objectValidator({
            amount: numberValidator,
            currency: currencyValidator,
        }),
    }),
    // Voucher: objectValidator<PurchaseCreditInfoForType['Voucher']>({
    //   type: exactMatchValidator(['Voucher']),
    //   info: objectValidator<PurchaseCreditInfoForType['Voucher']['info']>({}),
    // }), 
});
export var integrationTitleValidator = exactMatchValidator([
    SQUARE_INTEGRATIONS_TITLE,
    OUTLOOK_INTEGRATIONS_TITLE,
    ZOHO_TITLE,
    ZOOM_TITLE,
    ZENDESK_INTEGRATIONS_TITLE,
    FULLSCRIPT_INTEGRATIONS_TITLE,
    ZUS_TITLE,
    CANVAS_TITLE,
    CANDID_TITLE,
    GOGO_MEDS_TITLE,
    PAGER_DUTY_TITLE,
    SMART_METER_TITLE,
    MFAX_TITLE,
    ATHENA_TITLE,
    DOSESPOT_TITLE,
    DOCSUMO_TITLE,
    ACTIVE_CAMPAIGN_TITLE,
    STRIPE_TITLE,
    EMOTII_TITLE,
    DEVELOP_HEALTH_TITLE,
]);
var _VIDEO_INTEGRATION_TYPES = {
    Zoom: '',
    "No Integration": '',
};
export var VIDEO_INTEGRATION_TYPES = Object.keys(_VIDEO_INTEGRATION_TYPES);
export var videoIntegrationTypesValidator = exactMatchValidator(VIDEO_INTEGRATION_TYPES);
export var analyticsQueryResultsValidator = listValidator(objectValidator({
    key: stringValidator100,
    timestamp: dateOptionalOrEmptyStringValidator,
    unit: stringValidator,
    value: numberValidator,
    numerator: numberValidatorOptional,
    denominator: numberValidatorOptional,
    userId: mongoIdStringOptional,
}));
export var scheduledJourneysValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    journeyId: mongoIdStringRequired,
    addAt: dateValidator,
}));
export var formScoringValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    title: stringValidator100,
    fieldId: mongoIdStringRequired,
    response: stringValidatorOptional,
    score: orValidator({
        responseValue: stringValidator,
        number: numberValidator, // use the pre-defined number as the score for this response
    }, { isNumber: true }) // set to allow 0
}));
// // todo: add more restrictions
// export const basicFilterValidateFuction: EscapeBuilder<BasicFilter<string>> = o => build_validator(v => {
//   if (!v) throw new Error("Filter value must be defined")
//   if (typeof v !== 'object') throw new Error('Expecting an object')
//   return v
// }, { ...o, listOf: false })
// // todo: add more restrictions
// export const compoundFilterValidateFuction: EscapeBuilder<CompoundFilter<string>> = o => build_validator(v => {
//   if (!v) throw new Error("Filter value must be defined")
//   if (typeof v !== 'object') throw new Error('Expecting an object')
//   return v
// }, { ...o, listOf: false })
export var basicFilterValidator = objectAnyFieldsAnyValuesValidator;
export var compoundFilterValidator = objectAnyFieldsAnyValuesValidator;
var enduserFieldsAnalyticsValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    key: stringValidator1000,
    value: stringValidator5000EmptyOkay,
    range: dateRangeOptionalValidator,
    operator: stringValidatorOptional,
}));
export var analyticsQueryValidator = orValidator({
    Endusers: objectValidator({
        resource: exactMatchValidator(['Endusers']),
        filter: objectValidator({
            activeSince: dateOptionalOrEmptyStringValidator,
            gender: tellescopeGenderOptionalValidator,
            fields: enduserFieldsAnalyticsValidator,
            "Submitted Forms": objectValidator({
                qualifier: listQueryQualifiersValidator,
                formIds: listOfMongoIdStringValidator,
                formResponseCondition: orValidator({
                    optional: optionalAnyObjectValidator,
                    included: objectAnyFieldsAnyValuesValidator,
                }, { isOptional: true }),
            }, { isOptional: true }),
            "assignedTo": objectValidator({
                qualifier: listQueryQualifiersValidator,
                userIds: listOfMongoIdStringValidator,
            }, { isOptional: true }),
            "born": objectValidator({
                from: dateOptionalOrEmptyStringValidator,
                to: dateOptionalOrEmptyStringValidator,
            }, { isOptional: true }),
            tags: listOfStringsWithQualifierValidatorOptional,
            entityTypes: listOfStringsValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
            "Sum of Field": objectValidator({
                method: exactMatchValidator(['Sum of Field']),
                parameters: objectValidator({
                    field: stringValidator250,
                }),
            }),
        }),
        grouping: objectValidator({
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Calendar Events": objectValidator({
        resource: exactMatchValidator(['Calendar Events']),
        filter: objectValidator({
            templateIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
            starts: dateRangeOptionalValidator,
            wasSelfScheduled: booleanValidatorOptional,
            wasCancelled: booleanValidatorOptional,
            wasCompleted: booleanValidatorOptional,
            wasNoShowed: booleanValidatorOptional,
            wasRescheduled: booleanValidatorOptional,
            userIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
            scheduledBy: mongoIdStringOptional,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Type: booleanValidatorOptional,
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
            "Scheduled By": booleanValidatorOptional,
            alsoGroupByHost: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Form Responses": objectValidator({
        resource: exactMatchValidator(['Form Responses']),
        filter: objectValidator({
            formIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
            tags: listOfStringsWithQualifierValidatorOptional,
            formResponseCondition: orValidator({
                optional: optionalAnyObjectValidator,
                included: objectAnyFieldsAnyValuesValidator,
            }, { isOptional: true }),
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            "Submitted By": booleanValidatorOptional,
            "Public Identifier": booleanValidatorOptional,
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At', 'Submitted At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Purchases": objectValidator({
        resource: exactMatchValidator(['Purchases']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Cost: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Purchase Credits": objectValidator({
        resource: exactMatchValidator(['Purchase Credits']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Tickets": objectValidator({
        resource: exactMatchValidator(['Tickets']),
        filter: objectValidator({
            closeReasons: listOfStringsValidatorOptionalOrEmptyOk,
            titles: listOfStringsValidatorOptionalOrEmptyOk,
            userTags: listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
            enduserFields: enduserFieldsAnalyticsValidator,
            closedAtRange: dateRangeOptionalValidator,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Owner: booleanValidatorOptional,
            Outcome: booleanValidatorOptional,
            Title: booleanValidatorOptional,
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At', 'Closed At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Emails": objectValidator({
        resource: exactMatchValidator(['Emails']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Phone Calls": objectValidator({
        resource: exactMatchValidator(['Phone Calls']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
            "Duration": objectValidator({
                method: exactMatchValidator(['Duration']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "SMS Messages": objectValidator({
        resource: exactMatchValidator(['SMS Messages']),
        filter: objectValidator({
            direction: stringValidatorOptional,
            messages: listOfStringsValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Score: booleanValidatorOptional,
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Medications": objectValidator({
        resource: exactMatchValidator(['Medications']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Files": objectValidator({
        resource: exactMatchValidator(['Files']),
        filter: objectValidator({
            names: listOfStringsValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Meetings": objectValidator({
        resource: exactMatchValidator(['Meetings']),
        filter: objectValidator({}, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
            "Duration": objectValidator({
                method: exactMatchValidator(['Duration']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Host: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
    "Journey Logs": objectValidator({
        resource: exactMatchValidator(['Journey Logs']),
        filter: objectValidator({
            automationStepIds: listOfMongoIdStringValidatorOptionalOrEmptyOk,
        }, { isOptional: true, emptyOk: true }),
        info: orValidator({
            "Total": objectValidator({
                method: exactMatchValidator(['Total']),
                parameters: optionalEmptyObjectValidator,
            }),
        }),
        grouping: objectValidator({
            Enduser: booleanValidatorOptional,
            Gender: booleanValidatorOptional,
            "Assigned To": booleanValidatorOptional,
            Field: stringValidatorOptionalEmptyOkay,
            Tags: booleanValidatorOptional,
            Age: booleanValidatorOptional,
            State: booleanValidatorOptional,
            Phone: booleanValidatorOptional,
        }, { isOptional: true, emptyOk: true }),
        range: objectValidator({
            interval: exactMatchValidator(['Daily', 'Weekly', 'Monthly', 'Hourly']),
            key: exactMatchValidator(['Created At', 'Updated At']),
        }, { isOptional: true, emptyOk: true })
    }),
});
export var analyticsQueriesValidatorOptional = listValidatorOptionalOrEmptyOk(analyticsQueryValidator);
var _ANALYTICS_FRAME_TYPES = {
    Percentage: '',
};
export var ANALYTICS_FRAME_TYPES = Object.keys(_ANALYTICS_FRAME_TYPES);
export var analyticsFrameTypeValidator = exactMatchValidator(ANALYTICS_FRAME_TYPES);
var _ANALYTICS_QUERY_TYPES = {
    Endusers: true,
    "Calendar Events": true,
    "Form Responses": true,
    Purchases: true,
    "Purchase Credits": true,
    Tickets: true,
    "Phone Calls": true,
    "SMS Messages": true,
    Emails: true,
    Medications: true,
    Files: true,
    Meetings: true,
    "Journey Logs": true,
};
export var ANALYTICS_QUERY_TYPES = Object.keys(_ANALYTICS_QUERY_TYPES);
export var analyticsQueryTypeValidator = exactMatchValidator(ANALYTICS_QUERY_TYPES);
var _USER_CALL_ROUTING_BEHAVIORS = {
    "": '',
    All: '',
    Assigned: '',
    Unassigned: '',
};
export var USER_CALL_ROUTING_BEHAVIORS = Object.keys(_USER_CALL_ROUTING_BEHAVIORS);
export var userCallRoutingBehaviorValidator = exactMatchValidator(USER_CALL_ROUTING_BEHAVIORS);
export var userUIRestrictionsValidator = objectValidator({
    hideDashboard: booleanValidatorOptional,
    hideInbox: booleanValidatorOptional,
    hideTeamChat: booleanValidatorOptional,
    hideEnduserChat: booleanValidatorOptional,
    disableTicketDueDate: booleanValidatorOptional,
    disableUnstructuredNotes: booleanValidatorOptional,
    hideCareplan: booleanValidatorOptional,
    hiddenFields: listValidatorOptionalOrEmptyOk(objectValidator({
        field: stringValidator,
        type: mongoIdStringOptional,
    })),
    disabledFields: listValidatorOptionalOrEmptyOk(objectValidator({
        field: stringValidator,
        type: mongoIdStringOptional,
    })),
    hideUnsubmittedForms: booleanValidatorOptional,
    hideMergeEndusers: booleanValidatorOptional,
    hideQueuedTicketsViewer: booleanValidatorOptional,
    hideIncomingFaxesIcon: booleanValidatorOptional,
    hideBulkEnduserActions: booleanValidatorOptional,
    visibleIntegrations: listOfStringsValidatorUniqueOptionalOrEmptyOkay,
}, { emptyOk: true });
var externalChatGPTMessageValidator = objectValidator({
    role: exactMatchValidator(['assistant', 'user']),
    content: stringValidator5000,
});
export var externalChatGPTMessagesValidator = listValidator(externalChatGPTMessageValidator);
export var sharedEnduserProfileViewBlockFields = {
    width: stringValidator1000Optional,
    maxHeight: numberValidatorOptional,
};
export var enduserProfileViewBlockValidator = orValidator({
    "Field Group": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Field Group']), info: objectValidator({
            title: stringValidator100,
            fields: listOfStringsValidator,
            displayFields: listValidatorOptionalOrEmptyOk(objectValidator({
                field: stringValidator,
                display: stringValidator,
            }))
        }) })),
    "Form Responses": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Form Responses']), info: objectValidator({
            title: stringValidator100,
            formId: mongoIdStringOptional,
            fieldIds: listOfMongoIdStringValidatorEmptyOk,
            showAllForms: booleanValidatorOptional,
            expandable: booleanValidatorOptional,
        }) })),
    "Zus Encounters": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Zus Encounters']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Files": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Files']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Tickets": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Tickets']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Events": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Events']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Labs": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Labs']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Medications": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Medications']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Diagnoses": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Diagnoses']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Timeline": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Timeline']), info: objectValidator({
            title: stringValidator100,
        }) })),
    "Shared Content": objectValidator(__assign(__assign({}, sharedEnduserProfileViewBlockFields), { type: exactMatchValidator(['Shared Content']), info: objectValidator({
            title: stringValidator100,
        }) })),
});
export var enduserProfileViewBlocksValidator = listValidator(enduserProfileViewBlockValidator);
var insuranceValidator = objectValidator({
    name: stringValidator100,
});
export var insurancesValidator = listValidator(insuranceValidator);
export var phoneTreeEventValidator = orValidator({
    "Start": objectValidator({
        type: exactMatchValidator(['Start']),
        info: optionalEmptyObjectValidator,
        parentId: stringValidator1000Optional,
    }),
    "On Gather": objectValidator({
        type: exactMatchValidator(['On Gather']),
        parentId: stringValidator100,
        info: objectValidator({
            digits: stringValidatorOptional,
            transcription: stringValidatorOptional,
            handleNoInput: booleanValidatorOptional,
        }),
    }),
    "If True": objectValidator({
        type: exactMatchValidator(['If True']),
        info: optionalEmptyObjectValidator,
        parentId: stringValidator1000Optional,
    }),
    "If False": objectValidator({
        type: exactMatchValidator(['If False']),
        info: optionalEmptyObjectValidator,
        parentId: stringValidator1000Optional,
    }),
    "If No Users Match": objectValidator({
        type: exactMatchValidator(['If No Users Match']),
        info: optionalEmptyObjectValidator,
        parentId: stringValidator1000Optional,
    }),
    "If No Users Answer": objectValidator({
        type: exactMatchValidator(['If No Users Answer']),
        info: optionalEmptyObjectValidator,
        parentId: stringValidator1000Optional,
    }),
});
export var phoneTreeEventsValidator = listValidatorEmptyOk(phoneTreeEventValidator);
export var phonePlaybackValidator = orValidator({
    Play: objectValidator({
        type: exactMatchValidator(['Play']),
        info: objectValidator({
            url: stringValidator5000,
            script: stringValidatorOptional,
        }),
    }),
    Say: objectValidator({
        type: exactMatchValidator(['Say']),
        info: objectValidator({
            script: stringValidator5000,
            url: stringValidatorOptional,
        }),
    }),
});
export var phonePlaybackValidatorOptional = orValidator({
    Play: objectValidator({
        type: exactMatchValidator(['Play']),
        info: objectValidator({
            url: stringValidator5000,
            script: stringValidatorOptional,
        }),
    }),
    Say: objectValidator({
        type: exactMatchValidator(['Say']),
        info: objectValidator({
            script: stringValidator5000,
            url: stringValidatorOptional,
        }),
    }),
    optional: optionalEmptyObjectValidator,
}, { isOptional: true });
export var phoneTreeActionValidator = orValidator({
    // "Play": objectValidator<PhoneTreeActions["Play"]>({
    //   type: exactMatchValidator(['Play']),
    //   info: objectValidator<PhoneTreeActions["Play"]['info']>({
    //     playback: phonePlaybackValidator,
    //   }),
    // }), 
    "Gather": objectValidator({
        type: exactMatchValidator(['Gather']),
        info: objectValidator({
            playback: phonePlaybackValidator,
            digits: booleanValidator,
            speech: booleanValidator,
            duration: numberValidatorOptional,
        }),
    }),
    "Voicemail": objectValidator({
        type: exactMatchValidator(['Voicemail']),
        info: objectValidator({
            playback: phonePlaybackValidator,
            journeyId: mongoIdStringOptional,
        }),
    }),
    "Play Message": objectValidator({
        type: exactMatchValidator(['Play Message']),
        info: objectValidator({
            playback: phonePlaybackValidator,
            journeyId: mongoIdStringOptional,
        }),
    }),
    "Dial Users": objectValidator({
        type: exactMatchValidator(['Dial Users']),
        info: objectValidator({
            userIds: listOfMongoIdStringValidatorEmptyOk,
            playback: phonePlaybackValidatorOptional,
            duration: numberValidatorOptional,
        }),
    }),
    "Route Call": objectValidator({
        type: exactMatchValidator(['Route Call']),
        info: objectValidator({
            byCareTeamPrimary: booleanValidatorOptional,
            byCareTeam: booleanValidatorOptional,
            byRole: stringValidatorOptional,
            byTags: listOfStringsWithQualifierValidatorOptionalValuesEmptyOkay,
            prePlayback: phonePlaybackValidatorOptional,
            playback: phonePlaybackValidatorOptional,
            duration: numberValidatorOptional,
            addToCareTeam: booleanValidatorOptional,
            dialRecentAgent: booleanValidatorOptional,
        }),
    }),
    "Forward Call": objectValidator({
        type: exactMatchValidator(['Forward Call']),
        info: objectValidator({
            to: phoneValidator,
        }),
    }),
    "Conditional Split": objectValidator({
        type: exactMatchValidator(['Conditional Split']),
        info: objectValidator({
            weeklyAvailabilities: weeklyAvailabilitiesValidator,
            timezone: timezoneValidatorOptional,
            hasCareTeam: booleanValidatorOptional,
            hasOneCareTeamMember: booleanValidatorOptional,
        }),
    }),
    "Select Care Team Member": objectValidator({
        type: exactMatchValidator(['Select Care Team Member']),
        info: objectValidator({
            playback: phonePlaybackValidatorOptional,
            playbackVoicemail: phonePlaybackValidatorOptional,
        }, { emptyOk: true }),
    }),
    "Add to Queue": objectValidator({
        type: exactMatchValidator(['Add to Queue']),
        info: objectValidator({
            queueId: mongoIdStringRequired,
            playback: phonePlaybackValidatorOptional,
        }),
    }),
});
export var phoneTreeNodeValidator = objectValidator({
    id: stringValidator100,
    action: phoneTreeActionValidator,
    events: phoneTreeEventsValidator,
    flowchartUI: flowchartUIValidator,
});
export var phoneTreeNodesValidator = listValidatorEmptyOk(phoneTreeNodeValidator);
var _PHONE_TREE_ENDUSER_CONDITIONS = {
    All: '',
    Unassigned: '',
};
export var PHONE_TREE_ENDUSER_CONDITIONS = Object.keys(_PHONE_TREE_ENDUSER_CONDITIONS);
export var phoneTreeEnduserConditionValidator = exactMatchValidator(PHONE_TREE_ENDUSER_CONDITIONS);
export var formCustomizationValidator = objectValidator({
    publicFormHTMLDescription: stringValidator5000OptionalEmptyOkay,
    publicFormSubmitHTMLDescription: stringValidator5000OptionalEmptyOkay,
    publicLabelPrefix: stringValidator5000OptionalEmptyOkay,
    hideProgressBar: booleanValidatorOptional,
    hideLogo: booleanValidatorOptional,
    showRestartAtEnd: booleanValidatorOptional,
    multiPagePublicQuestions: booleanValidatorOptional,
    logoHeight: numberValidatorOptional,
    hideBg: booleanValidatorOptional,
    portalShowThanksAfterSubmission: booleanValidatorOptional,
    publicFnameLabel: stringValidatorOptionalEmptyOkay,
    publicLnameLabel: stringValidatorOptionalEmptyOkay,
    publicDateOfBirthLabel: stringValidatorOptionalEmptyOkay,
    publicEmailLabel: stringValidatorOptionalEmptyOkay,
    publicGenderLabel: stringValidatorOptionalEmptyOkay,
    publicPhoneLabel: stringValidatorOptionalEmptyOkay,
    publicStateLabel: stringValidatorOptionalEmptyOkay,
});
export var languageValidator = objectValidator({
    displayName: stringValidator100,
    iso6391: stringValidator100,
});
export var tableViewColumnsValidator = listValidatorEmptyOk(objectValidator({
    field: stringValidator100,
    width: numberValidatorOptional,
    type: stringValidatorOptionalEmptyOkay,
    wrap: stringValidatorOptional,
}));
export var formFieldCalloutConditionsValidator = listValidatorOptionalOrEmptyOk(objectValidator({
    comparison: exactMatchValidator(['Equals']),
    value: stringValidator1000,
}));
export var endusersReportQueriesValidator = objectAnyFieldsValidator(objectValidator({
    groupBy: stringValidatorOptional,
    createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
    range: dateRangeOptionalValidator,
    activeSince: dateOptionalOrEmptyStringValidator,
    fields: listValidatorOptionalOrEmptyOk(objectValidator({ field: stringValidator, value: stringValidator })),
    mmddyyyyRangeField: stringValidatorOptional,
    filter: objectAnyFieldsAnyValuesValidator,
    // hasSubmittedForms: objectValidator<EnduserReportQuery['hasSubmittedForms']>({
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasNotSubmittedForms: objectValidator<EnduserReportQuery['hasNotSubmittedForms']>({
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasAppointment: objectValidator<EnduserReportQuery['hasAppointment']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundCall: objectValidator<EnduserReportQuery['hasInboundCall']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundChat: objectValidator<EnduserReportQuery['hasInboundChat']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundEmail: objectValidator<EnduserReportQuery['hasInboundEmail']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasInboundSMS: objectValidator<EnduserReportQuery['hasInboundSMS']>({
    //   range: dateRangeOptionalValidator,
    // }, { isOptional: true, emptyOk: true }),
    // hasEngaged: objectValidator<EnduserReportQuery['hasEngaged']>({ // when provided, the above engagement queries are ignored
    //   range: dateRangeOptionalValidator,
    //   omitFormResponses: booleanValidatorOptional,
    //   formIds: listOfStringsValidatorOptionalOrEmptyOk,
    // }, { isOptional: true, emptyOk: true }),
}));
export var formResponsesReportQueriesValidator = objectAnyFieldsValidator(objectValidator({
    groupBy: stringValidatorOptional,
    range: dateRangeOptionalValidator,
    submittedAtRange: dateRangeOptionalValidator,
    answers: listOfStringsValidatorOptionalOrEmptyOk,
    submittedAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
    mmddyyyyRangeField: stringValidatorOptional,
    createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
}));
export var phoneCallsReportQueriesValidator = objectAnyFieldsValidator(objectValidator({
    groupBy: stringValidatorOptional,
    range: dateRangeOptionalValidator,
    createdAtBuckets: listValidatorOptionalOrEmptyOk(dateValidator),
    mmddyyyyRangeField: stringValidatorOptional,
}));
// duped in react components, forms, hooks
export var isDateString = function (_s) {
    if (_s === void 0) { _s = ''; }
    var s = _s.trim();
    if (!/^\d{2}-\d{2}-\d{4}$/.test(s)) {
        return false;
    }
    // this seems to have inconsistent behavior in some mobile browsers, leave out for now
    // // ensure mm-dd-yyyy is actually valid
    // const [mm,dd,yyyy] = s.split('-').map(v => parseInt(v)) // don't shorthand, for radix argument of parseInt gets messed up
    // const d = Date.parse(`${yyyy}-${mm}-${dd}`) // this format should be explicitly supported by all implementations
    // if (isNaN(d)) return false
    return true;
};
export var imageAttachmentValidator = objectValidator({
    type: stringValidator,
    url: stringValidator,
});
export var mmsMessageValidator = objectValidator({
    message: stringValidator1000,
    sender: mongoIdStringRequired,
    timestamp: nonNegNumberValidator,
    images: listValidatorOptionalOrEmptyOk(imageAttachmentValidator),
});
export var mmsMessagesValidator = listValidator(mmsMessageValidator);
export var groupMMSUserStateValidator = objectValidator({
    numUnread: nonNegNumberValidator,
    id: stringValidator,
    markedUnread: booleanValidatorOptional,
});
export var groupMMSUserStatesValidator = listValidatorOptionalOrEmptyOk(groupMMSUserStateValidator);
var sortingFieldValidator = objectValidator({
    ascending: booleanValidator,
    field: stringValidator1000,
    type: exactMatchValidator(['date', 'number', 'string'])
});
export var sortingFieldsValidator = listValidatorEmptyOk(sortingFieldValidator);
var _DIAGNOSIS_TYPES = {
    ABF: '',
    ABJ: '',
    ABK: '',
    APR: '',
    BF: '',
    BJ: '',
    BK: '',
    DR: '',
    LOI: '',
    PR: '',
};
export var DIAGNOSIS_TYPES = Object.keys(_DIAGNOSIS_TYPES);
export var diagnosisTypeValidator = exactMatchValidator(DIAGNOSIS_TYPES);
export var candidProcedureCodeValidator = objectValidator({
    code: stringValidator,
    quantity: numberValidator,
    units: exactMatchValidator(["MJ", "UN"]),
});
export var diagnosisValidator = objectValidator({
    type: diagnosisTypeValidator,
    code: stringValidator,
    procedureCodes: listValidatorOptionalOrEmptyOk(candidProcedureCodeValidator),
    modifiers: listOfStringsValidatorOptionalOrEmptyOk,
});
export var diagnosesValidator = listValidator(diagnosisValidator);
var enduserProfileWebhookValidator = objectValidator({
    label: stringValidator,
    url: stringValidator,
    method: exactMatchValidator(['Link', 'POST'], { isOptional: true })
});
export var enduserProfileWebhooksValidator = listValidatorEmptyOk(enduserProfileWebhookValidator);
export var syncDirectionValidator = exactMatchValidator(['Bidirectional', 'From Tellescope', 'To Tellescope']);
export var fieldSyncValidator = objectValidator({
    field: stringValidator100,
    externalField: objectValidator({
        id: stringValidator100,
        options: listValidatorOptionalOrEmptyOk(objectValidator({
            id: stringValidator,
            value: stringValidator,
        }))
    }),
    direction: syncDirectionValidator,
    dateFormat: stringValidatorOptional,
});
export var fieldsSyncValidator = listValidatorEmptyOk(fieldSyncValidator);
export var athenaSubscriptionTypeValidator = exactMatchValidator(['patients', 'appointments', 'orders', 'chart/healthhistory/problems', 'obepisode']);
export var athenaSubscriptionValidator = objectValidator({
    type: athenaSubscriptionTypeValidator,
    frequencyInMinutes: nonNegNumberValidator,
    lastSyncedAt: dateValidator,
});
export var athenaSubscriptionsValidator = listValidatorEmptyOk(athenaSubscriptionValidator);
export var fieldMappingValidator = objectValidator({
    field: stringValidator250,
    externalField: stringValidator250,
    type: stringValidator100,
});
export var fieldMappingsValidator = listValidatorEmptyOk(fieldMappingValidator);
export var analyticsFrameGroupingCategoryValidator = objectValidator({
    category: stringValidator250,
    keys: listOfStringsValidatorEmptyOk,
});
export var analyticsFrameGroupingCategoriesValidator = listValidatorEmptyOk(analyticsFrameGroupingCategoryValidator);
export var bookingRestrictionsByTemplateValidator = listValidatorEmptyOk(objectValidator({
    templateId: mongoIdStringRequired,
    restrictions: objectValidator({
        careTeam: booleanValidatorOptional,
        state: booleanValidatorOptional,
        hoursBefore: numberValidatorOptional,
        hoursAfter: numberValidatorOptional,
        tagsPortal: listOfStringsValidatorOptionalOrEmptyOk,
        shouldOpenJoinLink: booleanValidatorOptional,
    }),
}));
export var enduserDiagnosisValidator = objectValidator({
    id: stringValidatorOptional,
    active: booleanValidatorOptional,
    code: stringValidator100,
    display: stringValidatorOptionalEmptyOkay,
    end: stringValidatorOptional,
    start: stringValidatorOptional,
    externalId: stringValidatorOptional,
    source: stringValidatorOptional,
    references: relatedRecordsValidatorOptional,
    createdAt: dateValidatorOptional,
});
//# sourceMappingURL=validation.js.map