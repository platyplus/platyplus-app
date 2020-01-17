import { ActionTree } from 'vuex'
import { QuasarState } from './state'
import Quasar from 'quasar'

export const actions: ActionTree<QuasarState, {}> = {
  setLocale: {
    root: true,
    handler: (_, locale) => {
      // dynamic import, so loading on demand only
      import(`quasar/lang/${locale}`).then(({ default: messages }) =>
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Quasar as any).lang.set(messages)
      )
    }
  }
}
