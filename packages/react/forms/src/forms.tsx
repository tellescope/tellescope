import React, { useEffect, useState } from "react"
import { Button, Flex, LoadingButton, Paper, Typography } from "@tellescope/react-components"
import { useForm } from "./hooks"
import { ChangeHandler, FormInputs } from "./types"
import { EmailInput, FileInput, MultipleChoiceInput, NumberInput, PhoneInput, SignatureInput, StringInput } from "./inputs"

export interface FormProps extends ReturnType<typeof useForm> {
  isPreview?: boolean,
  customInputs?: FormInputs
}
export const Form = ({ 
  activeField, 
  theme, 
  customInputs, 
  currentValue, 
  onFieldChange, 
  goToNextField,
  goToPreviousField,
  isNextDisabled,
  isPreviousDisabled,
  submit,
  showSubmit,
  submitDisabled,
  ...props 
} : FormProps) => {
  const String = customInputs?.['string'] ?? StringInput
  const Email = customInputs?.['email'] ?? EmailInput
  const Number = customInputs?.['number'] ?? NumberInput
  const Phone = customInputs?.['phone'] ?? PhoneInput 
  const Signature = customInputs?.['signature'] ?? SignatureInput 
  const MultipleChoice = customInputs?.['multiple_choice'] ?? MultipleChoiceInput 
  const File = customInputs?.['file'] ?? FileInput 

  return (
    <Flex flex={1} style={{ backgroundColor: theme.themeColor ?? '#ffffff' }}>
      <Paper flex elevation={3} style={{ padding: 20 }}>
      <Flex flex={1} column>
        {theme.logoURL 
          ? <img src={theme.logoURL} alt={theme.name} /> // todo: replace with something that resolves better for native
          : <Typography>{theme.name}</Typography>
        }

        <Flex flex={1}>
        { 
          activeField.value.type === 'string' ? (
            <String value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
          )
          : activeField.value.type === 'email' ? (
            <Email value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} />
          )
          : activeField.value.type === 'number' ? (
            <Number value={currentValue.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} />
          )
          : activeField.value.type === 'phone' ? (
            <Phone value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} />
          )
          : activeField.value.type === 'signature' ? (
            <Signature value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} />
          )
          : activeField.value.type === 'multiple_choice' ? (
            <MultipleChoice value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} />
          )
          : activeField.value.type === 'file' ? (
            <File value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'file'>} />
          )
          : null
        } 
        </Flex>
          <Flex alignItems={'center'} justifyContent="space-between">
            <Button variant="outlined" disabled={isPreviousDisabled()} onClick={goToPreviousField}>
              Previous
            </Button>
            {showSubmit 
              ? <LoadingButton onClick={submit} submitText="Submit Response" submittingText="Submitting" />
              : (

                <Button variant="contained" disabled={isNextDisabled()} onClick={goToNextField}>
                  Next
                </Button>
              )
            }
        </Flex>
      </Flex>
      </Paper>
    </Flex>
  )
}