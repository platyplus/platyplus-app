#!/usr/bin/env node
import microservice from '@platyplus/microservice'
import serveStatic from 'koa-static'

import history from 'koa-history-api-fallback'

const { router, app } = microservice()

router.get('/config', async (ctx, next) => {
  ctx.body = {
    API:
      (process.env.GRAPHQL_ENGINE_PUBLIC_URL || ctx.request.origin) +
      '/v1/graphql'
  }
  await next()
})

app.use(
  serveStatic(process.env.PLATYPLUS_DIST || 'frontend/platyplus/dist/pwa')
)

app.use(history({ index: '/' }))
