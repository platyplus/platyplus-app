#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
if [[ ! `git diff-index --quiet HEAD docs` ]]; then
    # build the docs
    npm run docs:build
    cd docs/.vuepress/dist
    git init
    git add -A
    git commit -m 'deploy'
    git push -f https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
fi

cd -
