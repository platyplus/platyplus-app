FROM hasura/graphql-engine:v1.0.0-alpha37

COPY docker-entrypoint.sh /bin/

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["graphql-engine", "serve"]
