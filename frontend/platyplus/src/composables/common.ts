import { Ref, isRef } from '@vue/composition-api'

export function unwrap<T>(value: T | Ref<T>) {
  return isRef(value) ? value.value : value
}
export type RefOr<T> = T | Ref<T>
