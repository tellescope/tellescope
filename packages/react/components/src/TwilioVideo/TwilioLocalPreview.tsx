import { useEffect, useRef, useState } from 'react'
import Video, { LocalVideoTrack } from 'twilio-video'
import type { GaussianBlurBackgroundProcessor as GaussianBlurBackgroundProcessorType } from '@twilio/video-processors'
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material'
import { BlurOn as BlurOnIcon, BlurOff as BlurOffIcon } from '@mui/icons-material'
import {
  loadTwilioVideoProcessorsModule,
  BLUR_BACKGROUND_ASSETS_PATH,
  BLUR_BACKGROUND_STORAGE_KEY,
} from './TwilioVideoContext'

const readBlurPreference = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
      && localStorage.getItem(BLUR_BACKGROUND_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const writeBlurPreference = (enabled: boolean) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BLUR_BACKGROUND_STORAGE_KEY, enabled ? 'true' : 'false')
    }
  } catch { /* ignore */ }
}

export interface TwilioLocalPreviewProps {
  style?: React.CSSProperties
}

export const TwilioLocalPreview: React.FC<TwilioLocalPreviewProps> = ({ style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<LocalVideoTrack | null>(null)
  const blurProcessorRef = useRef<GaussianBlurBackgroundProcessorType | null>(null)
  const blurAttachedTrackRef = useRef<LocalVideoTrack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [isBlurSupported, setIsBlurSupported] = useState(false)
  const [isBlurEnabled, setIsBlurEnabled] = useState<boolean>(readBlurPreference)
  const [isBlurLoading, setIsBlurLoading] = useState(false)
  const [trackVersion, setTrackVersion] = useState(0)

  // Probe video-processors support once on mount
  useEffect(() => {
    let mounted = true
    loadTwilioVideoProcessorsModule()
      .then(({ isSupported }) => { if (mounted) setIsBlurSupported(!!isSupported) })
      .catch(() => { /* leave unsupported */ })
    return () => { mounted = false }
  }, [])

  const toggleBlur = () => {
    setIsBlurEnabled(prev => {
      const next = !prev
      writeBlurPreference(next)
      return next
    })
  }

  // Enumerate video devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission first to get device labels, then immediately stop
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())

        const allDevices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput')
        setDevices(videoDevices)
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId)
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to enumerate devices')
        setLoading(false)
      }
    }
    getDevices()
  }, [])

  // Create video track when device is selected
  useEffect(() => {
    if (!selectedDeviceId) return

    let mounted = true

    const getVideoTrack = async () => {
      // Detach blur from previous track, if attached
      if (blurAttachedTrackRef.current && blurProcessorRef.current) {
        try { blurAttachedTrackRef.current.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }
      // Stop existing track
      if (trackRef.current) {
        trackRef.current.stop()
        trackRef.current = null
      }
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      setLoading(true)
      setError(null)

      try {
        const track = await Video.createLocalVideoTrack({
          deviceId: { exact: selectedDeviceId },
          width: 640,
          height: 480,
        })
        if (mounted && containerRef.current) {
          trackRef.current = track
          const videoElement = track.attach()
          videoElement.style.width = '100%'
          videoElement.style.height = '100%'
          videoElement.style.objectFit = 'cover'
          videoElement.style.transform = 'scaleX(-1)'
          containerRef.current.appendChild(videoElement)
          setLoading(false)
          setTrackVersion(v => v + 1)
        } else if (!mounted) {
          track.stop()
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Failed to access camera')
          setLoading(false)
        }
      }
    }

    getVideoTrack()

    return () => {
      mounted = false
      if (blurAttachedTrackRef.current && blurProcessorRef.current) {
        try { blurAttachedTrackRef.current.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }
      if (trackRef.current) {
        trackRef.current.stop()
        trackRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [selectedDeviceId])

  // Sync blur processor with the current preview track + enabled state
  useEffect(() => {
    if (!isBlurSupported) return
    const track = trackRef.current
    if (!track) return

    let cancelled = false
    const apply = async () => {
      const previouslyAttached = blurAttachedTrackRef.current
      if (previouslyAttached && previouslyAttached !== track && blurProcessorRef.current) {
        try { previouslyAttached.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }

      if (isBlurEnabled) {
        if (!blurProcessorRef.current) {
          setIsBlurLoading(true)
          try {
            const { GaussianBlurBackgroundProcessor } = await loadTwilioVideoProcessorsModule()
            if (cancelled) return
            const processor = new GaussianBlurBackgroundProcessor({
              assetsPath: BLUR_BACKGROUND_ASSETS_PATH,
            })
            await processor.loadModel()
            if (cancelled) return
            blurProcessorRef.current = processor
          } catch (err) {
            console.error('Failed to load Twilio video blur processor:', err)
            if (!cancelled) setIsBlurEnabled(false)
            return
          } finally {
            if (!cancelled) setIsBlurLoading(false)
          }
        }

        if (blurAttachedTrackRef.current !== track && blurProcessorRef.current) {
          try {
            track.addProcessor(blurProcessorRef.current, {
              inputFrameBufferType: 'videoframe',
              outputFrameBufferContextType: 'bitmaprenderer',
            })
            blurAttachedTrackRef.current = track
          } catch (err) {
            console.error('Failed to attach blur processor to track:', err)
          }
        }
      } else if (blurAttachedTrackRef.current === track && blurProcessorRef.current) {
        try { track.removeProcessor(blurProcessorRef.current) } catch { /* ignore */ }
        blurAttachedTrackRef.current = null
      }
    }

    apply()

    return () => { cancelled = true }
  }, [trackVersion, isBlurEnabled, isBlurSupported])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      {/* Camera selector */}
      {devices.length > 0 && (
        <FormControl size="small" sx={{ minWidth: 320 }}>
          <InputLabel id="camera-select-label">Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            value={selectedDeviceId}
            label="Camera"
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${devices.indexOf(device) + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Video preview */}
      <Box
        sx={{
          width: 320,
          height: 240,
          backgroundColor: '#1a1a1a',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          ...style,
        }}
      >
        {loading && <CircularProgress size={24} sx={{ color: 'white' }} />}
        {error && (
          <Typography color="error" variant="body2" textAlign="center" sx={{ p: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          ref={containerRef}
          sx={{
            width: '100%',
            height: '100%',
            display: loading || error ? 'none' : 'block',
          }}
        />
        {isBlurSupported && !error && (
          <IconButton
            onClick={toggleBlur}
            disabled={isBlurLoading || loading}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: isBlurEnabled ? '#4caf50' : 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.5)' },
            }}
          >
            {isBlurLoading
              ? <CircularProgress size={16} sx={{ color: 'white' }} />
              : isBlurEnabled ? <BlurOnIcon fontSize="small" /> : <BlurOffIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </Box>
  )
}
