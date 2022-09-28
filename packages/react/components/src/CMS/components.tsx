import React from "react"
import { HoverPaper, useFileForSecureName } from "..";
import { PDFBlockUIProps } from "./types";
import { Grid, Typography } from "@mui/material";
import { 
  FileOpen as OpenFileIcon,
} from "@mui/icons-material"

export const PDFBlockUI = ({ info }: PDFBlockUIProps) => {
  // support secure links
  const loadedImage = useFileForSecureName({ secureName: info.link })

  if (!loadedImage) return null 
  return (
    <HoverPaper style={{ padding: 15 }}>
    <Grid container alignItems="center" justifyContent="center" 
      onClick={() => window.open(loadedImage, "_blank")}
    >
      <Typography>
        {info.name ?? 'View PDF'} 
      </Typography>

      <OpenFileIcon color="primary" sx={{ ml: 1 }} />
    </Grid>
    </HoverPaper>
  )
}