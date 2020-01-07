# * Not using node-alpine as it does not support glibc, that is required by pg-query-parser. Not using node-slim either as pg-query-parser requires node-gyp to be built, therefore python etc
FROM node:12
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
COPY backend/metadata-service/package.json yarn.lock /app/backend/metadata-service/
COPY packages/microservice/package.json yarn.lock /app/packages/microservice/

# Install dependencies without build
RUN lerna bootstrap --ignore-scripts

# ! Required by node-pg-query-native
# TODO test if it is absolutely required. If not, test with node-slim
RUN yarn global add node-gyp && cd node_modules/pg-query-native && node-gyp rebuild

# Copy source
COPY backend/metadata-service /app/backend/metadata-service
COPY packages/microservice /app/packages/microservice

USER node
CMD ["node", "backend/metadata-service/lib/index.js"]