import React, { useCallback, useEffect } from "react"
import { Button, Flex, LoadingButton, Paper, Styled, Typography } from "../index"
import { useOrganizationTheme, useTellescopeForm, WithOrganizationTheme } from "./hooks"
import { ChangeHandler, FormInputs } from "./types"
import { EmailInput, FileInput, MultipleChoiceInput, NumberInput, PhoneInput, SignatureInput, StringInput } from "./inputs"
import { PRIMARY_HEX } from "@tellescope/constants"
import { FormResponse } from "@tellescope/types-client"
import { OrganizationTheme } from "@tellescope/types-models"

export const TellescopeFormContainer = (props : { children: React.ReactNode, dontAddContext?: boolean } & Styled) => {
  // if context already is provided, no need to duplicate
  if (props.dontAddContext) return (
    <TellescopeFormContainerWithTheme {...props} />
  )

  return (
    <WithOrganizationTheme>
      <TellescopeFormContainerWithTheme {...props} />
    </WithOrganizationTheme>
  )
}

const TellescopeFormContainerWithTheme: typeof TellescopeFormContainer = ({ children, style }) => {
  const theme = useOrganizationTheme()

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor: theme.themeColor ?? '#ffffff', ...style }}>
    <Paper flex elevation={3} style={{ marginTop: 50, marginBottom: 50, padding: 20, maxWidth: 650, minWidth: 250, minHeight: 600 }}>
    <Flex flex={1} column>
      {theme.logoURL 
        ? (
          <Flex alignItems="center" justifyContent={"center"} style={{ height: LOGO_HEIGHT, marginTop: 10 }}>
            <img src={theme.logoURL} alt={theme.name} height={LOGO_HEIGHT} style={{ maxWidth: 225 }} /> {/* todo: replace with something that resolves better for native */}
          </Flex>
        )
        : (
          <Typography style={{ fontSize: 22, marginTop: 10, textAlign: 'center', fontWeight: 600 }}>
            {theme.name}
          </Typography>
        )
      }
      {children}
    </Flex>
    </Paper>
    </Flex>
  )
}

export interface TellescopeFormProps extends ReturnType<typeof useTellescopeForm> {
  isPreview?: boolean,
  onSuccess?: (r: FormResponse) => void,
  customInputs?: FormInputs
  submitted?: boolean,
  thanksMessage?: string,
}

const LOGO_HEIGHT = 40
export const TellescopeForm = (props : TellescopeFormProps & Styled) => (
  <WithOrganizationTheme>
    <TellescopeFormWithContext {...props} /> 
  </WithOrganizationTheme>
)

export const TellescopeFormWithContext: typeof TellescopeForm = ({
  activeField, 
  currentFileValue,
  customInputs, 
  currentValue, 
  submitErrorMessage,
  onAddFile,
  onFieldChange, 
  goToNextField,
  goToPreviousField,
  isNextDisabled,
  isPreviousDisabled,
  submit,
  showSubmit,
  submitDisabled,
  submittingStatus,
  validateCurrentValue,

  thanksMessage="Your response was successfully recorded",
  submitted,
  style,
  onSuccess,
  isPreview,
  ...props 
}) => {
  const theme = useOrganizationTheme()

  const String = customInputs?.['string'] ?? StringInput
  const Email = customInputs?.['email'] ?? EmailInput
  const Number = customInputs?.['number'] ?? NumberInput
  const Phone = customInputs?.['phone'] ?? PhoneInput 
  const Signature = customInputs?.['signature'] ?? SignatureInput 
  const MultipleChoice = customInputs?.['multiple_choice'] ?? MultipleChoiceInput 
  const File = customInputs?.['file'] ?? FileInput 

  const handleSubmit = useCallback(async () => {
    if (isPreview) {
      return onSuccess?.({} as any)
    } 
    await submit(onSuccess)
  }, [isPreview, onSuccess, submit])

  const validationMessage = validateCurrentValue()

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isNextDisabled()) return
      goToNextField()
    } 
  }, [isNextDisabled, goToNextField, isPreviousDisabled, goToPreviousField])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => { window.removeEventListener('keydown', handleKeyPress)}
  }, [handleKeyPress])

  return (
    <TellescopeFormContainer style={style} dontAddContext>
      {submitted 
        ? <Typography style={{ marginTop: 25, alignSelf: 'center' }}>{thanksMessage}</Typography>
        : (
          <>
            <Flex flex={1} justifyContent={"center"} column style={{ marginBottom: 25 }}>
              <Typography component="h4" style={{ fontSize: 20 }}>
                {activeField.value.title}
              </Typography>

              <Typography style={{ marginBottom: 5 }} 
                // @ts-ignore
                color={theme.themeColor || 'primary'}
              >
                
                {activeField.value.description}
              </Typography>

              { 
                activeField.value.type === 'string' ? (
                  <String field={activeField.value} value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
                )
                : activeField.value.type === 'email' ? (
                  <Email field={activeField.value}  value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} />
                )
                : activeField.value.type === 'number' ? (
                  <Number field={activeField.value}  value={currentValue.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} />
                )
                : activeField.value.type === 'phone' ? (
                  <Phone field={activeField.value}  value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} />
                )
                : activeField.value.type === 'signature' ? (
                  <Signature field={activeField.value}  value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} />
                )
                : activeField.value.type === 'multiple_choice' ? (
                  <MultipleChoice field={activeField.value}  value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} />
                )
                : activeField.value.type === 'file' ? (
                  <File field={activeField.value}  value={currentFileValue.blob as any} onChange={onAddFile as any} />
                )
                : null
              }   

              {/* height/margin to avoid moving answer field when this appears */}
              <Typography color="error" style={{ marginTop: 3, height: 10, fontSize: 14, marginBottom: -10 }}> 
                {(validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required')
                  ? currentValue.touched 
                    ? validationMessage
                    : null 
                  : validationMessage
                }
              </Typography>  
            </Flex>

            <Flex alignItems={'center'} justifyContent="space-between">
              {!isPreviousDisabled()
                ? (
                  <Button variant="outlined" disabled={isPreviousDisabled()} onClick={goToPreviousField}>
                    Previous
                  </Button>
                )
                : <Flex />
              }
              {showSubmit 
                ? (
                  <LoadingButton onClick={handleSubmit} disabled={submitDisabled}
                    submitText="Submit Response" 
                    submittingText={
                      submittingStatus === 'uploading-files' 
                        ? 'Uploading files...'
                        : "Submitting..."
                    } 
                    style={{ width: 300 }}
                    // @ts-ignore
                    color={theme.themeColor ?? PRIMARY_HEX}
                  />
                )
                : (
                  <Button variant="contained" disabled={isNextDisabled()} onClick={goToNextField} style={{ width: 100 }}>
                    Next
                  </Button>
                )
              }
            </Flex>

            <Typography color="error" style={{ alignText: 'center', marginTop: 3 }}>
              {submitErrorMessage}
            </Typography>
          </>
      )}
    </TellescopeFormContainer>
  )
}