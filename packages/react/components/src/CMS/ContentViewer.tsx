import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ManagedContentRecord } from "@tellescope/types-client"
import { remove_script_tags } from "@tellescope/utilities"
import { Grid, Typography } from "@mui/material"
import { PDFBlockUI } from "./components"
import { css } from "@emotion/css"

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

export const ArticleViewer = ({ 
  article,
  width,
  maxWidth,
  spacing=2,
  style,
  iframeWidthAdjustment=0,
} : {
  article: ManagedContentRecord 
  spacing?: number,
  style?: React.CSSProperties,
  width?: React.CSSProperties['width'], 
  maxWidth?: React.CSSProperties['width'],
  iframeWidthAdjustment?: number,
}) => {
  const _style: React.CSSProperties = { ...style, width, maxWidth }
  const pageWidth = usePageWidth()

  const rootRef = useRef<HTMLDivElement | null>(null)
  const [rootWidth, setRootWidth] = useState(0)

  useLayoutEffect(() => {
    setRootWidth((rootRef.current?.offsetWidth ?? 0) + iframeWidthAdjustment)
  }, [rootRef.current?.offsetWidth, pageWidth]) // refresh on page width change

  if (!article.blocks?.length) {
    if (article.htmlContent) {
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
              <Typography component="h1" sx={{ fontSize: 28, fontWeight: 'bold', m: 0, p: 0 }}>{block.info.text}</Typography>
            )
          : block.type === 'h2' ? (
              <Typography component="h2" sx={{ fontSize: 23, m: 0, p: 0 }}>{block.info.text}</Typography>
            )
          : block.type === 'html' ? (
            <div style={{ fontSize: 18, lineHeight: '25pt' }} 
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
          : block.type === 'image' ? (
              <img src={block.info.link} alt={''} style={{ 
                maxWidth: block.info.maxWidth || '100%', 
                maxHeight: block.info.maxHeight || undefined, // '' => undefined
                height: block.info.height || undefined, // '' => undefined
                width: block.info.width || undefined, // '' => undefined
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
          : null as never
          }
        </Grid>
      ))}
    </Grid>
  )
}