import type {
  GaussianBlurBackgroundProcessor as GaussianBlurBackgroundProcessorType,
  VirtualBackgroundProcessor as VirtualBackgroundProcessorType,
} from '@twilio/video-processors'
import type { LocalVideoTrack } from 'twilio-video'

export type BackgroundEffect = 'none' | 'blur' | 'image'

export const BLUR_BACKGROUND_ASSETS_PATH = '/twilio-video-processors'

// Current (three-state) preference key
export const BACKGROUND_EFFECT_STORAGE_KEY = 'tellescope.twilio.backgroundEffect'
// Legacy boolean blur preference key, kept for backward-compatible migration
export const BLUR_BACKGROUND_STORAGE_KEY = 'tellescope.twilio.blurBackground'

let videoProcessorsModulePromise: Promise<typeof import('@twilio/video-processors')> | null = null
export const loadTwilioVideoProcessorsModule = () => {
  if (!videoProcessorsModulePromise) {
    videoProcessorsModulePromise = import('@twilio/video-processors')
  }
  return videoProcessorsModulePromise
}

/**
 * Reads the persisted background-effect preference, migrating the legacy
 * boolean blur preference (`tellescope.twilio.blurBackground === 'true'`) to
 * the new 'blur' value on first read.
 */
export const readEffectPreference = (): BackgroundEffect => {
  try {
    if (typeof localStorage === 'undefined') return 'none'

    const stored = localStorage.getItem(BACKGROUND_EFFECT_STORAGE_KEY)
    if (stored === 'none' || stored === 'blur' || stored === 'image') return stored

    // Migrate legacy boolean blur preference for backward compatibility
    if (localStorage.getItem(BLUR_BACKGROUND_STORAGE_KEY) === 'true') {
      localStorage.setItem(BACKGROUND_EFFECT_STORAGE_KEY, 'blur')
      return 'blur'
    }

    return 'none'
  } catch {
    return 'none'
  }
}

export const writeEffectPreference = (effect: BackgroundEffect) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BACKGROUND_EFFECT_STORAGE_KEY, effect)
    }
  } catch { /* ignore */ }
}

/**
 * Loads an image for compositing as a virtual background. The image is fetched
 * with `crossOrigin = 'anonymous'` so the resulting canvas is not tainted
 * (the file is served from the public S3 bucket, which the Chime path already
 * relies on for CORS).
 */
export const loadBackgroundImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load background image: ${url}`))
    img.src = url
  })

type BackgroundProcessor = GaussianBlurBackgroundProcessorType | VirtualBackgroundProcessorType

/**
 * Centralizes the attach/detach lifecycle for Twilio video background
 * processors so the in-call context and the pre-join preview don't have to
 * duplicate near-identical logic. Only one processor can be attached to a
 * track at a time, so switching effects tears down the previous processor.
 */
export class BackgroundEffectController {
  private processor: BackgroundProcessor | null = null
  private processorEffect: BackgroundEffect = 'none'
  private attachedTrack: LocalVideoTrack | null = null
  // Last-call-wins guard against overlapping async apply() invocations
  private applyToken = 0

  private detachFromTrack() {
    if (this.attachedTrack && this.processor) {
      try { this.attachedTrack.removeProcessor(this.processor) } catch { /* ignore */ }
    }
    this.attachedTrack = null
  }

  private dropProcessor() {
    this.detachFromTrack()
    this.processor = null
    this.processorEffect = 'none'
  }

  /**
   * Reconciles the given track/effect with the currently-attached processor.
   * Building a processor and loading its model is async; if a newer apply()
   * call supersedes this one mid-flight, this call bails out to avoid
   * double-attaching.
   */
  async apply(
    track: LocalVideoTrack | null,
    effect: BackgroundEffect,
    imageEl?: HTMLImageElement | null,
  ): Promise<void> {
    const token = ++this.applyToken
    const isStale = () => token !== this.applyToken

    // Detach from a previously-attached track if it differs from the current one
    if (this.attachedTrack && this.attachedTrack !== track) {
      this.detachFromTrack()
    }

    // Nothing to attach to, or effect disabled, or image effect without an image
    if (!track || effect === 'none' || (effect === 'image' && !imageEl)) {
      this.detachFromTrack()
      return
    }

    // If a different effect is active, tear down the old processor first
    if (this.processor && this.processorEffect !== effect) {
      this.dropProcessor()
    }

    // Build the processor for the requested effect if we don't have one yet
    if (!this.processor) {
      const mod = await loadTwilioVideoProcessorsModule()
      if (isStale()) return

      let processor: BackgroundProcessor
      if (effect === 'blur') {
        processor = new mod.GaussianBlurBackgroundProcessor({
          assetsPath: BLUR_BACKGROUND_ASSETS_PATH,
        })
      } else {
        processor = new mod.VirtualBackgroundProcessor({
          assetsPath: BLUR_BACKGROUND_ASSETS_PATH,
          backgroundImage: imageEl as HTMLImageElement,
          fitType: mod.ImageFit.Cover,
        })
      }

      await processor.loadModel()
      if (isStale()) return

      this.processor = processor
      this.processorEffect = effect
    }

    // Attach the processor to the track if not already attached
    if (this.attachedTrack !== track && this.processor) {
      track.addProcessor(this.processor, {
        inputFrameBufferType: 'videoframe',
        outputFrameBufferContextType: 'bitmaprenderer',
      })
      this.attachedTrack = track
    }
  }

  /** Detaches and discards any active processor. Use for cleanup on unmount. */
  detach() {
    this.applyToken++
    this.dropProcessor()
  }
}
