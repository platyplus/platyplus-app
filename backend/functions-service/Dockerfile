FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json tsconfig.json tsconfig.build.json .eslintrc.js .eslintignore /app/

# Packages
COPY backend/functions-service/package.json yarn.lock /app/backend/functions-service/
COPY packages/microservice/package.json yarn.lock /app/packages/microservice/
COPY packages/hasura-node-client/package.json yarn.lock /app/packages/hasura-node-client/

# Install dependencies without build
RUN lerna bootstrap --ignore-scripts

# Copy source
COPY backend/functions-service /app/backend/functions-service
COPY packages/microservice /app/packages/microservice
COPY packages/hasura-node-client /app/packages/hasura-node-client

# TODO Build packages? Multistage docker then?
RUN lerna run build

# TODO: algo in the template?
ARG ALGORITHM=RS256
ENV ALGORITHM $ALGORITHM

USER node
CMD ["node", "backend/functions-service/lib/index.js"]