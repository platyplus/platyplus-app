FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json /app/

# Packages
COPY packages/platyplus-service/package.json packages/platyplus-service/yarn.lock packages/platyplus-service/tsconfig.build.json /app/packages/platyplus-service/
COPY packages/microservice/package.json packages/microservice/yarn.lock packages/microservice/tsconfig.build.json /app/microservice/platyplus/
COPY packages/platyplus/package.json packages/platyplus/yarn.lock /app/packages/platyplus/
COPY packages/hasura-apollo-client/package.json packages/hasura-apollo-client/yarn.lock packages/hasura-apollo-client/tsconfig.build.json /app/packages/hasura-apollo-client/
COPY packages/vuex-apollo-offline/package.json packages/vuex-apollo-offline/yarn.lock packages/vuex-apollo-offline/tsconfig.build.json /app/packages/vuex-apollo-offline/

# Install dependencies
RUN yarn
RUN lerna bootstrap

# Copy source
COPY packages/platyplus-service /app/packages/platyplus-service
COPY packages/microservice /app/microservice/platyplus
COPY packages/platyplus /app/packages/platyplus
COPY packages/hasura-apollo-client /app/packages/hasura-apollo-client
COPY packages/vuex-apollo-offline /app/packages/vuex-apollo-offline

# TODO Build packages? Multistage docker then?
#RUN lerna run build

USER node
CMD ["node", "packages/platyplus-service/lib/index.js"]