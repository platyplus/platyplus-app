FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG GRAPHQL_ENGINE_URL=http://graphql-engine:8080
ENV GRAPHQL_ENGINE_URL $GRAPHQL_ENGINE_URL

RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
COPY backend/authentication-service/package.json yarn.lock backend/authentication-service/tsconfig.build.json /app/backend/authentication-service/
COPY packages/microservice/package.json packages/microservice/yarn.lock packages/microservice/tsconfig.build.json /app/packages/microservice/
COPY packages/errors/package.json packages/errors/yarn.lock packages/errors/tsconfig.build.json /app/packages/errors/
COPY packages/hasura-node-client/package.json packages/hasura-node-client/yarn.lock packages/hasura-node-client/tsconfig.build.json /app/packages/hasura-node-client/

# Install dependencies without build
RUN lerna bootstrap --ignore-scripts

# Copy source
COPY backend/authentication-service /app/backend/authentication-service
COPY packages/microservice /app/packages/microservice
COPY packages/errors /app/packages/errors
COPY packages/hasura-node-client /app/packages/hasura-node-client

USER node
CMD ["node", "backend/authentication-service/lib/index.js"]