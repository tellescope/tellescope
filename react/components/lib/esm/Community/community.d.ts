import React from "react";
import { CalendarEventRSVP, Forum, ForumPost, PostComment } from "@tellescope/types-client";
import { TitleComponentType, WithForumId, WithPostId, Styled } from "../index";
export declare const RSVPAvatar: ({ rsvp, size, style }: {
    rsvp: CalendarEventRSVP;
    size?: number | undefined;
} & Styled) => JSX.Element;
export declare const ResolvedContent: ({ textContent, htmlContent, style }: {
    textContent: string;
    htmlContent: string;
} & Styled) => JSX.Element;
export declare const PostEditor: ({ existingPost, forumId, onSuccess }: {
    existingPost?: (import("@tellescope/types-models").ForumPost & {
        id: string;
        createdAt: Date;
    }) | undefined;
    onSuccess?: ((post: ForumPost) => void) | undefined;
} & WithForumId) => JSX.Element;
export declare const CreateComment: ({ forumId, postId, onSuccess, threadId, replyTo }: {
    threadId?: string | undefined;
    replyTo?: string | undefined;
    onSuccess?: ((comment: PostComment) => void) | undefined;
} & WithForumId & WithPostId) => JSX.Element;
export declare const PostView: ({ forumId, postId, maxHeightPost, maxHeightComments, redirectLink, onDelete, }: {
    redirectLink?: string | undefined;
    maxHeightComments: React.CSSProperties['maxHeight'];
    maxHeightPost: React.CSSProperties['maxHeight'];
    onDelete: () => void;
} & WithPostId & WithForumId) => JSX.Element;
export declare const PostPreview: ({ post, onClick, }: {
    post: ForumPost;
    onClick?: ((p: ForumPost) => void) | undefined;
}) => JSX.Element;
export declare const ForumView: ({ forumId, maxHeight, redirectLink, TitleComponent, onClickPost, onDelete, }: {
    TitleComponent?: TitleComponentType | undefined;
    maxHeight?: React.CSSProperties['maxHeight'];
    redirectLink?: string | undefined;
    onClickPost?: ((p: ForumPost) => void) | undefined;
    onDelete?: (() => void) | undefined;
} & WithForumId) => JSX.Element;
export declare const ForumsList: ({ forums, onClick, maxHeight }: {
    forums: Forum[];
    onClick?: ((f: Forum) => void) | undefined;
    maxHeight?: React.CSSProperties['maxHeight'];
}) => JSX.Element;
//# sourceMappingURL=community.d.ts.map