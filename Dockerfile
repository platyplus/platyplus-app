FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
COPY packages/authentication-service/package.json packages/authentication-service/yarn.lock packages/authentication-service/tsconfig.build.json /app/packages/authentication-service/
COPY packages/functions/package.json packages/functions/yarn.lock packages/functions/tsconfig.build.json /app/packages/functions/
COPY packages/hasura-apollo-client/package.json packages/hasura-apollo-client/yarn.lock packages/hasura-apollo-client/tsconfig.build.json /app/packages/hasura-apollo-client/
COPY packages/hasura-node-client/package.json packages/hasura-node-client/yarn.lock packages/hasura-node-client/tsconfig.build.json /app/packages/hasura-node-client/
COPY packages/platyplus/package.json packages/platyplus/yarn.lock /app/packages/platyplus/
COPY packages/vuex-apollo-offline/package.json packages/vuex-apollo-offline/yarn.lock packages/vuex-apollo-offline/tsconfig.build.json /app/packages/vuex-apollo-offline/

# Install dependencies
RUN yarn install --ignore-scripts

# Copy source
COPY packages /app/packages

RUN lerna bootstrap --ignore-scripts && lerna link
