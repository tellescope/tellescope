import React, { CSSProperties } from "react";
import { Styled, ImageDimensions, UserAndEnduserSelectorProps } from "@tellescope/react-components";
import { ChatRoom, ChatMessage, UserDisplayInfo, User } from "@tellescope/types-client";
import { UserActivityInfo } from "@tellescope/types-models";
import { APIError, LoadedData, SessionType } from "@tellescope/types-utilities";
import { ActivityOptions, user_display_name } from "@tellescope/utilities";
import { Session, EnduserSession } from "@tellescope/sdk";
export { user_display_name, };
export interface MessagesHeaderProps {
    room?: ChatRoom;
    resolveSenderName?: (room: ChatRoom) => React.ReactNode;
    style?: CSSProperties;
}
interface MessageStyles {
    receivedMessageContainerStyle?: CSSProperties;
    sentMessageContainerStyle?: CSSProperties;
    receivedMessageStyle?: CSSProperties;
    receivedMessageTextStyle?: CSSProperties;
    sentMessageStyle?: CSSProperties;
    sentMessageTextStyle?: CSSProperties;
    sentBgColor?: string;
    sentTextColor?: string;
    receivedBgColor?: string;
    receivedTextColor?: string;
}
interface MessageProps extends MessageStyles {
    message: ChatMessage;
    iconSize?: number;
    imageDimensions?: ImageDimensions;
    showDate?: boolean;
    showName?: boolean;
}
export declare const Message: ({ message, iconSize, sentBgColor, sentTextColor, receivedBgColor, receivedTextColor, sentMessageStyle, receivedMessageStyle, sentMessageTextStyle, receivedMessageTextStyle, imageDimensions, style, showDate, showName, }: MessageProps & Styled) => JSX.Element;
export declare const SecureLinkText: ({ secureName }: {
    secureName: string;
}) => JSX.Element | null;
export declare const MessageAttachments: ({ message, chatUserId, imageDimensions }: {
    message: ChatMessage;
    chatUserId: string;
    imageDimensions?: ImageDimensions | undefined;
}) => JSX.Element | null;
export type MessageTheme = {
    theme?: string;
};
export interface Messages_T extends MessageStyles {
    resolveSenderName?: (room: ChatRoom) => React.ReactNode;
    messages: LoadedData<ChatMessage[]>;
    chatUserId: string;
    headerProps?: MessagesHeaderProps;
    imageDimensions?: ImageDimensions;
    markRead?: boolean;
    showNames?: boolean;
}
/** @deprecated */
export declare const MessagesWithHeader: ({ resolveSenderName, messages, chatUserId, Header, headerProps, style, imageDimensions, showNames, ...messageStyles }: Omit<Messages_T, "markRead"> & Styled & {
    Header?: React.JSXElementConstructor<MessagesHeaderProps> | undefined;
}) => JSX.Element;
export declare const Messages: ({ resolveSenderName, messages, chatUserId, headerProps, style, imageDimensions, markRead, showNames, ...messageStyles }: Messages_T & Styled) => JSX.Element;
export interface ConversationPreviewProps {
    room: ChatRoom;
    displayInfo: {
        [index: string]: UserDisplayInfo;
    };
    onClick?: (room: ChatRoom) => void;
    selected?: boolean;
    style?: CSSProperties;
    selectedStyle?: CSSProperties;
}
export declare const resolve_chat_room_name: (room: ChatRoom, displayInfo: {
    [index: string]: UserDisplayInfo;
}, userType: SessionType, currentUserId: string) => string;
export type PreviewComponentType = React.JSXElementConstructor<ConversationPreviewProps>;
interface SidebarInfo {
    selectedRoom?: string;
    onRoomSelect: (roomId: string) => void;
    style?: CSSProperties;
    selectedItemStyle?: CSSProperties;
    itemStyle?: CSSProperties;
    nameStyle?: CSSProperties;
    PreviewComponent?: PreviewComponentType;
    previewStyle?: CSSProperties;
}
interface ConversationsProps extends SidebarInfo {
    rooms: LoadedData<ChatRoom[]>;
}
export declare const Conversations: ({ rooms, selectedRoom, onRoomSelect, PreviewComponent, style, selectedItemStyle, itemStyle }: ConversationsProps) => JSX.Element;
export declare const EndusersConversations: ({ enduserId, ...p }: SidebarInfo & {
    enduserId: string;
}) => JSX.Element;
export declare const UsersConversations: ({ userId, ...p }: SidebarInfo & {
    userId: string;
}) => JSX.Element;
interface SplitChat_T {
    session: EnduserSession | Session;
    type: SessionType;
}
export declare const SplitChat: ({ session, type, style }: SplitChat_T & Styled) => JSX.Element;
export declare const UserChatSplit: ({ style }: Styled) => JSX.Element;
export declare const EnduserChatSplit: ({ style }: Styled) => JSX.Element;
export declare const UserActiveBadge: ({ user, style, size, activeThresholdMS, inactiveThresholdMS }: {
    user?: UserActivityInfo | undefined;
    size?: number | undefined;
} & ActivityOptions & Styled) => JSX.Element | null;
export declare const AttendeesList: ({ roomId, style, attendeeStyle }: {
    roomId: string;
    attendeeStyle?: React.CSSProperties | undefined;
} & Styled) => JSX.Element | null;
export interface CreateChatRoomProps extends Omit<UserAndEnduserSelectorProps, 'onSelect'> {
    onSuccess?: (c: ChatRoom) => void;
    onError?: (e: APIError) => void;
    roomTitle?: string;
    roomType?: ChatRoom['type'];
    aboutEnduserId?: string;
    limitToUsers?: User[];
    addedUserIds?: string[];
}
export declare const CreateChatRoom: ({ roomTitle: defaultRoomTitle, onSuccess, onError, roomType, aboutEnduserId, addedUserIds, ...props }: CreateChatRoomProps) => JSX.Element;
//# sourceMappingURL=chat.d.ts.map