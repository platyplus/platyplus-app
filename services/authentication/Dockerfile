FROM node:11-alpine
WORKDIR /root/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY server.js .
EXPOSE 8080
CMD yarn run start
#TODO: https://learnk8s.io/blog/smaller-docker-images