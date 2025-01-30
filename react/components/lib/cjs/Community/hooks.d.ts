import { CalendarEvent } from "@tellescope/types-client";
import { PostLikeStatus, WithForumId, WithPostId } from "./types";
export declare const useRSVPActions: (event: CalendarEvent) => {
    rsvps: (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    })[];
    selfRSVP: (import("@tellescope/types-models").CalendarEventRSVP & {
        id: string;
        createdAt: Date;
    }) | undefined;
    addRsvp: () => Promise<void>;
    removeRsvp: () => Promise<void>;
};
export declare const useCommentLiking: ({ forumId, postId, commentId }: WithForumId & WithPostId & {
    commentId: string;
}) => {
    status: PostLikeStatus;
    toggleLike: () => void;
    likeComment: () => void;
    unlikeComment: () => void;
};
export declare const usePostLiking: ({ forumId, postId }: WithForumId & WithPostId) => {
    status: PostLikeStatus;
    toggleLike: () => void;
    likePost: () => void;
    unlikePost: () => void;
};
//# sourceMappingURL=hooks.d.ts.map