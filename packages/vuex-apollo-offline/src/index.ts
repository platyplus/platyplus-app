import { persistCache } from 'apollo-cache-persist'
import { NormalizedCacheObject, InMemoryCache } from 'apollo-cache-inmemory'
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types'
import { ApolloCache } from 'apollo-cache'

export const persistApolloCache = async (
  cache: ApolloCache<NormalizedCacheObject>
) => {
  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await persistCache({
    cache: cache as InMemoryCache,
    storage: localStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >
  })
}
