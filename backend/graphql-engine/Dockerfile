FROM hasura/graphql-engine:v1.1.0-beta.2.cli-migrations

# * See https://gitlab.com/tactable.io/graphql-next-app/
WORKDIR /hasura

COPY ./backend/graphql-engine/migrations /hasura-migrations
COPY ./backend/graphql-engine/entrypoint.sh ./backend/graphql-engine/migrate.sh ./

# Use the local console assets so console can work while offline
ENV HASURA_GRAPHQL_CONSOLE_ASSETS_DIR=/srv/console-assets
# Disable the metrics sent to Hasura
# TODO use a postgresql password
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_ENABLE_CONSOLE="false"
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup,query-log"
ENV HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT=60
ENV HASURA_GRAPHQL_SERVER_PORT=8080
ENV HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:@postgres:5432/postgres
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE='anonymous'

# Platyplus-related environment variables
ENV AUTHENTICATION_URL=http://authentication:3000
ENV FUNCTIONS_URL=http://functions:3000
ENV METADATA_URL=http://metadata:3000
ENV AUTH_ALGORITHM=RS256

# ENV CLOUDSQL_INSTANCE=''
# ENV ENABLE_CLOUDSQL_PROXY="true"
ENV ENABLE_MIGRATIONS="true"
ENV ENABLE_CONSOLE="false"

# download the cloudsql proxy binary
# ADD https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 /bin/cloud_sql_proxy
# RUN chmod +x /bin/cloud_sql_proxy ./entrypoint.sh ./migrate.sh
RUN chmod +x ./entrypoint.sh ./migrate.sh

ENTRYPOINT ["./entrypoint.sh"]

# HEALTHCHECK  --interval=30s --timeout=3s CMD wget --quiet --spider http://localhost:${HASURA_GRAPHQL_SERVER_PORT}/healthz || exit 1

CMD /bin/env
