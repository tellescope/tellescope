import { TranslationLanguageCode } from "@tellescope/types-models";
export declare const TRANSLATION_LANGUAGES: {
    code: TranslationLanguageCode;
    label: string;
}[];
export declare const languageLabelForCode: (code: string) => string;
export type TranslationPromptOptions = {
    preserveTemplateSyntax?: boolean;
};
export declare const generateTranslationSystemPrompt: (targetLanguageLabel: string, options?: TranslationPromptOptions) => string;
export declare const translationLanguageCodeForLanguage: (language?: {
    displayName?: string | undefined;
    iso6391?: string | undefined;
} | undefined, options?: {
    fallback?: TranslationLanguageCode | undefined;
} | undefined) => TranslationLanguageCode;
//# sourceMappingURL=translation.d.ts.map