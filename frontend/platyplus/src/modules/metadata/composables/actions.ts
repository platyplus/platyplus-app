import { Ref, computed, ref, watch, isRef } from '@vue/composition-api'

import { RefOr, unwrap, useRouter, ObjectMap } from '../../common'
import { useQuasar } from '../../quasar'
import { useTranslator } from '../../i18n'

import { DataObject, Table } from '../types'
import { isNew } from '../helpers'

import { useCanDelete, useCanEdit, useCanSave } from './permissions'
import { elementLabel, elementMetadata, elementLink } from './element'
import { resetForm } from './form'

type ActionComposable = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...data: RefOr<any>[]
) => {
  action: () => void
  permission: Readonly<Ref<boolean>>
  label?: Readonly<Ref<string>>
}

// ? Move to a 'navigation' composable submodule ?
export const useDeleteElement: ActionComposable = (
  element: Ref<DataObject>
) => {
  const translate = useTranslator()
  const quasar = useQuasar()
  const router = useRouter()
  const permission = useCanDelete(element)
  const label = computed(() => translate('remove'))
  const action = () => {
    const table = elementMetadata(element)
    const message = translate('delete.label', {
      tableLabel: translate(`${table?.name}.label`),
      label: elementLabel(element)
    })
    quasar
      .dialog({
        title: translate('delete.title'),
        message,
        cancel: true,
        persistent: true
      })
      .onOk(async () => {
        // TODO recode
        if (permission.value) {
          console.log('TODO recode')
          router.replace(`/data/${table?.name}`) // ? or go back to the previous page?
        }
        //   if (this.$can('delete', element)) {
        // const mutation = deleteMutation(this.tableClass, this.$ability)
        // // TODO catch errors
        // await this.$apollo.mutate({
        //   mutation,
        //   variables: this.id
        // })
        // // TODO remove in the cached list
        //   }
      })
  }

  return { permission, label, action }
}

export const useEditElement: ActionComposable = (
  element: RefOr<DataObject>
) => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = useCanEdit(element)
  const label = computed(() => translate('edit'))
  const action = () => router.replace(elementLink(element, 'edit').value)
  return { permission, label, action }
}

export const useReadElement: ActionComposable = (
  element: RefOr<DataObject>
) => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = ref(true)
  const label = computed(() => translate('read'))
  const action = () => router.push(elementLink(element, 'read').value)
  return { permission, label, action }
}

export const useResetForm: ActionComposable = (
  metadata: RefOr<Table>,
  element: RefOr<DataObject>,
  form: RefOr<ObjectMap>
) => {
  const translate = useTranslator()
  const permission = ref(true) // ? Not really relevant here
  if (isRef(element))
    watch(element, () => {
      resetForm(metadata, element, form)
    })
  const label = computed(() => translate('reset'))
  const action = () => resetForm(metadata, element, form as DataObject)
  return { permission, label, action }
}

export const useCancelEditElement: ActionComposable = (
  metadata: RefOr<Table>,
  element: RefOr<DataObject>,
  form: RefOr<ObjectMap>
) => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = ref(true)
  const label = computed(() => translate('cancel'))
  const { action: reset } = useResetForm(metadata, element, form)
  const action = () => {
    reset()
    if (isNew(unwrap(element))) router.go(-1)
    else router.push(elementLink(element, 'read').value)
  }
  return { permission, label, action }
}

export const useSaveElement: ActionComposable = (
  metadata: RefOr<Table>,
  element: RefOr<DataObject>,
  form: RefOr<ObjectMap>
) => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = useCanSave(element)
  const label = computed(() => translate('save'))
  const { action: reset } = useResetForm(metadata, element, form)
  const action = () => {
    // TODO save
    reset()
    router.push(elementLink(element, 'read').value)
  }
  return { permission, label, action }
}
