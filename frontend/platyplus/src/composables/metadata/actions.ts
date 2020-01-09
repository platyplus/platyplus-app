import { useTranslator } from '../i18n'
import { tableProps } from './props'
import { useQuasar } from '../../modules/quasar'
import { Ref, computed } from '@vue/composition-api'
import { useRouter } from '../../router'
import { useCanDelete } from './permissions'
import { DataObject } from '../../modules/metadata/types/queries'
import { elementLabel, elementMetadata } from './element'

type ActionComposable<T, U> = (
  data: Ref<U>
) => {
  action: () => void
  permission: Readonly<Ref<boolean>>
  label?: Readonly<Ref<string>>
}

// ? Move to a 'navigation' composable submodule ?
export const useDeleteElement: ActionComposable<
  typeof tableProps,
  DataObject
> = element => {
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
  return { label, action, permission }
}
