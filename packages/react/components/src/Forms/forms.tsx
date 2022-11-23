import React, { useCallback, useEffect } from "react"
import { Button, Flex, LoadingButton, Paper, Styled, Typography, useFileUpload, useFormResponses, useSession } from "../index"
import { useListForFormFields, useOrganizationTheme, useTellescopeForm, WithOrganizationTheme } from "./hooks"
import { ChangeHandler, FormInputs } from "./types"
import { DateInput, EmailInput, FileInput, MultipleChoiceInput, NumberInput, PhoneInput, RankingInput, RatingInput, SignatureInput, StringInput, StringLongInput } from "./inputs"
import { PRIMARY_HEX } from "@tellescope/constants"
import { FormResponse } from "@tellescope/types-client"
import { FormResponseAnswerFileValue, OrganizationTheme } from "@tellescope/types-models"

export const TellescopeFormContainer = ({ businessId, organizationIds, ...props } : { 
  children: React.ReactNode, businessId?: string, organizationIds?: string[], dontAddContext?: boolean,
} & Styled) => {
  // if context already is provided, no need to duplicate
  if (props.dontAddContext) return (
    <TellescopeFormContainerWithTheme {...props} />
  )

  return (
    <WithOrganizationTheme businessId={businessId} organizationIds={organizationIds}>
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
  showSaveDraft?: boolean,
}

const LOGO_HEIGHT = 40
export const TellescopeForm = (props : TellescopeFormProps & Styled & { theme?: OrganizationTheme, inputStyle?: React.CSSProperties }) => (
  <WithOrganizationTheme>
    <TellescopeFormWithContext {...props} /> 
  </WithOrganizationTheme>
)

export const TellescopeSingleQuestionFlow: typeof TellescopeForm = ({
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
  submittingStatus,
  validateField,

  thanksMessage="Your response was successfully recorded",
  submitted,
  onSuccess,
  isPreview,
  validateCurrentField,
  theme,

  style,
  inputStyle,
}) => {
  const String = customInputs?.['string'] ?? StringInput
  const StringLong = customInputs?.['stringLong'] ?? StringLongInput
  const Email = customInputs?.['email'] ?? EmailInput
  const Number = customInputs?.['number'] ?? NumberInput
  const Phone = customInputs?.['phone'] ?? PhoneInput 
  const ResolvedDateInput = customInputs?.['date'] ?? DateInput 
  const Signature = customInputs?.['signature'] ?? SignatureInput 
  const MultipleChoice = customInputs?.['multiple_choice'] ?? MultipleChoiceInput 
  const File = customInputs?.['file'] ?? FileInput 
  const Ranking = customInputs?.['ranking'] ?? RankingInput
  const Rating = customInputs?.['rating'] ?? RatingInput

  const handleSubmit = useCallback(async () => {
    if (isPreview) {
      return onSuccess?.({} as any)
    } 
    await submit({ onSuccess })
  }, [isPreview, onSuccess, submit])

  const validationMessage = validateField()

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (activeField.value.type === 'stringLong') return // 
      if (isNextDisabled()) return
      goToNextField()
    } 
  }, [activeField, isNextDisabled, goToNextField, isPreviousDisabled, goToPreviousField])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => { window.removeEventListener('keydown', handleKeyPress)}
  }, [handleKeyPress])

  return (
    submitted 
      ? <Typography style={{ marginTop: 25, alignSelf: 'center' }}>{thanksMessage}</Typography>
      : (
        <Flex column flex={1}>
          <Flex flex={1} justifyContent={"center"} column>
            <Typography component="h4" style={{ fontSize: 20 }}>
              {activeField.value.title}
            </Typography>

            <Typography style={{ marginBottom: 5 }} 
              // @ts-ignore
              color={theme.themeColor || 'primary'}
            >
              
              {activeField.value.description}
            </Typography>

            <Flex style={inputStyle}>
            { 
              // KEEP THIS CONSISTENT WITH TellescopeSinglePageForm

              // file is a unique case
              activeField.value.type === 'file' ? (
                <File field={activeField.value} value={currentFileValue.blob as any} onChange={onAddFile as any} />
              )
              : activeField.value.type === 'string' ? (
                <String field={activeField.value} value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
              )
              : activeField.value.type === 'stringLong' ? (
                <StringLong field={activeField.value} value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'string' | 'stringLong'>} />
              )
              : activeField.value.type === 'email' ? (
                <Email field={activeField.value} value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} />
              )
              : activeField.value.type === 'number' ? (
                <Number field={activeField.value} value={currentValue.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} />
              )
              : activeField.value.type === 'phone' ? (
                <Phone field={activeField.value} value={currentValue.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} />
              )
              : activeField.value.type === 'date' ? (
                <ResolvedDateInput field={activeField.value} value={currentValue.answer.value ? new Date(currentValue.answer.value as string | Date) : undefined} onChange={onFieldChange as ChangeHandler<'date'>} />
              )
              : activeField.value.type === 'signature' ? (
                <Signature field={activeField.value} value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} />
              )
              : activeField.value.type === 'multiple_choice' ? (
                <MultipleChoice field={activeField.value} value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} />
              )
              : activeField.value.type === 'rating' ? (
                <Rating field={activeField.value} value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'rating'>} />
              )
              : activeField.value.type === 'ranking' ? (
                <Ranking field={activeField.value} value={currentValue.answer.value as any} onChange={onFieldChange as ChangeHandler<'ranking'>} />
              )
              : null
            }   
            </Flex>

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
              <LoadingButton onClick={handleSubmit} 
                disabled={!!validateCurrentField()}
                submitText="Submit" 
                submittingText={
                  submittingStatus === 'uploading-files' 
                    ? 'Uploading files...'
                    : "Submitting..."
                } 
                style={{ minWidth: 150, width: '50%', maxWidth: 250 }}
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
      </Flex>
    )
  )
}

const TellescopeFormWithContext: typeof TellescopeForm = (props) => {
  const theme = useOrganizationTheme()

  return (
    <TellescopeFormContainer style={props.style} dontAddContext>
      {props.submitted 
        ? <Typography style={{ marginTop: 25, alignSelf: 'center' }}>{props.thanksMessage}</Typography>
        : (<TellescopeSingleQuestionFlow {...props} theme={theme} />)
      }
    </TellescopeFormContainer>
  )
}

export const SaveDraft = ({ 
  selectedFiles,
  enduserId,
  responses,
  onSuccess,
  formResponseId,
  includedFieldIds,
  formId,
  style,
  disabled,
} : Styled & Pick<TellescopeFormProps, 'onSuccess' | 'selectedFiles' | 'responses' | 'enduserId'> & { 
  disabled?: boolean,
  formResponseId?: string, 
  formId: string,
  includedFieldIds: string[]
}) => {
  const [, { updateElement: updateFormResponse }] = useFormResponses({ dontFetch: true })
  const session = useSession()
  const { handleUpload } = useFileUpload({  })
  
  return (
    <LoadingButton style={style} disabled={disabled} variant='outlined'
      onClick={async () => {
        const hasFile = selectedFiles.find(f => !!f.blob) !== undefined

        if (hasFile) {
          try { // convert FileBlobs to FileResponses
            for (const blobInfo of selectedFiles) {
              const { blob, fieldId } = blobInfo
              if (!blob) continue
      
              const result: FormResponseAnswerFileValue = { name: blob.name, secureName: '' }
              const { secureName } = await handleUpload(
                {
                  name: blob.name,
                  size: blob.size,
                  type: blob.type,
                  enduserId,
                }, 
                blob
              )

              const responseIndex = responses.findIndex(f => f.fieldId === fieldId)
              responses[responseIndex].answer.value = { ...result, secureName, name: result.name ?? '' } 
            }

          } catch(err: any) {
          } finally {
          }
        }

        try {
          const response = await updateFormResponse(
            (
              formResponseId 
              ?? (await session.api.form_responses.prepare_form_response({ formId, enduserId })).response.id
            ),
            { 
              draftSavedAt: new Date(),
              responses: includedFieldIds.map(id => responses.find(r => r.fieldId === id)!)
            },
            { replaceObjectFields: true }
          )

          onSuccess?.(response)
        } catch(err: any) {
          // setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
        } finally {
          // setSubmittingStatus(undefined)
        }
      }}
      submitText="Save Draft"
      submittingText="Saving..."
    />
  )
}

export const UpdateResponse = ({ 
  selectedFiles,
  enduserId,
  responses,
  onSuccess,
  formResponseId,
  includedFieldIds,
  formId,
  style,
  disabled,
} : Styled & Pick<TellescopeFormProps, 'onSuccess' | 'selectedFiles' | 'responses' | 'enduserId'> & { 
  disabled?: boolean,
  formResponseId?: string, 
  formId: string,
  includedFieldIds: string[]
}) => {
  const [, { updateElement: updateFormResponse }] = useFormResponses({ dontFetch: true })
  const session = useSession()
  const { handleUpload } = useFileUpload({  })
  
  return (
    <LoadingButton style={style} disabled={disabled} variant='contained'
      onClick={async () => {
        const hasFile = selectedFiles.find(f => !!f.blob) !== undefined

        if (hasFile) {
          try { // convert FileBlobs to FileResponses
            for (const blobInfo of selectedFiles) {
              const { blob, fieldId } = blobInfo
              if (!blob) continue
      
              const result: FormResponseAnswerFileValue = { name: blob.name, secureName: '' }
              const { secureName } = await handleUpload(
                {
                  name: blob.name,
                  size: blob.size,
                  type: blob.type,
                  enduserId,
                }, 
                blob
              )

              const responseIndex = responses.findIndex(f => f.fieldId === fieldId)
              responses[responseIndex].answer.value = { ...result, secureName, name: result.name ?? '' } 
            }

          } catch(err: any) {
          } finally {
          }
        }

        try {
          const response = await updateFormResponse(
            (
              formResponseId 
              ?? (await session.api.form_responses.prepare_form_response({ formId, enduserId })).response.id
            ),
            { 
              responses: includedFieldIds.map(id => responses.find(r => r.fieldId === id)!)
            },
            { replaceObjectFields: true }
          )

          onSuccess?.(response)
        } catch(err: any) {
          // setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
        } finally {
          // setSubmittingStatus(undefined)
        }
      }}
      submitText="Update"
      submittingText="Saving..."
    />
  )
}

export const TellescopeSinglePageForm: React.JSXElementConstructor<TellescopeFormProps & Styled & { updating?: boolean }> = ({
  customInputs, 
  submitErrorMessage,
  onAddFile,
  onFieldChange, 
  goToNextField,
  goToPreviousField,
  isNextDisabled,
  isPreviousDisabled,
  submit,
  showSubmit,
  showSaveDraft,
  submittingStatus,
  updating,
  validateField,
  validateResponsesForFields,

  thanksMessage="Your response was successfully recorded",
  submitted,
  style,
  onSuccess,
  isPreview,

  fields,
  selectedFiles,
  responses,

  ...props 
}) => {
  const list = useListForFormFields(fields)

  const String = customInputs?.['string'] ?? StringInput
  const StringLong = customInputs?.['stringLong'] ?? StringLongInput
  const Email = customInputs?.['email'] ?? EmailInput
  const Number = customInputs?.['number'] ?? NumberInput
  const Phone = customInputs?.['phone'] ?? PhoneInput 
  const ResolvedDate = customInputs?.['date'] ?? DateInput  // don't name Date or conflicts with global Date constructor
  const Signature = customInputs?.['signature'] ?? SignatureInput 
  const MultipleChoice = customInputs?.['multiple_choice'] ?? MultipleChoiceInput 
  const File = customInputs?.['file'] ?? FileInput 
  const Ranking = customInputs?.['ranking'] ?? RankingInput
  const Rating = customInputs?.['rating'] ?? RatingInput

  const includedFieldIds = list.map(f => f.id)

  const handleSubmit = useCallback(async () => {
    if (isPreview) {
      return onSuccess?.({} as any)
    } 
    await submit({ onSuccess, includedFieldIds, /* ensures all answers are included and in the correct order */ })
  }, [isPreview, onSuccess, submit])

  return (
    <Flex flex={1} column>
      {submitted 
      ? <Typography style={{ marginTop: 25, alignSelf: 'center' }}>{thanksMessage}</Typography>
      : (
        <>
        <Flex flex={1} justifyContent={"center"} column style={{ marginBottom: 15 }}>
        {list.map((activeField, i) => {
          const value = responses.find(r => r.fieldId === activeField.id)!
          const file = selectedFiles.find(r => r.fieldId === activeField.id)!
          const validationMessage = validateField(activeField)

          return (
            <Flex key={activeField.id} style={{ marginBottom: 5 }}>
              <Flex column flex={1}>
                <Typography component="h4" style={{ fontSize: 16 }}>
                  {activeField.title}
                </Typography>

                <Typography color="primary" style={{ fontSize: 14, marginBottom: 5 }}>
                  {activeField.description}
                </Typography>

              { 
                // KEEP THIS CONSISTENT WITH THE TellescopeFormWithContext

                // file is a unique case
                activeField.type === 'file' ? (
                  <File autoFocus={i === 0} field={activeField} value={file.blob as any} onChange={onAddFile as any} />
                )
                : activeField.type === 'string' ? (
                  <String size="small" autoFocus={i === 0} field={activeField} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
                )
                : activeField.type === 'stringLong' ? (
                  <StringLong size="small" autoFocus={i === 0} field={activeField} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'stringLong' | 'string'>} />
                )
                : activeField.type === 'email' ? (
                  <Email size="small" autoFocus={i === 0} field={activeField} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} />
                )
                : activeField.type === 'number' ? (
                  <Number size="small" autoFocus={i === 0} field={activeField} value={value.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} />
                )
                : activeField.type === 'phone' ? (
                  <Phone size="small" autoFocus={i === 0} field={activeField} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} />
                )
                : activeField.type === 'date' ? (
                  <ResolvedDate size="small" autoFocus={i === 0} field={activeField} value={value.answer.value ? new Date(value.answer.value as string | Date) : undefined} onChange={onFieldChange as ChangeHandler<'date'>} />
                )
                : activeField.type === 'signature' ? (
                  <Signature autoFocus={i === 0} field={activeField} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} />
                )
                : activeField.type === 'multiple_choice' ? (
                  <MultipleChoice autoFocus={i === 0} field={activeField} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} />
                )
                : activeField.type === 'rating' ? (
                  <Rating autoFocus={i === 0} field={activeField} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'rating'>} />
                )
                : activeField.type === 'ranking' ? (
                  <Ranking autoFocus={i === 0} field={activeField} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'ranking'>} />
                )
                : null
              }
              
              {/* height/margin to avoid moving answer field when this appears */}
              <Typography color="error" style={{ marginTop: 3, fontSize: 14 }}> 
                {(validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required')
                  ? value.touched 
                    ? validationMessage
                    : null 
                  : validationMessage
                }
              </Typography>  
              </Flex>
            </Flex>
          )
        })}
        </Flex>

        <Flex flex={1} wrap="nowrap">
          {updating
            ? (
              <UpdateResponse 
                {...props}
                includedFieldIds={includedFieldIds}
                // style={{ width: 200, marginRight: 5, height: 42 }}
                formId={fields[0].formId}
                responses={responses}
                selectedFiles={selectedFiles}
                onSuccess={onSuccess}
            />
            ) : (
              <>
              {showSaveDraft && 
                <SaveDraft 
                  {...props}
                  includedFieldIds={includedFieldIds}
                  style={{ width: 200, marginRight: 5, height: 42 }}
                  formId={fields[0].formId}
                  responses={responses}
                  selectedFiles={selectedFiles}
                  onSuccess={onSuccess}
                />
              }

              <LoadingButton onClick={handleSubmit} 
                disabled={!!validateResponsesForFields(list)}
                style={{ height: 42, width: '100%' }}
                submitText="Submit Response" 
                submittingText={
                  submittingStatus === 'uploading-files' 
                    ? 'Uploading files...'
                    : "Submitting..."
                } 
              />
              </>
            )
          }
        </Flex>

        <Typography color="error" style={{ alignText: 'center', marginTop: 3 }}>
          {submitErrorMessage}
        </Typography>
        </>
      )}
    </Flex>
  )
}