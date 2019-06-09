FROM platyplus/service-template

# TODO: how to put the arg in the template
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# TODO: algo in the template?
ARG ALGORITHM=RS256
ENV ALGORITHM $ALGORITHM

COPY . /opt/app
RUN install.sh
# TODO: USER in the template?
USER node
# TODO: CMD in the template?
CMD [ "node", "/opt/start" ]
