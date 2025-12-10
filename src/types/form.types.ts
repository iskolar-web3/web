export type FormFieldValue = string | number | boolean | Date | File | string[];

export interface FormFieldResponse {
  label: string;
  value: FormFieldValue;
}

