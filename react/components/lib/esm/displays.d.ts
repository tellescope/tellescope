import React from "react";
import { AvatarProps, Styled } from "./mui";
import { ImageDimensions } from "./layout";
import { APIErrorHandler } from "@tellescope/types-utilities";
export type LoadedFile = {
    downloadURL: string;
    name: string;
};
export declare const useFileForSecureName: ({ secureName, onError, cacheKey, onLoad, preferInBrowser, }: {
    secureName: string;
    onError?: APIErrorHandler | undefined;
    cacheKey?: string | undefined;
    onLoad?: ((f: LoadedFile) => void) | undefined;
    preferInBrowser?: boolean | undefined;
}) => string;
export declare const SecureImage: ({ secureName, placeholder, onImageClick, ...props }: {
    placeholder?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    secureName: string;
    alt?: string | undefined;
    onImageClick?: ((args: {
        src: string;
    }) => void) | undefined;
} & ImageDimensions & Styled) => JSX.Element | null;
export declare const SecureVideo: ({ secureName, placeholder, ...props }: {
    placeholder?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
    secureName: string;
    alt?: string | undefined;
} & ImageDimensions) => JSX.Element | null;
export interface DisplayPictureProps extends AvatarProps {
    user?: {
        id: string;
        fname?: string;
        lname?: string;
        avatar?: string;
        displayName?: string;
    } | null;
    onError?: APIErrorHandler;
    alt?: string;
}
export declare const DisplayPicture: ({ user, onError, ...avatarProps }: DisplayPictureProps & Styled) => JSX.Element;
export declare const elapsed_time_display_string: (date: Date) => string;
export declare const useEnduserForId: (enduserId: string) => (import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}) | null | undefined;
export declare const useUserForId: (userId: string) => (import("@tellescope/types-models").User & {
    id: string;
    createdAt: Date;
}) | undefined;
export declare const DisplayPictureForSelf: (props: Styled) => JSX.Element;
export declare const DisplayPictureForEnduser: ({ id, ...props }: Omit<DisplayPictureProps, "user"> & {
    id: string;
}) => JSX.Element;
export declare const DisplayPictureForUser: ({ id, ...props }: Omit<DisplayPictureProps, "user"> & {
    id: string;
}) => JSX.Element;
export declare const ResolveDisplayPicture: ({ type, ...props }: Omit<DisplayPictureProps, "user"> & {
    id: string;
    type: 'user' | 'enduser';
}) => JSX.Element;
export declare const DisplayNameForEnduser: ({ id, ...props }: Styled & {
    id: string;
}) => JSX.Element | null;
export declare const DisplayNameForUser: ({ id, ...props }: Styled & {
    id: string;
}) => JSX.Element | null;
export declare const ResolveDisplayName: ({ type, ...props }: Styled & {
    id: string;
    type: 'user' | 'enduser';
}) => JSX.Element;
export declare const useDisplayInfoForSenderId: (id: string) => (import("@tellescope/types-models").Enduser & {
    id: string;
    createdAt: Date;
}) | (import("@tellescope/types-models").User & {
    id: string;
    createdAt: Date;
}) | null | undefined;
//# sourceMappingURL=displays.d.ts.map