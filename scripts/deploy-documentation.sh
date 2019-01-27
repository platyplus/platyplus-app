#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git add -A
if [[ ! `git diff-index --quiet HEAD` ]]; then
  echo changes
  git commit -m 'deploy'
  git push -f https://plmercereau:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
else
  echo nochanges
fi

cd -
