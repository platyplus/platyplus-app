FROM hasura/graphql-engine:v1.0.0-alpha37.cli-migrations

COPY docker-entrypoint.sh /bin/load-env-and-migrate.sh
ENTRYPOINT ["load-env-and-migrate.sh"]

COPY migrations /opt/hasura-migrations
ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/opt/hasura-migrations
HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-8080}/v1/version || exit 1

CMD ["graphql-engine", "serve"]
