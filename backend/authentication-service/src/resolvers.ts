import { print } from 'graphql/language/printer'
import { IResolvers } from 'apollo-server-koa'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { graphql } from '@platyplus/hasura-node-client'

import { ALGORITHM, PUBLIC_KEY, PRIVATE_KEY, EXPIRES_IN } from './config'
import { ME, SIGNUP, LOGIN } from './queries'
import { User, Token, LoginPayload } from './types'
const createToken = (
  id: string,
  defaultRole: string,
  roles: string[] = [defaultRole]
) =>
  jwt.sign(
    {
      id: id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': defaultRole,
        'x-hasura-user-id': id,
        // * See: https://docs.hasura.io/1.0/graphql/manual/auth/authorization/roles-variables.html
        'x-hasura-roles': '{' + roles.map(r => `${r}`).join(',') + '}' // * roles expressed as a postgres array
      }
    },
    PRIVATE_KEY,
    { algorithm: ALGORITHM, expiresIn: EXPIRES_IN }
  )

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
      return { id: user.id, token: createToken(user.id, 'user') }
    },
    // TODO: test if active user
    login: async (_, { username, password }) => {
      const user: User = await graphql
        .request(print(LOGIN), { username })
        .then(data => data.user[0])
      if (!user) throw new Error('No such user found.')
      if (await bcrypt.compare(password, user.password)) {
        const roles = user.roles.map(node => node.role.name)
        return { id: user.id, token: createToken(user.id, roles[0], roles) }
      } else {
        throw new Error('Invalid password.')
      }
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    refresh_token: async (_parent, _args, ctx) => {
      console.log(ctx)
    }
  }
}
