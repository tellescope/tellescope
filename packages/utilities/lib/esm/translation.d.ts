import { TranslationLanguageCode } from "@tellescope/types-models";
export declare const TRANSLATION_LANGUAGES: {
    code: TranslationLanguageCode;
    label: string;
}[];
export declare const languageLabelForCode: (code: string) => string;
export declare const generateTranslationSystemPrompt: (targetLanguageLabel: string) => string;
//# sourceMappingURL=translation.d.ts.map