// leave the export, even if you don't use it
export default async ({ app, router, Vue, store }) => {
  await store.dispatch('authentication/loadProfile')
  // eslint-disable-next-line no-new
  new Vue(app)
}
