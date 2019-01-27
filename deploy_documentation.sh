#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git add -A
git commit -m 'deploy'
git push -u origin master

cd -