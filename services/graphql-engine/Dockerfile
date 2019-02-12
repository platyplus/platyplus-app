FROM hasura/graphql-engine:v1.0.0-alpha37

HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-3000}/v1/version || exit 1

COPY docker-entrypoint.sh /bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["graphql-engine", "serve"]
