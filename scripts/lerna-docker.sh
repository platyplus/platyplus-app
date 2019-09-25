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
# Removes the first character('@') of the scoped package name
IMAGE_NAME=$(echo $LERNA_PACKAGE_NAME | cut -c 2-)
if [ -n "IMG_PREFIX" ]; then
    IMAGE_NAME="$IMG_PREFIX/$IMAGE_NAME"
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
        echo "docker build -t $IMAGE_NAME:$TAG -f $DOCKERFILE_NAME $LERNA_ROOT_PATH"
        if [ -n "$LATEST" ]; then
            # TODO Latest present. Adding a 'latest' tag
            echo "docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest"
        fi
        ;;
    "push")
        echo "docker push $IMAGE_NAME:$TAG"
        ;;
    *)
        echo "Command not found."
        echo $0
        echo $1
        env
        ;;
esac
