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
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Divider, Grid, Typography } from "@mui/material";
import { form_response_value_to_string, formatted_date, getOrgnizationLogoURL, remove_script_tags, user_display_name } from "@tellescope/utilities";
import { DownloadFileIconButton, LabeledIconButton, SecureImage, useOrganization, useResolvedSession, useUsers, value_is_loaded } from "../index";
import CloseIcon from '@mui/icons-material/Close';
import { Image } from "../layout";
var answerStyles = {
    width: '375px',
    borderBottom: '1px solid black',
};
export var AddressDisplay = function (_a) {
    var value = _a.value;
    return (_jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsxs(Typography, __assign({ sx: __assign(__assign({}, answerStyles), { mb: 1 }) }, { children: [value.addressLineOne, " ", value.addressLineTwo] })), _jsxs(Typography, __assign({ sx: answerStyles }, { children: [value.city, " ", value.state, ", ", value.zipCode] }))] })));
};
export var ResponseAnswer = function (_a) {
    var formResponse = _a.formResponse, fieldId = _a.fieldId, isHTML = _a.isHTML, a = _a.answer, printing = _a.printing, onImageClick = _a.onImageClick;
    return (((isHTML || a.type === 'Rich Text') && typeof a.value === 'string')
        ? _jsx("div", { dangerouslySetInnerHTML: { __html: remove_script_tags(a.value) } })
        : a.value
            ? (_jsx(Typography, __assign({ component: "div" }, { children: (a.type === 'multiple_choice' || a.type === 'Database Select')
                    ? (_jsx("div", { children: a.value.map(function (t, i) {
                            return _jsxs("div", { children: [_jsx("input", { type: "checkbox", checked: true }), _jsx("label", __assign({ style: { marginLeft: '4px' } }, { children: a.type === 'Database Select' ? t.text : t }))] }, i);
                        }) }))
                    : a.value === '_question_group' ? _jsx(_Fragment, {})
                        : a.type === 'ranking'
                            ? _jsx("ol", __assign({ style: { margin: 0 } }, { children: a.value.map(function (t, i) {
                                    return _jsx("li", { children: t }, i);
                                }) }))
                            : a.type === 'file'
                                ? a.value.secureName
                                    ? _jsxs(Typography, { children: [!printing
                                                ? _jsx(DownloadFileIconButton, { secureName: a.value.secureName, onDownload: function (url) { return window.open(url, '_blank'); } })
                                                : (_jsx(SecureImage, { secureName: a.value.secureName, onImageClick: onImageClick, style: { maxHeight: 400, maxWidth: 400 } })), _jsx("em", { children: a.value.name || 'Attachment' })] })
                                    : null // null when optional and omitted
                                : a.type === 'files'
                                    ? a.value.map(function (file) { return (_jsxs(Typography, { children: [!printing
                                                ? _jsx(DownloadFileIconButton, { secureName: file.secureName, onDownload: function (url) { return window.open(url, '_blank'); } })
                                                : (_jsx(SecureImage, { secureName: file.secureName, style: { maxHeight: 400, maxWidth: 400 } })), _jsx("em", { children: file.name || 'Attachment' })] }, file.secureName)); })
                                    : a.type === 'signature'
                                        ? _jsx(Typography, __assign({ style: answerStyles }, { children: a.value.signed ? _jsxs("span", { children: ["Electronically signed as ", _jsx("em", { children: a.value.fullName })] }) : 'Unsigned' }))
                                        : a.type === 'stringLong'
                                            ? (_jsx(Grid, __assign({ container: true, direction: "column" }, { children: a.value.split('\n').map(function (line, i) { return (_jsx(Typography, __assign({ style: answerStyles }, { children: line || _jsx("br", {}) }), i)); }) })))
                                            : (a.type === 'Address' && a.value)
                                                ? _jsx(AddressDisplay, { value: a.value })
                                                : a.type === 'date'
                                                    ? _jsxs(Typography, __assign({ style: answerStyles }, { children: [new Date(a.value).toDateString(), " ", new Date(a.value).toTimeString().split(' ')[0]] }))
                                                    : (a.type === 'Medications' && a.value)
                                                        ? (
                                                        // modified from enduser_views MedicationsResponseDisplay in private webapp 
                                                        _jsx(Grid, __assign({ container: true, direction: "column", sx: { overflowX: 'auto' } }, { children: a.value.map(function (medication, i) {
                                                                var _a, _b, _c;
                                                                return (_jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, direction: "column" }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ style: { fontWeight: 'bold' } }, { children: medication.drugName && medication.drugName !== 'Unknown'
                                                                                        ? medication.drugName
                                                                                        : medication.displayTerm })) })), _jsx(Grid, __assign({ item: true, style: { marginLeft: 20 } }, { children: _jsxs(Typography, { children: [((_a = medication.dosage) === null || _a === void 0 ? void 0 : _a.quantity) ? "".concat(medication.dosage.quantity, " units") : '', ((_b = medication.dosage) === null || _b === void 0 ? void 0 : _b.frequency)
                                                                                            ? "".concat(((_c = medication.dosage) === null || _c === void 0 ? void 0 : _c.quantity) ? ', ' : '').concat(medication.dosage.frequency, "x daily")
                                                                                            : ''] }) })), medication.reasonForTaking &&
                                                                                _jsx(Grid, __assign({ item: true, style: { marginLeft: 20 } }, { children: _jsxs(Typography, { children: ["Reason: ", medication.reasonForTaking] }) }))] })) }), i));
                                                            }) })))
                                                        : (a.type === 'Emotii') ? (function () {
                                                            var _a;
                                                            if (!a.value)
                                                                return null;
                                                            var scoring = (_a = formResponse === null || formResponse === void 0 ? void 0 : formResponse.emotii) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.id === fieldId; });
                                                            if (!scoring)
                                                                return null;
                                                            return (_jsx(_Fragment, { children: __spreadArray([__assign({ label: 'Average' }, scoring.scores.total)], scoring.scores.byAnswer, true).map(function (s, i) { return (_jsxs(Typography, { children: [s.label, ": ", s.score] })); }) }));
                                                        })()
                                                            : (a.type === 'Related Contacts' && a.value && a.value.length > 0) ? (_jsx(Grid, __assign({ container: true, direction: "column", spacing: 1 }, { children: a.value.map(function (v, i) { return (_jsx(Grid, __assign({ item: true }, { children: _jsxs(Typography, { children: [v.fname, v.lname && " ".concat(v.lname), v.dateOfBirth && " ".concat(v.dateOfBirth), v.email && ", ".concat(v.email), v.phone && ", ".concat(v.phone)] }) }), i)); }) })))
                                                                : (_jsx(Typography, __assign({ style: answerStyles }, { children: form_response_value_to_string(a.value) }))) }))) : (a.type === 'description'
            ? _jsx(_Fragment, {})
            : _jsx(Typography, { children: "No value provided" })));
};
export var OrganizationLogo = function () {
    var organizationLoading = useOrganization()[0];
    if (!value_is_loaded(organizationLoading))
        return null;
    if (typeof organizationLoading.value.logoVersion !== 'number')
        return null;
    var logoURL = getOrgnizationLogoURL(organizationLoading.value);
    return (_jsx(Image, { src: logoURL, alt: "", maxWidth: 400, height: 50 }));
};
export var ResolveOrganizationLogo = function (_a) {
    var logoURL = _a.logoURL;
    var session = useResolvedSession();
    if (logoURL) {
        return (_jsx(Image, { src: logoURL, alt: "", maxWidth: 400, height: 50 }));
    }
    if (session.type === 'enduser')
        return null;
    return _jsx(OrganizationLogo, {});
};
// this should use all vanilla React / inline styles to ensure printing is consistent
export var FormResponseView = function (_a) {
    var _b;
    var logoURL = _a.logoURL, enduser = _a.enduser, onClose = _a.onClose, hideHeader = _a.hideHeader, response = _a.response, id = _a.id, printing = _a.printing, onImageClick = _a.onImageClick;
    var _c = useUsers(), findUser = _c[1].findById;
    var user = findUser((_b = response.submittedBy) !== null && _b !== void 0 ? _b : '');
    if (response.responses === undefined || response.responses.length === 0) {
        return _jsx(Typography, { children: "Awaiting Response" });
    }
    return (_jsxs("div", __assign({ style: { display: 'flex', flex: 1, flexDirection: 'column', minWidth: 400, maxWidth: 650 }, id: id }, { children: [_jsxs("div", __assign({ style: { textAlign: 'center' } }, { children: [!hideHeader &&
                        _jsxs(_Fragment, { children: [_jsx(ResolveOrganizationLogo, { logoURL: logoURL }), _jsx("h2", __assign({ style: {
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 8,
                                    } }, { children: response.formTitle }))] }), onClose
                        ? _jsx(LabeledIconButton, { Icon: CloseIcon, label: "Close", onClick: onClose })
                        : _jsx(Grid, {})] })), enduser &&
                _jsx(Typography, __assign({ style: {
                        fontSize: 18,
                        color: 'black',
                        paddingBottom: 4,
                        textAlign: 'center',
                    } }, { children: user_display_name(enduser) })), (enduser || response.userEmail || response.submittedBy) && !hideHeader &&
                _jsx(Typography, __assign({ style: {
                        fontSize: 16,
                        paddingBottom: 4,
                        textAlign: 'center',
                    } }, { children: response.submittedBy
                        ? (user
                            ? _jsxs("span", { children: ["Submitted by ", user_display_name(user)] })
                            : '' // still loading, or can't find user for submittedBy
                        )
                        : _jsxs("span", { children: ["From ", user_display_name(enduser !== null && enduser !== void 0 ? enduser : { email: response.userEmail })] }) })), _jsx("div", __assign({ style: { textAlign: 'center', paddingBottom: 4 } }, { children: _jsx("i", { children: formatted_date(new Date(response.submittedAt || response.createdAt)) }) })), _jsx(Divider, { flexItem: true, style: { marginTop: 2, marginBottom: 12 } }), _jsx("div", __assign({ style: { flexDirection: "column", display: 'flex', flex: 1 } }, { children: response.responses.map(function (r, i) {
                    var showAnswerInline = true;
                    // old logic for showAnswerInline
                    //  (
                    //       (!r.fieldDescription?.trim() && r.fieldHtmlDescription?.trim() === '<p></p>')
                    //   || !(r.fieldDescription?.trim() || r.fieldHtmlDescription?.trim())
                    // )
                    return (_jsxs("div", __assign({ style: { marginBottom: 12 } }, { children: [_jsxs("div", __assign({ style: { display: 'flex', flex: 1, flexDirection: "row", justifyContent: 'space-between', flexWrap: 'nowrap' } }, { children: [r.fieldTitle &&
                                        _jsx("div", __assign({ style: {} }, { children: _jsx(Typography, __assign({ style: {
                                                    fontWeight: 'bold',
                                                    width: (showAnswerInline
                                                        ? '400px'
                                                        : undefined)
                                                } }, { children: r.fieldTitle })) })), _jsx("div", __assign({ style: {} }, { children: showAnswerInline && r.answer.type !== 'Question Group'
                                            && !(typeof r.answer.value === 'string' && r.answer.value.includes('{TELLESCOPE')) // hidden field for matching, not to display
                                            && ((r.answerIsHTML && typeof r.answer.value === 'string')
                                                ? _jsx("div", { dangerouslySetInnerHTML: { __html: remove_script_tags(r.answer.value) } })
                                                : _jsx(ResponseAnswer, { fieldId: r.fieldId, formResponse: response, answer: r.answer, printing: printing })) }))] })), r.fieldDescription
                                ? (_jsx(Typography, __assign({ style: {} }, { children: r.fieldDescription }))) : r.fieldHtmlDescription
                                ? (_jsx("div", { dangerouslySetInnerHTML: {
                                        __html: r.fieldHtmlDescription
                                    } }))
                                : null, !showAnswerInline &&
                                _jsx(ResponseAnswer, { answer: r.answer, formResponse: response, fieldId: r.fieldId })] }), i));
                }) })), (response.addenda || []).length > 0 &&
                _jsx("div", { style: { borderBottom: '1px solid #00000088', width: '100%', marginTop: 10, marginBottom: 10 } }), (response.addenda || []).map(function (a, i) { return (_jsxs("div", __assign({ style: { marginTop: 10 } }, { children: [_jsxs("div", __assign({ style: { fontWeight: 'bold', fontSize: 15 } }, { children: ["Addendum ", i + 1, " by ", user_display_name(findUser(a.userId, { batch: true })), " at ", formatted_date(new Date(a.timestamp))] })), _jsx("div", __assign({ style: { fontSize: 14 } }, { children: a.text.split('\n').map(function (v, t) { return _jsx("div", { children: v }, t); }) }))] }), i)); })] })));
};
//# sourceMappingURL=form_responses.js.map