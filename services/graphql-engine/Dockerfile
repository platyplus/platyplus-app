FROM hasura/graphql-engine:v1.0.0-alpha37

# set an env var to let the cli know that
# it is running in server environment
# ENV HASURA_GRAPHQL_CLI_ENVIRONMENT=server-on-docker
COPY docker-entrypoint.sh /bin/

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["ENV", ";", "graphql-engine", "serve"]
