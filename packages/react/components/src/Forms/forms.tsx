import React, { useCallback, useEffect } from "react"
import { Button, Flex, LoadingButton, Paper, Styled, Typography, useFileUpload, useFormResponses, useSession } from "../index"
import { useListForFormFields, useOrganizationTheme, useTellescopeForm, WithOrganizationTheme, Response, FileResponse } from "./hooks"
import { ChangeHandler, FormInputs } from "./types"
import { AddressInput, DatabaseSelectInput, DateInput, DateStringInput, DropdownInput, EmailInput, FileInput, FilesInput, MedicationsInput, MultipleChoiceInput, NumberInput, PhoneInput, Progress, RankingInput, RatingInput, SignatureInput, StringInput, StringLongInput, StripeInput, TableInput, TimeInput } from "./inputs"
import { PRIMARY_HEX } from "@tellescope/constants"
import { FormResponse, FormField } from "@tellescope/types-client"
import { FormResponseAnswerFileValue, OrganizationTheme } from "@tellescope/types-models"
import { remove_script_tags } from "@tellescope/utilities"

export const TellescopeFormContainer = ({ businessId, organizationIds, ...props } : { 
  businessId?: string, 
  organizationIds?: string[], 
  dontAddContext?: boolean,
  children: React.ReactNode, 
  hideBg?: boolean,
  backgroundColor?: string,
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

const TellescopeFormContainerWithTheme: typeof TellescopeFormContainer = ({ children, style, hideBg, backgroundColor }) => {
  const theme = useOrganizationTheme()

  const formContent = (
    <Flex flex={1} column>
      {theme.logoURL 
        ? (
          <Flex alignItems="center" justifyContent={"center"} style={{ maxHeight: LOGO_HEIGHT, marginTop: 10 }}>
            <img src={theme.logoURL} alt={theme.name} style={{ maxHeight: LOGO_HEIGHT, maxWidth: 225 }} /> {/* todo: replace with something that resolves better for native */}          
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
  )
  if (hideBg) {
    return (
      <Flex flex={1} alignItems="flex-start" justifyContent="center" style={style}>
      <Flex flex={1} style={{ padding: 20, maxWidth: 650, minWidth: 250, minHeight: 475 }}>
        {formContent}
      </Flex>
      </Flex>
    )
  }
  return (
    <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor: backgroundColor ?? theme.themeColor ?? '#ffffff', ...style }}>
    <Paper flex elevation={3} style={{ marginTop: 50, marginBottom: 50, padding: 20, maxWidth: 650, minWidth: 250, minHeight: 575 }}>
      {formContent}
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
  htmlThanksMessage?: string,
  showSaveDraft?: boolean,
  formTitle?: string,
  repeats: Record<string, string | number>
  backgroundColor?: string,
}

const LOGO_HEIGHT = 40
export const TellescopeForm = (props : TellescopeFormProps & Styled & { hideBg?: boolean, theme?: OrganizationTheme, inputStyle?: React.CSSProperties }) => (
  <WithOrganizationTheme>
    <TellescopeFormWithContext {...props} /> 
  </WithOrganizationTheme>
)

export const QuestionForField = ({
  value,
  field,
  file,
  responses,
  selectedFiles,
  onAddFile,
  onFieldChange,
  customInputs,
  fields,
  validateField,
  repeats,
  onRepeatsChange,
  setCustomerId,
} : {
  repeats: Record<string, string | number>,
  onRepeatsChange: (v: Record<string, string | number>) => void,
  value: Response,
  file: FileResponse,
  field: FormField,
  setCustomerId: (s: string) => void,
} & Pick<TellescopeFormProps, 'onAddFile' | 'onFieldChange' | 'fields' | 'customInputs' | 'responses' | 'selectedFiles' | 'validateField'>) => {
  const String = customInputs?.['string'] ?? StringInput
  const StringLong = customInputs?.['stringLong'] ?? StringLongInput
  const Email = customInputs?.['email'] ?? EmailInput
  const Number = customInputs?.['number'] ?? NumberInput
  const Phone = customInputs?.['phone'] ?? PhoneInput 
  const ResolvedDateInput = customInputs?.['date'] ?? DateInput 
  const Signature = customInputs?.['signature'] ?? SignatureInput 
  const MultipleChoice = customInputs?.['multiple_choice'] ?? MultipleChoiceInput 
  const Stripe = customInputs?.['Stripe'] ?? StripeInput 
  const File = customInputs?.['file'] ?? FileInput 
  const Files = customInputs?.['files'] ?? FilesInput 
  const Ranking = customInputs?.['ranking'] ?? RankingInput
  const Rating = customInputs?.['rating'] ?? RatingInput
  const Address = customInputs?.['Address'] ?? AddressInput
  const Time = customInputs?.['Time'] ?? TimeInput
  const Dropdown = customInputs?.['Dropdown'] ?? DropdownInput
  const DatabaseSelect = customInputs?.['Database Select'] ?? DatabaseSelectInput
  const Medications = customInputs?.['Medications'] ?? MedicationsInput

  const validationMessage = validateField(field)

  if (!value) return null
  return ( 
    // margin leaves room for error message in Question Group
    <Flex column flex={1} style={{ marginBottom: 25 }}> 
      <Typography component="h4" style={{ 
        fontSize: 22, 
        marginTop: 15, // ensures PDF display doesn't push description into overlap with logo / title at top of form
      }}>
        {field.title}{!(field.isOptional || field.type === 'description' || field.type === 'Question Group') ? '*' : ''}
      </Typography>

      <Description field={field} style={{ fontSize: 16 }} />

      {
        field.type === 'file' ? (
          <File field={field} value={file.blobs?.[0] as any} onChange={onAddFile as any} 
            existingFileName={
              value.answer.type === 'file'
                ? value.answer.value?.name
                : ''
            } 
          />
        )
        : field.type === 'files' ? (
          <Files field={field} value={file.blobs as any} onChange={onAddFile as any} 
            // existingFileName={
            //   value.answer.type === 'files'
            //     ? value.answer.value?.name
            //     : ''
            // } 
          />
        )
        : field.type === 'dateString' ? (
          <DateStringInput field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
        )
        : field.type === 'Address' ? (
          <Address field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} />
        )
        : field.type === 'string' ? (
          <String field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} />
        )
        : field.type === 'Stripe' ? (
          <Stripe field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<any>} setCustomerId={setCustomerId} />
        )
        : field.type === 'stringLong' ? (
          <StringLong field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string' | 'stringLong'>} />
        )
        : field.type === 'email' ? (
          <Email field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} />
        )
        : field.type === 'number' ? (
          <Number field={field} value={value.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} />
        )
        : field.type === 'phone' ? (
          <Phone field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} />
        )
        : field.type === 'date' ? (
          <ResolvedDateInput field={field} value={value.answer.value ? new Date(value.answer.value as string | Date) : undefined} onChange={onFieldChange as ChangeHandler<'date'>} />
        )
        : field.type === 'signature' ? (
          <Signature field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} />
        )
        : field.type === 'multiple_choice' ? (
          <MultipleChoice field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} />
        )
        : field.type === 'Dropdown' ? (
          <Dropdown field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Dropdown'>} />
        )
        : field.type === 'Database Select' ? (
          <DatabaseSelect field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Database Select'>} />
        )
        : field.type === 'Medications' ? (
          <Medications field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Medications'>} />
        )
        : field.type === 'rating' ? (
          <Rating field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'rating'>} />
        )
        : field.type === 'ranking' ? (
          <Ranking field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'ranking'>} />
        )
        : field.type === 'Table Input' ? (
          <TableInput field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} />
        )
        : field.type === 'Time' ? (
          <Time field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} />
        )
        : field.type === 'Question Group' ? (
          <Flex column flex={1}>
          {(field.options?.subFields ?? []).map(({ id }) => {
            const match = fields.find(f => f.id === id)
            if (!match) return null

            const value = responses.find(r => r.fieldId === match.id)
            const file = selectedFiles.find(r => r.fieldId === match.id)
            if (!value) return null
            if (!file) return null

            return (
              <Flex key={id} flex={1}>
                <QuestionForField customInputs={customInputs} field={match} fields={fields} 
                  repeats={repeats} onRepeatsChange={onRepeatsChange} setCustomerId={setCustomerId}
                  value={value} file={file} 
                  onAddFile={onAddFile} onFieldChange={onFieldChange}
                  responses={responses} selectedFiles={selectedFiles}
                  validateField={validateField}
                />
              </Flex>
            )
          })}
          </Flex>
        )
        : null
      }

      {field.options?.repeat && (
        <Flex style={{ marginTop: '8px' }}>
        {
          field.type === 'string' ? (
            <String field={field} label="Repeat" value={repeats[field.id] as string ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} />
          )
          : field.type === 'stringLong' ? (
            <StringLong field={field} label="Repeat" value={repeats[field.id] as string ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} />
          ) 
          : field.type === 'number' ? (
            <Number field={field} label="Repeat" value={repeats[field.id] as number ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} />
          )
          : null
        }
        </Flex>
      )}

      {field.type !== 'Question Group' &&
        <Typography color="error" style={{ marginTop: 3, height: 10, fontSize: 14, marginBottom: -10 }}> 
          {(validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required')
            ? value.touched 
              ? validationMessage
              : null 
            : validationMessage
          }
        </Typography>  
      }
    </Flex>
  )
}

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
  htmlThanksMessage,
  submitted,
  onSuccess,
  isPreview,
  theme,

  fields,
  responses,
  selectedFiles,
  inputStyle,
  repeats,
  setRepeats,

  currentPageIndex,
  getNumberOfRemainingPages,
  validateCurrentField,

  setCustomerId,
  customization,
}) => {
  const beforeunloadHandler = React.useCallback((e: BeforeUnloadEvent) => {
    try {
      e.preventDefault()
      e.returnValue = 'You have unsaved changes'
    } catch(err) { }

    return ''
  }, [])

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunloadHandler)
    return () => { window.removeEventListener('beforeunload', beforeunloadHandler) }
  }, [beforeunloadHandler])

  const handleSubmit = useCallback(async () => {
    // submission may trigger a redirect, so don't block with warning message
    try {
      window.removeEventListener('beforeunload', beforeunloadHandler) 
    } catch(err) {}

    if (isPreview) {
      return onSuccess?.({} as any)
    } 

    await submit({ onSuccess })
  }, [isPreview, onSuccess, submit, beforeunloadHandler])

  const validationMessage = validateField(activeField.value)

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (
      e.key === 'Enter'
    && !(activeField.value.type === 'Dropdown' && activeField.value.options?.other && !activeField.value.options?.radio)
    ) {
      if (activeField.value.type === 'stringLong') return // 
      if (activeField.value.type === 'Question Group') return // ensure enter is allowed in stringLong at end of a question group before next
      if (isNextDisabled()) return
      goToNextField()
    } 
  }, [activeField, isNextDisabled, goToNextField, isPreviousDisabled, goToPreviousField])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => { window.removeEventListener('keydown', handleKeyPress)}
  }, [handleKeyPress])

  const numRemainingPages = getNumberOfRemainingPages()

  if (!(currentValue && currentFileValue)) return <></>
  return (
    submitted 
      ? <ThanksMessage htmlThanksMessage={htmlThanksMessage} thanksMessage={thanksMessage} 
          showRestartAtEnd={customization?.showRestartAtEnd}
        />
      : (
        <Flex column flex={1}>
          <Flex flex={1} justifyContent={"center"} column>
            <Flex style={inputStyle}>
              <QuestionForField fields={fields} field={activeField.value} 
                setCustomerId={setCustomerId}
                repeats={repeats} onRepeatsChange={setRepeats}
                value={currentValue} file={currentFileValue} 
                customInputs={customInputs}
                onAddFile={onAddFile} onFieldChange={onFieldChange}
                responses={responses} selectedFiles={selectedFiles}
                validateField={validateField}
              />
            </Flex>
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
                disabled={!!validationMessage}
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

        {!customization?.hideProgressBar && 
          <Progress 
            numerator={currentPageIndex + (validateCurrentField() ? 0 : 1)} 
            denominator={currentPageIndex + 1 + numRemainingPages}  
            style={{ marginTop: '15px' }}
          />
        }

        <Typography color="error" style={{ alignText: 'center', marginTop: 3 }}>
          {submitErrorMessage}
        </Typography>
      </Flex>
    )
  )
}

export const DEFAULT_THANKS_MESSAGE = "Your response was successfully recorded";
const ThanksMessage = ({ 
  thanksMessage, 
  htmlThanksMessage,
  showRestartAtEnd,
} : { 
  thanksMessage?: string, 
  htmlThanksMessage?: string,
  showRestartAtEnd?: boolean,
}) => (
  <Flex column>
    {htmlThanksMessage
      ? (
        <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{
          __html: remove_script_tags(htmlThanksMessage)
        }} />
      ) : (
        <Typography style={{ marginTop: 25, alignSelf: 'center' }}>{thanksMessage || DEFAULT_THANKS_MESSAGE}</Typography>
      )
    }
    {showRestartAtEnd && window.localStorage[`ts_form_url`] &&
      <Button variant="outlined" style={{ maxWidth: 200, marginTop: 25, alignSelf: 'center' }}
        onClick={() => window.location.href = window.localStorage[`ts_form_url`]}
      >
        Submit Again
      </Button>
    }
  </Flex>
)

const TellescopeFormWithContext: typeof TellescopeForm = (props) => {
  const theme = useOrganizationTheme()

  return (
    <TellescopeFormContainer style={props.style} dontAddContext hideBg={props.hideBg} backgroundColor={props.backgroundColor}>
      {props.submitted 
        ? <ThanksMessage {...props} showRestartAtEnd={props?.customization?.showRestartAtEnd} /> 
        : (<TellescopeSingleQuestionFlow {...props} theme={theme} />)
      }
    </TellescopeFormContainer>
  )
}

export const SaveDraft = ({ 
  selectedFiles,
  enduserId,
  responses,
  existingResponses,
  fields,
  onSuccess,
  formResponseId,
  includedFieldIds,
  formId,
  style,
  disabled,
  getResponsesWithQuestionGroupAnswers,
  isInternalNote,
  formTitle,
} : Styled & Pick<TellescopeFormProps, 'existingResponses' | 'fields' | 'onSuccess' | 'selectedFiles' | 'responses' | 'enduserId' | 'getResponsesWithQuestionGroupAnswers'> & { 
  disabled?: boolean,
  formResponseId?: string, 
  formId: string,
  includedFieldIds: string[]
  isInternalNote?: boolean,
  formTitle?: string,
}) => {
  const [, { updateElement: updateFormResponse }] = useFormResponses({ dontFetch: true })
  const session = useSession()
  const { handleUpload } = useFileUpload({  })
  
  return (
    <LoadingButton style={style} disabled={disabled} variant='outlined'
      onClick={async () => {
        const hasFile = selectedFiles.find(f => !!f.blobs?.length) !== undefined

        if (hasFile) {
          try { // convert FileBlobs to FileResponses
            for (const blobInfo of selectedFiles) {
              const { blobs, fieldId } = blobInfo
              if (!blobs) continue
      
              for (const blob of blobs) {
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
    
                if (responses[responseIndex].answer.type === 'files') {
                  if (!responses[responseIndex].answer.value) {
                    responses[responseIndex].answer.value = []
                  }
                  (responses[responseIndex].answer.value as any[]).push({ 
                    ...result, type: blob.type, secureName, name: result.name ?? ''
                  })
                } else {
                  responses[responseIndex].answer.value = { ...result, type: blob.type, secureName, name: result.name ?? '' } 
                }
              }    
            }
          } catch(err: any) {
          } finally {
          }
        }

        try {
          const response = await updateFormResponse(
            (
              formResponseId 
              ?? (await session.api.form_responses.prepare_form_response({ isInternalNote, formId, enduserId, title: formTitle })).response.id
            ),
            { 
              draftSavedAt: new Date(),
              responses: [
                ...(existingResponses ?? []).filter(r => !fields.find(f => f.id === r.fieldId)),
                ...getResponsesWithQuestionGroupAnswers(includedFieldIds.map(id => responses.find(r => r.fieldId === id)!))
              ]
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
  getResponsesWithQuestionGroupAnswers,
  existingResponses,
  fields,
} : Styled & Pick<TellescopeFormProps, 'existingResponses' | 'fields' | 'onSuccess' | 'selectedFiles' | 'responses' | 'enduserId' | 'getResponsesWithQuestionGroupAnswers'> & { 
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
        const hasFile = selectedFiles.find(f => !!f.blobs?.length) !== undefined

        if (hasFile) {
          try { // convert FileBlobs to FileResponses
            for (const blobInfo of selectedFiles) {
              const { blobs, fieldId } = blobInfo
              if (!blobs) continue
      
              for (const blob of blobs) {
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
    
                if (responses[responseIndex].answer.type === 'files') {
                  if (!responses[responseIndex].answer.value) {
                    responses[responseIndex].answer.value = []
                  }
                  (responses[responseIndex].answer.value as any[]).push({ 
                    ...result, type: blob.type, secureName, name: result.name ?? ''
                  })
                } else {
                  responses[responseIndex].answer.value = { ...result, type: blob.type, secureName, name: result.name ?? '' } 
                }
              }    
            }

          } catch(err: any) {
          } finally {
          }
        }

        const response = await updateFormResponse(
          (
            formResponseId 
            ?? (await session.api.form_responses.prepare_form_response({ formId, enduserId })).response.id
          ),
          { 
            responses: [
              ...(existingResponses ?? []).filter(r => !fields.find(f => f.id === r.fieldId)),
              ...getResponsesWithQuestionGroupAnswers(includedFieldIds.map(id => responses.find(r => r.fieldId === id)!))
            ]
          },
          { replaceObjectFields: true }
        )

        onSuccess?.(response)
      }}
      submitText="Update"
      submittingText="Saving..."
    />
  )
}

export const Description = ({ field, color="primary", style } : { field: FormField, color?: string } & Styled) => {
  if (!field.htmlDescription && field.description) {
    return (
      <Typography color={color as any} style={style}>
        {field.description}
      </Typography>
    )
  } 
  if (!field.htmlDescription) return null

  return (
    <span dangerouslySetInnerHTML={{
      __html: remove_script_tags(field.htmlDescription)
    }} />
  )
}

export const TellescopeSinglePageForm: React.JSXElementConstructor<TellescopeFormProps & Styled & { updating?: boolean, isInternalNote?: boolean }> = ({
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
  formTitle,

  thanksMessage=DEFAULT_THANKS_MESSAGE,
  htmlThanksMessage,
  submitted,
  style,
  onSuccess,
  isPreview,

  fields,
  selectedFiles,
  responses,

  isInternalNote,
  existingResponses,

  repeats,
  setRepeats,

  setCustomerId,

  ...props 
}) => {
  const list = useListForFormFields(fields, responses)

  const includedFieldIds = (
    Array.from(new Set([...list.map(f => f.id), ...(existingResponses ?? []).map(e => e.fieldId)])) 
  )

  const handleSubmit = useCallback(async () => {
    if (isPreview) {
      return onSuccess?.({} as any)
    } 
    await submit({ 
      onSuccess, 
      includedFieldIds, /* ensures all answers are included and in the correct order */ 
    })
  }, [isPreview, onSuccess, submit])

  return (
    <Flex flex={1} column>
      {submitted 
      ? <ThanksMessage htmlThanksMessage={htmlThanksMessage} thanksMessage={thanksMessage} 
          showRestartAtEnd={props?.customization?.showRestartAtEnd} 
        />
      : (
        <>
        <Flex flex={1} justifyContent={"center"} column style={{ marginBottom: 15 }}>
        {list.map((activeField, i) => {
          const value = responses.find(r => r.fieldId === activeField.id)!
          const file = selectedFiles.find(r => r.fieldId === activeField.id)!

          return (
            <Flex key={activeField.id} style={{ marginBottom: 5 }}>
              <Flex column flex={1}>
                <QuestionForField fields={fields} field={activeField} 
                  repeats={repeats} onRepeatsChange={setRepeats} setCustomerId={setCustomerId}
                  value={value} file={file} 
                  customInputs={customInputs}
                  onAddFile={onAddFile} onFieldChange={onFieldChange}
                  responses={responses} selectedFiles={selectedFiles}
                  validateField={validateField}
                />
              </Flex>
            </Flex>
          )
        })}
        </Flex>

        <Flex flex={1} wrap="nowrap">
          {updating
            ? (
              <Flex flex={1} column>
              <UpdateResponse 
                {...props} fields={fields} existingResponses={existingResponses}
                includedFieldIds={includedFieldIds}
                // style={{ width: 200, marginRight: 5, height: 42 }}
                formId={fields[0].formId}
                responses={responses}
                selectedFiles={selectedFiles}
                onSuccess={onSuccess}
              />
              </Flex>
            ) : (
              <>
              {showSaveDraft && 
                <SaveDraft existingResponses={existingResponses} fields={fields}
                  {...props} formTitle={formTitle} isInternalNote={isInternalNote}
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