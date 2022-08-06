import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Session } from "@tellescope/sdk"
import { ChangeHandler, FormFieldNode } from "./types"
import { FormField, FormResponse } from "@tellescope/types-client"
import { FileBlob, Indexable } from "@tellescope/types-utilities"
import { FormResponseAnswerFileValue, FormResponseValue, FormResponseValueAnswer, OrganizationTheme } from "@tellescope/types-models"
import { useFileUpload, useFormFields, useResolvedSession, value_is_loaded } from "../index"

import isEmail from "validator/lib/isEmail"
import isMobilePhone from "validator/lib/isMobilePhone"

export const useTreeForFormFields = (_fields: FormField[]) => {
  // ensure all fields actually belong to the same form
  const fields = _fields.filter(f => f.formId === _fields[0].formId)

  const nodesForId = {} as Indexable<FormFieldNode>
  for (const step of fields) {
    nodesForId[step.id] = {
      value: step,
      children: [],
    }
  }

  for (const parentId in nodesForId) {
    const parent = nodesForId[parentId]

    for (const childId in nodesForId) {
      if (childId === parentId) continue
      const child = nodesForId[childId]

      if ((child.value.previousFields).find(p => p.type === 'after' && p.info.fieldId === parentId)) {
        parent.children.push(child)
      }
    }
  }

  // find and return root
  return nodesForId[fields.find(s => s.previousFields.find(p => p.type === 'root'))?.id ?? '']
}

// load and build a tree of questions for a form
// only useful for clients who have broad access to forms and form resonses (e.g. users)
export const useLoadTreeForFormFields = (formId: string): FormFieldNode | undefined => {
  const [, { filtered }] = useFormFields({ loadFilter: { formId }})
  const formFieldsLoading = filtered(f => f.formId === formId)
  if (!value_is_loaded(formFieldsLoading)) return undefined

  return useTreeForFormFields(formFieldsLoading.value)
}

export const useFieldsForForm = (formId?: string) => {
  const [, { filtered, reload }] = useFormFields({ loadFilter: { formId: formId ?? '' }})

  useEffect(() => {
    if (!formId) return
    
    // ensure formResponses are loaded for a given form
    reload({ loadFilter: { formId } })
  }, [formId, reload])

  return filtered(f => f.formId === formId)
}

export type SubmitStatus = 'uploading-files' | 'submitting' | undefined

interface UseTellescopeFormOptions {
  enduserId: string,
  accessCode: string,
  automationStepId?: string,
  fields: FormField[],
}

const OrganizationThemeContext = createContext(null as any as { theme: OrganizationTheme, setTheme: (theme: OrganizationTheme) => void })
export const WithOrganizationTheme = ({ children } : { children: React.ReactNode }) => {
  const [theme, setTheme] = useState({} as OrganizationTheme)

  return (
    <OrganizationThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </OrganizationThemeContext.Provider>
  )
}


// uses context if provided, otherwise fetches separately for each hook call (but doesn't fail)
export const useOrganizationTheme = () => {
  const context = useContext(OrganizationThemeContext)
  if (context === null) {
    console.warn("useOrganizationTheme should be called in a child of WithOrganizationTheme")
  }

  const session = useResolvedSession()
  const [theme, setTheme] = useState(context.theme ?? {} as OrganizationTheme)

  useEffect(() => {
    if (theme.name) return // indicates already loaded

    session.api.organizations.get_theme({ businessId: session.userInfo.businessId })
    .then(({ theme } ) => {
      setTheme(theme)
      context?.setTheme(theme)
    })
    .catch(console.error)
  }, [theme, session])

  return context?.theme ?? theme
}

export const useTellescopeForm = ({ accessCode, automationStepId, enduserId, fields }: UseTellescopeFormOptions) => {
  const root = useTreeForFormFields(fields)
  const formId = root.value.formId

  const session = useResolvedSession()
  const { handleUpload } = useFileUpload({ enduserId: session.type === 'enduser' ? session.userInfo.id : enduserId })

  const [activeField, setActiveField] = useState(root)  
  const [submittingStatus, setSubmittingStatus] = useState<SubmitStatus>(undefined)
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const prevFieldStackRef = useRef<typeof root[]>([])

  const [responses, setResponses] = useState<(FormResponseValue & { touched: boolean })[]>(fields.map(f => ({
    fieldId: f.id,
    fieldTitle: f.title,
    touched: false,
    answer: { 
      type: f.type,
      value: '' as any,
    }
  })))
  const [selectedFiles, setSelectedFiles] = useState<{ fieldId: string, fieldTitle: string, blob?: FileBlob }[]>(fields.map(f => ({
    fieldId: f.id,
    fieldTitle: f.title,
    blob: undefined,
  })))

  const currentValue =  (
    responses.find(f => f.fieldId === activeField.value.id)!
  )
  const currentFileValue = (
    selectedFiles.find(f => f.fieldId === activeField.value.id)!
  )

  const validateCurrentValue = useCallback(() => {
    if (activeField.value.isOptional && !(currentValue.answer.value || currentFileValue.blob)) {
      return null 
    }
    // remaining are required, non-empty

    if (activeField.value.type === 'file') {
      if (!currentFileValue.blob) {
        return "A file is required"
      }
      return null // no need to check against other stuff
    }
    // remaining can refer to currentValue, not currentFileValue

    if (!currentValue.answer.value) {
      return "A response is required"
    }
    // remaining values exist and need to be validated by type

    // string type is validated by being non-empty, file is already validated
    if (currentValue.answer.type === 'email') {
      if (!isEmail(currentValue.answer.value)) {
        return "Enter a valid email"
      }
    } 
    else if (currentValue.answer.type === 'phone') {
      if (!isMobilePhone(currentValue.answer.value)) {
        return "Enter a valid phone number"
      }
    } else if (currentValue.answer.type === 'multiple_choice') {
      if (currentValue.answer.value.length === 0) {
        return "A value must be checked"
      }
    } else if (currentValue.answer.type === 'number') {
      if (typeof currentValue.answer.value !== 'number') {
        return "Please enter a number"
      }
    } else if (currentValue.answer.type === 'signature') {
      if (!currentValue.answer.value.fullName) {
        return "Please enter your full name"
      }
      if (!currentValue.answer.value.signed) {
        return "Please accept the terms of this signature"
      }
    } 

    return null
  }, [activeField, currentValue, currentFileValue])

  const showSubmit = activeField.children.length === 0
  const submitDisabled = submittingStatus !== undefined || !!validateCurrentValue()
  const submit = useCallback(async (onSuccess?: (r: FormResponse) => void) => {
    if (submitDisabled) return 

    setSubmitErrorMessage('')
    const hasFile = selectedFiles.find(f => !!f.blob) !== undefined

    setSubmittingStatus(hasFile ? 'submitting' : 'uploading-files')

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

        setSubmittingStatus("submitting")
      } catch(err: any) {
        setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
      } finally {
        setSubmittingStatus(undefined)
      }
    }

    if (!accessCode && session.type === 'enduser') throw new Error('enduser session without accessCode')
    try {
      const { formResponse } = await session.api.form_responses.submit_form_response({ 
        accessCode : (
          accessCode 
          || (await (
            session as any as Session).api.form_responses.prepare_form_response({ formId, enduserId })
          ).accessCode
        ),
        responses,
        automationStepId,
      })
      onSuccess?.(formResponse)
    } catch(err: any) {
      setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
    } finally {
      setSubmittingStatus(undefined)
    }
  }, [accessCode, automationStepId, enduserId, responses, selectedFiles, session, handleUpload, submitDisabled])

  const isNextDisabled = useCallback(() => {
    if (activeField.children.length === 0) {
      return true
    }

    if (validateCurrentValue()) {
      return true
    }

    return false
  }, [activeField, validateCurrentValue])

  const goToNextField = useCallback(() => {
    if (isNextDisabled()) return

    setActiveField(activeField => {
      let newField = activeField
      if (activeField.children.length === 0) { } // nop, keep as activeField
      else if (activeField.children.length === 1) {
        newField = activeField.children[0]
      } else {
        throw new Error("Support for multiple children is inimplemented")
      }

      if (newField !== activeField) {
        prevFieldStackRef.current.push(activeField)
      }
      
      return newField
    })
  }, [prevFieldStackRef, isNextDisabled])

  const isPreviousDisabled = useCallback(() => (
    prevFieldStackRef.current.length === 0
  ), [prevFieldStackRef])

  const goToPreviousField = useCallback(() => {
    if (isPreviousDisabled()) return

    const previous = prevFieldStackRef.current.pop()
    if (previous) {
      setActiveField(previous)
    }
  }, [isPreviousDisabled, prevFieldStackRef])

  const onFieldChange: ChangeHandler<any> = useCallback((value: FormResponseValueAnswer['value'], touched=true) => {
    setResponses(rs => rs.map(r => r.fieldId !== activeField.value.id ? r : ({
      ...r,
      touched,
      answer: {
        ...r.answer,
        value: value as any,
      },
    })))
  }, [activeField])

  const onAddFile = useCallback((blob?: FileBlob) => {
    setSelectedFiles(fs => fs.map(f => f.fieldId !== activeField.value.id ? f : ({
      ...f,
      blob,
    })))
  }, [activeField])

  return {
    activeField,
    currentValue,
    currentFileValue,
    onFieldChange,
    onAddFile,
    isNextDisabled,
    isPreviousDisabled,
    goToPreviousField,
    goToNextField,
    submit,
    showSubmit,
    submitDisabled,
    submitErrorMessage,
    submittingStatus,
    validateCurrentValue,
  }
}
