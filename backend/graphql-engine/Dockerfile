FROM hasura/graphql-engine:v1.0.0-beta.6.cli-migrations

# Use the local console assets so console can work while offline
ENV HASURA_GRAPHQL_CONSOLE_ASSETS_DIR=/srv/console-assets
ENV AUTH_ALGORITHM=RS256
# Disable the metrics sent to Hasura
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
# The console is not enabled as we keep track of the changes (esp. migration files) in running the console from the CLI
# See /scripts/hasura-dev.sh
ENV HASURA_GRAPHQL_ENABLE_CONSOLE=false
ENV HASURA_GRAPHQL_SERVER_PORT=3000
ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET
ENV AUTHENTICATION_URL=http://authentication:3000
ENV FUNCTIONS_URL=http://functions:3000
ENV HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:@postgres:5432/postgres
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE='anonymous'
ENV HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=10
ENV CLOUDSQL_INSTANCE=''
ENV ENABLE_CLOUDSQL_PROXY="false"

COPY backend/graphql-engine/migrations /opt/hasura-migrations
COPY backend/graphql-engine/load-env-and-migrate.sh /bin/

ADD https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 /bin/cloud_sql_proxy
RUN chmod +x /bin/cloud_sql_proxy

ENTRYPOINT ["load-env-and-migrate.sh"]

HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-8080}/healthz || exit 1

CMD ["graphql-engine", "serve"]
