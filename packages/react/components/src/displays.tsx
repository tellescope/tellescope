import React, { useEffect, useRef, useState } from "react"

import { user_display_name } from "@tellescope/utilities"

import {
  useEndusers,
  Typography, 
  value_is_loaded,
  useUsers,
  convertHEIC,
} from "./index"

import { Avatar, AvatarProps, Styled } from "./mui"
import { useResolvedSession } from "."
import { Image, ImageDimensions, Video } from "./layout"
import { APIErrorHandler } from "@tellescope/types-utilities"

export type LoadedFile = { downloadURL: string, name: string }
// supports actual secureName as well as URL values
export const useFileForSecureName = ({ 
  secureName, 
  onError,
  cacheKey=secureName,
  onLoad,
  preferInBrowser,
}: { secureName: string, onError?: APIErrorHandler, cacheKey?: string,
  onLoad?: (f: LoadedFile) => void, 
  preferInBrowser?: boolean,
}) => {
  const session = useResolvedSession()
  const [loadedImages, setLoadedImages] = useState<{ uri: string, cacheKey: string, name: string }[]>([])
  const fetchRef = useRef({ } as { [index: string]: boolean })

  useEffect(() => {
    if (!secureName) return
    if (secureName.startsWith('http')) return // not actually a secureName

    if (loadedImages.find(i => i.cacheKey === cacheKey)) return 
    if (fetchRef.current[cacheKey]) return // already fetching
    fetchRef.current[cacheKey] = true

    session?.api.files.file_download_URL({ secureName, preferInBrowser })
    .then(({ downloadURL, name }) => {
      onLoad?.({ downloadURL, name })

      if (name.toLowerCase().endsWith('heic') || name.toLowerCase().endsWith('heif')) {
        convertHEIC(downloadURL)
        .then(downloadURL => {
          setLoadedImages(ls => [...ls, { uri: downloadURL, cacheKey, name }])
        })
        .catch(console.error)
      } else {
        setLoadedImages(ls => [...ls, { uri: downloadURL, cacheKey, name }])
      }      
    })
    .catch(err => {
      if (onError) onError?.(err)
      else console.warn("Error getting url for DisplayPicture", err)
    })
  }, [cacheKey, fetchRef, secureName, loadedImages, onError, session, onLoad, preferInBrowser])

  return (
    secureName.startsWith('http') 
      ? secureName 
      : (loadedImages.find(i => i.cacheKey === cacheKey)?.uri || '')
  )
}


export const SecureImage = ({ secureName, placeholder, onImageClick, ...props } : {  
  placeholder?: React.ReactElement, 
  secureName: string, 
  alt?: string,
  onImageClick?: (args: { src: string }) => void,
} & ImageDimensions & Styled) => {
  const loadedImage = useFileForSecureName({ secureName })

  // if user doesn't have picture, or it's still loading
  if (loadedImage === '') return placeholder ?? null

  return (
    <Image src={loadedImage} {...props} onClick={() => onImageClick?.({ src: loadedImage })} />
  )
}

export const SecureVideo = ({ secureName, placeholder, ...props } : { placeholder?: React.ReactElement, secureName: string, alt?: string } & ImageDimensions) => {
  const loadedVideo = useFileForSecureName({ secureName })

  // if user doesn't have picture, or it's still loading
  if (loadedVideo === '') return placeholder ?? null

  return (
    <Video src={loadedVideo} dimensions={props} />
  )
}

export interface DisplayPictureProps extends AvatarProps {
  user?: { id: string, fname?: string, lname?: string, avatar?: string, displayName?: string } | null;
  onError?: APIErrorHandler;
  alt?: string,
}
export const DisplayPicture = ({ user, onError, ...avatarProps } : DisplayPictureProps & Styled) => {
  const loadedImage = useFileForSecureName({ 
    secureName: user?.avatar ?? '',
    cacheKey: (user?.id ?? '') + (user?.avatar ?? ''),
  })

  // if user doesn't have picture, or it's still loading
  if (loadedImage === '') {
    const letters = `${user?.fname ? user.fname[0] : ''}${user?.lname ? user.lname[0] : ''}`
    return (
      <Avatar 
        letters={letters || user?.displayName?.substring(0,2)?.toUpperCase()} 
        {...avatarProps}
      />
    )
  }

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

export const DisplayPictureForSelf = (props: Styled) => {
  const user = useResolvedSession().userInfo

  return <DisplayPicture user={user} {...props} />
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