import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ManagedContentRecord } from "@tellescope/types-client"
import { remove_script_tags, sanitize_html_for_cms } from "@tellescope/utilities"
import { Button, Grid, Typography } from "@mui/material"
import { PDFBlockUI } from "./components"
import { css } from "@emotion/css"
import { useManagedContentRecords } from "../state"

interface UseContentHeightOptions {
  /**
   * Debounce time in milliseconds for resize observation
   * @default 100
   */
  debounceTime?: number;
  
  /**
   * CSS selector for the element to observe
   * @default 'body'
   */
  targetSelector?: string;
}

/**
 * A hook that tracks the height of page content and updates when content changes.
 * @param options - Configuration options
 * @returns Current content height in pixels
 */
export const usePageContentHeight = (options: UseContentHeightOptions = {}): number => {
  const { 
    debounceTime = 100,
    targetSelector = 'body'
  } = options;
  
  const [contentHeight, setContentHeight] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  
  useEffect(() => {
    // Function to measure content height
    const updateContentHeight = (): void => {
      const targetElement = document.querySelector(targetSelector);
      
      if (targetElement) {
        // Use scrollHeight to get the total height including overflow content
        const height = targetElement.scrollHeight;
        setContentHeight(height);
      }
    };
    
    // Debounced update function
    const debouncedUpdate = (): void => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        updateContentHeight();
      }, debounceTime);
    };
    
    // Initial measurement
    updateContentHeight();
    
    // Set up mutation observer to detect content changes
    observerRef.current = new MutationObserver(debouncedUpdate);
    
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      observerRef.current.observe(targetElement, {
        childList: true,     // Watch for changes in direct children
        subtree: true,       // Watch for changes in the entire subtree
        characterData: true, // Watch for changes in text content
        attributes: true     // Watch for changes in attributes (may affect layout)
      });
    }
    
    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debounceTime, targetSelector]);
  
  return contentHeight;
}


export const usePageHeight = () => {
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handler = () => setHeight(window.innerHeight)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return height 
}
export const usePageWidth = () => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return width
}

export const correct_youtube_link_for_embed = (link: string) => {
  return link.replace('/watch?v=', '/embed/').split('&')[0]
}

const blockStyleToCSS = (style?: any): React.CSSProperties => {
  if (!style) return {}

  const cssStyle: React.CSSProperties = {}

  if (style.width) cssStyle.width = `${style.width}px`
  if (style.height) cssStyle.height = `${style.height}px`
  if (style.backgroundColor) cssStyle.backgroundColor = style.backgroundColor
  if (style.textColor) cssStyle.color = style.textColor
  if (style.borderColor || style.borderWidth) {
    cssStyle.border = `${style.borderWidth || 1}px solid ${style.borderColor || '#cccccc'}`
  }

  // Add default styling when any box style is applied
  if (Object.keys(cssStyle).length > 0) {
    cssStyle.padding = cssStyle.padding || '10px'
    cssStyle.display = cssStyle.display || 'inline-block'
  }

  return cssStyle
}

export const ArticleViewer = ({ 
  article,
  width,
  maxWidth,
  spacing=2,
  style,
  iframeWidthAdjustment=0,
  onLinkClick,
} : {
  article: ManagedContentRecord 
  spacing?: number,
  style?: React.CSSProperties,
  width?: React.CSSProperties['width'], 
  maxWidth?: React.CSSProperties['width'],
  iframeWidthAdjustment?: number,
  onLinkClick?: (r: ManagedContentRecord) => void,
}) => {
  const [, { findById }] = useManagedContentRecords({ dontFetch: true })
  const _style: React.CSSProperties = { ...style, width, maxWidth }
  const pageWidth = usePageWidth()

  const rootRef = useRef<HTMLDivElement | null>(null)
  const [rootWidth, setRootWidth] = useState(0)
  const [history, setHistory] = useState<ManagedContentRecord[]>([])

  useLayoutEffect(() => {
    setRootWidth((rootRef.current?.offsetWidth ?? 0) + iframeWidthAdjustment)
  }, [rootRef.current?.offsetWidth, pageWidth]) // refresh on page width change

  if (history.length > 0 ) {
    return (
      <Grid container>
        {history.length > 0 &&
          <Grid item sx={{ mb: 1 }}>
            <Button variant="contained" onClick={() => setHistory(history.slice(0, history.length - 1))}>
              Back to Previous Article
            </Button>
          </Grid>
        }
        <ArticleViewer article={history[history.length - 1] || article} onLinkClick={r => setHistory(h => [...h, r])} />
      </Grid> 
    )
  }

  if (!article.blocks?.length) {
    if (article.type === 'PDF' && article.attachments?.[0]?.secureName) {
      return <PDFBlockUI info={{ link: article.attachments[0].secureName }} />
    }
    else if (article.htmlContent) {
      return (
        <div style={style} dangerouslySetInnerHTML={{
          __html: remove_script_tags(article.htmlContent)
        }} />
      )
    } else {
      return (
        <div style={style}>
          {article.textContent}
        </div>
      )
    }
  }

  return (
    <Grid container direction="column" justifyContent="center" ref={rootRef} style={_style} spacing={spacing}>
      {article.blocks.map((block, i) => (
        <Grid item key={i}>
          {
            block.type === 'h1' ? (
              <Typography component="h1" sx={{ fontSize: 28, fontWeight: 'bold', m: 0, p: 0 }} style={blockStyleToCSS(block.style)}>{block.info.text}</Typography>
            )
          : block.type === 'h2' ? (
              <Typography component="h2" sx={{ fontSize: 23, m: 0, p: 0 }} style={blockStyleToCSS(block.style)}>{block.info.text}</Typography>
            )
          : block.type === 'html' ? (
            <div style={{
              fontSize: 18,
              lineHeight: '25pt',
              ...blockStyleToCSS(block.style)
            }}
              className={css`p {
                margin-top: 0;
                margin-bottom: 0;
              }`}
              dangerouslySetInnerHTML={{
                __html: remove_script_tags(
                  block.info.html.replaceAll(/style="*"/g, '')
                )
              }}
            />
            )
          : block.type === 'raw-html' ? (
            <div style={{
              fontSize: 18,
              lineHeight: '25pt',
              ...blockStyleToCSS(block.style)
            }}
              dangerouslySetInnerHTML={{
                __html: sanitize_html_for_cms(block.info.html)
              }}
            />
            )
          : block.type === 'image' ? (
              <img src={block.info.link} alt={block.info.alt || ''} style={{
                maxWidth: block.info.maxWidth || '100%',
                maxHeight: block.info.maxHeight || undefined, // '' => undefined
                height: block.info.height || undefined, // '' => undefined
                width: block.info.width || undefined, // '' => undefined
                ...blockStyleToCSS(block.style)
              }} />
            )
          : block.type === 'youtube' ? (
              <iframe width={rootWidth} height={rootWidth * 315 / 560}
                title={`YouTube video player ${i}`} allowFullScreen
                src={correct_youtube_link_for_embed(block.info.link)}
              >
              </iframe> 
            )
          : block.type === 'iframe' ? (
              <iframe width={rootWidth} 
                height={rootWidth * (block.info.height || 315) / (block.info.width || 560)}
                title={block.info.name ?? `embedded link ${i}`} allowFullScreen
                src={block.info.link}
              >
              </iframe> 
            )
          : block.type === 'pdf' ? (
              <PDFBlockUI info={block.info} />
            )
          : (block.type === 'content-link' && block.info.recordId && findById(block.info.recordId, { batch: true })) ? (
              <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  const r = findById(block.info.recordId)
                  if (r) {
                    if (onLinkClick) {
                      onLinkClick(r)
                    } else {
                      setHistory(h => [...h, r])
                    }
                  }
                }}
              >
                {findById(block.info.recordId)?.title || 'Loading...'}
              </Typography>
            )
          : null as never
          }
        </Grid>
      ))}
    </Grid>
  )
}


export const html_for_article = (article: ManagedContentRecord, options?: { rootWidth?: number }) => {
  const rootWidth = options?.rootWidth || 400
  
  const content = (
    (article.blocks ?? [])
    .map((block, i) =>
        block.type === 'h1' ? (
          `<h1>${block.info.text}</h1>`
        )
      : block.type === 'h2' ? (
          `<h2>${block.info.text}</h2>`
        )
      : block.type === 'html' ? (
        `<div>${remove_script_tags(remove_script_tags(block.info.html))}</div>`
        )
      : block.type === 'raw-html' ? (
        `<div>${sanitize_html_for_cms(block.info.html)}</div>`
        )
      : block.type === 'image' ? (
          // wrap with div to supporting centering later
          `<div style="">
            <img src="${block.info.link}" alt="${block.info.alt || ''}" style="max-width: ${block.info.maxWidth || '100%'}; max-height: ${block.info.maxHeight || undefined}; height: ${block.info.height || undefined}; width: ${block.info.width || undefined};" />
          </div>`
        )
      : block.type === 'youtube' ? (
          `<iframe width="${rootWidth}" 
            height="${rootWidth * 315 / 560}"
            title="${`YouTube video player ${i}`}"
            allowFullScreen
            src="${correct_youtube_link_for_embed(block.info.link)}"
            style="margin-top: 12; margin-bottom: 12"
          >
          </iframe>`
        )
      : block.type === 'iframe' ? (
          `<iframe width="${rootWidth}" allowFullScreen
            height="${rootWidth * (block.info.height || 315) / (block.info.width || 560)}"
            title="${block.info.name ?? `embedded link ${i}`}"
            src="${block.info.link}"
            style="margin-top: 12; margin-bottom: 12"
          >
          </iframe> `
        )
      : block.type === 'pdf' ? (
          `<iframe width="${rootWidth}" allowFullScreen
            height="500"
            title="${block.info.name ?? `embedded pdf ${i}`}"
            src="${block.info.link}"
            style="margin-top: 12; margin-bottom: 12"
          >
          </iframe>`
        )
      : '' as never 
    )
    .join('<br />')
  )

  return (
    `<div>${content}</div>`
  )
}