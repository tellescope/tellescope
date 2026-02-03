import { useEffect, useRef, useState } from 'react'
import Video, { LocalVideoTrack } from 'twilio-video'
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

export interface TwilioLocalPreviewProps {
  style?: React.CSSProperties
}

export const TwilioLocalPreview: React.FC<TwilioLocalPreviewProps> = ({ style }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<LocalVideoTrack | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')

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
      if (trackRef.current) {
        trackRef.current.stop()
        trackRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [selectedDeviceId])

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
      </Box>
    </Box>
  )
}
