import { createTerminus, TerminusOptions } from '@godaddy/terminus'
import { Server } from 'http'
// Health check
const onSignal = async () => {
  console.info(
    'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
    new Date().toISOString()
  )
}
const onShutdown = async () => {
  console.info('cleanup finished, server is shutting down')
}
function healthCheck() {
  return Promise.resolve(200)
}
export const terminusOptions: TerminusOptions = {
  // healthcheck options
  healthChecks: {
    '/healthcheck': healthCheck // a promise returning function indicating service health
  },
  timeout: 1000, // [optional = 1000] number of milliseconds before forcefull exiting
  onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
  onShutdown // [optional] called right before exiting
}

export default (server: Server) => createTerminus(server, terminusOptions)
