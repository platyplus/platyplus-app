import { GetterTree } from 'vuex'

import { ErrorsState } from './state'
import { get, del } from 'object-path'
import { GenericError } from '../classes'
import { i18n } from '..'

export const getters: GetterTree<ErrorsState, {}> = {
  error: state => !!Object.keys(state.data).length,
  path: state => (path: string) => get(state.data, `${path}._errors`), // ? remove?
  // TODO return 'global' errors as well
  fieldErrors: state => (path: string) => {
    const rawErrors = get(state.data, path)
    if (rawErrors) {
      del(rawErrors, '_errors')
      return Object.keys(rawErrors).reduce<Record<string, string[]>>(
        (prev, curr) => {
          const errors = get(rawErrors, `${curr}._errors`) as GenericError[]
          prev[curr] = errors.map(error =>
            i18n ? (i18n.t(error.i18nPath) as string) : error.message
          )
          return prev
        },
        {}
      )
    } else return {}
  }
}
