FROM platyplus/service-template

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENV ALGORITHM $ALGORITHM

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force

WORKDIR /opt/app
COPY . /opt/app

USER node

CMD [ "node", "/opt/start" ]
