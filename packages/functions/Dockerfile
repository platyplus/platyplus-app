FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json /app/

# Packages
COPY packages/functions-service/package.json yarn.lock /app/packages/functions-service/
COPY packages/microserver/package.json yarn.lock /app/packages/microserver/
COPY packages/hasura-node-client/package.json yarn.lock /app/packages/hasura-node-client/

# Install dependencies
RUN yarn
RUN lerna bootstrap

# Copy source
COPY packages/functions-service /app/packages/functions-service
COPY packages/microserver /app/packages/microserver
COPY packages/hasura-node-client /app/packages/hasura-node-client

# TODO Build packages? Multistage docker then?
#RUN lerna run build

# TODO: algo in the template?
ARG ALGORITHM=RS256
ENV ALGORITHM $ALGORITHM

USER node
CMD ["node", "packages/functions-service/lib/index.js"]