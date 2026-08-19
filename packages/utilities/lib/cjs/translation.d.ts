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
export declare const generateBatchTranslationSystemPrompt: (targetLanguageLabel: string) => string;
export declare const encodeTranslationMapForStorage: (map: Record<string, string>) => string;
export declare const decodeTranslationMapFromStorage: (value?: string) => Record<string, string>;
type FormTranslationSourceForm = {
    title?: string;
    displayTitle?: string;
    description?: string;
    thanksMessage?: string;
    htmlThanksMessage?: string;
    customization?: Record<string, unknown>;
};
type FormTranslationSourceField = {
    title?: string;
    placeholder?: string;
    description?: string;
    htmlDescription?: string;
    headerText?: string;
    feedback?: {
        display?: string;
    }[];
    options?: {
        choices?: string[];
        optionDetails?: {
            description?: string;
        }[];
        tableChoices?: {
            label?: string;
            info?: {
                choices?: string[];
            };
        }[];
        customPriceMessage?: string;
    };
};
export declare const collectFormTranslationSourceStrings: (form: FormTranslationSourceForm, fields: FormTranslationSourceField[]) => string[];
export declare const translationLanguageCodeForLanguage: (language?: {
    displayName?: string | undefined;
    iso6391?: string | undefined;
} | undefined, options?: {
    fallback?: TranslationLanguageCode | undefined;
} | undefined) => TranslationLanguageCode;
export {};
//# sourceMappingURL=translation.d.ts.map