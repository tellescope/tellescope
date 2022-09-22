import { CalendarEvent } from "@tellescope/types-client"
import { useCallback } from "react"
import { useCalendarEvents, useCalendarEventRSVPs, useForumPosts, usePostLikes, useResolvedSession, value_is_loaded } from "../index"
import { PostLikeStatus, WithForumId, WithPostId } from "./types"


export const useRSVPActions = (event: CalendarEvent) => {
  const session = useResolvedSession()

  const [, { updateLocalElement: updateCalendarEvent }] = useCalendarEvents({ dontFetch: true })
  useCalendarEventRSVPs() // load rsvps, likely including recent ones for this event
  const [, { createElement: createRSVP, removeElement: deleteRSVP, filtered }] = useCalendarEventRSVPs({ loadFilter: { creator: session.userInfo.id } }) // ensure own RSVPs are loaded
  const eventRSVPsLoading = filtered(e => e.eventId === event.id)

  const rsvps = value_is_loaded(eventRSVPsLoading) ? eventRSVPsLoading.value : []

  const selfRSVP = rsvps.find(r => r.creator === session.userInfo.id)

  const addRsvp = useCallback(() => (
    createRSVP({ eventId: event.id }) 
    .then(() => updateCalendarEvent(event.id, { numRSVPs: (event.numRSVPs ?? 0) + 1 }))
    .catch(console.error)
  ), [event, createRSVP, updateCalendarEvent])

  const removeRsvp = useCallback(() => {
    if (!selfRSVP) return new Promise<void>((r) => r())

    return deleteRSVP(selfRSVP.id) 
    .then(() => updateCalendarEvent(event.id, { numRSVPs: (event.numRSVPs ?? 0) - 1 }))
    .catch(console.error)
  }, [event, selfRSVP, deleteRSVP, updateCalendarEvent])

  return {
    rsvps,
    selfRSVP,
    addRsvp,
    removeRsvp,
  }
}

export const usePostLiking = ({ forumId, postId } : WithForumId & WithPostId) => {
  const session = useResolvedSession()
  const [, { updateLocalElement: updateLocalPost, findById: findPost }] = useForumPosts({ dontFetch: true })
  const [likesLoading, { 
    createElement: createLike, 
    addLocalElement: addLocalLike, 
    removeLocalElements: removeLocalLikes 
  } ] = usePostLikes({ loadFilter: { forumId }})

  const post = findPost(postId)
  const existingLike = (
    value_is_loaded(likesLoading) 
      ? likesLoading.value.find(l => l.creator === session.userInfo.id && l.postId === postId) 
      : null
  )

  const status: PostLikeStatus = (
    existingLike !== null
      ? existingLike
          ? 'liked'
          : 'unliked'
      : 'loading'
  )

  const likePost = useCallback(() => {
    if (status === 'loading' || status === 'liked') return

    createLike({ forumId, postId })
    .then(() =>  {
      if (!post) return
      updateLocalPost(post.id, { numLikes: post.numLikes + 1 })
    })
    .catch((err: any) => {
      if (err.message === 'This post has already been liked') {
        // @ts-ignore // add a placeholder for the local like which should switch display to liked
        addLocalLike({ creator: session.userInfo.id, forumId, postId })
      }
    })
  }, [status, addLocalLike, session, forumId, postId, createLike, post, updateLocalPost])

  const unlikePost = useCallback(() => {
    if (status === 'loading' || status === 'unliked' || !existingLike) return
    
    session.api.post_likes.unlike_post({ postId, forumId })
    .then(() =>  {
      if (!post) return
      updateLocalPost(post.id, { numLikes: post.numLikes - 1})
      removeLocalLikes([existingLike.id])
    })
    .catch(console.error)
  }, [session, status, existingLike, postId, forumId, post, updateLocalPost, removeLocalLikes])

  const toggleLike = useCallback(() => {
    if (status === 'loading') return
    if (status === 'liked') return unlikePost()

    return likePost()
  }, [likePost, unlikePost, status])

  return {
    status,
    toggleLike,
    likePost,
    unlikePost,
  }
}