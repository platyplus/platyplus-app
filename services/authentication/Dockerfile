FROM platyplus/service-template

ARG ALGORITHM=RS256
ENV ALGORITHM $ALGORITHM

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install --no-optional

WORKDIR /opt/app
COPY . /opt/app

USER node

CMD [ "node", "./bin/www" ]
