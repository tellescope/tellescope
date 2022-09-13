import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Session } from "@tellescope/sdk"
import { ChangeHandler, FormFieldNode } from "./types"
import { FormField, FormResponse } from "@tellescope/types-client"
import { FileBlob, Indexable } from "@tellescope/types-utilities"
import { FormResponseAnswerFileValue, FormResponseValue, FormResponseValueAnswer, OrganizationTheme, PreviousFormFieldType } from "@tellescope/types-models"
import { useFileUpload, useFormFields, useFormResponses, useResolvedSession, value_is_loaded } from "../index"

import isEmail from "validator/lib/isEmail"
import isMobilePhone from "validator/lib/isMobilePhone"

export const useFlattenedTree = (root?: FormFieldNode) => {
  const flat: FormField[] = []

  const processing = [root]
  while (processing.length) {
    const node = processing.pop()
    if (!node) break;

    flat.push(node.value)

    for (const child of node.children ?? []) {
      // continue DFS with unprocessed children
      if (flat.find(e => e.id === child.value.id)) continue
      processing.push(child)
    }
  }

  return flat
}

export const useNodeInTree = (root: FormFieldNode, nodeId: string) => {
  const processed: string[] = [root.value.id]
  const processing = [root]

  while (processing.length) {
    const node = processing.pop()
    if (!node) break;

    if (node.value.id === nodeId) return node

    for (const child of node.children ?? []) {
      // continue DFS with unprocessed children
      if (processed.includes(child.value.id)) continue
      processing.push(child)
      processed.push(child.value.id)
    }
  }

  return undefined
}

type BasicEdge = {
  source: string,
  target: string,
}

export const loopDetected = (edges: (BasicEdge & { id: string })[], startId: string): boolean => {
  const startEdge = edges.find(e => e.source === startId)
  const processed = [startEdge?.id ?? '']
  const processing = [startEdge]

  while (processing.length) {
    const edge = processing.pop()
    if (!edge) break;

    if (edge.target === startId) return true

    for (const adjacentEdge of edges.filter(e => e.source === edge.target)) {
      // continue DFS with unprocessed children
      if (processed.includes(adjacentEdge.id)) continue
      processing.push(adjacentEdge)
      processed.push(adjacentEdge.id)
    }
  }

  return false
}

export const useGraphForFormFields = (fields: FormField[]) => {
  const edges = [] as {
    id: string,
    source: string,
    target: string,
    type: PreviousFormFieldType,
    label?: string
  }[]

  for (const field of fields) {
    // if (field.previousFields.find(p => p.type === 'root')) {
    //   edges.push({
    //     source: 'start',
    //     target: field.id,
    //     type: 'root',
    //     label: "Start"
    //   })
    // }

    for (const parent of field.previousFields ?? []) {
      if ((parent.info as any).fieldId) {
        edges.push({
          source: (parent.info as any).fieldId,
          target: field.id, 
          type: parent.type,
          id: `${(parent.info as any).fieldId}-${field.id}`,
          label: parent.type === 'previousEquals' ? parent.info.equals : '',
        })
      }
    }
  }

  // const start = ({
  //   id: 'start',
  //   type: 'start',
  //   position: {
  //     x: 0, y: 0,
  //   },
  // })

  return { 
    nodes: [
      // start as any as FormField, 
      ...fields
    ], 
    edges 
  }
}

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

      if ((child.value.previousFields).find(p => (p.info as any)?.fieldId === parentId)) {
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

const OrganizationThemeContext = createContext(null as any as { 
  theme: OrganizationTheme, 
  setTheme: (theme: OrganizationTheme) => void,
  businessId?: string,
})
export const WithOrganizationTheme = ({ businessId, children } : { children: React.ReactNode, businessId?: string }) => {
  const [theme, setTheme] = useState({} as OrganizationTheme)

  return (
    <OrganizationThemeContext.Provider value={{ businessId, theme, setTheme }}>
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

    session.api.organizations.get_theme({ businessId: context?.businessId ?? session.userInfo.businessId })
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
  const [, { updateLocalElement: updateLocalFormResponse }] = useFormResponses({ dontFetch: true })

  const [activeField, setActiveField] = useState(root)  
  const [submittingStatus, setSubmittingStatus] = useState<SubmitStatus>(undefined)
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const prevFieldStackRef = useRef<typeof root[]>([])

  const [responses, setResponses] = useState<(FormResponseValue & { touched: boolean, includeInSubmit: boolean })[]>(fields.map(f => ({
    fieldId: f.id,
    fieldTitle: f.title,
    touched: false, 
    includeInSubmit: false,
    answer: { 
      type: f.type,
      value: f.type === 'file' || f.type === 'signature' || f.type === 'multiple_choice'
        ? undefined  
          : f.type === 'ranking'
            ? f.options?.choices
            : '' as any, // null flag that the response was not filled out
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

  const updateInclusion = useCallback((includeInSubmit: boolean) => {
    setResponses(rs => {
      const current = rs.find(r => r.fieldId === currentValue.fieldId)
      if (!current) return rs

      return ([
        ...rs.filter(r => r.fieldId !== current.fieldId), 
        {
          ...current,
          includeInSubmit,
        }
      ])
    })
  }, [currentValue])

  useEffect(() => {
    if (currentValue.includeInSubmit) return
    updateInclusion(true)
  }, [updateInclusion, currentValue])

  const validateCurrentValue = useCallback(() => {
    if (activeField.value.isOptional) {
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
    } else if (currentValue.answer.type === 'rating') {
      if ((activeField.value?.options?.from && currentValue.answer.value < activeField.value.options.from)
          || activeField.value?.options?.to && currentValue.answer.value > activeField.value.options.to
        ) {
          return `Please enter a number between ${activeField.value?.options?.from} and ${activeField.value?.options?.to}`
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
        responses: responses.filter(r => r.includeInSubmit),
        automationStepId,
      })

      updateLocalFormResponse(formResponse.id, formResponse)
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
        newField = (
          activeField.children.find(c => c.value.previousFields.find(p => 
             p.type === 'previousEquals' 
          && p.info.fieldId === currentValue.fieldId
          && (
            (currentValue.answer.type === 'multiple_choice' && currentValue.answer.value?.includes(p.info.equals))
          || p.info.equals === currentValue.answer.value
          )
        ))
        ) || (
          activeField
          .children.find(c => (c.value.previousFields.find(p => 
             p.type === 'after' 
          && p.info.fieldId === activeField.value.id
          )))!
        )
      }

      if (newField !== activeField) {
        prevFieldStackRef.current.push(activeField)
      }
      
      return newField
    })
  }, [prevFieldStackRef, currentValue, isNextDisabled])

  const isPreviousDisabled = useCallback(() => (
    prevFieldStackRef.current.length === 0
  ), [prevFieldStackRef])

  const goToPreviousField = useCallback(() => {
    if (isPreviousDisabled()) return

    updateInclusion(false)

    const previous = prevFieldStackRef.current.pop()
    if (previous) { 
      setActiveField(previous)
    }
  }, [isPreviousDisabled, updateInclusion, prevFieldStackRef])

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
