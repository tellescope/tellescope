/// <reference types="react" />
import { Enduser, FormResponse } from "@tellescope/types-client";
import { FormResponseAnswerAddress, FormResponseValueAnswer } from "@tellescope/types-models";
export declare const AddressDisplay: ({ value }: {
    value: Required<FormResponseAnswerAddress>['value'];
}) => JSX.Element;
export declare const ResponseAnswer: ({ formResponse, fieldId, isHTML, answer: a, printing, onImageClick }: {
    answer: FormResponseValueAnswer;
    formResponse: FormResponse;
    fieldId: string;
    printing?: boolean | undefined;
    onImageClick?: ((args: {
        src: string;
    }) => void) | undefined;
    isHTML?: boolean | undefined;
}) => JSX.Element;
export declare const OrganizationLogo: () => JSX.Element | null;
export declare const ResolveOrganizationLogo: ({ logoURL }: {
    logoURL?: string | undefined;
}) => JSX.Element | null;
interface FormResponse_T {
    enduser?: Enduser;
    onClose?: () => void;
    hideHeader?: boolean;
    response: FormResponse;
    id?: string;
    logoURL?: string;
}
export declare const FormResponseView: ({ logoURL, enduser, onClose, hideHeader, response, id, printing, onImageClick }: FormResponse_T & {
    printing?: boolean | undefined;
    onImageClick?: ((args: {
        src: string;
    }) => void) | undefined;
}) => JSX.Element;
export {};
//# sourceMappingURL=form_responses.d.ts.map