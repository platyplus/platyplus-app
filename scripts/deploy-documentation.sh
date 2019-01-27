#!/usr/bin/env sh

# abort on errors
set -e

# build the docs
npm run docs:build

# navigate into the build output directory
if [[ ! `git diff-index --quiet HEAD docs/.vuepress/dist` ]]; then
    echo changes
    cd docs/.vuepress/dist
    git init
    git add -A
    git commit -m 'deploy'
    git push -f https://plmercereau:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
else
  echo nochanges
fi

cd -
