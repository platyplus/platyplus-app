#!/bin/bash
# * Script to build docker files.
# ! Must be launched from a 'lerna exec' command
DOCKERFILE_NAME="$PWD/Dockerfile"
if [ -n "$DF_SUFFIX" ]; then
    DOCKERFILE_NAME="$DOCKERFILE_NAME-$DF_SUFFIX"
fi
if [ ! -e $DOCKERFILE_NAME ]; then
    exit 0
fi
# Remove the first character ('@') in the package name
PACKAGE_NAME=$(echo $LERNA_PACKAGE_NAME | cut -c 2-)
# Image name = package name without scope
IMAGE_NAME=$(echo $PACKAGE_NAME | cut -d "/" -f 2)
if [ -z "$SCOPE" ]; then
    # Scope = package scope (without the initial first character)
    SCOPE=$(echo $PACKAGE_NAME | cut -d "/" -f 1)
fi
if [ -z "$TAG" ]; then
    # TAG=$(git branch | grep \* | cut -d ' ' -f2) # Branch name
    # No tag. Using the current git commit hash
    TAG=$(git rev-parse --short HEAD)
else
    # Tag exists. Using the package.json version
    TAG=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g') 
fi

case "$1" in
    "build")
        docker build -t $SCOPE/$IMAGE_NAME:$TAG -f $DOCKERFILE_NAME $LERNA_ROOT_PATH
        if [ -n "$LATEST" ]; then
            # TODO Latest present. Adding a 'latest' tag
            docker tag $SCOPE/$IMAGE_NAME:$TAG $SCOPE/$IMAGE_NAME:latest
        fi
        ;;
    "push")
        docker push $SCOPE/$IMAGE_NAME:$TAG
        ;;
    *)
        echo "Command not found $1"
        ;;
esac
