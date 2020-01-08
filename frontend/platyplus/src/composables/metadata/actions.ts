import { useTranslator } from '../i18n'
import { tableProps } from './props'
import { ExtractPropTypes } from '@vue/composition-api/dist/component/componentProps'
import { label } from '../../modules/metadata'
import { useMetadata } from './table'
import { useQuasar } from '../../modules/quasar'
import { Ref } from '@vue/composition-api'
import { useRouter } from '../../router'
import { useCanDelete } from './permissions'
import { DataObject } from '../../modules/metadata/types/queries'

// ? Move to a 'navigation' submodule ?
export const useDeleteElement = (
  { table, schema }: ExtractPropTypes<typeof tableProps>,
  element: Ref<DataObject>
) => {
  const translate = useTranslator()
  const quasar = useQuasar()
  const metadata = useMetadata({ table, schema })
  const router = useRouter()
  const canDelete = useCanDelete(element)

  return () => {
    const message = translate('delete.label', {
      tableLabel: translate(`${table}.label`),
      label: label(metadata.value, element.value)
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
        if (canDelete.value) {
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
}
