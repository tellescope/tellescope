// Shared, transport-agnostic translation helpers for the translations framework.
//
// Holds the *pure* parts of AI translation (supported language list + system-prompt builder) so they
// can be reused by the webapp UI and any backend caller. Must stay free of any SDK/DB/React imports —
// only plain types from types-models. Mirrors the ai_summary.ts convention.

import { TranslationLanguageCode } from "@tellescope/types-models"

// Preset list of common languages offered in the translate UI. `code` is the key used under
// translations.<field>.<code>; `label` is the human-readable name passed to the AI prompt.
export const TRANSLATION_LANGUAGES: { code: TranslationLanguageCode, label: string }[] = [
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
]

export const languageLabelForCode = (code: string): string =>
  TRANSLATION_LANGUAGES.find(l => l.code === code)?.label ?? code

export type TranslationPromptOptions = {
  // Set when translating a message draft or template rather than a plain block of text: instructs the
  // model to leave HTML, {{...}} placeholders, and {url}[label] link templates byte-identical.
  preserveTemplateSyntax?: boolean,
}

// Builds the system prompt for translating arbitrary text into the target language. The caller sends
// the source text as the user message and this as the `prompt` (system) to the chat completion endpoint.
export const generateTranslationSystemPrompt = (targetLanguageLabel: string, options?: TranslationPromptOptions): string =>
  `You are a professional medical translator. Translate the user's text into ${targetLanguageLabel}. `
  + `Preserve meaning, names, numbers, dates, and medical terminology. `
  + (options?.preserveTemplateSyntax
    ? (
        `The text is a message draft containing markup that must survive translation exactly as written. `
      + `Translate only the human-readable text. Copy the following character-for-character without translating, `
      + `reordering, reformatting, escaping, or removing them: (1) HTML tags, attributes, and attribute values — `
      + `translate only the visible text between tags; (2) any placeholder in double curly braces, such as `
      + `{{enduser.fname}} or {{forms.abc123.link:Sign Here}}; (3) any link template of the form {url}[label], `
      + `including the square brackets and their contents. Keep the original whitespace, line breaks, and paragraph `
      + `structure. Do not add a greeting, sign-off, note, explanation, or markdown code fences. `
      )
    : ''
  )
  + `Respond with only the translated text and nothing else.`

// Builds the system prompt for translating a JSON batch of strings (used by form translation maps,
// where many independent display strings are translated in one call). The caller sends
// JSON.stringify(string[]) as the user message; the model must return only a JSON array of the same
// length and order, each element the translation of its counterpart.
export const generateBatchTranslationSystemPrompt = (targetLanguageLabel: string): string =>
  `You are a professional medical translator. The user's message is a JSON array of independent English strings `
  + `from a healthcare form. Translate each string into ${targetLanguageLabel}. `
  + `Preserve meaning, names, numbers, dates, and medical terminology. `
  + `Some strings contain markup that must survive translation exactly as written. Translate only the `
  + `human-readable text. Copy the following character-for-character without translating, reordering, `
  + `reformatting, escaping, or removing them: (1) HTML tags, attributes, and attribute values — translate only `
  + `the visible text between tags; (2) any placeholder in double curly braces, such as {{enduser.fname}}; `
  + `(3) any link template of the form {url}[label], including the square brackets and their contents. `
  + `Keep the original whitespace and line breaks within each string. `
  + `Respond with only a valid JSON array of strings — the same length and order as the input, where each `
  + `element is the translation of the input element at the same index. No greeting, explanation, or markdown code fences.`

// Storage encoding for translation maps kept in Configuration.value. That field's validator runs
// sanitize_html (allowedTags: []), which strips HTML tags outright and entity-encodes & < >, corrupting
// raw JSON that contains translated HTML. JSON.stringify never emits & < > as structural characters, so
// replacing every occurrence with its \uXXXX escape yields equivalent JSON with none of the characters
// the sanitizer touches; JSON.parse restores the originals exactly. (Removing escapeHTML from the shared
// configurations validator was rejected — it would loosen sanitization for existing integration configs.)
export const encodeTranslationMapForStorage = (map: Record<string, string>): string =>
  JSON.stringify(map).replace(/[&<>]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)

export const decodeTranslationMapFromStorage = (value?: string): Record<string, string> => {
  try {
    const parsed = JSON.parse(value || '{}')
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {}
  } catch { return {} }
}

// Structural shapes so both types-models and types-client records fit without importing either
type FormTranslationSourceForm = {
  title?: string,
  displayTitle?: string,
  description?: string,
  thanksMessage?: string,
  htmlThanksMessage?: string,
  customization?: Record<string, unknown>,
}
type FormTranslationSourceField = {
  title?: string,
  placeholder?: string,
  description?: string,
  htmlDescription?: string,
  headerText?: string,
  feedback?: { display?: string }[],
  options?: {
    choices?: string[],
    optionDetails?: { description?: string }[],
    tableChoices?: { label?: string, info?: { choices?: string[] } }[],
    customPriceMessage?: string,
  },
}

// Collects every English display string on a form + its fields that should be included in an
// AI-generated translation map. Pure and deduped; empty/whitespace-only strings are dropped.
// UI chrome strings (Next/Submit/validation text) live in the react components package
// (FORM_CHROME_ENGLISH_STRINGS) — callers append those separately.
export const collectFormTranslationSourceStrings = (
  form: FormTranslationSourceForm,
  fields: FormTranslationSourceField[],
): string[] => {
  const strings: (string | undefined)[] = [
    form.title,
    form.displayTitle,
    form.description,
    form.thanksMessage,
    form.htmlThanksMessage,
  ]

  // every string-valued customization field is display text (publicFormHTMLDescription, public*Label, ...)
  for (const value of Object.values(form.customization ?? {})) {
    if (typeof value === 'string') strings.push(value)
  }

  for (const field of fields) {
    strings.push(field.title, field.placeholder, field.description, field.htmlDescription, field.headerText)
    strings.push(...(field.options?.choices ?? []))
    strings.push(field.options?.customPriceMessage)
    for (const detail of field.options?.optionDetails ?? []) strings.push(detail.description)
    for (const tableChoice of field.options?.tableChoices ?? []) {
      strings.push(tableChoice.label, ...(tableChoice.info?.choices ?? []))
    }
    for (const feedback of field.feedback ?? []) strings.push(feedback.display)
  }

  const deduped = new Set<string>()
  for (const s of strings) {
    const trimmed = s?.trim()
    if (trimmed) deduped.add(s!)
  }
  return Array.from(deduped)
}

// Resolves an Enduser's language preference to one of TRANSLATION_LANGUAGES, for defaulting the target
// language of a translation. Handles the shapes that exist in real data: bare codes ('es'), regional codes
// ('es-ES'), and records with an empty iso6391 but a populated displayName ('Spanish').
//
// Drafts are assumed to be written in English, so a preference that resolves to English falls through to
// the fallback (Spanish) — translating English into English is never the intent.
export const translationLanguageCodeForLanguage = (
  language?: { displayName?: string, iso6391?: string },
  options?: { fallback?: TranslationLanguageCode },
): TranslationLanguageCode => {
  const fallback = options?.fallback ?? 'es'

  const code = language?.iso6391?.split('-')[0]?.trim().toLowerCase()
  if (code && code !== 'en' && TRANSLATION_LANGUAGES.some(l => l.code === code)) return code

  const displayName = language?.displayName?.trim().toLowerCase()
  if (displayName) {
    const byLabel = TRANSLATION_LANGUAGES.find(l => l.label.toLowerCase() === displayName)
    if (byLabel && byLabel.code !== 'en') return byLabel.code
  }

  return fallback
}
