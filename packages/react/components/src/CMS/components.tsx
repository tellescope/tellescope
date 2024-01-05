import React from "react"
import { HoverPaper, useFileForSecureName, PdfViewer } from "..";
import { PDFBlockUIProps } from "./types";
import { Grid, Typography } from "@mui/material";
import { 
  FileOpen as OpenFileIcon,
} from "@mui/icons-material"

export const PDFBlockUI = ({ info }: PDFBlockUIProps) => {
  // support secure links
  const loadedImage = useFileForSecureName({ secureName: info.link, preferInBrowser: true })
  if (!loadedImage) return null 

  return <PdfViewer url={loadedImage} height={750} />

  return (
    <HoverPaper style={{ padding: 15, width: '100%' }} 
      onClick={() => window.open(loadedImage, "_blank")}
    >
    <Grid container alignItems="center" justifyContent="center" >
      <Typography>
        {info.name ?? 'View PDF'} 
      </Typography>

      <OpenFileIcon color="primary" sx={{ ml: 1 }} />
    </Grid>
    </HoverPaper>
  )
}