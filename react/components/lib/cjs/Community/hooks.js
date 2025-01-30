"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePostLiking = exports.useCommentLiking = exports.useRSVPActions = void 0;
var react_1 = require("react");
var index_1 = require("../index");
var useRSVPActions = function (event) {
    var session = (0, index_1.useResolvedSession)();
    var _a = (0, index_1.useCalendarEvents)({ dontFetch: true }), updateCalendarEvent = _a[1].updateLocalElement;
    (0, index_1.useCalendarEventRSVPs)(); // load rsvps, likely including recent ones for this event
    var _b = (0, index_1.useCalendarEventRSVPs)({ loadFilter: { creator: session.userInfo.id } }), _c = _b[1], createRSVP = _c.createElement, deleteRSVP = _c.removeElement, filtered = _c.filtered; // ensure own RSVPs are loaded
    var eventRSVPsLoading = filtered(function (e) { return e.eventId === event.id; });
    var rsvps = (0, index_1.value_is_loaded)(eventRSVPsLoading) ? eventRSVPsLoading.value : [];
    var selfRSVP = rsvps.find(function (r) { return r.creator === session.userInfo.id; });
    var addRsvp = (0, react_1.useCallback)(function () { return (createRSVP({ eventId: event.id })
        .then(function () { var _a; return updateCalendarEvent(event.id, { numRSVPs: ((_a = event.numRSVPs) !== null && _a !== void 0 ? _a : 0) + 1 }); })
        .catch(console.error)); }, [event, createRSVP, updateCalendarEvent]);
    var removeRsvp = (0, react_1.useCallback)(function () {
        if (!selfRSVP)
            return new Promise(function (r) { return r(); });
        return deleteRSVP(selfRSVP.id)
            .then(function () { var _a; return updateCalendarEvent(event.id, { numRSVPs: ((_a = event.numRSVPs) !== null && _a !== void 0 ? _a : 0) - 1 }); })
            .catch(console.error);
    }, [event, selfRSVP, deleteRSVP, updateCalendarEvent]);
    return {
        rsvps: rsvps,
        selfRSVP: selfRSVP,
        addRsvp: addRsvp,
        removeRsvp: removeRsvp,
    };
};
exports.useRSVPActions = useRSVPActions;
var useCommentLiking = function (_a) {
    var forumId = _a.forumId, postId = _a.postId, commentId = _a.commentId;
    var session = (0, index_1.useResolvedSession)();
    var _b = (0, index_1.usePostComments)({ dontFetch: true }), _c = _b[1], updateLocalComment = _c.updateLocalElement, findComment = _c.findById;
    var _d = (0, index_1.useCommentLikes)({ loadFilter: { forumId: forumId } }), likesLoading = _d[0], _e = _d[1], createLike = _e.createElement, deleteLike = _e.removeElement, addLocalLike = _e.addLocalElement;
    var comment = findComment(commentId);
    var existingLike = ((0, index_1.value_is_loaded)(likesLoading)
        ? likesLoading.value.find(function (l) { return l.creator === session.userInfo.id && l.commentId === commentId; })
        : null);
    var status = (existingLike !== null
        ? existingLike
            ? 'liked'
            : 'unliked'
        : 'loading');
    var likeComment = (0, react_1.useCallback)(function () {
        if (status === 'loading' || status === 'liked')
            return;
        createLike({ forumId: forumId, commentId: commentId, postId: postId })
            .then(function () {
            var _a;
            if (!comment)
                return;
            updateLocalComment(comment.id, { numLikes: ((_a = comment.numLikes) !== null && _a !== void 0 ? _a : 0) + 1 });
        })
            .catch(function (err) {
            if (err.message === 'This post has already been liked') {
                // @ts-ignore // add a placeholder for the local like which should switch display to liked
                addLocalLike({ creator: session.userInfo.id, forumId: forumId, postId: postId });
            }
        });
    }, [status, addLocalLike, session, forumId, postId, createLike, comment, updateLocalComment]);
    var unlikeComment = (0, react_1.useCallback)(function () {
        if (status === 'loading' || status === 'unliked' || !existingLike)
            return;
        deleteLike(existingLike.id)
            .then(function () {
            var _a;
            if (!comment)
                return;
            updateLocalComment(comment.id, { numLikes: ((_a = comment.numLikes) !== null && _a !== void 0 ? _a : 1) - 1 });
        })
            .catch(console.error);
    }, [session, status, existingLike, forumId, comment, updateLocalComment]);
    var toggleLike = (0, react_1.useCallback)(function () {
        if (status === 'loading')
            return;
        if (status === 'liked')
            return unlikeComment();
        return likeComment();
    }, [likeComment, unlikeComment, status]);
    return {
        status: status,
        toggleLike: toggleLike,
        likeComment: likeComment,
        unlikeComment: unlikeComment,
    };
};
exports.useCommentLiking = useCommentLiking;
var usePostLiking = function (_a) {
    var forumId = _a.forumId, postId = _a.postId;
    var session = (0, index_1.useResolvedSession)();
    var _b = (0, index_1.useForumPosts)({ dontFetch: true }), _c = _b[1], updateLocalPost = _c.updateLocalElement, findPost = _c.findById;
    var _d = (0, index_1.usePostLikes)({ loadFilter: { forumId: forumId } }), likesLoading = _d[0], _e = _d[1], createLike = _e.createElement, addLocalLike = _e.addLocalElement, removeLocalLikes = _e.removeLocalElements;
    var post = findPost(postId);
    var existingLike = ((0, index_1.value_is_loaded)(likesLoading)
        ? likesLoading.value.find(function (l) { return l.creator === session.userInfo.id && l.postId === postId; })
        : null);
    var status = (existingLike !== null
        ? existingLike
            ? 'liked'
            : 'unliked'
        : 'loading');
    var likePost = (0, react_1.useCallback)(function () {
        if (status === 'loading' || status === 'liked')
            return;
        createLike({ forumId: forumId, postId: postId })
            .then(function () {
            if (!post)
                return;
            updateLocalPost(post.id, { numLikes: post.numLikes + 1 });
        })
            .catch(function (err) {
            if (err.message === 'This post has already been liked') {
                // @ts-ignore // add a placeholder for the local like which should switch display to liked
                addLocalLike({ creator: session.userInfo.id, forumId: forumId, postId: postId });
            }
        });
    }, [status, addLocalLike, session, forumId, postId, createLike, post, updateLocalPost]);
    var unlikePost = (0, react_1.useCallback)(function () {
        if (status === 'loading' || status === 'unliked' || !existingLike)
            return;
        session.api.post_likes.unlike_post({ postId: postId, forumId: forumId })
            .then(function () {
            if (!post)
                return;
            updateLocalPost(post.id, { numLikes: post.numLikes - 1 });
            removeLocalLikes([existingLike.id]);
        })
            .catch(console.error);
    }, [session, status, existingLike, postId, forumId, post, updateLocalPost, removeLocalLikes]);
    var toggleLike = (0, react_1.useCallback)(function () {
        if (status === 'loading')
            return;
        if (status === 'liked')
            return unlikePost();
        return likePost();
    }, [likePost, unlikePost, status]);
    return {
        status: status,
        toggleLike: toggleLike,
        likePost: likePost,
        unlikePost: unlikePost,
    };
};
exports.usePostLiking = usePostLiking;
//# sourceMappingURL=hooks.js.map