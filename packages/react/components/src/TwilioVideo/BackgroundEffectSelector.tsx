import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, CircularProgress, ListItemIcon, ListItemText, SxProps, Theme } from '@mui/material'
import {
  BlurOn as BlurOnIcon,
  BlurOff as BlurOffIcon,
  Wallpaper as WallpaperIcon,
} from '@mui/icons-material'
import type { BackgroundEffect } from './backgroundEffects'

export interface BackgroundEffectSelectorProps {
  effect: BackgroundEffect
  setEffect: (effect: BackgroundEffect) => void
  /** Whether the Image option should be offered (webapp with an org image set). */
  isImageAvailable: boolean
  isLoading?: boolean
  disabled?: boolean
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}

/**
 * Three-way background-effect selector shared by the in-call control bar and
 * the pre-join preview. Renders an IconButton whose glyph reflects the active
 * effect and opens a menu offering None / Blur (always) and Image (only when
 * available). When Image is unavailable it behaves like a None/Blur toggle,
 * visually equivalent to the previous blur-only control.
 */
export const BackgroundEffectSelector: React.FC<BackgroundEffectSelectorProps> = ({
  effect,
  setEffect,
  isImageAvailable,
  isLoading = false,
  disabled = false,
  size = 'medium',
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleSelect = (next: BackgroundEffect) => {
    setEffect(next)
    setAnchorEl(null)
  }

  const spinnerSize = size === 'small' ? 16 : 20

  const buttonIcon = isLoading
    ? <CircularProgress size={spinnerSize} sx={{ color: 'white' }} />
    : effect === 'blur'
      ? <BlurOnIcon fontSize={size} />
      : effect === 'image'
        ? <WallpaperIcon fontSize={size} />
        : <BlurOffIcon fontSize={size} />

  return (
    <>
      <IconButton
        onClick={e => setAnchorEl(e.currentTarget)}
        disabled={disabled || isLoading}
        size={size}
        sx={{
          color: effect !== 'none' ? '#4caf50' : 'white',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          '&.Mui-disabled': { color: 'rgba(255,255,255,0.5)' },
          ...sx,
        }}
      >
        {buttonIcon}
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem selected={effect === 'none'} onClick={() => handleSelect('none')}>
          <ListItemIcon><BlurOffIcon fontSize="small" /></ListItemIcon>
          <ListItemText>None</ListItemText>
        </MenuItem>
        <MenuItem selected={effect === 'blur'} onClick={() => handleSelect('blur')}>
          <ListItemIcon><BlurOnIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Blur</ListItemText>
        </MenuItem>
        {isImageAvailable && (
          <MenuItem selected={effect === 'image'} onClick={() => handleSelect('image')}>
            <ListItemIcon><WallpaperIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Image</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
