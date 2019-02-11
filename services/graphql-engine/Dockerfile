FROM hasura/graphql-engine:v1.0.0-alpha37

# set an env var to let the cli know that
# it is running in server environment
# ENV HASURA_GRAPHQL_CLI_ENVIRONMENT=server-on-docker
COPY docker-entrypoint.sh /bin/
# TODO: custom port
HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8080/v1/version || exit 1
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["graphql-engine", "serve"]
