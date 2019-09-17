FROM node:12-alpine
WORKDIR /opt
COPY . ./
RUN yarn global add lerna
RUN lerna bootstrap && lerna run build
