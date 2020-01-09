import { useTranslator } from '../i18n'
import { useQuasar } from '../../modules/quasar'
import { Ref, computed, ref } from '@vue/composition-api'
import { useRouter } from '../../router'
import { useCanDelete, useCanEdit } from './permissions'
import { DataObject } from '../../modules/metadata/types/queries'
import { elementLabel, elementMetadata, elementLink } from './element'
import { RefOr } from '../common'

type ActionComposable<T> = (
  data: RefOr<T>
) => {
  action: () => void
  permission: Readonly<Ref<boolean>>
  label?: Readonly<Ref<string>>
}

// ? Move to a 'navigation' composable submodule ?
export const useDeleteElement: ActionComposable<DataObject> = element => {
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
          router.replace(`/data/${table}`)
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

export const useEditElement: ActionComposable<DataObject> = element => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = useCanEdit(element)
  const label = computed(() => translate('edit'))
  const action = () => router.replace(elementLink(element, 'edit'))
  return { permission, label, action }
}

export const useReadElement: ActionComposable<DataObject> = element => {
  const translate = useTranslator()
  const router = useRouter()
  const permission = ref(true)
  const label = computed(() => translate('read'))
  const action = () => router.push(elementLink(element, 'read'))
  return { permission, label, action }
}
