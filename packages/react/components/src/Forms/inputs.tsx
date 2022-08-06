import React, { useCallback, useEffect, useRef, useState } from "react"
import { Checkbox, Grid, TextField, TextFieldProps, Typography } from "@mui/material"
import { FormInputProps } from "./types"
import { useDropzone } from "react-dropzone"
import { PRIMARY_HEX } from "@tellescope/constants"
import { objects_equivalent } from "@tellescope/utilities"
import { MultipleChoiceOptions } from "@tellescope/types-models/src"

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
