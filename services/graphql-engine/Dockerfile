FROM hasura/graphql-engine:v1.0.0-alpha37.cli-migrations

COPY docker-entrypoint.sh /bin/
ENTRYPOINT ["docker-entrypoint.sh"]

COPY migrations .

HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-8080}/v1/version || exit 1

CMD ["graphql-engine", "serve"]
