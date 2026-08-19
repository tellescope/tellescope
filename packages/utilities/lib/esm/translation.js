// Shared, transport-agnostic translation helpers for the translations framework.
//
// Holds the *pure* parts of AI translation (supported language list + system-prompt builder) so they
// can be reused by the webapp UI and any backend caller. Must stay free of any SDK/DB/React imports —
// only plain types from types-models. Mirrors the ai_summary.ts convention.
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Preset list of common languages offered in the translate UI. `code` is the key used under
// translations.<field>.<code>; `label` is the human-readable name passed to the AI prompt.
export var TRANSLATION_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'zh', label: 'Chinese' },
    { code: 'de', label: 'German' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ru', label: 'Russian' },
    { code: 'ar', label: 'Arabic' },
    { code: 'hi', label: 'Hindi' },
    { code: 'vi', label: 'Vietnamese' },
    { code: 'ko', label: 'Korean' },
    { code: 'ja', label: 'Japanese' },
    { code: 'tl', label: 'Tagalog' },
];
export var languageLabelForCode = function (code) { var _a, _b; return (_b = (_a = TRANSLATION_LANGUAGES.find(function (l) { return l.code === code; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : code; };
// Builds the system prompt for translating arbitrary text into the target language. The caller sends
// the source text as the user message and this as the `prompt` (system) to the chat completion endpoint.
export var generateTranslationSystemPrompt = function (targetLanguageLabel, options) {
    return "You are a professional medical translator. Translate the user's text into ".concat(targetLanguageLabel, ". ")
        + "Preserve meaning, names, numbers, dates, and medical terminology. "
        + ((options === null || options === void 0 ? void 0 : options.preserveTemplateSyntax)
            ? ("The text is a message draft containing markup that must survive translation exactly as written. "
                + "Translate only the human-readable text. Copy the following character-for-character without translating, "
                + "reordering, reformatting, escaping, or removing them: (1) HTML tags, attributes, and attribute values \u2014 "
                + "translate only the visible text between tags; (2) any placeholder in double curly braces, such as "
                + "{{enduser.fname}} or {{forms.abc123.link:Sign Here}}; (3) any link template of the form {url}[label], "
                + "including the square brackets and their contents. Keep the original whitespace, line breaks, and paragraph "
                + "structure. Do not add a greeting, sign-off, note, explanation, or markdown code fences. ")
            : '')
        + "Respond with only the translated text and nothing else.";
};
// Builds the system prompt for translating a JSON batch of strings (used by form translation maps,
// where many independent display strings are translated in one call). The caller sends
// JSON.stringify(string[]) as the user message; the model must return only a JSON array of the same
// length and order, each element the translation of its counterpart.
export var generateBatchTranslationSystemPrompt = function (targetLanguageLabel) {
    return "You are a professional medical translator. The user's message is a JSON array of independent English strings "
        + "from a healthcare form. Translate each string into ".concat(targetLanguageLabel, ". ")
        + "Preserve meaning, names, numbers, dates, and medical terminology. "
        + "Some strings contain markup that must survive translation exactly as written. Translate only the "
        + "human-readable text. Copy the following character-for-character without translating, reordering, "
        + "reformatting, escaping, or removing them: (1) HTML tags, attributes, and attribute values \u2014 translate only "
        + "the visible text between tags; (2) any placeholder in double curly braces, such as {{enduser.fname}}; "
        + "(3) any link template of the form {url}[label], including the square brackets and their contents. "
        + "Keep the original whitespace and line breaks within each string. "
        + "Respond with only a valid JSON array of strings \u2014 the same length and order as the input, where each "
        + "element is the translation of the input element at the same index. No greeting, explanation, or markdown code fences.";
};
// Storage encoding for translation maps kept in Configuration.value. That field's validator runs
// sanitize_html (allowedTags: []), which strips HTML tags outright and entity-encodes & < >, corrupting
// raw JSON that contains translated HTML. JSON.stringify never emits & < > as structural characters, so
// replacing every occurrence with its \uXXXX escape yields equivalent JSON with none of the characters
// the sanitizer touches; JSON.parse restores the originals exactly. (Removing escapeHTML from the shared
// configurations validator was rejected — it would loosen sanitization for existing integration configs.)
export var encodeTranslationMapForStorage = function (map) {
    return JSON.stringify(map).replace(/[&<>]/g, function (c) { return "\\u".concat(c.charCodeAt(0).toString(16).padStart(4, '0')); });
};
export var decodeTranslationMapFromStorage = function (value) {
    try {
        var parsed = JSON.parse(value || '{}');
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    }
    catch (_a) {
        return {};
    }
};
// Collects every English display string on a form + its fields that should be included in an
// AI-generated translation map. Pure and deduped; empty/whitespace-only strings are dropped.
// UI chrome strings (Next/Submit/validation text) live in the react components package
// (FORM_CHROME_ENGLISH_STRINGS) — callers append those separately.
export var collectFormTranslationSourceStrings = function (form, fields) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var strings = [
        form.title,
        form.displayTitle,
        form.description,
        form.thanksMessage,
        form.htmlThanksMessage,
    ];
    // every string-valued customization field is display text (publicFormHTMLDescription, public*Label, ...)
    for (var _i = 0, _m = Object.values((_a = form.customization) !== null && _a !== void 0 ? _a : {}); _i < _m.length; _i++) {
        var value = _m[_i];
        if (typeof value === 'string')
            strings.push(value);
    }
    for (var _o = 0, fields_1 = fields; _o < fields_1.length; _o++) {
        var field = fields_1[_o];
        strings.push(field.title, field.placeholder, field.description, field.htmlDescription, field.headerText);
        strings.push.apply(strings, ((_c = (_b = field.options) === null || _b === void 0 ? void 0 : _b.choices) !== null && _c !== void 0 ? _c : []));
        strings.push((_d = field.options) === null || _d === void 0 ? void 0 : _d.customPriceMessage);
        for (var _p = 0, _q = (_f = (_e = field.options) === null || _e === void 0 ? void 0 : _e.optionDetails) !== null && _f !== void 0 ? _f : []; _p < _q.length; _p++) {
            var detail = _q[_p];
            strings.push(detail.description);
        }
        for (var _r = 0, _s = (_h = (_g = field.options) === null || _g === void 0 ? void 0 : _g.tableChoices) !== null && _h !== void 0 ? _h : []; _r < _s.length; _r++) {
            var tableChoice = _s[_r];
            strings.push.apply(strings, __spreadArray([tableChoice.label], ((_k = (_j = tableChoice.info) === null || _j === void 0 ? void 0 : _j.choices) !== null && _k !== void 0 ? _k : []), false));
        }
        for (var _t = 0, _u = (_l = field.feedback) !== null && _l !== void 0 ? _l : []; _t < _u.length; _t++) {
            var feedback = _u[_t];
            strings.push(feedback.display);
        }
    }
    var deduped = new Set();
    for (var _v = 0, strings_1 = strings; _v < strings_1.length; _v++) {
        var s = strings_1[_v];
        var trimmed = s === null || s === void 0 ? void 0 : s.trim();
        if (trimmed)
            deduped.add(s);
    }
    return Array.from(deduped);
};
// Resolves an Enduser's language preference to one of TRANSLATION_LANGUAGES, for defaulting the target
// language of a translation. Handles the shapes that exist in real data: bare codes ('es'), regional codes
// ('es-ES'), and records with an empty iso6391 but a populated displayName ('Spanish').
//
// Drafts are assumed to be written in English, so a preference that resolves to English falls through to
// the fallback (Spanish) — translating English into English is never the intent.
export var translationLanguageCodeForLanguage = function (language, options) {
    var _a, _b, _c, _d;
    var fallback = (_a = options === null || options === void 0 ? void 0 : options.fallback) !== null && _a !== void 0 ? _a : 'es';
    var code = (_c = (_b = language === null || language === void 0 ? void 0 : language.iso6391) === null || _b === void 0 ? void 0 : _b.split('-')[0]) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase();
    if (code && code !== 'en' && TRANSLATION_LANGUAGES.some(function (l) { return l.code === code; }))
        return code;
    var displayName = (_d = language === null || language === void 0 ? void 0 : language.displayName) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase();
    if (displayName) {
        var byLabel = TRANSLATION_LANGUAGES.find(function (l) { return l.label.toLowerCase() === displayName; });
        if (byLabel && byLabel.code !== 'en')
            return byLabel.code;
    }
    return fallback;
};
//# sourceMappingURL=translation.js.map