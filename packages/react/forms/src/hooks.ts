import { useCallback, useEffect, useRef, useState } from "react"
import { useFileUpload, useFormFields, useResolvedSession, value_is_loaded } from "@tellescope/react-components"
import { Session } from "@tellescope/sdk"
import { ChangeHandler, FormFieldNode } from "./types"
import { FormField } from "@tellescope/types-client"
import { FileBlob, Indexable } from "@tellescope/types-utilities"
import { AnswerForType, FormResponseAnswerFileValue, FormResponseValue, FormResponseValueAnswer, OrganizationTheme } from "@tellescope/types-models"

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

export type SubmitStatus = 'uploading-files' | 'submitting' | '' 

interface UseFormOptions {
  enduserId: string,
  accessCode: string,
  automationStepId?: string,
  fields: FormField[],
}

export const useForm = ({ accessCode, automationStepId, enduserId, fields }: UseFormOptions) => {
  const root = useTreeForFormFields(fields)
  const formId = root.value.formId
  const session = useResolvedSession()

  const { handleUpload } = useFileUpload({ enduserId: session.type === 'enduser' ? session.userInfo.id : enduserId })

  const [activeField, setActiveField] = useState(root)  
  const [submittingStatus, setSubmittingStatus] = useState<SubmitStatus>('')
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const prevFieldStackRef = useRef<typeof root[]>([])

  const [theme, setTheme] = useState({} as OrganizationTheme)

  useEffect(() => {
    if (theme) return

    session.api.organizations.get_theme({ businessId: session.userInfo.businessId })
    .then(({ theme} ) => setTheme(theme))
    .catch(console.error)
  }, [theme, session])

  const [responses, setResponses] = useState<FormResponseValue[]>(fields.map(f => ({
    fieldId: f.id,
    fieldTitle: f.title,
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

  const showSubmit = activeField.children.length === 0
  const submitDisabled = submittingStatus !== undefined
  const submit = useCallback(async () => {
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
        setSubmittingStatus('')
      }
    }

    if (!accessCode && session.type === 'enduser') throw new Error('enduser session without accessCode')
    session.api.form_responses.submit_form_response({ 
      accessCode : (
        accessCode 
        || (await (
          session as any as Session).api.form_responses.prepare_form_response({ formId, enduserId })
        ).accessCode
      ),
      responses,
      automationStepId,
    }) 
  }, [accessCode, automationStepId, enduserId, responses, selectedFiles, session, handleUpload, submitDisabled])

  const isNextDisabled = useCallback(() => {
    if (activeField.children.length === 0) {
      return true
    }

    const currentValue = (
      activeField.value.type === 'file' // file stored differently until submit
        ? selectedFiles.find(r => r.fieldId === activeField.value.id)?.blob
        : responses.find(r => r.fieldId === activeField.value.id)?.answer?.value
    )
    if (!(activeField.value.isOptional || currentValue)) {
      return true
    }

    return false
  }, [activeField, responses, selectedFiles])

  const goToNextField = useCallback(() => {
    if (isNextDisabled()) return
    setActiveField(activeField => {
      const newField = activeField
      if (activeField.children.length === 0) { } // nop, keep as activeField
      else if (activeField.children.length === 1) {
      } else {
        throw new Error("Support for multiple children is inimplemented")
      }

      if (newField !== activeField) {
        prevFieldStackRef.current.push(newField)
      }
      
      return newField
    })
  }, [prevFieldStackRef, isNextDisabled])

  const isPreviousDisabled = useCallback(() => (
    prevFieldStackRef.current.length === 0
  ), [prevFieldStackRef])

  const goToPreviousField = useCallback(() => {
    if (isPreviousDisabled()) return
    setActiveField(prevFieldStackRef.current.pop()!)
  }, [isPreviousDisabled, prevFieldStackRef])

  const onFieldChange: ChangeHandler<any> = useCallback((value: FormResponseValueAnswer['value']) => {
    setResponses(rs => rs.map(r => r.fieldId !== activeField.value.id ? r : ({
      ...r,
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
    theme,
  }
}
