import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { Autocomplete, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, SxProps, TextField, TextFieldProps, Typography } from "@mui/material"
import { FormInputProps } from "./types"
import { useDropzone } from "react-dropzone"
import { PRIMARY_HEX, RELATIONSHIP_TYPES } from "@tellescope/constants"
import { MM_DD_YYYY_to_YYYY_MM_DD, capture_is_supported, first_letter_capitalized, getLocalTimezone, getPublicFileURL, mm_dd_yyyy, truncate_string, user_display_name } from "@tellescope/utilities"
import { Enduser, EnduserRelationship, FormResponseValue, MultipleChoiceOptions } from "@tellescope/types-models"
import { VALID_STATES, emailValidator, phoneValidator } from "@tellescope/validation"
import Slider from '@mui/material/Slider';
import LinearProgress from '@mui/material/LinearProgress';

import DatePicker from "react-datepicker";
import { datepickerCSS } from "./css/react-datepicker" // avoids build issue with RN
import { CancelIcon, FileBlob, IconButton, LabeledIconButton, Styled, form_display_text_for_language, isDateString, useProducts, useResolvedSession } from ".."
import { DatabaseRecord, FormField } from "@tellescope/types-client"
import { css } from '@emotion/css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import heic2any from "heic2any"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// import { pdfjs, Document, Page } from 'react-pdf';

// try {
//   pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.js',
//     import.meta.url,
//   ).toString();
// } catch(err) {
//   console.error(err)
// }
// try {
//   pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// } catch(err) { console.error(err) }

import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; 
import { CheckCircleOutline, Delete, Edit } from "@mui/icons-material"

export const PdfViewer = ({ url, height=420 } : { url: string, height?: number }) => {
  // const [numPages, setNumPages] = useState<number>();
  // const [page, setPage] = useState(1);
  
  // const parentRef = useRef<HTMLDivElement | null>(null);
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }

  // const pdfHeight: number | undefined = pdfPage?._pageInfo?.view?.[3]
  // const pdfWidth: number | undefined = pdfPage?._pageInfo?.view?.[2]

  // const parentWidth = parentRef.current?.clientWidth

  return (
    <Grid container direction="column">
      {/* {!pdfDocument && <span>Loading pdf...</span>} */}

      {/* <Grid item ref={parentRef} style={{ width: '100%' }}> */}
        {/* {pdfDocument && pdfHeight && pdfWidth && parentWidth &&
          <canvas ref={canvasRef} style={{ 
            maxWidth: '100%', 
            maxHeight: parentWidth / pdfWidth * pdfHeight
          }}  />
        } */}
        {/* <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={page} />
        </Document>
      </Grid> */}

      {/* {pdfDocument && pdfHeight && pdfWidth && parentWidth && */}
        {/* <Grid container alignItems="center" justifyContent="space-between">
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous Page
          </Button>
          <Button variant="outlined" 
            disabled={page === numPages}
            onClick={() => setPage(page + 1)}
          >
            Next Page
          </Button>
        </Grid> */}
      {/* } */}
      <iframe 
        src={
          // url
          // encodeURI(`http://localhost:5173?url=${url}`)
          // encodeURI(`http://tellescope-pdf-renderer.s3-website.us-east-2.amazonaws.com?url=${url}`)
          encodeURI(`https://pdf.tellescope.com?url=${url}`)
        } 
        title="PDF Viewer"  
        style={{ 
          border: 'none',
          height,
          width: '100%',
          marginBottom: '5px'
        }}
      />

      <a href={url} target="__blank" rel="noopener noreferrer"
        style={{ marginTop: 5 }}
      >
        View in new tab or download here
      </a>
    </Grid>
  );
}

export const RatingInput = ({ field, value, onChange }: FormInputProps<'rating'>) => {
  const from = field?.options?.from ?? 1 // allow 0
  const to   = field?.options?.to   ?? 10 // allow 0

  const marks = []
  for (let i=from; i<=to; i++) {
    marks.push({ value: i, label: i })
  }

  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    onChange(Math.ceil((to - from) / 2), field.id)
  }, [onChange])

  return (
    <Slider min={from} max={to} step={1} marks={marks}
      valueLabelDisplay="on"
      value={value ?? Math.ceil((to - from) / 2)} onChange={(e, v) => onChange(v as number, field.id)}
    />
  )
}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle?: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: `${grid * 2}px`,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  backgroundColor: isDragging ? "#ffffff88" : undefined,
  border: '1px solid',
  borderColor: "primary.main",
  borderRadius: 5,

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "#ffffff44" : undefined,
  // padding: `${grid}px`,
  // width: '250px'
});
export const RankingInput = ({ field, value, onChange }: FormInputProps<'ranking'>) => {
  return (
    <Grid container direction='column'>
    {/* <Typography>Most</Typography> */}

    <DragDropContext onDragEnd={result => {
      if (!value) return
      if (!result.destination) {
        return;
      }
  
      onChange(reorder(
        value,
        result.source.index,
        result.destination.index
      ), field.id) 
    }}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={getListStyle(snapshot.isDraggingOver)}
          >
            {(value ?? []).map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided, snapshot) => (
                  <Grid container alignItems="center" justifyContent="space-between"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item}
                    <DragIndicatorIcon color="primary" />
                  </Grid>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>

    <Typography color="primary" style={{ marginTop: 3 }}>
      Drag and drop to re-order the above options
    </Typography>

    {/* <Typography>Least</Typography> */}
    </Grid>
  )
}

const CustomDateInput = forwardRef((props: TextFieldProps, ref) => <TextField fullWidth inputRef={ref} {...props} />)
export const DateInput = ({ 
  field, value, onChange, placement='top', ...props 
} : {
  field: FormField,
  placement?: 'top' | 'right' | 'bottom' | 'left'
} & FormInputProps<'date'> & Styled) => {
  const inputRef = useRef(null);

  return (
    <DatePicker // wrap in item to prevent movement on focused
      selected={value}
      onChange={(d: Date) => onChange?.(d, field.id)}
      showTimeSelect
      required={!field.isOptional}
      dateFormat="Pp"
      autoComplete="off"
      timeIntervals={15} // 30 is default
      popperPlacement={placement}
      customInput={<CustomDateInput inputRef={inputRef} {...props} />}
      // className={css`width: 100%;`}
      className={css`${datepickerCSS}`}
    />
  )
}

export const TableInput = ({ field, value=[], onChange, ...props }: FormInputProps<'Input Table'>) => {
  const choices = field.options?.tableChoices

  const handleNewRow = useCallback(() => {
    if (!choices?.length) return

    onChange(
      [...value, choices.map(c => ({
        label: c.label,
        entry: '',
      }))], 
      field.id, 
      true
    )
  }, [value, field.id])

  const handleChange = useCallback((r: number, c: number, u: { entry: string, label: string }) => {
    onChange(
      value.map((v, _i) => 
        _i !== r 
          ? v
          : v.map((e, _c) => _c === c ? u : e)
      ),
      field.id,
      true,
    )
  }, [value, onChange, field.id])

  const handleRemove = useCallback((i: number) => {
    onChange(
      value.filter((_, _i) => i !== _i),
      field.id,
      true,
    )
  }, [value,onChange, field.id])

  useEffect(() => {
    if (field.isOptional) return
    if (value.length) return

    handleNewRow()
  }, [field.isOptional, value, handleNewRow])

  if (!choices?.length) {
    return <Typography color="error">No input choices available</Typography>
  }

  const length = choices.length || 1
  const iconWidth = '35px'
  const width = `calc(${(100 / length).toFixed(2)}% - calc(${iconWidth} / ${length}))`

  return (
    <Grid container direction="column">
      {value.map((row, i) => (
        <>
        <Grid container alignItems="center" key={i} spacing={1}>
          {choices.map((v, columnIndex) => (
            <Grid item key={v.label} sx={{ width }}>
              {v.type === 'Text'
                ? (
                  <TextField label={v.label} size="small" fullWidth
                    value={row.find((c, _i) => columnIndex === _i)?.entry} 
                    onChange={e => handleChange(i, columnIndex, { label: v.label, entry: e.target.value })}
                  />
                )
              : v.type === 'Date' ? (
                <DateStringInput label={v.label} size="small" fullWidth
                  field={field}
                  value={row.find((c, _i) => columnIndex === _i)?.entry} 
                  onChange={(entry='') => handleChange(i, columnIndex, { label: v.label, entry })}
                />
              )
              : v.type === 'Select' ? (
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small">{v.label}</InputLabel>
                    <Select label={v.label} size="small"
                      value={row.find((c, _i) => columnIndex === _i)?.entry} 
                      onChange={e => handleChange(i, columnIndex, { label: v.label, entry: e.target.value })}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {v.info.choices.map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              : null
              } 
            </Grid>
          ))}

          <Grid item sx={{ ml: 'auto', width: iconWidth }}>
            <LabeledIconButton Icon={CancelIcon} label="Remove" onClick={() => handleRemove(i)} 
              disabled={!field.isOptional && value.length === 1}
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{ my: 1 }} />
        </>
      ))}

      <Button variant="outlined" size="small" onClick={handleNewRow} sx={{ width: 200 }}>
        Add new entry
      </Button>
    </Grid>
  )
}

export const AutoFocusTextField = (props: TextFieldProps) => (
  <TextField {...props} />
)

const CustomDateStringInput = forwardRef((props: TextFieldProps, ref) => <TextField fullWidth inputRef={ref} {...props} />)
export const DateStringInput = ({ field, value, onChange, ...props }: FormInputProps<'string'>) => {
  const inputRef = useRef(null);

  // if (value && isDateString(value)) {
  //   console.log(value, new Date(
  //     new Date(MM_DD_YYYY_to_YYYY_MM_DD(value)).getTime()
  //   + (new Date().getTimezoneOffset() * 60 * 1000)
  //   ))
  // }
  return (
    field.options?.useDatePicker
      ? (
        <DatePicker // wrap in item to prevent movement on focused
          selected={
            (value && isDateString(value))
              ? new Date(
                  new Date(MM_DD_YYYY_to_YYYY_MM_DD(value)).getTime()
                + (new Date().getTimezoneOffset() * 60 * 1000)
              )
              : undefined
          }
          onChange={(d: Date) => onChange?.(mm_dd_yyyy(d), field.id)}
          showTimeSelect={false}
          required={!field.isOptional}
          autoComplete="off"
          dateFormat={"MM-dd-yyyy"}
          customInput={<CustomDateStringInput inputRef={inputRef} {...props} />}
          // className={css`width: 100%;`}
          className={css`${datepickerCSS}`}
        />
      )
      : (
        <AutoFocusTextField {...props} required={!field.isOptional} fullWidth placeholder="MM-DD-YYYY" value={value}
          onChange={e => {
            const v = e.target.value || ''
            onChange(
              (
                v.length === 2 && /\d{2}/.test(v) && value?.length !== 3 // allow deletion
                  ? v + '-'
              : v.length === 5 && /\d{2}-\d{2}/.test(v) && value?.length !== 6 // allow deletion
                  ? v + '-'
                  : v
              )
              .replaceAll('/', '-'), 
              field.id
            )
          }}
        />
      )
  )
}
export const StringInput = ({ field, value, form, onChange, ...props }: FormInputProps<'string'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth value={value} onChange={e => onChange(e.target.value, field.id)} 
    placeholder={field.placeholder || form_display_text_for_language(form, "Answer here...", '')} 
  />
)
export const StringLongInput = ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => (
  <AutoFocusTextField {...props} multiline minRows={3} maxRows={8} required={!field.isOptional} fullWidth value={value} onChange={e => onChange(e.target.value, field.id)}  
    placeholder={field.placeholder || form_display_text_for_language(form, "Answer here...", '')} 
  />
)

export const PhoneInput = ({ field, value, onChange, form, ...props }: FormInputProps<'phone'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth value={value} onChange={e => onChange(e.target.value, field.id)} 
    placeholder={field.placeholder || form_display_text_for_language(form, "Enter phone...", '')}
  />
)

export const EmailInput = ({ field, value, onChange, form, ...props }: FormInputProps<'email'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth type="email" value={value} onChange={e => onChange(e.target.value, field.id)} 
    placeholder={field.placeholder || form_display_text_for_language(form, "Enter email...", '')}
  />
)

export const NumberInput = ({ field, value, onChange, form, ...props }: FormInputProps<'number'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth type="number" value={value} onChange={e => onChange(parseInt(e.target.value), field.id)}  
    placeholder={field.placeholder || form_display_text_for_language(form, "Enter a number...", '')}
  />
)



const StringSelector = ({ options, value, onChange, ...props } : {
  options: string[]
  value: string,
  onChange: (v: string) => void,
  label?: string,
  size?: "small",
}) => (
  <FormControl fullWidth size={props.size}>
    <InputLabel>{props.label}</InputLabel>
    <Select {...props} value={value} onChange={e => onChange(e.target.value)} fullWidth>
    {options.map((o, i) => (
      <MenuItem value={o} key={o || i}>{o}</MenuItem>
    ))}
    </Select>
  </FormControl>
)

const HourSelector = (props : { value: string, onChange: (v: string) => void })  => (
  <StringSelector {...props} 
    options={Array(12).fill('').map((_, i) => (i + 1) <= 9 ? `0${i + 1}` : (i + 1).toString())} 
  />
)
const MinuteSelector = (props : { value: string, onChange: (v: string) => void })  => (
  <StringSelector {...props}
    options={Array(60).fill('').map((_, i) => i <= 9 ? `0${i}` : i.toString())} 
  />
)
const AmPmSelector = (props : { value: string, onChange: (v: string) => void })  => (
  <StringSelector {...props} options={['AM', 'PM']} />
)

export const TimeInput = ({ field, value, onChange, ...props }: FormInputProps<'string'>) => { 
  const [hour, rest=''] = (value || '').split(':')
  const [minute, amPm, zone=getLocalTimezone()] = rest.split(' ')

  return (
    <Grid container alignItems='center' spacing={1}>
      <Grid item sx={{ width: 100 }}>
        <HourSelector value={hour} 
          onChange={hour => onChange(`${hour}:${minute} ${amPm} ${zone}`, field.id)}
        />
      </Grid>

      <Grid item sx={{ width: 100 }}>
        <MinuteSelector value={minute} 
          onChange={minute => onChange(`${hour}:${minute} ${amPm} ${zone}`, field.id)} 
        />
      </Grid>

      <Grid item sx={{ width: 100 }}>
        <AmPmSelector value={amPm} 
          onChange={amPm => onChange(`${hour}:${minute} ${amPm} ${zone}`, field.id)}
        />
      </Grid>
    </Grid>
  )
}

export const AddressInput = ({ field, value, onChange, ...props }: FormInputProps<'Address'>) => (
  <Grid container direction="column" spacing={2}>
    <Grid item>
    <AutoFocusTextField {...props} size="small" label="Address Line 1" required={!field.isOptional} fullWidth 
      value={value?.addressLineOne ?? ''} 
      placeholder="Address Line 1" 
      onChange={e => 
        onChange({
          ...value as any,
          addressLineOne: e.target.value ?? '',
        }, 
        field.id
      )} 
    />
    </Grid>

    <Grid item>
    <TextField {...props} size="small" label="Address Line 2" required={false} fullWidth 
      value={value?.addressLineTwo ?? ''} 
      placeholder="Address Line 2" 
      onChange={e => 
        onChange({
          ...value as any,
          addressLineTwo: e.target.value ?? '',
        }, 
        field.id
      )} 
    />
    </Grid>

    <Grid item>
    <Grid container alignItems="center" justifyContent={"space-between"} spacing={1}>
      <Grid item sx={{ width: "calc(100% - 275px)"}}>
        <TextField {...props} size="small" label="City" required={!field.isOptional} 
          fullWidth
          value={value?.city ?? ''} 
          placeholder="City" 
          onChange={e => 
            onChange({
              ...value as any,
              city: e.target.value ?? '',
            }, 
            field.id
          )} 
        />
      </Grid>

      <Grid item>
        <Autocomplete value={value?.state}
          options={VALID_STATES}
          sx={{ width: 100 }}
          disablePortal
          onChange={(e, v) => v && 
            onChange({
              ...value as any,
              state: v ?? '',
            }, 
            field.id
          )}
          renderInput={(params) => <TextField {...params} size={'small'} label={"State"} required={!field.isOptional}  />}
          {...props}
        />
      </Grid>

      <Grid item>
        <TextField {...props} size="small" label="ZIP Code" required={!field.isOptional} 
          sx={{ width: 150 }}
          value={value?.zipCode ?? ''} 
          placeholder="ZIP Code" 
          onChange={e => 
            onChange({
              ...value as any,
              zipCode: e.target.value ?? '',
            }, 
            field.id
          )} 
        />
      </Grid>
    </Grid>
    </Grid>
  </Grid>
)

export const SignatureInput = ({ value, field, autoFocus=true, onChange }: FormInputProps<'signature'>) => {
  const handleConsentChange = () => {
    const newConsent = !value?.signed

    onChange({
      pdfAttachment: field.options?.pdfAttachment,
      fullName: value?.fullName ?? '',
      signed: newConsent,
      url: field.options?.signatureUrl,
    }, field.id)
  }

  const handleNameChange = (newName: string) => {
    onChange({
      pdfAttachment: field.options?.pdfAttachment,
      signed: value?.signed ?? false,
      fullName: newName,
      url: field.options?.signatureUrl,
    }, field.id)
  }

  return (
    <Grid container alignItems="center">
      {field.options?.pdfAttachment &&
        <PdfViewer url={getPublicFileURL({ businessId: field.businessId, name: field.options.pdfAttachment })} />
      }
      {!field.options?.pdfAttachment && field.options?.signatureUrl &&
        <Grid container direction="column" sx={{ mb:  2 }}>
          <iframe src={field.options.signatureUrl} 
            style={{ 
              border: 'none',
              height: 400,
              width: '100%',
              marginBottom: '5px'
            }}
          />
          <a href={field.options.signatureUrl} target="_blank" rel="noopener noreferrer">
            View document in new tab
          </a>
        </Grid>
      }

      <Grid item xs={12}> 
        <Checkbox
          style={{ margin: 0, marginTop: 5, padding: 0, paddingRight: 3 }}
          color="primary"
          checked={!!value?.signed} // make sure to coerce to boolean to enforce controlled
          onClick={() => handleConsentChange()}
          inputProps={{ 'aria-label': 'consent to e-signature checkbox' }}
        />
        <Typography component="span" style={{ position: 'relative', top: 5, left: 2 }}> 
          I consent to 
          use <a href="/e-signature-terms" target="_blank" rel="noopener noreferrer"> electronic signatures </a>
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 12 }}>
        <TextField disabled={!value?.signed} autoFocus={autoFocus}
          style={{ width: '100%'}}
          size="small"
          aria-label="Full Name"
          value={value?.fullName} 
          placeholder="Full Name" variant="outlined" 
          onChange={e => handleNameChange(e.target.value)}
        />
        <Typography color="primary" style={{ fontSize: 15, marginTop: 2 }}> 
          Enter your legal full name to complete the signature
        </Typography>
      </Grid>
    </Grid>
  )
}

export async function convertHEIC (file: FileBlob | string){
  // get image as blob url
  let blobURL = (
    typeof file === 'string' ? file : URL.createObjectURL(file)
  );
  
  // convert "fetch" the new blob url
  let blobRes = await fetch(blobURL)

  // convert response to blob
  let blob = await blobRes.blob()

  // convert to PNG - response is blob
  let conversionResult = await heic2any({ blob })

  // convert to blob url
  var url = URL.createObjectURL(Array.isArray(conversionResult) ? conversionResult[0] : conversionResult);

  return url
};

const value_is_image = (f?: FileBlob)=> f?.type?.includes('image')
export const FileInput = ({ value, onChange, field, existingFileName }: FormInputProps<'file'> & { existingFileName?: string }) => {
  const [error, setError] = useState('')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: useCallback(
      acceptedFiles => {
        const file = acceptedFiles.pop()
        if (!file) return

        if (field.options?.validFileTypes?.length) {
          const match = field.options.validFileTypes.find(t => file.type.includes(t.toLowerCase()))
          if (!match) {
            return setError(`File must have type: ${field.options.validFileTypes.join(', ')}`)
          }
        }

        setError('')
        onChange(file, field.id)
      }, [onChange, field.options?.validFileTypes]
    ),
  })

  const [preview, setPreview] = useState('')
  useEffect(() => {
    if (!value_is_image(value)) return
    if ((value.type.includes('heif') || value.type.includes('heic'))) {
      convertHEIC(value).then(setPreview).catch(console.error)
      return
    }
    setPreview(URL.createObjectURL(value))
  }, [value])

  // console.log(document.createElement('input').capture )
  return (
    <Grid container direction="column">
    <Grid container {...getRootProps()} sx={{
      width: "100%",
      border: "1px dashed #000000",
      borderRadius: 10,
      padding: (preview && !isDragActive) ? 0 : 6,
      '&:hover': {
        border: `1px solid ${PRIMARY_HEX}`,
        cursor: 'pointer',
      }
    }}
      alignItems="center" justifyContent="center">
      <input {...getInputProps({ multiple: false })}  />
      {
        <p> 
        {   isDragActive ? "Drop to select file"
          : value        
            ? (
              preview 
                ? <img src={preview} style={{ paddingLeft: '10%', width : '80%', maxHeight: 200 }} />
                : `${truncate_string(value.name, { length: 30, showEllipsis: true })} selected!`
            )
            : capture_is_supported()
              ? (
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    <AddPhotoAlternateIcon color="primary" /> 
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: 14, textAlign: 'center' }}>
                      Select file or take picture
                    </Typography>
                  </Grid>
                </Grid>
              )
              : "Select a File"
          }
        </p> 
      }
    </Grid>
    
    <Grid item alignSelf="center" sx={{ mt: 0.5 }}>
      {(!value?.name && existingFileName) && 
        <Typography>{existingFileName} selected!</Typography>
      }
    </Grid>
    {error && 
      <Grid item alignSelf="center" sx={{ mt: 0.5 }}>
        <Typography color="error">{error}</Typography>
      </Grid>
    }
    </Grid>
  ) 
}

export const FilesInput = ({ value, onChange, field, existingFileName }: FormInputProps<'files'> & { existingFileName?: string }) => {
  const [error, setError] = useState('')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: useCallback(
      acceptedFiles => {
        for (const file of acceptedFiles) {
          if (field.options?.validFileTypes?.length) {
            const match = field.options.validFileTypes.find(t => file.type.includes(t.toLowerCase()))
            if (!match) {
              return setError(`File must have type: ${field.options.validFileTypes.join(', ')}`)
            }
          }  
        }

        setError('')
        onChange([...(value ?? []), ...acceptedFiles], field.id)
      }, [onChange, value, field.options?.validFileTypes]
    ),
  })

  // const previews = useMemo(() => (
  //   // @ts-ignore
  //   value?.filter(value_is_image).map(URL.createObjectURL)
  // ), [value])

  return (
    <Grid container direction="column">
    <Grid container {...getRootProps()} sx={{
      width: "100%",
      border: "1px dashed #000000",
      borderRadius: 10,
      padding: 2,
      '&:hover': {
        border: `1px solid ${PRIMARY_HEX}`,
        cursor: 'pointer',
      }
    }}
      alignItems="center" justifyContent="center">
      <input {...getInputProps({ multiple: false })}  />
      {
        <p> 
        {isDragActive 
          ? "Drop to select files"
          : capture_is_supported()
            ? (
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <AddPhotoAlternateIcon color="primary" /> 
                </Grid>
                <Grid item>
                  <Typography sx={{ fontSize: 14, textAlign: 'center' }}>
                    Select files or take pictures
                  </Typography>
                </Grid>
              </Grid>
            )
            : "Select Files"
          // preview 
          //   ? <img src={preview} style={{ paddingLeft: '10%', width : '80%', maxHeight: 200 }} />
          //   : `${truncate_string(value.name, { length: 30, showEllipsis: true })} selected!`
        }
        </p> 
      }
    </Grid>

    {/* <Grid container sx={{ mt: 1 }} spacing={1}>
    {previews?.map((preview, i) => (
      <Grid item key={i} style={{ maxWidth: '25%', maxHeight: 75, height: '100%' }}>
        <img src={preview} style={{ maxWidth: '25%', maxHeight: 75, height: '100%' }}/>
      </Grid>
    ))}
    </Grid> */}

    <Grid container direction="column" sx={{ overflowY: 'auto', maxHeight: '250px', mt: 1 }} wrap="nowrap">
    {value?.map((file, i) => (
      <Grid item key={i} sx={{ mt: 0.5 }}>
      <Grid container alignItems="center" justifyContent={"space-between"} wrap="nowrap">
        <Grid item>
        <Grid container alignItems="center">
          <Typography sx={{ mr: 1 }}>
            {file.name}
          </Typography>

          {file.type?.includes('image') &&
            <Grid item>
               <img 
                // @ts-ignore
                src={URL.createObjectURL(file)} 
                style={{ maxWidth: '45%', maxHeight: 80, height: '100%' }}
              />
            </Grid>
          }
        </Grid>
        </Grid>

        <Grid item>
          <LabeledIconButton label="Remove"
            Icon={Delete}
            onClick={() => onChange(value.filter((f, _i) => i !== _i), field.id)}
          />
        </Grid>
      </Grid>
      </Grid>
    ))}
    </Grid>
    
    {error && 
      <Grid item alignSelf="center" sx={{ mt: 0.5 }}>
        <Typography color="error">{error}</Typography>
      </Grid>
    }
    </Grid>
  ) 
}

const multipleChoiceItemSx: SxProps = {
  border: '1px solid #888888',
  borderRadius: 2.5,
  mb: 0.5,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}

export const MultipleChoiceInput = ({ field, value: _value, onChange }: FormInputProps<'multiple_choice'>) => {
  const value = typeof _value === 'string' ? [_value] : _value // if loading existingResponses, allows them to be a string
  const { choices, radio, other } = field.options as MultipleChoiceOptions

  // current other string
  const enteringOtherStringRef = React.useRef('') // if typing otherString as prefix of a checkbox value, don't auto-select
  const otherString = value?.find(v => v === enteringOtherStringRef.current || !(choices ?? [])?.find(c => c === v)) ?? ''

  return (
    <Grid container alignItems="center">
      {radio
        ? (
          <FormControl fullWidth>
            <FormLabel id={`radio-group-${field.id}-label`}>Select One</FormLabel>
            <RadioGroup
              aria-labelledby={`radio-group-${field.id}-label`}
              defaultValue="female"
              name={`radio-group-${field.id}`}
            >
            {(choices ?? []).map((c, i) => 
              <FormControlLabel key={i} color="primary" label={c}
                sx={multipleChoiceItemSx}
                style={{ marginLeft: '0px' }} // fixes alignment with Select One text
                checked={!!value?.includes(c) && c !== otherString} // coerce to boolean to keep as controlled input
                onChange={() => onChange(
                  (
                    value?.includes(c)
                      ? (
                        radio 
                          ? []
                          : value.filter(v => v !== c)
                      )
                      : (
                        radio
                          ? [c]
                          : [...(value ?? []), c]
                      )
                  ),
                  field.id,
                )} 
                control={<Radio />}
              />
            )} 
            </RadioGroup>
          </FormControl>
        ) : (
          (choices ?? []).map((c, i) => (
            <Grid xs={12} key={i}  
              onClick={() => onChange(
                (
                  value?.includes(c)
                    ? (
                      radio 
                        ? []
                        : value.filter(v => v !== c)
                    )
                    : (
                      radio
                        ? [c]
                        : [...(value ?? []), c]
                    )
                ),
                field.id,
              )}
            >
            <Grid container alignItems="center" sx={multipleChoiceItemSx}>
              <Checkbox
                color="primary"
                checked={!!value?.includes(c) && c !== otherString} // coerce to boolean to keep as controlled input
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <Typography component="span"> {c} </Typography>
            </Grid>
            </Grid>
          ))
        )
      }
      {other &&
        <Grid item xs={12}>
          <TextField // className={classes.textField}
            style={{ marginLeft: 10 }}
            size="small"
            aria-label="Other"
            value={otherString} 
            placeholder="Other" variant="outlined" 
            // onClick={() => !otherChecked && handleOtherChecked()} // allow click to enable when disabled
            onChange={e => {
              enteringOtherStringRef.current = e.target.value

              onChange(
                (
                  radio 
                    ? (
                      e.target.value.trim()
                        ? [e.target.value]
                        : []
                    )
                    : (
                      e.target.value.trim()
                        // remove existing other string (if exists) and append new one
                        ? [...(value ?? []).filter(v => v !== otherString), e.target.value]
                        : value?.filter(v => v !== otherString)
                    )
                ),
                field.id,
              )
            }}
          />
        </Grid>  
      }
    </Grid>
  )
}

export const StripeInput = ({ field, value, onChange, setCustomerId }: FormInputProps<'Stripe'> & { 
  setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>,
}) => {
  const session = useResolvedSession()
  const [clientSecret, setClientSecret] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe>>()
  const [, { findById: findProduct }] = useProducts({ dontFetch: true })

  const fetchRef = useRef(false)
  useEffect(() => {
    if (fetchRef.current) return
    if (value && (session.userInfo as any)?.stripeCustomerId) {
      return setCustomerId(c => c ? c : (session.userInfo as any)?.stripeCustomerId) // already paid or saved card
    }
    fetchRef.current = true

    session.api.form_responses.stripe_details({ fieldId: field.id })
    .then(({ clientSecret, publishableKey, stripeAccount, businessName, customerId }) => {
      setClientSecret(clientSecret)
      setStripePromise(loadStripe(publishableKey, { stripeAccount }))
      setBusinessName(businessName)
      setCustomerId(customerId)
    })
    .catch(console.error)
  }, [session, value, field.id])

  const cost = (
    (field.options?.productIds || []).map(id => findProduct(id, { batch: false })) // seems to be having issues with bulk read
    .reduce((t, p) => t + (p?.cost?.amount || 0), 0)
  )

  if (value) {
    return (
      <Grid container alignItems="center" wrap="nowrap">
        <CheckCircleOutline color="success" />

        <Typography sx={{ ml: 1, fontSize: 20 }}>
          {field.options?.chargeImmediately ? 'Your purchase was successful' : "Your payment details have been saved!"}
        </Typography>
      </Grid>
    )
  }
  if (!(clientSecret && stripePromise)) return <LinearProgress />
  return (
    <Elements stripe={stripePromise} options={{
      clientSecret,
    }}>
      <StripeForm businessName={businessName} onSuccess={() => onChange('Saved card details', field.id)} 
        cost={cost}
        field={field}
      />
    </Elements>
  )
}

const StripeForm = ({ businessName, onSuccess, field, cost } : { businessName: string, onSuccess: () => void, field: FormField, cost: number }) => {
  const stripe = useStripe();
  const elements = useElements()

  const [ready, setReady] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event?.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    const {error} = await (field.options?.chargeImmediately ? stripe.confirmPayment : stripe.confirmSetup)({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: { 
        return_url: window.location.href, 
      },
      redirect: 'if_required', //  ensures the redirect url won't be used, unless the Bank redirect payment type is enabled (it's not, just card)
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error?.message ?? '');
    } else {
      onSuccess()
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={() => setReady(true)} 
        options={{
          business: { name: businessName },
        }}
      />
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 1 }}
        disabled={!(stripe && ready)}
      >
        {field.options?.chargeImmediately ? 'Make Payment' : 'Save Payment Details'}
      </Button>

      {cost > 0 && 
        <Typography sx={{ mt: 0.5 }}>
          You will be charged ${(cost / 100).toFixed(2)} {field.options?.chargeImmediately ? '' : 'on form submission'}
        </Typography>
      }

      {/* Show error message to your customers */}
      {errorMessage && 
        <Typography color="error" sx={{ mt: 0.5 }}>
          {errorMessage}
        </Typography>
      }
    </form>
  )
}

export const Progress = ({ numerator, denominator, style } : { numerator: number, denominator: number } & Styled) => (
  <Box sx={{ display: 'flex', alignItems: 'center', ...style }}>
    <Box sx={{ width: '100%', mr: 1 }}>
      <LinearProgress variant="determinate" style={{ height: '10px' }} 
        value={(numerator / (denominator || 1)) * 100} 
      />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">
        {(numerator / (denominator || 1) * 100).toFixed(0)}%
      </Typography>
    </Box>
  </Box>
)

export const DropdownInput = ({ field, value, onChange }: FormInputProps<'Dropdown'>) => {
  const [typing, setTyping] = useState('')

  // this should run only once, even if the field updates but the id is unchanged, otherwise will overwrite input
  const typingRef = useRef('')
  useEffect(() => {
    if (typingRef.current === field.id) return
    typingRef.current = field.id

    setTyping('')
  }, [field])

  return (
    <Autocomplete id={field.id} style={{ marginTop: 5 }}
      multiple={!field.options?.radio}
      freeSolo={!!field.options?.other}
      value={
        field.options?.radio
          ? (value?.[0] ?? '')
          : (value ?? [])
      }
      onChange={(_, v) => (
        onChange(
          (typeof v === 'string' || v === null) ? [v ?? ''] : v, 
          field.id
        )
      )}
      options={field.options?.choices ?? []}
      inputValue={
        field.options?.radio && Array.isArray(value) && value[0]
          ? value[0]
          : typing
      }
      onInputChange={(e, value) => setTyping(value)}
      renderInput={params => 
        <TextField {...params}
          onChange={e => (
            (field.options?.radio && field.options.other)
              ? onChange(e.target.value ? [e.target.value] : [], field.id)
              : undefined
          )}
          label={
            (!field.options?.radio && field.options?.other)
              ? "Press enter to save a custom value"
              : ''
          } 
        />
      }
    />
  )
}

const choicesForDatabase: {
  [index: string]: {
    done: boolean,
    records: DatabaseRecord[],
    lastId?: string,
  } | {
    done: undefined,
    records: undefined,
    lastId?: string,
  }
} = {}

const LOAD_CHOICES_LIMIT = 500
const useDatabaseChoices = ({ databaseId='', field } : { databaseId?: string, field: FormField }) => {
  const session = useResolvedSession()
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    if (choicesForDatabase[databaseId]?.done) return
    if (renderCount > 10) return // limit to 5000 entries / prevent infinite looping
    const choices = choicesForDatabase[databaseId]?.records ?? []
    const lastId = choicesForDatabase[databaseId]?.lastId

    session.api.form_fields.load_choices_from_database({
      fieldId: field.id,
      lastId,
      limit: LOAD_CHOICES_LIMIT,
    })
    .then(({ choices: newChoices }) => {
      choicesForDatabase[databaseId] = {
        lastId: newChoices?.[newChoices.length - 1]?.id,
        records: [...choices, ...newChoices]
          .sort((c1, c2) => (
            label_for_database_record(field, c1)
            .localeCompare(label_for_database_record(field, c2))
          )
        ),
        done: newChoices.length < LOAD_CHOICES_LIMIT, 
      } 
      setRenderCount(r => r + 1)
    })
    .catch(err => {
      console.error(err)
    })
  }, [session, field, databaseId, renderCount])

  return {
    doneLoading: choicesForDatabase[databaseId]?.done ?? false,
    choices: choicesForDatabase[databaseId]?.records ?? [],
    renderCount,
  }
}


const label_for_database_record = (field: FormField, record?: DatabaseRecord) => !record ? '' : (
  (record.values.find(v => v.label === field.options?.databaseLabel)?.value?.toString() ?? '')
  + (
    field.options?.databaseLabels?.length
      ? ` (${field.options.databaseLabels!.map(l => record.values.find(v => v.label === l)?.value?.toString()).join(', ')})`
      : ''
  ) 
)

export const DatabaseSelectInput = ({ field, value, onChange, onDatabaseSelect, responses }: FormInputProps<'Database Select'> & {
  responses: FormResponseValue[],
}) => {
  const { choices, doneLoading } = useDatabaseChoices({ 
    databaseId: field.options?.databaseId,
    field,
  })

  const filterResponse = useMemo(() => (
    field.options?.databaseFilter?.fieldId
      ? responses.find(r => r.fieldId === field.options?.databaseFilter?.fieldId)?.answer?.value
      : undefined
  ), [responses, field.options?.databaseFilter])

  const filteredChoicesWithPotentialDuplicates = useMemo(() => {
    if (!choices) return []
    if (!filterResponse) return choices
    if (!field?.options?.databaseFilter?.databaseLabel)
    if (!value || value.length === 0) return choices

    return (
      choices
      .filter(c => {
        const v = c.values.find(_v => _v.label === field.options?.databaseFilter?.databaseLabel)?.value
        if (!v) return true

        if (typeof v === 'object') {
          return !!(
            Object.values(v).find(oVal => (
              typeof oVal === 'string' || typeof oVal === 'number'
                ? (
                  Array.isArray(filterResponse)
                    ? (filterResponse as any[]).find(r => r === oVal.toString())
                : (typeof filterResponse === 'string' || typeof filterResponse === 'number')
                    ? filterResponse.toString() === oVal.toString()
                    : false
                )
                : false
            ))
          )
        }

        if (typeof v === 'string' || typeof v === 'number') {
          return !!(
            Array.isArray(filterResponse)
              ? (filterResponse as any[]).find(r => r === v.toString())
          : (typeof filterResponse === 'string' || typeof filterResponse === 'number')
              ? filterResponse.toString() === v.toString()
              : false
          )
        }
        
        return false
      })
    )
  }, [choices, filterResponse, field.options?.databaseFilter, value])

  const filteredChoices = useMemo(() => {
    const filtered: typeof filteredChoicesWithPotentialDuplicates = [] 

    const uniques = new Set<string>([])
    for (const c of filteredChoicesWithPotentialDuplicates) {
      const text = label_for_database_record(field, c)
      if (uniques.has(text)) continue // duplicate found

      uniques.add(text)
      filtered.push(c)
    }

    return filtered
  }, [field, filteredChoicesWithPotentialDuplicates])

  if (!doneLoading) return <LinearProgress />
  return (
    <Autocomplete id={field.id} freeSolo={false}
      options={filteredChoices} multiple={true}
      getOptionLabel={o => (
        Array.isArray(o) // edge case
          ? ''
          : label_for_database_record(field, o)
      )}
      value={
        (value?.map(v => choices.find(c => c.id === v.recordId))?.filter(v => v!) ?? []) as DatabaseRecord[]
      }
      onChange={(_, v) => {
        if (v.length && onDatabaseSelect) {
          onDatabaseSelect(v[0])
        }
        return onChange(
          (
            !field.options?.radio
              ? v.map(_v => ({
                  databaseId: field.options?.databaseId!,
                  recordId: _v.id,
                  text: label_for_database_record(field, _v),
                }))
              : [{
                databaseId: field.options?.databaseId!,
                recordId: v[v.length -1]?.id ?? '',
                text: label_for_database_record(field, v[v.length - 1]),
              }]
          ),
          field.id,
        )
      }}
      renderInput={params => <TextField {...params} />}
    />
  )
}

type DisplayTermsResult = { displayTermsList: { term: string[] } }
type Drug = {
  rxcui: string,
  name: string,
  synonym?: string,
}
let displayTermsCache = undefined as DisplayTermsResult | undefined
const DRUGS_FOR_DISPLAY_TERM = {} as Record<string, Drug[]>
const RX_NORM_CODE_FOR_DRUG = {} as Record<string, string>
const NDC_CODES_FOR_RX_NORM_CODE = {} as Record<string, string[]>

const useMedications = () => {
  const [displayTerms, setDisplayTerms] = useState(displayTermsCache)
  const fetchRef = useRef(displayTerms !== undefined)

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    // thankfully, this endpoint has cache control, so repeated requests should fetch from disk anyway
    axios.get('https://rxnav.nlm.nih.gov/REST/displaynames.json')
    .then(result => 
      setDisplayTerms({
        displayTermsList: {
          term: (
            result.data?.displayTermsList?.term?.filter(
              (t: string) => {
                try {
                  // parse out some of the not immediately useful / non-human-readable options
                  if (t.startsWith('(')) return false
                  if (t.startsWith('.')) return false
                  if (!isNaN(parseInt(t.charAt(0)))) return false // starts with a number

                  return true
                } catch(err) { return false }
              }
            )
          )
        }
      }) 
    )
    .catch(console.error)
  }, [])

  const getDrugsForDisplayTerm = useCallback(async (s: string) => {
    const drugs = DRUGS_FOR_DISPLAY_TERM[s] || (
      (
        await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${s}`)
      )
      .data?.drugGroup?.conceptGroup?.find((v: any) => v.conceptProperties)?.conceptProperties as Drug[]
    )
    if (!DRUGS_FOR_DISPLAY_TERM[s]) {
      DRUGS_FOR_DISPLAY_TERM[s] = drugs // cache for future lookups
    }

    return drugs
  }, [])

  const getCodesForDrug = useCallback(async (s: string) => {
    // console.log(
    //   (await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${s}&allsrc=1`)).data
    // )
    const rxNormCode = RX_NORM_CODE_FOR_DRUG[s] || (
      (
        await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${s}&allsrc=1`)
      )
      .data?.idGroup?.rxnormId?.[0] as string
    )
    RX_NORM_CODE_FOR_DRUG[s] = rxNormCode // cache for future lookups

    // console.log(
    //   `https://rxnav.nlm.nih.gov/REST/rxcui/${rxNormCode}/ndcs.json`,
    //   (await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxNormCode}/ndcs.json`)).data
    // )
    const NDCs = NDC_CODES_FOR_RX_NORM_CODE[rxNormCode] || (
      (
        await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxNormCode}/ndcs.json`)
      )
      .data?.ndcGroup?.ndcList?.ndc as string[] ?? []
    )
    NDC_CODES_FOR_RX_NORM_CODE[rxNormCode] = NDCs // cache for future lookups
  
    return {
      rxNormCode,
      NDCs,
    }
  }, [])

  if (displayTerms === undefined) {
    return {
      displayTerms: undefined,
      doneLoading: false,
      getDrugsForDisplayTerm,
      getCodesForDrug,
    }
  }
  return {
    displayTerms,
    doneLoading: true,
    getDrugsForDisplayTerm,
    getCodesForDrug,
  }
}

export const MedicationsInput = ({ field, value, onChange }: FormInputProps<'Medications'>) => {
  const { displayTerms, doneLoading, getCodesForDrug, getDrugsForDisplayTerm } = useMedications()
  const [drugs, setDrugs] = useState<Record<string, Drug[]>>({})
  
  // uncomment to load data after initial typing
  // const [query, setQuery] = useState('')

  // useEffect(() => {
  //   if (!value?.length) return

  //   Promise.all((value ?? []).map(v => (
  //     v.displayTerm ? getDrugsForDisplayTerm(v.displayTerm) : null
  //   )))
  //   .then(values => {
  //     const toSet: typeof drugs = {}
  //     values.forEach((v, i) => {
  //       toSet[value[i].displayTerm] = v ?? []
  //       if (!v?.length) {
  //         // drug is unknown, and previously looked-up NDCs and rxNormCode should be reset
  //         value[i].drugName = "Unknown"
  //         value[i].NDCs = []
  //         value[i].rxNormCode = ''
  //       }
  //     })

  //     setDrugs(toSet)
  //   })
  //   .catch(console.error)
  // }, [value, getDrugsForDisplayTerm])

  const filterOptions = useCallback((options: string[], { inputValue } : { inputValue: string }) => (
    inputValue
      ? (
        options
        .filter(o => o.toLowerCase().includes(inputValue.toLowerCase()))
        // show shorter matches first (tends to promote exact match and simpler medications)
        .sort((v1, v2) => v1.length - v2.length)
        // .reverse()
      ) : (
        options
      )
  ), [])

  return (
    <Grid container direction="column" sx={{ mt: 2 }}>
    {(value ?? []).map((v, i) => (
      <>
      <Grid item key={i}>
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item sx={{ width: '100%'}}>
        <Grid container direction="column">
          <Grid item>
          <Autocomplete freeSolo={false} multiple={false} loading={!doneLoading}
            options={
              // uncomment to load data after initial typing
              // query.length === 0 ? [] :
                (displayTerms?.displayTermsList?.term ?? [])
            }  
            // uncomment to load data after initial typing
            // noOptionsText={query.length === 0 ? "Start typing..." : undefined}
            // uncomment to load data after initial typing
            // inputValue={query} onInputChange={(e, v) => setQuery(v)}
            getOptionLabel={first_letter_capitalized}
            filterOptions={filterOptions}
            value={v.displayTerm}
            onChange={async (_, displayTerm) => {
              const drugs = displayTerm ? await getDrugsForDisplayTerm(displayTerm) : null

              if (displayTerm) {
                setDrugs((ds) => ({
                  ...ds,
                  [displayTerm]: drugs ?? [],
                }))
              }
              
              onChange(
                (value ?? []).map((_v, _i) => (
                  i === _i
                    ? { 
                      ..._v, 
                      displayTerm: displayTerm || '',
                      drugName: drugs?.length ? '' : "Unknown",
                      drugSynonym: '',
                      reasonForTaking: '',
                      dosage: {
                        unit: '',
                        value: '',
                        quantity: '',
                        frequency: '',
                      },
                      // reset these on new search term to avoid stale data
                      NDCs: [],
                      rxNormCode: '',
                    }
                    : _v
                )),
                field.id,
              )
            }}
            renderInput={params => 
              <TextField {...params} required={!field.isOptional} label="Search" size="small" fullWidth />
            }
          /> 
          </Grid>

          {v.displayTerm && v.drugName !== "Unknown" && !v.otherDrug &&
            <Grid item sx={{ mt: 1.5 }}>
              <Autocomplete freeSolo={false}
                options={
                  drugs[v.displayTerm]
                    ? drugs[v.displayTerm].length
                      ? drugs[v.displayTerm]
                      : [{ name: 'Unknown', rxcui: '' }]
                    : [] // still loading
                }
                multiple={false}
                getOptionLabel={d => d?.synonym ? d.synonym : (d?.name || '')}
                value={
                  [...drugs[v.displayTerm] ?? [], { name: "Unknown", rxcui: '' }]
                  .find(d => d.name === v.drugName) ?? null
                }
                onChange={async (_, drug) => {
                  if (!drug) return

                  const info = (
                    drug.name === 'Unknown' 
                      ? await getCodesForDrug(v.displayTerm) // might get us a value, better than searching Unknown or keeping a prior value
                      : await getCodesForDrug(drug.name)
                  )
                  onChange(
                    (value ?? []).map((_v, _i) => (
                      i === _i
                        ? { 
                          ..._v, 
                          drugName: drug.name,
                          drugSynonym: drug.synonym || '',
                          ...info,
                        }
                        : _v
                    )),
                    field.id,
                  )
                }}
                renderInput={params => 
                  <TextField {...params} required={!field.isOptional} label="Drug Select" size="small" fullWidth />
                }
              /> 
            </Grid>
          }

          {v.displayTerm && (v.drugName === "Unknown" || !v.drugName) && 
            <Grid item sx={{ mt: 1 }}>
              <TextField label='Other Drug' fullWidth size="small" required
                value={value?.find((v, _i) => _i === i)?.otherDrug ?? ''}
                onChange={e => (
                  onChange(
                    (value ?? []).map((_v, _i) => (
                      i === _i
                        ? { 
                          ..._v, 
                          otherDrug: e.target.value
                        }
                        : _v
                    )),
                    field.id,
                  )
                )} 
              />
            </Grid>
          }


          {v.displayTerm &&
            <Grid container spacing={1} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13.5 }}>
                  Units (e.g. capsule, table, puff) per dose?
                </Typography>
                <TextField type="number" size="small" fullWidth
                  value={v.dosage?.quantity}
                  onChange={e => 
                    onChange(
                      (value ?? []).map((_v, _i) => (
                        i === _i
                          ? { 
                            ..._v, 
                            dosage: {
                              ..._v.dosage!,
                              quantity: e.target.value,
                            },
                          }
                          : _v
                      )),
                      field.id,
                    )
                  }
                /> 
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13.5 }}>
                  How many times per <strong>day</strong>?
                </Typography>
                <StringSelector size="small"
                  options={["1", "2", "3", "4", "5", "6", "As Needed"]} 
                  value={v.dosage?.frequency ?? ''}
                  onChange={async (frequency) => {
                    onChange(
                      (value ?? []).map((_v, _i) => (
                        i === _i
                          ? { 
                            ..._v, 
                            dosage: {
                              ..._v.dosage!,
                              frequency: frequency || ''
                            }
                          }
                          : _v
                      )),
                      field.id,
                    )
                  }}
                />
              </Grid>
            </Grid>
          }

          {v.displayTerm &&
            <Grid item sx={{ mt: 1.25 }}>
              <TextField label="Reason for taking medication" size="small" fullWidth
                value={v.reasonForTaking ?? ''} 
                onChange={e => 
                  onChange(
                    (value ?? []).map((_v, _i) => (
                      i === _i
                        ? { 
                          ..._v, 
                          reasonForTaking: e.target.value,
                        }
                        : _v
                    )),
                    field.id,
                  )
                }
              />
            </Grid>
          }

          <Grid item>
            <Typography color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => onChange((value ?? []).filter((_, _i) => i !== _i), field.id)}
            >
              Remove medication
            </Typography>
          </Grid>

          {window.location.origin.includes(':300') && i === 0 &&
            <Grid item sx={{ mt: 3 }}>
              <strong>DEBUG:</strong> <br />
              <pre style={{ wordWrap: 'break-word' }}>
              {JSON.stringify(value ?? {}, null, 2)}
              </pre>
            </Grid>
          }

          <Grid item>
          <Grid container>

          </Grid>
          </Grid>
        </Grid>
        </Grid>
      </Grid>
      </Grid>

      <Grid item><Divider flexItem sx={{ my: 1 }} /></Grid>
      </>
    ))}

      <Grid item>
        <Button color="primary" variant="outlined" 
          onClick={() => onChange([...(value ?? []), { displayTerm: '', drugName: '' }], field.id)}
        >
          Add Medication
        </Button>
      </Grid>
    </Grid>
  )
}

export const contact_is_valid = (e: Partial<Enduser>) => {
  if (e.email) {
    try {
      emailValidator.validate()(e.email) 
    } catch(err) {
      return "Email is invalid"
    }
  } 
  if (e.phone) {
    try {
      phoneValidator.validate()(e.phone) 
    } catch(err) {
      return "Phone is invalid"
    }
  } 
  if (e.dateOfBirth && !isDateString(e.dateOfBirth)) {
    return "Date of birth is invalid"
  }
}

export const RelatedContactsInput = ({ field, value: _value, onChange, ...props }: FormInputProps<'Related Contacts'>) => {
  // safeguard against any rogue values like empty string
  const value = Array.isArray(_value) ? _value : []

  const [editing, setEditing] = useState(-1)

  if (value[editing]) {
    const { fname, lname, email, phone, fields={}, dateOfBirth='', relationships } = value[editing]
    const errorMessage = contact_is_valid(value[editing])

    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item xs={4}>
            <TextField label="First Name" size="small" fullWidth
              value={fname} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, fname: e.target.value } : v), field.id)}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Last Name" size="small" fullWidth
              value={lname} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, lname: e.target.value } : v), field.id)}
            />
          </Grid>

          <Grid item xs={4}>
            <StringSelector options={RELATIONSHIP_TYPES} label="Relationship" size="small"
              value={relationships?.[0]?.type ?? ''} 
              onChange={type => onChange(value.map((v, i) => i === editing ? { ...v, relationships: [{ type: type as EnduserRelationship['type'], id: '' /* to be filled on server-side */ }] } : v), field.id)}
            />
          </Grid>
        </Grid>
        </Grid>

        <Grid item>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item xs={4}>
            <DateStringInput value={dateOfBirth} field={{ ...field, isOptional: true }} size="small" label="Date of Birth"
              onChange={dateOfBirth => onChange(value.map((v, i) => i === editing ? { ...v, dateOfBirth } : v), field.id)}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Email" size="small" fullWidth type="email"
              value={email} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, email: e.target.value } : v), field.id)}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Phone Number" size="small" fullWidth
              value={phone} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, phone: e.target.value } : v), field.id)}
            />
          </Grid>
        </Grid>
        </Grid>

        {/* todo: refactor instead of copying from table input code? */}
        {(field.options?.tableChoices || []).length > 0 && 
          <Grid item>
          <Grid container spacing={1}>
          {(field.options?.tableChoices || []).map(({ info, label, type}) => (
            <Grid item xs={6}>
            {type === 'Text'
                ? (
                  <TextField label={label} size="small" fullWidth
                    value={fields[label] as string || ''} 
                    onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, fields: { ...fields, [label]: e.target.value} } : v), field.id)}
                  />
                )
                : type === 'Date' ? (
                  <DateStringInput label={label} size="small" fullWidth
                    field={field}
                    value={fields[label] as string || ''} 
                    onChange={(e='') => onChange(value.map((v, i) => i === editing ? { ...v, fields: { ...fields, [label]: e } } : v), field.id)}
                  />
                )
                : type === 'Select' ? (
                    <FormControl size="small" fullWidth>
                      <InputLabel id="demo-select-small">{label}</InputLabel>
                      <Select label={label} size="small"
                        value={fields[label] as string || ''} 
                        onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, fields: { ...fields, [label]: e.target.value } } : v), field.id)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {info.choices.map(c => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                : null
                }  
            </Grid>
          ))} 
          </Grid>
          </Grid>
        }

        <Grid item sx={{ my: 0.75 }}>
          <Button variant="outlined" onClick={() => setEditing(-1)} size="small">
            Save Contact
          </Button>
        </Grid>

        {errorMessage &&
          <Grid item>
            <Typography color="error">
              {errorMessage}
            </Typography>
          </Grid>
        }
      </Grid>
    )
  }

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
      {value.map((contact, i) => (
        <Grid item key={i}>
        <Grid container alignItems="center" justifyContent={"space-between"} wrap="nowrap" spacing={1}>
          <Grid item>
          <Grid container alignItems="center">
            <IconButton onClick={() => setEditing(i)} color="primary" size="small">
              <Edit />
            </IconButton>
            <Typography noWrap>
              {user_display_name(contact) || `Unnamed Contact ${i + 1}`}
            </Typography>
          </Grid> 
          </Grid> 

          <Grid item>
            <LabeledIconButton Icon={Delete} label="Remove" onClick={() => onChange(value.filter((v, _i) => i !== _i), field.id)} />
          </Grid> 
        </Grid> 
        </Grid>
      ))}
      </Grid>

      <Grid item>
        <Button variant="contained" onClick={() => {
          onChange([...value, {}], field.id, true)
          setEditing(value.length)
        }}>
          Add Contact
        </Button>
      </Grid>
    </Grid>
  )
}