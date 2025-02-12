// components that work with web or native
import React, { useCallback, useEffect, useRef, useState } from "react"

import { 
  VideoIcon,
  VideoOffIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
  CallEndIcon,
  LabeledIconButton,
  Flex,
  Styled,
  Button,
} from "@tellescope/react-components"
import { CurrentCallContext } from "./video_shared"
import { useStartVideoCall } from "./video"
import { useJoinVideoCall } from "."
import { 
  AudioInputControl,
  AudioOutputControl,
  ControlBar as BaseControlBar,
  Camera, ContentShareControl, ControlBarButton, Phone, useBackgroundBlur, useMeetingManager, useVideoInputs 
} from "amazon-chime-sdk-component-library-react"
import { isVideoTransformDevice } from "amazon-chime-sdk-js"

const DEFAULT_BUTTON_SIZE = 30
interface ButtonProps {
  size?: number,
}
export const VideoToggle = ({ size=DEFAULT_BUTTON_SIZE } : ButtonProps) => {
  const { toggleVideo, videoIsEnabled } = React.useContext(CurrentCallContext)

  return (
    <LabeledIconButton color="white" size={size} Icon={videoIsEnabled ? VideoIcon : VideoOffIcon} onClick={toggleVideo} 
      label={videoIsEnabled ? "Turn Camera Off" : "Turn Camera On"}
    />
  )
}

export const MicrophoneToggle = ({ size=DEFAULT_BUTTON_SIZE }: ButtonProps) => {
  const { microphoneIsEnabled, toggleMicrophone } = React.useContext(CurrentCallContext)

  return (
    <LabeledIconButton color="white" size={size} Icon={microphoneIsEnabled ? MicrophoneIcon : MicrophoneOffIcon} onClick={toggleMicrophone} 
      label={microphoneIsEnabled ? "Turn Microphone Off" : "Turn Microphone On"}
    />
  )
}

// ends meeting if host, otherwise leaves meeting
export const EndMeeting = ({ size=DEFAULT_BUTTON_SIZE, onLeave }: ButtonProps & LeaveMeetingProps) => {
  const { endMeeting } = useStartVideoCall()

  return (
    <Button variant="outlined"
      style={{ width: 200, color: 'white', borderColor: 'white' }}
      onClick={() => { 
        onLeave?.()
        endMeeting()
      }}    
    >
      End Meeting for All 
    </Button>
  )
}

interface LeaveMeetingProps {
  onLeave?: () => void,
}
export const LeaveMeeting = ({ onLeave, size=DEFAULT_BUTTON_SIZE } : LeaveMeetingProps & ButtonProps) => {
  const { leaveMeeting } = useJoinVideoCall()


  return (
    <LabeledIconButton size={size} Icon={CallEndIcon} label="Leave Meeting"
      color="white"
        onClick={() => {
          leaveMeeting()
          onLeave?.()
        }}
      />
  )
}

const useToggleBlur = () => {
  const meetingManager = useMeetingManager();
  const { selectedDevice } = useVideoInputs();
  const { isBackgroundBlurSupported, createBackgroundBlurDevice } = useBackgroundBlur();
  const [isVideoTransformCheckBoxOn, setisVideoTransformCheckBoxOn] = useState(false);

  useEffect(() => {
    async function toggleBackgroundBlur() {
      try {
        let current = selectedDevice;
        if (isVideoTransformCheckBoxOn) {
          current = await createBackgroundBlurDevice(selectedDevice as any);
        } else {
          if (isVideoTransformDevice(selectedDevice)) {
            current = await selectedDevice.intrinsicDevice();
          }
        }
        await meetingManager.startVideoInputDevice(current!);
      } catch (error) {
        // Handle device selection failure here
        console.error('Failed to toggle Background Blur');
      }
    }

    toggleBackgroundBlur();
  // eslint-disable-next-line
  }, [isVideoTransformCheckBoxOn]);

  const toggleBlur = useCallback(() => setisVideoTransformCheckBoxOn((current) => !current), [])

  return {
    blurIsActive: isVideoTransformCheckBoxOn,
    isBackgroundBlurSupported,
    toggleBlur,
  }
};

interface ControlbarProps {
  autoCamera?: boolean,
  spacing?: number,
  size?: number,
  showEndMeeting?: boolean,
  showScreenShare?: boolean,
  showBlurToggle?: boolean,
}
export const ControlBar = ({ autoCamera, onLeave, style, spacing=15, size, showEndMeeting, showScreenShare, showBlurToggle } : ControlbarProps & LeaveMeetingProps & Styled) => {
  const { isHost } = React.useContext(CurrentCallContext)

  const { leaveMeeting } = useJoinVideoCall()
  const { toggleVideo, videoIsEnabled: cameraActive } = React.useContext(CurrentCallContext)

  const { blurIsActive, isBackgroundBlurSupported, toggleBlur } = useToggleBlur()
  // const { backgroundIsActive, isBackgroundReplacementSupported, toggleBackground } = useToggleReplacement()

  const startCameraRef = useRef(false)
  useEffect(() => {
    if (startCameraRef.current) return
    startCameraRef.current = true

    if (!autoCamera) return
    if (cameraActive) return
    
    toggleVideo()
  }, [autoCamera, cameraActive, toggleVideo])

  const cameraButtonProps = {
    icon: cameraActive ? <Camera /> : <Camera disabled />,
    isSelected: true,
    popOver: ([
      ...(
        isBackgroundBlurSupported ? 
          [{
            onClick: toggleBlur,
            children: (
              <span style={{ fontWeight: blurIsActive ? 'bold' : undefined}}>
                {blurIsActive ? "Disable Blur" : "Blur Background"}
              </span>
            )
          }] 
          : []
      ),
      // ...(
      //   isBackgroundReplacementSupported ? 
      //     [{
      //       onClick: toggleBackground,
      //       children: (
      //         <span style={{ fontWeight: backgroundIsActive ? 'bold' : undefined}}>
      //           {backgroundIsActive ? "Remove Background Image" : "Use Background Image"}
      //         </span>
      //       )
      //     }] 
      //     : []
      // ),
    ]),
    onClick: toggleVideo,
    label: 'Camera',
  };

  const hangUpButtonProps = {
    icon: <Phone />,
    onClick: leaveMeeting,
    label: 'Leave',
  };

  return (
    <BaseControlBar showLabels={true} layout="bottom" css="position: absolute;"
      style={style}
    >
      <AudioInputControl />
      <AudioOutputControl />
      <ControlBarButton {...cameraButtonProps} />
      {showScreenShare && <ContentShareControl iconTitle="Screen" label="Share" />}
      <ControlBarButton {...hangUpButtonProps} />

      {(isHost || showEndMeeting) &&
        <Flex style={{ marginLeft: 30, marginRight: 20 }}>
          <EndMeeting size={size} onLeave={onLeave} />
        </Flex>
      }

    </BaseControlBar>
  );
}
