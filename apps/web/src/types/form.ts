import { ReactFormExtendedApi } from '@tanstack/react-form'

/**
 * Generic type for TanStack Form instances with validators.
 * Use this type when passing form instances as props to components.
 *
 * @example
 * ```tsx
 * interface MyComponentProps {
 *   form: FormInstance<MyFormValues>
 * }
 * ```
 */
export type FormInstance<TFormData> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export interface SideBarFormProps {
  form: any
}

export interface BasicInfoFormProps {
  form: any
}
