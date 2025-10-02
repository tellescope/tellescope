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
import { TIMEZONES, USA_STATE_TO_TIMEZONE } from "@tellescope/types-models";
import { ADMIN_ROLE, ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME, CANVAS_TITLE, ENDUSER_FIELDS_WITH_NESTED_PATHS_DISPLAY_NAME, get_inverse_relationship_type, HEALTHIE_TITLE, MM_DD_YYYY_REGEX, READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME } from "@tellescope/constants";
import sanitizeHtml from 'sanitize-html';
import { DateTime } from "luxon";
import { ObjectId } from "./ObjectId/objectid";
export { ObjectId };
export var user_is_admin = function (u) { var _a; return u.type === 'enduser' ? false : !!((_a = u === null || u === void 0 ? void 0 : u.roles) === null || _a === void 0 ? void 0 : _a.includes(ADMIN_ROLE)); };
export var first_letter_capitalized = function (s) {
    if (s === void 0) { s = ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
};
export var first_letter_lowercase = function (s) {
    if (s === void 0) { s = ''; }
    return s.charAt(0).toLowerCase() + s.slice(1);
};
export var object_is_empty = function (o) { return Object.keys(o).length === 0 && o.constructor === Object; };
export var is_truthy = function (f) { return !!f; };
export var is_defined = function (f) { return f !== undefined; };
export var filter_object = function (o, validator) {
    if (o === void 0) { o = {}; }
    if (validator === void 0) { validator = is_defined; }
    var newObject = {};
    for (var f in o) {
        var value = o[f];
        if (validator(value))
            newObject[f] = value;
    }
    return newObject;
};
export var is_object = function (obj) { return typeof obj === "object" && obj !== null; };
// fields that are defined and match by equality
export var matching_fields = function (fields, o1, o2) {
    var matches = {};
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var k = fields_1[_i];
        if (o1[k] && o1[k] === o2[k]) { // may need deeper equality check for objects
            matches[k] = o1[k];
        }
    }
    return matches;
};
var WHITE_SPACE_EXP = /^\s*$/;
export var is_whitespace = function (s) {
    if (s === void 0) { s = ''; }
    return WHITE_SPACE_EXP.test(s);
};
export var url_safe_path = function (p) {
    if (p === void 0) { p = ''; }
    return p.replace(/_/g, '-');
};
export var to_object_id = function (s) {
    if (s === void 0) { s = ''; }
    return new ObjectId(s);
};
export var objects_equivalent = function (o1, o2) {
    if (o1 === null || o2 === null)
        return o1 === o2; // null is base case for typeof === object
    // date case
    if (o1 instanceof Date && typeof o2 === 'string') {
        return o1.getTime() === new Date(o2).getTime();
    }
    if (o2 instanceof Date && typeof o1 === 'string') {
        return o2.getTime() === new Date(o1).getTime();
    }
    if (typeof o1 !== "object" || typeof o2 !== 'object')
        return o1 === o2; // base case  
    var k1 = Object.keys(o1), k2 = Object.keys(o2);
    for (var _i = 0, k1_1 = k1; _i < k1_1.length; _i++) { // keys must be equal sets
        var k = k1_1[_i];
        if (!k2.includes(k))
            return false;
    }
    for (var _a = 0, k2_1 = k2; _a < k2_1.length; _a++) { // keys must be equal sets
        var k = k2_1[_a];
        if (!k1.includes(k))
            return false;
    }
    for (var _b = 0, k1_2 = k1; _b < k1_2.length; _b++) { // recurse in case 
        var k = k1_2[_b];
        if (!objects_equivalent(o1[k], o2[k])) {
            return false;
        }
    }
    return true;
};
export var user_display_name = function (user) {
    if (!user)
        return '';
    var fname = user.fname, lname = user.lname, email = user.email, phone = user.phone, id = user.id, displayName = user.displayName, internalDisplayName = user.internalDisplayName;
    if (internalDisplayName)
        return internalDisplayName;
    if (fname && lname)
        return "".concat(fname, " ").concat(lname);
    if (fname)
        return fname;
    if (displayName)
        return displayName;
    if (email)
        return email;
    if (phone)
        return phone;
    if (id)
        return "User ".concat(id);
    return '';
};
export var user_is_active = function (user, options) {
    if (!user)
        return null;
    var activeThresholdMS = (options === null || options === void 0 ? void 0 : options.activeThresholdMS) || 300000; // 5 minutes
    var inactiveThresholdMS = (options === null || options === void 0 ? void 0 : options.inactiveThresholdMS) || 1500000; // 15 minutes
    if (activeThresholdMS < 0)
        throw new Error('activeThresholdMS must be positive');
    if (inactiveThresholdMS < 0)
        throw new Error('inactiveThresholdMS must be positive');
    var lastLogout = new Date(user.lastLogout).getTime();
    var lastActive = new Date(user.lastActive).getTime();
    if (lastLogout > lastActive)
        return 'Unavailable';
    if (Date.now() - lastActive < activeThresholdMS)
        return 'Active';
    if (Date.now() - lastActive < inactiveThresholdMS)
        return 'Away';
    return 'Unavailable';
};
export var defined_fields = function (o) {
    var filtered = {};
    for (var field in o) {
        if (o[field] !== undefined)
            filtered[field] = o[field];
    }
    return filtered;
};
export var truncate_string = function (s, options) {
    var _a, _b;
    if (s === void 0) { s = ''; }
    if (options === void 0) { options = {}; }
    if (typeof s !== 'string')
        return ''; // safeguard
    if (typeof options.length === 'number' && options.length < 0)
        throw new Error("Length must be positive");
    var showEllipsis = (_a = options.showEllipsis) !== null && _a !== void 0 ? _a : true;
    var length = (_b = options.length) !== null && _b !== void 0 ? _b : 25;
    return (s.substring(0, length) +
        (showEllipsis && s.length > length ? '...' : ''));
};
export var map_object = function (object, handler) { return (Object.keys(object).map(function (key) { return handler(key, object[key]); })); };
var _a = [0, 1, 2, 3], LINK_START = _a[0], LINK_END = _a[1], TEXT_START = _a[2], TEXT_END = _a[3];
export var parse_link_template = function (text, startFrom) {
    var start = 0;
    var state = LINK_START;
    var linkChars = [];
    var linkTextChars = [];
    var additionalOpenBraceCount = 0;
    for (var i = startFrom || 0; i < text.length; i++) {
        var char = text[i];
        if (state === LINK_START) {
            if (char === '{') {
                start = i;
                state = LINK_END;
            }
        }
        else if (state === LINK_END) {
            if (char === '{') {
                additionalOpenBraceCount++;
                linkChars.push(char);
            }
            else if (char === '}') {
                if (additionalOpenBraceCount) {
                    additionalOpenBraceCount--;
                    linkChars.push(char);
                }
                else {
                    state = TEXT_START;
                }
            }
            else {
                linkChars.push(char);
            }
        }
        else if (state === TEXT_START) {
            if (char === '[') {
                state = TEXT_END;
            }
            else if (!is_whitespace(char)) { // only allow whitespace between {link} and [linkText]
                start = 0;
                linkChars = [];
                state = LINK_START; // start seeking new link
            }
        }
        else {
            if (char === ']') {
                return {
                    url: linkChars.join(''),
                    displayName: linkTextChars.join('')
                };
            }
            else {
                linkTextChars.push(char);
            }
        }
    }
    return null;
};
var findTemplateElement = function (text) {
    var startIndex = text.indexOf('{{');
    if (startIndex === -1)
        return undefined;
    var endIndex = text.indexOf('}}');
    if (endIndex === -1)
        return undefined;
    // omits start '{{' with +2, endIndex is not inclusive, so it omits last '}}' 
    return text.substring(startIndex + 2, endIndex);
};
export var getTemplatedData = function (text) {
    var value = findTemplateElement(text);
    var badValue = function (reason) {
        if (reason === void 0) { reason = ''; }
        throw Error("Unrecognized template field: ".concat(value).concat(reason && " (".concat(reason, ")")));
    };
    if (value === undefined)
        return badValue();
    if (value.startsWith('forms') || value.startsWith('form_groups')) {
        var _a = value.split('.'), _1 = _a[0], formId = _a[1], _field = _a[2], rest = _a.slice(3);
        var field = _field + (rest.length
            ? ('.' + rest.join('.'))
            : '');
        if (field.startsWith('link')) {
            return { id: formId, displayName: field.substring(5) };
        }
        return badValue();
    }
    if (value.startsWith('files')) {
        var _b = value.split('.'), _2 = _b[0], fileId = _b[1], field = _b[2];
        if (field.startsWith('link')) {
            return { id: fileId, displayName: field.substring(5) };
        }
        throw Error("Unrecognized template field: ".concat(value));
    }
    if (value.startsWith('content')) {
        var _d = value.split('.'), _3 = _d[0], fileId = _d[1], field = _d[2];
        if (field.startsWith('link')) {
            return { id: fileId, displayName: field.substring(5) };
        }
        throw Error("Unrecognized template field: ".concat(value));
    }
    if (value.startsWith('portal.')) {
        var _e = value.split('.'), _4 = _e[0], action = _e[1], pageWithText = _e[2];
        if (action.startsWith('link') && pageWithText) {
            var _f = pageWithText.split(':').map(function (s) { return s.trim(); }), page = _f[0], displayName = _f[1];
            if (page && displayName) {
                return { page: page, displayName: displayName };
            }
        }
        throw Error("Unrecognized template field: ".concat(value));
    }
    return badValue();
};
export var build_link_string = function (d) { return "{".concat(d.url, "}[").concat(d.displayName, "]"); };
export var build_form_link_string = function (d) { return "{{forms.".concat(d.id, ".link:").concat(d.displayName, "}}"); };
export var build_form_group_link_string = function (d) { return "{{form_groups.".concat(d.id, ".link:").concat(d.displayName, "}}"); };
export var build_file_link_string = function (d) { return "{{files.".concat(d.id, ".link:").concat(d.displayName, "}}"); };
export var build_content_link_string = function (d) { return "{{content.".concat(d.id, ".link:").concat(d.displayName, "}}"); };
export var build_portal_link_string = function (d) { return "{{portal.link.".concat(d.page, ":").concat(d.displayName, "}}"); };
export var to_absolute_url = function (link) { return link.startsWith('http') ? link : '//' + link; }; // ensure absolute url
export var ensure_https_url = function (url) {
    if (!url)
        return url;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    return "https://".concat(url);
};
export var throwFunction = function (s) { throw s; };
export var findFirstUnansweredField = function (fields, existingResponses) {
    var _a;
    if (!existingResponses || existingResponses.length === 0) {
        return undefined;
    }
    // Create a simple map of field responses for quick lookup
    var responseMap = new Map(existingResponses.map(function (r) { return [r.fieldId, r]; }));
    // Find root field
    var rootField = fields.find(function (f) { return f.previousFields.find(function (p) { return p.type === 'root'; }); });
    if (!rootField)
        return undefined;
    // Traverse fields in order to find first unanswered
    var visited = new Set();
    var toProcess = [rootField];
    var _loop_1 = function () {
        var currentField = toProcess.shift();
        if (visited.has(currentField.id))
            return "continue";
        visited.add(currentField.id);
        // Check if this field has a response
        var response = responseMap.get(currentField.id);
        if (!response || !((_a = response.answer) === null || _a === void 0 ? void 0 : _a.value)) {
            return { value: currentField.id };
        }
        // Add next fields to process
        var nextFields = fields.filter(function (f) {
            return f.previousFields.some(function (p) { var _a; return p.type !== 'root' && ((_a = p.info) === null || _a === void 0 ? void 0 : _a.fieldId) === currentField.id; });
        });
        toProcess.push.apply(toProcess, nextFields);
    };
    while (toProcess.length > 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return undefined; // All questions are answered
};
export var wait = function (f, ms) {
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return f ? f.then(resolve).catch(reject) : resolve(); }, ms);
    });
};
export var sorted_records = function (records, options) {
    return __spreadArray([], records, true).sort(function (_r1, _r2) {
        var _a, _b;
        var r1 = (options === null || options === void 0 ? void 0 : options.direction) === 'oldFirst' ? _r2 : _r1;
        var r2 = (options === null || options === void 0 ? void 0 : options.direction) === 'oldFirst' ? _r1 : _r2;
        var result = (new Date(r1[(_a = options === null || options === void 0 ? void 0 : options.key) !== null && _a !== void 0 ? _a : 'createdAt']).getTime()
            - new Date(r2[(_b = options === null || options === void 0 ? void 0 : options.key) !== null && _b !== void 0 ? _b : 'createdAt']).getTime());
        if ((options === null || options === void 0 ? void 0 : options.reverseIfEqual) && result === 0)
            return -1;
        return result;
    });
};
export var MONTHS_FULL = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
export var MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
export var get_time_values = function (date, options) {
    var dayOfMonth = date.getDate();
    var monthNumber = date.getMonth() + 1;
    var month = ((options === null || options === void 0 ? void 0 : options.fullMonth) ? MONTHS_FULL : MONTHS)[monthNumber - 1];
    var hours = date.getHours();
    var minutesRaw = date.getMinutes();
    var secondsRaw = date.getSeconds();
    var seconds = secondsRaw >= 10 ? secondsRaw : "0".concat(secondsRaw);
    var minutes = minutesRaw >= 10 ? minutesRaw : "0".concat(minutesRaw);
    var year = date.getFullYear();
    var amPm = hours < 12 ? 'am' : 'pm';
    var hoursAmPm = (hours === 0
        ? 12
        : hours <= 12 ? hours : hours - 12);
    return { dayOfMonth: dayOfMonth, monthNumber: monthNumber, month: month, hours: hours, hoursAmPm: hoursAmPm, amPm: amPm, minutes: minutes, year: year, seconds: seconds };
};
export var formatted_date = function (date) {
    var _a = get_time_values(date), dayOfMonth = _a.dayOfMonth, month = _a.month, year = _a.year, hoursAmPm = _a.hoursAmPm, amPm = _a.amPm, minutes = _a.minutes;
    if (isNaN(dayOfMonth)
        || !month
        || isNaN(year)
        || isNaN(hoursAmPm)
        || !amPm
        || (typeof minutes === 'number' && isNaN(minutes))) {
        return '';
    }
    return "".concat(month, " ").concat(dayOfMonth, " ").concat(year, ", ").concat(hoursAmPm, ":").concat(minutes).concat(amPm);
};
export var get_add_to_gcal_link = function (event) {
    var start = DateTime.fromMillis(event.startTimeInMS, { zone: 'UTC' });
    var end = DateTime.fromMillis(event.startTimeInMS + event.durationInMinutes * 60 * 1000, { zone: 'UTC' });
    var startString = "".concat(start.toFormat('yyyyLLdd'), "T").concat(start.toFormat('HHmmss'), "Z");
    var endString = "".concat(end.toFormat('yyyyLLdd'), "T").concat(end.toFormat('HHmmss'), "Z");
    var description = event.displayDescription || event.description || '';
    var videoURL = (event.videoURL || event.externalVideoURL || event.healthieZoomJoinURL);
    return ("https://calendar.google.com/calendar/render?action=TEMPLATE&text=".concat((event.displayTitle || event.title).replaceAll(' ', '+'), "&details=").concat(videoURL || '').concat(videoURL ? '<br/>' : '').concat(description, "&dates=").concat(startString, "/").concat(endString));
};
export var formatted_date_hh_mm = function (date) {
    var _a = get_time_values(date), minutes = _a.minutes, hoursAmPm = _a.hoursAmPm, amPm = _a.amPm;
    return "".concat(hoursAmPm, ":").concat(minutes).concat(amPm);
};
/** @deprecated uses month name instead of number */
export var yyyy_mm_dd = function (date) {
    var _a = get_time_values(date), dayOfMonth = _a.dayOfMonth, month = _a.month, year = _a.year;
    return "".concat(year, "-").concat(month, "-").concat(dayOfMonth);
};
export var yyyy_mm_dd_numeric = function (date) {
    var _a = get_time_values(date), dayOfMonth = _a.dayOfMonth, monthNumber = _a.monthNumber, year = _a.year;
    return "".concat(year, "-").concat(monthNumber, "-").concat(dayOfMonth);
};
export var mm_dd_yyyy = function (date) {
    var _a = get_time_values(date), dayOfMonth = _a.dayOfMonth, monthNumber = _a.monthNumber, year = _a.year;
    return "".concat(monthNumber < 10 ? '0' : '').concat(monthNumber, "-").concat(dayOfMonth < 10 ? '0' : '').concat(dayOfMonth, "-").concat(year);
};
/**
 * Parses a date string that can be in ISO format, YYYY-MM-DD format, or MM-DD-YYYY format
 * Uses Luxon for consistent timezone handling - all dates are parsed as UTC to avoid timezone issues
 * @param dateString - Date string in various formats:
 *   - ISO with time: "2024-01-15T10:30:00Z" or "2024-01-15T10:30:00"
 *   - ISO date only: "2024-01-15"
 *   - MM-DD-YYYY: "01-15-2024"
 * @returns Luxon DateTime object or null if parsing fails
 */
export var parse_date_string = function (dateString) {
    if (!dateString)
        return null;
    // Try ISO format first (with or without time)
    var parsed = DateTime.fromISO(dateString, { zone: 'utc' });
    if (parsed.isValid) {
        return parsed;
    }
    // Try MM-DD-YYYY format (common in US date entry)
    if (MM_DD_YYYY_REGEX.test(dateString)) {
        var _a = dateString.split('-').map(Number), month = _a[0], day = _a[1], year = _a[2];
        parsed = DateTime.fromObject({ year: year, month: month, day: day }, { zone: 'utc' });
        if (parsed.isValid) {
            return parsed;
        }
    }
    return null;
};
/**
 * Calculates the number of days between two dates using Luxon for consistent timezone handling
 * All calculations are done in UTC to avoid timezone-related inconsistencies
 * @param date1 - First date (can be Date object, ISO string like "2024-01-15T10:30:00Z" or "2024-01-15", MM-DD-YYYY string like "01-15-2024", or "$now")
 * @param date2 - Second date (can be Date object, ISO string like "2024-01-15T10:30:00Z" or "2024-01-15", MM-DD-YYYY string like "01-15-2024", or "$now")
 * @returns Number of days between the two dates (absolute value, rounded down)
 * @throws Error if either date cannot be parsed
 */
export var calculate_days_between_dates = function (date1, date2) {
    // Handle $now special case - use current UTC time
    var d1 = date1 === '$now'
        ? DateTime.utc()
        : (date1 instanceof Date ? DateTime.fromJSDate(date1, { zone: 'utc' }) : parse_date_string(date1));
    var d2 = date2 === '$now'
        ? DateTime.utc()
        : (date2 instanceof Date ? DateTime.fromJSDate(date2, { zone: 'utc' }) : parse_date_string(date2));
    if (!d1 || !d1.isValid) {
        throw new Error("Invalid date1: ".concat(date1));
    }
    if (!d2 || !d2.isValid) {
        throw new Error("Invalid date2: ".concat(date2));
    }
    // Use Luxon's diff method to get the difference in days
    // startOf('day') ensures we're comparing dates at midnight UTC, avoiding partial day issues
    var diff = d2.startOf('day').diff(d1.startOf('day'), 'days');
    return Math.floor(Math.abs(diff.days));
};
/**
 * Resolves a date value that could be a field reference, hardcoded date string, or "$now"
 * @param dateRef - Date reference which can be:
 *   - "$now" for current date
 *   - A field name to look up in enduserFields
 *   - A direct date string (ISO, YYYY-MM-DD, or MM-DD-YYYY format)
 * @param enduserFields - Object containing enduser custom fields
 * @returns Resolved date value as a string
 */
export var resolve_date_value = function (dateRef, enduserFields) {
    // Handle $now special case
    if (dateRef === '$now') {
        return '$now';
    }
    // Try to resolve as a field reference first
    if (enduserFields === null || enduserFields === void 0 ? void 0 : enduserFields[dateRef]) {
        return enduserFields[dateRef].toString();
    }
    // Otherwise treat as a direct date string
    return dateRef;
};
/**
 * Calculates the number of days between two dates, resolving field references from enduser data
 * This is a convenience function that combines resolve_date_value and calculate_days_between_dates
 * @param date1Ref - First date reference (field name, "$now", or date string)
 * @param date2Ref - Second date reference (field name, "$now", or date string)
 * @param enduserFields - Object containing enduser custom fields for resolving field references
 * @returns Number of days between the two dates (absolute value, rounded down)
 * @throws Error if either date cannot be resolved or parsed
 */
export var calculate_days_between_dates_from_enduser = function (date1Ref, date2Ref, enduserFields) {
    var date1Value = resolve_date_value(date1Ref, enduserFields);
    var date2Value = resolve_date_value(date2Ref, enduserFields);
    return calculate_days_between_dates(date1Value, date2Value);
};
/**
 * Safely calculates date difference for use in Set Fields actions with validation and error handling
 * This function is designed for use in automation triggers and journey actions
 * @param dateDifferenceOptions - Configuration object with date1 and date2 references
 * @param enduserFields - Object containing enduser custom fields for resolving field references
 * @param fieldName - Name of the field being set (for error logging)
 * @param silent - If true, suppresses error console logs (useful for testing error cases)
 * @returns Number of days as a number, or empty string if calculation fails
 */
export var calculate_date_difference_for_set_fields = function (dateDifferenceOptions, enduserFields, fieldName, silent) {
    if (silent === void 0) { silent = false; }
    try {
        if (!dateDifferenceOptions) {
            if (!silent) {
                console.error("Date Difference field '".concat(fieldName, "' is missing dateDifferenceOptions"));
            }
            return '';
        }
        var daysDifference = calculate_days_between_dates_from_enduser(dateDifferenceOptions.date1, dateDifferenceOptions.date2, enduserFields);
        return daysDifference;
    }
    catch (error) {
        if (!silent) {
            console.error("Error calculating date difference for field '".concat(fieldName, "':"), error);
        }
        return '';
    }
};
export var fullMonth_day_year = function (date) {
    var _a = get_time_values(date, { fullMonth: true }), dayOfMonth = _a.dayOfMonth, month = _a.month, year = _a.year;
    return "".concat(month, " ").concat(dayOfMonth, ", ").concat(year);
};
export var time_for_calendar_event = function (event) {
    var start = new Date(event.startTimeInMS);
    var end = new Date(event.startTimeInMS + event.durationInMinutes * 60 * 1000);
    var _a = get_time_values(start), hoursAmPm = _a.hoursAmPm, minutes = _a.minutes, amPm = _a.amPm;
    var _b = get_time_values(end), hoursEnd = _b.hoursAmPm, minutesEnd = _b.minutes, amPmEnd = _b.amPm;
    return "".concat(hoursAmPm, ":").concat(minutes).concat(amPm === amPmEnd ? '' : amPm, "-").concat(hoursEnd, ":").concat(minutesEnd).concat(amPmEnd);
};
export var remove_script_tags = function (s) { return s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ''); };
export var remove_style_tags = function (s) { return s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ''); };
export var remove_image_tags = function (s) { return s.replace(/<img[\s\S]*?>/gi, ''); };
// Sanitizes HTML to allow safe hyperlinks and basic text formatting while removing potentially harmful tags
export var sanitize_html_with_links = function (html) {
    return sanitizeHtml(html, {
        allowedTags: ['a', 'strong', 'b', 'em', 'i', 'u', 'br', 'p', 'img', 'div', 'span'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel', 'style'],
            'img': ['src', 'alt', 'width', 'height', 'style'],
            'div': ['style'],
            'span': ['style'],
            'p': ['style'],
            'strong': ['style'],
            'b': ['style'],
            'em': ['style'],
            'i': ['style'],
            'u': ['style']
        },
        // Automatically add security attributes to external links
        transformTags: {
            'a': function (tagName, attribs) {
                var href = attribs.href || '';
                // Add target="_blank" and security attributes for external links
                if (href.startsWith('http://') || href.startsWith('https://')) {
                    return {
                        tagName: tagName,
                        attribs: __assign(__assign({}, attribs), { target: '_blank', rel: 'noopener noreferrer' })
                    };
                }
                return { tagName: tagName, attribs: attribs };
            }
        },
        // Allow only safe protocols for images
        allowedSchemesByTag: {
            img: ['http', 'https', 'data']
        }
    });
};
export var query_string_for_object = function (query) {
    var queryString = '';
    if (query && !object_is_empty(query)) {
        queryString = '?';
        for (var key in query) {
            queryString += "".concat(key, "=").concat(query[key], "&");
        }
    }
    return queryString;
};
export var PROD_API_URL = 'https://api.tellescope.com';
export var STAGING_API_URL = 'https://staging-api.tellescope.com';
export var TEST_API_URL = "http://localhost:8080";
export var getEnvironment = function () { return (window.location.origin.includes('staging')
    ? 'staging'
    : (window.location.origin.includes('localhost:') || window.location.origin.includes('127.0.0.1:')) // don't check for Tellescope, may be hosted on a custom URL
        ? 'test'
        : 'prod'); };
export var getApiURL = function () { return (window.location.origin.includes('staging')
    ? STAGING_API_URL
    : (window.location.origin.includes('localhost:') || window.location.origin.includes('127.0.0.1:')) // don't check for Tellescope, may be hosted on a custom URL
        ? TEST_API_URL
        : PROD_API_URL); };
export var getGoogleClientId = function () {
    var api = getApiURL();
    return (api === PROD_API_URL
        ? "526353775713-puib79782ac254evqj2fs0sb7acsij65.apps.googleusercontent.com"
        : api === STAGING_API_URL
            ? '826276796073-6rcrqp4duqatbhn8k71saopenqc2fb0i.apps.googleusercontent.com'
            : '842986734352-2c73i6iq2aoau3dj1jvqtmufn2j9g0dm.apps.googleusercontent.com');
};
export var getGoogleClientAPIKey = function () {
    var api = getApiURL();
    return (api === PROD_API_URL
        ? 'AIzaSyCYCWiLkYifffepu5L-p1x4yUExf5aWpuA'
        : api === STAGING_API_URL
            ? "AIzaSyDUCT6r5qQx8yniMuP-Y9Ni08THoLQtG6M"
            : "AIzaSyBW9D0mg3ISvNQcSB0Z_PwHNuD0OhFdMKg");
};
var PUBLIC_ASSET_BUCKET = "tellescope-public-files";
export var getBuiltInPublicFileName = function (_a) {
    var _b;
    var name = _a.name, organizationIds = _a.organizationIds;
    return ("".concat(name).concat((_b = organizationIds === null || organizationIds === void 0 ? void 0 : organizationIds[organizationIds.length - 1]) !== null && _b !== void 0 ? _b : ''));
};
export var getOrgnizationLogoURL = function (_a) {
    var organizationIds = _a.organizationIds, id = _a.id, businessId = _a.businessId, logoVersion = _a.logoVersion, args = __rest(_a, ["organizationIds", "id", "businessId", "logoVersion"]);
    return (getPublicFileURL(__assign(__assign({}, args), { version: logoVersion, businessId: businessId !== null && businessId !== void 0 ? businessId : id, name: getBuiltInPublicFileName({ organizationIds: organizationIds, name: 'logo' }) })));
};
export var getOrgnizationFaviconURL = function (_a) {
    var organizationIds = _a.organizationIds, businessId = _a.businessId, id = _a.id, faviconVersion = _a.faviconVersion, args = __rest(_a, ["organizationIds", "businessId", "id", "faviconVersion"]);
    return (getPublicFileURL(__assign(__assign({}, args), { version: faviconVersion, businessId: businessId !== null && businessId !== void 0 ? businessId : id, name: getBuiltInPublicFileName({ organizationIds: organizationIds, name: 'favicon' }) })));
};
export var getPublicFileURL = function (_a) {
    var businessId = _a.businessId, name = _a.name, version = _a.version, apiURL = _a.apiURL;
    var api = apiURL || getApiURL();
    var ENV_PREFIX = api === PROD_API_URL ? "prod"
        : api === STAGING_API_URL ? "staging"
            : "test";
    return "https://".concat(PUBLIC_ASSET_BUCKET, ".s3.amazonaws.com/").concat(ENV_PREFIX, "/").concat(businessId, "/").concat(name, "?version=").concat(version !== null && version !== void 0 ? version : 0);
};
export var getDefaultPortalURL = function (_a) {
    var subdomain = _a.subdomain;
    var api = getApiURL();
    if (api === TEST_API_URL)
        return "http://localhost:3030";
    return ("https://".concat(subdomain, ".").concat(api === PROD_API_URL ? 'portal' : 'staging-portal', ".tellescope.com"));
};
export var matches_organization = function (value, orgInfo) {
    var _a, _b, _d, _e;
    // case of organization model itself where businessId isn't necessarily set
    if (value.id === (orgInfo === null || orgInfo === void 0 ? void 0 : orgInfo.businessId) && !(orgInfo === null || orgInfo === void 0 ? void 0 : orgInfo.organizationIds))
        return true;
    // case of using organization as orgInfo
    if (!(orgInfo === null || orgInfo === void 0 ? void 0 : orgInfo.businessId) && !((_a = value.organizationIds) === null || _a === void 0 ? void 0 : _a.length))
        return true;
    if ((value === null || value === void 0 ? void 0 : value.businessId) !== (orgInfo === null || orgInfo === void 0 ? void 0 : orgInfo.businessId))
        return false;
    if (((_b = value === null || value === void 0 ? void 0 : value.organizationIds) !== null && _b !== void 0 ? _b : []).length !== ((_d = orgInfo.organizationIds) !== null && _d !== void 0 ? _d : []).length)
        return false;
    // since length is same, we need a 1-way match that all organizationIds in orgInfo are found in value.organizationIds
    var mismatch = (_e = orgInfo.organizationIds) === null || _e === void 0 ? void 0 : _e.find(function (id) { var _a, _b; return !((_b = ((_a = value === null || value === void 0 ? void 0 : value.organizationIds) !== null && _a !== void 0 ? _a : [])) === null || _b === void 0 ? void 0 : _b.includes(id)); });
    if (mismatch)
        return false;
    return true;
};
export var is_suborganization = function (_a) {
    var parent = _a.parent, child = _a.child;
    for (var _i = 0, parent_1 = parent; _i < parent_1.length; _i++) {
        var value = parent_1[_i];
        if (!child.includes(value))
            return false;
    }
    return true;
};
// !u.organizationIds?.length // [] or undefined  
// || ( // enduser is shared with the user's organization
//   (enduser.sharedWithOrganizations ?? [])
//   .find(sharedIds => 
//     u.organizationIds?.find(ids => objects_equivalent(sharedIds, ids))
//   )
export var user_has_record_access = function (user, record) {
    var _a, _b, _d;
    if (user.businessId !== record.businessId)
        return false;
    if (!((_a = user.organizationIds) === null || _a === void 0 ? void 0 : _a.length))
        return true; // user is part of root organization
    if (record.organizationIds) {
        if (is_suborganization({ parent: (_b = user.organizationIds) !== null && _b !== void 0 ? _b : [], child: record.organizationIds })) {
            return true;
        }
    }
    for (var _i = 0, _e = (_d = record.sharedWithOrganizations) !== null && _d !== void 0 ? _d : []; _i < _e.length; _i++) {
        var organizationIds = _e[_i];
        // this must be an exact match
        if (objects_equivalent(organizationIds, user.organizationIds))
            return true;
    }
    return false;
};
export var is_table_input_response = function (v) { return (!!(Array.isArray(v) && Array.isArray(v[0]) && v[0][0].label)); };
export var form_response_value_to_string = function (value, options) {
    var _a, _b, _d, _e, _f, _g;
    if (value === null || value === undefined)
        return '';
    if (value && typeof value === 'string' && is_checkbox_custom_field_value(value)) {
        if (options === null || options === void 0 ? void 0 : options.returnRawCheckbox)
            return value;
        return "✅";
    }
    var maybeDate = (((options === null || options === void 0 ? void 0 : options.convertISODate) && typeof value === 'string')
        ? is_full_iso_string_heuristic(value)
        : undefined);
    if (maybeDate) {
        return formatted_date(maybeDate);
    }
    if (value instanceof Date) {
        return formatted_date(value);
    }
    if (typeof value === 'string')
        return value;
    if (typeof value === 'number' || typeof value === 'boolean')
        return value.toString();
    var anyValue = value;
    if ((anyValue === null || anyValue === void 0 ? void 0 : anyValue.value) !== 'object' && (anyValue === null || anyValue === void 0 ? void 0 : anyValue.unit)
        && typeof (anyValue === null || anyValue === void 0 ? void 0 : anyValue.value) !== 'object' && typeof (anyValue === null || anyValue === void 0 ? void 0 : anyValue.unit) !== 'object') {
        return "".concat(anyValue.value, " ").concat(anyValue.unit);
    }
    if ((anyValue === null || anyValue === void 0 ? void 0 : anyValue.text) && (anyValue === null || anyValue === void 0 ? void 0 : anyValue.recordId))
        return anyValue.text;
    if (anyValue.name) { // file
        return anyValue.name;
    }
    else if (Array.isArray(anyValue)) {
        // VALUE MAY BE UNDEFINED
        var value_1 = anyValue[0];
        if ((value_1 === null || value_1 === void 0 ? void 0 : value_1.text) && (value_1 === null || value_1 === void 0 ? void 0 : value_1.recordId)) { // DatabaseSelect repsonse
            return (anyValue.map(function (row) { return (row.text || 'No response provided'); }).join(', '));
        }
        if (Array.isArray(anyValue) && (((_a = anyValue[0]) === null || _a === void 0 ? void 0 : _a.displayTerm) || ((_b = anyValue[0]) === null || _b === void 0 ? void 0 : _b.drugName))) {
            return anyValue.map(function (medication) {
                var _a, _b, _d;
                if (medication === void 0) { medication = {}; }
                return "".concat(medication.drugName && medication.drugName !== 'Unknown' ? medication.drugName : medication.displayTerm, "\n").concat(((_a = medication.dosage) === null || _a === void 0 ? void 0 : _a.quantity) ? "".concat(medication.dosage.quantity, " units") : '').concat(((_b = medication.dosage) === null || _b === void 0 ? void 0 : _b.frequency) ? "".concat(((_d = medication.dosage) === null || _d === void 0 ? void 0 : _d.quantity) ? ', ' : '').concat(medication.dosage.frequency, "x daily") : '', "\nReason: ").concat(medication.reasonForTaking || 'Not provided');
            }).join('\n\n');
        }
        if (Array.isArray(value_1) && value_1[0].label) { // is Table Input response --> todo: replace with is_table_input_response
            return (anyValue
                .map(function (row) {
                return row
                    .map(function (c) { return c.entry || 'No response provided'; })
                    .join(', ');
            })
                .join('\n'));
        }
        if (Array.isArray(anyValue) && (((_d = anyValue[0]) === null || _d === void 0 ? void 0 : _d.display) || ((_e = anyValue[0]) === null || _e === void 0 ? void 0 : _e.code))) {
            return anyValue.map(function (v) { return "".concat(v.display, " (").concat(v.code, ")"); }).join('\n\n');
        }
        return anyValue.join(', ');
    }
    else if (anyValue.fullName) { // signature
        return anyValue.fullName;
    }
    if (typeof anyValue === 'object') {
        var response = "\n";
        for (var k in anyValue) {
            response += "".concat(k, ": ").concat((_f = anyValue[k]) === null || _f === void 0 ? void 0 : _f.toString(), "\n");
        }
        return response;
        // return JSON.stringify(anyValue, null, 2)
    }
    return (_g = value === null || value === void 0 ? void 0 : value.toString()) !== null && _g !== void 0 ? _g : '';
};
export var is_organization_owner = function (organization, userId) { return (organization.owner // when owner is defined, creator is not relevant / overridden
    ? organization.owner === userId
    : organization.creator === userId); };
export var update_local_storage = function (key, value) {
    try {
        window.localStorage[key] = value;
    }
    catch (err) { }
};
export var read_local_storage = function (key) {
    try {
        return window.localStorage[key];
    }
    catch (err) { }
};
export var payment_cost_to_string = function (c) {
    if (c.currency === 'USD') {
        return "$".concat((c.amount / 100).toFixed(2));
    }
    return '';
};
export var safeJSONParse = function (s) {
    try {
        if (!s)
            return undefined;
        return JSON.parse(s);
    }
    catch (err) {
        return undefined;
    }
};
export var timezone_for_enduser = function (e) { return (e.timezone
    ? e.timezone
    : (e.state
        ? USA_STATE_TO_TIMEZONE[e.state]
        : undefined)); };
export var sanitize_html = function (t) { return sanitizeHtml(t, { allowedTags: [], allowedAttributes: {} }); };
export var plaintext_for_managed_content_record = function (record) {
    var _a;
    if (record.type === 'PDF')
        return null;
    if (record.type === 'Video')
        return null;
    if (!((_a = record.blocks) === null || _a === void 0 ? void 0 : _a.length))
        return null;
    return (record
        .blocks
        .filter(function (b) { return (b.type === 'h1'
        || b.type === 'h2'
        || b.type === 'html'); })
        .map(function (b) { return (b.type === 'h1'
        ? b.info.text
        : b.type === 'h2'
            ? b.info.text
            : b.type === 'html'
                ? sanitize_html(b.info.html)
                : ''); })
        .join('\n'));
};
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export var shuffle_array_in_place = function (array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
};
export var evaluate_conditional_logic = function (conditions, evaluate) {
    var key = Object.keys(conditions)[0]; // string is form id
    if (key === '$and') {
        var andConditions = conditions[key];
        for (var _i = 0, andConditions_1 = andConditions; _i < andConditions_1.length; _i++) {
            var c = andConditions_1[_i];
            if (!evaluate_conditional_logic(c, evaluate)) {
                return false;
            }
        }
        return true;
    }
    else if (key === '$or') {
        var orConditions = conditions[key];
        for (var _a = 0, orConditions_1 = orConditions; _a < orConditions_1.length; _a++) {
            var c = orConditions_1[_a];
            if (evaluate_conditional_logic(c, evaluate)) {
                return true;
            }
        }
        return false;
    }
    else if (key === 'condition') {
        var evalKey = Object.keys(conditions[key])[0];
        return evaluate(evalKey, 
        // @ts-ignore
        conditions[key][evalKey]);
    }
    return true;
};
export var get_conditional_logic_values = function (conditions) {
    var key = Object.keys(conditions)[0];
    if (key === '$and') {
        var andConditions = conditions[key];
        return andConditions.flatMap(get_conditional_logic_values);
    }
    else if (key === '$or') {
        var orConditions = conditions[key];
        return orConditions.flatMap(get_conditional_logic_values);
    }
    else if (key === 'condition') {
        if (!Object.values(conditions[key])[0]) {
            return [Object.keys(conditions[key])[0]];
        }
        else {
            return [Object.values(conditions[key])[0]];
        }
    }
    return [];
};
export var replace_keys_and_values_in_object = function (value, replacer) {
    var replacement = replacer(value);
    if (replacement !== value)
        return replacement;
    if (Array.isArray(value)) {
        return __spreadArray([], value, true).map(function (v) { return replace_keys_and_values_in_object(v, replacer); });
    }
    // make sure it's a basic object (constructor === Object) and not a Class, Date, etc.
    if (value && typeof value === 'object' && value.constructor === Object) {
        // don't deep copy, so that we replace keys rather than adding new keys
        var newValue = {};
        for (var k in value) {
            newValue[replace_keys_and_values_in_object(k, replacer)] = replace_keys_and_values_in_object(value[k], replacer);
        }
        return newValue;
    }
    return value;
};
// console.log(
//   'replacement test case',
//   JSON.stringify(
//     replace_values_in_object(
//       {
//         a: 'replace_me',
//         b: 'not_replaced',
//         c: {
//           d: 'replace_me',
//           e: 'not_replaced',
//           f: {
//             g: 'replace_me',
//             h: 'not_replaced',
//           }
//         },
//         d: ['replace_me', 'not_replaced'],
//         f: [{ f: 'replace_me' }, 'not_replaced'],
//       },
//       r => r === 'replace_me' ? 'REPLACED!' : r
//     ), 
//     null, 2
//   )
// )
export var age_for_dob_mmddyyyy = function (mmddyyyy) {
    var _a = mmddyyyy.split('-').map(function (s) { return parseInt(s); }), mm = _a[0], dd = _a[1], yyyy = _a[2]; // ensure second argument to parseInt is not provided
    if (isNaN(mm) || isNaN(dd) || isNaN(yyyy))
        return '';
    var monthIndexedByOne = new Date().getMonth() + 1;
    var ageForYear = new Date().getFullYear() - yyyy;
    var actualAge = (
    // dob is previous month, or dob is current month and day has passed
    (mm < monthIndexedByOne || (mm === monthIndexedByOne && dd <= new Date().getDate()))
        ? ageForYear
        : ageForYear - 1);
    return actualAge;
};
export var get_enduser_field_value_for_key = function (enduser, key) {
    var _a, _b, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _w, _x, _y, _z, _0, _5, _6, _7;
    if (key === 'insurance.payerName')
        return (_a = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _a === void 0 ? void 0 : _a.payerName;
    if (key === 'insurance.memberId')
        return (_b = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _b === void 0 ? void 0 : _b.memberId;
    if (key === 'insurance.payerId')
        return (_d = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _d === void 0 ? void 0 : _d.payerId;
    if (key === 'insurance.groupNumber')
        return (_e = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _e === void 0 ? void 0 : _e.groupNumber;
    if (key === 'insurance.planName')
        return (_f = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _f === void 0 ? void 0 : _f.planName;
    if (key === 'insurance.relationship')
        return (_g = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _g === void 0 ? void 0 : _g.relationship;
    if (key === 'insurance.eligibility')
        return (_h = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _h === void 0 ? void 0 : _h.eligibility;
    if (key === 'insurance.status')
        return (_j = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _j === void 0 ? void 0 : _j.status;
    if (key === 'insurance.payerType')
        return (_k = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _k === void 0 ? void 0 : _k.payerType;
    if (key === 'insurance.startDate')
        return (_l = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _l === void 0 ? void 0 : _l.startDate;
    if (key === 'insuranceSecondary.payerName')
        return (_m = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _m === void 0 ? void 0 : _m.payerName;
    if (key === 'insuranceSecondary.memberId')
        return (_o = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _o === void 0 ? void 0 : _o.memberId;
    if (key === 'insuranceSecondary.payerId')
        return (_p = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _p === void 0 ? void 0 : _p.payerId;
    if (key === 'insuranceSecondary.groupNumber')
        return (_q = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _q === void 0 ? void 0 : _q.groupNumber;
    if (key === 'insuranceSecondary.planName')
        return (_r = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _r === void 0 ? void 0 : _r.planName;
    if (key === 'insuranceSecondary.relationship')
        return (_s = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _s === void 0 ? void 0 : _s.relationship;
    if (key === 'insuranceSecondary.eligibility')
        return (_t = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _t === void 0 ? void 0 : _t.eligibility;
    if (key === 'insuranceSecondary.status')
        return (_u = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _u === void 0 ? void 0 : _u.status;
    if (key === 'insuranceSecondary.payerType')
        return (_w = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _w === void 0 ? void 0 : _w.payerType;
    if (key === 'insuranceSecondary.startDate')
        return (_x = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _x === void 0 ? void 0 : _x.startDate;
    if (key === 'insurance.relationshipDetails') {
        try {
            return JSON.stringify((_z = (_y = enduser === null || enduser === void 0 ? void 0 : enduser.insurance) === null || _y === void 0 ? void 0 : _y.relationshipDetails) !== null && _z !== void 0 ? _z : {});
        }
        catch (err) { }
    }
    if (key === 'insuranceSecondary.relationshipDetails') {
        try {
            return JSON.stringify((_5 = (_0 = enduser === null || enduser === void 0 ? void 0 : enduser.insuranceSecondary) === null || _0 === void 0 ? void 0 : _0.relationshipDetails) !== null && _5 !== void 0 ? _5 : {});
        }
        catch (err) { }
    }
    try {
        if (key === 'createdAt' && enduser._id) {
            return enduser._id.getTimestamp().toISOString();
        }
    }
    catch (err) { }
    try {
        if (key === 'id' && enduser._id) {
            return enduser._id.toString();
        }
    }
    catch (err) { }
    if (key === "Healthie ID") {
        return (enduser.source === HEALTHIE_TITLE && enduser.externalId
            ? enduser.externalId
            : (_7 = (_6 = enduser.references) === null || _6 === void 0 ? void 0 : _6.find(function (r) { return r.type === HEALTHIE_TITLE; })) === null || _7 === void 0 ? void 0 : _7.id);
    }
    return enduser === null || enduser === void 0 ? void 0 : enduser[key];
};
export var UPCOMING_EVENT_COUNT_KEY = '__upcomingEvents__';
export var evaluate_conditional_logic_for_enduser_fields = function (enduser, conditions, o) { return (evaluate_conditional_logic(conditions, function (key, value) {
    var _a, _b, _d, _e, _f, _g, _h;
    return ((key === 'Age' && typeof value === 'object')
        ? (function () {
            if (!enduser.dateOfBirth)
                return false;
            var age = age_for_dob_mmddyyyy(enduser.dateOfBirth);
            if (age === '')
                return false;
            var result = ((value === null || value === void 0 ? void 0 : value['$lt']) !== undefined
                ? (age < parseInt(value['$lt']))
                : (value === null || value === void 0 ? void 0 : value['$gt']) !== undefined
                    ? (age > parseInt(value['$gt']))
                    : false);
            return result;
        })()
        // : (key === 'Tags' && typeof value === 'object')
        //   ? (() => {
        //     if (!(value as ListOfStringsWithQualifier)?.values?.length) return true
        //     return (
        //       (value as ListOfStringsWithQualifier)?.qualifier === 'All Of'
        //         ? (
        //             !!enduser.tags?.length
        //           && enduser.tags?.filter(t => (value as ListOfStringsWithQualifier)?.values?.includes(t)).length === (value as ListOfStringsWithQualifier)?.values?.length
        //         )
        //         : !!enduser.tags?.find(t => (value as ListOfStringsWithQualifier)?.values?.includes(t))
        //     )
        //   })()
        : (key === UPCOMING_EVENT_COUNT_KEY && typeof value === 'object')
            ? (function () {
                var _a, _b;
                if (o === null || o === void 0 ? void 0 : o.ignoreUpcomingEvents)
                    return true;
                var templateIds = (_a = value === null || value === void 0 ? void 0 : value['$templateIds']) !== null && _a !== void 0 ? _a : [];
                var fromOffset = value === null || value === void 0 ? void 0 : value['$fromOffset'];
                var toOffset = value === null || value === void 0 ? void 0 : value['$toOffset'];
                var upcomingEventCount = (_b = ((enduser._upcomingEvents || [])
                    .filter(function (e) { return templateIds.length === 0 || templateIds.includes(e.templateId); })
                    .filter(function (e) { return e.startTimeInMS >= (Date.now() + (fromOffset || 0)); }) // by default, from offset should be zero, as this used to be limited to "upcoming events"
                    .filter(function (e) { return !toOffset || (e.startTimeInMS <= (Date.now() + toOffset)); })
                    .length)) !== null && _b !== void 0 ? _b : 0;
                var result = ((value === null || value === void 0 ? void 0 : value['$lt']) !== undefined
                    ? (upcomingEventCount < parseInt(value['$lt']))
                    : (value === null || value === void 0 ? void 0 : value['$gt']) !== undefined
                        ? (upcomingEventCount > parseInt(value['$gt']))
                        : false);
                return result;
            })()
            : key === 'BMI' && typeof value === 'object'
                ? (function () {
                    var _a, _b, _d, _e;
                    var height = parseInt(((_b = (_a = enduser.height) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString()) || '0');
                    var weight = parseInt(((_e = (_d = enduser.weight) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.toString()) || '0');
                    if (!(height && weight))
                        return false;
                    var bmi = 703 * weight / (height * height);
                    var result = ((value === null || value === void 0 ? void 0 : value['$lt']) !== undefined
                        ? (bmi < parseInt(value['$lt']))
                        : (value === null || value === void 0 ? void 0 : value['$gt']) !== undefined
                            ? (bmi > parseInt(value['$gt']))
                            : false);
                    return result;
                })()
                : key === 'relationships' && typeof value === 'string'
                    ? (!!((_a = enduser === null || enduser === void 0 ? void 0 : enduser.relationships) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.type === get_inverse_relationship_type(value); })))
                    : key === 'customTypeId'
                        ? (function () {
                            var enduserCustomTypeId = enduser.customTypeId;
                            // Helper function to check if a value represents the default type (Patient)
                            var isDefaultType = function (val) { return !val; };
                            if (typeof value === 'string') {
                                // Direct string comparison
                                if (isDefaultType(value)) {
                                    return isDefaultType(enduserCustomTypeId);
                                }
                                return enduserCustomTypeId === value;
                            }
                            else if (typeof value === 'object' && value !== null) {
                                // Handle operators like $ne, $in, etc.
                                var operator = Object.keys(value)[0];
                                var operatorValue = Object.values(value)[0];
                                if (operator === '$ne') {
                                    if (isDefaultType(operatorValue)) {
                                        return !isDefaultType(enduserCustomTypeId);
                                    }
                                    return enduserCustomTypeId !== operatorValue;
                                }
                                // Add other operators as needed
                                return false;
                            }
                            else if (value === null || value === undefined) {
                                // Handle case where condition value is null/undefined - treat as default type
                                return isDefaultType(enduserCustomTypeId);
                            }
                            return false;
                        })()
                        : typeof value === 'object'
                            ? (function () {
                                var _a, _b, _d, _e, _f, _g, _h, _j, _k, _l;
                                var k = Object.keys(value)[0];
                                var v = Object.values(value)[0];
                                if (key === 'Journeys' && (k === '$in' || k === '$nin')) {
                                    var isInJourney = ((_a = enduser === null || enduser === void 0 ? void 0 : enduser.journeys) === null || _a === void 0 ? void 0 : _a[v]) !== undefined;
                                    return ((k === '$in' && isInJourney)
                                        || (k === "$nin" && !isInJourney));
                                }
                                if (k === '$before' || k === '$after') {
                                    var vDate = v === '$now' ? new Date() : new Date(v);
                                    if (isNaN(vDate.getTime()))
                                        return false;
                                    var eDateField = (_d = (_b = enduser.fields) === null || _b === void 0 ? void 0 : _b[key]) !== null && _d !== void 0 ? _d : get_enduser_field_value_for_key(enduser, key);
                                    if (!eDateField)
                                        return false;
                                    if (typeof eDateField !== 'string')
                                        return false;
                                    var eDate = ((eDateField.includes('-') && eDateField.length === 10)
                                        ? new Date(MM_DD_YYYY_to_YYYY_MM_DD(eDateField))
                                        : new Date(eDateField));
                                    if (isNaN(eDate.getTime()))
                                        return false;
                                    return ((k === '$before' && eDate.getTime() < vDate.getTime())
                                        || (k === '$after' && eDate.getTime() > vDate.getTime()));
                                }
                                if (k === '$lt' || k === '$gt') {
                                    var enduserValue = (_e = enduser.fields) === null || _e === void 0 ? void 0 : _e[key];
                                    if (typeof enduserValue !== 'number')
                                        return false;
                                    var _v = (typeof v === 'number'
                                        ? v
                                        : parseInt(v));
                                    if (isNaN(_v))
                                        return false;
                                    return ((k === '$lt' && enduserValue < _v)
                                        || (k === '$gt' && enduserValue > _v));
                                }
                                if (k === '$contains' || k === '$doesNotContain') {
                                    var enduserValue = ((_g = (_f = enduser.fields) === null || _f === void 0 ? void 0 : _f[key]) !== null && _g !== void 0 ? _g : get_enduser_field_value_for_key(enduser, key));
                                    var contains = (Array.isArray(enduserValue)
                                        ? !!enduserValue.find(function (ev) { return typeof ev === 'string' && ev.includes(v); })
                                        : typeof enduserValue === 'string'
                                            ? enduserValue.includes(v)
                                            : enduserValue === v);
                                    return ((k === '$contains' && contains)
                                        || (k === '$doesNotContain' && !contains));
                                }
                                if (k === '$isSet' || k === '$isNotSet') {
                                    var enduserValue = ((_j = (_h = enduser.fields) === null || _h === void 0 ? void 0 : _h[key]) !== null && _j !== void 0 ? _j : get_enduser_field_value_for_key(enduser, key));
                                    var isSet = (Array.isArray(enduserValue)
                                        ? enduserValue.length > 0
                                        : !!enduserValue);
                                    return (k === "$isSet" && isSet) || (k === '$isNotSet' && !isSet);
                                }
                                // should negate the typeof value === 'string' (defaults to $equals) condition
                                if (k === '$ne') {
                                    var enduserValue = ((_l = (_k = enduser.fields) === null || _k === void 0 ? void 0 : _k[key]) !== null && _l !== void 0 ? _l : get_enduser_field_value_for_key(enduser, key));
                                    return !(enduserValue === v
                                        || (Array.isArray(enduserValue) && (enduserValue).includes(v)));
                                }
                                return false;
                            })()
                            : typeof value === 'string'
                                ? (((_d = (_b = enduser.fields) === null || _b === void 0 ? void 0 : _b[key]) !== null && _d !== void 0 ? _d : get_enduser_field_value_for_key(enduser, key)) === value
                                    || ((_f = (_e = enduser.fields) === null || _e === void 0 ? void 0 : _e[key]) !== null && _f !== void 0 ? _f : get_enduser_field_value_for_key(enduser, key)) === parseInt(value)
                                    || (Array.isArray((_g = enduser.fields) === null || _g === void 0 ? void 0 : _g[key])
                                        && ((_h = enduser === null || enduser === void 0 ? void 0 : enduser.fields) === null || _h === void 0 ? void 0 : _h[key]).includes(value))
                                    || (Array.isArray(get_enduser_field_value_for_key(enduser, key))
                                        && enduser[key].includes(value)))
                                : false);
})); };
export var string_matches_key_or_value = function (value, match) {
    if (typeof value === 'string') {
        return value === match;
    }
    if (Array.isArray(value)) {
        return value.find(function (v) { return string_matches_key_or_value(v, match); }) !== undefined;
    }
    if (value && typeof value === 'object') {
        for (var k in value) {
            if (k === match)
                return true;
            if (string_matches_key_or_value(value[k], match))
                return true;
        }
    }
    return false;
};
// console.log(
//   'string match test case',
//   string_matches_key_or_value(
//     {
//       $and: [
//         {
//           condition: {
//             __upcomingEvents__: {
//               $gt: 0,
//             }
//           }
//         }
//       ]
//     }, 
//     UPCOMING_EVENT_COUNT_KEY,
//   )
// )
export var getLocalTimezone = function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; };
export var YYYY_MM_DD_to_MM_DD_YYYY = function (yyyyMmDd, delimiter) {
    if (delimiter === void 0) { delimiter = '-'; }
    if (!yyyyMmDd)
        return ''; // also handles null/undefined if provided mistakenly
    var _a = yyyyMmDd.split(delimiter), yyyy = _a[0], mm = _a[1], dd = _a[2];
    return "".concat(mm, "-").concat(dd, "-").concat(yyyy);
};
export var MM_DD_YYYY_to_YYYY_MM_DD = function (MMDDYYYY, delimiter) {
    if (delimiter === void 0) { delimiter = '-'; }
    var _a = MMDDYYYY.split(delimiter), mm = _a[0], dd = _a[1], yyyy = _a[2];
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd);
};
export var get_recent_engagement_date = function (e) {
    var dates = [];
    if (e.recentEventBookedAt) {
        dates.push(new Date(e.recentEventBookedAt).getTime());
    }
    if (e.recentFormSubmittedAt) {
        dates.push(new Date(e.recentFormSubmittedAt).getTime());
    }
    if (e.recentInboundCallAt) {
        dates.push(new Date(e.recentInboundCallAt).getTime());
    }
    if (e.recentInboundChatAt) {
        dates.push(new Date(e.recentInboundChatAt).getTime());
    }
    if (e.recentInboundSMSAt) {
        dates.push(new Date(e.recentInboundSMSAt).getTime());
    }
    if (e.recentInboundEmailAt) {
        dates.push(new Date(e.recentInboundEmailAt).getTime());
    }
    var max = dates.sort().pop();
    return max ? new Date(max) : undefined;
};
export var get_recent_outbound_communication_date = function (e) {
    var dates = [];
    if (e.recentOutboundCallAt) {
        dates.push(new Date(e.recentOutboundCallAt).getTime());
    }
    if (e.recentOutboundChatAt) {
        dates.push(new Date(e.recentOutboundChatAt).getTime());
    }
    if (e.recentOutboundSMSAt) {
        dates.push(new Date(e.recentOutboundSMSAt).getTime());
    }
    if (e.recentOutboundEmailAt) {
        dates.push(new Date(e.recentOutboundEmailAt).getTime());
    }
    var max = dates.sort().pop();
    return max ? new Date(max) : undefined;
};
// https://www.w3schools.com/tags/ref_urlencode.ASP
// AWS provides = instead of % for some reason, so handle accoringly
var URIReplacements = {
    "=21": "!",
    "=22": "\"",
    "=23": "#",
    "=24": "$",
    "=25": "%",
    "=26": "&",
    "=27": "'",
    "=28": "(",
    "=29": ")",
    "=2A": "*",
    "=2B": "=+",
    "=2C": ",",
    "=2D": "-",
    "=2E": ".",
    "=2F": "/",
    "=30": "0",
    "=31": "1",
    "=32": "2",
    "=33": "3",
    "=34": "4",
    "=35": "5",
    "=36": "6",
    "=37": "7",
    "=38": "8",
    "=39": "9",
    "=3A": ":",
    "=3B": ";",
    "=3C": "<",
    "=3D": "=",
    "=3E": ">",
    "=3F": "?",
    "=40": "@",
    "=41": "A",
    "=42": "B",
    "=43": "C",
    "=44": "D",
    "=45": "E",
    "=46": "F",
    "=47": "G",
    "=48": "H",
    "=49": "I",
    "=4A": "J",
    "=4B": "K",
    "=4C": "L",
    "=4D": "M",
    "=4E": "N",
    "=4F": "O",
    "=50": "P",
    "=51": "Q",
    "=52": "R",
    "=53": "S",
    "=54": "T",
    "=55": "U",
    "=56": "V",
    "=57": "W",
    "=58": "X",
    "=59": "Y",
    "=5A": "Z",
    "=5B": "[",
    "=5C": "\\",
    "=5D": "]",
    "=5E": "^",
    "=5F": "_",
    "=60": "`",
    "=61": "a",
    "=62": "b",
    "=63": "c",
    "=64": "d",
    "=65": "e",
    "=66": "f",
    "=67": "g",
    "=68": "h",
    "=69": "i",
    "=6A": "j",
    "=6B": "k",
    "=6C": "l",
    "=6D": "m",
    "=6E": "n",
    "=6F": "o",
    "=70": "p",
    "=71": "q",
    "=72": "r",
    "=73": "s",
    "=74": "t",
    "=75": "u",
    "=76": "v",
    "=77": "w",
    "=78": "x",
    "=79": "y",
    "=7A": "z",
    "=7B": "{",
    "=7C": "|",
    "=7D": "}",
    "=7E": "~",
    "=7F": "",
    "=80": "",
    "=E2=82=AC": "",
    "=81": "",
    "=82": "",
    "=E2=80=9A": "",
    "=83": "",
    "=C6=92": "",
    "=84": "",
    "=E2=80=9E": "",
    "=85": "",
    "=E2=80=A6": "",
    "=86": "",
    "=E2=80=A0": "",
    "=87": "",
    "=E2=80=A1": "",
    "=88": "",
    "=CB=86": "",
    "=89": "",
    "=E2=80=B0": "",
    "=8A": "",
    "=C5=A0": "",
    "=8B": "",
    "=E2=80=B9": "",
    "=8C": "",
    "=C5=92": "",
    "=8D": "",
    "=C5=8D": "",
    "=8E": "Ž",
    "=C5=BD": "Ž",
    "=8F": "",
    "=90": "",
    "=C2=90": "",
    "=91": "‘",
    "=E2=80=98": "‘",
    "=92": "’",
    "=E2=80=99": "’",
    "=93": "“",
    "=E2=80=9C": "“",
    "=94": "”",
    "=E2=80=9D": "”",
    "=95": "•",
    "=E2=80=A2": "•",
    "=96": "–",
    "=E2=80=93": "–",
    "=97": "—",
    "=E2=80=94": "—",
    "=98": "˜",
    "=CB=9C": "˜",
    "=99": "™",
    "=E2=84": "™",
    "=9A": "",
    "=C5=A1": "",
    "=9B": "",
    "=E2=80": "",
    "=9C": "",
    "=C5=93": "",
    "=9D": "",
    "=9E": "",
    "=C5=BE": "",
    "=9F": "",
    "=C5=B8": "",
    "=A0": "",
    "=C2=A0": "",
    "=A1": "",
    "=C2=A1": "",
    "=A2": "",
    "=C2=A2": "",
    "=A3": "",
    "=C2=A3": "",
    "=A4": "",
    "=C2=A4": "",
    "=A5": "",
    "=C2=A5": "",
    "=A6": "",
    "=C2=A6": "",
    "=A7": "",
    "=C2=A7": "",
    "=A8": "",
    "=C2=A8": "",
    "=A9": "",
    "=C2=A9": "",
    "=AA": "",
    "=C2=AA": "",
    "=AB": "",
    "=C2=AB": "",
    "=AC": "",
    "=C2=AC": "",
    "=AD": "",
    "=C2=AD": "",
    "=AE": "",
    "=C2=AE": "",
    "=AF": "",
    "=C2=AF": "",
    "=B0": "",
    "=C2=B0": "",
    "=B1": "",
    "=C2=B1": "",
    "=B2": "",
    "=C2=B2": "",
    "=B3": "",
    "=C2=B3": "",
    "=B4": "",
    "=C2=B4": "",
    "=B5": "",
    "=C2=B5": "",
    "=B6": "",
    "=C2=B6": "",
    "=B7": "",
    "=C2=B7": "",
    "=B8": "",
    "=C2=B8": "",
    "=B9": "",
    "=C2=B9": "",
    "=BA": "",
    "=C2=BA": "",
    "=BB": "",
    "=C2=BB": "",
    "=BC": "",
    "=C2=BC": "",
    "=BD": "",
    "=C2=BD": "",
    "=BE": "",
    "=C2=BE": "",
    "=BF": "",
    "=C2=BF": "",
    "=C0": "",
    "=C3=80": "",
    "=C1": "",
    "=C3=81": "",
    "=C2": "",
    "=C3=82": "",
    "=C3": "",
    "=C3=83": "",
    "=C4": "",
    "=C3=84": "",
    "=C5": "",
    "=C3=85": "",
    "=C6": "",
    "=C3=86": "",
    "=C7": "",
    "=C3=87": "",
    "=C8": "",
    "=C3=88": "",
    "=C9": "",
    "=C3=89": "",
    "=CA": "",
    "=C3=8A": "",
    "=CB": "",
    "=C3=8B": "",
    "=CC": "",
    "=C3=8C": "",
    "=CD": "",
    "=C3=8D": "",
    "=CE": "",
    "=C3=8E": "",
    "=CF": "",
    "=C3=8F": "",
    "=D0": "",
    "=C3=90": "",
    "=D1": "",
    "=C3=91": "",
    "=D2": "",
    "=C3=92": "",
    "=D3": "",
    "=C3=93": "",
    "=D4": "",
    "=C3=94": "",
    "=D5": "",
    "=C3=95": "",
    "=D6": "",
    "=C3=96": "",
    "=D7": "",
    "=C3=97": "",
    "=D8": "",
    "=C3=98": "",
    "=D9": "",
    "=C3=99": "",
    "=DA": "",
    "=C3=9A": "",
    "=DB": "",
    "=C3=9B": "",
    "=DC": "",
    "=C3=9C": "",
    "=DD": "",
    "=C3=9D": "",
    "=DE": "",
    "=C3=9E": "",
    "=DF": "",
    "=C3=9F": "",
    "=E0": "",
    "=C3=A0": "",
    "=E1": "",
    "=C3=A1": "",
    "=E2": "",
    "=C3=A2": "",
    "=E3": "",
    "=C3=A3": "",
    "=E4": "",
    "=C3=A4": "",
    "=E5": "",
    "=C3=A5": "",
    "=E6": "",
    "=C3=A6": "",
    "=E7": "",
    "=C3=A7": "",
    "=E8": "",
    "=C3=A8": "",
    "=E9": "",
    "=C3=A9": "",
    "=EA": "",
    "=C3=AA": "",
    "=EB": "",
    "=C3=AB": "",
    "=EC": "",
    "=C3=AC": "",
    "=ED": "",
    "=C3=AD": "",
    "=EE": "",
    "=C3=AE": "",
    "=EF": "",
    "=C3=AF": "",
    "=F0": "",
    "=C3=B0": "",
    "=F1": "",
    "=C3=B1": "",
    "=F2": "",
    "=C3=B2": "",
    "=F3": "",
    "=C3=B3": "",
    "=F4": "",
    "=C3=B4": "",
    "=F5": "",
    "=C3=B5": "",
    "=F6": "",
    "=C3=B6": "",
    "=F7": "",
    "=C3=B7": "",
    "=F8": "",
    "=C3=B8": "",
    "=F9": "",
    "=C3=B9": "",
    "=FA": "",
    "=C3=BA": "",
    "=FB": "",
    "=C3=BB": "",
    "=FC": "",
    "=C3=BC": "",
    "=FD": "",
    "=C3=BD": "",
    "=FE": "",
    "=C3=BE": "",
    "=FF": "",
    "=C3=BF": "", // "ÿ"
};
export var URIDecodeEmail = function (content, verbose) { return (content
    .replace(/=\s/gi, '')
    .replaceAll("\r\n", '')
    .replace(/=21|=3D|=22|=23|=24|=25|=26|=27|=28|=29|=2A|=2B|=2C|=2D|=2E|=2F|=30|=31|=32|=33|=34|=35|=36|=37|=38|=39|=3A|=3B|=3C|=3E|=3F|=40|=41|=42|=43|=44|=45|=46|=47|=48|=49|=4A|=4B|=4C|=4D|=4E|=4F|=50|=51|=52|=53|=54|=55|=56|=57|=58|=59|=5A|=5B|=5C|=5D|=5E|=5F|=60|=61|=62|=63|=64|=65|=66|=67|=68|=69|=6A|=6B|=6C|=6D|=6E|=6F|=70|=71|=72|=73|=74|=75|=76|=77|=78|=79|=7A|=7B|=7C|=7D|=7E|=7F|=80|=E2=82=AC|=81|=82|=E2=80=9A|=83|=C6=92|=84|=E2=80=9E|=85|=E2=80=A6|=86|=E2=80=A0|=87|=E2=80=A1|=88|=CB=86|=89|=E2=80=B0|=8A|=C5=A0|=8B|=E2=80=B9|=8C|=C5=92|=8D|=C5=8D|=8E|=C5=BD|=8F|=90|=C2=90|=91|=E2=80=98|=92|=E2=80=99|=93|=E2=80=9C|=94|=E2=80=9D|=95|=E2=80=A2|=96|=E2=80=93|=97|=E2=80=94|=98|=CB=9C|=99|=E2=84|=9A|=C5=A1|=9B|=E2=80|=9C|=C5=93|=9D|=9E|=C5=BE|=9F|=C5=B8|=A0|=C2=A0|=A1|=C2=A1|=A2|=C2=A2|=A3|=C2=A3|=A4|=C2=A4|=A5|=C2=A5|=A6|=C2=A6|=A7|=C2=A7|=A8|=C2=A8|=A9|=C2=A9|=AA|=C2=AA|=AB|=C2=AB|=AC|=C2=AC|=AD|=C2=AD|=AE|=C2=AE|=AF|=C2=AF|=B0|=C2=B0|=B1|=C2=B1|=B2|=C2=B2|=B3|=C2=B3|=B4|=C2=B4|=B5|=C2=B5|=B6|=C2=B6|=B7|=C2=B7|=B8|=C2=B8|=B9|=C2=B9|=BA|=C2=BA|=BB|=C2=BB|=BC|=C2=BC|=BD|=C2=BD|=BE|=C2=BE|=BF|=C2=BF|=C0|=C3=80|=C1|=C3=81|=C2|=C3=82|=C3|=C3=83|=C4|=C3=84|=C5|=C3=85|=C6|=C3=86|=C7|=C3=87|=C8|=C3=88|=C9|=C3=89|=CA|=C3=8A|=CB|=C3=8B|=CC|=C3=8C|=CD|=C3=8D|=CE|=C3=8E|=CF|=C3=8F|=D0|=C3=90|=D1|=C3=91|=D2|=C3=92|=D3|=C3=93|=D4|=C3=94|=D5|=C3=95|=D6|=C3=96|=D7|=C3=97|=D8|=C3=98|=D9|=C3=99|=DA|=C3=9A|=DB|=C3=9B|=DC|=C3=9C|=DD|=C3=9D|=DE|=C3=9E|=DF|=C3=9F|=E0|=C3=A0|=E1|=C3=A1|=E2|=C3=A2|=E3|=C3=A3|=E4|=C3=A4|=E5|=C3=A5|=E6|=C3=A6|=E7|=C3=A7|=E8|=C3=A8|=E9|=C3=A9|=EA|=C3=AA|=EB|=C3=AB|=EC|=C3=AC|=ED|=C3=AD|=EE|=C3=AE|=EF|=C3=AF|=F0|=C3=B0|=F1|=C3=B1|=F2|=C3=B2|=F3|=C3=B3|=F4|=C3=B4|=F5|=C3=B5|=F6|=C3=B6|=F7|=C3=B7|=F8|=C3=B8|=F9|=C3=B9|=FA|=C3=BA|=FB|=C3=BB|=FC|=C3=BC|=FD|=C3=BD|=FE|=C3=BE|=FF|=C3=BF/gi, function (k) {
    // verbose 
    //   ? console.log(k, v[1]?.substring(v[0] - 8, v[0] + 8)) 
    //   : undefined,
    var _a;
    var v = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        v[_i - 1] = arguments[_i];
    }
    // const [i, s] = v
    // const match = s.substring(i, i + k.length) // match just equals k when used this way, but can -/+ to see longer string
    var toReturn = (_a = URIReplacements[k]) !== null && _a !== void 0 ? _a : k;
    // if (i > 3700 && i < 4000) {
    //   if (verbose) { console.log(s.substring(i - 25, i + k.length + 25).replace(k, '=')) }
    //   return match
    // }
    return toReturn;
})); };
export var mfa_is_enabled = function (u) {
    var _a;
    return (!!((_a = u === null || u === void 0 ? void 0 : u.mfa) === null || _a === void 0 ? void 0 : _a.email));
};
export var get_next_reminder_timestamp = function (_a) {
    var startTimeInMS = _a.startTimeInMS, _reminders = _a.reminders, _b = _a.attendees, attendees = _b === void 0 ? [] : _b;
    var reminders = _reminders || [];
    // don't process add-to-journey reminders unless at least 1 enduser is attending
    try {
        reminders = reminders.filter(function (r) {
            return attendees.filter(function (a) { return a.type === 'enduser'; }).length > 0
                || (r.type !== 'add-to-journey');
        });
    }
    catch (err) {
        console.error(err);
    }
    var pending = reminders === null || reminders === void 0 ? void 0 : reminders.filter(function (r) { return !r.didRemind; });
    if (!(pending === null || pending === void 0 ? void 0 : pending.length))
        return -1;
    var maxMsBeforeStartTime = Math.max.apply(Math, pending.map(function (p) { return p.msBeforeStartTime; }));
    return startTimeInMS - maxMsBeforeStartTime;
};
export var capture_is_supported = function () {
    try {
        return document.createElement('input').capture !== undefined;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
export var batch_array = function (array, size) {
    var batches = [];
    for (var i = 0; i < Math.ceil(array.length / size); i++) {
        var batch = [];
        for (var j = i * size; j < (i + 1) * size; j++) {
            if (j >= array.length)
                break;
            batch.push(array[j]);
        }
        batches.push(batch);
    }
    return batches;
};
export var calculate_form_scoring = function (_a) {
    var _b, _d;
    var response = _a.response, form = _a.form;
    if (!((_b = form.scoring) === null || _b === void 0 ? void 0 : _b.length))
        return;
    var scores = {};
    var _loop_2 = function (scoreCondition) {
        var r = (_d = response.responses) === null || _d === void 0 ? void 0 : _d.find(function (r) { return r.fieldId === scoreCondition.fieldId
            && (r.answer.type !== 'multiple_choice'
                || (Array.isArray(r.answer.value)
                    && typeof scoreCondition.response === 'string'
                    && r.answer.value.includes(scoreCondition.response))); });
        if (!r)
            return "continue";
        if (scores[scoreCondition.title] === undefined) {
            scores[scoreCondition.title] = 0;
        }
        if (r.answer.type === 'multiple_choice' && typeof scoreCondition.score === 'number') {
            scores[scoreCondition.title] += scoreCondition.score;
        }
        else if (typeof r.answer.value === 'number') {
            scores[scoreCondition.title] += r.answer.value;
        }
    };
    for (var _i = 0, _e = form.scoring; _i < _e.length; _i++) {
        var scoreCondition = _e[_i];
        _loop_2(scoreCondition);
    }
    if (object_is_empty(scores))
        return;
    var scoresList = [];
    for (var title in scores) {
        scoresList.push({
            title: title,
            value: scores[title]
        });
    }
    return scoresList;
};
// don't change order without updating responses_satisfy_conditions calculations
export var FORM_LOGIC_CALCULATED_FIELDS = ['Calculated: BMI', 'Calculated: Age', 'Calculated: Score', 'Gender', 'State'];
export var FORM_LOGIC_URL_PARAMETER = 'URL Logic Parameter';
export var calculate_bmi = function (e) {
    var _a, _b, _d, _e;
    var height = typeof ((_a = e.height) === null || _a === void 0 ? void 0 : _a.value) === 'number' ? e.height.value : parseInt(((_b = e.height) === null || _b === void 0 ? void 0 : _b.value) || '0');
    var weight = typeof ((_d = e.weight) === null || _d === void 0 ? void 0 : _d.value) === 'number' ? e.weight.value : parseInt(((_e = e.weight) === null || _e === void 0 ? void 0 : _e.value) || '0');
    if (!height)
        return -1;
    if (!weight)
        return -1;
    return (703 * weight / (height * height));
};
var evaluate_response_equals = function (answer, comparison) {
    var _a, _b, _d, _e, _f, _g;
    if (answer.type === 'Database Select' && ((_a = answer.value) === null || _a === void 0 ? void 0 : _a.length)) {
        return (!!answer.value.find(function (v) { return (v === null || v === void 0 ? void 0 : v.text) === comparison; }));
    }
    if (answer.type === 'Insurance') {
        return ((_b = answer.value) === null || _b === void 0 ? void 0 : _b.payerName) === comparison;
    }
    if (answer.type === 'Address') {
        return (comparison === ((_d = answer.value) === null || _d === void 0 ? void 0 : _d.state)
            || comparison === ((_e = answer.value) === null || _e === void 0 ? void 0 : _e.zipCode)
            || comparison === ((_f = answer.value) === null || _f === void 0 ? void 0 : _f.city));
    }
    if (answer.type === 'number' && typeof comparison === 'string') {
        return comparison === ((_g = answer.value) === null || _g === void 0 ? void 0 : _g.toString());
    }
    return (Array.isArray(answer.value)
        ? answer.value.includes(comparison)
        : answer.value === comparison);
};
// keep consistent with convert_form_logic_to_filter logic in analytics.ts
export var responses_satisfy_conditions = function (responses, conditions, options) {
    var _a, _b;
    var key = Object.keys(conditions)[0]; // string is form id
    if (key === '$and') {
        var andConditions = conditions[key];
        for (var _i = 0, andConditions_2 = andConditions; _i < andConditions_2.length; _i++) {
            var c = andConditions_2[_i];
            if (!responses_satisfy_conditions(responses, c, options)) {
                return false;
            }
        }
        return true;
    }
    else if (key === '$or') {
        var orConditions = conditions[key];
        for (var _d = 0, orConditions_2 = orConditions; _d < orConditions_2.length; _d++) {
            var c = orConditions_2[_d];
            if (responses_satisfy_conditions(responses, c, options)) {
                return true;
            }
        }
        return false;
    }
    else if (key === 'condition') {
        var fieldIdOrCalculated_1 = Object.keys(conditions[key])[0];
        var answer = (fieldIdOrCalculated_1 === FORM_LOGIC_CALCULATED_FIELDS[0] // bmi
            ? (function () {
                var _a, _b, _d, _e;
                var h = (((_a = responses.find(function (r) { return r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Height'; })) === null || _a === void 0 ? void 0 : _a.answer)
                    || ((_b = responses.find(function (r) { return r.answer.type === 'Height' && r.answer.value && r.computedValueKey === 'Height'; })) === null || _b === void 0 ? void 0 : _b.answer));
                var w = (_d = responses.find(function (r) { return r.answer.type === 'number' && r.answer.value && r.computedValueKey === 'Weight'; })) === null || _d === void 0 ? void 0 : _d.answer;
                var height = (((h === null || h === void 0 ? void 0 : h.type) === 'number' && h.value)
                    ? h.value
                    : ((h === null || h === void 0 ? void 0 : h.type) === 'Height' && typeof ((_e = h.value) === null || _e === void 0 ? void 0 : _e.feet) === 'number')
                        ? h.value.feet * 12 + (h.value.inches || 0)
                        : undefined);
                var weight = (w === null || w === void 0 ? void 0 : w.type) === 'number' && w.value ? w === null || w === void 0 ? void 0 : w.value : undefined;
                if (!(height && weight))
                    return undefined;
                var BMI = {
                    type: 'number',
                    value: 703 * weight / (height * height)
                };
                return BMI;
            })()
            : fieldIdOrCalculated_1 === FORM_LOGIC_CALCULATED_FIELDS[1] // age
                ? (function () {
                    var _a, _b, _d;
                    var dob = (options === null || options === void 0 ? void 0 : options.dateOfBirth) || ((_d = (_b = (_a = responses.find(function (r) { return r.answer.type === 'dateString' && r.answer.value && r.computedValueKey === 'Date of Birth'; })) === null || _a === void 0 ? void 0 : _a.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.toString());
                    if (!dob)
                        return undefined;
                    try {
                        var age = age_for_dob_mmddyyyy(dob);
                        if (typeof age !== 'number')
                            return undefined;
                        var Age = {
                            type: 'number',
                            value: age
                        };
                        return Age;
                    }
                    catch (err) {
                        console.error(err);
                    }
                })()
                : fieldIdOrCalculated_1 === FORM_LOGIC_CALCULATED_FIELDS[2] // score
                    ? (function () {
                        var form = options === null || options === void 0 ? void 0 : options.form;
                        if (!form)
                            return undefined;
                        var scores = calculate_form_scoring({ response: { responses: options.activeResponses || responses }, form: form });
                        if (!(scores === null || scores === void 0 ? void 0 : scores.length))
                            return;
                        var Score = {
                            type: 'number',
                            value: scores[0].value,
                        };
                        return Score;
                    })()
                    : fieldIdOrCalculated_1 === FORM_LOGIC_CALCULATED_FIELDS[3] // gender
                        ? (function () {
                            var _a, _b, _d;
                            var gender = (((_d = // responses should be priority, in case they're being used to change gender
                            (_b = (_a = responses.find(function (r) { return (r.answer.type === 'Dropdown' || r.answer.type === 'multiple_choice') && r.computedValueKey === 'Gender'; })) === null || _a === void 0 ? void 0 : _a.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d[0])
                                || (options === null || options === void 0 ? void 0 : options.gender));
                            var Gender = {
                                type: 'string',
                                value: gender || '',
                            };
                            return Gender;
                        })()
                        : fieldIdOrCalculated_1 === FORM_LOGIC_CALCULATED_FIELDS[4] // state
                            ? (function () {
                                var _a, _b, _d;
                                var state = (((_d = (_b = (_a = responses.find(function (r) { return r.answer.type === 'Address' && r.computedValueKey === 'State'; })) === null || _a === void 0 ? void 0 : _a.answer) === null || _b === void 0 ? void 0 : _b.value) === null || _d === void 0 ? void 0 : _d.state)
                                    || (options === null || options === void 0 ? void 0 : options.state));
                                var State = {
                                    type: 'string',
                                    value: state || '',
                                };
                                return State;
                            })()
                            : fieldIdOrCalculated_1 === FORM_LOGIC_URL_PARAMETER
                                ? { type: 'string', value: (options === null || options === void 0 ? void 0 : options.urlLogicValue) || '' }
                                : (_a = responses.find(function (r) { return r.fieldId === fieldIdOrCalculated_1; })) === null || _a === void 0 ? void 0 : _a.answer);
        if (!answer)
            return false;
        var comparison = conditions[key][fieldIdOrCalculated_1];
        if (typeof comparison === 'string') {
            return evaluate_response_equals(answer, comparison);
        }
        else {
            var condition = Object.keys(comparison)[0];
            var conditionValue_1 = comparison[condition];
            if (condition === "$ne") {
                return !evaluate_response_equals(answer, conditionValue_1);
            }
            if (condition === '$lt' || condition === '$gt') {
                if (conditionValue_1 === '$now') {
                    if (answer.type === 'date' && answer.value) {
                        var number_1 = Date.now();
                        var answerNumber_1 = new Date(answer.value).getTime();
                        if (condition === '$lt') {
                            return answerNumber_1 < number_1;
                        }
                        if (condition === '$gt') {
                            return answerNumber_1 > number_1;
                        }
                    }
                    if (answer.type === 'dateString' && answer.value) {
                        var number_2 = new Date(MM_DD_YYYY_to_YYYY_MM_DD(mm_dd_yyyy(new Date()))).getTime();
                        var answerNumber_2 = new Date(MM_DD_YYYY_to_YYYY_MM_DD(answer.value)).getTime();
                        if (condition === '$lt') {
                            return answerNumber_2 < number_2;
                        }
                        if (condition === '$gt') {
                            return answerNumber_2 > number_2;
                        }
                    }
                }
                var number = (typeof conditionValue_1 === 'string' && conditionValue_1.startsWith("$JS(") && conditionValue_1.endsWith(")")
                    ? new Function('answer', conditionValue_1.substring(4, conditionValue_1.length - 1))(answer)
                    : parseInt(conditionValue_1));
                var answerNumber = ((answer.type === 'date' && answer.value)
                    ? new Date(answer.value).getTime()
                    : (answer.type === 'dateString' && answer.value)
                        ? new Date(MM_DD_YYYY_to_YYYY_MM_DD(answer.value)).getTime()
                        : answer.value);
                if (isNaN(number))
                    return false;
                if (typeof answerNumber !== 'number')
                    return false;
                if (condition === '$lt') {
                    return answerNumber < number;
                }
                if (condition === '$gt') {
                    return answerNumber > number;
                }
            }
            else if (condition === '$exists') {
                return (answer.value !== undefined
                    && answer.value !== null
                    && answer.value !== ''
                    && !(Array.isArray(answer.value) && answer.value.length === 0)) === conditionValue_1;
            }
            else if (condition === '$contains' || condition === '$doesNotContain') {
                if (answer.value === undefined || answer.value === null || answer.value === '') {
                    return condition === '$doesNotContain'; // empty responses cannot contain anything
                }
                if (answer.type === 'Database Select' && ((_b = answer.value) === null || _b === void 0 ? void 0 : _b.length)) {
                    var contains = !!answer.value.find(function (v) { var _a; return (_a = v.text) === null || _a === void 0 ? void 0 : _a.includes(conditionValue_1); });
                    return ((contains && condition === '$contains')
                        || (!contains && condition === '$doesNotContain'));
                }
                if (Array.isArray(answer.value)) {
                    var contains = answer.value.find(function (v) { return typeof v === 'string' && v.includes(conditionValue_1); });
                    return ((contains && condition === '$contains')
                        || (!contains && condition === '$doesNotContain'));
                }
                if (typeof answer.value === 'string') {
                    var contains = answer.value.includes(conditionValue_1);
                    return ((contains && condition === '$contains')
                        || (!contains && condition === '$doesNotContain'));
                }
            }
        }
    }
    return true;
};
export var weighted_round_robin = function (_a) {
    var _assignments = _a.assignments, _users = _a.users;
    if (!_users.length) {
        return { selected: undefined };
    }
    if (_users.length === 1) {
        return { selected: _users[0].id };
    }
    // ensure default value set (5) with max of 10
    var users = _users.map(function (u) { return ({
        id: u.id,
        ticketAssignmentPriority: Math.min(u.ticketAssignmentPriority || 5, 10),
    }); });
    var windowSize = users.reduce(function (t, u) { return t + u.ticketAssignmentPriority; }, 0);
    // descending, with newest timestamp at [0], oldest timestamp at [assignments.length - 1]
    var assignments = (__spreadArray([], _assignments, true).sort(function (a1, a2) { return a2.timestamp - a1.timestamp; })
        .filter(function (a, i) { return users.find(function (u) { return u.id === a.userId; }) && i < windowSize - 1; }) // pigeonhole to ensure 1 available user
    );
    var capacityForUser = {};
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        capacityForUser[user.id] = user.ticketAssignmentPriority;
    }
    for (var _b = 0, assignments_1 = assignments; _b < assignments_1.length; _b++) {
        var a = assignments_1[_b];
        if (!capacityForUser[a.userId])
            continue;
        capacityForUser[a.userId] -= 1;
    }
    // find user with capacity who has gone the longest without a ticket assignment
    var delayScores = {};
    var _loop_3 = function (i) {
        var delayIndex = assignments.findIndex(function (a) { return a.userId === users[i].id; });
        delayScores[users[i].id] = delayIndex === -1 ? assignments.length : delayIndex;
    };
    for (var i = 0; i < users.length; i++) {
        _loop_3(i);
    }
    var usersSorted = __spreadArray([], users, true).sort(function (u1, u2) { return delayScores[u2.id] - delayScores[u1.id]; });
    for (var _d = 0, usersSorted_1 = usersSorted; _d < usersSorted_1.length; _d++) {
        var user = usersSorted_1[_d];
        if (capacityForUser[user.id] !== undefined && capacityForUser[user.id] > 0) {
            return { selected: user.id };
        }
    }
    // for (let i = assignments.length -1; i >= 0; i--) {
    //   const a = assignments[i]
    //   const user = users.find(u => u.id === a.userId)
    //   if (!user) { continue }
    //   if (capacityForUser[user.id] !== undefined && capacityForUser[user.id] > 0) { 
    //     return { selected: user.id }
    //   }
    //   // return { selected: user.id }
    // }
    return { selected: undefined };
};
export var validate_insurance_for_eligibility = function (enduser) {
    var _a, _b, _d;
    if (!enduser.insurance) {
        return "Insurance not set";
    }
    if (!enduser.insurance.payerName) {
        return "Payer name not set";
    }
    if (!enduser.insurance.payerId) {
        return "Payer id not set";
    }
    if (!enduser.insurance.memberId) {
        return "Member id not set";
    }
    if (!enduser.insurance.relationship) {
        return "Subscriber relationship not set";
    }
    if (enduser.insurance.relationship !== 'Self') {
        if (!((_a = enduser.insurance.relationshipDetails) === null || _a === void 0 ? void 0 : _a.fname)) {
            return "Subscriber first name not set";
        }
        if (!((_b = enduser.insurance.relationshipDetails) === null || _b === void 0 ? void 0 : _b.lname)) {
            return "Subscriber last name not set";
        }
        if (!((_d = enduser.insurance.relationshipDetails) === null || _d === void 0 ? void 0 : _d.gender)) {
            return "Subscriber gender not set";
        }
    }
};
export var validate_organization_for_candid = function (organization) {
    var _a, _b, _d, _e, _f;
    if (!organization)
        return "Organization is required";
    if (!organization.billingOrganizationName)
        return "Billing organization name is required";
    if (!organization.billingOrganizationNPI)
        return "Billing organization NPI is required";
    if (!organization.billingOrganizationTaxId)
        return "Billing organization Tax ID is required";
    if (!((_a = organization.billingOrganizationAddress) === null || _a === void 0 ? void 0 : _a.lineOne))
        return "Billing organization address is required (Line One)";
    if (!((_b = organization.billingOrganizationAddress) === null || _b === void 0 ? void 0 : _b.city))
        return "Billing organization address is required (City)";
    if (!((_d = organization.billingOrganizationAddress) === null || _d === void 0 ? void 0 : _d.state))
        return "Billing organization address is required (State)";
    if (!((_e = organization.billingOrganizationAddress) === null || _e === void 0 ? void 0 : _e.zipCode))
        return "Billing organization address is required (ZIP)";
    if (!((_f = organization.billingOrganizationAddress) === null || _f === void 0 ? void 0 : _f.zipPlusFour))
        return "Billing organization address is required (ZIP+4)";
};
export var validate_provider_for_candid = function (user) {
    if (!user)
        return "User is required";
    if (!user.fname)
        return "User first name is required";
    if (!user.lname)
        return "User last name is required";
    if (!user.NPI)
        return "User NPI is required";
};
export var validate_enduser_for_candid = function (enduser) {
    if (!enduser)
        return "Enduser is required";
    if (!enduser.fname)
        return "First name is required";
    if (!enduser.lname)
        return "Last name is required";
    if (!enduser.dateOfBirth)
        return "Date of birth is required";
    if (!enduser.gender)
        return "Gender is required";
    if (!enduser.addressLineOne)
        return "Address is required (Line One)";
    if (!enduser.city)
        return "Address is required (City)";
    if (!enduser.state)
        return "Address is required (State)";
    if (!enduser.zipCode)
        return "Address is required (ZIP)";
};
export var json_error_string = function (s) {
    try {
        return JSON.stringify(JSON.parse(s), null, 2);
    }
    catch (err) {
        return s;
    }
};
export var validate_enduser_for_gogo = function (enduser) {
    if (!enduser)
        return "Enduser is required";
    if (!enduser.fname)
        return "First name is required";
    if (!enduser.lname)
        return "Last name is required";
    if (!enduser.phone)
        return "Phone is required";
    if (!enduser.addressLineOne)
        return "Address is required (Line One)";
    if (!enduser.city)
        return "Address is required (City)";
    if (!enduser.state)
        return "Address is required (State)";
    if (!enduser.zipCode)
        return "Address is required (ZIP)";
};
export var validate_enduser_for_smart_meter = function (enduser) {
    if (!enduser)
        return "Enduser is required";
    if (!enduser.fname)
        return "First name is required";
    if (!enduser.lname)
        return "Last name is required";
    if (!enduser.addressLineOne)
        return "Address is required (Line One)";
    if (!enduser.city)
        return "Address is required (City)";
    if (!enduser.state)
        return "Address is required (State)";
    if (!enduser.zipCode)
        return "Address is required (ZIP)";
};
export var validate_enduser_for_dose_spot = function (enduser) {
    var _a, _b;
    if (!enduser)
        return "Enduser is required";
    if (!enduser.fname)
        return "First name is required";
    if (!enduser.lname)
        return "Last name is required";
    if (!enduser.gender)
        return "Gender is required";
    if (!enduser.dateOfBirth)
        return "Date of Birth is required";
    if (!enduser.addressLineOne)
        return "Address is required (Line One)";
    if (!enduser.city)
        return "Address is required (City)";
    if (!enduser.state)
        return "Address is required (State)";
    if (!enduser.zipCode)
        return "Address is required (ZIP)";
    if (!enduser.phone)
        return "Phone is required";
    var age = age_for_dob_mmddyyyy(enduser.dateOfBirth);
    if (typeof age === 'number' && age < 19) {
        if (!((_a = enduser.height) === null || _a === void 0 ? void 0 : _a.value))
            return "Height is required for patients under 19";
        if (!((_b = enduser.weight) === null || _b === void 0 ? void 0 : _b.value))
            return "Weight is required for patients under 19";
    }
};
export var validate_enduser_for_develop_health = function (enduser, insuranceType) {
    if (!enduser)
        return "Enduser is required";
    if (!enduser.fname)
        return "First name is required";
    if (!enduser.lname)
        return "Last name is required";
    if (!enduser.gender)
        return "Gender is required";
    if (!enduser.dateOfBirth || !MM_DD_YYYY_REGEX.test(enduser.dateOfBirth))
        return "Date of Birth is required in MM-DD-YYYY format";
    if (!enduser.addressLineOne)
        return "Patient address is required (Line One)";
    if (!enduser.city)
        return "Patient address is required (City)";
    if (!enduser.state)
        return "Patient address is required (State)";
    if (!enduser.zipCode)
        return "Patient address is required (ZIP)";
    var insurance = (insuranceType === 'Secondary'
        ? enduser.insuranceSecondary
        : enduser.insurance);
    if (!insurance)
        return "Patient insurance is not set";
    if (!((insurance.cardFront && insurance.cardBack)
        || (insurance.payerName && insurance.memberId))) {
        return "Payer name and member ID or front and back insurance images are required";
    }
};
export var validate_user_for_develop_health = function (user) {
    if (!user)
        return "Provider is required";
    if (!user.fname)
        return "First name is required";
    if (!user.lname)
        return "Last name is required";
    if (!user.NPI)
        return "NPI is required";
};
export var validate_organization_for_develop_health = function (organization) {
    var _a, _b, _d, _e;
    if (!organization)
        return "Organization is required";
    if (!organization.billingOrganizationName)
        return "Billing organization name is required";
    if (!organization.billingOrganizationTaxId)
        return "Billing organization Tax ID";
    if (!((_a = organization === null || organization === void 0 ? void 0 : organization.billingOrganizationAddress) === null || _a === void 0 ? void 0 : _a.lineOne))
        return "Billing organization address is required (Line One)";
    if (!((_b = organization === null || organization === void 0 ? void 0 : organization.billingOrganizationAddress) === null || _b === void 0 ? void 0 : _b.city))
        return "Billing organization address is required (City)";
    if (!((_d = organization === null || organization === void 0 ? void 0 : organization.billingOrganizationAddress) === null || _d === void 0 ? void 0 : _d.state))
        return "Billing organization address is required (State)";
    if (!((_e = organization === null || organization === void 0 ? void 0 : organization.billingOrganizationAddress) === null || _e === void 0 ? void 0 : _e.zipCode))
        return "Billing organization address is required (ZIP)";
};
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export var decodeJWT = function (jwt) {
    try {
        var base64Url = jwt.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    catch (err) {
        return null;
    }
};
export var field_can_autoadvance = function (_a) {
    var type = _a.type, options = _a.options;
    if (type === 'multiple_choice' && (options === null || options === void 0 ? void 0 : options.radio))
        return true;
    if (type === 'Dropdown' && (options === null || options === void 0 ? void 0 : options.radio))
        return true;
    if (type === 'Appointment Booking')
        return true;
    if (type === 'Stripe')
        return true;
    return false;
};
export var field_can_autosubmit = function (_a) {
    var type = _a.type, options = _a.options;
    if (type === 'Appointment Booking')
        return true;
    if (type === 'Stripe')
        return true;
    return false;
};
export var satisfies_vital_comparison = function (comparison, value) {
    if (comparison.type === 'Less Than') {
        return value < comparison.value;
    }
    if (comparison.type === 'Greater Than') {
        return value > comparison.value;
    }
    if (comparison.type === 'Between') {
        return value >= comparison.value.lower && value <= comparison.value.upper;
    }
    return false;
};
export var SMS_UNSUBSCRIBE_KEYWORDS = ['stop', 'stopall', 'unsubscribe', 'end', 'quit', 'cancel'];
export var classification_for_vital = function (v, configurations) {
    var _a, _b, _d;
    var classification = (((_a = v.classifications) === null || _a === void 0 ? void 0 : _a.length) === 1 ? v.classifications[0].classification
        : ((_d = (_b = v.classifications) === null || _b === void 0 ? void 0 : _b.find(function (c) { return configurations.find(function (_c) { return _c.id === c.configurationId; }); })) === null || _d === void 0 ? void 0 : _d.classification));
    return classification || '';
};
// ,'High','Low','Very High','Very Low','Critical High','Critical Low'
export var color_for_classification = function (c, ifNoMatch) { return (c === 'Target' ? '#44cc4466'
    : c === 'Low' ? '#cccc4466'
        : c === 'High' ? '#cccc4466'
            : c === 'Very High' ? '#cc444466'
                : c === 'Very Low' ? '#cc444466'
                    : c === 'Critical High' ? 'violet'
                        : c === 'Critical Low' ? 'violet'
                            : ifNoMatch); };
export var is_out_of_office = function (blocks, date, zone, outOfOfficeBlocks) {
    var _a, _b;
    if (date === void 0) { date = new Date(); }
    if (zone === void 0) { zone = 'America/New_York'; }
    if (outOfOfficeBlocks === void 0) { outOfOfficeBlocks = []; }
    var outOfOfficeBlock = outOfOfficeBlocks.find(function (b) { return (new Date(b.from).getTime() <= date.getTime()
        && new Date(b.to).getTime() >= date.getTime()); });
    if (outOfOfficeBlock) { // may have additional detail, like reply text
        return outOfOfficeBlock;
    }
    if (blocks.length === 0)
        return false;
    var nowInTimezone = DateTime.fromJSDate(date, { zone: zone });
    var nowMinutes = nowInTimezone.minute + 60 * nowInTimezone.hour;
    var nowDay = ( // convert to zero indexing by Sunday
    nowInTimezone.weekday === 7 // Get the day of the week. 1 is Monday and 7 is Sunday
        ? 0
        : nowInTimezone.weekday);
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        if (((_a = block.active) === null || _a === void 0 ? void 0 : _a.to) && (new Date(block.active.to).getTime() < Date.now()))
            continue; // ends before now
        if (((_b = block.active) === null || _b === void 0 ? void 0 : _b.from) && (new Date(block.active.from).getTime() > Date.now()))
            continue; // starts after now
        if (nowDay !== block.dayOfWeekStartingSundayIndexedByZero)
            continue; // different day
        // same day, and within the availability window
        // this must be inclusive in order to be in office all day (0:00 to 23:59)
        if (nowMinutes >= block.startTimeInMinutes && nowMinutes <= block.endTimeInMinutes) {
            return false; // is in office
        }
    }
    return true;
};
export var get_utm_params = function () {
    var params = new URL(window.location.href).searchParams;
    var utmParams = [];
    params.forEach(function (value, field) {
        if (field.toLowerCase().startsWith('utm_') || field === 'ours_user_id') {
            utmParams.push({ field: field, value: value });
        }
    });
    return utmParams;
};
export var append_current_utm_params = function (targetURL) {
    try {
        var params = new URL(window.location.href).searchParams;
        var utmParams_1 = {};
        params.forEach(function (value, key) {
            if (key.toLowerCase().startsWith('utm_') || key === 'ours_user_id') {
                utmParams_1[key] = value;
            }
        });
        if (object_is_empty(utmParams_1)) {
            return targetURL;
        }
        var modifiedURL = targetURL;
        if (!modifiedURL.includes('?')) {
            modifiedURL += '?';
        }
        else if (!modifiedURL.endsWith('&')) {
            modifiedURL += '&';
        }
        for (var param in utmParams_1) {
            modifiedURL += "".concat(param, "=").concat(utmParams_1[param], "&");
        }
        return modifiedURL;
    }
    catch (err) {
        console.error(err);
    }
    ;
    return targetURL;
};
export var replace_tag_template_values_for_enduser = function (tags, enduser) { return (tags.map(function (t) {
    var _a, _b, _d, _e, _f;
    if (t.startsWith('{{') && t.endsWith('}}')) {
        var tagField = (t.split('{{enduser.').pop() || '').replace("}}", '');
        if (tagField === 'hashedPassword')
            return t;
        if (tagField === 'Age' && enduser.dateOfBirth) {
            return age_for_dob_mmddyyyy(enduser.dateOfBirth);
        }
        if (tagField === 'BMI' && ((_a = enduser.height) === null || _a === void 0 ? void 0 : _a.value) && ((_b = enduser.weight) === null || _b === void 0 ? void 0 : _b.value)) {
            return calculate_bmi(enduser).toFixed(2);
        }
        return (((_e = (_d = enduser.fields) === null || _d === void 0 ? void 0 : _d[tagField]) === null || _e === void 0 ? void 0 : _e.toString())
            || ((_f = get_enduser_field_value_for_key(enduser, tagField)) === null || _f === void 0 ? void 0 : _f.toString()) // accounts for dotted fields like insurance.payerName
            || t);
    }
    return t;
})); };
// todo: refactor with replacer below, mirroring replace_sms_template_values
export var replace_purchase_template_values = function (s, purchase) {
    var _a;
    if (!purchase)
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    var i = 0;
    var start = 0;
    var templates = [];
    while (i < 100) {
        i++;
        start = s.indexOf('{{purchase.', start);
        if (start === -1)
            break;
        var end = s.indexOf('}}', start);
        if (end === -1)
            break;
        var match = s.substring(start, end + 2); // +2 accounts for '}}' 
        templates.push({
            match: match,
            replacement: (match === '{{purchase.name}}' ? purchase.title
                : match === '{{purchase.id}}' ? (((_a = purchase === null || purchase === void 0 ? void 0 : purchase._id) === null || _a === void 0 ? void 0 : _a.toString()) || (purchase === null || purchase === void 0 ? void 0 : purchase.id) || '')
                    : match === '{{purchase.externalId}}' ? (purchase.externalId || '')
                        : match === '{{purchase.source}}' ? (purchase.source || '')
                            : match === '{{purchase.cost.amount}}' ? purchase.cost.amount.toString()
                                : '')
        });
        start = end + 2;
    }
    var replaced = s.toString();
    for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
        var _b = templates_1[_i], match = _b.match, replacement = _b.replacement;
        replaced = replaced.replace(match, replacement);
    }
    return replaced;
};
var replacer = function (prefix, s, handleMatch) {
    var i = 0;
    var start = 0;
    var templates = [];
    while (i < 100) {
        i++;
        start = s.indexOf(prefix, start);
        if (start === -1)
            break;
        var end = s.indexOf('}}', start);
        if (end === -1)
            break;
        var match = s.substring(start, end + 2); // +2 accounts for '}}' 
        templates.push({
            match: match,
            replacement: handleMatch(match)
        });
        start = end + 2;
    }
    var replaced = s.toString();
    for (var _i = 0, templates_2 = templates; _i < templates_2.length; _i++) {
        var _a = templates_2[_i], match = _a.match, replacement = _a.replacement;
        replaced = replaced.replace(match, replacement);
    }
    return replaced;
};
export var replace_sms_template_values = function (s, sms) {
    if (!sms)
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    return replacer('{{sms.', s, function (match) {
        if (match === '{{sms.message}}') {
            return sms.message || '';
        }
        return '';
    });
};
export var get_secret_names = function (s) {
    var titles = [];
    if (typeof s !== 'string')
        return titles;
    replacer('{{secrets.', s, function (match) {
        var title = match.replace('{{secrets.', '').replace('}}', '');
        titles.push(title);
        return match;
    });
    return titles;
};
export var replace_secret_values = function (s, integrations) {
    if (!integrations)
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    return replacer('{{secrets.', s, function (match) {
        var _a, _b;
        var integration = integrations.find(function (i) { return i.title === match.replace('{{secrets.', '').replace('}}', ''); });
        return ((_b = (_a = integration === null || integration === void 0 ? void 0 : integration.authentication) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.access_token) || '';
    });
};
export var replace_enduser_template_values = function (s, enduser) {
    if (!enduser)
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    var i = 0;
    var start = 0;
    var templates = [];
    while (i < 100) {
        i++;
        start = s.indexOf('{{enduser.', start);
        if (start === -1)
            break;
        var end = s.indexOf('}}', start);
        if (end === -1)
            break;
        var match = s.substring(start, end + 2); // +2 accounts for '}}' 
        templates.push({
            match: match,
            replacement: replace_tag_template_values_for_enduser([match], enduser)[0],
        });
        start = end + 2;
    }
    var replaced = s.toString();
    for (var _i = 0, templates_3 = templates; _i < templates_3.length; _i++) {
        var _a = templates_3[_i], match = _a.match, replacement = _a.replacement;
        replaced = replaced.replace(match, replacement);
    }
    return replaced;
};
export var display_time_for_seconds = function (seconds) { return (typeof seconds !== 'number'
    ? ''
    : seconds > 60
        ? " (".concat(Math.floor(seconds / 60), " Minutes)")
        : " (".concat(seconds, " Seconds)")); };
export var is_full_iso_string_heuristic = function (d) {
    try {
        if (d.length < 12)
            return; // don't consider simple YYYY-MM-DD (10 characters) dates
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { // if it's just YYYY-MM-DD, return
            return;
        }
        // ensure it does start YYYY-MM-DD but has future characters
        if (!(/\d{4}-\d{2}-\d{2}.*/.test(d))) {
            return;
        }
        var asDate = new Date(d);
        return !isNaN(asDate.getTime()) ? asDate : undefined;
    }
    catch (err) {
        return;
    }
};
export var skip_due_date_as_needed = function (toSkip) { return function (dueDateInMS) {
    if (!dueDateInMS)
        return dueDateInMS;
    if (!(toSkip === null || toSkip === void 0 ? void 0 : toSkip.length))
        return dueDateInMS;
    var adjusted = dueDateInMS;
    for (var i = 0; i < 7; i++) { // limit to 7 iterations
        if (toSkip.includes(new Date(adjusted).getDay())) {
            adjusted += 1000 * 60 * 60 * 24;
        }
        else {
            break;
        }
    }
    return adjusted;
}; };
export var get_flattened_fields = function (objects, options) {
    var _a = options !== null && options !== void 0 ? options : {}, _b = _a.ignore, ignore = _b === void 0 ? [] : _b, _d = _a.maxDepth, maxDepth = _d === void 0 ? 5 : _d, _e = _a.depth, depth = _e === void 0 ? 0 : _e, includeObjectRoot = _a.includeObjectRoot;
    var fields = [];
    if (depth > maxDepth) {
        return fields;
    }
    for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
        var o = objects_1[_i];
        if (!o || typeof o !== 'object' || Array.isArray(o))
            continue;
        for (var rootField in o) {
            if (ignore.includes(rootField))
                continue;
            var value = o[rootField];
            if (!value || typeof value !== 'object' || Array.isArray(value)) {
                fields.push(rootField);
                continue;
            }
            var field = rootField;
            // captures root field of object fields
            if (includeObjectRoot) {
                if (!fields.includes(field)) {
                    fields.push(field);
                }
            }
            // don't include root on nested fields
            var nestedFields = get_flattened_fields([value], __assign(__assign({}, options), { includeObjectRoot: false, ignore: [], depth: depth + 1 }));
            for (var _f = 0, nestedFields_1 = nestedFields; _f < nestedFields_1.length; _f++) {
                var nestedField = nestedFields_1[_f];
                var toAdd = "".concat(field, ".").concat(nestedField);
                if (fields.includes(toAdd))
                    continue;
                fields.push(toAdd);
            }
        }
    }
    return fields;
};
export var value_for_dotted_key = function (v, key, o) {
    var value = v;
    var keys = key.split('.');
    if ((o === null || o === void 0 ? void 0 : o.handleArray) && keys.length >= 2 && Array.isArray(value[keys[0]])) {
        return value_for_dotted_key(value[keys[0]], keys.slice(1).join('.'), o);
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        value = value === null || value === void 0 ? void 0 : value[k];
    }
    return value;
};
export var add_value_for_dotted_key = function (_object, field, value) {
    var keys = field.split('.');
    var object = _object;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (i === keys.length - 1) {
            object[key] = value;
            continue;
        }
        object = object[key];
    }
};
export var INVALID_PREPOPULATION_TYPES = [
    'file',
    'files',
    'description',
    'Question Group',
    'Stripe', // can't prepopulate this
    // now supported
    // "Address", // split into different patient fields and non-trivial to pre-load  
];
export var get_prepopulated_responses = function (fields, enduser, existingResponses) { return (fields
    .filter(function (v) {
    var _a;
    return (v.prepopulateFromFields && !INVALID_PREPOPULATION_TYPES.includes(v.type) && v.intakeField
        && ((v.intakeField === 'Address' &&
            (enduser.addressLineOne || enduser.addressLineTwo || enduser.zipCode || enduser.city || enduser.zipCode || enduser.state))
            || (v.intakeField === 'insurance.details' && enduser.insurance)
            || (v.intakeField === 'insuranceSecondary.details' && enduser.insuranceSecondary)
            || ((enduser === null || enduser === void 0 ? void 0 : enduser[v.intakeField]) || ((_a = enduser === null || enduser === void 0 ? void 0 : enduser.fields) === null || _a === void 0 ? void 0 : _a[v.intakeField]))));
})
    .map(function (v) {
    var _a, _b, _d, _e, _f, _g, _h, _j;
    return ({
        fieldId: v.id,
        fieldTitle: v.title,
        externalId: v.externalId,
        fieldDescription: v.description,
        fieldHtmlDescription: v.htmlDescription,
        sharedWithEnduser: v.sharedWithEnduser,
        isPrepopulatedFromEnduserField: true,
        answer: (v.type === 'Address' && v.intakeField === 'Address')
            ? {
                type: 'Address',
                value: {
                    addressLineOne: enduser.addressLineOne || '',
                    addressLineTwo: enduser.addressLineTwo || '',
                    city: enduser.city || '',
                    state: enduser.state || '',
                    zipCode: enduser.zipCode || '',
                    zipPlusFour: enduser.zipPlusFour || '',
                }
            }
            : (v.type === 'Insurance' && v.intakeField === 'insurance.details')
                ? {
                    type: 'Insurance',
                    value: enduser.insurance,
                }
                : (v.type === 'Insurance' && v.intakeField === 'insuranceSecondary.details')
                    ? {
                        type: 'Insurance',
                        value: enduser.insuranceSecondary,
                    }
                    : (v.type === 'Database Select' && typeof ((enduser === null || enduser === void 0 ? void 0 : enduser[v.intakeField]) || ((_a = enduser === null || enduser === void 0 ? void 0 : enduser.fields) === null || _a === void 0 ? void 0 : _a[v.intakeField])) === 'string')
                        ? {
                            type: "Database Select",
                            value: [((enduser === null || enduser === void 0 ? void 0 : enduser[v.intakeField]) || ((_b = enduser === null || enduser === void 0 ? void 0 : enduser.fields) === null || _b === void 0 ? void 0 : _b[v.intakeField]))]
                        }
                        : (v.type === 'Height' && ((_d = enduser.height) === null || _d === void 0 ? void 0 : _d.value))
                            ? {
                                type: 'Height',
                                value: {
                                    feet: Math.floor((parseInt(enduser.height.value) / 12)),
                                    inches: Math.floor((parseInt(enduser.height.value) % 12)),
                                }
                            }
                            : (v.type === 'number' && v.intakeField === 'weight' && ((_e = enduser === null || enduser === void 0 ? void 0 : enduser.weight) === null || _e === void 0 ? void 0 : _e.value))
                                ? { type: 'number', value: parseInt((_f = enduser === null || enduser === void 0 ? void 0 : enduser.weight) === null || _f === void 0 ? void 0 : _f.value) }
                                : (v.type === 'number' && v.intakeField === 'height' && ((_g = enduser === null || enduser === void 0 ? void 0 : enduser.height) === null || _g === void 0 ? void 0 : _g.value))
                                    ? { type: 'number', value: parseInt((_h = enduser === null || enduser === void 0 ? void 0 : enduser.height) === null || _h === void 0 ? void 0 : _h.value) }
                                    : {
                                        type: v.type,
                                        value: ((enduser === null || enduser === void 0 ? void 0 : enduser[v.intakeField]) || ((_j = enduser === null || enduser === void 0 ? void 0 : enduser.fields) === null || _j === void 0 ? void 0 : _j[v.intakeField]))
                                    }
    });
})); };
export var downloadFile = function (data, options) {
    var name = options.name, type = options.type;
    name = name || "download.txt";
    type = type || "octet/stream";
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    var blob = new Blob([data], { type: type });
    var url = ((options.dataIsURL && typeof data === 'string')
        ? data
        : window.URL.createObjectURL(blob));
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
};
export var is_timezone = function (value) { return (typeof value === 'string' && TIMEZONES.includes(value)); };
export var enduser_address_string = function (e) { return ("".concat(e.addressLineOne ? e.addressLineOne : '').concat(e.addressLineTwo ? " ".concat(e.addressLineTwo) : '').concat(e.addressLineOne || e.addressLineTwo ? ', ' : '').concat(e.city ? "".concat(e.city, ", ") : '').concat(e.state ? "".concat(e.state).concat(e.zipCode ? ', ' : '') : '').concat(e.zipCode ? e.zipCode : '').concat(e.zipPlusFour && e.zipCode ? "-".concat(e.zipPlusFour) : '')); };
export var enduser_insurance_string = function (i) { return !i ? '' : ("".concat(i.payerName).concat(i.memberId ? " (".concat(i.memberId, ")") : '')); };
export var should_show_unsubmitted_form_response_for_interval = function (fr) {
    if (!fr.createdAt)
        return false;
    if (typeof fr.hideAfterUnsubmittedInMS !== 'number')
        return true;
    if (fr.hideAfterUnsubmittedInMS === -1)
        return true;
    if (new Date(fr.createdAt).getTime() + fr.hideAfterUnsubmittedInMS > Date.now())
        return true;
    return false;
};
export var get_canvas_id = function (v) {
    var _a, _b;
    return ((v.source === CANVAS_TITLE && v.externalId)
        ? v.externalId
        : (_b = (_a = v.references) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.type === CANVAS_TITLE; })) === null || _b === void 0 ? void 0 : _b.id);
};
export var to_human_readable_phone_number = function (phone) {
    if (!phone) {
        return '';
    }
    if (phone.length === 10) {
        return "(".concat(phone.substring(0, 3), ") ").concat(phone.substring(3, 6), "-").concat(phone.substring(6));
    }
    var countryCode = phone.substring(0, phone.length - 10);
    var withoutCountryCode = phone.replace(countryCode, '');
    return "".concat(countryCode.startsWith('+') ? '' : '+').concat(countryCode, " (").concat(withoutCountryCode.substring(0, 3), ") ").concat(withoutCountryCode.substring(3, 6), "-").concat(withoutCountryCode.substring(6));
};
export var enrich_doxy_url = function (url, e) {
    var _a, _b;
    if (!e)
        return url;
    if (!(url === null || url === void 0 ? void 0 : url.includes('doxy.me')))
        return url;
    if (url.includes('?'))
        return url; // already has query params
    return ("".concat(url, "?username=").concat(e.fname || '').concat(e.fname && ' ').concat(e.lname || '', "&autocheckin=false&pid=").concat(((_b = (_a = e.references) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.type === HEALTHIE_TITLE; })) === null || _b === void 0 ? void 0 : _b.id) || e.id));
};
export var is_checkbox_custom_field_value = function (value) {
    var _a;
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    if (value.startsWith('checkbox:') && ((_a = value.split(':')[1]) === null || _a === void 0 ? void 0 : _a.length) === 24) {
        return true;
    }
    return false;
};
export var get_care_team_primary = function (e) {
    var _a;
    if (!e)
        return;
    if (!((_a = e.assignedTo) === null || _a === void 0 ? void 0 : _a.length))
        return;
    if (e.primaryAssignee && e.assignedTo.includes(e.primaryAssignee)) {
        return e.primaryAssignee;
    }
    return e.assignedTo[0];
};
export var emit_gtm_event = function (event) {
    try {
        if (typeof window === 'undefined' || !window.dataLayer)
            return;
        // ensure event is not empty
        if (!event || typeof event !== 'object' || Object.keys(event).length === 0)
            return;
        // ensure event has a name
        if (!event.event) {
            console.warn('GTM event does not have an "event" property', event);
            return;
        }
        window.dataLayer.push(event);
        console.log('GTM event emitted:', event);
    }
    catch (err) { }
};
// Find snippet keys in text, supporting both {{snippet:key}} and {{snippet.key}} syntax
export var get_snippet_keys = function (s) {
    var keys = [];
    if (typeof s !== 'string')
        return keys;
    // Support {{snippet:key}} syntax (original message template format)
    replacer('{{snippet:', s, function (match) {
        var key = match.replace('{{snippet:', '').replace('}}', '');
        if (key && !keys.includes(key)) {
            keys.push(key);
        }
        return match;
    });
    // Support {{snippet.key}} syntax (for consistency with other template variables)
    replacer('{{snippet.', s, function (match) {
        var key = match.replace('{{snippet.', '').replace('}}', '');
        if (key && !keys.includes(key)) {
            keys.push(key);
        }
        return match;
    });
    return keys;
};
// Replace snippet templates with their values, supporting both {{snippet:key}} and {{snippet.key}} syntax
export var replace_snippet_template_values = function (s, snippets) {
    if (!(snippets === null || snippets === void 0 ? void 0 : snippets.length))
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    var result = s;
    // Replace {{snippet:key}} syntax (original message template format)
    result = replacer('{{snippet:', result, function (match) {
        var key = match.replace('{{snippet:', '').replace('}}', '');
        var snippet = snippets.find(function (snippet) { return snippet.key === key; });
        return (snippet === null || snippet === void 0 ? void 0 : snippet.value) || '';
    });
    // Replace {{snippet.key}} syntax (for consistency with other template variables)
    result = replacer('{{snippet.', result, function (match) {
        var key = match.replace('{{snippet.', '').replace('}}', '');
        var snippet = snippets.find(function (snippet) { return snippet.key === key; });
        return (snippet === null || snippet === void 0 ? void 0 : snippet.value) || '';
    });
    return result;
};
export var resolve_integration_id = function (e, integrationTitle) {
    var _a, _b;
    return (((e === null || e === void 0 ? void 0 : e.source) === integrationTitle && e.externalId) ? e.externalId : (_b = (_a = e.references) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.type === integrationTitle; })) === null || _b === void 0 ? void 0 : _b.id);
};
// Replace form_response template variables with their values from form responses
export var replace_form_response_template_values = function (s, formResponse) {
    var _a;
    if (!((_a = formResponse === null || formResponse === void 0 ? void 0 : formResponse.responses) === null || _a === void 0 ? void 0 : _a.length))
        return s;
    if (typeof s !== 'string')
        return s; // e.g. Date value
    var result = s;
    // Handle {{form_response.externalId}} template variables
    result = replacer('{{form_response.', result, function (match) {
        var _a;
        var templateMatch = match.match(/\{\{form_response\.([^}]+)\}\}/);
        if (!templateMatch)
            return match;
        var externalId = templateMatch[1];
        var responseValue = (_a = formResponse.responses) === null || _a === void 0 ? void 0 : _a.find(function (r) { return r.externalId === externalId; });
        if (!responseValue)
            return match;
        // Extract the string value from the response
        var stringValue = '';
        if (typeof responseValue.answer.value === 'string') {
            stringValue = responseValue.answer.value;
        }
        else if (typeof responseValue.answer.value === 'number') {
            stringValue = responseValue.answer.value.toString();
        }
        else if (Array.isArray(responseValue.answer.value)) {
            // For multiple choice, dropdown, etc., join with commas
            stringValue = responseValue.answer.value.join(', ');
        }
        else if (responseValue.answer.value && typeof responseValue.answer.value === 'object') {
            // For complex objects, stringify them
            stringValue = JSON.stringify(responseValue.answer.value);
        }
        return stringValue;
    });
    return result;
};
/**
 * Checks if a potential availability slot violates any calendar event limits.
 *
 * @returns true if the slot should be EXCLUDED (violates a limit), false if allowed
 *
 * A slot is excluded if booking it would exceed the limit for any configured restriction.
 * For example, with a limit of "2 per 7 days", if there are already 2 events in the 7 days
 * BEFORE this slot, the slot is excluded.
 */
export var slot_violates_calendar_event_limits = function (_a) {
    var slotStartTimeInMS = _a.slotStartTimeInMS, templateId = _a.templateId, userId = _a.userId, calendarEventLimits = _a.calendarEventLimits, existingEvents = _a.existingEvents, timezone = _a.timezone;
    // No limits configured - slot is allowed
    if (!calendarEventLimits || calendarEventLimits.length === 0) {
        return false;
    }
    // Find limits that apply to this template
    var relevantLimits = calendarEventLimits.filter(function (limit) { return limit.templateId === templateId; });
    if (relevantLimits.length === 0) {
        return false;
    }
    // Filter events to only those for this user and template
    var userTemplateEvents = existingEvents.filter(function (e) {
        return e.templateId === templateId &&
            e.attendees.some(function (a) { return a.id === userId; });
    });
    var _loop_4 = function (limit) {
        var eventsInPeriod = [];
        if (limit.period === 1) {
            // For 1-day limit, use calendar day logic (midnight to midnight in user's timezone)
            // Include events on the same calendar day, regardless of time
            var slotDate_1 = new Date(slotStartTimeInMS).toLocaleString('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            eventsInPeriod = userTemplateEvents.filter(function (e) {
                var eventDate = new Date(e.startTimeInMS).toLocaleString('en-US', {
                    timeZone: timezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                return eventDate === slotDate_1;
            });
        }
        else {
            // For multi-day limits, use rolling window from start of calendar day
            // Get the start of the slot's calendar day in the user's timezone
            var slotDateTime = new Date(slotStartTimeInMS);
            var slotDateStr = slotDateTime.toLocaleString('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            var _b = slotDateStr.split('/'), month = _b[0], day = _b[1], year = _b[2];
            // Create start of day in user's timezone, then convert to UTC
            var startOfDayLocal = new Date("".concat(year, "-").concat(month, "-").concat(day, "T00:00:00"));
            var startOfDayUTC = new Date(startOfDayLocal.toLocaleString('en-US', { timeZone: 'UTC' }));
            var tzOffset = startOfDayLocal.getTime() - startOfDayUTC.getTime();
            var startOfDayInMS = slotStartTimeInMS - (slotStartTimeInMS % (24 * 60 * 60 * 1000)) - tzOffset;
            // Look back (N-1) days from the start of the current day, since we include the current day
            // Example: 7-day limit = current day + previous 6 days = 7 total days
            var periodStart_1 = startOfDayInMS - ((limit.period - 1) * 24 * 60 * 60 * 1000);
            var periodEnd_1 = startOfDayInMS + (24 * 60 * 60 * 1000); // end of current day
            eventsInPeriod = userTemplateEvents.filter(function (e) {
                return e.startTimeInMS >= periodStart_1 && e.startTimeInMS < periodEnd_1;
            });
        }
        // If we're at or over the limit, this slot violates the restriction
        if (eventsInPeriod.length >= limit.limit) {
            return { value: true // Exclude this slot
             };
        }
    };
    // Check each limit
    for (var _i = 0, relevantLimits_1 = relevantLimits; _i < relevantLimits_1.length; _i++) {
        var limit = relevantLimits_1[_i];
        var state_2 = _loop_4(limit);
        if (typeof state_2 === "object")
            return state_2.value;
    }
    return false; // All limits satisfied, slot is allowed
};
/**
 * Validates that all custom fields referenced in conditional logic exist in the organization's configuration.
 * Used to detect configuration errors in Journeys and Triggers before endusers encounter them.
 *
 * @param conditions - The conditional logic object (enduserCondition or enduserConditions)
 * @param validFields - Set of custom field names that exist in organization settings
 * @returns Array of field names that are referenced but don't exist
 *
 * @example
 * const validFields = new Set(['customField1', 'customField2'])
 * const conditions = { condition: { customField3: 'value' } }
 * const missing = validate_custom_field_references(conditions, validFields)
 * // Returns: ['customField3']
 */
export var validate_custom_field_references = function (conditions, validFields) {
    if (!conditions || object_is_empty(conditions)) {
        return [];
    }
    // Built-in fields that should not be validated as custom fields
    // These are standard Enduser model fields or special derived fields
    var BUILT_IN_FIELDS = new Set(__spreadArray(__spreadArray(__spreadArray([
        // Derived fields
        'Age',
        'BMI',
        'Journeys',
        'Tags',
        'tags',
        'Healthie ID',
        'insurance.payerName',
        'insuranceSecondary.payerName',
        UPCOMING_EVENT_COUNT_KEY
    ], Object.keys(ALL_ENDUSER_FIELDS_TO_DISPLAY_NAME), true), Object.keys(READONLY_ENDUSER_FIELDS_TO_DISPLAY_NAME), true), Object.keys(ENDUSER_FIELDS_WITH_NESTED_PATHS_DISPLAY_NAME), true));
    var missingFields = new Set();
    var checkConditions = function (obj) {
        if (!obj || typeof obj !== 'object') {
            return;
        }
        // Handle compound conditions ($and, $or)
        if (obj.$and && Array.isArray(obj.$and)) {
            obj.$and.forEach(function (cond) { return checkConditions(cond); });
        }
        if (obj.$or && Array.isArray(obj.$or)) {
            obj.$or.forEach(function (cond) { return checkConditions(cond); });
        }
        // Check the 'condition' object which contains the actual field references
        if (obj.condition && typeof obj.condition === 'object') {
            for (var fieldName in obj.condition) {
                // Skip if it's a built-in field
                if (BUILT_IN_FIELDS.has(fieldName)) {
                    continue;
                }
                // If it's not a built-in field and not in validFields, it's missing
                if (!validFields.has(fieldName)) {
                    missingFields.add(fieldName);
                }
            }
        }
    };
    checkConditions(conditions);
    return Array.from(missingFields).sort();
};
//# sourceMappingURL=utils.js.map