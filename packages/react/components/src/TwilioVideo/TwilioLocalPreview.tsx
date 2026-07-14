import { useEffect, useRef, useState } from 'react'
import Video, { LocalVideoTrack } from 'twilio-video'
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import {
  BackgroundEffect,
  BackgroundEffectController,
  loadTwilioVideoProcessorsModule,
  loadBackgroundImage,
  readEffectPreference,
  writeEffectPreference,
} from './backgroundEffects'
import { BackgroundEffectSelector } from './BackgroundEffectSelector'

export interface TwilioLocalPreviewProps {
  style?: React.CSSProperties
  /**
   * Optional URL of an image to offer as a virtual background. Only the
   * provider webapp supplies this; when absent the Image option is hidden.
   */
  backgroundImageURL?: string
}

export const TwilioLocalPreview: React.FC<TwilioLocalPreviewProps> = ({ style, backgroundImageURL }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<LocalVideoTrack | null>(null)
  const backgroundControllerRef = useRef<BackgroundEffectController>(new BackgroundEffectController())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [isBackgroundEffectSupported, setIsBackgroundEffectSupported] = useState(false)
  const [backgroundEffect, setBackgroundEffectState] = useState<BackgroundEffect>(readEffectPreference)
  const [isEffectLoading, setIsEffectLoading] = useState(false)
  const [backgroundImageEl, setBackgroundImageEl] = useState<HTMLImageElement | null>(null)
  const [trackVersion, setTrackVersion] = useState(0)

  const isImageBackgroundAvailable = isBackgroundEffectSupported && !!backgroundImageURL

  // Probe video-processors support once on mount
  useEffect(() => {
    let mounted = true
    loadTwilioVideoProcessorsModule()
      .then(({ isSupported }) => { if (mounted) setIsBackgroundEffectSupported(!!isSupported) })
      .catch(() => { /* leave unsupported */ })
    return () => { mounted = false }
  }, [])

  // Load the background image once per URL
  useEffect(() => {
    if (!backgroundImageURL) {
      setBackgroundImageEl(null)
      return
    }
    let cancelled = false
    loadBackgroundImage(backgroundImageURL)
      .then(img => { if (!cancelled) setBackgroundImageEl(img) })
      .catch(err => {
        console.error('Failed to load Twilio background image:', err)
        if (!cancelled) setBackgroundImageEl(null)
      })
    return () => { cancelled = true }
  }, [backgroundImageURL])

  const setBackgroundEffect = (effect: BackgroundEffect) => {
    setBackgroundEffectState(effect)
    writeEffectPreference(effect)
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
      // Detach any effect from the previous track
      backgroundControllerRef.current.detach()
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
      backgroundControllerRef.current.detach()
      if (trackRef.current) {
        trackRef.current.stop()
        trackRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [selectedDeviceId])

  // Sync the background-effect processor with the current preview track + effect
  useEffect(() => {
    if (!isBackgroundEffectSupported) return
    const track = trackRef.current
    if (!track) return

    let cancelled = false
    const controller = backgroundControllerRef.current
    const run = async () => {
      if (backgroundEffect !== 'none') setIsEffectLoading(true)
      try {
        await controller.apply(track, backgroundEffect, backgroundImageEl)
      } catch (err) {
        console.error('Failed to apply Twilio background effect:', err)
        if (!cancelled) setBackgroundEffect('none')
      } finally {
        if (!cancelled) setIsEffectLoading(false)
      }
    }
    run()

    return () => { cancelled = true }
  }, [trackVersion, backgroundEffect, isBackgroundEffectSupported, backgroundImageEl])

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
        {isBackgroundEffectSupported && !error && (
          <BackgroundEffectSelector
            effect={backgroundEffect}
            setEffect={setBackgroundEffect}
            isImageAvailable={isImageBackgroundAvailable}
            isLoading={isEffectLoading}
            disabled={loading}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          />
        )}
      </Box>
    </Box>
  )
}
