import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { Autocomplete, Box, Button, Checkbox, Chip, CircularProgress, Collapse, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton as MuiIconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SxProps, TextField, TextFieldProps, Typography } from "@mui/material"
import { FormInputProps } from "./types"
import { useDropzone } from "react-dropzone"
import { CANVAS_TITLE, BRIDGE_TITLE, EMOTII_TITLE, INSURANCE_RELATIONSHIPS, INSURANCE_RELATIONSHIPS_CANVAS, PRIMARY_HEX, RELATIONSHIP_TYPES, TELLESCOPE_GENDERS } from "@tellescope/constants"
import { MM_DD_YYYY_to_YYYY_MM_DD, capture_is_supported, downloadFile, emit_gtm_event, first_letter_capitalized, form_response_value_to_string, format_stripe_subscription_interval, getLocalTimezone, getPublicFileURL, mm_dd_yyyy, object_is_empty, replace_enduser_template_values, responses_satisfy_conditions, truncate_string, update_local_storage, user_display_name } from "@tellescope/utilities"
import { Address, DatabaseSelectResponse, Enduser, EnduserRelationship, FormResponseValue, InsuranceRelationship, MedicationResponse, MultipleChoiceOptions, FormFieldOptionDetails, TellescopeGender, TIMEZONES_USA } from "@tellescope/types-models"
import { VALID_STATES, emailValidator, phoneValidator } from "@tellescope/validation"
import Slider from '@mui/material/Slider';
import LinearProgress from '@mui/material/LinearProgress';

import DatePicker from "react-datepicker";
import { datepickerCSS } from "./css/react-datepicker" // avoids build issue with RN
import { CancelIcon, FileBlob, IconButton, LabeledIconButton, LoadingButton, Styled, form_display_text_for_language, isDateString, useProducts, useResolvedSession } from ".."
import { CalendarEvent, DatabaseRecord, Form, FormField } from "@tellescope/types-client"
import { css } from '@emotion/css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import heic2any from "heic2any"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LanguageIcon from '@mui/icons-material/Language';

import { Elements, PaymentElement, useStripe, useElements, EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; 
import { CheckCircleOutline, Delete, Edit, ExpandMore } from "@mui/icons-material"
import { WYSIWYG } from "./wysiwyg"

// Bridge Eligibility - shared variable for storing most recent eligibility userIds
const bridgeEligibilityResult = {
  userIds: [] as string[],
}

export const getBridgeEligibilityUserIds = () => bridgeEligibilityResult.userIds
export const setBridgeEligibilityUserIds = (userIds: string[]) => {
  bridgeEligibilityResult.userIds = userIds
}

// Debounce hook for search functionality
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export const LanguageSelect = ({ value, ...props }: { value: string, onChange: (s: string) => void}) => (
  <Grid container alignItems="center" justifyContent={"center"} wrap="nowrap" spacing={1}>
    <Grid item>
      <LanguageIcon color="primary" />
    </Grid>

    <Grid item style={{ width: 150 }}>
      <StringSelector {...props} options={["English", "Español"]} size="small" 
        value={value === 'Spanish' ? 'Español' : value}
        label={
          (value === 'Español' || value === 'Spanish') ? 'Idioma' 
            : "Language"
        }
      />
    </Grid>
  </Grid>
)

export const defaultInputProps: { sx: SxProps } = { sx: { 
  borderRadius: 4,
  // boxShadow: '2px 2px 2px #00000033',
}} 
export const defaultButtonStyles: React.CSSProperties = {
  borderRadius: '10px',
}

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

  const step = field.options?.rangeStepSize || 1
  const allMarks = []
  for (let i=from; i<=to; i+=(step)) {
    allMarks.push({ value: i, label: i })
  }

  let marks = [...allMarks]
  while (marks.length > 25) {
    marks = marks.filter((_, i) => i%2 === 0)
  }

  return (
    <Slider min={from} max={to} step={step} marks={marks}
      valueLabelDisplay={marks.length < allMarks.length ? 'auto' : "off"} 
      value={value} 
      onChange={(e, v) => onChange(v as number, field.id)}
      sx={{
        '& .MuiSlider-thumb': value === undefined ? { display: 'none' } : {}, // Hide thumb until value is set
      }}
      key={field.id} // forces the actual value to be shown when two Rating questions are shown in a row and the value changes
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
export const RankingInput = ({ field, value, onChange, form }: FormInputProps<'ranking'>) => {
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
      {form_display_text_for_language(form, "Drag and drop to re-order the above options")}
    </Typography>

    {/* <Typography>Least</Typography> */}
    </Grid>
  )
}

const CustomDateInput = forwardRef((props: TextFieldProps, ref) => (
  <TextField InputProps={defaultInputProps}
    fullWidth inputRef={ref} {...props} 
  />
))
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

export const TableInput = ({ field, value=[], onChange, form, ...props }: FormInputProps<'Input Table'>) => {
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
    return <Typography color="error">{form_display_text_for_language(form, "No input choices available")}</Typography>
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
                  <TextField label={v.label} size="small" fullWidth title={v.label}
                    InputProps={defaultInputProps}
                    value={row.find((c, _i) => columnIndex === _i)?.entry} 
                    onChange={e => handleChange(i, columnIndex, { label: v.label, entry: e.target.value })}
                  />
                )
              : v.type === 'Date' ? (
                <DateStringInput label={v.label} size="small" fullWidth title={v.label}
                  field={field}
                  value={row.find((c, _i) => columnIndex === _i)?.entry} 
                  onChange={(entry='') => handleChange(i, columnIndex, { label: v.label, entry })}
                />
              )
              : v.type === 'Select' ? (
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small">{v.label}</InputLabel>
                    <Select label={v.label} size="small" title={v.label}
                      sx={defaultInputProps.sx}
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
              : (v.type === 'Database' && v.info.databaseId && v.info.databaseLabel) ? (
                <DatabaseSelectInput responses={[]} size="small"
                  field={{
                    ...field,
                    options: { databaseId: v.info.databaseId, databaseLabel: v.info.databaseLabel },
                    title: v.label,
                  }}
                  value={row.find((_, _i) => columnIndex === _i)?.entry ? [{
                    text: JSON.parse(row.find((_, _i) => columnIndex === _i)?.entry || '{}').text || '',
                    databaseId: JSON.parse(row.find((_, _i) => columnIndex === _i)?.entry || '{}').databaseId || '',
                    recordId: JSON.parse(row.find((_, _i) => columnIndex === _i)?.entry || '{}').recordId || '',
                  }] : []}
                  onChange={
                    (records) => handleChange(i, columnIndex, { label: v.label, entry: JSON.stringify(records?.[0] ?? '') })
                  }
                />
              )
              : null
              } 
            </Grid>
          ))}

          <Grid item sx={{ ml: 'auto', width: iconWidth }}>
            <LabeledIconButton Icon={CancelIcon} label={form_display_text_for_language(form, "Remove")} onClick={() => handleRemove(i)} 
              disabled={!field.isOptional && value.length === 1}
            />
          </Grid>
        </Grid>

        <Divider flexItem sx={{ my: 1 }} />
        </>
      ))}

      <Button variant="outlined" size="small" onClick={handleNewRow} sx={{ width: 200 }}>
        {form_display_text_for_language(form, "Add new entry")}
      </Button>
    </Grid>
  )
}

export const AutoFocusTextField = (props: TextFieldProps & { inputProps?: { sx: SxProps } }) => {
  const { inputProps, ...textFieldProps } = props
  return <TextField InputProps={inputProps || defaultInputProps} {...textFieldProps} />
}

const CustomDateStringInput = forwardRef((props: TextFieldProps & { inputProps?: { sx: SxProps } }, ref) => {
  const { inputProps, ...textFieldProps } = props
  return (
    <TextField InputProps={inputProps || defaultInputProps}
      fullWidth inputRef={ref} {...textFieldProps}
    />
  )
})
export const DateStringInput = ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => {
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
                + ((new Date().getTimezoneOffset() + 60) * 60 * 1000) // additional hour (60 minutes) needs to be added for date to line up properly
              )
              : undefined
          }
          onChange={(d: Date) => onChange?.(mm_dd_yyyy(d), field.id)}
          showTimeSelect={false}
          required={!field.isOptional}
          autoComplete="off"
          dateFormat={"MM-dd-yyyy"}
          customInput={<CustomDateStringInput inputRef={inputRef} {...props} 
            label={(!field.title && field.placeholder) ? field.placeholder : props.label} 
          />}
          // className={css`width: 100%;`}
          className={css`${datepickerCSS}`}
        />
      )
      : (
        <AutoFocusTextField {...props} required={!field.isOptional} fullWidth placeholder={form_display_text_for_language(form, "MM-DD-YYYY")} value={value}
          label={(!field.title && field.placeholder) ? field.placeholder : props.label}
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
    placeholder={(field.placeholder || form_display_text_for_language(form, "Answer here...", ''))} 
    label={(!field.title && field.placeholder) ? field.placeholder : props.label}
  />
)
export const StringLongInput = ({ field, value, onChange, form, ...props }: FormInputProps<'string'>) => (
  <AutoFocusTextField {...props} multiline minRows={3} maxRows={8} required={!field.isOptional} fullWidth value={value} onChange={e => onChange(e.target.value, field.id)}  
    placeholder={field.placeholder || form_display_text_for_language(form, "Answer here...", '')} 
    label={(!field.title && field.placeholder) ? field.placeholder : props.label}
  />
)

export const PhoneInput = ({ field, value, onChange, form, ...props }: FormInputProps<'phone'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth value={value} onChange={e => onChange(e.target.value, field.id)} 
    placeholder={field.placeholder || form_display_text_for_language(form, "Enter phone...", '')}
    label={(!field.title && field.placeholder) ? field.placeholder : props.label}
  />
)

export const EmailInput = ({ field, value, onChange, form, ...props }: FormInputProps<'email'>) => (
  <AutoFocusTextField {...props} required={!field.isOptional} fullWidth type="email" value={value} onChange={e => onChange(e.target.value, field.id)} 
    placeholder={field.placeholder || form_display_text_for_language(form, "Enter email...", '')}
    label={(!field.title && field.placeholder) ? field.placeholder : props.label}
  />
)

export const NumberInput = ({ field, value, onChange, form, ...props }: FormInputProps<'number'>) => {
  // Prevent the default scroll behavior when focused on this input
  const inputRef = useRef<HTMLInputElement>(null); 
  useEffect(() => {
    const handleWheel = (e: any) => {
      e?.preventDefault?.();
    };
    
    // Get the actual input element inside the TextField
    const inputElement = inputRef.current?.querySelector('input');
    
    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel, { passive: false });
      
      // Clean up event listener when component unmounts
      return () => {
        inputElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <TextField ref={inputRef} autoFocus InputProps={defaultInputProps} {...props} required={!field.isOptional} fullWidth type="number" value={value} 
      onChange={e => onChange(parseInt(e.target.value), field.id)}  
      label={(!field.title && field.placeholder) ? field.placeholder : props.label}
      placeholder={field.placeholder || form_display_text_for_language(form, "Enter a number...", '')}
      onScroll={e => e.preventDefault()} // prevent scroll on number input
      sx={{
        '& input[type=number]': {
          '-moz-appearance': 'textfield'
        },
        '& input[type=number]::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '& input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        }
      }}
    />
  )
}

export const InsuranceInput = ({ field, onDatabaseSelect, value, onChange, form, responses, enduser, inputProps, ...props }: FormInputProps<'Insurance'> & {
  inputProps?: { sx: SxProps },
}) => {
  const session = useResolvedSession()

  const [payers, setPayers] = useState<{ id: string, name: string, databaseRecord?: DatabaseRecord, type?: string, state?: string }[]>([])
  const [query, setQuery] = useState('')

  const addressQuestion = useMemo(() => responses?.find(r => {
    if (r.answer.type !== 'Address') return false
    if (r.field.intakeField !== 'Address') return false

    // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
    if (!r.answer.value?.state) return false

    return true
  }), [responses])

  const state = useMemo(() => (
    (addressQuestion?.answer?.type === 'Address' ? addressQuestion?.answer?.value?.state : undefined) || enduser?.state
  ), [enduser?.state, addressQuestion])

  // load from database
  const loadRef = useRef(false) // so session changes don't cause
  useEffect(() => {
    if (field?.options?.dataSource === CANVAS_TITLE) return // instead, look-up while typing against Canvas Search API
    if (field?.options?.dataSource === BRIDGE_TITLE) return // instead, look-up while typing against Bridge Search API
    if (loadRef.current) return
    loadRef.current = true

    // just load all at once, should be reasonably performant compared to paging
    session.api.form_fields.load_choices_from_database({ fieldId: field.id, limit: 10000 })
    .then(({ choices }) => setPayers(
      choices
      .map(c => ({
        id: c.values.find(v => v.label?.trim()?.toLowerCase() === 'id')?.value?.toString() || '',
        name: c.values.find(v => v.label?.trim()?.toLowerCase() === 'name')?.value?.toString() || '',
        state: c.values.find(v => v.label?.trim()?.toLowerCase() === 'state')?.value?.toString() || '',
        type: c.values.find(v => v.label?.trim()?.toLowerCase() === 'type')?.value?.toString() || '',
        databaseRecord: c,
      }))
      .filter(c => !c.state || !state || (c.state === state))
    ))
    .catch(console.error)
  }, [session, state, field?.options?.dataSource])

  // load from 3rd-party on search only
  const searchRef = useRef(query)
  useEffect(() => {
    if (field?.options?.dataSource !== CANVAS_TITLE && field?.options?.dataSource !== BRIDGE_TITLE) { return }
    if (!query) return
    if (searchRef.current === query) return
    searchRef.current = query

    const integration = field?.options?.dataSource === CANVAS_TITLE ? CANVAS_TITLE : BRIDGE_TITLE
    const type = field?.options?.dataSource === CANVAS_TITLE ? 'organizations' : 'payers'

    const t = setTimeout(() => (
      session.api.integrations.proxy_read({
        integration,
        query,
        type,
      })
      .then(({ data }) => {
        try {
          setPayers(data.map((d: any) => ({
            id: field?.options?.dataSource === CANVAS_TITLE ? d.resource.id : d.id,
            name: field?.options?.dataSource === CANVAS_TITLE ? d.resource.name : d.name,
          })))
        } catch(err) { console.error }
      })
      .catch(console.error)
    ), 300)

    return () => { clearTimeout(t) }
  }, [session, field?.options?.dataSource, query])

  return (
    <Grid container spacing={2} sx={{ mt: '0' }}>
      <Grid item xs={12} sm={6}>
      <Autocomplete freeSolo={!field.options?.requirePredefinedInsurer} options={payers.map(p => p.name)}
        value={value?.payerName || ''}
        onChange={(e, v) => onChange({ 
          ...value, 
          payerName: v || '',
          payerId: payers.find(p => p.name === v)?.id || '',
          payerType: payers.find(p => p.name === v)?.type || '',
        }, field.id)}  
        onInputChange={
          field.options?.requirePredefinedInsurer 
            ? (e, v) => { if (v) { setQuery(v) } }
            : (e, v) => {
              if (v) { setQuery(v) }

              const databaseRecord = payers.find(p => p.name === v)?.databaseRecord
              if (databaseRecord) {
                onDatabaseSelect?.([databaseRecord])
              }

              // don't lose existing payerId on back-and-forth navigation
              onChange({ 
                ...value, 
                payerName: v || '',
                payerId: (value?.payerName === v && value?.payerId ? value.payerId : '') || payers.find(p => p.name === v)?.id || '',
                payerType: payers.find(p => p.name === v)?.type || '',
              }, field.id)
            }
          }
        renderInput={(params) => (
          <TextField {...params} InputProps={{ ...params.InputProps, sx: (inputProps || defaultInputProps).sx }}
            required={!field.isOptional} size="small" label={form_display_text_for_language(form, "Insurer")}
            placeholder={(field.options?.dataSource === CANVAS_TITLE || field.options?.dataSource === BRIDGE_TITLE) ? form_display_text_for_language(form, "Search insurer...") : form_display_text_for_language(form, "Insurer")}
          />
        )}
      />
      </Grid>
      <Grid item xs={12} sm={6}>
      <TextField InputProps={inputProps || defaultInputProps} required={!field.isOptional} fullWidth value={value?.memberId ?? ''} 
        onChange={e => onChange({ ...value, memberId: e.target.value }, field.id)}  
        label={form_display_text_for_language(form, "Member ID", '')}
        size="small"
      />
      </Grid>

      <Grid item xs={12} sm={6}>
      <TextField InputProps={inputProps || defaultInputProps} required={false} fullWidth value={value?.planName ?? ''}
        onChange={e => onChange({ ...value, planName: e.target.value }, field.id)}
        label={form_display_text_for_language(form, "Plan Name", '')}
        size="small"
      />
      </Grid>

      <Grid item xs={12} sm={6}>
        <DateStringInput size="small" label={form_display_text_for_language(form, "Plan Start Date")}
          inputProps={inputProps}
          field={{
            ...field,
            isOptional: true, //field.isOptional || field.options?.billingProvider === 'Candid'
          }}
          value={value?.startDate || ''}
          onChange={startDate =>
            onChange({
              ...value,
              startDate,
            }, field.id)
          }
        />
      </Grid>

      {field.options?.includeGroupNumber &&
        <Grid item xs={12}>
          <TextField InputProps={inputProps || defaultInputProps} fullWidth value={value?.groupNumber ?? ''} 
            onChange={e => onChange({ ...value, groupNumber: e.target.value }, field.id)}  
            label={form_display_text_for_language(form, "Group Number", '')}
            size="small"
          />
        </Grid>
      }

      <Grid item xs={12}>
        <StringSelector size="small" label={form_display_text_for_language(form, "Relationship to Policy Owner")}
          inputProps={inputProps}
          options={
            (
              (field.options?.billingProvider === CANVAS_TITLE || field.options?.dataSource === CANVAS_TITLE )
                ? INSURANCE_RELATIONSHIPS_CANVAS
                : INSURANCE_RELATIONSHIPS
            )
            .sort((x, y) => x.localeCompare(y))
          }
          value={value?.relationship || 'Self'}
          onChange={relationship =>
            onChange({ ...value, relationship: relationship as InsuranceRelationship || 'Self' }, field.id)
          }
        />
      </Grid>

      {(value?.relationship || 'Self') !== 'Self' &&
      <>
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 'bold' }}>{form_display_text_for_language(form, "Policy Owner Details")}</Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField label={form_display_text_for_language(form, "First Name")} size="small" InputProps={inputProps || defaultInputProps} fullWidth
            value={value?.relationshipDetails?.fname || ''}
            required={!field.isOptional}
            onChange={e =>
              onChange({
                ...value,
                relationshipDetails: { ...value?.relationshipDetails, fname: e.target.value }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField label={form_display_text_for_language(form, "Last Name")} size="small" InputProps={inputProps || defaultInputProps} fullWidth
            value={value?.relationshipDetails?.lname || ''}
            required={!field.isOptional}
            onChange={e =>
              onChange({
                ...value,
                relationshipDetails: { ...value?.relationshipDetails, lname: e.target.value }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <StringSelector options={TELLESCOPE_GENDERS} size="small" label={form_display_text_for_language(form, "Gender")}
            inputProps={inputProps}
            value={value?.relationshipDetails?.gender || ''}
            required={!field.isOptional}
            onChange={v =>
              onChange({
                ...value,
                relationshipDetails: { ...value?.relationshipDetails, gender: v as TellescopeGender }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <DateStringInput size="small" label={form_display_text_for_language(form, "Date of Birth")}
            inputProps={inputProps}
            field={{
              ...field,
              isOptional: field.isOptional || field.options?.billingProvider === 'Candid'
            }}
            value={value?.relationshipDetails?.dateOfBirth || ''}
            onChange={dateOfBirth =>
              onChange({
                ...value,
                relationshipDetails: { ...value?.relationshipDetails, dateOfBirth }
              }, field.id)
            }
          />
        </Grid>


        {/* <Grid item xs={6}>
          <TextField label="Email" type="email" size="small" InputProps={defaultInputProps} fullWidth
            value={value?.relationshipDetails?.email || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { ...value?.relationshipDetails, email: e.target.value }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Cell Phone" size="small" InputProps={defaultInputProps} fullWidth
            value={value?.relationshipDetails?.phone || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { ...value?.relationshipDetails, phone: e.target.value }
              }, field.id)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <AddressInput field={field} value={{
            addressLineOne: value?.relationshipDetails?.address?.lineOne || '',
            addressLineTwo: value?.relationshipDetails?.address?.lineTwo || '',
            city: value?.relationshipDetails?.address?.city || '',
            state: value?.relationshipDetails?.address?.state || '',
            zipCode: value?.relationshipDetails?.address?.zipCode || '',
          }} 
            onChange={v => {
              const { addressLineOne='', addressLineTwo='', ...address } = v || {}
              onChange({ 
                ...value, 
                relationshipDetails: { 
                  ...value?.relationshipDetails, 
                  address: {
                    lineOne: addressLineOne,
                    lineTwo: addressLineTwo,
                    ...address,
                  },
                }
              }, field.id)
            }}
          />
        </Grid> */}

        {/* <Grid item xs={6}>
          <TextField label="Address"
            value={value?.relationshipDetails?.address?.lineOne || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { 
                  ...value?.relationshipDetails, 
                  address: {
                    ...value?.relationshipDetails?.address,
                    lineOne: e.target.value
                  }
                }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Line Two"
            value={value?.relationshipDetails?.address?.lineTwo || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { 
                  ...value?.relationshipDetails, 
                  address: {
                    ...value?.relationshipDetails?.address,
                    lineTwo: e.target.value
                  }
                }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField label="City"
            value={value?.relationshipDetails?.address?.city || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { 
                  ...value?.relationshipDetails, 
                  address: {
                    ...value?.relationshipDetails?.address,
                    city: e.target.value
                  }
                }
              }, field.id)
            }
          />
        </Grid>
        <Grid item xs={2}>
          <TextField label="State"
            value={value?.relationshipDetails?.address?.state || ''} 
            onChange={e => 
              onChange({ 
                ...value, 
                relationshipDetails: { 
                  ...value?.relationshipDetails, 
                  address: {
                    ...value?.relationshipDetails?.address,
                    state: e.target.value
                  }
                }
              }, field.id)
            }
          />
        </Grid>

        <Grid item xs={4}> 
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
            renderInput={(params) => (
              <TextField {...params} InputProps={{ ...params.InputProps, sx: (inputProps || defaultInputProps).sx }}
                size={'small'} label={"State"} required={!field.isOptional}
              />
            )}
            {...props}
          />
        </Grid> */}
      </>
      }
    </Grid>
  )
}


const StringSelector = ({ options, value, onChange, required, getDisplayValue, inputProps, ...props } : {
  options: string[]
  value: string,
  onChange: (v: string) => void,
  label?: string,
  size?: "small",
  required?: boolean,
  getDisplayValue?: (v: string) => string,
  disabled?: boolean,
  inputProps?: { sx: SxProps },
}) => (
  <FormControl fullWidth size={props.size} required={required}>
    <InputLabel>{props.label}</InputLabel>
    <Select {...props} value={value} onChange={e => onChange(e.target.value)} fullWidth
      sx={(inputProps || defaultInputProps).sx}
    >
    {options.map((o, i) => (
      <MenuItem value={o} key={o || i}>{getDisplayValue?.(o) ?? o}</MenuItem>
    ))}
    </Select>
  </FormControl>
)

export const BridgeEligibilityInput = ({ field, value, onChange, responses, enduser, inputProps, enduserId, form, ...props }: FormInputProps<'Bridge Eligibility'> & {
  inputProps?: { sx: SxProps },
}) => {
  const session = useResolvedSession()
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState<string>()

  // single-page form must require button-click to check, but 1-page-at-a-time enduser sessions should auto-check
  const isEnduserSession = session.type === 'enduser'
  const eligibilityType = field.options?.bridgeEligibilityType || 'Soft'

  // Extract payerId from Insurance question response
  const [payerId, memberId, payerName] = useMemo(() => {
    const insuranceResponse = responses?.find(r => r.answer?.type === 'Insurance' && r.answer?.value?.payerId)
    if (insuranceResponse?.answer?.type === 'Insurance') {
      return [
        insuranceResponse.answer.value?.payerId,
        insuranceResponse.answer.value?.memberId,
        insuranceResponse.answer.value?.payerName,
      ]
    }
    // existing payer id is automatically resolved on the backend as default
    return []
  }, [responses])

  // Extract state from Address question or enduser
  const state = useMemo(() => {
    // Find Address field with state value
    const addressResponse = responses?.find(r =>
      r.answer?.type === 'Address' && r.answer?.value?.state
    )
    if (addressResponse?.answer?.type === 'Address') {
      return addressResponse.answer.value?.state
    }
    // enduser state is automatically resolved on the backend as default
  }, [responses])

  // Soft eligibility check function - supports multiple service type IDs
  const checkProviderEligibility = useCallback(async () => {
    const serviceTypeIds = field.options?.bridgeServiceTypeIds

    if (!serviceTypeIds || serviceTypeIds.length === 0) {
      setError('Bridge Service Type IDs not configured')
      return
    }
    // payerId and state can be automatically resolved on the backend, if already saved on Enduser, so not required here

    setLoading(true)
    setError(undefined)

    try {
      // Fire parallel requests for each service type ID
      const results = await Promise.all(
        serviceTypeIds.map(async (serviceTypeId) => {
          try {
            const { data } = await session.api.integrations.proxy_read({
              id: enduserId,
              integration: BRIDGE_TITLE,
              type: 'provider-eligibility',
              query: JSON.stringify({
                serviceTypeId,
                payerId,
                state,
              }),
            })
            return {
              serviceTypeId,
              status: data?.status || 'unknown',
              userIds: data?.userIds || [],
            }
          } catch (err: any) {
            console.error(`Provider eligibility check failed for ${serviceTypeId}:`, err)
            return {
              serviceTypeId,
              status: 'error',
              userIds: [],
              error: err?.message,
            }
          }
        })
      )

      // Aggregate results - union of userIds across all service types
      const allUserIds = results.flatMap(r => r.userIds)
      const uniqueUserIds = Array.from(new Set(allUserIds))

      // Determine aggregated status (ELIGIBLE if any are eligible, otherwise first non-error status)
      const aggregatedStatus = results.some(r => r.status === 'ELIGIBLE')
        ? 'ELIGIBLE'
        : results.find(r => r.status !== 'error')?.status || 'unknown'

      // Store aggregated userIds in shared variable for Appointment Booking to use
      setBridgeEligibilityUserIds(uniqueUserIds)

      // Update the answer with aggregated results
      onChange({
        payerId, // Store payerId to detect changes on remount
        status: aggregatedStatus,
        userIds: uniqueUserIds,
      }, field.id)
    } catch (err: any) {
      setError(err?.message || 'Failed to check eligibility')
      console.error('Provider eligibility check failed:', err)
    } finally {
      setLoading(false)
    }
  }, [session, field, payerId, state, onChange, enduserId])

  // Hard eligibility check function with polling - supports multiple service type IDs
  const checkServiceEligibility = useCallback(async () => {
    const serviceTypeIds = field.options?.bridgeServiceTypeIds

    if (!serviceTypeIds || serviceTypeIds.length === 0) {
      setError('Bridge Service Type IDs not configured')
      return
    }

    setLoading(true)
    setError(undefined)

    try {
      // Initiate service eligibility checks for all service type IDs in parallel
      const initiatedChecks = await Promise.all(
        serviceTypeIds.map(async (serviceTypeId) => {
          try {
            const { data } = await session.api.integrations.proxy_read({
              id: enduserId,
              integration: BRIDGE_TITLE,
              type: 'service-eligibility',
              query: JSON.stringify({
                serviceTypeId,
                payerId,
                memberId,
                state,
              }),
            })

            const serviceEligibilityId = data?.id
            if (!serviceEligibilityId) {
              throw new Error('No service eligibility ID returned')
            }

            return {
              serviceTypeId,
              serviceEligibilityId,
              error: undefined,
            }
          } catch (err: any) {
            console.error(`Service eligibility check initiation failed for ${serviceTypeId}:`, err)
            return {
              serviceTypeId,
              serviceEligibilityId: null,
              error: err?.message,
            }
          }
        })
      )

      setLoading(false)
      setPolling(true)

      // Poll for results from all checks in parallel
      const pollForAllResults = async () => {
        const maxAttempts = 60 // Poll for up to 60 attempts (2 minutes at 2s intervals)

        // Track completion status for each check
        const checkStatuses = new Map(
          initiatedChecks.map(check => [
            check.serviceTypeId,
            {
              completed: check.error !== undefined || check.serviceEligibilityId === null,
              result: check.error ? { status: 'error', userIds: [], error: check.error } : null,
              serviceEligibilityId: check.serviceEligibilityId,
            }
          ])
        )

        let attempts = 0

        const pollAll = async (): Promise<void> => {
          if (attempts >= maxAttempts) {
            setError('Eligibility check timed out. Please try again.')
            setPolling(false)
            return
          }

          attempts++

          // Poll all incomplete checks in parallel
          const pollPromises = initiatedChecks
            .filter(check => {
              const status = checkStatuses.get(check.serviceTypeId)
              return check.serviceEligibilityId && status && !status.completed
            })
            .map(async (check) => {
              try {
                const { data: pollData } = await session.api.integrations.proxy_read({
                  id: check.serviceEligibilityId!,
                  integration: BRIDGE_TITLE,
                  type: 'service-eligibility-poll',
                })

                const status = pollData?.status

                // Check if we're in a terminal state
                if (status && status !== 'PENDING') {
                  const checkStatus = checkStatuses.get(check.serviceTypeId)!
                  checkStatus.completed = true
                  checkStatus.result = {
                    status: status || 'unknown',
                    userIds: pollData?.userIds || [],
                    error: undefined,
                  }
                }
              } catch (err: any) {
                console.error(`Service eligibility polling failed for ${check.serviceTypeId}:`, err)
                const checkStatus = checkStatuses.get(check.serviceTypeId)!
                checkStatus.completed = true
                checkStatus.result = {
                  status: 'error',
                  userIds: [],
                  error: err?.message,
                }
              }
            })

          await Promise.all(pollPromises)

          // Check if all checks are completed
          const allCompleted = Array.from(checkStatuses.values()).every(s => s.completed)

          if (allCompleted) {
            // Aggregate results - union of userIds across all service types
            const results = Array.from(checkStatuses.entries()).map(([serviceTypeId, status]) => ({
              serviceTypeId,
              status: status.result?.status || 'unknown',
              userIds: status.result?.userIds || [],
            }))

            const allUserIds = results.flatMap(r => r.userIds)
            const uniqueUserIds = Array.from(new Set(allUserIds))

            // Determine aggregated status (ELIGIBLE if any are eligible, otherwise first non-error status)
            const aggregatedStatus = results.some(r => r.status === 'ELIGIBLE')
              ? 'ELIGIBLE'
              : results.find(r => r.status !== 'error')?.status || 'unknown'

            // Store aggregated userIds in shared variable for Appointment Booking to use
            setBridgeEligibilityUserIds(uniqueUserIds)

            // Update the answer with aggregated results
            onChange({
              payerId, // Store payerId to detect changes on remount
              status: aggregatedStatus,
              userIds: uniqueUserIds,
            }, field.id)

            setPolling(false)
            return
          }

          // Still have pending checks, poll again after delay
          setTimeout(pollAll, 2000) // Poll every 2 seconds
        }

        pollAll()
      }

      pollForAllResults()
    } catch (err: any) {
      setError(err?.message || 'Failed to check service eligibility')
      console.error('Service eligibility check failed:', err)
      setLoading(false)
      setPolling(false)
    }
  }, [session, field, payerId, memberId, state, onChange, enduserId])

  // Auto-check eligibility for enduser sessions
  const autoCheckRef = useRef(false)
  useEffect(() => {
    if (!isEnduserSession) return

    // If we already have a result and the payer hasn't changed, use the cached result
    if (value?.status && value?.payerId === payerId) {
      return
    }

    if (autoCheckRef.current) return
    autoCheckRef.current = true

    if (eligibilityType === 'Hard') {
      checkServiceEligibility()
    } else {
      checkProviderEligibility()
    }
  }, [isEnduserSession, eligibilityType, checkProviderEligibility, checkServiceEligibility, value, payerId])

  const errorComponent = useMemo(() => (
    <Grid container spacing={2} direction="column" alignItems="center" style={{ padding: '20px 0' }}>
      <Grid item>
        <Paper style={{
          padding: 16,
          backgroundColor: '#ffebee',
          border: '2px solid #f44336'
        }}>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Typography variant="h2" style={{ color: '#f44336' }}>⚠️</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" align="center" color="error">
                Unable to Check Eligibility
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" align="center" style={{ color: '#d32f2f' }}>
                {error}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  ), [error])

  const checkingEligibilityComponent = useMemo(() => (
    <Grid container spacing={2} direction="column" alignItems="center" style={{ padding: '20px 0' }}>
      <Grid item>
        <CircularProgress size={40} />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          {polling ? 'Verifying eligibility with insurance...' : 'Checking eligibility...'}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          {polling ? 'This usually takes 15-30 seconds' : 'This may take a few moments'}
        </Typography>
      </Grid>
    </Grid>
  ), [polling])

  const resultsComponent = useMemo(() => {
    const isEligible = value?.status === 'ELIGIBLE'
    return (
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Paper style={{
            padding: 16,
            backgroundColor: isEligible ? '#e8f5e9' : '#fff3e0',
            border: `2px solid ${isEligible ? '#4caf50' : '#ff9800'}`
          }}>
            <Grid container spacing={2} direction="column" alignItems="center">
              <Grid item>
                {isEligible ? (
                  <CheckCircleOutline style={{ fontSize: 48, color: '#4caf50' }} />
                ) : (
                  <Typography variant="h2" style={{ color: '#ff9800' }}>⚠️</Typography>
                )}
              </Grid>
              <Grid item>
                <Typography variant="h6" align="center">
                  {isEligible
                    ? `${payerName || 'Your insurance provider'} is accepted!`
                    : 'Eligibility Status: ' + first_letter_capitalized((value?.status || 'Unknown').toLowerCase())
                  }
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }, [value, payerName])

  // Loading/polling state for enduser sessions
  if (isEnduserSession) {
    if (loading || polling) { return checkingEligibilityComponent }
    if (error) {
      return errorComponent
    }
    if (value?.status) {
      return resultsComponent
    }
    return errorComponent
  }

  // User/admin interface (non-enduser sessions)
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          Eligibility Type: {eligibilityType}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Service Type IDs: {field.options?.bridgeServiceTypeIds?.join(', ') || 'Not configured'}
        </Typography>
        {state && <Typography variant="body2" color="textSecondary">State: {state}</Typography>}
        {payerId && <Typography variant="body2" color="textSecondary">Payer ID: {payerId}</Typography>}
        {memberId && <Typography variant="body2" color="textSecondary">Member ID: {memberId}</Typography>}
      </Grid>

      {error && (
        <Grid item>
          <Typography variant="body2" color="error">{error}</Typography>
        </Grid>
      )}

      {polling && (
        <Grid item>
          <Typography variant="body2" color="primary">
            {form_display_text_for_language(form, "Polling for results... (this may take 15-30 seconds)")}
          </Typography>
        </Grid>
      )}

      <Grid item container spacing={2}>
        <Grid item>
          <LoadingButton
            variant="outlined"
            onClick={checkProviderEligibility}
            submitText={form_display_text_for_language(form, "Check Provider Eligibility (Free)")}
            submittingText={form_display_text_for_language(form, "Checking...")}
            submitting={loading && !polling}
            disabled={!field.options?.bridgeServiceTypeIds?.length || loading || polling}
          />
        </Grid>
        <Grid item>
          <LoadingButton
            variant="outlined"
            onClick={checkServiceEligibility}
            submitText={form_display_text_for_language(form, "Check Service Eligibility (Paid)")}
            submittingText={polling ? form_display_text_for_language(form, "Polling...") : form_display_text_for_language(form, "Initiating...")}
            submitting={loading || polling}
            disabled={!field.options?.bridgeServiceTypeIds?.length || loading || polling}
          />
        </Grid>
      </Grid>

      {value && (
        <Grid item>
          <Typography variant="caption" color="textSecondary">
            Current Answer:
          </Typography>
          <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(value, null, 2)}
          </pre>
        </Grid>
      )}
    </Grid>
  )
}

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

export const TimezoneInput = ({ value='', field, onChange, ...props }: FormInputProps<'Timezone'>) => (
  <StringSelector {...props} value={value} options={TIMEZONES_USA} onChange={v => onChange(v, field.id)} />
)

export const AddressInput = ({ field, form, value, onChange, ...props }: FormInputProps<'Address'>) => (
  // state only
  field.options?.addressFields?.includes('state')
    ? (
      <Autocomplete value={value?.state || ''} 
        options={field.options?.validStates?.length ? field.options.validStates : VALID_STATES}
        disablePortal
        onChange={(e, v) => v && 
          onChange({
            ...value as any,
            state: v ?? '',
          }, 
          field.id
        )}
        renderInput={(params) => (
          <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
            required={!field.isOptional}  
            // don't use 'small' so as to be consistent with other text fields, in case this is used in a group
            // size={'small'} 
            label={form_display_text_for_language(form, "State")} 
          />
        )}
        {...props}
      />
    )
    : (
    <Grid container direction="column" spacing={2} sx={{ mt: 0 }}>
      <Grid item>
      <AutoFocusTextField {...props} size="small" required={!field.isOptional} fullWidth 
        value={value?.addressLineOne ?? ''} 
        label={form_display_text_for_language(form, "Address Line 1")} 
        placeholder={form_display_text_for_language(form, "Address Line 1")} 
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
      <TextField {...props} size="small" required={false} fullWidth 
        InputProps={defaultInputProps}
        value={value?.addressLineTwo ?? ''} 
        label={form_display_text_for_language(form, "Address Line 2")}
        placeholder={form_display_text_for_language(form, "Address Line 2")} 
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
        <Grid item xs={12} sm={field.fullZIP ? 5 : 6}>
          <TextField {...props} size="small" required={!field.isOptional} 
            InputProps={defaultInputProps}
            fullWidth
            value={value?.city ?? ''} 
            label={form_display_text_for_language(form, "City")}
            placeholder={form_display_text_for_language(form, "City")} 
            onChange={e => 
              onChange({
                ...value as any,
                city: e.target.value ?? '',
              }, 
              field.id
            )} 
          />
        </Grid>

        <Grid item xs={field.fullZIP ? 4 : 6} sm={field.fullZIP ? 2 : 3}>
          <Autocomplete value={value?.state || ''} fullWidth
            options={field.options?.validStates?.length ? field.options.validStates : VALID_STATES}
            disablePortal
            onChange={(e, v) => v && 
              onChange({
                ...value as any,
                state: v ?? '',
              }, 
              field.id
            )}
            renderInput={(params) => (
              <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
                size={'small'} required={!field.isOptional}  
                label={form_display_text_for_language(form, "State")} 
              />
            )}
            {...props}
          />
        </Grid>

        <Grid item xs={field.fullZIP ? 5 : 6} sm={field.fullZIP ? 2 : 3}>
          <TextField {...props} size="small" required={!field.isOptional} 
            InputProps={defaultInputProps} fullWidth
            value={value?.zipCode ?? ''} 
            label={form_display_text_for_language(form, "ZIP Code")}
            placeholder={form_display_text_for_language(form, "ZIP Code")}
            onChange={e => 
              onChange({
                ...value as any,
                zipCode: e.target.value ?? '',
              }, 
              field.id
            )} 
          />
        </Grid>

        {field.fullZIP &&
          <Grid item xs={3}>
            <TextField {...props} size="small" label={form_display_text_for_language(form, "ZIP+4")} required={!field.isOptional && field.fullZIP}
              InputProps={defaultInputProps}
              value={value?.zipPlusFour ?? ''}
              placeholder={form_display_text_for_language(form, "ZIP + 4")} 
              onChange={e => 
                onChange({
                  ...value as any,
                  zipPlusFour: e.target.value ?? '',
                }, 
                field.id
              )} 
            />
          </Grid>
        }

      </Grid>
      </Grid>
    </Grid>
  )
)

export const ESignatureTerms = () => {
  let companyName = 'Tellescope'
  try {
    const indexOfName = window.location.href.indexOf('name=')
    if (indexOfName !== -1) {
      companyName = (
        decodeURIComponent(window.location.href.substring(indexOfName + 5))
        || companyName
      )
    }
  } catch(err) { 
    console.error(err) 
  }

  return (
    <div style={{paddingLeft: 10}}>
      <h1>{companyName} Electronic Signature Terms</h1>

      <p>
        By selecting the "I consent to use electronic signatures" checkbox, 
        you are signing this Agreement electronically. 
        You agree your electronic signature is the legal 
        equivalent of your manual/handwritten signature on this Agreement.  
        By selecting "I consent to use electronic signatures" using any device, means or action, you consent to the 
        legally binding terms and conditions of this Agreement. 
        You further agree that your signature on this document (hereafter referred to as your "E-Signature") 
        is as valid as if you signed the document in writing. 
        You also agree that no certification authority or other third party 
        verification is necessary to validate your E-Signature,
        and that the lack of such certification or third party verification will 
        not in any way affect the enforceability
        of your E-Signature or any resulting agreement between you and 
        {companyName} or between you and a customer of {companyName}.
      </p>  
    </div>
  )
}

export const SignatureInput = ({ value, field, autoFocus=true, enduser, onChange, form }: FormInputProps<'signature'>) => {
  const prefill = (
    field.options?.prefillSignature && enduser?.fname && enduser.lname
      ? `${enduser.fname} ${enduser.lname}`
      : undefined
  )

  const handleConsentChange = () => {
    const newConsent = !value?.signed

    onChange({
      pdfAttachment: field.options?.pdfAttachment,
      fullName: value?.fullName ?? prefill ?? '',
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
            {form_display_text_for_language(form, "View document in new tab")}
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
          {form_display_text_for_language(form, "I consent to use")} <a href={`/e-signature-terms?name=${field.options?.esignatureTermsCompanyName || ''}`} target="_blank" rel="noopener noreferrer"> {form_display_text_for_language(form, "electronic signatures")} </a>
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 12 }}>
        <TextField disabled={!value?.signed} autoFocus={autoFocus}
          style={{ width: '100%'}}
          size="small"
          aria-label={form_display_text_for_language(form, "Full Name")}
          value={value?.fullName}
          placeholder={prefill || form_display_text_for_language(form, "Full Name")} variant="outlined"
          onChange={e => handleNameChange(e.target.value)}
          InputProps={defaultInputProps}
        />
        <Typography color="primary" style={{ fontSize: 15, marginTop: 2 }}>
          {form_display_text_for_language(form, "Enter your legal full name to complete the signature")}
        </Typography>
      </Grid>
    </Grid>
  )
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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

const value_is_image = (f?: { type?: string })=> f?.type?.includes('image')
export const FileInput = ({ value, onChange, field, existingFileName, uploadingFiles, handleFileUpload, setUploadingFiles, form }: FormInputProps<'file'> & { existingFileName?: string }) => {
  const [error, setError] = useState('')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: useCallback(
      acceptedFiles => {
        const file = acceptedFiles.pop()
        if (!file) return

        if (field.options?.maxFileSize && file.size > field.options.maxFileSize) {
          return setError(`File size must be less than ${formatBytes(field.options.maxFileSize)}`)
        }

        if (field.options?.validFileTypes?.length) {
          const match = field.options.validFileTypes.find(t => file.type.includes(t.toLowerCase()))
          if (!match) {
            return setError(`File must have type: ${field.options.validFileTypes.join(', ')}`)
          }
        }

        setError('')
        onChange(file, field.id)

        if (field.options?.autoUploadFiles && handleFileUpload) {
          setUploadingFiles?.(fs => [...fs, { fieldId: field.id }])
          
          handleFileUpload(file, field.id)
          .finally(
            () => setUploadingFiles?.(fs => fs.filter(f => f.fieldId !== field.id))
          )
        }
      }, [onChange, field.options?.validFileTypes, handleFileUpload, setUploadingFiles]
    ),
  })

  const [preview, setPreview] = useState('')
  useEffect(() => {
    if (!value_is_image(value)) return
    if ((value.type.includes('heif') || value.type.includes('heic'))) {
      convertHEIC(value).then(setPreview).catch(console.error)
      return
    }

    try {
      setPreview(URL.createObjectURL(value))
    } catch(err) {
      console.error(err)
    }
  }, [value])

  if (uploadingFiles?.find(f => f.fieldId === field.id)) {
    return <LinearProgress />
  }
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
                      {form_display_text_for_language(form, "Select file or take picture")}
                    </Typography>
                  </Grid>
                </Grid>
              )
              : form_display_text_for_language(form, "Select a File")
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

export const safe_create_url = (file: any) => {
  try {
    return URL.createObjectURL(file)
  } catch(err) {
    console.error('safe_create_url error:', err)
    return null
  }
}

export const FilesInput = ({ value, onChange, field, existingFileName, uploadingFiles, handleFileUpload, setUploadingFiles, form }: FormInputProps<'files'> & { existingFileName?: string }) => {
  const [error, setError] = useState('')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: useCallback(
      async acceptedFiles => {
        setUploadingFiles?.(fs => [...fs, { fieldId: field.id }])
        for (const file of acceptedFiles) {
          if (field.options?.validFileTypes?.length) {
            const match = field.options.validFileTypes.find(t => file.type.includes(t.toLowerCase()))
            if (!match) {
              return setError(`File must have type: ${field.options.validFileTypes.join(', ')}`)
            }
          }  

          if (field.options?.autoUploadFiles && handleFileUpload) {
            await handleFileUpload(file, field.id).catch(console.error)
          }
        }
        setUploadingFiles?.(fs => fs.filter(f => f.fieldId !== field.id))

        setError('')
        onChange([...(value ?? []), ...acceptedFiles], field.id)
      }, [onChange, value, field.options?.validFileTypes, handleFileUpload, setUploadingFiles]
    ),
  })

  const previews = useMemo(() => (
    (value ?? []).map(v => {
      return value_is_image(v) ? safe_create_url(v) : null
    })
  ), [value])

  if (uploadingFiles?.find(f => f.fieldId === field.id)) {
    return <LinearProgress />
  }
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
          ? form_display_text_for_language(form, "Drop to select files")
          : capture_is_supported()
            ? (
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <AddPhotoAlternateIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontSize: 14, textAlign: 'center' }}>
                    {form_display_text_for_language(form, "Select files or take pictures")}
                  </Typography>
                </Grid>
              </Grid>
            )
            : form_display_text_for_language(form, "Select Files")
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

          {file.type?.includes('image') && previews[i] &&
            <Grid item>
               <img 
                src={previews[i]!} 
                style={{ maxWidth: '45%', maxHeight: 80, height: '100%' }}
              />
            </Grid>
          }
        </Grid>
        </Grid>

        <Grid item>
          <LabeledIconButton label={form_display_text_for_language(form, "Remove")}
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
  py: 0.25,
  borderRadius: 2.5,
  mb: 0.5,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}

export const MultipleChoiceInput = ({ field, form, value: _value, onChange }: FormInputProps<'multiple_choice'>) => {
  const value = typeof _value === 'string' ? [_value] : _value // if loading existingResponses, allows them to be a string
  const { choices, radio, other, optionDetails } = field.options as MultipleChoiceOptions
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({})

  // current other string
  const enteringOtherStringRef = React.useRef('') // if typing otherString as prefix of a checkbox value, don't auto-select
  const otherString = value?.find(v => v === enteringOtherStringRef.current || !(choices ?? [])?.find(c => c === v)) ?? ''

  const getDescriptionForChoice = useCallback((choice: string) => {
    return optionDetails?.find(detail => detail.option === choice)?.description
  }, [optionDetails])

  const toggleDescription = useCallback((index: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }, [])

  return (
    <Grid container alignItems="center">
      {radio
        ? (
          <FormControl fullWidth>
            <FormLabel id={`radio-group-${field.id}-label`}>
              {form_display_text_for_language(form, "Select One")} 
            </FormLabel>
            <RadioGroup
              aria-labelledby={`radio-group-${field.id}-label`}
              defaultValue="female"
              name={`radio-group-${field.id}`}
            >
            {(choices ?? []).map((c, i) => {
              const description = getDescriptionForChoice(c)
              const hasDescription = !!description
              const isExpanded = expandedDescriptions[i]

              return (
                <Box key={i} sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <FormControlLabel
                      sx={{ ...multipleChoiceItemSx, flex: 1, marginLeft: '0px' }}
                      checked={!!value?.includes(c) && c !== otherString}
                      control={
                        <Radio onClick={() => onChange(value?.includes(c) ? [] : [c], field.id)} />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography component="span" sx={{ flex: 1 }}>{c}</Typography>
                          {hasDescription && (
                            <MuiIconButton
                              size="small"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                toggleDescription(i)
                              }}
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                                ml: 1
                              }}
                            >
                              <ExpandMore fontSize="small" />
                            </MuiIconButton>
                          )}
                        </Box>
                      }
                    />
                  </Box>
                  {hasDescription && (
                    <Collapse in={isExpanded}>
                      <Box sx={{ pl: '42px', pr: 2, pb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                      </Box>
                    </Collapse>
                  )}
                </Box>
              )
            })} 
            </RadioGroup>
          </FormControl>
        ) : (
          (choices ?? []).map((c, i) => {
            const description = getDescriptionForChoice(c)
            const hasDescription = !!description
            const isExpanded = expandedDescriptions[i]

            return (
              <Grid xs={12} key={i}>
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      ...multipleChoiceItemSx,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={(e) => {
                      // Don't trigger selection if clicking on the expand button
                      if ((e.target as HTMLElement).closest('.expand-button')) {
                        return
                      }
                      onChange(
                        (
                          value?.includes(c)
                            ? (
                              (radio || field.options?.radioChoices?.includes(c))
                                ? []
                                : value.filter(v => v !== c)
                            )
                            : (
                              (radio || field.options?.radioChoices?.includes(c))
                                ? [c]
                                : [...(value ?? []).filter(x => !field.options?.radioChoices?.includes(x)), c]
                            )
                        ),
                        field.id,
                      )
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={!!value?.includes(c) && c !== otherString}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <Typography component="span" sx={{ flex: 1 }}>{c}</Typography>
                    {hasDescription && (
                      <MuiIconButton
                        className="expand-button"
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          toggleDescription(i)
                        }}
                        sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          ml: 1
                        }}
                      >
                        <ExpandMore fontSize="small" />
                      </MuiIconButton>
                    )}
                  </Box>
                  {hasDescription && (
                    <Collapse in={isExpanded}>
                      <Box sx={{ pl: '42px', pr: 2, pb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {description}
                        </Typography>
                      </Box>
                    </Collapse>
                  )}
                </Box>
              </Grid>
            )
          })
        )
      }
      {other &&
        <Grid item xs={12}>
          <TextField // className={classes.textField}
            InputProps={{ sx: { borderRadius: 2.5 }}} // match Checkbox, not default styles
            sx={{ width: radio ? `calc(100% - 15px)` : '100%' }}
            size="small"
            aria-label={form_display_text_for_language(form, "Other")}
            value={otherString} 
            placeholder={form_display_text_for_language(form, "Other")}
            variant="outlined" 
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

// Helper to emit GTM purchase event for Stripe payments (single source of truth)
const emitStripePurchaseEvent = (field: FormField, cost: number) => {
  emit_gtm_event({
    event: 'form_purchase',
    productIds: field.options?.productIds || [],
    fieldId: field.id,
    value: cost / 100, // Convert cents to dollars
    currency: 'USD',
  })
}

export const StripeInput = ({ field, value, onChange, setCustomerId, enduserId, form, responses, enduser }: FormInputProps<'Stripe'> & {
  setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>,
}) => {
  const session = useResolvedSession()
  const [clientSecret, setClientSecret] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [isCheckout, setIsCheckout] = useState(false)
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe>>()
  const [answertext, setAnswertext] = useState('')
  const [error, setError] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showProductSelection, setShowProductSelection] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Compute visible products based on conditional logic
  const visibleProducts = useMemo(() => {
    if (!showProductSelection || availableProducts.length === 0) {
      return availableProducts
    }

    return availableProducts.filter(product => {
      // Find condition for this product
      const productCondition = field.options?.productConditions?.find(c => c.productId === product._id)

      // If no condition defined, show by default
      if (!productCondition?.showCondition || object_is_empty(productCondition.showCondition)) {
        return true
      }

      // Evaluate condition against current form responses
      return responses_satisfy_conditions(responses || [], productCondition.showCondition, {
        dateOfBirth: enduser?.dateOfBirth,
        gender: enduser?.gender,
        state: enduser?.state,
        form,
        activeResponses: responses,
      })
    })
  }, [availableProducts, field.options?.productConditions, responses, showProductSelection, enduser, form])

  // Automatically deselect products that become hidden
  useEffect(() => {
    const visibleProductIds = visibleProducts.map(p => p._id)
    setSelectedProducts(prev => prev.filter(id => visibleProductIds.includes(id)))
  }, [visibleProducts])

  const fetchRef = useRef(false)
  useEffect(() => {
    if (fetchRef.current) return
    if (value && (session.userInfo as any)?.stripeCustomerId) {
      return setCustomerId(c => c ? c : (session.userInfo as any)?.stripeCustomerId) // already paid or saved card
    }

    // Check if product selection mode is enabled
    if (field.options?.stripeProductSelectionMode && (field.options?.productIds || []).length > 1) {
      setShowProductSelection(true)
      setLoadingProducts(true)

      // Fetch product data with real-time Stripe pricing via proxy_read
      const productIds = (field.options.productIds || []).join(',')
      session.api.integrations.proxy_read({
        integration: 'Stripe',
        type: 'product-prices',
        id: productIds,
        query: field.options.stripeKey
      })
      .then(({ data }) => {
        setAvailableProducts(data.products || [])
        setLoadingProducts(false)
      })
      .catch((e: any) => {
        console.error('Error loading product data:', e)
        const errorMessage = e?.message?.includes?.('Stripe pricing error:')
          ? e.message.replace('Stripe pricing error: ', '')
          : 'Failed to load product information from Stripe'
        setError(`Product configuration error: ${errorMessage}`)
        setLoadingProducts(false)
      })
      return
    }

    fetchRef.current = true

    session.api.form_responses.stripe_details({ fieldId: field.id, enduserId })
    .then(({ clientSecret, publishableKey, stripeAccount, businessName, customerId, isCheckout, answerText }) => {
      setAnswertext(answerText || '')
      setIsCheckout(!!isCheckout)
      setClientSecret(clientSecret)
      setStripePromise(loadStripe(publishableKey, { stripeAccount }))
      setBusinessName(businessName)
      setCustomerId(customerId)
    })
    .catch((e: any) => {
      console.error(e)
      if (typeof e?.message === 'string') {
        setError(e.message)
      }
    })
  }, [session, value, field.id, enduserId])

  const cost = (
    showProductSelection
      ? selectedProducts.reduce((total, productId) => {
          const product = availableProducts.find(p => p._id === productId)
          if (product?.currentPrice) {
            return total + (product.currentPrice.amount || 0)
          }
          return total + (product?.cost?.amount || 0)
        }, 0)
      : 0 // Will be calculated by existing Stripe flow when not in selection mode
  )

  // Emit GTM purchase event once when success screen is displayed
  const purchaseEmittedRef = useRef(false)
  useEffect(() => {
    // Only emit for actual purchases (chargeImmediately), not for saving card details
    if (value && field.options?.chargeImmediately && !purchaseEmittedRef.current) {
      emitStripePurchaseEvent(field, cost)
      purchaseEmittedRef.current = true
    }
  }, [value, field, cost])

  // Handle product selection step
  if (showProductSelection) {
    if (error) {
      return (
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <Typography color="error" variant="h6">
              Product Configuration Error
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          </Grid>
        </Grid>
      )
    }

    if (loadingProducts) {
      return (
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <LinearProgress />
          </Grid>
          <Grid item>
            <Typography>{form_display_text_for_language(form, "Loading product information...")}</Typography>
          </Grid>
        </Grid>
      )
    }

    // Check if all products are filtered out by conditional logic
    if (visibleProducts.length === 0) {
      return (
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <Typography color="textSecondary">
              No products are available based on your previous answers.
            </Typography>
          </Grid>
        </Grid>
      )
    }

    const isSingleSelection = field.options?.radio === true

    const handleProductSelection = (productId: string) => {
      if (isSingleSelection) {
        setSelectedProducts([productId])
      } else {
        setSelectedProducts(prev =>
          prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        )
      }
    }

    const handleContinueToPayment = () => {
      if (selectedProducts.length === 0) return
      setShowProductSelection(false)
      fetchRef.current = true

      // Now fetch Stripe details with selected products
      session.api.form_responses.stripe_details({
        fieldId: field.id,
        enduserId,
        ...(selectedProducts.length > 0 && { selectedProductIds: selectedProducts }) // Pass selected products to Stripe checkout
      })
      .then(({ clientSecret, publishableKey, stripeAccount, businessName, customerId, isCheckout, answerText }) => {
        setAnswertext(answerText || '')
        setIsCheckout(!!isCheckout)
        setClientSecret(clientSecret)
        setStripePromise(loadStripe(publishableKey, { stripeAccount }))
        setBusinessName(businessName)
        setCustomerId(customerId)
      })
      .catch((e: any) => {
        console.error(e)
        if (typeof e?.message === 'string') {
          setError(e.message)
        }
      })
    }

    return (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Select Product{isSingleSelection ? '' : 's'}</Typography>
        </Grid>

        {visibleProducts.map((product) => {
          // Use real-time Stripe pricing if available, fallback to Tellescope pricing
          const price = product.currentPrice || product.cost
          const priceAmount = price?.amount || 0
          const priceCurrency = price?.currency || 'USD'

          return (
            <Grid item key={product._id}>
              <FormControlLabel
                control={
                  isSingleSelection ? (
                    <Radio
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleProductSelection(product._id)}
                    />
                  ) : (
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleProductSelection(product._id)}
                    />
                  )
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {product.title}
                    </Typography>
                    {product.description && (
                      <Typography variant="body2" color="textSecondary">
                        {product.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="primary">
                      ${(priceAmount / 100).toFixed(2)} {priceCurrency.toUpperCase()}
                      {product.currentPrice?.isSubscription && (
                        <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>
                          {format_stripe_subscription_interval(product.currentPrice?.interval, product.currentPrice?.interval_count)}
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          )
        })}

        <Grid item>
          <Button
            variant="contained"
            onClick={handleContinueToPayment}
            disabled={selectedProducts.length === 0}
            sx={{ mt: 2 }}
          >
            Continue to Payment
          </Button>
        </Grid>
      </Grid>
    )
  }

  if (error) {
    return (
      <Typography color="error">
        {error}
      </Typography>
    )
  }
  if (value) {
    return (
      <Grid container alignItems="center" wrap="nowrap">
        <CheckCircleOutline color="success" />

        <Typography sx={{ ml: 1, fontSize: 20 }}>
          {field.options?.chargeImmediately ? 'Your purchase was successful' : "Your payment details have been saved!"}
        </Typography>
      </Grid>
    )
  }
  if (!(clientSecret && stripePromise)) return <LinearProgress />
  if (isCheckout && stripePromise) return (
    <EmbeddedCheckoutProvider stripe={stripePromise}
      options={{ 
        clientSecret, 
        onComplete: () => onChange(answertext || 'Completed checkout', field.id),        
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
  return (
    <Elements stripe={stripePromise} options={{
      clientSecret,
    }}>
      <StripeForm businessName={businessName} onSuccess={() => onChange(answertext || 'Saved card details', field.id)}
        cost={cost}
        field={field}
        form={form}
      />
    </Elements>
  )
}

const StripeForm = ({ businessName, onSuccess, field, cost, form } : { businessName: string, onSuccess: () => void, field: FormField, cost: number, form?: Form }) => {
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
        {field.options?.chargeImmediately ? form_display_text_for_language(form, 'Make Payment') : form_display_text_for_language(form, 'Save Payment Details')}
      </Button>

      {cost > 0 && 
        <Typography sx={{ mt: 0.5 }}>
        {
          field.options?.customPriceMessage
            ? field.options.customPriceMessage.replaceAll('{{PRICE}}', `$${(cost / 100).toFixed(2)}`)
            : `You will be charged $${(cost / 100).toFixed(2)} ${field.options?.chargeImmediately ? '' : 'on form submission'}`
        }
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
          InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
          onChange={e => (
            (field.options?.radio && field.options.other)
              ? onChange(e.target.value ? [e.target.value] : [], field.id)
              : undefined
          )}
          placeholder={
            field.placeholder
              ? field.placeholder + ((!field.title && !field.isOptional) ? '*' : '')
              : undefined
          }
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
const preventRefetch: Record<string, boolean> = {}

const LOAD_CHOICES_LIMIT = 500
const MIN_SEARCH_CHARS = 3
const SEARCH_DEBOUNCE_MS = 300

const useDatabaseChoices = ({
  databaseId='',
  field,
  otherAnswers,
  searchQuery = ''
} : {
  databaseId?: string,
  field: FormField,
  otherAnswers?: DatabaseSelectResponse[],
  searchQuery?: string
}) => {
  const session = useResolvedSession()
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DatabaseRecord[]>([])
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS)

  // Load initial page on mount (only once, not recursively)
  const initialLoadRef = useRef(false)
  useEffect(() => {
    if (initialLoadRef.current) return
    if (choicesForDatabase[databaseId]?.done || choicesForDatabase[databaseId]?.records?.length) {
      setInitialLoadComplete(true)
      return
    }

    initialLoadRef.current = true
    preventRefetch[databaseId + field.id] = true

    session.api.form_fields.load_choices_from_database({
      fieldId: field.id,
      limit: LOAD_CHOICES_LIMIT,
      databaseId, // overrides fieldId, supports using Database question in Table Input
    })
    .then(({ choices: newChoices }) => {
      choicesForDatabase[databaseId] = {
        lastId: newChoices?.[newChoices.length - 1]?.id,
        records: newChoices.sort((c1, c2) => (
          label_for_database_record(field, c1)
          .localeCompare(label_for_database_record(field, c2))
        )),
        done: true, // Don't load more pages automatically
      }
      setInitialLoadComplete(true)
    })
    .catch(err => {
      console.error(err)
      preventRefetch[databaseId + field.id] = false
      setInitialLoadComplete(true) // Mark as complete even on error to avoid infinite loading
    })
  }, [session, field, databaseId])

  // Handle debounced search
  const searchRef = useRef(debouncedSearch)
  useEffect(() => {
    const trimmed = debouncedSearch.trim()

    // If search is cleared, return to initial results
    if (!trimmed) {
      setSearchResults([])
      setIsSearching(false)
      searchRef.current = debouncedSearch
      return
    }

    // Only search if meets minimum character requirement
    if (trimmed.length < MIN_SEARCH_CHARS) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    // Avoid duplicate searches
    if (searchRef.current === debouncedSearch) return
    searchRef.current = debouncedSearch

    setIsSearching(true)
    session.api.form_fields.load_choices_from_database({
      fieldId: field.id,
      limit: LOAD_CHOICES_LIMIT,
      databaseId,
      search: trimmed,
    })
    .then(({ choices: newChoices }) => {
      // Add search results to the same cache as initial load
      // This ensures selected search results persist even after search is cleared
      const existingRecords = choicesForDatabase[databaseId]?.records ?? []
      const existingIds = new Set(existingRecords.map(r => r.id))

      const uniqueNewChoices = newChoices.filter(c => !existingIds.has(c.id))

      if (uniqueNewChoices.length > 0) {
        choicesForDatabase[databaseId] = {
          ...choicesForDatabase[databaseId],
          records: [...existingRecords, ...uniqueNewChoices].sort((c1, c2) => (
            label_for_database_record(field, c1)
            .localeCompare(label_for_database_record(field, c2))
          )),
          done: true, // Mark as done since we're not paginating search results
        }
      }

      setSearchResults(newChoices.sort((c1, c2) => (
        label_for_database_record(field, c1)
        .localeCompare(label_for_database_record(field, c2))
      )))
      setIsSearching(false)
    })
    .catch(err => {
      console.error(err)
      setIsSearching(false)
    })
  }, [session, field, databaseId, debouncedSearch])

  const addChoice = useCallback((record: DatabaseRecord) => {
    if (!choicesForDatabase[databaseId]) {
      choicesForDatabase[databaseId] = {
        done: false,
        records: [],
      }
    }
    choicesForDatabase[databaseId].records!.push(record)
  }, [choicesForDatabase, databaseId])

  // Use search results if searching, otherwise use cached initial results
  const activeChoices = debouncedSearch.trim().length >= MIN_SEARCH_CHARS
    ? searchResults
    : (choicesForDatabase[databaseId]?.records ?? [])

  return {
    addChoice,
    doneLoading: initialLoadComplete,
    isSearching,
    choices: [
      ...activeChoices,
      ...(otherAnswers || []).map(v => ({
        id: v.text,
        databaseId,
        values: [{ label: field.options?.databaseLabel || '', type: 'Text', value: v.text }],
      }) as Pick<DatabaseRecord, 'id' | 'values' | 'databaseId'>)
    ],
    minSearchChars: MIN_SEARCH_CHARS,
  }
}


const label_for_database_record = (field: FormField, record?: Pick<DatabaseRecord, 'values'>) => {
  if (!record) return ''

  const addedLabels = (
    (field.options?.databaseLabels || [])
    .map(l => record.values.find(v => v.label === l)?.value?.toString())
    .filter(v => v?.trim())
  ) as string[]

  return (
    (record.values.find(v => v.label === field.options?.databaseLabel)?.value?.toString() ?? '')
    + (
      addedLabels.length
        ? ` (${addedLabels.join(', ')})`
        : ''
    ) 
  )
}

const get_other_answers = (_value?: DatabaseSelectResponse[], typing?: string) => {
  try { 
    const existing = (
      (_value || [])
      .filter(v => typeof v === 'string' || v.recordId === v.text)
      .map(v => typeof v === 'string' ? { databaseId: '', recordId: v, text: v } : v)
    )
    if (typing) {
      existing.push({ text: typing, databaseId: '', recordId: typing })
    }

    return existing
  } catch(err) { console.error(err) }

  return []
}

export interface AddToDatabaseProps {
  databaseId: string,
  onAdd: (record: DatabaseRecord) => void
}

export const DatabaseSelectInput = ({ AddToDatabase, field, value: _value, onChange, onDatabaseSelect, responses, size, disabled, enduser, inputProps }: FormInputProps<'Database Select'> & {
  responses: FormResponseValue[],
  AddToDatabase?: React.JSXElementConstructor<AddToDatabaseProps>,
  inputProps?: { sx: SxProps },
}) => {
  const [typing, setTyping] = useState('')
  const [open, setOpen] = useState(false)
  const selectedRecordsCache = useRef<Map<string, DatabaseRecord>>(new Map())
  const { addChoice, choices, doneLoading, isSearching, minSearchChars } = useDatabaseChoices({
    databaseId: field.options?.databaseId,
    field,
    otherAnswers: get_other_answers(_value, field?.options?.other ? typing : undefined),
    searchQuery: typing,
  })

  const value = React.useMemo(() => {
    try {
      // if the value is a string (some single answer that was saved), make sure we coerce to array
      const __value = typeof _value === 'string' ? [_value] : _value
      const result: DatabaseRecord[] = []

      for (const v of (__value ?? [])) {
        const recordId = typeof v === 'string' ? v : v.recordId

        // First try to find in current choices
        const found = choices.find(c =>
          c.id === recordId || (typeof v === 'string' && label_for_database_record(field, c) === v)
        )

        if (found) {
          // Update cache with found record
          selectedRecordsCache.current.set(found.id, found as DatabaseRecord)
          result.push(found as DatabaseRecord)
        } else if (recordId && selectedRecordsCache.current.has(recordId)) {
          // Use cached record if not in current choices (e.g., during search)
          result.push(selectedRecordsCache.current.get(recordId)!)
        }
      }

      return result
    } catch(err) {
      console.error('Error resolving database answers for _value', err)
      return []
    }
  }, [_value, choices, field])

  const filterResponse = useMemo(() => (
    field.options?.databaseFilter?.fieldId
      ? responses.find(r => r.fieldId === field.options?.databaseFilter?.fieldId)?.answer?.value
      : undefined
  ), [responses, field.options?.databaseFilter])

  // State filtering logic similar to Insurance component
  const addressQuestion = useMemo(() => responses?.find(r => {
    if (r.answer.type !== 'Address') return false
    if (r.field.intakeField !== 'Address') return false

    // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
    if (!r.answer.value?.state) return false

    return true
  }), [responses])

  const state = useMemo(() => (
    field.options?.filterByEnduserState
      ? ((addressQuestion?.answer?.type === 'Address' ? addressQuestion?.answer?.value?.state : undefined) || enduser?.state)
      : undefined
  ), [enduser?.state, addressQuestion, field.options?.filterByEnduserState])

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

        // use .text on r values to handle Database Select types as filter source (in addition to basic text and list of text)

        if (typeof v === 'object') {
          return !!(
            Object.values(v).find(oVal => (
              typeof oVal === 'string' || typeof oVal === 'number'
                ? (
                  Array.isArray(filterResponse)
                    ? (filterResponse as any[]).find(r => r === oVal.toString() || (typeof r === 'object' && r.text === oVal))
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
              ? (filterResponse as any[]).find(r => r === v.toString() || (typeof r === 'object' && r.text === v))
          : (typeof filterResponse === 'string' || typeof filterResponse === 'number')
              ? filterResponse.toString() === v.toString()
          : (typeof filterResponse === 'object' && (filterResponse as Address).city === v.toString()) ? true
          : (typeof filterResponse === 'object' && (filterResponse as Address).state === v.toString()) ? true
          : (typeof filterResponse === 'object' && (filterResponse as Address).zipCode === v.toString()) ? true
              : false
          )
        }

        return false
      })
    )
  }, [choices, filterResponse, field.options?.databaseFilter, value])

  // Apply state filtering as a secondary filter (doesn't modify existing logic)
  const stateFilteredChoices = useMemo(() => {
    if (!field.options?.filterByEnduserState || !state) {
      return filteredChoicesWithPotentialDuplicates
    }

    return filteredChoicesWithPotentialDuplicates.filter(c => {
      const recordState = c.values.find(v => v.label?.trim()?.toLowerCase() === 'state')?.value?.toString() || ''
      return !recordState || recordState === state
    })
  }, [filteredChoicesWithPotentialDuplicates, field.options?.filterByEnduserState, state])

  const filteredChoices = useMemo(() => {
    const filtered = []

    const uniques = new Set<string>([])
    for (const c of stateFilteredChoices) {
      const text = label_for_database_record(field, c)
      if (uniques.has(text)) continue // duplicate found

      uniques.add(text)
      filtered.push(c)
    }

    return filtered
  }, [field, stateFilteredChoices])

  // Show placeholder when typing but below minimum search characters
  const charsNeeded = typing.trim().length > 0 && typing.trim().length < minSearchChars
    ? minSearchChars - typing.trim().length
    : 0

  if (!doneLoading) return <LinearProgress />
  return (
    <>
    <Autocomplete id={field.id} freeSolo={false} size={size}
      componentsProps={{ popper: { sx: { wordBreak: "break-word" } } } }
      options={filteredChoices} multiple={true}
      loading={isSearching}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={o => (
        Array.isArray(o) // edge case
          ? ''
          : label_for_database_record(field, o)
      )}
      value={value}
      disabled={disabled}
      onChange={(_, v) => {
        if (v.length && onDatabaseSelect) {
          onDatabaseSelect(
            field.options?.radio
              ? [v[v.length - 1]] // if radio, only last selected
              : v
          )
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
      inputValue={typing}
      onInputChange={(e, v) => e && setTyping(v)}
      renderInput={params => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            sx: (inputProps || defaultInputProps).sx,
            endAdornment: (
              <>
                {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          placeholder={charsNeeded > 0 ? `Type ${charsNeeded} more character${charsNeeded > 1 ? 's' : ''} to search...` : undefined}
          helperText={charsNeeded > 0 ? `Type ${charsNeeded} more character${charsNeeded > 1 ? 's' : ''} to search` : undefined}
        />
      )}
      // use custom Chip to ensure very long entries break properly (whitespace: normal)
      renderTags={(value, getTagProps) =>
        value.map((value, index) => (
          <Chip
            label={<Typography style={{whiteSpace: 'normal'}}>{Array.isArray(value) ? '' : label_for_database_record(field, value)}</Typography>}
            {...getTagProps({ index })}
            sx={{height:"100%", py: 0.5 }}
          />
        ))
      }
    />

    {AddToDatabase && field?.options?.allowAddToDatabase && (
      <AddToDatabase databaseId={field.options?.databaseId!} onAdd={addChoice} />
    )}
    </>
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

const useMedications = ({ dontFetch } : { dontFetch?: boolean }) => {
  const [displayTerms, setDisplayTerms] = useState(displayTermsCache)
  const fetchRef = useRef(displayTerms !== undefined)

  useEffect(() => {
    if (dontFetch) return
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
  }, [dontFetch])

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

const filterOptions = (options: string[], { inputValue } : { inputValue: string }) => (
  (
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
  )
  .slice(0, 100) // dramatic performance improvement (when not virtualized) to show a subset like this
)

const FDB_URL = "http://www.fdbhealth.com/"
type CanvasMedicationResult = {
  entry?: { resource: { code: { coding: { system: string, code: string, display: string } []}} }[]
}

export const CanvasMedicationsInput = ({ field, value=[], onChange, form }: FormInputProps<'Medications'>) => {
  const session = useResolvedSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MedicationResponse[]>([])

  // if two Medications questions shown in a row, reset state
  useEffect(() => {
    setQuery('')
    setResults([])
  }, [field.id])

  const fetchRef = useRef(query)
  useEffect(() => {
    if (fetchRef.current === query) return
    fetchRef.current = query

    if (!query) return

    const t = setTimeout(() => {
      session.api.integrations
      .proxy_read({ 
        integration: CANVAS_TITLE, 
        type: 'medications', 
        query,
      })
      .then((r : { data: CanvasMedicationResult }) => {
        setResults(
          (r.data?.entry || [])
          .map(v => {
            const fdbCode = v.resource.code.coding.find(c => c.system === FDB_URL)

            return {
              displayTerm: fdbCode?.display || '',
              drugName: fdbCode?.display || '',
              fdbCode: fdbCode?.code || '', 
            }
          })
        )
      })   
    }, 200)

    return () => { clearTimeout(t) }
  }, [session, query, field?.options?.dataSource])

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
      <Autocomplete multiple value={value} options={results} style={{ marginTop: 5 }}
        noOptionsText={query.length ? form_display_text_for_language(form, 'No results found') : form_display_text_for_language(form, 'Type to start search')}
        onChange={(e, v) => {
          if (!v) { return }
          onChange(v, field.id)
          setResults([])
        }}
        getOptionLabel={v => first_letter_capitalized(v.displayTerm)} filterOptions={o => o}
        inputValue={query} onInputChange={(e, v) => e && setQuery(v) }
        renderInput={(params) => (
          <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
            required={!field.isOptional} size="small" label="" placeholder={form_display_text_for_language(form, "Search medications...")}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((value, index) => (
            <Chip
              label={<Typography style={{whiteSpace: 'normal'}}>{value.displayTerm}</Typography>}
              {...getTagProps({ index })}
              sx={{height:"100%", py: 0.5 }}
            />
          ))
        }
      /> 
      </Grid>

      {(value || []).map((medication, i) => (
        <Grid item key={i}>
        <Grid container direction="column" spacing={0.75}>
          <Grid item>
            <Typography noWrap sx={{ fontSize: 14 }}>
              {medication.drugName}
            </Typography>
          </Grid>

          <Grid item>
            <TextField InputProps={{ sx: defaultInputProps.sx }} fullWidth size="small" 
              label={form_display_text_for_language(form, "Medication instructions: how much you take, how often, and when")}
              value={medication.dosage?.description || ''} 
              onChange={e => (
                onChange((value || []).map((v, _i) => 
                  i === _i 
                    ? { ...v, dosage: { ...v.dosage!, description: e.target.value  } } 
                    : v
                  ), 
                  field.id
                )
              )} />
          </Grid>

          <Grid item>
            <Divider flexItem sx={{ my: 0.5 }} />
          </Grid>
        </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export const MedicationsInput = ({ field, value, onChange, form, ...props }: FormInputProps<'Medications'>) => {
  const { displayTerms, doneLoading, getCodesForDrug, getDrugsForDisplayTerm } = useMedications({
    dontFetch: field.options?.dataSource === CANVAS_TITLE
  })
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

  if (field.options?.dataSource === CANVAS_TITLE) {
    return <CanvasMedicationsInput field={field} value={value} onChange={onChange} {...props} />
  }
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
              <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }} required={!field.isOptional} label={form_display_text_for_language(form, "Search")} size="small" fullWidth />
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
                  <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }} required={!field.isOptional} label={form_display_text_for_language(form, "Drug Select")} size="small" fullWidth />
                }
              />
            </Grid>
          }

          {v.displayTerm && (v.drugName === "Unknown" || !v.drugName) &&
            <Grid item sx={{ mt: 1 }}>
              <TextField label={form_display_text_for_language(form, 'Other Drug')} fullWidth size="small" required
                InputProps={defaultInputProps}
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
                  InputProps={defaultInputProps}
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
                  // hide arrows for number input, which continue to increase after initial press
                  sx={{
                    '& input[type=number]': {
                      '-moz-appearance': 'textfield'
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                        '-webkit-appearance': 'none',
                        margin: 0
                    }
                  }}
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
              <TextField label={form_display_text_for_language(form, "Reason for taking medication")} size="small" fullWidth
                InputProps={defaultInputProps}
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
              {form_display_text_for_language(form, "Remove medication")}
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
          {form_display_text_for_language(form, "Add Medication")}
        </Button>
      </Grid>
    </Grid>
  )
}

export const BelugaPatientPreferenceInput = ({ field, value: _value, onChange, form }: FormInputProps<'Beluga Patient Preference'>) => {
  const value = Array.isArray(_value) ? _value : []

  return (
    <Grid container direction="column" sx={{ mt: 2 }}>
    {value.map((v, i) => (
      <>
      <Grid item key={i}>
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item sx={{ width: '100%'}}>
        <Grid container direction="column" spacing={1.5}>
          <Grid item>
            <TextField label={form_display_text_for_language(form, "Medication Name")} size="small" fullWidth required
              value={v.name ?? ''}
              onChange={e =>
                onChange(
                  value.map((_v, _i) => (
                    i === _i ? { ..._v, name: e.target.value } : _v
                  )),
                  field.id,
                )
              }
            />
          </Grid>

          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextField label={form_display_text_for_language(form, "Strength")} size="small" fullWidth required
                  value={v.strength ?? ''}
                  onChange={e =>
                    onChange(
                      value.map((_v, _i) => (
                        i === _i ? { ..._v, strength: e.target.value } : _v
                      )),
                      field.id,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label={form_display_text_for_language(form, "Dispense Unit")} size="small" fullWidth required
                  value={v.dispenseUnit ?? ''}
                  onChange={e =>
                    onChange(
                      value.map((_v, _i) => (
                        i === _i ? { ..._v, dispenseUnit: e.target.value } : _v
                      )),
                      field.id,
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField label={form_display_text_for_language(form, "Quantity")} size="small" fullWidth required
                  value={v.quantity ?? ''}
                  onChange={e =>
                    onChange(
                      value.map((_v, _i) => (
                        i === _i ? { ..._v, quantity: e.target.value } : _v
                      )),
                      field.id,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label={form_display_text_for_language(form, "Refills")} size="small" fullWidth required
                  value={v.refills ?? ''}
                  onChange={e =>
                    onChange(
                      value.map((_v, _i) => (
                        i === _i ? { ..._v, refills: e.target.value } : _v
                      )),
                      field.id,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label={form_display_text_for_language(form, "Days Supply")} size="small" fullWidth required
                  value={v.daysSupply ?? ''}
                  onChange={e =>
                    onChange(
                      value.map((_v, _i) => (
                        i === _i ? { ..._v, daysSupply: e.target.value } : _v
                      )),
                      field.id,
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <TextField label={form_display_text_for_language(form, "Sig (Instructions)")} size="small" fullWidth required multiline rows={2}
              value={v.sig ?? ''}
              onChange={e =>
                onChange(
                  value.map((_v, _i) => (
                    i === _i ? { ..._v, sig: e.target.value } : _v
                  )),
                  field.id,
                )
              }
            />
          </Grid>

          <Grid item>
            <TextField label={form_display_text_for_language(form, "Med ID (NDC11)")} size="small" fullWidth required
              value={v.medId ?? ''}
              onChange={e =>
                onChange(
                  value.map((_v, _i) => (
                    i === _i ? { ..._v, medId: e.target.value } : _v
                  )),
                  field.id,
                )
              }
            />
          </Grid>

          <Grid item>
            <Typography color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => onChange(value.filter((_, _i) => i !== _i), field.id)}
            >
              {form_display_text_for_language(form, "Remove medication")}
            </Typography>
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
          onClick={() => onChange([
            ...value,
            { name: '', strength: '', quantity: '', refills: '', daysSupply: '', sig: '', dispenseUnit: '', medId: '' }
          ], field.id)}
        >
          {form_display_text_for_language(form, "Add Medication")}
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
    return "Date of birth should be MM-DD-YYYY"
  }
}

export const RelatedContactsInput = ({ field, value: _value, onChange, error: parentError, form, ...props }: FormInputProps<'Related Contacts'>) => {
  // safeguard against any rogue values like empty string
  const value = Array.isArray(_value) ? _value : []

  const [editing, setEditing] = useState(value.length === 1 ? 0 : -1)

  const handleAddContact = useCallback(() => {
    onChange([
      ...value, 
      { relationships: field?.options?.relatedContactTypes?.length === 1 ? [{ type: field.options.relatedContactTypes[0] as EnduserRelationship['type'], id: ''! } ] : [] }], 
      field.id, 
      true
    )
    setEditing(value.length)
  }, [onChange, value, field?.id, field?.options?.relatedContactTypes])

  if (value[editing]) {
    const { fname, lname, email, phone, fields={}, dateOfBirth='', relationships } = value[editing]
    const errorMessage = contact_is_valid(value[editing])

    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          {!field.options?.hiddenDefaultFields?.includes('First Name') &&  
            <Grid item xs={4}>
              <TextField label={form_display_text_for_language(form, "First Name")} size="small" fullWidth
                InputProps={defaultInputProps}
                value={fname} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, fname: e.target.value } : v), field.id)}
              />
            </Grid>
          }

          {!field.options?.hiddenDefaultFields?.includes('Last Name') &&  
          <Grid item xs={4}>
            <TextField label={form_display_text_for_language(form, "Last Name")} size="small" fullWidth
              InputProps={defaultInputProps}
              value={lname} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, lname: e.target.value } : v), field.id)}
            />
          </Grid>
          }

          <Grid item xs={4}>
            <StringSelector options={field.options?.relatedContactTypes?.length ? field.options.relatedContactTypes : RELATIONSHIP_TYPES} label={form_display_text_for_language(form, "Relationship")} size="small"
              disabled={field?.options?.relatedContactTypes?.length === 1}
              value={relationships?.[0]?.type ?? ''} 
              onChange={type => onChange(value.map((v, i) => i === editing ? { ...v, relationships: [{ type: type as EnduserRelationship['type'], id: '' /* to be filled on server-side */ }] } : v), field.id)}
            />
          </Grid>
        </Grid>
        </Grid>

        <Grid item>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          {!field.options?.hiddenDefaultFields?.includes('Date of Birth') &&  
          <Grid item xs={4}>
            <DateStringInput value={dateOfBirth} field={{ ...field, isOptional: true }} size="small" label={form_display_text_for_language(form, "Date of Birth (MM-DD-YYYY)")}
              onChange={dateOfBirth => onChange(value.map((v, i) => i === editing ? { ...v, dateOfBirth } : v), field.id)}
            />
          </Grid>
          }

          {!field.options?.hiddenDefaultFields?.includes('Email') &&  
          <Grid item xs={4}>
            <TextField label={form_display_text_for_language(form, "Email")} size="small" fullWidth type="email"
              InputProps={defaultInputProps}
              value={email} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, email: e.target.value } : v), field.id)}
            />
          </Grid>
          }

          {!field.options?.hiddenDefaultFields?.includes('Phone Number') &&  
          <Grid item xs={4}>
            <TextField label={form_display_text_for_language(form, "Phone Number")} size="small" fullWidth
              InputProps={defaultInputProps}
              value={phone} onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, phone: e.target.value.trim() } : v), field.id)}
            />
          </Grid>
          }
        </Grid>
        </Grid>

        {/* todo: refactor instead of copying from table input code? */}
        {(field.options?.tableChoices || []).length > 0 && 
          <Grid item>
          <Grid container spacing={1}>
          {(field.options?.tableChoices || []).map(({ info, label, type}, i) => (
            <Grid item xs={6} key={i}>
            {type === 'Text'
                ? (
                  <TextField label={label} size="small" fullWidth
                    InputProps={defaultInputProps}
                    value={fields[label] as string || ''} 
                    onChange={e => onChange(value.map((v, i) => i === editing ? { ...v, fields: { ...fields, [label]: e.target.value} } : v), field.id)}
                  />
                )
                : type === 'Date' ? (
                  <DateStringInput label={label} size="small" fullWidth
                    field={{ ...field, isOptional: true }}
                    value={fields[label] as string || ''} 
                    onChange={(e='') => onChange(value.map((v, i) => i === editing ? { ...v, fields: { ...fields, [label]: e } } : v), field.id)}
                  />
                )
                : type === 'Select' ? (
                    <FormControl size="small" fullWidth>
                      <InputLabel id="demo-select-small">{label}</InputLabel>
                      <Select label={label} size="small"
                        sx={defaultInputProps.sx}
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
          <Button variant="outlined" onClick={() => setEditing(-1)} size="small" disabled={!!errorMessage || !!parentError}>
            {form_display_text_for_language(form, "Save Contact")}
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
              {user_display_name(contact) || `${form_display_text_for_language(form, "Unnamed Contact")} ${i + 1}`}
            </Typography>
          </Grid> 
          </Grid> 

          <Grid item>
            <LabeledIconButton Icon={Delete} label={form_display_text_for_language(form, "Remove")} onClick={() => onChange(value.filter((v, _i) => i !== _i), field.id)} />
          </Grid> 
        </Grid> 
        </Grid>
      ))}
      </Grid>

      <Grid item>
        <Button variant="contained" onClick={handleAddContact}>
          {form_display_text_for_language(form, "Add Contact")}
        </Button>
      </Grid>
    </Grid>
  )
}

export const AppointmentBookingInput = ({ formResponseId, field, value, onChange, form, responses, goToPreviousField, isPreviousDisabled, enduserId, ...props }: FormInputProps<'Appointment Booking'>) => {
  const session = useResolvedSession()

  const [loaded, setLoaded] = useState<Awaited<ReturnType<typeof session['api']['form_fields']['booking_info']>>>()
  const [error, setError] = useState('')
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false)
  const [height, setHeight] = useState(450)
  const [confirming, setConfirming] = useState(false)

  const bookingPageId = field?.options?.bookingPageId


  const downloadICS = useCallback(async (event : Pick<CalendarEvent, 'id'>) => {
    try {
      downloadFile(
        await session.api.calendar_events.download_ics_file({ calendarEventId: event.id, excludeAttendee: true }) as any, 
        { name: "event.ics", dataIsURL: true, type: 'text/calendar'}
      )
    } catch(err) {
      console.error(err)
    }
  }, [session])

  const addressQuestion = useMemo(() => responses?.find(r => {
    if (r.answer.type !== 'Address') return false
    if (r.field.intakeField !== 'Address') return false

    // make sure state is actually defined (in case of multiple address questions, where 1+ are blank)
    if (!r.answer.value?.state) return false

    return true
  }), [responses])
  const state = useMemo(() => (
    addressQuestion?.answer?.type === 'Address' ? addressQuestion?.answer?.value?.state : undefined
  ), [addressQuestion])

  const loadBookingInfo = useCallback(() => {
    if (!bookingPageId) return

    setError('')
    session.api.form_fields.booking_info({ 
      enduserId,
      bookingPageId,
      enduserFields: { state }
    })
    .then(setLoaded)
    .catch(e => setError(e?.message || e?.toString() || 'Error loading appointment details'))
  }, [enduserId, bookingPageId, session, state])

  const fetchRef = useRef(false)
  useEffect(() => {
    if (value) return
    if (!bookingPageId) return
    if (fetchRef.current) return
    fetchRef.current = true

    loadBookingInfo()
  }, [bookingPageId, loadBookingInfo, value])

  useEffect(() => {
    const handleMessage = (m: MessageEvent) => {
      // entropy to separate from other booking pages rendered on the same screen
      if (
        m?.data?.type === 'Booking Success' 
        && typeof m?.data?.bookedEventId === 'string' 
        && (!m?.data?.entropy || m?.data?.entropy === loaded?.entropy)
      ) {
        onChange(m.data.bookedEventId, field.id)
        emit_gtm_event({ event: 'form_progress', fieldId: field.id, formId: field.formId, title: field.title, status: "Appointment Booked" })
      }
      if (m?.data?.type === 'CalendarPicker') {
        setHeight(750)
      }
      if (m?.data?.type === 'UsersPicker') {
        setHeight(450)
      }
      if (m?.data?.type === 'Confirmation') {
        setConfirming(true)
      } 
      if (m?.data?.type === 'Join Link' && m?.data?.link) {
        update_local_storage('tellescope_last_booking_page_join_link', m.data.link)
      }
      else {
        setConfirming(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => { window.removeEventListener('message', handleMessage) }
  }, [field?.id, field?.formId, field?.title, onChange, acknowledgedWarning, value, loaded?.entropy])

  if (value) {
    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
        <Grid container alignItems="center" wrap="nowrap">
          <CheckCircleOutline color="success" />

          <Typography sx={{ ml: 1, fontSize: 20 }}>
            {form_display_text_for_language(form, "Your appointment has been booked")}
          </Typography>
        </Grid>
        </Grid>

        <Grid item sx={{ maxWidth: 250 }}>
          <LoadingButton variant="contained" style={{ maxWidth: 250 }}
            submitText={form_display_text_for_language(form, "Add to Calendar")} submittingText={form_display_text_for_language(form, "Downloading...")}
            onClick={() => downloadICS({ id: value })}
          />
        </Grid>
      </Grid>
    )
  }
  if (!bookingPageId) {
    return <Typography>{form_display_text_for_language(form, "No booking page specified")}</Typography>
  }
  if (error) {
    return (
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography color="error">Error: {error}</Typography>
        </Grid>

        <Grid item>
          <LoadingButton disabled={!bookingPageId} style={{ maxWidth: 300 }}
            variant="contained" onClick={loadBookingInfo}
            submitText="Try Again" submittingText="Loading..."
          />
        </Grid>
      </Grid>
    )
  }  
  if (!loaded?.bookingURL) {
    return <LinearProgress />
  }

  let bookingURL = loaded.bookingURL
  if (field.options?.userTags?.length) {
    bookingURL += `&userTags=${
      field.options.userTags
      .flatMap(t => {
        // set dynamic tags if found
        if (t === '{{logic}}') {
          return new URL(window.location.href).searchParams.get('logic') || '{{logic}}'
        }
        if (t.startsWith("{{field.") && t.endsWith(".value}}")) {
          const fieldId = t.replace('{{field.', '').replace(".value}}", '')

          const answer = responses?.find(r => r.fieldId === fieldId)?.answer
          if (!answer?.value) return t

          if (answer.type === 'Insurance') {
            return answer.value.payerName || ''
          }
          if (Array.isArray(answer.value) && typeof answer.value?.[0] === 'string') {
            return answer.value as string[]
          }
          return form_response_value_to_string(answer.value)
        }
        return t
      })
      .join(',')
    }`
  }
  if (field.options?.userFilterTags?.length) {
    bookingURL += `&userFilterTags=${
      field.options.userFilterTags
      .flatMap(t => {
        // set dynamic tags if found
        if (t === '{{logic}}') {
          return new URL(window.location.href).searchParams.get('logic') || '{{logic}}'
        }
        if (t.startsWith("{{field.") && t.endsWith(".value}}")) {
          const fieldId = t.replace('{{field.', '').replace(".value}}", '')

          const answer = responses?.find(r => r.fieldId === fieldId)?.answer
          if (!answer?.value) return t

          if (answer.type === 'Insurance') {
            return answer.value.payerName || ''
          }
          if (Array.isArray(answer.value) && typeof answer.value?.[0] === 'string') {
            return answer.value as string[]
          }
          return form_response_value_to_string(answer.value)
        }
        return t
      })
      .join(',')
    }`
  }
  // Filter to Bridge eligibility userIds if option is enabled
  if (field.options?.useBridgeEligibilityResult) {
    const bridgeUserIds = getBridgeEligibilityUserIds()

    if (bridgeUserIds.length === 0) {
      return <Typography>{form_display_text_for_language(form, "No eligible users found for booking")}</Typography>
    }

    bookingURL += `&userIds=${bridgeUserIds.join(',')}`
  }
  // need to use form?.id for internally-submitted forms because formResponseId isn't generated until initial submission or saved draft
  if (field.options?.holdAppointmentMinutes && (formResponseId || field?.id)) {
    bookingURL += `&formResponseId=${formResponseId || field?.id}`
    bookingURL += `&holdAppointmentMinutes=${field.options.holdAppointmentMinutes}`
  }

  return (
    <Grid container direction="column" spacing={1} sx={{ mt: 1 }}>
      {/* When skipping user selection, include a back button at the top for clearer navigation on mobile */}
      {!!field.options?.userFilterTags?.length && !field.options.userTags?.length && !isPreviousDisabled?.() && !confirming &&
        <Grid item alignSelf="flex-start" >
        <Button variant="outlined" onClick={goToPreviousField} sx={{ height: 25, p: 0.5, px: 1 }}>
          {form_display_text_for_language(form, "Back")}
        </Button>
        </Grid>
      }

      {loaded.warningMessage &&
        <Grid item>
          <Typography color="error" sx={{ fontSize: 20, fontWeight: 'bold' }}>
            {loaded.warningMessage}
          </Typography>
        </Grid>
      }

      <Grid item>
      {(!loaded.warningMessage || acknowledgedWarning)
        ? (
          <iframe title="Appointment Booking Embed" 
            src={bookingURL}
            style={{ border: 'none', width: '100%', height }}
          />
        )
        : (
          <Button variant="outlined" onClick={() => setAcknowledgedWarning(true)}>
            Show Booking Page Preview
          </Button>
        )
      }
      </Grid>
    </Grid>
  )
}

export const HeightInput = ({ field, value={} as any, onChange, form, ...props }: FormInputProps<'Height'>) => (
  <Grid container alignItems='center' wrap="nowrap" spacing={1} style={{ marginTop: 5 }}>
    <Grid item sx={{ width: '100%' }}>
      <TextField fullWidth size="small" label={form_display_text_for_language(form, "Feet")} type="number"
        value={value?.feet || ''}
        onChange={e => onChange({ ...value, feet: parseInt(e.target.value) }, field.id)}
      />
    </Grid>
    <Grid item sx={{ width: '100%' }}>
      <TextField fullWidth size="small" label={form_display_text_for_language(form, "Inches")} type="number"
        value={value?.inches ?? ''}
        onChange={e => onChange({ ...value, inches: parseInt(e.target.value) }, field.id)}
      />
    </Grid>
  </Grid>
)

export const include_current_url_parameters_if_templated = (url: string ) => {
  try {
    // get parameters from the current URL, and replace all values where {{URL_PARAM.paramName}} is used
    const params = new URL(window.location.href).searchParams
    return url.replace(/{{URL_PARAM\.(.*?)}}/g, (_, paramName) => {
      const value = params.get(paramName)
      console.log(paramName, value)
      if (value === null) return ''
      return value
    })

  } catch(err) {
    console.error(err)
  }
  return url
}

export const RedirectInput = ({ enduserId, groupId, groupInsance, rootResponseId, formResponseId, field, submit, value={} as any, onChange, responses, enduser, ...props }: FormInputProps<'Redirect'>) => {
  const session = useResolvedSession()

  let eId = ''
  try {
    eId = new URL(window.location.href).searchParams.get('eId') || enduserId || enduser?.id || ''
  } catch(err) {}

  // Helper function to find the first answered intake field response
  // This handles cases where duplicate intake fields exist across conditional branches
  const findAnsweredIntakeField = (intakeField: string) => {
    return responses?.find(r => r.intakeField === intakeField && r.answer?.value)?.answer?.value
  }

  const email = (
    findAnsweredIntakeField('email')
  || enduser?.email
  || session.userInfo.email
  )
  const phone = (
    findAnsweredIntakeField('phone')
  || enduser?.phone
  || session.userInfo.phone
  )
  const fname = (
    findAnsweredIntakeField('fname')
  || enduser?.fname
  || session.userInfo?.fname
  )
  const lname = (
    findAnsweredIntakeField('lname')
  || enduser?.lname
  || session.userInfo?.lname
  )
  const state = (
     findAnsweredIntakeField('state')
  // Handle Address field - find first Address with an actual state value
  // (in case of multiple address questions where some are blank)
  || (responses?.find(r => r.intakeField === 'Address' && r.answer?.type === 'Address' && r.answer?.value?.state)?.answer?.value as Address)?.state
  || enduser?.state
  || (session.userInfo as Enduser)?.state
  )

  useEffect(() => {
    if (session.type === 'user') { return }

    if (field.options?.redirectExternalUrl) { 
      submit?.() 
      .finally(() => {
        if (!field.options?.redirectExternalUrl) { return }

        window.location.href = (
          include_current_url_parameters_if_templated(
            replace_enduser_template_values(
              field.options.redirectExternalUrl, 
              {
                ...session.userInfo as any,
                id: eId, email, fname, lname, state, phone, 
              }
            )
          )  
        )
      })
      .catch(console.error)
      
      return 
    }

    if (!field.options?.redirectFormId) { return }

    session.api.form_responses.prepare_form_response({
      enduserId: session.userInfo.id || eId,
      formId: field.options.redirectFormId,
      rootResponseId: rootResponseId || formResponseId,
      parentResponseId: formResponseId,
    })
    .then(({ fullURL }) => (
      // we should still redirect even if submission fails
      submit?.() 
      .catch(console.error)
      .finally(() => {
        // if accessing form group in portal
        if (window.location.href.includes('/documents') && groupId && groupInsance) {
          const toRedirect = `${window.location.origin}/documents?groupId=${groupId}&groupInstance=${groupInsance}`
          if (fullURL.endsWith('&')) {
            window.location.replace(fullURL + `back=${toRedirect}&`)
          } else {
            window.location.replace(fullURL + `&back=${toRedirect}`) 
          }
        } else {
          window.location.replace(fullURL)
        }
      })
    ))
    .catch(console.error)
  }, [session, email, fname, lname, state, phone])

  if (session.type === 'user') {
    return (
      <Typography>
        Redirect is for patient-facing forms only
      </Typography>
    )
  }

  return null
}

export const HiddenValueInput = ({ goToNextField, goToPreviousField, field, value, onChange, isSinglePage, groupFields }: FormInputProps<'email'>) => {
  let lastRef = useRef(0)
  let lastIdRef = useRef('')

  // in a Question Group, only the first Hidden Value should navigate
  // AND, it should only navigate if the group only contains hidden values
  const firstHiddenValue = groupFields?.find(v => v.type === 'Hidden Value')
  const dontNavigate = (
    (firstHiddenValue && firstHiddenValue?.id !== field.id) // is in a group, but not the first hidden value
  || !!(groupFields?.find(v => v.type !== 'Hidden Value')) // group contains at least 1 non-hidden value
  )

  const publicIdentifier = useMemo(() => {
    try {
      return new URL(window.location.href).searchParams.get('publicIdentifier') || ''
    } catch(err) {
      return ''
    }
  }, [])

  const valueToSet = useMemo(() => (
    (field.title === "{{PUBLIC_IDENTIFIER}}" && publicIdentifier) ? publicIdentifier
      : field.title
  ), [field.title, publicIdentifier])

  useEffect(() => {
    if (lastRef.current > Date.now() - 1000 && lastIdRef.current === field.id) return
    lastRef.current = Date.now()
    lastIdRef.current = field.id

    if (value) {
      if (isSinglePage) return
      onChange('', field.id)

      if (dontNavigate) return
      goToPreviousField?.()
    } else {
      onChange(valueToSet, field.id)

      if (dontNavigate) return

      // pass value that is set after above onChange
      goToNextField?.({ type: 'Hidden Value', value: valueToSet })
    }
  }, [value, onChange, field.id, valueToSet, goToNextField, goToPreviousField, isSinglePage, dontNavigate])

  return <></>
}

export const EmotiiInput = ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'email'>) => {
  const session = useResolvedSession()
  const requestIdRef = useRef(value || `${field.id}${formResponseId || Date.now()}`)
  const [data, setData] = useState<{ surveyRequestId: string, surveyUrl: string }>()
  const [loadCount, setLoadCount] = useState(0)

  const fetchRef = useRef(false)
  useEffect(() => {
    if (value) return
    if (fetchRef.current) return
    fetchRef.current = true

    session.api.integrations
    .proxy_read({ 
      integration: EMOTII_TITLE, 
      type: 'get_survey', 
      id: props?.enduserId, // defaults to session id when not defined
      query: requestIdRef.current,
    })
    .then(r => setData(r.data))
  }, [session, value, props?.enduserId])

  const loadAnswerRef = useRef(false)
  useEffect(() => {
    if (loadCount !== 2) return
    if (loadAnswerRef.current) return
    loadAnswerRef.current = true

    onChange(requestIdRef.current, field.id)
  }, [loadCount])

  if (value || loadCount === 2) return (
    <Grid container alignItems="center" wrap="nowrap">
      <CheckCircleOutline color="success" />

      <Typography sx={{ ml: 1, fontSize: 20 }}>
        {form_display_text_for_language(form, "Please click Next or Submit to continue.")}
      </Typography>
    </Grid>
  )
  if (!data) { return <LinearProgress /> }
  return (
    <iframe src={data.surveyUrl} style={{ border: 'none', height: 650, width: '100%' }} 
      onLoad={() => setLoadCount(l => l + 1)} 
    />
  )
}

type AllergyResult = {
  entry?: { resource: { code: { coding: { system: "http://www.fdbhealth.com/", code: string, display: string } []}} }[]
}

export const AllergiesInput = ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Allergies'>) => {
  const session = useResolvedSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ code: string, display: string }[]>([])

  // if two allergy questions shown in a row, reset state
  useEffect(() => {
    setQuery('')
    setResults([])
  }, [field.id])

  const fetchRef = useRef(query)
  useEffect(() => {
    if (fetchRef.current === query) return
    fetchRef.current = query

    if (!query) return

    const t = setTimeout(() => {
      if (field.options?.dataSource === CANVAS_TITLE) {
        session.api.integrations
        .proxy_read({ 
          integration: CANVAS_TITLE, 
          type: 'allergies', 
          query,
        })
        .then((r : { data: AllergyResult }) => {
          const deduped: typeof results = []
          const totalResults = (
            (r.data.entry || [])
            .flatMap(v => v?.resource?.code?.coding || [])
            .filter(v => v.system.includes('fdbhealth'))
            .map(v => ({ code: v.code, display: v.display, system: v.system }))
          )
          for (const v of totalResults) {
            if (deduped.find(d => d.display === v.display)) { continue }

            deduped.push(v)
          }
          setResults(deduped)
        })
      } else {
        session.api.allergy_codes.getSome({ search: { query }})
        .then(results => {
          const deduped: typeof results = []
          for (const v of results) {
            if (deduped.find(d => d.display === v.display)) { continue }

            deduped.push(v)
          }
          setResults(deduped)
        })
      }

      
    }, 200)

    return () => { clearTimeout(t) }
  }, [session, query, field?.options?.dataSource])

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
      <Autocomplete multiple value={value || []} options={results} style={{ marginTop: 5 }}
        noOptionsText={query.length ? form_display_text_for_language(form, 'No results found') : form_display_text_for_language(form, 'Type to start search')}
        onChange={(e, v) => {
          if (!v) { return }
          onChange(v, field.id)
          setResults([])
        }}
        getOptionLabel={v => first_letter_capitalized(v.display)} filterOptions={o => o}
        inputValue={query} onInputChange={(e, v) => e && setQuery(v) }
        renderInput={(params) => (
          <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
            required={!field.isOptional} size="small" label="" placeholder={form_display_text_for_language(form, "Search allergies...")}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((value, index) => (
            <Chip
              label={<Typography style={{whiteSpace: 'normal'}}>{value.display}</Typography>}
              {...getTagProps({ index })}
              sx={{height:"100%", py: 0.5 }}
            />
          ))
        }
      /> 
      </Grid>

      {(value || []).map((allergy, i) => (
        <Grid item key={i}>
        <Grid container alignItems="center" wrap="nowrap" columnGap={0.5} justifyContent={"space-between"}>
          <Grid item>
            <Typography noWrap sx={{ width: 85, fontSize: 14 }}>
              {allergy.display}
            </Typography>
          </Grid>

          <Grid item sx={{ width: 140 }}>
            <StringSelector options={['mild', 'moderate', 'severe']} size="small" label={form_display_text_for_language(form, "Severity")}
              value={allergy.severity || ''}
              onChange={severity => onChange((value || []).map((v, _i) => i === _i ? { ...v, severity } : v), field.id)}
              getDisplayValue={first_letter_capitalized}
            />
          </Grid>

          <Grid item sx={{ width: "50%" }}>
            <TextField InputProps={{ sx: defaultInputProps.sx }} fullWidth size="small" label={form_display_text_for_language(form, "Note")}
              value={allergy.note || ''}
              onChange={e => onChange((value || []).map((v, _i) => i === _i ? { ...v, note: e.target.value } : v), field.id)}
            />
          </Grid>
        </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
const display_with_code = (v: { code: string, display: string }) => `${v.code}: ${first_letter_capitalized(v.display)}`

export const ConditionsInput = ({ goToNextField, goToPreviousField, field, value, onChange, form, formResponseId, ...props }: FormInputProps<'Conditions'>) => {
  const session = useResolvedSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ code: string, display: string }[]>([])

  const fetchRef = useRef(query)
  useEffect(() => {
    if (fetchRef.current === query) return
    fetchRef.current = query

    if (!query) return

    const t = setTimeout(() => {
      session.api.diagnosis_codes.getSome({ search: { query } })
      .then(codes => {
        const deduped: typeof results = []
        for (const v of codes) {
          if (deduped.find(d => d.display === v.display)) { continue }

          deduped.push(v)
        }
        setResults(deduped)
      })
    }, 200)

    return () => { clearTimeout(t) }
  }, [session, query])

  return (
    <Autocomplete multiple value={value || []} options={results} style={{ marginTop: 5 }}
      noOptionsText={query.length ? form_display_text_for_language(form, 'No results found') : form_display_text_for_language(form, 'Type to start search')}
      onChange={(e, v) => {
        if (!v) { return }
        onChange(v, field.id)
        setResults([])
      }}
      getOptionLabel={display_with_code} filterOptions={o => o}
      inputValue={query} onInputChange={(e, v) => e && setQuery(v) }
      renderInput={(params) => (
        <TextField {...params} InputProps={{ ...params.InputProps, sx: defaultInputProps.sx }}
          required={!field.isOptional} size="small" label="" placeholder={form_display_text_for_language(form, "Search conditions...")}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((value, index) => (
          <Chip
            label={<Typography style={{whiteSpace: 'normal'}}>{display_with_code(value)}</Typography>}
            {...getTagProps({ index })}
            sx={{height:"100%", py: 0.5 }}
          />
        ))
      }
    /> 
  )
}

export const RichTextInput = ({ field, value, onChange }: FormInputProps<'Rich Text'>) => (
  <WYSIWYG stopEnterPropagation initialHTML={value} onChange={v => onChange(v, field.id)} style={{ width: '100%' }} editorStyle={{ width: '100%' }} />
)

export const ChargeebeeInput = ({ field, value, onChange, setCustomerId }: FormInputProps<'Chargebee'> & { 
  setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>,
}) => {
  const session = useResolvedSession()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const [loadCount, setLoadCount] = useState(0)

  const fetchRef = useRef(false)
  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true
    
    session.api.form_responses.chargebee_details({ fieldId: field.id })
    .then(({ url }) => setUrl(url))
    .catch(setError)
  }, [session])

  const loadAnswerRef = useRef(false)
  useEffect(() => {
    if (loadCount !== 2) return
    if (loadAnswerRef.current) return
    loadAnswerRef.current = true

    onChange({ url }, field.id)
  }, [loadCount, url])

  if (value || loadCount === 2) {
    return (
      <Grid container alignItems="center" wrap="nowrap">
        <CheckCircleOutline color="success" />

        <Typography sx={{ ml: 1, fontSize: 20 }}>
          Your purchase was successful
        </Typography>
      </Grid>
    )
  }
  if (error && typeof error === 'string') return <Typography color="error">{error}</Typography>
  if (!url) return <LinearProgress />
  return (
    <iframe src={url} title="Checkout" style={{ border: 'none', width: '100%', height: 700 }} 
      onLoad={() => setLoadCount(l => l + 1)} 
    />
  )
}