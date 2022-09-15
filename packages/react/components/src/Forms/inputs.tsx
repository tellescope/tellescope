import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { Box, Checkbox, Grid, TextField, TextFieldProps, Typography } from "@mui/material"
import { FormInputProps } from "./types"
import { useDropzone } from "react-dropzone"
import { PRIMARY_HEX } from "@tellescope/constants"
import { objects_equivalent } from "@tellescope/utilities"
import { MultipleChoiceOptions } from "@tellescope/types-models/src"
import Slider from '@mui/material/Slider';

import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { datepickerCSS } from "./css/react-datepicker" // avoids build issue with RN
import { Indexable } from "@tellescope/types-utilities"
import { Styled } from ".."
import { FormField } from "@tellescope/types-client"
import { css } from '@emotion/css'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export const RatingInput = ({ field, value, onChange }: FormInputProps<'rating'>) => {
  const from = field?.options?.from || 1
  const to   = field?.options?.to   || 10

  const marks = []
  for (let i=from; i<=to; i++) {
    marks.push({ value: i, label: i })
  }

  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    onChange(Math.ceil((to - from) / 2))
  }, [onChange])

  return (
    <Slider min={from} max={to} step={1} marks={marks}
      valueLabelDisplay="on"
      value={value ?? Math.ceil((to - from) / 2)} onChange={(e, v) => onChange(v as number)}
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
export const RankingInput = ({ value, onChange }: FormInputProps<'ranking'>) => {
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
      )) 
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
      onChange={(d: Date) => onChange?.(d)}
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

export const AutoFocusTextField = (props: TextFieldProps) => {
  const ref = useRef(null as HTMLElement | null)

  useEffect(() => {
    ref.current?.focus()
  }, [ref])

  return (
    <TextField {...props} inputRef={ref} />
  )
}

export const StringInput = ({ field, value, onChange }: FormInputProps<'string'>) => (
  <AutoFocusTextField required={!field.isOptional} fullWidth value={value} placeholder="Answer here..." onChange={e => onChange(e.target.value)} />
)

export const PhoneInput = ({ field, value, onChange }: FormInputProps<'phone'>) => (
  <AutoFocusTextField required={!field.isOptional} fullWidth placeholder="Enter phone..." value={value} onChange={e => onChange(e.target.value)} />
)

export const EmailInput = ({ field, value, onChange }: FormInputProps<'email'>) => (
  <AutoFocusTextField required={!field.isOptional} fullWidth placeholder="Enter email..." type="email" value={value} onChange={e => onChange(e.target.value)} />
)

export const NumberInput = ({ field, value, onChange }: FormInputProps<'number'>) => (
  <AutoFocusTextField required={!field.isOptional} fullWidth placeholder="Enter a number..." type="number" value={value} onChange={e => onChange(parseInt(e.target.value))} />
)

export const SignatureInput = ({ value, onChange }: FormInputProps<'signature'>) => {
  const [consented, setConsented] = useState(false)
  const [name, setName] = useState('')

  const handleConsentChange = () => {
    const newConsent = !consented

    setConsented(newConsent)
    onChange({
      signed: newConsent && !!name,
      fullName: name,
    })
  }

  const handleNameChange = (newName: string) => {
    setName(newName.substring(0, 100))
    onChange({
      signed: consented && !!newName,
      fullName: newName,
    })
  }

  return (
    <Grid container alignItems="center">
      <Grid item xs={12}> 
        <Checkbox
          style={{ margin: 0, marginTop: 5, padding: 0, paddingRight: 3 }}
          color="primary"
          checked={consented}
          onClick={() => handleConsentChange()}
          inputProps={{ 'aria-label': 'consent to e-signature checkbox' }}
        />
        <Typography component="span" style={{ position: 'relative', top: 5, left: 2 }}> 
          I consent to 
          use <a href="/e-signature-terms" target="_blank" rel="noopener noreferrer"> electronic signatures </a>
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 12 }}>
        <TextField disabled={!consented} 
          style={{ width: '100%'}}
          size="small"
          aria-label="Full Name"
          value={name} 
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

export const FileInput = ({ value, onChange }: FormInputProps<'file'>) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop: useCallback(acceptedFiles => onChange(acceptedFiles.pop()), [onChange]),
  })

  return (
    <Grid container {...getRootProps()} sx={{
      width: "100%",
      border: "1px dashed #000000",
      borderRadius: 10,
      padding: 6,
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
          : value        ? `${value.name} selected!`
                          : "Select a File"}
        </p>
        
      }
    </Grid>
  ) 
}

export const MultipleChoiceInput = ({ field, value, onChange }: FormInputProps<'multiple_choice'>) => {
  const { choices, radio, other } = field.options as MultipleChoiceOptions

  const [selected, setSelected] = useState(choices.map(c => false))
  const [otherChecked, setOtherChecked] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [localValue, setLocalValue] = useState<{
    indexes: number[],
    otherText: string,
  }>()

  const textRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef<typeof value | undefined>(undefined)

  const getIndexes = useCallback((s : boolean[]) => {
    const indexes = []
    for (let i=0; i < s.length; i ++) if (s[i]) indexes.push(i)

    return indexes
  }, [])

  const getOtherText = useCallback((otherChecked: boolean, otherText: string) => 
    otherChecked ? otherText : '', []
  )

  useEffect(() => {
    // don't mark as touched when initializing
    const initializing = onChangeRef.current === undefined

    const values = []
    for (const index of localValue?.indexes ?? []) {
      values.push((field.options as MultipleChoiceOptions)?.choices?.[index])
    }
    if (localValue?.otherText) {
      values.push(localValue.otherText)
    }

    if (objects_equivalent(values, onChangeRef.current)) {
      return
    } 

    onChangeRef.current = values
    onChange(values, !initializing)
  }, [localValue, field, onChange, onChangeRef])

  const handleCheck = (i: number) => {
    if (radio && other) setOtherChecked(false)

    const updated = radio ? selected.map((s, _i) => _i === i ? !s : false )
                          : selected.map((s, _i) => _i === i ? !s : s)

    setSelected(updated)
    setLocalValue({ 
      indexes: getIndexes(updated),
      otherText: getOtherText(otherChecked, otherText),
    })
  }

  const handleOtherChecked = () => {
    setOtherChecked(!otherChecked)

    const updated = radio ? selected.map(_ => false) : selected
    setSelected(updated)

    setLocalValue({ 
      indexes: getIndexes(updated),
      otherText: getOtherText(!otherChecked, otherText),
    }) 
  }

  const handleOther = (newText: string) => {
    setOtherText(newText)
    setLocalValue({ 
      indexes: getIndexes(selected),
      otherText: getOtherText(otherChecked, newText),
    }) 
  }

  useEffect(() => {
    if (otherChecked === true && textRef.current) textRef.current.focus()
  }, [textRef, otherChecked])

  return (
    <Grid container alignItems="center">
      {choices.map((c, i) => (
        <Grid item xs={12} key={i}>
          <Checkbox
            color="primary"
            checked={selected[i]}
            onClick={() => handleCheck(i)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <Typography component="span"> {c} </Typography>
        </Grid>
      ))}
      {other &&
        <Grid item xs={12}>
          <Checkbox
            color="primary"
            checked={otherChecked}
            onClick={() => handleOtherChecked()}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <TextField disabled={!otherChecked} // className={classes.textField}
            inputRef={textRef}
            size="small"
            aria-label="Other"
            value={otherText} 
            placeholder="Other" variant="outlined" 
            onClick={() => !otherChecked && handleOtherChecked()} // allow click to enable when disabled
            onChange={e => handleOther(e.target.value.substring(0, 500))}
          />
        </Grid>  
      }
    </Grid>
  )
}
