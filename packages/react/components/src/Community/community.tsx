import React, { useCallback, useState } from "react"
import { CalendarEventRSVP, Forum, ForumPost, PostComment } from "@tellescope/types-client"
import { 
  HoverPaper, 
  LoadingLinear, 
  ScrollingList, 
  TitleComponentType, 
  useForumPosts, 
  useForums, 
  WithForumId,
  Link,
  LabeledIconButton,
  usePostComments,
  Form,
  SubmitButton,
  WithPostId,
  useModalIconButton,
  IconModal,
  ResolveDisplayPicture,
  elapsed_time_display_string,
  ResolveDisplayName,
  useResolvedSession,
  DeleteWithConfimrationIcon,
  DisplayPicture,
  Styled,
} from "../index"
import { Divider, Grid, LinearProgress, Paper, TextField, Typography } from "@mui/material"
import {
  usePostLiking,
} from "./hooks"
import { remove_script_tags, truncate_string, user_is_admin } from "@tellescope/utilities"

import LikeIcon from "@mui/icons-material/ThumbUp"

import AddCircleIcon from "@mui/icons-material/AddCircle"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';

export const RSVPAvatar = ({ rsvp, size=20, style } : { rsvp: CalendarEventRSVP, size?: number } & Styled) => (
  <DisplayPicture size={size} style={style}
    letters={rsvp.avatar ? undefined : rsvp.displayName[0]}  
    user={{
      id: rsvp.creator,
      avatar: rsvp.avatar,
    }} 
  />
)

export const ResolvedContent = ({ textContent, htmlContent, style } : { textContent: string, htmlContent: string } & Styled) => {
  if (htmlContent) {
    return (
      <div style={style} dangerouslySetInnerHTML={{
        __html: remove_script_tags(htmlContent),
      }} />
    )
  }
  return <Typography>{textContent}</Typography>
}
 
const formFieldStyle: React.CSSProperties = { 
  width: '100%',
  marginBottom: 8,
}

export const PostEditor = ({ existingPost, forumId, onSuccess } : { existingPost?: ForumPost, onSuccess?: (post: ForumPost) => void } & WithForumId) => {
  const [, { createElement: createPost, updateElement: updatePost }] = useForumPosts({ dontFetch: true })

  const [title, setTitle] = useState(existingPost?.title ?? '')
  const [textContent, setTextContent] = useState(existingPost?.textContent ?? '')
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    setError('')
    try {
      const post = await (
        existingPost 
          ? updatePost(existingPost.id, { title, textContent })
          : createPost({ title, textContent, forumId, htmlContent: '' })
      )
      onSuccess?.(post)
      setTitle('')
      setTextContent('')
    } catch(err: any) {
      setError(err?.message ?? err.toString())
    }
  }, [title, textContent, forumId, onSuccess, createPost])

  return (
    <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
    <Grid container direction="column" alignItems="center">
      <Typography style={{ ...formFieldStyle, fontSize: 18, fontWeight: 600 }}>
        Add Post
      </Typography>
      
      <TextField autoFocus label="Title" required style={formFieldStyle}
        value={title} onChange={e => setTitle(e.target.value)} 
      /> 
      <TextField label="Content" required multiline minRows={4} maxRows={4} style={formFieldStyle}
        value={textContent} onChange={e => setTextContent(e.target.value)} 
      /> 

      <SubmitButton submitText="Add Post" submittingText="Posting..." 
        disabled={ 
          !(title && textContent)
          || (existingPost && title === existingPost.title && textContent === existingPost.textContent)
        }
        style={{ width: '100%', ...formFieldStyle}} 
      />

      <Typography color="error" style={formFieldStyle}>{error}</Typography>
    </Grid>
    </Form>
  )
}


export const CreateComment = ({ forumId, postId, onSuccess, threadId, replyTo } : { threadId?: string, replyTo?: string, onSuccess?: (comment: PostComment) => void } & WithForumId & WithPostId) => {
  const [, { createElement: createComment }] = usePostComments({ dontFetch: true })
  const [, { findById: findPost, updateLocalElement: updateLocalPost }] = useForumPosts({ dontFetch: true })

  const post = findPost(postId)

  const [textContent, setTextContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    setError('')
    setSubmitting(true)
    try {
      const comment = await createComment({ textContent, forumId, postId, htmlContent: '', threadId, replyTo: replyTo || threadId })
      setTextContent('')

      if (post) {
        updateLocalPost(post.id, { numComments: post.numComments + 1 })
      }

      onSuccess?.(comment)
    } catch(err: any) {
      setError(err?.message ?? err.toString())
    } finally {
      setSubmitting(false)
    }
  }, [textContent, forumId, postId, post, updateLocalPost, onSuccess, createComment])

  return (
    <Form onSubmit={handleSubmit} style={formFieldStyle}>
    <Grid container>
      <Typography style={{ ...formFieldStyle, fontSize: 16, fontWeight: 600 }}>
        Add Comment
      </Typography>
      
      <TextField label="Comment" placeholder="Enter a comment..." required multiline  style={formFieldStyle}
        size="small" minRows={3} maxRows={3}
        value={textContent} onChange={e => setTextContent(e.target.value)} 
      /> 

      <Grid container wrap="nowrap" justifyContent="space-between">
        <Grid container>
          <Typography color="error" style={formFieldStyle}>{error}</Typography>
        </Grid>

        <SubmitButton submitText="Post" submittingText="Post"  submitting={submitting}
          style={{ ...formFieldStyle, width: 110 }} 
          disabled={!(textContent)}
        />
      </Grid>
    </Grid>
    </Form>
  )
}

const POST_MAX_WIDTH = '700px'
export const PostView = ({ 
  forumId, 
  postId,
  maxHeightPost,
  maxHeightComments,
  redirectLink,
  onDelete,
} : { 
  redirectLink?: string,
  maxHeightComments: React.CSSProperties['maxHeight'] 
  maxHeightPost: React.CSSProperties['maxHeight'] 
  onDelete: () => void,
} & WithPostId & WithForumId) => {
  const session = useResolvedSession()

  const editPostProps = useModalIconButton({ Icon: EditIcon, label: "Edit Post" })

  const [, { findById: findPost, removeElement: deletePost }] = useForumPosts({ loadFilter: { forumId }})
  const [, { filtered, doneLoading, loadMore }] = usePostComments({ loadFilter: { forumId, postId }})
  const post = findPost(postId)

  const commentsLoading = filtered(c => c.forumId === forumId && c.postId === postId)

  if (post === null) return (
    <>
      <Typography>This post has been deleted</Typography>
      {redirectLink && <Link to={redirectLink}>Go back to Community</Link>}
    </>
  )
  if (post === undefined) return <LinearProgress />

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid container direction="column" wrap="nowrap" style={{
        maxHeight: maxHeightPost,
        overflowY: 'auto',
        maxWidth: POST_MAX_WIDTH
      }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography style={{ fontSize: 20, fontWeight: 600 }}>
            {post.title}
          </Typography>

          {(session.type === 'user' || post.creator === session.userInfo.id) && 
            <Grid item>
            <Grid container alignItems="center">
              <IconModal {...editPostProps}>
                <PostEditor existingPost={post} forumId={post.forumId}
                  onSuccess={() => editPostProps.setOpen(false)} 
                />
              </IconModal>
              <DeleteWithConfimrationIcon modelName="Post"
                title="Delete Post" 
                description="Do you wish to permanently delete this post?"
                action={() => deletePost(post.id).then(onDelete).catch(console.error)}
              />
            </Grid>
            </Grid>
          }
        </Grid>

        <Divider flexItem sx={{ mb: 1 }} />

        <ResolvedContent {...post} />

        <Divider flexItem sx={{ my: 1 }} />
      </Grid>

      <Grid container direction="column" style={{ maxWidth: POST_MAX_WIDTH }}>
        <Grid item justifyContent="flex-start" 
          style={{ marginTop: 15, width: '100%' }}
        >
          <CreateComment forumId={forumId} postId={postId} />
        </Grid>

        <Grid item>
        <LoadingLinear data={commentsLoading} render={comments => (
          <ScrollingList items={comments} maxHeight={maxHeightComments} doneLoading={doneLoading} loadMore={loadMore}  
            title="Comments" emptyText="Leave the first comment!"
            TitleComponent={({ title }) => (
              <Grid container>
                <Typography style={{ fontWeight: 600, fontSize: 18 }}>
                  {title}
                </Typography>
              </Grid>
            )}
            Item={({ item: comment }) => (
              <Paper elevation={3} sx={{ padding: 1, py: 2, marginBottom: 1, maxWidth: POST_MAX_WIDTH }}>
              <Grid container direction="column" wrap="nowrap">
                <Grid container alignItems="center" wrap="nowrap">
                  <ResolveDisplayPicture {...comment.postedBy} size={25} />

                  <Grid container direction="column" justifyContent="center" style={{ marginLeft: 8 }}>
                    <ResolveDisplayName {...comment.postedBy} style={{ fontSize: 12 }} />
                    <Typography sx={{ fontSize: 11, opacity: .75 }}>
                      {elapsed_time_display_string(new Date(comment.createdAt))}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item wrap="nowrap" style={{ marginTop: 4 }}>
                  <ResolvedContent {...comment} style={{ fontSize: 14, wordWrap: 'break-word' }} />
                </Grid>
              </Grid>
              </Paper>
            )} /> 
        )} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export const PostPreview = ({ 
  post, 
  onClick,
} : { 
  post: ForumPost, 
  onClick?: (p: ForumPost) => void 
}) => {
  const { status, toggleLike } = usePostLiking({ postId: post.id, forumId: post.forumId })

  const underlineTextSX = {
    cursor: onClick ? 'pointer' : undefined,
    '&:hover': {
      textDecoration: onClick ? 'underline' : undefined,
    }
  }

  return (
    <Grid container direction="column" sx={{ 
      p: {
        xs: 1,
        md: 3,
      }
    }}>
      <Grid item onClick={() => onClick?.(post)}>
        <Grid container wrap="nowrap">
          <ResolveDisplayPicture {...post.postedBy} />

          <Grid container direction="column" justifyContent="center" style={{ marginLeft: 8 }}>
            <Grid item>
              <ResolveDisplayName {...post.postedBy} style={{ fontSize: 14, fontWeight: 600 }} />
            </Grid>

            <Grid item>
              <Typography sx={{ fontSize: 12, opacity: .75 }}>
                {elapsed_time_display_string(new Date(post.createdAt))}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sx={{ my: 1, ...underlineTextSX }}>
          <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
            {post.title}
          </Typography>

          <Typography noWrap>
            <ResolvedContent style={{ fontSize: 15, maxHeight: 100 }} {...post} textContent={truncate_string(post.textContent, { length: 200, showEllipsis: true })} />
          </Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid container alignItems="center" style={{ width: '64px' }}>
          <LabeledIconButton disabled={status === 'loading'} Icon={LikeIcon} 
            color={status === 'liked' ? 'primary' : 'inherit'}
            onClick={toggleLike}
            size={20}
            label={status === 'liked' ? 'Unlike' : "Like"} 
          />
          <Typography component="span">({post.numLikes})</Typography>
        </Grid>

        <Grid container alignItems="center" onClick={() => onClick?.(post)} sx={{
          width: '64px',
          cursor: onClick ? 'pointer' : undefined,
          '&:hover': {
            textDecoration: onClick ? 'underline' : undefined,
          }
        }}>
          <ChatBubbleOutlineIcon style={{ fontSize: 20, marginRight: 5 }} />

          <Typography component="span">({post.numComments})</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export const ForumView = ({ 
  forumId,
  maxHeight,
  redirectLink,
  TitleComponent,
  onClickPost,
  onDelete,
} : {
  TitleComponent?: TitleComponentType,
  maxHeight?: React.CSSProperties['maxHeight']
  redirectLink?: string,
  onClickPost?: (p: ForumPost) => void 
  onDelete?: () => void,
} & WithForumId) => {
  const session = useResolvedSession()
  const [, { findById: findForum, removeElement: deleteForum }] = useForums()
  const [, { filtered, doneLoading, loadMore }] = useForumPosts({ loadFilter: { forumId }})
  const postsLoading = filtered(p => p.forumId === forumId)

  const forum = findForum(forumId)

  const DefaultPostsTitleComponent: TitleComponentType = ({ title, titleStyle }) => {
    const addPostProps = useModalIconButton({
      Icon: AddCircleIcon,
      label: "Add Post"
    })
  
    return (
      <Grid container alignItems="center">
        <Typography style={{ ...titleStyle, marginRight: 3 }}>
          {title}
        </Typography>
  
        <IconModal {...addPostProps}> 
          <PostEditor forumId={forumId} onSuccess={() => addPostProps.setOpen(false)} />
        </IconModal>
        {/* @ts-ignore */}
        {user_is_admin({ ...session.userInfo, type: session.type }) &&
          <DeleteWithConfimrationIcon modelName="forum"
            title="Delete Forum"
            description="This will delete all of the posts, comments, etc. within the forum and cannot be reversed"
            action={() => deleteForum(forumId)}
            typeToConfirm={forum?.title}
            onSuccess={onDelete}
          /> 
        }
      </Grid>
    )
  }
  
  if (forum === null) return (
    <>
      <Typography>This forum has been deleted</Typography>
      {redirectLink && <Link to={redirectLink}>Go back to Community</Link>}
    </>
  )
  if (forum === undefined) return <LinearProgress />

  return (
    <LoadingLinear data={postsLoading} render={posts => (
      <ScrollingList items={posts} maxHeight={maxHeight} doneLoading={doneLoading} loadMore={loadMore}
      title={forum.title} emptyText="Create the first post to start a discussion."
      Item={({ item }) => (
        <Paper elevation={2} sx={{ padding: 1, py: 2, marginBottom: 1 }}>
          <PostPreview post={item} onClick={onClickPost} />
        </Paper>
      )}
      TitleComponent={TitleComponent ?? DefaultPostsTitleComponent}
    />
    )} />
  )
}

// used in both user app and patient portal
export const ForumsList = ({ forums, onClick, maxHeight } : { 
  forums: Forum[],
  onClick?: (f: Forum) => void,
  maxHeight?: React.CSSProperties['maxHeight']
}) => {
  const [, { doneLoading, loadMore }] = useForums()

  return (
    <ScrollingList items={forums} maxHeight={maxHeight} doneLoading={doneLoading} loadMore={loadMore}
      title="Forums" emptyText="There are no forums in this community yet. Please check back later."
      Item={({ item: forum }) => (
        <HoverPaper elevation={2} sx={{ padding: 1, py: 2, marginBottom: 1, cursor: 'pointer' }} 
          onClick={() => onClick?.(forum)}
        >
        <Grid container direction="column">
          <Grid item>
            <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>
              {forum.title}
            </Typography>
          </Grid>
        </Grid>
        </HoverPaper>
      )}
    />
  )
}