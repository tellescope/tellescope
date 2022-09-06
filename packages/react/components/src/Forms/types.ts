import { AnswerForType } from "@tellescope/types-models";
import { FormField } from "@tellescope/types-client";
import { FileBlob, TreeNode } from "@tellescope/types-utilities";
import { JSXElementConstructor } from "react";

export type FormFieldNode = TreeNode<FormField>

export type ChangeHandler <K extends keyof AnswerForType> = (v: AnswerForType[K], setTouched?: boolean) => void

export interface FormInputProps<K extends keyof AnswerForType> {
  field: FormField,
  value: K extends 'file' ? FileBlob : AnswerForType[K],
  onChange: ChangeHandler<K>,
}

export type FormInputs = { 
  [K in keyof AnswerForType] : JSXElementConstructor<FormInputProps<K>>
}