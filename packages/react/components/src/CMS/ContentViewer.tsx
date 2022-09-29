import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ManagedContentRecord } from "@tellescope/types-client"
import { remove_script_tags } from "@tellescope/utilities"
import { Grid, Typography } from "@mui/material"
import { PDFBlockUI } from "./components"

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
  return link.replace('/watch?v=', '/embed/')
}

export const ArticleViewer = ({ 
  article,
  width,
  maxWidth,
  spacing=1,
} : {
  article: ManagedContentRecord 
  spacing?: number,
  width?: React.CSSProperties['width'], 
  maxWidth?: React.CSSProperties['width'], 
}) => {
  const style: React.CSSProperties = { width, maxWidth }
  const pageWidth = usePageWidth()

  const rootRef = useRef<HTMLDivElement | null>(null)
  const [rootWidth, setRootWidth] = useState(0)

  useLayoutEffect(() => {
    setRootWidth(rootRef.current?.offsetWidth ?? 0)
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
    <Grid container direction="column" justifyContent="center" ref={rootRef}
      style={style} spacing={spacing}
      
    >
      {article.blocks.map((block, i) => (
        <Grid item key={i}>
          {
            block.type === 'h1' ? (
              <Typography component="h1" style={{ fontSize: 28, fontWeight: 'bold' }}>{block.info.text}</Typography>
            )
          : block.type === 'h2' ? (
              <Typography component="h2" style={{ fontSize: 23 }}>{block.info.text}</Typography>
            )
          : block.type === 'html' ? (
            <div style={{ fontSize: 18, lineHeight: '25pt'  }} dangerouslySetInnerHTML={{
              __html: remove_script_tags(
                block.info.html.replaceAll(/style="*"/g, '')
              )
            }} />
            ) 
          : block.type === 'image' ? (
              <img src={block.info.link} alt={''}  
                style={{ maxWidth: '100%', paddingTop: 10, paddingBottom: 10 }} 
              />
            )
          : block.type === 'youtube' ? (
              <iframe width={rootWidth} height={rootWidth * 315 / 560}
                title={`YouTube video player ${i}`} allowFullScreen
                src={correct_youtube_link_for_embed(block.info.link)}
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