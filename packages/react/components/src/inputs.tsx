import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useDropzone } from 'react-dropzone'

import {
  APIError,
  FileBlob,
  FileDetails,
  Filter,
  Indexable,
  ReactNativeFile,
} from "@tellescope/types-utilities"

import {
  Enduser,
  File as FileClientType,
  ManagedContentRecord,
  User,
} from "@tellescope/types-client"

import { 
  LoadFunction,
  Session, 
} from "@tellescope/sdk"

import {
  Flex, Form,
} from "./layout"
import {
  Styled,
  // Button,
  Typography,
} from "./mui"
import {
  SubmitButtonOptions,
} from "./forms"
import {
  useResolvedSession,
  EnduserSessionContext,
  SessionContext,
} from "./authentication"
import { Button, IconModal, TextField, TextFieldProps, LabeledIconButtonProps, LoadingButton, Modal, SecureImage, SubmitButton, useFiles, useModalIconButton,  } from "."
import { Grid, InputAdornment } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { UNSEARCHABLE_FIELDS } from "@tellescope/constants"
import {
  LoadFunctionArguments,
} from "@tellescope/sdk"
import { objects_equivalent } from "@tellescope/utilities"

export {
  FileBlob,
}

interface DropzoneContentProps extends Styled {
  isDragActive: boolean,
  file?: FileDetails,
  label?: string
}
export const DefaultDropzoneContent = ({ isDragActive, label, file, style } : DropzoneContentProps & Styled) => (
  <Flex flex={1} style={{ 
    ...style,  
    ...isDragActive ? { border: '1px dashed gray' } : {}
  }}>
    <Typography style={{ cursor: 'pointer' }}>
    {   isDragActive ? "Drop to select file"
      : file         ? `${file.name} selected!`
                     : label ?? "Select a File"}
    </Typography> 
  </Flex>
)

export interface FileSelector extends Styled {
  file: FileBlob | undefined,
  onChange: (f: FileBlob | undefined) => void;
  accept?: string,
  label?: string,
  dropzoneStyle?: React.CSSProperties;
  DropzoneComponent?: React.JSXElementConstructor<DropzoneContentProps>
}
export const FileDropzone = ({ accept, file, label, style, dropzoneStyle, onChange, DropzoneComponent=DefaultDropzoneContent } : FileSelector) => {
  const onDrop = useCallback(acceptedFiles => { 
    const newFile = acceptedFiles.pop()
    onChange(newFile)
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps({ multiple: false, accept })} />
      <DropzoneComponent label={label}
        isDragActive={isDragActive} file={file} style={dropzoneStyle}
      />
    </div>
  )
}

export const useFileDropzone = ({ DropzoneComponent=DefaultDropzoneContent, style={} as React.CSSProperties } ) => {
  const [file, setFile] = useState(undefined as FileBlob | undefined)

  return {
    file, setFile,
    dropzone: <FileDropzone file={file} onChange={setFile} DropzoneComponent={DropzoneComponent} dropzoneStyle={style}/>
  }
}

type FileUploadHandler = (details: FileDetails, file: Blob | Buffer | ReactNativeFile, options?: {}) => Promise<FileClientType>
interface UseFileUploaderOptions {
  enduserId?: string
  publicRead?: boolean,
  publicName?: string,
}
export const useFileUpload = (o={} as UseFileUploaderOptions) => {
  const { enduserId, publicRead, publicName } = o
  const session = useResolvedSession()
  const [, { addLocalElement }] = useFiles({ dontFetch: true })

  const [uploading, setUploading] = useState(false)

  const handleUpload: FileUploadHandler = useCallback(async (details, file) => {
    setUploading(true)
    try {
      const createdFile = await session.prepare_and_upload_file({ ...details, publicName, enduserId, publicRead }, file);
      addLocalElement(createdFile)
      return createdFile
    } catch(err) {
      throw err
    } finally {
      setUploading(false)
    }
  }, [session, setUploading])

  return {
    handleUpload,
    uploading,
  }
}

export const UploadButton = ({ file, details, handleUpload, uploading } : { file : FileBlob | undefined, handleUpload: FileUploadHandler, uploading: boolean, details: FileDetails }) => (
  <LoadingButton disabled={!file || uploading} submitText="Upload" submittingText="Uploading"
    onClick={() => {
      if (!file) return
      handleUpload(
        { name: details.name, size: details.size, type: details.type }, // allows passing a File as details without issue
        file
      )
    }}
  />
)

export const useDisplayPictureUploadForSelf = (o={} as UseFileUploaderOptions) => {
  const session = useResolvedSession()
  const { updateUserInfo } = useContext(SessionContext)
  const { updateUserInfo: updateEnduserInfo } = useContext(EnduserSessionContext)

  const { uploading, handleUpload: hookHandleUpload  } = useFileUpload(o)
  const [updating, setUpdating] = useState(false)

  const handleUpload: FileUploadHandler = useCallback(async (details, file, options) => {
    setUpdating(true)

    const { secureName, ...fileInfo } = await hookHandleUpload({
      name: details.name, type: details.type, size: details.size, enduserId: o.enduserId,
    }, file, options)
    try {
      if (session instanceof Session) {
        await updateUserInfo({ avatar: secureName })
      } else {
        await updateEnduserInfo({ avatar: secureName })
      }
    } catch(err) {
      throw (err)
    } finally {
      setUpdating(false)
    }

    return { secureName, ...fileInfo }
  }, [session])

  return {
    handleUpload,
    updating: updating || uploading,
  }
}

export interface FileUploaderProps extends SubmitButtonOptions, UseFileUploaderOptions {
  onUpload?: (file: FileClientType) => void,
}
export const FileUploader = ({
  submitText="Upload",
  submittingText="Uploading",
  onUpload,
  style,
  enduserId,
  dropzoneStyle,
  variant,
  ...uploadOptions
}: FileUploaderProps & Styled & { dropzoneStyle?: React.CSSProperties }) => {
  const { handleUpload, uploading } = useFileUpload(uploadOptions)
  const [file, setFile] = useState<FileBlob | undefined>(undefined)

  return (
    <Flex column style={style}>
      <FileDropzone file={file} onChange={setFile} dropzoneStyle={dropzoneStyle}/>

      <LoadingButton variant={variant}
        onClick={async () => {
          if (!file) return
          const uploadedFile = await handleUpload({ 
            name: file.name, type: file.type, size: file.size, enduserId 
          }, file)
          onUpload?.(uploadedFile)
        }}
        submitText={submitText} submittingText={submittingText} 
        disabled={file === undefined} submitting={uploading} 
      />
    </Flex>
  )
}

interface ConfirmationScreenProps <T>{
  action: () => Promise<T>;
  onCancel: () => void;
  onSuccess?: (result: T) => void;
  title?: string;
  description?: React.ReactNode;
  typeToConfirm?: string; 
  confirmText?: string;
  loadingText?: string
}
const ConfirmationScreen = <T,>({ 
  action, onCancel, onSuccess, typeToConfirm='', 
  title="Confirmation", description='',
  confirmText='Confirm', loadingText="Loading" 
} : ConfirmationScreenProps<T>) => {
  const [text, setText] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = () => {
    action()
    .then(onSuccess)
    .finally(() => {
      setSubmitting(false)
    })
  }

  return (
    <Modal open={true} setOpen={o => !o && onCancel()}>
    <Form onSubmit={handleConfirm} style={{ width: '100%' }}>

    <Grid container direction="column">
      <Typography style={{ fontSize: 25, marginBottom: 5 }}>
        {title}
      </Typography>

      {description &&
        <Grid item sx={{ minHeight: 'min(40vh, 100px)' }}>
          <Typography style={{ fontSize: 18 }} color="primary">
            {description}
          </Typography>
        </Grid>
      }

      {typeToConfirm &&
        <Grid item>
          <TextField variant="outlined" type="text" fullWidth
             name="Confirmation" label={`Type "${typeToConfirm}" to confirm`} placeholder={typeToConfirm}
             value={text} onChange={value => setText(value.substring(0, 250))}
           />
        </Grid>
      }

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={8}>
          <Button color="primary" variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        </Grid>

        <Grid item xs={4}>
          <SubmitButton
            submitting={submitting} disabled={typeToConfirm !== text} 
            submitText={confirmText}
            submittingText={loadingText}
          />
        </Grid>
      </Grid>
    </Grid>

    </Form>
    </Modal>
  )
}

interface DeleteWithConfirmationIconProps extends Omit<ConfirmationScreenProps<any>, 'onCancel' | 'confirmText' | 'loadingText'> {
  modelName: string,
  color?: LabeledIconButtonProps['color'],
  iconProps?: Omit<LabeledIconButtonProps, 'Icon' | 'label'>,
}
export const DeleteWithConfimrationIcon = ({ modelName, color, iconProps, onSuccess,  ...props } : DeleteWithConfirmationIconProps) => {
  const modalProps = useModalIconButton({ 
    Icon: DeleteIcon, label: `Delete ${modelName}`, id: `delete-${modelName}-icon`,
    color, ...iconProps,
  })

  const defaultOnSuccess = () => {
    modalProps.setOpen(false)
  }

  return (
    <IconModal {...modalProps}>
      <ConfirmationScreen {...props}
        onSuccess={onSuccess ?? defaultOnSuccess}
        onCancel={() => modalProps.setOpen(false)}  
        confirmText="Delete" loadingText="Deleting..."
      />
    </IconModal>
  )
}

export const SearchTextInput = ({ onChange, ...props } : TextFieldProps) => (
  <TextField size="small" placeholder="Search..." 
    onChange={s => onChange?.(s)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    {...props}
  />
)

export const ImageOrDropzone = ({ 
  style, 
  maxHeight, width, 
  existing, onUpload, uploadInModal,
  dropzoneText="Select a Photo"
} : { 
  existing?: string,
  dropzoneText?: string,
  onUpload: (secureName: string) => void,
  maxHeight?: number,
  width?: number,
  uploadInModal?: boolean,
} & Styled) => {
  const [selectedFile, setSelectedFile] = useState<FileBlob | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  
  const { handleUpload, uploading } = useFileUpload()

  const upload = (
    <Grid container direction="column">
      <FileDropzone file={selectedFile} onChange={setSelectedFile}
        label={dropzoneText}
        accept={".png,.jpg,.jpeg,.gif"}
        dropzoneStyle={{
          cursor: 'pointer',
          border: '1px solid black',
          borderRadius: 5,
          height: maxHeight,
          // width: 400,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {selectedFile && 
        <LoadingButton submitText="Upload" submittingText="Uploading..." 
          disabled={!selectedFile}
          submitting={uploading} onClick={async () => {
            if (!selectedFile) return
            setError('')

            if (!(
              selectedFile.type.includes('png')
            || selectedFile.type.includes('jpg')
            || selectedFile.type.includes('jpeg')
            || selectedFile.type.includes('gif')
            )) {
              return setError("Please attach an image file")  
            }

            try {
              const { secureName } = await handleUpload({
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
              }, selectedFile)

              onUpload(secureName)

              setOpen(false)
              setSelectedFile(undefined)
            } catch(err: any) {
              setError(err?.message ?? err?.toString())
            }
          }}
        />
      }

      <Typography color="error">{error}</Typography>
    </Grid>
  )

  return (
    <>
    {!(uploadInModal || open)
      ? 
        existing
          ? (
            <Grid container alignItems="center" justifyContent="center" style={style} onClick={() => setOpen(true)} sx={{ 
              cursor: 'pointer',
            }}>
              <SecureImage secureName={existing} maxHeight={maxHeight} width={width} />
            </Grid>
          ) 
          : upload 
      : null
    }

    {uploadInModal 
      ? ( 
        <Modal open={open} setOpen={setOpen}>
          {upload}
        </Modal>
      )
      : open 
        ? upload
        : null
    }
    </>
  )
}