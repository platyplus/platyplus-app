#!/usr/bin/env node
import microserver from '@platyplus/microserver'
import serveStatic from 'koa-static'

import history from 'koa-history-api-fallback'

const { router, app } = microserver()

router.get('/config', async (ctx, next) => {
  ctx.body = {
    API: process.env.API || ctx.request.header.host + '/v1/graphql'
  }
  await next()
})

app.use(serveStatic(process.env.PLATYPLUS_DIST || '../platyplus/dist/pwa'))

app.use(history())
