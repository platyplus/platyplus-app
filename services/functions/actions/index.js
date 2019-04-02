const encounter = require('./encounter'),
  { ALL } = require('./helpers')

const undefinedTableAction = async ctx => {
  console.log('TODO: undefined table action')
}

// TODO: Avoid infinite loop => STRICT RULE NOT TO UPDATE THE RECORD OF THE EVENT (or find a workaround)
module.exports = {
  encounter,
  defaultAction: ALL(undefinedTableAction)
}
