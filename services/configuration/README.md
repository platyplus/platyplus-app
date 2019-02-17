# Configuration microservice

- a dedicated directory contains the entire cluster configuration
- a cron-like updates the directory through git-sync
- when there are updates, the http server restarts

## Endpoints

- available through DOMAIN:port
  - only if the server is the cluster orcherstator
  - SSH server
  - user/password/key? How to manage?
  - user only has read-only access
- available through the graphql
  - /graphql
  - syncs with any file change - see [https://nodejs.org/api/fs.html#fs_fs_watchfile_filename_options_listener]
  - queries
  - cluster mutations
    - only if the server is the cluster orchestrator
    - only for admins - or with the hasura secret key (but not ideal to use)
  - server mutations
    - only for admins - or with the hasura secret key (but not ideal to use)
