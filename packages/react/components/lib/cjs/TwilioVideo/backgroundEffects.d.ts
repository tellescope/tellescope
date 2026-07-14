import type { LocalVideoTrack } from 'twilio-video';
export type BackgroundEffect = 'none' | 'blur' | 'image';
export declare const BLUR_BACKGROUND_ASSETS_PATH = "/twilio-video-processors";
export declare const BACKGROUND_EFFECT_STORAGE_KEY = "tellescope.twilio.backgroundEffect";
export declare const BLUR_BACKGROUND_STORAGE_KEY = "tellescope.twilio.blurBackground";
export declare const loadTwilioVideoProcessorsModule: () => Promise<typeof import("@twilio/video-processors")>;
/**
 * Reads the persisted background-effect preference, migrating the legacy
 * boolean blur preference (`tellescope.twilio.blurBackground === 'true'`) to
 * the new 'blur' value on first read.
 */
export declare const readEffectPreference: () => BackgroundEffect;
export declare const writeEffectPreference: (effect: BackgroundEffect) => void;
/**
 * Loads an image for compositing as a virtual background. The image is fetched
 * with `crossOrigin = 'anonymous'` so the resulting canvas is not tainted
 * (the file is served from the public S3 bucket, which the Chime path already
 * relies on for CORS).
 */
export declare const loadBackgroundImage: (url: string) => Promise<HTMLImageElement>;
/**
 * Centralizes the attach/detach lifecycle for Twilio video background
 * processors so the in-call context and the pre-join preview don't have to
 * duplicate near-identical logic. Only one processor can be attached to a
 * track at a time, so switching effects tears down the previous processor.
 */
export declare class BackgroundEffectController {
    private processor;
    private processorEffect;
    private attachedTrack;
    private applyToken;
    private detachFromTrack;
    private dropProcessor;
    /**
     * Reconciles the given track/effect with the currently-attached processor.
     * Building a processor and loading its model is async; if a newer apply()
     * call supersedes this one mid-flight, this call bails out to avoid
     * double-attaching.
     */
    apply(track: LocalVideoTrack | null, effect: BackgroundEffect, imageEl?: HTMLImageElement | null): Promise<void>;
    /** Detaches and discards any active processor. Use for cleanup on unmount. */
    detach(): void;
}
//# sourceMappingURL=backgroundEffects.d.ts.map