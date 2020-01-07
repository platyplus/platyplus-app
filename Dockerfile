# * Not using Alpine as it does not support glibc, that is required by pg-query-parser. Not using node-slim either as pg-query-parser requires node-gyp to be built, therefore python etc
FROM node:12
WORKDIR /app
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

ARG GRAPHQL_ENGINE_URL=http://graphql-engine:8080
ENV GRAPHQL_ENGINE_URL $GRAPHQL_ENGINE_URL

RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
# * Not needed: documentation, grapqhl-engine, platyplus-service
COPY frontend/platyplus/package.json frontend/platyplus/yarn.lock /app/frontend/platyplus/
COPY backend/authentication-service/package.json backend/authentication-service/yarn.lock backend/authentication-service/tsconfig.build.json /app/backend/authentication-service/
COPY backend/functions-service/package.json backend/functions-service/yarn.lock backend/functions-service/tsconfig.build.json /app/backend/functions-service/
COPY backend/metadata-service/package.json backend/metadata-service/yarn.lock backend/metadata-service/tsconfig.build.json /app/backend/metadata-service/
COPY packages/microservice/package.json packages/microservice/yarn.lock packages/microservice/tsconfig.build.json /app/packages/microservice/
COPY packages/errors/package.json packages/errors/yarn.lock packages/errors/tsconfig.build.json /app/packages/errors/
COPY packages/hasura-apollo-client/package.json packages/hasura-apollo-client/yarn.lock packages/hasura-apollo-client/tsconfig.build.json /app/packages/hasura-apollo-client/
COPY packages/hasura-node-client/package.json packages/hasura-node-client/yarn.lock packages/hasura-node-client/tsconfig.build.json /app/packages/hasura-node-client/
COPY packages/vuex-apollo-offline/package.json packages/vuex-apollo-offline/yarn.lock packages/vuex-apollo-offline/tsconfig.build.json /app/packages/vuex-apollo-offline/

# Install dependencies without build
RUN lerna bootstrap --ignore-scripts

# ! Required by node-pg-query-native
RUN yarn global add node-gyp && cd node_modules/pg-query-native && node-gyp rebuild

# Copy source
COPY frontend/platyplus /app/frontend/platyplus
COPY backend/authentication-service /app/backend/authentication-service
COPY backend/functions-service /app/backend/functions-service
COPY backend/metadata-service /app/backend/metadata-service
COPY packages/microservice /app/packages/microservice
COPY packages/errors /app/packages/errors
COPY packages/hasura-apollo-client /app/packages/hasura-apollo-client
COPY packages/hasura-node-client /app/packages/hasura-node-client
COPY packages/vuex-apollo-offline /app/packages/vuex-apollo-offline

