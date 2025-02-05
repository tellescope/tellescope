import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button, CircularProgress, Flex, LinearProgress, LoadingButton, Modal, Paper, Styled, Typography, form_display_text_for_language, useFileUpload, useFormResponses, useSession } from "../index"
import { useListForFormFields, useOrganizationTheme, useTellescopeForm, WithOrganizationTheme, Response, FileResponse, NextFieldLogicOptions } from "./hooks"
import { ChangeHandler, FormInputs } from "./types"
import { AddressInput, AllergiesInput, AppointmentBookingInput, ConditionsInput, DatabaseSelectInput, DateInput, DateStringInput, DropdownInput, EmailInput, EmotiiInput, FileInput, FilesInput, HeightInput, HiddenValueInput, InsuranceInput, LanguageSelect, MedicationsInput, MultipleChoiceInput, NumberInput, PhoneInput, Progress, RankingInput, RatingInput, RedirectInput, RelatedContactsInput, SignatureInput, StringInput, StringLongInput, StripeInput, TableInput, TimeInput, defaultButtonStyles } from "./inputs"
import { PRIMARY_HEX } from "@tellescope/constants"
import { FormResponse, FormField, Form, Enduser } from "@tellescope/types-client"
import { FormResponseAnswerFileValue, OrganizationTheme } from "@tellescope/types-models"
import { field_can_autosubmit, formatted_date, object_is_empty, objects_equivalent, read_local_storage, remove_script_tags, responses_satisfy_conditions, truncate_string } from "@tellescope/utilities"
import { Divider } from "@mui/material"

export const TellescopeFormContainer = ({ businessId, organizationIds, ...props } : { 
  businessId?: string, 
  organizationIds?: string[], 
  dontAddContext?: boolean,
  children: React.ReactNode, 
  hideBg?: boolean,
  backgroundColor?: string,
  hideLogo?: boolean,
  logoHeight?: number,
  language?: string,
  onChangeLanguage?: (l: string) => void,
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

const TellescopeFormContainerWithTheme: typeof TellescopeFormContainer = ({ children, language, onChangeLanguage, style, hideBg, backgroundColor, hideLogo, logoHeight }) => {
  const theme = useOrganizationTheme()

  const formContent = (
    <Flex flex={1} column>
      {hideLogo
        ? null
        : theme.logoURL 
          ? (
            <Flex alignItems="center" justifyContent={"center"} style={{ maxHeight: logoHeight || LOGO_HEIGHT, marginTop: 10 }}>
              <img src={theme.logoURL} alt={theme.name} style={{ maxHeight: logoHeight || LOGO_HEIGHT, maxWidth: 225 }} /> {/* todo: replace with something that resolves better for native */}          
            </Flex>
          )
          : (
            <Typography style={{ fontSize: 22, marginTop: 10, textAlign: 'center', fontWeight: 600 }}>
              {theme.name}
            </Typography>
          )
      }
      {language && onChangeLanguage && 
        <Flex style={{ marginTop: 22 }}>
          <LanguageSelect value={language} onChange={onChangeLanguage} />
        </Flex>
      }
      {children}
    </Flex>
  )
  if (hideBg) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" style={style}>
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
  form?: Form,
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
  rootResponseId?: string,
  parentResponseId?: string,
  downloadComponent?: React.ReactNode,
  enduser?: Partial<Enduser>,
  groupId?: string,
  groupInstance?: string,
}

const LOGO_HEIGHT = 40
export const TellescopeForm = (props : TellescopeFormProps & Styled & { hideBg?: boolean, theme?: OrganizationTheme, inputStyle?: React.CSSProperties }) => (
  <WithOrganizationTheme>
    <TellescopeFormWithContext {...props} /> 
  </WithOrganizationTheme>
)

export const QuestionForField = ({
  form,
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
  handleDatabaseSelect,
  enduser,
  goToPreviousField,
  isPreviousDisabled,
  enduserId,
  formResponseId,
  submit,
  groupId,
  groupInstance,
  goToNextField,
  spacing,
  isSinglePage,
  rootResponseId,
  isInQuestionGroup,
  logicOptions,
} : {
  spacing?: number,
  form?: Form,
  repeats: Record<string, string | number>,
  onRepeatsChange: (v: Record<string, string | number>) => void,
  value: Response,
  file: FileResponse,
  field: FormField,
  setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>,
  isSinglePage?: boolean,
  isInQuestionGroup?: boolean,
  logicOptions?: NextFieldLogicOptions,
} & Pick<TellescopeFormProps, "rootResponseId" | "goToNextField" | "groupId" | "groupInstance" | "submit" | "formResponseId" | 'enduserId' | 'isPreviousDisabled' | 'goToPreviousField' | 'enduser' | 'handleDatabaseSelect' | 'onAddFile' | 'onFieldChange' | 'fields' | 'customInputs' | 'responses' | 'selectedFiles' | 'validateField'>) => {
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
  const RelatedContacts = customInputs?.['Related Contacts'] ?? RelatedContactsInput
  const Insurance = customInputs?.['Insurance'] ?? InsuranceInput
  const AppointmentBooking = customInputs?.['Appointment Booking'] ?? AppointmentBookingInput
  const Height = customInputs?.['Height'] ?? HeightInput
  const Redirect = customInputs?.['Redirect'] ?? RedirectInput
  const HiddenValue = customInputs?.['Hidden Value'] ?? HiddenValueInput
  const Emotii = customInputs?.['Emotii'] ?? EmotiiInput
  const Allergies = customInputs?.['Allergies'] ?? AllergiesInput
  const Conditions = customInputs?.['Conditions'] ?? ConditionsInput

  const validationMessage = validateField(field)

  const feedback = useMemo(() => (
    (field.feedback || [])
    .filter(({ display, ifEquals }) => (
      ifEquals === value.answer.value
      || (Array.isArray(value.answer.value) && value.answer.value.includes(ifEquals as any))
    ))
    .map(v => v.display)
  ), [field.feedback, value])

  if (!value) return null
  if (
    isInQuestionGroup 
    && field.groupShowCondition && !object_is_empty(field.groupShowCondition)
    && !responses_satisfy_conditions(responses, field.groupShowCondition, logicOptions)
  ) {
      return null
  }
  return ( 
    // margin leaves room for error message in Question Group
    <Flex column flex={1} style={{ marginBottom: spacing ?? 25 }} id={field.id}> 
      {field.type !== 'Redirect' && field.title &&
        <Typography component="h4" style={{ 
          marginTop: 15, // ensures PDF display doesn't push description into overlap with logo / title at top of form
          fontSize: field.titleFontSize || (field.type === 'Question Group' ? 22 : 20), 
          fontWeight: field.type === 'Question Group' ? 'bold' : undefined,
        }}>
          {field.title}{!(field.isOptional || field.type === 'description' || field.type === 'Question Group' || field.type === 'Insurance') ? '*' : ''}
        </Typography>
      }
      {!field.title && (field.type === 'Question Group' || field.type === 'signature') && !form?.customization?.hideLogo &&
        // ensures PDF display doesn't push description into overlap with logo / title at top of form
        // also ensures spacing between logo and question group
        <div style={{ marginTop: 15 }}></div> 
      }

      <Description field={field} style={{ fontSize: 16 }} />

      {feedback.length > 0 && 
        <Flex column style={{ marginBottom: 11, marginTop: 3, }}>
          {feedback.map((f, i) => (
            <Typography key={i} color="error" style={{ fontSize: 20 }}>
              {f}
            </Typography>
          ))} 
        </Flex>
      }

      {
        field.type === 'file' ? (
          <File field={field} value={file.blobs?.[0] as any} onChange={onAddFile as any} form={form}
            existingFileName={
              value.answer.type === 'file'
                ? value.answer.value?.name
                : ''
            } 
          />
        )
        : field.type === 'files' ? (
          <Files field={field} value={file.blobs as any} onChange={onAddFile as any} form={form}
            // existingFileName={
            //   value.answer.type === 'files'
            //     ? value.answer.value?.name
            //     : ''
            // } 
          />
        )
        : field.type === 'dateString' ? (
          <DateStringInput field={field} disabled={value.disabled} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} form={form} />
        )
        : field.type === 'Hidden Value' ? (
          <HiddenValue isSinglePage={isSinglePage} goToNextField={goToNextField} goToPreviousField={goToPreviousField} field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Address' ? (
          <Address field={field} disabled={value.disabled} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Emotii' ? (
          <Emotii enduser={enduser} enduserId={enduserId} field={field} disabled={value.disabled} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Allergies' ? (
          <Allergies enduser={enduser} enduserId={enduserId} field={field} disabled={value.disabled} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Conditions' ? (
          <Conditions enduser={enduser} enduserId={enduserId} field={field} disabled={value.disabled} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Height' ? (
          <Height field={field} disabled={value.disabled} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Redirect' ? (
          <Redirect enduserId={enduserId} rootResponseId={rootResponseId} formResponseId={formResponseId} responses={responses} enduser={enduser} groupId={groupId} groupInsance={groupInstance} submit={submit} field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'Related Contacts' ? (
          <RelatedContacts field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form} />
        )
        : field.type === 'string' ? (
          <String field={field} disabled={value.disabled} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string'>} form={form} />
        )
        : field.type === 'Appointment Booking' ? (
          <AppointmentBooking formResponseId={formResponseId} enduserId={enduserId} goToPreviousField={goToPreviousField} isPreviousDisabled={isPreviousDisabled} responses={responses} field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'Appointment Booking'>} form={form} />
        )
        : field.type === 'Stripe' ? (
          <Stripe field={field} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<any>} setCustomerId={setCustomerId} form={form} />
        )
        : field.type === 'stringLong' ? (
          <StringLong field={field} disabled={value.disabled} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'string' | 'stringLong'>} form={form} />
        )
        : field.type === 'email' ? (
          <Email field={field} disabled={value.disabled} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'email'>} form={form} />
        )
        : field.type === 'number' ? (
          <Number field={field} disabled={value.disabled} value={value.answer.value as number} onChange={onFieldChange as ChangeHandler<'number'>} form={form} />
        )
        : field.type === 'phone' ? (
          <Phone field={field} disabled={value.disabled} value={value.answer.value as string} onChange={onFieldChange as ChangeHandler<'phone'>} form={form} />
        )
        : field.type === 'date' ? (
          <ResolvedDateInput field={field} disabled={value.disabled} value={value.answer.value ? new Date(value.answer.value as string | Date) : undefined} onChange={onFieldChange as ChangeHandler<'date'>} form={form} />
        )
        : field.type === 'signature' ? (
          <Signature enduser={enduser} field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'signature'>} form={form}/>
        )
        : field.type === 'multiple_choice' ? (
          <MultipleChoice field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'multiple_choice'>} form={form}/>
        )
        : field.type === 'Dropdown' ? (
          <Dropdown field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Dropdown'>} form={form}/>
        )
        : field.type === 'Database Select' ? (
          <DatabaseSelect field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Database Select'>} 
            onDatabaseSelect={handleDatabaseSelect}
            responses={responses} form={form}
          />
        )
        : field.type === 'Medications' ? (
          <Medications field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'Medications'>} form={form}/>
        )
        : field.type === 'Insurance' ? (
          <Insurance field={field} value={value.answer.value as any} form={form}
            enduser={enduser} responses={responses} // for filtering insurers by state
            onChange={(v, fieldId) => (onFieldChange as ChangeHandler<'Insurance'>)({
              ...v,
              relationship: v?.relationship || 'Self', // make sure relationship is initialized to self if input is provided
            }, fieldId)}
          />
        )
        : field.type === 'rating' ? (
          <Rating field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'rating'>} form={form}/>
        )
        : field.type === 'ranking' ? (
          <Ranking field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<'ranking'>} form={form}/>
        )
        : field.type === 'Table Input' ? (
          <TableInput field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form}/>
        )
        : field.type === 'Time' ? (
          <Time field={field} value={value.answer.value as any} onChange={onFieldChange as ChangeHandler<any>} form={form}/>
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
                <QuestionForField groupId={groupId} groupInstance={groupInstance} customInputs={customInputs} field={match} fields={fields} handleDatabaseSelect={handleDatabaseSelect}
                  enduser={enduser} goToPreviousField={goToPreviousField} isPreviousDisabled={isPreviousDisabled} goToNextField={goToNextField}
                  form={form} formResponseId={formResponseId} rootResponseId={rootResponseId} submit={submit}
                  repeats={repeats} onRepeatsChange={onRepeatsChange} setCustomerId={setCustomerId}
                  value={value} file={file} 
                  onAddFile={onAddFile} onFieldChange={onFieldChange}
                  responses={responses} selectedFiles={selectedFiles}
                  validateField={validateField} enduserId={enduserId}
                  spacing={field.options?.groupPadding}
                  logicOptions={logicOptions}
                  isInQuestionGroup
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
            <String field={field} label="Repeat" value={repeats[field.id] as string ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} form={form} />
          )
          : field.type === 'stringLong' ? (
            <StringLong field={field} label="Repeat" value={repeats[field.id] as string ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} form={form} />
          ) 
          : field.type === 'number' ? (
            <Number field={field} label="Repeat" value={repeats[field.id] as number ?? ''} onChange={u => onRepeatsChange({ ...repeats, [field.id]: u! })} form={form} />
          )
          : null
        }
        </Flex>
      )}

      {field.type !== 'Question Group' &&
        <Typography color="error" style={{ marginTop: 3, height: 10, fontSize: 14, marginBottom: -10 }}> 
          {(validationMessage === 'A response is required' || validationMessage === 'A value must be checked' || validationMessage === 'A file is required' || 'Enter a valid phone number' || 'Insurer is required')
            ? value.touched 
              ? form_display_text_for_language(form, validationMessage)
              : null 
            : form_display_text_for_language(form, validationMessage)
          }
        </Typography>  
      }
    </Flex>
  )
}

export const TellescopeSingleQuestionFlow: typeof TellescopeForm = ({
  form,
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
  handleDatabaseSelect,

  setCustomerId,
  customization,
  enduserId,
  enduser,
  formResponseId,
  groupId,
  groupInstance,
  logicOptions,
}) => {
  const beforeunloadHandler = React.useCallback((e: BeforeUnloadEvent) => {
    try {
      e.preventDefault()
      e.returnValue = 'You have unsaved changes'
    } catch(err) { }

    return ''
  }, [])

  const [uploading, setUploading] = useState(false)
  const [autosubmitting, setAutoSubmitting] = useState(false)

  useEffect(() => {
    // ensure redirect question doesn't trip this alert
    if (activeField.value.type === 'Redirect') { return }

    window.addEventListener('beforeunload', beforeunloadHandler)
    return () => { window.removeEventListener('beforeunload', beforeunloadHandler) }
  }, [beforeunloadHandler, activeField])

  const handleSubmit = useCallback(async (options?: { onFileUploadsDone?: () => void }) => {
    if (isPreview) {
      return onSuccess?.({} as any)
    } 


    await submit({ 
      onSuccess,
      ...options,
      onPreRedirect: () => {
        // submission may trigger a redirect, so don't block with warning message
        try {
          window.removeEventListener('beforeunload', beforeunloadHandler) 
        } catch(err) {}
      }
    })
  }, [isPreview, onSuccess, submit, beforeunloadHandler])

  const autoSubmitRef = useRef(false)
  useEffect(() => {
    if (!activeField.value.options?.autoSubmit) {
      return  
    }
    if (autoSubmitRef.current) return

    if (responses.find(r => r.fieldId === activeField.value.id && field_can_autosubmit(activeField.value) && r.answer.value)) {
      autoSubmitRef.current = true
      setAutoSubmitting(true)
      handleSubmit()
      .finally(() => setAutoSubmitting(false))
    }
  }, [handleSubmit, responses, activeField])

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
              <QuestionForField form={form} fields={fields} field={activeField.value} submit={submit}
                enduserId={enduserId} formResponseId={formResponseId}
                enduser={enduser} goToPreviousField={goToPreviousField} isPreviousDisabled={isPreviousDisabled} goToNextField={goToNextField}
                handleDatabaseSelect={handleDatabaseSelect}
                setCustomerId={setCustomerId}
                repeats={repeats} onRepeatsChange={setRepeats}
                value={currentValue} file={currentFileValue} 
                customInputs={customInputs}
                onAddFile={onAddFile} onFieldChange={onFieldChange}
                responses={responses} selectedFiles={selectedFiles}
                validateField={validateField}
                groupId={groupId} groupInstance={groupInstance}
                logicOptions={logicOptions}
              />
            </Flex>
        </Flex>

        <Flex alignItems={'center'} justifyContent="space-between">
          {!isPreviousDisabled()
            ? (
              <Button variant="outlined" disabled={isPreviousDisabled()} onClick={goToPreviousField}
                style={defaultButtonStyles}
              >
                {form_display_text_for_language(form, "Previous")}
              </Button>
            )
            : <Flex />
          }
          {uploading &&
            <Modal open setOpen={() => undefined}>
              <Flex style={{  }} justifyContent="center">
                <Typography style={{ fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' }}>
                  Uploading files... 
                </Typography>

                <CircularProgress size={75} style={{ marginTop: 10, marginBottom: 10 }} />

                <Typography style={{ fontSize: 20, width: 250, fontWeight: 'bold', textAlign: 'center' }}>
                  Please stay on this page until your submission is complete!
                </Typography>
              </Flex>
            </Modal>
          }
          {showSubmit 
            ? (
              <LoadingButton 
                onClick={() => {
                  setUploading(!!selectedFiles.find(r => !!r.blobs?.length))
                  return handleSubmit({ onFileUploadsDone: () => setUploading(false) })
                }} 
                disabled={!!validationMessage || currentValue.field?.options?.disableNext === true || autosubmitting}
                submitText={form_display_text_for_language(form, "Submit")}
                submittingText={
                  submittingStatus === 'uploading-files' 
                    ? 'Uploading files...'
                    : "Submitting..."
                } 
                style={{ ...defaultButtonStyles, minWidth: 150, width: '50%', maxWidth: 250 }}
                // @ts-ignore
                color={theme.themeColor ?? PRIMARY_HEX}
              />
            )
            : (
              <Button variant="contained" disabled={isNextDisabled()} onClick={goToNextField} 
                style={{ ...defaultButtonStyles, width: 100 }}
              >
                {form_display_text_for_language(form, "Next")}
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
export const ThanksMessage = ({ 
  thanksMessage, 
  htmlThanksMessage,
  showRestartAtEnd,
  downloadComponent,
} : { 
  thanksMessage?: string, 
  htmlThanksMessage?: string,
  showRestartAtEnd?: boolean,
  downloadComponent?: React.ReactNode,
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
    {read_local_storage('redirecting_public_group') === 'true' &&
      <>
      <Typography style={{ marginTop: 25, alignSelf: 'center' }}>
        Redirecting to next form... <CircularProgress size={20} color="primary" />
      </Typography>
      </>
    }
    {downloadComponent &&
      <Flex justifyContent="center" style={{ marginTop: 15, marginBottom: 15 }}>
        {downloadComponent}
      </Flex>
    }
    {showRestartAtEnd && window.localStorage[`ts_form_url`] &&
      <Button variant="outlined" style={{ ...defaultButtonStyles, maxWidth: 200, marginTop: 25, alignSelf: 'center' }}
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
    <TellescopeFormContainer style={props.style} dontAddContext 
      hideBg={props.hideBg || props.form?.customization?.hideBg} 
      backgroundColor={props.backgroundColor}
      hideLogo={props?.customization?.hideLogo}
    >
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
  rootResponseId,
  parentResponseId,
} : Styled & Pick<TellescopeFormProps, 'existingResponses' | 'fields' | 'onSuccess' | 'selectedFiles' | 'responses' | 'enduserId' | 'getResponsesWithQuestionGroupAnswers'> & { 
  disabled?: boolean,
  formResponseId?: string, 
  formId: string,
  includedFieldIds: string[]
  isInternalNote?: boolean,
  formTitle?: string,
  rootResponseId?: string,
  parentResponseId?: string,
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
              ?? (await session.api.form_responses.prepare_form_response({ rootResponseId, parentResponseId, isInternalNote, formId, enduserId, title: formTitle })).response.id
            ),
            { 
              draftSavedAt: new Date(),
              draftSavedBy: session?.userInfo?.id,
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

export const TellescopeSinglePageForm: React.JSXElementConstructor<TellescopeFormProps & Styled & { 
  updating?: boolean, 
  isInternalNote?: boolean,
  submittedAt?: Date,
  updatedAt?: Date,
  otherEnduserIds?: string[],
  onBulkErrors?: (errors: { enduserId: string, message: string }[]) => void,
}> = ({
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

  rootResponseId,
  parentResponseId,

  handleDatabaseSelect,

  submittedAt,
  updatedAt,

  otherEnduserIds,
  onBulkErrors,
  enduser,
  groupId,
  groupInstance,
  ...props 
}) => {
  const list = useListForFormFields(fields, responses, { form: props.form, gender: enduser?.gender })

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
      otherEnduserIds, onBulkErrors,
    })
  }, [isPreview, onSuccess, submit, otherEnduserIds, onBulkErrors])

  const errors = useMemo(() => {
    const es: { id: string, title: string, error: string }[] = []
    
    try { 
      list.forEach(field => {
        const error = validateField(field)
        if (error && typeof error === 'string') es.push({
          id: field.id,
          title: field.title,
          error,
        })
      })
    } catch(err) {
      console.error(err)
    }

    return es
  }, [list, validateField])

  let updatesDisabled = true
  for (const r of responses ?? []) {
    const match = existingResponses?.find(_r => _r.fieldId === r.fieldId)
    if (!match) {
      updatesDisabled = false
      break;
    }
    if (!objects_equivalent(r.answer, match.answer)) {
      updatesDisabled = false
      break;
    }
  }

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
                <QuestionForField isSinglePage fields={fields} field={activeField} handleDatabaseSelect={handleDatabaseSelect}
                  enduserId={props.enduserId} formResponseId={props.formResponseId} rootResponseId={rootResponseId} submit={submit}
                  enduser={enduser} goToPreviousField={goToPreviousField} isPreviousDisabled={isPreviousDisabled} goToNextField={goToNextField}
                  repeats={repeats} onRepeatsChange={setRepeats} setCustomerId={setCustomerId}
                  value={value} file={file} 
                  customInputs={customInputs}
                  onAddFile={onAddFile} onFieldChange={onFieldChange}
                  responses={responses} selectedFiles={selectedFiles}
                  validateField={validateField}
                  groupId={groupId} groupInstance={groupInstance}
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
                  disabled={updatesDisabled}
                />

                {submittedAt &&
                  <Typography style={{ marginTop: 5 }}>
                    Originally Submitted: {formatted_date(new Date(submittedAt))}
                  </Typography>
                }
                {updatedAt &&
                  <Typography>
                    Last Updated: {formatted_date(new Date(updatedAt))}
                  </Typography>
                }
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
                  rootResponseId={rootResponseId} parentResponseId={parentResponseId}
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

        {errors.length > 0 &&
          <>
          <Divider flexItem sx={{ my: 1 }} />

          <Flex alignItems="center" wrap="nowrap">
            <Typography noWrap style={{ width: 200 }}>
              Question
            </Typography>
            <Typography noWrap style={{  }}>
              Error
            </Typography>
          </Flex>
          </>
        }
        {errors.map(e => (
          <Flex key={e.id} alignItems="center" wrap="nowrap">
            <Typography noWrap style={{ width: 200, textDecoration: 'underline', cursor: 'pointer' }} 
              onClick={() => {
                try {
                  document.getElementById(e.id)?.scrollIntoView({ behavior: 'smooth' });
                } catch(err) {
                  console.error(err)
                }
              }}
            >
              {truncate_string(e.title, { length: 50 })}
            </Typography>

            <Typography color="error" style={{ width: 300 }}>
              {e.error}
            </Typography>
          </Flex>
        ))}
        </>
      )}
    </Flex>
  )
}