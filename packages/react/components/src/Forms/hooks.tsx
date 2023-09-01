import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Session } from "@tellescope/sdk"
import { ChangeHandler, FormFieldNode } from "./types"
import { FormField, FormResponse } from "@tellescope/types-client"
import { phoneValidator } from "@tellescope/validation"
import { FileBlob, Indexable } from "@tellescope/types-utilities"
import { FormCustomization, FormResponseAnswerFileValue, FormResponseValue, FormResponseValueAnswer, OrganizationTheme, PreviousFormFieldType } from "@tellescope/types-models"
import { WithTheme, useFileUpload, useFormFields, useFormResponses, useResolvedSession, value_is_loaded } from "../index"
import ReactGA from "react-ga4";

import isEmail from "validator/lib/isEmail"
import { getLocalTimezone, get_time_values } from "@tellescope/utilities"

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
    label?: React.ReactNode
  }[]

  for (const field of fields) {
    for (const parent of field.previousFields ?? []) {
      if ((parent.info as any).fieldId) {
        edges.push({
          source: (parent.info as any).fieldId,
          target: field.id, 
          type: parent.type,
          id: `${(parent.info as any).fieldId}-${field.id}`,
          label: (
            parent.type === 'previousEquals' 
              ? parent.info.equals // if adding text, make sure that the edge editor is able to remove it first
              : "Default"
          ),
        })
      }
    }
  }

  return { 
    nodes: ( // important that this is a copy, filter achieves this
      fields.filter(f => !(
        f.isInGroup
        && fields.find(p => p.options?.subFields?.find(s => s.id === f.id))
      ))
    ),
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

export const getNextField = (activeField: FormFieldNode, currentValue: Response) => {
  if (activeField.children.length === 0) {
    return
  } 
  
  if (activeField.children.length === 1) {
    return activeField.children[0]
  } 

  return (
    activeField.children.find(c => c.value.previousFields.find(p => 
        p.type === 'previousEquals' 
    && p.info.fieldId === currentValue.fieldId
    && (
      ((currentValue.answer.type === 'multiple_choice' || currentValue.answer.type === 'Dropdown') 
    && currentValue.answer.value?.includes(p.info.equals))
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

export const useListForFormFields = (fields: FormField[], responses: Response[]) => {
  const list: FormField[] = []

  const root = fields.find(f => f.previousFields.find(p => p.type === 'root'))
  if (!root) return []

  list.push(root)
  while (true) {
    const lastField = list[list.length - 1]
    if (!lastField) break;

    const currentValue = responses.find(r => r.fieldId === lastField.id)
    if (!currentValue) break;

    const nextField = getNextField(
      {
        value: lastField,
        children: (
          fields.filter(
            f => f.previousFields.find(p => p.type !== 'root' && p.info.fieldId === lastField.id)
          )
          .map(value => ({
            value, 
            children: []
          }))
        )
      }, 
      currentValue
    )
    if (!nextField) break;

    if (list.find(f => f.id === nextField.value.id)) break; // prevent infinite looping in safe case
    list.push(nextField.value)
  }

  return list
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
  existingResponses?: FormResponse['responses'],
  formResponseId?: string,
  isInternalNote?: boolean,
  formTitle?: string,
  customization?: FormCustomization,
  ga4measurementId?: string,
  submitRedirectURL?: string,
  rootResponseId?: string,
  parentResponseId?: string,
}

const OrganizationThemeContext = createContext(null as any as { 
  theme: OrganizationTheme, 
  setTheme: (theme: OrganizationTheme) => void,
  businessId?: string,
  organizationIds?: string[],
})
export const WithOrganizationTheme = ({ businessId, organizationIds, children } : { children: React.ReactNode, businessId?: string, organizationIds?: string[] }) => {
  const [theme, setTheme] = useState({} as OrganizationTheme)

  return (
    <OrganizationThemeContext.Provider value={{ businessId, organizationIds, theme, setTheme }}>
    <WithTheme theme={{
      primary: theme.themeColor,
      secondary: theme.themeColorSecondary
    }}>
      {children}
    </WithTheme>
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

    session.api.organizations.get_theme({ 
      businessId: context?.businessId ?? session.userInfo.businessId,
      organizationIds: context?.organizationIds ?? session.userInfo.organizationIds,
    })
    .then(({ theme } ) => {
      setTheme(theme)
      context?.setTheme(theme)
    })
    .catch(console.error)
  }, [theme, session])

  return context?.theme ?? theme
}

export const isDateString = (_s='') => {
  const s = _s.trim()

  if (!/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    return false
  }

  // this seems to have inconsistent behavior in some mobile browsers, leave out for now
  // // ensure mm-dd-yyyy is actually valid
  // const [mm,dd,yyyy] = s.split('-').map(v => parseInt(v)) // don't shorthand, for radix argument of parseInt gets messed up
  // const d = Date.parse(`${yyyy}-${mm}-${dd}`) // this format should be explicitly supported by all implementations
  // if (isNaN(d)) return false
  
  return true
}
const isZIPString = (s='') =>  /^\d{5}$/.test(s) || /^\d{5}-\d{4}$/.test(s)

// return the existing value to initialie a field, but only if the field type is consistent with the existing response
const existing_response_if_compatible = (existingResponses: FormResponseValue[] | undefined, field: FormField) => {
  if (!existingResponses) return undefined

  const match = existingResponses?.find(_f => _f.fieldId === field.id)?.answer
  if (!match) return

  // fix for mismatch in loading stored responses
  // should come before 'if type is same, this is fine'
  if (typeof match.value === 'string' && (
    field.type === 'Dropdown'
    || field.type === 'multiple_choice'
  )) {
    return [match.value]
  }

  // if type is same, this is fine
  if (match.type === field.type) {
    return match.value
  }

  // multiple types correspond to string values
  if (typeof match.value === 'string' && (
     field.type === 'string'
  || field.type === 'stringLong'
  || field.type === 'dateString'
  || field.type === 'email'
  || field.type === 'phone'
  )) {
    return match.value
  }
 
  // multiple types correspond to number values
  if (typeof match.value === 'number' && (
    field.type === 'number'
  || field.type === 'rating'
  )) {
    return match.value
  }

  // multiple types correspond to string list values
  if (Array.isArray(match.value) && (
    field.type === 'Dropdown'
    || field.type === 'multiple_choice'
  )) {
    return match.value
  }


  return undefined // no valid match, write off as data loss due to incompatible type of new question
}

export type Response = FormResponseValue & { touched: boolean, includeInSubmit: boolean, field: FormField }
export type FileResponse = { fieldId: string, fieldTitle: string, blobs?: FileBlob[] }
export const useTellescopeForm = ({ customization, ga4measurementId, rootResponseId, parentResponseId, accessCode, existingResponses, automationStepId, enduserId, formResponseId, fields, isInternalNote, formTitle, submitRedirectURL }: UseTellescopeFormOptions) => {
  const { amPm, hoursAmPm, minutes } = get_time_values(new Date())

  const root = useTreeForFormFields(fields)
  if (!root) {
    console.error(fields)
    throw new Error("Root not found for given fields")
  }
  const formId = root.value.formId

  const session = useResolvedSession()
  const { handleUpload } = useFileUpload({ enduserId: session.type === 'enduser' ? session.userInfo.id : enduserId })
  const [, { updateElement: updateFormResponse, updateLocalElement: updateLocalFormResponse }] = useFormResponses({ dontFetch: true })

  const [customerId, setCustomerId] = useState<string>()
  const [activeField, setActiveField] = useState(root)  
  const [submittingStatus, setSubmittingStatus] = useState<SubmitStatus>(undefined)
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const prevFieldStackRef = useRef<typeof root[]>([])

  const [repeats, setRepeats] = useState({} as Record<string, string | number>)

  const gaEventRef = useRef({} as Record<string, boolean>)

  const getNumberOfRemainingPages: (field?: FormField, explored?: string[]) => number = useCallback((field=activeField.value, explored=[]) => {
    // prevents recursing on an already explored node (there shouldn't be loops anyway, but just in case)
    if (explored.includes(field.id)) return 0

    const children = fields.filter(
      f => (
        f.previousFields.find(f => f.type !== 'root' && f.info.fieldId === field.id)
      )
    )
    if (children.length === 0) return 0

    return (
      1 + Math.max(
        ...children.map(c => getNumberOfRemainingPages(c, [...explored, field.id]))
      )
    )
  }, [activeField, fields])
 
  useEffect(() => {
    if (!ga4measurementId) return 

    if (!gaEventRef.current['initialize']) {
      ReactGA.initialize(ga4measurementId)
      gaEventRef.current['initialize'] = true
    }

    if (gaEventRef.current[activeField.value.id]) return
    gaEventRef.current[activeField.value.id] = true

    ReactGA.event({
      category: `form_${activeField.value.formId}`,
      action: "Form Progress",
      label: activeField.value.title,
      transport: "beacon", 
      value: 1,
    });
  }, [ga4measurementId, activeField])

  // placeholders for initial fields, reset when fields prop changes, since questions are now different (e.g. different form selected) 
  const fieldInitRef = useRef('')
  const initializeFields = useCallback(() => (
    fields.map(f => ({
      fieldId: f.id,
      fieldTitle: f.title,
      fieldDescription: f.description,
      fieldHtmlDescription: f.htmlDescription,
      externalId: f.externalId,
      touched: false, 
      includeInSubmit: false,
      sharedWithEnduser: f.sharedWithEnduser,
      answer: { 
        type: f.type,
        value: (
          existing_response_if_compatible(existingResponses, f) ?? (
            (f.type === 'Address' || f.type === 'file' || f.type === 'signature' || f.type === 'multiple_choice' || f.type === 'Dropdown' || f.type === 'Table Input' || f.type === 'Database Select' || f.type === 'Medications')
              ? undefined  
                : f.type === 'Question Group'
                  ? f.options?.subFields
                  : f.type === 'ranking'
                    ? f.options?.choices
                    : f.type === 'Time'
                      ? `${`${hoursAmPm < 10 ? '0' : ''}${hoursAmPm}`}:${minutes} ${amPm.toUpperCase()} ${getLocalTimezone()}`
                      : '' as any // null flag that the response was not filled out
          )
        ),
      },
      field: f,
    }))
  ), [fields, existingResponses])
  const [responses, setResponses] = useState<(Response)[]>(initializeFields())
  useEffect(() => {
    // Be very careful about refreshing data to avoid losing progress -- only in the case the selected form has changed
    if (fieldInitRef.current === formId) return
    fieldInitRef.current = formId

    setResponses(initializeFields())
  }, [formId, initializeFields])

  // placeholders for initial files, reset when fields prop changes, since questions are now different (e.g. different form selected) 
  const fileInitRef = useRef('')
  const initializeFiles = useCallback(() => (
    fields.map(f => ({
      fieldId: f.id,
      fieldTitle: f.title,
      externalId: f.externalId,
      blob: undefined,
    }))
  ), [fields])
  const [selectedFiles, setSelectedFiles] = useState<FileResponse[]>(initializeFiles())
  useEffect(() => {
    // Be very careful about refreshing data to avoid losing progress -- only in the case the selected form has changed
    if (fileInitRef.current === formId) return
    fileInitRef.current = formId

    setSelectedFiles(initializeFiles())
  }, [formId, initializeFiles])

  const currentValue =  (
    responses.find(f => f.fieldId === activeField.value.id)
  )
  const currentFileValue = (
    selectedFiles.find(f => f.fieldId === activeField.value.id)
  )

  const updateInclusion = useCallback((includeInSubmit: boolean) => {
    setResponses(rs => {
      const current = rs.find(r => r.fieldId === currentValue?.fieldId)
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
    if (currentValue?.includeInSubmit) return
    updateInclusion(true)
  }, [updateInclusion, currentValue])

  const validateBasicField = useCallback((field: FormField) => {
    const value = responses.find(r => r.fieldId === field.id)
    const file = selectedFiles.find(r => r.fieldId === field.id)
    if (!value) return "Value not provided"
    if (!file) return "File not provided"

    // even when optional, name is required when signed is checked
    if (value.answer.type === 'signature' && value.answer.value?.signed && !value.answer.value.fullName) {
      return "Please enter your full name"
    }

    // event when optional, phone should be valid phone number if partially entered
    if (value.answer.type === 'phone') {
      if (field.isOptional && !value.answer.value) return null

      try {
        phoneValidator.validate()(value.answer.value)
      } catch(err: any) {
        return err?.message ?? "Enter a valid phone number"
      }
    }

    if (field.type === 'description') return null

    if (field.type === 'string' || field.type === 'stringLong' || field.type === 'number') {
      if (field.options?.maxLength && field.options.maxLength !== -1) {
        if ((value.answer.value ?? '').toString().length > field.options.maxLength) {
          return `Answer must be no more than ${field.options.maxLength} characters`
        }
      }
      if (field.options?.minLength && field.options.minLength !== -1) {
        if ((value.answer.value ?? '').toString().length < field.options.minLength) {
          return `Answer must be at least ${field.options.minLength} characters`
        }
      }

      if (field.options?.repeat && (!field.isOptional || value.answer.value || repeats[field.id])) {
        if (value.answer.value !== repeats[field.id]) {
          return `Answers must match`
        }
      }
    }

    if (field.isOptional) {
      return null 
    }

    if (value.answer.type === 'Medications') {
      if (!value.answer?.value?.length) {
        return "At least one medication is required"
      }
      for (const m of value.answer.value ?? []) {
        if (!(m.drugName || m.otherDrug)) {
          return "A drug selection is required for each medication"
        }
      }
    }
    // remaining are required, non-empty

    if (field.type === 'file' || field.type === 'files') {
      if (!file.blobs?.length) {
        return "A file is required"
      }
      return null // no need to check against other stuff
    }
    // remaining can refer to currentValue, not currentFileValue

    // don't treat 0 as missing
    if (
         (value.answer.type === 'number' || value.answer.type === 'rating')
      && typeof value.answer.value === 'number' && !isNaN(value.answer.value)
    ) {
      return 
    }

    if (!value.answer.value) {
      return "A response is required"
    }
    // remaining values exist and need to be validated by type

    if (value.answer.type === 'Address') {
      if (!value.answer.value.addressLineOne) {
        return "Address Line 1 is required"
      }
      if (!value.answer.value.city) {
        return "City is required"
      }
      if (!value.answer.value.state) {
        return "State is required"
      }
      if (!value.answer.value.zipCode) {
        return "ZIP code is required"
      }
      if (!isZIPString(value.answer.value?.zipCode)) {
        return "Enter a valid ZIP code"
      }
    }

    // string type is validated by being non-empty, file is already validated
    if (value.answer.type === 'email') {
      if (!isEmail(value.answer.value)) {
        return "Enter a valid email"
      }
    } 
    else if (value.answer.type === 'Table Input') {
      let rowNumber = 0
      for (const row of value.answer.value || []) {
        rowNumber++
        for (const cell of row) {
          if (!cell.entry) {
            return `Enter a value for ${cell.label} in row ${rowNumber}`
          }
        }
      } 
    } else if (value.answer.type === 'dateString') {
      if (!isDateString(value.answer.value)) {
        return "Enter a date in MM-DD-YYYY format"
      }
    } else if (value.answer.type === 'multiple_choice' || value.answer.type === 'Dropdown') {
      if (value.answer.value.length === 0) {
        return `A value must be ${value.answer.type === 'multiple_choice' ? 'checked' : 'selected'}`
      }
    } else if (value.answer.type === 'number') {
      if (typeof value.answer.value !== 'number') {
        return "Please enter a number"
      }
    } else if (value.answer.type === 'rating') {
      if ((field?.options?.from && value.answer.value < field.options.from)
          || field?.options?.to && value.answer.value > field.options.to
        ) {
          return `Please enter a number between ${field?.options?.from} and ${field?.options?.to}`
        }
    } else if (value.answer.type === 'signature') {
      if (!value.answer.value.fullName) {
        return "Please enter your full name"
      }
      if (!value.answer.value.signed) {
        return "Please accept the terms of this signature"
      }
    } 

    return null
  }, [responses, selectedFiles, currentValue, activeField, repeats])

  // nested Question Group fields are disabled, so it's safe to avoid recursion multiple times
  const validateField = useCallback((field: FormField) => {
    const value = responses.find(r => r.fieldId === field.id)
    if (!value) return "Value is missing"

    if (value.answer.type === 'Question Group') {
      for (const f of field.options?.subFields ?? []) {
        const match = fields.find(_f => _f.id === f.id)
        if (!match) continue

        const message = validateBasicField(match)
        if (message) return message
      }
    }

    const message = validateBasicField(field)
    if (message) return message

    if (value.answer.type === 'Table Input') {
      for (const row of value.answer.value ?? []) {
        for (const cell of row) {
          const type = field.options?.tableChoices?.find(t => t.label === cell.label)?.type
          if (type === 'Date' && !isDateString(cell.entry)) { 
            return `Enter a date in MM-DD-YYYY format for ${cell.label} in row ${(value.answer.value?.indexOf(row) ?? 0) + 1}`
          }
        }
      }
    }
  }, [responses, fields, validateBasicField])

  const validateCurrentField = () => validateField(activeField.value)

  const validateResponsesForFields = useCallback((_fields = fields) => {
    for (const f of _fields) {
      const errorMessage = validateField(f)
      if (errorMessage) return errorMessage
    }
  }, [validateField, fields, responses])

  const showSubmit = activeField.children.length === 0

  const getResponsesWithQuestionGroupAnswers = useCallback((responsesToSubmit: Response[]) => {
    // ensure Question Group responses are included

    for (const r of responsesToSubmit) {
      if (r.answer.type !== 'Question Group') continue

      for (const f of r.answer.value ?? []) {
        const match = responses.find(r => r.fieldId === f?.id)
        if (!match || responsesToSubmit.find(r => r.fieldId === match.fieldId)) continue

        responsesToSubmit.push(match)
      }
    }

    return responsesToSubmit
  }, [responses])

  const submit = useCallback(async (options?: { onSuccess?: (r: FormResponse) => void, includedFieldIds?: string[] }) => {
    setSubmitErrorMessage('')
    const hasFile = selectedFiles.find(f => !!f.blobs?.length) !== undefined

    setSubmittingStatus(hasFile ? 'submitting' : 'uploading-files')

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

        setSubmittingStatus("submitting")
      } catch(err: any) {
        setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
      } finally {
        setSubmittingStatus(undefined)
      }
    }

    if (!accessCode && session.type === 'enduser') throw new Error('enduser session without accessCode')
    try {
      const responsesToSubmit = (
        options?.includedFieldIds 
          ? options.includedFieldIds.map(id => responses.find(r => r.fieldId === id)!)
          : responses.filter(r => r.includeInSubmit)
      )

      // ensure Question Group responses are included
      // see getResponsesWithQuestionGroupAnswers
      for (const r of responsesToSubmit) {
        if (r.answer.type !== 'Question Group') continue

        for (const f of r.answer.value ?? []) {
          const match = responses.find(r => r.fieldId === f?.id)
          if (!match || responsesToSubmit.find(r => r.fieldId === match.fieldId)) continue

          responsesToSubmit.push(match)
        }
      }

      const { formResponse } = await session.api.form_responses.submit_form_response({ 
        accessCode : (
          accessCode 
          || (await (
            session as any as Session).api.form_responses.prepare_form_response({ 
              formId, enduserId, isInternalNote, title: formTitle,
              parentResponseId, rootResponseId,
            })
          ).accessCode
        ),
        responses: [
          ...responsesToSubmit,
           // include existing responses in case previously saved as draft
          ...(existingResponses ?? []).filter(r => !responsesToSubmit.find(_r => r.fieldId === _r.fieldId)),
        ],
        automationStepId,
        customerId,
        productIds: responsesToSubmit.flatMap(r => r.field?.options?.productIds ?? []),
      })

      if (ga4measurementId) {
        ReactGA.event({
          category: `form_${formResponse.formId}`,
          action: "Form Submitted",
          label: "Form Submitted",
          transport: "beacon", 
          value: 2,
        });
      }
      
      updateLocalFormResponse(formResponse.id, formResponse)
      options?.onSuccess?.(formResponse)

      if (submitRedirectURL) {
        (window?.top ?? window).location.href = submitRedirectURL;
      }
    } catch(err: any) {
      setSubmitErrorMessage(err?.message ?? 'Failed to upload file')
    } finally {
      setSubmittingStatus(undefined)
    }
  }, [accessCode, automationStepId, enduserId, responses, selectedFiles, session, handleUpload, existingResponses, ga4measurementId, rootResponseId, parentResponseId])

  const isNextDisabled = useCallback(() => {
    if (activeField.children.length === 0) {
      return true
    }

    if (validateField(activeField.value)) {
      return true
    }

    return false
  }, [activeField, validateField])

  const goToNextField = useCallback(() => {
    if (isNextDisabled()) return
    if (!currentValue) return

    if (accessCode && currentValue?.answer?.type !== 'file' && currentValue?.answer?.type !== 'files') {
      session.api.form_responses.save_field_response({
        accessCode,
        response: currentValue,
      })
      .catch(console.error)
    }

    setActiveField(activeField => {
      let newField = getNextField(activeField, currentValue)

      if (newField !== undefined) {
        prevFieldStackRef.current.push(activeField)
        setCurrentPageIndex(i => i + 1)
      }
      
      return newField || activeField
    })
  }, [prevFieldStackRef, currentValue, isNextDisabled, updateFormResponse, session])

  const isPreviousDisabled = useCallback(() => (
    prevFieldStackRef.current.length === 0
  ), [prevFieldStackRef])

  const goToPreviousField = useCallback(() => {
    if (isPreviousDisabled()) return

    updateInclusion(false)

    const previous = prevFieldStackRef.current.pop()
    if (previous) { 
      setActiveField(previous)
      setCurrentPageIndex(i => i - 1)
    }
  }, [isPreviousDisabled, updateInclusion, prevFieldStackRef])

  const onFieldChange: ChangeHandler<any> = useCallback((value: FormResponseValueAnswer['value'], fieldId: string, touched=true) => {
    setResponses(rs => rs.map(r => r.fieldId !== fieldId ? r : ({
      ...r,
      touched,
      answer: {
        ...r.answer,
        value: value as any,
      },
    })))
  }, [fields])

  const onAddFile = useCallback((blobs?: FileBlob | FileBlob[], fieldId=activeField.value.id) => {
    setSelectedFiles(fs => fs.map(f => f.fieldId !== fieldId ? f : ({
      ...f,
      blobs: (
        blobs === undefined 
          ? undefined 
          : Array.isArray(blobs) 
            ? blobs
            : [blobs]
      ),
    })))
  }, [activeField, fields])

  return {
    enduserId,
    formResponseId,
    activeField,
    currentValue,
    currentFileValue,
    getResponsesWithQuestionGroupAnswers,
    fields,
    responses,
    selectedFiles,
    onFieldChange,
    onAddFile,
    isNextDisabled,
    isPreviousDisabled,
    goToPreviousField,
    goToNextField,
    submit,
    showSubmit,
    // submitDisabled,
    submitErrorMessage,
    submittingStatus,
    validateField,
    validateResponsesForFields,
    validateCurrentField,
    existingResponses,
    repeats,
    setRepeats,
    currentPageIndex,
    getNumberOfRemainingPages,
    setCustomerId,
    customization,
  }
}
