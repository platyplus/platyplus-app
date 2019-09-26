FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG GRAPHQL_ENGINE_PUBLIC_URL=https://grapqhl.platyplus.io
ENV GRAPHQL_ENGINE_PUBLIC_URL $GRAPHQL_ENGINE_PUBLIC_URL
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
COPY backend/platyplus-service/package.json backend/platyplus-service/yarn.lock backend/platyplus-service/tsconfig.build.json /app/backend/platyplus-service/
COPY frontend/platyplus/package.json frontend/platyplus/yarn.lock /app/frontend/platyplus/
COPY packages/microservice/package.json packages/microservice/yarn.lock packages/microservice/tsconfig.build.json /app/packages/microservice/platyplus/
COPY packages/hasura-apollo-client/package.json packages/hasura-apollo-client/yarn.lock packages/hasura-apollo-client/tsconfig.build.json /app/packages/hasura-apollo-client/
COPY packages/vuex-apollo-offline/package.json packages/vuex-apollo-offline/yarn.lock packages/vuex-apollo-offline/tsconfig.build.json /app/packages/vuex-apollo-offline/

# Install dependencies without build
RUN lerna bootstrap --ignore-scripts

# Copy source
COPY backend/platyplus-service /app/backend/platyplus-service
COPY frontend/platyplus /app/frontend/platyplus
COPY packages/microservice /app/packages/microservice/platyplus
COPY packages/hasura-apollo-client /app/packages/hasura-apollo-client
COPY packages/vuex-apollo-offline /app/packages/vuex-apollo-offline

USER node
CMD ["node", "backend/platyplus-service/lib/index.js"]