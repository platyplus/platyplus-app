FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

RUN lerna link

# Packages
# Not needed: documentation, grapqhl-engine, platyplus-service
COPY packages/microservice/package.json packages/microservice/yarn.lock packages/microservice/tsconfig.build.json /app/packages/microservice/
COPY packages/authentication-service/package.json packages/authentication-service/yarn.lock packages/authentication-service/tsconfig.build.json /app/packages/authentication-service/
COPY packages/functions-service/package.json packages/functions-service/yarn.lock packages/functions-service/tsconfig.build.json /app/packages/functions-service/
COPY packages/hasura-apollo-client/package.json packages/hasura-apollo-client/yarn.lock packages/hasura-apollo-client/tsconfig.build.json /app/packages/hasura-apollo-client/
COPY packages/hasura-node-client/package.json packages/hasura-node-client/yarn.lock packages/hasura-node-client/tsconfig.build.json /app/packages/hasura-node-client/
COPY packages/platyplus/package.json packages/platyplus/yarn.lock /app/packages/platyplus/
COPY packages/vuex-apollo-offline/package.json packages/vuex-apollo-offline/yarn.lock packages/vuex-apollo-offline/tsconfig.build.json /app/packages/vuex-apollo-offline/

# Install dependencies
RUN lerna bootstrap --ignore-scripts

# Copy source
COPY packages /app/packages

