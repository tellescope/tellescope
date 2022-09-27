import React from "react"

import {
  FileUploaderProps,
  useDisplayPictureUploadForSelf,
  useFileUpload,
} from "./inputs.js"
import { TextField, TextFieldProps } from "./mui"

export { useDisplayPictureUploadForSelf, useFileUpload }

export const FileDropzone = () => {
  throw new Error("Dropzone is not supported in Native")
}

export const FileUploader = (p: FileUploaderProps) => {
  throw new Error("Unimplemented")
}

export const SearchTextInput = (props : TextFieldProps) => (
  <TextField size="small" placeholder="Search..." {...props} />
)
