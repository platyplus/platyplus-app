# Store

The application state is co-managed by Vuex and by the Apollo cache, although they each serve a distinct purpose.

## Vuex

Vuex stores the overall application state such as the user id and token, the navigation, the state of shared components such as the current page title, the drawer side-menu...

Vuex also orchestrates the dissemination of actions in the way of an event bus. For instance, once logged in, a Vuex action is emitted so all the underlying tasks can be triggered, synchonously or asynchronously.

Vuex also facilitates the access to Apollo cache queries through getters, that are (in my opinion) clearer and less verbose than in defining the Apollo local state system, that requires some additionnal coding (graphql mutations, custom resolvers).

### Navigation module

### User module

### Hasura module

::: warning
Vuex should not be used to store data from the backend. This is the job of the Apollo cache which remains the single source of truth.
:::

### Persistence

## Apollo cache

### Persistence
