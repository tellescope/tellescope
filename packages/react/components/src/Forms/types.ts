import { AnswerForType } from "@tellescope/types-models";
import { DatabaseRecord, Enduser, Form, FormField } from "@tellescope/types-client";
import { FileBlob, TreeNode } from "@tellescope/types-utilities";
import { JSXElementConstructor } from "react";
import { Response } from "./hooks";

export type FormFieldNode = TreeNode<FormField>

export type ChangeHandler <K extends keyof AnswerForType> = (v: AnswerForType[K], fieldId: string, setTouched?: boolean) => void

export interface FormInputProps<K extends keyof AnswerForType> {
  form?: Form,
  field: FormField,
  value: K extends 'file' ? FileBlob : AnswerForType[K],
  onChange: ChangeHandler<K>,
  autoFocus?: boolean,
  size?: 'small',
  label?: string,
  fullWidth?: boolean,
  onDatabaseSelect?: (r: DatabaseRecord[]) => void,
  responses?: Response[]
  title?: string,
  enduserId?: string,
  enduser?: Partial<Enduser>
  goToPreviousField?: () => void, 
  isPreviousDisabled?: () => boolean,
  formResponseId?: string,
  submit?: () => Promise<void>,
}

export type FormInputs = { 
  [K in keyof AnswerForType] : JSXElementConstructor<FormInputProps<K>>
}