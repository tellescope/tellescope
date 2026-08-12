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
