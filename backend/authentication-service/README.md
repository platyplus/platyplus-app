# @platyplus/authentication-service

Simple auhentication service. Accesses to the schema through GraphQL.
Further documentation will follow.

## Queries

```
me { email } // Used for login check
```

## Mutations

```
login(email: String, password: String) { token }
signup(email: String, password: String) { token }
```
