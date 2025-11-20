import { AnswerForType, FormResponseValue } from "@tellescope/types-models";
import { DatabaseRecord, Enduser, Form, FormField } from "@tellescope/types-client";
import { FileBlob, TreeNode } from "@tellescope/types-utilities";
import { JSXElementConstructor } from "react";
import { SxProps } from "@mui/material";
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
  onDatabaseSelect?: (r: Pick<DatabaseRecord, "values" | "databaseId">[]) => void,
  responses?: Response[]
  title?: string,
  enduserId?: string,
  enduser?: Partial<Enduser>
  error?: boolean,
  goToPreviousField?: () => void,
  goToNextField?: (response?: FormResponseValue['answer']) => void,
  isPreviousDisabled?: () => boolean,
  formResponseId?: string,
  rootResponseId?: string,
  submit?: () => Promise<void>,
  groupId?: string,
  groupInsance?: string,
  disabled?: boolean,
  isSinglePage?: boolean,
  handleFileUpload?: (blob: FileBlob, fieldId: string) => Promise<any>,
  uploadingFiles?: { fieldId: string }[]
  setUploadingFiles?: React.Dispatch<React.SetStateAction<{ fieldId: string }[]>>,
  groupFields?: FormField[],
  inputProps?: { sx: SxProps },
}

export type FormInputs = { 
  [K in keyof AnswerForType] : JSXElementConstructor<FormInputProps<K>>
}