import React, { CSSProperties } from "react";
import { ChatMessage } from "@tellescope/types-client";
import { ChatAttachment } from "@tellescope/types-models";
export interface HTMLMessageProps {
    html: string;
    color?: string;
    selectable?: boolean;
}
export declare const HTMLMessage: ({ html }: HTMLMessageProps) => JSX.Element;
interface SendMessage_T {
    roomId: string;
    onNewMessage?: (m: ChatMessage) => void;
    placeholderText?: string;
    Icon?: React.ElementType<any>;
    style?: CSSProperties;
    sendOnEnterPress?: boolean;
    multiline?: boolean;
    maxRows?: number;
    size?: 'small';
    getAttachments?: () => Promise<ChatAttachment[]>;
}
export declare const SendMessage: ({ roomId, Icon, onNewMessage, placeholderText, style, sendOnEnterPress, multiline, maxRows, size, getAttachments }: SendMessage_T) => JSX.Element;
export {};
//# sourceMappingURL=components.d.ts.map