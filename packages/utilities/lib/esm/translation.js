// Shared, transport-agnostic translation helpers for the translations framework.
//
// Holds the *pure* parts of AI translation (supported language list + system-prompt builder) so they
// can be reused by the webapp UI and any backend caller. Must stay free of any SDK/DB/React imports —
// only plain types from types-models. Mirrors the ai_summary.ts convention.
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
export var generateTranslationSystemPrompt = function (targetLanguageLabel) {
    return "You are a professional medical translator. Translate the user's text into ".concat(targetLanguageLabel, ". ")
        + "Preserve meaning, names, numbers, dates, and medical terminology. "
        + "Respond with only the translated text and nothing else.";
};
//# sourceMappingURL=translation.js.map