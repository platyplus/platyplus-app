FROM hasura/graphql-engine:v1.0.0-beta.6.cli-migrations

# Use the local console assets so console can work while offline
ARG HASURA_GRAPHQL_CONSOLE_ASSETS_DIR=/srv/console-assets
ENV HASURA_GRAPHQL_CONSOLE_ASSETS_DIR $HASURA_GRAPHQL_CONSOLE_ASSETS_DIR

ARG AUTH_ALGORITHM=RS256
ENV AUTH_ALGORITHM $AUTH_ALGORITHM

# Disable the metrics sent to Hasura
ARG HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY $HASURA_GRAPHQL_ENABLE_TELEMETRY

# The console is not enabled as we keep track of the changes (esp. migration files) in running the console from the CLI
# See /scripts/hasura-dev.sh
ARG HASURA_GRAPHQL_ENABLE_CONSOLE=false
ENV HASURA_GRAPHQL_ENABLE_CONSOLE $HASURA_GRAPHQL_ENABLE_CONSOLE

ARG HASURA_GRAPHQL_SERVER_PORT=3000
ENV HASURA_GRAPHQL_SERVER_PORT $HASURA_GRAPHQL_SERVER_PORT

ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET

ARG AUTHENTICATION_URL=http://authentication:3000
ENV AUTHENTICATION_URL $AUTHENTICATION_URL

ARG FUNCTIONS_URL=http://functions:3000
ENV FUNCTIONS_URL $FUNCTIONS_URL

ARG HASURA_GRAPHQL_JWT_SECRET="{ \"type\": \"RS256\", \"jwk_url\": \"$AUTHENTICATION_URL/jwks\"}"
ENV HASURA_GRAPHQL_JWT_SECRET $HASURA_GRAPHQL_JWT_SECRET

ARG POSTGRES_URL=postgres://postgres:@postgres:5432/postgres
ENV HASURA_GRAPHQL_DATABASE_URL $POSTGRES_URL

ARG HASURA_GRAPHQL_UNAUTHORIZED_ROLE='anonymous'
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE $HASURA_GRAPHQL_UNAUTHORIZED_ROLE

ARG HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=10
ENV HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT $HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT

ENV CLOUDSQL_INSTANCE=''
ENV ENABLE_CLOUDSQL_PROXY="false"

# * Required by the remove schemas
ENV EVENTS_URL="${FUNCTIONS_URL}/events"
ENV AUTH_URL="${AUTHENTICATION_URL}/graphql"

COPY backend/graphql-engine/migrations /opt/hasura-migrations
COPY backend/graphql-engine/load-env-and-migrate.sh /bin/

RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /bin/cloud_sql_proxy
RUN chmod +x /bin/cloud_sql_proxy

ENTRYPOINT ["load-env-and-migrate.sh"]

HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT:-8080}/healthz || exit 1

CMD ["graphql-engine", "serve"]
