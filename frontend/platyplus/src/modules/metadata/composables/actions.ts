import { Ref, computed, ref } from '@vue/composition-api'

import { useRouter, ObjectMap } from '../../common'
import { useQuasar } from '../../quasar'
import { useTranslator } from '../../i18n'
// TODO get rid of the quasar dependecy
// ? and of the i18n dependency?
import { DataObject, Table } from '../types'

import { useCanDelete, useCanEdit, useCanSave } from './permissions'
import { elementLabel, elementMetadata, elementLink } from './element'
import { resetForm, useIsNew } from './form'

type ActionResult = {
  action: () => void
  permission: Readonly<Ref<boolean>>
  label?: Readonly<Ref<string>>
}

// ? Move to a 'navigation' composable submodule ?
export const useDeleteElement = (element: Ref<DataObject>): ActionResult => {
  const translate = useTranslator()
  const quasar = useQuasar()
  const router = useRouter()
  const permission = useCanDelete(element)
  const label = computed(() => translate('remove'))
  const action = () => {
    const table = elementMetadata(element)
    const message = translate('delete.label', {
      tableLabel: translate(`${table?.name}.label`),
      label: elementLabel(element.value)
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
          console.warn('TODO recode')
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

export const useEditElement = (element: Ref<DataObject>): ActionResult => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = useCanEdit(element)
  const label = computed(() => translate('edit'))
  const action = () => router.replace(elementLink(element, 'edit').value)
  return { permission, label, action }
}

export const useReadElement = (element: Ref<DataObject>): ActionResult => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = ref(true)
  const label = computed(() => translate('read'))
  const action = () => router.push(elementLink(element, 'read').value)
  return { permission, label, action }
}

export const useResetForm = (
  metadata: Ref<Table>,
  element: Ref<DataObject>,
  form: ObjectMap
): ActionResult => {
  const translate = useTranslator()
  const permission = ref(true) // ? Not really relevant here
  // if (isRef(element))
  //   watch(element, () => {
  //     resetForm(metadata, element, form)
  //   })
  const label = computed(() => translate('reset'))
  const action = () => resetForm(metadata, element, form)
  return { permission, label, action }
}

export const useCancelEditElement = (
  metadata: Ref<Table>,
  element: Ref<DataObject>,
  form: ObjectMap
): ActionResult => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = ref(true)
  const label = computed(() => translate('cancel'))
  const { action: reset } = useResetForm(metadata, element, form)
  const isNew = useIsNew(element)
  const action = () => {
    reset()
    // TODO get rid of isNew, use useIsNew instead
    if (isNew.value) router.go(-1)
    else router.push(elementLink(element, 'read').value)
  }
  return { permission, label, action }
}

export const useSaveElement = (
  metadata: Ref<Table>,
  element: Ref<DataObject>,
  form: ObjectMap
): ActionResult => {
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
