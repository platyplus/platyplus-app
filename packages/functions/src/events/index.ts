import encounter from './encounter'
import { ALL } from './helpers'

const undefinedTableAction = async (ctx: any) => {
  console.log('TODO: undefined table action')
}

const events: {
  [key: string]: any
} = {
  encounter,
  defaultAction: ALL(undefinedTableAction)
}
export default events
