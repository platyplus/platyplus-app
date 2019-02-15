FROM platyplus/service-template

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENV ALGORITHM $ALGORITHM

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . /opt/app

USER node
RUN echo $NODE_ENV

CMD [ "node", "./bin/www" ]
