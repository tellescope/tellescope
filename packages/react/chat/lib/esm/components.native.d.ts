/// <reference types="react" />
import { HTMLMessageProps } from './components';
export declare const HTMLMessage: ({ html: htmlUnprocessed, color, selectable }: HTMLMessageProps) => JSX.Element;
interface SendMessage_T {
    roomId: string;
    placeholderText?: string;
    style?: React.CSSProperties;
}
export declare const SendMessage: ({ roomId, placeholderText, style, }: SendMessage_T) => JSX.Element;
export {};
//# sourceMappingURL=components.native.d.ts.map