import React, { useEffect, useRef, useState } from "react"

import { user_display_name } from "@tellescope/utilities"

import {
  useEndusers,
  useUserDisplayInfo,
  Typography, 
  value_is_loaded,
  useUsers,
} from "./index"

import { Avatar, AvatarProps, Styled } from "./mui"
import { useResolvedSession } from "./authentication"
import { Image, ImageDimensions } from "./layout"
import { APIErrorHandler } from "@tellescope/types-utilities"

// supports actual secureName as well as URL values
const useSecureImage = ({ 
  secureName, 
  onError,
  cacheKey=secureName 
}: { secureName: string, onError?: APIErrorHandler, cacheKey?: string }) => {
  const session = useResolvedSession()
  const [loadedImage, setLoadedImage] = useState({ uri: '', cacheKey: '' })
  const fetchRef = useRef({ } as { [index: string]: boolean })

  useEffect(() => {
    if (!secureName) return
    if (secureName.startsWith('http')) return // not actually a secureName

    if (loadedImage.cacheKey === cacheKey) return 
    if (fetchRef.current[cacheKey]) return // already fetching
    fetchRef.current[cacheKey] = true

    session?.api.files.file_download_URL({ secureName })
    .then(({ downloadURL }) => setLoadedImage({ uri: downloadURL, cacheKey }))
    .catch(err => {
      if (onError) onError?.(err)
      else console.warn("Error getting url for DisplayPicture", err)
    })
    
  }, [cacheKey, fetchRef, secureName, loadedImage, onError, session])

  return secureName.startsWith('http') ? secureName : loadedImage.uri
}


export const SecureImage = ({ secureName, placeholder, ...props } : { placeholder?: React.ReactElement, secureName: string, alt?: string } & ImageDimensions) => {
const loadedImage = useSecureImage({ secureName })

  // if user doesn't have picture, or it's still loading
  if (loadedImage === '') return placeholder ?? null

  return (
    <Image src={loadedImage} {...props} />
  )
}

export interface DisplayPictureProps extends AvatarProps {
  user?: { id: string, avatar?: string } | null;
  onError?: APIErrorHandler;
  alt?: string,
}
export const DisplayPicture = ({ user, onError, ...avatarProps } : DisplayPictureProps & Styled) => {
  const loadedImage = useSecureImage({ 
    secureName: user?.avatar ?? '',
    cacheKey: (user?.id ?? '') + (user?.avatar ?? ''),
  })

  // if user doesn't have picture, or it's still loading
  if (loadedImage === '') return <Avatar {...avatarProps}/>

  return (
    <Avatar {...avatarProps} src={loadedImage} />
  )
}

export const elapsed_time_display_string = (date: Date) => {
  const elapsedSeconds = (Date.now() - date.getTime()) / 1000

  if (elapsedSeconds < 60) return `${Math.ceil(elapsedSeconds)} seconds ago`
  if (elapsedSeconds < 60 * 60) {
    return `${Math.floor(elapsedSeconds / (60))} minutes ago`
  }
  if (elapsedSeconds < 60 * 60 * 24) {
    return `${Math.floor(elapsedSeconds / (60 * 60))} hours ago`
  }
  
  return `${Math.floor(elapsedSeconds / (60 * 60 * 24))} days ago`
}

export const useEnduserForId = (enduserId: string) => {
  const [, { findById }] = useEndusers() 
  return findById(enduserId)
} 
export const useUserForId = (userId: string) => {
  const [usersLoading] = useUsers()
  return value_is_loaded(usersLoading) ? usersLoading.value.find(u => u.id === userId) : undefined
} 

export const DisplayPictureForSelf = () => {
  const user = useResolvedSession().userInfo

  return <DisplayPicture user={user} />
}

export const DisplayPictureForEnduser = ({ id, ...props } : Omit<DisplayPictureProps, 'user'> & { id: string } ) => {
  const enduser = useEnduserForId(id)

  return <DisplayPicture user={enduser} {...props} />
}
export const DisplayPictureForUser = ({ id, ...props } : Omit<DisplayPictureProps, 'user'> & { id: string } ) => {
  const user = useUserForId(id)

  return <DisplayPicture user={user} {...props} />
}
export const ResolveDisplayPicture = ({ type, ...props } : Omit<DisplayPictureProps, 'user'> & { id: string, type: 'user' | 'enduser' }) => {
  if (type === 'enduser') return <DisplayPictureForEnduser {...props} />
  return <DisplayPictureForUser {...props} />
}

export const DisplayNameForEnduser = ({ id, ...props } : Styled & { id: string } ) => {
  const enduser = useEnduserForId(id)

  if (!enduser) return null
  return <Typography {...props}>{user_display_name(enduser)}</Typography>
}
export const DisplayNameForUser = ({ id, ...props } : Styled & { id: string } ) => {
  const user = useUserForId(id)

  if (!user) return null
  return <Typography {...props}>{user_display_name(user)}</Typography>
}
export const ResolveDisplayName = ({ type, ...props } : Styled & { id: string, type: 'user' | 'enduser' }) => {
  if (type === 'enduser') return <DisplayNameForEnduser {...props} />
  return <DisplayNameForUser {...props} />
}

export const useDisplayInfoForSenderId = (id: string) => {
  const session = useResolvedSession()
  const [, { findById: findUser }] = useUsers()
  const [, { findById: findEnduser }] = useEndusers()

  if (session.userInfo.id === id) return session.userInfo
  return findUser(id) ?? findEnduser(id)
}