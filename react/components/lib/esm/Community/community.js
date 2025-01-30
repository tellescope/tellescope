var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { HoverPaper, LoadingLinear, ScrollingList, useForumPosts, useForums, Link, LabeledIconButton, usePostComments, Form, SubmitButton, useModalIconButton, IconModal, ResolveDisplayPicture, elapsed_time_display_string, ResolveDisplayName, useResolvedSession, DeleteWithConfimrationIcon, DisplayPicture, } from "../index";
import { Divider, Grid, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import { usePostLiking, } from "./hooks";
import { remove_script_tags, truncate_string, user_is_admin } from "@tellescope/utilities";
import LikeIcon from "@mui/icons-material/ThumbUp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
export var RSVPAvatar = function (_a) {
    var rsvp = _a.rsvp, _b = _a.size, size = _b === void 0 ? 20 : _b, style = _a.style;
    return (_jsx(DisplayPicture, { size: size, style: style, letters: rsvp.avatar ? undefined : rsvp.displayName[0], user: {
            id: rsvp.creator,
            avatar: rsvp.avatar,
        } }));
};
export var ResolvedContent = function (_a) {
    var textContent = _a.textContent, htmlContent = _a.htmlContent, style = _a.style;
    if (htmlContent) {
        return (_jsx("div", { style: style, dangerouslySetInnerHTML: {
                __html: remove_script_tags(htmlContent),
            } }));
    }
    return _jsx(Typography, { children: textContent });
};
var formFieldStyle = {
    width: '100%',
    marginBottom: 8,
};
export var PostEditor = function (_a) {
    var _b, _c;
    var existingPost = _a.existingPost, forumId = _a.forumId, onSuccess = _a.onSuccess;
    var _d = useForumPosts({ dontFetch: true }), _e = _d[1], createPost = _e.createElement, updatePost = _e.updateElement;
    var _f = useState((_b = existingPost === null || existingPost === void 0 ? void 0 : existingPost.title) !== null && _b !== void 0 ? _b : ''), title = _f[0], setTitle = _f[1];
    var _g = useState((_c = existingPost === null || existingPost === void 0 ? void 0 : existingPost.textContent) !== null && _c !== void 0 ? _c : ''), textContent = _g[0], setTextContent = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var handleSubmit = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var post, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setError('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (existingPost
                            ? updatePost(existingPost.id, { title: title, textContent: textContent })
                            : createPost({ title: title, textContent: textContent, forumId: forumId, htmlContent: '' }))];
                case 2:
                    post = _b.sent();
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(post);
                    setTitle('');
                    setTextContent('');
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    setError((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _a !== void 0 ? _a : err_1.toString());
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [title, textContent, forumId, onSuccess, createPost]);
    return (_jsx(Form, __assign({ onSubmit: handleSubmit, style: { width: '100%' } }, { children: _jsxs(Grid, __assign({ container: true, direction: "column", alignItems: "center" }, { children: [_jsx(Typography, __assign({ style: __assign(__assign({}, formFieldStyle), { fontSize: 18, fontWeight: 600 }) }, { children: "Add Post" })), _jsx(TextField, { autoFocus: true, label: "Title", required: true, style: formFieldStyle, value: title, onChange: function (e) { return setTitle(e.target.value); } }), _jsx(TextField, { label: "Content", required: true, multiline: true, minRows: 4, maxRows: 4, style: formFieldStyle, value: textContent, onChange: function (e) { return setTextContent(e.target.value); } }), _jsx(SubmitButton, { submitText: "Add Post", submittingText: "Posting...", disabled: !(title && textContent)
                        || (existingPost && title === existingPost.title && textContent === existingPost.textContent), style: __assign({ width: '100%' }, formFieldStyle) }), _jsx(Typography, __assign({ color: "error", style: formFieldStyle }, { children: error }))] })) })));
};
export var CreateComment = function (_a) {
    var forumId = _a.forumId, postId = _a.postId, onSuccess = _a.onSuccess, threadId = _a.threadId, replyTo = _a.replyTo;
    var _b = usePostComments({ dontFetch: true }), createComment = _b[1].createElement;
    var _c = useForumPosts({ dontFetch: true }), _d = _c[1], findPost = _d.findById, updateLocalPost = _d.updateLocalElement;
    var post = findPost(postId);
    var _e = useState(''), textContent = _e[0], setTextContent = _e[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    var _g = useState(false), submitting = _g[0], setSubmitting = _g[1];
    var handleSubmit = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var comment, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setError('');
                    setSubmitting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, createComment({ textContent: textContent, forumId: forumId, postId: postId, htmlContent: '', threadId: threadId, replyTo: replyTo || threadId })];
                case 2:
                    comment = _b.sent();
                    setTextContent('');
                    if (post) {
                        updateLocalPost(post.id, { numComments: post.numComments + 1 });
                    }
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(comment);
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _b.sent();
                    setError((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.message) !== null && _a !== void 0 ? _a : err_2.toString());
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [textContent, forumId, postId, post, updateLocalPost, onSuccess, createComment]);
    return (_jsx(Form, __assign({ onSubmit: handleSubmit, style: formFieldStyle }, { children: _jsxs(Grid, __assign({ container: true }, { children: [_jsx(Typography, __assign({ style: __assign(__assign({}, formFieldStyle), { fontSize: 16, fontWeight: 600 }) }, { children: "Add Comment" })), _jsx(TextField, { label: "Comment", placeholder: "Enter a comment...", required: true, multiline: true, style: formFieldStyle, size: "small", minRows: 3, maxRows: 3, value: textContent, onChange: function (e) { return setTextContent(e.target.value); } }), _jsxs(Grid, __assign({ container: true, wrap: "nowrap", justifyContent: "space-between" }, { children: [_jsx(Grid, __assign({ container: true }, { children: _jsx(Typography, __assign({ color: "error", style: formFieldStyle }, { children: error })) })), _jsx(SubmitButton, { submitText: "Post", submittingText: "Post", submitting: submitting, style: __assign(__assign({}, formFieldStyle), { width: 110 }), disabled: !(textContent) })] }))] })) })));
};
var POST_MAX_WIDTH = '700px';
export var PostView = function (_a) {
    var forumId = _a.forumId, postId = _a.postId, maxHeightPost = _a.maxHeightPost, maxHeightComments = _a.maxHeightComments, redirectLink = _a.redirectLink, onDelete = _a.onDelete;
    var session = useResolvedSession();
    var editPostProps = useModalIconButton({ Icon: EditIcon, label: "Edit Post" });
    var _b = useForumPosts({ loadFilter: { forumId: forumId } }), _c = _b[1], findPost = _c.findById, deletePost = _c.removeElement;
    var _d = usePostComments({ loadFilter: { forumId: forumId, postId: postId } }), _e = _d[1], filtered = _e.filtered, doneLoading = _e.doneLoading, loadMore = _e.loadMore;
    var post = findPost(postId);
    var commentsLoading = filtered(function (c) { return c.forumId === forumId && c.postId === postId; });
    if (post === null)
        return (_jsxs(_Fragment, { children: [_jsx(Typography, { children: "This post has been deleted" }), redirectLink && _jsx(Link, __assign({ to: redirectLink }, { children: "Go back to Community" }))] }));
    if (post === undefined)
        return _jsx(LinearProgress, {});
    return (_jsxs(Grid, __assign({ container: true, direction: "column", wrap: "nowrap" }, { children: [_jsxs(Grid, __assign({ container: true, direction: "column", wrap: "nowrap", style: {
                    maxHeight: maxHeightPost,
                    overflowY: 'auto',
                    maxWidth: POST_MAX_WIDTH
                } }, { children: [_jsxs(Grid, __assign({ container: true, alignItems: "center", justifyContent: "space-between" }, { children: [_jsx(Typography, __assign({ style: { fontSize: 20, fontWeight: 600 } }, { children: post.title })), (session.type === 'user' || post.creator === session.userInfo.id) &&
                                _jsx(Grid, __assign({ item: true }, { children: _jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [_jsx(IconModal, __assign({}, editPostProps, { children: _jsx(PostEditor, { existingPost: post, forumId: post.forumId, onSuccess: function () { return editPostProps.setOpen(false); } }) })), _jsx(DeleteWithConfimrationIcon, { modelName: "Post", title: "Delete Post", description: "Do you wish to permanently delete this post?", action: function () { return deletePost(post.id).then(onDelete).catch(console.error); } })] })) }))] })), _jsx(Divider, { flexItem: true, sx: { mb: 1 } }), _jsx(ResolvedContent, __assign({}, post)), _jsx(Divider, { flexItem: true, sx: { my: 1 } })] })), _jsxs(Grid, __assign({ container: true, direction: "column", style: { maxWidth: POST_MAX_WIDTH } }, { children: [_jsx(Grid, __assign({ item: true, justifyContent: "flex-start", style: { marginTop: 15, width: '100%' } }, { children: _jsx(CreateComment, { forumId: forumId, postId: postId }) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(LoadingLinear, { data: commentsLoading, render: function (comments) { return (_jsx(ScrollingList, { items: comments, maxHeight: maxHeightComments, doneLoading: doneLoading, loadMore: loadMore, title: "Comments", emptyText: "Leave the first comment!", TitleComponent: function (_a) {
                                    var title = _a.title;
                                    return (_jsx(Grid, __assign({ container: true }, { children: _jsx(Typography, __assign({ style: { fontWeight: 600, fontSize: 18 } }, { children: title })) })));
                                }, Item: function (_a) {
                                    var comment = _a.item;
                                    return (_jsx(Paper, __assign({ elevation: 3, sx: { padding: 1, py: 2, marginBottom: 1, maxWidth: POST_MAX_WIDTH } }, { children: _jsxs(Grid, __assign({ container: true, direction: "column", wrap: "nowrap" }, { children: [_jsxs(Grid, __assign({ container: true, alignItems: "center", wrap: "nowrap" }, { children: [_jsx(ResolveDisplayPicture, __assign({}, comment.postedBy, { size: 25 })), _jsxs(Grid, __assign({ container: true, direction: "column", justifyContent: "center", style: { marginLeft: 8 } }, { children: [_jsx(ResolveDisplayName, __assign({}, comment.postedBy, { style: { fontSize: 12 } })), _jsx(Typography, __assign({ sx: { fontSize: 11, opacity: .75 } }, { children: elapsed_time_display_string(new Date(comment.createdAt)) }))] }))] })), _jsx(Grid, __assign({ item: true, wrap: "nowrap", style: { marginTop: 4 } }, { children: _jsx(ResolvedContent, __assign({}, comment, { style: { fontSize: 14, wordWrap: 'break-word' } })) }))] })) })));
                                } })); } }) }))] }))] })));
};
export var PostPreview = function (_a) {
    var post = _a.post, onClick = _a.onClick;
    var _b = usePostLiking({ postId: post.id, forumId: post.forumId }), status = _b.status, toggleLike = _b.toggleLike;
    var underlineTextSX = {
        cursor: onClick ? 'pointer' : undefined,
        '&:hover': {
            textDecoration: onClick ? 'underline' : undefined,
        }
    };
    return (_jsxs(Grid, __assign({ container: true, direction: "column", sx: {
            p: {
                xs: 1,
                md: 3,
            }
        } }, { children: [_jsxs(Grid, __assign({ item: true, onClick: function () { return onClick === null || onClick === void 0 ? void 0 : onClick(post); } }, { children: [_jsxs(Grid, __assign({ container: true, wrap: "nowrap" }, { children: [_jsx(ResolveDisplayPicture, __assign({}, post.postedBy)), _jsxs(Grid, __assign({ container: true, direction: "column", justifyContent: "center", style: { marginLeft: 8 } }, { children: [_jsx(Grid, __assign({ item: true }, { children: _jsx(ResolveDisplayName, __assign({}, post.postedBy, { style: { fontSize: 14, fontWeight: 600 } })) })), _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ sx: { fontSize: 12, opacity: .75 } }, { children: elapsed_time_display_string(new Date(post.createdAt)) })) }))] }))] })), _jsxs(Grid, __assign({ item: true, sx: __assign({ my: 1 }, underlineTextSX) }, { children: [_jsx(Typography, __assign({ style: { fontWeight: 'bold', fontSize: 18 } }, { children: post.title })), _jsx(Typography, __assign({ noWrap: true }, { children: _jsx(ResolvedContent, __assign({ style: { fontSize: 15, maxHeight: 100 } }, post, { textContent: truncate_string(post.textContent, { length: 200, showEllipsis: true }) })) }))] }))] })), _jsxs(Grid, __assign({ container: true }, { children: [_jsxs(Grid, __assign({ container: true, alignItems: "center", style: { width: '64px' } }, { children: [_jsx(LabeledIconButton, { disabled: status === 'loading', Icon: LikeIcon, color: status === 'liked' ? 'primary' : 'inherit', onClick: toggleLike, size: 20, label: status === 'liked' ? 'Unlike' : "Like" }), _jsxs(Typography, __assign({ component: "span" }, { children: ["(", post.numLikes, ")"] }))] })), _jsxs(Grid, __assign({ container: true, alignItems: "center", onClick: function () { return onClick === null || onClick === void 0 ? void 0 : onClick(post); }, sx: {
                            width: '64px',
                            cursor: onClick ? 'pointer' : undefined,
                            '&:hover': {
                                textDecoration: onClick ? 'underline' : undefined,
                            }
                        } }, { children: [_jsx(ChatBubbleOutlineIcon, { style: { fontSize: 20, marginRight: 5 } }), _jsxs(Typography, __assign({ component: "span" }, { children: ["(", post.numComments, ")"] }))] }))] }))] })));
};
export var ForumView = function (_a) {
    var forumId = _a.forumId, maxHeight = _a.maxHeight, redirectLink = _a.redirectLink, TitleComponent = _a.TitleComponent, onClickPost = _a.onClickPost, onDelete = _a.onDelete;
    var session = useResolvedSession();
    var _b = useForums(), _c = _b[1], findForum = _c.findById, deleteForum = _c.removeElement;
    var _d = useForumPosts({ loadFilter: { forumId: forumId } }), _e = _d[1], filtered = _e.filtered, doneLoading = _e.doneLoading, loadMore = _e.loadMore;
    var postsLoading = filtered(function (p) { return p.forumId === forumId; });
    var forum = findForum(forumId);
    var DefaultPostsTitleComponent = function (_a) {
        var title = _a.title, titleStyle = _a.titleStyle;
        var addPostProps = useModalIconButton({
            Icon: AddCircleIcon,
            label: "Add Post"
        });
        return (_jsxs(Grid, __assign({ container: true, alignItems: "center" }, { children: [_jsx(Typography, __assign({ style: __assign(__assign({}, titleStyle), { marginRight: 3 }) }, { children: title })), _jsx(IconModal, __assign({}, addPostProps, { children: _jsx(PostEditor, { forumId: forumId, onSuccess: function () { return addPostProps.setOpen(false); } }) })), user_is_admin(__assign(__assign({}, session.userInfo), { type: session.type })) &&
                    _jsx(DeleteWithConfimrationIcon, { modelName: "forum", title: "Delete Forum", description: "This will delete all of the posts, comments, etc. within the forum and cannot be reversed", action: function () { return deleteForum(forumId); }, typeToConfirm: forum === null || forum === void 0 ? void 0 : forum.title, onSuccess: onDelete })] })));
    };
    if (forum === null)
        return (_jsxs(_Fragment, { children: [_jsx(Typography, { children: "This forum has been deleted" }), redirectLink && _jsx(Link, __assign({ to: redirectLink }, { children: "Go back to Community" }))] }));
    if (forum === undefined)
        return _jsx(LinearProgress, {});
    return (_jsx(LoadingLinear, { data: postsLoading, render: function (posts) { return (_jsx(ScrollingList, { items: posts, maxHeight: maxHeight, doneLoading: doneLoading, loadMore: loadMore, title: forum.title, emptyText: "Create the first post to start a discussion.", Item: function (_a) {
                var item = _a.item;
                return (_jsx(Paper, __assign({ elevation: 2, sx: { padding: 1, py: 2, marginBottom: 1 } }, { children: _jsx(PostPreview, { post: item, onClick: onClickPost }) })));
            }, TitleComponent: TitleComponent !== null && TitleComponent !== void 0 ? TitleComponent : DefaultPostsTitleComponent })); } }));
};
// used in both user app and patient portal
export var ForumsList = function (_a) {
    var forums = _a.forums, onClick = _a.onClick, maxHeight = _a.maxHeight;
    var _b = useForums(), _c = _b[1], doneLoading = _c.doneLoading, loadMore = _c.loadMore;
    return (_jsx(ScrollingList, { items: forums, maxHeight: maxHeight, doneLoading: doneLoading, loadMore: loadMore, title: "Forums", emptyText: "There are no forums in this community yet. Please check back later.", Item: function (_a) {
            var forum = _a.item;
            return (_jsx(HoverPaper, __assign({ elevation: 2, sx: { padding: 1, py: 2, marginBottom: 1, cursor: 'pointer' }, onClick: function () { return onClick === null || onClick === void 0 ? void 0 : onClick(forum); } }, { children: _jsx(Grid, __assign({ container: true, direction: "column" }, { children: _jsx(Grid, __assign({ item: true }, { children: _jsx(Typography, __assign({ style: { fontWeight: 'bold', fontSize: 16 } }, { children: forum.title })) })) })) })));
        } }));
};
//# sourceMappingURL=community.js.map