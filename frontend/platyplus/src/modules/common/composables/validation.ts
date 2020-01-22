import { SetupContext } from '@vue/composition-api'
import { GenericObject } from '../types'

interface FullSetupContext extends SetupContext {
  refs: Record<string, never>
}

interface VeeObserver {
  validate: () => boolean
  setErrors: (errors: GenericObject) => void
}

export interface VeeValidator {
  invalid: boolean
  touched: boolean
  validated: boolean
  errors?: string[]
}

export const error = ({ invalid, touched, validated }: VeeValidator) =>
  (touched || validated) && invalid

export const errorMessage = ({ errors }: VeeValidator) => {
  if (!!errors && errors.length) {
    return errors[0]
  }
}

// TODO yurky workaround. monitor Vue3 specs
export const getObserver = (context: SetupContext, refName = 'validator') =>
  (context as FullSetupContext).refs[refName] as VeeObserver
