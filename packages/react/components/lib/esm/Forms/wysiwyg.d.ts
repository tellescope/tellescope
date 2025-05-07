import React from 'react';
import { Styled } from '../mui';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export declare const WYSIWYG: ({ stopEnterPropagation, updateHtml, initialHTML: _initialHTML, autoFocus, onChange, style, editorStyle, hideEmoji }: {
    initialHTML?: string | undefined;
    onChange: (html: string) => void;
    autoFocus?: boolean | undefined;
    editorStyle?: React.CSSProperties | undefined;
    hideEmoji?: boolean | undefined;
    updateHtml?: string | undefined;
    stopEnterPropagation?: boolean | undefined;
} & Styled) => JSX.Element;
//# sourceMappingURL=wysiwyg.d.ts.map