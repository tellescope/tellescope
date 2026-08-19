import { Form, AppointmentBookingPage } from "@tellescope/types-client";
export declare const FORM_CHROME_ENGLISH_STRINGS: string[];
export declare const form_display_text_for_language: (form: (Pick<Form, 'language'> & {
    dynamicTranslations?: Record<string, string>;
}) | undefined, text: string, placeholder?: string) => string;
export declare const booking_display_text_for_language: (bookingPage: Pick<AppointmentBookingPage, 'language'> | undefined, text: string, placeholder?: string) => string;
//# sourceMappingURL=localization.d.ts.map