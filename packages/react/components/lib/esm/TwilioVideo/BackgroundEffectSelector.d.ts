import React from 'react';
import { SxProps, Theme } from '@mui/material';
import type { BackgroundEffect } from './backgroundEffects';
export interface BackgroundEffectSelectorProps {
    effect: BackgroundEffect;
    setEffect: (effect: BackgroundEffect) => void;
    /** Whether the Image option should be offered (webapp with an org image set). */
    isImageAvailable: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium';
    sx?: SxProps<Theme>;
}
/**
 * Three-way background-effect selector shared by the in-call control bar and
 * the pre-join preview. Renders an IconButton whose glyph reflects the active
 * effect and opens a menu offering None / Blur (always) and Image (only when
 * available). When Image is unavailable it behaves like a None/Blur toggle,
 * visually equivalent to the previous blur-only control.
 */
export declare const BackgroundEffectSelector: React.FC<BackgroundEffectSelectorProps>;
//# sourceMappingURL=BackgroundEffectSelector.d.ts.map