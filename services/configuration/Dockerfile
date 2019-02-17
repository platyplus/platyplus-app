FROM alpine:3.9
ARG ROOT_NODE=false
ENV ROOT_NODE $ROOT_NODE
ARG PORT=3000
ENV PORT $PORT
EXPOSE 22 $3000

# if ROOT_NODE 
## start git-sync
# else
## start sshd
## upsert user from PUBLIC/PRIVATE KEY
