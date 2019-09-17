import { print } from 'graphql/language/printer'
import { IResolvers } from 'apollo-server-koa'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { graphql } from '@platyplus/hasura-node-client'

import { ALGORITHM, PUBLIC_KEY, PRIVATE_KEY } from './config'
import { ME, SIGNUP, LOGIN } from './queries'
import { User, Token, LoginPayload } from './types'

export const resolvers: IResolvers = {
  Query: {
    me: async (_, args, req) => {
      const Authorization = req.headers.authorization
      if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const verifiedToken = jwt.verify(token, PUBLIC_KEY, {
          algorithms: [ALGORITHM]
        }) as Token
        const user = await graphql
          .request(print(ME), { id: verifiedToken.userId })
          .then(data => data.user[0])
        return { ...user }
      } else {
        throw new Error('Not logged in.')
      }
    }
  },
  Mutation: {
    // TODO: secure the endpoint!!!
    signup: async (_, { username, password }: LoginPayload) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await graphql
        .request(print(SIGNUP), { username, password: hashedPassword })
        .then(data => data.insert_user.returning[0])

      const token = jwt.sign(
        {
          id: user.id,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': user.id
          }
        },
        PRIVATE_KEY,
        { algorithm: ALGORITHM }
      )

      return { id: user.id, token }
    },
    // TODO: test if active user
    login: async (_, { username, password }) => {
      console.log('ICI')
      const user: User = await graphql
        .request(print(LOGIN), { username })
        .then(data => data.user[0])
      console.log('LA')

      if (!user) throw new Error('No such user found.')

      const valid = await bcrypt.compare(password, user.password)
      if (valid) {
        const roles = user.roles.map(node => node.role.name)
        // * See: https://docs.hasura.io/1.0/graphql/manual/auth/authorization/roles-variables.html
        const postgresRoles = '{' + roles.map(role => `${role}`).join(',') + '}'
        const token = jwt.sign(
          {
            id: user.id,
            'https://hasura.io/jwt/claims': {
              'x-hasura-allowed-roles': roles, //! Required by Hasura but doesn't work for permissions
              // TODO: return highest role level
              'x-hasura-default-role': roles[0], //! Required by Hasura
              'x-hasura-user-id': user.id,
              'x-hasura-roles': postgresRoles
            }
          },
          PRIVATE_KEY,
          { algorithm: ALGORITHM }
        )
        return { id: user.id, token }
      } else {
        throw new Error('Invalid password.')
      }
    }
  }
}
