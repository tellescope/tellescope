import React from "react"
import { TextField } from "@mui/material"
import { FormInputProps } from "./types"

export const StringInput = ({ value, onChange }: FormInputProps<'string'>) => (
  <TextField value={value} onChange={e => onChange(e.target.value)} />
)

export const PhoneInput = ({ value, onChange }: FormInputProps<'phone'>) => (
  <TextField value={value} onChange={e => onChange(e.target.value)} />
)

export const EmailInput = ({ value, onChange }: FormInputProps<'email'>) => (
  <TextField type="email" value={value} onChange={e => onChange(e.target.value)} />
)

export const NumberInput = ({ value, onChange }: FormInputProps<'number'>) => (
  <TextField type="number" value={value} onChange={e => onChange(parseInt(e.target.value))} />
)

export const SignatureInput = ({ value, onChange }: FormInputProps<'signature'>) => {

  return (
    <>
    </>
  )
}

export const FileInput = ({ value, onChange }: FormInputProps<'file'>) => {

  return (
    <>
    </>
  )
}

export const MultipleChoiceInput = ({ value, onChange }: FormInputProps<'multiple_choice'>) => {

  return (
    <>
    </>
  )
}
