import React from "react";
import { ManagedContentRecord } from "@tellescope/types-client";
export declare const usePageHeight: () => number;
export declare const usePageWidth: () => number;
export declare const correct_youtube_link_for_embed: (link: string) => string;
export declare const ArticleViewer: ({ article, width, maxWidth, spacing, style, iframeWidthAdjustment, onLinkClick, }: {
    article: ManagedContentRecord;
    spacing?: number | undefined;
    style?: React.CSSProperties | undefined;
    width?: React.CSSProperties['width'];
    maxWidth?: React.CSSProperties['width'];
    iframeWidthAdjustment?: number | undefined;
    onLinkClick?: ((r: ManagedContentRecord) => void) | undefined;
}) => JSX.Element;
export declare const html_for_article: (article: ManagedContentRecord, options?: {
    rootWidth?: number | undefined;
} | undefined) => string;
//# sourceMappingURL=ContentViewer.d.ts.map