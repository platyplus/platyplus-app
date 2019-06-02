const encounter = require('./encounter'),
  { ALL } = require('./helpers')

const undefinedTableAction = async ctx => {
  console.log('TODO: undefined table action')
}

module.exports = {
  encounter,
  defaultAction: ALL(undefinedTableAction)
}
