FROM hasura/graphql-engine:v1.0.0-alpha38.cli-migrations

ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET
ENV AUTH_ALGORITHM $AUTH_ALGORITHM
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY false
ENV HASURA_GRAPHQL_ENABLE_CONSOLE false
ENV HASURA_GRAPHQL_SERVER_PORT $HASURA_GRAPHQL_SERVER_PORT
ENV HASURA_GRAPHQL_MIGRATIONS_DIR $HASURA_GRAPHQL_MIGRATIONS_DIR

COPY migrations /opt/hasura-migrations
COPY load-env-and-migrate.sh /bin/load-env-and-migrate.sh
ENTRYPOINT ["load-env-and-migrate.sh"]

HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-8080}/v1/version || exit 1

CMD ["graphql-engine", "serve"]
