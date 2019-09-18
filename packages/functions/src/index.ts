import microserver from '@platyplus/microserver'

import events from './events'

const { router } = microserver()

router.post('/events', async ctx => {
  const {
    table: { name },
    event: { op }
  } = ctx.request.body
  await (events[name] || events.defaultAction)[op](ctx)
  ctx.body = 'ok'
})

// ! Conversion of the package into Typescript is a mess!
