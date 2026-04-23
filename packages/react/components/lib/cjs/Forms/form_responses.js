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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormResponseView = exports.ResolveOrganizationLogo = exports.OrganizationLogo = exports.ResponseAnswer = exports.HistoricalDataSnapshotDisplay = exports.AddressDisplay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var material_1 = require("@mui/material");
var utilities_1 = require("@tellescope/utilities");
var index_1 = require("../index");
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var layout_1 = require("../layout");
var answerStyles = {
    width: '375px',
    borderBottom: '1px solid black',
};
var AddressDisplay = function (_a) {
    var value = _a.value;
    return ((0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ sx: __assign(__assign({}, answerStyles), { mb: 1 }) }, { children: [value.addressLineOne, " ", value.addressLineTwo] })), (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ sx: answerStyles }, { children: [value.city, " ", value.state, ", ", value.zipCode] }))] })));
};
exports.AddressDisplay = AddressDisplay;
var HistoricalDataSnapshotDisplay = function (_a) {
    var snapshot = _a.snapshot;
    var _b = snapshot.observations, obsRefs = _b === void 0 ? [] : _b, _c = snapshot.medications, medRefs = _c === void 0 ? [] : _c, snapshotAt = snapshot.snapshotAt;
    var _d = (0, index_1.useEnduserObservations)({ dontFetch: true }), findObservation = _d[1].findById;
    var _e = (0, index_1.useEnduserMedications)({ dontFetch: true }), findMedication = _e[1].findById;
    var tdStyle = { padding: '6px 8px' };
    var deletedStyle = { padding: '6px 8px', color: '#999', fontStyle: 'italic' };
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { marginTop: 10 } }, { children: [snapshotAt && ((0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ style: { fontSize: 12, color: '#888', marginBottom: 8 } }, { children: ["Snapshot taken at ", (0, utilities_1.formatted_date)(new Date(snapshotAt))] }))), obsRefs.length > 0 && ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { marginBottom: 15 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { fontWeight: 'bold', marginBottom: 5 } }, { children: "Observations" })), (0, jsx_runtime_1.jsxs)("table", __assign({ style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } }, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", __assign({ style: { borderBottom: '2px solid #ccc', textAlign: 'left' } }, { children: [(0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Date" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Type" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Value" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Category" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Status" }))] })) }), (0, jsx_runtime_1.jsx)("tbody", { children: obsRefs.map(function (ref, i) {
                                    var obs = findObservation(ref.id, { batch: true });
                                    if (obs === undefined)
                                        return ((0, jsx_runtime_1.jsx)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: (0, jsx_runtime_1.jsx)("td", __assign({ colSpan: 5, style: tdStyle }, { children: "Loading..." })) }), ref.id || i));
                                    if (obs === null)
                                        return ((0, jsx_runtime_1.jsx)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: (0, jsx_runtime_1.jsxs)("td", __assign({ colSpan: 5, style: deletedStyle }, { children: [ref.label, " \u2014 Record no longer available"] })) }), ref.id || i));
                                    return ((0, jsx_runtime_1.jsxs)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: [(0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: obs.timestamp ? (0, utilities_1.formatted_date)(new Date(obs.timestamp)) : '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: obs.type || obs.code || '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: obs.measurement ? "".concat(obs.measurement.value, " ").concat(obs.measurement.unit) : obs.qualitativeResult || '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: obs.category || '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: obs.status || '-' }))] }), obs.id || i));
                                }) })] }))] }))), medRefs.length > 0 && ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { marginBottom: 15 } }, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { fontWeight: 'bold', marginBottom: 5 } }, { children: "Medications" })), (0, jsx_runtime_1.jsxs)("table", __assign({ style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } }, { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", __assign({ style: { borderBottom: '2px solid #ccc', textAlign: 'left' } }, { children: [(0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Medication" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Dosage" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Dispensing" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Pharmacy" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Prescriber" })), (0, jsx_runtime_1.jsx)("th", __assign({ style: tdStyle }, { children: "Date" }))] })) }), (0, jsx_runtime_1.jsx)("tbody", { children: medRefs.map(function (ref, i) {
                                    var _a;
                                    var med = findMedication(ref.id, { batch: true });
                                    if (med === undefined)
                                        return ((0, jsx_runtime_1.jsx)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: (0, jsx_runtime_1.jsx)("td", __assign({ colSpan: 6, style: tdStyle }, { children: "Loading..." })) }), ref.id || i));
                                    if (med === null)
                                        return ((0, jsx_runtime_1.jsx)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: (0, jsx_runtime_1.jsxs)("td", __assign({ colSpan: 6, style: deletedStyle }, { children: [ref.label, " \u2014 Record no longer available"] })) }), ref.id || i));
                                    return ((0, jsx_runtime_1.jsxs)("tr", __assign({ style: { borderBottom: '1px solid #eee' } }, { children: [(0, jsx_runtime_1.jsxs)("td", __assign({ style: tdStyle }, { children: [med.title || '-', med.allergyNote ? (0, jsx_runtime_1.jsxs)("div", __assign({ style: { color: 'red', fontSize: 12 } }, { children: ["Allergies: ", med.allergyNote] })) : null, med.directions ? (0, jsx_runtime_1.jsxs)("div", __assign({ style: { color: '#888', fontSize: 12 } }, { children: ["Directions: ", med.directions] })) : null] })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: med.dosage
                                                    ? med.dosage.description
                                                        ? med.dosage.description
                                                        : "".concat(med.dosage.value || '').concat(med.dosage.unit ? " ".concat(med.dosage.unit) : '').concat(med.dosage.quantity ? " ".concat(med.dosage.quantity, " units") : '').concat(med.dosage.frequency ? " ".concat(!isNaN(parseInt(med.dosage.frequency)) ? "".concat(med.dosage.frequency, "x ").concat(((_a = med.dosage) === null || _a === void 0 ? void 0 : _a.frequencyDescriptor) ? "Per ".concat(med.dosage.frequencyDescriptor) : 'daily') : med.dosage.frequency) : '')
                                                    : '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: med.dispensing ? "".concat(med.dispensing.quantity || '', " ").concat(med.dispensing.unit || '').trim() || '-' : '-' })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: med.pharmacyName || med.pharmacyId || '-' })), (0, jsx_runtime_1.jsxs)("td", __assign({ style: tdStyle }, { children: [med.prescriberName || '-', med.source ? (0, jsx_runtime_1.jsx)("div", __assign({ style: { fontStyle: 'italic', fontSize: 12 } }, { children: med.source })) : null, med.notes ? (0, jsx_runtime_1.jsx)("div", __assign({ style: { fontSize: 12 } }, { children: med.notes })) : null] })), (0, jsx_runtime_1.jsx)("td", __assign({ style: tdStyle }, { children: (0, utilities_1.formatted_date)(new Date(med.startedTakingAt || med.prescribedAt || med.createdAt)) }))] }), med.id || i));
                                }) })] }))] }))), obsRefs.length === 0 && medRefs.length === 0 && ((0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { fontStyle: 'italic', color: '#888' } }, { children: "No historical data recorded" })))] })));
};
exports.HistoricalDataSnapshotDisplay = HistoricalDataSnapshotDisplay;
var ResponseAnswer = function (_a) {
    var formResponse = _a.formResponse, fieldId = _a.fieldId, isHTML = _a.isHTML, a = _a.answer, printing = _a.printing, onImageClick = _a.onImageClick;
    return (((isHTML || a.type === 'Rich Text') && typeof a.value === 'string')
        ? (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: (0, utilities_1.remove_script_tags)(a.value) } })
        : a.value
            ? ((0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ component: "div" }, { children: (a.type === 'multiple_choice' || a.type === 'Database Select')
                    ? ((0, jsx_runtime_1.jsx)("div", { children: a.value.map(function (t, i) {
                            return (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: true }), (0, jsx_runtime_1.jsx)("label", __assign({ style: { marginLeft: '4px' } }, { children: a.type === 'Database Select' ? t.text : t }))] }, i);
                        }) }))
                    : (a.value === '_question_group' || a.type === 'Question Group') ? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})
                        : a.type === 'ranking'
                            ? (0, jsx_runtime_1.jsx)("ol", __assign({ style: { margin: 0 } }, { children: a.value.map(function (t, i) {
                                    return (0, jsx_runtime_1.jsx)("li", { children: t }, i);
                                }) }))
                            : a.type === 'file'
                                ? a.value.secureName
                                    ? (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [!printing
                                                ? (0, jsx_runtime_1.jsx)(index_1.DownloadFileIconButton, { secureName: a.value.secureName, onDownload: function (url) { return window.open(url, '_blank'); } })
                                                : ((0, jsx_runtime_1.jsx)(index_1.SecureImage, { secureName: a.value.secureName, onImageClick: onImageClick, style: { maxHeight: 400, maxWidth: 400 }, crossOrigin: "anonymous" })), (0, jsx_runtime_1.jsx)("em", { children: a.value.name || 'Attachment' })] })
                                    : null // null when optional and omitted
                                : a.type === 'files'
                                    ? a.value.map(function (file) { return ((0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [!printing
                                                ? (0, jsx_runtime_1.jsx)(index_1.DownloadFileIconButton, { secureName: file.secureName, onDownload: function (url) { return window.open(url, '_blank'); } })
                                                : ((0, jsx_runtime_1.jsx)(index_1.SecureImage, { secureName: file.secureName, style: { maxHeight: 400, maxWidth: 400 } })), (0, jsx_runtime_1.jsx)("em", { children: file.name || 'Attachment' })] }, file.secureName)); })
                                    : a.type === 'signature'
                                        ? (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: answerStyles }, { children: a.value.signed ? (0, jsx_runtime_1.jsxs)("span", { children: ["Electronically signed as ", (0, jsx_runtime_1.jsx)("em", { children: a.value.fullName })] }) : 'Unsigned' }))
                                        : a.type === 'stringLong'
                                            ? ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: a.value.split('\n').map(function (line, i) { return ((0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: answerStyles }, { children: line || (0, jsx_runtime_1.jsx)("br", {}) }), i)); }) })))
                                            : (a.type === 'Address' && a.value)
                                                ? (0, jsx_runtime_1.jsx)(exports.AddressDisplay, { value: a.value })
                                                : a.type === 'date'
                                                    ? (0, jsx_runtime_1.jsxs)(material_1.Typography, __assign({ style: answerStyles }, { children: [new Date(a.value).toDateString(), " ", new Date(a.value).toTimeString().split(' ')[0]] }))
                                                    : (a.type === 'Medications' && a.value)
                                                        ? (
                                                        // modified from enduser_views MedicationsResponseDisplay in private webapp 
                                                        (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, direction: "column", sx: { overflowX: 'auto' } }, { children: a.value.map(function (medication, i) {
                                                                var _a, _b, _c;
                                                                return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, __assign({ container: true, direction: "column" }, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: { fontWeight: 'bold' } }, { children: medication.drugName && medication.drugName !== 'Unknown'
                                                                                        ? medication.drugName
                                                                                        : medication.displayTerm })) })), (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, style: { marginLeft: 20 } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [((_a = medication.dosage) === null || _a === void 0 ? void 0 : _a.quantity) ? "".concat(medication.dosage.quantity, " units") : '', ((_b = medication.dosage) === null || _b === void 0 ? void 0 : _b.frequency)
                                                                                            ? "".concat(((_c = medication.dosage) === null || _c === void 0 ? void 0 : _c.quantity) ? ', ' : '').concat(medication.dosage.frequency, "x daily")
                                                                                            : ''] }) })), medication.reasonForTaking &&
                                                                                (0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true, style: { marginLeft: 20 } }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Reason: ", medication.reasonForTaking] }) }))] })) }), i));
                                                            }) })))
                                                        : (a.type === 'Emotii') ? (function () {
                                                            var _a;
                                                            if (!a.value)
                                                                return null;
                                                            var scoring = (_a = formResponse === null || formResponse === void 0 ? void 0 : formResponse.emotii) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.id === fieldId; });
                                                            if (!scoring)
                                                                return null;
                                                            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: __spreadArray([__assign({ label: 'Average' }, scoring.scores.total)], scoring.scores.byAnswer, true).map(function (s, i) { return ((0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [s.label, ": ", s.score] })); }) }));
                                                        })()
                                                            : (a.type === 'Related Contacts' && a.value && a.value.length > 0) ? ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: a.value.map(function (v, i) { return ((0, jsx_runtime_1.jsx)(material_1.Grid, __assign({ item: true }, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [v.fname, v.lname && " ".concat(v.lname), v.dateOfBirth && " ".concat(v.dateOfBirth), v.email && ", ".concat(v.email), v.phone && ", ".concat(v.phone)] }) }), i)); }) })))
                                                                : ((0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: answerStyles }, { children: (0, utilities_1.form_response_value_to_string)(a.value) }))) }))) : (a.type === 'description'
            ? (a.value && typeof a.value === 'string' && a.value.startsWith('{'))
                ? (function () { try {
                    return (0, jsx_runtime_1.jsx)(exports.HistoricalDataSnapshotDisplay, { snapshot: JSON.parse(a.value) });
                }
                catch (_a) {
                    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
                } })()
                : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})
            : (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "No value provided" })));
};
exports.ResponseAnswer = ResponseAnswer;
var OrganizationLogo = function (_a) {
    var crossOrigin = _a.crossOrigin;
    var organizationLoading = (0, index_1.useOrganization)()[0];
    if (!(0, index_1.value_is_loaded)(organizationLoading))
        return null;
    if (typeof organizationLoading.value.logoVersion !== 'number')
        return null;
    var logoURL = (0, utilities_1.getOrgnizationLogoURL)(organizationLoading.value);
    return ((0, jsx_runtime_1.jsx)(layout_1.Image, { crossOrigin: crossOrigin, src: logoURL, alt: "", maxWidth: 400, height: 50 }));
};
exports.OrganizationLogo = OrganizationLogo;
var ResolveOrganizationLogo = function (_a) {
    var logoURL = _a.logoURL, crossOrigin = _a.crossOrigin;
    var session = (0, index_1.useResolvedSession)();
    if (logoURL) {
        return ((0, jsx_runtime_1.jsx)(layout_1.Image, { crossOrigin: crossOrigin, src: logoURL, alt: "", maxWidth: 400, height: 50 }));
    }
    if (session.type === 'enduser')
        return null;
    return (0, jsx_runtime_1.jsx)(exports.OrganizationLogo, { crossOrigin: crossOrigin });
};
exports.ResolveOrganizationLogo = ResolveOrganizationLogo;
// this should use all vanilla React / inline styles to ensure printing is consistent
var FormResponseView = function (_a) {
    var _b;
    var _c = _a.showAnswerInline, showAnswerInline = _c === void 0 ? true : _c, logoURL = _a.logoURL, enduser = _a.enduser, onClose = _a.onClose, hideHeader = _a.hideHeader, response = _a.response, id = _a.id, printing = _a.printing, onImageClick = _a.onImageClick;
    var _d = (0, index_1.useUsers)(), findUser = _d[1].findById;
    var user = findUser((_b = response.submittedBy) !== null && _b !== void 0 ? _b : '');
    if (response.responses === undefined || response.responses.length === 0) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Awaiting Response" });
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { display: 'flex', flex: 1, flexDirection: 'column', minWidth: 400, maxWidth: 650 }, id: id }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ style: { textAlign: 'center' } }, { children: [!hideHeader &&
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(exports.ResolveOrganizationLogo, { logoURL: logoURL, crossOrigin: "anonymous" }), (0, jsx_runtime_1.jsx)("h2", __assign({ style: {
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 8,
                                    } }, { children: response.formTitle }))] }), onClose
                        ? (0, jsx_runtime_1.jsx)(index_1.LabeledIconButton, { Icon: Close_1.default, label: "Close", onClick: onClose })
                        : (0, jsx_runtime_1.jsx)(material_1.Grid, {})] })), enduser &&
                (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: {
                        fontSize: 18,
                        color: 'black',
                        paddingBottom: 4,
                        textAlign: 'center',
                    } }, { children: (0, utilities_1.user_display_name)(enduser) })), (enduser || response.userEmail || response.submittedBy) && !hideHeader &&
                (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: {
                        fontSize: 16,
                        paddingBottom: 4,
                        textAlign: 'center',
                    } }, { children: response.submittedBy
                        ? (user
                            ? (0, jsx_runtime_1.jsxs)("span", { children: ["Submitted by ", (0, utilities_1.user_display_name)(user)] })
                            : '' // still loading, or can't find user for submittedBy
                        )
                        : (0, jsx_runtime_1.jsxs)("span", { children: ["From ", (0, utilities_1.user_display_name)(enduser !== null && enduser !== void 0 ? enduser : { email: response.userEmail })] }) })), (0, jsx_runtime_1.jsx)("div", __assign({ style: { textAlign: 'center', paddingBottom: 4 } }, { children: (0, jsx_runtime_1.jsx)("i", { children: (0, utilities_1.formatted_date)(new Date(response.submittedAt || response.createdAt)) }) })), (0, jsx_runtime_1.jsx)(material_1.Divider, { flexItem: true, style: { marginTop: 2, marginBottom: 12 } }), (0, jsx_runtime_1.jsx)("div", __assign({ style: { flexDirection: "column", display: 'flex', flex: 1 } }, { children: response.responses.map(function (r, i) { return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { marginBottom: 36, breakInside: 'avoid' }, "data-pdf-block": true }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ style: { display: 'flex', flex: 1, flexDirection: "row", justifyContent: 'space-between', flexWrap: 'nowrap' } }, { children: [r.fieldTitle &&
                                    (0, jsx_runtime_1.jsx)("div", __assign({ style: {} }, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: {
                                                fontWeight: 'bold',
                                                width: (showAnswerInline
                                                    ? '400px'
                                                    : undefined)
                                            } }, { children: r.fieldTitle })) })), (0, jsx_runtime_1.jsx)("div", __assign({ style: {} }, { children: showAnswerInline && r.answer.type !== 'Question Group'
                                        && !(typeof r.answer.value === 'string' && r.answer.value.includes('{TELLESCOPE')) // hidden field for matching, not to display
                                        && ((r.answerIsHTML && typeof r.answer.value === 'string')
                                            ? (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: { __html: (0, utilities_1.remove_script_tags)(r.answer.value) } })
                                            : (0, jsx_runtime_1.jsx)(exports.ResponseAnswer, { fieldId: r.fieldId, formResponse: response, answer: r.answer, printing: printing })) }))] })), r.fieldDescription
                            ? ((0, jsx_runtime_1.jsx)(material_1.Typography, __assign({ style: {} }, { children: r.fieldDescription }))) : r.fieldHtmlDescription
                            ? ((0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                    __html: r.fieldHtmlDescription
                                } }))
                            : null, !showAnswerInline &&
                            (0, jsx_runtime_1.jsx)("div", __assign({ style: {} }, { children: (0, jsx_runtime_1.jsx)(exports.ResponseAnswer, { answer: r.answer, formResponse: response, fieldId: r.fieldId }) }))] }), i)); }) })), (response.addenda || []).length > 0 &&
                (0, jsx_runtime_1.jsx)("div", { style: { borderBottom: '1px solid #00000088', width: '100%', marginTop: 10, marginBottom: 10 } }), (response.addenda || []).map(function (a, i) { return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: { marginTop: 10 } }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ style: { fontWeight: 'bold', fontSize: 15 } }, { children: ["Addendum ", i + 1, " by ", (0, utilities_1.user_display_name)(findUser(a.userId, { batch: true })), " at ", (0, utilities_1.formatted_date)(new Date(a.timestamp))] })), (0, jsx_runtime_1.jsx)("div", __assign({ style: { fontSize: 14 } }, { children: a.text.split('\n').map(function (v, t) { return (0, jsx_runtime_1.jsx)("div", { children: v }, t); }) }))] }), i)); })] })));
};
exports.FormResponseView = FormResponseView;
//# sourceMappingURL=form_responses.js.map